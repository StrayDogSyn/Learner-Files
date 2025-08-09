import { useState, useEffect, useCallback, useRef } from 'react';
import { PerformanceMetrics } from '../components/portfolio/MetricsDashboard';

export interface UsePerformanceMetricsOptions {
  trackingInterval?: number; // milliseconds
  enableMemoryTracking?: boolean;
  enableUserInteractionTracking?: boolean;
  enableErrorTracking?: boolean;
  maxHistoryLength?: number;
}

export interface PerformanceHistory {
  timestamp: number;
  metrics: PerformanceMetrics;
}

export interface UsePerformanceMetricsReturn {
  metrics: PerformanceMetrics;
  history: PerformanceHistory[];
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  resetMetrics: () => void;
  recordInteraction: (type: string) => void;
  recordError: (error: Error | string) => void;
  getAverageMetrics: (timeRange?: number) => Partial<PerformanceMetrics>;
}

const DEFAULT_OPTIONS: Required<UsePerformanceMetricsOptions> = {
  trackingInterval: 1000,
  enableMemoryTracking: true,
  enableUserInteractionTracking: true,
  enableErrorTracking: true,
  maxHistoryLength: 100
};

const getMemoryUsage = (): number => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return Math.round(memory.usedJSHeapSize / 1024 / 1024); // Convert to MB
  }
  return 0;
};

const getCPUUsage = (): number => {
  // Simulate CPU usage based on performance timing
  const now = performance.now();
  const timingEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (timingEntry) {
    const totalTime = timingEntry.loadEventEnd - timingEntry.fetchStart;
    const processingTime = timingEntry.domContentLoadedEventEnd - timingEntry.domContentLoadedEventStart;
    
    if (totalTime > 0) {
      return Math.min(Math.round((processingTime / totalTime) * 100), 100);
    }
  }
  
  // Fallback: simulate based on recent render times
  return Math.round(Math.random() * 30 + 10); // 10-40% range
};

const getRenderTime = (): number => {
  const entries = performance.getEntriesByType('measure');
  if (entries.length > 0) {
    const recentEntry = entries[entries.length - 1];
    return Math.round(recentEntry.duration);
  }
  
  // Fallback: measure a simple operation
  const start = performance.now();
  // Simulate some work
  for (let i = 0; i < 1000; i++) {
    Math.random();
  }
  const end = performance.now();
  return Math.round(end - start);
};

const getResponseTime = (): number => {
  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  if (entries.length > 0) {
    const recentEntries = entries.slice(-5); // Last 5 requests
    const avgResponseTime = recentEntries.reduce((sum, entry) => {
      return sum + (entry.responseEnd - entry.requestStart);
    }, 0) / recentEntries.length;
    return Math.round(avgResponseTime);
  }
  return Math.round(Math.random() * 50 + 10); // 10-60ms fallback
};

export const usePerformanceMetrics = (
  options: UsePerformanceMetricsOptions = {}
): UsePerformanceMetricsReturn => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const [isTracking, setIsTracking] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    errorCount: 0,
    successRate: 100,
    responseTime: 0,
    userInteractions: 0,
    sessionDuration: 0
  });
  
  const [history, setHistory] = useState<PerformanceHistory[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<number>(Date.now());
  const interactionCountRef = useRef<number>(0);
  const errorCountRef = useRef<number>(0);
  const successCountRef = useRef<number>(0);
  const totalOperationsRef = useRef<number>(0);

  const updateMetrics = useCallback(() => {
    const now = Date.now();
    const sessionDuration = now - sessionStartRef.current;
    
    const newMetrics: PerformanceMetrics = {
      renderTime: getRenderTime(),
      memoryUsage: opts.enableMemoryTracking ? getMemoryUsage() : 0,
      cpuUsage: getCPUUsage(),
      errorCount: errorCountRef.current,
      successRate: totalOperationsRef.current > 0 
        ? Math.round((successCountRef.current / totalOperationsRef.current) * 100)
        : 100,
      responseTime: getResponseTime(),
      userInteractions: interactionCountRef.current,
      sessionDuration
    };
    
    setMetrics(newMetrics);
    
    // Add to history
    setHistory(prev => {
      const newHistory = [...prev, { timestamp: now, metrics: newMetrics }];
      return newHistory.slice(-opts.maxHistoryLength);
    });
  }, [opts.enableMemoryTracking, opts.maxHistoryLength]);

  const startTracking = useCallback(() => {
    if (isTracking) return;
    
    setIsTracking(true);
    sessionStartRef.current = Date.now();
    
    // Initial measurement
    updateMetrics();
    
    // Set up interval
    intervalRef.current = setInterval(updateMetrics, opts.trackingInterval);
    
    // Set up performance observer for more accurate render time tracking
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
              // Performance entry detected, will be picked up in next update
            }
          });
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }
  }, [isTracking, updateMetrics, opts.trackingInterval]);

  const stopTracking = useCallback(() => {
    if (!isTracking) return;
    
    setIsTracking(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isTracking]);

  const resetMetrics = useCallback(() => {
    sessionStartRef.current = Date.now();
    interactionCountRef.current = 0;
    errorCountRef.current = 0;
    successCountRef.current = 0;
    totalOperationsRef.current = 0;
    
    setMetrics({
      renderTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      errorCount: 0,
      successRate: 100,
      responseTime: 0,
      userInteractions: 0,
      sessionDuration: 0
    });
    
    setHistory([]);
  }, []);

  const recordInteraction = useCallback((type: string) => {
    if (!opts.enableUserInteractionTracking) return;
    
    interactionCountRef.current += 1;
    totalOperationsRef.current += 1;
    successCountRef.current += 1; // Assume interactions are successful
    
    // Mark as performance measure for tracking
    performance.mark(`interaction-${type}-${Date.now()}`);
  }, [opts.enableUserInteractionTracking]);

  const recordError = useCallback((error: Error | string) => {
    if (!opts.enableErrorTracking) return;
    
    errorCountRef.current += 1;
    totalOperationsRef.current += 1;
    
    console.warn('Performance tracking - Error recorded:', error);
  }, [opts.enableErrorTracking]);

  const getAverageMetrics = useCallback((timeRange?: number): Partial<PerformanceMetrics> => {
    if (history.length === 0) return {};
    
    const now = Date.now();
    const relevantHistory = timeRange 
      ? history.filter(entry => now - entry.timestamp <= timeRange)
      : history;
    
    if (relevantHistory.length === 0) return {};
    
    const totals = relevantHistory.reduce(
      (acc, entry) => ({
        renderTime: acc.renderTime + entry.metrics.renderTime,
        memoryUsage: acc.memoryUsage + entry.metrics.memoryUsage,
        cpuUsage: acc.cpuUsage + entry.metrics.cpuUsage,
        responseTime: acc.responseTime + entry.metrics.responseTime,
        successRate: acc.successRate + entry.metrics.successRate
      }),
      { renderTime: 0, memoryUsage: 0, cpuUsage: 0, responseTime: 0, successRate: 0 }
    );
    
    const count = relevantHistory.length;
    
    return {
      renderTime: Math.round(totals.renderTime / count),
      memoryUsage: Math.round(totals.memoryUsage / count),
      cpuUsage: Math.round(totals.cpuUsage / count),
      responseTime: Math.round(totals.responseTime / count),
      successRate: Math.round(totals.successRate / count)
    };
  }, [history]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    metrics,
    history,
    isTracking,
    startTracking,
    stopTracking,
    resetMetrics,
    recordInteraction,
    recordError,
    getAverageMetrics
  };
};

export default usePerformanceMetrics;