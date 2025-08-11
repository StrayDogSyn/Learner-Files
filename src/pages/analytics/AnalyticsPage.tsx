// Temporary stub for AnalyticsPage
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, Clock, Globe, Smartphone, Monitor, Tablet } from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: Array<{ page: string; views: number; }>;
  deviceTypes: Array<{ name: string; value: number; }>;
  weeklyData: Array<{ day: string; visitors: number; pageViews: number; }>;
  trafficSources: Array<{ source: string; visitors: number; percentage: number; }>;
}

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const deviceColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock analytics data
        const mockData: AnalyticsData = {
          pageViews: 12847,
          uniqueVisitors: 8934,
          avgSessionDuration: '3m 42s',
          bounceRate: '34.2%',
          topPages: [
            { page: '/portfolio', views: 3421 },
            { page: '/games/calculator', views: 2876 },
            { page: '/projects', views: 2134 },
            { page: '/games/quizninja', views: 1987 },
            { page: '/contact', views: 1543 }
          ],
          deviceTypes: [
            { name: 'Desktop', value: 45 },
            { name: 'Mobile', value: 35 },
            { name: 'Tablet', value: 20 }
          ],
          weeklyData: [
            { day: 'Mon', visitors: 1234, pageViews: 2341 },
            { day: 'Tue', visitors: 1456, pageViews: 2876 },
            { day: 'Wed', visitors: 1123, pageViews: 2234 },
            { day: 'Thu', visitors: 1678, pageViews: 3123 },
            { day: 'Fri', visitors: 1890, pageViews: 3456 },
            { day: 'Sat', visitors: 1345, pageViews: 2567 },
            { day: 'Sun', visitors: 1208, pageViews: 2250 }
          ],
          trafficSources: [
            { source: 'Direct', visitors: 3567, percentage: 39.9 },
            { source: 'Google Search', visitors: 2890, percentage: 32.3 },
            { source: 'GitHub', visitors: 1234, percentage: 13.8 },
            { source: 'LinkedIn', visitors: 876, percentage: 9.8 },
            { source: 'Other', visitors: 367, percentage: 4.1 }
          ]
        };
        
        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'desktop': return <Monitor className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-center">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Analytics Unavailable</h2>
          <p className="text-gray-300">Unable to load analytics data at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Page Views</p>
                <p className="text-3xl font-bold text-white">{analyticsData.pageViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">+12.5%</span>
              <span className="text-gray-400 ml-1">vs last period</span>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unique Visitors</p>
                <p className="text-3xl font-bold text-white">{analyticsData.uniqueVisitors.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">+8.3%</span>
              <span className="text-gray-400 ml-1">vs last period</span>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Session Duration</p>
                <p className="text-3xl font-bold text-white">{analyticsData.avgSessionDuration}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">+5.7%</span>
              <span className="text-gray-400 ml-1">vs last period</span>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bounce Rate</p>
                <p className="text-3xl font-bold text-white">{analyticsData.bounceRate}</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Globe className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-red-400 mr-1 rotate-180" />
              <span className="text-red-400">-2.1%</span>
              <span className="text-gray-400 ml-1">vs last period</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Traffic Chart */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Weekly Traffic</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="pageViews" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Device Types Chart */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Device Types</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.deviceTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {analyticsData.deviceTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={deviceColors[index % deviceColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Top Pages</h3>
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                    <span className="text-white">{page.page}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400">{page.views.toLocaleString()} views</span>
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(page.views / analyticsData.topPages[0].views) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Traffic Sources</h3>
            <div className="space-y-4">
              {analyticsData.trafficSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: deviceColors[index % deviceColors.length] }}></div>
                    <span className="text-white">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400">{source.visitors.toLocaleString()}</span>
                    <span className="text-gray-400 w-12 text-right">{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;