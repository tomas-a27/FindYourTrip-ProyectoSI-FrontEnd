import React, { useState } from 'react';
import { post } from '../../api/dataManager';
import { useAuth } from '../../auth/AuthContext';

interface Props {
  usuarioACalificar: { 
    idUsuario: number; 
    nombre: string; 
    apellido: string;
    viajeOrigen?: string;
    viajeDestino?: string;
    viajeFecha?: string;
    cancelacionTardia?: boolean; 
    fotoPerfil?: any; 
  };
  viajeId: number | null;
  indice: number;
  total: number;
  onSuccess: () => void;
  onClose: () => void;
  tipo?: 'Pasajero' | 'Conductor';
}

const MOTIVOS_CONDUCTOR = [
  'No se presentó al viaje',
  'Conducción imprudente o peligrosa',
  'Incumplimiento del horario pactado',
  'Falta de higiene en el vehículo',
  'Vehículo dañado',
  'Comportamiento grosero o inapropiado',
  'Otro',
];

const MOTIVOS_PASAJERO = [
  'No se presentó al viaje',
  'Incumplimiento del horario pactado',
  'Falta de higiene durante el viaje',
  'Dejó daños en el vehículo',
  'Comportamiento grosero o inapropiado',
  'No realizó el pago',
  'Otro',
];

