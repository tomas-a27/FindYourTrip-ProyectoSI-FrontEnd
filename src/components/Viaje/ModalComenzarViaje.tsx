import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { patch } from '../../api/dataManager.ts';
import { useNavigate } from 'react-router-dom';

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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    if (!isProcessing) {
      setShowModal(false);
    }
  };

  async function handleConfirmar() {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      if (onConfirm) {
        handleCloseModal();
        onConfirm();
      } else if (query) {
        await patch(query);
        handleCloseModal();
        location.reload();
      }
    } catch (error) {
      console.error('Error al procesar', error);
      setIsProcessing(false);
    }
  }

  return (
    <>
      {accion.toUpperCase() === 'COMENZAR' ? (
        <button
          className="btn w-50 rounded-pill fw-bold py-2 shadow-sm"
          onClick={handleOpenModal}
          style={{
            backgroundColor: '#ffffff', // Fondo controlado manualmente
            border: '2px solid #0dcaf0',
            color: '#0d6efd',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease', // Transición fluida
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
          className="btn btn-success w-50 rounded-pill fw-bold py-2 shadow-sm"
          onClick={handleOpenModal}
          style={{
            fontSize: '0.95rem',
            backgroundColor: '#2d4a2d',
            border: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1e331e'; // Hover verde oscuro
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2d4a2d'; // Vuelve a su color normal
          }}
        >
          FINALIZAR VIAJE
        </button>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {accion.toUpperCase() === 'COMENZAR'
              ? 'Comenzar Viaje'
              : 'Finalizar Viaje'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas {accion.toLowerCase()} este viaje?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={handleCloseModal}
            disabled={isProcessing}
          >
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            onClick={handleConfirmar}
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : 'Confirmar'}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComenzarFinalizarViaje;