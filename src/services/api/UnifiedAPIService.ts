import { ClaudeService } from './ClaudeService';
import { GitHubService } from './GitHubService';
import { AnalyticsService } from './AnalyticsService';
import { EmailService } from './EmailService';
import {
  UnifiedAPIConfig,
  ServiceStatus,
  HealthCheck,
  APIMetrics,
  ServiceRegistry,
  APIError
} from './types';

/**
 * Unified API Service
 * Central orchestrator for all API services
 * Features:
 * - Service management and health monitoring
 * - Unified error handling
 * - Cross-service analytics
 * - Service discovery
 * - Load balancing and failover
 * - Centralized configuration
 * - Request/response logging
 * - Performance monitoring
 */
export class UnifiedAPIService {
  private config: UnifiedAPIConfig;
  private services: ServiceRegistry;
  private healthChecks: Map<string, HealthCheck>;
  private metrics: Map<string, APIMetrics>;
  private isInitialized: boolean;
  private healthCheckInterval: NodeJS.Timeout | null;
  private metricsInterval: NodeJS.Timeout | null;

  constructor(config: UnifiedAPIConfig) {
    this.config = {
      enableHealthChecks: true,
      healthCheckInterval: 60000, // 1 minute
      enableMetrics: true,
      metricsInterval: 30000, // 30 seconds
      enableLogging: true,
      enableFailover: true,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    };

    this.services = {
      claude: null,
      github: null,
      analytics: null,
      email: null
    };

    this.healthChecks = new Map();
    this.metrics = new Map();
    this.isInitialized = false;
    this.healthCheckInterval = null;
    this.metricsInterval = null;
  }

