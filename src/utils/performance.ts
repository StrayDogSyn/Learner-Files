// Performance monitoring and optimization utilities

// Performance metrics interface
interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

// Performance observer for Core Web Vitals
class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
    this.measureBasicMetrics();
  }

  private initializeObservers() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  private measureBasicMetrics() {
    // Wait for page load to complete
    if (document.readyState === 'complete') {
      this.calculateMetrics();
    } else {
      window.addEventListener('load', () => this.calculateMetrics());
    }
  }

  private calculateMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    }

    // First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      this.metrics.firstContentfulPaint = fcpEntry.startTime;
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public logMetrics() {
    console.group('🚀 Performance Metrics');
    console.log('Load Time:', this.metrics.loadTime?.toFixed(2) + 'ms');
    console.log('DOM Content Loaded:', this.metrics.domContentLoaded?.toFixed(2) + 'ms');
    console.log('First Contentful Paint:', this.metrics.firstContentfulPaint?.toFixed(2) + 'ms');
    console.log('Largest Contentful Paint:', this.metrics.largestContentfulPaint?.toFixed(2) + 'ms');
    console.log('Cumulative Layout Shift:', this.metrics.cumulativeLayoutShift?.toFixed(4));
    console.log('First Input Delay:', this.metrics.firstInputDelay?.toFixed(2) + 'ms');
    console.groupEnd();
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
  }
}

// Resource preloading utilities
class ResourcePreloader {
  private preloadedResources = new Set<string>();

  // Preload critical images
  public preloadImages(urls: string[]): Promise<void[]> {
    const promises = urls.map(url => {
      if (this.preloadedResources.has(url)) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.preloadedResources.add(url);
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });
    });

    return Promise.all(promises);
  }

  // Preload critical CSS
  public preloadCSS(urls: string[]): void {
    urls.forEach(url => {
      if (!this.preloadedResources.has(url)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
        this.preloadedResources.add(url);
      }
    });
  }

  // Preload JavaScript modules
  public preloadJS(urls: string[]): void {
    urls.forEach(url => {
      if (!this.preloadedResources.has(url)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = url;
        document.head.appendChild(link);
        this.preloadedResources.add(url);
      }
    });
  }
}

// Export instances
export const performanceMonitor = new PerformanceMonitor();
export const resourcePreloader = new ResourcePreloader();

// Export classes for custom usage
export { PerformanceMonitor, ResourcePreloader };
export type { PerformanceMetrics };