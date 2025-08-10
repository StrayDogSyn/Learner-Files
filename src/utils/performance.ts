// Performance Monitoring Utilities
// Core Web Vitals tracking, Lighthouse CI integration, and performance analytics

import { useState, useEffect, useCallback } from 'react';

export interface CoreWebVitals {
  CLS: number | null; // Cumulative Layout Shift
  FID: number | null; // First Input Delay
  FCP: number | null; // First Contentful Paint
  LCP: number | null; // Largest Contentful Paint
  TTFB: number | null; // Time to First Byte
  INP: number | null; // Interaction to Next Paint
}

// Browser-specific type declarations
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
  
  interface Navigator {
    connection?: {
      effectiveType: string;
      downlink: number;
      rtt: number;
      saveData: boolean;
    };
  }
  
  function gtag(...args: any[]): void;
}

export interface PerformanceMetrics {
  vitals: CoreWebVitals;
  navigation: PerformanceNavigationTiming | null;
  domContentLoaded?: number;
  resources: PerformanceResourceTiming[];
  memory: Performance['memory'] | null;
  connection: Navigator['connection'] | null;
}

export interface PerformanceBudget {
  FCP: number; // First Contentful Paint budget (ms)
  LCP: number; // Largest Contentful Paint budget (ms)
  FID: number; // First Input Delay budget (ms)
  CLS: number; // Cumulative Layout Shift budget
  TTFB: number; // Time to First Byte budget (ms)
  bundleSize: number; // Bundle size budget (KB)
  imageSize: number; // Image size budget (KB)
}

export interface PerformanceAlert {
  metric: keyof CoreWebVitals | 'bundleSize' | 'imageSize';
  value: number;
  threshold: number;
  severity: 'warning' | 'error';
  timestamp: number;
  message: string;
}

