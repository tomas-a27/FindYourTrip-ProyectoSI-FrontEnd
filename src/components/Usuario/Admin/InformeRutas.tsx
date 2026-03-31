import { useNavigate } from 'react-router-dom';
import { get } from '../../../api/dataManager.ts';
import { ApiResponse, InformeRutasDTO } from '../../../entities/entities.ts';

export const InformeRutas = () => {
  const navigate = useNavigate();

  const { data, loading, error } = get<ApiResponse<InformeRutasDTO>>('viaje/informe-rutas-mas-frecuentes');
  console.log(data)

  return (
    <div className="container py-5" style={{ maxWidth: '1000px' }}>
      <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-link text-dark p-0 me-3" 
          style={{ fontSize: '1.5rem', textDecoration: 'none' }}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2 className="fw-bold m-0 text-dark">Informe de conductores</h2>
      </div>
      <p className="text-muted mb-4">
        Listado de las rutas más utilizadas por los usuarios ordenadas de mayor a menor cantidad de viajes realizados.
      </p>
      {!loading && !error && data?.[0]?.data?.rutas?.length === 0 && (
        <div className="alert alert-info">No hay rutas registradas.</div>
      )}
      {!loading && !error && data?.[0]?.data?.rutas && data[0].data.rutas.length > 0 && (

      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th className="py-3 px-4 text-muted border-0" style={{ width: '80px' }}>#</th>
                <th className="py-3 px-4 text-muted border-0">Origen</th>
                <th className="py-3 px-4 text-muted border-0">Destino</th>
                <th className="py-3 px-4 text-muted border-0">Cantidad de viajes</th>
                <th className="py-3 px-4 text-muted border-0">Precio promedio</th>
              </tr>
            </thead>
            <tbody>
              {data?.[0]?.data?.rutas?.map((ruta: any)=>(
                <tr key={ruta.indice}>
                  <td className="px-4 py-3 fw-bold text-secondary">{ruta.indice}</td>
                  <td className="px-4 py-3 fw-semibold" style={{ letterSpacing: '1px' }}>{ruta.origen}</td>
                  <td className="px-4 py-3 fw-semibold" style={{ letterSpacing: '1px' }}>{ruta.destino}</td>
                  <td className="px-4 py-3 fw-semibold" style={{ letterSpacing: '1px' }}>{ruta.cantidadDeViajes}</td>
                  <td className="px-4 py-3 fw-semibold" style={{ letterSpacing: '1px' }}>{ruta.precioPromedio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      )}

      {loading && <div>Cargando informe...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

    </div>)
};
