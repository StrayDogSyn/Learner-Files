// FILE: src/utils/performance.ts
import type { 
  LayoutShiftEntry, 
  FirstInputEntry, 
  LargestContentfulPaintEntry,
  PerformanceMetrics,
  ResourceHint 
} from '../types/performance';

class PerformanceMonitor {
  private metrics: Map<string, number>;
  private observer: PerformanceObserver | null;

  constructor() {
    this.metrics = new Map();
    this.observer = null;
    this.initializeMonitoring();
  }

  initializeMonitoring() {
    // Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.metrics.set('LCP', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as FirstInputEntry;
            this.metrics.set('FID', fidEntry.processingStart - fidEntry.startTime);
          }
          if (entry.entryType === 'layout-shift') {
            const currentCLS = this.metrics.get('CLS') || 0;
            const clsEntry = entry as LayoutShiftEntry;
            this.metrics.set('CLS', currentCLS + clsEntry.value);
          }
        }
      });

      this.observer.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    }

    // Custom metrics
    this.measureLoadTime();
    this.measureRenderTime();
    this.trackMemoryUsage();
  }

  measureLoadTime() {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.metrics.set('loadTime', loadTime);
      this.reportMetric('load_time', loadTime);
    });
  }

  measureRenderTime() {
    const renderStart = performance.now();
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStart;
      this.metrics.set('renderTime', renderTime);
      this.reportMetric('render_time', renderTime);
    });
  }

  trackMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        if (memory) {
          this.metrics.set('memoryUsed', memory.usedJSHeapSize);
          this.metrics.set('memoryTotal', memory.totalJSHeapSize);
          
          if (memory.usedJSHeapSize > memory.totalJSHeapSize * 0.9) {
            console.warn('High memory usage detected');
            this.optimizeMemory();
          }
        }
      }, 10000);
    }
  }

  optimizeMemory() {
    // Clear caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('old-version')) {
            caches.delete(name);
          }
        });
      });
    }

    // Trigger garbage collection hint
    if (window.gc) {
      window.gc();
    }
  }

  // Lazy loading implementation
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Resource hints
  addResourceHints() {
    const hints: ResourceHint[] = [
      { rel: 'preconnect', href: 'https://api.github.com' },
      { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'preload', href: '/fonts/main.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.assign(link, hint);
      document.head.appendChild(link);
    });
  }

  reportMetric(name: string, value: number) {
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'performance', {
        metric_name: name,
        value: value,
        page: window.location.pathname
      });
    }
  }

  getMetrics(): PerformanceMetrics {
    return Object.fromEntries(this.metrics);
  }
}

export default new PerformanceMonitor();
