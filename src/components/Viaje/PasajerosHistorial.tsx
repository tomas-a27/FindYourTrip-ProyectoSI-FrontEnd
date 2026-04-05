import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAsync } from '../../api/dataManager.ts';
//historial de viajes realizados para el conductor
export const PasajerosHistorial = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const viajeId = location.state?.viajeId;

  const [loading, setLoading] = useState(true);
  const [viajeInfo, setViajeInfo] = useState<any>(null);
  const [pasajeros, setPasajeros] = useState<any[]>([]);

  useEffect(() => {
    if (!viajeId) {
      navigate('/mis-viajes');
      return;
    }
    cargarDatos();
  }, [viajeId, navigate]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const res = await getAsync<any>(`viaje/pasajeros-historial/${viajeId}`);
      if (res.data) {
        setViajeInfo(res.data.viajeInfo);
        setPasajeros(res.data.pasajeros);
      }
    } catch (error) {
      console.error('Error al cargar pasajeros:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEstrellas = (calificacion: number | null) => {
    if (calificacion === null) {
      return <span className="badge bg-light text-muted border px-2 py-1">Sin calificar</span>;
    }
    
    return (
      <div className="d-flex text-warning fs-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <i key={star} className={`bi bi-star${star <= calificacion ? '-fill' : ''}`}></i>
        ))}
      </div>
    );
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-success"></div></div>;

  return (
    <div className="container mt-4 mb-5 pb-5" style={{ maxWidth: '800px' }}>
      {/* Header y botón volver */}
      <div className="d-flex align-items-center mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-link text-dark p-0 me-3 fs-3" style={{ textDecoration: 'none' }}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2 className="fw-bold m-0" style={{ color: '#2d4a2d' }}>Detalle de pasajeros</h2>
      </div>

      {/* Info del Viaje */}
      {viajeInfo && (
        <div className="card shadow-sm border-0 mb-4 rounded-4" style={{ backgroundColor: '#eaf5ea' }}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-2 text-dark">
              {viajeInfo.origen} <i className="bi bi-arrow-right mx-2 text-muted"></i> {viajeInfo.destino}
            </h5>
            <div className="d-flex text-muted gap-4 mt-2" style={{ fontSize: '0.95rem' }}>
              <span><i className="bi bi-calendar3 me-2"></i> {viajeInfo.fecha.split('-').reverse().join('/')}</span>
              <span><i className="bi bi-clock me-2"></i> {viajeInfo.horario.substring(0, 5)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Lista de pasajeros */}
      <h5 className="fw-bold mb-3 mt-4 text-dark">Pasajeros del viaje</h5>
      
      {pasajeros.length === 0 ? (
        <div className="alert alert-light border">No hubo pasajeros aprobados en este viaje.</div>
      ) : (
        <div className="row">
          {pasajeros.map((pasajero) => (
            <div key={pasajero.idUsuario} className="col-12 mb-3">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-3 d-flex align-items-start justify-content-between">
                  <div className="d-flex align-items-start">
                    <div 
                      className="bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white fw-bold me-3 mt-1"
                      style={{ width: '45px', height: '45px', fontSize: '1.1rem', flexShrink: 0 }}
                    >
                      {pasajero.nombre.charAt(0)}{pasajero.apellido.charAt(0)}
                    </div>
                    <div>
                      <h6 className="fw-bold m-0 text-dark">{pasajero.nombre} {pasajero.apellido}</h6>
                      <span className="text-muted small">Pasajero</span>
                      <h6 className="fw-bold text-dark mt-3 mb-1" style={{ fontSize: '0.90rem' }}>Datos de contacto</h6>
                      <p className="text-muted m-0 mb-1" style={{ fontSize: '0.9rem' }}>
                        <i className="bi bi-telephone-fill me-1 text-success"></i> {pasajero.telefono}
                      </p>
                      <p className="text-muted m-0" style={{ fontSize: '0.9rem' }}>
                        <i className="bi bi-envelope-fill me-1 text-danger"></i> {pasajero.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-end">
                    <span className="d-block text-muted small fw-semibold mb-1">Tu calificación:</span>
                    {renderEstrellas(pasajero.calificacionOtorgada)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};