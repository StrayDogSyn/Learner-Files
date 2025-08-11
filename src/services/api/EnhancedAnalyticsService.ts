import { AnalyticsService } from './AnalyticsService';
import { ClaudeService } from './ClaudeService';
import { gtag } from 'gtag';
import mixpanel from 'mixpanel-browser';
import {
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsUser,
  AnalyticsSession,
  APIResponse
} from './types';

export interface EnhancedAnalyticsConfig extends AnalyticsConfig {
  mixpanelToken?: string;
  amplitudeApiKey?: string;
  segmentWriteKey?: string;
  hotjarId?: string;
  fullstoryOrgId?: string;
  enableHeatmaps?: boolean;
  enableSessionRecording?: boolean;
  enableFunnelAnalysis?: boolean;
  enableCohortAnalysis?: boolean;
  enableABTesting?: boolean;
  enableAIInsights?: boolean;
  consentRequired?: boolean;
  dataRetentionDays?: number;
  googleAnalytics?: {
    measurementId: string;
    enabled: boolean;
  };
  mixpanel?: {
    token: string;
    enabled: boolean;
    config?: any;
  };
  claude?: {
    apiKey: string;
    enabled: boolean;
  };
  heatmap?: {
    enabled: boolean;
    sampleRate: number;
  };
  sessionRecording?: {
    enabled: boolean;
    sampleRate: number;
    maskSensitiveData: boolean;
  };
}

export interface HeatmapData {
  x: number;
  y: number;
  timestamp: number;
  type: 'click' | 'move' | 'scroll';
  element?: string;
  page: string;
}

export interface SessionRecording {
  id: string;
  userId?: string;
  sessionId: string;
  startTime: number;
  endTime?: number;
  events: SessionEvent[];
  metadata: {
    userAgent: string;
    viewport: { width: number; height: number };
    url: string;
  };
}

export interface SessionEvent {
  timestamp: number;
  type: 'dom' | 'input' | 'click' | 'scroll' | 'resize';
  data: any;
}

export interface AIInsight {
  id: string;
  type: 'performance' | 'behavior' | 'conversion' | 'content';
  title: string;
  description: string;
  confidence: number;
  recommendations: string[];
  data: any;
  generatedAt: number;
}

/**
 * Enhanced Analytics Service
 * Integrates Google Analytics 4, Mixpanel, and AI-powered insights
 */
export class EnhancedAnalyticsService extends AnalyticsService {
  private enhancedConfig: EnhancedAnalyticsConfig;
  private claudeService?: ClaudeService;
  private heatmapData: HeatmapData[] = [];
  private sessionRecordings: Map<string, SessionRecording> = new Map();
  private currentRecording?: SessionRecording;
  private aiInsights: AIInsight[] = [];
  private consentGiven: boolean = false;

  constructor(config: EnhancedAnalyticsConfig) {
    super(config);
    this.enhancedConfig = config;
    
    // Initialize Claude service for AI insights
    if (config.claude?.enabled && config.claude.apiKey) {
      this.claudeService = new ClaudeService({
        apiKey: config.claude.apiKey,
        model: 'claude-3-5-sonnet-20241022'
      });
    }

    this.initializeEnhancedTracking();
  }

  /**
   * Initialize enhanced tracking services
   */
  private async initializeEnhancedTracking(): Promise<void> {
    // Check for consent
    this.consentGiven = this.checkConsent();
    
    if (!this.consentGiven) {
      console.log('Analytics consent not given, tracking disabled');
      return;
    }

    // Initialize Google Analytics 4
    if (this.enhancedConfig.googleAnalytics?.enabled) {
      await this.initializeGA4();
    }

    // Initialize Mixpanel
    if (this.enhancedConfig.mixpanel?.enabled) {
      this.initializeMixpanel();
    }

    // Initialize heatmap tracking
    if (this.enhancedConfig.heatmap?.enabled) {
      this.initializeHeatmapTracking();
    }

    // Initialize session recording
    if (this.enhancedConfig.sessionRecording?.enabled) {
      this.initializeSessionRecording();
    }

    // Start AI insights generation
    this.startAIInsightsGeneration();
  }

