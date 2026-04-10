import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getOne } from '../../api/dataManager';
import { UsuarioDTO } from '../../entities/entities';
import { useAuth } from '../../auth/AuthContext.tsx';
import { ModalAlertAviso } from '../ModalAlert.tsx';

export const MiCuenta = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { userId, logout } = useAuth();

  const [mostrarConfirmarLogout, setMostrarConfirmarLogout] = useState(false);
  const [mostrarModalAviso, setMostrarModalAviso] = useState(false);
  
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingConductor, setLoadingConductor] = useState(false);

  if (userId !== Number(id)) {
    return <p className="text-center mt-5">No autorizado</p>;
  }

  const { data: usuario } = getOne<UsuarioDTO>('usuario/' + userId);

  if (!usuario) {
    return (
      <div className="text-center mt-5 p-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3 text-muted fw-bold">Cargando tu cuenta...</p>
      </div>
    );
  }

  if (!usuario.idUsuario) {
    return <p className="text-center mt-5 font-bold">Usuario no encontrado</p>;
  }

  // Chequeamos si es conductor para mostrar la versión extendida
  const esConductor = usuario.tipoUsuario?.toLowerCase() === 'conductor';
  const isPendiente = usuario.estadoConductor?.toLowerCase() === 'pendiente';

  // Función para la foto de perfil
  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data) return '';
    const binary = buffer.data
      .map((byte: number) => String.fromCharCode(byte))
      .join('');
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  const handleLogout = async () => {
    setLoadingLogout(true); 
    setTimeout(() => {
      logout();
      navigate('/');
    }, 500); 
  };

  const irAMisViajesConductor = () => {
    esConductor
      ? localStorage.setItem('vistaActiva', 'conductor')
      : localStorage.setItem('vistaActiva', 'pasajero');
    navigate('/mis-viajes');
  };

  const handleQuieroSerConductor = () => {
    setLoadingConductor(true); 
        setTimeout(() => {
      if (isPendiente) {
        setMostrarModalAviso(true);
        setLoadingConductor(false);
      } else {
        navigate('/solicitar-conductor');
      }
    }, 300);
  };

  return (
    <div className="container my-4 mb-5 pb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          <div className="d-flex justify-content-between align-items-center mb-4 px-3 py-3 bg-white rounded-4 shadow-sm border">
            <div className="flex-grow-1">
              <h2
                className="fw-bold mb-2 text-dark"
                style={{ letterSpacing: '-1px' }}
              >
                {usuario.nombreUsuario} {usuario.apellidoUsuario}
              </h2>

              <div className="d-flex gap-3">
                <div className="text-center">
                  <p
                    className="mb-1 fw-bold text-muted"
                    style={{ fontSize: '12px', textTransform: 'uppercase' }}
                  >
                    Pasajero
                  </p>
                  <div className="calificacion-badge">
                    <i className="bi bi-star-fill text-warning"></i>{' '}
                    <span className="fw-bold">
                      {usuario.calificacionPas?.toFixed(2) || 'Sin calificar'}
                    </span>
                  </div>
                </div>

                {esConductor && (
                  <div className="text-center">
                    <p
                      className="mb-1 fw-bold text-muted"
                      style={{ fontSize: '12px', textTransform: 'uppercase' }}
                    >
                      Conductor
                    </p>
                    <div className="calificacion-badge">
                      <i className="bi bi-star-fill text-warning"></i>{' '}
                      <span className="fw-bold">
                        {usuario.calificacionConductor?.toFixed(2) ||
                          'Sin calificar'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* condicional: muestra foto si es conductor, boton si es pasajero */}
            <div
              className="ms-3 text-end"
              style={{ minWidth: esConductor ? '90px' : '120px' }}
            >
              {esConductor ? (
                <img
                  src={
                    usuario.fotoPerfil
                      ? bufferToBase64(usuario.fotoPerfil)
                      : 'https://via.placeholder.com/150'
                  }
                  className="usuario-foto-grande shadow-sm border border-2 border-white"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '50%', // Asegura que sea redonda
                  }}
                  alt="Perfil"
                />
              ) : (
                <button
                  className="btn btn-pastel-green btn-sm rounded-pill px-3 shadow-sm text-wrap d-flex justify-content-center align-items-center"
                  style={{ maxWidth: '190px', fontSize: '16px', minHeight: '40px' }}
                  onClick={handleQuieroSerConductor}
                  disabled={loadingConductor} 
                >
                  {loadingConductor ? (
                    <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                  ) : (
                    'Quiero ser conductor'
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="editar-usuario-card shadow-lg p-4 bg-white rounded-4 border">
            <div
              className="custom-card bg-light p-3 rounded-4 mb-4 shadow-sm"
              style={{ borderTop: '6px solid #2d4a2d' }}
            >
              <h6 className="fw-bold border-bottom pb-2 mb-3 text-dark">
                Datos personales
              </h6>

              <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="text-muted small fw-bold">Teléfono</span>
                <span className="fw-medium">{usuario.telefono}</span>
              </div>

              <div className="mb-2 d-flex justify-content-between align-items-center gap-2">
                <span className="text-muted small fw-bold">Email</span>
                <span
                  className="fw-medium ms-2 text-end"
                  title={usuario.email}
                  style={{
                    maxWidth: '65%',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {usuario.email}
                </span>
              </div>

              <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="text-muted small fw-bold">
                  {usuario.tipoDocumento}
                </span>
                <span className="fw-medium">
                  {usuario.nroDocumento || '---'}
                </span>
              </div>

              {esConductor && (
                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="text-muted small fw-bold">Licencia</span>
                  <span className="fw-medium">
                    {usuario.nroLicenciaConductorUsuario || '---'}
                  </span>
                </div>
              )}

              {/* Botones de acción rápida */}
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <button
                  className="btn btn-outline-success btn-sm px-4 rounded-pill fw-bold"
                  onClick={() => navigate(`/editar-usuario/${userId}`)}
                >
                  Editar datos personales
                </button>
              </div>
            </div>

            {/* MENÚ DE OPCIONES */}
            <div className="menu-navegacion d-grid gap-2">
              <div
                className="campo-box d-flex align-items-center shadow-sm pointer py-3 px-3 rounded-3"
                onClick={irAMisViajesConductor}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaeaea',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f8f1';
                  e.currentTarget.style.borderColor = '#b2d8b2';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#eaeaea';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <i className="bi bi-car-front-fill fs-4 me-3 text-dark"></i>
                <span className="fw-bold flex-grow-1">
                  {esConductor ? 'Viajes como conductor' : 'Mis viajes'}
                </span>
                <i className="bi bi-chevron-right text-muted"></i>
              </div>

              {esConductor && (
                <div
                  className="campo-box d-flex align-items-center shadow-sm pointer py-3 px-3 rounded-3"
                  onClick={() => navigate(`/mostrar-vehiculo/${userId}`)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaeaea',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f8f1';
                    e.currentTarget.style.borderColor = '#b2d8b2';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#eaeaea';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <i className="bi bi-car-front fs-4 me-3 text-dark"></i>
                  <span className="fw-bold flex-grow-1">Mis vehículos</span>
                  <i className="bi bi-chevron-right text-muted"></i>
                </div>
              )}

              <div
                className="campo-box d-flex align-items-center shadow-sm pointer py-3 px-3 rounded-3"
                onClick={() => navigate('/centro-ayuda')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaeaea',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f8f1';
                  e.currentTarget.style.borderColor = '#b2d8b2';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#eaeaea';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <i className="bi bi-life-preserver fs-4 me-3 text-dark"></i>
                <span className="fw-bold flex-grow-1">Ayuda</span>
                <i className="bi bi-chevron-right text-muted"></i>
              </div>

              <div
                className="campo-box d-flex align-items-center shadow-sm pointer py-3 px-3 rounded-3"
                onClick={() => navigate('/politicas-uso')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaeaea',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f8f1';
                  e.currentTarget.style.borderColor = '#b2d8b2';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#eaeaea';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <i className="bi bi-clipboard2-check fs-4 me-3 text-dark"></i>
                <span className="fw-bold flex-grow-1">Políticas de uso</span>
                <i className="bi bi-chevron-right text-muted"></i>
              </div>
            </div>

            {/* BOTÓN CERRAR SESIÓN */}
            <button
              onClick={() => setMostrarConfirmarLogout(true)}
              className="btn btn-light w-100 mt-4 py-3 fw-bold rounded-4 shadow-sm border text-danger"
              style={{ transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8d7da';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN */}
      {mostrarConfirmarLogout && (
        <div className="modal-overlay">
          <div className="custom-modal p-4 text-center">
            {/* Botón X */}
            <button
              onClick={() => setMostrarConfirmarLogout(false)}
              disabled={loadingLogout} 
              className="btn-cerrar position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-5 text-muted"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="mb-1">
              <i
                className="bi bi-box-arrow-right text-danger"
                style={{ fontSize: '3rem' }}
              ></i>
            </div>

            <h5 className="fw-bold mb-4">
              ¿Está seguro que desea cerrar sesión?
            </h5>

            <div className="d-grid gap-2">
              <button
                onClick={handleLogout}
                disabled={loadingLogout} 
                className="btn btn-danger py-2 fw-bold rounded-3 shadow-sm d-flex justify-content-center align-items-center"
              >
                {loadingLogout ? (
                  <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                ) : (
                  'Sí, cerrar sesión'
                )}
              </button>
              <button
                onClick={() => setMostrarConfirmarLogout(false)}
                disabled={loadingLogout} 
                className="btn btn-light py-2 fw-bold rounded-3 border"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalAlertAviso
        show={mostrarModalAviso}
        onClose={() => setMostrarModalAviso(false)}
        message="Ya tenés una solicitud pendiente para ser conductor."
      />
    </div>
  );
};