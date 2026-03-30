import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarConfirmarLogout, setMostrarConfirmarLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
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
              <button
                onClick={() => setMostrarConfirmarLogout(true)}
                className="btn btn-outline-light btn-sm px-3"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet /> 
      </main>
      {/* MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN */}
      {mostrarConfirmarLogout && (
        <div className="modal-overlay">
          <div className="custom-modal p-4 text-center">
            {/* Botón X */}
            <button
              onClick={() => setMostrarConfirmarLogout(false)}
              className="btn-cerrar position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-5 text-muted"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="mb-1">
              <i className="bi bi-box-arrow-right text-danger" style={{ fontSize: '3rem' }}></i>
            </div>

            <h5 className="fw-bold mb-3">¿Está seguro que desea cerrar sesión?</h5>

            <div className="d-grid gap-2">
              <button
                onClick={handleLogout}
                className="btn btn-danger py-2 fw-bold rounded-3 shadow-sm"
              >
                Sí, cerrar sesión
              </button>
              <button
                onClick={() => setMostrarConfirmarLogout(false)}
                className="btn btn-light py-2 fw-bold rounded-3 border"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};