import React, { useState, useEffect, useRef } from 'react';
import PerformanceOptimizer from '../utils/performance.js';
import '../css/performance.css';

const PerformanceOptimizerDemo = () => {
  const [optimizer, setOptimizer] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [networkQuality, setNetworkQuality] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(null);
  const optimizerRef = useRef(null);

  useEffect(() => {
    // Initialize Performance Optimizer
    const performanceOptimizer = new PerformanceOptimizer({
      enableWebVitals: true,
      enableLazyLoading: true,
      enableResourceOptimization: true,
      enableImageOptimization: true,
      enableServiceWorker: false, // Disabled for demo
      analyticsEndpoint: null, // Would be your analytics endpoint
      lazyLoading: {
        rootMargin: '50px 0px',
        threshold: 0.1,
        enableImages: true,
        enableComponents: true
      },
      imageOptimization: {
        quality: 80,
        webpSupport: true,
        cdnBaseUrl: ''
      }
    });

    setOptimizer(performanceOptimizer);
    optimizerRef.current = performanceOptimizer;

    // Listen for performance alerts
    const handlePerformanceAlert = (event) => {
      const { metric, value, status } = event.detail;
      const newAlert = {
        id: Date.now(),
        metric,
        value,
        status,
        timestamp: new Date().toLocaleTimeString()
      };
      setAlerts(prev => [newAlert, ...prev.slice(0, 4)]); // Keep last 5 alerts
    };

    document.addEventListener('performance-alert', handlePerformanceAlert);

    // Update metrics periodically
    const metricsInterval = setInterval(() => {
      if (optimizerRef.current) {
        const currentMetrics = optimizerRef.current.getMetrics();
        setMetrics(currentMetrics);
        
        // Update network quality
        const networkData = currentMetrics.customMetrics?.networkQuality;
        if (networkData) {
          setNetworkQuality(networkData);
        }
        
        // Update memory usage
        const memoryData = currentMetrics.customMetrics?.memoryUsage;
        if (memoryData) {
          setMemoryUsage(memoryData);
        }
      }
    }, 2000);

    setIsMonitoring(true);

    return () => {
      document.removeEventListener('performance-alert', handlePerformanceAlert);
      clearInterval(metricsInterval);
      if (optimizerRef.current) {
        optimizerRef.current.destroy();
      }
    };
  }, []);

  const formatMetric = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') {
      return value < 1000 ? `${value.toFixed(1)}ms` : `${(value / 1000).toFixed(2)}s`;
    }
    return value.toString();
  };

  const getMetricStatus = (metric, value) => {
    if (value === null || value === undefined) return '';
    
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return '';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const triggerLongTask = () => {
    // Simulate a long task for demonstration
    const start = performance.now();
    while (performance.now() - start < 100) {
      // Busy wait to create a long task
    }
  };

  const loadLargeImage = () => {
    // Create a large image to test lazy loading
    const img = document.createElement('img');
    img.src = 'https://picsum.photos/1920/1080?random=' + Date.now();
    img.className = 'responsive-image';
    img.loading = 'lazy';
    
    const container = document.getElementById('dynamic-content');
    if (container) {
      container.appendChild(img);
    }
  };

  return (
    <div className="performance-demo">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Performance Optimizer Demo
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Real-time performance monitoring and optimization
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <span className={`px-3 py-1 rounded-full text-sm ${
              isMonitoring ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isMonitoring ? '🟢 Monitoring Active' : '🔴 Monitoring Inactive'}
            </span>
          </div>
        </header>

        {/* Web Vitals Dashboard */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">📊 Web Vitals Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['FCP', 'LCP', 'FID', 'CLS', 'TTFB'].map((metric) => (
              <div key={metric} className="bg-white rounded-lg shadow-md p-6 border">
                <h3 className="text-lg font-semibold mb-2">{metric}</h3>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold performance-metric-value ${
                    getMetricStatus(metric, metrics[metric])
                  }`}>
                    {formatMetric(metrics[metric])}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${
                    getMetricStatus(metric, metrics[metric]) === 'good' ? 'bg-green-400' :
                    getMetricStatus(metric, metrics[metric]) === 'needs-improvement' ? 'bg-yellow-400' :
                    getMetricStatus(metric, metrics[metric]) === 'poor' ? 'bg-red-400' : 'bg-gray-300'
                  }`}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {metric === 'FCP' && 'First Contentful Paint'}
                  {metric === 'LCP' && 'Largest Contentful Paint'}
                  {metric === 'FID' && 'First Input Delay'}
                  {metric === 'CLS' && 'Cumulative Layout Shift'}
                  {metric === 'TTFB' && 'Time to First Byte'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* System Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">💻 System Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Network Quality */}
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-lg font-semibold mb-4">🌐 Network Quality</h3>
              {networkQuality ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Connection Type:</span>
                    <span className="font-mono">{networkQuality.effectiveType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downlink:</span>
                    <span className="font-mono">{networkQuality.downlink} Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RTT:</span>
                    <span className="font-mono">{networkQuality.rtt}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Save Data:</span>
                    <span className={`font-mono ${networkQuality.saveData ? 'text-orange-600' : 'text-green-600'}`}>
                      {networkQuality.saveData ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Network information not available</p>
              )}
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-lg font-semibold mb-4">🧠 Memory Usage</h3>
              {memoryUsage ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Used:</span>
                    <span className="font-mono">{(memoryUsage.used / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-mono">{(memoryUsage.total / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limit:</span>
                    <span className="font-mono">{(memoryUsage.limit / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(memoryUsage.used / memoryUsage.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Memory information not available</p>
              )}
            </div>
          </div>
        </section>

        {/* Performance Alerts */}
        {alerts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">⚠️ Performance Alerts</h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-red-800">
                      {alert.metric} Performance Issue
                    </div>
                    <div className="text-sm text-red-600">
                      Value: {formatMetric(alert.value)} (Status: {alert.status})
                    </div>
                    <div className="text-xs text-red-500">
                      {alert.timestamp}
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Demo Controls */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🎛️ Demo Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={triggerLongTask}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Trigger Long Task
            </button>
            <button
              onClick={loadLargeImage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Load Large Image
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </section>

        {/* Lazy Loading Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🖼️ Lazy Loading Demo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  data-src={`https://picsum.photos/400/300?random=${i}`}
                  alt={`Lazy loaded image ${i}`}
                  className="lazy-placeholder w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-semibold">Image {i}</h3>
                  <p className="text-sm text-gray-600">This image loads lazily</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">💡 Performance Optimization Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-lg font-semibold mb-4 text-green-600">✅ Enabled Features</h3>
              <ul className="space-y-2 text-sm">
                <li>• Web Vitals monitoring (FCP, LCP, FID, CLS, TTFB)</li>
                <li>• Lazy loading for images and components</li>
                <li>• Resource preloading and prefetching</li>
                <li>• DNS prefetch for external domains</li>
                <li>• Image optimization with WebP/AVIF support</li>
                <li>• Progressive image loading</li>
                <li>• Long task monitoring</li>
                <li>• Memory usage tracking</li>
                <li>• Network quality detection</li>
                <li>• Performance budget alerts</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">📈 Performance Benefits</h3>
              <ul className="space-y-2 text-sm">
                <li>• Faster page load times</li>
                <li>• Reduced bandwidth usage</li>
                <li>• Better user experience</li>
                <li>• Improved SEO rankings</li>
                <li>• Lower bounce rates</li>
                <li>• Enhanced mobile performance</li>
                <li>• Real-time performance insights</li>
                <li>• Automatic optimization</li>
                <li>• Progressive enhancement</li>
                <li>• Cross-browser compatibility</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Dynamic Content Area */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🔄 Dynamic Content</h2>
          <div id="dynamic-content" className="bg-gray-50 rounded-lg p-6 min-h-32">
            <p className="text-gray-600">Dynamic images will appear here when you click "Load Large Image"</p>
          </div>
        </section>

        {/* Code Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">📝 Implementation Example</h2>
          <div className="bg-gray-900 text-green-400 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm">
{`// Initialize Performance Optimizer
import PerformanceOptimizer from './utils/performance.js';

const optimizer = new PerformanceOptimizer({
  enableWebVitals: true,
  enableLazyLoading: true,
  enableResourceOptimization: true,
  enableImageOptimization: true,
  analyticsEndpoint: '/api/analytics'
});

// Listen for performance alerts
document.addEventListener('performance-alert', (event) => {
  const { metric, value, status } = event.detail;
  console.warn(\`Performance Alert: \${metric} is \${status}\`);
});

// Get current metrics
const metrics = optimizer.getMetrics();
console.log('Current Web Vitals:', metrics);`}
            </pre>
          </div>
        </section>
      </div>

      {/* Performance Indicator (if optimizer is loaded) */}
      {optimizer && (
        <div className="performance-indicator">
          <div className="text-xs font-bold mb-2">Performance Monitor</div>
          {Object.entries(metrics).map(([key, value]) => {
            if (key === 'customMetrics' || value === null) return null;
            return (
              <div key={key} className="performance-metric">
                <span className="performance-metric-name">{key}:</span>
                <span className={`performance-metric-value ${getMetricStatus(key, value)}`}>
                  {formatMetric(value)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PerformanceOptimizerDemo;
