import { AnalyticsService } from './AnalyticsService';
import { EnhancedAnalyticsConfig } from './types';

/**
 * User Behavior Insights Service
 * Provides heatmap tracking, session recording, and A/B testing capabilities
 */
export interface UserBehaviorConfig extends EnhancedAnalyticsConfig {
  heatmapConfig: {
    enabled: boolean;
    sampleRate: number; // Percentage of sessions to track
    trackClicks: boolean;
    trackMoves: boolean;
    trackScrolls: boolean;
  };
  sessionRecordingConfig: {
    enabled: boolean;
    sampleRate: number;
    maxDuration: number; // Maximum recording duration in ms
    maskSensitiveData: boolean;
  };
  abTestingConfig: {
    enabled: boolean;
    defaultVariant: string;
    trafficAllocation: Record<string, number>; // variant -> percentage
  };
}

export interface HeatmapData {
  sessionId: string;
  url: string;
  timestamp: Date;
  events: Array<{
    type: 'click' | 'move' | 'scroll';
    x: number;
    y: number;
    timestamp: number;
    element?: string;
    elementText?: string;
  }>;
  viewport: {
    width: number;
    height: number;
  };
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

export interface SessionRecording {
  sessionId: string;
  url: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  events: Array<{
    type: 'dom' | 'input' | 'click' | 'scroll' | 'resize' | 'navigation';
    timestamp: number;
    data: any;
  }>;
  metadata: {
    userAgent: string;
    viewport: { width: number; height: number };
    deviceType: 'desktop' | 'mobile' | 'tablet';
    referrer?: string;
  };
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  trafficAllocation: number; // Percentage
  isControl: boolean;
  config: Record<string, any>;
  metrics: {
    participants: number;
    conversions: number;
    conversionRate: number;
    averageTimeOnPage: number;
    bounceRate: number;
  };
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
  targetUrl: string;
  variants: ABTestVariant[];
  goals: Array<{
    id: string;
    name: string;
    type: 'click' | 'pageview' | 'custom';
    selector?: string;
    value?: string;
  }>;
  results?: {
    winner?: string;
    confidence: number;
    significance: number;
    recommendations: string[];
  };
}

export interface UserJourney {
  sessionId: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  pages: Array<{
    url: string;
    title: string;
    entryTime: Date;
    exitTime?: Date;
    timeSpent: number;
    interactions: number;
    scrollDepth: number;
  }>;
  conversions: Array<{
    type: string;
    timestamp: Date;
    value?: number;
    metadata?: Record<string, any>;
  }>;
  dropOffPoint?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  trafficSource: string;
  campaign?: string;
}

export interface FunnelAnalysis {
  funnelId: string;
  name: string;
  steps: Array<{
    id: string;
    name: string;
    url?: string;
    selector?: string;
    visitors: number;
    conversionRate: number;
    dropOffRate: number;
    averageTimeToNext: number;
  }>;
  totalVisitors: number;
  totalConversions: number;
  overallConversionRate: number;
  dropOffPoints: Array<{
    step: string;
    dropOffRate: number;
    reasons: string[];
  }>;
}

export class UserBehaviorInsights extends AnalyticsService {
  declare protected config: UserBehaviorConfig;
  private heatmapData: Map<string, HeatmapData> = new Map();
  private sessionRecordings: Map<string, SessionRecording> = new Map();
  private abTests: Map<string, ABTest> = new Map();
  private userJourneys: Map<string, UserJourney> = new Map();
  private currentRecording: SessionRecording | null = null;
  private currentHeatmap: HeatmapData | null = null;
  private mutationObserver: MutationObserver | null = null;
  private isTracking: boolean = false;

  constructor(config: UserBehaviorConfig) {
    super(config);
    this.config = {
      heatmapConfig: {
        enabled: true,
        sampleRate: 10, // 10% of sessions
        trackClicks: true,
        trackMoves: true,
        trackScrolls: true
      },
      sessionRecordingConfig: {
        enabled: true,
        sampleRate: 5, // 5% of sessions
        maxDuration: 600000, // 10 minutes
        maskSensitiveData: true
      },
      abTestingConfig: {
        enabled: true,
        defaultVariant: 'control',
        trafficAllocation: { control: 50, variant_a: 50 }
      },
      ...config
    };
    
    this.initializeUserBehaviorTracking();
  }

