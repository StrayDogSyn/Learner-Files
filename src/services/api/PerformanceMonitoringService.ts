import { AnalyticsService } from './AnalyticsService';
import { EnhancedAnalyticsConfig } from './types';

/**
 * Real-time Performance Monitoring Service
 * Tracks Core Web Vitals, Lighthouse scores, and performance metrics
 */
export interface PerformanceConfig extends EnhancedAnalyticsConfig {
  lighthouseApiKey?: string;
  performanceThresholds: {
    lcp: number; // Largest Contentful Paint (ms)
    fid: number; // First Input Delay (ms)
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint (ms)
    ttfb: number; // Time to First Byte (ms)
  };
  alertThresholds: {
    errorRate: number; // Percentage
    responseTime: number; // ms
    memoryUsage: number; // MB
  };
}

export interface CoreWebVitals {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  timestamp: Date;
  url: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

export interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
  timestamp: Date;
  url: string;
  deviceType: 'desktop' | 'mobile';
  audits: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
    speedIndex: number;
    totalBlockingTime: number;
  };
}

export interface PerformanceAlert {
  id: string;
  type: 'performance' | 'error' | 'memory' | 'network';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: Date;
  url: string;
  userAgent: string;
  resolved: boolean;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: Date;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  userFeedback?: {
    description: string;
    email?: string;
    reproductionSteps?: string;
  };
}

export interface PerformanceReport {
  timeRange: { start: Date; end: Date };
  coreWebVitals: {
    average: CoreWebVitals;
    p75: CoreWebVitals;
    p95: CoreWebVitals;
    trend: 'improving' | 'stable' | 'degrading';
  };
  lighthouseScores: {
    average: LighthouseMetrics;
    trend: 'improving' | 'stable' | 'degrading';
  };
  errorRate: number;
  totalErrors: number;
  topErrors: ErrorReport[];
  performanceAlerts: PerformanceAlert[];
  recommendations: string[];
}

export class PerformanceMonitoringService extends AnalyticsService {
  declare protected config: PerformanceConfig;
  private coreWebVitals: CoreWebVitals | null = null;
  private performanceObserver: PerformanceObserver | null = null;
  private errorReports: Map<string, ErrorReport> = new Map();
  private performanceAlerts: Map<string, PerformanceAlert> = new Map();
  private lighthouseCache: Map<string, LighthouseMetrics> = new Map();
  private isMonitoring: boolean = false;

  constructor(config: PerformanceConfig) {
    super(config);
    this.config = {
      performanceThresholds: {
        lcp: 2500,
        fid: 100,
        cls: 0.1,
        fcp: 1800,
        ttfb: 600
      },
      alertThresholds: {
        errorRate: 5,
        responseTime: 3000,
        memoryUsage: 100
      },
      ...config
    };
    
    this.initializePerformanceMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  private async initializePerformanceMonitoring(): Promise<void> {
    try {
      // Set up Core Web Vitals tracking
      this.setupCoreWebVitalsTracking();
      
      // Set up error monitoring
      this.setupErrorMonitoring();
      
      // Set up memory monitoring
      this.setupMemoryMonitoring();
      
      // Set up network monitoring
      this.setupNetworkMonitoring();
      
      // Start periodic Lighthouse audits
      this.startPeriodicLighthouseAudits();
      
      this.isMonitoring = true;
      
      await this.track('performance_monitoring_started', {
        config: this.config,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
    }
  }

  /**
   * Set up Core Web Vitals tracking
   */
  private setupCoreWebVitalsTracking(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    // Initialize Core Web Vitals object
    this.coreWebVitals = {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      ttfb: null,
      timestamp: new Date(),
      url: window.location.href,
      deviceType: this.getDeviceType()
    };

    // Track Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      if (this.coreWebVitals) {
        this.coreWebVitals.lcp = lastEntry.startTime;
        this.checkPerformanceThreshold('lcp', lastEntry.startTime);
      }
    });

    // Track First Input Delay (FID)
    this.observePerformanceEntry('first-input', (entries) => {
      const firstEntry = entries[0] as any;
      const fid = (firstEntry.processingStart || firstEntry.startTime) - firstEntry.startTime;
      if (this.coreWebVitals) {
        this.coreWebVitals.fid = fid;
        this.checkPerformanceThreshold('fid', fid);
      }
    });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    this.observePerformanceEntry('layout-shift', (entries) => {
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      if (this.coreWebVitals) {
        this.coreWebVitals.cls = clsValue;
        this.checkPerformanceThreshold('cls', clsValue);
      }
    });

    // Track First Contentful Paint (FCP)
    this.observePerformanceEntry('paint', (entries) => {
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry && this.coreWebVitals) {
        this.coreWebVitals.fcp = fcpEntry.startTime;
        this.checkPerformanceThreshold('fcp', fcpEntry.startTime);
      }
    });

