import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import TimePicker from 'react-time-picker';
import { DateTime } from 'luxon';
import GraficoDatosHistoricos from './GraficosDatosHistoricos';
import { obtenerDatosHistoricos } from './DatosHistoricosService';

import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import './DatosHistoricos.css';

export default function DatosHistoricos() {
  const { tipo, oficinaId } = useParams();
  const navigate = useNavigate();

  const ahora = DateTime.now();
  const ayer = ahora.minus({ hours: 24 });

  const [fechaDesde, setFechaDesde] = useState(ayer.toJSDate());
  const [horaDesde, setHoraDesde] = useState(ayer.toFormat("HH:mm"));
  const [fechaHasta, setFechaHasta] = useState(ahora.toJSDate());
  const [horaHasta, setHoraHasta] = useState(ahora.toFormat("HH:mm"));
  const [unidad, setUnidad] = useState('');
  const [tipoGrafico, setTipoGrafico] = useState('');
  const [datosSimulados, setDatosSimulados] = useState([]);
  const [mostrarGrafico, setMostrarGrafico] = useState(false);
  const [errorRango, setErrorRango] = useState('');

  useEffect(() => {
    if (tipo && oficinaId) {
      handleObtenerDatos();
    }
  }, [tipo, oficinaId]);

  const handleObtenerDatos = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Token faltante, inicie sesión nuevamente");
      navigate('/');  // Redirige si no hay token
      return;
    }
  
    try {
      const { datosFormateados, unidad, tipoGrafico } = await obtenerDatosHistoricos({
        tipo,
        oficinaId,
        fechaDesde,
        horaDesde,
        fechaHasta,
        horaHasta,
        token  // Asegúrate de pasar el token a la función
      });
  
      setUnidad(unidad);
      setTipoGrafico(tipoGrafico);
      setDatosSimulados(datosFormateados);
      setMostrarGrafico(true);
    } catch (error) {
      if (error.message === 'Token inválido' || error.message === 'Token expirado') {
        alert("Token inválido o expirado, inicie sesión nuevamente");
        localStorage.removeItem('token');  // Elimina el token si es inválido o ha expirado
        navigate('/');  // Redirige al login
      } else {
        console.error("Error al obtener los datos históricos:", error);
        setErrorRango(error.message);
      }
    }
  };
  

  return (
    <div className="contenedor-datos">
      <button onClick={() => navigate(-1)} className="btn-volver">🔙 Volver</button>
      <h2>Datos históricos - Sensor: {tipo}</h2>
      <p><strong>Oficina:</strong> {oficinaId}</p>

      <div className="seccion-fechas">
        <div>
          <label><strong>Desde:</strong></label><br />
          <Calendar
            value={fechaDesde}
            maxDate={new Date()}
            onChange={(value) => {
              setFechaDesde(value);
              if (errorRango) setErrorRango('');
            }}
          />
          <TimePicker
            value={horaDesde}
            onChange={(value) => {
              setHoraDesde(value);
              if (errorRango) setErrorRango('');
            }}
            disableClock
          />
        </div>

        <div>
          <label><strong>Hasta:</strong></label><br />
          <Calendar
            value={fechaHasta}
            maxDate={new Date()}
            onChange={(value) => {
              setFechaHasta(value);
              if (errorRango) setErrorRango('');
            }}
          />
          <TimePicker
            value={horaHasta}
            onChange={(value) => {
              setHoraHasta(value);
              if (errorRango) setErrorRango('');
            }}
            disableClock
          />
        </div>
      </div>

      <div className="boton-centrado">
        <button onClick={handleObtenerDatos} className="btn-generar">📊 Mostrar datos</button>
      </div>

      {errorRango && <p className="mensaje-error">{errorRango}</p>}

      <div className="cambiar-grafico">
        <button onClick={() => navigate(`/oficina/${oficinaId}/sensor/${tipo}/graficos/historico`)}>
          📈 Cambiar gráfico para datos históricos
        </button>
      </div>

      {mostrarGrafico && (
        datosSimulados.length > 0 ? (
          <GraficoDatosHistoricos datosSimulados={datosSimulados} unidad={unidad} tipoGrafico={tipoGrafico}/>
        ) : (
          <div className="mensaje-vacio">No hay datos para mostrar.</div>
        )
      )}
    </div>
  );
}
