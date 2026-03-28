import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { patch } from '../../api/dataManager.ts';
import { useNavigate } from 'react-router-dom';

interface ModalConfirmacionProps {
  query: string;
  nombre: string;
  apellido: string;
  accion: string;
}

const ModalConfirmacion = ({
  query,
  nombre,
  apellido,
  accion,
}: ModalConfirmacionProps) => {
  const navegate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  async function handleConfirmar() {
    console.log('Query a ejecutar:', query);
    await patch(query);

    handleCloseModal();
    navegate('/solicitudes-mis-viajes');
  }

  return (
    <>
      {accion.toUpperCase() === 'DENEGAR' ? (
        <button
          className="btn btn-outline-danger col-6"
          onClick={handleOpenModal}
        >
          DENEGAR
        </button>
      ) : (
        <button
          className="btn btn-outline-success col-6"
          onClick={handleOpenModal}
        >
          APROBAR
        </button>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {accion.toUpperCase() === 'DENEGAR'
              ? 'Denegar Solicitud'
              : 'Aprobar Solicitud'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Estás seguro de que deseas <strong>{accion}</strong> la solicitud
            de
            <strong>
              {' '}
              {nombre} {apellido}{' '}
            </strong>
            ?
          </p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <div className="row w-100 m-0">
            {/* Columna Izquierda (50%) */}
            <div className="col-6 px-1">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
            </div>

            {/* Columna Derecha (50%) */}
            <div className="col-6 px-1">
              <button
                // Tip: Podés hacer que el botón sea rojo si la acción es DENEGAR
                className={`btn w-100 ${
                  accion.toUpperCase() === 'DENEGAR'
                    ? 'btn-outline-danger'
                    : 'btn-outline-success'
                }`}
                onClick={handleConfirmar}
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalConfirmacion;
