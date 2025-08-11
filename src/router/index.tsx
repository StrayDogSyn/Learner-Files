import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorFallback } from '@/components/ui/ErrorFallback';
import { Layout } from '@/components/layout/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { GameGuard } from '@/components/auth/GameGuard';
import { NotFound } from '@/pages/NotFound';

// Lazy load all pages and components for optimal performance

// Main Pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));

// Auth Pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Game Pages
const GamesPage = lazy(() => import('@/pages/games/GamesPage'));
const GameDetailsPage = lazy(() => import('@/pages/games/GameDetailsPage'));
const LeaderboardPage = lazy(() => import('@/pages/games/LeaderboardPage'));
const AchievementsPage = lazy(() => import('@/pages/games/AchievementsPage'));
const GamificationHub = lazy(() => import('@/pages/GamificationHub'));

// Individual Game Components (wrapped)
const KnucklebonesGame = lazy(() => import('@/components/games/KnucklebonesWrapper'));
const CalculatorGame = lazy(() => import('@/components/games/CalculatorWrapper'));
const QuizNinjaGame = lazy(() => import('@/components/games/QuizNinjaWrapper'));
const CountdownGame = lazy(() => import('@/components/games/CountdownWrapper'));
const RockPaperScissorsGame = lazy(() => import('@/components/games/RockPaperScissorsWrapper'));
const CompTIAGame = lazy(() => import('@/components/games/CompTIAWrapper'));

// Project Pages
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage'));
const ProjectDetailsPage = lazy(() => import('@/pages/projects/ProjectDetailsPage'));
const CreateProjectPage = lazy(() => import('@/pages/projects/CreateProjectPage'));
const EditProjectPage = lazy(() => import('@/pages/projects/EditProjectPage'));

// Analytics Pages
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'));
const PerformancePage = lazy(() => import('@/pages/analytics/PerformancePage'));
const UsageStatsPage = lazy(() => import('@/pages/analytics/UsageStatsPage'));

// API Pages
const APIDocsPage = lazy(() => import('@/pages/api/APIDocsPage'));
const APITestingPage = lazy(() => import('@/pages/api/APITestingPage'));
const WebhooksPage = lazy(() => import('@/pages/api/WebhooksPage'));

// Admin Pages
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'));
const UserManagementPage = lazy(() => import('@/pages/admin/UserManagementPage'));
const SystemHealthPage = lazy(() => import('@/pages/admin/SystemHealthPage'));
const LogsPage = lazy(() => import('@/pages/admin/LogsPage'));

// Help & Documentation
const HelpPage = lazy(() => import('@/pages/help/HelpPage'));
const DocumentationPage = lazy(() => import('@/pages/help/DocumentationPage'));
const TutorialsPage = lazy(() => import('@/pages/help/TutorialsPage'));
const FAQPage = lazy(() => import('@/pages/help/FAQPage'));

// Loading component with enhanced UX
const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 dark:text-gray-400 animate-pulse">{message}</p>
    </div>
  </div>
);

