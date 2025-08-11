import { getWebSocketService } from './WebSocketService';

export interface HeatmapPoint {
  x: number;
  y: number;
  elementId: string;
  elementType: string;
  clicks: number;
  timestamp: number;
  page: string;
}

export interface ScrollData {
  maxScroll: number;
  timeToScroll: number;
  scrollEvents: {
    position: number;
    timestamp: number;
  }[];
}

export interface MouseMovement {
  x: number;
  y: number;
  timestamp: number;
}

export interface SessionRecording {
  id: string;
  startTime: number;
  endTime?: number;
  page: string;
  userAgent: string;
  viewport: { width: number; height: number };
  events: SessionEvent[];
  heatmapData: HeatmapPoint[];
  scrollData: ScrollData;
  mouseMovements: MouseMovement[];
  duration: number;
}

export interface SessionEvent {
  type: 'click' | 'scroll' | 'mousemove' | 'keypress' | 'focus' | 'blur' | 'resize';
  timestamp: number;
  target?: string;
  data?: any;
}

export interface UserJourney {
  sessionId: string;
  pages: {
    path: string;
    title: string;
    timestamp: number;
    timeSpent: number;
    interactions: number;
    exitType: 'navigation' | 'close' | 'timeout';
  }[];
  totalDuration: number;
  conversionEvents: {
    type: string;
    timestamp: number;
    value: number;
  }[];
}

export interface ABTestVariant {
  id: string;
  name: string;
  traffic: number; // Percentage of traffic (0-100)
  active: boolean;
  config: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  variants: ABTestVariant[];
  metrics: string[];
  active: boolean;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  metric: string;
  value: number;
  timestamp: number;
  sessionId: string;
}

class UserBehaviorService {
  private isTracking = false;
  private currentSession: SessionRecording | null = null;
  private heatmapData: Map<string, HeatmapPoint[]> = new Map();
  private sessions: SessionRecording[] = [];
  private userJourneys: Map<string, UserJourney> = new Map();
  private abTests: Map<string, ABTest> = new Map();
  private abTestResults: ABTestResult[] = [];
  private webSocketService = getWebSocketService();
  private eventListeners: (() => void)[] = [];
  private mouseMovements: MouseMovement[] = [];
  private scrollData: ScrollData = {
    maxScroll: 0,
    timeToScroll: 0,
    scrollEvents: []
  };

  async initialize(): Promise<void> {
    if (this.isTracking) return;

    try {
      this.loadStoredData();
      this.setupEventListeners();
      this.startSession();
      this.isTracking = true;
      
      console.log('User behavior tracking initialized');
    } catch (error) {
      console.error('Failed to initialize user behavior tracking:', error);
      throw error;
    }
  }

  private loadStoredData(): void {
    // Load heatmap data
    const storedHeatmap = localStorage.getItem('user_behavior_heatmap');
    if (storedHeatmap) {
      try {
        const data = JSON.parse(storedHeatmap);
        Object.entries(data).forEach(([page, points]) => {
          this.heatmapData.set(page, points as HeatmapPoint[]);
        });
      } catch (error) {
        console.error('Failed to load heatmap data:', error);
      }
    }

    // Load A/B tests
    const storedTests = localStorage.getItem('user_behavior_ab_tests');
    if (storedTests) {
      try {
        const tests = JSON.parse(storedTests);
        Object.entries(tests).forEach(([id, test]) => {
          this.abTests.set(id, test as ABTest);
        });
      } catch (error) {
        console.error('Failed to load A/B tests:', error);
      }
    }
  }

  private setupEventListeners(): void {
    // Click tracking
    const clickHandler = (event: MouseEvent) => {
      this.trackClick(event);
    };
    document.addEventListener('click', clickHandler, true);
    this.eventListeners.push(() => document.removeEventListener('click', clickHandler, true));

    // Mouse movement tracking (throttled)
    let lastMouseMove = 0;
    const mouseMoveHandler = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseMove > 100) { // Throttle to every 100ms
        this.trackMouseMovement(event);
        lastMouseMove = now;
      }
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    this.eventListeners.push(() => document.removeEventListener('mousemove', mouseMoveHandler));

