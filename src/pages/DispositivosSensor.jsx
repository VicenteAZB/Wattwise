import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function DispositivosSensor() {
  const { tipo, oficinaId } = useParams();
  const navigate = useNavigate();

  // Dispositivos por tipo de sensor
  const dispositivosPorTipo = {
    'Temperatura': ['Aire Acondicionado', 'Ventilador'],
    'Energía': ['UPS', 'Panel Solar'],
    'Humedad': ['Extractor', 'Calefactor']
    // Agregá más si querés
  };

  const dispositivos = dispositivosPorTipo[tipo] || ['Dispositivo A', 'Dispositivo B'];

  // Estado de cada dispositivo (encendido o apagado)
  const [estados, setEstados] = useState(
    dispositivos.reduce((acc, d) => ({ ...acc, [d]: false }), {})
  );

  const toggleEstado = (nombre) => {
    setEstados((prev) => ({
      ...prev,
      [nombre]: !prev[nombre],
    }));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dispositivos vinculados al sensor: {tipo}</h2>
      <p><strong>Oficina:</strong> Oficina {oficinaId}</p>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        {dispositivos.map((nombre) => (
          <div key={nombre} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '10px', width: '200px' }}>
            <h4>{nombre}</h4>
            <p>Estado: <strong>{estados[nombre] ? 'Encendido' : 'Apagado'}</strong></p>
            <button onClick={() => toggleEstado(nombre)}>
              {estados[nombre] ? 'Apagar' : 'Encender'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate(-1)}>🔙 Volver</button>
      </div>
    </div>
  );
}
