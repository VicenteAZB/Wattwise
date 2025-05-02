import React from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush
} from 'recharts';

// Formatea fecha para XAxis y Tooltip
const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  if (isNaN(date)) return 'Inválido';
  return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

export default function GraficoDatosHistoricos({ datosSimulados, unidad, tipoGrafico }) {
  // Usar objetos Date reales para que Recharts interprete bien las fechas
  const datosProcesados = datosSimulados.map(item => ({
    ...item,
    hora: new Date(item.hora) // ✅ mantener como Date

  }));

  // Si es un gráfico acumulado, sumar los valores progresivamente
  const datosAcumulados = tipoGrafico === 'área acumulada'
    ? datosProcesados.reduce((acc, item, index) => {
        const acumulado = index === 0 ? item.valor : acc[index - 1].valor + item.valor;
        acc.push({ ...item, valor: acumulado });
        return acc;
      }, [])
    : datosProcesados;

  const renderTabla = () => (
    <div className="tabla-contenedor">
      <table className="tabla-datos">
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            <th>Valor ({unidad})</th>
          </tr>
        </thead>
        <tbody>
          {datosProcesados.length === 0 ? (
            <tr>
              <td colSpan="2" className="mensaje-vacio">No hay datos disponibles</td>
            </tr>
          ) : (
            datosProcesados.map((dato, index) => (
              <tr key={index}>
                <td>{formatearFecha(dato.hora)}</td>
                <td>{dato.valor}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderGrafico = () => {
    const ChartBaseProps = {
      data: datosAcumulados,
      margin: { top: 20, right: 30, left: 20, bottom: 80 }
    };

    const elementosComunes = (
      <>
        <CartesianGrid strokeDasharray="3 3" />
        <Legend />
        <Tooltip
          formatter={(value) => `${value} ${unidad}`}
          labelFormatter={(label) => {
            console.log("Tooltip activado para:", label); // 👀
            return `Fecha: ${formatearFecha(label)}`;
          }}
        />
      </>
    );

    switch (tipoGrafico) {
      case 'área acumulada':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart {...ChartBaseProps}>
              {elementosComunes}
              <Area
                type="monotone"
                dataKey="valor"
                stroke="#8884d8"
                fill="#8884d8"
                name="Medición acumulada"
              />
              <XAxis
                dataKey="hora"
                angle={-45}
                textAnchor="end"
                tickFormatter={formatearFecha}
              />
              <YAxis tickFormatter={(value) => `${value} ${unidad}`} />
              <Brush
                dataKey="hora"
                height={30}
                stroke="#8884d8"
                tickFormatter={(fecha) => formatearFecha(new Date(fecha))}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'tabla':
        return renderTabla();

      default:
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart {...ChartBaseProps}>
              {elementosComunes}
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#8884d8"
                strokeWidth={2}
                name="Medición"
              />
              <XAxis
                dataKey="hora"
                angle={-45}
                textAnchor="end"
                tickFormatter={formatearFecha}
              />
              <YAxis tickFormatter={(value) => `${Number(value).toFixed(1)} ${unidad}`} />
              <Brush
                dataKey="hora"
                height={30}
                stroke="#8884d8"
                tickFormatter={(fecha) => formatearFecha(new Date(fecha))}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return renderGrafico();
}
