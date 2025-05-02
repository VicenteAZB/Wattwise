import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SensorModal from '../sensormodal/SensorModal';
import GraficosTiempoReal from './GraficosTiempoReal';
import { conectarBrokerMQTT } from './OficinaDetailService';
import './OficinaDetail.css';

export default function OficinaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sensores, setSensores] = useState([]);
  const [sensorSeleccionado, setSensorSeleccionado] = useState(null);
  const [datosGrafico, setDatosGrafico] = useState({});
  const [isLoading, setIsLoading] = useState(true); // nuevo estado de carga

  useEffect(() => {
    const client = conectarBrokerMQTT(id, (nuevosSensores) => {
      setSensores(nuevosSensores);
      if (nuevosSensores.length > 0) setIsLoading(false); // desactiva carga
    }, setDatosGrafico);

    return () => {
      client.end();
    };
  }, [id]);

  if (!id) {
    return <div className="container"><h2>Oficina no encontrada</h2></div>;
  }

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn-volver">
        🔙 Volver
      </button>
      <h2>{id}</h2>
      <h3>Datos Sensores Tiempo Real:</h3>

      {isLoading ? (
        <div className="cargando">⏳ Esperando datos de los sensores</div>
      ) : (
        <div className="sensores-grid">
          {sensores.map((sensor, index) => (
            <div
              key={index}
              className="sensor-card"
              onClick={() => setSensorSeleccionado(sensor)}
            >
              <h4>{sensor.sensor}</h4>
              {sensor.tiempo_real === 'tarjeta' || !sensor.tiempo_real ? (
                <p>
                  <strong>Valor:</strong> {sensor.valor} {sensor.unidad}
                </p>
              ) : (
                <GraficosTiempoReal key={sensor.sensor} sensor={sensor} datosGrafico={datosGrafico[sensor.sensor] || []}/>

              )}
            </div>
          ))}
        </div>
      )}

      {sensorSeleccionado && (
        <SensorModal
          id={id}
          sensor={sensorSeleccionado}
          onClose={() => setSensorSeleccionado(null)}
        />
      )}
    </div>
  );
}
