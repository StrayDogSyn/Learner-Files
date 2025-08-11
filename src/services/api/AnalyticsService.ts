import { BaseAPIClient } from './BaseAPIClient';
import {
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsUser,
  AnalyticsSession,
  AnalyticsMetric,
  AnalyticsReport,
  AnalyticsError,
  APIResponse
} from './types';

/**
 * Analytics Service
 * Provides comprehensive analytics and tracking capabilities
 * Features:
 * - Event tracking
 * - User behavior analytics
 * - Performance monitoring
 * - Custom metrics
 * - Real-time reporting
 * - Data export
 * - Privacy compliance
 */
export class AnalyticsService extends BaseAPIClient {
  private analyticsConfig: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[];
  private sessionData: AnalyticsSession | null;
  private userProfile: AnalyticsUser | null;
  private flushTimer: NodeJS.Timeout | null;
  private isOnline: boolean;
  private localStorageKey: string;

  constructor(config: AnalyticsConfig) {
    super({
      baseURL: config.endpoint || 'https://analytics.api.example.com',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'X-Analytics-Version': '1.0'
      },
      timeout: config.timeout || 15000,
      retries: config.retries || 2,
      rateLimit: {
        requests: 1000,
        window: 60000 // 1 minute
      }
    });

    this.analyticsConfig = {
      batchSize: 50,
      flushInterval: 30000, // 30 seconds
      enableAutoTracking: true,
      enablePerformanceTracking: true,
      enableErrorTracking: true,
      enableUserTracking: true,
      enableOfflineSupport: true,
      privacyMode: false,
      debugMode: false,
      ...config
    };

    this.eventQueue = [];
    this.sessionData = null;
    this.userProfile = null;
    this.flushTimer = null;
    this.isOnline = navigator.onLine;
    this.localStorageKey = `analytics_${config.projectId || 'default'}`;