  /**
   * Initialize all services
   */
  async initialize(): Promise<void> {
    try {
      console.log('Initializing Unified API Service...');

      // Initialize Claude service
      if (this.config.claude) {
        try {
          this.services.claude = new ClaudeService(this.config.claude);
          console.log('✅ Claude service initialized');
        } catch (error) {
          console.error('❌ Failed to initialize Claude service:', error);
          if (this.config.claude) {
            throw error;
          }
        }
      }

      // Initialize GitHub service
      if (this.config.github) {
        try {
          this.services.github = new GitHubService(this.config.github);
          console.log('✅ GitHub service initialized');
        } catch (error) {
          console.error('❌ Failed to initialize GitHub service:', error);
          if (this.config.github) {
            throw error;
          }
        }
      }

      // Initialize Analytics service
      if (this.config.analytics) {
        try {
          this.services.analytics = new AnalyticsService(this.config.analytics);
          console.log('✅ Analytics service initialized');
        } catch (error) {
          console.error('❌ Failed to initialize Analytics service:', error);
          if (this.config.analytics) {
            throw error;
          }
        }
      }

      // Initialize Email service
      if (this.config.email) {
        try {
          this.services.email = new EmailService(this.config.email);
          console.log('✅ Email service initialized');
        } catch (error) {
          console.error('❌ Failed to initialize Email service:', error);
          if (this.config.email) {
            throw error;
          }
        }
      }

      // Start health checks
      if (this.config.enableHealthChecks) {
        this.startHealthChecks();
      }

      // Start metrics collection
      if (this.config.enableMetrics) {
        this.startMetricsCollection();
      }

      this.isInitialized = true;
      console.log('🚀 Unified API Service fully initialized');

      // Track initialization
      await this.trackEvent('api_service_initialized', {
        services: Object.keys(this.services).filter(key => this.services[key as keyof ServiceRegistry] !== null),
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Failed to initialize Unified API Service:', error);
      throw error;
    }
  }

  /**
   * Service Getters
   */
  get claude(): ClaudeService {
    if (!this.services.claude) {
      throw new Error('Claude service is not initialized');
    }
    return this.services.claude;
  }

  get github(): GitHubService {
    if (!this.services.github) {
      throw new Error('GitHub service is not initialized');
    }
    return this.services.github;
  }

  get analytics(): AnalyticsService {
    if (!this.services.analytics) {
      throw new Error('Analytics service is not initialized');
    }
    return this.services.analytics;
  }

  get email(): EmailService {
    if (!this.services.email) {
      throw new Error('Email service is not initialized');
    }
    return this.services.email;
  }

  /**
   * Service Status and Health
   */
  async getServiceStatus(serviceName?: keyof ServiceRegistry): Promise<ServiceStatus | Record<string, ServiceStatus>> {
    if (serviceName) {
      return this.getSingleServiceStatus(serviceName);
    }

    const statuses: Record<string, ServiceStatus> = {};
    
    for (const [name, service] of Object.entries(this.services)) {
      if (service) {
        statuses[name] = await this.getSingleServiceStatus(name as keyof ServiceRegistry);
      } else {
        statuses[name] = {
          name,
          status: 'maintenance',
          uptime: 0,
          lastCheck: Date.now(),
          metrics: {
            requests: { total: 0, successful: 0, failed: 0, retried: 0 },
            latency: { average: 0, p50: 0, p95: 0, p99: 0 },
            errors: { total: 0, byStatus: {}, byEndpoint: {} },
            rateLimit: { hits: 0, blocks: 0 },
            cache: { hits: 0, misses: 0, size: 0 }
          },
          health: {
            service: name,
            status: 'unhealthy',
            latency: 0,
            timestamp: Date.now()
          }
        };
      }
    }

    return statuses;
  }

  private async getSingleServiceStatus(serviceName: keyof ServiceRegistry): Promise<ServiceStatus> {
    const service = this.services[serviceName];
    
    if (!service) {
      return {
        name: String(serviceName),
        status: 'maintenance',
        uptime: 0,
        lastCheck: Date.now(),
        metrics: {
          requests: { total: 0, successful: 0, failed: 0, retried: 0 },
          latency: { average: 0, p50: 0, p95: 0, p99: 0 },
          errors: { total: 0, byStatus: {}, byEndpoint: {} },
          rateLimit: { hits: 0, blocks: 0 },
          cache: { hits: 0, misses: 0, size: 0 }
        },
        health: {
          service: String(serviceName),
          status: 'unhealthy',
          latency: 0,
          timestamp: Date.now()
        }
      };
    }

    try {
      const startTime = Date.now();
      const healthCheck = await service.healthCheck();
      const responseTime = Date.now() - startTime;

      const status: ServiceStatus = {
          name: String(serviceName),
          status: healthCheck.status === 'healthy' ? 'online' : 'offline',
          uptime: responseTime,
          lastCheck: Date.now(),
          metrics: {
            requests: { total: 1, successful: healthCheck.status === 'healthy' ? 1 : 0, failed: healthCheck.status === 'healthy' ? 0 : 1, retried: 0 },
            latency: { average: responseTime, p50: responseTime, p95: responseTime, p99: responseTime },
            errors: { total: healthCheck.status === 'healthy' ? 0 : 1, byStatus: {}, byEndpoint: {} },
            rateLimit: { hits: 0, blocks: 0 },
            cache: { hits: 0, misses: 0, size: 0 }
          },
          health: healthCheck
        };

      this.healthChecks.set(String(serviceName), healthCheck);
      return status;

    } catch (error) {
        return {
          name: String(serviceName),
          status: 'offline',
          uptime: 0,
          lastCheck: Date.now(),
          metrics: {
            requests: { total: 1, successful: 0, failed: 1, retried: 0 },
            latency: { average: 0, p50: 0, p95: 0, p99: 0 },
            errors: { total: 1, byStatus: {}, byEndpoint: {} },
            rateLimit: { hits: 0, blocks: 0 },
            cache: { hits: 0, misses: 0, size: 0 }
          },
          health: {
            service: String(serviceName),
            status: 'unhealthy',
            latency: 0,
            timestamp: Date.now(),
            details: { error: error instanceof Error ? error.message : 'Unknown error' }
          }
        };
    }
  }

  /**
   * Health Monitoring
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthChecks();
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, this.config.healthCheckInterval);
  }

  private async performHealthChecks(): Promise<void> {
    const checks = await Promise.allSettled(
      Object.entries(this.services)
        .filter(([_, service]) => service !== null)
        .map(async ([name, service]) => {
          const startTime = Date.now();
          try {
            const healthCheck = await (service as any).healthCheck();
            const responseTime = Date.now() - startTime;
            
            this.healthChecks.set(name, {
              ...healthCheck,
              responseTime
            });

            // Track health check metrics
            await this.trackEvent('service_health_check', {
              service: name,
              status: healthCheck.status,
              responseTime,
              timestamp: Date.now()
            });

          } catch (error) {
            this.healthChecks.set(name, {
              service: name,
              status: 'unhealthy',
              latency: Date.now() - startTime,
              timestamp: Date.now(),
              details: { error: error instanceof Error ? error.message : 'Unknown error' }
            });
          }
        })
    );

    // Log any failed health checks
    checks.forEach((result, index) => {
      if (result.status === 'rejected') {
        const serviceName = Object.keys(this.services)[index];
        console.error(`Health check failed for ${serviceName}:`, result.reason);
      }
    });
  }

  /**
   * Metrics Collection
   */
  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(async () => {
      try {
        await this.collectMetrics();
      } catch (error) {
        console.error('Metrics collection failed:', error);
      }
    }, this.config.metricsInterval);
  }

  private async collectMetrics(): Promise<void> {
    for (const [name, service] of Object.entries(this.services)) {
      if (service && typeof service === 'object' && 'getMetrics' in service) {
        try {
          const metrics = await (service as any).getMetrics();
          this.metrics.set(name, {
            ...metrics,
            timestamp: Date.now()
          });
        } catch (error) {
          console.error(`Failed to collect metrics for ${name}:`, error);
        }
      }
    }
  }

  /**
   * Cross-Service Operations
   */
  async askClaudeAboutCode(
    code: string,
    language: string,
    question: string,
    options?: {
      includeGitHubContext?: boolean;
      trackAnalytics?: boolean;
    }
  ): Promise<string> {
    try {
      // Track the request
      if (options?.trackAnalytics && this.services.analytics) {
        await this.services.analytics.track('claude_code_analysis_request', {
          language,
          codeLength: code.length,
          question: question.substring(0, 100) // First 100 chars for privacy
        });
      }

      // Get GitHub context if requested
      let context = '';
      if (options?.includeGitHubContext && this.services.github) {
        try {
          const user = await this.services.github.getCurrentUser();
          context = `\nGitHub Context: User ${user.login} with ${user.public_repos} public repositories.`;
        } catch (error) {
          console.warn('Failed to get GitHub context:', error);
        }
      }

      // Ask Claude
      const response = await this.services.claude!.analyzeCode(
        code,
        language,
        'review',
        {
          systemPrompt: `You are a helpful code assistant. ${context}`
        }
      );

      // Track successful response
      if (options?.trackAnalytics && this.services.analytics) {
        await this.services.analytics.track('claude_code_analysis_success', {
          responseLength: response.length
        });
      }

      return response;

    } catch (error) {
      // Track error
      if (options?.trackAnalytics && this.services.analytics) {
        await this.services.analytics.trackError(error as Error, {
          operation: 'claude_code_analysis',
          language,
          codeLength: code.length
        });
      }
      throw error;
    }
  }

  async sendNotificationWithAnalytics(
    to: string,
    subject: string,
    message: string,
    options?: {
      trackOpens?: boolean;
      trackClicks?: boolean;
      includeUnsubscribe?: boolean;
    }
  ): Promise<{ messageId: string; status: string }> {
    try {
      // Track email send attempt
      if (this.services.analytics) {
        await this.services.analytics.track('email_send_attempt', {
          recipient: to,
          subject: subject.substring(0, 50),
          messageLength: message.length
        });
      }

      // Send email
      const result = await this.services.email!.sendEmail({
        to: [{ email: to }],
        subject,
        htmlContent: message,
        tracking: {
          openTracking: options?.trackOpens ?? true,
          clickTracking: options?.trackClicks ?? true,
          unsubscribeTracking: options?.includeUnsubscribe ?? true
        }
      });

      // Track successful send
      if (this.services.analytics) {
        await this.services.analytics.track('email_send_success', {
          messageId: result.messageId,
          status: result.status
        });
      }

      return result;

    } catch (error) {
      // Track error
      if (this.services.analytics) {
        await this.services.analytics.trackError(error as Error, {
          operation: 'email_send',
          recipient: to
        });
      }
      throw error;
    }
  }

  async createGitHubIssueFromError(
    error: Error,
    context: {
      repository: { owner: string; repo: string };
      title?: string;
      labels?: string[];
      assignees?: string[];
    }
  ): Promise<{ issueNumber: number; url: string }> {
    try {
      // Track issue creation attempt
      if (this.services.analytics) {
        await this.services.analytics.track('github_issue_creation_attempt', {
          repository: `${context.repository.owner}/${context.repository.repo}`,
          errorType: error.name,
          errorMessage: error.message.substring(0, 100)
        });
      }

      // Create issue body with error details
      const issueBody = `
## Error Report

**Error Type:** ${error.name}
**Error Message:** ${error.message}

**Stack Trace:**
\`\`\`
${error.stack}
\`\`\`

**Timestamp:** ${new Date().toISOString()}

**Environment:**
- User Agent: ${navigator.userAgent}
- URL: ${window.location.href}

---
*This issue was automatically created by the Unified API Service*
      `;

      // Create GitHub issue
      const issue = await this.services.github!.createIssue(
        context.repository.owner,
        context.repository.repo,
        {
          title: context.title || `Error: ${error.message.substring(0, 50)}...`,
          body: issueBody,
          labels: [...(context.labels || []), 'bug', 'auto-generated'],
          assignees: context.assignees
        }
      );

      // Track successful creation
      if (this.services.analytics) {
        await this.services.analytics.track('github_issue_creation_success', {
          issueNumber: issue.number,
          issueUrl: issue.html_url
        });
      }

      return {
        issueNumber: issue.number,
        url: issue.html_url
      };

    } catch (createError) {
      // Track error
      if (this.services.analytics) {
        await this.services.analytics.trackError(createError as Error, {
          operation: 'github_issue_creation',
          originalError: error.message
        });
      }
      throw createError;
    }
  }

  /**
   * Utility Methods
   */
  async trackEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
    if (this.services.analytics) {
      try {
        await this.services.analytics.track(eventName, properties);
      } catch (error) {
        console.warn('Failed to track event:', error);
      }
    }
  }

