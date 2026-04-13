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
    return <p className="text-center mt-5">Cargando usuarios...</p>;
  }

  return (
    <div className="container-fluid mt-5 px-5 position-relative">
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

      <hr className="mb-3" />

      {error && <div className="alert alert-danger">{error}</div>}

      {usuarios.length === 0 ? (
        <p className="text-muted p-4 mb-0">No hay usuarios a sancionar</p>
      ) : (
        <div
          className="card border-0 shadow-sm px-4"
          style={{ borderRadius: '16px', overflow: 'hidden' }}
        >
          {usuarios.map((u, index) => (
            <div key={u.idUsuario}>
              <div className="d-flex align-items-center justify-content-between py-3 list-hover">
                <div className="d-flex align-items-center w-100">
                  {u.tipoUsuario !== 'pasajero' && u.foto ? (
                    <img
                      src={bufferToBase64(u.foto)}
                      alt="foto usuario"
                      className="usuario-foto"
                    />
                  ) : (
                    <div className="usuario-foto d-flex align-items-center justify-content-center text-center">
                      <span style={{ fontSize: '0.7rem' }}>Sin foto</span>
                    </div>
                  )}

                  <div className="d-flex w-100">
                    <div className="d-flex flex-column usuario-col">
                      <span>
                        <b>Nombre:</b> {u.nombre}
                      </span>
                      <span>
                        <b>Apellido:</b> {u.apellido}
                      </span>
                    </div>

                    <div
                      className="d-flex flex-column usuario-col"
                      style={{ marginLeft: '150px' }}
                    >
                      <span>
                        <b>Tipo usuario:</b> {u.tipoUsuario}
                      </span>
                      <span>
                        <b>Cant infracciones:</b> {u.cantidadReportes}
                      </span>
                    </div>

                    <div
                      className="d-flex flex-column usuario-col"
                      style={{ marginLeft: '200px' }}
                    >
                      <span>
                        <b>Email:</b> {u.email}
                      </span>
                      <span>
                        <b>Teléfono:</b> {u.telefono}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ms-3">
                  <button
                    className="btn btn-outline-custom-dark"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => setUsuarioSeleccionado(u.idUsuario)}
                  >
                    Ver infracciones
                  </button>
                </div>
              </div>

              {index < usuarios.length - 1 && <hr className="my-2" />}
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
