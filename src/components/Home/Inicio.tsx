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

  const handlePublicarViaje = () => {
    // Verificamos si es conductor 
    if (usuario?.tipoUsuario?.toLowerCase() === 'conductor') {
      navigate('/publicar-viaje');
    } else {
      // Si es pasajero, lo mandamos a pedir permiso
      navigate('/solicitar-conductor');
    }
  };

  return (
    <div className="container mt-5 text-center"
      style={{
        paddingBottom: '100px' 
      }}>
      <div className="d-flex justify-content-center mb-4">
        <div style={{ maxWidth: '400px' }}> {/* Limitamos el ancho de la imagen */}
          <img
            src="./src/images/imagenInicio.jpg"
            alt="Find Your Trip"
            className="img-fluid shadow-sm"
            style={{ borderRadius: '15px' }}
          />
        </div>
      </div>

      <div className="px-3 mb-2">
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
            className=" btn btn-custom-outline w-100 p-3 shadow-sm border-2 d-flex align-items-center justify-content-center"
            style={{ borderRadius: '15px' }}
          >
            <span style={{ fontSize: '2rem', marginRight: '10px' }}></span>
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
            <span style={{ fontSize: '2rem', marginRight: '10px' }}></span>
            <span className="fw-bold mt-2">Publicar un Viaje</span>
          </button>
        </div>
      </div>
    </div>
  );
};