'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      action: string,
      parameters: {
        metric_name?: string;
        metric_value?: number;
        metric_grade?: string;
        name?: string;
        value?: number;
      }
    ) => void;
  }
}

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  customMetrics: Record<string, number>;
}

interface PerformanceGrade {
  lcp: 'good' | 'needs-improvement' | 'poor' | null;
  fid: 'good' | 'needs-improvement' | 'poor' | null;
  cls: 'good' | 'needs-improvement' | 'poor' | null;
  overall: 'good' | 'needs-improvement' | 'poor' | null;
}

const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    customMetrics: {}
  });
  
  const [grades, setGrades] = useState<PerformanceGrade>({
    lcp: null,
    fid: null,
    cls: null,
    overall: null
  });
  
  const observersRef = useRef<PerformanceObserver[]>([]);
  const clsValueRef = useRef(0);
  const customMetricsRef = useRef<Record<string, number>>({});

  // Grade thresholds based on Core Web Vitals
  const getGrade = (metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
      ttfb: { good: 800, poor: 1800 }
    };
    
    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'good';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  // Calculate overall grade
  const calculateOverallGrade = (currentGrades: PerformanceGrade): 'good' | 'needs-improvement' | 'poor' | null => {
    const validGrades = [currentGrades.lcp, currentGrades.fid, currentGrades.cls].filter(Boolean);
    if (validGrades.length === 0) return null;
    
    const poorCount = validGrades.filter(grade => grade === 'poor').length;
    const needsImprovementCount = validGrades.filter(grade => grade === 'needs-improvement').length;
    
    if (poorCount > 0) return 'poor';
    if (needsImprovementCount > 0) return 'needs-improvement';
    return 'good';
  };

  // Update metrics and grades
  const updateMetric = useCallback((metricName: keyof PerformanceMetrics, value: number) => {
    setMetrics(prev => {
      const updated = { ...prev, [metricName]: value };
      
      // Update grades
      if (metricName === 'lcp' || metricName === 'fid' || metricName === 'cls') {
        const newGrades = {
          ...grades,
          [metricName]: getGrade(metricName, value)
        };
        newGrades.overall = calculateOverallGrade(newGrades);
        setGrades(newGrades);
      }
      
      return updated;
    });
  }, [grades]);

  // Measure custom metric
  const measureCustomMetric = (name: string, startTime?: number) => {
    const endTime = performance.now();
    const duration = startTime ? endTime - startTime : endTime;
    
    customMetricsRef.current[name] = duration;
    setMetrics(prev => ({
      ...prev,
      customMetrics: { ...customMetricsRef.current }
    }));
    
    return duration;
  };

  // Start timing a custom metric
  const startTiming = (name: string) => {
    const startTime = performance.now();
    return () => measureCustomMetric(name, startTime);
  };

  // Get performance score (0-100)
  const getPerformanceScore = useCallback((): number => {
    const { lcp, fid, cls } = grades;
    if (!lcp || !fid || !cls) return 0;
    
    const scores = {
      good: 100,
      'needs-improvement': 75,
      poor: 50
    };
    
    const lcpScore = scores[lcp];
    const fidScore = scores[fid];
    const clsScore = scores[cls];
    
    return Math.round((lcpScore + fidScore + clsScore) / 3);
  }, [grades]);

  // Export metrics to analytics
  const exportMetrics = useCallback(() => {
    const metricsData = {
      ...metrics,
      grades,
      score: getPerformanceScore(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Send to analytics service (example)
    if (typeof window !== 'undefined' && window.gtag) {
      Object.entries(metrics).forEach(([key, value]) => {
        if (value !== null && typeof value === 'number') {
          window.gtag!('event', 'performance_metric', {
            metric_name: key,
            metric_value: Math.round(value),
            metric_grade: grades[key as keyof PerformanceGrade] || 'unknown'
          });
        }
      });
    }
    
    return metricsData;
  }, [metrics, grades, getPerformanceScore]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      updateMetric('lcp', lastEntry.startTime);
    });
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observersRef.current.push(lcpObserver);
    } catch {
      console.warn('LCP observer not supported');
    }

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEntry & { processingStart: number };
        if ('processingStart' in fidEntry) {
          const fid = fidEntry.processingStart - fidEntry.startTime;
          updateMetric('fid', fid);
        }
      });
    });
    
    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
      observersRef.current.push(fidObserver);
    } catch {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const clsEntry = entry as PerformanceEntry & { value: number; hadRecentInput?: boolean };
        if ('value' in clsEntry && !clsEntry.hadRecentInput) {
          clsValueRef.current += clsEntry.value;
          updateMetric('cls', clsValueRef.current);
        }
      });
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observersRef.current.push(clsObserver);
    } catch {
      console.warn('CLS observer not supported');
    }

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          updateMetric('fcp', entry.startTime);
        }
      });
    });
    
    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      observersRef.current.push(fcpObserver);
    } catch {
      console.warn('FCP observer not supported');
    }

    // Time to First Byte (TTFB)
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const ttfb = navigationEntries[0].responseStart - navigationEntries[0].requestStart;
      updateMetric('ttfb', ttfb);
    }

    // Cleanup function
    return () => {
      observersRef.current.forEach(observer => {
        try {
          observer.disconnect();
        } catch (error) {
          console.warn('Error disconnecting observer:', error);
        }
      });
      observersRef.current = [];
    };
  }, [updateMetric]);

  // Report metrics when page is about to unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      exportMetrics();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [exportMetrics]);

  return {
    metrics,
    grades,
    score: getPerformanceScore(),
    measureCustomMetric,
    startTiming,
    exportMetrics,
    isGood: grades.overall === 'good',
    needsImprovement: grades.overall === 'needs-improvement',
    isPoor: grades.overall === 'poor'
  };
};

export default usePerformanceMonitoring;
export type { PerformanceMetrics, PerformanceGrade };