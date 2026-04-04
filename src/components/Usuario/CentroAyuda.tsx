import { useNavigate } from 'react-router-dom';

export const CentroAyuda = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4 mt-md-5 pb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          
          <div className="d-flex align-items-center mb-4">
            <button 
              onClick={() => navigate(-1)} 
              className="btn btn-link text-dark p-0 me-3 fs-3" 
              style={{ textDecoration: 'none' }}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <h2 className="fw-bold m-0" style={{ color: '#2d4a2d' }}>Centro de ayuda</h2>
          </div>

          {/* Tarjeta principal */}
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 text-center">
            
            {/* Ícono decorativo opcional */}
            <i className="bi bi-headset text-success mb-3" style={{ fontSize: '4rem' }}></i>
            
            <h4 className="fw-bold text-dark mb-4">¿Tenés un problema?</h4>
            
            <hr className="text-muted opacity-25 mx-auto mb-4" style={{ width: '80%' }} />
            
            <h6 className="fw-bold text-secondary mb-4 text-uppercase" style={{ letterSpacing: '1px' }}>
              Contactanos
            </h6>

            <div className="d-grid gap-3">
              
              {/* Botón de Email */}
              <a 
                href="mailto:findYourTrip@org.ar" 
                className="btn border py-3 shadow-sm rounded-4 d-flex align-items-center justify-content-center text-dark text-decoration-none"
                style={{ 
                  backgroundColor: '#ffffff',
                  borderColor: '#dee2e6',
                  transition: 'all 0.2s ease-in-out' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f8f1';
                  e.currentTarget.style.borderColor = '#2d4a2d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#dee2e6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="bi bi-envelope-fill fs-4 me-3" style={{ color: '#2d4a2d' }}></i>
                <span className="fw-bold fs-5">findYourTrip@org.ar</span>
              </a>

              {/* Botón de Teléfono */}
              <a 
                href="tel:0800999089" 
                className="btn border py-3 shadow-sm rounded-4 d-flex align-items-center justify-content-center text-dark text-decoration-none"
                style={{ 
                  backgroundColor: '#ffffff',
                  borderColor: '#dee2e6',
                  transition: 'all 0.2s ease-in-out' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f8f1';
                  e.currentTarget.style.borderColor = '#2d4a2d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#dee2e6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="bi bi-telephone-fill fs-4 me-3" style={{ color: '#2d4a2d' }}></i>
                <span className="fw-bold fs-5">0800-999-089</span>
              </a>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};