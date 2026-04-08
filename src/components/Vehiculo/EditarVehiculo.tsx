import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOne, put } from '../../api/dataManager';
import { VehiculoDTO } from '../../entities/entities';

export const EditarVehiculo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = getOne<VehiculoDTO>('vehiculo/' + id);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [vehiculoToUpdate, setVehiculoToUpdate] = useState<VehiculoDTO>({
    patente: '',
    modelo: '',
    marca: '',
    color: '',
    cantLugares: 1,
  });

  const esCantLugaresValida =
    vehiculoToUpdate.cantLugares >= 1 &&
    vehiculoToUpdate.cantLugares <= 50;
  
  const regexLetras = /^[a-zA-Z\sÀ-ÿ]+$/;

  const esMarcaValida =
    vehiculoToUpdate.marca.trim().length >= 1 &&
    regexLetras.test(vehiculoToUpdate.marca.trim());

  const esColorValido =
    vehiculoToUpdate.color.trim().length >= 1 &&
    regexLetras.test(vehiculoToUpdate.color.trim());

  const esModeloValido =
    vehiculoToUpdate.modelo.trim().length >= 1;

  useEffect(() => {
    if (data) {
      setVehiculoToUpdate({
        patente: data.patente,
        modelo: data.modelo,
        marca: data.marca,
        color: data.color,
        cantLugares: data.cantLugares,
      });
    }
  }, [data]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await put(`vehiculo/${vehiculoToUpdate.patente}`, vehiculoToUpdate);
    setMostrarModal(true);
  };

  return (
    <div className="container my-5 mt-5 pb-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="d-flex flex-column bg-white p-4 rounded-4 shadow-sm custom-card">
            <h2 className="text-center mb-4">Editar datos de vehículo</h2>

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
                    required
                    type="text"
                    className={`form-control custom-input ${
                      vehiculoToUpdate.marca && !esMarcaValida ? 'is-invalid' : ''
                    } ${vehiculoToUpdate.marca && esMarcaValida ? 'is-valid' : ''}`}
                    placeholder="Ej: Toyota"
                    value={vehiculoToUpdate.marca}
                    onChange={(e) =>
                      setVehiculoToUpdate({
                        ...vehiculoToUpdate,
                        marca: e.target.value,
                      })
                    }
                  />

                  {vehiculoToUpdate.marca && !esMarcaValida && (
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
                    required
                    type="text"
                    className={`form-control custom-input ${
                      vehiculoToUpdate.modelo && !esModeloValido ? 'is-invalid' : ''
                    } ${vehiculoToUpdate.modelo && esModeloValido ? 'is-valid' : ''}`}
                    placeholder="Ej: Etios"
                    value={vehiculoToUpdate.modelo}
                    onChange={(e) =>
                      setVehiculoToUpdate({
                        ...vehiculoToUpdate,
                        modelo: e.target.value,
                      })
                    }
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
                    required
                    type="text"
                    className={`form-control custom-input ${
                      vehiculoToUpdate.color && !esColorValido ? 'is-invalid' : ''
                    } ${vehiculoToUpdate.color && esColorValido ? 'is-valid' : ''}`}
                    placeholder="Ej: gris"
                    value={vehiculoToUpdate.color}
                    onChange={(e) =>
                      setVehiculoToUpdate({
                        ...vehiculoToUpdate,
                        color: e.target.value,
                      })
                    }
                  />

                  {vehiculoToUpdate.color && !esColorValido && (
                    <div className="invalid-feedback fw-semibold">
                      Solo letras.
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="form-label text-muted fw-bold me-3 mb-0" style={{width: '150px'}}>
                  Patente
                </label>
                <input
                  type="text"
                  className="form-control custom-input"
                  value={vehiculoToUpdate.patente}
                  readOnly
                  style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                />
              </div>
              
              <div className="mb-3 d-flex">
                <div style={{ width: '150px' }} className="me-3">
                  <label
                    className="form-label text-muted fw-bold me-3 mb-0"
                    style={{ width: '150px' }}
                  >
                    Cantidad de lugares
                  </label>
                  <small className="text-muted d-block" style={{ fontSize: '0.8rem' }}>
                    (sin contar al conductor)
                  </small>
                </div>

                <div className="w-100">
                  <input
                    required
                    type="number"
                    min={1}
                    max={50}
                    className={`form-control custom-input ${
                      !esCantLugaresValida ? 'is-invalid' : ''
                    } ${esCantLugaresValida ? 'is-valid' : ''}`}
                    value={vehiculoToUpdate.cantLugares}
                    onChange={(e) => {
                      const valor = parseInt(e.target.value);
                      if (isNaN(valor)) return;

                      setVehiculoToUpdate({
                        ...vehiculoToUpdate,
                        cantLugares: valor,
                      });
                    }}
                  />

                  {!esCantLugaresValida && (
                    <div className="invalid-feedback fw-semibold">
                      {vehiculoToUpdate.cantLugares < 1
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
                    onClick={() => navigate(-1)}
                  >
                    Volver
                  </button>
                </div>

                <div className="col-12 col-md-5">
                  <button
                    type="submit"
                    className="btn btn-pastel-green w-100"
                    disabled={
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
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="custom-modal text-center">
            <button
              className="btn-cerrar"
              onClick={() => navigate(-1)}
            >
              X
            </button>

            <h5 className="mb-3">El vehículo se editó correctamente</h5>
          </div>
        </div>
      )}
    </div>
  );
};