import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  Cpu, 
  HardDrive, 
  Zap, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  cpuUsage: number;
  errorCount: number;
  successRate: number;
  responseTime: number;
  userInteractions: number;
  sessionDuration: number;
}

export interface MetricsDashboardProps {
  metrics: PerformanceMetrics;
  isLive?: boolean;
  className?: string;
  compact?: boolean;
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  status?: 'good' | 'warning' | 'error';
  description?: string;
}> = ({ title, value, unit, icon, trend, status = 'good', description }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'border-emerald-400/30 bg-emerald-500/10';
      case 'warning': return 'border-yellow-400/30 bg-yellow-500/10';
      case 'error': return 'border-red-400/30 bg-red-500/10';
      default: return 'border-white/20 bg-white/5';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    const iconClass = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
    return (
      <TrendingUp 
        className={`w-3 h-3 ${iconClass} ${trend === 'down' ? 'rotate-180' : ''}`} 
      />
    );
  };

  return (
    <motion.div
      className={`relative p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${getStatusColor()}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/10">
            {icon}
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
            {title}
          </span>
        </div>
        {getTrendIcon()}
      </div>
      
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-bold text-white font-orbitron">
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
        {unit && (
          <span className="text-sm text-gray-400">{unit}</span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      {/* Live indicator */}
      <div className="absolute top-2 right-2">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      </div>
    </motion.div>
  );
};

const PerformanceChart: React.FC<{
  data: number[];
  label: string;
  color: string;
  height?: number;
}> = ({ data, label, color, height = 60 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      
      <div className="relative bg-white/5 rounded-lg p-3 border border-white/10">
        <svg width="100%" height={height} className="overflow-visible">
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Chart line */}
          <motion.path
            d={`M ${data.map((value, index) => 
              `${(index / (data.length - 1)) * 100}% ${height - ((value - min) / range) * (height - 10) + 5}`
            ).join(' L ')}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          
          {/* Chart area */}
          <motion.path
            d={`M 0% ${height} L ${data.map((value, index) => 
              `${(index / (data.length - 1)) * 100}% ${height - ((value - min) / range) * (height - 10) + 5}`
            ).join(' L ')} L 100% ${height} Z`}
            fill={`url(#gradient-${label})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </svg>
      </div>
    </div>
  );
};

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  isLive = true,
  className = '',
  compact = false
}) => {
  const [historicalData, setHistoricalData] = useState<{
    renderTime: number[];
    memoryUsage: number[];
    cpuUsage: number[];
  }>({
    renderTime: [12, 15, 11, 18, 14, 16, 13, 12, 15, 11],
    memoryUsage: [45, 48, 52, 49, 51, 47, 50, 46, 48, 45],
    cpuUsage: [25, 30, 28, 35, 32, 29, 31, 27, 30, 26]
  });

  const [isExpanded, setIsExpanded] = useState(!compact);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setHistoricalData(prev => ({
        renderTime: [...prev.renderTime.slice(1), metrics.renderTime],
        memoryUsage: [...prev.memoryUsage.slice(1), metrics.memoryUsage],
        cpuUsage: [...prev.cpuUsage.slice(1), metrics.cpuUsage]
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [metrics, isLive]);

  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.warning) return 'warning';
    return 'error';
  };

  return (
    <motion.div
      className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-orbitron">
              Performance Dashboard
            </h3>
            <p className="text-sm text-gray-400">
              {isLive ? 'Live Metrics' : 'Static Metrics'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">LIVE</span>
            </div>
          )}
          
          {compact && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-4 h-4 text-white" />
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Metrics Grid */}
            <div className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="Render Time"
                  value={metrics.renderTime}
                  unit="ms"
                  icon={<Clock className="w-4 h-4 text-blue-400" />}
                  status={getPerformanceStatus(metrics.renderTime, { good: 16, warning: 50 })}
                  description="Component render duration"
                />
                
                <MetricCard
                  title="Memory Usage"
                  value={metrics.memoryUsage}
                  unit="MB"
                  icon={<HardDrive className="w-4 h-4 text-purple-400" />}
                  status={getPerformanceStatus(metrics.memoryUsage, { good: 50, warning: 100 })}
                  description="Current memory consumption"
                />
                
                <MetricCard
                  title="CPU Usage"
                  value={metrics.cpuUsage}
                  unit="%"
                  icon={<Cpu className="w-4 h-4 text-orange-400" />}
                  status={getPerformanceStatus(metrics.cpuUsage, { good: 30, warning: 70 })}
                  description="Processor utilization"
                />
                
                <MetricCard
                  title="Success Rate"
                  value={metrics.successRate}
                  unit="%"
                  icon={<CheckCircle className="w-4 h-4 text-green-400" />}
                  status={metrics.successRate >= 95 ? 'good' : metrics.successRate >= 90 ? 'warning' : 'error'}
                  description="Operation success percentage"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PerformanceChart
                  data={historicalData.renderTime}
                  label="Render Time Trend"
                  color="#60A5FA"
                />
                
                <PerformanceChart
                  data={historicalData.memoryUsage}
                  label="Memory Usage Trend"
                  color="#A78BFA"
                />
                
                <PerformanceChart
                  data={historicalData.cpuUsage}
                  label="CPU Usage Trend"
                  color="#FB923C"
                />
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <MetricCard
                  title="Response Time"
                  value={metrics.responseTime}
                  unit="ms"
                  icon={<Zap className="w-4 h-4 text-yellow-400" />}
                  description="Average API response"
                />
                
                <MetricCard
                  title="Interactions"
                  value={metrics.userInteractions}
                  icon={<Activity className="w-4 h-4 text-cyan-400" />}
                  description="User interactions count"
                />
                
                <MetricCard
                  title="Session Time"
                  value={Math.floor(metrics.sessionDuration / 60)}
                  unit="min"
                  icon={<Clock className="w-4 h-4 text-indigo-400" />}
                  description="Current session duration"
                />
                
                <MetricCard
                  title="Error Count"
                  value={metrics.errorCount}
                  icon={<AlertCircle className="w-4 h-4 text-red-400" />}
                  status={metrics.errorCount === 0 ? 'good' : metrics.errorCount < 5 ? 'warning' : 'error'}
                  description="Errors in current session"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MetricsDashboard;