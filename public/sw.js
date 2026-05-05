self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // A simple fetch handler is required for PWA installability
  event.respondWith(fetch(event.request));
});
