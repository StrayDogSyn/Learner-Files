/**
 * Performance Test Suite
 * Automated tests for performance monitoring and optimization
 */

import PerformanceMonitor from '../utils/performance';

interface PerformanceTestResult {
  testName: string;
  passed: boolean;
  actualValue: number;
  expectedThreshold: number;
  message: string;
}

interface PerformanceTestSuite {
  webVitals: PerformanceTestResult[];
  customMetrics: PerformanceTestResult[];
  optimizations: PerformanceTestResult[];
  overall: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    summary: string;
  };
}

class PerformanceTestRunner {
  private results: PerformanceTestResult[] = [];
  private startTime: number = 0;

  async runFullSuite(): Promise<PerformanceTestSuite> {
    console.log('🚀 Starting Performance Test Suite...');
    this.startTime = performance.now();

    const webVitals = await this.testWebVitals();
    const customMetrics = await this.testCustomMetrics();
    const optimizations = await this.testOptimizations();

    const suite: PerformanceTestSuite = {
      webVitals,
      customMetrics,
      optimizations,
      overall: this.calculateOverallScore([...webVitals, ...customMetrics, ...optimizations])
    };

    this.logResults(suite);
    return suite;
  }

  private async testWebVitals(): Promise<PerformanceTestResult[]> {
    console.log('📊 Testing Web Vitals...');
    
    const metrics = PerformanceMonitor.getMetrics();
    const tests: PerformanceTestResult[] = [];

    // Test Largest Contentful Paint (LCP)
    if (metrics.LCP !== undefined) {
      tests.push({
        testName: 'Largest Contentful Paint (LCP)',
        passed: metrics.LCP <= 2500,
        actualValue: metrics.LCP,
        expectedThreshold: 2500,
        message: metrics.LCP <= 2500 ? 'Excellent LCP' : 
                metrics.LCP <= 4000 ? 'Needs improvement' : 'Poor LCP'
      });
    }

    // Test First Input Delay (FID)
    if (metrics.FID !== undefined) {
      tests.push({
        testName: 'First Input Delay (FID)',
        passed: metrics.FID <= 100,
        actualValue: metrics.FID,
        expectedThreshold: 100,
        message: metrics.FID <= 100 ? 'Excellent FID' : 
                metrics.FID <= 300 ? 'Needs improvement' : 'Poor FID'
      });
    }

    // Test Cumulative Layout Shift (CLS)
    if (metrics.CLS !== undefined) {
      tests.push({
        testName: 'Cumulative Layout Shift (CLS)',
        passed: metrics.CLS <= 0.1,
        actualValue: metrics.CLS,
        expectedThreshold: 0.1,
        message: metrics.CLS <= 0.1 ? 'Excellent CLS' : 
                metrics.CLS <= 0.25 ? 'Needs improvement' : 'Poor CLS'
      });
    }

    return tests;
  }

  private async testCustomMetrics(): Promise<PerformanceTestResult[]> {
    console.log('⚡ Testing Custom Performance Metrics...');
    
    const metrics = PerformanceMonitor.getMetrics();
    const tests: PerformanceTestResult[] = [];

    // Test Load Time
    if (metrics.loadTime !== undefined) {
      tests.push({
        testName: 'Page Load Time',
        passed: metrics.loadTime <= 3000,
        actualValue: metrics.loadTime,
        expectedThreshold: 3000,
        message: metrics.loadTime <= 3000 ? 'Fast load time' : 'Slow load time'
      });
    }

    // Test Render Time
    if (metrics.renderTime !== undefined) {
      tests.push({
        testName: 'Initial Render Time',
        passed: metrics.renderTime <= 16.67, // 60fps threshold
        actualValue: metrics.renderTime,
        expectedThreshold: 16.67,
        message: metrics.renderTime <= 16.67 ? 'Smooth rendering' : 'Choppy rendering'
      });
    }

    // Test Memory Usage
    if (metrics.memoryUsed !== undefined && metrics.memoryTotal !== undefined) {
      const memoryUsage = (metrics.memoryUsed / metrics.memoryTotal) * 100;
      tests.push({
        testName: 'Memory Usage',
        passed: memoryUsage <= 70,
        actualValue: memoryUsage,
        expectedThreshold: 70,
        message: memoryUsage <= 70 ? 'Healthy memory usage' : 'High memory usage'
      });
    }

    return tests;
  }

