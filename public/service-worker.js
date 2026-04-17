self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('adminpro-v1').then((cache) => cache.addAll(['/', '/index.html'])));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request);
    }),
  );
});
