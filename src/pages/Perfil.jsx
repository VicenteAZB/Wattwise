import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUsuario = JSON.parse(localStorage.getItem('usuario'));
      if (storedUsuario) {
        setUsuario(storedUsuario);
      } else {
        navigate('/'); 
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  if (!usuario) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando perfil...</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
      <div style={{
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#fdfdfd'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>👤 Perfil de {usuario.nombre}</h2>
        <p><strong>Correo:</strong> {usuario.correo || 'No especificado'}</p>
        <p><strong>Rol:</strong> {usuario.rol || 'Usuario'}</p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: '2rem',
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
