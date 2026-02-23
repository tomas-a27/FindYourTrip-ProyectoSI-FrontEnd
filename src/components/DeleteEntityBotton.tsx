import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { remove } from '../api/dataManager.ts';

interface Props {
  idToDelete: string;
  nameToDelete: string;
  route: string;
  entityToDelete: string;
}

const DeleteEntityButton = ({
  idToDelete,
  nameToDelete,
  route,
  entityToDelete,
}: Props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Función para manejar la eliminación
  function handleDelete() {
    remove(`${route}/${idToDelete}`);
    handleClose();
    location.reload();
  }

  return (
    <>
      <button className="btn btn-sm btn-outline-danger" onClick={handleShow}>
        Eliminar
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar esta {entityToDelete} :{' '}
          <strong>{nameToDelete}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteEntityButton;
