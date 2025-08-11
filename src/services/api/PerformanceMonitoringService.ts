// Temporary stub for PerformanceMonitoringService to resolve build issues
// This will be properly implemented after dependency conflicts are resolved

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url?: string;
  context?: Record<string, any>;
}

export interface PerformanceAlert {
  id: string;
  type: 'warning' | 'critical';
  metric: string;
  threshold: number;
  actualValue: number;
  timestamp: number;
  resolved?: boolean;
}

export interface PerformanceReport {
  id: string;
  timeRange: { start: Date; end: Date };
  metrics: PerformanceMetric[];
  alerts: PerformanceAlert[];
  summary: Record<string, any>;
  generatedAt: Date;
}

export class PerformanceMonitoringService {
  private isInitialized: boolean = false;
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];

  constructor() {
    console.log('PerformanceMonitoringService initialized (stub mode)');
  }

  public initialize(): void {
    this.isInitialized = true;
    console.log('Performance monitoring service initialized');
  }

  public trackMetric(name: string, value: number, context?: Record<string, any>): void {
    if (!this.isInitialized) {
      console.warn('Performance monitoring service not initialized');
      return;
    }
    
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      context
    };
    
    this.metrics.push(metric);
    console.log('Tracking performance metric:', name, value);
  }

  public trackPageLoad(): void {
    console.log('Tracking page load performance (stub)');
  }

  public trackResourceTiming(): void {
    console.log('Tracking resource timing (stub)');
  }

  public trackCoreWebVitals(): void {
    console.log('Tracking Core Web Vitals (stub)');
  }

  public trackLighthouseAudit(): void {
    console.log('Tracking Lighthouse audit (stub)');
  }

  public createAlert(type: 'warning' | 'critical', metric: string, threshold: number, actualValue: number): PerformanceAlert {
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}`,
      type,
      metric,
      threshold,
      actualValue,
      timestamp: Date.now(),
      resolved: false
    };
    
    this.alerts.push(alert);
    console.log('Performance alert created:', alert);
    return alert;
  }

  public resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      console.log('Performance alert resolved:', alertId);
    }
  }

  public getMetrics(timeRange?: { start: Date; end: Date }): PerformanceMetric[] {
    if (timeRange) {
      return this.metrics.filter(m => 
        m.timestamp >= timeRange.start.getTime() && 
        m.timestamp <= timeRange.end.getTime()
      );
    }
    return this.metrics;
  }

  public getAlerts(resolved?: boolean): PerformanceAlert[] {
    if (resolved !== undefined) {
      return this.alerts.filter(a => a.resolved === resolved);
    }
    return this.alerts;
  }

  public generateReport(timeRange: { start: Date; end: Date }): PerformanceReport {
    const metrics = this.getMetrics(timeRange);
    const alerts = this.getAlerts();
    
    const report: PerformanceReport = {
      id: `report_${Date.now()}`,
      timeRange,
      metrics,
      alerts,
      summary: {
        totalMetrics: metrics.length,
        totalAlerts: alerts.length,
        unresolvedAlerts: alerts.filter(a => !a.resolved).length
      },
      generatedAt: new Date()
    };
    
    console.log('Performance report generated:', report.id);
    return report;
  }

  public clearMetrics(): void {
    this.metrics = [];
    console.log('Performance metrics cleared');
  }

  public clearAlerts(): void {
    this.alerts = [];
    console.log('Performance alerts cleared');
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public getDebugInfo(): Record<string, any> {
    return {
      initialized: this.isInitialized,
      metricsCount: this.metrics.length,
      alertsCount: this.alerts.length,
      mode: 'performance-stub'
    };
  }
}

export default PerformanceMonitoringService;