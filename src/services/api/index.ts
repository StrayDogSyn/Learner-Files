/**
 * Unified API Service Layer
 * 
 * This module provides a comprehensive API service layer that integrates:
 * - Claude AI for intelligent text processing
 * - GitHub for repository management
 * - Analytics for user behavior tracking
 * - Email for communication services
 * 
 * Features:
 * - Unified interface for all external services
 * - Rate limiting and retry logic
 * - Error handling and monitoring
 * - Health checks and metrics
 * - Cross-service operations
 * - Configuration management
 * 
 * Usage:
 * ```typescript
 * import { createUnifiedAPI, getUnifiedAPI } from '@/services/api';
 * 
 * // Initialize the API service
 * const api = createUnifiedAPI({
 *   claude: { apiKey: 'your-claude-key' },
 *   github: { token: 'your-github-token' },
 *   analytics: { trackingId: 'your-analytics-id' },
 *   email: { apiKey: 'your-email-key' }
 * });
 * 
 * await api.initialize();
 * 
 * // Use individual services
 * const response = await api.claude.sendMessage('Hello, Claude!');
 * const repos = await api.github.getRepositories('username');
 * await api.analytics.track('user_action', { action: 'click' });
 * await api.email.sendEmail({ to: 'user@example.com', subject: 'Hello' });
 * 
 * // Use cross-service operations
 * const analysis = await api.askClaudeAboutCode(code, 'typescript', 'Review this code');
 * ```
 */

// Import types and services
import {
  APIConfig,
  APIRequest,
  APIResponse,
  APIError,
  // RateLimitConfig,
  // RetryConfig,
  CacheConfig,
  RequestInterceptor,
  ResponseInterceptor,
  
  // Service-specific types
  ClaudeConfig,
  ClaudeModel,
  ClaudeMessage,
  ClaudeResponse,
  ClaudeStreamResponse,
  ClaudeUsage,
  // ClaudeConversation,
  // ClaudeSafetySettings,
  
  GitHubConfig,
  GitHubRepository,
  // GitHubBranch,
  GitHubCommit,
  GitHubIssue,
  // GitHubPullRequest,
  // GitHubContent,
  // GitHubRelease,
  // GitHubWorkflow,
  // GitHubWebhook,
  GitHubUser,
  // GitHubSearchResult,
  
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsUser,
  AnalyticsSession,
  // AnalyticsMetric,
  // AnalyticsReport,
  // AnalyticsFilter,
  // AnalyticsExport,
  
  EmailConfig,
  // EmailMessage,
  EmailTemplate,
  EmailCampaign,
  // EmailContact,
  // EmailList,
  // EmailTracking,
  // EmailBounce,
  // EmailComplaint,
  // EmailSuppression,
  // EmailABTest,
  
  // Unified types
  UnifiedAPIConfig,
  ServiceStatus,
  HealthCheck,
  APIMetrics,
  ServiceRegistry,
  
  // Webhook types
  WebhookConfig,
  // WebhookEvent,
  WebhookPayload
  // WebhookRetry
  // WebhookSignature
} from './types';

// Import service classes
import { BaseAPIClient } from './BaseAPIClient';
import { ClaudeService } from './ClaudeService';
import { GitHubService } from './GitHubService';
import { AnalyticsService } from './AnalyticsService';
import { EmailService } from './EmailService';

// Import unified service
import {
  UnifiedAPIService,
  createUnifiedAPI,
  getUnifiedAPI,
  destroyUnifiedAPI
} from './UnifiedAPIService';

// Export all types
export type {
  // Base types
  APIConfig,
  APIRequest,
  APIResponse,
  APIError,
  // RateLimitConfig,
  // RetryConfig,
  CacheConfig,
  RequestInterceptor,
  ResponseInterceptor,
  
  // Service-specific types
  ClaudeConfig,
  ClaudeMessage,
  ClaudeResponse,
  ClaudeStreamResponse,
  ClaudeUsage,
  // ClaudeConversation,
  // ClaudeSafetySettings,
  
  GitHubConfig,
  GitHubRepository,
  // GitHubBranch,
  GitHubCommit,
  GitHubIssue,
  // GitHubPullRequest,
  // GitHubContent,
  // GitHubRelease,
  // GitHubWorkflow,
  // GitHubWebhook,
  GitHubUser,
  // GitHubSearchResult,
  
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsUser,
  AnalyticsSession,
  // AnalyticsMetric,
  // AnalyticsReport,
  // AnalyticsFilter,
  // AnalyticsExport,
  
  EmailConfig,
  // EmailMessage,
  EmailTemplate,
  EmailCampaign,
  // EmailContact,
  // EmailList,
  // EmailTracking,
  // EmailBounce,
  // EmailComplaint,
  // EmailSuppression,
  // EmailABTest,
  
  // Unified types
  UnifiedAPIConfig,
  ServiceStatus,
  HealthCheck,
  APIMetrics,
  ServiceRegistry,
  
  // Webhook types
  WebhookConfig,
  // WebhookEvent,
  WebhookPayload
  // WebhookRetry
  // WebhookSignature
} from './types';