  /**
   * Initialize user behavior tracking
   */
  private async initializeUserBehaviorTracking(): Promise<void> {
    try {
      // Initialize heatmap tracking
      if (this.config.heatmapConfig.enabled && this.shouldTrackSession(this.config.heatmapConfig.sampleRate)) {
        this.initializeHeatmapTracking();
      }
      
      // Initialize session recording
      if (this.config.sessionRecordingConfig.enabled && this.shouldTrackSession(this.config.sessionRecordingConfig.sampleRate)) {
        this.initializeSessionRecording();
      }
      
      // Initialize A/B testing
      if (this.config.abTestingConfig.enabled) {
        this.initializeABTesting();
      }
      
      // Initialize user journey tracking
      this.initializeUserJourneyTracking();
      
      this.isTracking = true;
      
      await this.track('user_behavior_tracking_started', {
        config: this.config,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('Failed to initialize user behavior tracking:', error);
    }
  }

  /**
   * Initialize heatmap tracking
   */
  private initializeHeatmapTracking(): void {
    const sessionId = this.generateBehaviorSessionId();
    
    this.currentHeatmap = {
      sessionId,
      url: window.location.href,
      timestamp: new Date(),
      events: [],
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      deviceType: this.getDeviceType()
    };

    // Track clicks
    if (this.config.heatmapConfig.trackClicks) {
      document.addEventListener('click', (event) => {
        this.recordHeatmapEvent('click', event);
      });
    }

    // Track mouse movements (throttled)
    if (this.config.heatmapConfig.trackMoves) {
      let lastMoveTime = 0;
      document.addEventListener('mousemove', (event) => {
        const now = Date.now();
        if (now - lastMoveTime > 100) { // Throttle to every 100ms
          this.recordHeatmapEvent('move', event);
          lastMoveTime = now;
        }
      });
    }

    // Track scrolling
    if (this.config.heatmapConfig.trackScrolls) {
      let lastScrollTime = 0;
      window.addEventListener('scroll', (event) => {
        const now = Date.now();
        if (now - lastScrollTime > 200) { // Throttle to every 200ms
          this.recordHeatmapEvent('scroll', event as any);
          lastScrollTime = now;
        }
      });
    }

    // Send heatmap data periodically
    setInterval(() => {
      this.flushHeatmapData();
    }, 30000); // Every 30 seconds
  }

  /**
   * Record heatmap event
   */
  private recordHeatmapEvent(type: 'click' | 'move' | 'scroll', event: MouseEvent | Event): void {
    if (!this.currentHeatmap) return;

    let x = 0, y = 0;
    let element: string | undefined;
    let elementText: string | undefined;

    if (type === 'scroll') {
      x = window.scrollX;
      y = window.scrollY;
    } else if (event instanceof MouseEvent) {
      x = event.clientX;
      y = event.clientY;
      
      const target = event.target as HTMLElement;
      if (target) {
        element = this.getElementSelector(target);
        elementText = target.textContent?.slice(0, 50);
      }
    }

    this.currentHeatmap.events.push({
      type,
      x,
      y,
      timestamp: Date.now(),
      element,
      elementText
    });
  }

  /**
   * Initialize session recording
   */
  private initializeSessionRecording(): void {
    const sessionId = this.generateBehaviorSessionId();
    
    this.currentRecording = {
      sessionId,
      url: window.location.href,
      startTime: new Date(),
      duration: 0,
      events: [],
      metadata: {
        userAgent: navigator.userAgent,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        deviceType: this.getDeviceType(),
        referrer: document.referrer
      }
    };

    // Record DOM mutations
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.recordSessionEvent('dom', {
          type: mutation.type,
          target: this.getElementSelector(mutation.target as HTMLElement),
          addedNodes: Array.from(mutation.addedNodes).map(node => 
            node.nodeType === Node.ELEMENT_NODE ? this.getElementSelector(node as HTMLElement) : node.textContent
          ),
          removedNodes: Array.from(mutation.removedNodes).map(node => 
            node.nodeType === Node.ELEMENT_NODE ? this.getElementSelector(node as HTMLElement) : node.textContent
          )
        });
      });
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true
    });

    // Record user interactions
    ['click', 'input', 'scroll', 'resize'].forEach(eventType => {
      window.addEventListener(eventType, (event) => {
        this.recordSessionEvent(eventType as any, this.serializeEvent(event));
      });
    });

