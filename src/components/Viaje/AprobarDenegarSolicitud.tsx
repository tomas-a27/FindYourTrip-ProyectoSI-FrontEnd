import { SolicitudViajeDTO } from '../../entities/entities.ts';
import { getAsync } from '../../api/dataManager.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ModalConfirmacionDenegarAprobar from './ModalConfirmacionDenegarAprobar.tsx';

export const AprobarDenegarSolicitud = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [solicitudPendiente, setSolicitudPendiente] = useState<SolicitudViajeDTO[]>([]);
  const [solicitudPendienteLoading, setSolicitudPendienteLoading] = useState(true);
  const [solicitudPendienteError, setSolicitudPendienteError] = useState(false);

  const [solicitudAprobadaRechazada, setSolicitudAprobadaRechazada] = useState<SolicitudViajeDTO[]>([]);
  const [solicitudAprobadaRechazadaLoading, setSolicitudAprobadaRechazadaLoading] = useState(true);
  const [solicitudAprobadaRechazadaError, setSolicitudAprobadaRechazadaError] = useState(false);

  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [viajeInfo, setViajeInfo] = useState<any>(null);

  useEffect(() => {
    if (!location.state || !location.state.viajeId) {
      navigate('/mis-viajes');
      return;
    }
    cargarDatos();
  }, [location, navigate]);

  const cargarDatos = async (esRecargaOculta = false) => {
    if (!esRecargaOculta) {
      setSolicitudPendienteLoading(true);
      setSolicitudAprobadaRechazadaLoading(true);
    }

    try {
      const resPendiente = await getAsync<any>('viaje/solicitudes-pendientes-viaje/' + location.state.viajeId);
      setSolicitudPendiente(resPendiente.data?.data || resPendiente.data || []);
      setSolicitudPendienteError(false);
    } catch (e) {
      setSolicitudPendienteError(true);
      setSolicitudPendiente([]);
    } finally {
      if (!esRecargaOculta) setSolicitudPendienteLoading(false);
    }

    try {
      const resAprobadas = await getAsync<any>('viaje/solicitudes-aprobadas-rechazadas-viaje/' + location.state.viajeId);
      setSolicitudAprobadaRechazada(resAprobadas.data?.data || resAprobadas.data || []);
      setSolicitudAprobadaRechazadaError(false);
    } catch (e) {
      setSolicitudAprobadaRechazadaError(true);
      setSolicitudAprobadaRechazada([]);
    } finally {
      if (!esRecargaOculta) setSolicitudAprobadaRechazadaLoading(false);
    }

    try {
      const resViaje = await getAsync<any>('viaje/detalle/' + location.state.viajeId);
      setViajeInfo(resViaje.data?.data);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleHistorial = () => {
    setMostrarHistorial(!mostrarHistorial);
  };

  if (!location.state) return null;

  return (
    <div className="pb-5" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <div className="container mt-4 mt-md-5" style={{ maxWidth: '900px' }}>
        
        <div className="d-flex align-items-center mb-4">
          <button 
            className="btn btn-link text-dark p-0 me-3" 
            onClick={() => navigate('/mis-viajes')}
            style={{ fontSize: '1.5rem', textDecoration: 'none' }}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h2 className="fw-bold m-0" style={{ color: '#333333', fontSize: '1.5rem' }}>
            Solicitudes del viaje
          </h2>
        </div>

        <div className="card shadow-sm border-0 mb-5 rounded-4" style={{ backgroundColor: '#eaf5ea' }}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-2 text-dark">
              {location.state.viajeOrigen} <i className="bi bi-arrow-right mx-2 text-muted"></i> {location.state.viajeDestino}
            </h5>
            <div className="d-flex flex-wrap text-muted gap-4 mt-2" style={{ fontSize: '0.95rem' }}>
              <span><i className="bi bi-calendar3 me-2"></i> {location.state.viajeFecha.split('-').reverse().join('/') || location.state.viajeFecha}</span>
              <span className="fw-bold" style={{ color: '#2d4a2d' }}>
                <i className="bi bi-person-check-fill me-2"></i>
                Quedan: {viajeInfo?.lugaresDisponibles ?? location.state.lugaresDisponibles} lugares disponibles
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {solicitudPendienteLoading && <p className="text-center mt-3 text-muted">Cargando solicitudes...</p>}

        {!solicitudPendienteLoading && !solicitudPendienteError && solicitudPendiente.length === 0 && (
          <div className="container">
            <div className="alert alert-light border text-center text-muted rounded-4">No hay solicitudes pendientes en este momento.</div>
          </div>
        )}

        {!solicitudPendienteLoading && !solicitudPendienteError && solicitudPendiente.length > 0 && (
          <div className="container">
            <h5 className="fw-bold mb-3 text-dark">Pendientes de revisión</h5>
            <div className="row">
              {solicitudPendiente.map((solicitud, index) => (
                <div key={index} className="col-12 col-lg-6 mb-4">
                  <div className="card border-1 shadow-sm p-3 h-100" style={{ borderRadius: '20px', backgroundColor: '#fff' }}>
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              <div 
                                className="bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white fw-bold me-2"
                                style={{ width: '35px', height: '35px', fontSize: '0.9rem' }}
                              >
                                {solicitud.usuario?.nombreUsuario?.charAt(0)}{solicitud.usuario?.apellidoUsuario?.charAt(0)}
                              </div>
                              <h6 className="fw-bold mb-0 me-2" style={{ fontSize: '1.1rem' }}>
                                {solicitud.usuario?.nombreUsuario} {solicitud.usuario?.apellidoUsuario}
                              </h6>
                              <span className="badge rounded-pill bg-light text-dark border shadow-sm" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                                <i className="bi bi-star-fill text-warning me-1"></i>
                                {solicitud.usuario?.calificacionPas || 'S/C'}
                              </span>
                            </div>
                            <p className="text-muted mb-0 small mt-2">
                              <strong>Documento: </strong> {solicitud.usuario?.tipoDocumento} {solicitud.usuario?.nroDocumento}
                            </p>
                            <p className="text-muted mb-0 small">
                              <strong>Género: </strong> {solicitud.usuario?.generoUsuario}
                            </p>
                          </div>
                        </div>

                        <div className="text-end text-muted small">
                          <div className="d-flex flex-column align-items-center">
                            <i className="bi bi-clock-fill text-warning mb-1" style={{ fontSize: '1.8rem' }}></i>
                            <div className="fw-bold text-dark fs-6">
                              {solicitud.estadoSolicitud?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-end mt-4 gap-2 border-top pt-3">
                        <ModalConfirmacionDenegarAprobar
                          query={'viaje/solicitudes-aprobadas-rechazadas-viaje-denegar/' + solicitud.solViajeId}
                          nombre={solicitud.usuario?.nombreUsuario}
                          apellido={solicitud.usuario?.apellidoUsuario}
                          accion="denegar"
                          onSuccess={() => cargarDatos(true)} 
                        />
                        <ModalConfirmacionDenegarAprobar
                          query={'viaje/solicitudes-aprobadas-rechazadas-viaje-aprobar/' + solicitud.solViajeId}
                          nombre={solicitud.usuario?.nombreUsuario}
                          apellido={solicitud.usuario?.apellidoUsuario}
                          accion="aprobar"
                          onSuccess={() => cargarDatos(true)} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="container mt-5 mb-5 pb-5 text-center" style={{ maxWidth: '900px' }}>
          
          <div 
            onClick={toggleHistorial} 
            style={{ 
              cursor: 'pointer', 
              padding: '10px 20px', 
              borderRadius: '30px', 
              backgroundColor: '#f8f9fa',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background-color 0.2s ease'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          >
            <span className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>
              Ver solicitudes aprobadas y denegadas
            </span>
            <i
              className="bi bi-chevron-down text-dark"
              style={{
                fontSize: '1.2rem',
                transition: 'transform 0.3s ease',
                transform: mostrarHistorial ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            ></i>
          </div>

          {mostrarHistorial && (
            <div className="mt-4 text-start">
              {!solicitudAprobadaRechazadaLoading && !solicitudAprobadaRechazadaError && solicitudAprobadaRechazada.length === 0 && (
                <div className="alert alert-light border text-center text-muted rounded-4">No hay solicitudes en el historial.</div>
              )}

              {!solicitudAprobadaRechazadaLoading && !solicitudAprobadaRechazadaError && solicitudAprobadaRechazada.length > 0 && (
                <div className="row">
                  {solicitudAprobadaRechazada.map((solicitud, index) => (
                    <div key={index} className="col-12 col-lg-6 mb-4">
                      <div className="card border-1 shadow-sm p-3 h-100" style={{ borderRadius: '20px', backgroundColor: '#fff' }}>
                        <div className="card-body p-2">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <div className="d-flex align-items-center mb-1">
                                  <div 
                                    className="bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white fw-bold me-2"
                                    style={{ width: '35px', height: '35px', fontSize: '0.9rem' }}
                                  >
                                    {solicitud.usuario?.nombreUsuario?.charAt(0)}{solicitud.usuario?.apellidoUsuario?.charAt(0)}
                                  </div>
                                  <h6 className="fw-bold mb-0 me-2" style={{ fontSize: '1.1rem' }}>
                                    {solicitud.usuario?.nombreUsuario} {solicitud.usuario?.apellidoUsuario}
                                  </h6>
                                  <span className="badge rounded-pill bg-light text-dark border shadow-sm" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                                    <i className="bi bi-star-fill text-warning me-1"></i>
                                    {solicitud.usuario?.calificacionPas || 'S/C'}
                                  </span>
                                </div>
                                <p className="text-muted mb-0 small mt-2">
                                  <strong>Documento: </strong> {solicitud.usuario?.tipoDocumento} {solicitud.usuario?.nroDocumento}
                                </p>
                                <p className="text-muted mb-0 small">
                                  <strong>Género: </strong> {solicitud.usuario?.generoUsuario}
                                </p>
                                {solicitud.estadoSolicitud?.toUpperCase() === 'APROBADA' && (
                                  <div className="mt-2 p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                                    <p className="text-dark mb-1 small fw-medium">
                                      <i className="bi bi-telephone-fill me-2 text-muted"></i> {solicitud.usuario?.telefono}
                                    </p>
                                    <p className="text-dark mb-0 small fw-medium">
                                      <i className="bi bi-envelope-fill me-2 text-muted"></i> {solicitud.usuario?.email}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-end text-muted small">
                              <div className="d-flex flex-column align-items-center">
                                {solicitud.estadoSolicitud?.toUpperCase() === 'APROBADA' ? (
                                  <i className="bi bi-check-circle-fill text-success mb-1" style={{ fontSize: '1.8rem' }}></i>
                                ) : (
                                  <i className="bi bi-x-circle-fill text-danger mb-1" style={{ fontSize: '1.8rem' }}></i>
                                )}
                                <div className="fw-bold text-dark fs-6">
                                  {solicitud.estadoSolicitud?.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};