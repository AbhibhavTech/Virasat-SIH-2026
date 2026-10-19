// Virasat Smart PWA Service Worker (National Heritage Edition)
// Intelligent offline fallback, stale-while-revalidate for static assets, network-first for navigation

const CACHE_NAME = 'virasat-pwa-v2.1';
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
];

// Install: precache offline app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn('[PWA] Precache warning:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up outdated cache buckets
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: strategy based on request type
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Don't intercept non-GET requests or Google Auth / API calls
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (
    url.origin.includes('accounts.google.com') ||
    url.origin.includes('googleapis.com') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  // 1. Navigation (HTML pages / SPA routes): Network-first with cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          return caches.match('/');
        })
    );
    return;
  }

  // 2. Static assets (JS, CSS, images, fonts): Cache-first with stale-while-revalidate
  const isStatic =
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.woff2'));

  if (isStatic) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        const fetchPromise = fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const resClone = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
            }
            return networkRes;
          })
          .catch(() => null);

        return cachedRes || fetchPromise;
      })
    );
    return;
  }

  // Default: Network fetch with quiet fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
