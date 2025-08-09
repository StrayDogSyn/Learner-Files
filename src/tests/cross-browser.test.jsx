/**
 * Cross-Browser Compatibility Tests
 * Tests for different browsers and browser features
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock browser feature detection
const createBrowserMock = (userAgent, features = {}) => {
  Object.defineProperty(window.navigator, 'userAgent', {
    writable: true,
    value: userAgent
  });

  // Mock browser features
  const defaultFeatures = {
    IntersectionObserver: true,
    ResizeObserver: true,
    fetch: true,
    Promise: true,
    localStorage: true,
    sessionStorage: true,
    WebGL: true,
    serviceWorker: true,
    pushManager: true,
    CSS: {
      supports: () => true
    }
  };

  const mockFeatures = { ...defaultFeatures, ...features };

  // Apply feature mocks
  Object.keys(mockFeatures).forEach(feature => {
    if (feature === 'CSS') {
      window.CSS = mockFeatures.CSS;
    } else if (mockFeatures[feature]) {
      if (!window[feature]) {
        window[feature] = jest.fn();
      }
    } else {
      window[feature] = undefined;
    }
  });

  return mockFeatures;
};

// Browser compatibility utility
class BrowserCompat {
  static detectBrowser() {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) return 'chrome';
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'safari';
    if (userAgent.includes('Edge')) return 'edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'ie';
    
    return 'unknown';
  }

  static supportsFeature(feature) {
    switch (feature) {
      case 'intersectionObserver':
        return 'IntersectionObserver' in window;
      case 'resizeObserver':
        return 'ResizeObserver' in window;
      case 'webgl':
        return 'WebGLRenderingContext' in window;
      case 'serviceWorker':
        return 'serviceWorker' in navigator;
      case 'pushManager':
        return 'PushManager' in window;
      case 'fetch':
        return 'fetch' in window;
      case 'localStorage':
        return 'localStorage' in window;
      case 'flexbox':
        return window.CSS && CSS.supports('display', 'flex');
      case 'grid':
        return window.CSS && CSS.supports('display', 'grid');
      case 'customProperties':
        return window.CSS && CSS.supports('--custom', 'property');
      default:
        return false;
    }
  }

  static getPolyfills() {
    const polyfills = [];
    
    if (!this.supportsFeature('fetch')) {
      polyfills.push('fetch');
    }
    if (!this.supportsFeature('intersectionObserver')) {
      polyfills.push('intersection-observer');
    }
    if (!this.supportsFeature('resizeObserver')) {
      polyfills.push('resize-observer');
    }
    
    return polyfills;
  }
}

// Cross-browser compatible components
const CompatibleComponent = () => {
  const [isSupported, setIsSupported] = React.useState(true);
  const [features, setFeatures] = React.useState({});

  React.useEffect(() => {
    const supportedFeatures = {
      intersectionObserver: BrowserCompat.supportsFeature('intersectionObserver'),
      fetch: BrowserCompat.supportsFeature('fetch'),
      flexbox: BrowserCompat.supportsFeature('flexbox'),
      grid: BrowserCompat.supportsFeature('grid'),
      customProperties: BrowserCompat.supportsFeature('customProperties')
    };

    setFeatures(supportedFeatures);
    setIsSupported(Object.values(supportedFeatures).every(Boolean));
  }, []);

  if (!isSupported) {
    return React.createElement('div', {
      'data-testid': 'fallback-component',
      className: 'fallback-ui'
    }, 'Your browser does not support all features. Please upgrade.');
  }

  return React.createElement('div', {
    'data-testid': 'compatible-component',
    className: features.grid ? 'grid-layout' : 'flexbox-layout'
  },
    React.createElement('h2', null, 'Cross-Browser Compatible Component'),
    React.createElement('p', null, `Browser: ${BrowserCompat.detectBrowser()}`),
    React.createElement('ul', null,
      Object.entries(features).map(([feature, supported]) =>
        React.createElement('li', {
          key: feature,
          'data-testid': `feature-${feature}`
        }, `${feature}: ${supported ? 'Supported' : 'Not supported'}`)
      )
    )
  );
};

const FlexboxFallbackComponent = () => {
  const supportsGrid = BrowserCompat.supportsFeature('grid');
  const supportsFlexbox = BrowserCompat.supportsFeature('flexbox');

  let layoutClass = 'float-layout'; // Fallback for old browsers
  if (supportsFlexbox) layoutClass = 'flexbox-layout';
  if (supportsGrid) layoutClass = 'grid-layout';

  return React.createElement('div', {
    'data-testid': 'layout-component',
    className: layoutClass,
    'data-layout': layoutClass
  },
    React.createElement('div', { className: 'item' }, 'Item 1'),
    React.createElement('div', { className: 'item' }, 'Item 2'),
    React.createElement('div', { className: 'item' }, 'Item 3')
  );
};

const FetchFallbackComponent = () => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  const fetchData = async () => {
    try {
      if (BrowserCompat.supportsFeature('fetch')) {
        // Use modern fetch API
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } else {
        // Fallback to XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/data');
        xhr.onload = () => {
          if (xhr.status === 200) {
            setData(JSON.parse(xhr.responseText));
          } else {
            setError('Request failed');
          }
        };
        xhr.onerror = () => setError('Network error');
        xhr.send();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return React.createElement('div', {
    'data-testid': 'fetch-component'
  },
    data && React.createElement('div', {
      'data-testid': 'data-content'
    }, JSON.stringify(data)),
    error && React.createElement('div', {
      'data-testid': 'error-content'
    }, error)
  );
};

const StorageFallbackComponent = () => {
  const [value, setValue] = React.useState('');

  const saveValue = (newValue) => {
    setValue(newValue);
    
    if (BrowserCompat.supportsFeature('localStorage')) {
      localStorage.setItem('testValue', newValue);
    } else {
      // Fallback to cookies
      document.cookie = `testValue=${newValue}; path=/`;
    }
  };

  const loadValue = () => {
    if (BrowserCompat.supportsFeature('localStorage')) {
      return localStorage.getItem('testValue') || '';
    } else {
      // Fallback to reading cookies
      const cookies = document.cookie.split(';');
      const cookie = cookies.find(c => c.trim().startsWith('testValue='));
      return cookie ? cookie.split('=')[1] : '';
    }
  };

  React.useEffect(() => {
    setValue(loadValue());
  }, []);

  return React.createElement('div', {
    'data-testid': 'storage-component'
  },
    React.createElement('input', {
      type: 'text',
      value,
      onChange: (e) => saveValue(e.target.value),
      'data-testid': 'storage-input'
    }),
    React.createElement('p', {
      'data-testid': 'storage-method'
    }, BrowserCompat.supportsFeature('localStorage') ? 'Using localStorage' : 'Using cookies')
  );
};

describe('Cross-Browser Compatibility Tests', () => {
  beforeEach(() => {
    // Reset browser mocks
    jest.clearAllMocks();
    
    // Clear any existing mocks
    delete window.IntersectionObserver;
    delete window.ResizeObserver;
    delete window.fetch;
    
    // Reset CSS support
    if (window.CSS) {
      delete window.CSS;
    }
  });

  describe('Browser Detection', () => {
    test('detects Chrome browser', () => {
      createBrowserMock('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      expect(BrowserCompat.detectBrowser()).toBe('chrome');
    });

    test('detects Firefox browser', () => {
      createBrowserMock('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');
      
      expect(BrowserCompat.detectBrowser()).toBe('firefox');
    });

    test('detects Safari browser', () => {
      createBrowserMock('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15');
      
      expect(BrowserCompat.detectBrowser()).toBe('safari');
    });

    test('detects Edge browser', () => {
      createBrowserMock('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59');
      
      expect(BrowserCompat.detectBrowser()).toBe('edge');
    });

    test('detects Internet Explorer', () => {
      createBrowserMock('Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; AS; rv:11.0) like Gecko');
      
      expect(BrowserCompat.detectBrowser()).toBe('ie');
    });
  });

  describe('Feature Detection', () => {
    test('detects modern browser features', () => {
      createBrowserMock('Chrome', {
        IntersectionObserver: true,
        ResizeObserver: true,
        fetch: true,
        CSS: { supports: () => true }
      });

      expect(BrowserCompat.supportsFeature('intersectionObserver')).toBe(true);
      expect(BrowserCompat.supportsFeature('resizeObserver')).toBe(true);
      expect(BrowserCompat.supportsFeature('fetch')).toBe(true);
      expect(BrowserCompat.supportsFeature('flexbox')).toBe(true);
    });

    test('detects missing features in older browsers', () => {
      createBrowserMock('IE', {
        IntersectionObserver: false,
        ResizeObserver: false,
        fetch: false,
        CSS: { supports: () => false }
      });

      expect(BrowserCompat.supportsFeature('intersectionObserver')).toBe(false);
      expect(BrowserCompat.supportsFeature('resizeObserver')).toBe(false);
      expect(BrowserCompat.supportsFeature('fetch')).toBe(false);
      expect(BrowserCompat.supportsFeature('flexbox')).toBe(false);
    });

    test('provides appropriate polyfills', () => {
      createBrowserMock('IE', {
        IntersectionObserver: false,
        fetch: false
      });

      const polyfills = BrowserCompat.getPolyfills();
      expect(polyfills).toContain('fetch');
      expect(polyfills).toContain('intersection-observer');
    });
  });

  describe('Component Fallbacks', () => {
    test('renders modern component with full feature support', () => {
      createBrowserMock('Chrome', {
        IntersectionObserver: true,
        fetch: true,
        CSS: { supports: () => true }
      });

      render(React.createElement(CompatibleComponent));

      expect(screen.getByTestId('compatible-component')).toBeInTheDocument();
      expect(screen.queryByTestId('fallback-component')).not.toBeInTheDocument();
    });

    test('renders fallback component for unsupported browsers', () => {
      createBrowserMock('IE', {
        IntersectionObserver: false,
        fetch: false,
        CSS: { supports: () => false }
      });

      render(React.createElement(CompatibleComponent));

      expect(screen.getByTestId('fallback-component')).toBeInTheDocument();
      expect(screen.queryByTestId('compatible-component')).not.toBeInTheDocument();
    });

    test('adapts layout based on CSS support', () => {
      createBrowserMock('Firefox', {
        CSS: { 
          supports: (prop, value) => {
            if (prop === 'display' && value === 'grid') return true;
            if (prop === 'display' && value === 'flex') return true;
            return false;
          }
        }
      });

      render(React.createElement(FlexboxFallbackComponent));

      const component = screen.getByTestId('layout-component');
      expect(component).toHaveAttribute('data-layout', 'grid-layout');
    });

    test('falls back to flexbox when grid is not supported', () => {
      createBrowserMock('Safari', {
        CSS: { 
          supports: (prop, value) => {
            if (prop === 'display' && value === 'grid') return false;
            if (prop === 'display' && value === 'flex') return true;
            return false;
          }
        }
      });

      render(React.createElement(FlexboxFallbackComponent));

      const component = screen.getByTestId('layout-component');
      expect(component).toHaveAttribute('data-layout', 'flexbox-layout');
    });

    test('falls back to float layout for old browsers', () => {
      createBrowserMock('IE', {
        CSS: { supports: () => false }
      });

      render(React.createElement(FlexboxFallbackComponent));

      const component = screen.getByTestId('layout-component');
      expect(component).toHaveAttribute('data-layout', 'float-layout');
    });
  });

  describe('API Fallbacks', () => {
    test('uses fetch API when available', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data: 'test' })
        })
      );

      createBrowserMock('Chrome', { fetch: true });
      window.fetch = mockFetch;

      render(React.createElement(FetchFallbackComponent));

      expect(mockFetch).toHaveBeenCalledWith('/api/data');
    });

    test('falls back to XMLHttpRequest when fetch is not available', () => {
      const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn()
      };

      window.XMLHttpRequest = jest.fn(() => mockXHR);
      createBrowserMock('IE', { fetch: false });

      render(React.createElement(FetchFallbackComponent));

      expect(mockXHR.open).toHaveBeenCalledWith('GET', '/api/data');
      expect(mockXHR.send).toHaveBeenCalled();
    });

    test('uses localStorage when available', async () => {
      const mockLocalStorage = {
        getItem: jest.fn(() => 'stored value'),
        setItem: jest.fn()
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage
      });

      createBrowserMock('Chrome', { localStorage: true });

      const user = userEvent.setup();
      render(React.createElement(StorageFallbackComponent));

      const input = screen.getByTestId('storage-input');
      await user.type(input, 'test');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('testValue', 'test');
    });

    test('falls back to cookies when localStorage is not available', async () => {
      createBrowserMock('IE', { localStorage: false });

      // Mock document.cookie
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: ''
      });

      const user = userEvent.setup();
      render(React.createElement(StorageFallbackComponent));

      expect(screen.getByTestId('storage-method')).toHaveTextContent('Using cookies');
    });
  });

  describe('Progressive Enhancement', () => {
    test('enhances experience for modern browsers', () => {
      createBrowserMock('Chrome', {
        IntersectionObserver: true,
        CSS: { supports: () => true }
      });

      const EnhancedComponent = () => {
        const supportsIO = BrowserCompat.supportsFeature('intersectionObserver');
        
        return React.createElement('div', {
          'data-testid': 'enhanced-component',
          className: supportsIO ? 'enhanced' : 'basic'
        },
          supportsIO ? 'Enhanced experience' : 'Basic experience'
        );
      };

      render(React.createElement(EnhancedComponent));

      const component = screen.getByTestId('enhanced-component');
      expect(component).toHaveClass('enhanced');
      expect(component).toHaveTextContent('Enhanced experience');
    });

    test('provides basic experience for older browsers', () => {
      createBrowserMock('IE', {
        IntersectionObserver: false,
        CSS: { supports: () => false }
      });

      const EnhancedComponent = () => {
        const supportsIO = BrowserCompat.supportsFeature('intersectionObserver');
        
        return React.createElement('div', {
          'data-testid': 'enhanced-component',
          className: supportsIO ? 'enhanced' : 'basic'
        },
          supportsIO ? 'Enhanced experience' : 'Basic experience'
        );
      };

      render(React.createElement(EnhancedComponent));

      const component = screen.getByTestId('enhanced-component');
      expect(component).toHaveClass('basic');
      expect(component).toHaveTextContent('Basic experience');
    });
  });

  describe('CSS Feature Queries', () => {
    test('uses CSS.supports for feature detection', () => {
      const mockCSS = {
        supports: jest.fn((prop, value) => {
          if (prop === 'display' && value === 'grid') return true;
          if (prop === '--custom' && value === 'property') return true;
          return false;
        })
      };

      window.CSS = mockCSS;
      createBrowserMock('Chrome');

      expect(BrowserCompat.supportsFeature('grid')).toBe(true);
      expect(BrowserCompat.supportsFeature('customProperties')).toBe(true);
      expect(mockCSS.supports).toHaveBeenCalledWith('display', 'grid');
      expect(mockCSS.supports).toHaveBeenCalledWith('--custom', 'property');
    });

    test('handles missing CSS.supports gracefully', () => {
      delete window.CSS;
      createBrowserMock('IE');

      expect(BrowserCompat.supportsFeature('grid')).toBe(false);
      expect(BrowserCompat.supportsFeature('customProperties')).toBe(false);
    });
  });

  describe('Event Handling Compatibility', () => {
    test('handles modern event listeners', async () => {
      createBrowserMock('Chrome');

      const ModernEventComponent = () => {
        const [clicked, setClicked] = React.useState(false);

        return React.createElement('button', {
          onClick: () => setClicked(true),
          onPointerDown: () => {}, // Modern pointer events
          onTouchStart: () => {}, // Touch events
          'data-testid': 'modern-button'
        }, clicked ? 'Clicked' : 'Click me');
      };

      const user = userEvent.setup();
      render(React.createElement(ModernEventComponent));

      const button = screen.getByTestId('modern-button');
      await user.click(button);

      expect(button).toHaveTextContent('Clicked');
    });

    test('provides fallback for legacy event handling', () => {
      createBrowserMock('IE');

      const LegacyEventComponent = () => {
        const [clicked, setClicked] = React.useState(false);

        // Simulate legacy event handling
        const handleClick = (e) => {
          // IE-specific event handling
          if (!e) e = window.event;
          setClicked(true);
        };

        return React.createElement('button', {
          onClick: handleClick,
          'data-testid': 'legacy-button'
        }, clicked ? 'Clicked' : 'Click me');
      };

      const user = userEvent.setup();
      render(React.createElement(LegacyEventComponent));

      const button = screen.getByTestId('legacy-button');
      fireEvent.click(button);

      expect(button).toHaveTextContent('Clicked');
    });
  });

  describe('Performance Across Browsers', () => {
    test('measures performance in different browsers', () => {
      const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
      
      browsers.forEach(browser => {
        createBrowserMock(browser);
        
        const startTime = performance.now();
        render(React.createElement(CompatibleComponent));
        const endTime = performance.now();
        
        const renderTime = endTime - startTime;
        
        // Performance should be reasonable across all browsers
        expect(renderTime).toBeLessThan(100);
      });
    });
  });
});
