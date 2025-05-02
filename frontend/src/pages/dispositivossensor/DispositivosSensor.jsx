import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './DispositivosSensor.css';

export default function DispositivosSensor() {
  const { tipo, oficinaId } = useParams();
  const navigate = useNavigate();

  const dispositivosPorTipo = {
    'Temperatura': ['Aire Acondicionado', 'Ventilador'],
    'Energía': ['UPS', 'Panel Solar'],
    'Humedad': ['Extractor', 'Calefactor']
  };

  const dispositivos = dispositivosPorTipo[tipo] || ['Dispositivo A', 'Dispositivo B'];

  const obtenerEstadosDesdeStorage = () => {
    const estadosGuardados = localStorage.getItem(`${oficinaId}-${tipo}-dispositivos`);
    if (estadosGuardados) {
      return JSON.parse(estadosGuardados);
    }
    return dispositivos.reduce((acc, d) => ({ ...acc, [d]: false }), {});
  };

  const [estados, setEstados] = useState(obtenerEstadosDesdeStorage);

  useEffect(() => {
    localStorage.setItem(`${oficinaId}-${tipo}-dispositivos`, JSON.stringify(estados));
  }, [estados, oficinaId, tipo]);

  const toggleEstado = (nombre) => {
    const nuevoEstado = !estados[nombre];
    const accion = nuevoEstado ? 'encender' : 'apagar';
    const confirmacion = window.confirm(`¿Estás seguro de que quieres ${accion} el dispositivo ${nombre}?`);
    
    if (confirmacion) {
      setEstados((prev) => ({
        ...prev,
        [nombre]: nuevoEstado,
      }));
    }
  };

  return (
    <div className="dispositivos-contenedor">
      <button onClick={() => navigate(-1)} className="btn-volver">🔙 Volver</button>
      <h2>Dispositivos vinculados al sensor: {tipo}</h2>
      <p><strong>Oficina:</strong> Oficina {oficinaId}</p>

      <div className="dispositivos-listado">
        {dispositivos.map((nombre) => (
          <div key={nombre} className="dispositivo-card">
            <h4>{nombre}</h4>
            <p>Estado: <strong>{estados[nombre] ? 'Encendido' : 'Apagado'}</strong></p>
            <button onClick={() => toggleEstado(nombre)}>
              {estados[nombre] ? 'Apagar' : 'Encender'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
