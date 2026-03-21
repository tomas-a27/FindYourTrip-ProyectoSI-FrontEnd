import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getOne } from '../../api/dataManager';
import { UsuarioDTO } from '../../entities/entities';

export const MiCuenta = () => {
  const [mostrarConfirmarLogout, setMostrarConfirmarLogout] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Traemos la data del usuario
  const { data: usuario } = getOne<UsuarioDTO>('usuario/' + id);

  // Validaciones de carga (Unificadas con EditarUsuario)
  if (!usuario) {
    return <p className="text-center mt-5 font-bold">Cargando perfil... </p>;
  }

  if (!usuario.idUsuario) {
    return <p className="text-center mt-5 font-bold">Usuario no encontrado</p>;
  }

  // Chequeamos si es conductor para mostrar la versión extendida
  const esConductor = usuario.tipoUsuario?.toLowerCase() === 'conductor';

  // Función para la foto de perfil
  const bufferToBase64 = (buffer: any) => {
    if (!buffer?.data) return '';
    const binary = buffer.data.map((byte: number) => String.fromCharCode(byte)).join('');
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container mt-0 mt-md-5 pb-5">
      <div className="row justify-content-center">
        {/* Definimos el ancho: 12 en móvil, 8 en tablet, 5 en escritorio grande */}
        <div className="col-12 col-md-8 col-lg-7">

          {/* HEADER: Nombre, Estrellas y Foto */}
          <div className="d-flex justify-content-between align-items-center mb-4 px-3 py-3 bg-white rounded-4 shadow-sm border">
            <div className="flex-grow-1">
              <h2 className="fw-bold mb-2 text-dark" style={{ letterSpacing: '-1px' }}>
                {usuario.nombreUsuario} {usuario.apellidoUsuario}
              </h2>

              <div className="d-flex gap-3">
                <div className="text-center">
                  <p className="mb-1 fw-bold text-muted" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Pasajero</p>
                  <div className="calificacion-badge">
                    <i className="bi bi-star-fill text-warning"></i> <span className="fw-bold">5.00</span>
                  </div>
                </div>

                {esConductor && (
                  <div className="text-center">
                    <p className="mb-1 fw-bold text-muted" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Conductor</p>
                    <div className="calificacion-badge">
                      <i className="bi bi-star-fill text-warning"></i> <span className="fw-bold">4.90</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* condicional: muestra foto si es conductor, boton si es pasajero */}
            <div className="ms-3 text-end" style={{ minWidth: esConductor ? '90px' : '120px' }}>
              {esConductor ? (
                /* Muestra foto */
                <img
                  src={usuario.fotoPerfil ? bufferToBase64(usuario.fotoPerfil) : 'https://via.placeholder.com/150'}
                  className="usuario-foto-grande shadow-sm border border-2 border-white"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              ) : (
                /* Muestra botón */
                <button
                  className="btn btn-pastel-green btn-sm rounded-pill px-3 shadow-sm text-wrap"
                  style={{ maxWidth: '190px', fontSize: '16px' }}
                  onClick={() => navigate(`/solicitar-conductor`)}
                >
                  Quiero ser conductor
                </button>
              )}
            </div>
          </div>

          {/* CONTENEDOR VERDE (Caja de acciones) */}
          <div className="editar-usuario-card shadow-lg p-4">

            {/* SECCIÓN: Datos Personales (Blanca) */}
            <div className="custom-card bg-white p-3 rounded-4 mb-4 shadow-sm" style={{ borderTop: '6px solid #2d4a2d' }}>
              <h6 className="fw-bold border-bottom pb-2 mb-3 text-dark">Datos personales</h6>

              <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="text-muted small fw-bold">Teléfono</span>
                <span className="fw-medium">{usuario.telefono}</span>
              </div>

              <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="text-muted small fw-bold">Email</span>
                <span className="fw-medium ms-2" style={{ maxWidth: '180px' }}>{usuario.email}</span>
              </div>

              <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="text-muted small fw-bold">DNI</span>
                <span className="fw-medium">{usuario.nroDocumento || '---'}</span>
              </div>

              {esConductor && (
                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <span className="text-muted small fw-bold">Licencia</span>
                  <span className="fw-medium">{usuario.nroDocumento || '---'}</span>
                </div>
              )}

              {/* Botones de acción rápida */}
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <button
                  className="btn btn-custom-outline btn-sm px-4 rounded-pill"
                  onClick={() => navigate(`/editar-usuario/${id}`)}
                >
                  Editar datos personales
                </button>
              </div>
            </div>

            {/* MENÚ DE OPCIONES (Botones Blancos) */}
            <div className="menu-navegacion d-grid gap-2">
              <div className="campo-box d-flex align-items-center shadow-sm pointer py-3 px-3 rounded-3" onClick={() => navigate('/mis-viajes')}>
                <i className="bi bi-car-front-fill fs-4 me-3 text-dark"></i>
                <span className="fw-bold flex-grow-1">{esConductor ? 'Viajes como conductor' : 'Mis viajes'}</span>
                <i className="bi bi-chevron-right usuario-flecha"></i>
              </div>

              {esConductor && (
                <div
                  className="campo-box d-flex align-items-center shadow-sm pointer py-3 px-3 rounded-3"
                  onClick={() => navigate(`/mostrar-vehiculo/${id}`)}
                >
                  <i className="bi bi-car-front fs-4 me-3 text-dark"></i>
                  <span className="fw-bold flex-grow-1">Mis vehículos</span>
                  <i className="bi bi-chevron-right usuario-flecha"></i>
                </div>
              )}

              <div className="campo-box d-flex align-items-center shadow-sm pointer py-3 px-3 rounded-3">
                <i className="bi bi-life-preserver fs-4 me-3 text-dark"></i>
                <span className="fw-bold flex-grow-1">Ayuda</span>
                <i className="bi bi-chevron-right usuario-flecha"></i>
              </div>

              <div className="campo-box d-flex align-items-center shadow-sm pointer py-3 px-3 rounded-3">
                <i className="bi bi-clipboard2-check fs-4 me-3 text-dark"></i>
                <span className="fw-bold flex-grow-1">Políticas de uso</span>
                <i className="bi bi-chevron-right usuario-flecha"></i>
              </div>
            </div>

            {/* BOTÓN CERRAR SESIÓN */}
            <button
              onClick={() => setMostrarConfirmarLogout(true)}
              className="btn btn-light-cancel w-100 mt-4 py-3 fw-bold rounded-4 shadow-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN */}
      {mostrarConfirmarLogout && (
        <div className="modal-overlay">
          <div className="custom-modal p-4 text-center">
            {/* Botón X */}
            <button
              onClick={() => setMostrarConfirmarLogout(false)}
              className="btn-cerrar position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-5 text-muted"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="mb-1">
              <i className="bi bi-box-arrow-right text-danger" style={{ fontSize: '3rem' }}></i>
            </div>

            <h5 className="fw-bold mb-3">¿Está seguro que desea cerrar sesión?</h5>

            <div className="d-grid gap-2">
              <button
                onClick={handleLogout}
                className="btn btn-danger py-2 fw-bold rounded-3 shadow-sm"
              >
                Sí, cerrar sesión
              </button>
              <button
                onClick={() => setMostrarConfirmarLogout(false)}
                className="btn btn-light py-2 fw-bold rounded-3 border"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};