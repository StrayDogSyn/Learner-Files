import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, User, Briefcase, Mail, ExternalLink } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

interface MobileNavigationProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  currentPath = '/', 
  onNavigate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const lastItemRef = useRef<HTMLAnchorElement>(null);

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: <Home size={20} aria-hidden="true" />
    },
    {
      id: 'about',
      label: 'About',
      href: '/about',
      icon: <User size={20} aria-hidden="true" />
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '/projects',
      icon: <Briefcase size={20} aria-hidden="true" />
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '/contact',
      icon: <Mail size={20} aria-hidden="true" />
    }
  ];

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
      
      // Focus first item when menu opens
      setTimeout(() => {
        firstItemRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = index < navigationItems.length - 1 ? index + 1 : 0;
        setFocusedIndex(nextIndex);
        const nextElement = menuRef.current?.querySelector(
          `[data-nav-index="${nextIndex}"]`
        ) as HTMLElement;
        nextElement?.focus();
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : navigationItems.length - 1;
        setFocusedIndex(prevIndex);
        const prevElement = menuRef.current?.querySelector(
          `[data-nav-index="${prevIndex}"]`
        ) as HTMLElement;
        prevElement?.focus();
        break;
        
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        firstItemRef.current?.focus();
        break;
        
      case 'End':
        event.preventDefault();
        setFocusedIndex(navigationItems.length - 1);
        lastItemRef.current?.focus();
        break;
        
      case 'Tab':
        if (event.shiftKey && index === 0) {
          event.preventDefault();
          lastItemRef.current?.focus();
        } else if (!event.shiftKey && index === navigationItems.length - 1) {
          event.preventDefault();
          firstItemRef.current?.focus();
        }
        break;
    }
  };

  const handleNavigation = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      onNavigate?.(href);
      window.location.href = href;
    }
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <button
        ref={toggleRef}
        className="mobile-nav-toggle xl:hidden"
        onClick={toggleMenu}
        aria-controls="mobile-navigation-menu"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        title={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        type="button"
      >
        <span className="sr-only">
          {isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        </span>
        {isOpen ? (
          <X size={24} aria-hidden="true" className="icon-metallic" />
        ) : (
          <Menu size={24} aria-hidden="true" className="icon-metallic" />
        )}
      </button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-nav-title"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md transition-opacity duration-300"
            aria-hidden="true"
          />
          
          {/* Navigation Panel */}
          <div 
            ref={menuRef}
            className="glass-mobile-menu glass-nav-solid fixed top-0 right-0 h-full w-80 max-w-full transform transition-transform duration-300 ease-out"
            id="mobile-navigation-menu"
          >
            {/* Header */}
            <div className="glass-mobile-header glass-container-minimal p-fluid-sm border-b border-opacity-20 border-silver-steel">
              <div className="flex items-center justify-between">
                <h2 
                  id="mobile-nav-title"
                  className="heading-card brand-text-animated"
                >
                  StrayDog Syndications
                </h2>
                <button
                  onClick={toggleMenu}
                  className="glass-icon-button p-2 rounded-md"
                  aria-label="Close navigation menu"
                  type="button"
                >
                  <X size={24} aria-hidden="true" className="icon-metallic" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <nav 
              className="p-fluid-sm space-y-2"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <ul className="space-y-1" role="menubar" aria-label="Main menu">
                {navigationItems.map((item, index) => {
                  const isActive = currentPath === item.href;
                  const isFirst = index === 0;
                  const isLast = index === navigationItems.length - 1;
                  
                  return (
                    <li key={item.id} role="none">
                      <a
                        ref={isFirst ? firstItemRef : isLast ? lastItemRef : undefined}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(item.href, item.external);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`
                          glass-nav-link mobile-nav-link
                          flex items-center gap-3 p-4 rounded-lg
                          transition-all duration-200 ease-glass
                          hover-glass-morph focus-visible
                          ${isActive ? 'glass-button-active' : ''}
                        `}
                        data-nav-index={index}
                        aria-current={isActive ? 'page' : undefined}
                        role="menuitem"
                        tabIndex={0}
                      >
                        <span className="flex-shrink-0">
                          {item.icon}
                        </span>
                        <span className="font-medium text-fluid-base">
                          {item.label}
                        </span>
                        {item.external && (
                          <ExternalLink 
                            size={16} 
                            aria-hidden="true" 
                            className="ml-auto flex-shrink-0 opacity-60"
                          />
                        )}
                        {isActive && (
                          <span className="sr-only">(current page)</span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="glass-mobile-footer glass-container-light absolute bottom-0 left-0 right-0 p-fluid-sm border-t border-opacity-20 border-silver-steel">
              <div className="text-center">
                <p className="text-caption text-medium-grey">
                  Premium Portfolio Experience
                </p>
                <div className="mt-2 flex justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-core-hunter-green animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-silver-steel animate-pulse animation-delay-200" />
                  <div className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse animation-delay-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .mobile-nav-link {
          position: relative;
          overflow: hidden;
        }
        
        .mobile-nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(53, 94, 59, 0.1) 50%,
            transparent 100%
          );
          transition: left 0.3s ease;
          pointer-events: none;
        }
        
        .mobile-nav-link:hover::before {
          left: 100%;
        }
        
        .mobile-nav-link:focus-visible {
          outline: 3px solid var(--a11y-focus-ring);
          outline-offset: 2px;
          border-radius: 8px;
        }
        
        .glass-mobile-menu {
          border-left: 1px solid rgba(72, 73, 75, 0.3);
          box-shadow: 
            -10px 0 30px rgba(0, 0, 0, 0.3),
            inset 1px 0 0 rgba(255, 255, 255, 0.1);
        }
        
        .glass-mobile-header {
        }
        
        .glass-mobile-footer {
        }
        
        @media (prefers-reduced-motion: reduce) {
          .mobile-nav-link::before {
            display: none;
          }
          
          .animate-pulse {
            animation: none;
          }
          
          .transition-all,
          .transition-transform,
          .transition-opacity {
            transition: none;
          }
        }
        
        @media (forced-colors: active) {
          .glass-mobile-menu {
            background: Canvas;
            border: 1px solid CanvasText;
          }
          
          .mobile-nav-link {
            background: ButtonFace;
            color: ButtonText;
            border: 1px solid ButtonText;
          }
          
          .mobile-nav-link:hover,
          .mobile-nav-link:focus {
            background: Highlight;
            color: HighlightText;
          }
        }
        
        @media (max-width: 320px) {
          .glass-mobile-menu {
            width: 100vw;
          }
        }
        
        @supports (padding: max(0px)) {
          .glass-mobile-menu {
            padding-top: max(1rem, env(safe-area-inset-top));
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
};

export default MobileNavigation;