export const ModalCalificacionSecuencial = ({
  usuarioACalificar,
  viajeId,
  indice,
  total,
  onSuccess,
  onClose,
  tipo = 'Pasajero',
}: Props) => {
  const { userId } = useAuth();
  const motivosAMostrar =
    tipo === 'Conductor' ? MOTIVOS_CONDUCTOR : MOTIVOS_PASAJERO;
  const [paso, setPaso] = useState<'estrellas' | 'comentario' | 'reporte'>(
    'estrellas',
  );
  const [puntos, setPuntos] = useState(0);
  const [comentario, setComentario] = useState('');
  const [motivoReporte, setMotivoReporte] = useState('');
  const [mostrandoExito, setMostrandoExito] = useState(false);

  // Función para procesar la foto de perfil
  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data)
      return `https://ui-avatars.com/api/?name=${usuarioACalificar.nombre}+${usuarioACalificar.apellido}&background=random`;
    const binary = buffer.data
      .map((byte: number) => String.fromCharCode(byte))
      .join('');
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  const finalizarPaso = () => {
    setMostrandoExito(false);
    setPuntos(0);
    setComentario('');
    setMotivoReporte('');
    setPaso('estrellas');
    onSuccess();
  };

  const handleEnviar = async () => {
    try {
      const data = {
        viajeId,
        usuarioCalificadoId: usuarioACalificar.idUsuario,
        usuarioCalificadorId: userId,
        puntos,
        tipo: tipo || 'Pasajero',
        comentario: comentario || undefined,
        reporte: motivoReporte
          ? {
              motivo: motivoReporte,
              comentarioInfraccion: comentario || undefined,
            }
          : undefined,
      };
      const url =
        tipo === 'Conductor' ? 'viaje/calificar-conductor' : 'calificacion';
      const res = await post(url, data);

      if (res.status === 201 || res.status === 200) {
        setMostrandoExito(true);
      }
    } catch (error) {
      alert('Error al enviar la calificación');
    }
  };

  if (mostrandoExito) {
    return (
      <div className="modal-overlay" style={styles.overlay}>
        <div className="custom-modal text-center p-4 p-sm-5 bg-white shadow-lg" style={styles.modal}>
          <div className="mb-3">
            <i
              className="bi bi-check-circle-fill text-success"
              style={{ fontSize: '4rem' }}
            ></i>
          </div>
          <h4 className="fw-bold">Calificación exitosa</h4>
          {motivoReporte && (
            <p className="text-muted small">Motivo de infracción enviado: {motivoReporte}</p>
          )}
          <button
            className="btn w-100 mt-4 py-2 fw-bold"
            style={styles.btnPrimary}
            onClick={finalizarPaso}
          >
            {indice < total ? 'SIGUIENTE' : 'ACEPTAR'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" style={styles.overlay}>
      <div className="custom-modal p-3 p-sm-4 bg-white shadow-lg" style={styles.modal}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span style={styles.badge}>
            {tipo} {indice} de {total}
          </span>
          <button
            className="btn-close"
            style={{ cursor: 'pointer' }}
            onClick={onClose} 
          ></button>
        </div>

        {(paso === 'estrellas' ||
          paso === 'comentario' ||
          paso === 'reporte') && (
          <div className="animate__animated animate__fadeIn text-center">
            
            {(usuarioACalificar.viajeOrigen && usuarioACalificar.viajeDestino) && (
              <div className="mb-4 p-2 p-sm-3 rounded-3 text-start position-relative" style={{ backgroundColor: '#f8f9fa', border: '1px solid #eaeaea' }}>
                {usuarioACalificar.cancelacionTardia && (
                  <span className="badge bg-danger position-absolute top-0 end-0 m-2 shadow-sm" style={{ fontSize: '0.7rem' }}>
                    Viaje Cancelado
                  </span>
                )}
                <p className="m-0 text-muted fw-bold pe-5" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)' }}>
                  <i className="bi bi-geo-alt-fill text-success me-1"></i> {usuarioACalificar.viajeOrigen} a {usuarioACalificar.viajeDestino}
                </p>
                <p className="m-0 text-muted mt-1" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.8rem)' }}>
                  <i className="bi bi-calendar3 me-1"></i> {usuarioACalificar.viajeFecha ? usuarioACalificar.viajeFecha.split('-').reverse().join('/') : ''}
                </p>
              </div>
            )}

            <h5 className="fw-bold mb-3" style={{ color: '#333', fontSize: 'clamp(1rem, 4vw, 1.15rem)' }}>
              {usuarioACalificar.cancelacionTardia 
                ? `Calificación por cancelación al ${tipo === 'Conductor' ? 'conductor' : 'pasajero'}:` 
                : `¿Cómo calificas al ${tipo === 'Conductor' ? 'conductor' : 'pasajero'}?`
              }
            </h5>

            <div className="d-flex flex-column align-items-center justify-content-center mb-3">
              <img
                src={bufferToBase64(usuarioACalificar.fotoPerfil)}
                alt="Avatar"
                style={{
                  width: 'clamp(60px, 15vw, 75px)',
                  height: 'clamp(60px, 15vw, 75px)',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #1f5c2f',
                  padding: '2px'
                }}
                className="mb-2 shadow-sm"
              />
              <h4 className="fw-bold text-success m-0" style={{ fontSize: 'clamp(1.1rem, 5vw, 1.4rem)' }}>
                {usuarioACalificar.nombre} {usuarioACalificar.apellido}
              </h4>
            </div>

            <div className="my-3 d-flex justify-content-center gap-1 gap-sm-2 flex-wrap">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`bi bi-star${puntos >= star ? '-fill' : ''}`}
                  style={{
                    fontSize: 'clamp(2rem, 10vw, 2.8rem)', // Se adapta al celular
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    color: puntos >= star ? '#ffc107' : '#e4e4e4',
                  }}
                  onClick={() => setPuntos(star)}
                ></i>
              ))}
            </div>

            {paso === 'estrellas' && (
              <>
                <button
                  className="btn w-100 mb-3 py-2 fw-bold"
                  style={puntos > 0 ? styles.btnPrimary : styles.btnDisabled}
                  onClick={handleEnviar}
                  disabled={puntos === 0}
                >
                  ENVIAR
                </button>

                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-light border text-danger w-100"
                    style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)' }}
                    onClick={() => setPaso('reporte')}
                  >
                    REPORTAR INFRACCIÓN {tipo === 'Conductor' ? 'CONDUCTOR' : 'PASAJERO'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {paso === 'reporte' && (
          <div className="animate__animated animate__fadeIn text-start">
            <h5 className="fw-bold mb-2 text-center" style={{ fontSize: 'clamp(1rem, 4vw, 1.15rem)' }}>Tipo de infracción</h5>
            <div
              className="list-group list-group-flush mb-3 border rounded-3"
              style={{ maxHeight: '140px', overflowY: 'auto' }}
            >
              {motivosAMostrar.map((m) => (
                <label
                  key={m}
                  className="list-group-item border-0 d-flex align-items-center gap-2 py-2"
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    name="motivo"
                    className="form-check-input mt-0 flex-shrink-0"
                    checked={motivoReporte === m}
                    onChange={() => setMotivoReporte(m)}
                  />
                  <span style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', lineHeight: '1.2' }}>{m}</span>
                </label>
              ))}
            </div>
            <div className="mb-3">
              <h6 className="fw-bold mb-1" style={{ fontSize: '0.95rem' }}>Comentario (opcional)</h6>
              <textarea
                className="form-control border bg-light p-2"
                rows={2}
                placeholder={
                  tipo === 'Conductor'
                    ? 'Ej: Adelantó un camión en una curva a 150km/h.'
                    : 'Ej: Mal trato hacia los demás pasajeros.'
                }
                style={{ borderRadius: '8px', resize: 'none', fontSize: '0.9rem' }}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              ></textarea>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-light w-50 border fw-semibold"
                style={{ fontSize: 'clamp(0.85rem, 3vw, 0.95rem)' }}
                onClick={() => {
                  setMotivoReporte('');
                  setComentario('');
                  setPaso('estrellas');
                }}
              >
                CANCELAR
              </button>
              <button
                className="btn btn-danger w-50 fw-bold"
                style={{ fontSize: 'clamp(0.85rem, 3vw, 0.95rem)' }}
                onClick={handleEnviar}
                disabled={!motivoReporte || puntos === 0}
              >
                ENVIAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: any = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    padding: '15px' 
  },
  modal: {
    borderRadius: '24px',
    width: '100%',
    maxWidth: '420px', 
    maxHeight: '90vh', 
    overflowY: 'auto'
  },
  badge: {
    backgroundColor: '#eaf5ea',
    color: '#1f5c2f',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  btnPrimary: {
    backgroundColor: '#1f5c2f',
    color: '#fff',
    borderRadius: '12px',
    border: 'none',
  },
  btnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    borderRadius: '12px',
    border: 'none',
  }
};