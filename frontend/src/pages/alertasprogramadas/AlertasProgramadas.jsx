// src/components/AlertasProgramadas.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AlertasProgramadas.css';
import { cargarDatos, guardarAlertas } from './AlertasProgramadasService';

const operadoresLogicos = ['>', '<', '>=', '<=', '='];

export default function AlertasProgramadas() {
  const { oficinaId, tipo } = useParams();
  const navigate = useNavigate();

  const [tipoSensor, setTipoSensor] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [dispositivos, setDispositivos] = useState([]);
  const [alertas, setAlertas] = useState([]);

  const [accion, setAccion] = useState('Encender');
  const [dispositivo, setDispositivo] = useState(null);
  const [operador, setOperador] = useState('>');
  const [valorReferencia, setValorReferencia] = useState('');
  const [modoEdicion, setModoEdicion] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      const data = await cargarDatos(oficinaId, tipo);
      if (data) {
        setTipoSensor(data.tipo);
        setUnidadMedida(data.unidad_medida);
        setDispositivos(data.dispositivos || []);
        setAlertas(data.alertas || []);
      }
    }
    fetchData();
  }, [oficinaId, tipo]);

  function editarAlerta(index) {
    const alerta = alertas[index];
    setAccion(alerta.accion);
    setOperador(alerta.operador);
    setValorReferencia(alerta.valorReferencia);
    setDispositivo(dispositivos.find(d => d.nombre === alerta.dispositivo));
    setModoEdicion(index);
  }

  function eliminarAlerta(index) {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta alerta?");
    if (confirmacion) {
      const nuevasAlertas = [...alertas];
      nuevasAlertas.splice(index, 1);
      setAlertas(nuevasAlertas);
      guardarAlertas(oficinaId, tipo, nuevasAlertas);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!dispositivo || valorReferencia === '') {
      setError('Todos los campos son obligatorios');
      return;
    }

    const nombreDispositivo = dispositivo.nombre || 'dispositivo';
    const text = modoEdicion == null ? "agregar" : "editar";

    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas ${text} esta alerta?`
    );

    if (!confirmacion) return;

    const nuevaAlerta = {
      accion,
      dispositivo: nombreDispositivo,
      operador,
      valorReferencia: parseFloat(valorReferencia),
    };

    const nuevasAlertas = [...alertas];
    if (modoEdicion !== null) {
      nuevasAlertas[modoEdicion] = nuevaAlerta;
    } else {
      nuevasAlertas.push(nuevaAlerta);
    }

    setAlertas(nuevasAlertas);
    guardarAlertas(oficinaId, tipo, nuevasAlertas);
    resetFormulario();
  }

  function resetFormulario() {
    setModoEdicion(null);
    setValorReferencia('');
    setDispositivo(null);
    setAccion('Encender');
    setOperador('>');
  }

  return (
    <div className="alertas-container">
      <div className="volver-btn">
        <button onClick={() => navigate(-1)}>🔙 Volver</button>
      </div>
      <h2>📢 Alertas Programadas</h2>

      <h3>🏢 Oficina: {oficinaId}</h3>
      <h4>🔧 Sensor: {tipo} ({unidadMedida})</h4>

      <ul>
        {alertas.length > 0 ? (
          alertas.map((alerta, idx) => (
            <li key={idx} className="alerta-item">
              <strong>{alerta.accion} {alerta.dispositivo} si {tipoSensor} {alerta.operador} {alerta.valorReferencia}{unidadMedida}</strong>
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

      <form className="alerta-form" onSubmit={handleSubmit}>
        <select value={accion} onChange={(e) => setAccion(e.target.value)} required>
          <option value="Encender">Encender</option>
          <option value="Apagar">Apagar</option>
        </select>

        <select
          value={dispositivo ? dispositivo.nombre : ''}
          onChange={(e) => {
            const selected = dispositivos.find(d => d.nombre === e.target.value);
            setDispositivo(selected);
          }}
          required
        >
          <option value="">Selecciona un dispositivo</option>
          {dispositivos.map((d, idx) => (
            <option key={idx} value={d.nombre}>{d.nombre}</option>
          ))}
        </select>

        <select value={operador} onChange={(e) => setOperador(e.target.value)} required>
          {operadoresLogicos.map((op, idx) => (
            <option key={idx} value={op}>{op}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder={`Valor (${unidadMedida})`}
          value={valorReferencia}
          onChange={(e) => setValorReferencia(e.target.value)}
          required
          className="valor-input"
        />

        <button type="submit">
          {modoEdicion !== null ? '💾 Guardar cambios' : '➕ Agregar'}
        </button>

        {modoEdicion !== null && (
          <button type="button" onClick={resetFormulario} className="cancelar-btn">❌ Cancelar</button>
        )}
      </form>
    </div>
  );
}
