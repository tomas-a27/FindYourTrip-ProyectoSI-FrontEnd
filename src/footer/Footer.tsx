import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UsuarioDTO } from '../entities/entities';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './footer.css';

export function Footer() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!usuario) return null;

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

        <Link to={`/editar-usuario/${usuario.idUsuario}`} className="footer-item">
          <i className="bi bi-person-circle footer-icon"></i>
          <span className="footer-text fw-semibold">Mi cuenta</span>
        </Link>
      </div>
    </footer>
  );
}