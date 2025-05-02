import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './SeleccionarGrafico.css';
import { actualizarGraficoSeleccionado, obtenerGraficoSeleccionado } from './SeleccionarGraficoService';

export default function SeleccionarGrafico() {
  const { tipo, oficinaId, categoria } = useParams();
  const navigate = useNavigate();

  const [hovered, setHovered] = useState(null);
  const [clicked, setClicked] = useState(null);
  const [graficoSeleccionado, setGraficoSeleccionado] = useState('');

  // Cargar el gráfico seleccionado al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirige si no hay token
      return;
    }

    // Obtener el gráfico seleccionado
    const fetchGraficoSeleccionado = async () => {
      try {
        const grafico = await obtenerGraficoSeleccionado({ oficinaId, tipo, categoria, token });
        setGraficoSeleccionado(grafico); // Establecer el gráfico seleccionado
      } catch (error) {
        if (error.message === 'Token inválido' || error.message === 'Token expirado') {
          localStorage.removeItem('token'); // Elimina el token si es inválido o ha expirado
          navigate('/'); // Redirige al login
        } else {
          console.error('Error al obtener el gráfico seleccionado:', error);
          alert('No se pudo obtener el gráfico seleccionado');
        }
      }
    };

    fetchGraficoSeleccionado();
  }, [navigate, oficinaId, tipo, categoria]);

  const manejarSeleccion = async (grafico) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Token faltante, inicie sesión nuevamente");
      navigate('/'); // Redirige si no hay token
      return;
    }

    if (grafico === graficoSeleccionado) {
      return; // Si el gráfico ya está seleccionado, no hacer nada
    }

    try {
      await actualizarGraficoSeleccionado({ oficinaId, tipo, categoria, grafico, token });
      setGraficoSeleccionado(grafico);
      alert('Gráfico actualizado en la base de datos');
      navigate(-1);
    } catch (error) {
      if (error.message === 'Token inválido' || error.message === 'Token expirado') {
        alert("Token inválido o expirado, inicie sesión nuevamente");
        localStorage.removeItem('token'); // Elimina el token si es inválido o ha expirado
        navigate('/'); // Redirige al login
      } else {
        console.error('Error al actualizar gráfico:', error);
        alert('No se pudo actualizar el gráfico en la base de datos');
      }
    }
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

  return (
    <div className="seleccionar-grafico-container">
      <button onClick={() => navigate(-1)} className="volver-btn">🔙 Volver</button>
      <h2>Gráficos para sensor: {tipo}</h2>
      <p><strong>Oficina:</strong> {oficinaId}</p>

      <div className="opciones-container">
        <h3>Selecciona Gráfico Para {categoria === 'tiempo-real' ? 'Datos en Tiempo Real 📡' : 'Datos Históricos 🕓'}</h3>
        <div className="opciones-buttons-container">
          {opciones.map((opcion) => {
            const isSelected = opcion.valor === graficoSeleccionado;
            const isHovered = hovered === opcion.valor;
            const isClicked = clicked === opcion.valor;

            return (
              <button
                key={opcion.valor}
                onClick={() => manejarSeleccion(opcion.valor)}
                onMouseEnter={() => setHovered(opcion.valor)}
                onMouseLeave={() => {
                  setHovered(null);
                  setClicked(null);
                }}
                onMouseDown={() => setClicked(opcion.valor)}
                onMouseUp={() => setClicked(null)}
                className={`opcion-btn ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
                disabled={isSelected} // Desactiva el botón si ya está seleccionado
              >
                {opcion.nombre}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
