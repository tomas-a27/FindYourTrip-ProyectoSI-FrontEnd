import './App.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';
import { RootLayout } from './layout/RootLayout.tsx';

import { Inicio } from './components/Home/Inicio.tsx';

import { CrearLocalidad } from './components/Localidad/CrearLocalidad.tsx';
import { MostrarLocalidad } from './components/Localidad/MostrarLocalidad.tsx';
import { EditarLocalidad } from './components/Localidad/EditarLocalidad.tsx';

import { CrearUsuario } from './components/Usuario/CrearUsuario.tsx';
import { LoginUsuario } from './components/Usuario/LoginUsuario.tsx';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>

        <Route index element={<LoginUsuario />} />

        <Route path="home" element={<Inicio />} />
        {/* Rutas de Localidad */}
        <Route path="crear-localidad" element={<CrearLocalidad />} />
        <Route path="mostrar-localidad" element={<MostrarLocalidad />} />
        <Route path="editar-localidad/:id" element={<EditarLocalidad />} />
        
        {/* Rutas de Usuario */}
        <Route path="crear-usuario" element={<CrearUsuario />} />
        <Route path="login" element={<LoginUsuario />} />
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