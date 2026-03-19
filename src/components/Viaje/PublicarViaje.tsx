import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { post, get, getOne } from '../../api/dataManager';
import { UsuarioDTO, LocalidadDTO } from '../../entities/entities';

export const PublicarViaje = () => {
  const navigate = useNavigate();

  const userJson = localStorage.getItem('usuario');
  const userLocal = userJson ? JSON.parse(userJson) : null;

  // CORRECCIÓN: Le sacamos el "loading" porque getOne no lo tiene
  const { data: usuarioCompleto } = getOne<UsuarioDTO>(
    userLocal?.idUsuario ? `usuario/${userLocal.idUsuario}` : '',
  );

  const { data: localidades, loading: cargandoLocs } =
    get<LocalidadDTO>('localidad');

  const [localidadOrigen, setLocalidadOrigen] = useState('');
  const [mostrarSugerenciaOrigen, setMostrarSugerenciaOrigen] = useState(false);
  const [localidadDestino, setLocalidadDestino] = useState('');
  const [mostrarSugerenciaDestino, setMostrarSugerenciaDestino] =
    useState(false);

  const localidadesFiltradasOrigen = localidades?.filter((l) =>
    l.nombre.toLowerCase().startsWith(localidadOrigen.toLowerCase()),
  );
  const localidadesFiltradasDestino = localidades?.filter((l) =>
    l.nombre.toLowerCase().startsWith(localidadDestino.toLowerCase()),
  );

  const [formData, setFormData] = useState({
    viajeFecha: '',
    viajeHorario: '',
    viajeCantLugares: 1,
    viajePrecio: 0,
    viajeAceptaMascotas: false,
    viajeComentario: '',
    viajeOrigen: localidadOrigen,
    viajeDestino: '',
    vehiculo: '',
  });

  useEffect(() => {
    if (!userLocal) {
      navigate('/login');
      return;
    }

    if (!usuarioCompleto) return;

    // Validamos que el usuario sea conductor aprobado antes de mostrar el formulario
    if (usuarioCompleto.estadoConductor?.toLowerCase() === 'pendiente') {
      alert(
        'Usted podrá publicar un viaje una vez que su solicitud sea aprobada.',
      );
      navigate('/home');
      return;
    }

    // Validamos que el usuario sea conductor aprobado antes de mostrar el formulario
    if (
      usuarioCompleto.tipoUsuario?.toLowerCase() !== 'conductor' &&
      usuarioCompleto.estadoConductor?.toLowerCase() !== 'aprobado'
    ) {
      alert(
        'Debes registrarte y ser aprobado como conductor para publicar viajes.',
      );
      navigate('/home');
      return;
    }

    //Validamos que haya localidades cargadas para mostrar el formulario
    if (!cargandoLocs && (!localidades || localidades.length === 0)) {
      alert(
        'No hay localidades disponibles. Por favor, contacta al administrador.',
      );
      navigate('/home');
      return;
    }

    // Verificamos que tenga vehículos registrados
    if (!usuarioCompleto.vehiculos || usuarioCompleto.vehiculos.length === 0) {
      alert('Primero debés registrar un vehículo para publicar un viaje.');
      navigate('/crear-vehiculo');
    }
  }, [navigate, userLocal, usuarioCompleto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const viajeAPublicar = {
      ...formData,
      usuarioConductor: usuarioCompleto?.idUsuario,
    };

    const response = await post('viajes', viajeAPublicar);

    if (response && response.status === 201) {
      alert('¡Viaje publicado con éxito!');
      navigate('/home');
    } else {
      const errorMsg = response?.data?.message || 'Ocurrió un error inesperado';
      alert('Error: ' + errorMsg);
    }
  };

  if (!usuarioCompleto) {
    return (
      <p className="text-center mt-5 text-muted fw-bold">
        Cargando datos de tu perfil...
      </p>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 text-center" style={{ color: '#2d4a2d' }}>
        Publicar un Viaje
      </h2>

      <div
        className="card shadow-sm border-0 p-4 mx-auto"
        style={{ maxWidth: '600px' }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">¿En qué vehículo vas?</label>
            <select
              className="form-select"
              required
              value={formData.vehiculo}
              onChange={(e) =>
                setFormData({ ...formData, vehiculo: e.target.value })
              }
            >
              <option value="">Seleccioná tu auto...</option>
              {usuarioCompleto.vehiculos?.map((v) => (
                <option key={v.patente} value={v.patente}>
                  {v.marca} {v.modelo} ({v.patente})
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Origen</label>

              <input
                type="text"
                required
                className="form-control"
                placeholder="Hacia..."
                value={localidadOrigen}
                onChange={(e) => {
                  setLocalidadOrigen(e.target.value);
                  setMostrarSugerenciaOrigen(true);
                }}
                onBlur={() =>
                  setTimeout(() => setMostrarSugerenciaOrigen(false), 200)
                }
              />

              {mostrarSugerenciaOrigen && localidadOrigen.length > 0 && (
                <ul className="lista-sugerencias">
                  {localidadesFiltradasOrigen.length > 0 ? (
                    localidadesFiltradasOrigen.map((l) => (
                      <li
                        key={l.id}
                        onClick={() => {
                          setLocalidadOrigen(l.nombre);
                          setFormData({ ...formData, viajeOrigen: l.nombre });
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
                placeholder="Hacia..."
                value={localidadDestino}
                onChange={(e) => {
                  setLocalidadDestino(e.target.value);
                  setMostrarSugerenciaDestino(true);
                }}
                onBlur={() =>
                  setTimeout(() => setMostrarSugerenciaDestino(false), 200)
                }
              />

              {mostrarSugerenciaDestino && localidadDestino.length > 0 && (
                <ul className="lista-sugerencias">
                  {localidadesFiltradasDestino.length > 0 ? (
                    localidadesFiltradasDestino.map((l) => (
                      <li
                        key={l.id}
                        onClick={() => {
                          setLocalidadDestino(l.nombre);
                          setFormData({ ...formData, viajeDestino: l.nombre });
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
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Hora</label>
              <input
                type="time"
                className="form-control"
                required
                onChange={(e) =>
                  setFormData({ ...formData, viajeHorario: e.target.value })
                }
              />
            </div>
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label fw-bold">Lugares</label>
              <input
                type="number"
                className="form-control"
                min="1"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    viajeCantLugares: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label fw-bold">Precio ($)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    viajePrecio: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="mascotas"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  viajeAceptaMascotas: e.target.checked,
                })
              }
            />
            <label className="form-check-label" htmlFor="mascotas">
              ¿Aceptás mascotas?
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Comentarios (opcional)</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Ej: No se puede fumar..."
              onChange={(e) =>
                setFormData({ ...formData, viajeComentario: e.target.value })
              }
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2 fw-bold"
            style={{ backgroundColor: '#2d4a2d' }}
          >
            Publicar Viaje
          </button>
        </form>
      </div>
    </div>
  );
};
