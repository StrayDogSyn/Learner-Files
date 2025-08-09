'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  Eye, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  X,
  BarChart3,
  Settings
} from 'lucide-react';
import usePerformanceMonitoring from '@/hooks/usePerformanceMonitoring';
import { Button } from '@/components/atoms/Button/Button';
import { Glass } from '@/components/atoms/Glass/Glass';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number | null;
  unit: string;
  grade: 'good' | 'needs-improvement' | 'poor' | null;
  icon: React.ReactNode;
  description: string;
  threshold: { good: number; poor: number };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  grade,
  icon,
  description,
  threshold
}) => {
  const getGradeColor = (grade: string | null) => {
    switch (grade) {
      case 'good': return 'text-green-500';
      case 'needs-improvement': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getGradeIcon = (grade: string | null) => {
    switch (grade) {
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'needs-improvement': return <AlertTriangle className="w-4 h-4" />;
      case 'poor': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatValue = (val: number | null) => {
    if (val === null) return '—';
    if (unit === 'ms') return Math.round(val);
    if (unit === 'score') return Math.round(val * 1000) / 1000;
    return val;
  };

  return (
    <Glass
      config="card"
      className="p-6 hover:scale-105 transition-transform duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn('p-2 rounded-lg', getGradeColor(grade))}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
        <div className={cn('flex items-center space-x-1', getGradeColor(grade))}>
          {getGradeIcon(grade)}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatValue(value)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Good: &lt;{threshold.good}{unit}</span>
            <span>Poor: &gt;{threshold.poor}{unit}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className={cn(
                'h-2 rounded-full transition-all duration-500',
                grade === 'good' && 'bg-green-500',
                grade === 'needs-improvement' && 'bg-yellow-500',
                grade === 'poor' && 'bg-red-500',
                !grade && 'bg-gray-400'
              )}
              initial={{ width: 0 }}
              animate={{ 
                width: value ? `${Math.min((value / threshold.poor) * 100, 100)}%` : '0%' 
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </Glass>
  );
};

interface PerformanceDashboardProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  isVisible = false,
  onClose
}) => {
  const {
    metrics,
    grades,
    score,
    exportMetrics,
    isGood,
    needsImprovement,
    isPoor
  } = usePerformanceMonitoring();
  
  const [showDetails, setShowDetails] = useState(false);
  const [customMetrics, setCustomMetrics] = useState<Record<string, number>>({});

  // Update custom metrics display
  useEffect(() => {
    setCustomMetrics(metrics.customMetrics);
  }, [metrics.customMetrics]);

  const coreMetrics = [
    {
      title: 'Largest Contentful Paint',
      value: metrics.lcp,
      unit: 'ms',
      grade: grades.lcp,
      icon: <Eye className="w-5 h-5" />,
      description: 'Loading performance',
      threshold: { good: 2500, poor: 4000 }
    },
    {
      title: 'First Input Delay',
      value: metrics.fid,
      unit: 'ms',
      grade: grades.fid,
      icon: <Zap className="w-5 h-5" />,
      description: 'Interactivity',
      threshold: { good: 100, poor: 300 }
    },
    {
      title: 'Cumulative Layout Shift',
      value: metrics.cls,
      unit: 'score',
      grade: grades.cls,
      icon: <Activity className="w-5 h-5" />,
      description: 'Visual stability',
      threshold: { good: 0.1, poor: 0.25 }
    }
  ];

  const additionalMetrics = [
    {
      title: 'First Contentful Paint',
      value: metrics.fcp,
      unit: 'ms',
      grade: metrics.fcp ? (metrics.fcp <= 1800 ? 'good' as const : metrics.fcp <= 3000 ? 'needs-improvement' as const : 'poor' as const) : null,
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'First paint timing',
      threshold: { good: 1800, poor: 3000 }
    },
    {
      title: 'Time to First Byte',
      value: metrics.ttfb,
      unit: 'ms',
      grade: metrics.ttfb ? (metrics.ttfb <= 800 ? 'good' as const : metrics.ttfb <= 1800 ? 'needs-improvement' as const : 'poor' as const) : null,
      icon: <Clock className="w-5 h-5" />,
      description: 'Server response time',
      threshold: { good: 800, poor: 1800 }
    }
  ];

  const getOverallGradeColor = () => {
    if (isGood) return 'text-green-500';
    if (needsImprovement) return 'text-yellow-500';
    if (isPoor) return 'text-red-500';
    return 'text-gray-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Glass config="modal" className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Performance Dashboard
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Real-time Core Web Vitals monitoring
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Overall Score */}
                <div className="text-center">
                  <div className={cn('text-3xl font-bold', getScoreColor(score))}>
                    {score}
                  </div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  ×
                </Button>
              </div>
            </div>

            {/* Overall Status */}
            <div className="mb-8">
              <Glass config="card" className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={cn('text-2xl', getOverallGradeColor())}>
                      {isGood && <CheckCircle className="w-8 h-8" />}
                      {needsImprovement && <AlertTriangle className="w-8 h-8" />}
                      {isPoor && <X className="w-8 h-8" />}
                      {!isGood && !needsImprovement && !isPoor && <Clock className="w-8 h-8" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {isGood && 'Excellent Performance'}
                        {needsImprovement && 'Needs Improvement'}
                        {isPoor && 'Poor Performance'}
                        {!isGood && !needsImprovement && !isPoor && 'Measuring...'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {isGood && 'Your site meets all Core Web Vitals thresholds'}
                        {needsImprovement && 'Some metrics need optimization'}
                        {isPoor && 'Multiple metrics require immediate attention'}
                        {!isGood && !needsImprovement && !isPoor && 'Collecting performance data...'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={exportMetrics}
                    variant="outline"
                    size="sm"
                  >
                    Export Data
                  </Button>
                </div>
              </Glass>
            </div>

            {/* Core Web Vitals */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Core Web Vitals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coreMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MetricCard {...metric} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Additional Metrics */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Additional Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {additionalMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <MetricCard {...metric} />
                    </motion.div>
                  ))}
                </div>
                
                {/* Custom Metrics */}
                {Object.keys(customMetrics).length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                      Custom Metrics
                    </h4>
                    <Glass config="card" className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(customMetrics).map(([name, value]) => (
                          <div key={name} className="text-center">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {Math.round(value)}ms
                            </div>
                            <div className="text-sm text-gray-500 capitalize">
                              {name.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Glass>
                  </div>
                )}
              </motion.div>
            )}

            {/* Performance Tips */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Optimization Tips
              </h3>
              <Glass config="card" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Loading Performance
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Optimize images with WebP format</li>
                      <li>• Implement lazy loading</li>
                      <li>• Use CDN for static assets</li>
                      <li>• Minimize JavaScript bundles</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Interactivity &amp; Stability
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Reduce main thread blocking</li>
                      <li>• Set explicit dimensions for media</li>
                      <li>• Avoid layout-inducing CSS</li>
                      <li>• Optimize third-party scripts</li>
                    </ul>
                  </div>
                </div>
              </Glass>
            </div>
          </Glass>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PerformanceDashboard;