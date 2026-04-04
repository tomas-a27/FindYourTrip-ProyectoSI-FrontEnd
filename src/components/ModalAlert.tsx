import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ModalAlertProps {
  show: boolean;
  onClose: () => void;
  message: string;
  routeNav?: string;
}

export const ModalAlertAviso = ({
  show,
  onClose,
  message,
  routeNav,
}: ModalAlertProps) => {
  const navigate = useNavigate();

  const handleCloseModal = () => {
    onClose();
    if (routeNav) {
      navigate(routeNav);
    }
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton className="border-0 pb-0 pt-3 px-3" />

      <Modal.Body className="text-center px-4 pb-4 pt-0">
        <i 
          className="bi bi-info-circle-fill mb-3" 
          style={{ fontSize: '48px', color: '#385e38' }}
        ></i>
        <p className="fs-5 text-muted m-0 fw-semibold">{message}</p>
      </Modal.Body>
    </Modal>
  );
};