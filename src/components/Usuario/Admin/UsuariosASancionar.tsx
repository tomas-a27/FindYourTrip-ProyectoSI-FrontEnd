import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../../api/dataManager';
import { VerInfracciones } from './VerInfracciones';

export const UsuariosASancionar = () => {
  const { data, loading, error } = get<any>('sancion/usuarios-a-sancionar');

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (data) {
      setUsuarios(data);
    }
  }, [data]);

  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data) return '';
    const binary = buffer.data
      .map((b: number) => String.fromCharCode(b))
      .join('');
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  if (loading) {
    return (
      <div className="text-center mt-5 p-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3 text-muted fw-bold">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5 px-3 px-md-4 position-relative">
      <div className="mb-3">
        <Link
          to="/admin-home"
          className="btn d-flex align-items-center text-success fw-bold p-0 text-decoration-none"
          style={{ border: 'none', background: 'none' }}
        >
          <i className="bi bi-arrow-left-circle-fill fs-4 me-2"></i>
          Volver al Menú
        </Link>
      </div>

      <h2 style={{ color: '#2d4a2d' }}>Sancionar usuarios</h2>

      <hr className="mb-4" />

      {error && <div className="alert alert-danger">{error}</div>}

      {usuarios.length === 0 && !error ? (
        <p className="text-muted p-4 mb-0 text-center fw-bold bg-light rounded-4 border">
          No hay usuarios pendientes a sancionar en este momento.
        </p>
      ) : (
        <div
          className="card border-0 shadow-sm p-3 p-md-4"
          style={{ borderRadius: '16px', overflow: 'hidden' }}
        >
          {usuarios.map((u, index) => (
            <div key={u.idUsuario}>
              <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between py-3 list-hover gap-3">
                
                {/* Lado izquierdo: Foto + Datos del usuario */}
                <div className="d-flex flex-column flex-sm-row align-items-sm-center w-100 gap-3 gap-md-4">
                  
                  {/* Foto centrada en celulares */}
                  <div className="d-flex justify-content-center justify-content-sm-start flex-shrink-0">
                    {u.tipoUsuario !== 'pasajero' && u.foto ? (
                      <img
                        src={bufferToBase64(u.foto)}
                        alt="foto usuario"
                        className="usuario-foto shadow-sm border"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    ) : (
                      <div 
                        className="usuario-foto d-flex align-items-center justify-content-center text-center bg-light border text-muted"
                        style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                      >
                        <span style={{ fontSize: '0.7rem' }}>Sin foto</span>
                      </div>
                    )}
                  </div>

                  {/* Datos usando la grilla de Bootstrap */}
                  <div className="row w-100 g-2 text-center text-sm-start">
                    
                    {/* Columna 1: Nombre */}
                    <div className="col-12 col-sm-4 d-flex flex-column justify-content-center">
                      <div className="mb-1" style={{ fontSize: '0.95rem' }}>
                        <b className="text-muted">Nombre:</b> <br className="d-sm-none"/> {u.nombre}
                      </div>
                      <div style={{ fontSize: '0.95rem' }}>
                        <b className="text-muted">Apellido:</b> <br className="d-sm-none"/> {u.apellido}
                      </div>
                    </div>

                    {/* Columna 2: Infracciones */}
                    <div className="col-12 col-sm-4 d-flex flex-column justify-content-center">
                      <div style={{ fontSize: '0.95rem' }}>
                        <b className="text-danger">Cantidad de infracciones:</b> <br className="d-sm-none"/> 
                        <span className="badge bg-danger rounded-pill ms-sm-1">{u.cantidadReportes}</span>
                      </div>
                    </div>

                    <div className="col-12 col-sm-4 d-flex flex-column justify-content-center" style={{ minWidth: 0 }}>
                      <div className="mb-1" title={u.email} style={{ fontSize: '0.95rem' }}>
                        <b className="text-muted">Email:</b> <br className="d-sm-none"/> 
                        <span className="d-inline-block text-truncate align-middle" style={{ maxWidth: '100%' }}>
                          {u.email}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.95rem' }}>
                        <b className="text-muted">Teléfono:</b> <br className="d-sm-none"/> {u.telefono}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 mt-lg-0 flex-shrink-0 d-flex justify-content-center justify-content-lg-end">
                  <button
                    className="btn btn-outline-secondary fw-bold px-4 py-2 w-100"
                    style={{ whiteSpace: 'nowrap', borderRadius: '10px' }}
                    onClick={() => setUsuarioSeleccionado(u.idUsuario)}
                  >
                    Ver infracciones
                  </button>
                </div>

              </div>

              {index < usuarios.length - 1 && <hr className="my-2 text-muted opacity-25" />}
            </div>
          ))}
        </div>
      )}

      {usuarioSeleccionado && (
        <VerInfracciones
          usuarioId={usuarioSeleccionado}
          onClose={() => setUsuarioSeleccionado(null)}
        />
      )}
    </div>
  );
};