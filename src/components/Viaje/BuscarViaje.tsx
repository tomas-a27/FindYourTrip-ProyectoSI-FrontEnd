import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LocalidadDTO, UsuarioDTO } from '../../entities/entities.ts';
import { get, getOne } from '../../api/dataManager.ts';
import { useAuth } from '../../auth/AuthContext';
import { ModalAlertAviso } from '../ModalAlert';

export const BuscarViaje = () => {
  const navigate = useNavigate();

  const { userId, userTipo } = useAuth();
  const { data: usuario } = getOne<UsuarioDTO>('usuario/' + userId);

  const isPendiente = usuario?.estadoConductor?.toLowerCase() === 'pendiente';

  const {
    data: localidades,
    loading: loadingLocalidades,
    error: errorLocalidades,
  } = get<LocalidadDTO>('localidad');

  const today = new Date().toISOString().split('T')[0];

  const [viajeOrigen, setLocalidadOrigen] = useState('');
  const [mostrarSugerenciaOrigen, setMostrarSugerenciaOrigen] = useState(false);
  const [viajeDestino, setLocalidadDestino] = useState('');
  const [mostrarSugerenciaDestino, setMostrarSugerenciaDestino] = useState(false);

  const [mostrarModalAviso, setMostrarModalAviso] = useState(false);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalRechazo, setMostrarModalRechazo] = useState(false);

  const localidadesFiltradasOrigen = localidades?.filter((l) =>
    l.nombre.toLowerCase().startsWith(viajeOrigen.toLowerCase()),
  );
  const localidadesFiltradasDestino = localidades?.filter((l) =>
    l.nombre.toLowerCase().startsWith(viajeDestino.toLowerCase()),
  );

  const [formData, setFormData] = useState({
    viajeOrigen: '',
    viajeDestino: '',
    viajeFecha: '',
    generoConductor: '',
    mascota: false,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.append('viajeOrigen', formData.viajeOrigen);
    params.append('viajeDestino', formData.viajeDestino);
    params.append('viajeFecha', formData.viajeFecha);
    params.append('generoConductor', formData.generoConductor);
    params.append('mascota', String(formData.mascota));
    if (userId) {
      params.append('usuarioId', userId.toString());
    }

    console.log(viajeOrigen);
    console.log(viajeDestino);

    const query = `viaje/mostrar-viaje?${params.toString()}`;
    navigate('/mostrar-viaje', {
      state: {
        query,
        localidadOrigen: viajeOrigen,
        localidadDestino: viajeDestino,
      },
    });
  };

  const handlePublicarViaje = () => {
    if (userTipo?.toLowerCase() === 'conductor') {
      navigate('/publicar-viaje');
    } else if (isPendiente) {
      setMostrarModalAviso(true);
    } else {
      setMostrarModalRegistro(true);
    }
  };

  const handleConfirmarRegistro = () => {
    setMostrarModalRegistro(false);

    navigate('/solicitar-conductor', {
      state: {
        mensajeAviso:
          'Para poder publicar viajes debes convertirte en conductor y esperar tu aprobación. Aquí podés registrar la información necesaria. Serás notificado una vez que tu solicitud haya sido revisada.',
      },
    });
  };

  const handleRechazarRegistro = () => {
    setMostrarModalRegistro(false);
    setMostrarModalRechazo(true);
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center" style={{ color: '#2d4a2d' }}>
        Find Your Trip
      </h2>

      {!loadingLocalidades &&
        !errorLocalidades &&
        localidades?.length === 0 && (
          <div className="alert alert-info">No hay localidades cargadas.</div>
        )}
      {!loadingLocalidades && !errorLocalidades && localidades?.length > 0 && (
        <div
          style={{
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            padding: '20px',
          }}
        >
          <form className="d-flex flex-column" onSubmit={handleSubmit}>
            {' '}
            <div className="row">
              <div className="col-md-6 mb-3 position-relative">
                <label className="form-label fw-bold">Origen</label>

                <input
                  type="text"
                  required
                  className="form-control custom-input"
                  placeholder="Ej: Rosario"
                  value={viajeOrigen}
                  onChange={(e) => {
                    setLocalidadOrigen(e.target.value);
                    setMostrarSugerenciaOrigen(true);
                  }}
                  onBlur={() =>
                    setTimeout(() => setMostrarSugerenciaOrigen(false), 200)
                  }
                />

                {mostrarSugerenciaOrigen && viajeOrigen.length > 0 && (
                  <ul className="lista-sugerencias">
                    {localidadesFiltradasOrigen.length > 0 ? (
                      localidadesFiltradasOrigen.map((l) => (
                        <li
                          key={l.id}
                          onClick={() => {
                            setLocalidadOrigen(l.nombre);
                            setFormData({
                              ...formData,
                              viajeOrigen: String(l.id),
                            });
                            setMostrarSugerenciaOrigen(false);
                          }}
                        >
                          <strong>{l.nombre.substring(0, viajeOrigen.length)}</strong>
                          {l.nombre.substring(viajeOrigen.length)}
                        </li>
                      ))
                    ) : (
                      <li className="">No se encontraron localidades</li>
                    )}
                  </ul>
                )}
              </div>

              <div className="col-md-6 mb-3 position-relative">
                <label className="form-label fw-bold">Destino</label>
                <input
                  type="text"
                  required
                  className="form-control custom-input"
                  placeholder="Ej: Buenos Aires"
                  value={viajeDestino}
                  onChange={(e) => {
                    setLocalidadDestino(e.target.value);
                    setMostrarSugerenciaDestino(true);
                  }}
                  onBlur={() =>
                    setTimeout(() => setMostrarSugerenciaDestino(false), 200)
                  }
                />

                {mostrarSugerenciaDestino && viajeDestino.length > 0 && (
                  <ul className="lista-sugerencias">
                    {localidadesFiltradasDestino.length > 0 ? (
                      localidadesFiltradasDestino.map((l) => (
                        <li
                          key={l.id}
                          onClick={() => {
                            setLocalidadDestino(l.nombre);
                            setFormData({
                              ...formData,
                              viajeDestino: String(l.id),
                            });
                            setMostrarSugerenciaDestino(false);
                          }}
                        >
                          <strong>{l.nombre.substring(0, viajeDestino.length)}</strong>
                          {l.nombre.substring(viajeDestino.length)}
                        </li>
                      ))
                    ) : (
                      <li className="">No se encontraron localidades</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Fecha</label>
                <input
                  type="date"
                  min={today}
                  className="form-control"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, viajeFecha: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">
                  Género del conductor
                </label>
                <select
                  className="form-control"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      generoConductor: e.target.value,
                    })
                  }
                >
                  <option value="">No tengo preferecia</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="form-check">
                  <label className="form-check-label">Viajo con mascota</label>

                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="mascota"
                    checked={formData.mascota}
                    onChange={(e) =>
                      setFormData({ ...formData, mascota: e.target.checked })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row gy-2 justify-content-between">
              <div className="col-12 col-md-5">
                <Link
                  className="btn btn-light-cancel btn-danger fw-semibold w-100 shadow-sm"
                  to="/home"
                >
                  Cancelar
                </Link>
              </div>

              <div className="col-12 col-md-5">
                <button
                  type="submit"
                  className="btn btn-pastel-green w-100 shadow-sm"
                >
                  Buscar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loadingLocalidades && <div>Cargando...</div>}

      {errorLocalidades && (
        <div className="alert alert-danger">{errorLocalidades}</div>
      )}

      <div className="d-flex flex-column align-items-end mt-4">
        <label>¿Eres Conductor?</label>

        <button
          onClick={handlePublicarViaje}
          className="btn btn-link p-0"
          style={{ textDecoration: 'underline' }}
        >
          Deseo publicar un viaje
        </button>
      </div>

      {mostrarModalRegistro && (
        <div className="modal-overlay">
          <div className="custom-modal text-center">
            <button
              className="btn-cerrar"
              onClick={() => setMostrarModalRegistro(false)}
            >
              X
            </button>

            <p className="mb-4 mt-2 fw-bold">
              No estás registrado como conductor.
              <br />
              ¿Deseás registrarte como conductor?
            </p>

            <div className="d-flex justify-content-around">
              <button
                className="btn btn-light-cancel px-2"
                onClick={handleRechazarRegistro}
              >
                Rechazar
              </button>

              <button
                className="btn btn-pastel-green px-2"
                onClick={handleConfirmarRegistro}
              >
                Registrarte como conductor
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalAlertAviso
        show={mostrarModalAviso}
        onClose={() => setMostrarModalAviso(false)}
        message="Usted podrá publicar un viaje una vez que su solicitud para ser conductor esté aprobada."
      />

      <ModalAlertAviso
        show={mostrarModalRechazo}
        onClose={() => setMostrarModalRechazo(false)}
        message="Acción rechazada. Podés registrarte como conductor cuando quieras."
      />
    </div>
  );
};