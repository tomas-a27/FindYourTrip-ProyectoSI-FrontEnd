import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { put } from '../../api/dataManager';
import { useAuth } from '../../auth/AuthContext';

export const SolicitarConductor = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  
  const location = useLocation();
  const mensajeAviso = location.state?.mensajeAviso;
  
  const [error, setError] = useState('');

  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotoLicencia, setFotoLicencia] = useState<File | null>(null);

  const [nroLicencia, setNroLicencia] = useState('');
  const [vigenciaLicencia, setVigenciaLicencia] = useState('');

  const [patente, setPatente] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [color, setColor] = useState('');
  const [cantLugares, setCantLugares] = useState(1);

  const esLicenciaValida = nroLicencia.length >= 5 && /^[a-zA-Z0-9]+$/.test(nroLicencia);
  
  const regexPatente = /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/i;
  const esPatenteValida = patente.length >= 6 && regexPatente.test(patente.trim().replace(/\s/g, ""));
  
  const regexLetras = /^[a-zA-Z\sÀ-ÿ]+$/;
  const esMarcaValida = marca.length >= 1 && regexLetras.test(marca.trim());
  const esColorValido = color.length >= 1 && regexLetras.test(color.trim());
  
  const esModeloValido = modelo.length >= 1;
  const lugaresValidos = cantLugares > 0;
  
  const formValido = esLicenciaValida && esPatenteValida && esMarcaValida && esColorValido && esModeloValido && lugaresValidos && fotoPerfil && fotoLicencia && vigenciaLicencia;
  // ------------------------------------

  const handleCancelar = () => {
    alert('Operación cancelada.'); 
    navigate('/home'); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId) return;

    if (!formValido) {
      setError('Por favor, revise los campos marcados en rojo y adjunte las imágenes.');
      return;
    }

    const formData = new FormData();
    formData.append('nroLicenciaConductorUsuario', nroLicencia.trim());
    formData.append('vigenciaLicenciaConductorUsuario', vigenciaLicencia);
    
    const vehiculoData = {
      patente: patente.trim().toUpperCase().replace(/\s/g, ""), // Limpiamos espacios como dice el schema
      marca: marca.trim(),
      modelo: modelo.trim(),
      color: color.trim(),
      cantLugares: Number(cantLugares)
    };
    formData.append('vehiculo', JSON.stringify(vehiculoData));

    // Adjuntamos los archivos físicos
    formData.append('fotoPerfil', fotoPerfil as Blob);
    formData.append('fotoLicencia', fotoLicencia as Blob);

    try {
      const response = await put(
        `usuario/solicitarSerConductor/${userId}`,
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response && response.status === 200) {
        alert('Hemos enviado su solicitud para ser conductor. Próximamente se le informará si fue aceptada.');
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detalles || 'Ocurrió un error al enviar la solicitud');
    }
  };

  return (
    <div className="container mt-5 pb-5 mb-5 d-flex justify-content-center flex-column align-items-center">
      
      {/* MENSAJE DE AVISO (Solo se muestra si vino desde el botón de publicar viaje) */}
      {mensajeAviso && (
        <div 
          className="alert shadow-sm w-100 mb-4 d-flex align-items-center" 
          role="alert" 
          style={{ maxWidth: '700px', borderRadius: '15px', border: 'none', borderLeft: '6px solid #0d6efd', backgroundColor: '#e9f2ff' }}
        >
          <i className="bi bi-info-circle-fill fs-3 me-3 text-primary"></i>
          <div>
            <h6 className="fw-bold mb-1 text-primary">¡Estás a un paso de publicar tu viaje!</h6>
            <span className="text-dark" style={{ fontSize: '0.95rem' }}>{mensajeAviso}</span>
          </div>
        </div>
      )}

      <div className="card custom-card shadow-sm w-100 border-0" style={{ maxWidth: '700px', borderRadius: '15px' }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center mb-2 fw-bold" style={{ color: '#2d4a2d' }}>Convertite en Conductor </h2>
          <p className="text-center text-muted mb-4">
            Completá tus datos de manejo y registrá el vehículo que vas a usar.
          </p>

          {error && <div className="alert alert-danger fw-bold">{error}</div>}

          <form onSubmit={handleSubmit}>
            <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2d4a2d', borderBottom: '2px solid #b2d8b2', paddingBottom: '5px' }}>
              1. Datos Personales y Licencia
            </h5>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted fw-bold">Adjuntar Foto Personal</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-control custom-input" 
                  onChange={(e) => setFotoPerfil(e.target.files?.[0] || null)} 
                  required 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted fw-bold">Adjuntar Foto de Licencia</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-control custom-input" 
                  onChange={(e) => setFotoLicencia(e.target.files?.[0] || null)} 
                  required 
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted fw-bold">Número de Licencia</label>
                <input 
                  type="text" 
                  className={`form-control custom-input ${nroLicencia && !esLicenciaValida ? 'is-invalid' : ''} ${nroLicencia && esLicenciaValida ? 'is-valid' : ''}`}
                  placeholder="Coincide con el numero de DNI"
                  value={nroLicencia} 
                  onChange={(e) => setNroLicencia(e.target.value)} 
                  required 
                />
                {nroLicencia && !esLicenciaValida && (
                  <div className="invalid-feedback fw-semibold mt-1">
                    Mínimo 5 caracteres.
                  </div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted fw-bold">Fecha de Vencimiento</label>
                <input 
                  type="date" 
                  className="form-control custom-input" 
                  value={vigenciaLicencia} 
                  onChange={(e) => setVigenciaLicencia(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* VEHÍCULO */}
            <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2d4a2d', borderBottom: '2px solid #b2d8b2', paddingBottom: '5px' }}>
              2. Datos de tu Vehículo
            </h5>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted fw-bold">Patente</label>
                <input 
                  type="text" 
                  className={`form-control custom-input ${patente && !esPatenteValida ? 'is-invalid' : ''} ${patente && esPatenteValida ? 'is-valid' : ''}`}
                  placeholder="Ej: AAA111 o AA111AA"
                  value={patente} 
                  onChange={(e) => setPatente(e.target.value)} 
                  required 
                />
                {patente && !esPatenteValida && (
                  <div className="invalid-feedback fw-semibold mt-1" style={{ fontSize: '0.8rem' }}>
                    Formato AAA111 o AA111AA.
                  </div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted fw-bold">Marca</label>
                <input 
                  type="text" 
                  className={`form-control custom-input ${marca && !esMarcaValida ? 'is-invalid' : ''} ${marca && esMarcaValida ? 'is-valid' : ''}`}
                  placeholder="Ej: Ford"
                  value={marca} 
                  onChange={(e) => setMarca(e.target.value)} 
                  required 
                />
                {marca && !esMarcaValida && (
                  <div className="invalid-feedback fw-semibold mt-1" style={{ fontSize: '0.8rem' }}>
                    Solo letras.
                  </div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted fw-bold">Modelo</label>
                <input 
                  type="text" 
                  className={`form-control custom-input ${modelo && !esModeloValido ? 'is-invalid' : ''} ${modelo && esModeloValido ? 'is-valid' : ''}`}
                  placeholder="Ej: Fiesta"
                  value={modelo} 
                  onChange={(e) => setModelo(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted fw-bold">Color</label>
                <input 
                  type="text" 
                  className={`form-control custom-input ${color && !esColorValido ? 'is-invalid' : ''} ${color && esColorValido ? 'is-valid' : ''}`}
                  placeholder="Ej: Rojo"
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  required 
                />
                {color && !esColorValido && (
                  <div className="invalid-feedback fw-semibold mt-1">
                    Solo letras.
                  </div>
                )}
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label text-muted fw-bold">Cantidad de asientos</label>
                <input 
                  type="number" 
                  className={`form-control custom-input ${cantLugares && !lugaresValidos ? 'is-invalid' : ''} ${cantLugares && lugaresValidos ? 'is-valid' : ''}`}
                  min="1" 
                  max="20"
                  value={cantLugares} 
                  onChange={(e) => setCantLugares(Number(e.target.value))} 
                  required 
                />
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-light-cancel px-4" onClick={handleCancelar}>
                Cancelar
              </button>
              
              <button 
                type="submit" 
                className="btn btn-pastel-green px-5"
                disabled={!formValido} 
              >
                Solicitar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};