  /**
   * Initialize Google Analytics 4
   */
  private async initializeGA4(): Promise<void> {
    try {
      const { measurementId } = this.enhancedConfig.googleAnalytics!;
      
      // Load GA4 script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      
      gtag('js', new Date());
      gtag('config', measurementId, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });

      console.log('Google Analytics 4 initialized');
    } catch (error) {
      console.error('Failed to initialize GA4:', error);
    }
  }

  /**
   * Initialize Mixpanel
   */
  private initializeMixpanel(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const { token, config = {} } = this.enhancedConfig.mixpanel!;
        
        mixpanel.init(token, {
          debug: this.enhancedConfig.debugMode,
          track_pageview: true,
          persistence: 'localStorage',
          ...config
        });

        console.log('Mixpanel initialized');
        resolve();
      } catch (error) {
        console.error('Failed to initialize Mixpanel:', error);
        resolve();
      }
    });
  }

  /**
   * Initialize heatmap tracking
   */
  private initializeHeatmapTracking(): void {
    if (Math.random() > this.enhancedConfig.heatmap!.sampleRate) {
      return; // Skip based on sample rate
    }

    // Track clicks
    document.addEventListener('click', (event) => {
      this.recordHeatmapData({
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
        type: 'click',
        element: this.getElementSelector(event.target as Element),
        page: window.location.pathname
      });
    });

    // Track mouse movements (throttled)
    let lastMoveTime = 0;
    document.addEventListener('mousemove', (event) => {
      const now = Date.now();
      if (now - lastMoveTime > 100) { // Throttle to every 100ms
        this.recordHeatmapData({
          x: event.clientX,
          y: event.clientY,
          timestamp: now,
          type: 'move',
          page: window.location.pathname
        });
        lastMoveTime = now;
      }
    });

    // Track scroll events
    document.addEventListener('scroll', () => {
      this.recordHeatmapData({
        x: window.scrollX,
        y: window.scrollY,
        timestamp: Date.now(),
        type: 'scroll',
        page: window.location.pathname
      });
    });
  }

  /**
   * Initialize session recording
   */
  private initializeSessionRecording(): void {
    if (Math.random() > this.enhancedConfig.sessionRecording!.sampleRate) {
      return; // Skip based on sample rate
    }

    this.startSessionRecording();
  }

  /**
   * Start session recording
   */
  private startSessionRecording(): void {
    const sessionId = this.generateId();
    
    this.currentRecording = {
      id: this.generateId(),
      sessionId,
      startTime: Date.now(),
      events: [],
      metadata: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        url: window.location.href
      }
    };

    // Record DOM mutations
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.recordSessionEvent({
          timestamp: Date.now(),
          type: 'dom',
          data: {
            type: mutation.type,
            target: this.getElementSelector(mutation.target as Element),
            addedNodes: mutation.addedNodes.length,
            removedNodes: mutation.removedNodes.length
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true
    });

    // Record user interactions
    ['click', 'input', 'scroll', 'resize'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        this.recordSessionEvent({
          timestamp: Date.now(),
          type: eventType as any,
          data: this.serializeEvent(event)
        });
      });
    });
  }

  /**
   * Enhanced event tracking with multi-platform support
   */
  async track(
    eventName: string,
    properties?: Record<string, any>,
    options?: any
  ): Promise<void> {
    // Call parent track method
    await super.track(eventName, properties, options);

    if (!this.consentGiven) return;

    // Track with Google Analytics 4
    if (this.enhancedConfig.googleAnalytics?.enabled) {
      gtag('event', eventName, {
        ...properties,
        custom_parameter_1: properties?.category,
        custom_parameter_2: properties?.label
      });
    }

    // Track with Mixpanel
    if (this.enhancedConfig.mixpanel?.enabled) {
      mixpanel.track(eventName, properties);
    }
  }

  /**
   * Generate AI insights from collected data
   */
  async generateAIInsights(): Promise<AIInsight[]> {
    if (!this.claudeService) {
      console.warn('Claude service not available for AI insights');
      return [];
    }

    try {
      const analyticsData = await this.getAnalyticsData();
      const heatmapSummary = this.getHeatmapSummary();
      const performanceMetrics = await this.getPerformanceMetrics();

      const prompt = `
Analyze the following portfolio analytics data and provide actionable insights:

Analytics Data:
${JSON.stringify(analyticsData, null, 2)}

Heatmap Summary:
${JSON.stringify(heatmapSummary, null, 2)}

Performance Metrics:
${JSON.stringify(performanceMetrics, null, 2)}

Please provide insights in the following categories:
1. User Behavior Patterns
2. Performance Optimization Opportunities
3. Content Engagement Analysis
4. Conversion Path Optimization

For each insight, provide:
- Title
- Description
- Confidence level (0-1)
- Specific recommendations
- Supporting data

Format the response as JSON with an array of insights.
`;

      const response = await this.claudeService.sendMessage([
        {
          role: 'user',
          content: prompt
        }
      ]);

      const insights = this.parseAIInsights(response.content[0].text);
      this.aiInsights = insights;
      
      return insights;
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      return [];
    }
  }

  /**
   * Get heatmap data
   */
  getHeatmapData(page?: string): HeatmapData[] {
    if (page) {
      return this.heatmapData.filter(data => data.page === page);
    }
    return this.heatmapData;
  }

  /**
   * Get session recordings
   */
  getSessionRecordings(): SessionRecording[] {
    return Array.from(this.sessionRecordings.values());
  }

  /**
   * Get AI insights
   */
  getAIInsights(): AIInsight[] {
    return this.aiInsights;
  }

  /**
   * Set user consent for tracking
   */
  setConsent(consent: boolean): void {
    this.consentGiven = consent;
    localStorage.setItem('analytics_consent', consent.toString());
    
    if (consent) {
      this.initializeEnhancedTracking();
    } else {
      this.disableTracking();
    }
  }

  // Private helper methods
  private checkConsent(): boolean {
    const consent = localStorage.getItem('analytics_consent');
    return consent === 'true';
  }

  private recordHeatmapData(data: HeatmapData): void {
    this.heatmapData.push(data);
    
    // Limit stored data
    if (this.heatmapData.length > 10000) {
      this.heatmapData = this.heatmapData.slice(-5000);
    }
  }

  private recordSessionEvent(event: SessionEvent): void {
    if (this.currentRecording) {
      this.currentRecording.events.push(event);
    }
  }

  private getElementSelector(element: Element): string {
    if (!element) return '';
    
    let selector = element.tagName.toLowerCase();
    if (element.id) {
      selector += `#${element.id}`;
    }
    if (element.className) {
      selector += `.${element.className.split(' ').join('.')}`;
    }
    return selector;
  }

  private serializeEvent(event: Event): any {
    const { maskSensitiveData } = this.enhancedConfig.sessionRecording!;
    
    const serialized: any = {
      type: event.type,
      timestamp: Date.now()
    };

    if (event instanceof MouseEvent) {
      serialized.clientX = event.clientX;
      serialized.clientY = event.clientY;
      serialized.target = this.getElementSelector(event.target as Element);
    }

    if (event instanceof KeyboardEvent && !maskSensitiveData) {
      serialized.key = event.key;
      serialized.code = event.code;
    }

    return serialized;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getAnalyticsData(): Promise<any> {
    // Aggregate analytics data from various sources
    return {
      pageViews: await this.getPageViews(),
      userSessions: await this.getUserSessions(),
      events: await this.getEvents(),
      performance: await this.getPerformanceMetrics()
    };
  }

  private getHeatmapSummary(): any {
    const clickData = this.heatmapData.filter(d => d.type === 'click');
    const scrollData = this.heatmapData.filter(d => d.type === 'scroll');
    
    return {
      totalClicks: clickData.length,
      totalScrollEvents: scrollData.length,
      mostClickedElements: this.getMostClickedElements(clickData),
      averageScrollDepth: this.getAverageScrollDepth(scrollData)
    };
  }

  private getMostClickedElements(clickData: HeatmapData[]): any[] {
    const elementCounts = clickData.reduce((acc, data) => {
      if (data.element) {
        acc[data.element] = (acc[data.element] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(elementCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([element, count]) => ({ element, count }));
  }

  private getAverageScrollDepth(scrollData: HeatmapData[]): number {
    if (scrollData.length === 0) return 0;
    
    const totalDepth = scrollData.reduce((sum, data) => sum + data.y, 0);
    return totalDepth / scrollData.length;
  }

  private parseAIInsights(response: string): AIInsight[] {
    try {
      const parsed = JSON.parse(response);
      return parsed.insights || parsed || [];
    } catch (error) {
      console.error('Failed to parse AI insights:', error);
      return [];
    }
  }

  private startAIInsightsGeneration(): void {
    // Generate insights every hour
    setInterval(() => {
      this.generateAIInsights();
    }, 60 * 60 * 1000);
  }

  private disableTracking(): void {
    // Clear stored data and disable tracking
    this.heatmapData = [];
    this.sessionRecordings.clear();
    this.currentRecording = undefined;
  }
}

// Global type declarations
declare global {
  interface Window {
    dataLayer: any[];
  }
}