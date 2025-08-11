import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  cpu: number;
  renderTime: number;
  frameDrops: number;
  totalFrames: number;
  averageFps: number;
  memoryPeak: number;
  loadTime: number;
  userInteractions: number;
  errorCount: number;
  warningCount: number;
}

interface PerformanceConfig {
  trackingInterval: number;
  enableMemoryTracking: boolean;
  enableUserInteractionTracking: boolean;
  enableErrorTracking: boolean;
  enableDetailedMetrics: boolean;
  maxHistorySize: number;
  alertThresholds: {
    lowFps: number;
    highMemory: number;
    highCpu: number;
  };
}

interface PerformanceAlert {
  type: 'fps' | 'memory' | 'cpu' | 'error';
  message: string;
  timestamp: Date;
  value: number;
  threshold: number;
}

interface PerformanceHistory {
  timestamp: Date;
  metrics: PerformanceMetrics;
}

const defaultConfig: PerformanceConfig = {
  trackingInterval: 1000,
  enableMemoryTracking: true,
  enableUserInteractionTracking: true,
  enableErrorTracking: true,
  enableDetailedMetrics: false,
  maxHistorySize: 100,
  alertThresholds: {
    lowFps: 30,
    highMemory: 100, // MB
    highCpu: 80 // %
  }
};

