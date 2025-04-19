import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/oficinas" style={{ marginRight: '1rem' }}>Oficinas</Link>
      <Link to="/perfil">Perfil</Link>
    </nav>
  );
}
