import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Inicio = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<{ nombre: string } | null>(null);

  useEffect(() => {
    // Verificamos si hay una sesión iniciada
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      // Si no hay sesión, lo mandamos al login
      navigate('/login');
    }
  }, [navigate]);

  if (!usuario) return null;

  return (
    <div className="container mt-5 text-center">
      <h1 style={{ color: '#2d4a2d' }}>¡Bienvenido, {usuario.nombre}!</h1>
      <p className="text-muted mt-3">Próximamente habrá más funciones aquí...</p>
    </div>
  );
};