/**
 * Advanced Service Worker for SOLO Multi-Platform Portfolio Ecosystem
 * Provides offline functionality, caching, background sync, push notifications,
 * and cross-platform data synchronization
 */

const CACHE_VERSION = '2.0.0';
const CACHE_NAME = `solo-portfolio-v${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `solo-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `solo-dynamic-v${CACHE_VERSION}`;
const API_CACHE_NAME = `solo-api-v${CACHE_VERSION}`;
const SYNC_CACHE_NAME = `solo-sync-v${CACHE_VERSION}`;

// Background sync tags
const SYNC_TAGS = {
  PORTFOLIO_UPDATE: 'portfolio-update',
  ANALYTICS_SYNC: 'analytics-sync',
  USER_PREFERENCES: 'user-preferences',
  ACHIEVEMENT_SYNC: 'achievement-sync'
};

// Push notification types
const NOTIFICATION_TYPES = {
  PORTFOLIO_UPDATE: 'portfolio-update',
  NEW_PROJECT: 'new-project',
  ACHIEVEMENT_UNLOCKED: 'achievement-unlocked',
  SYSTEM_UPDATE: 'system-update'
};

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // Core CSS and JS will be added by Vite build
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/portfolio',
  '/api/blog',
  '/api/projects'
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
    pattern: /\.(js|css|woff2?|ttf|eot)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: STATIC_CACHE_NAME,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 100
  },
  {
    pattern: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: 'solo-images-v1.0.0',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 200
  },
  {
    pattern: /\/api\//,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: API_CACHE_NAME,
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 50
  },
  {
    pattern: /\/(portfolio|blog|contact|games)/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: DYNAMIC_CACHE_NAME,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    maxEntries: 30
  }
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return ![
                CACHE_NAME,
                STATIC_CACHE_NAME,
                DYNAMIC_CACHE_NAME,
                API_CACHE_NAME,
                'solo-images-v1.0.0'
              ].includes(cacheName);
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - handle requests with appropriate cache strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Find matching route configuration
  const routeConfig = ROUTE_CACHE_CONFIG.find(config => 
    config.pattern.test(url.pathname + url.search)
  );
  
  if (routeConfig) {
    event.respondWith(handleRequest(request, routeConfig));
  } else {
    // Default strategy for unmatched routes
    event.respondWith(
      handleRequest(request, {
        strategy: CACHE_STRATEGIES.NETWORK_FIRST,
        cacheName: DYNAMIC_CACHE_NAME,
        maxAge: 24 * 60 * 60 * 1000,
        maxEntries: 50
      })
    );
  }
});

// Handle requests based on cache strategy
async function handleRequest(request, config) {
  const { strategy, cacheName, maxAge, maxEntries } = config;
  
  try {
    switch (strategy) {
      case CACHE_STRATEGIES.CACHE_FIRST:
        return await cacheFirst(request, cacheName, maxAge, maxEntries);
      
      case CACHE_STRATEGIES.NETWORK_FIRST:
        return await networkFirst(request, cacheName, maxAge, maxEntries);
      
      case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
        return await staleWhileRevalidate(request, cacheName, maxAge, maxEntries);
      
      case CACHE_STRATEGIES.NETWORK_ONLY:
        return await fetch(request);
      
      case CACHE_STRATEGIES.CACHE_ONLY:
        return await cacheOnly(request, cacheName);
      
      default:
        return await networkFirst(request, cacheName, maxAge, maxEntries);
    }
  } catch (error) {
    console.error('[SW] Request failed:', error);
    return await handleOffline(request);
  }
}

// Cache-first strategy
async function cacheFirst(request, cacheName, maxAge, maxEntries) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await putInCache(cache, request, networkResponse.clone(), maxEntries);
    }
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Network-first strategy
async function networkFirst(request, cacheName, maxAge, maxEntries) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await putInCache(cache, request, networkResponse.clone(), maxEntries);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName, maxAge, maxEntries) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Start network request in background
  const networkPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      await putInCache(cache, request, networkResponse.clone(), maxEntries);
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached response immediately if available and not expired
  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    // Update cache in background
    networkPromise;
    return cachedResponse;
  }
  
  // Wait for network response if no valid cache
  return await networkPromise || cachedResponse || handleOffline(request);
}

// Cache-only strategy
async function cacheOnly(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  throw new Error('No cached response available');
}

// Put response in cache with size limit
async function putInCache(cache, request, response, maxEntries) {
  if (!response.ok) {
    return;
  }
  
  // Add timestamp for expiration checking
  const responseWithTimestamp = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...response.headers,
      'sw-cache-timestamp': Date.now().toString()
    }
  });
  
  await cache.put(request, responseWithTimestamp);
  
  // Enforce cache size limit
  if (maxEntries) {
    await limitCacheSize(cache, maxEntries);
  }
}

// Check if cached response is expired
function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const timestamp = response.headers.get('sw-cache-timestamp');
  if (!timestamp) return false;
  
  return Date.now() - parseInt(timestamp) > maxAge;
}

