'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Glass } from '@/components/atoms/Glass';
import { Typography } from '@/components/atoms/Typography';
import { useAnalytics } from './AnalyticsProvider';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  Eye, 
  Clock, 
  TrendingUp, 
  X
} from 'lucide-react';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ isOpen, onClose }) => {
  const { getAnalytics, getSessionData } = useAnalytics();
  const [analytics, setAnalytics] = useState(getAnalytics());
  const [sessionData, setSessionData] = useState(getSessionData());
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Refresh analytics data every 5 seconds when dashboard is open
      const interval = setInterval(() => {
        setAnalytics(getAnalytics());
        setSessionData(getSessionData());
      }, 5000);
      setRefreshInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isOpen, getAnalytics, getSessionData]);

  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [refreshInterval]);

  if (!isOpen) return null;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const eventTypeColors = {
    page_view: '#3b82f6',
    click: '#10b981',
    form_submit: '#f59e0b',
    download: '#ef4444',
    scroll: '#8b5cf6',
    custom: '#6b7280'
  };

  const performanceData = [
    { name: 'LCP', value: analytics.performanceMetrics.lcp || 0, target: 2500 },
    { name: 'FID', value: analytics.performanceMetrics.fid || 0, target: 100 },
    { name: 'CLS', value: (analytics.performanceMetrics.cls || 0) * 1000, target: 100 },
    { name: 'FCP', value: analytics.performanceMetrics.fcp || 0, target: 1800 },
    { name: 'TTFB', value: analytics.performanceMetrics.ttfb || 0, target: 800 }
  ];

  const eventChartData = analytics.topEvents.map(event => ({
    name: event.type.replace('_', ' ').toUpperCase(),
    count: event.count,
    fill: eventTypeColors[event.type as keyof typeof eventTypeColors] || '#6b7280'
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Glass config="modal" className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Typography variant="h4" className="text-white font-bold mb-2">
                Analytics Dashboard
              </Typography>
              <Typography variant="bodySmall" className="text-white/70">
                Real-time insights and performance metrics
              </Typography>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Close analytics dashboard"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Glass config="card" className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <Typography variant="h6" className="text-white font-semibold">
                    {analytics.totalEvents}
                  </Typography>
                  <Typography variant="bodySmall" className="text-white/70">
                    Total Events
                  </Typography>
                </div>
              </div>
            </Glass>

            <Glass config="card" className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Eye className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <Typography variant="h6" className="text-white font-semibold">
                    {analytics.uniquePages}
                  </Typography>
                  <Typography variant="bodySmall" className="text-white/70">
                    Pages Viewed
                  </Typography>
                </div>
              </div>
            </Glass>

            <Glass config="card" className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <Typography variant="h6" className="text-white font-semibold">
                    {formatTime(analytics.averageSessionTime)}
                  </Typography>
                  <Typography variant="bodySmall" className="text-white/70">
                    Session Time
                  </Typography>
                </div>
              </div>
            </Glass>

            <Glass config="card" className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <Typography variant="h6" className="text-white font-semibold">
                    {sessionData?.pageViews || 0}
                  </Typography>
                  <Typography variant="bodySmall" className="text-white/70">
                    Page Views
                  </Typography>
                </div>
              </div>
            </Glass>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Event Distribution */}
            <Glass config="card" className="p-6">
              <Typography variant="h6" className="text-white font-semibold mb-4">
                Event Distribution
              </Typography>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={eventChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    >
                      {eventChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Glass>

            {/* Performance Metrics */}
            <Glass config="card" className="p-6">
              <Typography variant="h6" className="text-white font-semibold mb-4">
                Performance Metrics
              </Typography>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" />
                    <Bar dataKey="target" fill="rgba(239, 68, 68, 0.5)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Glass>
          </div>

          {/* Session Details */}
          {sessionData && (
            <Glass config="card" className="p-6">
              <Typography variant="h6" className="text-white font-semibold mb-4">
                Current Session Details
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Typography variant="bodySmall" className="text-white/70 mb-1">
                    Session ID
                  </Typography>
                  <Typography variant="bodySmall" className="text-white font-mono text-xs">
                    {sessionData.id}
                  </Typography>
                </div>
                <div>
                  <Typography variant="bodySmall" className="text-white/70 mb-1">
                    Start Time
                  </Typography>
                  <Typography variant="bodySmall" className="text-white">
                    {new Date(sessionData.startTime).toLocaleTimeString()}
                  </Typography>
                </div>
                <div>
                  <Typography variant="bodySmall" className="text-white/70 mb-1">
                    Viewport
                  </Typography>
                  <Typography variant="bodySmall" className="text-white">
                    {sessionData.viewport.width} × {sessionData.viewport.height}
                  </Typography>
                </div>
                <div>
                  <Typography variant="bodySmall" className="text-white/70 mb-1">
                    Referrer
                  </Typography>
                  <Typography variant="bodySmall" className="text-white text-xs">
                    {sessionData.referrer || 'Direct'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="bodySmall" className="text-white/70 mb-1">
                    User Agent
                  </Typography>
                  <Typography variant="bodySmall" className="text-white text-xs">
                    {sessionData.userAgent.split(' ')[0]}
                  </Typography>
                </div>
                <div>
                  <Typography variant="bodySmall" className="text-white/70 mb-1">
                    Events Count
                  </Typography>
                  <Typography variant="bodySmall" className="text-white">
                    {sessionData.events.length}
                  </Typography>
                </div>
              </div>
            </Glass>
          )}
        </Glass>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsDashboard;