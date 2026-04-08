import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logoFYT.png';

export function PantallaInicioUsuario() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className="container mt-5 d-flex justify-content-center align-items-center"
      style={{ minHeight: '75vh' }}
    >
      <div
        className="card custom-card shadow-lg border-0"
        style={{ width: '100%', maxWidth: '420px', borderRadius: '15px' }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="Find Your Trip Logo"
              className="mb-3 shadow-sm"
              style={{
                width: '90px',
                height: '90px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '3px solid #2d4a2d',
              }}
            />
            <h2 className="fw-bold mb-1" style={{ color: '#2d4a2d' }}>
              Find Your Trip
            </h2>
            <p className="text-muted fw-semibold fs-5 mt-2">¡Bienvenido!</p>
          </div>

          {/* Carrusel */}
          <div
            id="carouselExampleIndicators"
            className="carousel slide mb-4 shadow-sm"
            style={{ borderRadius: '10px', overflow: 'hidden' }}
          >
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src=".\src\images\imagenCarrousel1.jpg"
                  className="d-block w-100"
                  alt="Imagen carrousel 1"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
              </div>
              <div className="carousel-item">
                <img
                  src=".\src\images\imagenCarrousel2.jpg"
                  className="d-block w-100"
                  alt="Imagen carrousel 2"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
              </div>
              <div className="carousel-item">
                <img
                  src=".\src\images\imagenCarrousel3.jpg"
                  className="d-block w-100"
                  alt="Imagen carrousel 3"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          <div className="d-grid gap-3 mt-2">
            <Link
              to="/login"
              className="btn btn-pastel-green py-3 fw-semibold fs-3 shadow-sm"
            >
              Iniciar sesión
            </Link>

            <Link
              to="/crear-usuario"
              className="btn btn-outline-secondary py-2 fw-semibold fs-5 shadow-sm"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
