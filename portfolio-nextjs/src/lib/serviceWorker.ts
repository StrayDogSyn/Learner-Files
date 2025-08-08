'use client';

// Service Worker registration and management utilities

interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private config: ServiceWorkerConfig;

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = config;
  }

  // Check if service workers are supported
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator;
  }

  // Register service worker
  async register(swPath: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported()) {
      console.warn('Service Workers are not supported in this browser');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(swPath, {
        scope: '/'
      });

      this.registration = registration;

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available
            this.config.onUpdate?.(registration);
          }
        });
      });

      // Check for existing controller
      if (navigator.serviceWorker.controller) {
        this.config.onSuccess?.(registration);
      }

      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      const swError = error as Error;
      console.error('Service Worker registration failed:', swError);
      this.config.onError?.(swError);
      return null;
    }
  }

  // Unregister service worker
  async unregister(): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const result = await registration.unregister();
        console.log('Service Worker unregistered:', result);
        return result;
      }
      return false;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }

  // Update service worker
  async update(): Promise<void> {
    if (!this.registration) {
      console.warn('No service worker registration found');
      return;
    }

    try {
      await this.registration.update();
      console.log('Service Worker update triggered');
    } catch (error) {
      console.error('Service Worker update failed:', error);
    }
  }

  // Skip waiting and activate new service worker
  async skipWaiting(): Promise<void> {
    if (!this.registration || !this.registration.waiting) {
      console.warn('No waiting service worker found');
      return;
    }

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  // Send message to service worker
  sendMessage(message: Record<string, unknown>): void {
    if (!navigator.serviceWorker.controller) {
      console.warn('No active service worker found');
      return;
    }

    navigator.serviceWorker.controller.postMessage(message);
  }

  // Listen for messages from service worker
  onMessage(callback: (event: MessageEvent) => void): () => void {
    if (!this.isSupported()) {
      return () => {};
    }

    navigator.serviceWorker.addEventListener('message', callback);
    
    return () => {
      navigator.serviceWorker.removeEventListener('message', callback);
    };
  }

  // Get current registration
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  // Check if app is running in standalone mode (PWA)
  isStandalone(): boolean {
    return typeof window !== 'undefined' && 
           (window.matchMedia('(display-mode: standalone)').matches || 
            (window.navigator as unknown as { standalone?: boolean }).standalone === true);
  }

  // Prompt user to install PWA
  async promptInstall(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const deferredPrompt = (window as unknown as { deferredPrompt?: { prompt: () => void; userChoice: Promise<{ outcome: string }> } }).deferredPrompt;
    if (!deferredPrompt) {
      console.warn('PWA install prompt not available');
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('PWA install prompt result:', outcome);
      
      // Clear the deferredPrompt
      (window as unknown as { deferredPrompt?: unknown }).deferredPrompt = null;
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('PWA install prompt failed:', error);
      return false;
    }
  }
}

// Cache management utilities
export const cacheManager = {
  // Clear all caches
  async clearAll(): Promise<void> {
    if (typeof caches === 'undefined') return;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  },

  // Get cache size
  async getSize(): Promise<number> {
    if (typeof caches === 'undefined') return 0;

    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to calculate cache size:', error);
      return 0;
    }
  },

  // Format cache size for display
  formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
};

// Performance measurement utilities
export const performanceUtils = {
  // Measure and report to service worker
  measure(name: string, startTime: number): void {
    const endTime = performance.now();
    
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PERFORMANCE_MEASURE',
        name,
        startTime,
        endTime
      });
    }
  },

  // Start a performance measurement
  start(name: string): () => void {
    const startTime = performance.now();
    return () => this.measure(name, startTime);
  }
};

// Network status utilities
export const networkUtils = {
  // Check if online
  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },

  // Listen for network status changes
  onStatusChange(callback: (isOnline: boolean) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },

  // Get connection info
  getConnectionInfo(): { effectiveType: string; downlink: number; rtt: number; saveData: boolean } | null {
    if (typeof navigator === 'undefined') return null;
    
    const connection = (navigator as unknown as {
      connection?: { effectiveType: string; downlink: number; rtt: number; saveData: boolean };
      mozConnection?: { effectiveType: string; downlink: number; rtt: number; saveData: boolean };
      webkitConnection?: { effectiveType: string; downlink: number; rtt: number; saveData: boolean };
    }).connection || 
    (navigator as unknown as { mozConnection?: { effectiveType: string; downlink: number; rtt: number; saveData: boolean } }).mozConnection || 
    (navigator as unknown as { webkitConnection?: { effectiveType: string; downlink: number; rtt: number; saveData: boolean } }).webkitConnection;
    
    if (!connection) return null;

    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
};

// PWA utilities
export const pwaUtils = {
  // Check if app can be installed
  canInstall(): boolean {
    return typeof window !== 'undefined' && !!(window as unknown as { deferredPrompt?: unknown }).deferredPrompt;
  },

  // Setup PWA install prompt
  setupInstallPrompt(): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as unknown as { deferredPrompt?: Event }).deferredPrompt = e;
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('pwa-install-available'));
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      (window as unknown as { deferredPrompt?: unknown }).deferredPrompt = null;
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('pwa-installed'));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }
};

// Create and export default service worker manager instance
const serviceWorkerManager = new ServiceWorkerManager();

export default serviceWorkerManager;
export { ServiceWorkerManager };
export type { ServiceWorkerConfig };