// Enhanced Suspense wrapper with error boundary
const SuspenseWrapper: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorMessage?: string;
}> = ({ 
  children, 
  fallback = <PageLoader />, 
  errorMessage = 'Something went wrong loading this page.' 
}) => (
  <ErrorBoundary
    FallbackComponent={({ error, resetErrorBoundary }) => (
      <ErrorFallback
        error={error}
        resetErrorBoundary={resetErrorBoundary}
        message={errorMessage}
      />
    )}
    onError={(error, errorInfo) => {
      console.error('Route Error:', error, errorInfo);
      // Track error in analytics
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: false
        });
      }
    }}
  >
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Route configuration with metadata
export const routeConfig = {
  // Public routes
  public: [
    {
      path: '/',
      element: <HomePage />,
      title: 'Home',
      description: 'Welcome to Learner Files - Your comprehensive learning platform'
    },
    {
      path: '/about',
      element: <AboutPage />,
      title: 'About',
      description: 'Learn more about our platform and mission'
    },
    {
      path: '/contact',
      element: <ContactPage />,
      title: 'Contact',
      description: 'Get in touch with our team'
    },
    {
      path: '/help',
      element: <HelpPage />,
      title: 'Help Center',
      description: 'Find answers to your questions'
    },
    {
      path: '/help/documentation',
      element: <DocumentationPage />,
      title: 'Documentation',
      description: 'Comprehensive platform documentation'
    },
    {
      path: '/help/tutorials',
      element: <TutorialsPage />,
      title: 'Tutorials',
      description: 'Step-by-step guides and tutorials'
    },
    {
      path: '/help/faq',
      element: <FAQPage />,
      title: 'FAQ',
      description: 'Frequently asked questions'
    }
  ],
  
  // Auth routes
  auth: [
    {
      path: '/login',
      element: <LoginPage />,
      title: 'Login',
      description: 'Sign in to your account'
    },
    {
      path: '/register',
      element: <RegisterPage />,
      title: 'Register',
      description: 'Create a new account'
    },
    {
      path: '/forgot-password',
      element: <ForgotPasswordPage />,
      title: 'Forgot Password',
      description: 'Reset your password'
    },
    {
      path: '/reset-password',
      element: <ResetPasswordPage />,
      title: 'Reset Password',
      description: 'Set a new password'
    }
  ],
  
  // Protected routes
  protected: [
    {
      path: '/dashboard',
      element: <DashboardPage />,
      title: 'Dashboard',
      description: 'Your personal dashboard'
    },
    {
      path: '/profile',
      element: <ProfilePage />,
      title: 'Profile',
      description: 'Manage your profile settings'
    },
    {
      path: '/settings',
      element: <SettingsPage />,
      title: 'Settings',
      description: 'Configure your preferences'
    }
  ],
  
  // Game routes
  games: [
    {
      path: '/games',
      element: <GamesPage />,
      title: 'Games',
      description: 'Explore our collection of educational games'
    },
    {
      path: '/gamification',
      element: <GamificationHub />,
      title: 'Gamification Hub',
      description: 'Interactive coding challenges and skill demonstrations'
    },
    {
      path: '/games/:gameId',
      element: <GameDetailsPage />,
      title: 'Game Details',
      description: 'Game information and statistics'
    },
    {
      path: '/games/leaderboard',
      element: <LeaderboardPage />,
      title: 'Leaderboard',
      description: 'Top players and scores'
    },
    {
      path: '/games/achievements',
      element: <AchievementsPage />,
      title: 'Achievements',
      description: 'Your gaming achievements'
    },
    // Individual game routes
    {
      path: '/play/knucklebones',
      element: <KnucklebonesGame />,
      title: 'Knucklebones',
      description: 'Strategic dice placement game'
    },
    {
      path: '/play/calculator',
      element: <CalculatorGame />,
      title: 'Calculator',
      description: 'Advanced calculator with multiple modes'
    },
    {
      path: '/play/quiz-ninja',
      element: <QuizNinjaGame />,
      title: 'Quiz Ninja',
      description: 'Test your knowledge with interactive quizzes'
    },
    {
      path: '/play/countdown',
      element: <CountdownGame />,
      title: 'Countdown Timer',
      description: 'Customizable countdown timer'
    },
    {
      path: '/play/rock-paper-scissors',
      element: <RockPaperScissorsGame />,
      title: 'Rock Paper Scissors',
      description: 'Classic game with AI opponent'
    },
    {
      path: '/play/comptia',
      element: <CompTIAGame />,
      title: 'CompTIA Practice',
      description: 'CompTIA certification practice tests'
    }
  ],
  
  // Project routes
  projects: [
    {
      path: '/projects',
      element: <ProjectsPage />,
      title: 'Projects',
      description: 'Manage your learning projects'
    },
    {
      path: '/projects/create',
      element: <CreateProjectPage />,
      title: 'Create Project',
      description: 'Start a new learning project'
    },
    {
      path: '/projects/:projectId',
      element: <ProjectDetailsPage />,
      title: 'Project Details',
      description: 'View and manage project details'
    },
    {
      path: '/projects/:projectId/edit',
      element: <EditProjectPage />,
      title: 'Edit Project',
      description: 'Modify project settings'
    }
  ],
  
  // Analytics routes
  analytics: [
    {
      path: '/analytics',
      element: <AnalyticsPage />,
      title: 'Analytics',
      description: 'View your learning analytics'
    },
    {
      path: '/analytics/performance',
      element: <PerformancePage />,
      title: 'Performance',
      description: 'Performance metrics and insights'
    },
    {
      path: '/analytics/usage',
      element: <UsageStatsPage />,
      title: 'Usage Statistics',
      description: 'Platform usage statistics'
    }
  ],
  
  // API routes
  api: [
    {
      path: '/api/docs',
      element: <APIDocsPage />,
      title: 'API Documentation',
      description: 'Comprehensive API documentation'
    },
    {
      path: '/api/testing',
      element: <APITestingPage />,
      title: 'API Testing',
      description: 'Test API endpoints'
    },
    {
      path: '/api/webhooks',
      element: <WebhooksPage />,
      title: 'Webhooks',
      description: 'Manage webhook configurations'
    }
  ],
  
  // Admin routes
  admin: [
    {
      path: '/admin',
      element: <AdminPage />,
      title: 'Admin Panel',
      description: 'Administrative dashboard'
    },
    {
      path: '/admin/users',
      element: <UserManagementPage />,
      title: 'User Management',
      description: 'Manage platform users'
    },
    {
      path: '/admin/health',
      element: <SystemHealthPage />,
      title: 'System Health',
      description: 'Monitor system health and performance'
    },
    {
      path: '/admin/logs',
      element: <LogsPage />,
      title: 'System Logs',
      description: 'View system logs and events'
    }
  ]
};

