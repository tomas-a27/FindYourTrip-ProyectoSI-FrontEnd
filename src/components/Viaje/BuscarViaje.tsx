import { useState, useEffect, use } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LocalidadDTO } from '../../entities/entities.ts';
import { get } from '../../api/dataManager.ts';

export const BuscarViaje = () => {
  const navegate = useNavigate();
  /*
  const userJson = localStorage.getItem('usuario');
  const userLocal = userJson ? JSON.parse(userJson) : null;
*/

  const {
    data: localidades,
    loading: loadingLocalidades,
    error: errorLocalidades,
  } = get<LocalidadDTO>('localidad');

  const [viajeOrigen, setLocalidadOrigen] = useState('');
  const [mostrarSugerenciaOrigen, setMostrarSugerenciaOrigen] = useState(false);
  const [viajeDestino, setLocalidadDestino] = useState('');
  const [mostrarSugerenciaDestino, setMostrarSugerenciaDestino] =
    useState(false);

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

    const query = `mostrar-viaje?${params.toString()}`;
    navegate('/mostrar-viaje', { state: query });
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
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Origen</label>

                <input
                  type="text"
                  required
                  className="form-control"
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
                          {l.nombre}
                        </li>
                      ))
                    ) : (
                      <li className="">No se encontraron localidades</li>
                    )}
                  </ul>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Destino</label>
                <input
                  type="text"
                  required
                  className="form-control"
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
                          {l.nombre}
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
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
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
                  to="/"
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
        <label className="">¿Eres Conductor?</label>
        <Link to="/publicar-viaje">Deseo publicar un viaje</Link>
      </div>
    </div>
  );
};
