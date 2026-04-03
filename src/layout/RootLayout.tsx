import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../footer/Footer';
import { MainNavBar } from '../navegation/MainNavBar';

export const RootLayout = () => {
  const location = useLocation();

  const noMainNav =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height:
          '100dvh' /* 100dvh toma el alto real de la pantalla en móviles */,
      }}
    >
      {!noMainNav && <MainNavBar />}

      {/* El main toma todo el espacio restante (flex: 1) y tiene scroll propio */}
      <main
        className="pt-3 pb-4"
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </main>

      {/* El footer ya no necesita 'fixed', se queda siempre al final del flexbox */}
      <div style={{ flexShrink: 0, zIndex: 1000 }}>
        <Footer />
      </div>
    </div>
  );
};
