import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../../api/dataManager';

export const LoginUsuario = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contrasenaUsuario, setContrasenaUsuario] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const response = await post('usuario/login', { email, contrasenaUsuario });

    if (response && response.status === 200) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.data));
      navigate('/home'); // Redirigir al inicio tras loguearse
    } else {
      setError(response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card custom-card shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4" style={{ color: '#2d4a2d' }}>Iniciar Sesión</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted fw-bold">Email</label>
              <input 
                type="email" 
                className="form-control custom-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label text-muted fw-bold">Contraseña</label>
              <input 
                type="password" 
                className="form-control custom-input" 
                value={contrasenaUsuario} 
                onChange={(e) => setContrasenaUsuario(e.target.value)} 
                required 
              />
            </div>
            
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-pastel-green">Ingresar</button>
            </div>
          </form>

          <div className="text-center mt-3">
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