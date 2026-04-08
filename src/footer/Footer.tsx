import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getAsync } from '../api/dataManager';
import { ModalCalificacionSecuencial } from '../components/Viaje/ModalCalificacionSecuencial';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './footer.css';

export function Footer() {
  const { userId } = useAuth();
  
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    const chequearPendientes = async () => {
      if (!userId) return;
      try {
        const res = await getAsync<any[]>(
          `viaje/viajes-sin-calificar/${userId}`,
        );

        if (res.data && res.data.length > 0) {
          const ignorados = JSON.parse(
            localStorage.getItem('calificaciones_ignoradas') || '[]',
          );

          // Guardamos todos los viajes que NO hayan sido ignorados
          const viajesParaMostrar = res.data.filter(
            (v: any) => !ignorados.includes(v.viajeId),
          );

          if (viajesParaMostrar.length > 0) {
            setPendientes(viajesParaMostrar);
            setIndiceActual(0); // Empezamos a calificar desde el primero
          }
        }
      } catch (e) {
        console.error('Error al buscar calificaciones pendientes', e);
      }
    };

    chequearPendientes();
  }, [userId]);

  const avanzarSiguiente = () => {
    if (indiceActual < pendientes.length - 1) {
      setIndiceActual(indiceActual + 1);
    } else {
      // Si ya no quedan más, limpiamos la lista para cerrar el modal
      setPendientes([]); 
    }
  };

  const handleIgnorarCalificacion = (viajeId: number) => {
    const ignorados = JSON.parse(
      localStorage.getItem('calificaciones_ignoradas') || '[]',
    );

    if (!ignorados.includes(viajeId)) {
      ignorados.push(viajeId);
      localStorage.setItem(
        'calificaciones_ignoradas',
        JSON.stringify(ignorados),
      );
    }

    avanzarSiguiente(); 
  };

  const viajeEnPantalla = pendientes[indiceActual];

  return (
    <>
      <footer className="footer-custom">
        <div className="footer-container">
          <Link to="/home" className="footer-item">
            <i className="bi bi-house-door-fill footer-icon"></i>
            <span className="footer-text fw-semibold">Inicio</span>
          </Link>

          <Link to="/mis-viajes" className="footer-item">
            <i className="bi bi-car-front-fill footer-icon"></i>
            <span className="footer-text fw-semibold">Mis viajes</span>
          </Link>

          <Link to={`/mi-cuenta/${userId}`} className="footer-item">
            <i className="bi bi-person-circle footer-icon"></i>
            <span className="footer-text fw-semibold">Mi cuenta</span>
          </Link>
        </div>
      </footer>

      {viajeEnPantalla && (
        <ModalCalificacionSecuencial
          usuarioACalificar={viajeEnPantalla} 
          viajeId={viajeEnPantalla.viajeId}
          indice={indiceActual + 1}
          total={pendientes.length}
          tipo="Conductor"
          onSuccess={avanzarSiguiente} 
          onClose={() => handleIgnorarCalificacion(viajeEnPantalla.viajeId)}
        />
      )}
    </>
  );
}