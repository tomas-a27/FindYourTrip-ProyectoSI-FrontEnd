import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAsync, getOne, patch } from '../../api/dataManager'; // Quitamos patch y del
import { UsuarioDTO } from '../../entities/entities';
import { useAuth } from '../../auth/AuthContext';
import { Params } from 'react-router-dom';

// --- COLORES BASADOS EN TU DESCRIPCIÓN ---
const bgVerdeClaro = '#eaf5ea';
const colorTextoGrisOscuro = '#333333';
const colorNaranja = '#fd7e14';

export const MisViajes = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [vistaActiva, setVistaActiva] = useState<'pasajero' | 'conductor'>(
    'pasajero',
  );

  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [viajesPublicados, setViajesPublicados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConductorAprobado, setIsConductorAprobado] = useState(false);
  const [viajeACancelar, setViajeACancelar] = useState<any | null>(null);
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);

  const { data: user } = getOne<UsuarioDTO>('usuario/' + userId);

  useEffect(() => {
    if (user === undefined) return;
    if (user) {
      const aprobado =
        user?.estadoConductor?.toLowerCase() === 'aprobado' ||
        user?.tipoUsuario?.toLowerCase() === 'conductor';
      setIsConductorAprobado(aprobado);

      cargarDatos(Number(userId));
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [navigate, userId, user]); // AGREGAR 'user' A LAS DEPENDENCIAS
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

      // El mensaje depende de lo que devuelva el back (si fue < 24hs o no)
      alert(res.data.message);

      setMostrarModalCancelar(false);
      setViajeACancelar(null);
      cargarDatos(Number(userId)); // Recargar lista
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al cancelar el viaje');
    }
  };

  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data)
      return 'https://ui-avatars.com/api/?name=User&background=random';
    const binary = buffer.data
      .map((byte: number) => String.fromCharCode(byte))
      .join('');
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  // --- ACCIONES TEMPORALES (EN CONSTRUCCIÓN) ---
  const handleCancelarSolicitud = () => {
    alert('En construcción: Cancelar solicitud');
  };
  // ---------------------------------------------

  const formatearHora = (hora: string) => (hora ? hora.substring(0, 5) : '');

  // Filtros Pasajero
  const proximosPasajero = solicitudes.filter(
    (s) =>
      s.estadoSolicitud?.toLowerCase() === 'aprobada' &&
      (s.viaje?.viajeEstado?.toLowerCase() === 'disponible' ||
        s.viaje?.viajeEstado?.toLowerCase() === 'pendiente'),
  );
  const recientesPasajero = solicitudes.filter(
    (s) =>
      s.estadoSolicitud?.toLowerCase() === 'pendiente' ||
      s.estadoSolicitud?.toLowerCase() === 'denegada',
  );

  // Filtros Conductor
  const proximosConductor = viajesPublicados.filter(
    (v) =>
      v.viajeEstado?.toLowerCase() === 'disponible' ||
      v.viajeEstado?.toLowerCase() === 'pendiente',
  );
  const realizadosConductor = viajesPublicados.filter(
    (v) =>
      v.viajeEstado?.toLowerCase() !== 'disponible' &&
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
      {/* HEADER GLOBAL */}
      <div className="container pt-4 pb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h2
            className="fw-bold m-0"
            style={{ color: colorTextoGrisOscuro, fontSize: '1.5rem' }}
          >
            {vistaActiva === 'pasajero'
              ? 'Mis próximos viajes'
              : 'Próximos viajes'}
          </h2>

          {isConductorAprobado && (
            <button
              className="btn bg-white position-relative"
              style={{
                border: '1px solid #ced4da',
                borderRadius: '8px',
                padding: '6px 16px',
                fontWeight: '600',
                color: colorTextoGrisOscuro,
              }}
              onClick={() =>
                setVistaActiva(
                  vistaActiva === 'pasajero' ? 'conductor' : 'pasajero',
                )
              }
            >
              Mis viajes
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{
                  backgroundColor: colorNaranja,
                  border: '2px solid white',
                }}
              >
                {vistaActiva === 'pasajero' ? 'Conductor' : 'Pasajero'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ==================== VISTA PASAJERO ===================== */}
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
                    onCancelar={handleCancelarSolicitud}
                  />
                ))
              )}
              <div className="text-center mt-3">
                <span
                  className="text-decoration-underline fw-bold"
                  style={{ color: '#1f5c2f', cursor: 'pointer' }}
                >
                  Ver historial de viajes realizados
                </span>
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
                  onCancelar={handleCancelarSolicitud}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* ==================== VISTA CONDUCTOR ==================== */}
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
                    onComenzar={() => alert('En construcción: Comenzar viaje')}
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
      {/* MODAL DE CONFIRMACIÓN DE CANCELACIÓN (CU06)  */}
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
    </div>
  );
};

