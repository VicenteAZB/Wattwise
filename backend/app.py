import os
import uuid
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash

# Cargar variables desde .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY")
DB_NAME = os.getenv("DB_NAME")
USUARIOS = os.getenv("USUARIOS")
OFICINAS = os.getenv("OFICINAS")
SENSORES = os.getenv("SENSORES")
# Conectar a MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
usuarios_col = db[USUARIOS]
oficinas_col = db[OFICINAS]  # colección de oficinas
sensores_col = db[SENSORES]
# Inicializar la aplicación Flask
app = Flask(__name__)
CORS(app)  # Para permitir peticiones desde el frontend

# Verificación del token
def verificar_token(func):
    def wrapper(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'error': 'Token faltante'}), 401
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            g.user = payload  # Almacenar los datos del usuario decodificados en g
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

# Endpoint de login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    usuario = data.get('usuario')
    password = data.get('password')

    # Buscar usuario en la base de datos
    usuario_db = usuarios_col.find_one({'usuario': usuario})
    if usuario_db and check_password_hash(usuario_db['password'], password):
        # Crear token con duración de 1 hora
        payload = {
            'nombre': usuario_db['nombre'],
            'usuario': usuario_db['usuario'],
            'exp': datetime.utcnow() + timedelta(hours=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify(token), 200

    return jsonify({'error': 'Credenciales incorrectas'}), 401

@app.route('/perfil', methods=['GET'])
@verificar_token  # Esta ruta está protegida por el decorador verificar_token
def perfil():
    # Obtener el usuario decodificado del token
    usuario_data = g.user
    
    # Buscar el usuario en la base de datos usando el nombre de usuario (usuario_data['usuario'])
    usuario = usuarios_col.find_one({'usuario': usuario_data['usuario']})
    
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    # Construir la respuesta
    return jsonify({
        'usuario': usuario['usuario'],
        'nombre': usuario['nombre'],
        'tipo_usuario': usuario['tipo_usuario'],
        'oficinas': usuario['oficinas']
    }), 200

@app.route('/oficinas', methods=['GET'])
@verificar_token
def listar_oficinas_usuario():
    # g.user trae el payload decodificado del JWT
    usuario_data = g.user

    # Buscar al usuario en la colección 'usuarios'
    usuario_db = usuarios_col.find_one({'usuario': usuario_data['usuario']})
    if not usuario_db:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    # Devolver únicamente el array 'oficinas' del documento
    oficinas = usuario_db.get('oficinas', [])
    return jsonify({'oficinas': oficinas}), 200

@app.route('/oficina/<oficina>/sensor/<nombre_sensor>/grafico', methods=['GET'])
@verificar_token
def obtener_grafico_sensor(oficina, nombre_sensor):
    # Buscar el sensor en la base de datos
    sensor = sensores_col.find_one({'oficina': oficina, 'nombre_sensor': nombre_sensor})

    if not sensor:
        return jsonify({'error': 'Sensor no encontrado'}), 404

    # Devolver los campos 'tiempo_real' o 'historico' si existen
    grafico_seleccionado = {
        'tiempo_real': sensor.get('tiempo_real'),
        'historico': sensor.get('historico')
    }

    return jsonify(grafico_seleccionado), 200


@app.route('/oficina/<oficina>/sensor/<nombre_sensor>/cambiargrafico', methods=['PATCH'])
@verificar_token
def actualizar_grafico_sensor(oficina, nombre_sensor):
    data = request.get_json()
    update_fields = {}

    if 'tiempo_real' in data:
        update_fields['tiempo_real'] = data['tiempo_real']
    if 'historico' in data:
        update_fields['historico'] = data['historico']

    if not update_fields:
        return jsonify({'error': 'No se enviaron campos válidos'}), 400

    result = sensores_col.update_one(
        {'oficina': oficina, 'nombre_sensor': nombre_sensor},
        {'$set': update_fields}
    )

    if result.matched_count == 0:
        return jsonify({'error': 'Sensor no encontrado'}), 404

    return jsonify({'mensaje': 'Gráfico actualizado correctamente'}), 200


@app.route('/datoshistoricos', methods=['GET'])
@verificar_token
def obtener_datos_historicos():
    tipo = request.args.get('tipo')
    oficina = request.args.get('oficina')
    fecha_desde = request.args.get('fechaDesde')
    fecha_hasta = request.args.get('fechaHasta')

    # Validación básica
    if not all([tipo, oficina, fecha_desde, fecha_hasta]):
        return jsonify({"error": "Faltan parámetros"}), 400

    # Convertir fechas a objetos datetime
    try:
        fecha_desde = datetime.strptime(fecha_desde, "%Y-%m-%d %H:%M:%S")
        fecha_hasta = datetime.strptime(fecha_hasta, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return jsonify({"error": "Formato de fecha incorrecto"}), 400

    # Buscar el sensor correspondiente
    sensor = sensores_col.find_one({"nombre_sensor": tipo, "oficina": oficina})

    if not sensor:
        return jsonify({"error": "Sensor no encontrado"}), 404

    # Filtrar las mediciones en el rango de fechas
    mediciones = sensor.get("mediciones", [])
    datos_filtrados = [
        m for m in mediciones
        if fecha_desde <= datetime.strptime(m['timestamp'], '%Y-%m-%d %H:%M:%S') <= fecha_hasta
    ]

    unidad = sensor.get("unidad_medida")
    tipo_grafico = sensor.get("historico", "tabla")  # Valor por defecto si no está

    return jsonify({
        "datos": datos_filtrados,
        "unidad": unidad,
        "tipoGrafico": tipo_grafico
    })

@app.route('/crearusuario', methods=['POST'])
def crear_usuario():
    data = request.get_json()
    nombre = data.get('nombre')
    usuario = data.get('usuario')
    contraseña = data.get('password')
    tipo_usuario = data.get('tipo_usuario')
    oficinas = data.get('oficinas', [])

    # 1. Validar que venga al menos un nombre de usuario y contraseña
    if not nombre or not usuario or not contraseña:
        return jsonify({'error': 'Los campos nombre, usuario y password son obligatorios'}), 400

    # 2. Verificar que todas las oficinas existan
    existentes = list(oficinas_col.find(
        {'nombre': {'$in': oficinas}},
        {'nombre': 1, '_id': 0}
    ))
    nombres_existentes = {o['nombre'] for o in existentes}
    faltantes = [n for n in oficinas if n not in nombres_existentes]
    if faltantes:
        return jsonify({
            'error': 'Las siguientes oficinas no existen',
            'oficinas_faltantes': faltantes
        }), 400

    # 3. Hashear la contraseña
    contraseña_hasheada = generate_password_hash(contraseña, method='pbkdf2:sha256')

    # 4. Crear el documento del nuevo usuario
    nuevo_usuario = {
        "nombre": nombre,
        "usuario": usuario,
        "password": contraseña_hasheada,
        "tipo_usuario": tipo_usuario,
        "oficinas": oficinas
    }

    # 5. Insertar el usuario en la base de datos
    usuarios_col.insert_one(nuevo_usuario)

    return jsonify({"mensaje": "Usuario creado exitosamente"}), 201


@app.route('/crearoficina', methods=['POST'])
def crear_oficina():
    data = request.get_json()
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre de la oficina es obligatorio'}), 400

    # Verificar si ya existe
    if oficinas_col.find_one({'nombre': nombre}):
        return jsonify({'error': 'La oficina ya existe'}), 409

    oficina_doc = {
        'nombre': nombre,
    }
    oficinas_col.insert_one(oficina_doc)
    return jsonify({'mensaje': 'Oficina creada exitosamente'}), 201

@app.route('/crearsensor', methods=['POST'])
def crear_sensor():
    data = request.get_json()
    nombre = data.get('nombre_sensor')
    tipo = data.get('tipo')
    unidad = data.get('unidad_medida')
    oficina = data.get('oficina')

    # 1. Validación de campos obligatorios
    if not all([nombre, tipo, unidad, oficina]):
        return jsonify({
            'error': 'Faltan campos obligatorios: nombre_sensor, tipo, unidad_medida, oficina'
        }), 400

    # 2. Verificar que la oficina exista
    if not oficinas_col.find_one({'nombre': oficina}):
        return jsonify({'error': f'La oficina "{oficina}" no existe'}), 400

    # 3. Verificar que no haya ya un sensor con el mismo nombre en esa oficina
    if sensores_col.find_one({'nombre_sensor': nombre, 'oficina': oficina}):
        return jsonify({
            'error': f'El sensor "{nombre}" ya existe en la oficina "{oficina}"'
        }), 409

    # 4. Construir el documento del sensor
    sensor_doc = {
        'nombre_sensor': nombre,
        'tipo': tipo,
        'unidad_medida': unidad,
        'oficina': oficina,
        'tiempo_real': 'tarjeta',
        'historico': 'tabla',
        'mediciones': [],  
        'alertas': []      
    }

    # 5. Insertar en MongoDB
    result = sensores_col.insert_one(sensor_doc)

    # 6. Leer de vuelta, convertir _id a string y limpiar campos
    sensor_db = sensores_col.find_one({'_id': result.inserted_id}, {'_id': 1, 'nombre_sensor':1, 'tipo':1, 'unidad_medida':1, 'oficina':1, 'tiempo_real':1, 'historico':1,'mediciones':1, 'alertas':1})
    sensor_db['id'] = str(sensor_db['_id'])
    del sensor_db['_id']

    return jsonify({
        'mensaje': 'Sensor creado exitosamente',
        'sensor': sensor_db
    }), 201

# Iniciar la aplicación Flask
if __name__ == '__main__':
    app.run(debug=True)