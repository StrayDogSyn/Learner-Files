// Service Worker for SOLO Portfolio
// Implements caching strategies for offline functionality and performance

// Service Worker Type Declarations
declare const self: any & {
  skipWaiting(): Promise<void>;
  clients: any;
  registration: any;
};

interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<any>): void;
}

interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Promise<Response> | Response): void;
}

interface NotificationEvent extends ExtendableEvent {
  notification: Notification;
  action?: string;
}

interface PushEvent extends ExtendableEvent {
  data?: PushMessageData;
}

interface PushMessageData {
  text(): string;
  json(): any;
  arrayBuffer(): ArrayBuffer;
}

const CACHE_NAME = 'solo-portfolio-v1';
const STATIC_CACHE = 'solo-static-v1';
const DYNAMIC_CACHE = 'solo-dynamic-v1';
const IMAGE_CACHE = 'solo-images-v1';
const API_CACHE = 'solo-api-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/styles/design-tokens.css',
  '/src/styles/critical.css',
  '/src/styles/main.css',
  '/src/main.tsx',
  '/offline.html'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/projects',
  '/api/skills',
  '/api/contact'
];

// Cache duration settings (in milliseconds)
const CACHE_DURATION = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
  DYNAMIC: 24 * 60 * 60 * 1000,    // 1 day
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
  API: 5 * 60 * 1000               // 5 minutes
};

// Install event - cache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE && 
                cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isImage(url)) {
    event.respondWith(handleImage(request));
  } else if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handleDynamicContent(request));
  }
});

// Check if request is for static asset
function isStaticAsset(url: URL): boolean {
  return STATIC_ASSETS.some(asset => url.pathname === asset) ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.woff2') ||
         url.pathname.endsWith('.woff');
}

// Check if request is for image
function isImage(url: URL): boolean {
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i) !== null;
}

// Check if request is for API
function isAPIRequest(url: URL): boolean {
  return url.pathname.startsWith('/api/') ||
         API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint));
}

// Handle static assets - Cache First strategy
async function handleStaticAsset(request: Request): Promise<Response> {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATION.STATIC)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Static asset fetch failed:', error);
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Asset not available offline', { status: 503 });
  }
}

// Handle images - Cache First with fallback
async function handleImage(request: Request): Promise<Response> {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATION.IMAGES)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Image fetch failed:', error);
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return placeholder image for offline
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#1C1C1C"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#C0C0C0" font-family="Inter">Image Offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Handle API requests - Network First with cache fallback
async function handleAPIRequest(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: API fetch failed:', error);
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATION.API)) {
      return cachedResponse;
    }
    
    return new Response(
      JSON.stringify({ error: 'API not available offline', offline: true }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 503
      }
    );
  }
}

// Handle dynamic content - Network First
async function handleDynamicContent(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Dynamic content fetch failed:', error);
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineCache = await caches.open(STATIC_CACHE);
      const offlinePage = await offlineCache.match('/offline.html');
      return offlinePage || new Response('Page not available offline', { status: 503 });
    }
    
    return new Response('Content not available offline', { status: 503 });
  }
}

// Check if cached response is expired
function isExpired(response: Response, maxAge: number): boolean {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return true;
  
  const responseDate = new Date(dateHeader).getTime();
  const now = Date.now();
  
  return (now - responseDate) > maxAge;
}

// Background sync for failed requests
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Handle background sync
async function doBackgroundSync(): Promise<void> {
  console.log('Service Worker: Performing background sync');
  
  try {
    // Retry failed API requests
    const cache = await caches.open(API_CACHE);
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone());
        }
      } catch (error) {
        console.error('Background sync failed for:', request.url, error);
      }
    }
  } catch (error) {
    console.error('Background sync error:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event: any) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Message handling for cache updates
self.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(updateCache(event.data.urls));
  }
});

// Update specific cache entries
async function updateCache(urls: string[]): Promise<void> {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        cache.put(url, response);
      }
    } catch (error) {
      console.error('Cache update failed for:', url, error);
    }
  }
}

// Export for TypeScript
export {};