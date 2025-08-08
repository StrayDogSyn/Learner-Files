'use client';

import React, { useEffect } from 'react';
import { performanceUtils, resourceHints, codeSplitting } from '@/lib/performance';
import usePerformanceMonitoring from '@/hooks/usePerformanceMonitoring';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableCriticalCSS?: boolean;
  enableResourceHints?: boolean;
  enableBundleOptimization?: boolean;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  enableCriticalCSS = true,
  enableResourceHints = true,
  enableBundleOptimization = true
}) => {
  const { measureCustomMetric } = usePerformanceMonitoring();

  useEffect(() => {
    const initializeOptimizations = async () => {
      try {
        // Track optimization start
        const startTime = performance.now();

        // Enable critical CSS loading
        if (enableCriticalCSS) {
          await performanceUtils.loadCriticalCSS();
          measureCustomMetric('critical-css-loaded', performance.now() - startTime);
        }

        // Add resource hints
        if (enableResourceHints) {
          // Preload critical resources
          resourceHints.preloadResource('/fonts/inter-var.woff2', 'font', 'font/woff2');
          resourceHints.preloadResource('/api/github/stats', 'fetch');
          
          // Prefetch likely next pages
          resourceHints.prefetchResource('/projects');
          resourceHints.prefetchResource('/contact');
          resourceHints.prefetchResource('/ai-chat');
          
          // DNS prefetch for external resources
          resourceHints.dnsPrefetch('https://api.github.com');
          resourceHints.dnsPrefetch('https://trae-api-us.mchost.guru');
          
          measureCustomMetric('resource-hints-applied', performance.now() - startTime);
        }

        // Apply bundle optimizations
        if (enableBundleOptimization) {
          // Preload critical components
          codeSplitting.preloadComponent(() => import('@/components/organisms/ProjectShowcase'));
          codeSplitting.preloadComponent(() => import('@/components/organisms/ContactWizard/ContactWizard'));
          
          measureCustomMetric('bundle-optimization-applied', performance.now() - startTime);
        }

        // Track total optimization time
        const totalTime = performance.now() - startTime;
        measureCustomMetric('performance-optimization-total', totalTime);
        
        console.log(`Performance optimizations completed in ${totalTime.toFixed(2)}ms`);
      } catch (error) {
        console.error('Performance optimization failed:', error);
        measureCustomMetric('performance-optimization-error', 1);
      }
    };

    initializeOptimizations();
  }, [enableCriticalCSS, enableResourceHints, enableBundleOptimization, measureCustomMetric]);

  // Monitor performance budget
  useEffect(() => {
    const checkPerformanceBudget = () => {
      const budget = {
        maxBundleSize: 250 * 1024, // 250KB
        maxImageSize: 100 * 1024,  // 100KB
        maxFontSize: 50 * 1024,    // 50KB
        maxLCP: 2500,              // 2.5s
        maxFID: 100,               // 100ms
        maxCLS: 0.1                // 0.1
      };

      performanceUtils.checkPerformanceBudget(budget).then(results => {
        if (results.violations.length > 0) {
          console.warn('Performance budget violations:', results.violations);
          measureCustomMetric('performance-budget-violations', results.violations.length);
        } else {
          measureCustomMetric('performance-budget-passed', 1);
        }
      });
    };

    // Check budget after initial load
    const timer = setTimeout(checkPerformanceBudget, 3000);
    return () => clearTimeout(timer);
  }, [measureCustomMetric]);

  return (
    <>
      {children}
      {/* Performance monitoring script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Inline critical performance monitoring
            (function() {
              const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                  }
                  if (entry.entryType === 'first-input') {
                    console.log('FID:', entry.processingStart - entry.startTime);
                  }
                  if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                    console.log('CLS:', entry.value);
                  }
                }
              });
              
              try {
                observer.observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
              } catch (e) {
                console.warn('Performance Observer not supported');
              }
            })();
          `
        }}
      />
    </>
  );
};

export default PerformanceOptimizer;