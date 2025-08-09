# Monitoring and Analytics Documentation

## 1. Overview

This document outlines the comprehensive monitoring and analytics system for the advanced portfolio, including real-time visitor analytics, performance metrics, error tracking, and administrative dashboards.

## 2. Analytics Architecture

### 2.1 Data Collection Strategy

```typescript
// src/services/analyticsService.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

interface AnalyticsEvent {
  type: 'page_view' | 'interaction' | 'performance' | 'error' | 'achievement' | 'api_call'
  data: Record<string, any>
  timestamp: number
  sessionId: string
  userId?: string
  metadata: {
    userAgent: string
    viewport: { width: number; height: number }
    connection?: string
    deviceType: 'mobile' | 'tablet' | 'desktop'
  }
}

class AnalyticsService {
  private sessionId: string
  private userId?: string
  private eventQueue: AnalyticsEvent[] = []
  private isOnline: boolean = navigator.onLine
  private batchSize: number = 10
  private flushInterval: number = 30000 // 30 seconds

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupEventListeners()
    this.setupPerformanceMonitoring()
    this.startBatchProcessor()
  }

  // Initialize analytics
  init(userId?: string) {
    this.userId = userId
    this.trackPageView()
  }

  // Track page views
  trackPageView(page?: string) {
    const currentPage = page || window.location.pathname
    
    this.track('page_view', {
      page: currentPage,
      referrer: document.referrer,
      title: document.title,
      url: window.location.href
    })
  }

  // Track user interactions
  trackInteraction(element: string, action: string, data?: Record<string, any>) {
    this.track('interaction', {
      element,
      action,
      ...data
    })
  }

  // Track API calls
  trackAPICall(endpoint: string, method: string, status: number, duration: number) {
    this.track('api_call', {
      endpoint,
      method,
      status,
      duration,
      success: status >= 200 && status < 300
    })
  }

  // Track achievements
  trackAchievement(achievementId: string, points: number) {
    this.track('achievement', {
      achievementId,
      points,
      timestamp: Date.now()
    })
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context
    })
  }

  // Core tracking method
  private track(type: AnalyticsEvent['type'], data: Record<string, any>) {
    const event: AnalyticsEvent = {
      type,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      metadata: this.getMetadata()
    }

    this.eventQueue.push(event)
    
    // Flush immediately for critical events
    if (type === 'error' || this.eventQueue.length >= this.batchSize) {
      this.flush()
    }
  }

  // Setup performance monitoring
  private setupPerformanceMonitoring() {
    // Web Vitals
    getCLS((metric) => this.track('performance', { metric: 'CLS', value: metric.value }))
    getFID((metric) => this.track('performance', { metric: 'FID', value: metric.value }))
    getFCP((metric) => this.track('performance', { metric: 'FCP', value: metric.value }))
    getLCP((metric) => this.track('performance', { metric: 'LCP', value: metric.value }))
    getTTFB((metric) => this.track('performance', { metric: 'TTFB', value: metric.value }))

    // Custom performance metrics
    this.trackResourceTiming()
    this.trackNavigationTiming()
  }

  // Track resource loading performance
  private trackResourceTiming() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming
          
          this.track('performance', {
            metric: 'resource_timing',
            name: resource.name,
            duration: resource.duration,
            size: resource.transferSize,
            type: this.getResourceType(resource.name)
          })
        }
      })
    })
    
    observer.observe({ entryTypes: ['resource'] })
  }

  // Track navigation performance
  private trackNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      this.track('performance', {
        metric: 'navigation_timing',
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.navigationStart
      })
    })
  }

  // Setup event listeners
  private setupEventListeners() {
    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true
      this.flush()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush()
      }
    })

    // Before unload
    window.addEventListener('beforeunload', () => {
      this.flush(true) // Synchronous flush
    })

    // Error tracking
    window.addEventListener('error', (event) => {
      this.trackError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), {
        type: 'unhandled_promise_rejection'
      })
    })
  }

  // Batch processor
  private startBatchProcessor() {
    setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush()
      }
    }, this.flushInterval)
  }

  // Flush events to server
  private async flush(synchronous: boolean = false) {
    if (!this.isOnline || this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    const payload = {
      events,
      sessionId: this.sessionId,
      timestamp: Date.now()
    }

    try {
      if (synchronous && navigator.sendBeacon) {
        // Use sendBeacon for synchronous requests (page unload)
        navigator.sendBeacon('/api/analytics/events', JSON.stringify(payload))
      } else {
        // Regular async request
        await fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }
    } catch (error) {
      // Re-queue events if request fails
      this.eventQueue.unshift(...events)
      console.error('Analytics flush failed:', error)
    }
  }

  // Helper methods
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private getMetadata() {
    return {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: (navigator as any).connection?.effectiveType,
      deviceType: this.getDeviceType()
    }
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  private getResourceType(url: string): string {
    if (url.match(/\.(js|mjs)$/)) return 'script'
    if (url.match(/\.(css)$/)) return 'stylesheet'
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image'
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font'
    return 'other'
  }
}

export const analytics = new AnalyticsService()
```

