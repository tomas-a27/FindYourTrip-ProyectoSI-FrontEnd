import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAsync } from '../../api/dataManager';
import { useAuth } from '../../auth/AuthContext'; 

const colorTextoGrisOscuro = '#333333';

export const HistorialPasajero = () => {
  const navigate = useNavigate();
  const { userId } = useAuth(); 
  
  const [historial, setHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      cargarDatos(Number(userId));
    } else {
      navigate('/login');
    }
  }, [navigate, userId]);

  const cargarDatos = async (idUsuario: number) => {
    setLoading(true);
    try {
      const resSol = await getAsync<any>(`viaje/mis-solicitudes/${idUsuario}`);
      if (resSol.data && resSol.data.data) {
        // Filtramos: Solicitudes aprobadas de viajes que ya NO están disponibles ni pendientes (ya ocurrieron)
        const viajesPasados = resSol.data.data.filter((s: any) => 
          s.estadoSolicitud?.toLowerCase() === 'aprobada' && 
          (s.viaje?.viajeEstado?.toLowerCase() !== 'disponible' && s.viaje?.viajeEstado?.toLowerCase() !== 'pendiente')
        );
        setHistorial(viajesPasados);
      } else {
        setHistorial([]); 
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  const formatearHora = (hora: string) => hora ? hora.substring(0, 5) : '';

  if (loading) return <div className="text-center mt-5 p-5"><div className="spinner-border text-success" role="status"></div></div>;

  return (
    <div className="pb-5" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      
      {/* HEADER CON BOTÓN VOLVER */}
      <div className="container pt-4 pb-3" style={{ maxWidth: '900px' }}>
        <div className="d-flex align-items-center mb-4">
          <button 
            className="btn btn-link text-dark p-0 me-3" 
            onClick={() => navigate('/mis-viajes')}
            style={{ fontSize: '1.5rem', textDecoration: 'none' }}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h2 className="fw-bold m-0" style={{ color: colorTextoGrisOscuro, fontSize: '1.5rem' }}>
            Historial de viajes realizados
          </h2>
        </div>
      </div>

      {/* LISTA DE VIAJES REALIZADOS */}
      <div className="container py-2" style={{ maxWidth: '900px' }}>
        {historial.length === 0 ? (
          <p className="text-muted text-center my-5">No tenés viajes realizados como pasajero.</p>
        ) : (
          historial.map((sol) => (
            <TarjetaHistorialPasajero 
              key={sol.solViajeId} 
              viaje={sol.viaje} 
              hora={formatearHora(sol.viaje?.viajeHorario)}
            />
          ))
        )}
      </div>
    </div>
  );
};

// =========================================================================
// COMPONENTE DE TARJETA (Idéntica a Viajes Realizados de Conductor)
// =========================================================================
const TarjetaHistorialPasajero = ({ viaje, hora }: any) => {
  return (
    <div className="card bg-white mb-4" style={{ borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
      <div className="card-body p-0">
        <div className="row p-4 align-items-center">
          
          {/* Izquierda: Ruta */}
          <div className="col-7">
            <div className="d-flex">
              <div className="d-flex flex-column align-items-center me-3 mt-1">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #555' }}></div>
                <div style={{ width: '2px', height: '35px', backgroundColor: '#555', margin: '2px 0' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #555' }}></div>
              </div>
              <div>
                <h5 className="fw-bold m-0 text-dark mb-3" style={{ fontSize: '1.1rem' }}>{viaje?.viajeOrigen?.nombre}</h5>
                <h5 className="fw-bold m-0 text-dark" style={{ fontSize: '1.1rem' }}>{viaje?.viajeDestino?.nombre}</h5>
              </div>
            </div>
          </div>

          {/* Derecha: Fecha y hora */}
          <div className="col-5 d-flex flex-column align-items-end">
            <div className="text-muted d-flex align-items-center mb-2" style={{ fontSize: '0.9rem' }}>
              <span>{new Date(viaje?.viajeFecha).toLocaleDateString('es-AR')}</span> <i className="bi bi-calendar3 ms-2"></i>
            </div>
            <div className="text-muted d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
              <span>{hora}</span> <i className="bi bi-clock ms-2"></i>
            </div>
          </div>

        </div>

        {/* Botón inferior ancho completo (Cambia a Ver conductor) */}
        <div 
          className="w-100 text-center py-3" 
          style={{ borderTop: '1px solid #eaeaea', backgroundColor: '#ffffff', cursor: 'pointer', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}
          onClick={() => alert("En construcción: Ver datos del conductor")}
        >
          <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>Ver conductor</span>
        </div>
      </div>
    </div>
  );
};