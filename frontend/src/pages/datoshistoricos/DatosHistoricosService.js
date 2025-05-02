import axios from 'axios';
import { DateTime } from 'luxon';

export async function obtenerDatosHistoricos({ tipo, oficinaId, fechaDesde, horaDesde, fechaHasta, horaHasta, token }) {
  const desde = DateTime.fromJSDate(fechaDesde).set({
    hour: parseInt(horaDesde.split(':')[0]),
    minute: parseInt(horaDesde.split(':')[1])
  }).toFormat("yyyy-MM-dd HH:mm:ss");

  const hasta = DateTime.fromJSDate(fechaHasta).set({
    hour: parseInt(horaHasta.split(':')[0]),
    minute: parseInt(horaHasta.split(':')[1])
  }).toFormat("yyyy-MM-dd HH:mm:ss");

    // Comprobar si la fecha de inicio es mayor que la fecha de fin
  if (DateTime.fromFormat(desde, "yyyy-MM-dd HH:mm:ss") > DateTime.fromFormat(hasta, "yyyy-MM-dd HH:mm:ss")) {
    throw new Error('La fecha de inicio no puede ser mayor que la fecha de fin');
  }

  try {
    const response = await axios.get(`https://wattwise-backend.onrender.com/datoshistoricos`, {
      params: {
        tipo,
        oficina: oficinaId,
        fechaDesde: desde,
        fechaHasta: hasta
      },
      headers: {
        'Authorization': `Bearer ${token}`,  // Incluye el token en el header
        'Content-Type': 'application/json'
      }
    });

    const mediciones = response.data.datos;
    const unidad = response.data.unidad;
    const tipoGrafico = response.data.tipoGrafico;

    const datosFormateados = mediciones.map(med => ({
      hora: new Date(med.timestamp.replace(" ", "T")),
      unidad: med.unidad,
      valor: med.valor
    }));

    return { datosFormateados, unidad, tipoGrafico };
  } catch (error) {
    if (error.response && error.response.status === 401) {  // Si el token es inválido o expirado
      throw new Error('Token inválido o expirado');
    }
    throw error;  // Otros errores
  }
}
