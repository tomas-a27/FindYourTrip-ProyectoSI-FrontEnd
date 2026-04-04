import { useNavigate } from 'react-router-dom';

export const PoliticasUso = () => {
  const navigate = useNavigate();

  const politicas = [
    'Solo pueden registrarse como conductores quienes posean una licencia de conducir válida emitida por el Estado argentino.',
    'Los datos personales y de contacto deben ser verídicos y estarán sujetos a validación.',
    'Las solicitudes de viaje están sujetas a aceptación por parte del conductor. Los conductores disponen de hasta 12 horas para responder.',
    'Pasajeros y conductores pueden cancelar viajes sin penalización hasta 12 horas antes del inicio.',
    'Luego del viaje, ambos pueden calificar y reportar al otro usuario. Las infracciones reiteradas serán evaluadas por el administrador.',
    'El mal uso del sistema, el ingreso de datos falsos o el incumplimiento reiterado de normas podrá derivar en sanciones.',
  ];

  return (
    <div className="container mt-4 mt-md-5 pb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          <div
            className="mb-4 d-flex align-items-center"
            onClick={() => navigate(-1)}
            style={{ cursor: 'pointer' }}
          >
            <div
              className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{ width: '24px', height: '24px' }}
            >
              <i className="bi bi-arrow-left text-white fs-9"></i>
            </div>
            <span className="fw-bold text-success fs-7">
              Volver a Mi Cuenta
            </span>
          </div>

          <h2
            className="fw-bold m-0 text-center mb-3"
            style={{ color: '#2d4a2d' }}
          >
            Políticas de uso
          </h2>

          {/* Card de contenido */}
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <div className="text-center mb-4">
              <i
                className="bi bi-shield-check text-success"
                style={{ fontSize: '3.5rem' }}
              ></i>
              <p className="text-muted mt-2 fw-medium">
                Normas de convivencia y seguridad de Find Your Trip
              </p>
            </div>

            <div className="d-grid gap-4">
              {politicas.map((texto, index) => (
                <div
                  key={index}
                  className="d-flex align-items-start border-bottom pb-3"
                >
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold me-3 flex-shrink-0"
                    style={{
                      backgroundColor: '#2d4a2d',
                      width: '28px',
                      height: '28px',
                      fontSize: '0.9rem',
                    }}
                  >
                    {index + 1}
                  </div>
                  <p
                    className="m-0 text-dark fw-medium"
                    style={{ lineHeight: '1.5', fontSize: '1rem' }}
                  >
                    {texto}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-5 p-3 rounded-4"
              style={{
                backgroundColor: '#f1f8f1',
                borderLeft: '5px solid #2d4a2d',
              }}
            >
              <p className="m-0 small text-muted italic">
                Al utilizar nuestra plataforma, aceptas cumplir con todas las
                políticas mencionadas anteriormente. Nos reservamos el derecho
                de actualizar estas normas en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
