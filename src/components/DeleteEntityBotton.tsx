import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { remove } from '../api/dataManager.ts';

interface Props {
  idToDelete: string;
  nameToDelete: string;
  route: string;
  entityToDelete: string;
}

const DeleteEntityButton = ({
  idToDelete,
  nameToDelete,
  route,
  entityToDelete
}: Props) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleDelete() {
    await remove(`${route}/${idToDelete}`);
    setShowConfirm(false);
    setShowSuccess(true);
  }

  const isVehiculo = entityToDelete === 'vehiculo';

  const titulo = isVehiculo
    ? 'Eliminación de vehículo'
    : 'Eliminar localidad';

  const mensaje = isVehiculo
    ? `¿Desea confirmar la eliminación de su vehículo: ${nameToDelete}?`
    : '¿Está seguro de que desea eliminar esta localidad?';

  const botonCancelar = isVehiculo ? 'Volver' : 'Cancelar';

  const successMessage = isVehiculo
    ? 'Vehículo eliminado con éxito'
    : 'La localidad se eliminó con éxito';

  return (
    <>
      <button
        className="btn btn-sm btn-outline-danger"
        onClick={() => setShowConfirm(true)}
      >
        Eliminar
      </button>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="custom-modal">
            <h5 className="text-start mb-2">{titulo}</h5>

            <hr className="my-2" />

            <p className="text-center mt-3">{mensaje}</p>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                className="btn btn-outline-secondary px-4"
                onClick={() => setShowConfirm(false)}
              >
                {botonCancelar}
              </button>

              <button
                className="btn btn-danger px-4"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="modal-overlay">
          <div className="custom-modal text-center" style={{ maxWidth: '350px', width: '90%' }}>
            <button
              className="btn-cerrar"
              onClick={() => {
                setShowSuccess(false);
                navigate(0);
              }}
            >
              X
            </button>

            <h5 className="mt-3">{successMessage}</h5>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteEntityButton;