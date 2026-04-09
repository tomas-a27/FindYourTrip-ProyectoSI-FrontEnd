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

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const [viajeOrigen, setLocalidadOrigen] = useState('');
  const [mostrarSugerenciaOrigen, setMostrarSugerenciaOrigen] = useState(false);
  const [viajeDestino, setLocalidadDestino] = useState('');
  const [mostrarSugerenciaDestino, setMostrarSugerenciaDestino] =
    useState(false);

  const [mostrarModalAviso, setMostrarModalAviso] = useState(false);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalRechazo, setMostrarModalRechazo] = useState(false);
  const [mostrarModalCancelado, setMostrarModalCancelado] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingConductor, setIsCheckingConductor] = useState(false);

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
    setIsSubmitting(true);

    const params = new URLSearchParams();
    params.append('viajeOrigen', formData.viajeOrigen);
    params.append('viajeDestino', formData.viajeDestino);
    params.append('viajeFecha', formData.viajeFecha);
    params.append('generoConductor', formData.generoConductor);
    params.append('mascota', String(formData.mascota));
    if (userId) {
      params.append('usuarioId', userId.toString());
    }

    const query = `viaje/mostrar-viaje?${params.toString()}`;
    
    setTimeout(() => {
      navigate('/mostrar-viaje', {
        state: {
          query,
          localidadOrigen: viajeOrigen,
          localidadDestino: viajeDestino,
        },
      });
      setIsSubmitting(false); 
    }, 300);
  };

  const handlePublicarViaje = () => {
    setIsCheckingConductor(true); 
    
    setTimeout(() => {
      if (userTipo?.toLowerCase() === 'conductor') {
        navigate('/publicar-viaje');
      } else if (isPendiente) {
        setMostrarModalAviso(true);
      } else {
        setMostrarModalRegistro(true);
      }
      setIsCheckingConductor(false); 
    }, 300);
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

  if (loadingLocalidades || !usuario) {
    return (
      <div className="text-center mt-5 p-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3 text-muted fw-bold">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center" style={{ color: '#2d4a2d' }}>
        Buscar un viaje
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
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
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
                          <strong>
                            {l.nombre.substring(0, viajeOrigen.length)}
                          </strong>
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
                  placeholder="Ej: CABA"
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
                          <strong>
                            {l.nombre.substring(0, viajeDestino.length)}
                          </strong>
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
                  className="form-control custom-input"
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
                  className="form-control custom-input custom-select"
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
                    className="form-check-input custom-checkbox"
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
                <button
                  type="button"
                  className="btn btn-light-cancel btn-danger fw-semibold w-100 shadow-sm"
                  onClick={() => setMostrarModalCancelado(true)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </div>

              <div className="col-12 col-md-5">
                <button
                  type="submit"
                  className="btn btn-pastel-green w-100 shadow-sm d-flex justify-content-center align-items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                  ) : (
                    'Buscar'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {errorLocalidades && (
        <div className="alert alert-danger">{errorLocalidades}</div>
      )}

      <div className="d-flex flex-column align-items-end mt-4">
        <label>¿Eres Conductor?</label>

        <button
          onClick={handlePublicarViaje}
          disabled={isCheckingConductor}
          className="btn btn-link p-0 d-flex align-items-center gap-2"
          style={{ textDecoration: 'underline' }}
        >
          {isCheckingConductor ? (
            <div className="spinner-border spinner-border-sm" role="status"></div>
          ) : (
            'Deseo publicar un viaje'
          )}
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

      <ModalAlertAviso
        show={mostrarModalCancelado}
        onClose={() => setMostrarModalCancelado(false)}
        message="Operación cancelada"
        routeNav="/home"
      />
    </div>
  );
};