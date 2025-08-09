import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Zap,
  Brain,
  Eye,
  Download,
  Share2,
  Filter,
  Calendar,
  Clock,
  Award,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6
} from 'lucide-react';
import {
  GameStatistics,
  RollDistribution,
  WinRateData,
  PerformanceMetrics,
  TimeSeriesData,
  HeatmapData
} from '../../types/knucklebones';

interface DataVisualizationProps {
  statistics: GameStatistics;
  onExport?: (format: 'png' | 'svg' | 'csv') => void;
  onShare?: (data: any) => void;
  className?: string;
}

interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

interface FilterPanelProps {
  filters: VisualizationFilters;
  onFiltersChange: (filters: VisualizationFilters) => void;
  onReset: () => void;
}

interface VisualizationFilters {
  timeRange: 'day' | 'week' | 'month' | 'year' | 'all';
  gameMode: string[];
  difficulty: string[];
  dateRange: { start: Date; end: Date } | null;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: any, name: string) => [string, string];
}

// Mock data generators for demonstration
const generateRollDistribution = (): RollDistribution[] => {
  return Array.from({ length: 6 }, (_, i) => ({
    value: i + 1,
    count: Math.floor(Math.random() * 100) + 20,
    percentage: Math.random() * 20 + 10,
    expected: 16.67,
    deviation: (Math.random() - 0.5) * 10
  }));
};

const generateWinRateData = (): WinRateData[] => {
  const modes = ['Classic', 'Speed', 'Blitz', 'Survival', 'Tournament'];
  return modes.map(mode => ({
    mode,
    wins: Math.floor(Math.random() * 50) + 10,
    losses: Math.floor(Math.random() * 30) + 5,
    winRate: Math.random() * 40 + 50,
    averageScore: Math.floor(Math.random() * 200) + 100,
    bestScore: Math.floor(Math.random() * 300) + 200
  }));
};

const generateTimeSeriesData = (): TimeSeriesData[] => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      gamesPlayed: Math.floor(Math.random() * 10) + 1,
      winRate: Math.random() * 40 + 50,
      averageScore: Math.floor(Math.random() * 100) + 150,
      efficiency: Math.random() * 30 + 70,
      streakLength: Math.floor(Math.random() * 5)
    };
  });
};

const generatePerformanceRadar = (): PerformanceMetrics => ({
  strategy: Math.random() * 40 + 60,
  speed: Math.random() * 40 + 60,
  consistency: Math.random() * 40 + 60,
  riskManagement: Math.random() * 40 + 60,
  adaptability: Math.random() * 40 + 60,
  decisionMaking: Math.random() * 40 + 60
});

const generateHeatmapData = (): HeatmapData[] => {
  const data: HeatmapData[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      data.push({
        row,
        col,
        value: Math.random() * 100,
        frequency: Math.floor(Math.random() * 50) + 10,
        successRate: Math.random() * 40 + 50
      });
    }
  }
  return data;
};

const COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',
  gradient: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4']
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, formatter }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-xl">
      {label && (
        <p className="text-white font-medium mb-2">{label}</p>
      )}
      {payload.map((entry, index) => {
        const [value, name] = formatter ? formatter(entry.value, entry.name || '') : [entry.value, entry.name];
        return (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white/80">{name}:</span>
            <span className="text-white font-medium">{value}</span>
          </div>
        );
      })}
    </div>
  );
};

