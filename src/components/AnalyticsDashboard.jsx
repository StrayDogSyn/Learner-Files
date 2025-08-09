/**
 * Real-time Analytics Dashboard Component
 * Comprehensive analytics dashboard with multiple visualization types
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import '../css/analytics-dashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const AnalyticsDashboard = () => {
  // State for analytics data
  const [analytics, setAnalytics] = useState({
    pageViews: [],
    projectViews: {},
    visitorLocations: [],
    deviceTypes: {},
    trafficSources: {},
    aiInteractions: [],
    liveVisitors: 0,
    totalSessions: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    conversionRate: 0,
    downloads: 0,
    clickEvents: 0
  });

  const [timeRange, setTimeRange] = useState('7d'); // 1d, 7d, 30d, 90d
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    pageViews: 0,
    events: []
  });

  const wsRef = useRef(null);
  const intervalRef = useRef(null);

  // Mock data generator for demonstration
  const generateMockData = useCallback(() => {
    const now = new Date();
    const days = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    // Generate page views data
    const pageViews = Array.from({ length: days * 24 }, (_, i) => {
      const date = new Date(now.getTime() - (days * 24 - i - 1) * 60 * 60 * 1000);
      return {
        timestamp: date.toISOString(),
        views: Math.floor(Math.random() * 100) + 20,
        uniqueViews: Math.floor(Math.random() * 80) + 15
      };
    });

    // Project views data
    const projectViews = {
      'GitHub Dashboard': Math.floor(Math.random() * 500) + 200,
      'Skills Matrix': Math.floor(Math.random() * 400) + 150,
      'Analytics Dashboard': Math.floor(Math.random() * 300) + 100,
      'Portfolio Site': Math.floor(Math.random() * 600) + 300,
      'Calculator App': Math.floor(Math.random() * 250) + 80,
      'Todo List': Math.floor(Math.random() * 200) + 60
    };

    // Visitor locations
    const visitorLocations = [
      { country: 'United States', visits: Math.floor(Math.random() * 1000) + 500, percentage: 35 },
      { country: 'United Kingdom', visits: Math.floor(Math.random() * 600) + 200, percentage: 18 },
      { country: 'Canada', visits: Math.floor(Math.random() * 400) + 150, percentage: 12 },
      { country: 'Germany', visits: Math.floor(Math.random() * 350) + 100, percentage: 10 },
      { country: 'Australia', visits: Math.floor(Math.random() * 300) + 80, percentage: 8 },
      { country: 'France', visits: Math.floor(Math.random() * 250) + 70, percentage: 7 },
      { country: 'Japan', visits: Math.floor(Math.random() * 200) + 50, percentage: 5 },
      { country: 'Other', visits: Math.floor(Math.random() * 300) + 100, percentage: 5 }
    ];

    // Device types
    const deviceTypes = {
      Desktop: Math.floor(Math.random() * 60) + 40,
      Mobile: Math.floor(Math.random() * 40) + 30,
      Tablet: Math.floor(Math.random() * 20) + 10
    };

    // Traffic sources
    const trafficSources = {
      'Direct': Math.floor(Math.random() * 40) + 25,
      'Google Search': Math.floor(Math.random() * 35) + 20,
      'GitHub': Math.floor(Math.random() * 25) + 15,
      'LinkedIn': Math.floor(Math.random() * 20) + 10,
      'Social Media': Math.floor(Math.random() * 15) + 8,
      'Referral': Math.floor(Math.random() * 12) + 5
    };

    // AI interactions
    const aiInteractions = Array.from({ length: days }, (_, i) => {
      const date = new Date(now.getTime() - (days - i - 1) * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split('T')[0],
        interactions: Math.floor(Math.random() * 50) + 10,
        avgResponseTime: Math.floor(Math.random() * 2000) + 500,
        satisfaction: Math.random() * 2 + 3 // 3-5 rating
      };
    });

    return {
      pageViews,
      projectViews,
      visitorLocations,
      deviceTypes,
      trafficSources,
      aiInteractions,
      liveVisitors: Math.floor(Math.random() * 25) + 5,
      totalSessions: Math.floor(Math.random() * 10000) + 5000,
      bounceRate: Math.random() * 20 + 30, // 30-50%
      avgSessionDuration: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
      conversionRate: Math.random() * 5 + 2, // 2-7%
      downloads: Math.floor(Math.random() * 500) + 100,
      clickEvents: Math.floor(Math.random() * 2000) + 500
    };
  }, [timeRange]);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call your analytics API
      // const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
      // const data = await response.json();
      
      // For now, using mock data
      const data = generateMockData();
      
      setAnalytics(data);
      
      // Simulate real-time updates
      setRealTimeData({
        activeUsers: Math.floor(Math.random() * 50) + 10,
        pageViews: Math.floor(Math.random() * 100) + 50,
        events: [
          { type: 'page_view', page: '/projects', timestamp: new Date() },
          { type: 'download', file: 'resume.pdf', timestamp: new Date() },
          { type: 'ai_chat', message: 'Hello!', timestamp: new Date() }
        ]
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [timeRange, generateMockData]);

  // Initialize real-time connection
  const initializeRealTime = useCallback(() => {
    // In a real implementation, this would connect to a WebSocket
    // wsRef.current = new WebSocket('wss://your-analytics-ws.com');
    
    // For demo, simulate real-time updates
    intervalRef.current = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        activeUsers: Math.max(1, prev.activeUsers + Math.floor(Math.random() * 3) - 1),
        pageViews: prev.pageViews + Math.floor(Math.random() * 3),
        events: [
          ...prev.events.slice(-10), // Keep last 10 events
          {
            type: ['page_view', 'download', 'ai_chat', 'click'][Math.floor(Math.random() * 4)],
            page: ['/home', '/projects', '/about', '/contact'][Math.floor(Math.random() * 4)],
            timestamp: new Date()
          }
        ]
      }));
      
      // Update live visitors count
      setAnalytics(prev => ({
        ...prev,
        liveVisitors: Math.max(1, prev.liveVisitors + Math.floor(Math.random() * 3) - 1)
      }));
    }, 5000);
  }, []);

  useEffect(() => {
    fetchAnalytics();
    initializeRealTime();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [fetchAnalytics, initializeRealTime]);

  // Chart configurations
  const pageViewsChartData = {
    labels: analytics.pageViews.slice(-24).map(item => 
      new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        label: 'Page Views',
        data: analytics.pageViews.slice(-24).map(item => item.views),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Unique Views',
        data: analytics.pageViews.slice(-24).map(item => item.uniqueViews),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const projectViewsChartData = {
    labels: Object.keys(analytics.projectViews),
    datasets: [
      {
        label: 'Project Views',
        data: Object.values(analytics.projectViews),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 2
      }
    ]
  };

  const deviceTypesChartData = {
    labels: Object.keys(analytics.deviceTypes),
    datasets: [
      {
        data: Object.values(analytics.deviceTypes),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 2
      }
    ]
  };

  const trafficSourcesChartData = {
    labels: Object.keys(analytics.trafficSources),
    datasets: [
      {
        data: Object.values(analytics.trafficSources),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderWidth: 2
      }
    ]
  };

  const aiInteractionsChartData = {
    labels: analytics.aiInteractions.map(item => 
      new Date(item.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'AI Interactions',
        data: analytics.aiInteractions.map(item => item.interactions),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Avg Response Time (ms)',
        data: analytics.aiInteractions.map(item => item.avgResponseTime),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const dualAxisOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading && !analytics.pageViews.length) {
    return (
      <div className="analytics-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard error">
        <div className="error-message">
          <h3>Error Loading Analytics</h3>
          <p>{error}</p>
          <button onClick={fetchAnalytics} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h2>Portfolio Analytics</h2>
          <div className="header-controls">
            <div className="time-range-selector">
              {['1d', '7d', '30d', '90d'].map(range => (
                <button
                  key={range}
                  className={`time-range-btn ${timeRange === range ? 'active' : ''}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={fetchAnalytics} className="refresh-button" disabled={loading}>
              {loading ? '↻' : '🔄'} Refresh
            </button>
          </div>
        </div>
        
        <div className="live-stats">
          <div className="live-visitors">
            <span className="pulse"></span>
            <span className="count">{analytics.liveVisitors}</span>
            <span className="label">live visitors</span>
          </div>
          <div className="real-time-metrics">
            <div className="metric">
              <span className="value">{realTimeData.activeUsers}</span>
              <span className="label">active users</span>
            </div>
            <div className="metric">
              <span className="value">{realTimeData.pageViews}</span>
              <span className="label">page views today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{formatNumber(analytics.totalSessions)}</div>
            <div className="metric-label">Total Sessions</div>
            <div className="metric-change positive">+12.5%</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <div className="metric-value">{formatDuration(analytics.avgSessionDuration)}</div>
            <div className="metric-label">Avg Session Duration</div>
            <div className="metric-change positive">+8.3%</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.bounceRate.toFixed(1)}%</div>
            <div className="metric-label">Bounce Rate</div>
            <div className="metric-change negative">-3.2%</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.conversionRate.toFixed(1)}%</div>
            <div className="metric-label">Conversion Rate</div>
            <div className="metric-change positive">+15.7%</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📥</div>
          <div className="metric-content">
            <div className="metric-value">{formatNumber(analytics.downloads)}</div>
            <div className="metric-label">Downloads</div>
            <div className="metric-change positive">+22.1%</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🖱️</div>
          <div className="metric-content">
            <div className="metric-value">{formatNumber(analytics.clickEvents)}</div>
            <div className="metric-label">Click Events</div>
            <div className="metric-change positive">+7.9%</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Page Views Chart */}
        <div className="chart-container large">
          <div className="chart-header">
            <h3>Page Views Over Time</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color" style={{ backgroundColor: 'rgb(59, 130, 246)' }}></span>
                Total Views
              </span>
              <span className="legend-item">
                <span className="legend-color" style={{ backgroundColor: 'rgb(16, 185, 129)' }}></span>
                Unique Views
              </span>
            </div>
          </div>
          <div className="chart-wrapper">
            <Line data={pageViewsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Project Views Chart */}
        <div className="chart-container medium">
          <div className="chart-header">
            <h3>Most Viewed Projects</h3>
          </div>
          <div className="chart-wrapper">
            <Bar data={projectViewsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Device Types Chart */}
        <div className="chart-container small">
          <div className="chart-header">
            <h3>Device Types</h3>
          </div>
          <div className="chart-wrapper">
            <Doughnut data={deviceTypesChartData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  position: 'bottom'
                }
              }
            }} />
          </div>
        </div>

        {/* Traffic Sources Chart */}
        <div className="chart-container small">
          <div className="chart-header">
            <h3>Traffic Sources</h3>
          </div>
          <div className="chart-wrapper">
            <Pie data={trafficSourcesChartData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  position: 'bottom'
                }
              }
            }} />
          </div>
        </div>

        {/* AI Interactions Chart */}
        <div className="chart-container large">
          <div className="chart-header">
            <h3>AI Chat Interactions</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color" style={{ backgroundColor: 'rgb(139, 92, 246)' }}></span>
                Interactions
              </span>
              <span className="legend-item">
                <span className="legend-color" style={{ backgroundColor: 'rgb(245, 158, 11)' }}></span>
                Response Time
              </span>
            </div>
          </div>
          <div className="chart-wrapper">
            <Line data={aiInteractionsChartData} options={dualAxisOptions} />
          </div>
        </div>

        {/* Visitor Geography */}
        <div className="chart-container medium">
          <div className="chart-header">
            <h3>Visitor Locations</h3>
          </div>
          <div className="geography-list">
            {analytics.visitorLocations.map((location, index) => (
              <div key={index} className="geography-item">
                <div className="location-info">
                  <span className="country-name">{location.country}</span>
                  <span className="visit-count">{formatNumber(location.visits)} visits</span>
                </div>
                <div className="location-bar">
                  <div 
                    className="location-fill"
                    style={{ width: `${location.percentage}%` }}
                  ></div>
                </div>
                <span className="location-percentage">{location.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="activity-feed">
        <div className="activity-header">
          <h3>Real-time Activity</h3>
          <div className="activity-indicator">
            <span className="pulse small"></span>
            <span>Live</span>
          </div>
        </div>
        <div className="activity-list">
          {realTimeData.events.slice(-5).reverse().map((event, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                {event.type === 'page_view' && '👁️'}
                {event.type === 'download' && '📥'}
                {event.type === 'ai_chat' && '🤖'}
                {event.type === 'click' && '🖱️'}
              </div>
              <div className="activity-content">
                <div className="activity-description">
                  {event.type === 'page_view' && `Page view: ${event.page}`}
                  {event.type === 'download' && `Downloaded: ${event.file || 'file'}`}
                  {event.type === 'ai_chat' && 'AI chat interaction'}
                  {event.type === 'click' && `Clicked: ${event.element || 'element'}`}
                </div>
                <div className="activity-time">
                  {event.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
