import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar">
      <div className="navbar-logo">Wattwise</div>
      <div className="navbar-links">
        <Link to="/oficinas" className={isActive('/oficinas') ? 'active-link' : 'link'}>Oficinas</Link>
        <Link to="/perfil" className={isActive('/perfil') ? 'active-link' : 'link'}>Perfil</Link>
      </div>
    </nav>
  );
}
