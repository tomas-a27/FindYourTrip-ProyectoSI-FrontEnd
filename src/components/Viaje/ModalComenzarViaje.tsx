import { useState } from 'react';
import { patch } from '../../api/dataManager';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

interface ModalComenzarFinalizarViajeProps {
  query?: string;
  accion: string;
  routeNav?: string;
  onConfirm?: () => void;
}

const ModalComenzarFinalizarViaje = ({
  query,
  accion,
  routeNav,
  onConfirm,
}: ModalComenzarFinalizarViajeProps) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // <-- NUEVO ESTADO PARA MOSTRAR ERRORES

  const handleOpenModal = () => {
    setErrorMsg(''); // Limpiamos cualquier error anterior al abrir
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMsg(''); // Limpiamos al cerrar
  };

  async function handleConfirmar() {
    setLoading(true);
    setErrorMsg(''); // Reseteamos el error antes de intentar de nuevo
    
    try {
      if (onConfirm) {
        await onConfirm(); 
        handleCloseModal();
      } else if (query) {
        await patch(query, {});
        handleCloseModal();
        location.reload();
      }
    } catch (error: any) {
      console.error('Error en la operación:', error);
      // En vez del alert(), guardamos el mensaje en el estado para mostrarlo lindo
      setErrorMsg(error.response?.data?.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  }

  const isComenzar = accion.toUpperCase() === 'COMENZAR';

  return (
    <>
      {isComenzar ? (
        <button
          className="btn w-50 rounded-pill fw-bold py-2 shadow-sm"
          onClick={handleOpenModal}
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #0dcaf0',
            color: '#0d6efd',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0dcaf0';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = '#0d6efd';
          }}
        >
          COMENZAR VIAJE
        </button>
      ) : (
        <button
          className="btn w-50 rounded-pill fw-bold py-2 shadow-sm"
          onClick={handleOpenModal}
          style={{
            fontSize: '0.95rem',
            backgroundColor: '#2d4a2d',
            color: '#ffffff',
            border: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1e331e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2d4a2d';
          }}
        >
          FINALIZAR VIAJE
        </button>
      )}

      {showModal && createPortal(
        <div className="modal-overlay">
          <div className="custom-modal p-4 text-center">
            
            <div className="mb-3">
              {isComenzar ? (
                <i
                  className="bi bi-car-front-fill"
                  style={{ fontSize: '3rem', color: '#0dcaf0' }}
                ></i>
              ) : (
                <i
                  className="bi bi-check-circle-fill"
                  style={{ fontSize: '3rem', color: '#2d4a2d' }}
                ></i>
              )}
            </div>

            {/* SI HAY ERROR, MOSTRAMOS ESTE CARTELITO PROLIJO */}
            {errorMsg && (
              <div className="alert alert-danger fw-bold fs-6 mb-4 p-2 d-flex align-items-center justify-content-center" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            <h5 className="fw-bold mb-4">
              ¿Está seguro que desea {accion.toLowerCase()} el viaje?
            </h5>

            <div className="d-grid gap-2">
              <button
                onClick={handleConfirmar}
                disabled={loading} 
                className="btn py-2 fw-bold rounded-3 shadow-sm text-white d-flex justify-content-center align-items-center"
                style={{ 
                  backgroundColor: isComenzar ? '#0dcaf0' : '#2d4a2d',
                  border: 'none'
                }}
              >
                {loading ? (
                  <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                ) : (
                  'Confirmar'
                )}
              </button>
              <button
                onClick={handleCloseModal}
                disabled={loading} 
                className="btn btn-light py-2 fw-bold rounded-3 border"
              >
                No
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ModalComenzarFinalizarViaje;