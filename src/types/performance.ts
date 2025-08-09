// TypeScript type definitions for performance monitoring

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, string | number | boolean>
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
  LCP?: number;
  FID?: number;
  CLS?: number;
  loadTime?: number;
  renderTime?: number;
  memoryUsed?: number;
  memoryTotal?: number;
}

export interface ResourceHint {
  rel: 'preconnect' | 'dns-prefetch' | 'preload' | 'prefetch';
  href: string;
  as?: string;
  type?: string;
  crossOrigin?: string;
}

export {};
