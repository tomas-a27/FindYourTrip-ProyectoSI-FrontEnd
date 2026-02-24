import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../../api/dataManager';

export const CrearUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    apellidoUsuario: '',
    tipoDocumento: 'DNI',
    nroDocumento: '',
    email: '',
    telefono: '',
    contrasenaUsuario: '',
    generoUsuario: 'Femenino'
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const response = await post('usuario', formData);

    if (response && response.status === 201) {
      alert('¡Cuenta creada con éxito! Ahora podés iniciar sesión.');
      navigate('/login');
    } else {
      setError(response?.data?.message || 'Error al crear usuario');
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card custom-card shadow-sm" style={{ width: '100%', maxWidth: '600px' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4" style={{ color: '#2d4a2d' }}>Crear una Cuenta</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted fw-bold">Nombre</label>
                <input type="text" className="form-control custom-input" name="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted fw-bold">Apellido</label>
                <input type="text" className="form-control custom-input" name="apellidoUsuario" value={formData.apellidoUsuario} onChange={handleChange} required />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted fw-bold">Tipo Doc.</label>
                <select className="form-select custom-input" name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}>
                  <option value="DNI">DNI</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Cedula">Cédula</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted fw-bold">Nro. Documento</label>
                <input type="text" className="form-control custom-input" name="nroDocumento" value={formData.nroDocumento} onChange={handleChange} required />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted fw-bold">Teléfono</label>
                <input type="text" className="form-control custom-input" name="telefono" value={formData.telefono} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted fw-bold">Género</label>
                <select className="form-select custom-input" name="generoUsuario" value={formData.generoUsuario} onChange={handleChange}>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                  <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted fw-bold">Email</label>
              <input type="email" className="form-control custom-input" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="form-label text-muted fw-bold">Contraseña</label>
              <input type="password" className="form-control custom-input" name="contrasenaUsuario" value={formData.contrasenaUsuario} onChange={handleChange} required />
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-light-cancel px-4" onClick={() => navigate('/login')}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-pastel-green px-5">
                Crear Cuenta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};