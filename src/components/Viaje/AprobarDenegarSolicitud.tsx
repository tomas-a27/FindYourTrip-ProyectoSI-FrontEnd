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
    <div>
      <div className="container mt-4">
        <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>
          Viaje a {location.state.viajeDestino}
        </h3>

        <div className="p-2 border border-secondary rounded mb-4" style={{ backgroundColor: '#A9D1A0', color: '#1a2b3c' }}>
          <div className="d-flex justify-content-between mb-1">
            <span>Desde: {location.state.viajeOrigen}</span>
            <span>Fecha: {location.state.viajeFecha}</span>
          </div>
          <div>
            <span className="fw-bold">
              Quedan: {viajeInfo?.lugaresDisponibles ?? location.state.lugaresDisponibles} lugares disponibles
            </span>
          </div>
        </div>
      </div>

      <div>
        {solicitudPendienteLoading && <p className="text-center mt-3 text-muted">Cargando solicitudes...</p>}

        {!solicitudPendienteLoading && !solicitudPendienteError && solicitudPendiente.length === 0 && (
          <div className="container"><div className="alert alert-info">No hay solicitudes pendientes.</div></div>
        )}

        {!solicitudPendienteLoading && !solicitudPendienteError && solicitudPendiente.length > 0 && (
          <div className="container mt-4">
            <div className="row">
              {solicitudPendiente.map((solicitud, index) => (
                <div key={index} className="col-12 col-lg-6 mb-4">
                  <div className="card border-1 shadow-sm p-3 h-100" style={{ borderRadius: '20px', backgroundColor: '#fff' }}>
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              <h6 className="fw-bold mb-0 me-2" style={{ fontSize: '1.1rem' }}>
                                {solicitud.usuario?.nombreUsuario} {solicitud.usuario?.apellidoUsuario}
                              </h6>
                              <span className="badge rounded-pill bg-light text-dark border shadow-sm" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                                <i className="bi bi-star text-warning me-1"></i>
                                {solicitud.usuario?.calificacionPas || 'S/C'}
                              </span>
                            </div>
                            <p className="text-muted mb-0 small">
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
                      
                      <div className="d-flex justify-content-end mt-3 gap-2">
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
        <div className="container mt-5 text-center mb-5 pb-5">
          <div onClick={toggleHistorial} style={{ cursor: 'pointer' }} className="d-inline-block">
            <p className="text-info fw-bold mb-1" style={{ textDecoration: 'underline' }}>
              Ver las solicitudes ya aprobadas o denegadas
            </p>
            <i
              className="bi bi-arrow-down-circle text-secondary"
              style={{
                fontSize: '2rem',
                display: 'inline-block',
                transition: 'transform 0.3s ease',
                transform: mostrarHistorial ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            ></i>
          </div>

          {mostrarHistorial && (
            <div className="mt-4 text-start">
              {!solicitudAprobadaRechazadaLoading && !solicitudAprobadaRechazadaError && solicitudAprobadaRechazada.length === 0 && (
                <div className="alert alert-info">No hay solicitudes en el historial.</div>
              )}

              {!solicitudAprobadaRechazadaLoading && !solicitudAprobadaRechazadaError && solicitudAprobadaRechazada.length > 0 && (
                <div className="container mt-4">
                  <div className="row">
                    {solicitudAprobadaRechazada.map((solicitud, index) => (
                      <div key={index} className="col-12 col-lg-6 mb-4">
                        <div className="card border-1 shadow-sm p-3 h-100" style={{ borderRadius: '20px', backgroundColor: '#fff' }}>
                          <div className="card-body p-2">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <div className="d-flex align-items-center mb-1">
                                    <h6 className="fw-bold mb-0 me-2" style={{ fontSize: '1.1rem' }}>
                                      {solicitud.usuario?.nombreUsuario} {solicitud.usuario?.apellidoUsuario}
                                    </h6>
                                    <span className="badge rounded-pill bg-light text-dark border shadow-sm" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                                      <i className="bi bi-star text-warning me-1"></i>
                                      {solicitud.usuario?.calificacionPas || 'S/C'}
                                    </span>
                                  </div>
                                  <p className="text-muted mb-0 small">
                                    <strong>Documento: </strong> {solicitud.usuario?.tipoDocumento} {solicitud.usuario?.nroDocumento}
                                  </p>
                                  <p className="text-muted mb-0 small">
                                    <strong>Género: </strong> {solicitud.usuario?.generoUsuario}
                                  </p>
                                  {solicitud.estadoSolicitud?.toUpperCase() === 'APROBADA' && (
                                    <>
                                      <p className="text-muted mb-0 small">
                                        <strong>Teléfono: </strong> {solicitud.usuario?.telefono}
                                      </p>
                                      <p className="text-muted mb-0 small">
                                        <strong>Email: </strong> {solicitud.usuario?.email}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="text-end text-muted small">
                                <div className="d-flex flex-column align-items-center">
                                  {solicitud.estadoSolicitud?.toUpperCase() === 'APROBADA' ? (
                                    <i className="bi bi-check-circle text-success mb-1" style={{ fontSize: '1.8rem' }}></i>
                                  ) : (
                                    <i className="bi bi-x-circle text-danger mb-1" style={{ fontSize: '1.8rem' }}></i>
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};