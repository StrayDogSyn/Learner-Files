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
            <p className={`text-sm ${
              trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend} from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-opacity-20 ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}

// Chart Card Component
const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

// Performance Metric Component
const PerformanceMetric: React.FC<{
  name: string
  value: number
  unit: string
  threshold: number
  goodThreshold: number
}> = ({ name, value, unit, threshold, goodThreshold }) => {
  const getStatus = () => {
    if (value <= goodThreshold) return 'good'
    if (value <= threshold) return 'needs-improvement'
    return 'poor'
  }

  const status = getStatus()
  const statusColors = {
    good: 'bg-green-500',
    'needs-improvement': 'bg-yellow-500',
    poor: 'bg-red-500'
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">
          {value}{unit} • {status.replace('-', ' ')}
        </div>
      </div>
      <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
    </div>
  )
}

// Helper functions
function generateTimeSeriesData() {
  // Generate sample time series data
  const data = []
  const now = new Date()
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit' }),
      views: Math.floor(Math.random() * 100) + 50
    })
  }
  
  return data
}

function getDeviceColor(device: string): string {
  const colors = {
    desktop: '#3B82F6',
    mobile: '#10B981',
    tablet: '#8B5CF6'
  }
  return colors[device.toLowerCase()] || '#6B7280'
}

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 2.3 Error Tracking and Alerting

```typescript
// src/services/errorTrackingService.ts
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

interface ErrorContext {
  userId?: string
  sessionId: string
  page: string
  userAgent: string
  timestamp: number
  additionalData?: Record<string, any>
}

class ErrorTrackingService {
  private errorQueue: Array<{ error: Error; context: ErrorContext }> = []
  private alertThresholds = {
    errorRate: 5, // errors per minute
    criticalErrors: 1, // critical errors per hour
    performanceDegradation: 20 // % increase in load time
  }

  constructor() {
    this.initializeSentry()
    this.setupGlobalErrorHandlers()
    this.startErrorProcessor()
  }

  private initializeSentry() {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          tracingOrigins: ['localhost', /^\//],
        })
      ],
      tracesSampleRate: 1.0,
      environment: import.meta.env.MODE,
      beforeSend: (event, hint) => {
        // Custom error filtering
        if (this.shouldIgnoreError(event, hint)) {
          return null
        }
        return event
      }
    })
  }

  // Track application errors
  trackError(error: Error, context: Partial<ErrorContext> = {}) {
    const fullContext: ErrorContext = {
      sessionId: this.getSessionId(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      ...context
    }

    // Add to queue for batch processing
    this.errorQueue.push({ error, context: fullContext })

    // Send to Sentry immediately for critical errors
    if (this.isCriticalError(error)) {
      Sentry.captureException(error, {
        contexts: { custom: fullContext },
        level: 'error'
      })
      
      this.triggerAlert('critical_error', { error, context: fullContext })
    }

    // Check for error rate threshold
    this.checkErrorRateThreshold()
  }

  // Track performance issues
  trackPerformanceIssue(metric: string, value: number, threshold: number) {
    if (value > threshold) {
      const issue = {
        metric,
        value,
        threshold,
        severity: this.getPerformanceSeverity(value, threshold)
      }

      Sentry.addBreadcrumb({
        message: `Performance issue: ${metric}`,
        level: 'warning',
        data: issue
      })

      if (issue.severity === 'critical') {
        this.triggerAlert('performance_degradation', issue)
      }
    }
  }

  // Setup global error handlers
  private setupGlobalErrorHandlers() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError(event.error, {
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      })
    })

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = new Error(event.reason)
      this.trackError(error, {
        additionalData: {
          type: 'unhandled_promise_rejection',
          reason: event.reason
        }
      })
    })

    // React error boundary integration
    Sentry.withErrorBoundary(() => {}, {
      fallback: ({ error, resetError }) => (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={resetError}>Try again</button>
        </div>
      )
    })
  }

  // Process error queue
  private startErrorProcessor() {
    setInterval(() => {
      if (this.errorQueue.length > 0) {
        this.processErrorBatch()
      }
    }, 30000) // Process every 30 seconds
  }

  private async processErrorBatch() {
    const batch = [...this.errorQueue]
    this.errorQueue = []

    try {
      await fetch('/api/errors/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors: batch })
      })
    } catch (error) {
      // Re-queue errors if request fails
      this.errorQueue.unshift(...batch)
    }
  }

  // Error classification
  private isCriticalError(error: Error): boolean {
    const criticalPatterns = [
      /payment/i,
      /authentication/i,
      /security/i,
      /database/i,
      /api.*5\d\d/i
    ]

    return criticalPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.stack || '')
    )
  }

  private shouldIgnoreError(event: any, hint: any): boolean {
    const ignoredErrors = [
      'Network request failed',
      'ResizeObserver loop limit exceeded',
      'Script error',
      'Non-Error promise rejection captured'
    ]

    return ignoredErrors.some(ignored => 
      event.message?.includes(ignored)
    )
  }

  private getPerformanceSeverity(value: number, threshold: number): 'warning' | 'critical' {
    return value > threshold * 2 ? 'critical' : 'warning'
  }

  // Alert system
  private async triggerAlert(type: string, data: any) {
    try {
      await fetch('/api/alerts/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data, timestamp: Date.now() })
      })
    } catch (error) {
      console.error('Failed to trigger alert:', error)
    }
  }

  // Error rate monitoring
  private checkErrorRateThreshold() {
    const recentErrors = this.errorQueue.filter(
      item => Date.now() - item.context.timestamp < 60000 // Last minute
    )

    if (recentErrors.length >= this.alertThresholds.errorRate) {
      this.triggerAlert('high_error_rate', {
        count: recentErrors.length,
        timeWindow: '1 minute'
      })
    }
  }

  private getSessionId(): string {
    return sessionStorage.getItem('sessionId') || 'unknown'
  }
}

