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
    <div style={{ padding: '2rem' }}>
      <h2>Selecciona una oficina</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {oficinas.map((oficina) => (
          <div
            key={oficina.id}
            onClick={() => handleSelectOficina(oficina.id)}
            style={{
              margin: '1rem 0',
              padding: '1rem',
              background: '#f0f0f0',
              cursor: 'pointer',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              transition: 'background 0.3s'
            }}
          >
            <h3>{oficina.nombre}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
