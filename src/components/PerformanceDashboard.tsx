import React, { useState, useEffect } from 'react';
import { performanceMonitor } from '../utils/performance';

interface PerformanceData {
  LCP?: number;
  FID?: number;
  CLS?: number;
  loadTime?: number;
  renderTime?: number;
  memoryUsed?: number;
  memoryTotal?: number;
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceData>({});
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentMetrics = performanceMonitor.getMetrics();
      setMetrics(currentMetrics);
    }, 1000);

    setIsMonitoring(true);

    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, []);

  const formatMemory = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatTime = (ms?: number): string => {
    if (!ms) return 'N/A';
    return `${ms.toFixed(2)} ms`;
  };

  const getScoreColor = (value: number, thresholds: { good: number; poor: number }): string => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWebVitalScore = (metric: string, value?: number): string => {
    if (!value) return 'text-gray-400';
    
    switch (metric) {
      case 'LCP':
        return getScoreColor(value, { good: 2500, poor: 4000 });
      case 'FID':
        return getScoreColor(value, { good: 100, poor: 300 });
      case 'CLS':
        return getScoreColor(value, { good: 0.1, poor: 0.25 });
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Performance Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isMonitoring ? 'Monitoring' : 'Stopped'}
          </span>
        </div>
      </div>

      {/* Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Largest Contentful Paint (LCP)</h3>
          <p className={`text-2xl font-bold ${getWebVitalScore('LCP', metrics.LCP)}`}>
            {formatTime(metrics.LCP)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Good: ≤2.5s, Poor: &gt;4.0s</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-2">First Input Delay (FID)</h3>
          <p className={`text-2xl font-bold ${getWebVitalScore('FID', metrics.FID)}`}>
            {formatTime(metrics.FID)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Good: ≤100ms, Poor: &gt;300ms</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800 mb-2">Cumulative Layout Shift (CLS)</h3>
          <p className={`text-2xl font-bold ${getWebVitalScore('CLS', metrics.CLS)}`}>
            {metrics.CLS?.toFixed(3) || 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Good: ≤0.1, Poor: &gt;0.25</p>
        </div>
      </div>

      {/* Custom Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Page Load Time</h3>
          <p className="text-xl font-bold text-gray-700">{formatTime(metrics.loadTime)}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Render Time</h3>
          <p className="text-xl font-bold text-gray-700">{formatTime(metrics.renderTime)}</p>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-orange-800 mb-2">Memory Usage</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-orange-700">
              {formatMemory(metrics.memoryUsed)} / {formatMemory(metrics.memoryTotal)}
            </p>
            <p className="text-xs text-gray-500">
              {metrics.memoryUsed && metrics.memoryTotal 
                ? `${((metrics.memoryUsed / metrics.memoryTotal) * 100).toFixed(1)}% used`
                : 'Memory monitoring not available'
              }
            </p>
          </div>
          {metrics.memoryUsed && metrics.memoryTotal && (
            <div className="memory-bar-container">
              <div 
                className="memory-bar"
                ref={(el) => {
                  if (el) {
                    const percentage = Math.min((metrics.memoryUsed! / metrics.memoryTotal!) * 100, 100);
                    el.style.setProperty('--memory-width', `${percentage}%`);
                  }
                }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Performance Tips</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Enable lazy loading for images to improve LCP</li>
          <li>• Minimize JavaScript execution time to reduce FID</li>
          <li>• Use CSS transforms instead of layout-triggering properties</li>
          <li>• Implement resource hints for faster loading</li>
          <li>• Monitor memory usage to prevent memory leaks</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
