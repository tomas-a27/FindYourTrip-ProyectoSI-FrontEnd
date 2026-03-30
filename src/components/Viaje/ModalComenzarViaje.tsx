import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { patch } from '../../api/dataManager.ts';
import { useNavigate } from 'react-router-dom';

interface ModalComenzarFinalizarViajeProps {
  query: string;
  accion: string;
  routeNav: string;
}

const ModalComenzarFinalizarViaje = ({
  query,
  accion,
  routeNav,
}: ModalComenzarFinalizarViajeProps) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    navigate(routeNav);
  };

  async function handleConfirmar() {
    await patch(query);
    handleCloseModal();
  }

  return (
    <>
      {accion.toUpperCase() === 'COMENZAR' ? (
        <button
          className="btn btn-outline-success col-6"
          onClick={handleOpenModal}
        >
          COMENZAR VIAJE
        </button>
      ) : (
        <button
          className="btn btn-outline-danger col-6"
          onClick={handleOpenModal}
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
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleConfirmar}>
            Confirmar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComenzarFinalizarViaje;
