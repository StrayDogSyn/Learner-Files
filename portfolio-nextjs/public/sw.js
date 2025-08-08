// Service Worker for Portfolio Performance Optimization
// Implements caching strategies for improved performance and offline functionality

const CACHE_NAME = 'portfolio-v1';
const STATIC_CACHE = 'portfolio-static-v1';
const DYNAMIC_CACHE = 'portfolio-dynamic-v1';
const IMAGE_CACHE = 'portfolio-images-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/_next/static/css/',
  '/_next/static/js/'
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Route patterns and their cache strategies
const ROUTE_CACHE_CONFIG = [
  {
    pattern: /\/_next\/static\//,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: STATIC_CACHE,
    maxAge: 365 * 24 * 60 * 60 // 1 year
  },
  {
    pattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: IMAGE_CACHE,
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  {
    pattern: /\/api\//,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: DYNAMIC_CACHE,
    maxAge: 5 * 60 // 5 minutes
  },
  {
    pattern: /\/(about|projects|contact|case-studies)/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: DYNAMIC_CACHE,
    maxAge: 24 * 60 * 60 // 1 day
  }
];

// Utility functions
const isOnline = () => navigator.onLine;

const createResponse = (data, options = {}) => {
  const defaultOptions = {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  return new Response(
    typeof data === 'string' ? data : JSON.stringify(data),
    { ...defaultOptions, ...options }
  );
};

const isExpired = (timestamp, maxAge) => {
  return Date.now() - timestamp > maxAge * 1000;
};

// Cache management
const addToCache = async (cacheName, request, response, maxAge) => {
  try {
    const cache = await caches.open(cacheName);
    const responseToCache = response.clone();
    
    // Add timestamp for expiration checking
    const headers = new Headers(responseToCache.headers);
    headers.set('sw-cache-timestamp', Date.now().toString());
    headers.set('sw-cache-max-age', maxAge.toString());
    
    const modifiedResponse = new Response(responseToCache.body, {
      status: responseToCache.status,
      statusText: responseToCache.statusText,
      headers
    });
    
    await cache.put(request, modifiedResponse);
  } catch (error) {
    console.error('Failed to cache response:', error);
  }
};

const getFromCache = async (cacheName, request) => {
  try {
    const cache = await caches.open(cacheName);
    const response = await cache.match(request);
    
    if (!response) return null;
    
    // Check if cached response is expired
    const timestamp = response.headers.get('sw-cache-timestamp');
    const maxAge = response.headers.get('sw-cache-max-age');
    
    if (timestamp && maxAge && isExpired(parseInt(timestamp), parseInt(maxAge))) {
      await cache.delete(request);
      return null;
    }
    
    return response;
  } catch (error) {
    console.error('Failed to get from cache:', error);
    return null;
  }
};

// Cache strategies implementation
const cacheFirst = async (request, cacheName, maxAge) => {
  const cachedResponse = await getFromCache(cacheName, request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await addToCache(cacheName, request, networkResponse, maxAge);
    }
    return networkResponse;
  } catch (error) {
    console.error('Network request failed:', error);
    throw error;
  }
};

const networkFirst = async (request, cacheName, maxAge) => {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await addToCache(cacheName, request, networkResponse, maxAge);
    }
    return networkResponse;
  } catch (error) {
    console.error('Network request failed, trying cache:', error);
    const cachedResponse = await getFromCache(cacheName, request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
};

const staleWhileRevalidate = async (request, cacheName, maxAge) => {
  const cachedResponse = await getFromCache(cacheName, request);
  
  // Start network request in background
  const networkPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      await addToCache(cacheName, request, networkResponse, maxAge);
    }
    return networkResponse;
  }).catch(error => {
    console.error('Background network request failed:', error);
  });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network response if no cache
  return await networkPromise;
};

// Route matching and strategy selection
const getRouteConfig = (url) => {
  return ROUTE_CACHE_CONFIG.find(config => config.pattern.test(url));
};

const handleRequest = async (request) => {
  const url = request.url;
  const routeConfig = getRouteConfig(url);
  
  if (!routeConfig) {
    // Default to network-first for unmatched routes
    return fetch(request);
  }
  
  const { strategy, cacheName, maxAge } = routeConfig;
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName, maxAge);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName, maxAge);
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName, maxAge);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return getFromCache(cacheName, request) || createResponse('Not found in cache', { status: 404 });
    
    default:
      return fetch(request);
  }
};

// Offline fallbacks
const getOfflineFallback = (request) => {
  const url = new URL(request.url);
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    return createResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Portfolio</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
            }
            .container {
              max-width: 400px;
              padding: 2rem;
            }
            h1 { margin-bottom: 1rem; }
            p { margin-bottom: 2rem; opacity: 0.9; }
            button {
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              backdrop-filter: blur(10px);
            }
            button:hover {
              background: rgba(255,255,255,0.3);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>You're Offline</h1>
            <p>It looks like you've lost your internet connection. Some content may not be available.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // Return JSON error for API requests
  if (url.pathname.startsWith('/api/')) {
    return createResponse({
      error: 'Offline',
      message: 'This feature requires an internet connection'
    }, { status: 503 });
  }
  
  // Return placeholder for images
  if (request.destination === 'image') {
    return createResponse('', { status: 503 });
  }
  
  return createResponse('Service unavailable', { status: 503 });
};

// Event listeners
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              // Delete old caches
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE && 
                     cacheName !== IMAGE_CACHE;
            })
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    handleRequest(event.request)
      .catch(error => {
        console.error('Request failed:', error);
        return getOfflineFallback(event.request);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'contact-form') {
    event.waitUntil(
      // Handle offline form submissions
      handleOfflineFormSubmissions()
    );
  }
});

// Handle offline form submissions
const handleOfflineFormSubmissions = async () => {
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
          console.log('Offline form submission sent successfully');
        }
      } catch (error) {
        console.error('Failed to send offline form submission:', error);
      }
    }
  } catch (error) {
    console.error('Failed to handle offline form submissions:', error);
  }
};

// IndexedDB helpers (simplified)
const getPendingSubmissions = async () => {
  // Implementation would use IndexedDB to store/retrieve pending submissions
  return [];
};

const removePendingSubmission = async (id) => {
  // Implementation would remove submission from IndexedDB
  console.log('Removing pending submission:', id);
};

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_MEASURE') {
    const { name, startTime, endTime } = event.data;
    console.log(`Performance measure: ${name} took ${endTime - startTime}ms`);
  }
});

console.log('Service Worker loaded successfully');