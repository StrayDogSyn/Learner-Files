import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'click' | 'interaction' | 'performance' | 'error' | 'custom';
  timestamp: number;
  data: Record<string, any>;
  sessionId: string;
  userId?: string;
}

export interface SessionData {
  id: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  interactions: number;
  duration: number;
  userAgent: string;
  referrer: string;
  viewport: {
    width: number;
    height: number;
  };
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

export interface UserInteraction {
  element: string;
  action: string;
  timestamp: number;
  coordinates?: { x: number; y: number };
  metadata?: Record<string, any>;
}

const STORAGE_KEYS = {
  EVENTS: 'portfolio_analytics_events',
  SESSION: 'portfolio_analytics_session',
  USER_PREFERENCES: 'portfolio_user_preferences',
  PERFORMANCE: 'portfolio_performance_metrics'
};

const MAX_EVENTS = 1000; // Limit stored events for performance
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useAnalytics = () => {
  const location = useLocation();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isTracking, setIsTracking] = useState(true);
  const sessionTimeoutRef = useRef<NodeJS.Timeout>();
  const performanceObserverRef = useRef<PerformanceObserver>();

  // Generate unique IDs
  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Initialize or resume session
  const initializeSession = useCallback(() => {
    const existingSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    const now = Date.now();
    
    let session: SessionData;
    
    if (existingSession) {
      const parsed = JSON.parse(existingSession);
      // Check if session is still valid (not timed out)
      if (now - parsed.startTime < SESSION_TIMEOUT) {
        session = {
          ...parsed,
          duration: now - parsed.startTime
        };
      } else {
        // Create new session
        session = createNewSession(now);
      }
    } else {
      session = createNewSession(now);
    }
    
    setSessionData(session);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    return session;
  }, []);

  const createNewSession = (timestamp: number): SessionData => {
    return {
      id: generateId(),
      startTime: timestamp,
      pageViews: 0,
      interactions: 0,
      duration: 0,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  };

  // Track events
  const trackEvent = useCallback((type: AnalyticsEvent['type'], data: Record<string, any>) => {
    if (!isTracking || !sessionData) return;

    const event: AnalyticsEvent = {
      id: generateId(),
      type,
      timestamp: Date.now(),
      data,
      sessionId: sessionData.id
    };

    setEvents(prev => {
      const newEvents = [...prev, event].slice(-MAX_EVENTS);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(newEvents));
      return newEvents;
    });

    // Update session data
    const updatedSession = {
      ...sessionData,
      duration: Date.now() - sessionData.startTime,
      interactions: sessionData.interactions + 1
    };
    
    setSessionData(updatedSession);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedSession));
  }, [isTracking, sessionData, generateId]);

  // Track page views
  const trackPageView = useCallback((path: string, title?: string) => {
    trackEvent('page_view', {
      path,
      title: title || document.title,
      referrer: document.referrer,
      timestamp: Date.now()
    });

    if (sessionData) {
      const updatedSession = {
        ...sessionData,
        pageViews: sessionData.pageViews + 1
      };
      setSessionData(updatedSession);
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedSession));
    }
  }, [trackEvent, sessionData]);

  // Track user interactions
  const trackInteraction = useCallback((element: string, action: string, metadata?: Record<string, any>) => {
    trackEvent('interaction', {
      element,
      action,
      metadata,
      path: location.pathname
    });
  }, [trackEvent, location.pathname]);

  // Track performance metrics
  const trackPerformance = useCallback((metrics: Partial<PerformanceMetrics>) => {
    trackEvent('performance', {
      ...metrics,
      path: location.pathname,
      userAgent: navigator.userAgent
    });

    // Store latest performance metrics
    const existingMetrics = localStorage.getItem(STORAGE_KEYS.PERFORMANCE);
    const allMetrics = existingMetrics ? JSON.parse(existingMetrics) : [];
    allMetrics.push({
      ...metrics,
      timestamp: Date.now(),
      path: location.pathname
    });
    
    // Keep only last 50 performance entries
    const limitedMetrics = allMetrics.slice(-50);
    localStorage.setItem(STORAGE_KEYS.PERFORMANCE, JSON.stringify(limitedMetrics));
  }, [trackEvent, location.pathname]);

  // Track errors
  const trackError = useCallback((error: Error, context?: string) => {
    trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
      path: location.pathname,
      userAgent: navigator.userAgent
    });
  }, [trackEvent, location.pathname]);

  // Get analytics data
  const getAnalyticsData = useCallback(() => {
    return {
      session: sessionData,
      events,
      totalEvents: events.length,
      eventsByType: events.reduce((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [sessionData, events]);

  // Clear analytics data
  const clearAnalyticsData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.PERFORMANCE);
    setEvents([]);
    setSessionData(null);
  }, []);

  // Toggle tracking
  const toggleTracking = useCallback((enabled: boolean) => {
    setIsTracking(enabled);
    localStorage.setItem('analytics_enabled', enabled.toString());
  }, []);

  // Initialize analytics
  useEffect(() => {
    // Check if analytics is enabled
    const analyticsEnabled = localStorage.getItem('analytics_enabled');
    if (analyticsEnabled === 'false') {
      setIsTracking(false);
      return;
    }

    // Load existing events
    const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }

    // Initialize session
    initializeSession();

    // Set up performance observer
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            trackPerformance({
              pageLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
              firstContentfulPaint: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
      performanceObserverRef.current = observer;
    }

    // Set up session timeout
    sessionTimeoutRef.current = setTimeout(() => {
      if (sessionData) {
        const endedSession = {
          ...sessionData,
          endTime: Date.now(),
          duration: Date.now() - sessionData.startTime
        };
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(endedSession));
      }
    }, SESSION_TIMEOUT);

    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
    };
  }, [initializeSession, trackPerformance]);

  // Track page changes
  useEffect(() => {
    if (isTracking) {
      trackPageView(location.pathname);
    }
  }, [location.pathname, trackPageView, isTracking]);

  // Set up global error tracking
  useEffect(() => {
    if (!isTracking) return;

    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), 'global_error_handler');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(event.reason), 'unhandled_promise_rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [isTracking, trackError]);

  return {
    // State
    sessionData,
    events,
    isTracking,
    
    // Actions
    trackEvent,
    trackPageView,
    trackInteraction,
    trackPerformance,
    trackError,
    
    // Utilities
    getAnalyticsData,
    clearAnalyticsData,
    toggleTracking
  };
};

export default useAnalytics;