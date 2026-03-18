import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavegar = (ruta: string) => {
    if (ruta === '#') {
      alert('Esta funcionalidad se desarrollará próximamente.');
    } else {
      navigate(ruta);
      setMenuAbierto(false); 
    }
  };

  return (
    <div style={{ backgroundColor: '#e8f4e9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <nav className="navbar navbar-expand-lg px-4 shadow-sm" style={{ backgroundColor: '#2d4a2d' }}>
        <div className="container-fluid">
          
          <span 
            className="navbar-brand fw-bold text-white d-flex align-items-center" 
            style={{ cursor: 'pointer' }}
            onClick={() => handleNavegar('/admin-home')} 
          >
            <i className="bi bi-shield-lock-fill me-2 fs-3"></i> Find Your Trip Admin
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

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet /> 
      </main>

    </div>
  );
};