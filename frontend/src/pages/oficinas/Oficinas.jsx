// src/components/Oficinas.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOffices } from './OficinasService';
import './Oficinas.css';

export default function Oficinas() {
  const [oficinas, setOficinas] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Token faltante, inicie sesión nuevamente");
      navigate('/');
      return;
    }
  
    (async () => {
      try {
        const userOffices = await getUserOffices(token);
        setOficinas(userOffices);
      } catch (err) {
        const message = err.message || 'No se pudieron cargar las oficinas';
  
        // Verificación de errores del token
        if (
          message.includes('Token inválido') ||
          message.includes('Token expirado') 
        ) {
          alert("Token inválido o expirado, inicie sesión nuevamente");
          localStorage.removeItem('token'); // Eliminar el token
          navigate('/'); // Redirigir al login o pantalla principal
        } else {
          setError(message); // Otro tipo de error
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleSelectOficina = (nombre) => {
    navigate(`/oficina/${nombre}`);
  };

  if (loading) {
    return <div className="oficinas-cargando">Cargando oficinas...</div>;
  }
  if (error) {
    return <div className="oficinas-error">Error: {error}</div>;
  }
  if (oficinas.length === 0) {
    return <div className="oficinas-empty">No tienes oficinas asignadas.</div>;
  }

  return (
    <div className="oficinas-container">
      <h2 className="oficinas-titulo">🏢 Selecciona una Oficina</h2>
      <div className="oficinas-grid">
        {oficinas.map((nombre) => (
          <div
            key={nombre}
            className="oficina-card"
            onClick={() => handleSelectOficina(nombre)}
          >
            <h3>{nombre}</h3>
            <p>Haz clic para ingresar</p>
          </div>
        ))}
      </div>
    </div>
  );
}