### 2.2 Real-time Dashboard Implementation

```typescript
// src/components/Admin/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Users, Eye, Clock, TrendingUp, AlertTriangle, Zap } from 'lucide-react'

interface DashboardData {
  realTimeMetrics: {
    activeUsers: number
    pageViews: number
    avgSessionDuration: number
    bounceRate: number
  }
  performanceMetrics: {
    avgLoadTime: number
    cls: number
    fid: number
    lcp: number
  }
  topPages: Array<{ page: string; views: number; avgTime: number }>
  deviceBreakdown: Array<{ device: string; count: number; percentage: number }>
  errorLogs: Array<{ message: string; count: number; lastOccurred: string }>
  apiUsage: Array<{ endpoint: string; calls: number; avgDuration: number; errorRate: number }>
}

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [isRealTime, setIsRealTime] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    
    if (isRealTime) {
      const interval = setInterval(fetchDashboardData, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [timeRange, isRealTime])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`)
      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!data) {
    return <div className="text-center text-gray-500 py-8">Failed to load dashboard data</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time portfolio performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            {/* Real-time Toggle */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isRealTime}
                onChange={(e) => setIsRealTime(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Real-time</span>
              {isRealTime && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            </label>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Users"
            value={data.realTimeMetrics.activeUsers}
            icon={Users}
            color="blue"
            trend="+12%"
          />
          <MetricCard
            title="Page Views"
            value={data.realTimeMetrics.pageViews}
            icon={Eye}
            color="green"
            trend="+8%"
          />
          <MetricCard
            title="Avg Session"
            value={`${Math.round(data.realTimeMetrics.avgSessionDuration / 60)}m`}
            icon={Clock}
            color="purple"
            trend="+5%"
          />
          <MetricCard
            title="Bounce Rate"
            value={`${data.realTimeMetrics.bounceRate}%`}
            icon={TrendingUp}
            color="orange"
            trend="-3%"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Page Views Chart */}
          <ChartCard title="Page Views Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateTimeSeriesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Device Breakdown */}
          <ChartCard title="Device Breakdown">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ device, percentage }) => `${device} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getDeviceColor(entry.device)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Web Vitals */}
          <ChartCard title="Web Vitals Performance">
            <div className="space-y-4">
              <PerformanceMetric
                name="Largest Contentful Paint"
                value={data.performanceMetrics.lcp}
                unit="ms"
                threshold={2500}
                goodThreshold={1500}
              />
              <PerformanceMetric
                name="First Input Delay"
                value={data.performanceMetrics.fid}
                unit="ms"
                threshold={100}
                goodThreshold={50}
              />
              <PerformanceMetric
                name="Cumulative Layout Shift"
                value={data.performanceMetrics.cls}
                unit=""
                threshold={0.25}
                goodThreshold={0.1}
              />
            </div>
          </ChartCard>

          {/* Top Pages */}
          <ChartCard title="Top Pages">
            <div className="space-y-3">
              {data.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-gray-900">{page.page}</div>
                    <div className="text-sm text-gray-500">{page.views} views</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {Math.round(page.avgTime / 60)}m avg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* API Usage and Errors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Usage */}
          <ChartCard title="API Usage">
            <div className="space-y-3">
              {data.apiUsage.map((api, index) => (
                <div key={api.endpoint} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium text-gray-900">{api.endpoint}</div>
                    <div className="text-sm text-gray-500">{api.calls} calls</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {api.avgDuration}ms avg
                    </div>
                    <div className={`text-sm ${
                      api.errorRate > 5 ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {api.errorRate}% errors
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Error Logs */}
          <ChartCard title="Recent Errors">
            <div className="space-y-3">
              {data.errorLogs.map((error, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-red-900">{error.message}</div>
                    <div className="text-sm text-red-600">
                      {error.count} occurrences • Last: {error.lastOccurred}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

// Metric Card Component
const MetricCard: React.FC<{
  title: string
  value: string | number
  icon: React.ComponentType<any>
  color: string
  trend?: string
}> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600',
    green: 'bg-green-500 text-green-600',
    purple: 'bg-purple-500 text-purple-600',
    orange: 'bg-orange-500 text-orange-600'
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow p-6"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p