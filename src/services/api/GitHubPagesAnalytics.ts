import { AnalyticsService } from './AnalyticsService';
import { EnhancedAnalyticsConfig } from './types';
import { performanceMonitor } from '../../utils/performance';

/**
 * GitHub Pages Portfolio Analytics Service
 * Specialized analytics for portfolio tracking on GitHub Pages
 */
export interface GitHubPagesConfig extends EnhancedAnalyticsConfig {
  repositoryName: string;
  ownerName: string;
  deploymentUrl: string;
  trackingId: string;
}

export interface ProjectEngagement {
  projectId: string;
  projectName: string;
  viewCount: number;
  averageTimeSpent: number;
  interactionCount: number;
  completionRate?: number; // For games/interactive elements
  conversionRate?: number; // To contact form
  lastViewed: Date;
  referrerSources: Record<string, number>;
}

export interface GameMetrics {
  gameId: string;
  gameName: string;
  startCount: number;
  completionCount: number;
  completionRate: number;
  averagePlayTime: number;
  highScores: number[];
  abandonmentPoints: Record<string, number>;
  userFeedback: Array<{ rating: number; comment?: string; timestamp: Date }>;
}

export interface ConversionPath {
  pathId: string;
  steps: string[];
  conversionRate: number;
  dropOffPoints: Record<string, number>;
  averageTimeToConvert: number;
  totalConversions: number;
}

export interface VisitorSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  pageViews: string[];
  interactions: Array<{ element: string; action: string; timestamp: Date }>;
  deviceInfo: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    screenResolution: string;
  };
  geolocation?: {
    country: string;
    region: string;
    city: string;
    timezone: string;
  };
  referrer?: string;
  utmParams?: Record<string, string>;
}

export class GitHubPagesAnalytics extends AnalyticsService {
  declare protected config: GitHubPagesConfig;
  private projectEngagements: Map<string, ProjectEngagement> = new Map();
  private gameMetrics: Map<string, GameMetrics> = new Map();
  private conversionPaths: Map<string, ConversionPath> = new Map();
  private currentSession: VisitorSession | null = null;
  private performanceObserver: PerformanceObserver | null = null;

  constructor(config: GitHubPagesConfig) {
    super(config);
    this.config = config;
    this.initializeGitHubPagesTracking();
  }

  private async initializeGitHubPagesTracking(): Promise<void> {
    // Initialize session tracking
    await this.startPortfolioSession();
    
    // Set up performance monitoring
    this.setupGitHubPagesPerformanceTracking();
    
    // Set up interaction tracking
    this.setupInteractionTracking();
    
    // Set up visibility tracking
    this.setupVisibilityTracking();
    
    // Track initial page load
    await this.trackPageLoad();
  }

  /**
   * Start a new portfolio session with enhanced tracking
   */
  private async startPortfolioSession(): Promise<void> {
    const sessionId = this.generateGitHubPagesSessionId();
    
    this.currentSession = {
      sessionId,
      startTime: new Date(),
      pageViews: [window.location.pathname],
      interactions: [],
      deviceInfo: this.getDeviceInfo(),
      geolocation: await this.getGeolocation(),
      referrer: document.referrer,
      utmParams: this.extractUtmParams()
    };

    await this.track('portfolio_session_start', {
      sessionId,
      deviceInfo: this.currentSession.deviceInfo,
      geolocation: this.currentSession.geolocation,
      referrer: this.currentSession.referrer,
      utmParams: this.currentSession.utmParams,
      deploymentUrl: this.config.deploymentUrl,
      repository: `${this.config.ownerName}/${this.config.repositoryName}`
    });
  }

  /**
   * Track project engagement
   */
  async trackProjectEngagement(
    projectId: string,
    projectName: string,
    action: 'view' | 'interact' | 'complete' | 'convert',
    metadata?: Record<string, any>
  ): Promise<void> {
    const engagement = this.projectEngagements.get(projectId) || {
      projectId,
      projectName,
      viewCount: 0,
      averageTimeSpent: 0,
      interactionCount: 0,
      lastViewed: new Date(),
      referrerSources: {}
    };

    switch (action) {
      case 'view':
        engagement.viewCount++;
        engagement.lastViewed = new Date();
        break;
      case 'interact':
        engagement.interactionCount++;
        break;
      case 'complete':
        if (metadata?.timeSpent) {
          engagement.averageTimeSpent = 
            (engagement.averageTimeSpent + metadata.timeSpent) / 2;
        }
        break;
      case 'convert':
        // Track conversion to contact form or other goals
        break;
    }

    this.projectEngagements.set(projectId, engagement);

    await this.track('project_engagement', {
      projectId,
      projectName,
      action,
      engagement,
      metadata,
      sessionId: this.currentSession?.sessionId
    });
  }