// Limit cache size by removing oldest entries
async function limitCacheSize(cache, maxEntries) {
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    const entriesToDelete = keys.length - maxEntries;
    const keysToDelete = keys.slice(0, entriesToDelete);
    
    await Promise.all(
      keysToDelete.map(key => cache.delete(key))
    );
  }
}

// Handle offline scenarios
async function handleOffline(request) {
  const url = new URL(request.url);
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const offlinePage = await cache.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
  }
  
  // Return a basic offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'This content is not available offline',
      timestamp: new Date().toISOString()
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

// Enhanced background sync for multi-platform ecosystem
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case SYNC_TAGS.PORTFOLIO_UPDATE:
      event.waitUntil(syncPortfolioData());
      break;
    case SYNC_TAGS.ANALYTICS_SYNC:
      event.waitUntil(syncAnalyticsData());
      break;
    case SYNC_TAGS.USER_PREFERENCES:
      event.waitUntil(syncUserPreferences());
      break;
    case SYNC_TAGS.ACHIEVEMENT_SYNC:
      event.waitUntil(syncAchievements());
      break;
    case 'background-sync':
      event.waitUntil(doBackgroundSync());
      break;
    default:
      console.log('[SW] Unknown sync tag:', event.tag);
  }
});

// Handle background sync
async function doBackgroundSync() {
  try {
    // Retry failed API requests
    const failedRequests = await getFailedRequests();
    
    for (const request of failedRequests) {
      try {
        await fetch(request);
        await removeFailedRequest(request);
      } catch (error) {
        console.log('[SW] Background sync failed for:', request.url);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync error:', error);
  }
}

// Sync portfolio data across platforms
async function syncPortfolioData() {
  try {
    console.log('[SW] Syncing portfolio data...');
    const response = await fetch('/api/portfolio/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: Date.now() })
    });
    
    if (response.ok) {
      const data = await response.json();
      await broadcastToClients({ type: 'PORTFOLIO_SYNCED', data });
    }
  } catch (error) {
    console.error('[SW] Portfolio sync failed:', error);
  }
}

// Sync analytics data
async function syncAnalyticsData() {
  try {
    console.log('[SW] Syncing analytics data...');
    const pendingAnalytics = await getPendingAnalytics();
    
    if (pendingAnalytics.length > 0) {
      const response = await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: pendingAnalytics })
      });
      
      if (response.ok) {
        await clearPendingAnalytics();
      }
    }
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error);
  }
}

// Sync user preferences
async function syncUserPreferences() {
  try {
    console.log('[SW] Syncing user preferences...');
    const preferences = await getUserPreferences();
    
    const response = await fetch('/api/user/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });
    
    if (response.ok) {
      await broadcastToClients({ type: 'PREFERENCES_SYNCED' });
    }
  } catch (error) {
    console.error('[SW] Preferences sync failed:', error);
  }
}

// Sync achievements
async function syncAchievements() {
  try {
    console.log('[SW] Syncing achievements...');
    const achievements = await getPendingAchievements();
    
    if (achievements.length > 0) {
      const response = await fetch('/api/achievements/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievements })
      });
      
      if (response.ok) {
        await clearPendingAchievements();
        await broadcastToClients({ type: 'ACHIEVEMENTS_SYNCED' });
      }
    }
  } catch (error) {
    console.error('[SW] Achievements sync failed:', error);
  }
}

// Store failed requests for background sync
async function storeFailedRequest(request) {
  // Implementation would store failed requests in IndexedDB
  console.log('[SW] Storing failed request for background sync:', request.url);
}

// Get failed requests from storage
async function getFailedRequests() {
  // Implementation would retrieve failed requests from IndexedDB
  return [];
}

// Remove failed request from storage
async function removeFailedRequest(request) {
  // Implementation would remove request from IndexedDB
  console.log('[SW] Removing failed request from storage:', request.url);
}

