import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  BarChart3, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Cpu, 
  Eye, 
  EyeOff, 
  HardDrive, 
  Minimize2, 
  Maximize2,
  X
} from 'lucide-react';
import { PerformanceMetrics } from './MetricsDashboard';

export interface PerformanceOverlayProps {
  metrics: PerformanceMetrics;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  isVisible?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
  compact?: boolean;
  className?: string;
}

const MiniMetric: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  icon: React.ReactNode;
}> = ({ label, value, unit, color, icon }) => (
  <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
    <div className={`p-1 rounded ${color}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-gray-400 truncate">{label}</div>
      <div className="text-sm font-semibold text-white">
        {typeof value === 'number' ? value.toFixed(1) : value}
        {unit && <span className="text-xs text-gray-400 ml-1">{unit}</span>}
      </div>
    </div>
  </div>
);

const CompactMetric: React.FC<{
  value: string | number;
  unit?: string;
  color: string;
  icon: React.ReactNode;
}> = ({ value, unit, color, icon }) => (
  <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${color}`}>
    {icon}
    <span className="text-xs font-medium text-white">
      {typeof value === 'number' ? value.toFixed(1) : value}
      {unit && <span className="text-gray-300">{unit}</span>}
    </span>
  </div>
);

export const PerformanceOverlay: React.FC<PerformanceOverlayProps> = ({
  metrics,
  position = 'bottom-right',
  isVisible = true,
  onToggleVisibility,
  compact = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(compact);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const getPositionClasses = () => {
    const baseClasses = 'fixed z-50';
    switch (position) {
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'bottom-right':
      default:
        return `${baseClasses} bottom-4 right-4`;
    }
  };

  const handleToggleVisibility = () => {
    const newVisibility = !isVisible;
    onToggleVisibility?.(newVisibility);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const overlay = document.getElementById('performance-overlay');
      if (overlay) {
        overlay.style.left = `${e.clientX - dragPosition.x}px`;
        overlay.style.top = `${e.clientY - dragPosition.y}px`;
        overlay.style.right = 'auto';
        overlay.style.bottom = 'auto';
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragPosition]);

  if (!isVisible) {
    return (
      <motion.button
        onClick={handleToggleVisibility}
        className="fixed bottom-4 right-4 z-50 p-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full hover:scale-110 transition-all duration-300"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Show performance metrics"
      >
        <Eye className="w-5 h-5 text-emerald-400" />
      </motion.button>
    );
  }

  return (
    <motion.div
      id="performance-overlay"
      className={`${getPositionClasses()} ${className} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ userSelect: 'none' }}
    >
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 bg-white/5 border-b border-white/10 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-emerald-500/20">
              <Activity className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-white">Performance</span>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? (
                <Maximize2 className="w-3 h-3 text-gray-400" />
              ) : (
                <Minimize2 className="w-3 h-3 text-gray-400" />
              )}
            </button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand details'}
            >
              {isExpanded ? (
                <ChevronUp className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              )}
            </button>
            
            <button
              onClick={handleToggleVisibility}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Hide performance metrics"
            >
              <EyeOff className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Compact View */}
              {!isExpanded && (
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <CompactMetric
                      value={metrics.renderTime}
                      unit="ms"
                      color="bg-blue-500/20"
                      icon={<Clock className="w-3 h-3 text-blue-400" />}
                    />
                    <CompactMetric
                      value={metrics.memoryUsage}
                      unit="MB"
                      color="bg-purple-500/20"
                      icon={<HardDrive className="w-3 h-3 text-purple-400" />}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CompactMetric
                      value={metrics.cpuUsage}
                      unit="%"
                      color="bg-orange-500/20"
                      icon={<Cpu className="w-3 h-3 text-orange-400" />}
                    />
                    <CompactMetric
                      value={metrics.successRate}
                      unit="%"
                      color="bg-green-500/20"
                      icon={<BarChart3 className="w-3 h-3 text-green-400" />}
                    />
                  </div>
                </div>
              )}

              {/* Expanded View */}
              {isExpanded && (
                <div className="p-3 space-y-2 w-64">
                  <div className="grid grid-cols-1 gap-2">
                    <MiniMetric
                      label="Render Time"
                      value={metrics.renderTime}
                      unit="ms"
                      color="bg-blue-500/20"
                      icon={<Clock className="w-3 h-3 text-blue-400" />}
                    />
                    
                    <MiniMetric
                      label="Memory Usage"
                      value={metrics.memoryUsage}
                      unit="MB"
                      color="bg-purple-500/20"
                      icon={<HardDrive className="w-3 h-3 text-purple-400" />}
                    />
                    
                    <MiniMetric
                      label="CPU Usage"
                      value={metrics.cpuUsage}
                      unit="%"
                      color="bg-orange-500/20"
                      icon={<Cpu className="w-3 h-3 text-orange-400" />}
                    />
                    
                    <MiniMetric
                      label="Success Rate"
                      value={metrics.successRate}
                      unit="%"
                      color="bg-green-500/20"
                      icon={<BarChart3 className="w-3 h-3 text-green-400" />}
                    />
                  </div>
                  
                  {/* Additional Stats */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-gray-400">
                        Interactions: <span className="text-white font-medium">{metrics.userInteractions}</span>
                      </div>
                      <div className="text-gray-400">
                        Errors: <span className="text-white font-medium">{metrics.errorCount}</span>
                      </div>
                      <div className="text-gray-400">
                        Response: <span className="text-white font-medium">{metrics.responseTime}ms</span>
                      </div>
                      <div className="text-gray-400">
                        Session: <span className="text-white font-medium">{Math.floor(metrics.sessionDuration / 60)}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PerformanceOverlay;