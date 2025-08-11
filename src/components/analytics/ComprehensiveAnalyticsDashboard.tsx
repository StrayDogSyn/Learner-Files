import React, { useState, useEffect } from 'react';
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
  ResponsiveContainer
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
  SkipBack
} from 'lucide-react';
import { Glass } from '../ui/Glass';
import { EnhancedAnalyticsService } from '../../services/api/EnhancedAnalyticsService';
import { WebSocketService } from '../../services/api/WebSocketService';
import recommendationEngine, { Recommendation } from '../../services/api/RecommendationEngine';
import { HeatmapVisualization } from './HeatmapVisualization';
import { AIInsightsDashboard } from './AIInsightsDashboard';
import { ABTestingFramework } from './ABTestingFramework';
import { SessionRecording } from './SessionRecording';

interface DashboardMetrics {
  realTimeUsers: number;
  totalPageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number; engagement: number }>;
  trafficSources: Array<{ source: string; visitors: number; percentage: number }>;
  deviceBreakdown: Array<{ device: string; users: number; percentage: number }>;
  geographicData: Array<{ country: string; users: number; sessions: number }>;
  timeSeriesData: Array<{ time: string; users: number; pageViews: number; conversions: number }>;
  userFlow: Array<{ from: string; to: string; users: number }>;
  performanceMetrics: {
    pageLoadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
  };
  aiInsights: {
    recommendations: Recommendation[];
    anomalies: Array<{ metric: string; value: number; expected: number; severity: 'low' | 'medium' | 'high' }>;
    predictions: Array<{ metric: string; predicted: number; confidence: number; timeframe: string }>;
  };
}

interface DashboardFilters {
  dateRange: '1h' | '24h' | '7d' | '30d' | '90d' | 'custom';
  customDateRange?: { start: Date; end: Date };
  segment: 'all' | 'new' | 'returning' | 'mobile' | 'desktop';
  page?: string;
  source?: string;
  country?: string;
}

interface AlertConfig {
  id: string;
  name: string;
  metric: string;
  condition: 'above' | 'below' | 'equals';
  threshold: number;
  enabled: boolean;
  notifications: ('email' | 'push' | 'slack')[];
}

const ComprehensiveAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: '24h',
    segment: 'all'
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'heatmap' | 'ai-insights' | 'ab-testing' | 'sessions' | 'performance'>('overview');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Array<{ id: string; type: 'info' | 'warning' | 'error' | 'success'; message: string; timestamp: Date }>>([]);

  const analyticsService = new EnhancedAnalyticsService();
  const wsService = new WebSocketService();

  useEffect(() => {
    initializeDashboard();
    setupRealTimeUpdates();
    loadAlertConfigurations();

    return () => {
      wsService.disconnect();
    };
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [filters]);

  const initializeDashboard = async () => {
    try {
      setIsLoading(true);
      await loadMetrics();
      await loadRecommendations();
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      addNotification('error', 'Failed to initialize dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    if (isRealTimeEnabled) {
      wsService.connect('ws://localhost:3001');
      
      wsService.on('analytics_update', (data) => {
        setMetrics(prev => prev ? { ...prev, ...data } : null);
      });

      wsService.on('alert_triggered', (alert) => {
        addNotification('warning', `Alert: ${alert.name} - ${alert.message}`);
      });
    }
  };

  const loadMetrics = async () => {
    try {
      // Mock comprehensive metrics data
      const mockMetrics: DashboardMetrics = {
        realTimeUsers: 47,
        totalPageViews: 12847,
        uniqueVisitors: 3421,
        averageSessionDuration: 245,
        bounceRate: 0.34,
        conversionRate: 0.087,
        topPages: [
          { page: '/portfolio', views: 4521, engagement: 0.78 },
          { page: '/about', views: 3102, engagement: 0.65 },
          { page: '/contact', views: 2847, engagement: 0.82 },
          { page: '/blog', views: 1923, engagement: 0.59 },
          { page: '/projects/react-app', views: 1654, engagement: 0.71 }
        ],
        trafficSources: [
          { source: 'Organic Search', visitors: 1847, percentage: 54 },
          { source: 'Direct', visitors: 821, percentage: 24 },
          { source: 'Social Media', visitors: 445, percentage: 13 },
          { source: 'Referral', visitors: 308, percentage: 9 }
        ],
        deviceBreakdown: [
          { device: 'Desktop', users: 1923, percentage: 56 },
          { device: 'Mobile', users: 1204, percentage: 35 },
          { device: 'Tablet', users: 294, percentage: 9 }
        ],
        geographicData: [
          { country: 'United States', users: 1547, sessions: 2341 },
          { country: 'United Kingdom', users: 623, sessions: 891 },
          { country: 'Canada', users: 445, sessions: 667 },
          { country: 'Germany', users: 387, sessions: 523 },
          { country: 'Australia', users: 298, sessions: 412 }
        ],
        timeSeriesData: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          users: Math.floor(Math.random() * 100) + 20,
          pageViews: Math.floor(Math.random() * 300) + 50,
          conversions: Math.floor(Math.random() * 20) + 2
        })),
        userFlow: [
          { from: 'Landing Page', to: 'Portfolio', users: 1234 },
          { from: 'Portfolio', to: 'Project Details', users: 856 },
          { from: 'Project Details', to: 'Contact', users: 423 },
          { from: 'About', to: 'Portfolio', users: 678 },
          { from: 'Contact', to: 'Thank You', users: 234 }
        ],
        performanceMetrics: {
          pageLoadTime: 1.2,
          firstContentfulPaint: 0.8,
          largestContentfulPaint: 1.5,
          cumulativeLayoutShift: 0.05
        },
        aiInsights: {
          recommendations: [],
          anomalies: [
            { metric: 'Bounce Rate', value: 0.45, expected: 0.34, severity: 'medium' },
            { metric: 'Page Load Time', value: 2.1, expected: 1.2, severity: 'high' }
          ],
          predictions: [
            { metric: 'Monthly Visitors', predicted: 15000, confidence: 0.87, timeframe: '30 days' },
            { metric: 'Conversion Rate', predicted: 0.095, confidence: 0.73, timeframe: '7 days' }
          ]
        }
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading metrics:', error);
      addNotification('error', 'Failed to load analytics data');
    }
  };

  const loadRecommendations = async () => {
    try {
      const recommendations = await recommendationEngine.generateRecommendations(
        'user_123',
        {
          currentPage: '/dashboard',
          userSegment: 'admin',
          sessionData: { duration: 300, pageViews: 5, interactions: 12 },
          businessGoals: ['increase_engagement', 'improve_conversions'],
          constraints: { timeline: '2 weeks' },
          preferences: { contentTypes: ['analytics', 'insights'], excludeCategories: [], prioritizeConversions: true, focusAreas: ['performance'] }
        },
        { maxRecommendations: 5, includeABTests: true }
      );

      setMetrics(prev => prev ? {
        ...prev,
        aiInsights: {
          ...prev.aiInsights,
          recommendations
        }
      } : null);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const loadAlertConfigurations = () => {
    const mockAlerts: AlertConfig[] = [
      {
        id: 'alert_1',
        name: 'High Bounce Rate',
        metric: 'bounceRate',
        condition: 'above',
        threshold: 0.5,
        enabled: true,
        notifications: ['email', 'push']
      },
      {
        id: 'alert_2',
        name: 'Low Conversion Rate',
        metric: 'conversionRate',
        condition: 'below',
        threshold: 0.05,
        enabled: true,
        notifications: ['email']
      }
    ];

    setAlerts(mockAlerts);
  };

  const addNotification = (type: 'info' | 'warning' | 'error' | 'success', message: string) => {
    const notification = {
      id: `notif_${Date.now()}`,
      type,
      message,
      timestamp: new Date()
    };

    setNotifications(prev => [notification, ...prev.slice(0, 4)]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const exportData = (format: 'csv' | 'pdf' | 'json') => {
    if (!metrics) return;

    const data = {
      metrics,
      filters,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification('success', `Report exported as ${format.toUpperCase()}`);
  };

  const refreshData = async () => {
    setIsLoading(true);
    await loadMetrics();
    await loadRecommendations();
    setIsLoading(false);
    addNotification('success', 'Dashboard data refreshed');
  };

  const getMetricIcon = (metric: string) => {
    const icons: Record<string, React.ReactNode> = {
      users: <Users className="w-5 h-5" />,
      pageViews: <Eye className="w-5 h-5" />,
      sessions: <Clock className="w-5 h-5" />,
      bounceRate: <TrendingDown className="w-5 h-5" />,
      conversionRate: <Target className="w-5 h-5" />
    };
    return icons[metric] || <Activity className="w-5 h-5" />;
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      info: <Info className="w-4 h-4" />,
      warning: <AlertCircle className="w-4 h-4" />,
      error: <AlertCircle className="w-4 h-4" />,
      success: <CheckCircle className="w-4 h-4" />
    };
    return icons[type];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-300">Comprehensive insights and AI-powered recommendations</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Real-time indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-sm text-slate-300">
                {isRealTimeEnabled ? 'Live' : 'Offline'}
              </span>
            </div>

            {/* Action buttons */}
            <button
              onClick={refreshData}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={() => exportData('json')}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              title="Export Data"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {notifications.length > 0 && (
            <div className="fixed top-4 right-4 z-50 space-y-2">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${
                    notification.type === 'error' ? 'bg-red-600' :
                    notification.type === 'warning' ? 'bg-yellow-600' :
                    notification.type === 'success' ? 'bg-green-600' :
                    'bg-blue-600'
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                  <span className="text-white text-sm">{notification.message}</span>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <Glass className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <select
                value={filters.segment}
                onChange={(e) => setFilters(prev => ({ ...prev, segment: e.target.value as any }))}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm"
              >
                <option value="all">All Users</option>
                <option value="new">New Users</option>
                <option value="returning">Returning Users</option>
                <option value="mobile">Mobile Users</option>
                <option value="desktop">Desktop Users</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search pages, sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm w-48"
              />
            </div>
          </div>
        </Glass>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'heatmap', label: 'Heatmap', icon: <Map className="w-4 h-4" /> },
            { id: 'ai-insights', label: 'AI Insights', icon: <Brain className="w-4 h-4" /> },
            { id: 'ab-testing', label: 'A/B Testing', icon: <Layers className="w-4 h-4" /> },
            { id: 'sessions', label: 'Sessions', icon: <PlayCircle className="w-4 h-4" /> },
            { id: 'performance', label: 'Performance', icon: <Zap className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && metrics && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Real-time Users', value: metrics.realTimeUsers, icon: 'users', change: '+12%' },
                  { label: 'Page Views', value: metrics.totalPageViews.toLocaleString(), icon: 'pageViews', change: '+8%' },
                  { label: 'Avg. Session', value: `${Math.floor(metrics.averageSessionDuration / 60)}m ${metrics.averageSessionDuration % 60}s`, icon: 'sessions', change: '+5%' },
                  { label: 'Conversion Rate', value: `${(metrics.conversionRate * 100).toFixed(1)}%`, icon: 'conversionRate', change: '+15%' }
                ].map((metric, index) => (
                  <Glass key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        {getMetricIcon(metric.icon)}
                      </div>
                      <span className="text-green-400 text-sm font-medium">{metric.change}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-slate-400 text-sm">{metric.label}</div>
                  </Glass>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Time Series Chart */}
                <Glass className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Traffic Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={metrics.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stackId="1"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="pageViews"
                        stackId="1"
                        stroke="#06B6D4"
                        fill="#06B6D4"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Glass>

                {/* Device Breakdown */}
                <Glass className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Device Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={metrics.deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="users"
                        label={({ device, percentage }) => `${device} ${percentage}%`}
                      >
                        {metrics.deviceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#8B5CF6', '#06B6D4', '#10B981'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Glass>
              </div>

              {/* Top Pages and Traffic Sources */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Glass className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Top Pages</h3>
                  <div className="space-y-4">
                    {metrics.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-white font-medium">{page.page}</div>
                          <div className="text-slate-400 text-sm">{page.views.toLocaleString()} views</div>
                        </div>
                        <div className="text-right">
                          <div className="text-purple-400 font-medium">{(page.engagement * 100).toFixed(1)}%</div>
                          <div className="text-slate-400 text-sm">engagement</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Glass>

                <Glass className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Traffic Sources</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={metrics.trafficSources}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="source" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="visitors" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </Glass>
              </div>
            </div>
          )}

          {activeTab === 'heatmap' && (
            <HeatmapVisualization data={[]} />
          )}

          {activeTab === 'ai-insights' && (
            <AIInsightsDashboard 
              insights={[]}
              onGenerateInsights={() => {}}
              onInsightAction={() => {}}
            />
          )}

          {activeTab === 'ab-testing' && (
            <ABTestingFramework 
              tests={[]}
              onCreateTest={() => {}}
              onUpdateTest={() => {}}
              onDeleteTest={() => {}}
              onStartTest={() => {}}
              onStopTest={() => {}}
              onViewResults={() => {}}
            />
          )}

          {activeTab === 'sessions' && (
            <SessionRecording 
              recordings={[]}
              onPlayRecording={() => {}}
              onDeleteRecording={() => {}}
              onExportRecording={() => {}}
              onFilterRecordings={() => {}}
              onSearchRecordings={() => {}}
              onTagRecording={() => {}}
            />
          )}

          {activeTab === 'performance' && metrics && (
            <div className="space-y-8">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Page Load Time', value: `${metrics.performanceMetrics.pageLoadTime}s`, status: metrics.performanceMetrics.pageLoadTime < 2 ? 'good' : 'poor' },
                  { label: 'First Contentful Paint', value: `${metrics.performanceMetrics.firstContentfulPaint}s`, status: metrics.performanceMetrics.firstContentfulPaint < 1 ? 'good' : 'poor' },
                  { label: 'Largest Contentful Paint', value: `${metrics.performanceMetrics.largestContentfulPaint}s`, status: metrics.performanceMetrics.largestContentfulPaint < 2.5 ? 'good' : 'poor' },
                  { label: 'Cumulative Layout Shift', value: metrics.performanceMetrics.cumulativeLayoutShift.toFixed(3), status: metrics.performanceMetrics.cumulativeLayoutShift < 0.1 ? 'good' : 'poor' }
                ].map((metric, index) => (
                  <Glass key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg ${
                        metric.status === 'good' ? 'bg-green-600/20' : 'bg-red-600/20'
                      }`}>
                        <Zap className={`w-5 h-5 ${
                          metric.status === 'good' ? 'text-green-400' : 'text-red-400'
                        }`} />
                      </div>
                      <span className={`text-sm font-medium ${
                        metric.status === 'good' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {metric.status === 'good' ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-slate-400 text-sm">{metric.label}</div>
                  </Glass>
                ))}
              </div>

              {/* Anomalies and Predictions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Glass className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Anomalies Detected</h3>
                  <div className="space-y-4">
                    {metrics.aiInsights.anomalies.map((anomaly, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertCircle className={`w-5 h-5 ${
                            anomaly.severity === 'high' ? 'text-red-400' :
                            anomaly.severity === 'medium' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`} />
                          <div>
                            <div className="text-white font-medium">{anomaly.metric}</div>
                            <div className="text-slate-400 text-sm">
                              Current: {anomaly.value} | Expected: {anomaly.expected}
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          anomaly.severity === 'high' ? 'bg-red-600/20 text-red-400' :
                          anomaly.severity === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-blue-600/20 text-blue-400'
                        }`}>
                          {anomaly.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </Glass>

                <Glass className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">AI Predictions</h3>
                  <div className="space-y-4">
                    {metrics.aiInsights.predictions.map((prediction, index) => (
                      <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-white font-medium">{prediction.metric}</div>
                          <span className="text-purple-400 font-medium">
                            {(prediction.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{prediction.predicted.toLocaleString()}</div>
                        <div className="text-slate-400 text-sm">{prediction.timeframe}</div>
                      </div>
                    ))}
                  </div>
                </Glass>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ComprehensiveAnalyticsDashboard;