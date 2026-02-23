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
          style={{
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <Table
            striped
            hover
            bordered
            responsive
            className="align-middle mb-0"
            style={{
              backgroundColor: '#f8f9fa',
            }}
          >
            <thead
              className="text-center"
              style={{
                backgroundColor: '#dee2e6',
              }}
            >
              <tr>
                <th>Id</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((unaLocalidad) => (
                <tr key={unaLocalidad.id}>
                  <td>{unaLocalidad.id}</td>
                  <td>{unaLocalidad.codPostal}</td>
                  <td>{unaLocalidad.nombre}</td>
                  <td className="text-center">
                    <Link
                      to={`/editar-localidad/${unaLocalidad.id}`}
                      className="btn btn-sm btn-outline-secondary me-2"
                    >
                      Editar
                    </Link>
                    <DeleteEntityButton
                      idToDelete={unaLocalidad.id}
                      nameToDelete={unaLocalidad.nombre}
                      route={'localidad'}
                      entityToDelete={'localidad'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {loading && <div>Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row justify-content-center mt-3">
        <div className="col-12 col-md-4">
          <Link
            to="/crear-localidad"
            className="btn btn-lg btn-outline-primary w-100"
          >
            + Agregar Localidad
          </Link>
        </div>
      </div>
    </div>
  );
}
