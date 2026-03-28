import { SolicitudViajeDTO } from '../../entities/entities.ts';
import { get } from '../../api/dataManager.ts';
import { useLocation } from 'react-router-dom';

export const AprobarDenegarSolicitud = () => {
  const location = useLocation();
  const {
    data: solicitudPendiente,
    loading: solicitudPendienteLoading,
    error: solicitudPendienteError,
  } = get<SolicitudViajeDTO>(
    'viaje/solicitudes-pendientes-viaje/' + location.state.viajeId,
  );

  const {
    data: solicitudAprobadaRechazada,
    loading: solicitudAprobadaRechazadaLoading,
    error: solicitudAprobadaRechazadaError,
  } = get<SolicitudViajeDTO>(
    'viaje/solicitudes-aprobadas-rechazadas-viaje/' + location.state.viajeId,
  );

  return (
    <div>
      <div className="container mt-4">
        {/* Título del viaje */}
        <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>
          Viaje a {location.state.viajeOrigen}
        </h3>

        {/* Tarjeta de información */}
        <div
          className="p-2 border border-secondary"
          style={{ backgroundColor: '#A9D1A0', color: '#1a2b3c' }}
        >
          <div className="d-flex justify-content-between mb-1">
            <span>Desde: {location.state.viajeOrigen}</span>
            <span>Fecha: {location.state.viajeFecha}</span>
          </div>
          <div>
            <span>
              Quedan: {location.state.lugaresDisponibles} lugares disponibles
            </span>
          </div>
        </div>
      </div>

      {/*Solicitudes pendientes */}
      {!solicitudPendienteLoading &&
        !solicitudPendienteError &&
        solicitudPendiente?.length === 0 && (
          <div className="alert alert-info">
            No hay solicitudes disponibles.
          </div>
        )}

      {!solicitudPendienteLoading &&
        !solicitudPendienteError &&
        solicitudPendiente?.length > 0 && (
          <div className="container mt-4">
            <div className="row">
              {solicitudPendiente.map((solicitud, index) => (
                <div key={index} className="col-12 col-lg-6 mb-4">
                  <div
                    className="card border-1 shadow-sm p-3 h-100"
                    style={{
                      borderRadius: '20px',
                      backgroundColor: '#fff',
                    }}
                  >
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex justify-content-between align-items-start">
                          {/* Datos del usuario */}
                          <div>
                            {/* Contenedor Flex para el Nombre y la Calificación en la misma línea */}
                            <div className="d-flex align-items-center mb-1">
                              <h6
                                className="fw-bold mb-0 me-2"
                                style={{ fontSize: '1.1rem' }}
                              >
                                {solicitud.usuario?.nombreUsuario}{' '}
                                {solicitud.usuario?.apellidoUsuario}
                              </h6>

                              {/* Calificación movida a la derecha del nombre */}
                              <span
                                className="badge rounded-pill bg-light text-dark border shadow-sm"
                                style={{
                                  fontSize: '0.8rem',
                                  padding: '4px 10px',
                                }}
                              >
                                <i className="bi bi-star me-1"></i>
                                {solicitud.usuario?.calificacionPas}
                              </span>
                            </div>

                            <p className="text-muted mb-0 small">
                              <strong>Documento: </strong>
                              {solicitud.usuario?.tipoDocumento}{' '}
                              {solicitud.usuario?.nroDocumento}
                            </p>
                            <p className="text-muted mb-0 small">
                              <strong>Género: </strong>
                              {solicitud.usuario?.generoUsuario}
                            </p>
                          </div>
                        </div>

                        {/* Estado de la solicitud (Alineado a la derecha como el precio/fecha) */}
                        <div className="text-end text-muted small">
                          <div className="d-flex flex-column align-items-center">
                            <i
                              className="bi bi-clock-fill text-warning mb-1"
                              style={{ fontSize: '1.8rem' }}
                            ></i>
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
  );
};