    // Track Time to First Byte (TTFB)
    this.observePerformanceEntry('navigation', (entries) => {
      const navigationEntry = entries[0] as PerformanceNavigationTiming;
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      if (this.coreWebVitals) {
        this.coreWebVitals.ttfb = ttfb;
        this.checkPerformanceThreshold('ttfb', ttfb);
      }
    });

    // Send Core Web Vitals data periodically
    setInterval(() => {
      if (this.coreWebVitals) {
        this.track('core_web_vitals', {
          ...this.coreWebVitals,
          timestamp: Date.now()
        });
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Observe performance entries
   */
  private observePerformanceEntry(
    entryType: string,
    callback: (entries: PerformanceEntry[]) => void
  ): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes: [entryType] });
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error);
    }
  }

  /**
   * Check performance thresholds and create alerts
   */
  private checkPerformanceThreshold(metric: keyof CoreWebVitals, value: number): void {
    const threshold = this.config.performanceThresholds[metric as keyof typeof this.config.performanceThresholds];
    
    if (threshold && value > threshold) {
      this.createPerformanceAlert({
        type: 'performance',
        severity: this.getAlertSeverity(metric, value, threshold),
        message: `${metric.toUpperCase()} threshold exceeded: ${value}ms > ${threshold}ms`,
        metric,
        value,
        threshold,
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    }
  }

  /**
   * Set up error monitoring
   */
  private setupErrorMonitoring(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        severity: 'high'
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        severity: 'high'
      });
    });

    // React error boundary integration
    if (window.React) {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (args[0]?.includes?.('React')) {
          this.reportError({
            message: args.join(' '),
            severity: 'medium',
            context: { type: 'react_error' }
          });
        }
        originalConsoleError.apply(console, args);
      };
    }
  }

  /**
   * Report an error
   */
  async reportError(errorData: Partial<ErrorReport>): Promise<void> {
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      filename: errorData.filename,
      lineno: errorData.lineno,
      colno: errorData.colno,
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      severity: errorData.severity || 'medium',
      context: errorData.context,
      userFeedback: errorData.userFeedback
    };

    this.errorReports.set(errorReport.id, errorReport);

    await this.track('error_report', errorReport);

    // Create alert for critical errors
    if (errorReport.severity === 'critical' || errorReport.severity === 'high') {
      this.createPerformanceAlert({
        type: 'error',
        severity: errorReport.severity,
        message: `Error: ${errorReport.message}`,
        metric: 'error_count',
        value: 1,
        threshold: 0,
        url: errorReport.url,
        userAgent: errorReport.userAgent
      });
    }
  }

  /**
   * Set up memory monitoring
   */
  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
        
        this.track('memory_usage', {
          usedJSHeapSize: memoryUsage,
          totalJSHeapSize: memory.totalJSHeapSize / 1024 / 1024,
          jsHeapSizeLimit: memory.jsHeapSizeLimit / 1024 / 1024,
          timestamp: Date.now()
        });

        // Check memory threshold
        if (memoryUsage > this.config.alertThresholds.memoryUsage) {
          this.createPerformanceAlert({
            type: 'memory',
            severity: 'medium',
            message: `High memory usage: ${memoryUsage.toFixed(2)}MB`,
            metric: 'memory_usage',
            value: memoryUsage,
            threshold: this.config.alertThresholds.memoryUsage,
            url: window.location.href,
            userAgent: navigator.userAgent
          });
        }
      }, 60000); // Every minute
    }
  }

  /**
   * Set up network monitoring
   */
  private setupNetworkMonitoring(): void {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.track('network_request', {
          url: args[0],
          method: args[1]?.method || 'GET',
          status: response.status,
          duration,
          timestamp: Date.now()
        });

        // Check response time threshold
        if (duration > this.config.alertThresholds.responseTime) {
          this.createPerformanceAlert({
            type: 'network',
            severity: 'medium',
            message: `Slow network request: ${duration.toFixed(2)}ms`,
            metric: 'response_time',
            value: duration,
            threshold: this.config.alertThresholds.responseTime,
            url: window.location.href,
            userAgent: navigator.userAgent
          });
        }
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.track('network_error', {
          url: args[0],
          method: args[1]?.method || 'GET',
          error: error.message,
          duration,
          timestamp: Date.now()
        });
        
        throw error;
      }
    };
  }

  /**
   * Start periodic Lighthouse audits
   */
  private startPeriodicLighthouseAudits(): void {
    // Run Lighthouse audit every hour
    setInterval(() => {
      this.runLighthouseAudit();
    }, 3600000); // 1 hour

    // Run initial audit after 30 seconds
    setTimeout(() => {
      this.runLighthouseAudit();
    }, 30000);
  }

  /**
   * Run Lighthouse audit
   */
  async runLighthouseAudit(url?: string): Promise<LighthouseMetrics | null> {
    try {
      const targetUrl = url || window.location.href;
      
      // Check cache first
      const cacheKey = `${targetUrl}_${this.getDeviceType()}`;
      const cached = this.lighthouseCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp.getTime() < 3600000) { // 1 hour cache
        return cached;
      }

      // Use PageSpeed Insights API (requires API key)
      if (this.config.lighthouseApiKey) {
        const response = await fetch(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&key=${this.config.lighthouseApiKey}&strategy=${this.getDeviceType() === 'mobile' ? 'mobile' : 'desktop'}`
        );
        
        const data = await response.json();
        
        if (data.lighthouseResult) {
          const metrics: LighthouseMetrics = {
            performance: Math.round(data.lighthouseResult.categories.performance.score * 100),
            accessibility: Math.round(data.lighthouseResult.categories.accessibility.score * 100),
            bestPractices: Math.round(data.lighthouseResult.categories['best-practices'].score * 100),
            seo: Math.round(data.lighthouseResult.categories.seo.score * 100),
            pwa: data.lighthouseResult.categories.pwa ? Math.round(data.lighthouseResult.categories.pwa.score * 100) : 0,
            timestamp: new Date(),
            url: targetUrl,
            deviceType: this.getDeviceType() === 'mobile' ? 'mobile' : 'desktop',
            audits: {
              firstContentfulPaint: data.lighthouseResult.audits['first-contentful-paint'].numericValue,
              largestContentfulPaint: data.lighthouseResult.audits['largest-contentful-paint'].numericValue,
              firstInputDelay: data.lighthouseResult.audits['max-potential-fid']?.numericValue || 0,
              cumulativeLayoutShift: data.lighthouseResult.audits['cumulative-layout-shift'].numericValue,
              speedIndex: data.lighthouseResult.audits['speed-index'].numericValue,
              totalBlockingTime: data.lighthouseResult.audits['total-blocking-time'].numericValue
            }
          };

          this.lighthouseCache.set(cacheKey, metrics);
          
          await this.track('lighthouse_audit', metrics);
          
          return metrics;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Failed to run Lighthouse audit:', error);
      return null;
    }
  }

  /**
   * Create performance alert
   */
  private createPerformanceAlert(alertData: Omit<PerformanceAlert, 'id' | 'timestamp' | 'resolved'>): void {
    const alert: PerformanceAlert = {
      id: this.generateAlertId(),
      timestamp: new Date(),
      resolved: false,
      ...alertData
    };

    this.performanceAlerts.set(alert.id, alert);
    
    this.track('performance_alert', alert);
  }

  /**
   * Get alert severity based on metric and threshold
   */
  private getAlertSeverity(
    metric: string,
    value: number,
    threshold: number
  ): PerformanceAlert['severity'] {
    const ratio = value / threshold;
    
    if (ratio > 3) return 'critical';
    if (ratio > 2) return 'high';
    if (ratio > 1.5) return 'medium';
    return 'low';
  }

  /**
   * Get device type
   */
  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone/.test(userAgent)) return 'mobile';
    if (/iPad/.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  /**
   * Generate error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate alert ID
   */
  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current Core Web Vitals
   */
  getCurrentCoreWebVitals(): CoreWebVitals | null {
    return this.coreWebVitals;
  }

  /**
   * Get performance alerts
   */
  getPerformanceAlerts(): PerformanceAlert[] {
    return Array.from(this.performanceAlerts.values());
  }

  /**
   * Get error reports
   */
  getErrorReports(): ErrorReport[] {
    return Array.from(this.errorReports.values());
  }

  /**
   * Generate performance report
   */
  async generatePerformanceReport(
    timeRange: { start: Date; end: Date }
  ): Promise<PerformanceReport> {
    // This would typically fetch data from your analytics backend
    // For now, we'll return mock data based on current metrics
    
    const mockReport: PerformanceReport = {
      timeRange,
      coreWebVitals: {
        average: this.coreWebVitals || {
          lcp: 2000,
          fid: 50,
          cls: 0.05,
          fcp: 1500,
          ttfb: 400,
          timestamp: new Date(),
          url: window.location.href,
          deviceType: this.getDeviceType()
        },
        p75: this.coreWebVitals || {
          lcp: 2500,
          fid: 80,
          cls: 0.08,
          fcp: 1800,
          ttfb: 600,
          timestamp: new Date(),
          url: window.location.href,
          deviceType: this.getDeviceType()
        },
        p95: this.coreWebVitals || {
          lcp: 3500,
          fid: 150,
          cls: 0.15,
          fcp: 2500,
          ttfb: 1000,
          timestamp: new Date(),
          url: window.location.href,
          deviceType: this.getDeviceType()
        },
        trend: 'stable'
      },
      lighthouseScores: {
        average: {
          performance: 85,
          accessibility: 92,
          bestPractices: 88,
          seo: 95,
          pwa: 78,
          timestamp: new Date(),
          url: window.location.href,
          deviceType: 'desktop',
          audits: {
            firstContentfulPaint: 1500,
            largestContentfulPaint: 2000,
            firstInputDelay: 50,
            cumulativeLayoutShift: 0.05,
            speedIndex: 2200,
            totalBlockingTime: 150
          }
        },
        trend: 'improving'
      },
      errorRate: 0.5,
      totalErrors: this.errorReports.size,
      topErrors: Array.from(this.errorReports.values()).slice(0, 5),
      performanceAlerts: Array.from(this.performanceAlerts.values()),
      recommendations: [
        'Optimize images for better LCP scores',
        'Reduce JavaScript bundle size',
        'Implement proper caching strategies',
        'Minimize layout shifts during page load'
      ]
    };

    await this.track('performance_report_generated', {
      timeRange,
      reportSummary: {
        errorRate: mockReport.errorRate,
        totalErrors: mockReport.totalErrors,
        alertCount: mockReport.performanceAlerts.length
      }
    });

    return mockReport;
  }

  /**
   * Collect user feedback for errors
   */
  async collectUserFeedback(
    errorId: string,
    feedback: {
      description: string;
      email?: string;
      reproductionSteps?: string;
    }
  ): Promise<void> {
    const errorReport = this.errorReports.get(errorId);
    if (errorReport) {
      errorReport.userFeedback = feedback;
      this.errorReports.set(errorId, errorReport);
      
      await this.track('user_feedback_collected', {
        errorId,
        feedback,
        timestamp: Date.now()
      });
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitoringService({
  baseURL: process.env.REACT_APP_ANALYTICS_ENDPOINT || 'https://analytics.api.demo.com',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  rateLimit: {
    requests: 100,
    window: 60000
  },
  trackingId: 'github-pages-portfolio-performance',
  lighthouseApiKey: process.env.REACT_APP_LIGHTHOUSE_API_KEY,
  performanceThresholds: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800,
    ttfb: 600
  },
  alertThresholds: {
    errorRate: 5,
    responseTime: 3000,
    memoryUsage: 100
  },
  enableAutoTracking: true,
  enablePerformanceTracking: true,
  enableErrorTracking: true,
  debugMode: process.env.NODE_ENV === 'development'
});