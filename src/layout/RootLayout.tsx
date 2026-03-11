import { Outlet } from 'react-router-dom';
import { Footer } from '../footer/Footer';

export const RootLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <main style={{ flexGrow: 1, paddingBottom: '80px' }}>
        <Outlet /> 
      </main>

      {/* Footer fijo al final */}
      <div style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}>
        <Footer />
      </div>
      
    </div>
  );
};