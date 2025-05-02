export const getUserProfile = async (token) => {
  try {
    const response = await fetch('http://localhost:5000/perfil', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token inválido o expirado, inicie sesión nuevamente');  // Maneja el caso de token inválido o expirado
      }
      throw new Error('Error al obtener los datos del perfil');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'No se pudo cargar el perfil');
  }
};