export const errorTracking = new ErrorTrackingService()
```

### 2.4 Performance Monitoring

```typescript
// src/services/performanceMonitoringService.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url: string
  deviceType: string
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = []
  private thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 }
  }

  constructor() {
    this.initializeWebVitals()
    this.setupCustomMetrics()
    this.startReporting()
  }

  private initializeWebVitals() {
    getCLS((metric) => this.recordMetric('CLS', metric.value))
    getFID((metric) => this.recordMetric('FID', metric.value))
    getFCP((metric) => this.recordMetric('FCP', metric.value))
    getLCP((metric) => this.recordMetric('LCP', metric.value))
    getTTFB((metric) => this.recordMetric('TTFB', metric.value))
  }

  private setupCustomMetrics() {
    // 3D rendering performance
    this.monitor3DPerformance()
    
    // API response times
    this.monitorAPIPerformance()
    
    // Bundle loading times
    this.monitorResourceLoading()
    
    // Memory usage
    this.monitorMemoryUsage()
  }

  private monitor3DPerformance() {
    let frameCount = 0
    let lastTime = performance.now()
    
    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        this.recordMetric('3D_FPS', fps)
        
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    requestAnimationFrame(measureFPS)
  }

  private monitorAPIPerformance() {
    const originalFetch = window.fetch
    
    window.fetch = async (...args) => {
      const startTime = performance.now()
      
      try {
        const response = await originalFetch(...args)
        const duration = performance.now() - startTime
        
        this.recordMetric('API_RESPONSE_TIME', duration, {
          url: args[0].toString(),
          status: response.status
        })
        
        return response
      } catch (error) {
        const duration = performance.now() - startTime
        this.recordMetric('API_ERROR_TIME', duration, {
          url: args[0].toString(),
          error: error.message
        })
        throw error
      }
    }
  }

  private monitorResourceLoading() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming
          
          this.recordMetric('RESOURCE_LOAD_TIME', resource.duration, {
            resourceType: this.getResourceType(resource.name),
            size: resource.transferSize
          })
        }
      })
    })
    
    observer.observe({ entryTypes: ['resource'] })
  }

  private monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        
        this.recordMetric('MEMORY_USED', memory.usedJSHeapSize)
        this.recordMetric('MEMORY_TOTAL', memory.totalJSHeapSize)
        
        const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        if (usagePercentage > 80) {
          this.recordMetric('MEMORY_WARNING', usagePercentage)
        }
      }, 30000) // Check every 30 seconds
    }
  }

  private recordMetric(name: string, value: number, additionalData?: any) {
    const metric: PerformanceMetric = {
      name,
      value,
      rating: this.getRating(name, value),
      timestamp: Date.now(),
      url: window.location.pathname,
      deviceType: this.getDeviceType()
    }

    this.metrics.push(metric)
    
    // Trigger alerts for poor performance
    if (metric.rating === 'poor') {
      this.triggerPerformanceAlert(metric, additionalData)
    }
  }

  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.thresholds[metricName]
    if (!threshold) return 'good'
    
    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  private async triggerPerformanceAlert(metric: PerformanceMetric, additionalData?: any) {
    try {
      await fetch('/api/alerts/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric, additionalData })
      })
    } catch (error) {
      console.error('Failed to send performance alert:', error)
    }
  }

  private startReporting() {
    // Send metrics every 60 seconds
    setInterval(() => {
      if (this.metrics.length > 0) {
        this.sendMetrics()
      }
    }, 60000)
    
    // Send on page unload
    window.addEventListener('beforeunload', () => {
      this.sendMetrics(true)
    })
  }

  private async sendMetrics(synchronous: boolean = false) {
    const metricsToSend = [...this.metrics]
    this.metrics = []

    const payload = {
      metrics: metricsToSend,
      sessionId: this.getSessionId(),
      timestamp: Date.now()
    }

    try {
      if (synchronous && navigator.sendBeacon) {
        navigator.sendBeacon('/api/performance/metrics', JSON.stringify(payload))
      } else {
        await fetch('/api/performance/metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }
    } catch (error) {
      // Re-queue metrics if request fails
      this.metrics.unshift(...metricsToSend)
    }
  }

  // Public methods for manual tracking
  public trackCustomMetric(name: string, value: number, additionalData?: any) {
    this.recordMetric(name, value, additionalData)
  }

  public getMetricsSummary() {
    const summary = {
      totalMetrics: this.metrics.length,
      goodMetrics: this.metrics.filter(m => m.rating === 'good').length,
      poorMetrics: this.metrics.filter(m => m.rating === 'poor').length
    }
    
    return {
      ...summary,
      healthScore: (summary.goodMetrics / summary.totalMetrics) * 100
    }
  }

  private getResourceType(url: string): string {
    if (url.match(/\.(js|mjs)$/)) return 'script'
    if (url.match(/\.(css)$/)) return 'stylesheet'
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image'
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font'
    return 'other'
  }

  private getDeviceType(): string {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  private getSessionId(): string {
    return sessionStorage.getItem('sessionId') || 'unknown'
  }
}

export const performanceMonitoring = new PerformanceMonitoringService()
```

## 3. Backend Analytics API

### 3.1 Analytics Endpoints

```typescript
// api/analytics/events.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'
import { rateLimit } from '../../lib/rateLimit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limiting
  const rateLimitResult = await rateLimit(req)
  if (!rateLimitResult.success) {
    return res.status(429).json({ error: 'Rate limit exceeded' })
  }

  try {
    const { events, sessionId } = req.body

    // Validate events
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Invalid events data' })
    }

    // Process and store events
    const processedEvents = events.map(event => ({
      ...event,
      ip_address: getClientIP(req),
      processed_at: new Date().toISOString()
    }))

    // Batch insert to database
    const { error } = await supabase
      .from('analytics_events')
      .insert(processedEvents)

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Failed to store events' })
    }

    // Update real-time metrics
    await updateRealTimeMetrics(processedEvents)

    res.status(200).json({ success: true, processed: events.length })
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function updateRealTimeMetrics(events: any[]) {
  // Update Redis cache with real-time metrics
  // Implementation depends on your caching strategy
}

function getClientIP(req: NextApiRequest): string {
  return (
    req.headers['x-forwarded-for'] as string ||
    req.headers['x-real-ip'] as string ||
    req.connection.remoteAddress ||
    'unknown'
  )
}
```

### 3.2 Dashboard Data API

```typescript
// api/analytics/dashboard.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { timeRange = '24h' } = req.query
    const timeFilter = getTimeFilter(timeRange as string)

    // Fetch dashboard data in parallel
    const [realTimeMetrics, performanceMetrics, topPages, deviceBreakdown, errorLogs, apiUsage] = await Promise.all([
      getRealTimeMetrics(timeFilter),
      getPerformanceMetrics(timeFilter),
      getTopPages(timeFilter),
      getDeviceBreakdown(timeFilter),
      getErrorLogs(timeFilter),
      getAPIUsage(timeFilter)
    ])

    const dashboardData = {
      realTimeMetrics,
      performanceMetrics,
      topPages,
      deviceBreakdown,
      errorLogs,
      apiUsage
    }

    res.status(200).json(dashboardData)
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard data' })
  }
}

function getTimeFilter(timeRange: string): string {
  const now = new Date()
  let startTime: Date

  switch (timeRange) {
    case '1h':
      startTime = new Date(now.getTime() - 60 * 60 * 1000)
      break
    case '24h':
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case '7d':
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  }

  return startTime.toISOString()
}

async function getRealTimeMetrics(timeFilter: string) {
  // Implementation for real-time metrics
  const { data } = await supabase
    .from('analytics_events')
    .select('*')
    .gte('created_at', timeFilter)

  return {
    activeUsers: new Set(data?.map(d => d.session_id)).size || 0,
    pageViews: data?.filter(d => d.type === 'page_view').length || 0,
    avgSessionDuration: calculateAvgSessionDuration(data || []),
    bounceRate: calculateBounceRate(data || [])
  }
}

// Additional helper functions...
```

This comprehensive monitoring and analytics documentation provides a complete system for tracking user behavior, performance metrics, error monitoring, and real-time dashboard functionality for the advanced portfolio project.