  private async testOptimizations(): Promise<PerformanceTestResult[]> {
    console.log('🔧 Testing Performance Optimizations...');
    
    const tests: PerformanceTestResult[] = [];

    // Test Service Worker Registration
    const swRegistered = 'serviceWorker' in navigator && 
                        (await navigator.serviceWorker.getRegistration()) !== undefined;
    tests.push({
      testName: 'Service Worker Registration',
      passed: swRegistered,
      actualValue: swRegistered ? 1 : 0,
      expectedThreshold: 1,
      message: swRegistered ? 'Service Worker active' : 'Service Worker not registered'
    });

    // Test Lazy Loading Implementation
    const lazyImages = document.querySelectorAll('img[data-src]').length;
    const totalImages = document.querySelectorAll('img').length;
    const lazyLoadingRatio = totalImages > 0 ? (lazyImages / totalImages) * 100 : 0;
    
    tests.push({
      testName: 'Lazy Loading Implementation',
      passed: lazyLoadingRatio >= 50,
      actualValue: lazyLoadingRatio,
      expectedThreshold: 50,
      message: lazyLoadingRatio >= 50 ? 'Good lazy loading coverage' : 'Low lazy loading usage'
    });

    // Test Resource Hints
    const preconnectLinks = document.querySelectorAll('link[rel="preconnect"]').length;
    const prefetchLinks = document.querySelectorAll('link[rel="dns-prefetch"]').length;
    const preloadLinks = document.querySelectorAll('link[rel="preload"]').length;
    const totalHints = preconnectLinks + prefetchLinks + preloadLinks;

    tests.push({
      testName: 'Resource Hints Usage',
      passed: totalHints >= 3,
      actualValue: totalHints,
      expectedThreshold: 3,
      message: totalHints >= 3 ? 'Good resource hints usage' : 'Consider adding more resource hints'
    });

    // Test Caching Strategy
    const cacheTest = await this.testCaching();
    tests.push(cacheTest);

    return tests;
  }

  private async testCaching(): Promise<PerformanceTestResult> {
    try {
      // Test if resources are being cached
      const cacheNames = await caches.keys();
      const hasCaches = cacheNames.length > 0;

      return {
        testName: 'Caching Strategy',
        passed: hasCaches,
        actualValue: cacheNames.length,
        expectedThreshold: 1,
        message: hasCaches ? `${cacheNames.length} cache(s) active` : 'No caching detected'
      };
    } catch {
      return {
        testName: 'Caching Strategy',
        passed: false,
        actualValue: 0,
        expectedThreshold: 1,
        message: 'Cache API not supported'
      };
    }
  }

  private calculateOverallScore(allTests: PerformanceTestResult[]): {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    summary: string;
  } {
    const totalTests = allTests.length;
    const passedTests = allTests.filter(test => test.passed).length;
    const score = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';

    const summary = `${passedTests}/${totalTests} tests passed (${score.toFixed(1)}%)`;

    return { score, grade, summary };
  }

  private logResults(suite: PerformanceTestSuite): void {
    const totalTime = performance.now() - this.startTime;
    
    console.log('\n🎯 Performance Test Suite Results');
    console.log('=====================================');
    console.log(`Overall Grade: ${suite.overall.grade}`);
    console.log(`Overall Score: ${suite.overall.score.toFixed(1)}%`);
    console.log(`Summary: ${suite.overall.summary}`);
    console.log(`Test Duration: ${totalTime.toFixed(2)}ms\n`);

    // Log Web Vitals Results
    if (suite.webVitals.length > 0) {
      console.log('📊 Web Vitals:');
      suite.webVitals.forEach(test => {
        const icon = test.passed ? '✅' : '❌';
        console.log(`${icon} ${test.testName}: ${test.actualValue.toFixed(2)} (threshold: ${test.expectedThreshold})`);
      });
      console.log('');
    }

    // Log Custom Metrics Results
    if (suite.customMetrics.length > 0) {
      console.log('⚡ Custom Metrics:');
      suite.customMetrics.forEach(test => {
        const icon = test.passed ? '✅' : '❌';
        console.log(`${icon} ${test.testName}: ${test.actualValue.toFixed(2)} (threshold: ${test.expectedThreshold})`);
      });
      console.log('');
    }

    // Log Optimization Results
    if (suite.optimizations.length > 0) {
      console.log('🔧 Optimizations:');
      suite.optimizations.forEach(test => {
        const icon = test.passed ? '✅' : '❌';
        console.log(`${icon} ${test.testName}: ${test.message}`);
      });
      console.log('');
    }

    // Performance recommendations
    this.logRecommendations(suite);
  }

  private logRecommendations(suite: PerformanceTestSuite): void {
    const failedTests = [
      ...suite.webVitals,
      ...suite.customMetrics,
      ...suite.optimizations
    ].filter(test => !test.passed);

    if (failedTests.length > 0) {
      console.log('💡 Performance Recommendations:');
      console.log('================================');
      
      failedTests.forEach(test => {
        console.log(`• ${test.testName}: ${test.message}`);
      });
      
      console.log('\nGeneral recommendations:');
      console.log('• Optimize images and use modern formats (WebP, AVIF)');
      console.log('• Implement code splitting and lazy loading');
      console.log('• Use a Content Delivery Network (CDN)');
      console.log('• Enable compression (Gzip/Brotli)');
      console.log('• Minimize and bundle CSS/JavaScript');
      console.log('• Use resource hints (preload, prefetch, preconnect)');
    }
  }
}

// Export test runner and utilities
export { PerformanceTestRunner, type PerformanceTestSuite, type PerformanceTestResult };

// Auto-run tests in development mode
if (process.env.NODE_ENV === 'development') {
  // Auto-run performance tests after page load
  window.addEventListener('load', async () => {
    // Wait a bit for metrics to be collected
    setTimeout(async () => {
      const testRunner = new PerformanceTestRunner();
      await testRunner.runFullSuite();
    }, 2000);
  });
}
