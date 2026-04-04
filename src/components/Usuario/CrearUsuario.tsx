import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../../api/dataManager';
import { ModalAlertAviso } from '../ModalAlert.tsx';

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
    contrasenaUsuarioConfirmacion: '',
    generoUsuario: 'Masculino',
  });
  const [error, setError] = useState('');
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  const nroDocumentoLimpio = formData.nroDocumento.trim();

  const esDocValido =
    nroDocumentoLimpio.length >= 7 && /^[A-Za-z0-9]+$/.test(nroDocumentoLimpio);

  const telefonoLimpio = formData.telefono.trim();

  const esTelValido =
    /^\+[0-9\s]+$/.test(telefonoLimpio) &&
    telefonoLimpio.replace(/\D/g, '').length >= 10;

  const esEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const esContraLarga = formData.contrasenaUsuario.length >= 8;
  const contrasenasCoinciden =
    formData.contrasenaUsuario === formData.contrasenaUsuarioConfirmacion &&
    formData.contrasenaUsuario !== '';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Doble chequeo antes de enviar al backend
    if (
      !esDocValido ||
      !esTelValido ||
      !esEmailValido ||
      !esContraLarga ||
      !contrasenasCoinciden
    ) {
      setError('Por favor, revise los campos en rojo antes de continuar.');
      return;
    }

    const response = await post('usuario', formData);

    if (response && response.status === 201) {
      setMostrarModalExito(true);
    } else {
      setError(response?.data?.message || 'Error al crear usuario');
    }
  };

  return (
    <>
      <div className="container mt-5 mb-5 d-flex justify-content-center">
        <div
          className="card custom-card shadow-sm border-0"
          style={{ width: '100%', maxWidth: '600px', borderRadius: '15px' }}
        >
          <div className="card-body p-4 p-md-5">
            <h2
              className="text-center mb-4 fw-bold"
              style={{ color: '#2d4a2d' }}
            >
              Crear una Cuenta
            </h2>

            {error && <div className="alert alert-danger fw-bold">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-bold">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    name="nombreUsuario"
                    value={formData.nombreUsuario}
                    placeholder="Ej: Juan"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-bold">
                    Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    name="apellidoUsuario"
                    value={formData.apellidoUsuario}
                    placeholder="Ej: Perez"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label text-muted fw-bold">
                    Tipo Doc.
                  </label>
                  <select
                    className="form-select custom-input"
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                  >
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="CUIT">CUIT</option>
                    <option value="CI">CI</option>
                    <option value="ERRO">ERRO</option>
                    <option value="LC">LC</option>
                    <option value="LE">LE</option>
                    <option value="LEM">LEM</option>
                  </select>
                </div>
                <div className="col-md-8 mb-3">
                  <label className="form-label text-muted fw-bold">
                    Nro. Documento
                  </label>
                  <input
                    type="text"
                    className={`form-control custom-input ${formData.nroDocumento && !esDocValido ? 'is-invalid' : ''} ${formData.nroDocumento && esDocValido ? 'is-valid' : ''}`}
                    name="nroDocumento"
                    value={formData.nroDocumento}
                    placeholder="Ej: 12345678"
                    onChange={handleChange}
                    required
                  />
                  {formData.nroDocumento && !esDocValido && (
                    <div className="invalid-feedback fw-semibold">
                      Debe contener al menos 7 caracteres alfanuméricos (sin
                      símbolos).
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-bold">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className={`form-control custom-input ${formData.telefono && !esTelValido ? 'is-invalid' : ''} ${formData.telefono && esTelValido ? 'is-valid' : ''}`}
                    name="telefono"
                    value={formData.telefono}
                    placeholder="Ej: +541112345678"
                    onChange={handleChange}
                    required
                  />
                  {formData.telefono && !esTelValido && (
                    <div className="invalid-feedback fw-semibold">
                      Debe comenzar con + y tener al menos 10 números.
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-bold">
                    Género
                  </label>
                  <select
                    className="form-select custom-input"
                    name="generoUsuario"
                    value={formData.generoUsuario}
                    onChange={handleChange}
                  >
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decirlo">
                      Prefiero no decirlo
                    </option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fw-bold">Email</label>
                <input
                  type="email"
                  className={`form-control custom-input ${formData.email && !esEmailValido ? 'is-invalid' : ''} ${formData.email && esEmailValido ? 'is-valid' : ''}`}
                  name="email"
                  value={formData.email}
                  placeholder="Ej: juanperez@gmail.com"
                  onChange={handleChange}
                  required
                />
                {formData.email && !esEmailValido && (
                  <div className="invalid-feedback fw-semibold">
                    Formato de email incorrecto.
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label text-muted fw-bold">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className={`form-control custom-input ${formData.contrasenaUsuario && !esContraLarga ? 'is-invalid' : ''} ${formData.contrasenaUsuario && esContraLarga ? 'is-valid' : ''}`}
                    name="contrasenaUsuario"
                    value={formData.contrasenaUsuario}
                    placeholder="Ej: MiClave123"
                    onChange={handleChange}
                    required
                  />
                  {formData.contrasenaUsuario && !esContraLarga && (
                    <div
                      className="invalid-feedback fw-semibold"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Mínimo 8 caracteres.
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-4">
                  <label className="form-label text-muted fw-bold">
                    Repetir contraseña
                  </label>
                  <input
                    type="password"
                    className={`form-control custom-input ${formData.contrasenaUsuarioConfirmacion && !contrasenasCoinciden ? 'is-invalid' : ''} ${formData.contrasenaUsuarioConfirmacion && contrasenasCoinciden ? 'is-valid' : ''}`}
                    name="contrasenaUsuarioConfirmacion"
                    value={formData.contrasenaUsuarioConfirmacion}
                    placeholder="Ej: MiClave123"
                    onChange={handleChange}
                    required
                  />
                  {formData.contrasenaUsuarioConfirmacion &&
                    !contrasenasCoinciden && (
                      <div
                        className="invalid-feedback fw-semibold"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Las contraseñas no coinciden.
                      </div>
                    )}
                </div>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <button
                  type="button"
                  className="btn btn-light-cancel px-4"
                  onClick={() => navigate('/login')}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-pastel-green px-5"
                  disabled={
                    !esDocValido ||
                    !esTelValido ||
                    !esEmailValido ||
                    !esContraLarga ||
                    !contrasenasCoinciden
                  }
                >
                  Crear Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ModalAlertAviso
        show={mostrarModalExito}
        onClose={() => setMostrarModalExito(false)}
        message="¡Cuenta creada con éxito! Ahora podés iniciar sesión."
        routeNav="/login"
      />
    </>
  );
};
