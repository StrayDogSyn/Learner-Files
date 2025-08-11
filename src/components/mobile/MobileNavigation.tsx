import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  User,
  Briefcase,
  Mail,
  Settings,
  Search,
  Bell,
  Moon,
  Sun,
  Globe,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Share2,
  Download,
  Heart,
  Star,
  Bookmark,
  History,
  HelpCircle,
  LogOut,
  ArrowLeft,
  Filter,
  SortAsc,
  Grid,
  List,
  MoreVertical
} from 'lucide-react';
import TouchGestureHandler from './TouchGestureHandler';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: number;
  external?: boolean;
  children?: NavigationItem[];
  disabled?: boolean;
}

interface MobileNavigationProps {
  items: NavigationItem[];
  currentPath?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  onItemClick?: (item: NavigationItem) => void;
  className?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showNotifications?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  onThemeToggle?: () => void;
  showUserMenu?: boolean;
  userInfo?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onUserMenuClick?: () => void;
  showQuickActions?: boolean;
  quickActions?: NavigationItem[];
  swipeToClose?: boolean;
  backdropBlur?: boolean;
  position?: 'left' | 'right';
  width?: string;
}

const defaultItems: NavigationItem[] = [
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
        id: 'projects',
        label: 'Projects',
        icon: <Grid size={18} />,
        href: '/portfolio/projects'
      },
      {
        id: 'skills',
        label: 'Skills',
        icon: <Star size={18} />,
        href: '/portfolio/skills'
      }
    ]
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: <Mail size={20} />,
    href: '/contact'
  }
];