    this.initialize();
  }

  /**
   * Initialize analytics service
   */
  private async initialize(): Promise<void> {
    try {
      // Load persisted data
      await this.loadPersistedData();

      // Start new session
      await this.startSession();

      // Set up auto-tracking
      if (this.analyticsConfig.enableAutoTracking) {
        this.setupAutoTracking();
      }

      // Set up performance tracking
      if (this.analyticsConfig.enablePerformanceTracking) {
        this.setupPerformanceTracking();
      }

      // Set up error tracking
      if (this.analyticsConfig.enableErrorTracking) {
        this.setupErrorTracking();
      }

      // Set up periodic flushing
      this.setupPeriodicFlush();

      // Set up online/offline handling
      this.setupNetworkHandling();

      // Track initialization
      await this.track('analytics_initialized', {
        config: {
          enableAutoTracking: this.analyticsConfig.enableAutoTracking,
          enablePerformanceTracking: this.analyticsConfig.enablePerformanceTracking,
          enableErrorTracking: this.analyticsConfig.enableErrorTracking
        }
      });

    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  /**
   * Track an event
   */
  async track(
    eventName: string,
    properties?: Record<string, any>,
    options?: {
      timestamp?: number;
      userId?: string;
      sessionId?: string;
      immediate?: boolean;
    }
  ): Promise<void> {
    try {
      const event: AnalyticsEvent = {
        id: this.generateEventId(),
        name: eventName,
        properties: {
          ...this.getDefaultProperties(),
          ...properties
        },
        timestamp: options?.timestamp || Date.now(),
        userId: options?.userId || this.userProfile?.id,
        sessionId: options?.sessionId || this.sessionData?.id,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screen: {
          width: screen.width,
          height: screen.height,
          pixelRatio: window.devicePixelRatio
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

      // Apply privacy filters
      if (this.analyticsConfig.privacyMode) {
        this.applyPrivacyFilters(event);
      }

      // Add to queue
      this.eventQueue.push(event);

      // Persist to local storage
      if (this.analyticsConfig.enableOfflineSupport) {
        await this.persistData();
      }

      // Immediate flush if requested or queue is full
      if (options?.immediate || this.eventQueue.length >= this.analyticsConfig.batchSize) {
        await this.flush();
      }

      if (this.analyticsConfig.debugMode) {
        console.log('Analytics event tracked:', event);
      }

    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  /**
   * Identify a user
   */
  async identify(
    userId: string,
    traits?: Record<string, any>,
    options?: {
      timestamp?: number;
      immediate?: boolean;
    }
  ): Promise<void> {
    try {
      this.userProfile = {
        id: userId,
        traits: {
          ...this.userProfile?.traits,
          ...traits
        },
        firstSeen: this.userProfile?.firstSeen || Date.now(),
        lastSeen: Date.now()
      };

      await this.track('user_identified', {
        userId,
        traits
      }, options);

      if (this.analyticsConfig.debugMode) {
        console.log('User identified:', this.userProfile);
      }

    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  }

  /**
   * Track a page view
   */
  async page(
    name?: string,
    properties?: Record<string, any>,
    options?: {
      timestamp?: number;
      immediate?: boolean;
    }
  ): Promise<void> {
    const pageProperties = {
      name: name || document.title,
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      title: document.title,
      ...properties
    };

    await this.track('page_view', pageProperties, options);
  }

  /**
   * Start a new session
   */
  async startSession(): Promise<void> {
    this.sessionData = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: 0,
      duration: 0
    };

    await this.track('session_start', {
      sessionId: this.sessionData.id
    });
  }

  /**
   * End current session
   */
  async endSession(): Promise<void> {
    if (!this.sessionData) return;

    const duration = Date.now() - this.sessionData.startTime;
    this.sessionData.duration = duration;

    await this.track('session_end', {
      sessionId: this.sessionData.id,
      duration,
      pageViews: this.sessionData.pageViews,
      events: this.sessionData.events
    }, { immediate: true });

    this.sessionData = null;
  }

  /**
   * Track custom metric
   */
  async metric(
    name: string,
    value: number,
    unit?: string,
    tags?: Record<string, string>
  ): Promise<void> {
    const metric: AnalyticsMetric = {
      name,
      value,
      unit,
      tags,
      timestamp: Date.now()
    };

    await this.track('custom_metric', { metric });
  }

  /**
   * Track timing
   */
  async timing(
    name: string,
    duration: number,
    tags?: Record<string, string>
  ): Promise<void> {
    await this.metric(name, duration, 'ms', tags);
  }

  /**
   * Track error
   */
  async trackError(
    error: Error | string,
    context?: Record<string, any>
  ): Promise<void> {
    const errorData = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      name: typeof error === 'object' ? error.name : 'Error',
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    };

    await this.track('error_occurred', errorData, { immediate: true });
  }

  /**
   * Flush events to server
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0 || !this.isOnline) {
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await this.post('/events', {
        events,
        projectId: this.analyticsConfig.projectId,
        timestamp: Date.now()
      });

      if (this.analyticsConfig.debugMode) {
        console.log(`Flushed ${events.length} analytics events`);
      }

    } catch (error) {
      // Re-add events to queue on failure
      this.eventQueue.unshift(...events);
      
      // Limit queue size to prevent memory issues
      if (this.eventQueue.length > this.analyticsConfig.batchSize * 5) {
        this.eventQueue = this.eventQueue.slice(-this.analyticsConfig.batchSize * 3);
      }

      console.error('Failed to flush analytics events:', error);
    }
  }

  /**
   * Get analytics report
   */
  async getReport(
    type: 'events' | 'users' | 'sessions' | 'performance',
    options?: {
      startDate?: Date;
      endDate?: Date;
      filters?: Record<string, any>;
      groupBy?: string;
      metrics?: string[];
    }
  ): Promise<AnalyticsReport> {
    const response = await this.get<AnalyticsReport>('/reports', {
      params: {
        type,
        startDate: options?.startDate?.toISOString(),
        endDate: options?.endDate?.toISOString(),
        filters: JSON.stringify(options?.filters),
        groupBy: options?.groupBy,
        metrics: options?.metrics?.join(',')
      }
    });

    return response.data;
  }

  /**
   * Export data
   */
  async exportData(
    format: 'json' | 'csv' | 'xlsx',
    options?: {
      startDate?: Date;
      endDate?: Date;
      events?: string[];
      includeUserData?: boolean;
    }
  ): Promise<Blob> {
    const response = await this.get('/export', {
      params: {
        format,
        startDate: options?.startDate?.toISOString(),
        endDate: options?.endDate?.toISOString(),
        events: options?.events?.join(','),
        includeUserData: options?.includeUserData
      }
    });

    return response.data;
  }

  /**
   * Set up automatic tracking
   */
  private setupAutoTracking(): void {
    // Track page views on navigation
    let lastUrl = window.location.href;
    const checkUrlChange = () => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        this.page();
      }
    };

    // Use both popstate and a periodic check for SPA navigation
    window.addEventListener('popstate', checkUrlChange);
    setInterval(checkUrlChange, 1000);

    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      
      if (tagName === 'a' || tagName === 'button') {
        this.track('element_clicked', {
          elementType: tagName,
          elementText: target.textContent?.trim(),
          elementId: target.id,
          elementClass: target.className,
          href: tagName === 'a' ? (target as HTMLAnchorElement).href : undefined
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.track('form_submitted', {
        formId: form.id,
        formClass: form.className,
        formAction: form.action,
        formMethod: form.method
      });
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
        maxScrollDepth = scrollDepth;
        this.track('scroll_depth', { depth: scrollDepth });
      }
    };

    window.addEventListener('scroll', this.throttle(trackScrollDepth, 1000));

    // Track time on page
    let pageStartTime = Date.now();
    const trackTimeOnPage = () => {
      const timeOnPage = Date.now() - pageStartTime;
      this.track('time_on_page', { duration: timeOnPage });
      pageStartTime = Date.now();
    };

    window.addEventListener('beforeunload', trackTimeOnPage);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        trackTimeOnPage();
      } else {
        pageStartTime = Date.now();
      }
    });
  }

  /**
   * Set up performance tracking
   */
  private setupPerformanceTracking(): void {
    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          this.track('page_performance', {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint(),
            largestContentfulPaint: this.getLargestContentfulPaint()
          });
        }
      }, 0);
    });

    // Track resource performance
    const trackResourcePerformance = () => {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter(resource => resource.duration > 1000);
      
      if (slowResources.length > 0) {
        this.track('slow_resources', {
          count: slowResources.length,
          resources: slowResources.map(r => ({
            name: r.name,
            duration: r.duration,
            size: (r as PerformanceResourceTiming).transferSize
          }))
        });
      }
    };

    setTimeout(trackResourcePerformance, 5000);
  }

  /**
   * Set up error tracking
   */
  private setupErrorTracking(): void {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason, {
        type: 'unhandled_promise_rejection'
      });
    });
  }

  /**
   * Set up periodic flushing
   */
  private setupPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.analyticsConfig.flushInterval);
  }

  /**
   * Set up network handling
   */
  private setupNetworkHandling(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flush(); // Flush queued events when back online
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Utility methods
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `ses_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDefaultProperties(): Record<string, any> {
    return {
      timestamp: Date.now(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };
  }

  private applyPrivacyFilters(event: AnalyticsEvent): void {
    // Remove or hash sensitive data
    if (event.properties) {
      delete event.properties.email;
      delete event.properties.phone;
      delete event.properties.address;
    }

    // Hash IP address (would be done server-side in real implementation)
    event.userAgent = this.hashString(event.userAgent);
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private throttle(func: Function, limit: number): Function {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  private getFirstPaint(): number | undefined {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint?.startTime;
  }

  private getFirstContentfulPaint(): number | undefined {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp?.startTime;
  }

  private getLargestContentfulPaint(): Promise<number | undefined> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry?.startTime);
          observer.disconnect();
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Timeout after 10 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(undefined);
        }, 10000);
      } else {
        resolve(undefined);
      }
    });
  }

  private async persistData(): Promise<void> {
    try {
      const data = {
        eventQueue: this.eventQueue,
        sessionData: this.sessionData,
        userProfile: this.userProfile
      };
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist analytics data:', error);
    }
  }

  private async loadPersistedData(): Promise<void> {
    try {
      const data = localStorage.getItem(this.localStorageKey);
      if (data) {
        const parsed = JSON.parse(data);
        this.eventQueue = parsed.eventQueue || [];
        this.userProfile = parsed.userProfile;
        // Don't restore session data - always start fresh
      }
    } catch (error) {
      console.warn('Failed to load persisted analytics data:', error);
    }
  }

  /**
   * Public utility methods
   */
  getQueueSize(): number {
    return this.eventQueue.length;
  }

  getCurrentSession(): AnalyticsSession | null {
    return this.sessionData;
  }

  getCurrentUser(): AnalyticsUser | null {
    return this.userProfile;
  }

  clearData(): void {
    this.eventQueue = [];
    this.userProfile = null;
    localStorage.removeItem(this.localStorageKey);
  }

  async reset(): Promise<void> {
    await this.endSession();
    this.clearData();
    await this.startSession();
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
    this.endSession();
  }
}