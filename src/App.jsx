import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
} from 'react-router-dom';
import { RootLayout } from './layout/RootLayout.tsx';
import { AdminLayout } from './layout/AdminLayout.tsx';

import PrivateRoute from './components/PrivateRoute'
import ProtectedRoute from './auth/ProtectedRoute'

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
import { RecuperarContrasena } from './components/Usuario/RecuperarContrasena.tsx';
import { MiCuenta } from './components/Usuario/MiCuentaUsuario.tsx';
import { MisViajes } from './components/Usuario/MisViajes.tsx';

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
          <Route path="recuperar-contrasena" element={<RecuperarContrasena />} />
        </Route>

        <Route element={<PrivateRoute />}>
          {/* RUTAS DEL ADMINISTRADOR (NavBar) */}
          <Route element={<AdminLayout />}>
            <Route
              path="admin-home"
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <InicioAdmin />
                </ProtectedRoute>
              }
            />

            <Route
              path="aprobar-conductores"
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <VerSolicitudesConductor />
                </ProtectedRoute>
              }
            />

            {/* Rutas de Localidad */}
            <Route
              path="crear-localidad"
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <CrearLocalidad />
                </ProtectedRoute>
              }
            />

            <Route
              path="mostrar-localidad"
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <MostrarLocalidad />
                </ProtectedRoute>
              }
            />

            <Route
              path="editar-localidad/:id"
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <EditarLocalidad />
                </ProtectedRoute>
              }
            />
          </Route>

          {/*RUTAS DEL USUARIO (Footer) */}
          <Route element={<RootLayout />}>
            <Route
              path="home"
              element={
                <ProtectedRoute allowedRoles={['pasajero','conductor','administrador']}>
                  <Inicio />
                </ProtectedRoute>
              }
            />

            <Route
              path="mi-cuenta/:id"
              element={
                <ProtectedRoute allowedRoles={['pasajero','conductor','administrador']}>
                  <MiCuenta />
                </ProtectedRoute>
              }
            />

            <Route
              path="editar-usuario/:id"
              element={
                <ProtectedRoute allowedRoles={['pasajero','conductor','administrador']}>
                  <EditarUsuario />
                </ProtectedRoute>
              }
            />

            <Route
              path="publicar-viaje"
              element={
                <ProtectedRoute allowedRoles={['conductor','administrador']}>
                  <PublicarViaje />
                </ProtectedRoute>
              }
            />

            <Route
              path="solicitar-conductor"
              element={
                <ProtectedRoute allowedRoles={['pasajero','conductor','administrador']}>
                  <SolicitarConductor />
                </ProtectedRoute>
              }
            />

            <Route
              path="buscar-viaje"
              element={
                <ProtectedRoute allowedRoles={['pasajero','conductor','administrador']}>
                  <BuscarViaje />
                </ProtectedRoute>
              }
            />

            <Route
              path="mostrar-viaje"
              element={
                <ProtectedRoute allowedRoles={['pasajero','conductor','administrador']}>
                  <MostrarViaje />
                </ProtectedRoute>
              }
            />
            <Route path="/mis-viajes" element={ <ProtectedRoute allowedRoles={['pasajero','conductor','administrador']}>
              <MisViajes />
              </ProtectedRoute>
            }
            />

            {/* Rutas de Vehiculo */}
            <Route
              path="mostrar-vehiculo/:id"
              element={
                <ProtectedRoute allowedRoles={['conductor','administrador']}>
                  <MostrarVehiculo />
                </ProtectedRoute>
              }
            />

            <Route
              path="crear-vehiculo"
              element={
                <ProtectedRoute allowedRoles={['conductor','administrador']}>
                  <CrearVehiculo />
                </ProtectedRoute>
              }
            />

            <Route
              path="editar-vehiculo/:id"
              element={
                <ProtectedRoute allowedRoles={['conductor','administrador']}>
                  <EditarVehiculo />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
}

export default App;