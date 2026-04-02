import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAsync } from '../../../api/dataManager';

export const InformeConductores = () => {
  const [conductores, setConductores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarInforme();
  }, []);

  const cargarInforme = async () => {
    setLoading(true);
    try {
      const res = await getAsync<any>('usuario/informe-conductores');
      if (res.data && res.data.data) {
        setConductores(res.data.data);
      }
    } catch (error) {
      console.error('Error al cargar el informe de conductores:', error);
      setConductores([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5 p-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3 text-muted fw-bold">Generando informe...</p>
      </div>
    );
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
      <h2 style={{ color: '#2d4a2d' }}>Informe de conductores</h2>

      <p className="text-muted mb-4">
        Listado de todos los conductores aprobados ordenados por su calificación
        (de mayor a menor).
      </p>

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
                <th className="py-3 px-4 text-muted border-0">Nro. Licencia</th>
                <th className="py-3 px-4 text-muted border-0">Conductor</th>
                <th className="py-3 px-4 text-muted border-0 text-center">
                  Calificación
                </th>
              </tr>
            </thead>
            <tbody>
              {conductores.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-5 text-muted fst-italic"
                  >
                    No hay conductores registrados o aprobados en el sistema.
                  </td>
                </tr>
              ) : (
                conductores.map((conductor, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 fw-bold text-secondary">
                      {index + 1}
                    </td>
                    <td
                      className="px-4 py-3 fw-semibold"
                      style={{ letterSpacing: '1px' }}
                    >
                      {conductor.nroLicenciaConductorUsuario || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-dark fw-bold">
                      {conductor.nombreUsuario} {conductor.apellidoUsuario}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {conductor.calificacionConductor ? (
                        <span
                          className="badge px-3 py-2 rounded-pill"
                          style={{
                            backgroundColor: '#eaf5ea',
                            color: '#198754',
                            fontSize: '0.95rem',
                          }}
                        >
                          <i className="bi bi-star-fill text-warning me-1"></i>
                          {Number(conductor.calificacionConductor).toFixed(1)}
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted px-3 py-2 rounded-pill border">
                          Sin calificar
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
