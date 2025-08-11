// Analytics Routes
// Handle portfolio and project analytics data

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import {
  AnalyticsData,
  AnalyticsMetric,
  AnalyticsEvent,
  AnalyticsFilter,
  AnalyticsTimeRange,
  APIResponse,
  PaginationInfo
} from '../../shared/types';
import { authenticateToken, optionalAuth } from '../index';

const router = express.Router();

// Mock analytics database
const analyticsEvents: AnalyticsEvent[] = [];
const analyticsMetrics: AnalyticsMetric[] = [];

// Generate mock analytics data
const generateMockAnalytics = () => {
  const now = new Date();
  const events: AnalyticsEvent[] = [];
  
  // Generate events for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const dayEvents = Math.floor(Math.random() * 50) + 10;
    
    for (let j = 0; j < dayEvents; j++) {
      const eventTypes = ['page_view', 'project_view', 'contact_form', 'download', 'external_link'];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      events.push({
        id: `${i}-${j}`,
        type: eventType,
        portfolioId: '1',
        projectId: eventType === 'project_view' ? Math.floor(Math.random() * 3) + 1 : undefined,
        userId: Math.random() > 0.7 ? 'user-' + Math.floor(Math.random() * 100) : undefined,
        sessionId: 'session-' + Math.floor(Math.random() * 1000),
        timestamp: new Date(date.getTime() + (j * 60 * 1000)).toISOString(),
        data: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          referrer: Math.random() > 0.5 ? 'https://google.com' : 'https://github.com',
          page: eventType === 'page_view' ? '/portfolio' : '/project/' + (Math.floor(Math.random() * 3) + 1),
          duration: Math.floor(Math.random() * 300) + 30
        },
        location: {
          country: ['US', 'UK', 'CA', 'DE', 'FR'][Math.floor(Math.random() * 5)],
          city: ['New York', 'London', 'Toronto', 'Berlin', 'Paris'][Math.floor(Math.random() * 5)],
          region: 'Region',
          timezone: 'UTC'
        },
        device: {
          type: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
          os: ['Windows', 'macOS', 'iOS', 'Android'][Math.floor(Math.random() * 4)],
          browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)]
        }
      });
    }
  }
  
  return events;
};

// Initialize mock data
analyticsEvents.push(...generateMockAnalytics());

