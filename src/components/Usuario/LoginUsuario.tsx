import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../../api/dataManager';

// Importamos el logo
import logo from '../../images/logoFYT.png';

export const LoginUsuario = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contrasenaUsuario, setContrasenaUsuario] = useState('');
  const [error, setError] = useState('');

  const esEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const esContraValida = contrasenaUsuario.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Doble barrera de seguridad antes de enviar al backend
    if (!esEmailValido || !esContraValida) return;

    const response = await post('usuario/login', { email, contrasenaUsuario });

    if (response && response.status === 200) {
      // Guardamos el token y los datos del usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.data));
      
      const tipo = response.data.data.tipoUsuario;
      
      if (tipo === 'Administrador' || tipo === 'administrador') {
        navigate('/admin-home'); // Redirigir al panel de control de administrador
      } else {
        navigate('/home'); // Redirigir al inicio normal de pasajeros/conductores
      }
      
    } else {
      setError(response?.data?.message || 'Error al iniciar sesión');
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
              style={{ 
                width: '90px', 
                height: '90px', 
                objectFit: 'cover', 
                borderRadius: '50%',
                border: '3px solid #2d4a2d' 
              }} 
            />
            <h2 className="fw-bold mb-1" style={{ color: '#2d4a2d' }}>
              Find Your Trip
            </h2>
            <p className="text-muted fw-semibold fs-5 mt-2">Iniciar Sesión</p>
          </div>
          
          {error && <div className="alert alert-danger fw-bold">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted fw-bold">Email</label>
              <input 
                type="email" 
                className={`form-control custom-input ${email && !esEmailValido ? 'is-invalid' : ''} ${email && esEmailValido ? 'is-valid' : ''}`}
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              {email && !esEmailValido && (
                <div className="invalid-feedback fw-semibold mt-1">
                  Formato de email incorrecto.
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label className="form-label text-muted fw-bold">Contraseña</label>
              <input 
                type="password" 
                className={`form-control custom-input ${contrasenaUsuario && !esContraValida ? 'is-invalid' : ''} ${contrasenaUsuario && esContraValida ? 'is-valid' : ''}`}
                value={contrasenaUsuario} 
                onChange={(e) => setContrasenaUsuario(e.target.value)} 
                required 
              />
            </div>
            
            <div className="d-grid gap-2 mt-4">
              <button 
                type="submit" 
                className="btn btn-pastel-green py-2 fw-bold fs-5 shadow-sm"
                disabled={!esEmailValido || !esContraValida}
              >
                Ingresar
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">¿No tenés cuenta? </span>
            <Link to="/crear-usuario" className="text-decoration-none" style={{ color: '#6fb86f', fontWeight: 'bold' }}>
              Registrate acá
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};