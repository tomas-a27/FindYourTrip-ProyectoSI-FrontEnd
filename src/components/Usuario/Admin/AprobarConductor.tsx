import { useState } from 'react';
import { getOne, put } from '../../../api/dataManager';
import { UsuarioDTO } from '../../../entities/entities';

interface Props {
  usuarioId: number;
  onClose: () => void;
  onSuccess: (idUsuario: number) => void;
}

export const AprobarConductor = ({ usuarioId, onClose, onSuccess }: Props) => {
  const { data: usuario } = getOne<UsuarioDTO>(`usuario/${usuarioId}`);
  const { data: reportesData } = getOne<any>(
    `sancion/ver-infracciones/${usuarioId}`,
  );

  const [error, setError] = useState('');
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] =
    useState(false);
  const [estadoAccion, setEstadoAccion] = useState<string>('');
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [mostrarReportes, setMostrarReportes] = useState(false);

  const [mostrarLicenciaAmpliada, setMostrarLicenciaAmpliada] = useState(false);

  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data) return '';

    const binary = buffer.data
      .map((byte: number) => String.fromCharCode(byte))
      .join('');

    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  const abrirModalConfirmacion = (estado: string) => {
    setEstadoAccion(estado);
    setMostrarModalConfirmacion(true);
  };

  const confirmarAccion = async () => {
    try {
      await put(`usuario/aprobarConductor/${usuarioId}`, {
        estadoConductor: estadoAccion,
      });
      setMostrarModalConfirmacion(false);
      setMostrarModalExito(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    }
  };

  const handleCerrarExito = () => {
    setMostrarModalExito(false);
    onSuccess(usuarioId);
  };

  if (!usuario) {
    return (
      <div
        className="modal show fade modal-overlay d-block"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <p className="text-center mt-5 text-white fw-bold fs-4">
          Cargando detalles...
        </p>
      </div>
    );
  }

  const calificacion = usuario.calificacionPas;
  const calificacionFormateada =
    calificacion !== null && calificacion !== undefined
      ? calificacion.toFixed(2)
      : 'Sin calificación';

  return (
    <div
      className="modal show fade modal-overlay d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content card shadow-sm w-100 aprobar-conductor-card">
          <button
            className="btn-cerrar position-absolute"
            style={{
              top: '10px',
              right: '15px',
              zIndex: 10,
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={onClose}
          >
            X
          </button>

          <div className="card-body p-4">
            <h4 className="mb-4 text-center" style={{ color: '#2d4a2d' }}>
              Detalle de Solicitud
            </h4>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={bufferToBase64(usuario.fotoPerfil)}
                  alt="foto"
                  className="usuario-foto-grande"
                />

                <p className="mt-2 mb-1 d-flex justify-content-center">
                  <span className="calificacion-badge">
                    <i className="bi bi-star-fill text-warning"></i>{' '}
                    <span className="fw-semibold">
                      {usuario.calificacionPas?.toFixed(2) || 'Sin calificar'}
                    </span>{' '}
                  </span>
                </p>

                <a
                  href="#"
                  className="text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault();
                    setMostrarReportes(true);
                  }}
                >
                  Historial de infracciones
                </a>
              </div>

              <div className="col-md-8 mt-3 mt-md-0">
                <p>
                  <b>Nombre:</b> {usuario.nombreUsuario}
                </p>
                <p>
                  <b>Apellido:</b> {usuario.apellidoUsuario}
                </p>

                <div className="d-flex gap-4">
                  <p>
                    <b>Tipo Doc:</b> {usuario.tipoDocumento}
                  </p>
                  <p>
                    <b>Nro Doc:</b> {usuario.nroDocumento}
                  </p>
                </div>

                <p>
                  <b>Teléfono:</b> {usuario.telefono}
                </p>
                <p>
                  <b>Email:</b> {usuario.email}
                </p>
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col-md-6">
                <p>
                  <b>Nro Licencia:</b> {usuario.nroLicenciaConductorUsuario}
                </p>
                <p>
                  <b>Vencimiento Licencia:</b>{' '}
                  {usuario.vigenciaLicenciaConductorUsuario
                    ? new Date(
                        usuario.vigenciaLicenciaConductorUsuario,
                      ).toLocaleDateString()
                    : 'No informado'}
                </p>
              </div>

              <div className="col-md-6 text-center border-start">
                <p className="fw-bold mb-2">Foto de la Licencia:</p>
                {usuario.fotoLicenciaConductorUsuario ? (
                  <div
                    className="position-relative d-inline-block shadow-sm"
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={() => setMostrarLicenciaAmpliada(true)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = 'scale(1.05)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = 'scale(1)')
                    }
                  >
                    <img
                      src={bufferToBase64(usuario.fotoLicenciaConductorUsuario)}
                      alt="Licencia"
                      className="rounded border"
                      style={{
                        width: '160px',
                        height: '100px',
                        objectFit: 'cover',
                      }}
                    />
                    <div
                      className="position-absolute bottom-0 w-100 bg-dark bg-opacity-75 text-white py-1 rounded-bottom"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <i className="bi bi-zoom-in me-1"></i> Ampliar
                    </div>
                  </div>
                ) : (
                  <p className="text-muted fst-italic">
                    No adjuntó foto de licencia
                  </p>
                )}
              </div>
            </div>

            <hr />

            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-outline-danger px-4"
                onClick={() => abrirModalConfirmacion('denegado')}
              >
                Denegar
              </button>

              <button
                className="btn btn-outline-success px-4"
                onClick={() => abrirModalConfirmacion('aprobado')}
              >
                Aprobar
              </button>
            </div>
          </div>
        </div>
      </div>

      {mostrarLicenciaAmpliada && (
        <div
          className="modal show fade modal-overlay d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1060 }}
          onClick={() => setMostrarLicenciaAmpliada(false)}
        >
          <button
            className="position-absolute top-0 end-0 m-4 bg-transparent border-0 text-white fs-1"
            onClick={() => setMostrarLicenciaAmpliada(false)}
            style={{ cursor: 'pointer' }}
          >
            &times;
          </button>
          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-transparent border-0 d-flex justify-content-center align-items-center">
              <img
                src={bufferToBase64(usuario.fotoLicenciaConductorUsuario)}
                alt="Licencia Ampliada"
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: '85vh', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}

      {mostrarModalConfirmacion && (
        <div
          className="modal show fade modal-overlay d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: '420px' }}
          >
            <div className="modal-content">
              <div className="modal-body p-4 text-center">
                <p className="fw-bold fs-5 mb-4">Desea confirmar la acción?</p>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-outline-secondary btn-sm px-3"
                    onClick={() => setMostrarModalConfirmacion(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    className="btn btn-outline-primary btn-sm px-3"
                    onClick={confirmarAccion}
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarModalExito && (
        <div
          className="modal show fade modal-overlay d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: '420px' }}
          >
            <div className="modal-content p-4 position-relative">
              <button
                type="button"
                className="btn-close position-absolute"
                style={{ top: '10px', right: '10px' }}
                onClick={handleCerrarExito}
              ></button>

              <div className="modal-body text-center mt-2">
                <p
                  className="fw-bold fs-3 mb-5"
                  style={{
                    color: estadoAccion === 'aprobado' ? '#198754' : '#dc3545',
                  }}
                >
                  {estadoAccion === 'aprobado'
                    ? 'Conductor aprobado'
                    : 'Solicitud denegada'}
                </p>
                <div className="d-grid">
                  <button
                    type="button"
                    className="btn btn-success py-1 fw-bold"
                    style={{ borderRadius: '10px' }}
                    onClick={handleCerrarExito}
                  >
                    Volver al listado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarReportes && (
        <div className="modal show fade modal-overlay d-block">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content card shadow-sm aprobar-conductor-card">
              <button
                className="btn-cerrar"
                onClick={() => setMostrarReportes(false)}
              >
                X
              </button>

              <div className="card-body p-4">
                <div className="d-flex align-items-center mt-3 mb-3 gap-5">
                  <h5 className="m-0">Historial de infracciones</h5>

                  <span className="text-muted">
                    <b>Cantidad:</b> {reportesData?.cantidadInfracciones ?? 0}
                  </span>
                </div>

                {!reportesData?.infracciones?.length ? (
                  <p className="text-muted">No tiene infracciones</p>
                ) : (
                  reportesData.infracciones.map((i: any, idx: number) => (
                    <div key={idx} className="border p-2 mb-2 rounded">
                      <p>
                        <b>Fecha:</b> {new Date(i.fecha).toLocaleDateString()}
                      </p>
                      <p>
                        <b>Descripción:</b> {i.descripcion}
                      </p>
                      <p>
                        <b>Comentario:</b> {i.comentario ? i.comentario : '-'}
                      </p>
                      <p>
                        <b>Tipo:</b> {i.tipo}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
