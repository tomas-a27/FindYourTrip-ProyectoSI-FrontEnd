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
      <Modal.Header closeButton className="border-0"></Modal.Header>

      <Modal.Body className="text-center pb-4 pt-1">
        <b>
          <p className="fs-5 text-muted m-0">{message}</p>
        </b>
      </Modal.Body>
    </Modal>
  );
};