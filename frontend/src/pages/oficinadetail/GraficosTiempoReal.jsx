import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar,
  ResponsiveContainer
} from 'recharts';

export default function SensorGrafico({ sensor, datosGrafico }) {
  const tipo = sensor.sensor; // nombre del sensor, ej: "temperatura"
  const tipoGrafico = sensor.tiempo_real || 'tarjeta';

  // Obtenemos los datos de este sensor
  const datos = datosGrafico || [];
  switch (tipoGrafico) {
    case 'línea en vivo':
      return (
        <ResponsiveContainer height={200} width="100%">
          <LineChart data={datos}>
            <Line
              type="monotone"
              dataKey={tipo} // 👈 Accede dinámicamente al nombre del sensor
              stroke="#8884d8"
              dot={false}
            />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'barra dinámica':
      return (
        <ResponsiveContainer height={200} width="100%">
          <BarChart data={datos}>
            <Bar
              dataKey={tipo} // 👈 También dinámico aquí
              fill="#82ca9d"
            />
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
}
