import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsuario = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(storedUsuario);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/'); 
  };

  if (!usuario) {
    return <div>Cargando...</div>; 
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Perfil de {usuario.nombre}</h2> 
      <p>Bienvenido a tu perfil.</p>
      <button
        onClick={handleLogout}
        style={{ padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '5px' }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
