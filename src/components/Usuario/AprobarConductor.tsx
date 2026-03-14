import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOne, put } from '../../api/dataManager';
import { UsuarioDTO } from '../../entities/entities';

export const AprobarConductor = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { data: usuario } = getOne<UsuarioDTO>(`usuario/${id}`);

  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [estadoAccion, setEstadoAccion] = useState<string>("");
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data) return '';

    const binary = buffer.data
      .map((byte: number) => String.fromCharCode(byte))
      .join('');

    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  const abrirModal = (estado: string) => {
    setEstadoAccion(estado);
    setMostrarModal(true);
  };

  const confirmarAccion = async () => {
    try {
      await put(`usuario/aprobarConductor/${id}`, { estadoConductor: estadoAccion });
      setMostrarModal(false);
      setMostrarModalExito(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    }
  };

  if (!usuario) return <p className="text-center mt-5">Cargando...</p>;

  const calificacion = usuario.calificacionPas ?? 5;
  const calificacionFormateada = calificacion.toFixed(2);

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="card shadow-sm w-100 aprobar-conductor-card">
        <button
          className="btn-cerrar"
          onClick={() => navigate('/aprobar-conductores')}
        >
          X
        </button>

        <div className="card-body p-3">
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

            <div className="col-md-8">
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

          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-danger"
              onClick={() => abrirModal('denegado')}
            >
              Denegar
            </button>

            <button
              className="btn btn-success"
              onClick={() => abrirModal('aprobado')}
            >
              Aprobar
            </button>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <div className="modal show fade modal-overlay">
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "420px" }}
          >
            <div className="modal-content">
              <div className="modal-body p-4">
                <p className="fw-bold fs-5 mb-3">
                  Desea confirmar la acción?
                </p>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
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
        <div className="modal show fade modal-overlay">
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "420px" }}
          >
            <div className="modal-content p-3 position-relative">
              <button
                type="button"
                className="btn-close position-absolute"
                style={{ top: "10px", right: "10px" }}
                onClick={() => navigate('/aprobar-conductores')}
              ></button>

              <div className="modal-body text-center">
                <p className="fw-bold fs-5 mb-0">
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