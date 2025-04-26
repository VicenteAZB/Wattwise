import { useNavigate } from 'react-router-dom';

export default function Oficinas() {
  const navigate = useNavigate();

  const oficinas = [
    { id: 1, nombre: 'Oficina 1' },
    { id: 2, nombre: 'Oficina 2' },
    { id: 3, nombre: 'Oficina 3' }
  ];

  const handleSelectOficina = (id) => {
    navigate(`/oficina/${id}`);
  };

  return (
    <div style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <h2 style={{ marginBottom: '2rem' }}>🏢 Selecciona una Oficina</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '800px'
      }}>
        {oficinas.map((oficina) => (
          <div
            key={oficina.id}
            onClick={() => handleSelectOficina(oficina.id)}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              transition: 'transform 0.2s, background-color 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.backgroundColor = '#e9f5ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <h3 style={{ margin: 0 }}>{oficina.nombre}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Haz clic para ingresar</p>
          </div>
        ))}
      </div>
    </div>
  );
}
