import './App.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';
import { RootLayout } from './layout/RootLayout.tsx';

import { CrearLocalidad } from './components/Localidad/CrearLocalidad.tsx';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="localidad" element={<CrearLocalidad />} />
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
