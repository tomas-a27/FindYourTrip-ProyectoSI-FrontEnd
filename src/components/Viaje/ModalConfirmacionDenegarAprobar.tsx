import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { patch } from '../../api/dataManager.ts';

interface ModalConfirmacionDenegarAprobarProps {
  query: string;
  nombre: string;
  apellido: string;
  accion: string;
  onSuccess: () => void;
}

const ModalConfirmacionDenegarAprobar = ({
  query,
  nombre,
  apellido,
  accion,
  onSuccess,
}: ModalConfirmacionDenegarAprobarProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debeActualizar, setDebeActualizar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  
  const handleCloseModal = () => {
    if (!isProcessing) setShowModal(false);
  };

  async function handleConfirmar() {
    setIsProcessing(true);
    try {
      await patch(query, {}); 
      
      setDebeActualizar(true);
      setShowModal(false);

      if (accion.toUpperCase() === 'APROBAR') {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error al procesar la solicitud", error);
      alert("Hubo un error. Por favor, intente nuevamente.");
      setIsProcessing(false);
    }
  }

  const handleExited = () => {
    if (debeActualizar) {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {accion.toUpperCase() === 'DENEGAR' ? (
        <button
          className="btn btn-outline-danger col-6"
          onClick={handleOpenModal}
          disabled={isProcessing}
        >
          DENEGAR
        </button>
      ) : (
        <button
          className="btn btn-outline-success col-6"
          onClick={handleOpenModal}
          disabled={isProcessing}
        >
          APROBAR
        </button>
      )}

      <Modal show={showModal} onHide={handleCloseModal} onExited={handleExited}>
        <Modal.Header closeButton>
          <Modal.Title>
            {accion.toUpperCase() === 'DENEGAR' ? 'Denegar Solicitud' : 'Aprobar Solicitud'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Estás seguro de que deseas <strong>{accion}</strong> la solicitud de
            <strong> {nombre} {apellido} </strong>?
          </p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <div className="row w-100 m-0">
            <div className="col-6 px-1">
              <button className="btn btn-outline-secondary w-100" onClick={handleCloseModal} disabled={isProcessing}>
                Cancelar
              </button>
            </div>
            <div className="col-6 px-1">
              <button
                className={`btn w-100 ${accion.toUpperCase() === 'DENEGAR' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                onClick={handleConfirmar}
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Body className="text-center">
          <h5 className="mb-4">Solicitud aprobada</h5>

          <button
            className="btn btn-success px-4"
            onClick={() => {
              setShowSuccessModal(false);
              onSuccess();
              setDebeActualizar(false);
            }}
          >
            Aceptar
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalConfirmacionDenegarAprobar;