import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Share2,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import TouchGestureHandler from './TouchGestureHandler';

interface AnalyticsData {
  overview: {
    totalVisitors: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    trends: {
      visitors: number;
      pageViews: number;
      sessionDuration: number;
      bounceRate: number;
    };
  };
  traffic: Array<{
    date: string;
    visitors: number;
    pageViews: number;
    sessions: number;
  }>;
  devices: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topPages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
    avgTime: number;
  }>;
  referrers: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  realTime: {
    activeUsers: number;
    currentPageViews: number;
    topPages: Array<{
      page: string;
      activeUsers: number;
    }>;
  };
}

interface MobileAnalyticsDashboardProps {
  data?: AnalyticsData;
  className?: string;
  refreshInterval?: number;
  onRefresh?: () => Promise<void>;
  onExport?: (format: 'pdf' | 'csv' | 'json') => void;
  onShare?: () => void;
  dateRange?: {
    start: Date;
    end: Date;
  };
  onDateRangeChange?: (range: { start: Date; end: Date }) => void;
}

const mockData: AnalyticsData = {
  overview: {
    totalVisitors: 12543,
    pageViews: 45678,
    avgSessionDuration: 245,
    bounceRate: 32.5,
    conversionRate: 4.2,
    trends: {
      visitors: 12.5,
      pageViews: 8.3,
      sessionDuration: -2.1,
      bounceRate: -5.4
    }
  },
  traffic: [
    { date: '2024-01-01', visitors: 1200, pageViews: 3400, sessions: 1100 },
    { date: '2024-01-02', visitors: 1350, pageViews: 3800, sessions: 1250 },
    { date: '2024-01-03', visitors: 1100, pageViews: 3200, sessions: 1000 },
    { date: '2024-01-04', visitors: 1450, pageViews: 4100, sessions: 1350 },
    { date: '2024-01-05', visitors: 1600, pageViews: 4500, sessions: 1500 },
    { date: '2024-01-06', visitors: 1300, pageViews: 3700, sessions: 1200 },
    { date: '2024-01-07', visitors: 1750, pageViews: 4900, sessions: 1650 }
  ],
  devices: [
    { name: 'Mobile', value: 65, color: '#3b82f6' },
    { name: 'Desktop', value: 25, color: '#10b981' },
    { name: 'Tablet', value: 10, color: '#f59e0b' }
  ],
  topPages: [
    { page: '/portfolio', views: 8500, uniqueViews: 6200, avgTime: 180 },
    { page: '/about', views: 6200, uniqueViews: 4800, avgTime: 120 },
    { page: '/contact', views: 4100, uniqueViews: 3500, avgTime: 90 },
    { page: '/projects/web-app', views: 3200, uniqueViews: 2800, avgTime: 240 },
    { page: '/blog', views: 2800, uniqueViews: 2200, avgTime: 300 }
  ],
  referrers: [
    { source: 'Direct', visitors: 4500, percentage: 36 },
    { source: 'Google', visitors: 3200, percentage: 25.5 },
    { source: 'LinkedIn', visitors: 2100, percentage: 16.7 },
    { source: 'GitHub', visitors: 1800, percentage: 14.3 },
    { source: 'Twitter', visitors: 900, percentage: 7.2 }
  ],
  realTime: {
    activeUsers: 47,
    currentPageViews: 156,
    topPages: [
      { page: '/portfolio', activeUsers: 18 },
      { page: '/about', activeUsers: 12 },
      { page: '/contact', activeUsers: 8 },
      { page: '/projects', activeUsers: 9 }
    ]
  }
};

