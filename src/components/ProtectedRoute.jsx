import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    return <Navigate to="/" />; // Si no hay usuario en localStorage, redirige al login
  }

  return children; // Si está logueado, muestra la página
}

export default ProtectedRoute;
