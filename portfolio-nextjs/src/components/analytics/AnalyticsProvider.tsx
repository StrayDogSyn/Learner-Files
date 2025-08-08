'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import usePerformanceMonitoring from '@/hooks/usePerformanceMonitoring';

interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'click' | 'form_submit' | 'download' | 'scroll' | 'custom';
  element?: string;
  page: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

interface UserSession {
  id: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: AnalyticsEvent[];
  userAgent: string;
  referrer: string;
  viewport: { width: number; height: number };
}

interface AnalyticsContextType {
  trackEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId' | 'page'>) => void;
  trackPageView: (page: string) => void;
  trackClick: (element: string, metadata?: Record<string, unknown>) => void;
  trackFormSubmit: (formName: string, success: boolean) => void;
  trackDownload: (fileName: string, fileType: string) => void;
  trackScroll: (percentage: number) => void;
  getSessionData: () => UserSession | null;
  getAnalytics: () => {
    totalEvents: number;
    uniquePages: number;
    averageSessionTime: number;
    topEvents: Array<{ type: string; count: number }>;
    performanceMetrics: Record<string, number>;
  };
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  enableConsoleLogging?: boolean;
  enableLocalStorage?: boolean;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  enableConsoleLogging = true,
  enableLocalStorage = true
}) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const { metrics } = usePerformanceMonitoring();

  // Initialize session
  useEffect(() => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: UserSession = {
      id: sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: [],
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    setSession(newSession);

    // Load existing session data from localStorage
    if (enableLocalStorage) {
      const existingData = localStorage.getItem('analytics_session');
      if (existingData) {
        try {
          const parsedData = JSON.parse(existingData);
          // Check if session is still valid (less than 30 minutes old)
          if (Date.now() - parsedData.lastActivity < 30 * 60 * 1000) {
            setSession({ ...parsedData, lastActivity: Date.now() });
          }
        } catch (error) {
          console.warn('Failed to parse existing analytics session:', error);
        }
      }
    }
  }, [enableLocalStorage]);

  // Save session to localStorage
  useEffect(() => {
    if (session && enableLocalStorage) {
      localStorage.setItem('analytics_session', JSON.stringify(session));
    }
  }, [session, enableLocalStorage]);

  const trackEvent = useCallback((eventData: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId' | 'page'>) => {
    if (!session) return;

    const event: AnalyticsEvent = {
      ...eventData,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sessionId: session.id,
      page: window.location.pathname
    };

    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        lastActivity: Date.now(),
        events: [...prev.events, event]
      };
    });

    if (enableConsoleLogging) {
      console.log('Analytics Event:', event);
    }

    // Send to analytics service (placeholder)
    // sendToAnalyticsService(event);
  }, [session, enableConsoleLogging]);

  const trackPageView = useCallback((page: string) => {
    trackEvent({ type: 'page_view', element: page });
    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        pageViews: prev.pageViews + 1
      };
    });
  }, [trackEvent]);

  const trackClick = useCallback((element: string, metadata?: Record<string, unknown>) => {
    trackEvent({ type: 'click', element, metadata });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, success: boolean) => {
    trackEvent({ 
      type: 'form_submit', 
      element: formName, 
      metadata: { success } 
    });
  }, [trackEvent]);

  const trackDownload = useCallback((fileName: string, fileType: string) => {
    trackEvent({ 
      type: 'download', 
      element: fileName, 
      metadata: { fileType } 
    });
  }, [trackEvent]);

  const trackScroll = useCallback((percentage: number) => {
    trackEvent({ 
      type: 'scroll', 
      element: 'page', 
      metadata: { percentage } 
    });
  }, [trackEvent]);

  const getSessionData = useCallback(() => session, [session]);

  const getAnalytics = useCallback(() => {
    if (!session) {
      return {
        totalEvents: 0,
        uniquePages: 0,
        averageSessionTime: 0,
        topEvents: [],
        performanceMetrics: {}
      };
    }

    const uniquePages = new Set(session.events.map(e => e.page)).size;
    const averageSessionTime = Date.now() - session.startTime;
    
    const eventCounts = session.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEvents = Object.entries(eventCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Convert PerformanceMetrics to Record<string, number>
    const performanceMetrics: Record<string, number> = {
      ...(metrics.lcp !== null && { lcp: metrics.lcp }),
      ...(metrics.fid !== null && { fid: metrics.fid }),
      ...(metrics.cls !== null && { cls: metrics.cls }),
      ...(metrics.fcp !== null && { fcp: metrics.fcp }),
      ...(metrics.ttfb !== null && { ttfb: metrics.ttfb }),
      ...metrics.customMetrics
    };

    return {
      totalEvents: session.events.length,
      uniquePages,
      averageSessionTime,
      topEvents,
      performanceMetrics
    };
  }, [session, metrics]);

  // Track page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent({ type: 'custom', element: 'page_hidden' });
      } else {
        trackEvent({ type: 'custom', element: 'page_visible' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [trackEvent]);

  // Track scroll depth
  useEffect(() => {
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100);
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (scrollDepth >= 25 && scrollDepth % 25 === 0) {
          trackScroll(scrollDepth);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScroll]);

  const contextValue: AnalyticsContextType = {
    trackEvent,
    trackPageView,
    trackClick,
    trackFormSubmit,
    trackDownload,
    trackScroll,
    getSessionData,
    getAnalytics
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export default AnalyticsProvider;