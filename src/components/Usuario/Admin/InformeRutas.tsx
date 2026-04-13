import { Link, useNavigate } from 'react-router-dom';
import { get } from '../../../api/dataManager.ts';
import { InformeRutasDTO } from '../../../entities/entities.ts';

export const InformeRutas = () => {
  const navigate = useNavigate();

  const { data, loading, error } = get<InformeRutasDTO>(
    'viaje/informe-rutas-mas-frecuentes',
  );

  let cantTotalViajes = 0;
  let precioTotal = 0;
  let precioTotalPromedio = 0;

  if (data && data.length > 0) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      cantTotalViajes = element.cantidadDeViajes + cantTotalViajes;
      precioTotal =
        element.viajePrecioPromedio * element.cantidadDeViajes + precioTotal;
    }

    if (cantTotalViajes > 0) {
      precioTotalPromedio = precioTotal / cantTotalViajes;
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: '1000px' }}>
      <div className="mb-3">
        <Link
          to="/admin-home"
          className="btn d-flex align-items-center text-success fw-bold p-0 text-decoration-none"
          style={{ border: 'none', background: 'none' }}
        >
          <i className="bi bi-arrow-left-circle-fill fs-4 me-2"></i>
          Volver al Menú
        </Link>
      </div>

      <h2 style={{ color: '#2d4a2d' }}>Informe de rutas</h2>
      <p className="text-muted mb-4">
        Listado de las rutas más frecuentes (más utilizadas por los usuarios) y su precio promedio, en los últimos 30 días,
        ordenadas de mayor a menor por cantidad de viajes realizados.
      </p>
      {!loading && !error && data?.length === 0 && (
        <div className="alert alert-info">
          No hay rutas registradas en los últimos 30 días.
        </div>
      )}
      {!loading && !error && data && data.length > 0 && (
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: '16px', overflow: 'hidden' }}
        >
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th
                    className="py-3 px-4 text-muted border-0"
                    style={{ width: '80px' }}
                  >
                    #
                  </th>
                  <th className="py-3 px-4 text-muted border-0">Origen</th>
                  <th className="py-3 px-4 text-muted border-0">Destino</th>
                  <th className="py-3 px-4 text-muted border-0">
                    Cantidad de viajes
                  </th>
                  <th className="py-3 px-4 text-muted border-0">
                    Precio promedio
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((ruta: any) => (
                  <tr key={ruta.indice}>
                    <td className="px-4 py-3 fw-bold text-secondary">
                      {ruta.indice}
                    </td>
                    <td
                      className="px-4 py-3 fw-semibold"
                      style={{ letterSpacing: '1px' }}
                    >
                      {ruta.nombreOrigen}
                    </td>
                    <td
                      className="px-4 py-3 fw-semibold"
                      style={{ letterSpacing: '1px' }}
                    >
                      {ruta.nombreDestino}
                    </td>
                    <td
                      className="px-4 py-3 fw-semibold"
                      style={{ letterSpacing: '1px' }}
                    >
                      {ruta.cantidadDeViajes}
                    </td>
                    <td
                      className="px-4 py-3 fw-semibold"
                      style={{ letterSpacing: '1px' }}
                    >
                      {ruta.viajePrecioPromedio}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Footer con totales */}
            <div
              className="d-flex justify-content-end align-items-center p-3"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              <div className="py-3 px-4 border-0">
                <span className="fw-bold text-muted">Total de viajes: </span>
                <span className="fw-bold">{cantTotalViajes}</span>
              </div>

              <div className="py-3 px-4 border-0">
                <span className="fw-bold text-muted">
                  Precio promedio general:{' '}
                </span>
                <span className="fw-bold">
                  {precioTotalPromedio.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && <div>Cargando informe...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};
