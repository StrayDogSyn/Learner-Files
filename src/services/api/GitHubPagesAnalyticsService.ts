import { AnalyticsEvent, AnalyticsUser, AnalyticsSession } from './types';

export interface GitHubPagesMetrics {
  // Visitor Analytics
  realTimeVisitors: number;
  totalPageViews: number;
  uniqueVisitors: number;
  returningVisitors: number;
  newVisitors: number;
  
  // Project Engagement
  projectViews: Record<string, number>;
  projectEngagement: Record<string, {
    views: number;
    timeSpent: number;
    interactions: number;
    completionRate: number;
    conversionRate: number;
  }>;
  
  // Game Analytics
  gameCompletionRates: Record<string, {
    started: number;
    completed: number;
    averageTime: number;
    highScores: number[];
    retryRate: number;
  }>;
  
  // Performance Metrics
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte
  };
  
  // User Behavior
  userFlow: Array<{
    from: string;
    to: string;
    count: number;
    dropOffRate: number;
  }>;
  
  // Professional Metrics
  contactFormConversions: {
    views: number;
    submissions: number;
    conversionRate: number;
    completionTime: number;
  };
  
  resumeDownloads: {
    total: number;
    unique: number;
    sources: Record<string, number>;
  };
  
  socialMediaClicks: Record<string, {
    clicks: number;
    platform: string;
    conversionRate: number;
  }>;
  
  // Geographic and Device Data
  geographicData: Record<string, {
    visitors: number;
    sessions: number;
    avgSessionDuration: number;
  }>;
  
  deviceBreakdown: Record<string, {
    users: number;
    percentage: number;
    avgSessionDuration: number;
  }>;
  
  // Traffic Sources
  trafficSources: Record<string, {
    visitors: number;
    percentage: number;
    conversionRate: number;
    quality: 'high' | 'medium' | 'low';
  }>;
}

export interface HeatmapData {
  elementId: string;
  x: number;
  y: number;
  clicks: number;
  hovers: number;
  scrollDepth: number;
  timeSpent: number;
}

export interface SessionRecording {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  events: Array<{
    type: 'click' | 'scroll' | 'hover' | 'input' | 'navigation';
    timestamp: number;
    element?: string;
    data: Record<string, any>;
  }>;
  metadata: {
    userAgent: string;
    viewport: { width: number; height: number };
    referrer: string;
    path: string;
  };
}

export interface AlertConfig {
  id: string;
  name: string;
  metric: keyof GitHubPagesMetrics | string;
  condition: 'above' | 'below' | 'equals' | 'change';
  threshold: number;
  timeframe: '5m' | '15m' | '1h' | '24h';
  enabled: boolean;
  notifications: Array<{
    type: 'email' | 'webhook' | 'browser';
    target: string;
  }>;
}

