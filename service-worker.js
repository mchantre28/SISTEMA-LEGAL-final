// Service Worker para Sistema Legal
const CACHE_NAME = 'sistema-legal-v38';
const urlsToCache = [
  '/',
  '/sistema-legal.html',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - retornar resposta
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
