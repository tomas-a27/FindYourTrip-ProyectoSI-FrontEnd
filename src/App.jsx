import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
} from 'react-router-dom';
import { RootLayout } from './layout/RootLayout.tsx';
import { AdminLayout } from './layout/AdminLayout.tsx';

import { Inicio } from './components/Home/Inicio.tsx';
import { PantallaInicioUsuario } from './components/Home/pantallaInicioUsuario.tsx';
import { InicioAdmin } from './components/Home/InicioAdmin.tsx';

import { CrearLocalidad } from './components/Localidad/CrearLocalidad.tsx';
import { MostrarLocalidad } from './components/Localidad/MostrarLocalidad.tsx';
import { EditarLocalidad } from './components/Localidad/EditarLocalidad.tsx';

import { MostrarVehiculo } from './components/Vehiculo/MostrarVehiculo.tsx';
import { CrearVehiculo } from './components/Vehiculo/CrearVehiculo.tsx';
import { EditarVehiculo } from './components/Vehiculo/EditarVehiculo.tsx';

import { CrearUsuario } from './components/Usuario/CrearUsuario.tsx';
import { LoginUsuario } from './components/Usuario/LoginUsuario.tsx';
import { EditarUsuario } from './components/Usuario/EditarUsuario.tsx';
import { MiCuenta } from './components/Usuario/MiCuentaUsuario.tsx';

import { PublicarViaje } from './components/Viaje/PublicarViaje.tsx';
import { SolicitarConductor } from './components/Usuario/SolicitarConductor.tsx';
import { VerSolicitudesConductor } from './components/Usuario/Admin/VerSolicitudesConductor.tsx';
import { BuscarViaje } from './components/Viaje/BuscarViaje.tsx';
import { MostrarViaje } from './components/Viaje/MostrarViaje.tsx';

const AuthLayout = () => <Outlet />;

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        {/*  RUTAS EN BLANCO (Sin Navbar, Sin Footer) */}
        <Route element={<AuthLayout />}>
          <Route index element={<PantallaInicioUsuario />} />
          <Route path="login" element={<LoginUsuario />} />
          <Route path="crear-usuario" element={<CrearUsuario />} />
        </Route>

        {/* RUTAS DEL ADMINISTRADOR (NavBar) */}
        <Route element={<AdminLayout />}>
          <Route path="admin-home" element={<InicioAdmin />} />
          <Route
            path="aprobar-conductores"
            element={<VerSolicitudesConductor />}
          />
          {/* Rutas de Localidad */}
          <Route path="crear-localidad" element={<CrearLocalidad />} />
          <Route path="mostrar-localidad" element={<MostrarLocalidad />} />
          <Route path="editar-localidad/:id" element={<EditarLocalidad />} />
        </Route>

        {/*RUTAS DEL USUARIO (Footer) */}
        <Route element={<RootLayout />}>
          <Route path="home" element={<Inicio />} />
          <Route path="mi-cuenta/:id" element={<MiCuenta />} />
          <Route path="publicar-viaje" element={<PublicarViaje />} />
          <Route path="solicitar-conductor" element={<SolicitarConductor />} />
          <Route path="buscar-viaje" element={<BuscarViaje />} />
          <Route path="mostrar-viaje" element={<MostrarViaje />} />

          {/* Rutas de Vehiculo */}
          <Route path="mostrar-vehiculo/:id" element={<MostrarVehiculo />} />
          <Route path="crear-vehiculo" element={<CrearVehiculo />} />
          <Route path="editar-vehiculo/:id" element={<EditarVehiculo />} />

          <Route path="editar-usuario/:id" element={<EditarUsuario />} />
        </Route>
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
}

export default App;
