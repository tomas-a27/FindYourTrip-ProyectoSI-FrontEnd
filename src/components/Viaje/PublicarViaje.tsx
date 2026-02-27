import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { post, get } from '../../api/dataManager'; 
import { UsuarioDTO, LocalidadDTO } from '../../entities/entities';

export const PublicarViaje = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const { data: localidades, loading: cargandoLocs } = get<LocalidadDTO>('localidades');

  const [formData, setFormData] = useState({
    viajeFecha: '',
    viajeHorario: '',
    viajeCantLugares: 1,
    viajePrecio: 0,
    viajeAceptaMascotas: false,
    viajeComentario: '',
    viajeOrigen: '',
    viajeDestino: '',
    vehiculo: '' 
  });

  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      const user = JSON.parse(userJson);
      setUsuario(user);
      if (!user.vehiculos || user.vehiculos.length === 0) {
        alert("Primero debés registrar un vehículo para publicar un viaje.");
        navigate('/perfil');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const viajeAPublicar = { 
      ...formData, 
      usuarioConductor: usuario?.idUsuario 
    };

    const response = await post('viajes', viajeAPublicar);

    if (response && response.status === 201) {
      alert("¡Viaje publicado con éxito!");
      navigate('/inicio');
    } else {
      const errorMsg = response?.data?.message || "Ocurrió un error inesperado";
      alert("Error: " + errorMsg);
    }
  };

  if (!usuario) return null;

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 text-center" style={{ color: '#2d4a2d' }}>Publicar un Viaje</h2>
      
      <div className="card shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label className="form-label fw-bold">¿En qué vehículo vas?</label>
            <select 
              className="form-select" 
              required
              value={formData.vehiculo}
              onChange={(e) => setFormData({...formData, vehiculo: e.target.value})}
            >
              <option value="">Seleccioná tu auto...</option>
              {usuario.vehiculos?.map(v => (
                <option key={v.patente} value={v.patente}>{v.marca} {v.modelo} ({v.patente})</option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Origen</label>
              <select 
                className="form-select" 
                required 
                value={formData.viajeOrigen}
                onChange={(e) => setFormData({...formData, viajeOrigen: e.target.value})}
              >
                <option value="">Desde...</option>
                {!cargandoLocs && localidades.map(l => (
                  <option key={l.id} value={l.id}>{l.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Destino</label>
              <select 
                className="form-select" 
                required 
                value={formData.viajeDestino}
                onChange={(e) => setFormData({...formData, viajeDestino: e.target.value})}
              >
                <option value="">Hacia...</option>
                {!cargandoLocs && localidades.map(l => (
                  <option key={l.id} value={l.id}>{l.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Fecha</label>
              <input type="date" className="form-control" required onChange={(e) => setFormData({...formData, viajeFecha: e.target.value})} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Hora</label>
              <input type="time" className="form-control" required onChange={(e) => setFormData({...formData, viajeHorario: e.target.value})} />
            </div>
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label fw-bold">Lugares</label>
              <input type="number" className="form-control" min="1" required onChange={(e) => setFormData({...formData, viajeCantLugares: parseInt(e.target.value)})} />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label fw-bold">Precio ($)</label>
              <input type="number" className="form-control" min="0" required onChange={(e) => setFormData({...formData, viajePrecio: parseFloat(e.target.value)})} />
            </div>
          </div>

          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="mascotas" onChange={(e) => setFormData({...formData, viajeAceptaMascotas: e.target.checked})} />
            <label className="form-check-label" htmlFor="mascotas">¿Aceptás mascotas?</label>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Comentarios (opcional)</label>
            <textarea className="form-control" rows={2} placeholder="Ej: No se puede fumar..." onChange={(e) => setFormData({...formData, viajeComentario: e.target.value})}></textarea>
          </div>

          <button type="submit" className="btn btn-success w-100 py-2 fw-bold" style={{ backgroundColor: '#2d4a2d' }}>
            Publicar Viaje
          </button>
        </form>
      </div>
    </div>
  );
};