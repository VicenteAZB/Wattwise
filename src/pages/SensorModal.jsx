import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function SensorModal({ oficinaId, sensor, onClose }) {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        width: '400px',
        textAlign: 'center'
      }}>
        <h3>{sensor.tipo}</h3>
        <p><strong>Valor actual:</strong> {sensor.valor} {sensor.unidad}</p>

        {/* Opciones del modal */}
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => navigate(`/oficina/${oficinaId}/sensor/${sensor.tipo}/graficos/tiempo-real`)}>📈 Cambiar gráfico tiempo real</button>
            <button onClick={() => navigate(`/oficina/${oficinaId}/sensor/${sensor.tipo}/historico`)}>📅 Consultar datos históricos</button>
            <button onClick={() => navigate(`/oficina/${oficinaId}/sensor/${sensor.tipo}/dispositivos`)}>🖥️ Controlar dispositivos vinculados</button>
            <button onClick={() => navigate(`/oficina/${oficinaId}/sensor/${sensor.tipo}/alertas`)}>📢 Gestionar alertas programadas</button>
        </div>
        {/* Cerrar modal */}
        <button onClick={onClose} style={{ marginTop: '1rem' }}>❌ Cerrar</button>
      </div>
    </div>
  );
}
