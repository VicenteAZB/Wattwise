import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

  // Recuperar las alertas de localStorage cuando el componente se monta
  useEffect(() => {
    const alertasGuardadas = localStorage.getItem(`${oficinaId}-${tipo}`);
    if (alertasGuardadas) {
      setAlertas(JSON.parse(alertasGuardadas));
    }
  }, [oficinaId, tipo]);

  // Guardar las alertas en localStorage cuando cambian
  useEffect(() => {
    if (alertas.length > 0) {
      localStorage.setItem(`${oficinaId}-${tipo}`, JSON.stringify(alertas));
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
  
    if (modoEdicion !== null) {
      // Editar alerta
      const nuevasAlertas = [...alertas];
      nuevasAlertas[modoEdicion] = nuevaAlerta;
      setAlertas(nuevasAlertas);
      setModoEdicion(null);
    } else {
      // Confirmar antes de agregar nueva alerta
      const confirmado = window.confirm('¿Estás seguro de que deseas agregar esta alerta?');
      if (!confirmado) return;
  
      const nuevasAlertas = [...alertas, nuevaAlerta];
      setAlertas(nuevasAlertas);
    }
  
    // Guardar en localStorage
    const nuevasAlertasGuardadas = modoEdicion !== null
      ? [...alertas.slice(0, modoEdicion), nuevaAlerta, ...alertas.slice(modoEdicion + 1)]
      : [...alertas, nuevaAlerta];
  
    localStorage.setItem(`${oficinaId}-${tipo}`, JSON.stringify(nuevasAlertasGuardadas));
  
    // Reset campos
    setAccion('Encender');
    setDispositivo(dispositivosPorTipo[tipo]?.[0] || '');
    setOperador('>');
    setValorReferencia('');
  };
  

  const eliminarAlerta = (idx) => {
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar esta alerta?');
    if (confirmacion) {
      const nuevasAlertas = alertas.filter((_, i) => i !== idx);
      setAlertas(nuevasAlertas);

      // Actualizar localStorage después de eliminar
      localStorage.setItem(`${oficinaId}-${tipo}`, JSON.stringify(nuevasAlertas));
    }
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
    <div style={{ padding: '2rem' }}>
      <div style={{ marginTop: '1rem' }}>
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
                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                  <strong>{alerta.accion}</strong> si <strong>{alerta.condicion}</strong>
                  <button onClick={() => editarAlerta(idx)} style={{ marginLeft: '1rem' }}>✏️ Editar</button>
                  <button onClick={() => eliminarAlerta(idx)} style={{ marginLeft: '0.5rem', color: 'red' }}>🗑️ Eliminar</button>
                </li>
              ))
            ) : (
              <p style={{ color: 'gray' }}>No hay alertas programadas para este sensor.</p>
            )}
          </ul>

          <hr />
          <h4>{modoEdicion !== null ? '✏️ Editar Alerta' : '➕ Nueva Alerta'}</h4>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
              style={{ width: '100px' }}
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
