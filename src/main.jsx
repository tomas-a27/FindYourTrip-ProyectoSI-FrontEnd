import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// Importar estilos Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importar scripts Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
