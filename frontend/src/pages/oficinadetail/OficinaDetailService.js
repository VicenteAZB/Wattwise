import mqtt from 'mqtt';

export function conectarBrokerMQTT(id, setSensores, setDatosGrafico) {
  const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

  client.on('connect', () => {
    console.log('Conectado al broker MQTT');
    client.subscribe('wattwise/test/#');
  });

  client.on('message', (topic, message) => {
    try {
      const datos = JSON.parse(message.toString());
      const { oficina, sensor: nombreSensor, valor, unidad, tiempo_real } = datos;

      if (oficina !== id) return;

      // Actualizar lista de sensores
      setSensores(prevSensores => {
        const existe = prevSensores.some(s => s.sensor === nombreSensor);
        return existe
          ? prevSensores.map(s =>
              s.sensor === nombreSensor ? { ...s, valor } : s
            )
          : [...prevSensores, { sensor: nombreSensor, valor, unidad, tiempo_real }];
      });

      // Actualizar datos del gráfico de ese sensor
      setDatosGrafico(prev => {
        const prevSensorDatos = prev[nombreSensor] || [];
        const nuevos = [...prevSensorDatos, {
          [nombreSensor]: valor,
          time: new Date().toLocaleTimeString(),
        }];

        // Mantener últimos 20 valores
        if (nuevos.length > 4) nuevos.shift();

        return {
          ...prev,
          [nombreSensor]: nuevos,
        };
      });

    } catch (error) {
      console.error('Error al procesar mensaje MQTT:', error);
    }
  });

  return client;
}