    // Stop recording after max duration
    setTimeout(() => {
      this.stopSessionRecording();
    }, this.config.sessionRecordingConfig.maxDuration);
  }

  /**
   * Record session event
   */
  private recordSessionEvent(type: SessionRecording['events'][0]['type'], data: any): void {
    if (!this.currentRecording) return;

    this.currentRecording.events.push({
      type,
      timestamp: Date.now(),
      data: this.config.sessionRecordingConfig.maskSensitiveData ? this.maskSensitiveData(data) : data
    });
  }

  /**
   * Initialize A/B testing
   */
  private initializeABTesting(): void {
    // Load active A/B tests
    this.loadActiveABTests();
    
    // Assign user to variants
    this.assignUserToVariants();
  }

  /**
   * Initialize user journey tracking
   */
  private initializeUserJourneyTracking(): void {
    const sessionId = this.generateBehaviorSessionId();
    
    const journey: UserJourney = {
      sessionId,
      startTime: new Date(),
      pages: [{
        url: window.location.href,
        title: document.title,
        entryTime: new Date(),
        timeSpent: 0,
        interactions: 0,
        scrollDepth: 0
      }],
      conversions: [],
      deviceType: this.getDeviceType(),
      trafficSource: this.getTrafficSource()
    };

    this.userJourneys.set(sessionId, journey);

    // Track page changes
    window.addEventListener('popstate', () => {
      this.trackPageChange();
    });

    // Track interactions
    document.addEventListener('click', () => {
      this.incrementInteractions(sessionId);
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        this.updateScrollDepth(sessionId, scrollDepth);
      }
    });
  }

  /**
   * Track page change
   */
  private trackPageChange(): void {
    // Implementation for tracking page changes
    const currentJourney = Array.from(this.userJourneys.values()).find(j => !j.endTime);
    if (currentJourney) {
      const currentPage = currentJourney.pages[currentJourney.pages.length - 1];
      currentPage.exitTime = new Date();
      currentPage.timeSpent = currentPage.exitTime.getTime() - currentPage.entryTime.getTime();
      
      // Add new page
      currentJourney.pages.push({
        url: window.location.href,
        title: document.title,
        entryTime: new Date(),
        timeSpent: 0,
        interactions: 0,
        scrollDepth: 0
      });
    }
  }

  /**
   * Increment interactions for a session
   */
  private incrementInteractions(sessionId: string): void {
    const journey = this.userJourneys.get(sessionId);
    if (journey && journey.pages.length > 0) {
      journey.pages[journey.pages.length - 1].interactions++;
    }
  }

  /**
   * Update scroll depth for a session
   */
  private updateScrollDepth(sessionId: string, depth: number): void {
    const journey = this.userJourneys.get(sessionId);
    if (journey && journey.pages.length > 0) {
      journey.pages[journey.pages.length - 1].scrollDepth = Math.max(
        journey.pages[journey.pages.length - 1].scrollDepth,
        depth
      );
    }
  }

  /**
   * Determine if session should be tracked based on sample rate
   */
  private shouldTrackSession(sampleRate: number): boolean {
    return Math.random() * 100 < sampleRate;
  }

  /**
   * Generate unique session ID
   */
  private generateBehaviorSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get device type
   */
  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Get traffic source
   */
  private getTrafficSource(): string {
    const referrer = document.referrer;
    if (!referrer) return 'direct';
    
    const url = new URL(referrer);
    const domain = url.hostname;
    
    if (domain.includes('google')) return 'google';
    if (domain.includes('facebook')) return 'facebook';
    if (domain.includes('twitter')) return 'twitter';
    if (domain.includes('linkedin')) return 'linkedin';
    
    return 'referral';
  }

  /**
   * Get element selector
   */
  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ').join('.')}`;
    return element.tagName.toLowerCase();
  }

  /**
   * Flush heatmap data
   */
  private async flushHeatmapData(): Promise<void> {
    if (!this.currentHeatmap || this.currentHeatmap.events.length === 0) return;
    
    try {
      await this.track('heatmap_data', this.currentHeatmap);
      this.currentHeatmap.events = []; // Clear events after sending
    } catch (error) {
      console.error('Failed to flush heatmap data:', error);
    }
  }

  /**
   * Stop session recording
   */
  private stopSessionRecording(): void {
    if (!this.currentRecording) return;
    
    this.currentRecording.endTime = new Date();
    this.currentRecording.duration = this.currentRecording.endTime.getTime() - this.currentRecording.startTime.getTime();
    
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    
    this.sessionRecordings.set(this.currentRecording.sessionId, this.currentRecording);
    this.currentRecording = null;
  }

  /**
   * Serialize event for recording
   */
  private serializeEvent(event: Event): any {
    return {
      type: event.type,
      timestamp: Date.now(),
      target: this.getElementSelector(event.target as HTMLElement)
    };
  }

  /**
   * Mask sensitive data
   */
  private maskSensitiveData(data: any): any {
    // Simple implementation - replace with more sophisticated masking
    const sensitiveFields = ['password', 'email', 'phone', 'ssn', 'credit'];
    const masked = { ...data };
    
    for (const field of sensitiveFields) {
      if (masked[field]) {
        masked[field] = '***masked***';
      }
    }
    
    return masked;
  }

  /**
   * Load active A/B tests
   */
  private async loadActiveABTests(): Promise<void> {
    // Implementation would load from server/storage
    console.log('Loading active A/B tests...');
  }

  /**
   * Assign user to variants
   */
  private assignUserToVariants(): void {
    // Implementation would assign user to test variants
    console.log('Assigning user to A/B test variants...');
  }
}