  async trackError(error: Error, context?: Record<string, any>): Promise<void> {
    if (this.services.analytics) {
      try {
        await this.services.analytics.trackError(error, context);
      } catch (trackError) {
        console.warn('Failed to track error:', trackError);
      }
    }
  }

  getAvailableServices(): string[] {
    return Object.entries(this.services)
      .filter(([_, service]) => service !== null)
      .map(([name]) => name);
  }

  isServiceAvailable(serviceName: keyof ServiceRegistry): boolean {
    return this.services[serviceName] !== null;
  }

  getAllMetrics(): Record<string, APIMetrics> {
    const metrics: Record<string, APIMetrics> = {};
    for (const [name, serviceMetrics] of this.metrics.entries()) {
      metrics[name] = serviceMetrics;
    }
    return metrics;
  }

  getAllHealthChecks(): Record<string, HealthCheck> {
    const healthChecks: Record<string, HealthCheck> = {};
    for (const [name, check] of this.healthChecks.entries()) {
      healthChecks[name] = check;
    }
    return healthChecks;
  }

  /**
   * Error Handling
   */
  private handleServiceError(serviceName: string, error: any): APIError {
    const apiError: APIError = {
      message: `${serviceName} service error: ${error.message || 'Unknown error'}`,
      status: error.status,
      code: error.code || 'SERVICE_ERROR',
      details: {
        service: serviceName,
        originalError: error
      },
      timestamp: Date.now(),
      retryCount: error.retryCount || 0,
      isRetryable: error.isRetryable || false
    };

    // Track service error
    this.trackError(new Error(apiError.message), {
      service: serviceName,
      errorCode: apiError.code,
      errorStatus: apiError.status
    });

    return apiError;
  }

