// TypeScript type definitions for performance monitoring

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'consent',
      targetId: string | Date,
      config?: Record<string, any> | string
    ) => void;
    gc?: () => void;
  }

  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

export interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  lastInputTime: number;
  sources: Array<{
    node?: Node;
    currentRect: DOMRectReadOnly;
    previousRect: DOMRectReadOnly;
  }>;
}

export interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  duration: number;
  cancelable: boolean;
  target?: Node;
}

export interface LargestContentfulPaintEntry extends PerformanceEntry {
  renderTime: number;
  loadTime: number;
  size: number;
  id: string;
  url?: string;
  element?: Element;
}

export interface PerformanceMetrics {
  cls?: number;
  fid?: number;
  inp?: number;
  fcp?: number;
  lcp?: number;
  ttfb?: number;
  loadTime?: number;
  domContentLoaded?: number;
  renderTime?: number;
  memoryUsed?: number;
  memoryTotal?: number;
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  resourceTiming?: PerformanceResourceTiming[];
  navigationTiming?: PerformanceNavigationTiming | null;
}

export interface ResourceHint {
  rel: 'preconnect' | 'dns-prefetch' | 'preload' | 'prefetch';
  href: string;
  as?: string;
  type?: string;
  crossOrigin?: string;
}

export {};
