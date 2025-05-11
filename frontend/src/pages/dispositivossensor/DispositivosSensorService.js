// src/services/DispositivosSensorService.js
import axios from 'axios';

export const fetchDispositivos = async (oficinaId, tipo, setDispositivos) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `https://wattwise-backend.onrender.com/oficina/${oficinaId}/sensor/${tipo}/obtenerdispositivos`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDispositivos(response.data.dispositivos);
    console.log(response.data.dispositivos);
  } catch (error) {
    console.error('Error al obtener dispositivos:', error);
    alert('No se pudieron cargar los dispositivos');
  }
};

export const toggleEstadoDispositivo = async (
  nombre,
  dispositivos,
  setDispositivos,
  oficinaId,
  tipo
) => {
  const dispositivo = dispositivos.find((d) => d.nombre === nombre);
  const estadoActual = dispositivo.estado;
  const nuevoEstado = estadoActual === 1 ? 0 : 1;
  const accion = nuevoEstado === 1 ? 'encender' : 'apagar';

  const confirmacion = window.confirm(
    `¿Estás seguro de que quieres ${accion} el dispositivo ${nombre}?`
  );

  if (!confirmacion) return;

  try {
    const token = localStorage.getItem('token');
    await axios.put(
      `https://wattwise-backend.onrender.com/oficina/${oficinaId}/sensor/${tipo}/actualizardispositivo`,
      {
        nombre_dispositivo: nombre,
        estado: nuevoEstado,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    setDispositivos((prev) =>
      prev.map((d) =>
        d.nombre === nombre ? { ...d, estado: nuevoEstado } : d
      )
    );
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    alert('Error al actualizar el estado del dispositivo.');
  }
};