const MobileAnalyticsDashboard: React.FC<MobileAnalyticsDashboardProps> = ({
  data = mockData,
  className = '',
  refreshInterval = 30000,
  onRefresh,
  onExport,
  onShare,
  dateRange,
  onDateRangeChange
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedChart, setSelectedChart] = useState<'line' | 'area' | 'bar'>('area');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const sections = [
    { id: 'overview', title: 'Overview', icon: <Activity size={20} /> },
    { id: 'traffic', title: 'Traffic', icon: <TrendingUp size={20} /> },
    { id: 'devices', title: 'Devices', icon: <Smartphone size={20} /> },
    { id: 'pages', title: 'Top Pages', icon: <BarChart3 size={20} /> },
    { id: 'sources', title: 'Traffic Sources', icon: <Globe size={20} /> },
    { id: 'realtime', title: 'Real-time', icon: <Eye size={20} /> }
  ];

  // Auto refresh
  useEffect(() => {
    if (autoRefresh && onRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        handleRefresh();
      }, refreshInterval);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, onRefresh]);

  // Handle refresh
  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Failed to refresh analytics data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle swipe navigation
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'left' && currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else if (direction === 'right' && currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Format number
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format duration
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Get device icon
  const getDeviceIcon = (deviceName: string) => {
    switch (deviceName.toLowerCase()) {
      case 'mobile':
        return <Smartphone size={16} />;
      case 'desktop':
        return <Monitor size={16} />;
      case 'tablet':
        return <Tablet size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  // Render metric card
  const renderMetricCard = (title: string, value: string | number, trend?: number, icon?: React.ReactNode) => (
    <motion.div
      className="metric-card"
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="metric-header">
        <div className="metric-icon">{icon}</div>
        <span className="metric-title">{title}</span>
      </div>
      <div className="metric-value">{value}</div>
      {trend !== undefined && (
        <div className={`metric-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
          {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{formatPercentage(trend)}</span>
        </div>
      )}
    </motion.div>
  );

  // Render overview section
  const renderOverview = () => (
    <div className="section-content">
      <div className="metrics-grid">
        {renderMetricCard(
          'Total Visitors',
          formatNumber(data.overview.totalVisitors),
          data.overview.trends.visitors,
          <Users size={20} />
        )}
        {renderMetricCard(
          'Page Views',
          formatNumber(data.overview.pageViews),
          data.overview.trends.pageViews,
          <Eye size={20} />
        )}
        {renderMetricCard(
          'Avg. Session',
          formatDuration(data.overview.avgSessionDuration),
          data.overview.trends.sessionDuration,
          <Clock size={20} />
        )}
        {renderMetricCard(
          'Bounce Rate',
          `${data.overview.bounceRate}%`,
          data.overview.trends.bounceRate,
          <TrendingDown size={20} />
        )}
      </div>
    </div>
  );

  // Render traffic section
  const renderTraffic = () => (
    <div className="section-content">
      <div className="chart-controls">
        <div className="chart-type-selector">
          {(['line', 'area', 'bar'] as const).map(type => (
            <button
              key={type}
              className={`chart-type-btn ${selectedChart === type ? 'active' : ''}`}
              onClick={() => setSelectedChart(type)}
            >
              {type === 'line' && <Activity size={16} />}
              {type === 'area' && <AreaChart size={16} />}
              {type === 'bar' && <BarChart3 size={16} />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          {selectedChart === 'line' && (
            <LineChart data={data.traffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number, name: string) => [formatNumber(value), name]}
              />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="pageViews" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          )}
          
          {selectedChart === 'area' && (
            <AreaChart data={data.traffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number, name: string) => [formatNumber(value), name]}
              />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stackId="1"
                stroke="#3b82f6" 
                fill="rgba(59, 130, 246, 0.3)"
              />
              <Area 
                type="monotone" 
                dataKey="pageViews" 
                stackId="1"
                stroke="#10b981" 
                fill="rgba(16, 185, 129, 0.3)"
              />
            </AreaChart>
          )}
          
          {selectedChart === 'bar' && (
            <BarChart data={data.traffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number, name: string) => [formatNumber(value), name]}
              />
              <Bar dataKey="visitors" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="pageViews" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Render devices section
  const renderDevices = () => (
    <div className="section-content">
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <RechartsPieChart>
            <Pie
              data={data.devices}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.devices.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value}%`, 'Usage']} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="device-list">
        {data.devices.map((device, index) => (
          <motion.div
            key={device.name}
            className="device-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="device-info">
              <div className="device-icon">{getDeviceIcon(device.name)}</div>
              <span className="device-name">{device.name}</span>
            </div>
            <div className="device-stats">
              <span className="device-percentage">{device.value}%</span>
              <div className="device-bar">
                <div 
                  className="device-bar-fill" 
                  style={{ 
                    width: `${device.value}%`, 
                    backgroundColor: device.color 
                  }} 
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render top pages section
  const renderTopPages = () => (
    <div className="section-content">
      <div className="pages-list">
        {data.topPages.map((page, index) => (
          <motion.div
            key={page.page}
            className="page-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="page-info">
              <span className="page-url">{page.page}</span>
              <div className="page-stats">
                <span className="page-views">{formatNumber(page.views)} views</span>
                <span className="page-time">{formatDuration(page.avgTime)} avg</span>
              </div>
            </div>
            <div className="page-chart">
              <div className="page-bar">
                <div 
                  className="page-bar-fill"
                  style={{ width: `${(page.views / data.topPages[0].views) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render traffic sources section
  const renderTrafficSources = () => (
    <div className="section-content">
      <div className="sources-list">
        {data.referrers.map((source, index) => (
          <motion.div
            key={source.source}
            className="source-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="source-info">
              <span className="source-name">{source.source}</span>
              <span className="source-visitors">{formatNumber(source.visitors)} visitors</span>
            </div>
            <div className="source-percentage">{source.percentage}%</div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render real-time section
  const renderRealTime = () => (
    <div className="section-content">
      <div className="realtime-metrics">
        {renderMetricCard(
          'Active Users',
          data.realTime.activeUsers,
          undefined,
          <Users size={20} />
        )}
        {renderMetricCard(
          'Page Views',
          data.realTime.currentPageViews,
          undefined,
          <Eye size={20} />
        )}
      </div>
      
      <div className="realtime-pages">
        <h4>Active Pages</h4>
        {data.realTime.topPages.map((page, index) => (
          <motion.div
            key={page.page}
            className="realtime-page-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="realtime-page-url">{page.page}</span>
            <div className="realtime-users">
              <div className="realtime-indicator" />
              <span>{page.activeUsers} users</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (sections[currentSection].id) {
      case 'overview':
        return renderOverview();
      case 'traffic':
        return renderTraffic();
      case 'devices':
        return renderDevices();
      case 'pages':
        return renderTopPages();
      case 'sources':
        return renderTrafficSources();
      case 'realtime':
        return renderRealTime();
      default:
        return renderOverview();
    }
  };

  return (
    <TouchGestureHandler
      onSwipe={handleSwipe}
      className={`mobile-analytics-dashboard ${className}`}
    >
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-title">
            <h2>Analytics</h2>
            <div className="header-actions">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`action-btn ${showFilters ? 'active' : ''}`}
                aria-label="Toggle filters"
              >
                <Filter size={18} />
              </button>
              <button
                onClick={handleRefresh}
                className={`action-btn ${isRefreshing ? 'loading' : ''}`}
                disabled={isRefreshing}
                aria-label="Refresh data"
              >
                <RefreshCw size={18} className={isRefreshing ? 'spinning' : ''} />
              </button>
              {onExport && (
                <button
                  onClick={() => onExport('pdf')}
                  className="action-btn"
                  aria-label="Export data"
                >
                  <Download size={18} />
                </button>
              )}
              {onShare && (
                <button
                  onClick={onShare}
                  className="action-btn"
                  aria-label="Share dashboard"
                >
                  <Share2 size={18} />
                </button>
              )}
            </div>
          </div>
          
          {/* Section Navigation */}
          <div className="section-nav">
            <div className="nav-container">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  className={`nav-item ${currentSection === index ? 'active' : ''}`}
                  onClick={() => setCurrentSection(index)}
                >
                  {section.icon}
                  <span>{section.title}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="progress-indicator">
            <div className="progress-dots">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${currentSection === index ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="dashboard-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="section-wrapper"
            >
              <div className="section-header">
                <h3>{sections[currentSection].title}</h3>
                <div className="section-nav-arrows">
                  <button
                    onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0}
                    className="nav-arrow"
                    aria-label="Previous section"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                    disabled={currentSection === sections.length - 1}
                    className="nav-arrow"
                    aria-label="Next section"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              
              {renderCurrentSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .mobile-analytics-dashboard {
          width: 100%;
          max-width: 100vw;
          margin: 0 auto;
          background: var(--bg-primary, #ffffff);
          min-height: 100vh;
        }
        
        .dashboard-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }
        
        .dashboard-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 16px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .header-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .header-title h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0;
        }
        
        .header-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 8px;
          color: var(--text-secondary, #6b7280);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          min-height: 36px;
        }
        
        .action-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 1);
          color: var(--text-primary, #1f2937);
          border-color: var(--accent-color, #3b82f6);
        }
        
        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .action-btn.active {
          background: var(--accent-color, #3b82f6);
          color: white;
          border-color: var(--accent-color, #3b82f6);
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .section-nav {
          margin-bottom: 12px;
        }
        
        .nav-container {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .nav-container::-webkit-scrollbar {
          display: none;
        }
        
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          color: var(--text-secondary, #6b7280);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          min-width: 70px;
          font-size: 0.75rem;
        }
        
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.8);
          color: var(--text-primary, #1f2937);
        }
        
        .nav-item.active {
          background: var(--accent-color, #3b82f6);
          color: white;
        }
        
        .progress-indicator {
          display: flex;
          justify-content: center;
        }
        
        .progress-dots {
          display: flex;
          gap: 6px;
        }
        
        .progress-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        
        .progress-dot.active {
          background: var(--accent-color, #3b82f6);
          transform: scale(1.2);
        }
        
        .dashboard-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
        
        .section-wrapper {
          height: 100%;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .section-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0;
        }
        
        .section-nav-arrows {
          display: flex;
          gap: 4px;
        }
        
        .nav-arrow {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          padding: 4px;
          color: var(--text-secondary, #6b7280);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .nav-arrow:hover:not(:disabled) {
          background: rgba(255, 255, 255, 1);
          color: var(--text-primary, #1f2937);
        }
        
        .nav-arrow:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .section-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }
        
        .metric-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        
        .metric-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .metric-icon {
          color: var(--accent-color, #3b82f6);
        }
        
        .metric-title {
          font-size: 0.75rem;
          color: var(--text-secondary, #6b7280);
          font-weight: 500;
        }
        
        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary, #1f2937);
          margin-bottom: 4px;
        }
        
        .metric-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .metric-trend.positive {
          color: #10b981;
        }
        
        .metric-trend.negative {
          color: #ef4444;
        }
        
        .chart-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .chart-type-selector {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 8px;
          padding: 4px;
        }
        
        .chart-type-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--text-secondary, #6b7280);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .chart-type-btn:hover {
          background: rgba(255, 255, 255, 0.8);
          color: var(--text-primary, #1f2937);
        }
        
        .chart-type-btn.active {
          background: var(--accent-color, #3b82f6);
          color: white;
        }
        
        .chart-container {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .device-list,
        .pages-list,
        .sources-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .device-item,
        .page-item,
        .source-item {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .device-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .device-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .device-icon {
          color: var(--text-secondary, #6b7280);
        }
        
        .device-name {
          font-weight: 500;
          color: var(--text-primary, #1f2937);
        }
        
        .device-stats {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .device-percentage {
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          min-width: 40px;
          text-align: right;
        }
        
        .device-bar {
          width: 60px;
          height: 4px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .device-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        
        .page-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .page-info {
          flex: 1;
          min-width: 0;
        }
        
        .page-url {
          display: block;
          font-weight: 500;
          color: var(--text-primary, #1f2937);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }
        
        .page-stats {
          display: flex;
          gap: 12px;
          font-size: 0.75rem;
          color: var(--text-secondary, #6b7280);
        }
        
        .page-chart {
          width: 80px;
        }
        
        .page-bar {
          width: 100%;
          height: 4px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .page-bar-fill {
          height: 100%;
          background: var(--accent-color, #3b82f6);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        
        .source-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .source-info {
          flex: 1;
        }
        
        .source-name {
          display: block;
          font-weight: 500;
          color: var(--text-primary, #1f2937);
          margin-bottom: 2px;
        }
        
        .source-visitors {
          font-size: 0.75rem;
          color: var(--text-secondary, #6b7280);
        }
        
        .source-percentage {
          font-weight: 600;
          color: var(--text-primary, #1f2937);
        }
        
        .realtime-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .realtime-pages h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0 0 12px 0;
        }
        
        .realtime-page-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 8px;
        }
        
        .realtime-page-url {
          font-weight: 500;
          color: var(--text-primary, #1f2937);
        }
        
        .realtime-users {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          color: var(--text-secondary, #6b7280);
        }
        
        .realtime-indicator {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Mobile optimizations */
        @media (max-width: 480px) {
          .dashboard-header {
            padding: 12px;
          }
          
          .dashboard-content {
            padding: 12px;
          }
          
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          
          .metric-card {
            padding: 12px;
          }
          
          .metric-value {
            font-size: 1.25rem;
          }
        }
        
        /* Touch device optimizations */
        @media (pointer: coarse) {
          .action-btn,
          .nav-item,
          .nav-arrow,
          .chart-type-btn {
            min-height: 44px;
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .spinning,
          .realtime-indicator {
            animation: none;
          }
          
          .metric-card,
          .device-bar-fill,
          .page-bar-fill {
            transition: none;
          }
        }
      `}</style>
    </TouchGestureHandler>
  );
};

export default MobileAnalyticsDashboard;
export type { MobileAnalyticsDashboardProps, AnalyticsData };