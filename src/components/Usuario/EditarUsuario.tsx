import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOne, patch } from '../../api/dataManager';
import { UsuarioDTO } from '../../entities/entities';

export const EditarUsuario = () => {
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
  });

  useEffect(() => {
    if (data) {
      setUsuarioToUpdate({
        idUsuario: data.idUsuario,
        nombreUsuario: data.nombreUsuario,
        apellidoUsuario: data.apellidoUsuario,
        email: data.email,
        telefono: data.telefono,
        contrasenaUsuario: data.contrasenaUsuario,
        contrasenaUsuarioConfirmacion: data.contrasenaUsuarioConfirmacion,
        contrasenaUsuarioActual: data.contrasenaUsuarioActual,
        generoUsuario: data.generoUsuario,
      });
    }
  }, [data]);

  const [campoSeleccionado, setCampoSeleccionado] = useState('');
  const [nuevoValor, setNuevoValor] = useState('');
  const [nuevoApellido, setNuevoApellido] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [mostrarModalPass, setMostrarModalPass] = useState(false);
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [passConfirmacion, setPassConfirmacion] = useState('');

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let dataPatch: any;

    if (campoSeleccionado === 'nombreCompleto') {
      dataPatch = {
        nombreUsuario: nuevoValor,
        apellidoUsuario: nuevoApellido,
      };
    } else {
      dataPatch = {
        [campoSeleccionado]: nuevoValor,
      };
    }

    try {
      const response = await patch(`usuario/${usuarioToUpdate.idUsuario}`, dataPatch);

      setUsuarioToUpdate({
        ...usuarioToUpdate,
        ...dataPatch,
      });
      setSuccess('El campo se actualizó correctamente');
      cerrarModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar');
    }
  };

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passNueva !== passConfirmacion) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await patch(`usuario/${usuarioToUpdate.idUsuario}`, {
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

  return (
    <div className="container mt-5 d-flex justify-content-center">
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
          {renderCampo(
            'Nombre',
            `${usuarioToUpdate.nombreUsuario} ${usuarioToUpdate.apellidoUsuario}`,
            'nombreCompleto'
          )}
          {renderCampo('Género', usuarioToUpdate.generoUsuario, 'generoUsuario')}
          {renderCampo('Teléfono', usuarioToUpdate.telefono, 'telefono')}
          {renderCampo('Email', usuarioToUpdate.email, 'email')}

          <div className="modificar-pass-container">
            <span
              className="modificar-pass-link"
              onClick={() => {
                setError('');
                setMostrarModalPass(true);
              }}
            >
              Modificar contraseña
            </span>
          </div>
        </div>
      </div>

      {campoSeleccionado && (
        <div className="modal-overlay">
          <div className="custom-modal">
            <button onClick={cerrarModal} className="btn-cerrar">
              X
            </button>

            <h6 className="text-center mb-3">Ingrese nuevo (dato elegido)</h6>

            <form onSubmit={handleSubmit}>
              {campoSeleccionado === 'nombreCompleto' ? (
                <>
                  <input
                    className="form-control mb-2"
                    placeholder="Nombre"
                    value={nuevoValor}
                    onChange={(e) => setNuevoValor(e.target.value)}
                    required
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Apellido"
                    value={nuevoApellido}
                    onChange={(e) => setNuevoApellido(e.target.value)}
                    required
                  />
                </>
              ) : campoSeleccionado === 'generoUsuario' ? (
                <select
                  className="form-control mb-2"
                  value={nuevoValor}
                  onChange={(e) => setNuevoValor(e.target.value)}
                >
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                  <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                </select>
              ) : (
                <input
                  className="form-control mb-2"
                  value={nuevoValor}
                  onChange={(e) => setNuevoValor(e.target.value)}
                  required
                />
              )}

              <div className="d-flex justify-content-center">
                <button className="btn btn-pastel-green px-4">
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarModalPass && (
        <div className="modal-overlay">
          <div className="custom-modal">
            <button onClick={() => setMostrarModalPass(false)} className="btn-cerrar">X</button>

            <h5 className="text-center mb-3">Modificar contraseña</h5>

            <form onSubmit={handleCambiarPassword}>
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Contraseña actual"
                value={passActual}
                onChange={(e) => setPassActual(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Nueva contraseña"
                value={passNueva}
                onChange={(e) => setPassNueva(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control mb-3"
                placeholder="Repetir nueva contraseña"
                value={passConfirmacion}
                onChange={(e) => setPassConfirmacion(e.target.value)}
                required
              />
              <div className="d-flex justify-content-center">
                <button className="btn btn-pastel-green px-4">
                  Actualizar
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
      <div className="campo-box">
        <div className="campo-label">{label}</div>
        <div className="campo-valor-row">
          <span>{valor}</span>
          <button onClick={() => handleEditar(campo)} className="btn-icono-editar">
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
      </div>
    );
  }
};