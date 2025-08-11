import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Lock, User } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'guest';
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard Component
 * 
 * Protects routes that require authentication and/or specific roles.
 * Features:
 * - Authentication checking
 * - Role-based access control
 * - Automatic redirection to login
 * - Loading states
 * - Custom fallback components
 * - Breadcrumb integration
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole = 'user',
  fallback,
  redirectTo
}) => {
  const location = useLocation();
  const { user, isAuthenticated, initialized } = useAppStore();

  // Show loading while app is initializing
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400">Initializing application...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    // Custom fallback for unauthenticated users
    if (fallback) {
      return <>{fallback}</>;
    }

    // Redirect to login with return URL
    const returnUrl = redirectTo || location.pathname + location.search;
    return (
      <Navigate 
        to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} 
        state={{ from: location }}
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole && !hasRequiredRole(user.role, requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Required role: <span className="font-medium">{requiredRole}</span>
              <br />
              Your role: <span className="font-medium">{user.role}</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Go Back
            </Button>
            
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

/**
 * Check if user has required role
 */
function hasRequiredRole(
  userRole: 'admin' | 'user' | 'guest',
  requiredRole: 'admin' | 'user' | 'guest'
): boolean {
  const roleHierarchy = {
    guest: 0,
    user: 1,
    admin: 2
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Hook for checking authentication status
 */
export const useAuth = () => {
  const { user, isAuthenticated, initialized } = useAppStore();
  
  return {
    user,
    isAuthenticated,
    initialized,
    isLoading: !initialized,
    hasRole: (role: 'admin' | 'user' | 'guest') => {
      return user ? hasRequiredRole(user.role, role) : false;
    },
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    isGuest: user?.role === 'guest'
  };
};

/**
 * Higher-order component for protecting components
 */
export const withAuthGuard = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, 'children'> = {}
) => {
  const WrappedComponent = (props: P) => (
    <AuthGuard {...options}>
      <Component {...props} />
    </AuthGuard>
  );
  
  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Component for conditional rendering based on auth status
 */
export const AuthConditional: React.FC<{
  authenticated?: React.ReactNode;
  unauthenticated?: React.ReactNode;
  loading?: React.ReactNode;
  role?: 'admin' | 'user' | 'guest';
  children?: React.ReactNode;
}> = ({
  authenticated,
  unauthenticated,
  loading,
  role,
  children
}) => {
  const { user, isAuthenticated, initialized } = useAppStore();
  
  if (!initialized) {
    return loading ? <>{loading}</> : <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return unauthenticated ? <>{unauthenticated}</> : null;
  }
  
  if (role && user && !hasRequiredRole(user.role, role)) {
    return null;
  }
  
  return authenticated ? <>{authenticated}</> : <>{children}</>;
};

/**
 * Hook for programmatic navigation with auth checks
 */
export const useAuthNavigation = () => {
  const { isAuthenticated } = useAppStore();
  
  const navigateWithAuth = (path: string, requireAuth = false) => {
    if (requireAuth && !isAuthenticated) {
      window.location.href = `/login?returnUrl=${encodeURIComponent(path)}`;
      return;
    }
    
    window.location.href = path;
  };
  
  return { navigateWithAuth };
};

export default AuthGuard;