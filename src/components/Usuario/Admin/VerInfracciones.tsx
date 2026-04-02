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

  return (
    <div className="modal show fade modal-overlay d-block">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content card shadow-sm aprobar-conductor-card">
          <button className="btn-cerrar" onClick={onClose}>
            X
          </button>

          <div className="card-body p-4">
            <div className="row">
              <div className="col-md-4 text-center">
                {data.foto ? (
                  <img
                    src={bufferToBase64(data.foto)}
                    className="usuario-foto-grande"
                  />
                ) : (
                  <div className="usuario-foto-grande d-flex align-items-center justify-content-center text-center p-2">
                    <span style={{ fontSize: '0.8rem' }}>Sin foto de perfil</span>
                  </div>
                )}
                
                <div className="mt-3 d-flex justify-content-center gap-3 flex-wrap">
                  <div className="calificacion-badge">
                    <i className="bi bi-star-fill"></i>
                    {data.calificacionPas?.toFixed(2) ?? '-'}
                  </div>
                  
                  <div className="calificacion-badge">
                    <i className="bi bi-star-fill"></i>
                    {data.calificacionConductor?.toFixed(2) ?? '-'}
                  </div>
                </div>
              </div>

              <div className="col-md-8">
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
                <>
                  <hr className="my-3" />
                  
                  <p><b>Nro licencia:</b> {data.nroLicencia}</p>
                  <p><b>Vencimiento licencia:</b> {data.vencimientoLicencia
                    ? new Date(data.vencimientoLicencia).toLocaleDateString()
                    : '-'}
                  </p>
                </>
              )}
            </div>

            <hr />

            <div className="d-flex align-items-center mt-3 mb-2 gap-5">
              <h5 className="m-0">Reportes</h5>
              
              <span className="text-muted">
                <b>Cantidad:</b> {data.cantidadInfracciones}
              </span>
            </div>

            {data.infracciones.map((i: any, idx: number) => (
              <div key={idx} className="border p-2 mb-2 rounded">
                <p><b>Fecha:</b> {new Date(i.fecha).toLocaleDateString()}</p>
                <p><b>Descripción:</b> {i.descripcion}</p>

                <p><b>Comentario:</b> {i.comentario
                  ? i.comentario
                  : '-'}
                </p>

                <p><b>Tipo:</b> {i.tipo}</p>
              </div>
            ))}

            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-light-cancel"
                onClick={desestimar}
              >
                Desestimar
              </button>

              <button
                className="btn btn-danger"
                onClick={abrirMotivo}
              >
                Inhabilitar usuario
              </button>
            </div>
          </div>
        </div>
      </div>

      {mostrarMotivo && (
        <div className="modal-overlay">
          <div className="custom-modal">
            <h5 className="mb-3">¿Desea inhabilitar al usuario?</h5>

            <p>Motivo de inhabilitación:</p>

            <input
              className="form-control custom-input"
              value={motivo}
              placeholder="Describa brevemente el motivo"
              onChange={(e) => setMotivo(e.target.value)}
            />

            <div className="d-flex justify-content-center mt-3 gap-5">
              <button
                className="btn btn-secondary"
                onClick={() => setMostrarMotivo(false)}
              >
                Cancelar
              </button>

              <button
                className="btn btn-pastel-green"
                onClick={aceptarMotivo}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarDias && (
        <div className="modal-overlay">
          <div className="custom-modal">
            <p className="fw-bold">Ingrese días de inhabilitación</p>

            <input
              type="number"
              className="form-control custom-input"
              value={dias}
              min="0"
              onChange={(e) => setDias(e.target.value)}
            />

            <div className="d-flex justify-content-end mt-3 gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setMostrarDias(false)}
              >
                Cancelar
              </button>

              <button
                className="btn btn-danger"
                onClick={confirmarInhabilitacion}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarExito && (
        <div className="modal-overlay">
          <div className="custom-modal text-center">
            <h5>El usuario se ha sancionado con éxito</h5>

            <button
              className="btn btn-success mt-3"
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