const ChartCard: React.FC<ChartCardProps> = ({ title, icon, children, actions, className = '' }) => {
  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      {children}
    </motion.div>
  );
};

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof VisualizationFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="time-range-filter" className="block text-sm font-medium text-white/80 mb-2">
                  Time Range
                </label>
                <select
                  id="time-range-filter"
                  value={filters.timeRange}
                  onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                  aria-label="Select time range for data visualization"
                  title="Filter data by time period"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div>
                <fieldset>
                  <legend className="block text-sm font-medium text-white/80 mb-2">
                    Game Modes
                  </legend>
                  <div className="space-y-2">
                    {['Classic', 'Speed', 'Blitz', 'Survival', 'Tournament'].map(mode => (
                      <label key={mode} className="flex items-center gap-2">
                        <input
                          id={`game-mode-${mode.toLowerCase()}`}
                          type="checkbox"
                          checked={filters.gameMode.includes(mode)}
                          onChange={(e) => {
                            const newModes = e.target.checked
                              ? [...filters.gameMode, mode]
                              : filters.gameMode.filter(m => m !== mode);
                            handleFilterChange('gameMode', newModes);
                          }}
                          aria-label={`Include ${mode} game mode in visualization`}
                          className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-white/80">{mode}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onReset}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-3 py-2 bg-blue-500 rounded-lg text-white text-sm hover:bg-blue-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DataVisualization: React.FC<DataVisualizationProps> = ({
  statistics,
  onExport,
  onShare,
  className = ''
}) => {
  const [filters, setFilters] = useState<VisualizationFilters>({
    timeRange: 'month',
    gameMode: ['Classic', 'Speed', 'Blitz'],
    difficulty: ['intermediate', 'advanced'],
    dateRange: null
  });

  const [activeChart, setActiveChart] = useState<string>('overview');

  // Generate mock data (in real app, this would come from props/API)
  const rollDistribution = useMemo(() => generateRollDistribution(), []);
  const winRateData = useMemo(() => generateWinRateData(), []);
  const timeSeriesData = useMemo(() => generateTimeSeriesData(), []);
  const performanceRadar = useMemo(() => generatePerformanceRadar(), []);
  const heatmapData = useMemo(() => generateHeatmapData(), []);

  const handleExport = useCallback((format: 'png' | 'svg' | 'csv') => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export logic
      console.log(`Exporting data as ${format}`);
    }
  }, [onExport]);

  const handleShare = useCallback(() => {
    const shareData = {
      rollDistribution,
      winRateData,
      timeSeriesData,
      performanceRadar,
      filters
    };
    
    if (onShare) {
      onShare(shareData);
    } else {
      // Default share logic
      navigator.clipboard.writeText(JSON.stringify(shareData, null, 2));
    }
  }, [rollDistribution, winRateData, timeSeriesData, performanceRadar, filters, onShare]);

  const resetFilters = useCallback(() => {
    setFilters({
      timeRange: 'month',
      gameMode: ['Classic', 'Speed', 'Blitz'],
      difficulty: ['intermediate', 'advanced'],
      dateRange: null
    });
  }, []);

  const chartTabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'patterns', label: 'Patterns', icon: <Brain className="w-4 h-4" /> },
    { id: 'heatmap', label: 'Heatmap', icon: <Target className="w-4 h-4" /> }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-400" />
          Data Visualization
        </h2>
        
        <div className="flex items-center gap-3">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
          />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('png')}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              title="Export as PNG"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              title="Share Data"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
        {chartTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveChart(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeChart === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart Content */}
      <AnimatePresence mode="wait">
        {activeChart === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            {/* Roll Distribution */}
            <ChartCard
              title="Dice Roll Distribution"
              icon={<Dice1 className="w-5 h-5 text-blue-400" />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rollDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="value" 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                  />
                  <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expected" fill={COLORS.warning} opacity={0.6} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Win Rate by Mode */}
            <ChartCard
              title="Win Rate by Game Mode"
              icon={<Award className="w-5 h-5 text-green-400" />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={winRateData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="winRate"
                    label={({ mode, winRate }) => `${mode}: ${winRate.toFixed(1)}%`}
                  >
                    {winRateData.map((_, index) => (
                      <Cell key={index} fill={COLORS.gradient[index % COLORS.gradient.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Performance Over Time */}
            <ChartCard
              title="Performance Trends"
              icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                  />
                  <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="winRate" 
                    fill={COLORS.success} 
                    stroke={COLORS.success}
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="averageScore" 
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                  />
                  <Bar dataKey="gamesPlayed" fill={COLORS.secondary} opacity={0.7} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>
        )}

        {activeChart === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            {/* Performance Radar */}
            <ChartCard
              title="Skill Assessment"
              icon={<Brain className="w-5 h-5 text-purple-400" />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={[
                  { skill: 'Strategy', value: performanceRadar.strategy },
                  { skill: 'Speed', value: performanceRadar.speed },
                  { skill: 'Consistency', value: performanceRadar.consistency },
                  { skill: 'Risk Mgmt', value: performanceRadar.riskManagement },
                  { skill: 'Adaptability', value: performanceRadar.adaptability },
                  { skill: 'Decision', value: performanceRadar.decisionMaking }
                ]}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                  />
                  <Radar 
                    name="Performance" 
                    dataKey="value" 
                    stroke={COLORS.primary} 
                    fill={COLORS.primary} 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Efficiency Metrics */}
            <ChartCard
              title="Efficiency Analysis"
              icon={<Zap className="w-5 h-5 text-yellow-400" />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="efficiency" 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                    name="Efficiency"
                  />
                  <YAxis 
                    dataKey="winRate" 
                    stroke="rgba(255,255,255,0.7)" 
                    fontSize={12}
                    name="Win Rate"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter 
                    name="Performance" 
                    data={timeSeriesData} 
                    fill={COLORS.warning}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>
        )}

        {activeChart === 'patterns' && (
          <motion.div
            key="patterns"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-6"
          >
            <ChartCard
              title="Dice Pattern Analysis"
              icon={<Brain className="w-5 h-5 text-purple-400" />}
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                {rollDistribution.map((roll, index) => {
                  const DiceIcon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][index];
                  return (
                    <div key={roll.value} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <DiceIcon className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">{roll.count}</div>
                      <div className="text-sm text-white/60">rolls</div>
                      <div className={`text-xs font-medium ${
                        roll.deviation > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {roll.deviation > 0 ? '+' : ''}{roll.deviation.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={rollDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="value" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke={COLORS.primary} 
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expected" 
                    stroke={COLORS.warning} 
                    fill={COLORS.warning}
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>
        )}

        {activeChart === 'heatmap' && (
          <motion.div
            key="heatmap"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-6"
          >
            <ChartCard
              title="Board Position Heatmap"
              icon={<Target className="w-5 h-5 text-red-400" />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {heatmapData.map((cell, index) => {
                    const intensity = cell.value / 100;
                    return (
                      <motion.div
                        key={index}
                        className="aspect-square rounded-lg border border-white/20 flex items-center justify-center relative overflow-hidden"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${intensity * 0.8 + 0.2})`
                        }}
                        whileHover={{ scale: 1.05 }}
                        title={`Position (${cell.row}, ${cell.col}): ${cell.value.toFixed(1)}% usage`}
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">
                            {cell.frequency}
                          </div>
                          <div className="text-xs text-white/80">
                            {cell.successRate.toFixed(0)}%
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>Less Used</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${(i + 1) * 0.2})`
                        }}
                      />
                    ))}
                  </div>
                  <span>More Used</span>
                </div>
              </div>
            </ChartCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white/80">Total Games</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {timeSeriesData.reduce((sum, day) => sum + day.gamesPlayed, 0)}
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white/80">Avg Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {(timeSeriesData.reduce((sum, day) => sum + day.winRate, 0) / timeSeriesData.length).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white/80">Efficiency</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {(timeSeriesData.reduce((sum, day) => sum + day.efficiency, 0) / timeSeriesData.length).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white/80">Best Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.max(...timeSeriesData.map(day => day.streakLength))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;

// Hook for data visualization management
export const useDataVisualization = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['winRate', 'efficiency']);
  const [exportFormat, setExportFormat] = useState<'png' | 'svg' | 'csv'>('png');

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const updateMetrics = useCallback((metrics: string[]) => {
    setSelectedMetrics(metrics);
  }, []);

  const exportData = useCallback((data: any, format: 'png' | 'svg' | 'csv') => {
    // Implementation would depend on the specific export library used
    console.log(`Exporting data as ${format}:`, data);
  }, []);

  return {
    isVisible,
    selectedMetrics,
    exportFormat,
    toggleVisibility,
    updateMetrics,
    setExportFormat,
    exportData
  };
};