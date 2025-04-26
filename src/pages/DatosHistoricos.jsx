import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts';
import Calendar from 'react-calendar';
import TimePicker from 'react-time-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import { DateTime } from 'luxon';

export default function DatosHistoricos() {
  const { tipo, oficinaId } = useParams();
  const navigate = useNavigate();

  const ahora = DateTime.now();
  const ayer = ahora.minus({ hours: 24 });

  const [fechaDesde, setFechaDesde] = useState(ayer.toJSDate());
  const [horaDesde, setHoraDesde] = useState(ayer.toFormat("HH:mm"));
  const [fechaHasta, setFechaHasta] = useState(ahora.toJSDate());
  const [horaHasta, setHoraHasta] = useState(ahora.toFormat("HH:mm"));

  const [datosSimulados, setDatosSimulados] = useState([]);
  const [mostrarGrafico, setMostrarGrafico] = useState(false);
  const [errorRango, setErrorRango] = useState('');

  const unidadesPorTipo = {
    'Temperatura': '°C',
    'Humedad': '%',
    'Energía': 'kWh'
  };
  
  const unidad = unidadesPorTipo[tipo] || '';
  

  useEffect(() => {
    generarDatos(); // cargar automáticamente al montar
  }, []);

  const generarDatos = () => {
    const desde = DateTime.fromJSDate(fechaDesde).set({
      hour: parseInt(horaDesde.split(':')[0]),
      minute: parseInt(horaDesde.split(':')[1])
    });

    const hasta = DateTime.fromJSDate(fechaHasta).set({
      hour: parseInt(horaHasta.split(':')[0]),
      minute: parseInt(horaHasta.split(':')[1])
    });

    if (desde >= hasta) {
      setErrorRango('La fecha y hora "desde" debe ser menor que "hasta".');
      return;
    }

    setErrorRango('');

    const intervaloMinutos = 15;
    const maxPuntos = 100;

    const totalMinutos = hasta.diff(desde, 'minutes').minutes;
    const totalPuntos = Math.floor(totalMinutos / intervaloMinutos);
    const step = Math.ceil(totalPuntos / maxPuntos);

    const datos = [];
    let tiempo = desde;
    let i = 0;
    while (tiempo <= hasta) {
      if (i % step === 0) {
        datos.push({
          hora: tiempo.toFormat("dd/MM HH:mm"),
          valor: Math.floor(Math.random() * 100) + 20
        });
      }
      tiempo = tiempo.plus({ minutes: intervaloMinutos });
      i++;
    }

    setDatosSimulados(datos);
    setMostrarGrafico(true);
  };

  // Cargar tipo de gráfico (por defecto tabla)
  const configGuardada = JSON.parse(localStorage.getItem(`configGraficoSensor_${oficinaId}`)) || {};
  const tipoGrafico = configGuardada[tipo]?.['historico'] || 'tabla';

  const renderTabla = () => (
    <div style={{
      maxHeight: '312px',
      overflowY: 'auto',
      overflowX: 'auto',
      marginTop: '2rem',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9f9f9', zIndex: 1 }}>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Fecha y Hora</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {datosSimulados.map((dato, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{dato.hora}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{dato.valor} {unidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  

  const renderGrafico = () => {
    const ChartBaseProps = {
      data: datosSimulados,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    const elementosComunes = (
      <>
        <CartesianGrid strokeDasharray="3 3" />
        <Legend />
        <Tooltip formatter={(value) => `${value} ${unidad}`} />
      </>
    );

    switch (tipoGrafico) {
      case 'área acumulada':
        return (
          <AreaChart {...ChartBaseProps}>
            {elementosComunes}
            <Area type="monotone" dataKey="valor" stroke="#8884d8" fill="#8884d8" name="Medición acumulada" />
            <XAxis dataKey="hora" angle={-45} textAnchor="end" />
            <YAxis tickFormatter={(value) => `${value} ${unidad}`} />
          </AreaChart>
        );
      case 'tabla':
        return renderTabla();
      default:
        return (
          <LineChart {...ChartBaseProps}>
            {elementosComunes}
            <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={2} name="Medición" />
            <XAxis dataKey="hora" angle={-45} textAnchor="end" />
            <YAxis tickFormatter={(value) => `${value} ${unidad}`} />
          </LineChart>
        );
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
        🔙 Volver
      </button>
      <h2>Datos históricos - Sensor: {tipo}</h2>
      <p><strong>Oficina:</strong> Oficina {oficinaId}</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <label><strong>Desde:</strong></label><br />
          <Calendar value={fechaDesde} onChange={setFechaDesde} />
          <TimePicker value={horaDesde} onChange={setHoraDesde} disableClock />
        </div>

        <div style={{ textAlign: 'center' }}>
          <label><strong>Hasta:</strong></label><br />
          <Calendar value={fechaHasta} onChange={setFechaHasta} />
          <TimePicker value={horaHasta} onChange={setHoraHasta} disableClock />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={generarDatos} style={{ padding: '0.6rem 1.2rem', fontSize: '1rem' }}>
          📊 Mostrar datos
        </button>
      </div>

      <div style={{ marginTop: '1rem', alignItems: 'center', textAlign: 'center'}}>
          <button onClick={() => navigate(`/oficina/${oficinaId}/sensor/${tipo}/graficos/historico`)} style={{ padding: '0.6rem 0.75rem', fontSize: '1rem' }}>📈 Cambiar gráfico</button>
       </div>

       {errorRango && (
        <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center', marginBottom: '2rem' }}>{errorRango}</p>
      )}

      {mostrarGrafico && (
        <ResponsiveContainer width="100%" height={350}>
          {renderGrafico()}
        </ResponsiveContainer>
      )}
    </div>
  );
}
