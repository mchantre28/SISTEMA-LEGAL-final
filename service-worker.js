// Service Worker para Sistema Legal
const CACHE_NAME = 'sistema-legal-v38';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        // Adicionar URLs uma por uma para evitar erros
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.log('Erro ao adicionar ao cache:', url, err);
              return null;
            });
          })
        );
      })
      .catch(function(error) {
        console.log('Erro ao abrir cache:', error);
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
