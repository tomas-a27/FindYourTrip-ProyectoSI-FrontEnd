import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.tsx';

export const InicioAdmin = () => {
  const navigate = useNavigate();
  const { userTipo } = useAuth();

  useEffect(() => {
    if (!userTipo) {
      navigate('/login');
    } else if (userTipo.toLowerCase() !== 'administrador') {
      navigate('/home');
    }
  }, [userTipo, navigate]);

  if (!userTipo) return null;

  const opciones = [
    { titulo: 'Solicitudes para ser conductor', descripcion: 'Permite revisar a los usuarios que han pedido permiso para manejar en la plataforma.', ruta: '/aprobar-conductores' },
    { titulo: 'Usuarios a sancionar (o en condición)', descripcion: 'Sección para gestionar a usuarios que han cometido faltas.', ruta: '/usuarios-a-sancionar' },
    { titulo: 'Listado de localidades', descripcion: 'Acceso a la base de datos de las ciudades o puntos cubiertos por el servicio.', ruta: '/mostrar-localidad' },
    { titulo: 'Informe de conductores ordenados por calificación', descripcion: 'Muestra un listado basado en el puntaje o reseñas de los conductores.', ruta: '/informe-conductores' },
    { titulo: 'Informe de rutas frecuentes', descripcion: 'Ver informe de rutas más frecuentes y su precio promedio, en el último mes.', ruta: '/informe-rutas-mas-frecuentes' },
  ];

  const handleNavegar = (ruta: string) => {
    if (ruta === '#') {
      alert('Esta funcionalidad se desarrollará próximamente.');
    } else {
      navigate(ruta);
    }
  };

  return (
    <div className="container d-flex flex-grow-1 justify-content-center align-items-center my-4">
      <div className="card shadow-lg w-100" style={{ maxWidth: '800px', borderRadius: '15px', border: 'none' }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center mb-4 fw-bold" style={{ color: '#2d4a2d' }}>Menú de Gestión Administrador</h2>

          <div className="d-flex flex-column gap-3">
            {opciones.map((opcion, index) => (
              <button
                key={index}
                onClick={() => handleNavegar(opcion.ruta)}
                className="btn text-start p-3 border shadow-sm d-flex flex-column"
                style={{ 
                  backgroundColor: '#ffffff', borderColor: '#e0e0e0', borderRadius: '10px', transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f8f1';
                  e.currentTarget.style.borderColor = '#b2d8b2';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span className="fw-bold fs-5" style={{ color: '#2d4a2d' }}>{opcion.titulo}</span>
                <small className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>{opcion.descripcion}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};