  /**
   * Cleanup
   */
  async destroy(): Promise<void> {
    console.log('Shutting down Unified API Service...');

    // Stop intervals
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    // Cleanup services
    if (this.services.analytics && 'destroy' in this.services.analytics) {
      (this.services.analytics as any).destroy();
    }

    // Track shutdown
    await this.trackEvent('api_service_shutdown', {
      timestamp: Date.now(),
      uptime: Date.now() - (this.healthChecks.get('system')?.timestamp || Date.now())
    });

    this.isInitialized = false;
    console.log('✅ Unified API Service shut down successfully');
  }

  /**
   * Configuration Management
   */
  updateConfig(updates: Partial<UnifiedAPIConfig>): void {
    this.config = { ...this.config, ...updates };
    
    // Restart intervals if timing changed
    if (updates.healthCheckInterval && this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.startHealthChecks();
    }
    
    if (updates.metricsInterval && this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.startMetricsCollection();
    }
  }

  getConfig(): UnifiedAPIConfig {
    return { ...this.config };
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
let unifiedAPIInstance: UnifiedAPIService | null = null;

export function createUnifiedAPI(config: UnifiedAPIConfig): UnifiedAPIService {
  if (unifiedAPIInstance) {
    console.warn('Unified API Service already exists. Returning existing instance.');
    return unifiedAPIInstance;
  }
  
  unifiedAPIInstance = new UnifiedAPIService(config);
  return unifiedAPIInstance;
}

export function getUnifiedAPI(): UnifiedAPIService {
  if (!unifiedAPIInstance) {
    throw new Error('Unified API Service not initialized. Call createUnifiedAPI() first.');
  }
  return unifiedAPIInstance;
}

export function destroyUnifiedAPI(): void {
  if (unifiedAPIInstance) {
    unifiedAPIInstance.destroy();
    unifiedAPIInstance = null;
  }
}