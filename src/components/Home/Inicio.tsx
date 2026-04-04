import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsuarioDTO } from '../../entities/entities';
import { getOne } from '../../api/dataManager';
import { useAuth } from '../../auth/AuthContext';
import { ModalAlertAviso } from '../ModalAlert';

export const Inicio = () => {
  const navigate = useNavigate();
  const { userId, userTipo } = useAuth();
  const { data: usuario } = getOne<UsuarioDTO>('usuario/' + userId);

  const [mostrarModalAviso, setMostrarModalAviso] = useState(false);

  // Chequeamos si la solicitud para ser conductor está pendiente
  const isPendiente = usuario?.estadoConductor?.toLowerCase() === 'pendiente';

  const handlePublicarViaje = () => {
    if (userTipo?.toLowerCase() === 'conductor') {
      // Si es conductor, pasa directo
      navigate('/publicar-viaje');
    } else if (isPendiente) {
      // Si está pendiente de aprobacion, le mostramos el mensaje y NO lo dejamos pasar
      setMostrarModalAviso(true);
    } else {
      // Si es pasajero, lo mandamos al formulario con el mensaje de aviso
      navigate('/solicitar-conductor', {
        state: {
          mensajeAviso:
            'Para poder publicar viajes debes convertirte en conductor y esperar tu aprobación. Aquí podés registrar la información necesaria. Serás notificado una vez que tu solicitud haya sido revisada.',
        },
      });
    }
  };

  return (
    <div className="container mt-4 text-center">
      {isPendiente && (
        <div
          className="alert alert-warning shadow-sm mx-auto mb-4 d-flex align-items-center justify-content-center"
          style={{ maxWidth: '600px', borderRadius: '15px' }}
        >
          <i className="bi bi-hourglass-split fs-4 me-3 text-warning"></i>
          <span className="fw-bold text-dark">
            Tu solicitud para ser conductor está pendiente de aprobación.
          </span>
        </div>
      )}
      <div className="text-center mb-4 ">
      </div>
      <div className="d-flex justify-content-center mb-4 mt-2">
        <div
          style={{
            maxWidth: '500px',
            paddingRight: '20px',
            paddingLeft: '20px',
          }}
        >
          <img
            src="./src/images/imagenInicio.jpg"
            alt="Find Your Trip"
            className="img-fluid shadow-sm"
            style={{ borderRadius: '15px' }}
          />
        </div>
      </div>

      <div className="px-3 mb-4">
        <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: '1.6' }}>
          Encontrá tu viaje ideal o publicá tu viaje para que otros pasajeros
          puedan unirse.
          <br />
          <strong>¡Todo en un mismo lugar!</strong>
        </p>
      </div>

      <div className="row g-3 justify-content-center">
        {/* Botón Buscar Viaje */}
        <div className="col-10 col-sm-6 col-md-4">
          <button
            onClick={() => navigate('/buscar-viaje')}
            className="btn btn-custom-outline w-100 p-3 shadow-sm border-2 d-flex align-items-center justify-content-center"
            style={{ borderRadius: '15px' }}
          >
            <span className="fw-bold mt-2">Buscar un viaje</span>
          </button>
        </div>

        {/* Botón Publicar Viaje */}
        <div className="col-10 col-sm-6 col-md-4">
          <button
            onClick={handlePublicarViaje}
            className="btn btn-outline-custom-dark w-100 p-3 shadow-sm border-2 d-flex align-items-center justify-content-center"
            style={{ borderRadius: '15px' }}
          >
            <span className="fw-bold mt-2">Publicar un viaje</span>
          </button>
        </div>
      </div>

      <ModalAlertAviso
        show={mostrarModalAviso}
        onClose={() => setMostrarModalAviso(false)}
        message="Usted podrá publicar un viaje una vez que su solicitud para ser conductor esté aprobada."
      />
    </div>
  );
};
