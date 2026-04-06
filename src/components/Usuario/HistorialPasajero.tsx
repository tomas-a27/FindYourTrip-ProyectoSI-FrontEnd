import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAsync } from '../../api/dataManager';
import { useAuth } from '../../auth/AuthContext';
const colorTextoGrisOscuro = '#333333';

export const HistorialPasajero = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [historial, setHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      cargarDatos(Number(userId));
    } else {
      navigate('/login');
    }
  }, [navigate, userId]);

  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data)
      return 'https://ui-avatars.com/api/?name=User&background=random';
    const binary = buffer.data
      .map((byte: number) => String.fromCharCode(byte))
      .join('');
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  const cargarDatos = async (idUsuario: number) => {
    setLoading(true);
    try {
      const resSol = await getAsync<any>(`viaje/mis-solicitudes/${idUsuario}`);
      if (resSol.data && resSol.data.data) {
        // Filtramos: Solicitudes aprobadas de viajes que ya NO están disponibles ni pendientes (ya ocurrieron)
        const viajesPasados = resSol.data.data.filter(
          (s: any) =>
            s.estadoSolicitud?.toLowerCase() === 'aprobada' &&
            s.viaje?.viajeEstado?.toLowerCase() !== 'disponible' &&
            s.viaje?.viajeEstado?.toLowerCase() !== 'pendiente',
        );
        setHistorial(viajesPasados);
      } else {
        setHistorial([]);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  const formatearHora = (hora: string) => (hora ? hora.substring(0, 5) : '');

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
      {/* HEADER CON BOTÓN VOLVER */}
      <div className="container pt-4 pb-3" style={{ maxWidth: '900px' }}>
        <div
          className="mb-4 d-flex align-items-center"
          onClick={() => navigate(-1)}
          style={{ cursor: 'pointer' }}
        >
          <div
            className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: '24px', height: '24px' }}
          >
            <i className="bi bi-arrow-left text-white fs-9"></i>
          </div>
          <span className="fw-bold text-success fs-7">Volver a Mis Viajes</span>
        </div>

        <h2
          className="fw-bold m-0 text-center mb-3"
          style={{ color: '#2d4a2d' }}
        >
          Historial de viajes realizados
        </h2>
      </div>

      {/* LISTA DE VIAJES REALIZADOS */}
      <div className="container py-2" style={{ maxWidth: '900px' }}>
        {historial.length === 0 ? (
          <p className="text-muted text-center my-5">
            No tenés viajes realizados como pasajero.
          </p>
        ) : (
          historial.map((sol) => (
            <TarjetaHistorialPasajero
              key={sol.solViajeId}
              viaje={sol.viaje}
              hora={formatearHora(sol.viaje?.viajeHorario)}
              foto={bufferToBase64(sol.viaje?.usuarioConductor?.fotoPerfil)}
              calificacionOtorgada={sol.calificacionOtorgada}
            />
          ))
        )}
      </div>
    </div>
  );
};

// =========================================================================
// COMPONENTE DE TARJETA
// =========================================================================
const TarjetaHistorialPasajero = ({
  viaje,
  hora,
  foto,
  calificacionOtorgada,
}: any) => {
  const [expandido, setExpandido] = useState(false);

  const renderEstrellas = (calificacion: number | null | undefined) => {
    if (
      calificacion === null ||
      calificacion === undefined ||
      calificacion === 0
    ) {
      return (
        <span className="badge bg-light text-muted border px-2 py-1">
          Sin calificar
        </span>
      );
    }

    return (
      <div className="d-flex text-warning ms-2" style={{ fontSize: '1.2rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`bi bi-star${star <= calificacion ? '-fill' : ''}`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <div
      className="card bg-white mb-4"
      style={{
        borderRadius: '16px',
        border: '1px solid #eaeaea',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
      }}
    >
      <div className="card-body p-0">
        <div className="row p-4 align-items-start">
          {/* Izquierda: Ruta y conductor */}
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

          {/* Derecha: Fecha y hora */}
          <div className="col-5 d-flex flex-column align-items-end h-100 justify-content-start">
            <div
              className="text-muted d-flex align-items-center mb-2"
              style={{ fontSize: '1rem' }}
            >
              <span>
                {viaje?.viajeFecha
                  ? viaje.viajeFecha.split('-').reverse().join('/')
                  : ''}
              </span>
            </div>
            <div
              className="text-muted d-flex align-items-center"
              style={{ fontSize: '1.2rem' }}
            >
              <span className="fw-bold">{hora}</span>
              <i className="bi bi-clock ms-2"></i>
            </div>
          </div>
        </div>

        {/* Contenido expandible a lo ancho de toda la tarjeta */}
        {expandido && (
          <div
            className="px-4 pb-4 pt-3 border-top"
            style={{
              animation: 'fadeIn 0.3s ease',
              backgroundColor: '#ffffff',
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center">
                <img
                  src={foto}
                  alt="Avatar"
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                  className="me-3 shadow-sm border"
                />
                <div>
                  <span className="fw-bold text-dark d-block">
                    {viaje?.usuarioConductor?.nombreUsuario}{' '}
                    {viaje?.usuarioConductor?.apellidoUsuario}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    Conductor
                  </span>
                </div>
              </div>

              <div className="d-flex flex-column align-items-end text-end ms-3">
                <span
                  className="text-muted fw-semibold mb-1"
                  style={{ fontSize: '0.85rem' }}
                >
                  Tu calificación:
                </span>
                {renderEstrellas(calificacionOtorgada)}
              </div>
            </div>

            <p className="text-muted m-0 mb-2" style={{ fontSize: '0.9rem' }}>
              <i className="bi bi-car-front-fill me-2 text-primary"></i>
              {viaje?.vehiculo?.marca} {viaje?.vehiculo?.modelo} -{' '}
              {viaje?.vehiculo?.color} - Patente{' '}
              <span className="fw-semibold">{viaje?.vehiculo?.patente}</span>
            </p>

            {viaje?.usuarioConductor?.telefono && (
              <>
                <h6
                  className="fw-bold text-dark mt-3 mb-2"
                  style={{ fontSize: '0.95rem' }}
                >
                  Datos de contacto
                </h6>
                <p
                  className="text-muted m-0 mb-1"
                  style={{ fontSize: '0.9rem' }}
                >
                  <i className="bi bi-telephone-fill me-2 text-success"></i>{' '}
                  {viaje?.usuarioConductor?.telefono}
                </p>
                <p className="text-muted m-0" style={{ fontSize: '0.9rem' }}>
                  <i className="bi bi-envelope-fill me-2 text-danger"></i>{' '}
                  {viaje?.usuarioConductor?.email}
                </p>
              </>
            )}
          </div>
        )}

        {/* Botón inferior ancho completo */}
        <div
          className="w-100 text-center py-3"
          style={{
            borderTop: '1px solid #eaeaea',
            backgroundColor: expandido ? '#f8f9fa' : '#ffffff',
            cursor: 'pointer',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            const span = e.currentTarget.querySelector('span');
            if (span) span.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = expandido
              ? '#f8f9fa'
              : '#ffffff';
            const span = e.currentTarget.querySelector('span');
            if (span) span.style.textDecoration = 'none';
          }}
          onClick={() => setExpandido(!expandido)}
        >
          <span
            className="fw-bold text-dark d-flex justify-content-center align-items-center"
            style={{ fontSize: '0.95rem' }}
          >
            {expandido ? 'Ocultar conductor' : 'Ver conductor'}
            <i
              className={`bi bi-chevron-${expandido ? 'up' : 'down'} ms-2`}
            ></i>
          </span>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};
