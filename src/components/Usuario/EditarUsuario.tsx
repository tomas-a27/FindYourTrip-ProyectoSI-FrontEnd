import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOne, put } from '../../api/dataManager';
import { UsuarioDTO } from '../../entities/entities';
import { useAuth } from '../../auth/AuthContext.tsx';

export const EditarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userId } = useAuth();

  if (userId !== Number(id)) {
    return <p className="text-center mt-5">No autorizado</p>;
  }

  const { data } = getOne<UsuarioDTO>('usuario/' + id);

  const [usuarioToUpdate, setUsuarioToUpdate] = useState<UsuarioDTO>({
    idUsuario: 0,
    nombreUsuario: '',
    apellidoUsuario: '',
    email: '',
    telefono: '',
    contrasenaUsuario: '',
    contrasenaUsuarioConfirmacion: '',
    contrasenaUsuarioActual: '',
    generoUsuario: '',
    tipoUsuario: '',
  });

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  useEffect(() => {
    if (data) {
      setUsuarioToUpdate({
        idUsuario: data.idUsuario,
        nombreUsuario: data.nombreUsuario,
        apellidoUsuario: data.apellidoUsuario,
        email: data.email,
        telefono: data.telefono,
        generoUsuario: data.generoUsuario,
        tipoUsuario: data.tipoUsuario,
        tipoDocumento: data.tipoDocumento,
        nroDocumento: data.nroDocumento,
        vigenciaLicenciaConductorUsuario: data.vigenciaLicenciaConductorUsuario,
        fotoPerfil: data.fotoPerfil,

        contrasenaUsuario: '',
        contrasenaUsuarioConfirmacion: '',
        contrasenaUsuarioActual: '',
      });
    }
  }, [data]);

  const [campoSeleccionado, setCampoSeleccionado] = useState('');
  const [nuevoValor, setNuevoValor] = useState('');
  const [nuevoApellido, setNuevoApellido] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotoPerfilTemp, setFotoPerfilTemp] = useState<File | null>(null);

  const [mostrarModalPass, setMostrarModalPass] = useState(false);
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [passConfirmacion, setPassConfirmacion] = useState('');

  const telefonoLimpio = nuevoValor.trim();

  const esTelValido =
    /^\+[0-9\s]+$/.test(telefonoLimpio) &&
    telefonoLimpio.replace(/\D/g, '').length >= 10;

  const esEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoValor);

  const esPassNuevaLarga = passNueva.length >= 8;
  const contrasenasCoinciden =
    passNueva === passConfirmacion && passNueva !== '';
  
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const handleEditar = (campo: string) => {
    setCampoSeleccionado(campo);

    if (campo === 'nombreCompleto') {
      setNuevoValor(usuarioToUpdate.nombreUsuario);
      setNuevoApellido(usuarioToUpdate.apellidoUsuario);
    } else {
      setNuevoValor((usuarioToUpdate as any)[campo]);
    }

    setError('');
  };

  const cerrarModal = () => {
    setCampoSeleccionado('');
    setNuevoValor('');
    setNuevoApellido('');
    setError('');
    setFotoPerfilTemp(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (campoSeleccionado === 'telefono' && !esTelValido) return;
    if (campoSeleccionado === 'email' && !esEmailValido) return;

    setLoadingUpdate(true);
    const {
      contrasenaUsuario,
      contrasenaUsuarioConfirmacion,
      contrasenaUsuarioActual,
      fotoPerfil,
      ...dataBase
    } = usuarioToUpdate;

    try {
      if (campoSeleccionado === 'fotoPerfil') {
        const formData = new FormData();

        Object.entries(dataBase).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        if (fotoPerfilTemp) {
          formData.append('fotoPerfil', fotoPerfilTemp);
        }

        await put(`usuario/${usuarioToUpdate.idUsuario}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (fotoPerfilTemp) {
          setFotoPerfil(fotoPerfilTemp);
          setFotoPerfilTemp(null);
        }
      } else {
        let dataPatch: any;

        if (campoSeleccionado === 'nombreCompleto') {
          dataPatch = {
            ...dataBase,
            nombreUsuario: nuevoValor,
            apellidoUsuario: nuevoApellido,
          };
        } else {
          dataPatch = {
            ...dataBase,
            [campoSeleccionado]: nuevoValor,
          };
        }

        await put(`usuario/${usuarioToUpdate.idUsuario}`, dataPatch);

        setUsuarioToUpdate({
          ...usuarioToUpdate,
          ...dataPatch,
        });
      }

      setSuccess('El campo se actualizó correctamente');
      cerrarModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar');
    } finally {
      setLoadingUpdate(false); 
    }
  };

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!esPassNuevaLarga || !contrasenasCoinciden) {
      setError('Revise los requisitos de la nueva contraseña');
      return;
    }

    setLoadingPass(true); 

    try {
      const {
        contrasenaUsuario,
        contrasenaUsuarioConfirmacion,
        contrasenaUsuarioActual,
        fotoPerfil,
        ...dataBase
      } = usuarioToUpdate;

      await put(`usuario/${usuarioToUpdate.idUsuario}`, {
        ...dataBase,
        contrasenaUsuarioActual: passActual,
        contrasenaUsuario: passNueva,
        contrasenaUsuarioConfirmacion: passConfirmacion,
      });

      setError('');
      setSuccess('La contraseña se actualizó correctamente');
      setMostrarModalPass(false);
      setPassActual('');
      setPassNueva('');
      setPassConfirmacion('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setLoadingPass(false); 
    }
  };

  if (!data) {
    return (
      <div className="text-center mt-5 p-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3 text-muted fw-bold">Cargando datos...</p>
      </div>
    );
  }

  if (!data.idUsuario) {
    return <p className="text-center mt-5">Usuario no encontrado</p>;
  }

  // --- ACÁ ESTÁ LA CORRECCIÓN DE LA LÓGICA DEL BOTÓN ---
  const botonDeshabilitado = () => {
    if (campoSeleccionado === 'telefono') return !esTelValido;
    if (campoSeleccionado === 'email') return !esEmailValido;
    
    // Si estamos editando la foto, el botón se bloquea si NO hay una foto temporal seleccionada
    if (campoSeleccionado === 'fotoPerfil') {
      return fotoPerfilTemp === null;
    }

    if (campoSeleccionado === 'nombreCompleto') {
      return (
        nuevoValor.trim().length === 0 || nuevoApellido.trim().length === 0
      );
    }

    if (typeof nuevoValor === 'string' && nuevoValor.trim().length === 0)
      return true;

    return false;
  };

  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data) return '';

    const binary = buffer.data
      .map((byte: number) => String.fromCharCode(byte))
      .join('');

    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  return (
    <div className="container mt-5 pb-5 mb-5 d-flex justify-content-center">
      <div className="editar-usuario-wrapper">
        <div
          className="mb-4 d-flex align-items-center"
          onClick={() => navigate(`/mi-cuenta/${usuarioToUpdate.idUsuario}`)}
          style={{ cursor: 'pointer' }}
        >
          <div
            className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: '24px', height: '24px' }}
          >
            <i className="bi bi-arrow-left text-white fs-9"></i>
          </div>
          <span className="fw-bold text-success fs-7">Volver a Mi Cuenta</span>
        </div>

        <h2 className="text-center mb-3">Editar datos de cuenta</h2>

        {success && (
          <div className="modal-overlay">
            <div className="custom-modal text-center p-4">
              <button onClick={() => setSuccess('')} className="btn-cerrar position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-5 text-muted">
                <i className="bi bi-x-lg"></i>
              </button>
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5 className="fw-bold mb-0">{success}</h5>
            </div>
          </div>
        )}

        <div className="editar-usuario-card bg-white p-4 rounded-4 shadow-sm border">
          {usuarioToUpdate.tipoUsuario?.toLowerCase() === 'conductor' && (
            <div className="text-center mb-4 pb-3 border-bottom">
              <img
                src={
                  fotoPerfilTemp
                    ? URL.createObjectURL(fotoPerfilTemp)
                    : fotoPerfil
                      ? URL.createObjectURL(fotoPerfil)
                      : usuarioToUpdate.fotoPerfil
                        ? bufferToBase64(usuarioToUpdate.fotoPerfil)
                        : 'https://via.placeholder.com/150'
                }
                alt="Foto de perfil"
                className="usuario-foto-grande mb-3 shadow-sm border border-2"
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%' }}
              />

              <div>
                <button
                  className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold"
                  onClick={() => {
                    setCampoSeleccionado('fotoPerfil');
                    // setFotoPerfil(null); <-- Saqué esto porque rompía visualmente si cerrabas el modal sin guardar
                  }}
                >
                  Cambiar foto
                </button>
              </div>
            </div>
          )}

          {renderCampo(
            'Nombre Completo',
            `${usuarioToUpdate.nombreUsuario} ${usuarioToUpdate.apellidoUsuario}`,
            'nombreCompleto',
          )}
          {renderCampo(
            'Género',
            usuarioToUpdate.generoUsuario,
            'generoUsuario',
          )}
          {renderCampo('Teléfono', usuarioToUpdate.telefono, 'telefono')}
          {renderCampo('Email', usuarioToUpdate.email, 'email')}

          {usuarioToUpdate.tipoUsuario?.toLowerCase() === 'conductor' && (
            <>
              {renderCampo(
                'Fecha vencimiento licencia',
                usuarioToUpdate.vigenciaLicenciaConductorUsuario
                  ? new Date(usuarioToUpdate.vigenciaLicenciaConductorUsuario)
                      .toISOString()
                      .split('T')[0]
                  : '',
                'vigenciaLicenciaConductorUsuario',
              )}
            </>
          )}

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-5 pt-3 gap-3">
            {usuarioToUpdate.tipoUsuario?.toLowerCase() === 'conductor' && (
              <button
                className="btn btn-outline-secondary w-100 rounded-pill fw-bold"
                onClick={() =>
                  navigate(`/mostrar-vehiculo/${usuarioToUpdate.idUsuario}`)
                }
              >
                Mis vehículos
              </button>
            )}

            <button
              className="btn btn-outline-danger w-100 rounded-pill fw-bold"
              onClick={() => {
                setError('');
                setMostrarModalPass(true);
              }}
            >
              Modificar contraseña
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL PARA EDITAR DATOS --- */}
      {campoSeleccionado && (
        <div className="modal-overlay">
          <div className="custom-modal p-4" style={{ maxWidth: '400px' }}>
            <button
              onClick={cerrarModal}
              disabled={loadingUpdate}
              className="btn-cerrar position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-5 text-muted"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <h5 className="text-center mb-4 fw-bold text-dark">
              Actualizar{' '}
              {campoSeleccionado === 'nombreCompleto'
                ? 'nombre y apellido'
                : campoSeleccionado === 'generoUsuario'
                ? 'género'
                : campoSeleccionado === 'telefono'
                ? 'teléfono'
                : campoSeleccionado === 'fotoPerfil'
                ? 'foto de perfil'
                : campoSeleccionado}
            </h5>

            {error && (
              <div className="alert alert-danger text-center fw-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {campoSeleccionado === 'nombreCompleto' ? (
                <>
                  <div className="mb-3">
                    <input
                      className={`form-control p-2 ${nuevoValor.trim().length === 0 ? 'is-invalid' : 'is-valid'}`}
                      style={
                        nuevoValor.trim().length > 0
                          ? { backgroundImage: 'none' }
                          : undefined
                      }
                      placeholder="Ej: Juan"
                      value={nuevoValor}
                      onChange={(e) => setNuevoValor(e.target.value)}
                      required
                    />
                    {nuevoValor.trim().length === 0 && (
                      <div
                        className="invalid-feedback fw-semibold mt-1"
                        style={{ fontSize: '0.8rem' }}
                      >
                        El nombre no puede estar vacío.
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <input
                      className={`form-control p-2 ${nuevoApellido.trim().length === 0 ? 'is-invalid' : 'is-valid'}`}
                      style={
                        nuevoApellido.trim().length > 0
                          ? { backgroundImage: 'none' }
                          : undefined
                      }
                      placeholder="Ej: Perez"
                      value={nuevoApellido}
                      onChange={(e) => setNuevoApellido(e.target.value)}
                      required
                    />
                    {nuevoApellido.trim().length === 0 && (
                      <div
                        className="invalid-feedback fw-semibold mt-1"
                        style={{ fontSize: '0.8rem' }}
                      >
                        El apellido no puede estar vacío.
                      </div>
                    )}
                  </div>
                </>
              ) : campoSeleccionado === 'generoUsuario' ? (
                <select
                  className="form-select mb-4 p-2"
                  value={nuevoValor}
                  onChange={(e) => setNuevoValor(e.target.value)}
                >
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
              ) : campoSeleccionado === 'telefono' ? (
                <div className="mb-4">
                  <input
                    type="tel"
                    className={`form-control p-2 ${
                      nuevoValor.trim().length === 0
                        ? 'is-invalid'
                        : nuevoValor && esTelValido
                        ? 'is-valid'
                        : nuevoValor && !esTelValido
                        ? 'is-invalid'
                        : ''
                    }`}
                    style={
                      nuevoValor && esTelValido
                        ? { backgroundImage: 'none' }
                        : undefined
                    }
                    placeholder="Ej: +541112345678"
                    value={nuevoValor}
                    onChange={(e) => setNuevoValor(e.target.value)}
                    required
                  />

                  {nuevoValor.trim().length === 0 && (
                    <div className="invalid-feedback fw-semibold mt-1">
                      El teléfono no puede estar vacío.
                    </div>
                  )}

                  {nuevoValor && nuevoValor.trim().length > 0 && !esTelValido && (
                    <div className="invalid-feedback fw-semibold mt-1">
                      Debe comenzar con + y tener al menos 10 números.
                    </div>
                  )}
                </div>
              ) : campoSeleccionado === 'email' ? (
                <div className="mb-4">
                  <input
                    type="email"
                    className={`form-control p-2 ${
                      nuevoValor.trim().length === 0
                        ? 'is-invalid'
                        : nuevoValor && esEmailValido
                        ? 'is-valid'
                        : nuevoValor && !esEmailValido
                        ? 'is-invalid'
                        : ''
                    }`}
                    style={
                      nuevoValor && esEmailValido
                        ? { backgroundImage: 'none' }
                        : undefined
                    }
                    placeholder="Ej: juanperez@gmail.com"
                    value={nuevoValor}
                    onChange={(e) => setNuevoValor(e.target.value)}
                    required
                  />

                  {nuevoValor.trim().length === 0 && (
                    <div className="invalid-feedback fw-semibold mt-1">
                      El email no puede estar vacío.
                    </div>
                  )}

                  {nuevoValor && nuevoValor.trim().length > 0 && !esEmailValido && (
                    <div className="invalid-feedback fw-semibold mt-1">
                      Formato de email incorrecto.
                    </div>
                  )}
                </div>
              ) : campoSeleccionado === 'fotoPerfil' ? (
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-4 p-2"
                  onChange={(e) =>
                    setFotoPerfilTemp(e.target.files?.[0] || null)
                  }
                  required
                />
              ) : campoSeleccionado === 'vigenciaLicenciaConductorUsuario' ? (
                <input
                  type="date"
                  min={today}
                  className="form-control mb-4 p-2"
                  value={nuevoValor}
                  onChange={(e) => setNuevoValor(e.target.value)}
                  required
                />
              ) : (
                <input
                  className="form-control mb-4 p-2"
                  value={nuevoValor}
                  onChange={(e) => setNuevoValor(e.target.value)}
                  required
                />
              )}

              <div className="d-grid mt-2">
                <button
                  type="submit"
                  className="btn btn-success py-2 fw-bold shadow-sm d-flex justify-content-center align-items-center"
                  disabled={botonDeshabilitado() || loadingUpdate}
                >
                  {loadingUpdate ? (
                    <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                  ) : (
                    'Actualizar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONTRASEÑA --- */}
      {mostrarModalPass && (
        <div className="modal-overlay">
          <div className="custom-modal p-4" style={{ maxWidth: '400px' }}>
            <button
              onClick={() => setMostrarModalPass(false)}
              disabled={loadingPass}
              className="btn-cerrar position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-5 text-muted"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <h5 className="text-center mb-4 fw-bold text-dark">
              Modificar contraseña
            </h5>

            {error && (
              <div className="alert alert-danger text-center fw-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleCambiarPassword}>
              <div className="mb-3">
                <label className="text-muted small fw-bold mb-1">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  className="form-control p-2"
                  value={passActual}
                  onChange={(e) => setPassActual(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="text-muted small fw-bold mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  className={`form-control p-2 ${passNueva && !esPassNuevaLarga ? 'is-invalid' : ''} ${passNueva && esPassNuevaLarga ? 'is-valid' : ''}`}
                  style={
                    passNueva && esPassNuevaLarga
                      ? { backgroundImage: 'none' }
                      : undefined
                  }
                  value={passNueva}
                  onChange={(e) => setPassNueva(e.target.value)}
                  required
                />
                {passNueva && !esPassNuevaLarga && (
                  <div
                    className="invalid-feedback fw-semibold"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Mínimo 8 caracteres.
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="text-muted small fw-bold mb-1">
                  Repetir Nueva Contraseña
                </label>
                <input
                  type="password"
                  className={`form-control p-2 ${passConfirmacion && !contrasenasCoinciden ? 'is-invalid' : ''} ${passConfirmacion && contrasenasCoinciden ? 'is-valid' : ''}`}
                  style={
                    passConfirmacion && contrasenasCoinciden
                      ? { backgroundImage: 'none' }
                      : undefined
                  }
                  value={passConfirmacion}
                  onChange={(e) => setPassConfirmacion(e.target.value)}
                  required
                />
                {passConfirmacion && !contrasenasCoinciden && (
                  <div
                    className="invalid-feedback fw-semibold"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Las contraseñas no coinciden.
                  </div>
                )}
              </div>

              <div className="d-grid mt-2">
                <button
                  type="submit"
                  className="btn btn-success py-2 fw-bold shadow-sm d-flex justify-content-center align-items-center"
                  disabled={
                    !esPassNuevaLarga || !contrasenasCoinciden || !passActual || loadingPass
                  }
                >
                  {loadingPass ? (
                    <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                  ) : (
                    'Actualizar Contraseña'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function renderCampo(label: string, valor: string, campo: string) {
    return (
      <div className="campo-box d-flex justify-content-between align-items-center border-bottom py-3">
        <div>
          <div className="text-muted small fw-bold">{label}</div>
          <div className="fs-5 text-dark fw-medium">{valor}</div>
        </div>
        <button
          onClick={() => handleEditar(campo)}
          className="btn btn-light rounded-circle shadow-sm d-flex justify-content-center align-items-center"
          style={{ width: '40px', height: '40px', border: '1px solid #eaeaea' }}
        >
          <i className="bi bi-pencil-fill text-success"></i>
        </button>
      </div>
    );
  }
};