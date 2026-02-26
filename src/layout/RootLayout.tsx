import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../footer/Footer.tsx';

export function RootLayout() {
  const location = useLocation();

  const showFooter = location.pathname === '/home' || location.pathname === '';

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      {/*<MainNavbar />*/}
      <main style={{ minHeight: '100vh', flex: '1' }}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
