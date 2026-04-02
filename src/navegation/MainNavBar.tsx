import { Link } from 'react-router-dom';
import logoFYT from '../images/logoFYT.png';

export function MainNavBar() {
  return (
    <nav className="navbar bg-white shadow-sm py-2 px-4">
      <Link
        to="/home"
        className="navbar-brand d-flex align-items-center gap-2 text-decoration-none"
      >
        <img
          src={logoFYT}
          alt="Logo de FindYourTrip"
          width="45"
          height="45"
          className="rounded-circle"
        />

        <span className="fs-4 fw-bold text-dark mb-0">FindYourTrip</span>
      </Link>
    </nav>
  );
}
