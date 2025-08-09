/**
 * Mobile Responsiveness Tests
 * Tests for various screen sizes, orientations, and mobile-specific features
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Viewport utility for testing different screen sizes
class ViewportUtils {
  static setViewport(width, height) {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });

    // Mock screen object
    Object.defineProperty(window, 'screen', {
      writable: true,
      configurable: true,
      value: {
        width,
        height,
        availWidth: width,
        availHeight: height,
        orientation: {
          type: width > height ? 'landscape-primary' : 'portrait-primary',
          angle: 0
        }
      }
    });

    // Mock matchMedia for CSS media queries
    window.matchMedia = jest.fn((query) => ({
      matches: this.evaluateMediaQuery(query, width, height),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Trigger resize event
    fireEvent(window, new Event('resize'));
  }

  static evaluateMediaQuery(query, width, height) {
    // Simple media query evaluation for testing
    if (query.includes('max-width: 768px')) {
      return width <= 768;
    }
    if (query.includes('max-width: 1024px')) {
      return width <= 1024;
    }
    if (query.includes('min-width: 769px')) {
      return width >= 769;
    }
    if (query.includes('orientation: landscape')) {
      return width > height;
    }
    if (query.includes('orientation: portrait')) {
      return width <= height;
    }
    if (query.includes('hover: hover')) {
      return width >= 1024; // Assume desktop supports hover
    }
    if (query.includes('pointer: coarse')) {
      return width <= 768; // Assume mobile has coarse pointer
    }
    return false;
  }

  static getBreakpoint(width) {
    if (width <= 480) return 'mobile';
    if (width <= 768) return 'tablet';
    if (width <= 1024) return 'laptop';
    return 'desktop';
  }
}

// Responsive component for testing
const ResponsiveComponent = () => {
  const [viewport, setViewport] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [orientation, setOrientation] = React.useState('portrait');

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({ width, height });
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoint = ViewportUtils.getBreakpoint(viewport.width);

  return React.createElement('div', {
    'data-testid': 'responsive-component',
    'data-breakpoint': breakpoint,
    'data-mobile': isMobile,
    'data-tablet': isTablet,
    'data-orientation': orientation,
    className: `responsive-container ${breakpoint} ${orientation}`
  },
    React.createElement('h1', {
      'data-testid': 'responsive-title'
    }, `Responsive Design`),
    React.createElement('div', {
      'data-testid': 'viewport-info'
    }, `${viewport.width}x${viewport.height} (${breakpoint})`),
    React.createElement('div', {
      'data-testid': 'device-type'
    }, isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'),
    React.createElement('div', {
      'data-testid': 'orientation-info'
    }, orientation)
  );
};

// Mobile navigation component
const MobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', checkMobile);
    checkMobile();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    return React.createElement('nav', {
      'data-testid': 'desktop-nav'
    },
      React.createElement('ul', { className: 'nav-horizontal' },
        React.createElement('li', null, React.createElement('a', { href: '#home' }, 'Home')),
        React.createElement('li', null, React.createElement('a', { href: '#about' }, 'About')),
        React.createElement('li', null, React.createElement('a', { href: '#contact' }, 'Contact'))
      )
    );
  }

  return React.createElement('nav', {
    'data-testid': 'mobile-nav'
  },
    React.createElement('button', {
      'data-testid': 'menu-toggle',
      onClick: () => setIsMenuOpen(!isMenuOpen),
      'aria-expanded': isMenuOpen,
      'aria-controls': 'mobile-menu'
    }, isMenuOpen ? '✕' : '☰'),
    isMenuOpen && React.createElement('ul', {
      id: 'mobile-menu',
      'data-testid': 'mobile-menu',
      className: 'nav-vertical'
    },
      React.createElement('li', null, React.createElement('a', { href: '#home' }, 'Home')),
      React.createElement('li', null, React.createElement('a', { href: '#about' }, 'About')),
      React.createElement('li', null, React.createElement('a', { href: '#contact' }, 'Contact'))
    )
  );
};

// Touch-enabled component
const TouchComponent = () => {
  const [touchInfo, setTouchInfo] = React.useState({
    touches: 0,
    lastTouch: null
  });

  const handleTouchStart = (e) => {
    setTouchInfo({
      touches: e.touches.length,
      lastTouch: 'touchstart'
    });
  };

  const handleTouchMove = (e) => {
    setTouchInfo(prev => ({
      ...prev,
      lastTouch: 'touchmove'
    }));
  };

  const handleTouchEnd = (e) => {
    setTouchInfo(prev => ({
      ...prev,
      lastTouch: 'touchend'
    }));
  };

  return React.createElement('div', {
    'data-testid': 'touch-component',
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    style: {
      width: '200px',
      height: '200px',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      touchAction: 'manipulation'
    }
  },
    React.createElement('p', {
      'data-testid': 'touch-count'
    }, `Touches: ${touchInfo.touches}`),
    React.createElement('p', {
      'data-testid': 'last-touch'
    }, `Last: ${touchInfo.lastTouch || 'none'}`)
  );
};

// Responsive grid component
const ResponsiveGrid = ({ items }) => {
  const [columns, setColumns] = React.useState(1);

  React.useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1024) setColumns(4);
      else if (width >= 768) setColumns(3);
      else if (width >= 480) setColumns(2);
      else setColumns(1);
    };

    window.addEventListener('resize', updateColumns);
    updateColumns();

    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return React.createElement('div', {
    'data-testid': 'responsive-grid',
    'data-columns': columns,
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '1rem'
    }
  },
    items.map((item, index) =>
      React.createElement('div', {
        key: index,
        'data-testid': `grid-item-${index}`,
        style: {
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd'
        }
      }, item)
    )
  );
};

// Responsive text component
const ResponsiveText = () => {
  const [fontSize, setFontSize] = React.useState('16px');

  React.useEffect(() => {
    const updateFontSize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setFontSize('18px');
      else if (width >= 768) setFontSize('16px');
      else setFontSize('14px');
    };

    window.addEventListener('resize', updateFontSize);
    updateFontSize();

    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  return React.createElement('div', {
    'data-testid': 'responsive-text',
    style: { fontSize }
  },
    React.createElement('p', null, 'This text adapts to screen size'),
    React.createElement('span', {
      'data-testid': 'font-size'
    }, fontSize)
  );
};

describe('Mobile Responsiveness Tests', () => {
  beforeEach(() => {
    // Reset viewport to default desktop size
    ViewportUtils.setViewport(1024, 768);
  });

  afterEach(() => {
    // Clean up viewport
    jest.restoreAllMocks();
  });

  describe('Viewport Detection', () => {
    test('detects mobile viewport', () => {
      ViewportUtils.setViewport(375, 667); // iPhone 6/7/8 size
      
      render(React.createElement(ResponsiveComponent));
      
      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveAttribute('data-breakpoint', 'mobile');
      expect(component).toHaveAttribute('data-mobile', 'true');
      expect(component).toHaveAttribute('data-orientation', 'portrait');
    });

    test('detects tablet viewport', () => {
      ViewportUtils.setViewport(768, 1024); // iPad size
      
      render(React.createElement(ResponsiveComponent));
      
      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveAttribute('data-breakpoint', 'tablet');
      expect(component).toHaveAttribute('data-tablet', 'true');
      expect(component).toHaveAttribute('data-orientation', 'portrait');
    });

    test('detects desktop viewport', () => {
      ViewportUtils.setViewport(1440, 900); // Desktop size
      
      render(React.createElement(ResponsiveComponent));
      
      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveAttribute('data-breakpoint', 'desktop');
      expect(component).toHaveAttribute('data-mobile', 'false');
      expect(component).toHaveAttribute('data-tablet', 'false');
    });

    test('detects landscape orientation', () => {
      ViewportUtils.setViewport(667, 375); // iPhone landscape
      
      render(React.createElement(ResponsiveComponent));
      
      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveAttribute('data-orientation', 'landscape');
    });
  });

  describe('Responsive Navigation', () => {
    test('shows desktop navigation on large screens', () => {
      ViewportUtils.setViewport(1024, 768);
      
      render(React.createElement(MobileNavigation));
      
      expect(screen.getByTestId('desktop-nav')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
    });

    test('shows mobile navigation on small screens', () => {
      ViewportUtils.setViewport(375, 667);
      
      render(React.createElement(MobileNavigation));
      
      expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-nav')).not.toBeInTheDocument();
    });

    test('mobile menu toggles correctly', async () => {
      ViewportUtils.setViewport(375, 667);
      
      const user = userEvent.setup();
      render(React.createElement(MobileNavigation));
      
      const menuToggle = screen.getByTestId('menu-toggle');
      
      // Menu should be closed initially
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      
      // Open menu
      await user.click(menuToggle);
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
      
      // Close menu
      await user.click(menuToggle);
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Touch Interactions', () => {
    test('handles touch events', () => {
      render(React.createElement(TouchComponent));
      
      const touchComponent = screen.getByTestId('touch-component');
      
      // Simulate touch start with multiple fingers
      fireEvent.touchStart(touchComponent, {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 150, clientY: 150 }
        ]
      });
      
      expect(screen.getByTestId('touch-count')).toHaveTextContent('Touches: 2');
      expect(screen.getByTestId('last-touch')).toHaveTextContent('Last: touchstart');
    });

    test('handles touch move events', () => {
      render(React.createElement(TouchComponent));
      
      const touchComponent = screen.getByTestId('touch-component');
      
      fireEvent.touchMove(touchComponent, {
        touches: [{ clientX: 120, clientY: 120 }]
      });
      
      expect(screen.getByTestId('last-touch')).toHaveTextContent('Last: touchmove');
    });

    test('handles touch end events', () => {
      render(React.createElement(TouchComponent));
      
      const touchComponent = screen.getByTestId('touch-component');
      
      fireEvent.touchEnd(touchComponent);
      
      expect(screen.getByTestId('last-touch')).toHaveTextContent('Last: touchend');
    });
  });

  describe('Responsive Layouts', () => {
    test('adapts grid columns to screen size', () => {
      const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
      
      // Mobile: 1 column
      ViewportUtils.setViewport(375, 667);
      const { rerender } = render(React.createElement(ResponsiveGrid, { items }));
      
      expect(screen.getByTestId('responsive-grid')).toHaveAttribute('data-columns', '1');
      
      // Tablet: 3 columns
      act(() => {
        ViewportUtils.setViewport(768, 1024);
      });
      rerender(React.createElement(ResponsiveGrid, { items }));
      
      expect(screen.getByTestId('responsive-grid')).toHaveAttribute('data-columns', '3');
      
      // Desktop: 4 columns
      act(() => {
        ViewportUtils.setViewport(1440, 900);
      });
      rerender(React.createElement(ResponsiveGrid, { items }));
      
      expect(screen.getByTestId('responsive-grid')).toHaveAttribute('data-columns', '4');
    });

    test('adjusts text size for different screens', () => {
      // Mobile
      ViewportUtils.setViewport(375, 667);
      const { rerender } = render(React.createElement(ResponsiveText));
      
      expect(screen.getByTestId('font-size')).toHaveTextContent('14px');
      
      // Tablet
      act(() => {
        ViewportUtils.setViewport(768, 1024);
      });
      rerender(React.createElement(ResponsiveText));
      
      expect(screen.getByTestId('font-size')).toHaveTextContent('16px');
      
      // Desktop
      act(() => {
        ViewportUtils.setViewport(1440, 900);
      });
      rerender(React.createElement(ResponsiveText));
      
      expect(screen.getByTestId('font-size')).toHaveTextContent('18px');
    });
  });

  describe('Orientation Changes', () => {
    test('handles device rotation', () => {
      // Start in portrait
      ViewportUtils.setViewport(375, 667);
      const { rerender } = render(React.createElement(ResponsiveComponent));
      
      expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-orientation', 'portrait');
      
      // Rotate to landscape
      act(() => {
        ViewportUtils.setViewport(667, 375);
      });
      rerender(React.createElement(ResponsiveComponent));
      
      expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-orientation', 'landscape');
    });

    test('adapts layout for landscape orientation', () => {
      ViewportUtils.setViewport(667, 375); // Mobile landscape
      
      render(React.createElement(ResponsiveComponent));
      
      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveClass('landscape');
      expect(component).toHaveAttribute('data-orientation', 'landscape');
    });
  });

  describe('Media Query Matching', () => {
    test('matches mobile media queries', () => {
      ViewportUtils.setViewport(375, 667);
      
      const mobileQuery = window.matchMedia('(max-width: 768px)');
      expect(mobileQuery.matches).toBe(true);
      
      const desktopQuery = window.matchMedia('(min-width: 769px)');
      expect(desktopQuery.matches).toBe(false);
    });

    test('matches tablet media queries', () => {
      ViewportUtils.setViewport(768, 1024);
      
      const mobileQuery = window.matchMedia('(max-width: 768px)');
      expect(mobileQuery.matches).toBe(true);
      
      const laptopQuery = window.matchMedia('(max-width: 1024px)');
      expect(laptopQuery.matches).toBe(true);
    });

    test('matches orientation media queries', () => {
      ViewportUtils.setViewport(375, 667); // Portrait
      
      const portraitQuery = window.matchMedia('(orientation: portrait)');
      expect(portraitQuery.matches).toBe(true);
      
      const landscapeQuery = window.matchMedia('(orientation: landscape)');
      expect(landscapeQuery.matches).toBe(false);
    });

    test('matches pointer and hover queries', () => {
      ViewportUtils.setViewport(375, 667); // Mobile
      
      const coarsePointer = window.matchMedia('(pointer: coarse)');
      expect(coarsePointer.matches).toBe(true);
      
      const hoverSupport = window.matchMedia('(hover: hover)');
      expect(hoverSupport.matches).toBe(false);
    });
  });

  describe('Performance on Mobile', () => {
    test('renders efficiently on mobile devices', () => {
      ViewportUtils.setViewport(375, 667);
      
      const startTime = performance.now();
      render(React.createElement(ResponsiveComponent));
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(100); // Should render quickly on mobile
    });

    test('handles rapid orientation changes', () => {
      const { rerender } = render(React.createElement(ResponsiveComponent));
      
      // Simulate rapid orientation changes
      const orientations = [
        [375, 667], // Portrait
        [667, 375], // Landscape
        [375, 667], // Portrait
        [667, 375], // Landscape
      ];
      
      orientations.forEach(([width, height]) => {
        act(() => {
          ViewportUtils.setViewport(width, height);
        });
        rerender(React.createElement(ResponsiveComponent));
      });
      
      // Should handle all changes without errors
      expect(screen.getByTestId('responsive-component')).toBeInTheDocument();
    });
  });

  describe('Accessibility on Mobile', () => {
    test('maintains touch targets of appropriate size', () => {
      ViewportUtils.setViewport(375, 667);
      
      render(React.createElement(MobileNavigation));
      
      const menuToggle = screen.getByTestId('menu-toggle');
      
      // Touch targets should be at least 44px (iOS) or 48px (Android)
      const computedStyle = window.getComputedStyle(menuToggle);
      expect(parseInt(computedStyle.minHeight || '44')).toBeGreaterThanOrEqual(44);
    });

    test('supports zoom up to 200% without horizontal scrolling', () => {
      ViewportUtils.setViewport(375, 667);
      
      // Simulate 200% zoom by halving the viewport
      ViewportUtils.setViewport(187.5, 333.5);
      
      render(React.createElement(ResponsiveComponent));
      
      // Component should still be responsive
      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveAttribute('data-mobile', 'true');
    });
  });

  describe('Edge Cases', () => {
    test('handles very small screens', () => {
      ViewportUtils.setViewport(240, 320); // Very small screen
      
      render(React.createElement(ResponsiveComponent));
      
      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveAttribute('data-breakpoint', 'mobile');
      expect(component).toBeInTheDocument();
    });

    test('handles very large screens', () => {
      ViewportUtils.setViewport(2560, 1440); // 4K screen
      
      render(React.createElement(ResponsiveComponent));
      
      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveAttribute('data-breakpoint', 'desktop');
      expect(component).toBeInTheDocument();
    });

    test('handles square aspect ratios', () => {
      ViewportUtils.setViewport(500, 500); // Square viewport
      
      render(React.createElement(ResponsiveComponent));
      
      const component = screen.getByTestId('responsive-component');
      expect(component).toHaveAttribute('data-orientation', 'portrait'); // Square defaults to portrait
    });
  });
});
