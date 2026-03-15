import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { put } from '../../api/dataManager';
import { UsuarioDTO } from '../../entities/entities';

export const SolicitarConductor = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
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

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleCancelar = () => {
    alert('Operación cancelada.'); 
    navigate('/home'); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!usuario) return;

    if (!fotoPerfil || !fotoLicencia || !nroLicencia || !vigenciaLicencia || !patente || !marca || !modelo || !color || !cantLugares) {
      setError('Por favor, complete todos los campos y adjunte las imágenes solicitadas.');
      return;
    }

    
    const regexPatente = /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/i;
    if (!regexPatente.test(patente.trim())) {
      setError('Formato de patente inválido. Debe ser AAA111 o AA111AA.');
      return; 
    }

    const regexLetras = /^[a-zA-Z\sÀ-ÿ]+$/;
    if (!regexLetras.test(marca.trim()) || !regexLetras.test(color.trim())) {
      setError('La marca y el color solo pueden contener letras.');
      return; 
    }

    const regexLicencia = /^[a-zA-Z0-9]+$/;
    if (!regexLicencia.test(nroLicencia.trim())) {
      setError('El número de licencia no tiene un formato válido.');
      return; 
    }

    const formData = new FormData();
    formData.append('nroLicenciaConductorUsuario', nroLicencia.trim());
    formData.append('vigenciaLicenciaConductorUsuario', vigenciaLicencia);
    
    const vehiculoData = {
      patente: patente.trim().toUpperCase(),
      marca: marca.trim(),
      modelo: modelo.trim(),
      color: color.trim(),
      cantLugares: Number(cantLugares)
    };
    formData.append('vehiculo', JSON.stringify(vehiculoData));

    // Adjuntamos los archivos físicos
    formData.append('fotoPerfil', fotoPerfil);
    formData.append('fotoLicencia', fotoLicencia);

    try {
      const response = await put(
        `usuario/solicitarSerConductor/${usuario.idUsuario}`, 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response && response.status === 200) {
        alert('Hemos enviado su solicitud para ser conductor. Próximamente se le informará si fue aceptada.');
        
        // Postcondición: Actualizar Usuario con estadoConductor “pendiente”
        const usuarioActualizado = { ...usuario, estadoConductor: 'Pendiente' };
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detalles || 'Ocurrió un error al enviar la solicitud');
    }
  };

  return (
    <div className="container mt-5 pb-5 mb-5 d-flex justify-content-center">
      <div className="card custom-card shadow-sm w-100" style={{ maxWidth: '700px' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-2" style={{ color: '#2d4a2d' }}>Convertite en Conductor </h2>
          <p className="text-center text-muted mb-4">
            Completá tus datos de manejo y registrá el vehículo que vas a usar.
          </p>

          {error && <div className="alert alert-danger fw-bold">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* SECCIÓN 1: FOTOS Y LICENCIA */}
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
                  className="form-control custom-input" 
                  value={nroLicencia} 
                  onChange={(e) => setNroLicencia(e.target.value)} 
                  required 
                />
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

            {/* SECCIÓN 2: VEHÍCULO */}
            <h5 className="fw-bold mt-4 mb-3" style={{ color: '#2d4a2d', borderBottom: '2px solid #b2d8b2', paddingBottom: '5px' }}>
              2. Datos de tu Vehículo
            </h5>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted fw-bold">Patente</label>
                <input 
                  type="text" 
                  className="form-control custom-input" 
                  placeholder="AAA111 o AA111AA"
                  value={patente} 
                  onChange={(e) => setPatente(e.target.value)} 
                  required 
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted fw-bold">Marca</label>
                <input 
                  type="text" 
                  className="form-control custom-input" 
                  placeholder="Solo letras"
                  value={marca} 
                  onChange={(e) => setMarca(e.target.value)} 
                  required 
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted fw-bold">Modelo</label>
                <input 
                  type="text" 
                  className="form-control custom-input" 
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
                  className="form-control custom-input" 
                  placeholder="Solo letras"
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  required 
                />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label text-muted fw-bold">Asientos Libres</label>
                <input 
                  type="number" 
                  className="form-control custom-input" 
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
              <button type="submit" className="btn btn-pastel-green px-5">
                Aceptar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};