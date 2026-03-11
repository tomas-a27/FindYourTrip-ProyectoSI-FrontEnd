import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsuarioDTO } from '../../entities/entities';

export const InicioAdmin = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false); // Controla el menú hamburguesa

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      if (user.tipoUsuario !== 'Administrador' && user.tipoUsuario !== 'administrador') {
         navigate('/home');
      } else {
         setUsuario(user);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!usuario) return null;

  // Lista de opciones exactamente como las describiste
  const opciones = [
    { 
      titulo: 'Solicitudes para ser conductor', 
      descripcion: 'Permite revisar a los usuarios que han pedido permiso para manejar en la plataforma.',
      ruta: '/aprobar-conductores' 
    },
    { 
      titulo: 'Informe de conductores ordenados por calificación', 
      descripcion: 'Muestra un listado basado en el puntaje o reseñas de los conductores.',
      ruta: '#' 
    },
    { 
      titulo: 'Usuarios a sancionar (o en condición)', 
      descripcion: 'Sección para gestionar a usuarios que han cometido faltas.',
      ruta: '#' 
    },
    { 
      titulo: 'Listado de localidades', 
      descripcion: 'Acceso a la base de datos de las ciudades o puntos cubiertos por el servicio.',
      ruta: '/mostrar-localidad' 
    },
    { 
      titulo: 'Informe de rutas frecuentes', 
      descripcion: 'Ver informe de rutas más frecuentes y su precio promedio, en el último mes.',
      ruta: '#' 
    },
  ];

  const handleNavegar = (ruta: string) => {
    if (ruta === '#') {
      alert('Esta funcionalidad se desarrollará próximamente.');
    } else {
      navigate(ruta);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#e8f4e9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <nav className="navbar navbar-expand-lg px-4 shadow-sm" style={{ backgroundColor: '#2d4a2d' }}>
        <div className="container-fluid">
          
          <span className="navbar-brand fw-bold text-white d-flex align-items-center" style={{ cursor: 'pointer' }}>
            <i className="bi bi-shield-lock-fill me-2 fs-3"></i> Find Your Trip
          </span>

          <button 
            className="navbar-toggler bg-light" 
            type="button" 
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`}>
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 text-center">
              <li className="nav-item mx-2">
                <button className="nav-link text-white fw-semibold btn btn-link" onClick={() => handleNavegar('/aprobar-conductores')}>Solicitudes</button>
              </li>
              <li className="nav-item mx-2">
                <button className="nav-link text-white fw-semibold btn btn-link" onClick={() => handleNavegar('#')}>Sanciones</button>
              </li>
              <li className="nav-item mx-2">
                <button className="nav-link text-white fw-semibold btn btn-link" onClick={() => handleNavegar('/mostrar-localidad')}>Localidades</button>
              </li>
              <li className="nav-item mx-2">
                <button className="nav-link text-white fw-semibold btn btn-link" onClick={() => handleNavegar('#')}>Informes</button>
              </li>
            </ul>
            
            <div className="d-flex justify-content-center mt-2 mt-lg-0">
               <button className="btn btn-outline-light btn-sm px-3" onClick={cerrarSesion}>Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container d-flex flex-grow-1 justify-content-center align-items-center my-5">
        
        <div className="card shadow-lg w-100" style={{ maxWidth: '800px', borderRadius: '15px', border: 'none' }}>
          <div className="card-body p-4 p-md-5">
            <h2 className="text-center mb-4 fw-bold" style={{ color: '#2d4a2d' }}>Menú de Gestión Administrador</h2>

            {/* Menú principal con botones verticales */}
            <div className="d-flex flex-column gap-3">
              {opciones.map((opcion, index) => (
                <button
                  key={index}
                  onClick={() => handleNavegar(opcion.ruta)}
                  className="btn text-start p-3 border shadow-sm d-flex flex-column"
                  style={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#e0e0e0',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f8f1'; // Fondo verde muy clarito al pasar el mouse
                    e.currentTarget.style.borderColor = '#b2d8b2';
                    e.currentTarget.style.transform = 'translateX(5px)'; // Pequeño movimiento a la derecha
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

    </div>
  );
};