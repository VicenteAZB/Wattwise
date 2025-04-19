import { useParams, useNavigate } from 'react-router-dom';

export default function SeleccionarGrafico() {
  const { tipo, oficinaId } = useParams();
  const navigate = useNavigate();

  const manejarSeleccion = (categoria, grafico, tipoSensor, oficinaId) => {
    const currentConfig = JSON.parse(localStorage.getItem(`configGraficoSensor_${oficinaId}`)) || {};

    // Asegurar que el tipoSensor ya tenga un objeto
    currentConfig[tipoSensor] = currentConfig[tipoSensor] || {};

    // Guardar el gráfico según la categoría (tiempo-real o historico)
    currentConfig[tipoSensor][categoria] = grafico;

    localStorage.setItem(`configGraficoSensor_${oficinaId}`, JSON.stringify(currentConfig));

    // Navegación según tipo de gráfico
    if (categoria === 'historico') {
      navigate(`/oficina/${oficinaId}/sensor/${tipoSensor}/historico`);
    } else {
      navigate(`/oficina/${oficinaId}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Seleccionar tipo de gráfico para sensor: {tipo}</h2>
      <p><strong>Oficina:</strong> Oficina {oficinaId}</p>

      <div style={{ marginTop: '2rem' }}>
        <h3>📡 Tiempo real</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => manejarSeleccion('tiempo-real', 'tarjeta', tipo, oficinaId)}>🔄 Tarjeta</button>
          <button onClick={() => manejarSeleccion('tiempo-real', 'línea en vivo', tipo, oficinaId)}>📈 Línea en vivo</button>
          <button onClick={() => manejarSeleccion('tiempo-real', 'barra dinámica', tipo, oficinaId)}>📊 Barra dinámica</button>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>🕓 Datos pasados</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => manejarSeleccion('historico', 'línea histórica', tipo, oficinaId)}>📉 Línea histórica</button>
          <button onClick={() => manejarSeleccion('historico', 'área acumulada', tipo, oficinaId)}>📋 Área acumulada</button>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate(-1)}>🔙 Volver</button>
      </div>
    </div>
  );
}
