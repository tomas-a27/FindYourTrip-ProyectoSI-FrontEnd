import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ViajeDTO } from '../../entities/entities.ts';
import { get, post, getAsync } from '../../api/dataManager.ts';
import { useAuth } from '../../auth/AuthContext';

export const MostrarViaje = () => {
  const { userId } = useAuth();

  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [viajeSeleccionado, setViajeSeleccionado] = useState<ViajeDTO | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<Record<number, number>>({});

  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data) return '';

    const binary = buffer.data
      .map((byte: number) => String.fromCharCode(byte))
      .join('');

    return `data:image/jpeg;base64,${btoa(binary)}`;
  };
  const location = useLocation();
  const navigate = useNavigate();

  const query =
    location.state?.query ||
    `viaje/mostrar-viaje?viajeEstado=pendiente&usuarioId=${userId}`;

  const {
    data: viajes,
    loading: loadingViajes,
    error: errorViajes,
  } = get<ViajeDTO>(query);

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      if (!viajes || viajes.length === 0) return;

      const resultados: Record<number, number> = {};

      await Promise.all(
        viajes.map(async (v) => {
          try {
            const res = await getAsync<any>(`viaje/detalle/${v.viajeId}`);
            resultados[v.viajeId] = res.data?.data?.lugaresDisponibles ?? v.viajeCantLugares;
          } catch {
            resultados[v.viajeId] = v.viajeCantLugares;
          }
        })
      );

      setDisponibilidad(resultados);
    };

    fetchDisponibilidad();
  }, [viajes]);

  const handleSubmit = async () => {
    if (!viajeSeleccionado) return;
    
    const solicitudViaje = {
      viaje: viajeSeleccionado.viajeId,
      usuario: userId,
    };

    const res = await post('viaje/solicitar-viaje', solicitudViaje);

    if (res.status === 201) {
      setMostrarModalConfirmacion(false);
      setMostrarModalExito(true);
    } else {
      alert('Error: ' + res.data?.message);
    }
  };

  return (
    <div>
      <div>
        <div className="container mt-4 pb-3 border-bottom">
          <div className="row align-items-center mb-3">
            <div className="col">
              <h2 className="mb-0">Viajes Publicados</h2>
            </div>
            <div className="col-auto min-vw-10">
              <Link to="/buscar-viaje" className="btn btn-outline-secondary">
                VOLVER
              </Link>
            </div>
          </div>

          {/* Información de Origen y Destino */}
          {location.state && (
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="p-2 bg-light rounded border-start border-4 border-success d-flex align-items-center gap-2">
                  <span className="fw-bold text-success small">ORIGEN:</span>
                  <span>{location.state.localidadOrigen}</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2 bg-light rounded border-start border-4 border-success d-flex align-items-center gap-2">
                  <span className="fw-bold text-success small">DESTINO:</span>
                  <span>{location.state.localidadDestino}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!loadingViajes && !errorViajes && viajes?.length === 0 && (
        <div className="alert alert-info">No hay viajes disponibles.</div>
      )}
      {!loadingViajes && !errorViajes && viajes?.length > 0 && (
        <div className="container mt-4">
          <div className="row">
            {viajes.map((viaje) => (
              <div key={viaje.viajeId} className="col-12 col-lg-6 mb-4">
                <div
                  className="card border-1 shadow-sm p-3 h-100"
                  style={{
                    borderRadius: '20px',
                    backgroundColor: '#fff',
                  }}
                >
                  <div className="card-body p-2">
                    {/* Sección Superior: Perfil y Datos Principales */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        {/* Avatar y Calificación */}
                        <div className="position-relative me-3">
                          <img
                            src={bufferToBase64(
                              viaje.usuarioConductor.fotoPerfil,
                            )}
                            alt="foto usuario"
                            className="usuario-foto"
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              border: '0.2px solid #000000',
                            }}
                          />
                          <span
                            className="position-absolute bottom-0 start-50 translate-middle-x badge rounded-pill bg-light text-dark border shadow-sm"
                            style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                          >
                            <i className="bi bi-star text-warning me-1"></i>
                            {viaje.usuarioConductor.calificacionConductor || 'S/C'}
                          </span>
                        </div>

                        {/* Nombre y Vehículo */}
                        <div>
                          <h6
                            className="fw-bold mb-0"
                            style={{ fontSize: '1.1rem' }}
                          >
                            {viaje.usuarioConductor.nombreUsuario}{' '}
                            {viaje.usuarioConductor.apellidoUsuario}
                          </h6>
                          <p className="text-muted mb-0 small">
                            <strong>Vehículo: </strong>
                            {viaje.vehiculo.marca} {viaje.vehiculo.modelo}
                          </p>
                        </div>
                      </div>

                      {/* Fecha, Hora y Precio */}
                      <div className="text-end text-muted small">
                        <div className="mb-1">
                          <i className="bi bi-calendar3 me-1"></i>{' '}
                          {Array.isArray(viaje.viajeFecha.split('-'))
                            ? viaje.viajeFecha.split('-').reverse().join('/')
                            : viaje.viajeFecha}
                        </div>
                        <div className="mb-1">
                          <i className="fw-bold bi bi-clock me-1"></i>{' '}
                          {viaje.viajeHorario}
                        </div>
                        <div className="fw-bold text-dark fs-5">
                          $ {viaje.viajePrecio}
                        </div>
                      </div>
                    </div>

                    {/* Sección Media: Ruta y Disponibilidad */}
                    <div className="row align-items-center mb-3">
                      <div className="col-7 position-relative">
                        {/* Línea de Origen/Destino */}
                        <div
                          className="d-flex flex-column gap-3 ms-2"
                          style={{
                            borderLeft: '1px solid #dee2e6',
                            paddingLeft: '20px',
                          }}
                        >
                          <div className="position-relative">
                            {/* Ícono de Origen (verde, hueco) */}
                            <i
                              className="bi bi-geo-alt position-absolute start-0 top-50 translate-middle bg-white text-success"
                              style={{
                                fontSize: '1.2rem', // Ajustá el tamaño si lo querés más chico/grande
                                marginLeft: '-20px',
                                paddingTop: '2px', // Pequeño ajuste visual para tapar bien la línea
                                paddingBottom: '2px',
                              }}
                            ></i>
                            <h5 className="fw-bold mb-0">
                              {viaje.viajeOrigen.nombre}
                            </h5>
                          </div>
                          <div className="position-relative">
                            {/* Ícono de Destino (rojo, lleno) */}
                            <i
                              className="bi bi-geo-fill position-absolute start-0 top-50 translate-middle bg-white text-danger"
                              style={{
                                fontSize: '1.2rem',
                                marginLeft: '-20px',
                                paddingTop: '2px',
                                paddingBottom: '2px',
                              }}
                            ></i>
                            <h5 className="fw-bold mb-0">
                              {viaje.viajeDestino.nombre}
                            </h5>
                          </div>
                        </div>
                      </div>

                      {/* La parte de la derecha (Disponibilidad y Mascotas) la dejo intacta por si acaso */}
                      <div className="col-5 text-end small">
                        <div className="text-muted mb-2">
                          {viaje.viajeAceptaMascotas
                            ? 'Acepta mascotas'
                            : 'Sin mascotas'}
                        </div>
                        <div className="fw-bold">
                          Quedan {disponibilidad[viaje.viajeId] ?? viaje.viajeCantLugares} lugares disponibles
                        </div>
                      </div>
                    </div>

                    {/* Comentario Adicional */}
                    <p className="text-muted small mb-4">
                      {viaje.viajeComentario ||
                        'El conductor no agregó información adicional'}
                    </p>

                    {/* Botón de Acción */}
                    <div className="mt-auto">
                      <button
                        type="button"
                        className="btn btn-success w-100 py-3 fw-bold border-0"
                        style={{
                          backgroundColor: '#2d4a2d',
                          borderRadius: '15px',
                        }}
                        onClick={() => {
                          setViajeSeleccionado(viaje);
                          setMostrarModalConfirmacion(true);
                        }}
                      >
                        Enviar solicitud
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {loadingViajes && (
        <div className="alert alert-info">Cargando viajes...</div>
      )}
      {errorViajes && (
        <div className="alert alert-danger">
          Error al cargar viajes: {errorViajes}
        </div>
      )}

      {mostrarModalConfirmacion && viajeSeleccionado && (
        <div className="modal-overlay">
          <div className="custom-modal text-center">

            <h5 className="fw-bold mb-3">
              ¿Desea confirmar envío de solicitud a{' '}
              {viajeSeleccionado.usuarioConductor.nombreUsuario}{' '}
              {viajeSeleccionado.usuarioConductor.apellidoUsuario}?
            </h5>

            <p className="text-muted mb-4">
              <b>
                {viajeSeleccionado.viajeFecha.split('-').reverse().join('/')} a las{' '}
                {viajeSeleccionado.viajeHorario}
              </b>
            </p>

            <div className="d-flex gap-2">
              <button
                className="btn btn-light-cancel w-50"
                onClick={() => setMostrarModalConfirmacion(false)}
              >
                Cancelar
              </button>

              <button
                className="btn btn-pastel-green w-50"
                onClick={handleSubmit}
              >
                Enviar
              </button>
            </div>

          </div>
        </div>
      )}

      {mostrarModalExito && (
        <div className="modal-overlay">
          <div className="custom-modal text-center">
            <h5 className="fw-bold mb-4">
              ¡La solicitud ha sido enviada con éxito!
            </h5>

            <button 
              className="btn btn-pastel-green w-100"
              onClick={() => navigate('/mis-viajes')}
            >
              Ver mis viajes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};