  /**
   * Track game completion and metrics
   */
  async trackGameMetrics(
    gameId: string,
    gameName: string,
    event: 'start' | 'complete' | 'abandon' | 'score' | 'feedback',
    data?: {
      score?: number;
      level?: string;
      timeSpent?: number;
      abandonPoint?: string;
      feedback?: { rating: number; comment?: string };
    }
  ): Promise<void> {
    const metrics = this.gameMetrics.get(gameId) || {
      gameId,
      gameName,
      startCount: 0,
      completionCount: 0,
      completionRate: 0,
      averagePlayTime: 0,
      highScores: [],
      abandonmentPoints: {},
      userFeedback: []
    };

    switch (event) {
      case 'start':
        metrics.startCount++;
        break;
      case 'complete':
        metrics.completionCount++;
        metrics.completionRate = metrics.completionCount / metrics.startCount;
        if (data?.timeSpent) {
          metrics.averagePlayTime = 
            (metrics.averagePlayTime + data.timeSpent) / metrics.completionCount;
        }
        break;
      case 'abandon':
        if (data?.abandonPoint) {
          metrics.abandonmentPoints[data.abandonPoint] = 
            (metrics.abandonmentPoints[data.abandonPoint] || 0) + 1;
        }
        break;
      case 'score':
        if (data?.score) {
          metrics.highScores.push(data.score);
          metrics.highScores.sort((a, b) => b - a);
          metrics.highScores = metrics.highScores.slice(0, 10); // Keep top 10
        }
        break;
      case 'feedback':
        if (data?.feedback) {
          metrics.userFeedback.push({
            ...data.feedback,
            timestamp: new Date()
          });
        }
        break;
    }

    this.gameMetrics.set(gameId, metrics);

    await this.track('game_metrics', {
      gameId,
      gameName,
      event,
      data,
      metrics,
      sessionId: this.currentSession?.sessionId
    });
  }

  /**
   * Track conversion paths
   */
  async trackConversionPath(
    pathId: string,
    step: string,
    isConversion: boolean = false
  ): Promise<void> {
    const path = this.conversionPaths.get(pathId) || {
      pathId,
      steps: [],
      conversionRate: 0,
      dropOffPoints: {},
      averageTimeToConvert: 0,
      totalConversions: 0
    };

    if (!path.steps.includes(step)) {
      path.steps.push(step);
    }

    if (isConversion) {
      path.totalConversions++;
      path.conversionRate = path.totalConversions / (path.totalConversions + 
        Object.values(path.dropOffPoints).reduce((a, b) => a + b, 0));
    } else {
      path.dropOffPoints[step] = (path.dropOffPoints[step] || 0) + 1;
    }

    this.conversionPaths.set(pathId, path);

    await this.track('conversion_path', {
      pathId,
      step,
      isConversion,
      path,
      sessionId: this.currentSession?.sessionId
    });
  }

  /**
   * Track professional metrics
   */
  async trackProfessionalMetric(
    type: 'contact_form' | 'resume_download' | 'social_click' | 'portfolio_share',
    data: {
      source?: string;
      format?: string;
      platform?: string;
      success?: boolean;
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    await this.track('professional_metric', {
      type,
      data,
      timestamp: Date.now(),
      sessionId: this.currentSession?.sessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    });

    // Track conversion path for contact form
    if (type === 'contact_form' && data.success) {
      await this.trackConversionPath('contact_conversion', 'form_submit', true);
    }
  }

  /**
   * Get device information
   */
  private getDeviceInfo(): VisitorSession['deviceInfo'] {
    const userAgent = navigator.userAgent;
    
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    }

    let os = 'Unknown';
    if (/Windows/.test(userAgent)) os = 'Windows';
    else if (/Mac/.test(userAgent)) os = 'macOS';
    else if (/Linux/.test(userAgent)) os = 'Linux';
    else if (/Android/.test(userAgent)) os = 'Android';
    else if (/iOS/.test(userAgent)) os = 'iOS';

    let browser = 'Unknown';
    if (/Chrome/.test(userAgent)) browser = 'Chrome';
    else if (/Firefox/.test(userAgent)) browser = 'Firefox';
    else if (/Safari/.test(userAgent)) browser = 'Safari';
    else if (/Edge/.test(userAgent)) browser = 'Edge';

    return {
      type: deviceType,
      os,
      browser,
      screenResolution: `${screen.width}x${screen.height}`
    };
  }

