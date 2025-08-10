// PWA Utilities for Service Worker Registration and Installation

import analytics from './analytics';

// PWA Installation Interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// PWA Manager Class
class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled: boolean = false;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private updateAvailable: boolean = false;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // Check if app is already installed
    this.checkInstallationStatus();
    
    // Register service worker
    await this.registerServiceWorker();
    
    // Set up installation prompt handling
    this.setupInstallPrompt();
    
    // Set up update handling
    this.setupUpdateHandling();
    
    // Set up app state change listeners
    this.setupAppStateListeners();
  }

  // Register Service Worker
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        this.serviceWorkerRegistration = registration;
        
        console.log('PWA: Service Worker registered successfully:', registration.scope);
        
        // Track registration
        analytics.trackEvent('pwa_service_worker_registered', {
          scope: registration.scope,
          update_via_cache: registration.updateViaCache
        });
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          this.handleServiceWorkerUpdate(registration);
        });
        
        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('PWA: New service worker activated');
          window.location.reload();
        });
        
      } catch (error) {
        console.error('PWA: Service Worker registration failed:', error);
        analytics.trackEvent('pwa_service_worker_error', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      console.warn('PWA: Service Workers not supported');
    }
  }

  // Handle Service Worker Updates
  private handleServiceWorkerUpdate(registration: ServiceWorkerRegistration): void {
    const newWorker = registration.installing;
    if (!newWorker) return;
    
    console.log('PWA: New service worker installing');
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        console.log('PWA: New service worker installed, update available');
        this.updateAvailable = true;
        this.notifyUpdateAvailable();
      }
    });
  }

  // Notify user about available update
  private notifyUpdateAvailable(): void {
    // Dispatch custom event for UI to handle
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
    
    analytics.trackEvent('pwa_update_available', {
      timestamp: Date.now()
    });
  }

  // Apply update
  public async applyUpdate(): Promise<void> {
    if (!this.serviceWorkerRegistration) return;
    
    const newWorker = this.serviceWorkerRegistration.waiting;
    if (newWorker) {
      newWorker.postMessage({ type: 'SKIP_WAITING' });
      analytics.trackEvent('pwa_update_applied', {
        timestamp: Date.now()
      });
    }
  }

  // Setup Installation Prompt
  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: Install prompt available');
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      
      // Dispatch event for UI to show install button
      window.dispatchEvent(new CustomEvent('pwa-installable'));
      
      analytics.trackEvent('pwa_install_prompt_available', {
        platforms: this.deferredPrompt.platforms
      });
    });
    
    window.addEventListener('appinstalled', () => {
      console.log('PWA: App installed successfully');
      this.isInstalled = true;
      this.deferredPrompt = null;
      
      analytics.trackEvent('pwa_installed', {
        timestamp: Date.now()
      });
    });
  }

  // Show Install Prompt
  public async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('PWA: No install prompt available');
      return false;
    }
    
    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      analytics.trackEvent('pwa_install_prompt_result', {
        outcome: choiceResult.outcome,
        platform: choiceResult.platform
      });
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA: User accepted install prompt');
        this.deferredPrompt = null;
        return true;
      } else {
        console.log('PWA: User dismissed install prompt');
        return false;
      }
    } catch (error) {
      console.error('PWA: Error showing install prompt:', error);
      return false;
    }
  }

  // Check Installation Status
  private checkInstallationStatus(): void {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('PWA: Running in standalone mode');
    }
    
    // Check for iOS Safari standalone
    if ((window.navigator as any).standalone === true) {
      this.isInstalled = true;
      console.log('PWA: Running in iOS standalone mode');
    }
    
    // Check for Android TWA
    if (document.referrer.includes('android-app://')) {
      this.isInstalled = true;
      console.log('PWA: Running in Android TWA');
    }
  }

  // Setup App State Listeners
  private setupAppStateListeners(): void {
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        analytics.trackEvent('pwa_app_resumed', {
          timestamp: Date.now()
        });
      } else {
        analytics.trackEvent('pwa_app_backgrounded', {
          timestamp: Date.now()
        });
      }
    });
    
    // Handle online/offline status
    window.addEventListener('online', () => {
      console.log('PWA: App is online');
      analytics.trackEvent('pwa_online', {
        timestamp: Date.now()
      });
    });
    
    window.addEventListener('offline', () => {
      console.log('PWA: App is offline');
      analytics.trackEvent('pwa_offline', {
        timestamp: Date.now()
      });
    });
  }

  // Cache Management
  public async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('PWA: All caches cleared');
      
      analytics.trackEvent('pwa_cache_cleared', {
        cache_count: cacheNames.length
      });
    }
  }

  // Pre-cache URLs
  public async precacheUrls(urls: string[]): Promise<void> {
    if (this.serviceWorkerRegistration && this.serviceWorkerRegistration.active) {
      this.serviceWorkerRegistration.active.postMessage({
        type: 'CACHE_URLS',
        urls
      });
      
      analytics.trackEvent('pwa_urls_precached', {
        url_count: urls.length
      });
    }
  }

  // Get Cache Usage
  public async getCacheUsage(): Promise<{ quota: number; usage: number; percentage: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const quota = estimate.quota || 0;
      const usage = estimate.usage || 0;
      const percentage = quota > 0 ? (usage / quota) * 100 : 0;
      
      return { quota, usage, percentage };
    }
    
    return { quota: 0, usage: 0, percentage: 0 };
  }

  // Push Notification Management
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      
      analytics.trackEvent('pwa_notification_permission', {
        permission
      });
      
      return permission;
    }
    
    return 'denied';
  }

  public async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.serviceWorkerRegistration) {
      console.warn('PWA: No service worker registration available');
      return null;
    }
    
    try {
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
        )
      });
      
      analytics.trackEvent('pwa_push_subscription_created', {
        endpoint: subscription.endpoint
      });
      
      return subscription;
    } catch (error) {
      console.error('PWA: Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  // Helper to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }

  // Getters
  public get isAppInstalled(): boolean {
    return