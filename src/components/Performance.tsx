import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Eye, EyeOff, Cpu, Clock, Zap } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
}

interface PerformanceProps {
  className?: string;
}

const Performance: React.FC<PerformanceProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0
  });
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef(performance.now());

  // Calculate FPS
  const calculateFPS = () => {
    const now = performance.now();
    frameCountRef.current++;
    
    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      setMetrics(prev => ({ ...prev, fps }));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
    
    animationFrameRef.current = requestAnimationFrame(calculateFPS);
  };

  // Get memory usage in MB
  const getMemoryUsage = (): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory as {
        usedJSHeapSize?: number;
        totalJSHeapSize?: number;
        jsHeapSizeLimit?: number;
      };
      if (memory && typeof memory.usedJSHeapSize === 'number') {
        return Math.round(memory.usedJSHeapSize / 1024 / 1024);
      }
    }
    return 0;
  };

  // Calculate load time
  const getLoadTime = (): number => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      return Math.round(navigation.loadEventEnd - navigation.fetchStart);
    }
    return 0;
  };

  // Calculate render time
  const getRenderTime = (): number => {
    return Math.round(performance.now() - startTimeRef.current);
  };

  useEffect(() => {
    // Initialize metrics
    setMetrics({
      fps: 60, // Initial estimate
      memoryUsage: getMemoryUsage(),
      loadTime: getLoadTime(),
      renderTime: getRenderTime()
    });

    // Start FPS monitoring
    animationFrameRef.current = requestAnimationFrame(calculateFPS);

    // Update memory usage periodically
    const memoryInterval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        memoryUsage: getMemoryUsage(),
        renderTime: getRenderTime()
      }));
    }, 1000);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(memoryInterval);
    };
  }, []);

  const getPerformanceColor = (value: number, type: 'fps' | 'memory' | 'load') => {
    switch (type) {
      case 'fps':
        if (value >= 55) return 'text-emerald-400';
        if (value >= 30) return 'text-yellow-400';
        return 'text-red-400';
      case 'memory':
        if (value <= 50) return 'text-emerald-400';
        if (value <= 100) return 'text-yellow-400';
        return 'text-red-400';
      case 'load':
        if (value <= 1000) return 'text-emerald-400';
        if (value <= 3000) return 'text-yellow-400';
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 MB';
    return `${bytes} MB`;
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className={`fixed top-6 right-6 z-40 ${className}`}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mb-4 w-64"
          >
            <div className="glass p-4 border border-emerald-500/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">
                    Performance
                  </span>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                {/* FPS */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-300">FPS</span>
                  </div>
                  <span className={`text-sm font-mono ${getPerformanceColor(metrics.fps, 'fps')}`}>
                    {metrics.fps}
                  </span>
                </div>

                {/* Memory Usage */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-300">Memory</span>
                  </div>
                  <span className={`text-sm font-mono ${getPerformanceColor(metrics.memoryUsage, 'memory')}`}>
                    {formatBytes(metrics.memoryUsage)}
                  </span>
                </div>

                {/* Load Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-300">Load</span>
                  </div>
                  <span className={`text-sm font-mono ${getPerformanceColor(metrics.loadTime, 'load')}`}>
                    {formatTime(metrics.loadTime)}
                  </span>
                </div>

                {/* Render Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-300">Render</span>
                  </div>
                  <span className="text-sm font-mono text-gray-400">
                    {formatTime(metrics.renderTime)}
                  </span>
                </div>
              </div>

              {/* Performance Bars */}
              <div className="mt-3 space-y-2">
                {/* FPS Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Frame Rate</span>
                    <span className={getPerformanceColor(metrics.fps, 'fps')}>
                      {Math.round((metrics.fps / 60) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        metrics.fps >= 55 ? 'bg-emerald-500' :
                        metrics.fps >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((metrics.fps / 60) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Memory Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Memory Usage</span>
                    <span className={getPerformanceColor(metrics.memoryUsage, 'memory')}>
                      {Math.round((metrics.memoryUsage / 200) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        metrics.memoryUsage <= 50 ? 'bg-emerald-500' :
                        metrics.memoryUsage <= 100 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((metrics.memoryUsage / 200) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="glass w-12 h-12 rounded-full flex items-center justify-center border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle performance monitor"
      >
        {isVisible ? (
          <EyeOff className="w-5 h-5 text-emerald-400" />
        ) : (
          <Eye className="w-5 h-5 text-emerald-400" />
        )}
      </motion.button>
    </div>
  );
};

export default Performance;