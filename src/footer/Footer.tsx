import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getAsync } from '../api/dataManager';
import { ModalCalificacionSecuencial } from '../components/Viaje/ModalCalificacionSecuencial';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './footer.css';

export function Footer() {
  const { userId } = useAuth();
  const [pendiente, setPendiente] = useState<any>(null);

  useEffect(() => {
    const chequearPendientes = async () => {
      if (!userId) return;
      try {
        const res = await getAsync<any[]>(`viaje/viajes-sin-calificar/${userId}`);

        if (res.data && res.data.length > 0) {
          const ignorados = JSON.parse(localStorage.getItem('calificaciones_ignoradas') || '[]');

          const viajeParaMostrar = res.data.find((v: any) => !ignorados.includes(v.viajeId));

          if (viajeParaMostrar) {
            setPendiente(viajeParaMostrar);
          }
        }
      } catch (e) {
        console.error("Error al buscar calificaciones pendientes", e);
      }
    };

    chequearPendientes();
  }, [userId]);

  // función para cuando el usuario cierra con la X
  const handleIgnorarCalificacion = (viajeId: number) => {
    const ignorados = JSON.parse(localStorage.getItem('calificaciones_ignoradas') || '[]');

    if (!ignorados.includes(viajeId)) {
      ignorados.push(viajeId);
      localStorage.setItem('calificaciones_ignoradas', JSON.stringify(ignorados));
    }

    setPendiente(null); 
  };

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

      {/* modal q se muestra sobre cualquier pantalla */}
      {pendiente && (
        <ModalCalificacionSecuencial
          usuarioACalificar={pendiente} // pasamos los datos del conductor a calificar
          viajeId={pendiente.viajeId}
          indice={1}
          total={1}
          tipo="Conductor"
          onSuccess={() => setPendiente(null)}
          onClose={() => handleIgnorarCalificacion(pendiente.viajeId)}
        />
      )}
    </>
  );
}