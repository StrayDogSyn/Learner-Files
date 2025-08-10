// Service Worker for PWA Offline Capabilities

const CACHE_NAME = 'solo-portfolio-v1.0.0';
const STATIC_CACHE = 'solo-static-v1.0.0';
const DYNAMIC_CACHE = 'solo-dynamic-v1.0.0';
const IMAGE_CACHE = 'solo-images-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/index.css',
  '/assets/index.js',
  '/offline.html'
];

// Routes to cache dynamically
const DYNAMIC_ROUTES = [
  '/about',
  '/projects',
  '/services',
  '/contact',
  '/blog',
  '/interactive'
];

// Image extensions to cache
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\//,
  /\/data\//
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      }),
      
      // Pre-cache dynamic routes
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('Service Worker: Pre-caching dynamic routes');
        return cache.addAll(DYNAMIC_ROUTES);
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      // Force activation of new service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker: Activation complete');
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

// Main fetch handler with different strategies
async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Static assets - Cache First
    if (isStaticAsset(url)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Strategy 2: Images - Cache First with fallback
    if (isImage(url)) {
      return await cacheFirstWithFallback(request, IMAGE_CACHE);
    }
    
    // Strategy 3: API calls - Network First with cache fallback
    if (isApiCall(url)) {
      return await networkFirstWithCache(request, DYNAMIC_CACHE);
    }
    
    // Strategy 4: Navigation requests - Network First with offline page
    if (request.mode === 'navigate') {
      return await networkFirstWithOfflinePage(request);
    }
    
    // Strategy 5: Other resources - Stale While Revalidate
    return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('Service Worker: Fetch error:', error);
    return await handleFetchError(request);
  }
}

// Cache First strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Cache First with fallback for images
async function cacheFirstWithFallback(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return a fallback image
    return await caches.match('/images/fallback-image.svg') || 
           new Response('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#999">Image not available</text></svg>', {
             headers: { 'Content-Type': 'image/svg+xml' }
           });
  }
}

// Network First with cache fallback
async function networkFirstWithCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Network First with offline page for navigation
async function networkFirstWithOfflinePage(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try to get from cache first
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return await caches.match('/offline.html') || 
           new Response(`
             <!DOCTYPE html>
             <html>
             <head>
               <title>Offline - SOLO Portfolio</title>
               <meta name="viewport" content="width=device-width, initial-scale=1">
               <style>
                 body { 
                   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                   background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                   color: white;
                   margin: 0;
                   padding: 20px;
                   min-height: 100vh;
                   display: flex;
                   align-items: center;
                   justify-content: center;
                   text-align: center;
                 }
                 .container {
                   max-width: 400px;
                   padding: 40px;
                   background: rgba(255, 255, 255, 0.1);
                   backdrop-filter: blur(10px);
                   border-radius: 20px;
                   border: 1px solid rgba(255, 255, 255, 0.2);
                 }
                 h1 { margin-bottom: 20px; }
                 p { margin-bottom: 30px; opacity: 0.8; }
                 button {
                   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                   color: white;
                   border: none;
                   padding: 12px 24px;
                   border-radius: 8px;
                   cursor: pointer;
                   font-size: 16px;
                 }
                 button:hover { opacity: 0.9; }
               </style>
             </head>
             <body>
               <div class="container">
                 <h1>You're Offline</h1>
                 <p>It looks like you're not connected to the internet. Some features may not be available.</p>
                 <button onclick="window.location.reload()">Try Again</button>
               </div>
             </body>
             </html>
           `, {
             headers: { 'Content-Type': 'text/html' }
           });
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network response
  return await networkResponsePromise || cachedResponse;
}

// Error handler
async function handleFetchError(request) {
  // Try to get any cached version
  const cacheNames = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  // Return a generic error response
  return new Response('Network error occurred', {
    status: 408,
    statusText: 'Network Error'
  });
}

// Helper functions
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.pathname === asset) ||
         url.pathname.includes('/assets/') ||
         url.pathname.includes('/icons/') ||
         url.pathname === '/manifest.json' ||
         url.pathname === '/favicon.ico';
}

function isImage(url) {
  const extension = url.pathname.split('.').pop()?.toLowerCase();
  return IMAGE_EXTENSIONS.includes(extension || '');
}

function isApiCall(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
  
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

// Sync contact form submissions
async function syncContactForm() {
  try {
    // Get pending form submissions from IndexedDB
    const pendingSubmissions = await getPendingSubmissions();
    
    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submission.data)
        });
        
        if (response.ok) {
          await removePendingSubmission(submission.id);
          console.log('Service Worker: Contact form synced successfully');
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync contact form:', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync error:', error);
  }
}

// Sync analytics events
async function syncAnalytics() {
  try {
    // Get pending analytics events from IndexedDB
    const pendingEvents = await getPendingAnalytics();
    
    for (const event of pendingEvents) {
      try {
        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', event.name, event.parameters);
          await removePendingAnalytics(event.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync analytics:', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Analytics sync error:', error);
  }
}

// IndexedDB helpers (simplified)
async function getPendingSubmissions() {
  // Implementation would use IndexedDB to store/retrieve pending submissions
  return [];
}

async function removePendingSubmission(id) {
  // Implementation would remove from IndexedDB
}

async function getPendingAnalytics() {
  // Implementation would use IndexedDB to store/retrieve pending analytics
  return [];
}

async function removePendingAnalytics(id) {
  // Implementation would remove from IndexedDB
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from SOLO Portfolio',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('SOLO Portfolio', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/projects')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

console.log('Service Worker: Loaded successfully');