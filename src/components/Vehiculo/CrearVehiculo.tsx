import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../../api/dataManager';
import { UsuarioDTO } from '../../entities/entities';

export const CrearVehiculo = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [color, setColor] = useState('');
  const [patente, setPatente] = useState('');
  const [cantLugares, setCantLugares] = useState(1);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleVolver = () => {
    if (usuario) {
      navigate(`/mostrar-vehiculo/${usuario.idUsuario}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!usuario) return;

    const vehiculoData = {
      modelo: modelo.trim(),
      marca: marca.trim(),
      color: color.trim(),
      patente: patente.trim().toUpperCase(),
      cantLugares: Number(cantLugares)
    };

    try {
      const response = await post(`vehiculo/${usuario.idUsuario}`, vehiculoData);
      
      if (!response) {
        setError("No hubo respuesta del servidor");
        return;
      }
      
      if (response.status === 201) {
        setShowModal(true);
        return;
      }
      
      if (response.status === 400) {
        const errores = response.data?.errors;

        if (errores) {
            const mensajes = Object.values(errores).flat().join(" ");
            setError(mensajes);
        } else {
            setError(response.data?.message || "Error de validación");
        }
        return;
      }
      
      setError(response.data?.message || "Ocurrió un error");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError('Error en los datos ingresados.');
      } else {
        setError(err.response?.data?.message || 'Ocurrió un error al crear el vehículo.');
      }
    }
  };

  return (
    <div className="container mt-5 pb-5 mb-5 d-flex justify-content-center">
      <div className="card custom-card shadow-sm w-100" style={{ maxWidth: '600px' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4" style={{ color: '#2d4a2d' }}>
            Nuevo Vehículo
          </h2>

          {error && <div className="alert alert-danger fw-bold">{error}</div>}

          <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted fw-bold">Modelo</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fw-bold">Marca</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fw-bold">Color</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted fw-bold">Patente</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  placeholder="AAA111 o AA111AA"
                  value={patente}
                  onChange={(e) => setPatente(e.target.value)}
                  required
                />
              </div>

            <div className="mb-3">
              <label className="form-label text-muted fw-bold">
                Cantidad de asientos
              </label>
              <input
                type="number"
                className="form-control custom-input"
                min="1"
                max="20"
                value={cantLugares}
                onChange={(e) => setCantLugares(Number(e.target.value))}
                required
              />
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-light-cancel px-4"
                onClick={handleVolver}
              >
                Volver
              </button>

              <button
                type="submit"
                className="btn btn-pastel-green px-5"
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="custom-modal text-center">
            <h5 className="mb-3">Vehículo agregado con éxito!</h5>

            <button
              className="btn btn-pastel-green"
              onClick={() => navigate(`/mostrar-vehiculo/${usuario?.idUsuario}`)}
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};