// Helper functions
const getDateRange = (timeRange: string): { start: Date; end: Date } => {
  const now = new Date();
  const end = new Date(now);
  let start: Date;
  
  switch (timeRange) {
    case '24h':
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  return { start, end };
};

const filterEvents = (events: AnalyticsEvent[], filters: any): AnalyticsEvent[] => {
  let filtered = [...events];
  
  if (filters.portfolioId) {
    filtered = filtered.filter(e => e.portfolioId === filters.portfolioId);
  }
  
  if (filters.projectId) {
    filtered = filtered.filter(e => e.projectId === filters.projectId);
  }
  
  if (filters.eventType) {
    filtered = filtered.filter(e => e.type === filters.eventType);
  }
  
  if (filters.country) {
    filtered = filtered.filter(e => e.location?.country === filters.country);
  }
  
  if (filters.deviceType) {
    filtered = filtered.filter(e => e.device?.type === filters.deviceType);
  }
  
  if (filters.timeRange) {
    const { start, end } = getDateRange(filters.timeRange);
    filtered = filtered.filter(e => {
      const eventDate = new Date(e.timestamp);
      return eventDate >= start && eventDate <= end;
    });
  }
  
  return filtered;
};

const aggregateMetrics = (events: AnalyticsEvent[]): any => {
  const metrics = {
    totalViews: events.filter(e => e.type === 'page_view').length,
    projectViews: events.filter(e => e.type === 'project_view').length,
    contactForms: events.filter(e => e.type === 'contact_form').length,
    downloads: events.filter(e => e.type === 'download').length,
    externalLinks: events.filter(e => e.type === 'external_link').length,
    uniqueVisitors: new Set(events.map(e => e.sessionId)).size,
    avgSessionDuration: events.reduce((sum, e) => sum + (e.data?.duration || 0), 0) / events.length || 0,
    bounceRate: 0.35, // Mock bounce rate
    conversionRate: 0.12 // Mock conversion rate
  };
  
  return metrics;
};

const getTopPages = (events: AnalyticsEvent[], limit: number = 10): any[] => {
  const pageViews = events.filter(e => e.type === 'page_view');
  const pageCounts = pageViews.reduce((acc, e) => {
    const page = e.data?.page || 'Unknown';
    acc[page] = (acc[page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(pageCounts)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

const getTopReferrers = (events: AnalyticsEvent[], limit: number = 10): any[] => {
  const referrerCounts = events.reduce((acc, e) => {
    const referrer = e.data?.referrer || 'Direct';
    acc[referrer] = (acc[referrer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(referrerCounts)
    .map(([referrer, visits]) => ({ referrer, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, limit);
};

const getDeviceBreakdown = (events: AnalyticsEvent[]): any => {
  const deviceCounts = events.reduce((acc, e) => {
    const deviceType = e.device?.type || 'Unknown';
    acc[deviceType] = (acc[deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const total = Object.values(deviceCounts).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(deviceCounts).map(([device, count]) => ({
    device,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0
  }));
};

const getLocationBreakdown = (events: AnalyticsEvent[]): any => {
  const countryCounts = events.reduce((acc, e) => {
    const country = e.location?.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(countryCounts)
    .map(([country, visits]) => ({ country, visits }))
    .sort((a, b) => b.visits - a.visits);
};

const getTimeSeriesData = (events: AnalyticsEvent[], timeRange: string): any[] => {
  const { start, end } = getDateRange(timeRange);
  const filteredEvents = events.filter(e => {
    const eventDate = new Date(e.timestamp);
    return eventDate >= start && eventDate <= end;
  });
  
  // Group events by day
  const dailyData = filteredEvents.reduce((acc, e) => {
    const date = new Date(e.timestamp).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, views: 0, visitors: new Set() };
    }
    if (e.type === 'page_view') {
      acc[date].views++;
    }
    acc[date].visitors.add(e.sessionId);
    return acc;
  }, {} as Record<string, any>);
  
  // Convert to array and add unique visitors count
  return Object.values(dailyData).map((day: any) => ({
    date: day.date,
    views: day.views,
    visitors: day.visitors.size
  })).sort((a, b) => a.date.localeCompare(b.date));
};

// Validation middleware
const validateAnalyticsQuery = [
  query('timeRange')
    .optional()
    .isIn(['24h', '7d', '30d', '90d', '1y'])
    .withMessage('Invalid time range'),
  query('portfolioId')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Invalid portfolio ID'),
  query('projectId')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Invalid project ID')
];

const validateEventData = [
  body('type')
    .isIn(['page_view', 'project_view', 'contact_form', 'download', 'external_link', 'custom'])
    .withMessage('Invalid event type'),
  body('portfolioId')
    .isLength({ min: 1 })
    .withMessage('Portfolio ID is required')
];

// Routes

// GET /api/analytics/overview - Get analytics overview
router.get('/overview', optionalAuth, validateAnalyticsQuery, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: errors.array()
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    const {
      timeRange = '30d',
      portfolioId,
      projectId
    } = req.query;
    
    // Filter events
    const filtered = filterEvents(analyticsEvents, {
      timeRange,
      portfolioId,
      projectId
    });
    
    // Aggregate metrics
    const metrics = aggregateMetrics(filtered);
    
    // Get time series data
    const timeSeries = getTimeSeriesData(filtered, timeRange as string);
    
    const overview = {
      metrics,
      timeSeries,
      timeRange,
      totalEvents: filtered.length,
      dateRange: getDateRange(timeRange as string)
    };
    
    const response: APIResponse<any> = {
      success: true,
      data: overview,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/traffic - Get traffic analytics
router.get('/traffic', optionalAuth, validateAnalyticsQuery, async (req, res, next) => {
  try {
    const {
      timeRange = '30d',
      portfolioId
    } = req.query;
    
    const filtered = filterEvents(analyticsEvents, {
      timeRange,
      portfolioId
    });
    
    const traffic = {
      topPages: getTopPages(filtered),
      topReferrers: getTopReferrers(filtered),
      deviceBreakdown: getDeviceBreakdown(filtered),
      locationBreakdown: getLocationBreakdown(filtered),
      timeSeries: getTimeSeriesData(filtered, timeRange as string)
    };
    
    const response: APIResponse<any> = {
      success: true,
      data: traffic,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/projects - Get project analytics
router.get('/projects', optionalAuth, validateAnalyticsQuery, async (req, res, next) => {
  try {
    const {
      timeRange = '30d',
      portfolioId
    } = req.query;
    
    const filtered = filterEvents(analyticsEvents, {
      timeRange,
      portfolioId,
      eventType: 'project_view'
    });
    
    // Group by project
    const projectViews = filtered.reduce((acc, e) => {
      const projectId = e.projectId || 'unknown';
      if (!acc[projectId]) {
        acc[projectId] = {
          projectId,
          views: 0,
          uniqueVisitors: new Set(),
          avgDuration: 0,
          totalDuration: 0
        };
      }
      acc[projectId].views++;
      acc[projectId].uniqueVisitors.add(e.sessionId);
      acc[projectId].totalDuration += e.data?.duration || 0;
      return acc;
    }, {} as Record<string, any>);
    
    // Calculate averages and convert to array
    const projectStats = Object.values(projectViews).map((project: any) => ({
      projectId: project.projectId,
      views: project.views,
      uniqueVisitors: project.uniqueVisitors.size,
      avgDuration: project.views > 0 ? project.totalDuration / project.views : 0
    })).sort((a, b) => b.views - a.views);
    
    const response: APIResponse<any> = {
      success: true,
      data: {
        projects: projectStats,
        totalProjectViews: filtered.length,
        timeRange
      },
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/realtime - Get real-time analytics
router.get('/realtime', optionalAuth, async (req, res, next) => {
  try {
    const { portfolioId } = req.query;
    
    // Get events from last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const realtimeEvents = analyticsEvents.filter(e => {
      const eventDate = new Date(e.timestamp);
      return eventDate >= oneHourAgo && (!portfolioId || e.portfolioId === portfolioId);
    });
    
    const realtime = {
      activeVisitors: new Set(realtimeEvents.map(e => e.sessionId)).size,
      pageViews: realtimeEvents.filter(e => e.type === 'page_view').length,
      events: realtimeEvents.slice(-20), // Last 20 events
      topPages: getTopPages(realtimeEvents, 5),
      deviceBreakdown: getDeviceBreakdown(realtimeEvents)