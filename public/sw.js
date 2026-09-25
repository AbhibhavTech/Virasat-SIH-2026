// Virasat Service Worker - Cache Reset & Unregister
// Clears legacy cache storage to avoid index.html and versioned JS asset hash mismatches on Netlify

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister())
  );
});
