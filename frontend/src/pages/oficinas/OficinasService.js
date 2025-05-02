export const getUserOffices = async (token) => {
  const res = await fetch('http://localhost:5000/oficinas', {
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