// Create the router with all routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseWrapper fallback={<PageLoader message="Loading application..." />}>
        <Layout>
          <Outlet />
        </Layout>
      </SuspenseWrapper>
    ),
    errorElement: (
      <ErrorFallback 
        error={new Error('Application failed to load')} 
        resetErrorBoundary={() => window.location.reload()}
        message="The application encountered an error. Please refresh the page."
      />
    ),
    children: [
      // Public routes
      ...routeConfig.public.map(route => ({
        path: route.path === '/' ? '' : route.path,
        element: (
          <SuspenseWrapper fallback={<PageLoader message={`Loading ${route.title}...`} />}>
            {route.element}
          </SuspenseWrapper>
        )
      })),
      
      // Auth routes (no auth guard needed)
      ...routeConfig.auth.map(route => ({
        path: route.path,
        element: (
          <SuspenseWrapper fallback={<PageLoader message={`Loading ${route.title}...`} />}>
            {route.element}
          </SuspenseWrapper>
        )
      })),
      
      // Protected routes
      ...routeConfig.protected.map(route => ({
        path: route.path,
        element: (
          <AuthGuard>
            <SuspenseWrapper fallback={<PageLoader message={`Loading ${route.title}...`} />}>
              {route.element}
            </SuspenseWrapper>
          </AuthGuard>
        )
      })),
      
      // Game routes
      ...routeConfig.games.map(route => ({
        path: route.path,
        element: route.path.startsWith('/play/') ? (
          <GameGuard>
            <SuspenseWrapper fallback={<PageLoader message={`Loading ${route.title}...`} />}>
              {route.element}
            </SuspenseWrapper>
          </GameGuard>
        ) : (
          <SuspenseWrapper fallback={<PageLoader message={`Loading ${route.title}...`} />}>
            {route.element}
          </SuspenseWrapper>
        )
      })),
      
      // Project routes (protected)
      ...routeConfig.projects.map(route => ({
        path: route.path,
        element: (
          <AuthGuard>
            <SuspenseWrapper fallback={<PageLoader message={`Loading ${route.title}...`} />}>
              {route.element}
            </SuspenseWrapper>
          </AuthGuard>
        )
      })),
      
      // Analytics routes (protected)
      ...routeConfig.analytics.map(route => ({
        path: route.path,
        element: (
          <AuthGuard>
            <SuspenseWrapper fallback={<PageLoader message={`Loading ${route.title}...`} />}>
              {route.element}
            </SuspenseWrapper>
          </AuthGuard>
        )
      })),
      
      // API routes
      ...routeConfig.api.map(route => ({
        path: route.path,
        element: (
          <SuspenseWrapper fallback={<PageLoader message={`Loading ${route.title}...`} />}>
            {route.element}
          </SuspenseWrapper>
        )
      })),
      
      // Admin routes (protected with admin role)
      ...routeConfig.admin.map(route => ({
        path: route.path,
        element: (
          <AuthGuard requiredRole="admin">
            <SuspenseWrapper fallback={<PageLoader message={`Loading ${route.title}...`} />}>
              {route.element}
            </SuspenseWrapper>
          </AuthGuard>
        )
      })),
      
      // 404 route
      {
        path: '*',
        element: (
          <SuspenseWrapper>
            <NotFound />
          </SuspenseWrapper>
        )
      }
    ]
  }
]);

// Router Provider component
export const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
              Application Error
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={resetErrorBoundary}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('Router Error:', error, errorInfo);
        // Track critical error
        if (window.gtag) {
          window.gtag('event', 'exception', {
            description: `Router Error: ${error.message}`,
            fatal: true
          });
        }
      }}
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

// Route utilities
export const getRouteByPath = (path: string) => {
  const allRoutes = [
    ...routeConfig.public,
    ...routeConfig.auth,
    ...routeConfig.protected,
    ...routeConfig.games,
    ...routeConfig.projects,
    ...routeConfig.analytics,
    ...routeConfig.api,
    ...routeConfig.admin
  ];
  
  return allRoutes.find(route => route.path === path);
};

export const getRoutesByCategory = (category: keyof typeof routeConfig) => {
  return routeConfig[category] || [];
};

export const getAllRoutes = () => {
  return Object.values(routeConfig).flat();
};

export const getGameRoutes = () => {
  return routeConfig.games.filter(route => route.path.startsWith('/play/'));
};

export const getNavigationRoutes = () => {
  return [
    ...routeConfig.public.filter(route => !['/', '/contact'].includes(route.path)),
    ...routeConfig.games.filter(route => ['/games', '/games/leaderboard', '/games/achievements'].includes(route.path)),
    ...routeConfig.projects.filter(route => route.path === '/projects'),
    ...routeConfig.analytics.filter(route => route.path === '/analytics')
  ];
};

// Route metadata for SEO and navigation
export const routeMetadata = {
  getTitle: (path: string) => {
    const route = getRouteByPath(path);
    return route?.title || 'Learner Files';
  },
  
  getDescription: (path: string) => {
    const route = getRouteByPath(path);
    return route?.description || 'Your comprehensive learning platform';
  },
  
  getBreadcrumbs: (path: string) => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/' }];
    
    let currentPath = '';
    segments.forEach(segment => {
      currentPath += `/${segment}`;
      const route = getRouteByPath(currentPath);
      if (route) {
        breadcrumbs.push({
          label: route.title,
          path: currentPath
        });
      } else {
        // Fallback for dynamic routes
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          path: currentPath
        });
      }
    });
    
    return breadcrumbs;
  }
};

export default AppRouter;