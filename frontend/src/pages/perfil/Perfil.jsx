import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';
import { getUserProfile } from './PerfilService';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert("Token faltante, inicie sesión nuevamente");
      navigate('/'); // Redirige si no hay token
      return;
    }
  
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(token);  // Obtiene los datos del perfil
        setUsuario(data);  // Almacena los datos del perfil
      } catch (error) {
        const errorMessage = error.message || "Token inválido, expirado o faltante, inicie sesión nuevamente";
        alert(errorMessage);
        
        localStorage.removeItem('token'); // Elimina el token inválido o expirado
        setError(errorMessage);
        console.error(error);  // Para depuración
        navigate('/');  // Redirige al login
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, [navigate]);
  

  const handleLogout = () => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmacion) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  if (loading) {
    return <div className="perfil-cargando">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="perfil-error">{error}</div>;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2>👤 Perfil de {usuario.nombre}</h2>
        <p><strong>Nombre de usuario:</strong> {usuario.usuario}</p>
        <p><strong>Rol:</strong> {usuario.tipo_usuario || 'Usuario'}</p>
        <p><strong>Oficinas disponibles:</strong> {usuario.oficinas && usuario.oficinas.length > 0 ? usuario.oficinas.join(', ') : 'No especificado'}</p>

        <button
          className="perfil-logout-btn"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
