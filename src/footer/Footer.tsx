import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './footer.css';

export function Footer() {
  return (
    <footer className="footer-custom">
      <div className="footer-container">
        <Link to="/home" className="footer-item">
          <i className="bi bi-house-door-fill footer-icon"></i>
          <span className="footer-text fw-semibold">Inicio</span>
        </Link>

        <Link to="" className="footer-item">
          <i className="bi bi-car-front-fill footer-icon"></i>
          <span className="footer-text fw-semibold">Mis viajes</span>
        </Link>

        <Link to="" className="footer-item">
          <i className="bi bi-person-circle footer-icon"></i>
          <span className="footer-text fw-semibold">Mi cuenta</span>
        </Link>
      </div>
    </footer>
  );
}