// Export individual service classes
export { BaseAPIClient } from './BaseAPIClient';
export { ClaudeService } from './ClaudeService';
export { GitHubService } from './GitHubService';
export { AnalyticsService } from './AnalyticsService';
export { EmailService } from './EmailService';

// Export unified service
export {
  UnifiedAPIService,
  createUnifiedAPI,
  getUnifiedAPI,
  destroyUnifiedAPI
} from './UnifiedAPIService';

// Export utility functions and constants
export const API_CONSTANTS = {
  // Rate limiting defaults
  DEFAULT_RATE_LIMIT: {
    requests: 100,
    window: 60000, // 1 minute
    burst: 10
  },
  
  // Retry defaults
  DEFAULT_RETRY: {
    attempts: 3,
    delay: 1000,
    backoff: 'exponential' as const,
    maxDelay: 30000
  },
  
  // Cache defaults
  DEFAULT_CACHE: {
    ttl: 300000, // 5 minutes
    maxSize: 100,
    strategy: 'lru' as const
  },
  
  // Health check defaults
  DEFAULT_HEALTH_CHECK: {
    interval: 60000, // 1 minute
    timeout: 5000,
    retries: 3
  },
  
  // Metrics defaults
  DEFAULT_METRICS: {
    interval: 30000, // 30 seconds
    retention: 86400000, // 24 hours
    maxEvents: 1000
  },
  
  // Service endpoints
  ENDPOINTS: {
    CLAUDE: 'https://api.anthropic.com',
    GITHUB: 'https://api.github.com',
    ANALYTICS: 'https://api.analytics.com',
    EMAIL: 'https://api.email.com'
  },
  
  // HTTP status codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    RATE_LIMITED: 429,
    INTERNAL_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
  },
  
  // Error codes
  ERROR_CODES: {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
    AUTH_ERROR: 'AUTH_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVICE_ERROR: 'SERVICE_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
  }
} as const;

