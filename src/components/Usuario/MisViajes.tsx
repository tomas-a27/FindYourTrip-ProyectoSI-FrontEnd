import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAsync, getOne, patch } from '../../api/dataManager';
import { UsuarioDTO } from '../../entities/entities';
import { useAuth } from '../../auth/AuthContext';
import { ModalAlertAviso } from '../ModalAlert.tsx';
import { ModalCalificacionSecuencial } from '../Viaje/ModalCalificacionSecuencial';
import ModalComenzarFinalizarViaje from '../Viaje/ModalComenzarViaje.tsx';

const bgVerdeClaro = '#eaf5ea';
const colorTextoGrisOscuro = '#333333';
const colorNaranja = '#fd7e14';

export const MisViajes = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [vistaActiva, setVistaActiva] = useState<'pasajero' | 'conductor'>(
    'pasajero',
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    localStorage.setItem(`vistaActiva_${userId}`, vistaActiva);
  }, [vistaActiva, userId]);

  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [viajesPublicados, setViajesPublicados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConductorAprobado, setIsConductorAprobado] = useState(false);
  const [viajeACancelar, setViajeACancelar] = useState<any | null>(null);
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
  const [solicitudACancelar, setSolicitudACancelar] = useState<any | null>(
    null,
  );
  const [mostrarModalCancelarSolicitud, setMostrarModalCancelarSolicitud] =
    useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [pasajerosACalificar, setPasajerosACalificar] = useState<any[]>([]);
  const [indiceCalificacion, setIndiceCalificacion] = useState(0);
  const [viajeIdActual, setViajeIdActual] = useState<number | null>(null);
  const [mostrarModalAviso, setMostrarModalAviso] = useState(false);
  const [mensajeAviso, setMensajeAviso] = useState('');

  const { data: user } = getOne<UsuarioDTO>('usuario/' + userId);

  useEffect(() => {
    if (user === undefined) return;

    if (user) {
      const aprobado =
        user?.estadoConductor?.toLowerCase() === 'aprobado' ||
        user?.tipoUsuario?.toLowerCase() === 'conductor';

      setIsConductorAprobado(aprobado);

      if (!aprobado) {
        setVistaActiva('pasajero');
      } else {
        setVistaActiva('conductor');
      }

      cargarDatos(Number(userId));
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [navigate, userId, user]);

  const cargarDatos = async (idUsuario: number) => {
    setLoading(true);

    try {
      const resSol = await getAsync<any>(`viaje/mis-solicitudes/${idUsuario}`);
      if (resSol.data && resSol.data.data) setSolicitudes(resSol.data.data);
      else setSolicitudes([]);

      const resPub = await getAsync<any>(
        `viaje/mis-publicaciones/${idUsuario}`,
      );
      if (resPub.data && resPub.data.data)
        setViajesPublicados(resPub.data.data);
      else setViajesPublicados([]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setSolicitudes([]);
      setViajesPublicados([]);
    } finally {
      setLoading(false);
    }
  };

  const ejecutarCancelacion = async () => {
    if (!viajeACancelar) return;

    try {
      const res = await patch(`viaje/cancelar/${viajeACancelar.viajeId}`, {});

      setMensajeAviso(res.data.message);
      setMostrarModalAviso(true);

      setMostrarModalCancelar(false);
      setViajeACancelar(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al cancelar el viaje');
    }
  };

  const ejecutarCancelacionSolicitud = async () => {
    if (!solicitudACancelar) return;

    try {
      const res = await patch(
        `viaje/cancelar-solicitud/${solicitudACancelar.solViajeId}`,
        {},
      );

      setMostrarModalCancelarSolicitud(false);
      setSolicitudACancelar(null);

      setMensajeExito(res.data.message);
      setMostrarModalExito(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al cancelar la solicitud');
    }
  };

  const cerrarModalExito = () => {
    setMostrarModalExito(false);
    cargarDatos(Number(userId));
    navigate('/mis-viajes');
  };

  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data)
      return 'https://ui-avatars.com/api/?name=User&background=random';
    const binary = buffer.data
      .map((byte: number) => String.fromCharCode(byte))
      .join('');
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  const handleCancelarSolicitud = (solicitud: any) => {
    setSolicitudACancelar(solicitud);
    setMostrarModalCancelarSolicitud(true);
  };

  const handleFinalizarViaje = async (viajeId: number) => {
    try {
      const res = await patch(`viaje/finalizar/${viajeId}`, {});
      console.log('Datos recibidos del back:', res.data.pasajeros);

      if (res.data.pasajeros && res.data.pasajeros.length > 0) {
        setViajeIdActual(viajeId);
        setPasajerosACalificar(res.data.pasajeros);
        setIndiceCalificacion(0);
      } else {
        cargarDatos(Number(userId));
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al finalizar el viaje');
    }
  };

  const handleSiguienteCalificacion = () => {
    if (indiceCalificacion < pasajerosACalificar.length - 1) {
      setIndiceCalificacion((prev) => prev + 1);
    } else {
      setPasajerosACalificar([]);
      setViajeIdActual(null);
      cargarDatos(Number(userId));
    }
  };

  const formatearHora = (hora: string) => (hora ? hora.substring(0, 5) : '');

  const proximosPasajero = solicitudes.filter(
    (s) =>
      s.estadoSolicitud?.toLowerCase() === 'aprobada' &&
      (s.viaje?.viajeEstado?.toLowerCase() === 'disponible' ||
        s.viaje?.viajeEstado?.toLowerCase() === 'pendiente' ||
        s.viaje?.viajeEstado?.toLowerCase() === 'encurso'),
  );
  const recientesPasajero = solicitudes.filter(
    (s) =>
      s.estadoSolicitud?.toLowerCase() === 'pendiente' ||
      s.estadoSolicitud?.toLowerCase() === 'denegada',
  );

  const proximosConductor = viajesPublicados.filter(
    (v) =>
      v.viajeEstado?.toLowerCase() === 'encurso' ||
      v.viajeEstado?.toLowerCase() === 'pendiente',
  );
  const realizadosConductor = viajesPublicados.filter(
    (v) =>
      v.viajeEstado?.toLowerCase() !== 'encurso' &&
      v.viajeEstado?.toLowerCase() !== 'pendiente' &&
      v.viajeEstado?.toLowerCase() !== 'cancelado',
  );

  const handleVerSolicitudes = (
    viajeId: number,
    viajeDestino: string,
    viajeOrigen: string,
    viajeFecha: Date,
    solicitudesAprobadas: number,
    viajeCantLugares: number,
  ) => {
    const lugaresDisponibles = viajeCantLugares - solicitudesAprobadas;
    navigate('/solicitudes-mis-viajes', {
      state: {
        viajeId,
        viajeDestino,
        viajeOrigen,
        viajeFecha,
        lugaresDisponibles,
      },
    });
  };

  if (loading)
    return (
      <div className="text-center mt-5 p-5">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );

  return (
    <div
      className="pb-5"
      style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}
    >
      <div className="container pt-4 pb-3">
        {/* NUEVO HEADER CON TABS DE SELECCIÓN */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <h2
            className="fw-bold m-0"
            style={{
              color: colorTextoGrisOscuro,
              fontSize: '1.7rem',
              letterSpacing: '-0.5px',
            }}
          >
            Mis Viajes
          </h2>

          {isConductorAprobado && (
            <div
              className="mis-viajes-switcher d-flex flex-column flex-sm-row p-1 rounded-4 shadow-sm align-self-stretch align-self-md-auto"
              style={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #eaeaea',
              }}
            >
              <button
                className="mis-viajes-switcher-btn btn rounded-pill px-3 px-md-4 py-2 fw-bold d-flex align-items-center justify-content-center text-nowrap flex-fill"
                style={{
                  backgroundColor:
                    vistaActiva === 'pasajero' ? '#ffffff' : 'transparent',
                  color: vistaActiva === 'pasajero' ? '#2d4a2d' : '#6c757d',
                  border: 'none',
                  boxShadow:
                    vistaActiva === 'pasajero'
                      ? '0 2px 8px rgba(0,0,0,0.1)'
                      : 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '0.95rem',
                }}
                onClick={() => setVistaActiva('pasajero')}
              >
                <i className="bi bi-backpack-fill me-2 fs-5"></i> Pasajero
              </button>

              <button
                className="mis-viajes-switcher-btn btn rounded-pill px-3 px-md-4 py-2 fw-bold d-flex align-items-center justify-content-center text-nowrap flex-fill"
                style={{
                  backgroundColor:
                    vistaActiva === 'conductor' ? '#ffffff' : 'transparent',
                  color: vistaActiva === 'conductor' ? '#2d4a2d' : '#6c757d',
                  border: 'none',
                  boxShadow:
                    vistaActiva === 'conductor'
                      ? '0 2px 8px rgba(0,0,0,0.1)'
                      : 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '0.95rem',
                }}
                onClick={() => setVistaActiva('conductor')}
              >
                <i className="bi bi-car-front-fill me-2 fs-5"></i> Conductor
              </button>
            </div>
          )}
        </div>
      </div>

      {vistaActiva === 'pasajero' && (
        <>
          <div style={{ backgroundColor: bgVerdeClaro }} className="py-4">
            <div className="container">
              {proximosPasajero.length === 0 ? (
                <p className="text-muted text-center my-4">
                  No tenés próximos viajes confirmados.
                </p>
              ) : (
                proximosPasajero.map((sol) => (
                  <TarjetaPasajeroProximo
                    key={sol.solViajeId}
                    solicitud={sol}
                    hora={formatearHora(sol.viaje?.viajeHorario)}
                    foto={bufferToBase64(
                      sol.viaje?.usuarioConductor?.fotoPerfil,
                    )}
                    onCancelar={() => handleCancelarSolicitud(sol)}
                  />
                ))
              )}
              <div className="text-center mt-3">
                <Link
                  to="/historial-pasajero"
                  className="text-decoration-underline fw-bold"
                  style={{
                    color: '#1f5c2f',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#143c1e')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = '#1f5c2f')
                  }
                >
                  Ver historial de viajes realizados
                </Link>
              </div>
            </div>
          </div>

          <div className="container py-4">
            <h3
              className="fw-bold mb-4"
              style={{ color: colorTextoGrisOscuro, fontSize: '1.3rem' }}
            >
              Mis solicitudes recientes
            </h3>
            {recientesPasajero.length === 0 ? (
              <p className="text-muted text-center my-4">
                No hay solicitudes recientes.
              </p>
            ) : (
              recientesPasajero.map((sol) => (
                <TarjetaPasajeroReciente
                  key={sol.solViajeId}
                  solicitud={sol}
                  hora={formatearHora(sol.viaje?.viajeHorario)}
                  foto={bufferToBase64(sol.viaje?.usuarioConductor?.fotoPerfil)}
                  onCancelar={() => handleCancelarSolicitud(sol)}
                />
              ))
            )}
          </div>
        </>
      )}

      {vistaActiva === 'conductor' && (
        <>
          <div style={{ backgroundColor: bgVerdeClaro }} className="py-4">
            <div className="container">
              {proximosConductor.length === 0 ? (
                <p className="text-muted text-center my-4">
                  No tenés viajes publicados activos.
                </p>
              ) : (
                proximosConductor.map((viaje) => (
                  <TarjetaConductorActivo
                    key={viaje.viajeId}
                    viaje={viaje}
                    hora={formatearHora(viaje.viajeHorario)}
                    onCancelar={() => {
                      setViajeACancelar(viaje);
                      setMostrarModalCancelar(true);
                    }}
                    onFinalizar={() => handleFinalizarViaje(viaje.viajeId)}
                    onVerSolicitudes={handleVerSolicitudes}
                  />
                ))
              )}
            </div>
          </div>

          <div
            style={{ boxShadow: '0 -4px 10px rgba(0,0,0,0.03)' }}
            className="py-4"
          >
            <div className="container">
              <h3
                className="fw-bold mb-4"
                style={{ color: colorTextoGrisOscuro, fontSize: '1.3rem' }}
              >
                Viajes realizados
              </h3>
              {realizadosConductor.length === 0 ? (
                <p className="text-muted text-center my-4">
                  Aún no realizaste ningún viaje.
                </p>
              ) : (
                realizadosConductor.map((viaje) => (
                  <TarjetaConductorRealizado
                    key={viaje.viajeId}
                    viaje={viaje}
                    hora={formatearHora(viaje.viajeHorario)}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* MODAL CANCELAR VIAJE */}
      {mostrarModalCancelar && (
        <div className="modal-overlay">
          <div className="custom-modal p-4 text-center">
            <div className="mb-3">
              <i
                className="bi bi-exclamation-triangle text-danger"
                style={{ fontSize: '3rem' }}
              ></i>
            </div>
            <h5 className="fw-bold mb-3">
              ¿Está seguro que desea cancelar el viaje?
            </h5>
            <div className="d-grid gap-2">
              <button
                onClick={ejecutarCancelacion}
                className="btn btn-danger py-2 fw-bold rounded-3 shadow-sm"
              >
                Confirmar
              </button>
              <button
                onClick={() => setMostrarModalCancelar(false)}
                className="btn btn-light py-2 fw-bold rounded-3 border"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CANCELAR SOLICITUD */}
      {mostrarModalCancelarSolicitud && solicitudACancelar && (
        <div className="modal-overlay">
          <div className="custom-modal p-4 text-center">
            <button
              className="btn-cerrar"
              onClick={() => setMostrarModalCancelarSolicitud(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="mb-3">
              <i
                className="bi bi-exclamation-triangle text-danger"
                style={{ fontSize: '3rem' }}
              ></i>
            </div>

            <h5 className="fw-bold mb-4">
              ¿Está seguro de que desea cancelar la solicitud de viaje a{' '}
              {solicitudACancelar.viaje?.viajeDestino?.nombre} para el{' '}
              {solicitudACancelar.viaje?.viajeFecha
                ?.split('-')
                .reverse()
                .join('/')}{' '}
              a las {formatearHora(solicitudACancelar.viaje?.viajeHorario)}?
            </h5>

            <div className="d-flex justify-content-center gap-3">
              <button
                onClick={() => setMostrarModalCancelarSolicitud(false)}
                className="btn btn-light px-4 py-2 fw-bold rounded-3 border"
              >
                No
              </button>

              <button
                onClick={ejecutarCancelacionSolicitud}
                className="btn btn-danger px-4 py-2 fw-bold rounded-3 shadow-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalExito && (
        <div className="modal-overlay">
          <div className="custom-modal p-4 text-center">
            <button className="btn-cerrar" onClick={cerrarModalExito}>
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="mb-3">
              <i
                className="bi bi-check-circle text-success"
                style={{ fontSize: '3rem' }}
              ></i>
            </div>

            <h5 className="fw-bold mb-4">
              {mensajeExito || 'La solicitud de viaje ha sido cancelada'}
            </h5>

            <div className="d-flex justify-content-center">
              <button
                onClick={cerrarModalExito}
                className="btn btn-pastel-green px-4 py-2 fw-bold rounded-3 shadow-sm"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
      {pasajerosACalificar.length > 0 && (
        <ModalCalificacionSecuencial
          usuarioACalificar={pasajerosACalificar[indiceCalificacion]}
          viajeId={viajeIdActual}
          indice={indiceCalificacion + 1}
          total={pasajerosACalificar.length}
          onSuccess={handleSiguienteCalificacion}
          onClose={() => handleSiguienteCalificacion()}
        />
      )}

      <ModalAlertAviso
        show={mostrarModalAviso}
        onClose={() => {
          setMostrarModalAviso(false);
          cargarDatos(Number(userId));
        }}
        message={mensajeAviso}
      />
    </div>
  );
};

const TarjetaPasajeroProximo = ({ solicitud, hora, foto, onCancelar }: any) => {
  const viaje = solicitud.viaje;
  const isEnCurso = viaje?.viajeEstado?.toLowerCase() === 'encurso';
  return (
    <div
      className="card border-0 mb-3"
      style={{
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      }}
    >
      <div className="card-body p-4 position-relative">
        <div className="row align-items-center">
          <div className="col-5">
            <div
              className="d-flex flex-column gap-3 ms-2"
              style={{ borderLeft: '1px solid #dee2e6', paddingLeft: '20px' }}
            >
              <div className="position-relative">
                <i
                  className="bi bi-geo-alt position-absolute start-0 top-50 translate-middle bg-white text-success"
                  style={{
                    fontSize: '1.2rem',
                    marginLeft: '-20px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                  }}
                ></i>
                <h5
                  className="fw-bold m-0 text-dark"
                  style={{ fontSize: '1.1rem' }}
                >
                  {viaje?.viajeOrigen?.nombre}
                </h5>
              </div>
              <div className="position-relative">
                <i
                  className="bi bi-geo-fill position-absolute start-0 top-50 translate-middle bg-white text-danger"
                  style={{
                    fontSize: '1.2rem',
                    marginLeft: '-20px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                  }}
                ></i>
                <h5
                  className="fw-bold m-0 text-dark"
                  style={{ fontSize: '1.1rem' }}
                >
                  {viaje?.viajeDestino?.nombre}
                </h5>
              </div>
            </div>

            <div className="mt-3 d-flex align-items-center mb-1">
              <img
                src={foto}
                alt="Avatar"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                className="me-2"
              />
              <span
                className="fw-bold text-dark"
                style={{ fontSize: '0.95rem' }}
              >
                {viaje?.usuarioConductor?.nombreUsuario}{' '}
                {viaje?.usuarioConductor?.apellidoUsuario}
              </span>
            </div>

            <p className="text-muted m-0 mt-1" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-car-front-fill me-2"></i>
              {viaje?.vehiculo?.marca} {viaje?.vehiculo?.modelo} -{' '}
              {viaje?.vehiculo?.color} - Patente {viaje?.vehiculo?.patente}
            </p>
            {viaje?.usuarioConductor?.telefono && (
              <p
                className="text-muted m-0 mb-1"
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-telephone-fill me-1"></i>{' '}
                {viaje?.usuarioConductor?.telefono} |{' '}
                <i className="bi bi-envelope-fill mx-1"></i>{' '}
                {viaje?.usuarioConductor?.email}
              </p>
            )}
          </div>

          <div className="col-4 d-flex flex-column align-items-end justify-content-start align-self-start pt-2">
            <div
              className="text-muted d-flex align-items-center mb-1"
              style={{ fontSize: '1rem' }}
            >
              <i className="bi bi-calendar3 me-2"></i>
              <span>
                {viaje?.viajeFecha
                  ? viaje.viajeFecha.split('-').reverse().join('/')
                  : ''}
              </span>
            </div>
            <div
              className="text-muted d-flex align-items-center mb-2"
              style={{ fontSize: '1rem' }}
            >
              <i className="bi bi-clock me-2"></i> <span>{hora}</span>
            </div>
            <div
              className="fw-bold text-dark d-flex align-items-center mt-1"
              style={{ fontSize: '1.3rem' }}
            >
              <i
                className="bi bi-currency-dollar me-1"
                style={{ fontSize: '1.1rem' }}
              ></i>{' '}
              {viaje?.viajePrecio}
            </div>
          </div>

          <div className="col-3 d-flex justify-content-end align-items-center pe-md-4">
            <div className="d-flex flex-column align-items-center text-center">
              {isEnCurso ? (
                <>
                  <i
                    className="bi bi-speedometer2 text-primary"
                    style={{ fontSize: '2rem' }}
                  ></i>
                  <span
                    className="fw-bold text-primary mt-1"
                    style={{ fontSize: '0.85rem' }}
                  >
                    En curso
                  </span>
                </>
              ) : (
                <>
                  <i
                    className="bi bi-calendar-check-fill text-success"
                    style={{ fontSize: '2rem' }}
                  ></i>
                  <span
                    className="fw-bold text-success mt-1"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Confirmado
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="text-end"
        style={{
          marginTop: '-20px',
          marginRight: '15px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <button
          onClick={onCancelar}
          className="btn btn-sm rounded-pill fw-bold px-3 py-1"
          disabled={isEnCurso}
          style={{
            backgroundColor: isEnCurso ? '#e9ecef' : '#ffffff',
            border: isEnCurso ? '1px solid #ced4da' : '1px solid #dc3545',
            color: isEnCurso ? '#6c757d' : '#dc3545',
            fontSize: '0.85rem',
            boxShadow: isEnCurso ? 'none' : '0 2px 5px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            cursor: isEnCurso ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!isEnCurso) {
              e.currentTarget.style.backgroundColor = '#dc3545';
              e.currentTarget.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (!isEnCurso) {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#dc3545';
            }
          }}
        >
          Cancelar solicitud
        </button>
      </div>
      <div style={{ height: '8px' }}></div>
    </div>
  );
};

const TarjetaPasajeroReciente = ({
  solicitud,
  hora,
  foto,
  onCancelar,
}: any) => {
  const viaje = solicitud.viaje;
  const isPendiente = solicitud.estadoSolicitud?.toLowerCase() === 'pendiente';

  return (
    <div
      className="card bg-white mb-3"
      style={{
        borderRadius: '16px',
        border: '1px solid #eaeaea',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
      }}
    >
      <div className="card-body p-4 position-relative">
        <div className="row align-items-center">
          <div className="col-6 col-md-5">
            <div
              className="d-flex flex-column gap-3 ms-2"
              style={{ borderLeft: '1px solid #dee2e6', paddingLeft: '20px' }}
            >
              <div className="position-relative">
                <i
                  className="bi bi-geo-alt position-absolute start-0 top-50 translate-middle bg-white text-success"
                  style={{
                    fontSize: '1.05rem',
                    marginLeft: '-20px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                  }}
                ></i>
                <h6 className="fw-bold m-0 text-dark">
                  {viaje?.viajeOrigen?.nombre}
                </h6>
              </div>
              <div className="position-relative">
                <i
                  className="bi bi-geo-fill position-absolute start-0 top-50 translate-middle bg-white text-danger"
                  style={{
                    fontSize: '1.05rem',
                    marginLeft: '-20px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                  }}
                ></i>
                <h6 className="fw-bold m-0 text-dark">
                  {viaje?.viajeDestino?.nombre}
                </h6>
              </div>
            </div>
            <div className="mt-3 d-flex align-items-center">
              <img
                src={foto}
                alt="Avatar"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                className="me-2"
              />
              <span
                className="fw-bold text-dark"
                style={{ fontSize: '0.9rem' }}
              >
                {viaje?.usuarioConductor?.nombreUsuario}{' '}
                {viaje?.usuarioConductor?.apellidoUsuario}
              </span>
            </div>
            <p className="text-muted m-0 mt-1" style={{ fontSize: '0.8rem' }}>
              {viaje?.vehiculo?.marca} {viaje?.vehiculo?.modelo} -{' '}
              {viaje?.vehiculo?.patente}
            </p>
          </div>

          <div className="col-3 col-md-4 d-flex flex-column justify-content-center">
            <div
              className="text-muted d-flex align-items-center mb-1"
              style={{ fontSize: '0.85rem' }}
            >
              <i className="bi bi-calendar3 me-2"></i>{' '}
              {viaje?.viajeFecha
                ? viaje.viajeFecha.split('-').reverse().join('/')
                : ''}
            </div>
            <div
              className="text-muted d-flex align-items-center mb-2"
              style={{ fontSize: '0.85rem' }}
            >
              <i className="bi bi-clock me-2"></i> {hora}
            </div>
            <div
              className="fw-bold text-dark mt-1"
              style={{ fontSize: '1.1rem' }}
            >
              $ {viaje?.viajePrecio}
            </div>
          </div>

          <div className="col-3 col-md-3 d-flex flex-column align-items-center justify-content-center text-center border-start">
            {isPendiente ? (
              <>
                <i
                  className="bi bi-clock-fill"
                  style={{ fontSize: '2rem', color: colorNaranja }}
                ></i>
                <span
                  className="fw-bold mt-1"
                  style={{ color: colorNaranja, fontSize: '0.85rem' }}
                >
                  Pendiente
                </span>
              </>
            ) : (
              <>
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ fontSize: '2rem' }}
                ></i>
                <span
                  className="fw-bold text-danger mt-1"
                  style={{ fontSize: '0.85rem' }}
                >
                  Denegada
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {isPendiente && (
        <>
          <div
            className="text-end"
            style={{
              marginTop: '-20px',
              marginRight: '15px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <button
              onClick={onCancelar}
              className="btn btn-sm rounded-pill fw-bold px-3 py-1"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dc3545',
                color: '#dc3545',
                fontSize: '0.85rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc3545';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#dc3545';
              }}
            >
              Cancelar solicitud
            </button>
          </div>
          <div style={{ height: '8px' }}></div>
        </>
      )}
    </div>
  );
};

const TarjetaConductorActivo = ({
  viaje,
  hora,
  onCancelar,
  onFinalizar,
  onVerSolicitudes,
}: any) => {
  const isCompleto = viaje.solicitudesAprobadas >= viaje.viajeCantLugares;
  const isEnCurso = viaje.viajeEstado?.toLowerCase() === 'encurso';

  return (
    <div
      className="mb-4 card border-0"
      style={{
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      }}
    >
      <div className="card-body p-0">
        <div className="row p-4 align-items-center">
          <div className="col-5">
            <div
              className="d-flex flex-column gap-3 ms-2"
              style={{ borderLeft: '1px solid #dee2e6', paddingLeft: '20px' }}
            >
              <div className="position-relative">
                <i
                  className="bi bi-geo-alt position-absolute start-0 top-50 translate-middle bg-white text-success"
                  style={{
                    fontSize: '1.2rem',
                    marginLeft: '-20px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                  }}
                ></i>
                <h5
                  className="fw-bold m-0 text-dark"
                  style={{ fontSize: '1.1rem' }}
                >
                  {viaje?.viajeOrigen?.nombre}
                </h5>
              </div>
              <div className="position-relative">
                <i
                  className="bi bi-geo-fill position-absolute start-0 top-50 translate-middle bg-white text-danger"
                  style={{
                    fontSize: '1.2rem',
                    marginLeft: '-20px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                  }}
                ></i>
                <h5
                  className="fw-bold m-0 text-dark"
                  style={{ fontSize: '1.1rem' }}
                >
                  {viaje?.viajeDestino?.nombre}
                </h5>
              </div>
            </div>
          </div>

          <div className="col-3 d-flex flex-column justify-content-center">
            <div
              className="text-muted d-flex align-items-center mb-2"
              style={{ fontSize: '0.9rem' }}
            >
              <i className="bi bi-calendar3 me-2"></i>
              {viaje?.viajeFecha
                ? viaje.viajeFecha.split('-').reverse().join('/')
                : ''}
            </div>
            <div
              className="text-muted d-flex align-items-center"
              style={{ fontSize: '0.9rem' }}
            >
              <i className="bi bi-clock me-2"></i> {hora}
            </div>
          </div>

          <div className="col-4 d-flex justify-content-end align-items-center pe-md-4">
            <div className="d-flex flex-column align-items-center text-center">
              {isEnCurso ? (
                <>
                  <i
                    className="bi bi-speedometer2 mb-1 text-primary"
                    style={{ fontSize: '1.8rem' }}
                  ></i>
                  <span
                    className="fw-bold text-primary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    En curso
                  </span>
                </>
              ) : isCompleto ? (
                <>
                  <i
                    className="bi bi-check-circle-fill text-success mb-1"
                    style={{ fontSize: '1.8rem' }}
                  ></i>
                  <span
                    className="fw-bold text-success"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Completo
                  </span>
                </>
              ) : (
                <>
                  <i
                    className="bi bi-clock-fill mb-1"
                    style={{ fontSize: '1.8rem', color: colorNaranja }}
                  ></i>
                  <span
                    className="fw-bold"
                    style={{
                      color: colorNaranja,
                      fontSize: '0.85rem',
                      lineHeight: '1.2',
                    }}
                  >
                    Aún quedan <br /> lugares
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className="w-100 text-center py-3"
          style={{
            borderTop: '1px solid #eaeaea',
            backgroundColor: '#ffffff',
          }}
        >
          <button
            type="button"
            className="btn p-0 fw-bold text-decoration-underline"
            style={{
              color: '#1f5c2f',
              fontSize: '0.95rem',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#143c1e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#1f5c2f';
            }}
            onClick={() =>
              onVerSolicitudes(
                viaje.viajeId,
                viaje.viajeDestino?.nombre,
                viaje.viajeOrigen?.nombre,
                viaje.viajeFecha,
                viaje.solicitudesAprobadas,
                viaje.viajeCantLugares,
              )
            }
          >
            Ver pasajeros y solicitudes
          </button>
        </div>
      </div>

      <div className="d-flex p-3 pt-0 gap-3">
        <button
          onClick={onCancelar}
          className="btn w-50 rounded-pill fw-bold py-2"
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #dc3545',
            color: '#dc3545',
            fontSize: '0.95rem',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
          }}
          disabled={isEnCurso}
          onMouseEnter={(e) => {
            if (!isEnCurso) {
              e.currentTarget.style.backgroundColor = '#dc3545';
              e.currentTarget.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (!isEnCurso) {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#dc3545';
            }
          }}
        >
          Cancelar viaje
        </button>

        {isEnCurso ? (
          <ModalComenzarFinalizarViaje
            accion="FINALIZAR"
            onConfirm={() => onFinalizar(viaje.viajeId)}
          />
        ) : (
          <ModalComenzarFinalizarViaje
            query={`viaje/comenzar/${viaje.viajeId}`}
            accion="COMENZAR"
            routeNav="/mis-viajes"
          />
        )}
      </div>
    </div>
  );
};

const TarjetaConductorRealizado = ({ viaje, hora }: any) => {
  const navigate = useNavigate();

  return (
    <div
      className="card bg-white mb-3"
      style={{
        borderRadius: '16px',
        border: '1px solid #eaeaea',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="card-body p-0">
        <div className="row p-4 align-items-center">
          <div className="col-7">
            <div
              className="d-flex flex-column gap-3 ms-2"
              style={{ borderLeft: '1px solid #dee2e6', paddingLeft: '20px' }}
            >
              <div className="position-relative">
                <i
                  className="bi bi-geo-alt position-absolute start-0 top-50 translate-middle bg-white text-success"
                  style={{
                    fontSize: '1.2rem',
                    marginLeft: '-20px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                  }}
                ></i>
                <h5
                  className="fw-bold m-0 text-dark"
                  style={{ fontSize: '1.1rem' }}
                >
                  {viaje?.viajeOrigen?.nombre}
                </h5>
              </div>
              <div className="position-relative">
                <i
                  className="bi bi-geo-fill position-absolute start-0 top-50 translate-middle bg-white text-danger"
                  style={{
                    fontSize: '1.2rem',
                    marginLeft: '-20px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                  }}
                ></i>
                <h5
                  className="fw-bold m-0 text-dark"
                  style={{ fontSize: '1.1rem' }}
                >
                  {viaje?.viajeDestino?.nombre}
                </h5>
              </div>
            </div>
          </div>

          <div className="col-5 d-flex flex-column align-items-end">
            <div
              className="text-muted d-flex align-items-center mb-2"
              style={{ fontSize: '0.9rem' }}
            >
              <span>
                {viaje?.viajeFecha
                  ? viaje.viajeFecha.split('-').reverse().join('/')
                  : ''}
              </span>{' '}
              <i className="bi bi-calendar3 ms-2"></i>
            </div>
            <div
              className="text-muted d-flex align-items-center"
              style={{ fontSize: '0.9rem' }}
            >
              <span>{hora} </span> <i className="bi bi-clock ms-2"></i>
            </div>
          </div>
        </div>

        <div
          className="w-100 text-center py-3"
          style={{
            borderTop: '1px solid #eaeaea',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            const span = e.currentTarget.querySelector('span');
            if (span) span.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            const span = e.currentTarget.querySelector('span');
            if (span) span.style.textDecoration = 'none';
          }}
          onClick={() =>
            navigate('/pasajeros-historial', {
              state: { viajeId: viaje.viajeId },
            })
          }
        >
          <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
            Ver pasajeros
          </span>
        </div>
      </div>
    </div>
  );
};
