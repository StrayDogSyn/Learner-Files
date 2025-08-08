'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X } from 'lucide-react';
import serviceWorkerManager, { networkUtils, pwaUtils } from '@/lib/serviceWorker';
import usePerformanceMonitoring from '@/hooks/usePerformanceMonitoring';
import PerformanceDashboard from '@/components/performance/PerformanceDashboard';
import { Button } from '@/components/atoms/Button/Button';
import { Glass } from '@/components/atoms/Glass/Glass';
import { cn } from '@/lib/utils';

interface PerformanceContextType {
  isOnline: boolean;
  canInstallPWA: boolean;
  showPerformanceDashboard: boolean;
  performanceScore: number;
  installPWA: () => Promise<boolean>;
  togglePerformanceDashboard: () => void;
  clearCache: () => Promise<void>;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

interface PerformanceProviderProps {
  children: ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showOfflineNotification, setShowOfflineNotification] = useState(false);
  
  const { score: performanceScore } = usePerformanceMonitoring();

  // Initialize service worker and performance monitoring
  useEffect(() => {
    const initializePerformance = async () => {
      // Register service worker
      try {
        const registration = await serviceWorkerManager.register('/sw.js');
        if (registration) {
          // Service Worker registered successfully
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            setShowUpdateNotification(true);
          });
        }
      } catch {
        // Service Worker registration failed
      }

      // Setup PWA install prompt
      const cleanupPWA = pwaUtils.setupInstallPrompt();
      
      // Listen for PWA install availability
      const handlePWAInstallAvailable = () => {
        setCanInstallPWA(true);
        setShowInstallPrompt(true);
      };
      
      const handlePWAInstalled = () => {
        setCanInstallPWA(false);
        setShowInstallPrompt(false);
      };
      
      window.addEventListener('pwa-install-available', handlePWAInstallAvailable);
      window.addEventListener('pwa-installed', handlePWAInstalled);

      return () => {
        cleanupPWA();
        window.removeEventListener('pwa-install-available', handlePWAInstallAvailable);
        window.removeEventListener('pwa-installed', handlePWAInstalled);
      };
    };

    initializePerformance();
  }, []);

  // Monitor network status
  useEffect(() => {
    setIsOnline(networkUtils.isOnline());
    
    const cleanup = networkUtils.onStatusChange((online) => {
      setIsOnline(online);
      if (!online) {
        setShowOfflineNotification(true);
      } else {
        setShowOfflineNotification(false);
      }
    });

    return cleanup;
  }, []);

  // Performance dashboard keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        setShowPerformanceDashboard(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const installPWA = async (): Promise<boolean> => {
    const result = await serviceWorkerManager.promptInstall();
    if (result) {
      setShowInstallPrompt(false);
      setCanInstallPWA(false);
    }
    return result;
  };

  const togglePerformanceDashboard = () => {
    setShowPerformanceDashboard(prev => !prev);
  };

  const clearCache = async () => {
    try {
      const { cacheManager } = await import('@/lib/serviceWorker');
      await cacheManager.clearAll();
      window.location.reload();
    } catch {
      // Failed to clear cache
    }
  };

  const handleUpdateApp = async () => {
    await serviceWorkerManager.skipWaiting();
    setShowUpdateNotification(false);
    window.location.reload();
  };

  const contextValue: PerformanceContextType = {
    isOnline,
    canInstallPWA,
    showPerformanceDashboard,
    performanceScore,
    installPWA,
    togglePerformanceDashboard,
    clearCache
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
      
      {/* Performance Dashboard */}
      <PerformanceDashboard
        isVisible={showPerformanceDashboard}
        onClose={() => setShowPerformanceDashboard(false)}
      />
      
      {/* Performance Monitor Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <Button
          onClick={togglePerformanceDashboard}
          variant="outline"
          size="sm"
          className={cn(
            'p-3 rounded-full backdrop-blur-md border-white/20',
            'hover:bg-white/10 transition-all duration-300',
            performanceScore >= 90 && 'border-green-500/50 text-green-400',
            performanceScore >= 75 && performanceScore < 90 && 'border-yellow-500/50 text-yellow-400',
            performanceScore < 75 && 'border-red-500/50 text-red-400'
          )}
          title={`Performance Score: ${performanceScore} (Ctrl+Shift+P)`}
        >
          <Activity className="w-4 h-4" />
        </Button>
      </motion.div>
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {/* Update Notification */}
        <AnimatePresence>
          {showUpdateNotification && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="max-w-sm"
            >
              <Glass variant="card" className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">
                      Update Available
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      A new version of the app is ready to install.
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleUpdateApp}
                        size="sm"
                        variant="primary"
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => setShowUpdateNotification(false)}
                        size="sm"
                        variant="ghost"
                      >
                        Later
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowUpdateNotification(false)}
                    variant="ghost"
                    size="sm"
                    className="p-1 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Glass>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* PWA Install Prompt */}
        <AnimatePresence>
          {showInstallPrompt && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="max-w-sm"
            >
              <Glass variant="card" className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">
                      Install App
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Install this portfolio as an app for a better experience.
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={installPWA}
                        size="sm"
                        variant="primary"
                      >
                        Install
                      </Button>
                      <Button
                        onClick={() => setShowInstallPrompt(false)}
                        size="sm"
                        variant="ghost"
                      >
                        Not Now
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowInstallPrompt(false)}
                    variant="ghost"
                    size="sm"
                    className="p-1 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Glass>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Offline Notification */}
        <AnimatePresence>
          {showOfflineNotification && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="max-w-sm"
            >
              <Glass variant="card" className="p-4 border-yellow-500/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-400 mb-1">
                      You&apos;re Offline
                    </h4>
                    <p className="text-sm text-gray-300">
                      Some features may be limited. The app will work normally when you&apos;re back online.
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowOfflineNotification(false)}
                    variant="ghost"
                    size="sm"
                    className="p-1 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Glass>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PerformanceContext.Provider>
  );
};