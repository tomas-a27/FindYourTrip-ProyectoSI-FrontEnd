import { get } from '../../api/dataManager.ts';
import { LocalidadDTO } from '../../entities/entities.ts';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeleteEntityButton from '../DeleteEntityBotton.tsx';

export function MostrarLocalidad() {
  const { data, loading, error } = get<LocalidadDTO>('localidad');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className="ShowLocalidades container py-5"
      style={{ maxWidth: '1000px' }}
    >
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: '#2d4a2d' }} className="mb-0">
            Informe de localidades
          </h2>
          <p className="text-muted mb-0">
            Listado de todas las localidades registradas en el sistema.
          </p>
        </div>

        <div>
          <Link
            to="/crear-localidad"
            className="btn btn-lg btn-outline-success"
          >
            + Agregar Localidad
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-5 p-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3 text-muted fw-bold">Cargando localidades...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
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
                  <th className="py-3 px-4 text-muted border-0">Código</th>
                  <th className="py-3 px-4 text-muted border-0">Nombre</th>
                  <th className="py-3 px-4 text-muted border-0 text-center">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-5 text-muted fst-italic"
                    >
                      No hay localidades cargadas.
                    </td>
                  </tr>
                ) : (
                  data?.map((unaLocalidad, index) => (
                    <tr key={unaLocalidad.id}>
                      <td className="px-4 py-3 fw-bold text-secondary">
                        {index + 1}
                      </td>
                      <td
                        className="px-4 py-3 fw-semibold"
                        style={{ letterSpacing: '1px' }}
                      >
                        {unaLocalidad.codPostal}
                      </td>
                      <td className="px-4 py-3 text-dark fw-bold">
                        {unaLocalidad.nombre}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/editar-localidad/${unaLocalidad.id}`}
                          className="btn btn-sm btn-outline-secondary me-2"
                        >
                          Editar
                        </Link>
                        <DeleteEntityButton
                          idToDelete={String(unaLocalidad.id)}
                          nameToDelete={unaLocalidad.nombre}
                          route={'localidad'}
                          entityToDelete={'localidad'}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
