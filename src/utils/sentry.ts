import * as Sentry from '@sentry/react';
import { getUnifiedAPI } from '@/services/api';

/**
 * Sentry Configuration
 * 
 * Comprehensive error monitoring and performance tracking setup:
 * - Error tracking and reporting
 * - Performance monitoring
 * - User context and breadcrumbs
 * - Custom integrations
 * - Environment-specific configuration
 */

interface SentryConfig {
  dsn?: string;
  environment: string;
  release?: string;
  debug: boolean;
  sampleRate: number;
  tracesSampleRate: number;
  enableUserFeedback: boolean;
  enablePerformanceMonitoring: boolean;
  enableSessionReplay: boolean;
}

/**
 * Default Sentry configuration
 */
const defaultConfig: SentryConfig = {
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  release: import.meta.env.VITE_APP_VERSION || '1.0.0',
  debug: import.meta.env.VITE_ENVIRONMENT === 'development',
  sampleRate: import.meta.env.VITE_ENVIRONMENT === 'production' ? 0.1 : 1.0,
  tracesSampleRate: import.meta.env.VITE_ENVIRONMENT === 'production' ? 0.1 : 1.0,
  enableUserFeedback: true,
  enablePerformanceMonitoring: true,
  enableSessionReplay: import.meta.env.VITE_ENVIRONMENT === 'production'
};

/**
 * Initialize Sentry with comprehensive configuration
 */
export const initSentry = (config: Partial<SentryConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };

  // Skip initialization if no DSN is provided
  if (!finalConfig.dsn) {
    console.warn('Sentry DSN not provided, skipping initialization');
    return;
  }

  try {
    Sentry.init({
      dsn: finalConfig.dsn,
      environment: finalConfig.environment,
      release: finalConfig.release,
      debug: finalConfig.debug,
      sampleRate: finalConfig.sampleRate,
      tracesSampleRate: finalConfig.tracesSampleRate,
      
      // Integrations
      integrations: [
        // Browser tracing for performance monitoring
        Sentry.browserTracingIntegration({
          // Track specific interactions
          tracePropagationTargets: [
            'localhost',
            /^https:\/\/api\./,
            /^https:\/\/.*\.vercel\.app/
          ]
        }),
        
        // Session replay (production only)
        ...(finalConfig.enableSessionReplay ? [
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
            sessionSampleRate: 0.1,
            errorSampleRate: 1.0
          })
        ] : []),
        
        // Custom integration for API service
        {
          name: 'APIServiceIntegration',
          setupOnce() {
            // Add API service context to all events
            Sentry.addEventProcessor((event) => {
              try {
                const apiService = getUnifiedAPI();
                const allMetrics = apiService.getAllMetrics();
                
                // Aggregate metrics from all services
                const aggregatedMetrics = Object.values(allMetrics).reduce(
                  (acc, serviceMetrics) => ({
                    total_requests: acc.total_requests + serviceMetrics.requests.total,
                    failed_requests: acc.failed_requests + serviceMetrics.requests.failed,
                    average_response_time: (acc.average_response_time + serviceMetrics.latency.average) / 2,
                    rate_limit_hits: acc.rate_limit_hits + serviceMetrics.rateLimit.hits
                  }),
                  { total_requests: 0, failed_requests: 0, average_response_time: 0, rate_limit_hits: 0 }
                );
                
                event.contexts = {
                  ...event.contexts,
                  api_metrics: aggregatedMetrics
                };
              } catch (error) {
                // Silently fail to avoid recursive errors
              }
              
              return event;
            });
          }
        }
      ],
      
      // Performance monitoring
      beforeSend(event, hint) {
        // Filter out development errors
        if (finalConfig.environment === 'development') {
          // Skip certain error types in development
          const error = hint.originalException;
          if (error instanceof Error) {
            if (error.message.includes('ResizeObserver loop limit exceeded')) {
              return null;
            }
            if (error.message.includes('Non-Error promise rejection captured')) {
              return null;
            }
          }
        }
        
        // Add custom fingerprinting
        if (event.exception?.values?.[0]) {
          const error = event.exception.values[0];
          if (error.type && error.value) {
            event.fingerprint = [error.type, error.value];
          }
        }
        
        return event;
      },
      
      // Transaction filtering
      beforeSendTransaction(event) {
        // Filter out noisy transactions
        if (event.transaction?.includes('heartbeat')) {
          return null;
        }
        
        return event;
      },
      
      // Initial scope configuration
      initialScope: {
        tags: {
          component: 'react-app',
          version: finalConfig.release
        },
        level: 'info'
      }
    });

    // Set up user feedback if enabled
    if (finalConfig.enableUserFeedback) {
      setupUserFeedback();
    }

    console.log('Sentry initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
};

/**
 * Set up user feedback collection
 */
