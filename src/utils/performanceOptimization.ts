/**
 * Performance Optimization Utilities
 * Comprehensive tools for monitoring and optimizing application performance
 */

// Performance Metrics Interface
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  cumulativeLayoutShift: number;
  largestContentfulPaint: number;
}

// Memory Usage Tracker
export class MemoryTracker {
  private static instance: MemoryTracker;
  private measurements: number[] = [];

  static getInstance(): MemoryTracker {
    if (!MemoryTracker.instance) {
      MemoryTracker.instance = new MemoryTracker();
    }
    return MemoryTracker.instance;
  }

  getCurrentMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return 0;
  }

  trackMemoryUsage(): void {
    const usage = this.getCurrentMemoryUsage();
    this.measurements.push(usage);
    
    // Keep only last 100 measurements
    if (this.measurements.length > 100) {
      this.measurements.shift();
    }
  }

  getAverageMemoryUsage(): number {
    if (this.measurements.length === 0) return 0;
    return this.measurements.reduce((sum, val) => sum + val, 0) / this.measurements.length;
  }

  getMemoryTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.measurements.length < 10) return 'stable';
    
    const recent = this.measurements.slice(-10);
    const older = this.measurements.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    const threshold = 0.5; // MB threshold
    
    if (recentAvg > olderAvg + threshold) return 'increasing';
    if (recentAvg < olderAvg - threshold) return 'decreasing';
    return 'stable';
  }
}

// Performance Observer Wrapper
export class PerformanceObserver {
  private observers: Map<string, any> = new Map();
  private metrics: Partial<PerformanceMetrics> = {};

  startObserving(): void {
    this.observePaintMetrics();
    this.observeLayoutShift();
    this.observeNavigationTiming();
  }

  private observePaintMetrics(): void {
    if ('PerformanceObserver' in window) {
      const observer = new window.PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
          if (entry.name === 'largest-contentful-paint') {
            this.metrics.largestContentfulPaint = entry.startTime;
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      this.observers.set('paint', observer);
    }
  }

  private observeLayoutShift(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new window.PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.metrics.cumulativeLayoutShift = clsValue;
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('layout-shift', observer);
    }
  }

  private observeNavigationTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new window.PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navEntry = entry as PerformanceNavigationTiming;
          this.metrics.timeToInteractive = navEntry.domInteractive - navEntry.navigationStart;
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', observer);
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Bundle Size Analyzer
export class BundleAnalyzer {
  static async analyzeBundleSize(): Promise<{ total: number; chunks: Record<string, number> }> {
    try {
      // Estimate bundle size based on loaded scripts
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const chunks: Record<string, number> = {};
      let total = 0;

      for (const script of scripts) {
        const src = script.getAttribute('src');
        if (src && !src.startsWith('http')) {
          try {
            const response = await fetch(src, { method: 'HEAD' });
            const size = parseInt(response.headers.get('content-length') || '0');
            const chunkName = src.split('/').pop() || 'unknown';
            chunks[chunkName] = size;
            total += size;
          } catch (error) {
            console.warn(`Could not analyze chunk: ${src}`);
          }
        }
      }

      return { total, chunks };
    } catch (error) {
      console.error('Bundle analysis failed:', error);
      return { total: 0, chunks: {} };
    }
  }

  static formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

// Render Performance Tracker
export class RenderTracker {
  private renderTimes: number[] = [];
  private componentRenders: Map<string, number[]> = new Map();

  trackRender(componentName: string, renderTime: number): void {
    this.renderTimes.push(renderTime);
    
    if (!this.componentRenders.has(componentName)) {
      this.componentRenders.set(componentName, []);
    }
    
    const componentTimes = this.componentRenders.get(componentName)!;
    componentTimes.push(renderTime);
    
    // Keep only last 50 renders per component
    if (componentTimes.length > 50) {
      componentTimes.shift();
    }
  }

  getAverageRenderTime(componentName?: string): number {
    if (componentName) {
      const times = this.componentRenders.get(componentName) || [];
      if (times.length === 0) return 0;
      return times.reduce((sum, time) => sum + time, 0) / times.length;
    }
    
    if (this.renderTimes.length === 0) return 0;
    return this.renderTimes.reduce((sum, time) => sum + time, 0) / this.renderTimes.length;
  }

  getSlowComponents(threshold: number = 16): Array<{ name: string; avgTime: number }> {
    const slowComponents: Array<{ name: string; avgTime: number }> = [];
    
    this.componentRenders.forEach((times, name) => {
      const avgTime = this.getAverageRenderTime(name);
      if (avgTime > threshold) {
        slowComponents.push({ name, avgTime });
      }
    });
    
    return slowComponents.sort((a, b) => b.avgTime - a.avgTime);
  }
}

// Performance Optimization Recommendations
export class OptimizationRecommendations {
  static analyzePerformance(metrics: Partial<PerformanceMetrics>): string[] {
    const recommendations: string[] = [];

    if (metrics.firstContentfulPaint && metrics.firstContentfulPaint > 1500) {
      recommendations.push('Consider implementing code splitting to reduce initial bundle size');
      recommendations.push('Optimize critical rendering path by inlining critical CSS');
    }

    if (metrics.largestContentfulPaint && metrics.largestContentfulPaint > 2500) {
      recommendations.push('Optimize largest contentful paint by preloading key resources');
      recommendations.push('Consider using next-gen image formats (WebP, AVIF)');
    }

    if (metrics.cumulativeLayoutShift && metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('Reduce cumulative layout shift by setting dimensions for images and ads');
      recommendations.push('Avoid inserting content above existing content');
    }

    if (metrics.memoryUsage && metrics.memoryUsage > 50) {
      recommendations.push('Monitor memory usage - consider implementing component cleanup');
      recommendations.push('Review event listeners and ensure proper cleanup');
    }

    return recommendations;
  }
}

// Debounced Performance Tracker
export function createDebouncedTracker(delay: number = 100) {
  let timeoutId: NodeJS.Timeout;
  const tracker = new RenderTracker();
  
  return {
    track: (componentName: string, renderTime: number) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        tracker.trackRender(componentName, renderTime);
      }, delay);
    },
    getMetrics: () => tracker
  };
}

// Performance Hook for React Components
export function measureComponentPerformance<T extends any[]>(
  componentName: string,
  fn: (...args: T) => any
) {
  return (...args: T) => {
    const startTime = performance.now();
    const result = fn(...args);
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    
    // Log slow renders (> 16ms)
    if (renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
    
    return result;
  };
}

// Export singleton instances
export const memoryTracker = MemoryTracker.getInstance();
export const performanceObserver = new PerformanceObserver();
export const renderTracker = new RenderTracker();

// Auto-start performance monitoring
if (typeof window !== 'undefined') {
  performanceObserver.startObserving();
  
  // Track memory usage every 5 seconds
  setInterval(() => {
    memoryTracker.trackMemoryUsage();
  }, 5000);
}