import axios from 'axios';

const LOGIN_URL = 'http://localhost:5000/login';  // Asegúrate de cambiar la URL a la correcta

export const loginUser = async (usuario, password) => {
  try {
    const response = await axios.post(LOGIN_URL, {
      usuario,
      password,
    });
    return response.data;  // Devuelve el token y la información del usuario
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error de conexión');
  }
};
