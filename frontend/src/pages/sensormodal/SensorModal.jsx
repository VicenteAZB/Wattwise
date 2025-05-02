import { useNavigate } from 'react-router-dom';
import './SensorModal.css';

export default function SensorModal({ id, sensor, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="sensor-modal-overlay">
      <div className="sensor-modal-content">
        <h3>{sensor.tipo}</h3>
        <p><strong>Valor actual:</strong> {sensor.valor} {sensor.unidad}</p>

        {/* Opciones del modal */}
        <div className="sensor-modal-options">
          <button 
            onClick={() => navigate(`/oficina/${id}/sensor/${sensor.sensor}/graficos/tiempo-real`)}
          >
            📈 Cambiar gráfico tiempo real
          </button>
          <button 
            onClick={() => navigate(`/oficina/${id}/sensor/${sensor.sensor}/historico`)}
          >
            📅 Consultar datos históricos
          </button>
          <button 
            onClick={() => navigate(`/oficina/${id}/sensor/${sensor.sensor}/dispositivos`)}
          >
            🖥️ Controlar dispositivos vinculados
          </button>
          <button 
            onClick={() => navigate(`/oficina/${id}/sensor/${sensor.sensor}/alertas`)}
          >
            📢 Gestionar alertas programadas
          </button>
        </div>

        {/* Cerrar modal */}
        <button onClick={onClose} className="close-btn">❌ Cerrar</button>
      </div>
    </div>
  );
}
