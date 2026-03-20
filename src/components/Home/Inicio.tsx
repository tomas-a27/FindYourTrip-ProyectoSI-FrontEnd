import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsuarioDTO } from '../../entities/entities';

export const Inicio = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!usuario) return null;

  // Chequeamos si la solicitud para ser conductor está pendiente
  const isPendiente = usuario?.estadoConductor?.toLowerCase() === 'pendiente';

  const handlePublicarViaje = () => {
    if (usuario?.tipoUsuario?.toLowerCase() === 'conductor') {
      // Si es conductor , pasa directo
      navigate('/publicar-viaje');
    } else if (isPendiente) {
      // Si está pendiente de aprobacion, le mostramos el mensaje y NO lo dejamos pasar
      alert('Usted podrá publicar un viaje una vez que su solicitud para ser conductor esté aprobada.');
    } else {
      // Si es pasajero, lo mandamos al formulario
      navigate('/solicitar-conductor');
    }
  };

  return (
    <div className="container mt-4 text-center" style={{ paddingBottom: '100px' }}>
      
      {isPendiente && (
        <div className="alert alert-warning shadow-sm mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ maxWidth: '600px', borderRadius: '15px' }}>
          <i className="bi bi-hourglass-split fs-4 me-3 text-warning"></i>
          <span className="fw-bold text-dark">
            Tu solicitud para ser conductor está pendiente de aprobación.
          </span>
        </div>
      )}

      <div className="d-flex justify-content-center mb-4 mt-2">
        <div style={{ maxWidth: '400px' }}>
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
          Encontrá tu viaje ideal o publicá tu viaje para que otros pasajeros puedan unirse.
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
            <span className="fw-bold mt-2">Buscar un Viaje</span>
          </button>
        </div>

        {/* Botón Publicar Viaje */}
        <div className="col-10 col-sm-6 col-md-4">
          <button 
            onClick={handlePublicarViaje}
            className="btn btn-outline-custom-dark w-100 p-3 shadow-sm border-2 d-flex align-items-center justify-content-center"
            style={{ borderRadius: '15px' }}
          >
            <span className="fw-bold mt-2">Publicar un Viaje</span>
          </button>
        </div>
      </div>
    </div>
  );
};