    // Scroll tracking
    let lastScroll = 0;
    const scrollHandler = () => {
      const now = Date.now();
      if (now - lastScroll > 250) { // Throttle to every 250ms
        this.trackScroll();
        lastScroll = now;
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    this.eventListeners.push(() => window.removeEventListener('scroll', scrollHandler));

    // Focus/blur tracking
    const focusHandler = (event: FocusEvent) => {
      this.trackEvent('focus', event.target as Element);
    };
    const blurHandler = (event: FocusEvent) => {
      this.trackEvent('blur', event.target as Element);
    };
    document.addEventListener('focus', focusHandler, true);
    document.addEventListener('blur', blurHandler, true);
    this.eventListeners.push(() => {
      document.removeEventListener('focus', focusHandler, true);
      document.removeEventListener('blur', blurHandler, true);
    });

    // Keyboard tracking
    const keyHandler = (event: KeyboardEvent) => {
      this.trackEvent('keypress', event.target as Element, {
        key: event.key,
        code: event.code,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey
      });
    };
    document.addEventListener('keydown', keyHandler);
    this.eventListeners.push(() => document.removeEventListener('keydown', keyHandler));

    // Resize tracking
    const resizeHandler = () => {
      this.trackEvent('resize', null, {
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', resizeHandler);
    this.eventListeners.push(() => window.removeEventListener('resize', resizeHandler));

    // Page visibility changes
    const visibilityHandler = () => {
      if (document.hidden) {
        this.pauseSession();
      } else {
        this.resumeSession();
      }
    };
    document.addEventListener('visibilitychange', visibilityHandler);
    this.eventListeners.push(() => document.removeEventListener('visibilitychange', visibilityHandler));

    // Before unload
    const beforeUnloadHandler = () => {
      this.endSession('close');
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
    this.eventListeners.push(() => window.removeEventListener('beforeunload', beforeUnloadHandler));
  }

  private startSession(): void {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentSession = {
      id: sessionId,
      startTime: Date.now(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      events: [],
      heatmapData: [],
      scrollData: {
        maxScroll: 0,
        timeToScroll: 0,
        scrollEvents: []
      },
      mouseMovements: [],
      duration: 0
    };

    // Initialize user journey
    this.userJourneys.set(sessionId, {
      sessionId,
      pages: [{
        path: window.location.pathname,
        title: document.title,
        timestamp: Date.now(),
        timeSpent: 0,
        interactions: 0,
        exitType: 'navigation'
      }],
      totalDuration: 0,
      conversionEvents: []
    });

    console.log('Started user behavior session:', sessionId);
  }

  private trackClick(event: MouseEvent): void {
    if (!this.currentSession) return;

    const target = event.target as Element;
    const elementId = this.getElementIdentifier(target);
    const rect = target.getBoundingClientRect();
    
    // Track click event
    this.trackEvent('click', target, {
      x: event.clientX,
      y: event.clientY,
      button: event.button,
      elementRect: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      }
    });

    // Update heatmap data
    const page = window.location.pathname;
    const pageHeatmap = this.heatmapData.get(page) || [];
    
    const existingPoint = pageHeatmap.find(point => 
      Math.abs(point.x - event.clientX) < 10 && 
      Math.abs(point.y - event.clientY) < 10 &&
      point.elementId === elementId
    );

    if (existingPoint) {
      existingPoint.clicks++;
      existingPoint.timestamp = Date.now();
    } else {
      const newPoint: HeatmapPoint = {
        x: event.clientX,
        y: event.clientY,
        elementId,
        elementType: target.tagName.toLowerCase(),
        clicks: 1,
        timestamp: Date.now(),
        page
      };
      pageHeatmap.push(newPoint);
      this.currentSession.heatmapData.push(newPoint);
    }

    this.heatmapData.set(page, pageHeatmap);
    this.saveHeatmapData();

    // Update user journey
    const journey = this.userJourneys.get(this.currentSession.id);
    if (journey && journey.pages.length > 0) {
      journey.pages[journey.pages.length - 1].interactions++;
    }
  }

  private trackMouseMovement(event: MouseEvent): void {
    if (!this.currentSession) return;

    const movement: MouseMovement = {
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now()
    };

    this.mouseMovements.push(movement);
    this.currentSession.mouseMovements.push(movement);

    // Keep only last 1000 movements to prevent memory issues
    if (this.mouseMovements.length > 1000) {
      this.mouseMovements = this.mouseMovements.slice(-1000);
    }
    if (this.currentSession.mouseMovements.length > 1000) {
      this.currentSession.mouseMovements = this.currentSession.mouseMovements.slice(-1000);
    }
  }

  private trackScroll(): void {
    if (!this.currentSession) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

    const scrollEvent = {
      position: scrollPercentage,
      timestamp: Date.now()
    };

    this.scrollData.scrollEvents.push(scrollEvent);
    this.currentSession.scrollData.scrollEvents.push(scrollEvent);

    // Update max scroll
    if (scrollPercentage > this.scrollData.maxScroll) {
      this.scrollData.maxScroll = scrollPercentage;
      this.currentSession.scrollData.maxScroll = scrollPercentage;
      
      // Track time to reach certain scroll milestones
      if (scrollPercentage >= 50 && this.scrollData.timeToScroll === 0) {
        this.scrollData.timeToScroll = Date.now() - this.currentSession.startTime;
        this.currentSession.scrollData.timeToScroll = this.scrollData.timeToScroll;
      }
    }

    this.trackEvent('scroll', null, {
      scrollTop,
      scrollPercentage,
      maxScroll: this.scrollData.maxScroll
    });
  }

  private trackEvent(type: SessionEvent['type'], target: Element | null, data?: any): void {
    if (!this.currentSession) return;

    const event: SessionEvent = {
      type,
      timestamp: Date.now(),
      target: target ? this.getElementIdentifier(target) : undefined,
      data
    };

    this.currentSession.events.push(event);
  }

  private getElementIdentifier(element: Element): string {
    // Create a unique identifier for the element
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim()).slice(0, 3);
      if (classes.length > 0) {
        return `.${classes.join('.')}`;
      }
    }
    
    // Use tag name and position as fallback
    const siblings = Array.from(element.parentElement?.children || []);
    const index = siblings.indexOf(element);
    return `${element.tagName.toLowerCase()}:nth-child(${index + 1})`;
  }

  private pauseSession(): void {
    if (!this.currentSession) return;
    
    this.currentSession.duration = Date.now() - this.currentSession.startTime;
    console.log('Session paused');
  }

  private resumeSession(): void {
    if (!this.currentSession) return;
    
    console.log('Session resumed');
  }

  endSession(exitType: 'navigation' | 'close' | 'timeout' = 'close'): void {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();
    this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;

    // Update user journey
    const journey = this.userJourneys.get(this.currentSession.id);
    if (journey && journey.pages.length > 0) {
      const lastPage = journey.pages[journey.pages.length - 1];
      lastPage.timeSpent = Date.now() - lastPage.timestamp;
      lastPage.exitType = exitType;
      journey.totalDuration = this.currentSession.duration;
    }

    // Store session
    this.sessions.push({ ...this.currentSession });
    
    // Keep only last 50 sessions
    if (this.sessions.length > 50) {
      this.sessions = this.sessions.slice(-50);
    }

    this.saveSessionData();
    console.log('Session ended:', this.currentSession.id);
    
    this.currentSession = null;
  }

  // A/B Testing methods
  createABTest(test: Omit<ABTest, 'id'>): string {
    const id = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const abTest: ABTest = {
      ...test,
      id
    };
    
    this.abTests.set(id, abTest);
    this.saveABTests();
    
    return id;
  }

  getActiveABTests(): ABTest[] {
    return Array.from(this.abTests.values()).filter(test => test.active);
  }

  assignUserToVariant(testId: string): ABTestVariant | null {
    const test = this.abTests.get(testId);
    if (!test || !test.active) return null;

    // Simple random assignment based on traffic allocation
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const variant of test.variants) {
      cumulative += variant.traffic;
      if (random <= cumulative && variant.active) {
        return variant;
      }
    }
    
    return null;
  }

  trackABTestResult(testId: string, variantId: string, metric: string, value: number): void {
    if (!this.currentSession) return;

    const result: ABTestResult = {
      testId,
      variantId,
      metric,
      value,
      timestamp: Date.now(),
      sessionId: this.currentSession.id
    };

    this.abTestResults.push(result);
    
    // Keep only last 1000 results
    if (this.abTestResults.length > 1000) {
      this.abTestResults = this.abTestResults.slice(-1000);
    }

    this.saveABTestResults();
  }

  getABTestResults(testId: string): ABTestResult[] {
    return this.abTestResults.filter(result => result.testId === testId);
  }

  // Data access methods
  getHeatmapData(page?: string): HeatmapPoint[] {
    if (page) {
      return this.heatmapData.get(page) || [];
    }
    
    // Return all heatmap data
    const allData: HeatmapPoint[] = [];
    this.heatmapData.forEach(pageData => {
      allData.push(...pageData);
    });
    return allData;
  }

  getCurrentSession(): SessionRecording | null {
    return this.currentSession;
  }

  getSessions(): SessionRecording[] {
    return [...this.sessions];
  }

  getUserJourneys(): UserJourney[] {
    return Array.from(this.userJourneys.values());
  }

  getMouseMovements(): MouseMovement[] {
    return [...this.mouseMovements];
  }

  getScrollData(): ScrollData {
    return { ...this.scrollData };
  }

  // Data persistence
  private saveHeatmapData(): void {
    const data: Record<string, HeatmapPoint[]> = {};
    this.heatmapData.forEach((points, page) => {
      data[page] = points;
    });
    localStorage.setItem('user_behavior_heatmap', JSON.stringify(data));
  }

  private saveSessionData(): void {
    localStorage.setItem('user_behavior_sessions', JSON.stringify(this.sessions.slice(-10))); // Keep last 10
  }

  private saveABTests(): void {
    const data: Record<string, ABTest> = {};
    this.abTests.forEach((test, id) => {
      data[id] = test;
    });
    localStorage.setItem('user_behavior_ab_tests', JSON.stringify(data));
  }

  private saveABTestResults(): void {
    localStorage.setItem('user_behavior_ab_results', JSON.stringify(this.abTestResults.slice(-500))); // Keep last 500
  }

  // Export methods
  exportHeatmapData(format: 'json' | 'csv'): string {
    const allData = this.getHeatmapData();
    
    if (format === 'json') {
      return JSON.stringify(allData, null, 2);
    }
    
    // CSV format
    const headers = ['page', 'x', 'y', 'elementId', 'elementType', 'clicks', 'timestamp'];
    const rows = allData.map(point => [
      point.page,
      point.x,
      point.y,
      point.elementId,
      point.elementType,
      point.clicks,
      new Date(point.timestamp).toISOString()
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  exportSessionData(format: 'json' | 'csv'): string {
    if (format === 'json') {
      return JSON.stringify(this.sessions, null, 2);
    }
    
    // CSV format for session summary
    const headers = ['sessionId', 'startTime', 'endTime', 'duration', 'page', 'eventCount', 'maxScroll'];
    const rows = this.sessions.map(session => [
      session.id,
      new Date(session.startTime).toISOString(),
      session.endTime ? new Date(session.endTime).toISOString() : '',
      session.duration,
      session.page,
      session.events.length,
      session.scrollData.maxScroll
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  clearData(): void {
    this.heatmapData.clear();
    this.sessions = [];
    this.userJourneys.clear();
    this.mouseMovements = [];
    this.scrollData = {
      maxScroll: 0,
      timeToScroll: 0,
      scrollEvents: []
    };
    
    localStorage.removeItem('user_behavior_heatmap');
    localStorage.removeItem('user_behavior_sessions');
    localStorage.removeItem('user_behavior_ab_tests');
    localStorage.removeItem('user_behavior_ab_results');
  }

  destroy(): void {
    this.isTracking = false;
    
    // End current session
    if (this.currentSession) {
      this.endSession('close');
    }
    
    // Remove event listeners
    this.eventListeners.forEach(removeListener => removeListener());
    this.eventListeners = [];
    
    console.log('User behavior tracking destroyed');
  }
}

export default UserBehaviorService;