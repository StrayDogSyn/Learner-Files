import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUp } from 'lucide-react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
  showBackToTop?: boolean;
  stickyHeader?: boolean;
  collapsibleSidebar?: boolean;
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
}

interface ViewportInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  devicePixelRatio: number;
  isTouch: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  header,
  footer,
  sidebar,
  className = '',
  showBackToTop = true,
  stickyHeader = true,
  collapsibleSidebar = true,
  mobileBreakpoint = 768,
  tabletBreakpoint = 1024
}) => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'portrait',
    devicePixelRatio: 1,
    isTouch: false
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBackToTopBtn, setShowBackToTopBtn] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  // Update viewport information
  const updateViewport = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = width > height ? 'landscape' : 'portrait';
    const devicePixelRatio = window.devicePixelRatio || 1;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    setViewport({
      width,
      height,
      isMobile: width < mobileBreakpoint,
      isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
      isDesktop: width >= tabletBreakpoint,
      orientation,
      devicePixelRatio,
      isTouch
    });
  }, [mobileBreakpoint, tabletBreakpoint]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    setScrollY(currentScrollY);
    setIsScrollingUp(currentScrollY < lastScrollY || currentScrollY < 10);
    setLastScrollY(currentScrollY);
    setShowBackToTopBtn(currentScrollY > 300);
  }, [lastScrollY]);

  // Throttled scroll handler
  const throttledScrollHandler = useCallback(() => {
    let ticking = false;
    
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
  }, [handleScroll]);

  // Handle resize events
  const handleResize = useCallback(() => {
    updateViewport();
    
    // Close sidebar on desktop
    if (window.innerWidth >= tabletBreakpoint) {
      setSidebarOpen(false);
    }
  }, [updateViewport, tabletBreakpoint]);

  // Handle orientation change
  const handleOrientationChange = useCallback(() => {
    // Delay to ensure dimensions are updated
    setTimeout(() => {
      updateViewport();
    }, 100);
  }, [updateViewport]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [sidebarOpen]);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside
  const handleSidebarBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSidebarOpen(false);
    }
  };

  // Set up event listeners
  useEffect(() => {
    updateViewport();
    
    const scrollHandler = throttledScrollHandler();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('scroll', scrollHandler, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('scroll', scrollHandler);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleResize, handleOrientationChange, throttledScrollHandler, handleKeyDown]);

  // Measure header height
  useEffect(() => {
    if (headerRef.current) {
      const updateHeaderHeight = () => {
        setHeaderHeight(headerRef.current?.offsetHeight || 0);
      };
      
      updateHeaderHeight();
      
      // Use ResizeObserver to watch for header size changes
      if (window.ResizeObserver) {
        resizeObserver.current = new ResizeObserver(updateHeaderHeight);
        resizeObserver.current.observe(headerRef.current);
      }
      
      return () => {
        if (resizeObserver.current) {
          resizeObserver.current.disconnect();
        }
      };
    }
  }, [header]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (viewport.isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [viewport.isMobile, sidebarOpen]);

  // Add safe area CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--viewport-width', `${viewport.width}px`);
    root.style.setProperty('--viewport-height', `${viewport.height}px`);
    root.style.setProperty('--header-height', `${headerHeight}px`);
    root.style.setProperty('--is-mobile', viewport.isMobile ? '1' : '0');
    root.style.setProperty('--is-tablet', viewport.isTablet ? '1' : '0');
    root.style.setProperty('--is-desktop', viewport.isDesktop ? '1' : '0');
  }, [viewport, headerHeight]);

  return (
    <div 
      className={`responsive-layout ${className}`}
      data-viewport={`${viewport.isMobile ? 'mobile' : viewport.isTablet ? 'tablet' : 'desktop'}`}
      data-orientation={viewport.orientation}
      data-touch={viewport.isTouch}
    >
      {/* Header */}
      {header && (
        <motion.header
          ref={headerRef}
          className={`layout-header ${
            stickyHeader ? 'sticky' : ''
          } ${
            stickyHeader && !isScrollingUp && scrollY > headerHeight ? 'hidden' : ''
          }`}
          initial={false}
          animate={{
            y: stickyHeader && !isScrollingUp && scrollY > headerHeight ? -headerHeight : 0
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="header-content">
            {/* Mobile menu button */}
            {sidebar && viewport.isMobile && collapsibleSidebar && (
              <button
                onClick={toggleSidebar}
                className="mobile-menu-btn"
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={sidebarOpen}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            
            <div className="header-main">
              {header}
            </div>
          </div>
        </motion.header>
      )}

      <div className="layout-body">
        {/* Sidebar */}
        {sidebar && (
          <>
            {/* Mobile sidebar backdrop */}
            <AnimatePresence>
              {sidebarOpen && viewport.isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="sidebar-backdrop"
                  onClick={handleSidebarBackdropClick}
                />
              )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
              ref={sidebarRef}
              className={`layout-sidebar ${
                viewport.isMobile ? 'mobile' : ''
              } ${
                sidebarOpen || !viewport.isMobile ? 'open' : 'closed'
              }`}
              initial={false}
              animate={{
                x: viewport.isMobile && !sidebarOpen ? '-100%' : '0%'
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="sidebar-content">
                {sidebar}
              </div>
            </motion.aside>
          </>
        )}

        {/* Main Content */}
        <main
          ref={mainRef}
          className={`layout-main ${
            sidebar && (!viewport.isMobile || sidebarOpen) ? 'with-sidebar' : ''
          }`}
          style={{
            paddingTop: stickyHeader ? headerHeight : 0
          }}
        >
          <div className="main-content">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="layout-footer">
          <div className="footer-content">
            {footer}
          </div>
        </footer>
      )}

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && showBackToTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="back-to-top"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Styles */}
      <style>{`
        .responsive-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .layout-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: transform 0.3s ease;
        }
        
        .layout-header.sticky {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
        }
        
        .layout-header.hidden {
          transform: translateY(-100%);
        }
        
        .header-content {
          display: flex;
          align-items: center;
          padding: 0 16px;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 64px;
        }
        
        .mobile-menu-btn {
          background: none;
          border: none;
          color: var(--text-primary, #1f2937);
          cursor: pointer;
          padding: 8px;
          margin-right: 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .mobile-menu-btn:hover,
        .mobile-menu-btn:focus {
          background: rgba(0, 0, 0, 0.1);
        }
        
        .header-main {
          flex: 1;
        }
        
        .layout-body {
          display: flex;
          flex: 1;
          position: relative;
        }
        
        .sidebar-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        
        .layout-sidebar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-right: 1px solid rgba(0, 0, 0, 0.1);
          width: 280px;
          flex-shrink: 0;
          z-index: 1000;
        }
        
        .layout-sidebar.mobile {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          max-width: 80vw;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }
        
        .sidebar-content {
          padding: 16px;
          height: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .layout-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        
        .main-content {
          flex: 1;
          padding: 16px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        
        .layout-footer {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          margin-top: auto;
        }
        
        .footer-content {
          padding: 24px 16px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .back-to-top {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--accent-color, #3b82f6);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          transition: all 0.2s ease;
        }
        
        .back-to-top:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .header-content {
            padding: 0 12px;
            min-height: 56px;
          }
          
          .main-content {
            padding: 12px;
          }
          
          .footer-content {
            padding: 16px 12px;
          }
          
          .back-to-top {
            bottom: 16px;
            right: 16px;
            width: 44px;
            height: 44px;
          }
        }
        
        @media (max-width: 480px) {
          .layout-sidebar.mobile {
            width: 100vw;
            max-width: 100vw;
          }
          
          .main-content {
            padding: 8px;
          }
        }
        
        /* Landscape mobile adjustments */
        @media (max-height: 500px) and (orientation: landscape) {
          .header-content {
            min-height: 48px;
          }
          
          .sidebar-content {
            padding: 12px;
          }
        }
        
        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .layout-header,
          .layout-sidebar,
          .layout-footer {
            border-width: 0.5px;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .layout-header,
          .layout-sidebar,
          .layout-footer {
            background: rgba(17, 24, 39, 0.95);
            border-color: rgba(255, 255, 255, 0.1);
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .layout-header,
          .layout-sidebar,
          .back-to-top {
            transition: none;
          }
        }
        
        /* Safe area support for notched devices */
        @supports (padding: max(0px)) {
          .header-content {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
          }
          
          .layout-sidebar.mobile {
            padding-left: env(safe-area-inset-left);
          }
          
          .back-to-top {
            bottom: max(24px, env(safe-area-inset-bottom) + 8px);
            right: max(24px, env(safe-area-inset-right) + 8px);
          }
        }
        
        /* Focus management */
        .mobile-menu-btn:focus-visible,
        .back-to-top:focus-visible {
          outline: 2px solid var(--accent-color, #3b82f6);
          outline-offset: 2px;
        }
        
        /* Touch targets */
        @media (pointer: coarse) {
          .mobile-menu-btn,
          .back-to-top {
            min-width: 44px;
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default ResponsiveLayout;
export type { ResponsiveLayoutProps, ViewportInfo };