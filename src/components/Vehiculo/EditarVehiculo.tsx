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
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label text-muted fw-bold me-3 mb-0" style={{width: '150px'}}>
                  Modelo
                </label>
                <input
                  required
                  type="text"
                  className="form-control custom-input"
                  value={vehiculoToUpdate.modelo}
                  onChange={(e) =>
                    setVehiculoToUpdate({
                      ...vehiculoToUpdate,
                      modelo: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="form-label text-muted fw-bold me-3 mb-0" style={{width: '150px'}}>
                  Marca
                </label>
                <input
                  required
                  type="text"
                  className="form-control custom-input"
                  value={vehiculoToUpdate.marca}
                  onChange={(e) =>
                    setVehiculoToUpdate({
                      ...vehiculoToUpdate,
                      marca: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="form-label text-muted fw-bold me-3 mb-0" style={{width: '150px'}}>
                  Color
                </label>
                <input
                  required
                  type="text"
                  className="form-control custom-input"
                  value={vehiculoToUpdate.color}
                  onChange={(e) =>
                    setVehiculoToUpdate({
                      ...vehiculoToUpdate,
                      color: e.target.value,
                    })
                  }
                />
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
              
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label text-muted fw-bold me-3 mb-0" style={{width: '150px'}}>
                  Cantidad de asientos
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  max={20}
                  className="form-control custom-input"
                  value={vehiculoToUpdate.cantLugares}
                  onChange={(e) =>
                    setVehiculoToUpdate({
                      ...vehiculoToUpdate,
                      cantLugares: Number(e.target.value),
                    })
                  }
                />
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