const TarjetaPasajeroProximo = ({ solicitud, hora, foto, onCancelar }: any) => {
  const viaje = solicitud.viaje;
  return (
    <div
      className="card border-0 mb-3"
      style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
    >
      <div className="card-body p-4 position-relative">
        <div className="row">
          <div className="col-8 col-md-7">
            <div className="d-flex">
              <div className="d-flex flex-column align-items-center me-3 mt-1">
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid #555',
                  }}
                ></div>
                <div
                  style={{
                    width: '2px',
                    height: '35px',
                    backgroundColor: '#555',
                    margin: '2px 0',
                  }}
                ></div>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid #555',
                  }}
                ></div>
              </div>
              <div>
                <h5
                  className="fw-bold m-0 text-dark mb-3"
                  style={{ fontSize: '1.1rem' }}
                >
                  {viaje?.viajeOrigen?.nombre}
                </h5>
                <h5
                  className="fw-bold m-0 text-dark"
                  style={{ fontSize: '1.1rem' }}
                >
                  {viaje?.viajeDestino?.nombre}
                </h5>
              </div>
            </div>

            <div className="mt-3 d-flex align-items-center">
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
              {viaje?.vehiculo?.marca} {viaje?.vehiculo?.modelo} -{' '}
              {viaje?.vehiculo?.color} - {viaje?.vehiculo?.patente}
            </p>
          </div>

          <div className="col-4 col-md-5 d-flex flex-column align-items-end justify-content-start">
            <div
              className="text-muted d-flex align-items-center mb-1"
              style={{ fontSize: '0.9rem' }}
            >
              <i className="bi bi-calendar3 me-2"></i>{' '}
              <span>
                {viaje?.viajeFecha
                  ? viaje.viajeFecha.split('-').reverse().join('/')
                  : ''}
              </span>
            </div>
            <div
              className="text-muted d-flex align-items-center mb-2"
              style={{ fontSize: '0.9rem' }}
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
          className="btn btn-sm bg-white rounded-pill fw-bold px-3 py-1"
          style={{
            border: '1px solid #dc3545',
            color: '#dc3545',
            fontSize: '0.85rem',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
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
      }}
    >
      <div className="card-body p-4 position-relative">
        <div className="row align-items-center">
          <div className="col-6 col-md-5">
            <div className="d-flex">
              <div className="d-flex flex-column align-items-center me-3 mt-1">
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: '2px solid #555',
                  }}
                ></div>
                <div
                  style={{
                    width: '2px',
                    height: '30px',
                    backgroundColor: '#555',
                    margin: '2px 0',
                  }}
                ></div>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: '2px solid #555',
                  }}
                ></div>
              </div>
              <div>
                <h6 className="fw-bold m-0 text-dark mb-2">
                  {viaje?.viajeOrigen?.nombre}
                </h6>
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
                {viaje?.usuarioConductor?.nombreUsuario}
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
              className="btn btn-sm bg-white rounded-pill fw-bold px-3 py-1"
              style={{
                border: '1px solid #dc3545',
                color: '#dc3545',
                fontSize: '0.85rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
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
  onComenzar,
  onVerSolicitudes,
}: any) => {
  const isCompleto = viaje.solicitudesAprobadas >= viaje.viajeCantLugares;

  return (
    <div className="mb-4">
      <div
        className="card border-0"
        style={{
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        <div className="card-body p-0">
          <div className="row p-4 align-items-center">
            <div className="col-5">
              <div className="d-flex">
                <div className="d-flex flex-column align-items-center me-3 mt-1">
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '2px solid #555',
                    }}
                  ></div>
                  <div
                    style={{
                      width: '2px',
                      height: '35px',
                      backgroundColor: '#555',
                      margin: '2px 0',
                    }}
                  ></div>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '2px solid #555',
                    }}
                  ></div>
                </div>
                <div>
                  <h5
                    className="fw-bold m-0 text-dark mb-3"
                    style={{ fontSize: '1.1rem' }}
                  >
                    {viaje?.viajeOrigen?.nombre}
                  </h5>
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
                <i className="bi bi-calendar3 me-2"></i>{' '}
                {viaje?.viajeFecha
                  ? viaje.viajeFecha.split('-').reverse().join('/')
                  : ''}
              </div>
              <div
                className="text-muted d-flex align-items-center"
                style={{ fontSize: '0.9rem' }}
              >
                <i className="bi bi-clock me-2"></i> {hora} AM
              </div>
            </div>

            <div className="col-4 d-flex flex-column align-items-end justify-content-center text-end">
              {isCompleto ? (
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
                    style={{ color: colorNaranja, fontSize: '0.85rem' }}
                  >
                    Aún quedan lugares
                  </span>
                </>
              )}
            </div>
          </div>

          <div
            className="w-100 text-center py-3"
            style={{
              borderTop: '1px solid #eaeaea',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
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
            <span
              className="fw-bold"
              style={{ color: '#0d6efd', fontSize: '0.95rem' }}
            >
              Ver pasajeros y solicitudes
            </span>
          </div>
        </div>
      </div>

      <div className="d-flex mt-3 gap-3">
        <button
          onClick={onCancelar}
          className="btn bg-white w-50 rounded-pill fw-bold py-2"
          style={{
            border: '2px solid #dc3545',
            color: '#dc3545',
            fontSize: '0.95rem',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          }}
        >
          Cancelar Viaje
        </button>
        <button
          onClick={onComenzar}
          className="btn bg-white w-50 rounded-pill fw-bold py-2"
          style={{
            border: '2px solid #0dcaf0',
            color: '#0d6efd',
            fontSize: '0.95rem',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          }}
        >
          Comenzar viaje
        </button>
      </div>
    </div>
  );
};

const TarjetaConductorRealizado = ({ viaje, hora }: any) => {
  return (
    <div
      className="card bg-white mb-3"
      style={{ borderRadius: '16px', border: '1px solid #eaeaea' }}
    >
      <div className="card-body p-0">
        <div className="row p-4 align-items-center">
          <div className="col-7">
            <div className="d-flex">
              <div className="d-flex flex-column align-items-center me-3 mt-1">
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid #555',
                  }}
                ></div>
                <div
                  style={{
                    width: '2px',
                    height: '35px',
                    backgroundColor: '#555',
                    margin: '2px 0',
                  }}
                ></div>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid #555',
                  }}
                ></div>
              </div>
              <div>
                <h5
                  className="fw-bold m-0 text-dark mb-3"
                  style={{ fontSize: '1.1rem' }}
                >
                  {viaje?.viajeOrigen?.nombre}
                </h5>
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
              <span>{hora} AM</span> <i className="bi bi-clock ms-2"></i>
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
          }}
          onClick={() => alert('En construcción: Ver pasajeros históricos')}
        >
          <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
            Ver pasajeros
          </span>
        </div>
      </div>
    </div>
  );
};