  /**
   * Get geolocation information
   */
  private async getGeolocation(): Promise<VisitorSession['geolocation']> {
    try {
      // Use IP geolocation service (in production, use a proper service)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        country: data.country_name || 'Unknown',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        timezone: data.timezone || 'Unknown'
      };
    } catch (error) {
      console.warn('Failed to get geolocation:', error);
      return undefined;
    }
  }

  /**
   * Extract UTM parameters
   */
  private extractUtmParams(): Record<string, string> {
    const params = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};
    
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = params.get(param);
      if (value) {
        utmParams[param] = value;
      }
    });
    
    return utmParams;
  }

  /**
   * Set up performance tracking
   */
  private setupGitHubPagesPerformanceTracking(): void {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackPerformanceMetric(entry);
        }
      });

      this.performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    }

    // Track page load time
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        this.track('page_load_performance', {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstByte: navigation.responseStart - navigation.requestStart,
          sessionId: this.currentSession?.sessionId
        });
      }, 0);
    });
  }

  /**
   * Track performance metrics
   */
  private async trackPerformanceMetric(entry: PerformanceEntry): Promise<void> {
    const metricData: Record<string, any> = {
      name: entry.name,
      type: entry.entryType,
      startTime: entry.startTime,
      duration: entry.duration,
      sessionId: this.currentSession?.sessionId
    };

    // Add specific data based on entry type
    if (entry.entryType === 'largest-contentful-paint') {
      metricData.lcp = entry.startTime;
    } else if (entry.entryType === 'first-input') {
      metricData.fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
    } else if (entry.entryType === 'layout-shift') {
      metricData.cls = (entry as any).value;
    }

    await this.track('performance_metric', metricData);
  }

  /**
   * Set up interaction tracking
   */
  private setupInteractionTracking(): void {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.trackInteraction('click', target, event);
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const target = event.target as HTMLFormElement;
      this.trackInteraction('form_submit', target, event);
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
          this.track('scroll_depth', {
            depth: scrollDepth,
            page: window.location.pathname,
            sessionId: this.currentSession?.sessionId
          });
        }
      }
    });
  }

  /**
   * Track user interactions
   */
  private async trackInteraction(
    type: string,
    element: HTMLElement,
    event: Event
  ): Promise<void> {
    const interaction = {
      element: this.getElementSelector(element),
      action: type,
      timestamp: new Date()
    };

    if (this.currentSession) {
      this.currentSession.interactions.push(interaction);
    }

    await this.track('user_interaction', {
      type,
      element: interaction.element,
      elementText: element.textContent?.slice(0, 100),
      elementTag: element.tagName.toLowerCase(),
      elementId: element.id,
      elementClass: element.className,
      page: window.location.pathname,
      sessionId: this.currentSession?.sessionId,
      coordinates: {
        x: (event as MouseEvent).clientX,
        y: (event as MouseEvent).clientY
      }
    });
  }

  /**
   * Get CSS selector for element
   */
  private getElementSelector(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      return `.${element.className.split(' ').join('.')}`;
    }
    
    return element.tagName.toLowerCase();
  }

  /**
   * Set up visibility tracking
   */
  private setupVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden', {
          sessionId: this.currentSession?.sessionId,
          timeOnPage: Date.now() - (this.currentSession?.startTime.getTime() || 0)
        });
      } else {
        this.track('page_visible', {
          sessionId: this.currentSession?.sessionId
        });
      }
    });

    // Track when user leaves the page
    window.addEventListener('beforeunload', () => {
      if (this.currentSession) {
        this.currentSession.endTime = new Date();
        this.track('session_end', {
          sessionId: this.currentSession.sessionId,
          duration: this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime(),
          pageViews: this.currentSession.pageViews.length,
          interactions: this.currentSession.interactions.length
        }, { immediate: true });
      }
    });
  }

  /**
   * Track page load
   */
  private async trackPageLoad(): Promise<void> {
    await this.track('page_load', {
      page: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: this.currentSession?.sessionId
    });
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    projectEngagements: ProjectEngagement[];
    gameMetrics: GameMetrics[];
    conversionPaths: ConversionPath[];
    currentSession: VisitorSession | null;
  } {
    return {
      projectEngagements: Array.from(this.projectEngagements.values()),
      gameMetrics: Array.from(this.gameMetrics.values()),
      conversionPaths: Array.from(this.conversionPaths.values()),
      currentSession: this.currentSession
    };
  }

  /**
   * Generate session ID
   */
  private generateGitHubPagesSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const gitHubPagesAnalytics = new GitHubPagesAnalytics({
  baseURL: process.env.REACT_APP_ANALYTICS_ENDPOINT || 'https://analytics.api.demo.com',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  rateLimit: {
    requests: 100,
    window: 60000
  },
  trackingId: 'github-pages-portfolio',
  repositoryName: 'Learner-Files',
  ownerName: 'StrayDogSyndicate',
  deploymentUrl: 'https://straydogsyn.github.io/Learner-Files/',
  enableAutoTracking: true,
  enablePerformanceTracking: true,
  enableErrorTracking: true,
  enableUserTracking: true,
  enableOfflineSupport: true,
  batchSize: 50,
  debugMode: process.env.NODE_ENV === 'development'
});