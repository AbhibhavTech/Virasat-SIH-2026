import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import 'leaflet/dist/leaflet.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Smart Service Worker Registration: Production offline PWA support, clean unregister in dev
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[Virasat PWA] Service worker registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.warn('[Virasat PWA] Service worker registration failed:', err);
        });
    });
  } else {
    // In dev mode, unregister previous service workers to ensure clean HMR
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      })
      .catch(() => {
        // Ignore in sandboxed iframes
      });
  }
}

