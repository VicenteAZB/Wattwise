export const getUserOffices = async (token) => {
  const res = await fetch('https://wattwise-backend.onrender.com/oficinas', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'No se pudieron obtener las oficinas');
  }

  const data = await res.json();
  return data.oficinas;  // Array de strings: ['Oficina 1', 'Oficina 2', …]
};