// Enhanced push notification handling for multi-platform ecosystem
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    type: NOTIFICATION_TYPES.SYSTEM_UPDATE,
    title: 'SOLO Portfolio',
    body: 'New content available',
    url: '/'
  };
  
  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() };
    } catch (error) {
      console.error('[SW] Failed to parse notification data:', error);
    }
  }
  
  const options = createNotificationOptions(notificationData);
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Create notification options based on type
function createNotificationOptions(data) {
  const baseOptions = {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      url: data.url || '/',
      type: data.type
    },
    requireInteraction: false,
    silent: false
  };
  
  switch (data.type) {
    case NOTIFICATION_TYPES.NEW_PROJECT:
      return {
        ...baseOptions,
        body: data.body || 'Check out my latest project!',
        icon: '/icons/notification-project.png',
        actions: [
          { action: 'view-project', title: 'View Project', icon: '/icons/action-view.png' },
          { action: 'dismiss', title: 'Dismiss', icon: '/icons/action-close.png' }
        ]
      };
      
    case NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED:
      return {
        ...baseOptions,
        body: data.body || 'New achievement unlocked!',
        icon: '/icons/notification-achievement.png',
        vibrate: [200, 100, 200],
        actions: [
          { action: 'view-achievements', title: 'View Achievements', icon: '/icons/action-trophy.png' },
          { action: 'share', title: 'Share', icon: '/icons/action-share.png' }
        ]
      };
      
    case NOTIFICATION_TYPES.PORTFOLIO_UPDATE:
      return {
        ...baseOptions,
        body: data.body || 'Portfolio has been updated with new content',
        actions: [
          { action: 'explore', title: 'Explore', icon: '/icons/action-explore.png' },
          { action: 'dismiss', title: 'Later', icon: '/icons/action-close.png' }
        ]
      };
      
    default:
      return {
        ...baseOptions,
        body: data.body || 'New content available on SOLO Portfolio',
        actions: [
          { action: 'open', title: 'Open', icon: '/icons/action-open.png' },
          { action: 'dismiss', title: 'Dismiss', icon: '/icons/action-close.png' }
        ]
      };
  }
}

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  const data = event.notification.data;
  let targetUrl = data.url || '/';
  
  switch (event.action) {
    case 'view-project':
      targetUrl = data.projectUrl || '/portfolio';
      break;
    case 'view-achievements':
      targetUrl = '/games/achievements';
      break;
    case 'explore':
      targetUrl = '/';
      break;
    case 'share':
      event.waitUntil(handleNotificationShare(data));
      return;
    case 'dismiss':
      return;
    default:
      targetUrl = data.url || '/';
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Try to focus existing window
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if no existing window found
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle notification sharing
async function handleNotificationShare(data) {
  try {
    const shareData = {
      title: 'SOLO Portfolio Achievement',
      text: data.shareText || 'Check out this achievement!',
      url: data.url || '/'
    };
    
    // Broadcast to clients for sharing
    await broadcastToClients({ type: 'SHARE_REQUEST', data: shareData });
  } catch (error) {
    console.error('[SW] Share handling failed:', error);
  }
}

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Helper functions for data management
async function getPendingAnalytics() {
  // In a real implementation, this would use IndexedDB
  try {
    const cache = await caches.open(SYNC_CACHE_NAME);
    const response = await cache.match('/pending-analytics');
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('[SW] Failed to get pending analytics:', error);
  }
  return [];
}

async function clearPendingAnalytics() {
  try {
    const cache = await caches.open(SYNC_CACHE_NAME);
    await cache.delete('/pending-analytics');
  } catch (error) {
    console.error('[SW] Failed to clear pending analytics:', error);
  }
}

async function getUserPreferences() {
  try {
    const cache = await caches.open(SYNC_CACHE_NAME);
    const response = await cache.match('/user-preferences');
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('[SW] Failed to get user preferences:', error);
  }
  return {};
}

async function getPendingAchievements() {
  try {
    const cache = await caches.open(SYNC_CACHE_NAME);
    const response = await cache.match('/pending-achievements');
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('[SW] Failed to get pending achievements:', error);
  }
  return [];
}

async function clearPendingAchievements() {
  try {
    const cache = await caches.open(SYNC_CACHE_NAME);
    await cache.delete('/pending-achievements');
  } catch (error) {
    console.error('[SW] Failed to clear pending achievements:', error);
  }
}

// Broadcast messages to all clients
async function broadcastToClients(message) {
  try {
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    clients.forEach(client => {
      client.postMessage(message);
    });
  } catch (error) {
    console.error('[SW] Failed to broadcast to clients:', error);
  }
}

// Store data for offline sync
async function storeForSync(key, data) {
  try {
    const cache = await caches.open(SYNC_CACHE_NAME);
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(key, response);
  } catch (error) {
    console.error('[SW] Failed to store sync data:', error);
  }
}

// Cross-platform data synchronization
async function initCrossPlatformSync() {
  try {
    // Register for background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      
      // Register sync events
      await registration.sync.register(SYNC_TAGS.PORTFOLIO_UPDATE);
      await registration.sync.register(SYNC_TAGS.ANALYTICS_SYNC);
      await registration.sync.register(SYNC_TAGS.USER_PREFERENCES);
      await registration.sync.register(SYNC_TAGS.ACHIEVEMENT_SYNC);
    }
  } catch (error) {
    console.error('[SW] Failed to initialize cross-platform sync:', error);
  }
}

// Platform detection and optimization
function getPlatformInfo() {
  const userAgent = navigator.userAgent || '';
  const platform = {
    isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
    isDesktop: !(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)),
    isElectron: userAgent.includes('Electron'),
    isPWA: window.matchMedia('(display-mode: standalone)').matches,
    supportsNotifications: 'Notification' in window,
    supportsBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype
  };
  
  return platform;
}

console.log('[SW] Advanced multi-platform service worker loaded successfully');
console.log('[SW] Cache version:', CACHE_VERSION);
console.log('[SW] Sync tags:', Object.values(SYNC_TAGS));
console.log('[SW] Notification types:', Object.values(NOTIFICATION_TYPES));