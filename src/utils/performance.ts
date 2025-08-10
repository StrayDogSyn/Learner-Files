import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';
import { trackEvent } from './analytics';

// Performance monitoring configuration
interface PerformanceConfig {
  enableWebVitals: boolean;
  enableResourceTiming: boolean;
  enableNavigationTiming: boolean;
  enableMemoryMonitoring: boolean;
  enableErrorTracking: boolean;
  sampleRate: number;
}

// Memory info interface
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// Performance metrics interface
interface PerformanceMetrics {
  cls: number;
  fid: number;
  fcp: number;
  lcp: number;
  ttfb: number;
  loadTime?: number;
  domContentLoaded?: number;
  memoryUsage?: MemoryInfo;
  resourceTiming: PerformanceResourceTiming[];
  navigationTiming: PerformanceNavigationTiming | null;
}

// Error tracking interface
interface ErrorInfo {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
}

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: Partial<PerformanceMetrics> = {};
  private sessionId: string;
  private observers: PerformanceObserver[] = [];

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableWebVitals: true,
      enableResourceTiming: true,
      enableNavigationTiming: true,
      enableMemoryMonitoring: true,
      enableErrorTracking: true,
      sampleRate: 1.0,
      ...config
    };
    
    this.sessionId = this.generateSessionId();
    this.init();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // Initialize Web Vitals monitoring
    if (this.config.enableWebVitals) {
      this.initWebVitals();
    }

    // Initialize resource timing monitoring
    if (this.config.enableResourceTiming) {
      this.initResourceTiming();
    }

    // Initialize navigation timing monitoring
    if (this.config.enableNavigationTiming) {
      this.initNavigationTiming();
    }

    // Initialize memory monitoring
    if (this.config.enableMemoryMonitoring) {
      this.initMemoryMonitoring();
    }

    // Initialize error tracking
    if (this.config.enableErrorTracking) {
      this.initErrorTracking();
    }

    // Monitor long tasks
    this.initLongTaskMonitoring();

    // Monitor layout shifts
    this.initLayoutShiftMonitoring();
  }

  private initWebVitals(): void {
    const reportMetric = (metric: Metric) => {
      if (Math.random() > this.config.sampleRate) return;

      // Store metric value with proper typing
      const metricName = metric.name.toLowerCase();
      if (metricName === 'cls' || metricName === 'fid' || metricName === 'inp' || metricName === 'fcp' || metricName === 'lcp' || metricName === 'ttfb') {
        (this.metrics as any)[metricName] = metric.value;
      }
      
      trackEvent('performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: this.getMetricRating(metric.name, metric.value),
        session_id: this.sessionId
      });

      // Send to analytics or monitoring service
      this.sendMetric(metric);
    };

    onCLS(reportMetric);
    onINP(reportMetric);
    onFCP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);
  }

  private initResourceTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      this.metrics.resourceTiming = [...(this.metrics.resourceTiming || []), ...entries];
      
      // Analyze slow resources
      entries.forEach(entry => {
        if (entry.duration > 1000) { // Resources taking more than 1s
          trackEvent('slow_resource', {
            resource_name: entry.name,
            duration: entry.duration,
            size: entry.transferSize,
            session_id: this.sessionId
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  private initNavigationTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceNavigationTiming[];
      if (entries.length > 0) {
        this.metrics.navigationTiming = entries[0];
        
        const timing = entries[0];
        
        // Calculate custom metrics
        this.metrics.loadTime = timing.loadEventEnd - timing.startTime;
        this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.startTime;
        
        trackEvent('navigation_timing', {
          dns_lookup: timing.domainLookupEnd - timing.domainLookupStart,
          tcp_connect: timing.connectEnd - timing.connectStart,
          request_response: timing.responseEnd - timing.requestStart,
          dom_processing: timing.domContentLoadedEventEnd - timing.responseEnd,
          load_complete: timing.loadEventEnd - timing.loadEventStart,
          load_time: this.metrics.loadTime,
          dom_content_loaded: this.metrics.domContentLoaded,
          session_id: this.sessionId
        });
      }
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.push(observer);
  }

  private initMemoryMonitoring(): void {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory;
      
      // Alert if memory usage is high
      const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      if (usageRatio > 0.8) {
        trackEvent('high_memory_usage', {
          used_heap: memory.usedJSHeapSize,
          total_heap: memory.totalJSHeapSize,
          heap_limit: memory.jsHeapSizeLimit,
          usage_ratio: usageRatio,
          session_id: this.sessionId
        });
      }
    };

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000);
    checkMemory(); // Initial check
  }

  private initErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.sessionId
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.sessionId
      });
    });
  }

  private initLongTaskMonitoring(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        trackEvent('long_task', {
          duration: entry.duration,
          start_time: entry.startTime,
          session_id: this.sessionId
        });
      });
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (e) {
      // Long task API not supported
    }
  }

  private initLayoutShiftMonitoring(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if ((entry as any).value > 0.1) { // Significant layout shift
          trackEvent('layout_shift', {
            value: (entry as any).value,
            start_time: entry.startTime,
            session_id: this.sessionId
          });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (e) {
      // Layout shift API not supported
    }
  }

  private getMetricRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, [number, number]> = {
      CLS: [0.1, 0.25],
      FID: [100, 300],
      FCP: [1800, 3000],
      LCP: [2500, 4000],
      TTFB: [800, 1800]
    };

    const [good, poor] = thresholds[name] || [0, 0];
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  }

  private sendMetric(metric: Metric): void {
    // Send to your analytics service
    console.log('Performance Metric:', metric);
  }

  public trackError(error: ErrorInfo): void {
    trackEvent('javascript_error', {
      error_message: error.message,
      error_stack: error.stack,
      error_filename: error.filename,
      error_line: error.lineno,
      error_column: error.colno,
      session_id: error.sessionId
    });

    // Send to error tracking service
    console.error('Tracked Error:', error);
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public addResourceHints(): void {
    // Add DNS prefetch hints for external domains
    const domains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Add preconnect for critical resources
    const preconnectDomains = ['fonts.googleapis.com'];
    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  public setupLazyLoading(): void {
    // Setup intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React Error Boundary (moved to separate component file)
// Error boundary functionality will be implemented in a separate React component

// React Hook for performance monitoring (moved to separate hook file)
// Performance monitoring hook functionality will be implemented in a separate React hook file

// Performance monitoring utilities
export const measureFunction = <T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = fn(...args);
    const duration = performance.now() - start;
    
    trackEvent('function_performance', {
      function_name: name,
      duration,
      timestamp: Date.now()
    });
    
    return result;
  }) as T;
};

export const measureAsync = async <T>(
  promise: Promise<T>,
  name: string
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await promise;
    const duration = performance.now() - start;
    
    trackEvent('async_performance', {
      operation_name: name,
      duration,
      status: 'success',
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    
    trackEvent('async_performance', {
      operation_name: name,
      duration,
      status: 'error',
      error_message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
    
    throw error;
  }
};

// Create global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Export types and class
export type { PerformanceConfig, PerformanceMetrics, ErrorInfo };
export { PerformanceMonitor };
export default PerformanceMonitor;