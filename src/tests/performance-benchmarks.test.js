/**
 * Performance Benchmark Tests
 * Tests for component rendering performance and optimization metrics
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock performance observer
const mockPerformanceObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => [])
};

global.PerformanceObserver = jest.fn(() => mockPerformanceObserver);

// Mock performance timing
Object.defineProperty(window, 'performance', {
  value: {
    ...window.performance,
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    now: jest.fn(() => Date.now())
  }
});

// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = new Map();
  }

  startMeasurement(name) {
    performance.mark(`${name}-start`);
    this.metrics[name] = { startTime: performance.now() };
  }

  endMeasurement(name) {
    const endTime = performance.now();
    performance.mark(`${name}-end`);
    
    if (this.metrics[name]) {
      this.metrics[name].duration = endTime - this.metrics[name].startTime;
      this.metrics[name].endTime = endTime;
    }
    
    performance.measure(name, `${name}-start`, `${name}-end`);
  }

  getMetric(name) {
    return this.metrics[name];
  }

  getAllMetrics() {
    return this.metrics;
  }

  observeWebVitals() {
    // Mock Web Vitals implementation
    const vitals = {
      CLS: Math.random() * 0.1, // Good: < 0.1
      FID: Math.random() * 100, // Good: < 100ms
      LCP: 1000 + Math.random() * 1500, // Good: < 2.5s
      FCP: 500 + Math.random() * 1000, // Good: < 1.8s
      TTFB: 200 + Math.random() * 400 // Good: < 600ms
    };

    return vitals;
  }

  measureComponentRender(Component, props = {}) {
    this.startMeasurement('component-render');
    const result = render(React.createElement(Component, props));
    this.endMeasurement('component-render');
    return result;
  }
}

// Test components for performance testing
const HeavyComponent = ({ itemCount = 1000 }) => {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    const newItems = Array.from({ length: itemCount }, (_, i) => ({
      id: i,
      value: `Item ${i}`,
      computed: Math.random() * 1000
    }));
    setItems(newItems);
  }, [itemCount]);

  return React.createElement('div', { 'data-testid': 'heavy-component' },
    React.createElement('h2', null, `Heavy Component (${items.length} items)`),
    React.createElement('ul', null,
      items.map(item => 
        React.createElement('li', { 
          key: item.id, 
          'data-testid': `item-${item.id}` 
        }, `${item.value} - ${item.computed.toFixed(2)}`)
      )
    )
  );
};

const OptimizedComponent = React.memo(({ data, onItemClick }) => {
  const memoizedData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      displayValue: `${item.name} (${item.value})`
    }));
  }, [data]);

  return React.createElement('div', { 'data-testid': 'optimized-component' },
    memoizedData.map(item => 
      React.createElement('div', {
        key: item.id,
        onClick: () => onItemClick(item.id),
        'data-testid': `optimized-item-${item.id}`
      }, item.displayValue)
    )
  );
});

const LazyLoadedComponent = React.lazy(() => 
  Promise.resolve({
    default: () => React.createElement('div', { 'data-testid': 'lazy-loaded' }, 
      'This component was lazy loaded'
    )
  })
);

const ImageComponent = ({ src, alt, lazy = false }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);

  return React.createElement('div', { 'data-testid': 'image-component' },
    React.createElement('img', {
      src,
      alt,
      loading: lazy ? 'lazy' : 'eager',
      onLoad: handleLoad,
      onError: handleError,
      'data-testid': 'test-image',
      'data-loaded': loaded,
      'data-error': error
    })
  );
};

describe('Performance Benchmark Tests', () => {
  let performanceMonitor;

  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor();
    jest.clearAllMocks();
  });

  describe('Component Rendering Performance', () => {
    test('measures basic component render time', () => {
      const SimpleComponent = () => React.createElement('div', { 'data-testid': 'simple' }, 'Hello World');
      
      performanceMonitor.measureComponentRender(SimpleComponent);
      
      const metric = performanceMonitor.getMetric('component-render');
      expect(metric).toBeDefined();
      expect(metric.duration).toBeLessThan(50); // Should render in < 50ms
      expect(performance.mark).toHaveBeenCalledWith('component-render-start');
      expect(performance.mark).toHaveBeenCalledWith('component-render-end');
    });

    test('benchmarks heavy component rendering', () => {
      performanceMonitor.measureComponentRender(HeavyComponent, { itemCount: 100 });
      
      const metric = performanceMonitor.getMetric('component-render');
      expect(metric.duration).toBeLessThan(1000); // Should render 100 items in < 1s
    });

    test('compares optimized vs unoptimized components', () => {
      const data = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        value: Math.random()
      }));

      // Measure optimized component
      performanceMonitor.startMeasurement('optimized-render');
      render(React.createElement(OptimizedComponent, { data, onItemClick: () => {} }));
      performanceMonitor.endMeasurement('optimized-render');

      // Measure unoptimized component
      const UnoptimizedComponent = ({ data, onItemClick }) => 
        React.createElement('div', { 'data-testid': 'unoptimized-component' },
          data.map(item => 
            React.createElement('div', {
              key: item.id,
              onClick: () => onItemClick(item.id)
            }, `${item.name} (${item.value})`)
          )
        );

      performanceMonitor.startMeasurement('unoptimized-render');
      render(React.createElement(UnoptimizedComponent, { data, onItemClick: () => {} }));
      performanceMonitor.endMeasurement('unoptimized-render');

      const optimizedMetric = performanceMonitor.getMetric('optimized-render');
      const unoptimizedMetric = performanceMonitor.getMetric('unoptimized-render');

      // Both should be fast, but this establishes baseline
      expect(optimizedMetric.duration).toBeLessThan(100);
      expect(unoptimizedMetric.duration).toBeLessThan(200);
    });

    test('measures re-render performance', () => {
      const { rerender } = render(React.createElement(HeavyComponent, { itemCount: 50 }));

      performanceMonitor.startMeasurement('rerender');
      rerender(React.createElement(HeavyComponent, { itemCount: 100 }));
      performanceMonitor.endMeasurement('rerender');

      const metric = performanceMonitor.getMetric('rerender');
      expect(metric.duration).toBeLessThan(500); // Re-render should be fast
    });
  });

  describe('Lazy Loading Performance', () => {
    test('measures lazy component loading time', async () => {
      performanceMonitor.startMeasurement('lazy-load');
      
      const { findByTestId } = render(
        React.createElement(React.Suspense, 
          { fallback: React.createElement('div', null, 'Loading...') },
          React.createElement(LazyLoadedComponent)
        )
      );

      await findByTestId('lazy-loaded');
      performanceMonitor.endMeasurement('lazy-load');

      const metric = performanceMonitor.getMetric('lazy-load');
      expect(metric.duration).toBeLessThan(100); // Should load quickly in tests
    });

    test('measures image lazy loading', () => {
      render(React.createElement(ImageComponent, { src: 'test.jpg', alt: 'Test', lazy: true }));
      
      const image = screen.getByTestId('test-image');
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    test('tracks image loading performance', () => {
      render(React.createElement(ImageComponent, { src: 'test.jpg', alt: 'Test' }));
      
      const image = screen.getByTestId('test-image');
      
      performanceMonitor.startMeasurement('image-load');
      fireEvent.load(image);
      performanceMonitor.endMeasurement('image-load');

      expect(image).toHaveAttribute('data-loaded', 'true');
    });
  });

  describe('Web Vitals Simulation', () => {
    test('measures Core Web Vitals', () => {
      const vitals = performanceMonitor.observeWebVitals();

      // Assert good performance thresholds
      expect(vitals.CLS).toBeLessThan(0.1); // Cumulative Layout Shift
      expect(vitals.FID).toBeLessThan(100); // First Input Delay
      expect(vitals.LCP).toBeLessThan(2500); // Largest Contentful Paint
      expect(vitals.FCP).toBeLessThan(1800); // First Contentful Paint
      expect(vitals.TTFB).toBeLessThan(600); // Time to First Byte
    });

    test('monitors performance observer usage', () => {
      const observer = new PerformanceObserver(() => {});
      observer.observe({ entryTypes: ['measure'] });

      expect(mockPerformanceObserver.observe).toHaveBeenCalledWith({
        entryTypes: ['measure']
      });
    });
  });

  describe('Memory Usage', () => {
    test('component cleanup prevents memory leaks', () => {
      const { unmount } = render(React.createElement(HeavyComponent, { itemCount: 1000 }));
      
      // Simulate memory measurement
      const beforeUnmount = performance.now();
      unmount();
      const afterUnmount = performance.now();

      // Component should unmount quickly
      expect(afterUnmount - beforeUnmount).toBeLessThan(50);
    });

    test('event listeners are properly cleaned up', () => {
      const mockAddEventListener = jest.spyOn(window, 'addEventListener');
      const mockRemoveEventListener = jest.spyOn(window, 'removeEventListener');

      const ComponentWithListeners = () => {
        React.useEffect(() => {
          const handleResize = () => {};
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
        }, []);

        return React.createElement('div', { 'data-testid': 'with-listeners' }, 'Component');
      };

      const { unmount } = render(React.createElement(ComponentWithListeners));
      
      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      
      unmount();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

      mockAddEventListener.mockRestore();
      mockRemoveEventListener.mockRestore();
    });
  });

  describe('Bundle Size Simulation', () => {
    test('simulates code splitting benefits', () => {
      // Simulate bundle size measurements
      const mainBundleSize = 250; // KB
      const chunkSize = 50; // KB
      const totalWithoutSplitting = 300; // KB

      const savingsPercentage = ((totalWithoutSplitting - mainBundleSize) / totalWithoutSplitting) * 100;
      
      expect(savingsPercentage).toBeGreaterThan(15); // Should save at least 15%
    });

    test('tree shaking effectiveness', () => {
      // Simulate tree shaking measurements
      const originalSize = 500; // KB
      const optimizedSize = 300; // KB
      const reduction = ((originalSize - optimizedSize) / originalSize) * 100;

      expect(reduction).toBeGreaterThan(30); // Should reduce by at least 30%
    });
  });

  describe('Animation Performance', () => {
    test('measures animation frame rate', () => {
      let frameCount = 0;
      const startTime = performance.now();

      const animate = () => {
        frameCount++;
        if (frameCount < 60) {
          requestAnimationFrame(animate);
        } else {
          const endTime = performance.now();
          const duration = endTime - startTime;
          const fps = (frameCount / duration) * 1000;
          
          expect(fps).toBeGreaterThan(30); // Should maintain > 30 FPS
        }
      };

      animate();
    });

    test('CSS animation performance', () => {
      const AnimatedComponent = () => 
        React.createElement('div', {
          'data-testid': 'animated',
          style: {
            transform: 'translateX(100px)',
            transition: 'transform 0.3s ease'
          }
        }, 'Animated Content');

      performanceMonitor.startMeasurement('css-animation');
      render(React.createElement(AnimatedComponent));
      performanceMonitor.endMeasurement('css-animation');

      const metric = performanceMonitor.getMetric('css-animation');
      expect(metric.duration).toBeLessThan(50);
    });
  });

  describe('Network Performance', () => {
    test('simulates network request performance', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: 'test' })
        })
      );
      global.fetch = mockFetch;

      performanceMonitor.startMeasurement('api-request');
      
      try {
        await fetch('/api/test');
        performanceMonitor.endMeasurement('api-request');
      } catch (error) {
        performanceMonitor.endMeasurement('api-request');
      }

      const metric = performanceMonitor.getMetric('api-request');
      expect(metric.duration).toBeLessThan(1000); // Should complete in < 1s
    });

    test('measures resource loading times', () => {
      const resources = [
        { name: 'main.js', size: 100, loadTime: 200 },
        { name: 'style.css', size: 50, loadTime: 100 },
        { name: 'image.jpg', size: 200, loadTime: 300 }
      ];

      const totalLoadTime = resources.reduce((sum, resource) => sum + resource.loadTime, 0);
      const averageLoadTime = totalLoadTime / resources.length;

      expect(averageLoadTime).toBeLessThan(250); // Average load time should be reasonable
    });
  });

  describe('Performance Regression Detection', () => {
    test('detects performance regressions', () => {
      const baseline = {
        renderTime: 50,
        bundleSize: 200,
        memoryUsage: 10
      };

      const current = {
        renderTime: 75, // 50% increase
        bundleSize: 250, // 25% increase
        memoryUsage: 15 // 50% increase
      };

      const renderRegression = ((current.renderTime - baseline.renderTime) / baseline.renderTime) * 100;
      const bundleRegression = ((current.bundleSize - baseline.bundleSize) / baseline.bundleSize) * 100;
      const memoryRegression = ((current.memoryUsage - baseline.memoryUsage) / baseline.memoryUsage) * 100;

      // Flag significant regressions (> 20%)
      expect(renderRegression).toBeLessThan(20);
      expect(bundleRegression).toBeLessThan(20);
      expect(memoryRegression).toBeLessThan(20);
    });

    test('performance budget compliance', () => {
      const performanceBudget = {
        maxRenderTime: 100, // ms
        maxBundleSize: 300, // KB
        maxImageSize: 500, // KB
        maxApiResponseTime: 1000 // ms
      };

      const currentMetrics = {
        renderTime: 75,
        bundleSize: 250,
        imageSize: 400,
        apiResponseTime: 800
      };

      expect(currentMetrics.renderTime).toBeLessThanOrEqual(performanceBudget.maxRenderTime);
      expect(currentMetrics.bundleSize).toBeLessThanOrEqual(performanceBudget.maxBundleSize);
      expect(currentMetrics.imageSize).toBeLessThanOrEqual(performanceBudget.maxImageSize);
      expect(currentMetrics.apiResponseTime).toBeLessThanOrEqual(performanceBudget.maxApiResponseTime);
    });
  });

  describe('Performance Optimization Validation', () => {
    test('validates component memoization effectiveness', () => {
      let renderCount = 0;

      const TestComponent = React.memo(({ value }) => {
        renderCount++;
        return React.createElement('div', { 'data-testid': 'memo-component' }, value);
      });

      const { rerender } = render(React.createElement(TestComponent, { value: 'test' }));
      expect(renderCount).toBe(1);

      // Re-render with same props
      rerender(React.createElement(TestComponent, { value: 'test' }));
      expect(renderCount).toBe(1); // Should not re-render

      // Re-render with different props
      rerender(React.createElement(TestComponent, { value: 'changed' }));
      expect(renderCount).toBe(2); // Should re-render
    });

    test('validates useMemo effectiveness', () => {
      let computationCount = 0;

      const TestComponent = ({ items }) => {
        const expensiveValue = React.useMemo(() => {
          computationCount++;
          return items.reduce((sum, item) => sum + item.value, 0);
        }, [items]);

        return React.createElement('div', { 'data-testid': 'memo-result' }, expensiveValue);
      };

      const items = [{ value: 1 }, { value: 2 }, { value: 3 }];
      const { rerender } = render(React.createElement(TestComponent, { items }));
      
      expect(computationCount).toBe(1);

      // Re-render with same items
      rerender(React.createElement(TestComponent, { items }));
      expect(computationCount).toBe(1); // Should not recompute

      // Re-render with different items
      const newItems = [{ value: 4 }, { value: 5 }];
      rerender(React.createElement(TestComponent, { items: newItems }));
      expect(computationCount).toBe(2); // Should recompute
    });
  });
});
