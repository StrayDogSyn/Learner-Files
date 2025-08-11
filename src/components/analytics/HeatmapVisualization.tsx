import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  MousePointer, 
  Eye, 
  BarChart3, 
  Filter,
  Download,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';
import GlassDropdown from '../ui/GlassDropdown';
import { HeatmapData } from '../../services/api/EnhancedAnalyticsService';

export interface HeatmapVisualizationProps {
  data: HeatmapData[];
  width?: number;
  height?: number;
  onDataPointClick?: (dataPoint: HeatmapData) => void;
  className?: string;
}

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  count: number;
  type: 'click' | 'move' | 'scroll';
}

interface FilterOptions {
  type: 'all' | 'click' | 'move' | 'scroll';
  timeRange: 'hour' | 'day' | 'week' | 'month';
  page: string;
}

export const HeatmapVisualization: React.FC<HeatmapVisualizationProps> = ({
  data,
  width = 800,
  height = 600,
  onDataPointClick,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    timeRange: 'day',
    page: 'all'
  });
  const [hoveredPoint, setHoveredPoint] = useState<HeatmapPoint | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Filter and process data
  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(d => d.type === filters.type);
    }

    // Filter by time range
    const now = Date.now();
    const timeRanges = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    };
    
    const cutoff = now - timeRanges[filters.timeRange];
    filtered = filtered.filter(d => d.timestamp >= cutoff);

    // Filter by page
    if (filters.page !== 'all') {
      filtered = filtered.filter(d => d.page === filters.page);
    }

    return filtered;
  }, [data, filters]);

  // Convert data to heatmap points
  const heatmapPoints = useMemo(() => {
    const pointMap = new Map<string, HeatmapPoint>();
    const gridSize = 20; // Group nearby points

    filteredData.forEach(d => {
      const gridX = Math.floor(d.x / gridSize) * gridSize;
      const gridY = Math.floor(d.y / gridSize) * gridSize;
      const key = `${gridX}-${gridY}-${d.type}`;

      if (pointMap.has(key)) {
        const existing = pointMap.get(key)!;
        existing.count += 1;
        existing.intensity = Math.min(existing.intensity + 0.1, 1);
      } else {
        pointMap.set(key, {
          x: gridX,
          y: gridY,
          intensity: 0.3,
          count: 1,
          type: d.type
        });
      }
    });

    return Array.from(pointMap.values());
  }, [filteredData]);

  // Get unique pages for filter
  const uniquePages = useMemo(() => {
    const pages = new Set(data.map(d => d.page));
    return ['all', ...Array.from(pages)];
  }, [data]);

  // Draw heatmap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw heatmap points
    heatmapPoints.forEach(point => {
      const radius = Math.max(10, point.count * 2);
      const alpha = point.intensity;

      // Color based on type
      const colors = {
        click: `rgba(255, 0, 0, ${alpha})`,
        move: `rgba(0, 255, 0, ${alpha * 0.3})`,
        scroll: `rgba(0, 0, 255, ${alpha})`
      };

      // Create radial gradient
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      );
      gradient.addColorStop(0, colors[point.type]);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [heatmapPoints, width, height]);

  // Handle mouse events
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });

    // Find hovered point
    const hoveredPoint = heatmapPoints.find(point => {
      const distance = Math.sqrt(
        Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
      );
      return distance <= Math.max(10, point.count * 2);
    });

    setHoveredPoint(hoveredPoint || null);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hoveredPoint && onDataPointClick) {
      const originalData = filteredData.find(d => 
        Math.abs(d.x - hoveredPoint.x) < 20 && 
        Math.abs(d.y - hoveredPoint.y) < 20 &&
        d.type === hoveredPoint.type
      );
      if (originalData) {
        onDataPointClick(originalData);
      }
    }
  };

  // Replay functionality
  const startReplay = () => {
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const pauseReplay = () => {
    setIsPlaying(false);
  };

  const resetReplay = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Export heatmap
  const exportHeatmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `heatmap-${filters.page}-${filters.type}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <GlassCard className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            User Interaction Heatmap
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <GlassButton
            onClick={exportHeatmap}
            size="sm"
            variant="outline"
          >
            <Download className="w-4 h-4" />
          </GlassButton>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Filters:</span>
        </div>

        <GlassDropdown
          value={filters.type}
          onChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}
          options={[
            { value: 'all', label: 'All Interactions' },
            { value: 'click', label: 'Clicks' },
            { value: 'move', label: 'Mouse Moves' },
            { value: 'scroll', label: 'Scrolls' }
          ]}
          size="sm"
        />

        <GlassDropdown
          value={filters.timeRange}
          onChange={(value) => setFilters(prev => ({ ...prev, timeRange: value as any }))}
          options={[
            { value: 'hour', label: 'Last Hour' },
            { value: 'day', label: 'Last Day' },
            { value: 'week', label: 'Last Week' },
            { value: 'month', label: 'Last Month' }
          ]}
          size="sm"
        />

        <GlassDropdown
          value={filters.page}
          onChange={(value) => setFilters(prev => ({ ...prev, page: value }))}
          options={uniquePages.map(page => ({
            value: page,
            label: page === 'all' ? 'All Pages' : page
          }))}
          size="sm"
        />
      </div>

      {/* Replay Controls */}
      <div className="flex items-center gap-2 mb-4">
        <GlassButton
          onClick={isPlaying ? pauseReplay : startReplay}
          size="sm"
          variant="outline"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </GlassButton>

        <GlassButton
          onClick={resetReplay}
          size="sm"
          variant="outline"
        >
          <RotateCcw className="w-4 h-4" />
        </GlassButton>

        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
          {filteredData.length} interactions
        </span>
      </div>

      {/* Heatmap Canvas */}
      <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block cursor-crosshair"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseLeave={() => setHoveredPoint(null)}
        />

        {/* Tooltip */}
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-none z-10 bg-black/80 text-white text-xs rounded px-2 py-1"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 30
            }}
          >
            <div>Type: {hoveredPoint.type}</div>
            <div>Count: {hoveredPoint.count}</div>
            <div>Position: ({hoveredPoint.x}, {hoveredPoint.y})</div>
          </motion.div>
        )}

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Legend
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full opacity-70"></div>
              <span className="text-gray-600 dark:text-gray-300">Clicks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full opacity-30"></div>
              <span className="text-gray-600 dark:text-gray-300">Mouse Moves</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full opacity-70"></div>
              <span className="text-gray-600 dark:text-gray-300">Scrolls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">
            {heatmapPoints.filter(p => p.type === 'click').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Click Zones</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">
            {heatmapPoints.filter(p => p.type === 'move').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Move Areas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">
            {heatmapPoints.filter(p => p.type === 'scroll').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Scroll Points</div>
        </div>
      </div>
    </GlassCard>
  );
};

export default HeatmapVisualization;