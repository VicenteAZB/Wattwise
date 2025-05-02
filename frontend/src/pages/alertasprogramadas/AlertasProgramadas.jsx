// AlertasProgramadas.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AlertasProgramadas.css';

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

const dispositivosPorTipo = {
  'Temperatura': ['Aire Acondicionado', 'Ventilador'],
  'Energía': ['UPS', 'Panel Solar'],
  'Humedad': ['Extractor', 'Calefactor']
};

const operadoresLogicos = ['>', '<', '>=', '<=', '=='];

// Funciones internas de servicios (no separadas)
function cargarAlertas(oficinaId, tipo) {
  const guardadas = localStorage.getItem(`${oficinaId}-${tipo}`);
  return guardadas ? JSON.parse(guardadas) : [];
}

function guardarAlertas(oficinaId, tipo, alertas) {
  localStorage.setItem(`${oficinaId}-${tipo}`, JSON.stringify(alertas));
}

export default function AlertasProgramadas() {
  const { oficinaId, tipo } = useParams();
  const navigate = useNavigate();

  const oficina = datosOficinas.find(o => o.id === oficinaId);
  const unidad = oficina?.sensores.find(s => s.tipo === tipo)?.unidad || '';

  const [alertas, setAlertas] = useState([]);
  const [accion, setAccion] = useState('Encender');
  const [dispositivo, setDispositivo] = useState(dispositivosPorTipo[tipo]?.[0] || '');
  const [operador, setOperador] = useState('>');
  const [valorReferencia, setValorReferencia] = useState('');
  const [modoEdicion, setModoEdicion] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setAlertas(cargarAlertas(oficinaId, tipo));
  }, [oficinaId, tipo]);

  useEffect(() => {
    if (alertas.length > 0) {
      guardarAlertas(oficinaId, tipo, alertas);
    }
  }, [alertas, oficinaId, tipo]);

  const agregarOEditarAlerta = () => {
    if (!accion || !dispositivo || !operador || !valorReferencia) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setError('');
    const nuevaAlerta = {
      condicion: `${tipo} ${operador} ${valorReferencia} ${unidad}`,
      accion: `${accion} ${dispositivo}`,
      dispositivo,
      tipoAccion: accion,
      operador,
      valorReferencia
    };

    let nuevasAlertas;

    if (modoEdicion !== null) {
      nuevasAlertas = [...alertas];
      nuevasAlertas[modoEdicion] = nuevaAlerta;
      setModoEdicion(null);
    } else {
      if (!window.confirm('¿Estás seguro de que deseas agregar esta alerta?')) return;
      nuevasAlertas = [...alertas, nuevaAlerta];
    }

    setAlertas(nuevasAlertas);
    guardarAlertas(oficinaId, tipo, nuevasAlertas);

    setAccion('Encender');
    setDispositivo(dispositivosPorTipo[tipo]?.[0] || '');
    setOperador('>');
    setValorReferencia('');
  };

  const eliminarAlerta = (idx) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta alerta?')) return;
    const nuevasAlertas = alertas.filter((_, i) => i !== idx);
    setAlertas(nuevasAlertas);
    guardarAlertas(oficinaId, tipo, nuevasAlertas);
  };

  const editarAlerta = (idx) => {
    const alerta = alertas[idx];
    setAccion(alerta.tipoAccion);
    setDispositivo(alerta.dispositivo);
    setOperador(alerta.operador);
    setValorReferencia(alerta.valorReferencia);
    setModoEdicion(idx);
  };

  return (
    <div className="alertas-container">
      <div className="volver-btn">
        <button onClick={() => navigate(-1)}>🔙 Volver</button>
      </div>
      <h2>📢 Alertas Programadas</h2>
      {oficina ? (
        <>
          <h3>🏢 Oficina: {oficina.nombre}</h3>
          <h4>🔧 Sensor: {tipo} ({unidad})</h4>

          <ul>
            {alertas.length > 0 ? (
              alertas.map((alerta, idx) => (
                <li key={idx} className="alerta-item">
                  <strong>{alerta.accion}</strong> si <strong>{alerta.condicion}</strong>
                  <button onClick={() => editarAlerta(idx)} className="editar-btn">✏️ Editar</button>
                  <button onClick={() => eliminarAlerta(idx)} className="eliminar-btn">🗑️ Eliminar</button>
                </li>
              ))
            ) : (
              <p className="sin-alertas">No hay alertas programadas para este sensor.</p>
            )}
          </ul>

          <hr />
          <h4>{modoEdicion !== null ? '✏️ Editar Alerta' : '➕ Nueva Alerta'}</h4>

          {error && <p className="error-text">{error}</p>}

          <div className="alerta-form">
            <select value={accion} onChange={(e) => setAccion(e.target.value)} required>
              <option value="Encender">Encender</option>
              <option value="Apagar">Apagar</option>
            </select>

            <select value={dispositivo} onChange={(e) => setDispositivo(e.target.value)} required>
              {dispositivosPorTipo[tipo]?.map((d, idx) => (
                <option key={idx} value={d}>{d}</option>
              ))}
            </select>

            <p>{tipo}</p>

            <select value={operador} onChange={(e) => setOperador(e.target.value)} required>
              {operadoresLogicos.map((op, idx) => (
                <option key={idx} value={op}>{op}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder={`Valor (${unidad})`}
              value={valorReferencia}
              onChange={(e) => setValorReferencia(e.target.value)}
              required
              className="valor-input"
            />

            <button onClick={agregarOEditarAlerta}>
              {modoEdicion !== null ? '💾 Guardar cambios' : '➕ Agregar'}
            </button>
          </div>
        </>
      ) : (
        <p>Oficina no encontrada.</p>
      )}
    </div>
  );
}