// Utility functions
export const APIUtils = {
  /**
   * Check if an error is retryable
   */
  isRetryableError(error: any): boolean {
    if (!error) return false;
    
    // Network errors are retryable
    if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR') {
      return true;
    }
    
    // HTTP status codes that are retryable
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    if (error.status && retryableStatuses.includes(error.status)) {
      return true;
    }
    
    return false;
  },
  
  /**
   * Calculate retry delay with exponential backoff
   */
  calculateRetryDelay(attempt: number, baseDelay: number = 1000, maxDelay: number = 30000): number {
    const delay = baseDelay * Math.pow(2, attempt - 1);
    return Math.min(delay, maxDelay);
  },
  
  /**
   * Generate a unique request ID
   */
  generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
  
  /**
   * Sanitize sensitive data from logs
   */
  sanitizeForLogging(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }
    
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization'];
    const sanitized = { ...data };
    
    for (const key of sensitiveKeys) {
      if (key in sanitized) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  },
  
  /**
   * Format API response for consistent structure
   */
  formatResponse<T>(data: T, metadata?: Record<string, any>): APIResponse<T> {
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as APIRequest,
      timestamp: Date.now()
    };
  },
  
  /**
   * Format API error for consistent structure
   */
  formatError(error: any, context?: Record<string, any>): APIError {
    return {
      message: error.message || 'Unknown error occurred',
      status: error.status,
      code: error.code || API_CONSTANTS.ERROR_CODES.UNKNOWN_ERROR,
      details: {
        ...context,
        originalError: this.sanitizeForLogging(error)
      },
      timestamp: Date.now(),
      retryCount: error.retryCount || 0,
      isRetryable: this.isRetryableError(error)
    };
  },
  
  /**
   * Validate API configuration
   */
  validateConfig(config: any, requiredFields: string[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const field of requiredFields) {
      if (!config[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Create a timeout promise
   */
  createTimeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${ms}ms`));
      }, ms);
    });
  },
  
  /**
   * Merge configurations with defaults
   */
  mergeConfig<T extends Record<string, any>>(defaults: T, config: Partial<T>): T {
    return {
      ...defaults,
      ...config,
      // Deep merge nested objects
      ...Object.keys(defaults).reduce((acc, key) => {
        if (
          defaults[key] &&
          typeof defaults[key] === 'object' &&
          !Array.isArray(defaults[key]) &&
          config[key] &&
          typeof config[key] === 'object' &&
          !Array.isArray(config[key])
        ) {
          acc[key] = this.mergeConfig(defaults[key], config[key]);
        }
        return acc;
      }, {} as any)
    };
  }
};

// Environment-specific configurations
export const createDefaultConfig = (): Partial<UnifiedAPIConfig> => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    enableHealthChecks: true,
    healthCheckInterval: isDevelopment ? 30000 : 60000, // More frequent in dev
    enableMetrics: true,
    metricsInterval: isDevelopment ? 15000 : 30000,
    enableLogging: isDevelopment,
    enableFailover: !isDevelopment,
    retryAttempts: isDevelopment ? 1 : 3,
    retryDelay: 1000,
    
    // Service-specific defaults
    claude: {
      apiKey: process.env.VITE_CLAUDE_API_KEY || '',
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 4096,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      stop_sequences: [],
      baseURL: 'https://api.anthropic.com',
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      rateLimit: { requests: 100, window: 60000 }
    },
    
    github: {
      token: process.env.VITE_GITHUB_TOKEN || '',
      owner: 'default-owner',
      repo: 'default-repo',
      baseURL: 'https://api.github.com',
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      rateLimit: { requests: 100, window: 60000 }
    },
    
    analytics: {
      baseURL: 'https://api.analytics.com',
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      rateLimit: { requests: 100, window: 60000 },
      trackingId: process.env.VITE_ANALYTICS_ID || '',
      enableAutoTracking: true,
      enablePerformanceTracking: true,
      enableErrorTracking: true,
      batchSize: 10
    },
    
    email: {
      apiKey: process.env.VITE_EMAIL_API_KEY || '',
      fromEmail: 'noreply@example.com',
      fromName: 'Portfolio App',
      provider: 'sendgrid',
      baseURL: 'https://api.sendgrid.com',
      timeout: 15000,
      retries: 3,
      retryDelay: 1000,
      rateLimit: { requests: 100, window: 60000 }
    }
  };
};

// Quick setup function for common use cases
export const quickSetup = {
  /**
   * Setup for development environment
   */
  development(): UnifiedAPIService {
    const config = createDefaultConfig();
    const api = createUnifiedAPI(config as UnifiedAPIConfig);
    return api;
  },
  
  /**
   * Setup for production environment
   */
  production(): UnifiedAPIService {
    const config = {
      ...createDefaultConfig(),
      enableLogging: false,
      enableFailover: true,
      retryAttempts: 3,
      healthCheckInterval: 60000,
      metricsInterval: 30000
    };
    const api = createUnifiedAPI(config as UnifiedAPIConfig);
    return api;
  },
  
  /**
   * Setup with only specific services
   */
  withServices(services: Array<'claude' | 'github' | 'analytics' | 'email'>): UnifiedAPIService {
    const baseConfig = createDefaultConfig();
    const config: Partial<UnifiedAPIConfig> = {
      enableHealthChecks: true,
      enableMetrics: true,
      enableLogging: true
    };
    
    // Only include requested services
    services.forEach(service => {
      if (baseConfig[service]) {
        (config as any)[service] = baseConfig[service];
      }
    });
    
    const api = createUnifiedAPI(config as UnifiedAPIConfig);
    return api;
  },
  
  /**
   * Setup for testing environment
   */
  testing(): UnifiedAPIService {
    const config = {
      ...createDefaultConfig(),
      enableHealthChecks: false,
      enableMetrics: false,
      enableLogging: false,
      retryAttempts: 1,
      
      // Mock configurations for testing
      claude: {
        apiKey: 'test-key',
        model: 'claude-3-5-sonnet-20241022',
        maxTokens: 1000,
        temperature: 0,
        topP: 0.9,
        topK: 40,
        stop_sequences: [],
        baseURL: 'https://api.anthropic.com',
        timeout: 5000,
        retries: 1,
        retryDelay: 500,
        rateLimit: { requests: 10, window: 60000 }
      }
    };
    
    const api = createUnifiedAPI(config as UnifiedAPIConfig);
    return api;
  }
};

// Export default configuration
export { createDefaultConfig as defaultConfig };

// Export unified API functions (already imported above)

// Version information
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

// Health check endpoint for monitoring
export const healthCheck = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  services: Record<string, any>;
  timestamp: number;
  version: string;
}> => {
  try {
    const api = getUnifiedAPI();
    const services = await api.getServiceStatus();
    
    const allHealthy = Object.values(services).every(
      (service: any) => service.status === 'healthy'
    );
    
    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      services,
      timestamp: Date.now(),
      version: VERSION
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      services: {},
      timestamp: Date.now(),
      version: VERSION
    };
  }
};