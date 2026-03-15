import { useParams, useNavigate } from 'react-router-dom';
import { get } from '../../api/dataManager';

export const MostrarVehiculo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: vehiculos = [], loading, error } = get<any>(`vehiculo/usuario/${id}`);

  return (
    <div className="container mt-5 mb-5 pb-5">
      <h2 className="text-center mb-4">Mis Vehículos</h2>

      {loading && <p className="text-center">Cargando vehículos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && vehiculos.length === 0 && (
        <p className="text-center">No tenés vehículos registrados.</p>
      )}

      <div className="d-flex flex-column align-items-center gap-3">
        {vehiculos.map((v: any) => (
          <div
            key={v.patente}
            className="card shadow-sm"
            style={{
              width: "420px",
              borderRadius: "12px",
              border: "1px solid #555"
            }}
          >
            <div className="card-body">
              <h5 className="card-title mb-3">
                {v.marca} {v.modelo}
              </h5>

              <p className="card-text ms-3 mb-1">
                Color: {v.color}
              </p>

              <p className="card-text ms-3 mb-1">
                Patente: {v.patente.toUpperCase()}
              </p>

              <p className="card-text ms-3">
                Cantidad de lugares: {v.cantLugares}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-pastel-green"
          onClick={() => navigate(`/crear-vehiculo`)}
        >
          Agregar nuevo vehículo
        </button>
      </div>

    </div>
  );
};