function setupUserFeedback() {
  // Add global error handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    Sentry.captureException(event.reason);
  });
  
  // Add custom user feedback widget
  const showUserFeedback = () => {
    const eventId = Sentry.lastEventId();
    if (eventId) {
      Sentry.showReportDialog({ eventId });
    }
  };
  
  // Make feedback function globally available
  (window as any).showSentryFeedback = showUserFeedback;
}

/**
 * Set user context for Sentry
 */
export const setSentryUser = (user: {
  id: string;
  email?: string;
  username?: string;
  role?: string;
  subscription?: string;
}) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    subscription: user.subscription
  });
};

/**
 * Clear user context
 */
export const clearSentryUser = () => {
  Sentry.setUser(null);
};

/**
 * Add breadcrumb for user actions
 */
export const addSentryBreadcrumb = (message: string, category: string, data?: any) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
    timestamp: Date.now() / 1000
  });
};

/**
 * Set custom context
 */
export const setSentryContext = (key: string, context: any) => {
  Sentry.setContext(key, context);
};

/**
 * Set custom tags
 */
export const setSentryTags = (tags: Record<string, string>) => {
  Sentry.setTags(tags);
};

/**
 * Capture custom exception
 */
export const captureSentryException = (error: Error, context?: any) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('custom', context);
    }
    Sentry.captureException(error);
  });
};

/**
 * Capture custom message
 */
export const captureSentryMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.captureMessage(message, level);
};

/**
 * Start custom transaction
 */
export const startSentryTransaction = (name: string, op: string) => {
  return Sentry.startSpan({ name, op }, (span) => span);
};

/**
 * Start transaction with additional data and controls
 */
export const startTransaction = (name: string, op: string, data?: Record<string, any>) => {
  // Create a simple wrapper that returns span-like interface
  let currentSpan: any = null;
  
  const spanWrapper = {
    span: currentSpan,
    finish: (status?: string) => {
      // No-op for now, spans are auto-finished
    },
    setTag: (key: string, value: string) => {
      // No-op for now
    },
    setData: (key: string, value: any) => {
      // No-op for now
    },
  };
  
  return spanWrapper;
};

/**
 * Performance monitoring helpers
 */
export const measurePerformance = async <T>(
  name: string,
  operation: () => Promise<T> | T,
  tags?: Record<string, string>
): Promise<T> => {
  return await Sentry.startSpan({
    name,
    op: 'custom'
  }, async (span) => {
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        span.setAttributes({ [key]: value });
      });
    }
    
    try {
      const result = await operation();
      span.setStatus({ code: 1 }); // OK status
      return result;
    } catch (error) {
      span.setStatus({ code: 2 }); // ERROR status
      throw error;
    }
  });
};

/**
 * React component for Sentry error boundary
 */
export const SentryErrorBoundary = Sentry.withErrorBoundary;

/**
 * React profiler for performance monitoring
 */
export const SentryProfiler = Sentry.withProfiler;

/**
 * Hook for Sentry integration in React components
 */
export const useSentry = () => {
  const captureException = (error: Error, context?: any) => {
    captureSentryException(error, context);
  };
  
  const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    captureSentryMessage(message, level);
  };
  
  const addBreadcrumb = (message: string, category: string, data?: any) => {
    addSentryBreadcrumb(message, category, data);
  };
  
  const setUser = (user: any) => {
    setSentryUser(user);
  };
  
  const setContext = (key: string, context: any) => {
    setSentryContext(key, context);
  };
  
  const setTags = (tags: Record<string, string>) => {
    setSentryTags(tags);
  };
  
  return {
    captureException,
    captureMessage,
    addBreadcrumb,
    setUser,
    setContext,
    setTags,
    measurePerformance
  };
};

/**
 * Environment-specific configuration
 */
export const getSentryConfig = (): Partial<SentryConfig> => {
  const environment = import.meta.env.VITE_ENVIRONMENT;
  
  switch (environment) {
    case 'production':
      return {
        debug: false,
        sampleRate: 0.1,
        tracesSampleRate: 0.1,
        enableSessionReplay: true
      };
      
    case 'staging':
      return {
        debug: false,
        sampleRate: 0.5,
        tracesSampleRate: 0.5,
        enableSessionReplay: true
      };
      
    case 'development':
    default:
      return {
        debug: true,
        sampleRate: 1.0,
        tracesSampleRate: 1.0,
        enableSessionReplay: false
      };
  }
};

/**
 * Initialize Sentry with environment-specific config
 */
export const initSentryWithEnvironment = () => {
  const config = getSentryConfig();
  initSentry(config);
};

// Export Sentry instance for direct access
export { Sentry };

// Type declarations for global Sentry
declare global {
  interface Window {
    Sentry: typeof Sentry;
    showSentryFeedback: () => void;
  }
}

// Make Sentry globally available
if (typeof window !== 'undefined') {
  window.Sentry = Sentry;
}