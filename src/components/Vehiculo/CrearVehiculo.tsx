import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../../api/dataManager';
import { useAuth } from '../../auth/AuthContext';

export const CrearVehiculo = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [color, setColor] = useState('');
  const [patente, setPatente] = useState('');
  const [cantLugares, setCantLugares] = useState(1);

  const patenteLimpia = patente.trim().toUpperCase().replace(/\s/g, '');

  const esPatenteValida =
    /^[A-Z]{3}\d{3}$/.test(patenteLimpia) || // AAA111
    /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(patenteLimpia); // AA111AA

  const esCantLugaresValida =
    cantLugares >= 1 && cantLugares <= 50;
  
  const regexLetras = /^[a-zA-Z\sÀ-ÿ]+$/;

  const esMarcaValida = marca.trim().length >= 1 && regexLetras.test(marca.trim());
  const esColorValido = color.trim().length >= 1 && regexLetras.test(color.trim());
  const esModeloValido = modelo.trim().length >= 1;

  const handleVolver = () => {
    if (userId) {
      navigate(`/mostrar-vehiculo/${userId}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId) return;

    const vehiculoData = {
      modelo: modelo.trim(),
      marca: marca.trim(),
      color: color.trim(),
      patente: patente.trim().toUpperCase(),
      cantLugares: Number(cantLugares)
    };

    try {
      const response = await post(`vehiculo/${userId}`, vehiculoData);
      
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

          <form className="d-flex flex-column" onSubmit={handleSubmit}>
            <div className="mb-3 d-flex">
              <label
                className="form-label text-muted fw-bold me-3 mb-0"
                style={{ width: '150px' }}
              >
                Marca
              </label>

              <div className="w-100">
                <input
                  type="text"
                  className={`form-control custom-input ${
                    marca && !esMarcaValida ? 'is-invalid' : ''
                  } ${marca && esMarcaValida ? 'is-valid' : ''}`}
                  placeholder="Ej: Toyota"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  required
                />

                {marca && !esMarcaValida && (
                  <div className="invalid-feedback fw-semibold">
                    Solo letras.
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex">
              <label
                className="form-label text-muted fw-bold me-3 mb-0"
                style={{ width: '150px' }}
              >
                Modelo
              </label>

              <div className="w-100">
                <input
                  type="text"
                  className={`form-control custom-input ${
                    modelo && !esModeloValido ? 'is-invalid' : ''
                  } ${modelo && esModeloValido ? 'is-valid' : ''}`}
                  placeholder="Ej: Etios"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3 d-flex">
              <label
                className="form-label text-muted fw-bold me-3 mb-0"
                style={{ width: '150px' }}
              >
                Color
              </label>

              <div className="w-100">
                <input
                  type="text"
                  className={`form-control custom-input ${
                    color && !esColorValido ? 'is-invalid' : ''
                  } ${color && esColorValido ? 'is-valid' : ''}`}
                  placeholder="Ej: gris"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  required
                />

                {color && !esColorValido && (
                  <div className="invalid-feedback fw-semibold">
                    Solo letras.
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex">
              <label
                className="form-label text-muted fw-bold me-3 mb-0"
                style={{ width: '150px' }}
              >
                Patente
              </label>

              <div className="w-100">
                <input
                  type="text"
                  className={`form-control custom-input ${
                    patente && !esPatenteValida ? 'is-invalid' : ''
                  } ${patente && esPatenteValida ? 'is-valid' : ''}`}
                  placeholder="Ej: AAA111 o AA111AA"
                  value={patente}
                  onChange={(e) => setPatente(e.target.value.toUpperCase())}
                  required
                />

                {patente && !esPatenteValida && (
                  <div className="invalid-feedback fw-semibold">
                    Formato inválido. Ej: AAA111 o AA111AA.
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex">
              <label
                className="form-label text-muted fw-bold me-3 mb-0"
                style={{ width: '150px' }}
              >
                Cantidad de lugares
              </label>

              <div className="w-100">
                <input
                  type="number"
                  min="1"
                  max="50"
                  className={`form-control custom-input ${
                    !esCantLugaresValida ? 'is-invalid' : ''
                  } ${esCantLugaresValida ? 'is-valid' : ''}`}
                  value={cantLugares}
                  onChange={(e) => {
                    const valor = parseInt(e.target.value);
                    if (isNaN(valor)) return;
                    setCantLugares(valor);
                  }}
                  required
                />

                {!esCantLugaresValida && (
                  <div className="invalid-feedback fw-semibold">
                    {cantLugares < 1
                      ? 'La cantidad no puede ser menor que 1.'
                      : 'La cantidad no puede ser mayor a 50.'}
                  </div>
                )}
              </div>
            </div>

            <div className="row gy-2 justify-content-between mt-2">
              <div className="col-12 col-md-5">
                <button
                  type="button"
                  className="btn btn-light-cancel w-100"
                  onClick={handleVolver}
                >
                  Volver
                </button>
              </div>

              <div className="col-12 col-md-5">
                <button
                  type="submit"
                  className="btn btn-pastel-green w-100"
                  disabled={
                    !esPatenteValida ||
                    !esCantLugaresValida ||
                    !esMarcaValida ||
                    !esColorValido ||
                    !esModeloValido
                  }
                >
                  Confirmar
                </button>
              </div>
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
              onClick={() => navigate(`/mostrar-vehiculo/${userId}`)}
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};