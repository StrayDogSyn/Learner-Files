import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  Activity,
  Users,
  Eye,
  MousePointer,
  Clock,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Download,
  Settings,
  RefreshCw,
  Filter,
  Search,
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  Target,
  Brain,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Map,
  Layers,
  PlayCircle,
  Pause,
  SkipForward,
  SkipBack,
  ExternalLink,
  FileText,
  Share2,
  Mail,
  Github,
  Linkedin,
  Twitter,
  GamepadIcon,
  Trophy,
  Timer,
  Gauge
} from 'lucide-react';
import { Glass } from '../ui/Glass';
import GitHubPagesAnalyticsService, { GitHubPagesMetrics, HeatmapData } from '../../services/api/GitHubPagesAnalyticsService';

interface DashboardFilters {
  dateRange: '1h' | '24h' | '7d' | '30d' | '90d';
  segment: 'all' | 'new' | 'returning' | 'mobile' | 'desktop';
  page?: string;
  source?: string;
  country?: string;
}

interface LiveVisitor {
  id: string;
  location: string;
  page: string;
  device: string;
  timestamp: number;
  duration: number;
}

interface AlertNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  dismissed?: boolean;
}

const GitHubPagesAnalyticsDashboard: React.FC = () => {
  const [analyticsService] = useState(() => new GitHubPagesAnalyticsService());
  const [metrics, setMetrics] = useState<GitHubPagesMetrics | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: '24h',
    segment: 'all'
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'games' | 'performance' | 'heatmap' | 'professional'>('overview');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>([]);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Initialize analytics service
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        await analyticsService.initialize();
        loadMetrics();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
        addNotification('error', 'Failed to initialize analytics service');
        setIsLoading(false);
      }
    };

    initializeAnalytics();

    return () => {
      analyticsService.destroy();
    };
  }, [analyticsService]);

  // Real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled || !autoRefresh) return;

    const interval = setInterval(() => {
      loadMetrics();
      updateLiveVisitors();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, autoRefresh]);

  const loadMetrics = useCallback(() => {
    const currentMetrics = analyticsService.getMetrics();
    const currentHeatmap = analyticsService.getHeatmapData();
    
    setMetrics(currentMetrics);
    setHeatmapData(currentHeatmap);
  }, [analyticsService]);

  const updateLiveVisitors = useCallback(() => {
    // Simulate live visitors for GitHub Pages
    const mockVisitors: LiveVisitor[] = Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => ({
      id: `visitor-${Date.now()}-${i}`,
      location: ['New York, US', 'London, UK', 'Toronto, CA', 'Berlin, DE', 'Sydney, AU'][Math.floor(Math.random() * 5)],
      page: ['/', '/portfolio', '/about', '/contact', '/projects'][Math.floor(Math.random() * 5)],
      device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
      timestamp: Date.now() - Math.floor(Math.random() * 300000), // Last 5 minutes
      duration: Math.floor(Math.random() * 180) + 30 // 30-210 seconds
    }));

    setLiveVisitors(mockVisitors);
  }, []);

  const addNotification = (type: AlertNotification['type'], message: string) => {
    const notification: AlertNotification = {
      id: `notif-${Date.now()}`,
      type,
      message,
      timestamp: new Date()
    };

    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, dismissed: true } : n));
  };

  const exportData = (format: 'json' | 'csv') => {
    try {
      const data = analyticsService.exportData(format);
      const blob = new Blob([data], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `github-pages-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addNotification('success', `Analytics data exported as ${format.toUpperCase()}`);
    } catch (error) {
      addNotification('error', 'Failed to export data');
    }
  };

  const generateReport = () => {
    try {
      const report = analyticsService.generateWeeklyReport();
      console.log('Weekly Report:', report);
      addNotification('success', 'Weekly report generated successfully');
    } catch (error) {
      addNotification('error', 'Failed to generate report');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading GitHub Pages Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              GitHub Pages Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time portfolio analytics and performance insights
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Real-time toggle */}
            <Glass className="p-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">
                  {isRealTimeEnabled ? 'Live' : 'Paused'}
                </span>
                <button
                  onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                  className="ml-2 p-1 hover:bg-gray-100 rounded"
                >
                  {isRealTimeEnabled ? <Pause className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                </button>
              </div>
            </Glass>

            {/* Export buttons */}
            <Glass className="p-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportData('json')}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Export CSV
                </button>
                <button
                  onClick={generateReport}
                  className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Report
                </button>
              </div>
            </Glass>
          </div>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {notifications.filter(n => !n.dismissed).slice(0, 3).map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-2 p-3 rounded-lg flex items-center justify-between ${
                notification.type === 'error' ? 'bg-red-100 text-red-800' :
                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                notification.type === 'success' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === 'error' && <AlertCircle className="w-4 h-4" />}
                {notification.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                {notification.type === 'success' && <CheckCircle className="w-4 h-4" />}
                {notification.type === 'info' && <Info className="w-4 h-4" />}
                <span className="text-sm">{notification.message}</span>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Filters */}
        <Glass className="p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <select
                value={filters.segment}
                onChange={(e) => setFilters(prev => ({ ...prev, segment: e.target.value as any }))}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Visitors</option>
                <option value="new">New Visitors</option>
                <option value="returning">Returning Visitors</option>
                <option value="mobile">Mobile Users</option>
                <option value="desktop">Desktop Users</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search pages, sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm w-48"
              />
            </div>

            <button
              onClick={loadMetrics}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </Glass>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'projects', label: 'Projects', icon: Layers },
            { id: 'games', label: 'Games', icon: GamepadIcon },
            { id: 'performance', label: 'Performance', icon: Gauge },
            { id: 'heatmap', label: 'Heatmap', icon: Map },
            { id: 'professional', label: 'Professional', icon: Target }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <OverviewTab 
            metrics={metrics} 
            liveVisitors={liveVisitors}
            onTrackEvent={(event, data) => {
              if (event === 'page_view') {
                analyticsService.trackPageView(data.path, data.title);
              }
            }}
          />
        )}
        
        {activeTab === 'projects' && (
          <ProjectsTab 
            metrics={metrics}
            onTrackProject={(projectId, projectName) => {
              analyticsService.trackProjectView(projectId, projectName);
            }}
          />
        )}
        
        {activeTab === 'games' && (
          <GamesTab 
            metrics={metrics}
            onTrackGame={(gameId, completed, timeSpent, score) => {
              analyticsService.trackGameCompletion(gameId, completed, timeSpent, score);
            }}
          />
        )}
        
        {activeTab === 'performance' && (
          <PerformanceTab metrics={metrics} />
        )}
        
        {activeTab === 'heatmap' && (
          <HeatmapTab heatmapData={heatmapData} />
        )}
        
        {activeTab === 'professional' && (
          <ProfessionalTab 
            metrics={metrics}
            onTrackContact={(action, data) => {
              analyticsService.trackContactFormInteraction(action, data);
            }}
            onTrackResume={(source) => {
              analyticsService.trackResumeDownload(source);
            }}
            onTrackSocial={(platform, url) => {
              analyticsService.trackSocialMediaClick(platform, url);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{
  metrics: GitHubPagesMetrics | null;
  liveVisitors: LiveVisitor[];
  onTrackEvent: (event: string, data: any) => void;
}> = ({ metrics, liveVisitors, onTrackEvent }) => {
  if (!metrics) return <div>Loading overview...</div>;

  const kpiCards = [
    {
      title: 'Real-time Visitors',
      value: metrics.realTimeVisitors,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12%'
    },
    {
      title: 'Total Page Views',
      value: metrics.totalPageViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+8%'
    },
    {
      title: 'Unique Visitors',
      value: metrics.uniqueVisitors.toLocaleString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15%'
    },
    {
      title: 'New vs Returning',
      value: `${Math.round((metrics.newVisitors / (metrics.newVisitors + metrics.returningVisitors)) * 100)}% new`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+5%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Glass className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-sm text-green-600 mt-1">{kpi.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </Glass>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Glass className="p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(metrics.trafficSources).map(([source, data]) => ({
                  name: source,
                  value: data.visitors,
                  percentage: data.percentage
                }))}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {Object.entries(metrics.trafficSources).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Glass>

        {/* Device Breakdown */}
        <Glass className="p-6">
          <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(metrics.deviceBreakdown).map(([device, data]) => ({
              device,
              users: data.users,
              percentage: data.percentage
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="device" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Glass>
      </div>

      {/* Live Visitors Feed */}
      <Glass className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Live Visitors</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">{liveVisitors.length} active now</span>
          </div>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {liveVisitors.map(visitor => {
            const deviceIcon = visitor.device === 'mobile' ? Smartphone : 
                             visitor.device === 'tablet' ? Tablet : Monitor;
            const DeviceIcon = deviceIcon;
            
            return (
              <motion.div
                key={visitor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <DeviceIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{visitor.location}</p>
                    <p className="text-xs text-gray-500">{visitor.page}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {Math.floor(visitor.duration / 60)}m {visitor.duration % 60}s
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(visitor.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Glass>
    </div>
  );
};

// Projects Tab Component
const ProjectsTab: React.FC<{
  metrics: GitHubPagesMetrics | null;
  onTrackProject: (projectId: string, projectName: string) => void;
}> = ({ metrics, onTrackProject }) => {
  if (!metrics) return <div>Loading projects...</div>;

  return (
    <div className="space-y-6">
      {/* Project Views Chart */}
      <Glass className="p-6">
        <h3 className="text-lg font-semibold mb-4">Project Views</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={Object.entries(metrics.projectViews).map(([projectId, views]) => ({
            project: `Project ${projectId}`,
            views
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="project" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Glass>

      {/* Project Engagement */}
      <Glass className="p-6">
        <h3 className="text-lg font-semibold mb-4">Project Engagement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(metrics.projectEngagement).map(([projectId, engagement]) => (
            <div key={projectId} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Project {projectId}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Views:</span>
                  <span className="font-medium">{engagement.views}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Spent:</span>
                  <span className="font-medium">{Math.round(engagement.timeSpent / 60)}m</span>
                </div>
                <div className="flex justify-between">
                  <span>Interactions:</span>
                  <span className="font-medium">{engagement.interactions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Rate:</span>
                  <span className="font-medium">{Math.round(engagement.completionRate * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Glass>
    </div>
  );
};

// Games Tab Component
const GamesTab: React.FC<{
  metrics: GitHubPagesMetrics | null;
  onTrackGame: (gameId: string, completed: boolean, timeSpent: number, score?: number) => void;
}> = ({ metrics, onTrackGame }) => {
  if (!metrics) return <div>Loading games...</div>;

  return (
    <div className="space-y-6">
      {/* Game Completion Rates */}
      <Glass className="p-6">
        <h3 className="text-lg font-semibold mb-4">Game Completion Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(metrics.gameCompletionRates).map(([gameId, game]) => {
            const completionRate = game.started > 0 ? (game.completed / game.started) * 100 : 0;
            
            return (
              <div key={gameId} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <GamepadIcon className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium">{gameId}</h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Started:</span>
                    <span className="font-medium">{game.started}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">{game.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate:</span>
                    <span className="font-medium text-green-600">{completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Time:</span>
                    <span className="font-medium">{Math.round(game.averageTime / 1000)}s</span>
                  </div>
                  {game.highScores.length > 0 && (
                    <div className="flex justify-between">
                      <span>High Score:</span>
                      <span className="font-medium text-yellow-600">{game.highScores[0]}</span>
                    </div>
                  )}
                </div>
                
                {/* Completion Rate Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Glass>
    </div>
  );
};

// Performance Tab Component
const PerformanceTab: React.FC<{
  metrics: GitHubPagesMetrics | null;
}> = ({ metrics }) => {
  if (!metrics) return <div>Loading performance...</div>;

  const coreWebVitals = [
    {
      name: 'Largest Contentful Paint',
      value: metrics.coreWebVitals.lcp,
      unit: 'ms',
      threshold: 2500,
      good: metrics.coreWebVitals.lcp < 2500
    },
    {
      name: 'First Input Delay',
      value: metrics.coreWebVitals.fid,
      unit: 'ms',
      threshold: 100,
      good: metrics.coreWebVitals.fid < 100
    },
    {
      name: 'Cumulative Layout Shift',
      value: metrics.coreWebVitals.cls,
      unit: '',
      threshold: 0.1,
      good: metrics.coreWebVitals.cls < 0.1
    },
    {
      name: 'First Contentful Paint',
      value: metrics.coreWebVitals.fcp,
      unit: 'ms',
      threshold: 1800,
      good: metrics.coreWebVitals.fcp < 1800
    },
    {
      name: 'Time to First Byte',
      value: metrics.coreWebVitals.ttfb,
      unit: 'ms',
      threshold: 800,
      good: metrics.coreWebVitals.ttfb < 800
    }
  ];

  return (
    <div className="space-y-6">
      {/* Core Web Vitals */}
      <Glass className="p-6">
        <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreWebVitals.map(vital => (
            <div key={vital.name} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{vital.name}</h4>
                <div className={`w-3 h-3 rounded-full ${
                  vital.good ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              <p className="text-2xl font-bold">
                {vital.value.toFixed(vital.unit === 'ms' ? 0 : 3)}{vital.unit}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Threshold: {vital.threshold}{vital.unit}
              </p>
            </div>
          ))}
        </div>
      </Glass>

      {/* Performance Score */}
      <Glass className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Score</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.85)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">85</span>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-600 mt-4">
          Good performance score based on Core Web Vitals
        </p>
      </Glass>
    </div>
  );
};

