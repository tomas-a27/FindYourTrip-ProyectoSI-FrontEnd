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

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4" style={{ color: '#2d4a2d', fontWeight: 'bold' }}>
        ¡Hola, {usuario.nombreUsuario}!
      </h1>
      <p className="text-muted mb-5">¿Qué querés hacer hoy?</p>

      <div className="row g-4 justify-content-center">
        {/* Botón Buscar Viaje */}
        <div className="col-12 col-md-5">
          <button 
            onClick={() => navigate('/buscar-viaje')}
            className="btn btn-outline-success w-100 p-5 shadow-sm border-2 d-flex flex-column align-items-center"
            style={{ borderRadius: '15px' }}
          >
            <span style={{ fontSize: '2rem' }}>🔍</span>
            <span className="fw-bold mt-2">Buscar un Viaje</span>
          </button>
        </div>

        {/* Botón Publicar Viaje */}
        <div className="col-12 col-md-5">
          <button 
            onClick={() => navigate('/publicar-viaje')}
            className="btn btn-success w-100 p-5 shadow-sm d-flex flex-column align-items-center"
            style={{ borderRadius: '15px', backgroundColor: '#2d4a2d' }}
          >
            <span style={{ fontSize: '2rem' }}>🚗</span>
            <span className="fw-bold mt-2">Publicar un Viaje</span>
          </button>
        </div>
      </div>
    </div>
  );
};