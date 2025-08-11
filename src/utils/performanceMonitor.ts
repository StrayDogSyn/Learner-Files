/**
 * Advanced Performance Monitoring Utility
 * Tracks bundle sizes, loading times, Core Web Vitals, and provides detailed analytics
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface PerformanceMetrics {
  // Core Web Vitals
  cls?: number;
  fid?: number;
  fcp?: number;
  lcp?: number;
  ttfb?: number;
  
  // Custom metrics
  bundleSize?: number;
  chunkLoadTimes?: Record<string, number>;
  componentRenderTimes?: Record<string, number>;
  apiResponseTimes?: Record<string, number>;
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };
  
  // User experience metrics
  timeToInteractive?: number;
  firstInputDelay?: number;
  totalBlockingTime?: number;
}

interface PerformanceConfig {
  enableWebVitals: boolean;
  enableBundleAnalysis: boolean;
  enableMemoryTracking: boolean;
  enableAPITracking: boolean;
  reportingEndpoint?: string;
  sampleRate: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private config: PerformanceConfig;
  private observers: Map<string, PerformanceObserver> = new Map();
  private startTimes: Map<string, number> = new Map();
  
  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableWebVitals: true,
      enableBundleAnalysis: true,
      enableMemoryTracking: true,
      enableAPITracking: true,
      sampleRate: 1.0,
      ...config
    };
    
    this.init();
  }
  
  private init() {
    if (typeof window === 'undefined') return;
    
    // Initialize Core Web Vitals tracking
    if (this.config.enableWebVitals) {
      this.initWebVitals();
    }
    
    // Initialize bundle analysis
    if (this.config.enableBundleAnalysis) {
      this.initBundleAnalysis();
    }
    
    // Initialize memory tracking
    if (this.config.enableMemoryTracking) {
      this.initMemoryTracking();
    }
    
    // Initialize performance observers
    this.initPerformanceObservers();
    
    // Track page load completion
    if (document.readyState === 'complete') {
      this.onPageLoadComplete();
    } else {
      window.addEventListener('load', () => this.onPageLoadComplete());
    }
  }
  
  private initWebVitals() {
    getCLS((metric) => {
      this.metrics.cls = metric.value;
      this.reportMetric('CLS', metric.value);
    });
    
    getFID((metric) => {
      this.metrics.fid = metric.value;
      this.reportMetric('FID', metric.value);
    });
    
    getFCP((metric) => {
      this.metrics.fcp = metric.value;
      this.reportMetric('FCP', metric.value);
    });
    
    getLCP((metric) => {
      this.metrics.lcp = metric.value;
      this.reportMetric('LCP', metric.value);
    });
    
    getTTFB((metric) => {
      this.metrics.ttfb = metric.value;
      this.reportMetric('TTFB', metric.value);
    });
  }
  
  private initBundleAnalysis() {
    // Track resource loading times
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          const name = this.getResourceName(resourceEntry.name);
          
          if (name.includes('.js') || name.includes('.css')) {
            if (!this.metrics.chunkLoadTimes) {
              this.metrics.chunkLoadTimes = {};
            }
            this.metrics.chunkLoadTimes[name] = resourceEntry.duration;
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
    this.observers.set('resource', observer);
  }
  
  private initMemoryTracking() {
    if ('memory' in performance) {
      const updateMemoryMetrics = () => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        };
      };
      
      updateMemoryMetrics();
      setInterval(updateMemoryMetrics, 5000); // Update every 5 seconds
    }
  }
  
  private initPerformanceObservers() {
    // Track long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`, entry);
          }
        }
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', longTaskObserver);
      } catch (e) {
        // Long task API not supported
      }
    }
  }
  
  private onPageLoadComplete() {
    // Calculate Time to Interactive (TTI)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.metrics.timeToInteractive = navigationEntry.domInteractive - navigationEntry.navigationStart;
    }
    
    // Report initial metrics
    this.reportMetrics();
  }
  
  private getResourceName(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split('/').pop() || url;
    } catch {
      return url;
    }
  }
  
  // Public API methods
  
  /**
   * Start timing a custom operation
   */
  startTiming(name: string) {
    this.startTimes.set(name, performance.now());
  }
  
  /**
   * End timing a custom operation
   */
  endTiming(name: string): number {
    const startTime = this.startTimes.get(name);
    if (!startTime) {
      console.warn(`No start time found for: ${name}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.startTimes.delete(name);
    
    // Store component render times
    if (name.startsWith('component:')) {
      if (!this.metrics.componentRenderTimes) {
        this.metrics.componentRenderTimes = {};
      }
      this.metrics.componentRenderTimes[name] = duration;
    }
    
    // Store API response times
    if (name.startsWith('api:')) {
      if (!this.metrics.apiResponseTimes) {
        this.metrics.apiResponseTimes = {};
      }
      this.metrics.apiResponseTimes[name] = duration;
    }
    
    return duration;
  }
  
  /**
   * Track API call performance
   */
  trackAPICall(endpoint: string, duration: number, status: number) {
    if (!this.config.enableAPITracking) return;
    
    if (!this.metrics.apiResponseTimes) {
      this.metrics.apiResponseTimes = {};
    }
    
    const key = `${endpoint}_${status}`;
    this.metrics.apiResponseTimes[key] = duration;
    
    this.reportMetric('API_CALL', duration, { endpoint, status });
  }
  
  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const summary = {
      coreWebVitals: {
        cls: this.metrics.cls,
        fid: this.metrics.fid,
        fcp: this.metrics.fcp,
        lcp: this.metrics.lcp,
        ttfb: this.metrics.ttfb
      },
      bundlePerformance: {
        totalChunks: Object.keys(this.metrics.chunkLoadTimes || {}).length,
        averageChunkLoadTime: this.getAverageChunkLoadTime(),
        slowestChunk: this.getSlowestChunk()
      },
      memoryUsage: this.metrics.memoryUsage,
      apiPerformance: {
        totalCalls: Object.keys(this.metrics.apiResponseTimes || {}).length,
        averageResponseTime: this.getAverageAPIResponseTime(),
        slowestAPI: this.getSlowestAPI()
      }
    };
    
    return summary;
  }
  
  private getAverageChunkLoadTime(): number {
    const times = Object.values(this.metrics.chunkLoadTimes || {});
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }
  
  private getSlowestChunk(): { name: string; time: number } | null {
    const chunks = this.metrics.chunkLoadTimes || {};
    const entries = Object.entries(chunks);
    if (entries.length === 0) return null;
    
    const slowest = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    return { name: slowest[0], time: slowest[1] };
  }
  
  private getAverageAPIResponseTime(): number {
    const times = Object.values(this.metrics.apiResponseTimes || {});
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }
  
  private getSlowestAPI(): { name: string; time: number } | null {
    const apis = this.metrics.apiResponseTimes || {};
    const entries = Object.entries(apis);
    if (entries.length === 0) return null;
    
    const slowest = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    return { name: slowest[0], time: slowest[1] };
  }
  
  private reportMetric(name: string, value: number, metadata?: any) {
    if (Math.random() > this.config.sampleRate) return;
    
    const report = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata
    };
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric: ${name}`, report);
    }
    
    // Send to reporting endpoint if configured
    if (this.config.reportingEndpoint) {
      this.sendToEndpoint(report);
    }
  }
  
  private reportMetrics() {
    const summary = this.getPerformanceSummary();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Summary:', summary);
    }
    
    if (this.config.reportingEndpoint) {
      this.sendToEndpoint({ type: 'summary', data: summary });
    }
  }
  
  private async sendToEndpoint(data: any) {
    try {
      await fetch(this.config.reportingEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Failed to send performance data:', error);
    }
  }
  
  /**
   * Clean up observers and timers
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.startTimes.clear();
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for component performance tracking
export function usePerformanceTracking(componentName: string) {
  const startTime = performance.now();
  
  return {
    trackRender: () => {
      const renderTime = performance.now() - startTime;
      performanceMonitor.trackAPICall(`component:${componentName}`, renderTime, 200);
      return renderTime;
    },
    startTiming: (operation: string) => {
      performanceMonitor.startTiming(`${componentName}:${operation}`);
    },
    endTiming: (operation: string) => {
      return performanceMonitor.endTiming(`${componentName}:${operation}`);
    }
  };
}

export default PerformanceMonitor;