const defaultQuickActions: NavigationItem[] = [
  {
    id: 'share',
    label: 'Share',
    icon: <Share2 size={18} />,
    onClick: () => {}
  },
  {
    id: 'bookmark',
    label: 'Bookmark',
    icon: <Bookmark size={18} />,
    onClick: () => {}
  },
  {
    id: 'download',
    label: 'Download',
    icon: <Download size={18} />,
    onClick: () => {}
  }
];

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items = defaultItems,
  currentPath = '/',
  isOpen = false,
  onToggle,
  onClose,
  onItemClick,
  className = '',
  showSearch = true,
  searchPlaceholder = 'Search...',
  onSearch,
  showNotifications = true,
  notificationCount = 0,
  onNotificationClick,
  theme = 'auto',
  onThemeToggle,
  showUserMenu = true,
  userInfo,
  onUserMenuClick,
  showQuickActions = true,
  quickActions = defaultQuickActions,
  swipeToClose = true,
  backdropBlur = true,
  position = 'left',
  width = '280px'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filteredItems, setFilteredItems] = useState(items);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'recent'>('name');
  
  const navRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }

    const filterItems = (items: NavigationItem[]): NavigationItem[] => {
      return items.filter(item => {
        const matchesQuery = item.label.toLowerCase().includes(searchQuery.toLowerCase());
        const hasMatchingChildren = item.children && filterItems(item.children).length > 0;
        return matchesQuery || hasMatchingChildren;
      }).map(item => ({
        ...item,
        children: item.children ? filterItems(item.children) : undefined
      }));
    };

    setFilteredItems(filterItems(items));
  }, [searchQuery, items]);

  // Handle search input
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  // Handle item expansion
  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  // Handle item click
  const handleItemClick = useCallback((item: NavigationItem, event?: React.MouseEvent) => {
    if (item.disabled) return;
    
    if (item.children && item.children.length > 0) {
      toggleExpanded(item.id);
      return;
    }
    
    if (item.external && item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else if (item.onClick) {
      item.onClick();
    }
    
    onItemClick?.(item);
    
    // Close navigation on item click (except for parent items)
    if (!item.children) {
      onClose?.();
    }
  }, [toggleExpanded, onItemClick, onClose]);

  // Handle swipe to close
  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (!swipeToClose) return;
    
    const shouldClose = (position === 'left' && direction === 'left') || 
                       (position === 'right' && direction === 'right');
    
    if (shouldClose) {
      onClose?.();
    }
  }, [swipeToClose, position, onClose]);

  // Handle pan gesture for drawer
  const handlePan = useCallback((event: any, info: PanInfo) => {
    if (!swipeToClose) return;
    
    const offset = position === 'left' ? info.offset.x : -info.offset.x;
    
    if (offset < 0) {
      setDragOffset(Math.max(offset, -200));
    }
  }, [swipeToClose, position]);

  // Handle pan end
  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    if (!swipeToClose) return;
    
    const offset = position === 'left' ? info.offset.x : -info.offset.x;
    const velocity = position === 'left' ? info.velocity.x : -info.velocity.x;
    
    if (offset < -100 || velocity < -500) {
      onClose?.();
    }
    
    setDragOffset(0);
    setIsDragging(false);
  }, [swipeToClose, position, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === backdropRef.current) {
      onClose?.();
    }
  }, [onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose?.();
          break;
        case '/':
          if (showSearch && searchInputRef.current) {
            event.preventDefault();
            searchInputRef.current.focus();
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, showSearch]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, showSearch]);

  // Render navigation item
  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isActive = currentPath === item.href;
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <div key={item.id} className={`nav-item-container level-${level}`}>
        <motion.div
          className={`nav-item ${
            isActive ? 'active' : ''
          } ${
            item.disabled ? 'disabled' : ''
          } ${
            hasChildren ? 'has-children' : ''
          }`}
          onClick={(e) => handleItemClick(item, e)}
          whileTap={{ scale: 0.98 }}
          layout
        >
          <div className="nav-item-content">
            <div className="nav-item-icon">
              {item.icon}
            </div>
            <span className="nav-item-label">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="nav-item-badge">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
            {item.external && (
              <ExternalLink size={14} className="nav-item-external" />
            )}
            {hasChildren && (
              <motion.div
                className="nav-item-chevron"
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} />
              </motion.div>
            )}
          </div>
        </motion.div>
        
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              className="nav-children"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.children!.map(child => renderNavigationItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Render user menu
  const renderUserMenu = () => {
    if (!showUserMenu || !userInfo) return null;
    
    return (
      <div className="user-menu">
        <motion.div
          className="user-info"
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          whileTap={{ scale: 0.98 }}
        >
          <div className="user-avatar">
            {userInfo.avatar ? (
              <img src={userInfo.avatar} alt={userInfo.name} />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="user-details">
            <span className="user-name">{userInfo.name}</span>
            <span className="user-email">{userInfo.email}</span>
          </div>
          <motion.div
            className="user-chevron"
            animate={{ rotate: showUserDropdown ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
        
        <AnimatePresence>
          {showUserDropdown && (
            <motion.div
              className="user-dropdown"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="user-dropdown-item" onClick={onUserMenuClick}>
                <Settings size={16} />
                <span>Settings</span>
              </div>
              <div className="user-dropdown-item">
                <History size={16} />
                <span>History</span>
              </div>
              <div className="user-dropdown-item">
                <HelpCircle size={16} />
                <span>Help</span>
              </div>
              <div className="user-dropdown-divider" />
              <div className="user-dropdown-item logout">
                <LogOut size={16} />
                <span>Sign Out</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Render quick actions
  const renderQuickActions = () => {
    if (!showQuickActions || !quickActions.length) return null;
    
    return (
      <div className="quick-actions">
        <div className="quick-actions-header">
          <span>Quick Actions</span>
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={14} />
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={14} />
            </button>
          </div>
        </div>
        
        <div className={`quick-actions-grid ${viewMode}`}>
          {quickActions.map(action => (
            <motion.div
              key={action.id}
              className="quick-action"
              onClick={() => handleItemClick(action)}
              whileTap={{ scale: 0.95 }}
            >
              <div className="quick-action-icon">
                {action.icon}
              </div>
              <span className="quick-action-label">{action.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Navigation Toggle Button */}
      <button
        className={`nav-toggle ${className}`}
        onClick={onToggle}
        aria-label="Toggle navigation"
      >
        <Menu size={24} />
      </button>

      {/* Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={backdropRef}
            className={`nav-overlay ${backdropBlur ? 'backdrop-blur' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
          >
            <TouchGestureHandler
              onSwipe={handleSwipe}
              className="nav-gesture-area"
            >
              <motion.div
                ref={navRef}
                className={`mobile-navigation ${position}`}
                style={{ width, transform: `translateX(${dragOffset}px)` }}
                initial={{
                  x: position === 'left' ? '-100%' : '100%'
                }}
                animate={{
                  x: 0
                }}
                exit={{
                  x: position === 'left' ? '-100%' : '100%'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }}
                drag={swipeToClose ? 'x' : false}
                dragConstraints={{ left: position === 'left' ? -200 : 0, right: position === 'right' ? 200 : 0 }}
                dragElastic={0.1}
                onDrag={handlePan}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handlePanEnd}
              >
                {/* Navigation Header */}
                <div className="nav-header">
                  <div className="nav-header-content">
                    <h2 className="nav-title">Navigation</h2>
                    <div className="nav-header-actions">
                      {showNotifications && (
                        <button
                          className="nav-header-btn"
                          onClick={onNotificationClick}
                          aria-label="Notifications"
                        >
                          <Bell size={20} />
                          {notificationCount > 0 && (
                            <span className="notification-badge">
                              {notificationCount > 99 ? '99+' : notificationCount}
                            </span>
                          )}
                        </button>
                      )}
                      
                      {onThemeToggle && (
                        <button
                          className="nav-header-btn"
                          onClick={onThemeToggle}
                          aria-label="Toggle theme"
                        >
                          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                      )}
                      
                      <button
                        className="nav-header-btn"
                        onClick={onClose}
                        aria-label="Close navigation"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Search Bar */}
                  {showSearch && (
                    <div className="nav-search">
                      <div className="search-input-container">
                        <Search size={16} className="search-icon" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder={searchPlaceholder}
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="search-input"
                        />
                        {searchQuery && (
                          <button
                            className="search-clear"
                            onClick={() => handleSearch('')}
                            aria-label="Clear search"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Content */}
                <div className="nav-content">
                  {/* User Menu */}
                  {renderUserMenu()}
                  
                  {/* Navigation Items */}
                  <div className="nav-items">
                    {filteredItems.length > 0 ? (
                      filteredItems.map(item => renderNavigationItem(item))
                    ) : (
                      <div className="nav-empty">
                        <Search size={24} />
                        <span>No items found</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Actions */}
                  {renderQuickActions()}
                </div>

                {/* Navigation Footer */}
                <div className="nav-footer">
                  <div className="nav-footer-info">
                    <Globe size={14} />
                    <span>Portfolio v2.0</span>
                  </div>
                </div>
              </motion.div>
            </TouchGestureHandler>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles */}
      <style>{`
        .nav-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        
        .nav-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
        }
        
        .nav-overlay.backdrop-blur {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        
        .nav-gesture-area {
          height: 100%;
          display: flex;
        }
        
        .mobile-navigation {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
        }
        
        .mobile-navigation.right {
          border-right: none;
          border-left: 1px solid rgba(255, 255, 255, 0.2);
          margin-left: auto;
        }
        
        .nav-header {
          padding: 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .nav-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .nav-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        
        .nav-header-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .nav-header-btn {
          position: relative;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          padding: 6px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .nav-header-btn:hover {
          background: rgba(0, 0, 0, 0.1);
        }
        
        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 0.625rem;
          font-weight: 600;
          padding: 2px 4px;
          border-radius: 8px;
          min-width: 16px;
          text-align: center;
          line-height: 1;
        }
        
        .nav-search {
          margin-top: 16px;
        }
        
        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          color: #6b7280;
          z-index: 1;
        }
        
        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 10px 12px 10px 40px;
          font-size: 0.875rem;
          color: #374151;
          outline: none;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .search-clear {
          position: absolute;
          right: 8px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .search-clear:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .nav-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
        }
        
        .user-menu {
          padding: 0 20px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          margin-bottom: 16px;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .user-info:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .user-details {
          flex: 1;
          min-width: 0;
        }
        
        .user-name {
          display: block;
          font-weight: 600;
          color: #1f2937;
          font-size: 0.875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .user-email {
          display: block;
          color: #6b7280;
          font-size: 0.75rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .user-chevron {
          color: #6b7280;
        }
        
        .user-dropdown {
          margin-top: 8px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .user-dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }
        
        .user-dropdown-item:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .user-dropdown-item.logout {
          color: #ef4444;
        }
        
        .user-dropdown-divider {
          height: 1px;
          background: rgba(0, 0, 0, 0.1);
          margin: 4px 0;
        }
        
        .nav-items {
          padding: 0 20px;
        }
        
        .nav-item-container {
          margin-bottom: 4px;
        }
        
        .nav-item-container.level-1 {
          margin-left: 16px;
        }
        
        .nav-item-container.level-2 {
          margin-left: 32px;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
          text-decoration: none;
        }
        
        .nav-item:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .nav-item.active {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .nav-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .nav-item.disabled:hover {
          background: transparent;
        }
        
        .nav-item-content {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }
        
        .nav-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .nav-item-label {
          flex: 1;
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .nav-item-badge {
          background: #ef4444;
          color: white;
          font-size: 0.625rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
          line-height: 1.2;
        }
        
        .nav-item-external {
          color: #6b7280;
          flex-shrink: 0;
        }
        
        .nav-item-chevron {
          color: #6b7280;
          flex-shrink: 0;
        }
        
        .nav-children {
          overflow: hidden;
        }
        
        .nav-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          color: #6b7280;
          text-align: center;
        }
        
        .nav-empty span {
          margin-top: 8px;
          font-size: 0.875rem;
        }
        
        .quick-actions {
          padding: 16px 20px 0;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          margin-top: 16px;
        }
        
        .quick-actions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .quick-actions-header span {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }
        
        .view-controls {
          display: flex;
          gap: 4px;
        }
        
        .view-btn {
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          padding: 4px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .view-btn:hover,
        .view-btn.active {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.2);
        }
        
        .quick-actions-grid {
          display: grid;
          gap: 8px;
        }
        
        .quick-actions-grid.list {
          grid-template-columns: 1fr;
        }
        
        .quick-actions-grid.grid {
          grid-template-columns: repeat(3, 1fr);
        }
        
        .quick-action {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
        }
        
        .quick-actions-grid.grid .quick-action {
          flex-direction: column;
          text-align: center;
          gap: 4px;
        }
        
        .quick-action:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .quick-action-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .quick-action-label {
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .nav-footer {
          padding: 16px 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(0, 0, 0, 0.02);
        }
        
        .nav-footer-info {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 0.75rem;
        }
        
        /* Dark theme */
        @media (prefers-color-scheme: dark) {
          .mobile-navigation {
            background: rgba(17, 24, 39, 0.95);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .nav-title {
            color: #f9fafb;
          }
          
          .nav-header {
            background: rgba(0, 0, 0, 0.2);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .nav-header-btn {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            color: #d1d5db;
          }
          
          .nav-header-btn:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .search-input {
            background: rgba(0, 0, 0, 0.3);
            border-color: rgba(255, 255, 255, 0.1);
            color: #f9fafb;
          }
          
          .search-icon,
          .search-clear {
            color: #9ca3af;
          }
          
          .user-info {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .user-info:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .user-name {
            color: #f9fafb;
          }
          
          .user-dropdown {
            background: rgba(17, 24, 39, 0.9);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .user-dropdown-item {
            color: #d1d5db;
          }
          
          .user-dropdown-item:hover {
            background: rgba(255, 255, 255, 0.05);
          }
          
          .user-dropdown-divider {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .nav-item {
            color: #d1d5db;
          }
          
          .nav-item:hover {
            background: rgba(255, 255, 255, 0.05);
          }
          
          .nav-empty {
            color: #9ca3af;
          }
          
          .quick-actions-header span {
            color: #f9fafb;
          }
          
          .view-btn {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            color: #9ca3af;
          }
          
          .quick-action {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            color: #d1d5db;
          }
          
          .quick-action:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .nav-footer {
            background: rgba(0, 0, 0, 0.2);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .nav-footer-info {
            color: #9ca3af;
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 480px) {
          .mobile-navigation {
            width: 100vw !important;
            max-width: 320px;
          }
          
          .nav-header {
            padding: 16px;
          }
          
          .nav-items {
            padding: 0 16px;
          }
          
          .quick-actions {
            padding: 16px;
          }
          
          .nav-footer {
            padding: 12px 16px;
          }
        }
        
        /* Landscape orientation */
        @media (orientation: landscape) and (max-height: 500px) {
          .nav-header {
            padding: 12px 20px;
          }
          
          .nav-header-content {
            margin-bottom: 12px;
          }
          
          .nav-search {
            margin-top: 12px;
          }
          
          .nav-content {
            padding: 12px 0;
          }
          
          .user-menu {
            padding: 0 20px 12px;
            margin-bottom: 12px;
          }
          
          .quick-actions {
            padding: 12px 20px 0;
            margin-top: 12px;
          }
          
          .nav-footer {
            padding: 12px 20px;
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .nav-item,
          .nav-header-btn,
          .user-info,
          .quick-action,
          .view-btn {
            transition: none;
          }
          
          .nav-item-chevron,
          .user-chevron {
            transition: none;
          }
        }
        
        /* High contrast */
        @media (prefers-contrast: high) {
          .mobile-navigation {
            border-width: 2px;
          }
          
          .nav-item,
          .nav-header-btn,
          .user-info,
          .quick-action {
            border-width: 2px;
          }
          
          .nav-item.active {
            border-width: 3px;
          }
        }
      `}</style>
    </>
  );
};

export default MobileNavigation;
export type { MobileNavigationProps, NavigationItem };