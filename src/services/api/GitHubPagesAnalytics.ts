// Temporary stub for GitHubPagesAnalytics to resolve build issues
// This will be properly implemented after dependency conflicts are resolved

export interface GitHubPagesSession {
  sessionId: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  pageViews: number;
  interactions: Array<{
    type: string;
    timestamp: Date;
    element?: string;
    value?: string;
  }>;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  referrer?: string;
}

export interface GitHubPagesMetric {
  name: string;
  value: number;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface GitHubPagesEvent {
  type: string;
  data: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
}

export interface GitHubPagesReport {
  id: string;
  timeRange: { start: Date; end: Date };
  sessions: GitHubPagesSession[];
  metrics: GitHubPagesMetric[];
  events: GitHubPagesEvent[];
  summary: {
    totalSessions: number;
    totalPageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  generatedAt: Date;
}

export class GitHubPagesAnalytics {
  private isInitialized: boolean = false;
  private currentSession: GitHubPagesSession | null = null;
  private sessions: GitHubPagesSession[] = [];
  private metrics: GitHubPagesMetric[] = [];
  private events: GitHubPagesEvent[] = [];

  constructor() {
    console.log('GitHubPagesAnalytics initialized (stub mode)');
  }

  public initialize(): void {
    this.isInitialized = true;
    console.log('GitHub Pages analytics service initialized');
  }

