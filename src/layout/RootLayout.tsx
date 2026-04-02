import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../footer/Footer';
import { MainNavBar } from '../navegation/MainNavBar';

export const RootLayout = () => {
  const location = useLocation();

  const noMainNav =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      {!noMainNav && <MainNavBar />}
      <main>
        <Outlet />
      </main>

      <div
        style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}
      >
        <Footer />
      </div>
    </div>
  );
};
