import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Auto-recover if Vite encounters a dynamic import or chunk loading error (e.g. after a new deployment)
window.addEventListener('vite:preloadError', (event) => {
  console.warn('[UrduMaster] Preload error detected (likely new deployment). Refreshing page...', event);
  window.location.reload();
});

// Clean up any deprecated legacy cache stores
if ('caches' in window) {
  caches.keys().then((names) => {
    names.forEach((name) => {
      if (name === 'urdu-typer-cache-v1') {
        caches.delete(name);
      }
    });
  }).catch(() => {});
}

// Register PWA Service Worker for native installation & offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        // Proactively check for updates immediately
        registration.update().catch(() => {});

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[UrduMaster] New application version installed.');
              }
            });
          }
        });
      },
      (err) => {
        console.warn('[UrduMaster] PWA ServiceWorker registration error:', err);
      }
    );
  });

  // Reload page smoothly when new SW takes control to ensure fresh code
  let isRefreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!isRefreshing) {
      isRefreshing = true;
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
