// StrayDog Syndications PWA Service Worker
// Provides offline functionality and caching for the portfolio

const CACHE_NAME = 'straydog-portfolio-v1.0.0';
const STATIC_CACHE = 'straydog-static-v1';
const DYNAMIC_CACHE = 'straydog-dynamic-v1';

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/logos/stray-gear.png',
  '/css/straydog-glassmorphic.css',
  '/css/modern.css',
  '/css/styles.css',
  // Core application files
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/pages/Home.tsx',
  '/src/pages/Projects.tsx',
  '/src/pages/Portfolio.tsx',
  '/src/pages/Bio.tsx',
  '/src/pages/Contact.tsx'
];

// Dynamic assets that should be cached when accessed
const DYNAMIC_ASSETS = [
  '/src/pages/Dashboard.tsx',
  '/src/pages/Archive.tsx',
  '/src/components/AIChat.tsx',
  '/src/components/Performance.tsx'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (CDN, APIs, etc.)
  if (!url.origin.includes(self.location.origin) && !url.origin.includes('github.io')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Otherwise, fetch from network and cache dynamic content
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if not a successful response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response for caching
            const responseToCache = networkResponse.clone();
            
            // Cache dynamic assets
            if (DYNAMIC_ASSETS.some(asset => request.url.includes(asset))) {
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  console.log('[SW] Caching dynamic asset:', request.url);
                  cache.put(request, responseToCache);
                });
            }
            
            return networkResponse;
          })
          .catch(() => {
            // If network fails, try to serve a fallback page
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // For other assets, return a simple offline message
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'portfolio-sync') {
    event.waitUntil(
      // Perform any background sync operations here
      console.log('[SW] Performing portfolio sync...')
    );
  }
});

// Push notification handling (for future use)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/assets/logos/stray-gear.png',
    badge: '/assets/logos/stray-gear.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View Portfolio',
        icon: '/assets/logos/stray-gear.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('StrayDog Syndications', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('[SW] Service worker script loaded successfully');