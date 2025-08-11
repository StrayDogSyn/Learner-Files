import { getWebSocketService } from './WebSocketService';
import type { PerformanceAlert } from './WebSocketService';

export interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
  timestamp: number;
}

export interface CoreWebVitalsMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  tti: number; // Time to Interactive
  tbt: number; // Total Blocking Time
  si: number; // Speed Index
}

export interface ResourceMetrics {
  totalSize: number;
  imageSize: number;
  scriptSize: number;
  styleSize: number;
  fontSize: number;
  documentSize: number;
  resourceCount: number;
  cacheHitRate: number;
}

export interface NetworkMetrics {
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface PerformanceBudget {
  lcp: { warning: number; error: number };
  fid: { warning: number; error: number };
  cls: { warning: number; error: number };
  fcp: { warning: number; error: number };
  ttfb: { warning: number; error: number };
  totalSize: { warning: number; error: number };
  resourceCount: { warning: number; error: number };
}

export interface PerformanceReport {
  timestamp: number;
  url: string;
  coreWebVitals: CoreWebVitalsMetrics;
  lighthouse?: LighthouseMetrics;
  resources: ResourceMetrics;
  network: NetworkMetrics;
  userAgent: string;
  viewport: { width: number; height: number };
  score: number; // Overall performance score (0-100)
  recommendations: string[];
  alerts: PerformanceAlert[];
}

class PerformanceMonitoringService {
  private observers: Map<string, PerformanceObserver> = new Map();
  private metrics: Partial<CoreWebVitalsMetrics> = {};
  private budget: PerformanceBudget;
  private reports: PerformanceReport[] = [];
  private isMonitoring = false;
  private webSocketService = getWebSocketService();
  private reportInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.budget = {
      lcp: { warning: 2500, error: 4000 },
      fid: { warning: 100, error: 300 },
      cls: { warning: 0.1, error: 0.25 },
      fcp: { warning: 1800, error: 3000 },
      ttfb: { warning: 800, error: 1800 },
      totalSize: { warning: 1000000, error: 2000000 }, // 1MB warning, 2MB error
      resourceCount: { warning: 50, error: 100 }
    };
  }

  async initialize(): Promise<void> {
    if (this.isMonitoring) return;

    try {
      await this.setupPerformanceObservers();
      this.setupNetworkMonitoring();
      this.setupResourceMonitoring();
      this.startPeriodicReporting();
      this.isMonitoring = true;
      
      console.log('Performance monitoring initialized');
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
      throw error;
    }
  }

