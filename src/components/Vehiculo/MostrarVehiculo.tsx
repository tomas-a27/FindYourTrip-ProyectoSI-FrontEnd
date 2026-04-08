import { useParams, useNavigate } from 'react-router-dom';
import { get } from '../../api/dataManager';
import { useAuth } from '../../auth/AuthContext';
import DeleteEntityButton from '../DeleteEntityBotton.tsx';

export const MostrarVehiculo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userId } = useAuth();

  if (userId !== Number(id)) {
    return <p className="text-center mt-5">No autorizado</p>;
  }

  const {
    data: vehiculos = [],
    loading,
    error,
  } = get<any>(`vehiculo/usuario/${userId}`);

  return (
    <div className="container mt-5 mb-5 pb-5">
      <div
        className="mb-4 d-flex align-items-center"
        onClick={() => navigate(`/mi-cuenta/${userId}`)}
        style={{ cursor: 'pointer' }}
      >
        <div
          className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2"
          style={{ width: '24px', height: '24px' }}
        >
          <i className="bi bi-arrow-left text-white fs-9"></i>
        </div>
        <span className="fw-bold text-success fs-7">Volver a Mi Cuenta</span>
      </div>

      <h2 className="fw-bold m-0 text-center mb-3" style={{ color: '#2d4a2d' }}>
        Mis Vehículos{' '}
      </h2>

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
              width: '420px',
              borderRadius: '12px',
              border: '1px solid #555',
            }}
          >
            <div className="card-body position-relative">
              <i className="bi bi-car-front-fill icono-auto-card"></i>

              <h5 className="card-title mb-3">
                {v.marca} {v.modelo}
              </h5>

              <p className="card-text ms-3 mb-1">Color: {v.color}</p>
              <p className="card-text ms-3 mb-1">
                Patente: {v.patente.toUpperCase()}
              </p>
              <p className="card-text ms-3">
                Cantidad de lugares: {v.cantLugares}
              </p>

              <hr className="mb-1" />

              <div className="mt-2 d-flex justify-content-between">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`/editar-vehiculo/${v.patente}`)}
                >
                  Editar datos
                </button>

                <DeleteEntityButton
                  idToDelete={String(v.patente)}
                  nameToDelete={`${v.marca} ${v.modelo}`}
                  route={'vehiculo'}
                  entityToDelete={'vehiculo'}
                />
              </div>
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
