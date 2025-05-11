// src/services/AlertasProgramadasService.js

export async function cargarDatos(oficinaId, sensorNombre) {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://wattwise-backend.onrender.com/oficina/${oficinaId}/sensor/${sensorNombre}/alertas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  }
  
  export async function guardarAlertas(oficinaId, sensorNombre, alertas) {
    const token = localStorage.getItem('token');
    await fetch(`https://wattwise-backend.onrender.com/oficina/${oficinaId}/sensor/${sensorNombre}/alertas`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alertas)
    });
  }
  