export const usePerformanceMetrics = (config: Partial<PerformanceConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    cpu: 0,
    renderTime: 0,
    frameDrops: 0,
    totalFrames: 0,
    averageFps: 0,
    memoryPeak: 0,
    loadTime: 0,
    userInteractions: 0,
    errorCount: 0,
    warningCount: 0
  });
  
  const [isTracking, setIsTracking] = useState(false);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [history, setHistory] = useState<PerformanceHistory[]>([]);
  
  // Refs for tracking
  const trackingInterval = useRef<NodeJS.Timeout | null>(null);
  const frameCount = useRef(0);
  const lastFrameTime = useRef(performance.now());
  const frameDropCount = useRef(0);
  const totalFrameCount = useRef(0);
  const startTime = useRef<number | null>(null);
  const interactionCount = useRef(0);
  const errorCountRef = useRef(0);
  const warningCountRef = useRef(0);
  const memoryPeakRef = useRef(0);
  
  // Performance observer for detailed metrics
  const performanceObserver = useRef<PerformanceObserver | null>(null);
  
  // FPS calculation
  const calculateFPS = useCallback(() => {
    const now = performance.now();
    const delta = now - lastFrameTime.current;
    
    if (delta >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / delta);
      frameCount.current = 0;
      lastFrameTime.current = now;
      return fps;
    }
    
    frameCount.current++;
    totalFrameCount.current++;
    
    return null;
  }, []);
  
  // Memory usage calculation
  const getMemoryUsage = useCallback((): number => {
    if (!finalConfig.enableMemoryTracking) return 0;
    
    try {
      // @ts-ignore - performance.memory is not in all browsers
      if (performance.memory) {
        // @ts-ignore
        const memoryMB = performance.memory.usedJSHeapSize / 1024 / 1024;
        memoryPeakRef.current = Math.max(memoryPeakRef.current, memoryMB);
        return Math.round(memoryMB);
      }
    } catch (error) {
      console.warn('Memory tracking not supported:', error);
    }
    
    return 0;
  }, [finalConfig.enableMemoryTracking]);
  
  // CPU usage estimation (simplified)
  const estimateCPUUsage = useCallback((): number => {
    try {
      const start = performance.now();
      
      // Simple CPU-intensive operation for estimation
      let iterations = 0;
      const maxTime = 5; // 5ms max
      
      while (performance.now() - start < maxTime) {
        iterations++;
      }
      
      const actualTime = performance.now() - start;
      const efficiency = iterations / actualTime;
      
      // Normalize to percentage (this is a rough estimation)
      const cpuUsage = Math.min(100, Math.max(0, 100 - (efficiency / 1000)));
      
      return Math.round(cpuUsage);
    } catch (error) {
      return 0;
    }
  }, []);
  
  // Check for performance alerts
  const checkAlerts = useCallback((currentMetrics: PerformanceMetrics) => {
    const newAlerts: PerformanceAlert[] = [];
    
    // FPS alert
    if (currentMetrics.fps > 0 && currentMetrics.fps < finalConfig.alertThresholds.lowFps) {
      newAlerts.push({
        type: 'fps',
        message: `Low FPS detected: ${currentMetrics.fps}`,
        timestamp: new Date(),
        value: currentMetrics.fps,
        threshold: finalConfig.alertThresholds.lowFps
      });
    }
    
    // Memory alert
    if (currentMetrics.memory > finalConfig.alertThresholds.highMemory) {
      newAlerts.push({
        type: 'memory',
        message: `High memory usage: ${currentMetrics.memory}MB`,
        timestamp: new Date(),
        value: currentMetrics.memory,
        threshold: finalConfig.alertThresholds.highMemory
      });
    }
    
    // CPU alert
    if (currentMetrics.cpu > finalConfig.alertThresholds.highCpu) {
      newAlerts.push({
        type: 'cpu',
        message: `High CPU usage: ${currentMetrics.cpu}%`,
        timestamp: new Date(),
        value: currentMetrics.cpu,
        threshold: finalConfig.alertThresholds.highCpu
      });
    }
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts].slice(-10)); // Keep last 10 alerts
    }
  }, [finalConfig.alertThresholds]);
  
  // Update metrics
  const updateMetrics = useCallback(() => {
    if (!isTracking) return;
    
    const fps = calculateFPS();
    const memory = getMemoryUsage();
    const cpu = estimateCPUUsage();
    
    if (fps !== null) {
      const currentTime = performance.now();
      const loadTime = startTime.current ? currentTime - startTime.current : 0;
      const averageFps = totalFrameCount.current > 0 ? 
        (totalFrameCount.current / (loadTime / 1000)) : 0;
      
      const newMetrics: PerformanceMetrics = {
        fps,
        memory,
        cpu,
        renderTime: currentTime - lastFrameTime.current,
        frameDrops: frameDropCount.current,
        totalFrames: totalFrameCount.current,
        averageFps: Math.round(averageFps),
        memoryPeak: memoryPeakRef.current,
        loadTime: Math.round(loadTime),
        userInteractions: interactionCount.current,
        errorCount: errorCountRef.current,
        warningCount: warningCountRef.current
      };
      
      setMetrics(newMetrics);
      checkAlerts(newMetrics);
      
      // Add to history
      setHistory(prev => {
        const newHistory = [...prev, {
          timestamp: new Date(),
          metrics: newMetrics
        }];
        
        // Keep only recent history
        return newHistory.slice(-finalConfig.maxHistorySize);
      });
    }
  }, [isTracking, calculateFPS, getMemoryUsage, estimateCPUUsage, checkAlerts, finalConfig.maxHistorySize]);
  
  // Track user interactions
  const trackUserInteraction = useCallback(() => {
    if (finalConfig.enableUserInteractionTracking) {
      interactionCount.current++;
    }
  }, [finalConfig.enableUserInteractionTracking]);
  
  // Track errors
  const trackError = useCallback((error: Error) => {
    if (finalConfig.enableErrorTracking) {
      errorCountRef.current++;
      
      setAlerts(prev => [...prev, {
        type: 'error',
        message: `Error: ${error.message}`,
        timestamp: new Date(),
        value: errorCountRef.current,
        threshold: 0
      }].slice(-10));
    }
  }, [finalConfig.enableErrorTracking]);
  
  // Track warnings
  const trackWarning = useCallback((message: string) => {
    if (finalConfig.enableErrorTracking) {
      warningCountRef.current++;
    }
  }, [finalConfig.enableErrorTracking]);
  
  // Start tracking
  const startTracking = useCallback(() => {
    if (isTracking) return;
    
    setIsTracking(true);
    startTime.current = performance.now();
    frameCount.current = 0;
    totalFrameCount.current = 0;
    frameDropCount.current = 0;
    interactionCount.current = 0;
    errorCountRef.current = 0;
    warningCountRef.current = 0;
    memoryPeakRef.current = 0;
    lastFrameTime.current = performance.now();
    
    // Start tracking interval
    trackingInterval.current = setInterval(updateMetrics, finalConfig.trackingInterval);
    
    // Setup performance observer for detailed metrics
    if (finalConfig.enableDetailedMetrics && 'PerformanceObserver' in window) {
      try {
        performanceObserver.current = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
              // Track detailed performance metrics
              console.log('Performance entry:', entry);
            }
          });
        });
        
        performanceObserver.current.observe({ 
          entryTypes: ['measure', 'navigation', 'resource'] 
        });
      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }
    }
    
    // Setup user interaction tracking
    if (finalConfig.enableUserInteractionTracking) {
      const events = ['click', 'keydown', 'touchstart', 'scroll'];
      events.forEach(event => {
        document.addEventListener(event, trackUserInteraction, { passive: true });
      });
    }
    
    // Setup error tracking
    if (finalConfig.enableErrorTracking) {
      window.addEventListener('error', (event) => {
        trackError(event.error || new Error(event.message));
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        trackError(new Error(event.reason));
      });
    }
  }, [isTracking, finalConfig, updateMetrics, trackUserInteraction, trackError]);
  
  // Stop tracking
  const stopTracking = useCallback(() => {
    if (!isTracking) return;
    
    setIsTracking(false);
    
    if (trackingInterval.current) {
      clearInterval(trackingInterval.current);
      trackingInterval.current = null;
    }
    
    if (performanceObserver.current) {
      performanceObserver.current.disconnect();
      performanceObserver.current = null;
    }
    
    // Remove event listeners
    if (finalConfig.enableUserInteractionTracking) {
      const events = ['click', 'keydown', 'touchstart', 'scroll'];
      events.forEach(event => {
        document.removeEventListener(event, trackUserInteraction);
      });
    }
  }, [isTracking, finalConfig.enableUserInteractionTracking, trackUserInteraction]);
  
  // Reset metrics
  const resetMetrics = useCallback(() => {
    setMetrics({
      fps: 0,
      memory: 0,
      cpu: 0,
      renderTime: 0,
      frameDrops: 0,
      totalFrames: 0,
      averageFps: 0,
      memoryPeak: 0,
      loadTime: 0,
      userInteractions: 0,
      errorCount: 0,
      warningCount: 0
    });
    
    setAlerts([]);
    setHistory([]);
    
    frameCount.current = 0;
    totalFrameCount.current = 0;
    frameDropCount.current = 0;
    interactionCount.current = 0;
    errorCountRef.current = 0;
    warningCountRef.current = 0;
    memoryPeakRef.current = 0;
    startTime.current = null;
  }, []);
  
  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    const recentHistory = history.slice(-10);
    
    if (recentHistory.length === 0) {
      return {
        averageFps: 0,
        averageMemory: 0,
        averageCpu: 0,
        totalAlerts: alerts.length,
        uptime: 0,
        stability: 'unknown'
      };
    }
    
    const avgFps = recentHistory.reduce((sum, h) => sum + h.metrics.fps, 0) / recentHistory.length;
    const avgMemory = recentHistory.reduce((sum, h) => sum + h.metrics.memory, 0) / recentHistory.length;
    const avgCpu = recentHistory.reduce((sum, h) => sum + h.metrics.cpu, 0) / recentHistory.length;
    
    const uptime = startTime.current ? performance.now() - startTime.current : 0;
    
    let stability = 'excellent';
    if (avgFps < 30 || avgMemory > 100 || avgCpu > 80) {
      stability = 'poor';
    } else if (avgFps < 45 || avgMemory > 75 || avgCpu > 60) {
      stability = 'fair';
    } else if (avgFps < 55 || avgMemory > 50 || avgCpu > 40) {
      stability = 'good';
    }
    
    return {
      averageFps: Math.round(avgFps),
      averageMemory: Math.round(avgMemory),
      averageCpu: Math.round(avgCpu),
      totalAlerts: alerts.length,
      uptime: Math.round(uptime),
      stability
    };
  }, [history, alerts, startTime]);
  
  // Export performance data
  const exportPerformanceData = useCallback(() => {
    const data = {
      metrics,
      history,
      alerts,
      summary: getPerformanceSummary(),
      config: finalConfig,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance_metrics_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [metrics, history, alerts, getPerformanceSummary, finalConfig]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);
  
  return {
    // State
    metrics,
    isTracking,
    alerts,
    history,
    
    // Actions
    startTracking,
    stopTracking,
    resetMetrics,
    trackError,
    trackWarning,
    trackUserInteraction,
    
    // Data
    getPerformanceSummary,
    exportPerformanceData,
    
    // Config
    config: finalConfig
  };
};

export type { 
  PerformanceMetrics, 
  PerformanceConfig, 
  PerformanceAlert, 
  PerformanceHistory 
};