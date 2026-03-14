import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet, // Agregamos Outlet
} from 'react-router-dom';
import { RootLayout } from './layout/RootLayout.tsx';

import { Inicio } from './components/Home/Inicio.tsx';
import { PantallaInicioUsuario } from './components/Home/pantallaInicioUsuario.tsx';
import { InicioAdmin } from './components/Home/InicioAdmin.tsx';

import { CrearLocalidad } from './components/Localidad/CrearLocalidad.tsx';
import { MostrarLocalidad } from './components/Localidad/MostrarLocalidad.tsx';
import { EditarLocalidad } from './components/Localidad/EditarLocalidad.tsx';

import { CrearUsuario } from './components/Usuario/CrearUsuario.tsx';
import { LoginUsuario } from './components/Usuario/LoginUsuario.tsx';
import { EditarUsuario } from './components/Usuario/EditarUsuario.tsx';

// import { BuscarViaje } from './components/Viaje/BuscarViaje.tsx';
import { PublicarViaje } from './components/Viaje/PublicarViaje.tsx';

// Importamos el componente nuevo que te pasé en el mensaje anterior
import { SolicitarConductor } from './components/Usuario/SolicitarConductor.tsx';
import { VerSolicitudesConductor } from './components/Usuario/VerSolicitudesConductor.tsx';
import { AprobarConductor } from './components/Usuario/AprobarConductor.tsx';

// Creamos un Layout "invisible" para las pantallas que NO llevan Footer
const AuthLayout = () => <Outlet />;

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        
        
        <Route element={<AuthLayout />}>
          <Route index element={<PantallaInicioUsuario />} />
          <Route path="login" element={<LoginUsuario />} />
          <Route path="crear-usuario" element={<CrearUsuario />} />
          <Route path="admin-home" element={<InicioAdmin />} />

        </Route>

        
        <Route element={<RootLayout />}>
          <Route path="home" element={<Inicio />} />
          
          {/* Rutas de Viaje y Conductor */}
          <Route path="publicar-viaje" element={<PublicarViaje />} />
          <Route path="solicitar-conductor" element={<SolicitarConductor />} />

          {/* Rutas de Localidad */}
          <Route path="crear-localidad" element={<CrearLocalidad />} />
          <Route path="mostrar-localidad" element={<MostrarLocalidad />} />
          <Route path="editar-localidad/:id" element={<EditarLocalidad />} />

          {/* Rutas de Perfil */}
          <Route path="editar-usuario/:id" element={<EditarUsuario />} />

          {/* Rutas del admin */}
          <Route path="aprobar-conductores" element={<VerSolicitudesConductor />} />
          <Route path="aprobar-conductor/:id" element={<AprobarConductor />} />
        </Route>
      </Route>,
    ),
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;