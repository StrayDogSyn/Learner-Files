// Professional Tab Component
const ProfessionalTab: React.FC<{
  metrics: GitHubPagesMetrics | null;
  onTrackContact: (action: 'view' | 'start' | 'submit', data?: Record<string, unknown>) => void;
  onTrackResume: (source: string) => void;
  onTrackSocial: (platform: string, url: string) => void;
}> = ({ metrics }) => {
  if (!metrics) return <div>Loading professional metrics...</div>;
  return (
    <div className="space-y-6">
      {/* Download Metrics */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span>Unique Downloads</span>
          <span className="font-bold text-xl">{metrics.resumeDownloads.unique}</span>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GitHubPagesAnalyticsDashboard.module.css';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  Eye,
  TrendingUp,
  Calendar,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle,
  Info,
  Target,
  BarChart3,
  Map,
  Layers,
  GamepadIcon,
  Gauge
} from 'lucide-react';
// Fallback for Glass if missing
interface GlassProps {
  children: React.ReactNode;
  className?: string;
}
const Glass: React.FC<GlassProps> = ({ children, className }) => <div className={className}>{children}</div>;
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
  const [isRealTimeEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>([]);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh] = useState(true);

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
  }, [analyticsService, loadMetrics]);

  // Real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled || !autoRefresh) return;

    const interval = setInterval(() => {
      loadMetrics();
      updateLiveVisitors();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, autoRefresh, loadMetrics, updateLiveVisitors]);

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
            {/* Download Metrics */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total Downloads</span>
                <span className="font-bold text-xl">{metrics?.resumeDownloads?.total ?? 0}</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Unique Downloads</span>
                <span className="font-bold text-xl">{metrics?.resumeDownloads?.unique ?? 0}</span>
              </div>
            </div>
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
      </div>
      {/* Filters */}
      <Glass className="p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <label htmlFor="dateRange" className="sr-only">Date Range</label>
            <select
              id="dateRange"
              aria-label="Date Range"
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as DashboardFilters['dateRange'] }))}
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
                    <label htmlFor="segment" className="sr-only">Visitor Segment</label>
                    <select
                      id="segment"
                      aria-label="Visitor Segment"
                      value={filters.segment}
                      onChange={(e) => setFilters(prev => ({ ...prev, segment: e.target.value as DashboardFilters['segment'] }))}
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
              className="refreshBtn"
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
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

        {/* Dashboard Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <OverviewTab 
            metrics={metrics} 
            liveVisitors={liveVisitors}
            onTrackEvent={(event, data) => {
              if (event === 'page_view' && data && typeof data === 'object' && 'path' in data && 'title' in data) {
                analyticsService.trackPageView(data.path as string, data.title as string);
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

export default GitHubPagesAnalyticsDashboard;

// Overview Tab Component
const OverviewTab: React.FC<{
  metrics: GitHubPagesMetrics | null;
  liveVisitors: LiveVisitor[];
  onTrackEvent: (event: string, data: Record<string, unknown>) => void;
}> = ({ metrics }) => {
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
    </div>
  );
};

// Projects Tab Component
const ProjectsTab: React.FC<{
  metrics: GitHubPagesMetrics | null;
  onTrackProject: (projectId: string, projectName: string) => void;
}> = ({ metrics }) => {
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
}> = ({ metrics }) => {
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
                  <div className="progressBar">
                    <div 
                      className="progressBarFill"
                      data-completion-rate={completionRate}
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
              className="heatmapDot"
              style={{
                '--heatmap-left': `${(point.x / window.innerWidth) * 100}%`,
                '--heatmap-top': `${(point.y / window.innerHeight) * 100}%`,
                '--heatmap-opacity': Math.min(point.clicks / 10, 1)
              } as React.CSSProperties}
              title={`${point.clicks} clicks on ${point.elementId}`}
            ></div>
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
