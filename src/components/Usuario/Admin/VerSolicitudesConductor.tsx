import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../../api/dataManager';
import { UsuarioDTO } from '../../../entities/entities';
import { AprobarConductor } from './AprobarConductor'; // <-- Importamos el modal

export const VerSolicitudesConductor = () => {
  const { data, loading, error } = get<UsuarioDTO>('usuario/conductoresPendientes');
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);
  
  
  // Estado para controlar qué usuario se muestra en el Pop-Up
  const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      setUsuarios(data);
    }
  }, [data]);

  const verDetalle = (idUsuario: number) => {
    setUsuarioSeleccionadoId(idUsuario);
  };

  const manejarAccionExitosa = (idUsuarioProcesado: number) => {
    setUsuarios((prev) => prev.filter((u) => u.idUsuario !== idUsuarioProcesado));
    setUsuarioSeleccionadoId(null);
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
                className="d-flex align-items-center justify-content-between py-2 list-hover"
                style={{ cursor: "pointer", transition: "0.2s" }}
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

                <div className="usuario-flecha text-success fw-bold ps-3">
                  ▼
                </div>
              </div>

              {index < usuarios.length - 1 && <hr className="my-2"/>}
            </div>
          ))}
        </div>
      )}

      {usuarioSeleccionadoId && (
        <AprobarConductor 
          usuarioId={usuarioSeleccionadoId} 
          onClose={() => setUsuarioSeleccionadoId(null)} 
          onSuccess={manejarAccionExitosa}
        />
      )}

    </div>
  );
};