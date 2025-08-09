/**
 * Performance Optimization Example
 * Demonstrates how to use the performance monitoring and optimization system
 */

import React, { useEffect, useState, useCallback } from 'react';
import { performanceMonitor } from '../utils/performance';
import { usePerformance } from '../hooks/usePerformance';
import PerformanceDashboard from '../components/PerformanceDashboard';
import { PerformanceTestRunner, type PerformanceTestSuite } from '../tests/performance.test';
import performanceConfig from '../config/performance.json';

const PerformanceOptimizationExample: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [testResults, setTestResults] = useState<PerformanceTestSuite | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Use the performance hook with custom options
  const {
    measureFunction,
    measureAsync,
    getMetrics,
    reportCustomMetric,
  } = usePerformance({
    enableLazyLoading: true,
    enableResourceHints: true,
    trackUserInteractions: true,
    memoryThreshold: 0.8
  });

  useEffect(() => {
    const initializePerformanceOptimization = async () => {
      console.log('🚀 Initializing Performance Optimization System...');

      try {
        // 1. Setup lazy loading for existing images
        setupLazyLoadingForImages();

        // 2. Add resource hints
        performanceMonitor.addResourceHints();

        // 3. Register service worker for caching
        await registerServiceWorker();

        // 4. Setup performance monitoring
        setupPerformanceMonitoring();

        // 5. Initialize analytics tracking
        setupAnalyticsTracking();

        setIsInitialized(true);
        console.log('✅ Performance optimization system initialized');

        // 6. Run initial performance test
        if (performanceConfig.performance.testing.autoRun) {
          setTimeout(runPerformanceTests, 2000);
        }

      } catch (error) {
        console.error('❌ Failed to initialize performance optimization:', error);
      }
    };

    initializePerformanceOptimization();
  }, []);

  const setupLazyLoadingForImages = () => {
    // Convert existing images to lazy loading
    const images = document.querySelectorAll('img:not([data-src])');
    images.forEach((element) => {
      const img = element as HTMLImageElement;
      if (img.src && !img.complete) {
        img.dataset.src = img.src;
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        img.classList.add('lazy-load');
      }
    });

    performanceMonitor.setupLazyLoading();
    console.log(`📷 Lazy loading setup for ${images.length} images`);
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('🔧 Service Worker registered:', registration.scope);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('🔄 Service Worker update found');
        });

      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }
  };

  const setupPerformanceMonitoring = () => {
    // Report custom metrics
    reportCustomMetric('app_initialization', performance.now());

    // Setup periodic reporting
    setInterval(() => {
      const metrics = getMetrics();
      if (Object.keys(metrics).length > 0) {
        reportCustomMetric('metrics_collected', Date.now());
      }
    }, performanceConfig.performance.monitoring.reportInterval);
  };

  const setupAnalyticsTracking = () => {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        reportCustomMetric('page_hidden', performance.now());
      } else {
        reportCustomMetric('page_visible', performance.now());
      }
    });

    // Track connection changes
    if ('connection' in navigator) {
      const connection = (navigator as Navigator & {
        connection?: {
          downlink?: number;
          effectiveType?: string;
        };
      }).connection;
      
      if (connection) {
        reportCustomMetric('connection_speed', connection.downlink || 0);
        reportCustomMetric('connection_type', connection.effectiveType === '4g' ? 4 : 3);
      }
    }
  };

  const runPerformanceTests = async () => {
    console.log('🧪 Running performance tests...');
    const testRunner = new PerformanceTestRunner();
    const results = await testRunner.runFullSuite();
    setTestResults(results);
  };

  const optimizePerformance = async () => {
    console.log('⚡ Running performance optimizations...');

    try {
      // Clear old caches
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        name.includes('old-version') || name.includes('v0')
      );
      
      await Promise.all(oldCaches.map(name => caches.delete(name)));
      console.log(`🗑️ Cleared ${oldCaches.length} old caches`);

      // Trigger garbage collection if available
      if (window.gc) {
        window.gc();
        console.log('🧹 Triggered garbage collection');
      }

      // Optimize images
      const images = document.querySelectorAll('img');
      images.forEach((element) => {
        const img = element as HTMLImageElement;
        if (img.src && !img.loading) {
          img.loading = 'lazy';
        }
      });

      // Re-run tests to see improvements
      setTimeout(runPerformanceTests, 1000);

    } catch (error) {
      console.error('❌ Performance optimization failed:', error);
    }
  };

  const exportPerformanceReport = () => {
    const metrics = getMetrics();
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      testResults,
      config: performanceConfig.performance,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Performance Optimization System
        </h1>
        <p className="text-gray-600 mb-6">
          Real-time performance monitoring, optimization, and testing for modern web applications.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showDashboard ? 'Hide' : 'Show'} Dashboard
          </button>
          
          <button
            onClick={runPerformanceTests}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Run Tests
          </button>
          
          <button
            onClick={optimizePerformance}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Optimize Performance
          </button>
          
          <button
            onClick={exportPerformanceReport}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Export Report
          </button>
        </div>

        {!isInitialized && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-3"></div>
              <span className="text-yellow-800">Initializing performance optimization system...</span>
            </div>
          </div>
        )}

        {isInitialized && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <span className="text-green-800">Performance optimization system is active</span>
            </div>
          </div>
        )}
      </div>

      {showDashboard && (
        <div className="mb-8">
          <PerformanceDashboard />
        </div>
      )}

      {testResults && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                testResults.overall.grade === 'A' ? 'text-green-600' :
                testResults.overall.grade === 'B' ? 'text-blue-600' :
                testResults.overall.grade === 'C' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {testResults.overall.grade}
              </div>
              <div className="text-sm text-gray-600">Overall Grade</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {testResults.overall.score.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {testResults.webVitals.length + testResults.customMetrics.length + testResults.optimizations.length}
              </div>
              <div className="text-sm text-gray-600">Tests Run</div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {testResults.overall.summary}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Monitoring</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Web Vitals (LCP, FID, CLS)</li>
              <li>✅ Custom metrics tracking</li>
              <li>✅ Memory usage monitoring</li>
              <li>✅ Real-time performance dashboard</li>
              <li>✅ User interaction tracking</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Optimization</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Lazy loading implementation</li>
              <li>✅ Resource hints (preconnect, dns-prefetch)</li>
              <li>✅ Service Worker caching</li>
              <li>✅ Memory optimization</li>
              <li>✅ Automated performance testing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizationExample;
