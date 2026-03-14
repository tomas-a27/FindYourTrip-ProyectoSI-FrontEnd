import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from '../../api/dataManager';
import { UsuarioDTO } from '../../entities/entities';

export const VerSolicitudesConductor = () => {
  const navigate = useNavigate();
  const { data, loading, error } = get<UsuarioDTO>('usuario/conductoresPendientes');
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);

  useEffect(() => {
    if (data) {
      setUsuarios(data);
    }
  }, [data]);

  const verDetalle = (idUsuario: number) => {
    navigate(`/aprobar-conductor/${idUsuario}`);
  };

  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data) return '';

    const binary = buffer.data
      .map((byte: number) => String.fromCharCode(byte))
      .join('');

    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  if (loading) return <p className="text-center mt-5">Cargando solicitudes...</p>;

  return (
    <div className="container-fluid mt-5 px-5">

      <h2 style={{ color: '#2d4a2d' }}>
        Solicitudes
      </h2>

      <hr className="mb-3"/>

      {error && <div className="alert alert-danger">{error}</div>}

      {usuarios.length === 0 ? (
        <p className="text-muted">
          No hay solicitudes pendientes
        </p>
      ) : (
        <div>
          {usuarios.map((usuario, index) => (
            <div key={usuario.idUsuario}>
              <div
                className="d-flex align-items-center justify-content-between py-2"
                style={{ cursor: "pointer" }}
                onClick={() => verDetalle(usuario.idUsuario)}
              >
                <div className="d-flex align-items-center w-100">
                  <img
                    src={bufferToBase64(usuario.fotoPerfil)}
                    alt="foto usuario"
                    className="usuario-foto"
                  />

                  <div className="d-flex justify-content-between w-100">
                    <div style={{ minWidth: "180px" }}>
                      <b>Nombre:</b> {usuario.nombreUsuario}
                    </div>

                    <div style={{ minWidth: "180px" }}>
                      <b>Apellido:</b> {usuario.apellidoUsuario}
                    </div>

                    <div style={{ minWidth: "200px" }}>
                      <b>Teléfono:</b> {usuario.telefono}
                    </div>

                    <div style={{ minWidth: "260px" }}>
                      <b>Email:</b> {usuario.email}
                    </div>
                  </div>
                </div>

                <div className="usuario-flecha">
                  ▼
                </div>
              </div>

              {index < usuarios.length - 1 && <hr className="my-2"/>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};