import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Datos de ejemplo
const datosOficinas = [
  {
    id: '1',
    nombre: 'Oficina 1',
    sensores: [
      { tipo: 'Energía', unidad: 'kWh' },
      { tipo: 'Temperatura', unidad: '°C' },
    ]
  },
  {
    id: '2',
    nombre: 'Oficina 2',
    sensores: [
      { tipo: 'Energía', unidad: 'kWh' },
      { tipo: 'Humedad', unidad: '%' },
    ]
  },
  {
    id: '3',
    nombre: 'Oficina 3',
    sensores: [
      { tipo: 'Temperatura', unidad: '°C' },
      { tipo: 'Humedad', unidad: '%' },
    ]
  },
];

// Alertas por oficina y tipo de sensor
const alertasSimuladas = {
  '1': {
    'Temperatura': [
      { condicion: '> 30°C', accion: 'Encender Aire Acondicionado' },
    ],
    'Energía': [
      { condicion: '> 120 kWh', accion: 'Apagar UPS' },
    ]
  },
  '2': {
    'Humedad': [
      { condicion: '< 40%', accion: 'Encender Extractor' },
    ]
  },
  '3': {
    'Temperatura': [
      { condicion: '< 18°C', accion: 'Encender Aire Acondicionado' },
    ],
    'Humedad': [
      { condicion: '> 70%', accion: 'Encender Calefactor' },
    ]
  }
};

export default function AlertasProgramadas() {
  const { oficinaId, tipo } = useParams();
  const navigate = useNavigate();

  const oficina = datosOficinas.find(o => o.id === oficinaId);
  const alertas = alertasSimuladas[oficinaId]?.[tipo];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📢 Alertas Programadas</h2>
      {oficina ? (
        <>
          <h3>🏢 Oficina: {oficina.nombre}</h3>
          <h4>🔧 Sensor: {tipo}</h4>

          {alertas && alertas.length > 0 ? (
            <ul>
              {alertas.map((alerta, idx) => (
                <li key={idx}>
                  ✅ <strong>{alerta.accion}</strong> si <strong>{tipo} {alerta.condicion}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'gray' }}>No hay alertas programadas para este sensor.</p>
          )}
        </>
      ) : (
        <p>Oficina no encontrada.</p>
      )}

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate(-1)}>🔙 Volver</button>
      </div>
    </div>
  );
}
