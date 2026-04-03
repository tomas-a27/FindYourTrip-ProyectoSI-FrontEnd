import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../../api/dataManager';
import logo from '../../images/logoFYT.png';
import { ModalAlertAviso } from '../ModalAlert';

export const RecuperarContrasena = () => {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1); 
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');

  const esEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const esContraLarga = nuevaContrasena.length >= 8;
  const esCodigoValido = codigo.length === 6 && !isNaN(Number(codigo));
  
  const contrasenasCoinciden = nuevaContrasena === confirmarContrasena && nuevaContrasena !== '';

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!esEmailValido) return;

    try {
      const res = await post('usuario/recuperar-contrasena', { email });
      if (res && res.status === 200) {
        setPaso(2);
        setMensaje('Te hemos enviado un código de 6 dígitos a tu email.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al solicitar el código');
    }
  };

  const handleRestablecer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!esContraLarga || !esCodigoValido || !contrasenasCoinciden) return;

    try {
      const res = await post('usuario/restablecer-contrasena', { email, codigo, nuevaContrasena });
      if (res && res.status === 200) {
        setMensajeModal('¡Contraseña actualizada con éxito!');
        setMostrarModalExito(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <div className="card custom-card shadow-lg border-0" style={{ width: '100%', maxWidth: '420px', borderRadius: '15px' }}>
        <div className="card-body p-5">
          
          <div className="text-center mb-4">
            <img 
              src={logo} 
              alt="Find Your Trip Logo" 
              className="mb-3 shadow-sm" 
              style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '50%', border: '3px solid #2d4a2d' }} 
            />
            <h2 className="fw-bold mb-1" style={{ color: '#2d4a2d' }}>
              Recuperar Cuenta
            </h2>
          </div>
          
          {error && <div className="alert alert-danger fw-bold">{error}</div>}
          {mensaje && <div className="alert alert-success fw-bold">{mensaje}</div>}

          {paso === 1 && (
            <form onSubmit={handleSolicitarCodigo}>
              <p className="text-muted text-center mb-4">Ingresá tu correo electrónico y te enviaremos un código de seguridad para restablecer tu contraseña.</p>
              
              <div className="mb-4">
                <label className="form-label text-muted fw-bold">Email</label>
                <input 
                  type="email" 
                  className={`form-control custom-input ${email && !esEmailValido ? 'is-invalid' : ''} ${email && esEmailValido ? 'is-valid' : ''}`}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-pastel-green py-2 fw-bold" disabled={!esEmailValido}>
                  Enviar Código
                </button>
              </div>
            </form>
          )}

          {paso === 2 && (
            <form onSubmit={handleRestablecer}>
              <div className="mb-3">
                <label className="form-label text-muted fw-bold">Código de 6 dígitos</label>
                <input 
                  type="text" 
                  maxLength={6}
                  className={`form-control custom-input text-center fs-4 letter-spacing-2 ${codigo && !esCodigoValido ? 'is-invalid' : ''}`}
                  placeholder="000000"
                  value={codigo} 
                  onChange={(e) => setCodigo(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted fw-bold">Nueva Contraseña</label>
                <input 
                  type="password" 
                  className={`form-control custom-input ${nuevaContrasena && !esContraLarga ? 'is-invalid' : ''} ${nuevaContrasena && esContraLarga ? 'is-valid' : ''}`}
                  value={nuevaContrasena} 
                  onChange={(e) => setNuevaContrasena(e.target.value)} 
                  required 
                />
                {nuevaContrasena && !esContraLarga && (
                  <div className="invalid-feedback fw-semibold mt-1">Mínimo 8 caracteres.</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-bold">Repetir Contraseña</label>
                <input 
                  type="password" 
                  className={`form-control custom-input ${confirmarContrasena && !contrasenasCoinciden ? 'is-invalid' : ''} ${confirmarContrasena && contrasenasCoinciden ? 'is-valid' : ''}`}
                  value={confirmarContrasena} 
                  onChange={(e) => setConfirmarContrasena(e.target.value)} 
                  required 
                />
                {confirmarContrasena && !contrasenasCoinciden && (
                  <div className="invalid-feedback fw-semibold mt-1">Las contraseñas no coinciden.</div>
                )}
              </div>

              <div className="d-grid gap-2 mt-4">
                <button 
                  type="submit" 
                  className="btn btn-pastel-green py-2 fw-bold" 
                  disabled={!esContraLarga || !esCodigoValido || !contrasenasCoinciden}
                >
                  Confirmar
                </button>
              </div>
            </form>
          )}

          <div className="text-center mt-4">
            <Link to="/login" className="text-decoration-none text-muted fw-bold">
              <i className="bi bi-arrow-left me-1"></i> Volver al Login
            </Link>
          </div>

        </div>
      </div>

      <ModalAlertAviso
        show={mostrarModalExito}
        onClose={() => setMostrarModalExito(false)}
        message={mensajeModal}
        routeNav="/login"
      />
    </div>
  );
};