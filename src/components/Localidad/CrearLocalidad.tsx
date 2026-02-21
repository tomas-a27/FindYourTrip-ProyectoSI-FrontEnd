import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../../api/dataManager.ts';

export function CrearLocalidad() {
  const [newLocalidad, setNewLocalidad] = useState({
    nombre: '',
    codPostal: '',
  });

  const navegate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await post('localidad', newLocalidad);
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
                placeholder="Ej: 2000"
                pattern="^[0-9]+$"
                value={newLocalidad.codPostal}
                onChange={(e) =>
                  setNewLocalidad({
                    ...newLocalidad,
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
                placeholder="Ej: Rosario"
                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                value={newLocalidad.nombre}
                onChange={(e) =>
                  setNewLocalidad({ ...newLocalidad, nombre: e.target.value })
                }
              />

              <div className="row gy-2 justify-content-between">
                <div className="col-12 col-md-5">
                  <Link
                    className="btn btn-light-cancel btn-danger fw-semibold w-100 shadow-sm"
                    to="/show-localidad"
                  >
                    Cancelar
                  </Link>
                </div>
                <div className="col-12 col-md-5">
                  <button
                    type="submit"
                    className="btn btn-pastel-green w-100 shadow-sm"
                  >
                    Agregar
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
