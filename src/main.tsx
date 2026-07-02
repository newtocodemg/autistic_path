import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SaasProvider } from './lib/SaasContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SaasProvider>
      <App />
    </SaasProvider>
  </StrictMode>,
);
