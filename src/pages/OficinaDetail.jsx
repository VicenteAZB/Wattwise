import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar,
  ResponsiveContainer
} from 'recharts';
import SensorModal from './SensorModal';

const datosOficinas = [
  {
    id: '1',
    nombre: 'Oficina 1',
    sensores: [
      { tipo: 'Energía', unidad: 'kWh' },
      { tipo: 'Temperatura', unidad: '°C' },
      { tipo: 'Humedad', unidad: '%' }
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

export default function OficinaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const oficina = datosOficinas.find((o) => o.id === id);

  const [sensores, setSensores] = useState([]);
  const [sensorSeleccionado, setSensorSeleccionado] = useState(null);
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [graficoSeleccionado, setGraficoSeleccionado] = useState({});

  useEffect(() => {
    const configGuardada = localStorage.getItem(`configGraficoSensor_${id}`); // Configuración específica de la oficina
    if (configGuardada) {
      setGraficoSeleccionado(JSON.parse(configGuardada));
    }
  }, [id]);

  useEffect(() => {
    if (oficina) {
      const sensoresIniciales = oficina.sensores.map((s) => ({
        ...s,
        valor: generarValorAleatorio(s.tipo),
      }));
      setSensores(sensoresIniciales);
  
      // AGREGAR DATO INICIAL INMEDIATAMENTE
      const now = new Date();
      setDatosGrafico([{
        time: now.toLocaleTimeString(),
        ...Object.fromEntries(sensoresIniciales.map((s) => [s.tipo, parseFloat(s.valor)])),
      }]);
  
      const interval = setInterval(() => {
        const nuevosSensores = sensoresIniciales.map((sensor) => {
          const nuevoValor = generarValorAleatorio(sensor.tipo);
          return { ...sensor, valor: nuevoValor };
        });
  
        setSensores(nuevosSensores);
  
        setDatosGrafico((prev) => {
          const now = new Date();
          return [
            ...prev.slice(-9),
            {
              time: now.toLocaleTimeString(),
              ...Object.fromEntries(nuevosSensores.map((s) => [s.tipo, parseFloat(s.valor)])),
            }
          ];
        });
  
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [oficina]);
  

  function generarValorAleatorio(tipo) {
    switch (tipo) {
      case 'Energía': return (100 + Math.random() * 50).toFixed(1);
      case 'Temperatura': return (20 + Math.random() * 5).toFixed(1);
      case 'Humedad': return (40 + Math.random() * 20).toFixed(1);
      default: return '0';
    }
  }

  const renderGrafico = (tipo) => {
    const config = graficoSeleccionado?.[tipo];
    const tipoGrafico = config?.['tiempo-real'];

    if (!tipoGrafico || !datosGrafico.length) return null;

    switch (tipoGrafico) {
      case 'línea en vivo':
        return (
         <ResponsiveContainer height='80%' width='100%'>
          <LineChart data={datosGrafico}>
            <Line type="monotone" dataKey={tipo} stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
          </LineChart>
         </ResponsiveContainer> 
        );
      case 'barra dinámica':
        return (
         <ResponsiveContainer height='80%' width='100%'>
          <BarChart width={'100%'} height={300} data={datosGrafico}>
            <Bar dataKey={tipo} fill="#82ca9d" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
          </BarChart>
         </ResponsiveContainer> 
        );
      default:
        return null;
    }
  };

  if (!oficina) {
    return <div style={{ padding: '2rem' }}><h2>Oficina no encontrada</h2></div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
        🔙 Volver
      </button>
      <h2>{oficina.nombre}</h2>
      <h3>Datos Sensores Tiempo Real:</h3>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {sensores.map((sensor, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              background: '#f9f9f9',
              cursor: 'pointer',
              textAlign: 'center',
              width: '28%',
              transition: 'transform 0.2s, background-color 0.3s'
            }}
            onClick={() => setSensorSeleccionado(sensor)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.backgroundColor = '#e9f5ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <h4>{sensor.tipo}</h4>
            {/* Mostrar tarjeta si no hay gráfico configurado o si es "tarjetas" */}
            {!graficoSeleccionado?.[sensor.tipo]?.['tiempo-real'] || graficoSeleccionado?.[sensor.tipo]?.['tiempo-real'] === 'tarjeta'
              ? <p><strong>Valor:</strong> {sensor.valor} {sensor.unidad}</p>
              : renderGrafico(sensor.tipo)
            }
          </div>
        ))}
      </div>

      {sensorSeleccionado && (
        <SensorModal
          oficinaId={id}
          sensor={sensorSeleccionado}
          onClose={() => setSensorSeleccionado(null)}
        />
      )}
    </div>
  );
}
