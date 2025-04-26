import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav style={{
      backgroundColor: '#007BFF',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        Wattwise
      </div>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/oficinas" style={isActive('/oficinas') ? activeLinkStyle : linkStyle}>Oficinas</Link>
        <Link to="/perfil" style={isActive('/perfil') ? activeLinkStyle : linkStyle}>Perfil</Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '500',
  transition: 'opacity 0.2s',
};

const activeLinkStyle = {
  ...linkStyle,
  textDecoration: 'underline',
  fontWeight: 'bold',
  fontSize: '18px',
  opacity: 0.9
};