  private async setupPerformanceObservers(): Promise<void> {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      
      this.metrics.lcp = lastEntry.startTime;
      this.checkPerformanceBudget('lcp', lastEntry.startTime);
    });
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEventTiming;
        const fid = fidEntry.processingStart - fidEntry.startTime;
        
        this.metrics.fid = fid;
        this.checkPerformanceBudget('fid', fid);
      });
    });
    
    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);
    } catch (error) {
      console.warn('FID observer not supported:', error);
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const clsEntry = entry as any;
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value;
        }
      });
      
      this.metrics.cls = clsValue;
      this.checkPerformanceBudget('cls', clsValue);
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.checkPerformanceBudget('fcp', entry.startTime);
        }
      });
    });
    
    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.set('fcp', fcpObserver);
    } catch (error) {
      console.warn('FCP observer not supported:', error);
    }

    // Navigation timing for TTFB
    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const navEntry = entry as PerformanceNavigationTiming;
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        
        this.metrics.ttfb = ttfb;
        this.metrics.tti = navEntry.domInteractive - navEntry.navigationStart;
        
        this.checkPerformanceBudget('ttfb', ttfb);
      });
    });
    
    try {
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', navigationObserver);
    } catch (error) {
      console.warn('Navigation observer not supported:', error);
    }

    // Long tasks for Total Blocking Time (TBT)
    let tbtValue = 0;
    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > 50) {
          tbtValue += entry.duration - 50;
        }
      });
      
      this.metrics.tbt = tbtValue;
    });
    
    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', longTaskObserver);
    } catch (error) {
      console.warn('Long task observer not supported:', error);
    }
  }

  private setupNetworkMonitoring(): void {
    // Monitor network information if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkInfo = () => {
        console.log('Network changed:', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
      };
      
      connection.addEventListener('change', updateNetworkInfo);
    }
  }

  private setupResourceMonitoring(): void {
    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const resources = this.analyzeResources(entries as PerformanceResourceTiming[]);
      
      this.checkPerformanceBudget('totalSize', resources.totalSize);
      this.checkPerformanceBudget('resourceCount', resources.resourceCount);
    });
    
    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    } catch (error) {
      console.warn('Resource observer not supported:', error);
    }
  }

  private analyzeResources(entries: PerformanceResourceTiming[]): ResourceMetrics {
    let totalSize = 0;
    let imageSize = 0;
    let scriptSize = 0;
    let styleSize = 0;
    let fontSize = 0;
    let documentSize = 0;
    let cacheHits = 0;

    entries.forEach((entry) => {
      const size = entry.transferSize || 0;
      totalSize += size;
      
      // Categorize by resource type
      if (entry.initiatorType === 'img' || entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        imageSize += size;
      } else if (entry.initiatorType === 'script' || entry.name.match(/\.js$/i)) {
        scriptSize += size;
      } else if (entry.initiatorType === 'link' || entry.name.match(/\.css$/i)) {
        styleSize += size;
      } else if (entry.name.match(/\.(woff|woff2|ttf|otf)$/i)) {
        fontSize += size;
      } else if (entry.initiatorType === 'navigation') {
        documentSize += size;
      }
      
      // Check for cache hits (transferSize = 0 usually means cached)
      if (entry.transferSize === 0 && entry.decodedBodySize > 0) {
        cacheHits++;
      }
    });

    return {
      totalSize,
      imageSize,
      scriptSize,
      styleSize,
      fontSize,
      documentSize,
      resourceCount: entries.length,
      cacheHitRate: entries.length > 0 ? cacheHits / entries.length : 0
    };
  }

  private checkPerformanceBudget(metric: keyof PerformanceBudget, value: number): void {
    const budget = this.budget[metric];
    if (!budget) return;

    let severity: 'warning' | 'critical' | null = null;
    
    if (value > budget.error) {
      severity = 'critical';
    } else if (value > budget.warning) {
      severity = 'warning';
    }

    if (severity) {
      const alert: PerformanceAlert = {
        metric: metric as any,
        value,
        threshold: severity === 'critical' ? budget.error : budget.warning,
        severity,
        page: window.location.pathname,
        timestamp: Date.now()
      };

      this.webSocketService.sendPerformanceAlert(alert);
    }
  }

  private startPeriodicReporting(): void {
    // Generate performance reports every 5 minutes
    this.reportInterval = setInterval(() => {
      this.generateReport();
    }, 5 * 60 * 1000);
  }

  async runLighthouseAudit(): Promise<LighthouseMetrics | null> {
    // For GitHub Pages, we can't run actual Lighthouse audits
    // Instead, we'll estimate scores based on Core Web Vitals
    try {
      const estimatedMetrics = this.estimateLighthouseScores();
      return estimatedMetrics;
    } catch (error) {
      console.error('Failed to estimate Lighthouse scores:', error);
      return null;
    }
  }

  private estimateLighthouseScores(): LighthouseMetrics {
    // Estimate Lighthouse scores based on Core Web Vitals and other metrics
    const { lcp = 0, fid = 0, cls = 0, fcp = 0, ttfb = 0 } = this.metrics;
    
    // Performance score estimation (simplified algorithm)
    let performanceScore = 100;
    
    // LCP impact (25% weight)
    if (lcp > 4000) performanceScore -= 25;
    else if (lcp > 2500) performanceScore -= 15;
    else if (lcp > 1200) performanceScore -= 5;
    
    // FID impact (25% weight)
    if (fid > 300) performanceScore -= 25;
    else if (fid > 100) performanceScore -= 15;
    else if (fid > 50) performanceScore -= 5;
    
    // CLS impact (25% weight)
    if (cls > 0.25) performanceScore -= 25;
    else if (cls > 0.1) performanceScore -= 15;
    else if (cls > 0.05) performanceScore -= 5;
    
    // FCP impact (15% weight)
    if (fcp > 3000) performanceScore -= 15;
    else if (fcp > 1800) performanceScore -= 10;
    else if (fcp > 1000) performanceScore -= 3;
    
    // TTFB impact (10% weight)
    if (ttfb > 1800) performanceScore -= 10;
    else if (ttfb > 800) performanceScore -= 5;
    else if (ttfb > 400) performanceScore -= 2;
    
    performanceScore = Math.max(0, Math.min(100, performanceScore));
    
    return {
      performance: performanceScore,
      accessibility: 95, // Estimated based on good practices
      bestPractices: 90, // Estimated
      seo: 85, // Estimated
      pwa: 70, // Estimated (GitHub Pages limitations)
      timestamp: Date.now()
    };
  }

  generateReport(): PerformanceReport {
    const resources = this.getCurrentResourceMetrics();
    const network = this.getCurrentNetworkMetrics();
    const lighthouse = this.estimateLighthouseScores();
    
    const report: PerformanceReport = {
      timestamp: Date.now(),
      url: window.location.href,
      coreWebVitals: this.metrics as CoreWebVitalsMetrics,
      lighthouse,
      resources,
      network,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      score: lighthouse.performance,
      recommendations: this.generateRecommendations(),
      alerts: []
    };
    
    this.reports.push(report);
    
    // Keep only last 50 reports
    if (this.reports.length > 50) {
      this.reports = this.reports.slice(-50);
    }
    
    return report;
  }

  private getCurrentResourceMetrics(): ResourceMetrics {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return this.analyzeResources(entries);
  }

  private getCurrentNetworkMetrics(): NetworkMetrics {
    const connection = (navigator as any).connection;
    
    return {
      connectionType: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const { lcp = 0, fid = 0, cls = 0, fcp = 0, ttfb = 0 } = this.metrics;
    
    if (lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by reducing server response times and optimizing critical resources');
    }
    
    if (fid > 100) {
      recommendations.push('Improve First Input Delay by reducing JavaScript execution time and breaking up long tasks');
    }
    
    if (cls > 0.1) {
      recommendations.push('Minimize Cumulative Layout Shift by setting size attributes on images and avoiding dynamic content insertion');
    }
    
    if (fcp > 1800) {
      recommendations.push('Optimize First Contentful Paint by eliminating render-blocking resources and optimizing critical rendering path');
    }
    
    if (ttfb > 800) {
      recommendations.push('Reduce Time to First Byte by optimizing server response times and using a CDN');
    }
    
    const resources = this.getCurrentResourceMetrics();
    if (resources.totalSize > 1000000) {
      recommendations.push('Reduce total resource size by compressing images, minifying CSS/JS, and removing unused code');
    }
    
    if (resources.cacheHitRate < 0.5) {
      recommendations.push('Improve caching strategy by setting appropriate cache headers and using service workers');
    }
    
    return recommendations;
  }

  getMetrics(): Partial<CoreWebVitalsMetrics> {
    return { ...this.metrics };
  }

  getReports(): PerformanceReport[] {
    return [...this.reports];
  }

  getLatestReport(): PerformanceReport | null {
    return this.reports.length > 0 ? this.reports[this.reports.length - 1] : null;
  }

  setBudget(budget: Partial<PerformanceBudget>): void {
    this.budget = { ...this.budget, ...budget };
  }

  getBudget(): PerformanceBudget {
    return { ...this.budget };
  }

  exportReports(format: 'json' | 'csv'): string {
    if (format === 'json') {
      return JSON.stringify(this.reports, null, 2);
    }
    
    // CSV format
    const headers = [
      'timestamp', 'url', 'lcp', 'fid', 'cls', 'fcp', 'ttfb', 'tti', 'tbt',
      'performance_score', 'total_size', 'resource_count', 'cache_hit_rate'
    ];
    
    const rows = this.reports.map(report => [
      new Date(report.timestamp).toISOString(),
      report.url,
      report.coreWebVitals.lcp || 0,
      report.coreWebVitals.fid || 0,
      report.coreWebVitals.cls || 0,
      report.coreWebVitals.fcp || 0,
      report.coreWebVitals.ttfb || 0,
      report.coreWebVitals.tti || 0,
      report.coreWebVitals.tbt || 0,
      report.score,
      report.resources.totalSize,
      report.resources.resourceCount,
      report.resources.cacheHitRate
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  destroy(): void {
    this.isMonitoring = false;
    
    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    // Clear intervals
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
      this.reportInterval = null;
    }
    
    console.log('Performance monitoring destroyed');
  }
}

export default PerformanceMonitoringService;