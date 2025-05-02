import axios from 'axios';

export async function actualizarGraficoSeleccionado({ oficinaId, tipo, categoria, grafico, token }) {
  const campo = categoria === 'tiempo-real' ? 'tiempo_real' : 'historico';
  const payload = { [campo]: grafico };

  try {
    const response = await axios.patch(
      `https://wattwise-backend.onrender.com/oficina/${oficinaId}/sensor/${tipo}/cambiargrafico`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {  // Si el token es inválido o expirado
      throw new Error('Token inválido o expirado');
    }
    throw error;  // Otros errores
  }
}

// Función para obtener el gráfico seleccionado
export async function obtenerGraficoSeleccionado({ oficinaId, tipo, categoria, token }) {
  const campo = categoria === 'tiempo-real' ? 'tiempo_real' : 'historico';
  
  try {
    const response = await axios.get(
      `https://wattwise-backend.onrender.com/oficina/${oficinaId}/sensor/${tipo}/grafico`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data[campo]; // Devuelve el gráfico actual (tiempo_real o historico)
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Token inválido o expirado');
    }
    throw error; // Otros errores
  }
}
