/**
 * Comprehensive Testing Setup for Portfolio Project
 * Includes Jest configuration, test utilities, and global setup
 */

import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { configure } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';
import fetchMock from 'jest-fetch-mock';

// Configure Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
  computedStyleSupportsPseudoElements: true
});

// Setup fetch mock
fetchMock.enableMocks();

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.elements = new Set();
  }

  observe(element) {
    this.elements.add(element);
    // Immediately trigger callback for testing
    this.callback([
      {
        target: element,
        isIntersecting: true,
        intersectionRatio: 1,
        boundingClientRect: element.getBoundingClientRect(),
        intersectionRect: element.getBoundingClientRect(),
        rootBounds: null,
        time: Date.now()
      }
    ]);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }

  observe(element) {
    this.elements.add(element);
    // Trigger callback immediately for testing
    this.callback([
      {
        target: element,
        contentRect: element.getBoundingClientRect()
      }
    ]);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn()
});

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 120,
  height: 120,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: jest.fn()
}));

// Mock canvas getContext
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn()
}));

// Mock Framer Motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })),
      section: React.forwardRef((props, ref) => React.createElement('section', { ...props, ref })),
      h1: React.forwardRef((props, ref) => React.createElement('h1', { ...props, ref })),
      h2: React.forwardRef((props, ref) => React.createElement('h2', { ...props, ref })),
      h3: React.forwardRef((props, ref) => React.createElement('h3', { ...props, ref })),
      p: React.forwardRef((props, ref) => React.createElement('p', { ...props, ref })),
      button: React.forwardRef((props, ref) => React.createElement('button', { ...props, ref })),
      img: React.forwardRef((props, ref) => React.createElement('img', { ...props, ref })),
      a: React.forwardRef((props, ref) => React.createElement('a', { ...props, ref })),
      span: React.forwardRef((props, ref) => React.createElement('span', { ...props, ref })),
      nav: React.forwardRef((props, ref) => React.createElement('nav', { ...props, ref })),
      form: React.forwardRef((props, ref) => React.createElement('form', { ...props, ref })),
      input: React.forwardRef((props, ref) => React.createElement('input', { ...props, ref })),
      textarea: React.forwardRef((props, ref) => React.createElement('textarea', { ...props, ref }))
    },
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn()
    }),
    useInView: () => [jest.fn(), true],
    useMotionValue: (initial) => ({
      get: () => initial,
      set: jest.fn(),
      on: jest.fn()
    })
  };
});

// Mock Recharts
jest.mock('recharts', () => {
  const React = require('react');
  return {
    ResponsiveContainer: (props) => React.createElement('div', { 'data-testid': 'responsive-container' }, props.children),
    BarChart: (props) => React.createElement('div', { 'data-testid': 'bar-chart' }, props.children),
    LineChart: (props) => React.createElement('div', { 'data-testid': 'line-chart' }, props.children),
    PieChart: (props) => React.createElement('div', { 'data-testid': 'pie-chart' }, props.children),
    AreaChart: (props) => React.createElement('div', { 'data-testid': 'area-chart' }, props.children),
    Bar: () => React.createElement('div', { 'data-testid': 'bar' }),
    Line: () => React.createElement('div', { 'data-testid': 'line' }),
    Area: () => React.createElement('div', { 'data-testid': 'area' }),
    Pie: () => React.createElement('div', { 'data-testid': 'pie' }),
    XAxis: () => React.createElement('div', { 'data-testid': 'x-axis' }),
    YAxis: () => React.createElement('div', { 'data-testid': 'y-axis' }),
    CartesianGrid: () => React.createElement('div', { 'data-testid': 'cartesian-grid' }),
    Tooltip: () => React.createElement('div', { 'data-testid': 'tooltip' }),
    Legend: () => React.createElement('div', { 'data-testid': 'legend' }),
    Cell: () => React.createElement('div', { 'data-testid': 'cell' })
  };
});

// Mock Lucide React icons
jest.mock('lucide-react', () => {
  const React = require('react');
  const MockIcon = (props) => React.createElement('svg', {
    ...props,
    'data-testid': props['data-testid'] || 'mock-icon'
  }, props.children);
  
  return new Proxy({}, {
    get: (target, prop) => {
      return MockIcon;
    }
  });
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock Web APIs
global.fetch = fetchMock;

// Performance mock
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    navigation: {
      type: 0
    },
    timing: {
      navigationStart: Date.now(),
      domContentLoadedEventEnd: Date.now() + 1000,
      loadEventEnd: Date.now() + 2000
    }
  }
});

// Mock navigator
Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    ...window.navigator,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    language: 'en-US',
    languages: ['en-US', 'en'],
    onLine: true,
    cookieEnabled: true,
    doNotTrack: null,
    geolocation: {
      getCurrentPosition: jest.fn(),
      watchPosition: jest.fn(),
      clearWatch: jest.fn()
    },
    serviceWorker: {
      register: jest.fn(() => Promise.resolve()),
      ready: Promise.resolve()
    }
  }
});

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is deprecated') ||
       args[0].includes('Warning: componentWillReceiveProps has been renamed'))
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ')
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.testUtils = {
  // Mock API responses
  mockApiSuccess: (data) => ({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  }),
  
  mockApiError: (status = 500, message = 'Internal Server Error') => ({
    ok: false,
    status,
    statusText: message,
    json: () => Promise.reject(new Error('Response not ok')),
    text: () => Promise.reject(new Error('Response not ok'))
  }),
  
  // Wait for async operations
  waitFor: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Create mock events
  createMockEvent: (type, properties = {}) => ({
    type,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    target: { value: '' },
    currentTarget: { value: '' },
    ...properties
  }),
  
  // Mock intersection observer entry
  createMockIntersectionEntry: (element, isIntersecting = true) => ({
    target: element,
    isIntersecting,
    intersectionRatio: isIntersecting ? 1 : 0,
    boundingClientRect: element.getBoundingClientRect(),
    intersectionRect: isIntersecting ? element.getBoundingClientRect() : null,
    rootBounds: null,
    time: Date.now()
  })
};

// Cleanup after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
  
  // Clear fetch mock
  fetchMock.resetMocks();
  
  // Clear localStorage/sessionStorage
  localStorageMock.clear();
  sessionStorageMock.clear();
  
  // Reset document body
  document.body.innerHTML = '';
  
  // Reset scrollTo mock
  window.scrollTo.mockClear();
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Increase timeout for integration tests
jest.setTimeout(10000);

export default {};
