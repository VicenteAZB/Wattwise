import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export default function DatosHistoricos() {
  const { tipo, oficinaId } = useParams();
  const navigate = useNavigate();

  // Simulamos datos históricos aleatorios
  const datosSimulados = Array.from({ length: 20 }, (_, i) => ({
    hora: `${i + 1}:00`,
    valor: Math.floor(Math.random() * 100) + 20
  }));

  // Recuperar la configuración guardada para esta oficina
  const configGuardada = JSON.parse(localStorage.getItem(`configGraficoSensor_${oficinaId}`)) || {};
  const tipoGrafico = configGuardada[tipo]?.['historico'];

  // Si no hay gráfico seleccionado, mostramos uno por defecto (línea histórica)
  const renderGrafico = () => {

    switch (tipoGrafico) {
      case 'línea histórica':
        return (
          <LineChart data={datosSimulados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        );
      case 'área acumulada':
        return (
          <AreaChart data={datosSimulados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="valor" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        );
      default:
        return (
          <LineChart data={datosSimulados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        );
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Datos históricos - Sensor: {tipo}</h2>
      <p><strong>Oficina:</strong> Oficina {oficinaId}</p>

      <ResponsiveContainer width="100%" height={300}>
        {renderGrafico()}
      </ResponsiveContainer>

      <button onClick={() => navigate(-1)} style={{ marginTop: '2rem' }}>
        🔙 Volver
      </button>
    </div>
  );
}
