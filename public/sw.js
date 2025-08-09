/**
 * Performance Optimizer Service Worker
 * Handles caching and optimization for better performance
 */

const CACHE_NAME = 'performance-optimizer-v1';
const CACHE_VERSION = '1.0.0';

// Resources to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/css/performance.css',
  '/js/performance.js',
  '/manifest.json'
];

// Resources to cache with different strategies
const CACHE_STRATEGIES = {
  // Cache first (for static assets)
  'cache-first': [
    /\.(css|js|woff|woff2|ttf|eot)$/,
    /\/fonts\//,
    /\/images\/icons\//
  ],
  
  // Network first (for API calls)
  'network-first': [
    /\/api\//,
    /\/analytics\//
  ],
  
  // Stale while revalidate (for images)
  'stale-while-revalidate': [
    /\.(jpg|jpeg|png|gif|webp|avif|svg)$/,
    /\/images\//
  ]
};

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static resources...');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Static resources cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Determine caching strategy
  const strategy = getCachingStrategy(request.url);
  
  switch (strategy) {
    case 'cache-first':
      event.respondWith(cacheFirst(request));
      break;
      
    case 'network-first':
      event.respondWith(networkFirst(request));
      break;
      
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidate(request));
      break;
      
    default:
      event.respondWith(networkFirst(request));
  }
});

// Cache first strategy - good for static assets
async function cacheFirst(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Network error', { status: 408 });
  }
}

// Network first strategy - good for API calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Network error and no cache available', { status: 408 });
  }
}

// Stale while revalidate strategy - good for images
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Always try to fetch from network in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we might have cache
    return null;
  });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network response if no cache
  return fetchPromise || new Response('No cache and network failed', { status: 408 });
}

// Determine caching strategy based on URL patterns
function getCachingStrategy(url) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    for (const pattern of patterns) {
      if (pattern.test(url)) {
        return strategy;
      }
    }
  }
  return 'network-first'; // Default strategy
}

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'performance-analytics') {
    event.waitUntil(syncPerformanceData());
  }
});

// Sync performance data when online
async function syncPerformanceData() {
  try {
    // Get stored performance data
    const performanceData = await getStoredPerformanceData();
    
    if (performanceData.length > 0) {
      // Send to analytics endpoint
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(performanceData)
      });
      
      // Clear stored data after successful sync
      await clearStoredPerformanceData();
      console.log('Performance data synced successfully');
    }
  } catch (error) {
    console.error('Failed to sync performance data:', error);
  }
}

// Get stored performance data from IndexedDB
async function getStoredPerformanceData() {
  return new Promise((resolve) => {
    // Simplified - in real implementation use IndexedDB
    const data = JSON.parse(localStorage.getItem('pendingPerformanceData') || '[]');
    resolve(data);
  });
}

// Clear stored performance data
async function clearStoredPerformanceData() {
  localStorage.removeItem('pendingPerformanceData');
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'CACHE_PERFORMANCE_DATA':
      cachePerformanceData(data);
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('All caches cleared');
}

// Cache performance data for later sync
async function cachePerformanceData(data) {
  try {
    const existingData = await getStoredPerformanceData();
    const newData = [...existingData, data];
    localStorage.setItem('pendingPerformanceData', JSON.stringify(newData));
    
    // Try to sync immediately if online
    if (navigator.onLine) {
      await syncPerformanceData();
    }
  } catch (error) {
    console.error('Failed to cache performance data:', error);
  }
}

// Push notification for performance alerts
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    if (data.type === 'performance-alert') {
      const options = {
        body: `Performance issue detected: ${data.metric} is ${data.status}`,
        icon: '/icons/performance-alert.png',
        badge: '/icons/badge.png',
        tag: 'performance-alert',
        data: data,
        actions: [
          {
            action: 'view',
            title: 'View Details'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      };
      
      event.waitUntil(
        self.registration.showNotification('Performance Alert', options)
      );
    }
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    // Open performance dashboard
    event.waitUntil(
      clients.openWindow('/performance-dashboard')
    );
  }
});

// Periodic background sync for performance monitoring
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'performance-check') {
    event.waitUntil(performPerformanceCheck());
  }
});

// Perform background performance check
async function performPerformanceCheck() {
  try {
    // Check if any performance metrics are degrading
    const response = await fetch('/api/performance/check');
    const data = await response.json();
    
    if (data.alerts && data.alerts.length > 0) {
      // Send push notification for critical issues
      data.alerts.forEach(alert => {
        if (alert.severity === 'critical') {
          self.registration.showNotification('Critical Performance Issue', {
            body: alert.message,
            tag: 'critical-performance'
          });
        }
      });
    }
  } catch (error) {
    console.error('Performance check failed:', error);
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

console.log('Performance Optimizer Service Worker loaded');
