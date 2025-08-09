import { useEffect, useCallback, useRef } from 'react';
import PerformanceMonitor from '../utils/performance';

interface UsePerformanceOptions {
  enableLazyLoading?: boolean;
  enableResourceHints?: boolean;
  trackUserInteractions?: boolean;
  memoryThreshold?: number;
}

export const usePerformance = (options: UsePerformanceOptions = {}) => {
  const {
    enableLazyLoading = true,
    enableResourceHints = true,
    trackUserInteractions = true,
    memoryThreshold = 0.8
  } = options;

  const performanceRef = useRef<typeof PerformanceMonitor>();
  const interactionStartTime = useRef<number>(0);

  useEffect(() => {
    performanceRef.current = PerformanceMonitor;

    // Initialize performance optimizations
    if (enableLazyLoading) {
      PerformanceMonitor.setupLazyLoading();
    }

    if (enableResourceHints) {
      PerformanceMonitor.addResourceHints();
    }

    return () => {
      // Cleanup if needed
    };
  }, [enableLazyLoading, enableResourceHints]);

  // Track user interactions for performance impact
  useEffect(() => {
    if (!trackUserInteractions) return;

    const trackInteraction = () => {
      interactionStartTime.current = performance.now();
      
      // Track the next frame to measure interaction response time
      requestAnimationFrame(() => {
        const responseTime = performance.now() - interactionStartTime.current;
        if (responseTime > 100) {
          console.warn(`Slow interaction detected: ${responseTime.toFixed(2)}ms`);
        }
      });
    };

    const events = ['click', 'keydown', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, trackInteraction, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackInteraction);
      });
    };
  }, [trackUserInteractions]);

  // Memory monitoring with custom threshold
  useEffect(() => {
    const checkMemory = () => {
      const metrics = PerformanceMonitor.getMetrics();
      if (metrics.memoryUsed && metrics.memoryTotal) {
        const usage = metrics.memoryUsed / metrics.memoryTotal;
        if (usage > memoryThreshold) {
          console.warn(`Memory usage high: ${(usage * 100).toFixed(1)}%`);
          // Trigger optimization
          return true;
        }
      }
      return false;
    };

    const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [memoryThreshold]);

  const measureFunction = useCallback(<T extends unknown[], R>(
    fn: (...args: T) => R,
    label?: string
  ): ((...args: T) => R) => {
    return (...args: T): R => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      const duration = end - start;
      const functionName = label || fn.name || 'anonymous';
      
      if (duration > 16.67) { // Longer than one frame at 60fps
        console.warn(`Slow function detected: ${functionName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    };
  }, []);

  const measureAsync = useCallback(async <T>(
    promise: Promise<T>,
    label?: string
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await promise;
      const end = performance.now();
      const duration = end - start;
      
      if (label && duration > 1000) {
        console.warn(`Slow async operation: ${label} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      console.error(`Failed async operation (${label}): ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }, []);

  const getMetrics = useCallback(() => {
    return PerformanceMonitor.getMetrics();
  }, []);

  const reportCustomMetric = useCallback((name: string, value: number) => {
    PerformanceMonitor.reportMetric(name, value);
  }, []);

  return {
    measureFunction,
    measureAsync,
    getMetrics,
    reportCustomMetric,
  };
};
