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

    def simular_valor(sensor_tipo):
        if sensor_tipo == "Temperatura":
            return round(random.uniform(18.0, 30.0), 2)
        elif sensor_tipo == "Humedad":
            return round(random.uniform(30.0, 70.0), 1)
        elif sensor_tipo == "Corriente":
            return round(random.uniform(0.2, 2.5), 2)

    ultimo_guardado = time.time()

    while True:
        sensores = coleccion.find()
        ahora = time.time()

        for sensor in sensores:
            oficina = sensor.get("oficina", "oficina_desconocida")
            nombre = sensor.get("nombre_sensor", "sensor_desconocido")
            unidad = sensor.get("unidad_medida", "")
            tipo_sensor = sensor.get("tipo", "corriente")
            tiempo_real = sensor.get("tiempo_real", "tarjeta")
            valor_simulado = simular_valor(tipo_sensor)

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

        time.sleep(1)

# Ejecutar el simulador en un hilo aparte
threading.Thread(target=start_simulador, daemon=True).start()

@app.route('/')
def home():
    return "🚀 Simulador de sensores ejecutándose en segundo plano."
