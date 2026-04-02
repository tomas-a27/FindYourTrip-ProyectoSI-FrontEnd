import { get } from '../../api/dataManager.ts';
import { LocalidadDTO } from '../../entities/entities.ts';
import { Table } from 'react-bootstrap';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeleteEntityButton from '../DeleteEntityBotton.tsx';

export function MostrarLocalidad() {
  const { data, loading, error } = get<LocalidadDTO>('localidad');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="ShowLocalidades container mt-4 mb-5">
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

      <h1
        className="mb-4"
        style={{
          color: '#333',
          fontWeight: 600,
        }}
      >
        Localidades
      </h1>

      {!loading && !error && data?.length === 0 && (
        <div className="alert alert-info">No hay localidades cargadas.</div>
      )}

      {!loading && !error && data?.length > 0 && (
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
                    Id
                  </th>
                  <th className="py-3 px-4 text-muted border-0">Código</th>
                  <th className="py-3 px-4 text-muted border-0">Nombre</th>
                  <th className="py-3 px-4 text-muted border-0 text-center">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((unaLocalidad) => (
                  <tr key={unaLocalidad.id}>
                    {/* El ID con el mismo estilo destacado */}
                    <td className="px-4 py-3 fw-bold text-secondary">
                      {unaLocalidad.id}
                    </td>

                    {/* Las columnas de datos con el estilo semibold y espaciado */}
                    <td
                      className="px-4 py-3 fw-semibold"
                      style={{ letterSpacing: '1px' }}
                    >
                      {unaLocalidad.codPostal}
                    </td>
                    <td
                      className="px-4 py-3 fw-semibold"
                      style={{ letterSpacing: '1px' }}
                    >
                      {unaLocalidad.nombre}
                    </td>

                    {/* Columna de acciones */}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && <div>Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row justify-content-center mt-3">
        <div className="col-12 col-md-4">
          <Link
            to="/crear-localidad"
            className="btn btn-lg btn-outline-success w-100"
          >
            + Agregar Localidad
          </Link>
        </div>
      </div>
    </div>
  );
}
