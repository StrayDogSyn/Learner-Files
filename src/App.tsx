import { useEffect } from "react";
import { motion } from "framer-motion";
import { initializeFontLoading } from "@/utils/fontLoading";
import { initSentryWithEnvironment } from "@/utils/sentry";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { AppRouter } from "@/router";
import { useAppStore } from "@/store/appStore";
import { getUnifiedAPIService } from "@/services/api";
import ChatbotWidget from "@/components/ChatbotWidget";
import AIChat from "@/components/AIChat";
import Performance from "@/components/Performance";
import Navigation from "@/components/Navigation";
import BrandLogo from "@/components/BrandLogo";

// Import CSS files
import "./css/glassmorphic-design-system.css";
import "./css/brand-system.css";
import "./css/hero.css";
import "./css/projects.css";
import "./css/navigation.css";
import "./styles/theme-transitions.css";
import "./styles/animations.css";
import "./styles/accessibility.css";
import "./styles/performance-optimizations.css";

export default function App() {
  const { initializeApp, initialized } = useAppStore();

  useEffect(() => {
    const initializeApplication = async () => {
      try {
        // Initialize Sentry for error monitoring
        initSentryWithEnvironment();
        
        // Initialize optimized font loading
        initializeFontLoading();
        
        // Initialize the unified API service
        const apiService = getUnifiedAPIService();
        await apiService.initialize();
        
        // Initialize the app store
        await initializeApp();
        
        // Track app initialization
        await apiService.analytics.trackEvent('app_initialized', {
          timestamp: Date.now(),
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          environment: import.meta.env.VITE_ENVIRONMENT || 'development'
        });
        
        console.log('Application initialized successfully');
      } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Report initialization error
        if (window.Sentry) {
          window.Sentry.captureException(error);
        }
      }
    };
    
    initializeApplication();
  }, [initializeApp]);
  
  // Show loading screen while app is initializing
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-hunter-green flex items-center justify-center">
        <div className="glass p-8 border border-emerald-500/20 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xl text-emerald-400">Initializing Application...</span>
          </div>
          <p className="text-sm text-medium-grey">Setting up services and loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      level="critical"
      context="app-root"
      onError={(error, errorInfo) => {
        console.error('Critical app error:', error, errorInfo);
      }}
    >
      <div className="min-h-screen glass-background-main">
        {/* Brand Banner */}
        <motion.div 
          className="glass-brand-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <BrandLogo size="sm" showTagline={true} variant="straydog" />
              <motion.div 
                className="hidden md:flex items-center gap-4 text-xs text-medium-grey"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-accent rounded-full animate-pulse"></div>
                  AI Systems Online
                </span>
                <span className="text-gunmetal">|</span>
                <span>Portfolio v4.0</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <Navigation />
        
        {/* Main Router with Error Boundaries */}
        <ErrorBoundary
          level="page"
          context="main-router"
          showDetails={import.meta.env.VITE_ENVIRONMENT === 'development'}
        >
          <AppRouter />
        </ErrorBoundary>
        
        {/* Advanced Features with Error Boundaries */}
        <ErrorBoundary level="component" context="chatbot-widget">
          <ChatbotWidget />
        </ErrorBoundary>
        
        <ErrorBoundary level="component" context="ai-chat">
          <AIChat />
        </ErrorBoundary>
        
        <ErrorBoundary level="component" context="performance">
          <Performance />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}
