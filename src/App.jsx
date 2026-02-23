import './App.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';
import { RootLayout } from './layout/RootLayout.tsx';

import { CrearLocalidad } from './components/Localidad/CrearLocalidad.tsx';
import { MostrarLocalidad } from './components/Localidad/MostrarLocalidad.tsx';
import { EditarLocalidad } from './components/Localidad/EditarLocalidad.tsx';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="crear-localidad" element={<CrearLocalidad />} />
        <Route path="mostrar-localidad" element={<MostrarLocalidad />} />
        <Route path="editar-localidad/:id" element={<EditarLocalidad />} />
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
