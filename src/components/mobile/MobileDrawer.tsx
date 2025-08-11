import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  X, 
  Home, 
  User, 
  Briefcase, 
  Mail, 
  Settings, 
  Moon, 
  Sun,
  ChevronRight,
  ExternalLink,
  Download,
  Share2,
  Bell,
  Search
} from 'lucide-react';
import TouchGestureHandler from './TouchGestureHandler';

interface DrawerItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  external?: boolean;
  children?: DrawerItem[];
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: DrawerItem[];
  className?: string;
  position?: 'left' | 'right';
  width?: number;
  showOverlay?: boolean;
  closeOnItemClick?: boolean;
  showHeader?: boolean;
  headerContent?: React.ReactNode;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
  theme?: 'light' | 'dark' | 'auto';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

const defaultItems: DrawerItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home size={20} />,
    href: '/'
  },
  {
    id: 'about',
    label: 'About',
    icon: <User size={20} />,
    href: '/about'
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: <Briefcase size={20} />,
    href: '/portfolio',
    children: [
      {
        id: 'web-projects',
        label: 'Web Projects',
        icon: <ChevronRight size={16} />,
        href: '/portfolio/web'
      },
      {
        id: 'mobile-apps',
        label: 'Mobile Apps',
        icon: <ChevronRight size={16} />,
        href: '/portfolio/mobile'
      },
      {
        id: 'design-work',
        label: 'Design Work',
        icon: <ChevronRight size={16} />,
        href: '/portfolio/design'
      }
    ]
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: <Mail size={20} />,
    href: '/contact'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings size={20} />,
    href: '/settings'
  }
];

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  items = defaultItems,
  className = '',
  position = 'left',
  width = 280,
  showOverlay = true,
  closeOnItemClick = true,
  showHeader = true,
  headerContent,
  showFooter = true,
  footerContent,
  theme = 'auto',
  onThemeChange
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  // Handle theme detection
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setCurrentTheme(theme);
    }
  }, [theme]);

  // Filter items based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }
    
    const filterItems = (itemList: DrawerItem[]): DrawerItem[] => {
      return itemList.filter(item => {
        const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase());
        const hasMatchingChildren = item.children && filterItems(item.children).length > 0;
        
        if (matchesSearch || hasMatchingChildren) {
          return {
            ...item,
            children: item.children ? filterItems(item.children) : undefined
          };
        }
        
        return false;
      }).filter(Boolean) as DrawerItem[];
    };
    
    setFilteredItems(filterItems(items));
  }, [searchQuery, items]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle item expansion
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Handle item click
  const handleItemClick = (item: DrawerItem) => {
    if (item.children && item.children.length > 0) {
      toggleExpanded(item.id);
      return;
    }
    
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      if (item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.href;
      }
    }
    
    if (closeOnItemClick) {
      onClose();
    }
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  // Handle pan gesture for closing
  const handlePan = useCallback((event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    const threshold = width * 0.3;
    const velocityThreshold = 500;
    
    if (position === 'left') {
      if (offset.x < -threshold || velocity.x < -velocityThreshold) {
        onClose();
      }
    } else {
      if (offset.x > threshold || velocity.x > velocityThreshold) {
        onClose();
      }
    }
  }, [width, position, onClose]);

  // Handle swipe gesture
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if ((position === 'left' && direction === 'left') || 
        (position === 'right' && direction === 'right')) {
      onClose();
    }
  };

  // Render drawer item
  const renderItem = (item: DrawerItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <div key={item.id} className="drawer-item-container">
        <motion.div
          className={`drawer-item level-${level} ${hasChildren ? 'has-children' : ''}`}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleItemClick(item)}
        >
          <div className="item-content">
            <div className="item-icon">{item.icon}</div>
            <span className="item-label">{item.label}</span>
            {item.badge && (
              <span className="item-badge">{item.badge}</span>
            )}
            {item.external && (
              <ExternalLink size={14} className="external-icon" />
            )}
            {hasChildren && (
              <motion.div
                className="expand-icon"
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} />
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="children-container"
            >
              {item.children!.map(child => renderItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          {showOverlay && (
            <motion.div
              ref={overlayRef}
              className="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
            />
          )}
          
          {/* Drawer */}
          <TouchGestureHandler
            onSwipe={handleSwipe}
            className={`mobile-drawer ${className} ${currentTheme}`}
          >
            <motion.div
              ref={drawerRef}
              className={`drawer-container ${position}`}
              initial={{
                x: position === 'left' ? -width : width,
                opacity: 0
              }}
              animate={{
                x: 0,
                opacity: 1
              }}
              exit={{
                x: position === 'left' ? -width : width,
                opacity: 0
              }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200
              }}
              drag="x"
              dragConstraints={{
                left: position === 'left' ? -width : 0,
                right: position === 'right' ? width : 0
              }}
              dragElastic={0.1}
              onPanEnd={handlePan}
              style={{ width }}
            >
              {/* Header */}
              {showHeader && (
                <div className="drawer-header">
                  {headerContent || (
                    <>
                      <div className="header-content">
                        <h2 className="drawer-title">Menu</h2>
                        <div className="header-actions">
                          <button
                            onClick={handleThemeToggle}
                            className="theme-toggle"
                            aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
                          >
                            {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                          </button>
                          <button
                            onClick={onClose}
                            className="close-button"
                            aria-label="Close menu"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Search */}
                      <div className="search-container">
                        <div className="search-input-wrapper">
                          <Search size={16} className="search-icon" />
                          <input
                            type="text"
                            placeholder="Search menu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                          />
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery('')}
                              className="clear-search"
                              aria-label="Clear search"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="drawer-content">
                <nav className="drawer-nav">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => renderItem(item))
                  ) : (
                    <div className="no-results">
                      <p>No items found for "{searchQuery}"</p>
                    </div>
                  )}
                </nav>
              </div>
              
              {/* Footer */}
              {showFooter && (
                <div className="drawer-footer">
                  {footerContent || (
                    <div className="footer-actions">
                      <button className="footer-action" aria-label="Download">
                        <Download size={18} />
                        <span>Download</span>
                      </button>
                      <button className="footer-action" aria-label="Share">
                        <Share2 size={18} />
                        <span>Share</span>
                      </button>
                      <button className="footer-action" aria-label="Notifications">
                        <Bell size={18} />
                        <span>Alerts</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </TouchGestureHandler>
        </>
      )}
    </AnimatePresence>
  );
};

// Styles
const drawerStyles = `
  .drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 998;
  }
  
  .mobile-drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 999;
    pointer-events: none;
  }
  
  .drawer-container {
    height: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    overflow: hidden;
  }
  
  .drawer-container.left {
    left: 0;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .drawer-container.right {
    right: 0;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  /* Dark theme */
  .mobile-drawer.dark .drawer-container {
    background: rgba(17, 24, 39, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
    color: #f9fafb;
  }
  
  .drawer-header {
    padding: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.8);
  }
  
  .mobile-drawer.dark .drawer-header {
    background: rgba(17, 24, 39, 0.8);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .drawer-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary, #1f2937);
    margin: 0;
  }
  
  .mobile-drawer.dark .drawer-title {
    color: #f9fafb;
  }
  
  .header-actions {
    display: flex;
    gap: 8px;
  }
  
  .theme-toggle,
  .close-button {
    background: none;
    border: none;
    padding: 8px;
    border-radius: 8px;
    color: var(--text-secondary, #6b7280);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .theme-toggle:hover,
  .close-button:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--text-primary, #1f2937);
  }
  
  .mobile-drawer.dark .theme-toggle,
  .mobile-drawer.dark .close-button {
    color: #9ca3af;
  }
  
  .mobile-drawer.dark .theme-toggle:hover,
  .mobile-drawer.dark .close-button:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f9fafb;
  }
  
  .search-container {
    margin-top: 16px;
  }
  
  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-icon {
    position: absolute;
    left: 12px;
    color: var(--text-secondary, #6b7280);
    pointer-events: none;
  }
  
  .search-input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    color: var(--text-primary, #1f2937);
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s ease;
  }
  
  .search-input:focus {
    border-color: var(--accent-color, #3b82f6);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .mobile-drawer.dark .search-input {
    background: rgba(55, 65, 81, 0.8);
    border-color: rgba(255, 255, 255, 0.2);
    color: #f9fafb;
  }
  
  .mobile-drawer.dark .search-icon {
    color: #9ca3af;
  }
  
  .clear-search {
    position: absolute;
    right: 8px;
    background: none;
    border: none;
    padding: 4px;
    border-radius: 4px;
    color: var(--text-secondary, #6b7280);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .clear-search:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--text-primary, #1f2937);
  }
  
  .drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }
  
  .drawer-nav {
    padding: 0 8px;
  }
  
  .drawer-item-container {
    margin-bottom: 2px;
  }
  
  .drawer-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    position: relative;
  }
  
  .drawer-item:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  
  .mobile-drawer.dark .drawer-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .drawer-item.level-1 {
    padding-left: 32px;
    font-size: 0.875rem;
  }
  
  .drawer-item.level-2 {
    padding-left: 48px;
    font-size: 0.8125rem;
  }
  
  .item-content {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 12px;
  }
  
  .item-icon {
    color: var(--text-secondary, #6b7280);
    flex-shrink: 0;
  }
  
  .mobile-drawer.dark .item-icon {
    color: #9ca3af;
  }
  
  .item-label {
    flex: 1;
    font-weight: 500;
    color: var(--text-primary, #1f2937);
  }
  
  .mobile-drawer.dark .item-label {
    color: #f9fafb;
  }
  
  .item-badge {
    background: var(--accent-color, #3b82f6);
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }
  
  .external-icon {
    color: var(--text-secondary, #6b7280);
    flex-shrink: 0;
  }
  
  .expand-icon {
    color: var(--text-secondary, #6b7280);
    flex-shrink: 0;
  }
  
  .children-container {
    overflow: hidden;
  }
  
  .no-results {
    padding: 20px;
    text-align: center;
    color: var(--text-secondary, #6b7280);
  }
  
  .mobile-drawer.dark .no-results {
    color: #9ca3af;
  }
  
  .drawer-footer {
    padding: 16px 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.8);
  }
  
  .mobile-drawer.dark .drawer-footer {
    background: rgba(17, 24, 39, 0.8);
    border-top-color: rgba(255, 255, 255, 0.1);
  }
  
  .footer-actions {
    display: flex;
    gap: 8px;
  }
  
  .footer-action {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    background: none;
    border: none;
    border-radius: 8px;
    color: var(--text-secondary, #6b7280);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.75rem;
  }
  
  .footer-action:hover {
    background: rgba(0, 0, 0, 0.05);
    color: var(--text-primary, #1f2937);
  }
  
  .mobile-drawer.dark .footer-action {
    color: #9ca3af;
  }
  
  .mobile-drawer.dark .footer-action:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f9fafb;
  }
  
  /* Scrollbar styling */
  .drawer-content::-webkit-scrollbar {
    width: 4px;
  }
  
  .drawer-content::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .drawer-content::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }
  
  .mobile-drawer.dark .drawer-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }
  
  /* Touch device optimizations */
  @media (pointer: coarse) {
    .drawer-item,
    .theme-toggle,
    .close-button,
    .footer-action {
      min-height: 44px;
    }
  }
  
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .drawer-item,
    .theme-toggle,
    .close-button,
    .expand-icon {
      transition: none;
    }
  }
  
  /* High contrast mode */
  @media (forced-colors: active) {
    .drawer-container {
      background: Canvas;
      border: 1px solid CanvasText;
    }
    
    .drawer-item {
      color: CanvasText;
    }
    
    .drawer-item:hover {
      background: Highlight;
      color: HighlightText;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleId = 'mobile-drawer-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = drawerStyles;
    document.head.appendChild(style);
  }
}

export default MobileDrawer;
export type { MobileDrawerProps, DrawerItem };