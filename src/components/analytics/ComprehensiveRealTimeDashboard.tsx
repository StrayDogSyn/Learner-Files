import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Eye, Clock, TrendingUp, Download, MousePointer, Target, AlertTriangle, Activity, Globe } from 'lucide-react';
import GitHubPagesAnalyticsService from '@/services/api/GitHubPagesAnalyticsService';
import PerformanceMonitoringService from '@/services/PerformanceMonitoringService';
import UserBehaviorService from '@/services/UserBehaviorService';
import ProfessionalMetricsService from '@/services/ProfessionalMetricsService';
import { getWebSocketService } from '@/services/WebSocketService';

interface RealTimeMetrics {
  liveVisitors: number;
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  performanceScore: number;
  errorRate: number;
  goalCompletions: number;
}

interface LiveVisitor {
  id: string;
  page: string;
  country: string;
  device: string;
  timestamp: number;
  duration: number;
}

interface PerformanceAlert {
  id: string;
  type: 'performance' | 'error' | 'goal' | 'conversion';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
}

const ComprehensiveRealTimeDashboard: React.FC = () => {
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics>({
    liveVisitors: 0,
    pageViews: 0,
    sessionDuration: 0,
    bounceRate: 0,
    conversionRate: 0,
    performanceScore: 0,
    errorRate: 0,
    goalCompletions: 0
  });

  const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [conversionFunnelData, setConversionFunnelData] = useState<any[]>([]);
  const [trafficSources, setTrafficSources] = useState<any[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [socialMetrics, setSocialMetrics] = useState<any[]>([]);
  const [formMetrics, setFormMetrics] = useState<any[]>([]);
  const [resumeMetrics, setResumeMetrics] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);
  const [goalProgress, setGoalProgress] = useState<any[]>([]);

  const analyticsService = useRef(new GitHubPagesAnalyticsService());
  const performanceService = useRef(new PerformanceMonitoringService());
  const behaviorService = useRef(new UserBehaviorService());
  const professionalService = useRef(new ProfessionalMetricsService());
  const webSocketService = useRef(getWebSocketService());
  const updateInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeServices();
    setupRealTimeUpdates();
    loadInitialData();

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
      destroyServices();
    };
  }, []);

  useEffect(() => {
    if (isRealTimeEnabled) {
      setupRealTimeUpdates();
    } else {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    }
  }, [isRealTimeEnabled]);

  const initializeServices = async () => {
    try {
      await analyticsService.current.initialize();
      await performanceService.current.initialize();
      await behaviorService.current.initialize();
      await professionalService.current.initialize();
      console.log('All analytics services initialized');
    } catch (error) {
      console.error('Failed to initialize analytics services:', error);
    }
  };

  const destroyServices = () => {
    analyticsService.current.destroy();
    performanceService.current.destroy();
    behaviorService.current.destroy();
    professionalService.current.destroy();
  };

  const setupRealTimeUpdates = () => {
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
    }

    // Update metrics every 5 seconds
    updateInterval.current = setInterval(() => {
      updateRealTimeMetrics();
      updateLiveVisitors();
      checkForAlerts();
    }, 5000);

    // Setup WebSocket listeners
    webSocketService.current.onMessage((message) => {
      handleWebSocketMessage(message);
    });
  };

  const loadInitialData = async () => {
    try {
      // Load analytics data
      const metrics = analyticsService.current.getMetrics();
      updateMetricsFromAnalytics(metrics);

      // Load performance data
      const perfMetrics = performanceService.current.getPerformanceMetrics();
      setPerformanceMetrics(formatPerformanceData(perfMetrics));

      // Load behavior data
      const heatmap = behaviorService.current.getHeatmapData();
      setHeatmapData(formatHeatmapData(heatmap));

      // Load professional metrics
      const formData = professionalService.current.getContactFormMetrics();
      setFormMetrics(formData);

      const resumeData = professionalService.current.getResumeMetrics();
      setResumeMetrics(resumeData);

      const socialData = professionalService.current.getSocialMediaMetrics();
      setSocialMetrics(socialData);

      const goals = professionalService.current.getGoals();
      setGoalProgress(goals);

      // Generate mock data for demo
      generateMockData();
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const updateRealTimeMetrics = () => {
    // Simulate real-time metrics updates
    setRealTimeMetrics(prev => ({
      liveVisitors: Math.max(0, prev.liveVisitors + Math.floor(Math.random() * 3) - 1),
      pageViews: prev.pageViews + Math.floor(Math.random() * 5),
      sessionDuration: prev.sessionDuration + Math.random() * 10,
      bounceRate: Math.max(0, Math.min(100, prev.bounceRate + (Math.random() - 0.5) * 2)),
      conversionRate: Math.max(0, Math.min(100, prev.conversionRate + (Math.random() - 0.5))),
      performanceScore: Math.max(0, Math.min(100, prev.performanceScore + (Math.random() - 0.5) * 2)),
      errorRate: Math.max(0, Math.min(10, prev.errorRate + (Math.random() - 0.5) * 0.1)),
      goalCompletions: prev.goalCompletions + (Math.random() > 0.9 ? 1 : 0)
    }));
  };

  const updateLiveVisitors = () => {
    const now = Date.now();
    const countries = ['US', 'UK', 'CA', 'DE', 'FR', 'AU', 'JP', 'BR'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    const pages = ['/', '/projects', '/about', '/contact', '/resume'];

    // Remove old visitors (older than 5 minutes)
    setLiveVisitors(prev => {
      const filtered = prev.filter(visitor => now - visitor.timestamp < 300000);
      
      // Add new visitors occasionally
      if (Math.random() > 0.7) {
        const newVisitor: LiveVisitor = {
          id: `visitor-${now}-${Math.random().toString(36).substr(2, 9)}`,
          page: pages[Math.floor(Math.random() * pages.length)],
          country: countries[Math.floor(Math.random() * countries.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
          timestamp: now,
          duration: 0
        };
        return [...filtered, newVisitor];
      }
      
      return filtered.map(visitor => ({
        ...visitor,
        duration: now - visitor.timestamp
      }));
    });
  };

  const checkForAlerts = () => {
    const now = Date.now();
    const newAlerts: PerformanceAlert[] = [];

    // Check performance thresholds
    if (realTimeMetrics.performanceScore < 70) {
      newAlerts.push({
        id: `perf-${now}`,
        type: 'performance',
        severity: realTimeMetrics.performanceScore < 50 ? 'critical' : 'high',
        message: `Performance score dropped to ${realTimeMetrics.performanceScore.toFixed(1)}`,
        timestamp: now,
        resolved: false
      });
    }

    // Check error rate
    if (realTimeMetrics.errorRate > 2) {
      newAlerts.push({
        id: `error-${now}`,
        type: 'error',
        severity: realTimeMetrics.errorRate > 5 ? 'critical' : 'medium',
        message: `Error rate increased to ${realTimeMetrics.errorRate.toFixed(2)}%`,
        timestamp: now,
        resolved: false
      });
    }

    // Check conversion rate
    if (realTimeMetrics.conversionRate < 2) {
      newAlerts.push({
        id: `conv-${now}`,
        type: 'conversion',
        severity: 'medium',
        message: `Conversion rate below target: ${realTimeMetrics.conversionRate.toFixed(2)}%`,
        timestamp: now,
        resolved: false
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 20)); // Keep last 20 alerts
    }
  };

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'visitor_update':
        updateRealTimeMetrics();
        break;
      case 'performance_alert':
        setAlerts(prev => [message.data, ...prev].slice(0, 20));
        break;
      case 'goal_completion':
        setRealTimeMetrics(prev => ({ ...prev, goalCompletions: prev.goalCompletions + 1 }));
        break;
      case 'form_submission':
        setRealTimeMetrics(prev => ({ ...prev, conversionRate: message.data.conversionRate }));
        break;
    }
  };

  const updateMetricsFromAnalytics = (metrics: any) => {
    setRealTimeMetrics(prev => ({
      ...prev,
      pageViews: metrics.totalPageViews || prev.pageViews,
      sessionDuration: metrics.averageSessionDuration || prev.sessionDuration,
      bounceRate: metrics.bounceRate || prev.bounceRate
    }));
  };

  const formatPerformanceData = (metrics: any) => {
    return [
      { name: 'LCP', value: metrics.lcp || 0, threshold: 2500 },
      { name: 'FID', value: metrics.fid || 0, threshold: 100 },
      { name: 'CLS', value: metrics.cls || 0, threshold: 0.1 },
      { name: 'FCP', value: metrics.fcp || 0, threshold: 1800 },
      { name: 'TTFB', value: metrics.ttfb || 0, threshold: 800 }
    ];
  };

  const formatHeatmapData = (heatmap: any[]) => {
    return heatmap.slice(0, 100); // Limit for performance
  };

  const generateMockData = () => {
    // Traffic sources
    setTrafficSources([
      { name: 'Direct', value: 45, color: '#8884d8' },
      { name: 'Google', value: 30, color: '#82ca9d' },
      { name: 'LinkedIn', value: 15, color: '#ffc658' },
      { name: 'GitHub', value: 10, color: '#ff7300' }
    ]);

    // Device breakdown
    setDeviceBreakdown([
      { name: 'Desktop', value: 60, color: '#8884d8' },
      { name: 'Mobile', value: 35, color: '#82ca9d' },
      { name: 'Tablet', value: 5, color: '#ffc658' }
    ]);

    // Top pages
    setTopPages([
      { page: '/', views: 1250, uniqueViews: 980, avgTime: 145 },
      { page: '/projects', views: 890, uniqueViews: 720, avgTime: 210 },
      { page: '/about', views: 650, uniqueViews: 580, avgTime: 95 },
      { page: '/contact', views: 420, uniqueViews: 380, avgTime: 180 },
      { page: '/resume', views: 320, uniqueViews: 290, avgTime: 60 }
    ]);

    // Conversion funnel
    setConversionFunnelData([
      { step: 'Landing', users: 1000, rate: 100 },
      { step: 'Project View', users: 650, rate: 65 },
      { step: 'Contact Page', users: 180, rate: 18 },
      { step: 'Form Start', users: 120, rate: 12 },
      { step: 'Form Submit', users: 85, rate: 8.5 }
    ]);
  };

  const exportData = (format: 'json' | 'csv') => {
    const data = {
      realTimeMetrics,
      liveVisitors,
      alerts,
      heatmapData,
      conversionFunnelData,
      trafficSources,
      deviceBreakdown,
      topPages,
      socialMetrics,
      formMetrics,
      resumeMetrics,
      performanceMetrics,
      goalProgress,
      exportedAt: new Date().toISOString()
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Simplified CSV export
      const csvData = [
        ['Metric', 'Value'],
        ['Live Visitors', realTimeMetrics.liveVisitors],
        ['Page Views', realTimeMetrics.pageViews],
        ['Session Duration', realTimeMetrics.sessionDuration],
        ['Bounce Rate', realTimeMetrics.bounceRate],
        ['Conversion Rate', realTimeMetrics.conversionRate],
        ['Performance Score', realTimeMetrics.performanceScore],
        ['Error Rate', realTimeMetrics.errorRate],
        ['Goal Completions', realTimeMetrics.goalCompletions]
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Real-Time Analytics Dashboard</h1>
          <p className="text-slate-600 mt-1">Comprehensive portfolio performance monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isRealTimeEnabled ? "default" : "outline"}
            onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            {isRealTimeEnabled ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" onClick={() => exportData('json')}>
            Export JSON
          </Button>
          <Button variant="outline" onClick={() => exportData('csv')}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Live Visitors</p>
                <p className="text-2xl font-bold">{realTimeMetrics.liveVisitors}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Page Views</p>
                <p className="text-2xl font-bold">{realTimeMetrics.pageViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Avg. Session</p>
                <p className="text-2xl font-bold">{formatDuration(realTimeMetrics.sessionDuration * 1000)}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold">{realTimeMetrics.conversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.filter(alert => !alert.resolved).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">Active Alerts</h3>
          <div className="grid gap-2">
            {alerts.filter(alert => !alert.resolved).slice(0, 3).map(alert => (
              <Alert key={alert.id} className="border-l-4 border-l-red-500">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(alert.severity) as any}>
                      {alert.severity}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>
                      Resolve
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deviceBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{page.page}</p>
                        <p className="text-sm text-slate-600">{page.views} views • {page.uniqueViews} unique</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatDuration(page.avgTime * 1000)}</p>
                      <p className="text-sm text-slate-600">avg. time</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-4">
          {/* Live Visitors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Live Visitors ({liveVisitors.length})
              </CardTitle>
              <CardDescription>
                Real-time visitor activity on your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {liveVisitors.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No live visitors at the moment</p>
                ) : (
                  liveVisitors.map(visitor => (
                    <div key={visitor.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium">{visitor.page}</p>
                          <p className="text-sm text-slate-600">{visitor.country} • {visitor.device}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatDuration(visitor.duration)}</p>
                        <p className="text-xs text-slate-500">on page</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnelData.map((step, index) => (
                  <div key={step.step} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{step.step}</span>
                      <span className="text-sm text-slate-600">{step.users} users ({step.rate}%)</span>
                    </div>
                    <Progress value={step.rate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Core Web Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals</CardTitle>
              <CardDescription>
                Performance metrics that impact user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                  <Bar dataKey="threshold" fill="#ff7300" opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Score */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={realTimeMetrics.performanceScore >= 90 ? 'text-green-500' : 
                                realTimeMetrics.performanceScore >= 70 ? 'text-yellow-500' : 'text-red-500'}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${realTimeMetrics.performanceScore}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{realTimeMetrics.performanceScore.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          {/* Heatmap placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>User Interaction Heatmap</CardTitle>
              <CardDescription>
                Click patterns and user engagement areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-blue-100 via-green-100 to-red-100 rounded-lg flex items-center justify-center">
                <p className="text-slate-600">Heatmap visualization would appear here</p>
              </div>
            </CardContent>
          </Card>

          {/* Session recordings placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Session Recordings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MousePointer className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium">Session {i}</p>
                        <p className="text-sm text-slate-600">Duration: {Math.floor(Math.random() * 300) + 60}s</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Recording
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          {/* Contact Form Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formMetrics.length === 0 ? (
                    <p className="text-slate-500">No form data available</p>
                  ) : (
                    formMetrics.map(form => (
                      <div key={form.formId} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{form.formName}</span>
                          <span className="text-sm text-slate-600">{form.conversionRate.toFixed(1)}% conversion</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-slate-600">Views</p>
                            <p className="font-medium">{form.views}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Starts</p>
                            <p className="font-medium">{form.starts}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Submissions</p>
                            <p className="font-medium">{form.submissions}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resume Downloads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Resume Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resumeMetrics ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-bold">{resumeMetrics.totalDownloads}</p>
                        <p className="text-sm text-slate-600">Total Downloads</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{resumeMetrics.uniqueDownloads}</p>
                        <p className="text-sm text-slate-600">Unique Downloads</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">By Device</h4>
                      {resumeMetrics.downloadsByDevice.map((device: any) => (
                        <div key={device.device} className="flex justify-between">
                          <span>{device.device}</span>
                          <span>{device.downloads}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">No resume download data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Social Media Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialMetrics.length === 0 ? (
                  <p className="text-slate-500 col-span-full">No social media data available</p>
                ) : (
                  socialMetrics.map(social => (
                    <div key={social.platform} className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium capitalize">{social.platform}</h4>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Clicks</span>
                          <span className="font-medium">{social.clicks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">CTR</span>
                          <span className="font-medium">{social.clickThroughRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {/* Goal Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goalProgress.length === 0 ? (
                  <p className="text-slate-500">No goals configured</p>
                ) : (
                  goalProgress.map(goal => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{goal.name}</span>
                        <Badge variant={goal.active ? "default" : "secondary"}>
                          {goal.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>{goal.current} / {goal.target}</span>
                        <span>{((goal.current / goal.target) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Goal Completions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Goal Completions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-green-600">{realTimeMetrics.goalCompletions}</div>
                <p className="text-slate-600 mt-2">Goals completed today</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveRealTimeDashboard;