import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { getWebSocketService } from '../../services/WebSocketService';
import type { 
  VisitorUpdate, 
  PerformanceAlert, 
  GoalCompletion,
  WebSocketMessage 
} from '../../services/WebSocketService';
import type { GitHubPagesMetrics } from '../../services/api/GitHubPagesAnalyticsService';

interface AnalyticsContextType {
  // Analytics hook methods
  trackPageView: (path: string, title?: string) => void;
  trackProjectView: (projectId: string, projectName: string) => void;
  trackGameCompletion: (gameId: string, completed: boolean, timeSpent: number, score?: number) => void;
  trackContactFormInteraction: (action: 'view' | 'start' | 'submit', data?: any) => void;
  trackResumeDownload: (source: string) => void;
  trackSocialMediaClick: (platform: string, url: string) => void;
  trackInteraction: (element: string, action: string, metadata?: Record<string, any>) => void;
  trackError: (error: Error, context?: string) => void;
  
  // Real-time data
  realTimeMetrics: GitHubPagesMetrics | null;
  liveVisitors: VisitorUpdate | null;
  performanceAlerts: PerformanceAlert[];
  goalCompletions: GoalCompletion[];
  
  // Analytics state
  isTracking: boolean;
  isRealTimeEnabled: boolean;
  isConnected: boolean;
  
  // Control methods
  toggleTracking: (enabled: boolean) => void;
  toggleRealTime: (enabled: boolean) => void;
  exportData: (format: 'json' | 'csv') => string;
  generateReport: () => any;
  clearData: () => void;
  
  // Notification system
  notifications: AnalyticsNotification[];
  dismissNotification: (id: string) => void;
  addNotification: (type: 'info' | 'warning' | 'error' | 'success', message: string) => void;
}

interface AnalyticsNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  dismissed?: boolean;
  autoHide?: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
  enableRealTime?: boolean;
  enableNotifications?: boolean;
  autoTrackPageViews?: boolean;
  autoTrackErrors?: boolean;
  autoTrackPerformance?: boolean;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  enableRealTime = true,
  enableNotifications = true,
  autoTrackPageViews = true,
  autoTrackErrors = true,
  autoTrackPerformance = true
}) => {
  const analytics = useAnalytics();
  const [webSocketService] = useState(() => getWebSocketService());
  const [realTimeMetrics, setRealTimeMetrics] = useState<GitHubPagesMetrics | null>(null);
  const [liveVisitors, setLiveVisitors] = useState<VisitorUpdate | null>(null);
  const [performanceAlerts, setPerformanceAlerts] = useState<PerformanceAlert[]>([]);
  const [goalCompletions, setGoalCompletions] = useState<GoalCompletion[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<AnalyticsNotification[]>([]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!enableRealTime) return;

    const initializeWebSocket = async () => {
      try {
        await webSocketService.connect();
        setIsConnected(true);
        
        if (enableNotifications) {
          addNotification('success', 'Real-time analytics connected');
        }
      } catch (error) {
        console.error('Failed to connect to analytics WebSocket:', error);
        setIsConnected(false);
        
        if (enableNotifications) {
          addNotification('warning', 'Real-time analytics unavailable, using local mode');
        }
      }
    };

    initializeWebSocket();

    // Set up WebSocket event listeners
    const unsubscribeVisitors = webSocketService.subscribeToVisitorUpdates((data) => {
      setLiveVisitors(data);
    });

    const unsubscribeAlerts = webSocketService.subscribeToPerformanceAlerts((data) => {
      setPerformanceAlerts(prev => [data, ...prev.slice(0, 9)]); // Keep last 10
      
      if (enableNotifications) {
        addNotification(
          data.severity === 'critical' ? 'error' : 'warning',
          `Performance alert: ${data.metric.toUpperCase()} is ${data.value}ms (threshold: ${data.threshold}ms)`
        );
      }
    });

    const unsubscribeGoals = webSocketService.subscribeToGoalCompletions((data) => {
      setGoalCompletions(prev => [data, ...prev.slice(0, 19)]); // Keep last 20
      
      if (enableNotifications) {
        addNotification('success', `Goal completed: ${data.type}`);
      }
    });

    // Handle connection events
    webSocketService.on('connected', () => {
      setIsConnected(true);
      if (enableNotifications) {
        addNotification('success', 'Real-time analytics reconnected');
      }
    });

    webSocketService.on('disconnected', () => {
      setIsConnected(false);
      if (enableNotifications) {
        addNotification('warning', 'Real-time analytics disconnected');
      }
    });

    webSocketService.on('error', (error) => {
      console.error('WebSocket error:', error);
      if (enableNotifications) {
        addNotification('error', 'Real-time analytics error occurred');
      }
    });

    return () => {
      unsubscribeVisitors();
      unsubscribeAlerts();
      unsubscribeGoals();
      webSocketService.removeAllListeners();
    };
  }, [enableRealTime, enableNotifications, webSocketService]);

  // Update real-time metrics periodically
  useEffect(() => {
    if (!analytics.isRealTimeEnabled) return;

    const updateMetrics = () => {
      const metrics = analytics.getRealTimeMetrics();
      setRealTimeMetrics(metrics);
    };

    // Initial update
    updateMetrics();

    // Set up periodic updates
    const interval = setInterval(updateMetrics, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [analytics]);

  // Auto-track page views
  useEffect(() => {
    if (!autoTrackPageViews || !analytics.isTracking) return;

    // Page view is already tracked by useAnalytics hook
    // This effect is for any additional page view logic
  }, [autoTrackPageViews, analytics.isTracking]);

  // Auto-track performance metrics
  useEffect(() => {
    if (!autoTrackPerformance || !analytics.isTracking) return;

    // Set up performance observer for Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            analytics.trackPerformance({ largestContentfulPaint: entry.startTime });
            
            // Check for performance alerts
            if (entry.startTime > 2500) {
              webSocketService.sendPerformanceAlert({
                metric: 'lcp',
                value: entry.startTime,
                threshold: 2500,
                severity: entry.startTime > 4000 ? 'critical' : 'warning',
                page: window.location.pathname,
                timestamp: Date.now()
              });
            }
          }
          
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as PerformanceEventTiming;
            analytics.trackPerformance({ firstInputDelay: fidEntry.processingStart - fidEntry.startTime });
          }
          
          if (entry.entryType === 'layout-shift') {
            const clsEntry = entry as any;
            if (!clsEntry.hadRecentInput) {
              analytics.trackPerformance({ cumulativeLayoutShift: clsEntry.value });
            }
          }
        });
      });
      
      observer.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
      
      return () => observer.disconnect();
    }
  }, [autoTrackPerformance, analytics, webSocketService]);

  // Auto-track errors
  useEffect(() => {
    if (!autoTrackErrors || !analytics.isTracking) return;

    const handleError = (event: ErrorEvent) => {
      analytics.trackError(new Error(event.message), 'global_error_handler');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackError(new Error(event.reason), 'unhandled_promise_rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [autoTrackErrors, analytics]);

  // Enhanced tracking methods with WebSocket integration
  const trackProjectView = (projectId: string, projectName: string) => {
    analytics.trackProjectView(projectId, projectName);
    
    // Send goal completion for project views
    webSocketService.sendGoalCompletion({
      type: 'project_view',
      details: { projectId, projectName },
      value: 10, // Business value score
      timestamp: Date.now()
    });
  };

  const trackGameCompletion = (gameId: string, completed: boolean, timeSpent: number, score?: number) => {
    analytics.trackGameCompletion(gameId, completed, timeSpent, score);
    
    if (completed) {
      webSocketService.sendGoalCompletion({
        type: 'game_completion',
        details: { gameId, timeSpent, score },
        value: 25, // Higher value for game completions
        timestamp: Date.now()
      });
    }
  };

  const trackContactFormInteraction = (action: 'view' | 'start' | 'submit', data?: any) => {
    analytics.trackContactFormInteraction(action, data);
    
    if (action === 'submit') {
      webSocketService.sendGoalCompletion({
        type: 'contact_form',
        details: { action, data },
        value: 100, // High value for contact form submissions
        timestamp: Date.now()
      });
    }
  };

  const trackResumeDownload = (source: string) => {
    analytics.trackResumeDownload(source);
    
    webSocketService.sendGoalCompletion({
      type: 'resume_download',
      details: { source },
      value: 50, // Medium-high value for resume downloads
      timestamp: Date.now()
    });
  };

  const trackSocialMediaClick = (platform: string, url: string) => {
    analytics.trackSocialMediaClick(platform, url);
  };

  // Notification management
  const addNotification = (type: AnalyticsNotification['type'], message: string, autoHide = true) => {
    const notification: AnalyticsNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: new Date(),
      autoHide
    };

    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10

    // Auto-hide notifications after 5 seconds
    if (autoHide) {
      setTimeout(() => {
        dismissNotification(notification.id);
      }, 5000);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, dismissed: true } : n
    ));
  };

  // Data export and reporting
  const exportData = (format: 'json' | 'csv') => {
    return analytics.exportAnalyticsData(format);
  };

  const generateReport = () => {
    return analytics.generateWeeklyReport();
  };

  const clearData = () => {
    analytics.clearAnalyticsData();
    setPerformanceAlerts([]);
    setGoalCompletions([]);
    setNotifications([]);
    addNotification('info', 'Analytics data cleared');
  };

  const contextValue: AnalyticsContextType = {
    // Analytics methods
    trackPageView: analytics.trackPageView,
    trackProjectView,
    trackGameCompletion,
    trackContactFormInteraction,
    trackResumeDownload,
    trackSocialMediaClick,
    trackInteraction: analytics.trackInteraction,
    trackError: analytics.trackError,
    
    // Real-time data
    realTimeMetrics,
    liveVisitors,
    performanceAlerts,
    goalCompletions,
    
    // State
    isTracking: analytics.isTracking,
    isRealTimeEnabled: analytics.isRealTimeEnabled,
    isConnected,
    
    // Control methods
    toggleTracking: analytics.toggleTracking,
    toggleRealTime: analytics.toggleRealTime,
    exportData,
    generateReport,
    clearData,
    
    // Notifications
    notifications: notifications.filter(n => !n.dismissed),
    dismissNotification,
    addNotification
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};

export default AnalyticsProvider;