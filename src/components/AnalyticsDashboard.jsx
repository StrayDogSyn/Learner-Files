/**
 * Real-time Analytics Dashboard Component
 * Comprehensive analytics dashboard with multiple visualization types
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Code, 
  Star, 
  Download,
  Calendar,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app this would come from API
  const pageViewsData = [
    { month: 'Jan', views: 1200, unique: 800, bounce: 35 },
    { month: 'Feb', views: 1800, unique: 1200, bounce: 28 },
    { month: 'Mar', views: 2200, unique: 1500, bounce: 25 },
    { month: 'Apr', views: 2800, unique: 1900, bounce: 22 },
    { month: 'May', views: 3200, unique: 2200, bounce: 20 },
    { month: 'Jun', views: 3800, unique: 2600, bounce: 18 }
  ];

  const trafficSources = [
    { name: 'Direct', value: 45, color: '#3B82F6' },
    { name: 'Search', value: 30, color: '#10B981' },
    { name: 'Social', value: 15, color: '#F59E0B' },
    { name: 'Referral', value: 10, color: '#EF4444' }
  ];

  const deviceBreakdown = [
    { name: 'Desktop', value: 65, color: '#8B5CF6' },
    { name: 'Mobile', value: 30, color: '#06B6D4' },
    { name: 'Tablet', value: 5, color: '#F97316' }
  ];

  const projectMetrics = [
    { name: 'React Projects', completed: 15, inProgress: 3, planned: 5 },
    { name: 'Node.js Apps', completed: 12, inProgress: 2, planned: 4 },
    { name: 'Mobile Apps', completed: 8, inProgress: 1, planned: 3 },
    { name: 'Design Work', completed: 20, inProgress: 4, planned: 6 }
  ];

  const keyMetrics = [
    { 
      title: 'Total Page Views', 
      value: '18.2K', 
      change: '+12.5%', 
      trend: 'up',
      icon: Eye,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      title: 'Unique Visitors', 
      value: '12.8K', 
      change: '+8.3%', 
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      title: 'Project Downloads', 
      value: '2.4K', 
      change: '+15.7%', 
      trend: 'up',
      icon: Download,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      title: 'GitHub Stars', 
      value: '156', 
      change: '+23.1%', 
      trend: 'up',
      icon: Star,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Analytics Dashboard
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Track performance metrics, user engagement, and project analytics in real-time.
          </p>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color}`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {metric.title}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Page Views Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Page Views Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={pageViewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="unique" 
                  stroke="#06B6D4" 
                  fill="#06B6D4" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Traffic Sources
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Project Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-12"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Project Completion Metrics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" fill="#10B981" name="Completed" />
              <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" />
              <Bar dataKey="planned" fill="#8B5CF6" name="Planned" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Device Usage Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deviceBreakdown.map((device, index) => (
              <div key={device.name} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: device.color }}
                  >
                    {device.name === 'Desktop' && <Monitor className="w-10 h-10 text-white" />}
                    {device.name === 'Mobile' && <Smartphone className="w-10 h-10 text-white" />}
                    {device.name === 'Tablet' && <Monitor className="w-10 h-10 text-white" />}
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {device.name}
                </h4>
                <p className="text-3xl font-bold" style={{ color: device.color }}>
                  {device.value}%
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
