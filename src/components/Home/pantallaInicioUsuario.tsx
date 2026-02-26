import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function PantallaInicioUsuario() {
  useEffect(() => {
    (window.scroll({ top: 0, behavior: 'smooth' }), []);
  });

  return (
    <div className="container text-center mt-5 mb-5">
      <div className="text-center mb-4 my-4">
        <h1 className="fw-bold mb-2" style={{ fontSize: '2rem' }}>
          Find Your Trip
        </h1>
      </div>

      {/* Carrusel */}
      <div id="carouselExampleIndicators" className="carousel slide">
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
              className="carousel-img"
              alt="Imagen carrousel 1"
            />
          </div>
          <div className="carousel-item">
            <img
              src=".\src\images\imagenCarrousel2.jpg"
              className="carousel-img"
              alt="Imagen carrousel 2"
            />
          </div>
          <div className="carousel-item">
            <img
              src=".\src\images\imagenCarrousel3.jpg"
              className="carousel-img"
              alt="Imagen carrousel 3"
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

      {/* Botones y link */}
      <div
        className="d-flex flex-column align-items-center gap-3 w-100 my-4"
        style={{ maxWidth: '400px', margin: '0 auto' }}
      >
        <Link to="/login" className="btn btn-pastel-green py-4 w-100 shadow-sm">
          Iniciar sesión
        </Link>

        <Link
          to="/crear-usuario"
          className="btn btn-outline-secondary w-100 py-3 fs-6 rounded shadow-sm"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
