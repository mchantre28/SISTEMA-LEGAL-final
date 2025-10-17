// Service Worker para Sistema Legal
const CACHE_NAME = 'sistema-legal-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Arquivos essenciais para cache
const CACHE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🔧 Service Worker: Cache aberto');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('✅ Service Worker: Instalado com sucesso');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Erro na instalação:', error);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔧 Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Ativado com sucesso');
      return self.clients.claim();
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // Ignorar requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar requisições de API externas
  if (event.request.url.includes('api.') || event.request.url.includes('localhost:3000')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retornar do cache se disponível
        if (response) {
          console.log('📦 Service Worker: Servindo do cache:', event.request.url);
          return response;
        }

        // Tentar buscar da rede
        return fetch(event.request)
          .then((response) => {
            // Verificar se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar a resposta para cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('💾 Service Worker: Salvando no cache:', event.request.url);
              });

            return response;
          })
          .catch(() => {
            // Se falhar, tentar servir página offline
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
            
            // Para outros recursos, retornar resposta padrão
            return new Response('Recurso não disponível offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Notificações Push
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Push recebido');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do Sistema Legal',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9IiMzYjgyZjYiLz4KPHBhdGggZD0iTTk2IDQ4QzY5LjQ5IDQ4IDQ4IDY5LjQ5IDQ4IDk2UzY5LjQ5IDE0NCA5NiAxNDRTMTQ0IDEyMi41MSAxNDQgOTZTMTIyLjUxIDQ4IDk2IDQ4Wk05NiAxMjhDNzMuOTA5IDEyOCA1NiAxMTAuMDkgNTYgODhTNzMuOTA5IDQ4IDk2IDQ4UzEzNiA2NS45MSAxMzYgODhTMTE4LjA5IDEyOCA5NiAxMjhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMTIiIGZpbGw9IiNmNTk5MGIiLz4KPHBhdGggZD0iTTQ4IDI0QzM0Ljc0IDI0IDI0IDM0Ljc0IDI0IDQ4UzM0Ljc0IDcyIDQ4IDcyUzcyIDYxLjI2IDcyIDQ4UzYxLjI2IDI0IDQ4IDI0Wk00OCA2NEM0MC4yNyA2NCAzNCA1Ny43MyAzNCA1MFM0MC4yNyAzNiA0OCAzNlM2MiA0Mi4yNyA2MiA1MFM1NS43MyA2NCA0OCA2NFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir Sistema',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDZMMTYgNEw5IDExTDIgNEw0IDZMOSAxMUw0IDE2TDYgMThMOSAxM0wxMiAxNkwxNCAxOEwxMiAxNkw5IDEzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=='
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Sistema Legal', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Notificação clicada');
  
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Apenas fechar a notificação
    return;
  } else {
    // Clique na notificação (não em ação específica)
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Sincronização em background');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Aqui você pode implementar lógica de sincronização
      // Por exemplo, enviar dados pendentes para o servidor
      syncData()
    );
  }
});

// Função de sincronização de dados
async function syncData() {
  try {
    // Verificar se há dados pendentes no localStorage
    const pendingData = localStorage.getItem('pendingSync');
    if (pendingData) {
      console.log('🔄 Service Worker: Sincronizando dados pendentes');
      // Aqui você implementaria a lógica de sincronização
      // Por exemplo, enviar para um servidor
      localStorage.removeItem('pendingSync');
    }
  } catch (error) {
    console.error('❌ Service Worker: Erro na sincronização:', error);
  }
}

// Mensagem do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('✅ Service Worker: Carregado com sucesso');