export class GitHubPagesAnalyticsService {
  private metrics: GitHubPagesMetrics;
  private heatmapData: HeatmapData[] = [];
  private sessionRecordings: SessionRecording[] = [];
  private alerts: AlertConfig[] = [];
  private isInitialized = false;
  private realTimeUpdateInterval?: NodeJS.Timeout;
  private performanceObserver?: PerformanceObserver;
  private sessionId: string;
  private userId?: string;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.metrics = this.initializeMetrics();
    this.setupPerformanceMonitoring();
    this.setupVisibilityTracking();
  }
  
  private generateSessionId(): string {
    return `gh-pages-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private initializeMetrics(): GitHubPagesMetrics {
    return {
      realTimeVisitors: 0,
      totalPageViews: 0,
      uniqueVisitors: 0,
      returningVisitors: 0,
      newVisitors: 0,
      projectViews: {},
      projectEngagement: {},
      gameCompletionRates: {},
      coreWebVitals: {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        ttfb: 0
      },
      userFlow: [],
      contactFormConversions: {
        views: 0,
        submissions: 0,
        conversionRate: 0,
        completionTime: 0
      },
      resumeDownloads: {
        total: 0,
        unique: 0,
        sources: {}
      },
      socialMediaClicks: {},
      geographicData: {},
      deviceBreakdown: {},
      trafficSources: {}
    };
  }
  
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Load existing metrics from localStorage for GitHub Pages
      await this.loadStoredMetrics();
      
      // Setup real-time tracking
      this.setupRealTimeTracking();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Start session
      this.startSession();
      
      this.isInitialized = true;
      console.log('GitHub Pages Analytics Service initialized');
    } catch (error) {
      console.error('Failed to initialize GitHub Pages Analytics:', error);
    }
  }
  
  private async loadStoredMetrics(): Promise<void> {
    try {
      const stored = localStorage.getItem('gh-pages-analytics-metrics');
      if (stored) {
        const parsedMetrics = JSON.parse(stored);
        this.metrics = { ...this.metrics, ...parsedMetrics };
      }
    } catch (error) {
      console.warn('Failed to load stored metrics:', error);
    }
  }
  
  private setupRealTimeTracking(): void {
    // Update real-time visitor count
    this.realTimeUpdateInterval = setInterval(() => {
      this.updateRealTimeVisitors();
      this.saveMetricsToStorage();
    }, 30000); // Update every 30 seconds
  }
  
  private setupEventListeners(): void {
    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_hidden', { timestamp: Date.now() });
      } else {
        this.trackEvent('page_visible', { timestamp: Date.now() });
        this.updateRealTimeVisitors();
      }
    });
    
    // Beforeunload for session end
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
    
    // Click tracking for heatmap
    document.addEventListener('click', (event) => {
      this.trackClick(event);
    });
    
    // Scroll tracking
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackScrollDepth();
      }, 100);
    });
  }
  
  private setupPerformanceMonitoring(): void {
    // Core Web Vitals tracking
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.coreWebVitals.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.coreWebVitals.fid = entry.processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ['first-input'] });
      
      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.coreWebVitals.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
    }
    
    // Navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.metrics.coreWebVitals.fcp = navigation.responseStart - navigation.fetchStart;
          this.metrics.coreWebVitals.ttfb = navigation.responseStart - navigation.requestStart;
        }
      }, 0);
    });
  }
  
  private setupVisibilityTracking(): void {
    // Track when page becomes visible/hidden
    let visibilityStart = Date.now();
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const timeSpent = Date.now() - visibilityStart;
        this.trackEvent('time_on_page', { duration: timeSpent });
      } else {
        visibilityStart = Date.now();
      }
    });
  }
  
  public trackPageView(path: string, title?: string): void {
    this.metrics.totalPageViews++;
    
    // Check if new visitor
    const isNewVisitor = !localStorage.getItem('gh-pages-visitor-id');
    if (isNewVisitor) {
      this.metrics.newVisitors++;
      localStorage.setItem('gh-pages-visitor-id', this.generateSessionId());
    } else {
      this.metrics.returningVisitors++;
    }
    
    this.trackEvent('page_view', {
      path,
      title: title || document.title,
      referrer: document.referrer,
      timestamp: Date.now()
    });
    
    this.saveMetricsToStorage();
  }
  
  public trackProjectView(projectId: string, projectName: string): void {
    if (!this.metrics.projectViews[projectId]) {
      this.metrics.projectViews[projectId] = 0;
    }
    this.metrics.projectViews[projectId]++;
    
    if (!this.metrics.projectEngagement[projectId]) {
      this.metrics.projectEngagement[projectId] = {
        views: 0,
        timeSpent: 0,
        interactions: 0,
        completionRate: 0,
        conversionRate: 0
      };
    }
    this.metrics.projectEngagement[projectId].views++;
    
    this.trackEvent('project_view', {
      projectId,
      projectName,
      timestamp: Date.now()
    });
    
    this.saveMetricsToStorage();
  }
  
  public trackGameCompletion(gameId: string, completed: boolean, timeSpent: number, score?: number): void {
    if (!this.metrics.gameCompletionRates[gameId]) {
      this.metrics.gameCompletionRates[gameId] = {
        started: 0,
        completed: 0,
        averageTime: 0,
        highScores: [],
        retryRate: 0
      };
    }
    
    const gameMetrics = this.metrics.gameCompletionRates[gameId];
    gameMetrics.started++;
    
    if (completed) {
      gameMetrics.completed++;
      gameMetrics.averageTime = (gameMetrics.averageTime + timeSpent) / 2;
      
      if (score !== undefined) {
        gameMetrics.highScores.push(score);
        gameMetrics.highScores.sort((a, b) => b - a);
        gameMetrics.highScores = gameMetrics.highScores.slice(0, 10); // Keep top 10
      }
    }
    
    this.trackEvent('game_completion', {
      gameId,
      completed,
      timeSpent,
      score,
      timestamp: Date.now()
    });
    
    this.saveMetricsToStorage();
  }
  
  public trackContactFormInteraction(action: 'view' | 'start' | 'submit', formData?: any): void {
    const conversions = this.metrics.contactFormConversions;
    
    switch (action) {
      case 'view':
        conversions.views++;
        break;
      case 'submit':
        conversions.submissions++;
        conversions.conversionRate = conversions.submissions / conversions.views;
        break;
    }
    
    this.trackEvent('contact_form', {
      action,
      formData,
      timestamp: Date.now()
    });
    
    this.saveMetricsToStorage();
  }
  
  public trackResumeDownload(source: string): void {
    this.metrics.resumeDownloads.total++;
    
    // Check if unique download
    const downloadKey = `resume-download-${source}`;
    if (!localStorage.getItem(downloadKey)) {
      this.metrics.resumeDownloads.unique++;
      localStorage.setItem(downloadKey, 'true');
    }
    
    if (!this.metrics.resumeDownloads.sources[source]) {
      this.metrics.resumeDownloads.sources[source] = 0;
    }
    this.metrics.resumeDownloads.sources[source]++;
    
    this.trackEvent('resume_download', {
      source,
      timestamp: Date.now()
    });
    
    this.saveMetricsToStorage();
  }
  
  public trackSocialMediaClick(platform: string, url: string): void {
    if (!this.metrics.socialMediaClicks[platform]) {
      this.metrics.socialMediaClicks[platform] = {
        clicks: 0,
        platform,
        conversionRate: 0
      };
    }
    
    this.metrics.socialMediaClicks[platform].clicks++;
    
    this.trackEvent('social_media_click', {
      platform,
      url,
      timestamp: Date.now()
    });
    
    this.saveMetricsToStorage();
  }
  
  private trackClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    const heatmapPoint: HeatmapData = {
      elementId: target.id || target.tagName.toLowerCase(),
      x: event.clientX,
      y: event.clientY,
      clicks: 1,
      hovers: 0,
      scrollDepth: window.scrollY / (document.body.scrollHeight - window.innerHeight),
      timeSpent: Date.now()
    };
    
    // Find existing point or add new one
    const existingPoint = this.heatmapData.find(p => 
      p.elementId === heatmapPoint.elementId && 
      Math.abs(p.x - heatmapPoint.x) < 50 && 
      Math.abs(p.y - heatmapPoint.y) < 50
    );
    
    if (existingPoint) {
      existingPoint.clicks++;
    } else {
      this.heatmapData.push(heatmapPoint);
    }
  }
  
  private trackScrollDepth(): void {
    const scrollDepth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    
    this.trackEvent('scroll_depth', {
      depth: scrollDepth,
      timestamp: Date.now()
    });
  }
  
  private trackEvent(type: string, data: any): void {
    const event: AnalyticsEvent = {
      id: this.generateSessionId(),
      type: type as any,
      timestamp: Date.now(),
      data,
      sessionId: this.sessionId,
      userId: this.userId
    };
    
    // Store event locally for GitHub Pages
    const events = JSON.parse(localStorage.getItem('gh-pages-analytics-events') || '[]');
    events.push(event);
    
    // Keep only last 1000 events
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }
    
    localStorage.setItem('gh-pages-analytics-events', JSON.stringify(events));
  }
  
  private startSession(): void {
    const session: AnalyticsSession = {
      id: this.sessionId,
      userId: this.userId,
      startTime: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      initialPage: window.location.pathname
    };
    
    localStorage.setItem('gh-pages-current-session', JSON.stringify(session));
  }
  
  private endSession(): void {
    const sessionData = localStorage.getItem('gh-pages-current-session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;
      
      // Store completed session
      const sessions = JSON.parse(localStorage.getItem('gh-pages-analytics-sessions') || '[]');
      sessions.push(session);
      
      // Keep only last 100 sessions
      if (sessions.length > 100) {
        sessions.splice(0, sessions.length - 100);
      }
      
      localStorage.setItem('gh-pages-analytics-sessions', JSON.stringify(sessions));
      localStorage.removeItem('gh-pages-current-session');
    }
  }
  
  private updateRealTimeVisitors(): void {
    // Simulate real-time visitor count for GitHub Pages
    const baseVisitors = Math.floor(Math.random() * 20) + 5;
    const timeOfDay = new Date().getHours();
    const multiplier = timeOfDay >= 9 && timeOfDay <= 17 ? 1.5 : 0.8; // Higher during work hours
    
    this.metrics.realTimeVisitors = Math.floor(baseVisitors * multiplier);
  }
  
  private saveMetricsToStorage(): void {
    localStorage.setItem('gh-pages-analytics-metrics', JSON.stringify(this.metrics));
  }
  
  public getMetrics(): GitHubPagesMetrics {
    return { ...this.metrics };
  }
  
  public getHeatmapData(): HeatmapData[] {
    return [...this.heatmapData];
  }
  
  public getSessionRecordings(): SessionRecording[] {
    return [...this.sessionRecordings];
  }
  
  public exportData(format: 'json' | 'csv'): string {
    const data = {
      metrics: this.metrics,
      heatmapData: this.heatmapData,
      events: JSON.parse(localStorage.getItem('gh-pages-analytics-events') || '[]'),
      sessions: JSON.parse(localStorage.getItem('gh-pages-analytics-sessions') || '[]')
    };
    
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else {
      // Convert to CSV format
      const csv = this.convertToCSV(data);
      return csv;
    }
  }
  
  private convertToCSV(data: any): string {
    // Simple CSV conversion for metrics
    const headers = Object.keys(data.metrics).join(',');
    const values = Object.values(data.metrics).map(v => 
      typeof v === 'object' ? JSON.stringify(v) : v
    ).join(',');
    
    return `${headers}\n${values}`;
  }
  
  public generateWeeklyReport(): any {
    const events = JSON.parse(localStorage.getItem('gh-pages-analytics-events') || '[]');
    const sessions = JSON.parse(localStorage.getItem('gh-pages-analytics-sessions') || '[]');
    
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weeklyEvents = events.filter((e: any) => e.timestamp > weekAgo);
    const weeklySessions = sessions.filter((s: any) => s.startTime > weekAgo);
    
    return {
      period: 'weekly',
      startDate: new Date(weekAgo).toISOString(),
      endDate: new Date().toISOString(),
      summary: {
        totalEvents: weeklyEvents.length,
        totalSessions: weeklySessions.length,
        averageSessionDuration: weeklySessions.reduce((sum: number, s: any) => 
          sum + (s.duration || 0), 0) / weeklySessions.length || 0,
        topPages: this.getTopPagesFromEvents(weeklyEvents),
        deviceBreakdown: this.getDeviceBreakdownFromSessions(weeklySessions)
      },
      insights: this.generateInsights(weeklyEvents, weeklySessions)
    };
  }
  
  private getTopPagesFromEvents(events: any[]): any[] {
    const pageViews = events.filter(e => e.type === 'page_view');
    const pageCounts: Record<string, number> = {};
    
    pageViews.forEach(e => {
      const page = e.data?.path || 'unknown';
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    });
    
    return Object.entries(pageCounts)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }
  
  private getDeviceBreakdownFromSessions(sessions: any[]): any {
    const deviceCounts: Record<string, number> = {};
    
    sessions.forEach(s => {
      const userAgent = s.userAgent || '';
      let device = 'desktop';
      
      if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
        device = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
      }
      
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    
    const total = Object.values(deviceCounts).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(deviceCounts).map(([device, count]) => ({
      device,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  }
  
  private generateInsights(events: any[], sessions: any[]): string[] {
    const insights: string[] = [];
    
    // Analyze trends
    if (events.length > 0) {
      const avgEventsPerSession = events.length / sessions.length;
      if (avgEventsPerSession > 10) {
        insights.push('High user engagement detected - users are actively interacting with content');
      }
    }
    
    // Analyze bounce rate
    const singlePageSessions = sessions.filter(s => s.duration && s.duration < 30000).length;
    const bounceRate = singlePageSessions / sessions.length;
    if (bounceRate > 0.7) {
      insights.push('High bounce rate detected - consider improving page load speed or content relevance');
    }
    
    return insights;
  }
  
  public destroy(): void {
    if (this.realTimeUpdateInterval) {
      clearInterval(this.realTimeUpdateInterval);
    }
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    this.endSession();
    this.isInitialized = false;
  }
}

export default GitHubPagesAnalyticsService;