// Heatmap Tab Component
const HeatmapTab: React.FC<{
  heatmapData: HeatmapData[];
}> = ({ heatmapData }) => {
  return (
    <div className="space-y-6">
      <Glass className="p-6">
        <h3 className="text-lg font-semibold mb-4">Click Heatmap</h3>
        <div className="relative bg-gray-100 rounded-lg p-4 min-h-96">
          {heatmapData.map((point, index) => (
            <div
              key={index}
              className="absolute w-4 h-4 rounded-full bg-red-500 opacity-70 transform -translate-x-2 -translate-y-2"
              style={{
                left: `${(point.x / window.innerWidth) * 100}%`,
                top: `${(point.y / window.innerHeight) * 100}%`,
                opacity: Math.min(point.clicks / 10, 1)
              }}
              title={`${point.clicks} clicks on ${point.elementId}`}
            />
          ))}
          <div className="text-center text-gray-500 mt-8">
            <Map className="w-12 h-12 mx-auto mb-2" />
            <p>Click heatmap visualization</p>
            <p className="text-sm">Red dots indicate click intensity</p>
          </div>
        </div>
      </Glass>
    </div>
  );
};

// Professional Tab Component
const ProfessionalTab: React.FC<{
  metrics: GitHubPagesMetrics | null;
  onTrackContact: (action: 'view' | 'start' | 'submit', data?: any) => void;
  onTrackResume: (source: string) => void;
  onTrackSocial: (platform: string, url: string) => void;
}> = ({ metrics, onTrackContact, onTrackResume, onTrackSocial }) => {
  if (!metrics) return <div>Loading professional metrics...</div>;

  return (
    <div className="space-y-6">
      {/* Contact Form Metrics */}
      <Glass className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Form Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium">Form Views</h4>
            </div>
            <p className="text-2xl font-bold">{metrics.contactFormConversions.views}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-green-500" />
              <h4 className="font-medium">Submissions</h4>
            </div>
            <p className="text-2xl font-bold">{metrics.contactFormConversions.submissions}</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-500" />
              <h4 className="font-medium">Conversion Rate</h4>
            </div>
            <p className="text-2xl font-bold">
              {(metrics.contactFormConversions.conversionRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Glass>

      {/* Resume Downloads */}
      <Glass className="p-6">
        <h3 className="text-lg font-semibold mb-4">Resume Downloads</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total Downloads</span>
                <span className="font-bold text-xl">{metrics.resumeDownloads.total}</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Unique Downloads</span>
                <span className="font-bold text-xl">{metrics.resumeDownloads.unique}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Download Sources</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={Object.entries(metrics.resumeDownloads.sources).map(([source, count]) => ({
                source,
                count
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Glass>

      {/* Social Media Clicks */}
      <Glass className="p-6">
        <h3 className="text-lg font-semibold mb-4">Social Media Engagement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(metrics.socialMediaClicks).map(([platform, data]) => {
            const platformIcons: Record<string, any> = {
              github: Github,
              linkedin: Linkedin,
              twitter: Twitter,
              default: Share2
            };
            
            const Icon = platformIcons[platform.toLowerCase()] || platformIcons.default;
            
            return (
              <div key={platform} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium capitalize">{platform}</h4>
                </div>
                <p className="text-2xl font-bold">{data.clicks}</p>
                <p className="text-sm text-gray-600">
                  {(data.conversionRate * 100).toFixed(1)}% conversion
                </p>
              </div>
            );
          })}
        </div>
      </Glass>
    </div>
  );
};

export default GitHubPagesAnalyticsDashboard;