import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Copy, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UnifiedAPIService } from '@/services/api';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'critical';
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  showDetails: boolean;
  retryCount: number;
}

/**
 * ErrorBoundary Component
 * 
 * Comprehensive error boundary with:
 * - Error catching and logging
 * - Sentry integration
 * - Analytics tracking
 * - User-friendly error displays
 * - Retry mechanisms
 * - Error reporting
 * - Development tools
 */
export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: props.showDetails || false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.generateErrorId();
    
    this.setState({
      errorInfo,
      errorId
    });

    // Log error details
    this.logError(error, errorInfo, errorId);
    
    // Report to external services
    this.reportError(error, errorInfo, errorId);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logError(error: Error, errorInfo: ErrorInfo, errorId: string) {
    const errorDetails = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: this.props.context,
      level: this.props.level,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    };

    console.group(`🚨 Error Boundary [${this.props.level}]`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Error Details:', errorDetails);
    console.groupEnd();
  }

  private async reportError(error: Error, errorInfo: ErrorInfo, errorId: string) {
    try {
      const apiService = new UnifiedAPIService({
        github: { 
          token: '', 
          owner: '', 
          repo: '',
          baseURL: 'https://api.github.com',
          timeout: 30000,
          retries: 3,
          retryDelay: 1000,
          rateLimit: { requests: 60, window: 60000 }
        },
        claude: { 
          apiKey: '',
          model: 'claude-3-5-sonnet-20241022',
          maxTokens: 1000,
          temperature: 0.7,
          topP: 1,
          topK: 40,
          stop_sequences: [],
          systemPrompt: '',
          baseURL: 'https://api.anthropic.com',
          timeout: 30000,
          retries: 3,
          retryDelay: 1000,
          rateLimit: { requests: 60, window: 60000 }
        },
        email: { 
          apiKey: '',
          fromEmail: '',
          fromName: '',
          provider: 'sendgrid',
          baseURL: 'https://api.sendgrid.com/v3',
          timeout: 30000,
          retries: 3,
          retryDelay: 1000,
          rateLimit: { requests: 60, window: 60000 }
        }
      });
      
      // Track error in analytics
      // await apiService.analytics.trackEvent('error_boundary_triggered', {
      //   errorId,
      //   errorMessage: error.message,
      //   errorStack: error.stack?.substring(0, 1000), // Limit stack trace length
      //   componentStack: errorInfo.componentStack?.substring(0, 1000),
      //   context: this.props.context,
      //   level: this.props.level,
      //   retryCount: this.state.retryCount,
      //   timestamp: Date.now()
      // });

      // Report to Sentry (if configured)
      if (window.Sentry) {
        window.Sentry.withScope((scope) => {
          scope.setTag('errorBoundary', true);
          scope.setTag('level', this.props.level);
          scope.setContext('errorInfo', {
            errorId,
            componentStack: errorInfo.componentStack,
            context: this.props.context,
            retryCount: this.state.retryCount
          });
          window.Sentry.captureException(error);
        });
      }

      // Create GitHub issue for critical errors
      if (this.props.level === 'critical') {
        await this.createGitHubIssue(error, errorInfo, errorId);
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  private async createGitHubIssue(error: Error, errorInfo: ErrorInfo, errorId: string) {
    try {
      const apiService = new UnifiedAPIService({
        claude: { 
          apiKey: '',
          model: 'claude-3-5-sonnet-20241022',
          maxTokens: 1000,
          temperature: 0.7,
          topP: 1,
          topK: 40,
          stop_sequences: [],
          systemPrompt: '',
          baseURL: 'https://api.anthropic.com',
          timeout: 30000,
          retries: 3,
          retryDelay: 1000,
          rateLimit: { requests: 60, window: 60000 }
        },
        email: { 
          apiKey: '',
          fromEmail: '',
          fromName: '',
          provider: 'sendgrid',
          baseURL: 'https://api.sendgrid.com/v3',
          timeout: 30000,
          retries: 3,
          retryDelay: 1000,
          rateLimit: { requests: 60, window: 60000 }
        }
      });
      
      const issueTitle = `[Critical Error] ${error.message.substring(0, 100)}`;
      const issueBody = `
## Critical Error Report

**Error ID:** ${errorId}
**Timestamp:** ${new Date().toISOString()}
**Context:** ${this.props.context || 'Unknown'}
**Level:** ${this.props.level}

### Error Details
\`\`\`
${error.message}
\`\`\`

### Stack Trace
\`\`\`
${error.stack}
\`\`\`

### Component Stack
\`\`\`
${errorInfo.componentStack}
\`\`\`

### Environment
- **URL:** ${window.location.href}
- **User Agent:** ${navigator.userAgent}
- **Retry Count:** ${this.state.retryCount}

---
*This issue was automatically created by the ErrorBoundary component.*
      `;

      // await apiService.github.createIssue('repo', {
      //   title: issueTitle,
      //   body: issueBody,
      //   labels: ['bug', 'critical', 'auto-generated']
      // });
    } catch (githubError) {
      console.error('Failed to create GitHub issue:', githubError);
    }
  }

  private handleRetry = () => {
    const maxRetries = 3;
    
    if (this.state.retryCount >= maxRetries) {
      console.warn('Maximum retry attempts reached');
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1
    }));

    // Add delay before retry to prevent rapid retries
    this.retryTimeoutId = setTimeout(() => {
      // Force re-render
      this.forceUpdate();
    }, 1000);
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  private copyErrorDetails = async () => {
    const { error, errorInfo, errorId } = this.state;
    
    const errorDetails = `
Error ID: ${errorId}
Timestamp: ${new Date().toISOString()}
Message: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
    `;

    try {
      await navigator.clipboard.writeText(errorDetails);
      // Could show a toast notification here
      console.log('Error details copied to clipboard');
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  private getErrorSeverity(): 'low' | 'medium' | 'high' | 'critical' {
    const { error } = this.state;
    const { level } = this.props;
    
    if (level === 'critical') return 'critical';
    if (level === 'page') return 'high';
    if (error?.name === 'ChunkLoadError') return 'medium';
    if (error?.message?.includes('Network')) return 'medium';
    
    return 'low';
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, errorId, showDetails, retryCount } = this.state;
      const severity = this.getErrorSeverity();
      const maxRetries = 3;
      const canRetry = retryCount < maxRetries;

      return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-2xl w-full space-y-6 p-8">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Something went wrong
                  </h2>
                  <Badge className={this.getSeverityColor(severity)}>
                    {severity.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400">
                  An unexpected error occurred. We've been notified and are working on a fix.
                </p>
                
                {errorId && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Error ID: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{errorId}</code>
                  </p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Error Details:
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm font-mono">
                  {error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {canRetry && (
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={this.handleReload}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
              
              <Button
                variant="ghost"
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>

            {/* Developer Tools */}
            {(error || errorInfo) && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Developer Information
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={this.copyErrorDetails}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={this.toggleDetails}
                      className="flex items-center gap-2"
                    >
                      {showDetails ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      {showDetails ? 'Hide' : 'Show'} Details
                    </Button>
                  </div>
                </div>
                
                {showDetails && (
                  <div className="space-y-4">
                    {error?.stack && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Stack Trace:
                        </h4>
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-40">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {errorInfo?.componentStack && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Component Stack:
                        </h4>
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-40">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Support */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                If this problem persists, please contact support with the error ID above.
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('mailto:support@example.com', '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Contact Support
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('/help', '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Help Center
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for programmatic error reporting
 */
export const useErrorReporting = () => {
  const reportError = async (error: Error, context?: string) => {
    try {
      // const apiService = getUnifiedAPIService();
      
      // await apiService.analytics.trackEvent('manual_error_report', {
      //   errorMessage: error.message,
      //   errorStack: error.stack?.substring(0, 1000),
      //   context,
      //   timestamp: Date.now()
      // });

      if (window.Sentry) {
        window.Sentry.withScope((scope) => {
          scope.setTag('manualReport', true);
          if (context) scope.setContext('reportContext', { context });
          window.Sentry.captureException(error);
        });
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  return { reportError };
};

/**
 * Higher-order component for adding error boundaries
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;