  public startSession(userId?: string): string {
    if (!this.isInitialized) {
      console.warn('GitHub Pages analytics service not initialized');
      return '';
    }

    const sessionId = `gh_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.currentSession = {
      sessionId,
      userId,
      startTime: new Date(),
      pageViews: 0,
      interactions: [],
      deviceType: this.getDeviceType(),
      referrer: document.referrer
    };

    this.sessions.push(this.currentSession);
    console.log('GitHub Pages session started:', sessionId);
    return sessionId;
  }

  public endSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
      console.log('GitHub Pages session ended:', this.currentSession.sessionId);
      this.currentSession = null;
    }
  }

  public trackPageView(page: string): void {
    if (!this.isInitialized) {
      console.warn('GitHub Pages analytics service not initialized');
      return;
    }

    if (this.currentSession) {
      this.currentSession.pageViews++;
    }

    this.trackEvent('page_view', {
      page,
      timestamp: new Date(),
      sessionId: this.currentSession?.sessionId
    });

    console.log('Page view tracked:', page);
  }

  public trackInteraction(type: string, element?: string, value?: string): void {
    if (!this.isInitialized) {
      console.warn('GitHub Pages analytics service not initialized');
      return;
    }

    const interaction = {
      type,
      timestamp: new Date(),
      element,
      value
    };

    if (this.currentSession) {
      this.currentSession.interactions.push(interaction);
    }

    this.trackEvent('user_interaction', {
      type,
      element,
      value,
      timestamp: new Date(),
      sessionId: this.currentSession?.sessionId
    });

    console.log('User interaction tracked:', type, element);
  }

  public trackEvent(eventType: string, data: Record<string, any>): void {
    if (!this.isInitialized) {
      console.warn('GitHub Pages analytics service not initialized');
      return;
    }

    const event: GitHubPagesEvent = {
      type: eventType,
      data,
      timestamp: new Date(),
      sessionId: this.currentSession?.sessionId
    };

    this.events.push(event);
    console.log('Event tracked:', eventType, data);
  }

  public trackMetric(name: string, value: number, context?: Record<string, any>): void {
    if (!this.isInitialized) {
      console.warn('GitHub Pages analytics service not initialized');
      return;
    }

    const metric: GitHubPagesMetric = {
      name,
      value,
      timestamp: new Date(),
      context
    };

    this.metrics.push(metric);
    console.log('Metric tracked:', name, value);
  }

  public trackProjectEngagement(projectName: string, action: string): void {
    this.trackEvent('project_engagement', {
      projectName,
      action,
      timestamp: new Date()
    });
    console.log('Project engagement tracked:', projectName, action);
  }

  public trackGameCompletion(gameName: string, score?: number, timeSpent?: number): void {
    this.trackEvent('game_completion', {
      gameName,
      score,
      timeSpent,
      timestamp: new Date()
    });
    console.log('Game completion tracked:', gameName, score);
  }

  public trackConversionPath(step: string, value?: string): void {
    this.trackEvent('conversion_path', {
      step,
      value,
      timestamp: new Date()
    });
    console.log('Conversion path tracked:', step, value);
  }

  public trackContactFormSubmission(formData: Record<string, any>): void {
    this.trackEvent('contact_form_submission', {
      ...formData,
      timestamp: new Date()
    });
    console.log('Contact form submission tracked');
  }

  public trackResumeDownload(): void {
    this.trackEvent('resume_download', {
      timestamp: new Date()
    });
    console.log('Resume download tracked');
  }

  public trackSocialMediaClick(platform: string, url: string): void {
    this.trackEvent('social_media_click', {
      platform,
      url,
      timestamp: new Date()
    });
    console.log('Social media click tracked:', platform);
  }

  public getSessions(timeRange?: { start: Date; end: Date }): GitHubPagesSession[] {
    if (timeRange) {
      return this.sessions.filter(s => 
        s.startTime >= timeRange.start && 
        s.startTime <= timeRange.end
      );
    }
    return this.sessions;
  }

  public getMetrics(timeRange?: { start: Date; end: Date }): GitHubPagesMetric[] {
    if (timeRange) {
      return this.metrics.filter(m => 
        m.timestamp >= timeRange.start && 
        m.timestamp <= timeRange.end
      );
    }
    return this.metrics;
  }

  public getEvents(eventType?: string, timeRange?: { start: Date; end: Date }): GitHubPagesEvent[] {
    let filteredEvents = this.events;
    
    if (eventType) {
      filteredEvents = filteredEvents.filter(e => e.type === eventType);
    }
    
    if (timeRange) {
      filteredEvents = filteredEvents.filter(e => 
        e.timestamp >= timeRange.start && 
        e.timestamp <= timeRange.end
      );
    }
    
    return filteredEvents;
  }

  public generateReport(timeRange: { start: Date; end: Date }): GitHubPagesReport {
    const sessions = this.getSessions(timeRange);
    const metrics = this.getMetrics(timeRange);
    const events = this.getEvents(undefined, timeRange);
    
    const totalSessions = sessions.length;
    const totalPageViews = sessions.reduce((sum, s) => sum + s.pageViews, 0);
    const totalDuration = sessions.reduce((sum, s) => {
      if (s.endTime) {
        return sum + (s.endTime.getTime() - s.startTime.getTime());
      }
      return sum;
    }, 0);
    const avgSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
    const bounceRate = sessions.filter(s => s.pageViews <= 1).length / totalSessions;
    
    const report: GitHubPagesReport = {
      id: `report_${Date.now()}`,
      timeRange,
      sessions,
      metrics,
      events,
      summary: {
        totalSessions,
        totalPageViews,
        avgSessionDuration,
        bounceRate
      },
      generatedAt: new Date()
    };
    
    console.log('GitHub Pages report generated:', report.id);
    return report;
  }

  public getCurrentSession(): GitHubPagesSession | null {
    return this.currentSession;
  }

  public clearData(): void {
    this.sessions = [];
    this.metrics = [];
    this.events = [];
    this.currentSession = null;
    console.log('GitHub Pages analytics data cleared');
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone/.test(userAgent)) return 'mobile';
    if (/iPad/.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public getDebugInfo(): Record<string, any> {
    return {
      initialized: this.isInitialized,
      currentSession: this.currentSession?.sessionId,
      sessionsCount: this.sessions.length,
      metricsCount: this.metrics.length,
      eventsCount: this.events.length,
      mode: 'github-pages-stub'
    };
  }
}

export default GitHubPagesAnalytics;