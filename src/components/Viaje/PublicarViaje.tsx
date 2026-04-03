import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { post, get, getOne } from '../../api/dataManager';
import { UsuarioDTO, LocalidadDTO } from '../../entities/entities';
import { useAuth } from '../../auth/AuthContext';

export const PublicarViaje = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const today = new Date().toISOString().split('T')[0];

  // CORRECCIÓN: Le sacamos el "loading" porque getOne no lo tiene
  const { data: usuarioCompleto } = getOne<UsuarioDTO>(
    userId ? `usuario/${userId}` : '',
  );

  const { data: localidades, loading: cargandoLocs } =
    get<LocalidadDTO>('localidad');

  const [localidadOrigen, setLocalidadOrigen] = useState('');
  const [mostrarSugerenciaOrigen, setMostrarSugerenciaOrigen] = useState(false);
  const [localidadDestino, setLocalidadDestino] = useState('');
  const [mostrarSugerenciaDestino, setMostrarSugerenciaDestino] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  const localidadesFiltradasOrigen = localidades?.filter((l) =>
    l.nombre.toLowerCase().startsWith(localidadOrigen.toLowerCase()),
  );
  const localidadesFiltradasDestino = localidades?.filter((l) =>
    l.nombre.toLowerCase().startsWith(localidadDestino.toLowerCase()),
  );

  const [cantLugaresDisponibles, setCantLugaresDisponibles] = useState(1);
  const [formData, setFormData] = useState({
    viajeFecha: '',
    viajeHorario: '',
    viajeCantLugares: 1,
    viajePrecio: 0,
    viajeAceptaMascotas: false,
    viajeComentario: '',
    viajeOrigen: '', // ID de localidad por defecto (se actualizará al seleccionar)
    viajeDestino: '', // ID de localidad por defecto (se actualizará al seleccionar
    vehiculo: '',
  });

  useEffect(() => {
    if (!userId) {
      navigate('/');
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
  }, [navigate, userId, usuarioCompleto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const viajeAPublicar = {
      ...formData,
      usuarioConductor: usuarioCompleto?.idUsuario,
    };

    console.log('Datos del viaje a publicar:', viajeAPublicar);

    const response = await post('viaje', viajeAPublicar);

    if (response && response.status === 201) {
      setMostrarModalExito(true);
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
              onChange={(e) => {
                const selectedVehiculo = usuarioCompleto.vehiculos?.find(
                  (v) => v.patente === e.target.value,
                );
                setFormData({ ...formData, vehiculo: e.target.value });
                setCantLugaresDisponibles(selectedVehiculo?.cantLugares || 1);
              }}
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
            <div className="col-md-6 mb-3 position-relative">
              <label className="form-label fw-bold">Origen</label>

              <input
                type="text"
                required
                className="form-control custom-input"
                placeholder="Ej: Rosario"
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
                          setFormData({
                            ...formData,
                            viajeOrigen: String(l.id),
                          });
                          setMostrarSugerenciaOrigen(false);
                        }}
                      >
                        <strong>
                          {l.nombre.substring(0, localidadOrigen.length)}
                        </strong>
                        {l.nombre.substring(localidadOrigen.length)}
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
                          setFormData({
                            ...formData,
                            viajeDestino: String(l.id),
                          });
                          setMostrarSugerenciaDestino(false);
                        }}
                      >
                        <strong>
                          {l.nombre.substring(0, localidadDestino.length)}
                        </strong>
                        {l.nombre.substring(localidadDestino.length)}
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
                max={cantLugaresDisponibles}
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
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
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
              rows={3}
              style={{ resize: 'none' }}
              placeholder="Ej: No se puede fumar..."
              maxLength={1000}
              onChange={(e) =>
                setFormData({ ...formData, viajeComentario: e.target.value })
              }
            ></textarea>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-light-cancel w-50"
              onClick={() => navigate('/home')}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-success w-50 py-2 fw-bold"
              style={{ backgroundColor: '#2d4a2d' }}
            >
              Publicar Viaje
            </button>
          </div>
        </form>
      </div>

      {mostrarModalExito && (
        <div className="modal-overlay">
          <div className="custom-modal text-center">
            <h5 className="fw-bold mb-4">
              ¡El viaje se ha publicado con éxito!
            </h5>

            <button
              className="btn btn-pastel-green w-100"
              onClick={() => navigate('/home')}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};