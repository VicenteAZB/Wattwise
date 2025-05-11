// src/pages/DispositivosSensor.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './DispositivosSensor.css';
import {
  fetchDispositivos,
  toggleEstadoDispositivo,
} from './DispositivosSensorService';

export default function DispositivosSensor() {
  const { tipo, oficinaId } = useParams();
  const navigate = useNavigate();
  const [dispositivos, setDispositivos] = useState([]);

  useEffect(() => {
    fetchDispositivos(oficinaId, tipo, setDispositivos);
  }, [oficinaId, tipo]);

  return (
    <div className="dispositivos-contenedor">
      <button onClick={() => navigate(-1)} className="btn-volver">
        🔙 Volver
      </button>
      <h2>Dispositivos vinculados al sensor: {tipo}</h2>
      <p>
        <strong>Oficina:</strong> {oficinaId}
      </p>

      <div className="dispositivos-listado">
        {dispositivos.map(({ nombre, estado }) => (
          <div key={nombre} className="dispositivo-card">
            <h4>{nombre}</h4>
            <p>
              Estado: <strong>{estado === 1 ? 'Encendido' : 'Apagado'}</strong>
            </p>
            <button
              onClick={() =>
                toggleEstadoDispositivo(nombre, dispositivos, setDispositivos, oficinaId, tipo)
              }
            >
              {estado === 1 ? 'Apagar' : 'Encender'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