// Default performance budgets based on Core Web Vitals thresholds
export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  FCP: 1800, // Good: < 1.8s
  LCP: 2500, // Good: < 2.5s
  FID: 100,  // Good: < 100ms
  CLS: 0.1,  // Good: < 0.1
  TTFB: 800, // Good: < 800ms
  bundleSize: 250, // 250KB
  imageSize: 100   // 100KB per image
};

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private vitals: CoreWebVitals = {
    CLS: null,
    FID: null,
    FCP: null,
    LCP: null,
    TTFB: null,
    INP: null
  };
  
  private budget: PerformanceBudget;
  private alerts: PerformanceAlert[] = [];
  private observers: PerformanceObserver[] = [];
  private callbacks: Array<(metrics: PerformanceMetrics) => void> = [];
  private alertCallbacks: Array<(alert: PerformanceAlert) => void> = [];

  constructor(budget: PerformanceBudget = DEFAULT_PERFORMANCE_BUDGET) {
    this.budget = budget;
    this.initializeObservers();
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Observe Core Web Vitals
    this.observeWebVitals();
    
    // Observe navigation timing
    this.observeNavigation();
    
    // Observe resource timing
    this.observeResources();
  }

  private observeWebVitals(): void {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      this.vitals.LCP = lastEntry.startTime;
      this.checkThreshold('LCP', lastEntry.startTime, this.budget.LCP);
      this.notifyCallbacks();
    });
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // First Input Delay (FID) / Interaction to Next Paint (INP)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.name === 'first-input') {
          this.vitals.FID = entry.processingStart - entry.startTime;
          this.checkThreshold('FID', this.vitals.FID, this.budget.FID);
        }
        if (entry.name === 'interaction') {
          this.vitals.INP = entry.duration;
        }
      });
      this.notifyCallbacks();
    });
    
    try {
      fidObserver.observe({ entryTypes: ['first-input', 'event'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.vitals.CLS = clsValue;
      this.checkThreshold('CLS', clsValue, this.budget.CLS);
      this.notifyCallbacks();
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.name === 'first-contentful-paint') {
          this.vitals.FCP = entry.startTime;
          this.checkThreshold('FCP', entry.startTime, this.budget.FCP);
        }
      });
      this.notifyCallbacks();
    });
    
    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    } catch (e) {
      console.warn('FCP observer not supported');
    }
  }

  private observeNavigation(): void {
    const navObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.responseStart && entry.requestStart) {
          this.vitals.TTFB = entry.responseStart - entry.requestStart;
          this.checkThreshold('TTFB', this.vitals.TTFB, this.budget.TTFB);
        }
      });
      this.notifyCallbacks();
    });
    
    try {
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    } catch (e) {
      console.warn('Navigation observer not supported');
    }
  }

  private observeResources(): void {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        // Check image sizes
        if (entry.initiatorType === 'img' && entry.transferSize) {
          const sizeKB = entry.transferSize / 1024;
          if (sizeKB > this.budget.imageSize) {
            this.addAlert({
              metric: 'imageSize',
              value: sizeKB,
              threshold: this.budget.imageSize,
              severity: 'warning',
              timestamp: Date.now(),
              message: `Image ${entry.name} is ${sizeKB.toFixed(1)}KB, exceeds budget of ${this.budget.imageSize}KB`
            });
          }
        }
      });
    });
    
    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (e) {
      console.warn('Resource observer not supported');
    }
  }

  private checkThreshold(
    metric: keyof CoreWebVitals,
    value: number,
    threshold: number
  ): void {
    if (value > threshold) {
      const severity = value > threshold * 1.5 ? 'error' : 'warning';
      this.addAlert({
        metric,
        value,
        threshold,
        severity,
        timestamp: Date.now(),
        message: `${metric} is ${value.toFixed(1)}${metric === 'CLS' ? '' : 'ms'}, exceeds ${severity} threshold of ${threshold}${metric === 'CLS' ? '' : 'ms'}`
      });
    }
  }

  private addAlert(alert: PerformanceAlert): void {
    this.alerts.push(alert);
    this.alertCallbacks.forEach(callback => callback(alert));
    
    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }
  }

  private notifyCallbacks(): void {
    const metrics = this.getMetrics();
    this.callbacks.forEach(callback => callback(metrics));
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming || null;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const memory = (performance as any).memory || null;
    const connection = (navigator as any).connection || null;

    return {
      vitals: { ...this.vitals },
      navigation,
      domContentLoaded: navigation?.domContentLoadedEventEnd || undefined,
      resources,
      memory,
      connection
    };
  }

  /**
   * Get Core Web Vitals
   */
  getVitals(): CoreWebVitals {
    return { ...this.vitals };
  }

  /**
   * Get performance alerts
   */
  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  /**
   * Subscribe to metrics updates
   */
  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to performance alerts
   */
  onAlert(callback: (alert: PerformanceAlert) => void): () => void {
    this.alertCallbacks.push(callback);
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): {
    vitals: CoreWebVitals;
    score: number;
    alerts: PerformanceAlert[];
    recommendations: string[];
  } {
    const vitals = this.getVitals();
    const alerts = this.getAlerts();
    
    // Calculate performance score (0-100)
    let score = 100;
    const weights = { FCP: 15, LCP: 25, FID: 25, CLS: 25, TTFB: 10 };
    
    Object.entries(vitals).forEach(([metric, value]) => {
      if (value !== null && metric in weights && metric in this.budget) {
        const threshold = this.budget[metric as keyof PerformanceBudget];
        const weight = weights[metric as keyof typeof weights];
        
        if (value > threshold) {
          const penalty = Math.min(weight, (value / threshold - 1) * weight);
          score -= penalty;
        }
      }
    });
    
    score = Math.max(0, Math.round(score));
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (vitals.FCP && vitals.FCP > this.budget.FCP) {
      recommendations.push('Optimize critical rendering path and reduce render-blocking resources');
    }
    
    if (vitals.LCP && vitals.LCP > this.budget.LCP) {
      recommendations.push('Optimize largest contentful paint by improving server response times and optimizing images');
    }
    
    if (vitals.FID && vitals.FID > this.budget.FID) {
      recommendations.push('Reduce JavaScript execution time and break up long tasks');
    }
    
    if (vitals.CLS && vitals.CLS > this.budget.CLS) {
      recommendations.push('Ensure images and ads have size attributes and avoid inserting content above existing content');
    }
    
    if (vitals.TTFB && vitals.TTFB > this.budget.TTFB) {
      recommendations.push('Improve server response times and consider using a CDN');
    }
    
    return {
      vitals,
      score,
      alerts,
      recommendations
    };
  }

  /**
   * Cleanup observers
   */
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.callbacks = [];
    this.alertCallbacks = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [vitals, setVitals] = useState<CoreWebVitals | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    setIsMonitoring(true);
    
    const unsubscribeMetrics = performanceMonitor.onMetricsUpdate((newMetrics) => {
      setMetrics(newMetrics);
      setVitals(newMetrics.vitals);
    });
    
    const unsubscribeAlerts = performanceMonitor.onAlert((alert) => {
      setAlerts(prev => [...prev, alert]);
    });
    
    // Initial data
    setMetrics(performanceMonitor.getMetrics());
    setVitals(performanceMonitor.getVitals());
    setAlerts(performanceMonitor.getAlerts());
    
    return () => {
      unsubscribeMetrics();
      unsubscribeAlerts();
      setIsMonitoring(false);
    };
  }, []);

  const generateReport = useCallback(() => {
    return performanceMonitor.generateReport();
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    metrics,
    vitals,
    alerts,
    isMonitoring,
    generateReport,
    clearAlerts
  };
}

/**
 * Send performance data to analytics
 */
export function sendToAnalytics(data: PerformanceMetrics): void {
  // Send to Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', 'web_vitals', {
      event_category: 'Performance',
      event_label: 'Core Web Vitals',
      custom_map: {
        metric_1: 'fcp',
        metric_2: 'lcp',
        metric_3: 'fid',
        metric_4: 'cls',
        metric_5: 'ttfb'
      },
      fcp: data.vitals.FCP,
      lcp: data.vitals.LCP,
      fid: data.vitals.FID,
      cls: data.vitals.CLS,
      ttfb: data.vitals.TTFB
    });
  }
  
  // Send to custom analytics endpoint
  if (typeof fetch !== 'undefined') {
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        vitals: data.vitals,
        connection: data.connection,
        memory: data.memory
      })
    }).catch(error => {
      console.warn('Failed to send performance data:', error);
    });
  }
}

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;
  
  // Send initial metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const metrics = performanceMonitor.getMetrics();
      sendToAnalytics(metrics);
    }, 1000);
  });
  
  // Send metrics before page unload
  window.addEventListener('beforeunload', () => {
    const metrics = performanceMonitor.getMetrics();
    sendToAnalytics(metrics);
  });
}

// Auto-initialize performance monitoring
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePerformanceMonitoring);
  } else {
    initializePerformanceMonitoring();
  }
}

export default {
  PerformanceMonitor,
  performanceMonitor,
  usePerformanceMonitoring,
  sendToAnalytics,
  initializePerformanceMonitoring,
  DEFAULT_PERFORMANCE_BUDGET
};