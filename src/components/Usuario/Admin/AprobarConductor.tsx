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

  const [error, setError] = useState('');
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [estadoAccion, setEstadoAccion] = useState<string>("");
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

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
      await put(`usuario/aprobarConductor/${usuarioId}`, { estadoConductor: estadoAccion });
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
      <div className="modal show fade modal-overlay d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <p className="text-center mt-5 text-white fw-bold fs-4">Cargando detalles...</p>
      </div>
    );
  }

  const calificacion = usuario.calificacionPas ?? 5;
  const calificacionFormateada = calificacion.toFixed(2);

  return (
    <div className="modal show fade modal-overlay d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content card shadow-sm w-100 aprobar-conductor-card">
          
          <button
            className="btn-cerrar position-absolute"
            style={{ top: "10px", right: "15px", zIndex: 10, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            onClick={onClose}
          >
            X
          </button>

          <div className="card-body p-4">
            <h4 className="mb-4 text-center" style={{ color: '#2d4a2d' }}>Detalle de Solicitud</h4>

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
                    <i className="bi bi-star-fill"></i> {calificacionFormateada}
                  </span>
                </p>

                <a href="#" className="text-decoration-none">
                  Historial de reportes
                </a>
              </div>

              <div className="col-md-8 mt-3 mt-md-0">
                <p><b>Nombre:</b> {usuario.nombreUsuario}</p>
                <p><b>Apellido:</b> {usuario.apellidoUsuario}</p>

                <div className="d-flex gap-4">
                  <p><b>Tipo Doc:</b> {usuario.tipoDocumento}</p>
                  <p><b>Nro Doc:</b> {usuario.nroDocumento}</p>
                </div>

                <p><b>Teléfono:</b> {usuario.telefono}</p>
                <p><b>Email:</b> {usuario.email}</p>
              </div>
            </div>

            <hr/>

            <p><b>Nro Licencia:</b> {usuario.nroLicenciaConductorUsuario}</p>

            <p>
              <b>Vencimiento Licencia:</b>{" "}
              {usuario.vigenciaLicenciaConductorUsuario
                ? new Date(usuario.vigenciaLicenciaConductorUsuario).toLocaleDateString()
                : "No informado"}
            </p>

            <hr/>

            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-danger px-4"
                onClick={() => abrirModalConfirmacion('denegado')}
              >
                Denegar
              </button>

              <button
                className="btn btn-success px-4"
                onClick={() => abrirModalConfirmacion('aprobado')}
              >
                Aprobar
              </button>
            </div>
          </div>
        </div>
      </div>

      {mostrarModalConfirmacion && (
        <div className="modal show fade modal-overlay d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "420px" }}
          >
            <div className="modal-content">
              <div className="modal-body p-4 text-center">
                <p className="fw-bold fs-5 mb-4">
                  Desea confirmar la acción?
                </p>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-secondary btn-sm px-3"
                    onClick={() => setMostrarModalConfirmacion(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    className="btn btn-primary btn-sm px-3"
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
        <div className="modal show fade modal-overlay d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "420px" }}
          >
            <div className="modal-content p-4 position-relative">
              <button
                type="button"
                className="btn-close position-absolute"
                style={{ top: "10px", right: "10px" }}
                onClick={handleCerrarExito}
              ></button>

              <div className="modal-body text-center mt-2">
                <p className="fw-bold fs-5 mb-0" style={{ color: estadoAccion === 'aprobado' ? '#198754' : '#dc3545' }}>
                  {estadoAccion === "aprobado"
                  ? "Conductor aprobado"
                  : "Solicitud denegada"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};