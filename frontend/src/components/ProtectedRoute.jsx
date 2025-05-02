import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Token faltante, inicie sesión nuevamente");
    return <Navigate to="/" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      alert("Token expirado, inicie sesión nuevamente");
      localStorage.removeItem('token');
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    console.error("Token inválido:", e);
    alert("Token inválido, inicie sesión nuevamente");
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
