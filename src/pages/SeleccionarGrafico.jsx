import { useParams, useNavigate } from 'react-router-dom';

export default function SeleccionarGrafico() {
  const { tipo, oficinaId, categoria } = useParams();
  const navigate = useNavigate();

  const manejarSeleccion = (grafico) => {
    const currentConfig = JSON.parse(localStorage.getItem(`configGraficoSensor_${oficinaId}`)) || {};
    currentConfig[tipo] = currentConfig[tipo] || {};
    currentConfig[tipo][categoria] = grafico;
    localStorage.setItem(`configGraficoSensor_${oficinaId}`, JSON.stringify(currentConfig));
    alert('Gráfico actualizado correctamente');
    navigate(-1);
  };

  const opcionesTiempoReal = [
    { nombre: '🔄 Tarjeta', valor: 'tarjeta' },
    { nombre: '📈 Línea en vivo', valor: 'línea en vivo' },
    { nombre: '📊 Barra dinámica', valor: 'barra dinámica' }
  ];

  const opcionesHistorico = [
    { nombre: '🔢 Tabla', valor: 'tabla' },
    { nombre: '📉 Línea histórica', valor: 'línea histórica' },
    { nombre: '📋 Área acumulada', valor: 'área acumulada' }
  ];

  const opciones = categoria === 'tiempo-real' ? opcionesTiempoReal : opcionesHistorico;

  const configActual = JSON.parse(localStorage.getItem(`configGraficoSensor_${oficinaId}`)) || {};
  const graficoSeleccionado = configActual[tipo]?.[categoria] || '';

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>🔙 Volver</button>
      <h2>Gráficos para sensor: {tipo}</h2>
      <p><strong>Oficina:</strong> Oficina {oficinaId}</p>

      <div style={{ marginTop: '2rem' }}>
        <h3>Selecciona Gráfico Para {categoria === 'tiempo-real' ? 'Datos en Tiempo Real 📡' : 'Datos Históricos 🕓'}</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {opciones.map((opcion) => (
            <button
              key={opcion.valor}
              onClick={() => manejarSeleccion(opcion.valor)}
              style={{
                padding: '0.6rem 0.75rem',
                fontSize: '1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: opcion.valor === graficoSeleccionado ? '#007BFF' : '#f0f0f0',
                color: opcion.valor === graficoSeleccionado ? 'white' : 'black',
                boxShadow: opcion.valor === graficoSeleccionado ? '0 2px 8px rgba(0, 123, 255, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s'
              }}
            >
              {opcion.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
