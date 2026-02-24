import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { patch } from '../../api/dataManager.ts';
import { LocalidadDTO } from '../../entities/entities.ts';
import { getOne } from '../../api/dataManager.ts';

export function EditarLocalidad() {
  const { id } = useParams();
  const navegate = useNavigate();
  const { data } = getOne<LocalidadDTO>('localidad/' + id);

  const [localidadToUpdate, setlocalidadToUpdate] = useState<LocalidadDTO>({
    id: 0,
    nombre: '',
    codPostal: '',
  });

  useEffect(() => {
    if (data) {
      setlocalidadToUpdate({
        id: data.id,
        codPostal: data.codPostal,
        nombre: data.nombre,
      });
    }
  }, [data]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await patch(`localidad/${localidadToUpdate.id}`, localidadToUpdate);
    navegate('/mostrar-localidad');
  };
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="d-flex flex-column bg-white p-4 rounded-4 shadow-sm custom-card">
            <h1 className="text-center mb-4">Agregar Localidad</h1>

            <form className="d-flex flex-column" onSubmit={handleSubmit}>
              <label
                htmlFor="codigo"
                className="form-label fw-semibold text-secondary"
              >
                Código Postal
              </label>
              <input
                required
                type="text"
                id="codigo"
                className="form-control mb-3 custom-input"
                placeholder={localidadToUpdate.codPostal}
                pattern="^[0-9]+$"
                value={localidadToUpdate.codPostal}
                onChange={(e) =>
                  setlocalidadToUpdate({
                    ...localidadToUpdate,
                    codPostal: e.target.value,
                  })
                }
              />

              <label
                htmlFor="nombre"
                className="form-label fw-semibold text-secondary"
              >
                Nombre
              </label>
              <input
                required
                type="text"
                id="nombre"
                className="form-control mb-4 custom-input"
                placeholder={localidadToUpdate.codPostal}
                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                value={localidadToUpdate.nombre}
                onChange={(e) =>
                  setlocalidadToUpdate({
                    ...localidadToUpdate,
                    nombre: e.target.value,
                  })
                }
              />

              <div className="row gy-2 justify-content-between">
                <div className="col-12 col-md-5">
                  <Link
                    className="btn btn-light-cancel btn-danger fw-semibold w-100 shadow-sm"
                    to="/"
                  >
                    Cancelar
                  </Link>
                </div>
                <div className="col-12 col-md-5">
                  <button
                    type="submit"
                    className="btn btn-pastel-green w-100 shadow-sm"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
