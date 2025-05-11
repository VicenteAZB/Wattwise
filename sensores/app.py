from flask import Flask
import threading
import time
import json
import os
import random
from pymongo import MongoClient
import paho.mqtt.client as mqtt
from dotenv import load_dotenv

app = Flask(__name__)

# Diccionario global para mantener valores actuales por sensor
valores_actuales = {}

def start_simulador():
    load_dotenv()

    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DB_NAME")
    SENSORES = os.getenv("SENSORES")

    BROKER = 'test.mosquitto.org'
    PORT = 1883

    mongo_client = MongoClient(MONGO_URI)
    db = mongo_client[DB_NAME]
    coleccion = db[SENSORES]

    client = mqtt.Client()

    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("✅ Conectado a test.mosquitto.org")
        else:
            print("❌ Error al conectar, código:", rc)

    client.on_connect = on_connect
    client.connect(BROKER, PORT, 60)
    client.loop_start()

    # Simulación realista de valores
    def simular_valor(sensor_id, sensor_tipo):
        if sensor_id not in valores_actuales:
            if sensor_tipo == "Temperatura":
                valores_actuales[sensor_id] = round(random.uniform(22.0, 26.0), 2)
            elif sensor_tipo == "Humedad":
                valores_actuales[sensor_id] = round(random.uniform(45.0, 55.0), 1)
            elif sensor_tipo == "Corriente":
                valores_actuales[sensor_id] = round(random.uniform(1.0, 1.5), 2)
            else:
                valores_actuales[sensor_id] = round(random.uniform(0.0, 100.0), 2)

        if sensor_tipo == "Temperatura":
            delta = random.uniform(-0.2, 0.2)
        elif sensor_tipo == "Humedad":
            delta = random.uniform(-0.5, 0.5)
        elif sensor_tipo == "Corriente":
            delta = random.uniform(-0.1, 0.1)
        else:
            delta = random.uniform(-1, 1)

        nuevo_valor = valores_actuales[sensor_id] + delta

        if sensor_tipo == "Temperatura":
            nuevo_valor = min(max(nuevo_valor, 18.0), 30.0)
        elif sensor_tipo == "Humedad":
            nuevo_valor = min(max(nuevo_valor, 30.0), 70.0)
        elif sensor_tipo == "Corriente":
            nuevo_valor = min(max(nuevo_valor, 0.2), 2.5)
        else:
            nuevo_valor = min(max(nuevo_valor, 0.0), 100.0)

        valores_actuales[sensor_id] = round(nuevo_valor, 2 if sensor_tipo != "Humedad" else 1)
        return valores_actuales[sensor_id]

    def evaluar_alertas(sensor, valor_actual):
        alertas = sensor.get("alertas", [])
        dispositivos = sensor.get("dispositivos", [])
        actualizados = False

        for alerta in alertas:
            operador = alerta["operador"]
            valor_ref = alerta["valorReferencia"]
            accion = alerta["accion"]
            dispositivo_nombre = alerta["dispositivo"]

            if (
                (operador == ">" and valor_actual > valor_ref) or
                (operador == "<" and valor_actual < valor_ref) or
                (operador == ">=" and valor_actual >= valor_ref) or
                (operador == "<=" and valor_actual <= valor_ref) or
                (operador == "=" and valor_actual == valor_ref)
            ):
                print(f"⚠️ Alerta activada: {accion} {dispositivo_nombre}")
                for d in dispositivos:
                    if d["nombre"] == dispositivo_nombre:
                        nuevo_estado = 1 if accion.lower() == "encender" else 0
                        if d["estado"] != nuevo_estado:
                            d["estado"] = nuevo_estado
                            actualizados = True

        if actualizados:
            coleccion.update_one(
                {"_id": sensor["_id"]},
                {"$set": {"dispositivos": dispositivos}}
            )
            print(f"🔄 Estado de dispositivos actualizado en MongoDB para {sensor.get('nombre_sensor')}")

    ultimo_guardado = time.time()

    while True:
        sensores = coleccion.find()
        ahora = time.time()

        for sensor in sensores:
            sensor_id = str(sensor.get("_id"))
            oficina = sensor.get("oficina", "oficina_desconocida")
            nombre = sensor.get("nombre_sensor", "sensor_desconocido")
            unidad = sensor.get("unidad_medida", "")
            tipo_sensor = sensor.get("tipo", "corriente")
            tiempo_real = sensor.get("tiempo_real", "tarjeta")
            valor_simulado = simular_valor(sensor_id, tipo_sensor)

            mensaje = {
                "oficina": oficina,
                "sensor": nombre,
                "tipo": tipo_sensor,
                "unidad": unidad,
                "tiempo_real": tiempo_real,
                "valor": valor_simulado,
                "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
            }

            topic = f"wattwise/test/{oficina}/{nombre}"
            client.publish(topic, json.dumps(mensaje))
            print(f"📤 Enviado a topic {topic}: {mensaje}")

            evaluar_alertas(sensor, valor_simulado)

            if ahora - ultimo_guardado >= 3600:
                mensaje_mongo = {
                    "valor": valor_simulado,
                    "unidad": unidad,
                    "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
                }

                coleccion.update_one(
                    {"nombre_sensor": nombre, "oficina": oficina},
                    {"$push": {"mediciones": mensaje_mongo}}
                )
                print(f"📥 Guardado en MongoDB para {nombre}: {mensaje_mongo}")

        if ahora - ultimo_guardado >= 3600:
            ultimo_guardado = ahora

        time.sleep(2)

threading.Thread(target=start_simulador, daemon=True).start()

@app.route("/")
def home():
    return "Simulador activo", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
