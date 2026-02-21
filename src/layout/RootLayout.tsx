import { Outlet, useLocation } from 'react-router-dom';

export function RootLayout() {
  const location = useLocation();
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <main style={{ minHeight: '100vh', flex: '1' }}>
        <Outlet />
      </main>
    </div>
  );
}
