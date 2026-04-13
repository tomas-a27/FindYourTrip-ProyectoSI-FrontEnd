import { useState } from 'react';
import { getOne, post } from '../../../api/dataManager';

interface Props {
  usuarioId: number;
  onClose: () => void;
}

export const VerInfracciones = ({ usuarioId, onClose }: Props) => {
  const { data } = getOne<any>(`sancion/ver-infracciones/${usuarioId}`);

  const [mostrarMotivo, setMostrarMotivo] = useState(false);
  const [mostrarDias, setMostrarDias] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  
  const [mostrarTodas, setMostrarTodas] = useState(false);

  const [motivo, setMotivo] = useState('');
  const [dias, setDias] = useState('');

  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data) return '';
    const binary = buffer.data.map((b: number) => String.fromCharCode(b)).join('');
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  if (!data) return null;

  const desestimar = async () => {
    await post(`sancion/desestimar/${usuarioId}`, {});
    onClose();
    window.location.reload();
  };

  // pedir motivo (paso 1)
  const abrirMotivo = () => {
    setMostrarMotivo(true);
  };

  // guardar motivo y pedir días (paso 2)
  const aceptarMotivo = () => {
    if (!motivo.trim()) {
      alert('Ingrese motivo');
      return;
    }

    setMostrarMotivo(false);
    setMostrarDias(true);
  };

  // inhabilitar usuario (paso 3)
  const confirmarInhabilitacion = async () => {
    if (!dias || Number(dias) <= 0) {
      alert('Ingrese cantidad de días válida');
      return;
    }
    
    await post(`sancion/inhabilitar/${usuarioId}`, { motivo, dias });

    setMostrarDias(false);
    setMostrarExito(true);
  };

  const infraccionesAMostrar = mostrarTodas 
    ? data.infracciones 
    : data.infracciones.slice(0, 1);

  return (
    <div className="modal show fade modal-overlay d-block">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content card shadow-sm aprobar-conductor-card">
          <button className="btn-cerrar position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-5 text-muted" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>

          <div className="card-body p-4">
            <div className="row">
              <div className="col-md-4 text-center">
                {data.foto ? (
                  <img
                    src={bufferToBase64(data.foto)}
                    className="usuario-foto-grande shadow-sm"
                    alt="Foto de perfil"
                  />
                ) : (
                  <div className="usuario-foto-grande d-flex align-items-center justify-content-center text-center p-2 bg-light border">
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Sin foto</span>
                  </div>
                )}
                
                <div className="mt-3 d-flex justify-content-center gap-2 flex-wrap">
                  <div className="calificacion-badge border px-2 py-1 bg-light rounded-pill d-flex align-items-center shadow-sm" style={{ fontSize: '0.8rem' }}>
                    <span className="fw-bold text-muted me-1" style={{ fontSize: '0.7rem' }}>PASAJERO:</span>
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    <span className="fw-bold">{data.calificacionPas?.toFixed(2) ?? '-'}</span>
                  </div>
                  
                  <div className="calificacion-badge border px-2 py-1 bg-light rounded-pill d-flex align-items-center shadow-sm" style={{ fontSize: '0.8rem' }}>
                    <span className="fw-bold text-muted me-1" style={{ fontSize: '0.7rem' }}>CONDUCTOR:</span>
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    <span className="fw-bold">{data.calificacionConductor?.toFixed(2) ?? '-'}</span>
                  </div>
                </div>
              </div>

              <div className="col-md-8 mt-3 mt-md-0">
                <p><b>Nombre:</b> {data.nombre}</p>
                <p><b>Apellido:</b> {data.apellido}</p>

                <div className="d-flex gap-4">
                  <p><b>Tipo doc:</b> {data.tipoDocumento}</p>
                  <p><b>Nro doc:</b> {data.nroDocumento}</p>
                </div>

                <p><b>Teléfono:</b> {data.telefono}</p>
                <p><b>Email:</b> {data.email}</p>
              </div>

              {data.tipoUsuario !== 'pasajero' && (
                <div className="col-12 mt-2">
                  <hr className="my-3" />
                  
                  <p><b>Nro licencia:</b> {data.nroLicencia}</p>
                  <p><b>Vencimiento licencia:</b> {data.vencimientoLicencia
                    ? new Date(data.vencimientoLicencia).toLocaleDateString()
                    : '-'}
                  </p>
                </div>
              )}
            </div>

            <hr className="my-4" />

            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold m-0 text-dark">Historial de Infracciones</h5>
              <span className="badge bg-danger rounded-pill px-3 py-2" style={{ fontSize: '0.85rem' }}>
                Total: {data.cantidadInfracciones}
              </span>
            </div>

            {infraccionesAMostrar.map((i: any, idx: number) => (
              <div key={idx} className="border p-3 mb-3 rounded-4 bg-light shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                  <span className="fw-bold text-danger"><i className="bi bi-exclamation-triangle-fill me-2"></i>Infracción</span>
                  <span className="badge bg-white text-muted border"><i className="bi bi-calendar3 me-1"></i>{new Date(i.fecha).toLocaleDateString()}</span>
                </div>
                <p className="mb-1"><strong className="text-dark small">Descripción:</strong> <span className="text-muted small">{i.descripcion}</span></p>
                <p className="mb-1"><strong className="text-dark small">Comentario:</strong> <span className="text-muted small">{i.comentario ? i.comentario : '-'}</span></p>
                <p className="mb-0"><strong className="text-dark small">Tipo:</strong> <span className="badge bg-secondary ms-1">{i.tipo}</span></p>
              </div>
            ))}

            {data.infracciones.length > 1 && (
              <div className="text-center mt-2 mb-4">
                <button 
                  className="btn btn-link text-decoration-none fw-bold"
                  style={{ color: '#1f5c2f' }}
                  onClick={() => setMostrarTodas(!mostrarTodas)}
                >
                  {mostrarTodas ? (
                    <><i className="bi bi-chevron-up me-2"></i>Ver menos</>
                  ) : (
                    <><i className="bi bi-chevron-down me-2"></i>Ver más ({data.infracciones.length - 1})</>
                  )}
                </button>
              </div>
            )}

            {/* BOTONES DE ACCIÓN */}
            <div className="d-flex justify-content-between mt-4 pt-3 border-top gap-3">
              <button
                className="btn btn-outline-secondary fw-bold w-50 py-2 rounded-3"
                onClick={desestimar}
              >
                Desestimar
              </button>

              <button
                className="btn btn-danger fw-bold w-50 py-2 rounded-3 shadow-sm"
                onClick={abrirMotivo}
              >
                Inhabilitar usuario
              </button>
            </div>
          </div>
        </div>
      </div>

      {mostrarMotivo && (
        <div className="modal-overlay" style={{ zIndex: 1060 }}>
          <div className="custom-modal p-4 text-center rounded-4 shadow-lg" style={{ maxWidth: '400px' }}>
            <div className="mb-3">
              <i className="bi bi-person-x-fill text-danger" style={{ fontSize: '3rem' }}></i>
            </div>
            <h5 className="fw-bold mb-3">¿Desea inhabilitar al usuario?</h5>
            <p className="text-muted small mb-2 text-start">Motivo de inhabilitación:</p>
            <input
              className="form-control custom-input p-2 mb-4"
              value={motivo}
              placeholder="Describa brevemente el motivo"
              onChange={(e) => setMotivo(e.target.value)}
            />
            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn btn-light border fw-bold w-50"
                onClick={() => setMostrarMotivo(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger fw-bold w-50 shadow-sm"
                onClick={aceptarMotivo}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarDias && (
        <div className="modal-overlay" style={{ zIndex: 1060 }}>
          <div className="custom-modal p-4 text-center rounded-4 shadow-lg" style={{ maxWidth: '400px' }}>
            <div className="mb-3">
              <i className="bi bi-calendar-x text-danger" style={{ fontSize: '3rem' }}></i>
            </div>
            <h5 className="fw-bold mb-3">Tiempo de sanción</h5>
            <p className="text-muted small mb-2 text-start">Ingrese días de inhabilitación:</p>
            <input
              type="number"
              className="form-control custom-input p-2 mb-4 text-center fs-5"
              value={dias}
              min="1"
              placeholder="Ej: 15"
              onChange={(e) => setDias(e.target.value)}
            />
            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn btn-light border fw-bold w-50"
                onClick={() => setMostrarDias(false)}
              >
                Atrás
              </button>
              <button
                className="btn btn-danger fw-bold w-50 shadow-sm"
                onClick={confirmarInhabilitacion}
              >
                Inhabilitar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarExito && (
        <div className="modal-overlay" style={{ zIndex: 1060 }}>
          <div className="custom-modal text-center p-4 rounded-4 shadow-lg" style={{ maxWidth: '400px' }}>
            <div className="mb-3">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3.5rem' }}></i>
            </div>
            <h5 className="fw-bold mb-4">El usuario ha sido sancionado con éxito</h5>
            <button
              className="btn btn-success fw-bold w-100 py-2 shadow-sm"
              style={{ backgroundColor: '#1f5c2f', border: 'none' }}
              onClick={() => {
                onClose();
                window.location.reload();
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};