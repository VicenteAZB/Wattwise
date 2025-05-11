import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { loginUser } from './LoginService'; 

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      navigate('/oficinas'); // Si ya hay token, redirige al usuario
    } else {
      alert("Para acceder a Oficina de Dirección General y Oficina Administrativa utilice:\nUsuario: gcontreras\nContraseña: 1234\nPara acceder a Oficina de Finanzas utilice:\nUsuario: valvarez\nContraseña: 1234");
    }
  }, [navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Llamar al servicio de login
      const data = await loginUser(usuario, password);
      
      // Guardar el token y la información del usuario en el almacenamiento local
      localStorage.setItem('token', data);
      
      alert('¡Inicio de sesión exitoso!');
      navigate('/oficinas');  // Redirigir al usuario a la página de oficinas
    } catch (error) {
      setError(error.message);  // Mostrar mensaje de error si las credenciales son incorrectas
    }
  };
  
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">🔐 Iniciar Sesión</h2>

        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => {
              setUsuario(e.target.value);
              if (error) setError('');
            }}
            required
            className="login-input"
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            required
            className="login-input"
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button
          type="submit"
          className="login-button"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
