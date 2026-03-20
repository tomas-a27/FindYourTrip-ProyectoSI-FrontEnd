import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOne, put } from '../../api/dataManager';
import { UsuarioDTO } from '../../entities/entities';

export const EditarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

  const esTelValido = nuevoValor.length >= 8 && !isNaN(Number(nuevoValor.replace(/\s/g, "")));
  const esEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoValor);

  const esPassNuevaLarga = passNueva.length >= 8;
  const contrasenasCoinciden = passNueva === passConfirmacion && passNueva !== '';

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

    const { contrasenaUsuario, contrasenaUsuarioConfirmacion, contrasenaUsuarioActual, fotoPerfil, ...dataBase } = usuarioToUpdate;

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
    }
  };

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!esPassNuevaLarga || !contrasenasCoinciden) {
      setError('Revise los requisitos de la nueva contraseña');
      return;
    }

    try {
      const { contrasenaUsuario, contrasenaUsuarioConfirmacion, contrasenaUsuarioActual, fotoPerfil, ...dataBase } = usuarioToUpdate;

      await put(`usuario/${usuarioToUpdate.idUsuario}`, {
        ...dataBase,
        contrasenaUsuarioActual: passActual,
        contrasenaUsuario: passNueva,
        contrasenaUsuarioConfirmacion: passConfirmacion,
      });

      setError('');
      setSuccess('El campo se actualizó correctamente');
      setMostrarModalPass(false);
      setPassActual('');
      setPassNueva('');
      setPassConfirmacion('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar contraseña');
    }
  };

  if (!usuarioToUpdate.idUsuario)
    return <p className="text-center mt-5">Usuario no encontrado</p>;

  const botonDeshabilitado = () => {
    if (campoSeleccionado === 'telefono') return !esTelValido;
    if (campoSeleccionado === 'email') return !esEmailValido;
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
        <h2 className="text-center mb-3">Editar datos de cuenta</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {success && (
          <div className="modal-overlay">
            <div className="custom-modal text-center">
              <button onClick={() => setSuccess('')} className="btn-cerrar">
                X
              </button>
              <h5>{success}</h5>
            </div>
          </div>
        )}

        <div className="editar-usuario-card">
          {usuarioToUpdate.tipoUsuario?.toLowerCase() === 'conductor' && (
            <div className="text-center mb-4">
              <img
                src={
                  fotoPerfilTemp
                    ? URL.createObjectURL(fotoPerfilTemp)
                    : fotoPerfil
                      ? URL.createObjectURL(fotoPerfil)
                      : usuarioToUpdate.fotoPerfil
                        ? bufferToBase64(usuarioToUpdate.fotoPerfil)
                        : ''
                }
                alt="Foto de perfil"
                className='usuario-foto-grande mb-0'
              />

              <div className="mt-0">
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => {
                    setCampoSeleccionado('fotoPerfil');
                    setFotoPerfil(null);
                  }}
                >
                  Renovar foto
                </button>
              </div>
            </div>
          )}

          {renderCampo(
            'Nombre',
            `${usuarioToUpdate.nombreUsuario} ${usuarioToUpdate.apellidoUsuario}`,
            'nombreCompleto'
          )}
          {renderCampo('Género', usuarioToUpdate.generoUsuario, 'generoUsuario')}
          {renderCampo('Teléfono', usuarioToUpdate.telefono, 'telefono')}
          {renderCampo('Email', usuarioToUpdate.email, 'email')}

          {usuarioToUpdate.tipoUsuario?.toLowerCase() === 'conductor' && (
            <>
              {renderCampo(
                'Fecha vencimiento licencia',
                usuarioToUpdate.vigenciaLicenciaConductorUsuario
                  ? new Date(usuarioToUpdate.vigenciaLicenciaConductorUsuario).toISOString().split('T')[0]
                  : '',
                'vigenciaLicenciaConductorUsuario'
              )}
            </>
          )}

          <div className="modificar-pass-container d-flex justify-content-between mt-4">
            {usuarioToUpdate.tipoUsuario?.toLowerCase() === 'conductor' && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(`/mostrar-vehiculo/${usuarioToUpdate.idUsuario}`)}
              >
                Ver mis vehículos
              </button>
            )}

            <button
              className="btn btn-outline-danger"
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
            <button onClick={cerrarModal} className="btn-cerrar position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-5 text-muted">
              <i className="bi bi-x-lg"></i>
            </button>

            <h5 className="text-center mb-4 fw-bold text-dark">
              Actualizar {campoSeleccionado === 'nombreCompleto' ? 'Nombre' : campoSeleccionado}
            </h5>

            <form onSubmit={handleSubmit}>
              {campoSeleccionado === 'nombreCompleto' ? (
                <>
                  <input
                    className="form-control mb-3 p-2"
                    placeholder="Nombre"
                    value={nuevoValor}
                    onChange={(e) => setNuevoValor(e.target.value)}
                    required
                  />
                  <input
                    className="form-control mb-3 p-2"
                    placeholder="Apellido"
                    value={nuevoApellido}
                    onChange={(e) => setNuevoApellido(e.target.value)}
                    required
                  />
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
                  <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                </select>
              ) : campoSeleccionado === 'telefono' ? (
                <div className="mb-4">
                  <input
                    className={`form-control p-2 ${nuevoValor && !esTelValido ? 'is-invalid' : ''} ${nuevoValor && esTelValido ? 'is-valid' : ''}`}
                    placeholder="Teléfono"
                    value={nuevoValor}
                    onChange={(e) => setNuevoValor(e.target.value)}
                    required
                  />
                  {nuevoValor && !esTelValido && (
                    <div className="invalid-feedback fw-semibold mt-1">
                      Debe contener al menos 8 números.
                    </div>
                  )}
                </div>
              ) : campoSeleccionado === 'email' ? (
                <div className="mb-4">
                  <input
                    type="email"
                    className={`form-control p-2 ${nuevoValor && !esEmailValido ? 'is-invalid' : ''} ${nuevoValor && esEmailValido ? 'is-valid' : ''}`}
                    placeholder="Email"
                    value={nuevoValor}
                    onChange={(e) => setNuevoValor(e.target.value)}
                    required
                  />
                  {nuevoValor && !esEmailValido && (
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
                  onChange={(e) => setFotoPerfilTemp(e.target.files?.[0] || null)}
                  required
                />
              ) : campoSeleccionado === 'vigenciaLicenciaConductorUsuario' ? (
                <input
                  type="date"
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
                  className="btn btn-success py-2 fw-bold shadow-sm"
                  disabled={botonDeshabilitado()}
                >
                  Guardar Cambios
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
            <button onClick={() => setMostrarModalPass(false)} className="btn-cerrar position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-5 text-muted">
              <i className="bi bi-x-lg"></i>
            </button>

            <h5 className="text-center mb-4 fw-bold text-dark">Modificar contraseña</h5>

            <form onSubmit={handleCambiarPassword}>
              <div className="mb-3">
                <label className="text-muted small fw-bold mb-1">Contraseña Actual</label>
                <input
                  type="password"
                  className="form-control p-2"
                  value={passActual}
                  onChange={(e) => setPassActual(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="text-muted small fw-bold mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  className={`form-control p-2 ${passNueva && !esPassNuevaLarga ? 'is-invalid' : ''} ${passNueva && esPassNuevaLarga ? 'is-valid' : ''}`}
                  value={passNueva}
                  onChange={(e) => setPassNueva(e.target.value)}
                  required
                />
                {passNueva && !esPassNuevaLarga && (
                  <div className="invalid-feedback fw-semibold" style={{ fontSize: '0.8rem' }}>
                    Mínimo 8 caracteres.
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="text-muted small fw-bold mb-1">Repetir Nueva Contraseña</label>
                <input
                  type="password"
                  className={`form-control p-2 ${passConfirmacion && !contrasenasCoinciden ? 'is-invalid' : ''} ${passConfirmacion && contrasenasCoinciden ? 'is-valid' : ''}`}
                  value={passConfirmacion}
                  onChange={(e) => setPassConfirmacion(e.target.value)}
                  required
                />
                {passConfirmacion && !contrasenasCoinciden && (
                  <div className="invalid-feedback fw-semibold" style={{ fontSize: '0.8rem' }}>
                    Las contraseñas no coinciden.
                  </div>
                )}
              </div>

              <div className="d-grid mt-2">
                <button
                  type="submit"
                  className="btn btn-success py-2 fw-bold shadow-sm"
                  disabled={!esPassNuevaLarga || !contrasenasCoinciden || !passActual}
                >
                  Actualizar Contraseña
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
          <div className="fs-5 text-dark">{valor}</div>
        </div>
        <button
          onClick={() => handleEditar(campo)}
          className="btn btn-light rounded-circle shadow-sm"
          style={{ width: '40px', height: '40px' }}
        >
          <i className="bi bi-pencil-fill text-success"></i>
        </button>
      </div>
    );
  }
};