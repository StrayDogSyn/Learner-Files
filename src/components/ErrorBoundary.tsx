import React, { Component, ErrorInfo, ReactNode } from 'react';
import { performanceMonitor } from '@/utils/performance';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    performanceMonitor.trackError({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: performanceMonitor.getSessionId()
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary p-8 text-center">
          <div className="glass-card p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-medium-grey mb-6">
              We've been notified of this error and are working to fix it.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="glass-button px-6 py-2 rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;