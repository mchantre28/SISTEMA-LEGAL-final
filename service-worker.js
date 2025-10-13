// Service Worker simplificado para Sistema Legal
const CACHE_NAME = 'sistema-legal-v39';

// Instalar Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker instalando...');
  // Pular espera e ativar imediatamente
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker ativado');
  // Limpar caches antigos
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições (simplificado)
self.addEventListener('fetch', function(event) {
  // Apenas para requisições GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Se a resposta é válida, cache ela
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function() {
        // Se falhar, tentar buscar do cache
        return caches.match(event.request);
      })
  );
});
