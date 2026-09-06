/**
 * URDU MASTER — High Performance Service Worker
 * Version: urdu-master-v2
 */

const CACHE_NAME = 'urdu-master-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install Event — Pre-cache critical application shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache non-fatal error:', err);
      });
    })
  );
  // Force active immediately without waiting for existing tabs to close
  self.skipWaiting();
});

// Activate Event — Clean up obsolete caches (e.g. urdu-typer-cache-v1)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting stale cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event — Safe scheme handling, Network-First HTML, and Fast Asset Caching
self.addEventListener('fetch', (event) => {
  // 1. Only process GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  let url;
  try {
    url = new URL(event.request.url);
  } catch {
    return;
  }

  // 2. Ignore non-HTTP/HTTPS schemes (e.g. chrome-extension://, moz-extension://, data:, blob:)
  // This explicitly prevents "Request scheme 'chrome-extension' is unsupported" errors.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // 3. Allow real-time API communication to pass straight through
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  const isNavigation =
    event.request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html');

  // 4. HTML / Navigation: NETWORK-FIRST STRATEGY
  // Guarantees users always get the newest index.html referencing current asset hashes.
  // Falls back to offline cached HTML only when network is unavailable.
  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const cachedRoot = await caches.match('/');
          if (cachedRoot) return cachedRoot;
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 5. Static Assets (Vite hashed bundles, fonts, icons, images): CACHE-FIRST WITH NETWORK FALLBACK
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Only cache valid standard responses
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.origin === self.location.origin ||
             url.hostname.includes('googleapis.com') ||
             url.hostname.includes('gstatic.com'))
          ) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return cachedResponse;
        });
    })
  );
});
