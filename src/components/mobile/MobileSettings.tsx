import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Monitor,
  Volume2,
  VolumeX,
  Vibrate,
  Battery,
  Wifi,
  Bluetooth,
  Camera,
  Mic,
  Location,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  Info,
  AlertTriangle,
  Moon,
  Sun,
  Zap,
  Database,
  Cloud,
  HardDrive,
  Gauge
} from 'lucide-react';
import TouchGestureHandler from './TouchGestureHandler';

interface SettingItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  type: 'toggle' | 'select' | 'range' | 'input' | 'button' | 'section';
  value?: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  dangerous?: boolean;
  onChange?: (value: any) => void;
  onClick?: () => void;
  children?: SettingItem[];
}

interface MobileSettingsProps {
  isOpen?: boolean;
  onClose?: () => void;
  settings?: SettingItem[];
  className?: string;
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSettingChange?: (settingId: string, value: any) => void;
  onSave?: () => void;
  onReset?: () => void;
  hasUnsavedChanges?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  position?: 'bottom' | 'right' | 'fullscreen';
  showHeader?: boolean;
  showFooter?: boolean;
  swipeToClose?: boolean;
}

const defaultSettings: SettingItem[] = [
  {
    id: 'appearance',
    label: 'Appearance',
    icon: <Palette size={20} />,
    type: 'section',
    children: [
      {
        id: 'theme',
        label: 'Theme',
        description: 'Choose your preferred color scheme',
        icon: <Moon size={18} />,
        type: 'select',
        value: 'auto',
        options: [
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
          { label: 'Auto', value: 'auto' }
        ]
      },
      {
        id: 'animations',
        label: 'Animations',
        description: 'Enable smooth transitions and animations',
        icon: <Zap size={18} />,
        type: 'toggle',
        value: true
      },
      {
        id: 'font-size',
        label: 'Font Size',
        description: 'Adjust text size for better readability',
        icon: <Monitor size={18} />,
        type: 'range',
        value: 16,
        min: 12,
        max: 24,
        step: 1,
        unit: 'px'
      }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell size={20} />,
    type: 'section',
    children: [
      {
        id: 'push-notifications',
        label: 'Push Notifications',
        description: 'Receive notifications when app is closed',
        icon: <Bell size={18} />,
        type: 'toggle',
        value: true
      },
      {
        id: 'sound',
        label: 'Sound',
        description: 'Play sound for notifications',
        icon: <Volume2 size={18} />,
        type: 'toggle',
        value: true
      },
      {
        id: 'vibration',
        label: 'Vibration',
        description: 'Vibrate for notifications and interactions',
        icon: <Vibrate size={18} />,
        type: 'toggle',
        value: true
      }
    ]
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    icon: <Shield size={20} />,
    type: 'section',
    children: [
      {
        id: 'analytics',
        label: 'Analytics',
        description: 'Help improve the app by sharing usage data',
        icon: <Gauge size={18} />,
        type: 'toggle',
        value: false
      },
      {
        id: 'location',
        label: 'Location Access',
        description: 'Allow app to access your location',
        icon: <Location size={18} />,
        type: 'toggle',
        value: false
      },
      {
        id: 'camera',
        label: 'Camera Access',
        description: 'Allow app to access your camera',
        icon: <Camera size={18} />,
        type: 'toggle',
        value: false
      }
    ]
  },
  {
    id: 'storage',
    label: 'Storage & Data',
    icon: <Database size={20} />,
    type: 'section',
    children: [
      {
        id: 'offline-mode',
        label: 'Offline Mode',
        description: 'Enable offline functionality',
        icon: <Cloud size={18} />,
        type: 'toggle',
        value: true
      },
      {
        id: 'cache-size',
        label: 'Cache Size',
        description: 'Amount of data to store locally',
        icon: <HardDrive size={18} />,
        type: 'range',
        value: 100,
        min: 50,
        max: 500,
        step: 25,
        unit: 'MB'
      },
      {
        id: 'clear-cache',
        label: 'Clear Cache',
        description: 'Remove all cached data',
        icon: <Trash2 size={18} />,
        type: 'button',
        dangerous: true
      }
    ]
  }
];

const MobileSettings: React.FC<MobileSettingsProps> = ({
  isOpen = false,
  onClose,
  settings = defaultSettings,
  className = '',
  title = 'Settings',
  showSearch = true,
  searchPlaceholder = 'Search settings...',
  onSettingChange,
  onSave,
  onReset,
  hasUnsavedChanges = false,
  theme = 'auto',
  position = 'bottom',
  showHeader = true,
  showFooter = true,
  swipeToClose = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['appearance']));
  const [filteredSettings, setFilteredSettings] = useState(settings);
  const [localValues, setLocalValues] = useState<Record<string, any>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize local values from settings
  useEffect(() => {
    const initializeValues = (items: SettingItem[]) => {
      const values: Record<string, any> = {};
      items.forEach(item => {
        if (item.value !== undefined) {
          values[item.id] = item.value;
        }
        if (item.children) {
          Object.assign(values, initializeValues(item.children));
        }
      });
      return values;
    };
    
    setLocalValues(initializeValues(settings));
  }, [settings]);

  // Filter settings based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSettings(settings);
      return;
    }

    const filterItems = (items: SettingItem[]): SettingItem[] => {
      return items.filter(item => {
        const matchesQuery = 
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const hasMatchingChildren = item.children && filterItems(item.children).length > 0;
        
        return matchesQuery || hasMatchingChildren;
      }).map(item => ({
        ...item,
        children: item.children ? filterItems(item.children) : undefined
      }));
    };

    const filtered = filterItems(settings);
    setFilteredSettings(filtered);
    
    // Auto-expand sections with matches
    if (searchQuery.trim()) {
      const sectionsWithMatches = new Set<string>();
      filtered.forEach(item => {
        if (item.type === 'section' && item.children && item.children.length > 0) {
          sectionsWithMatches.add(item.id);
        }
      });
      setExpandedSections(sectionsWithMatches);
    }
  }, [searchQuery, settings]);

  // Handle setting value change
  const handleSettingChange = useCallback((settingId: string, value: any) => {
    setLocalValues(prev => ({ ...prev, [settingId]: value }));
    onSettingChange?.(settingId, value);
  }, [onSettingChange]);

  // Handle section toggle
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Handle dangerous action confirmation
  const handleDangerousAction = useCallback((settingId: string, action: () => void) => {
    setShowConfirmDialog(settingId);
  }, []);

  // Handle swipe to close
  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (!swipeToClose) return;
    
    if ((position === 'bottom' && direction === 'down') ||
        (position === 'right' && direction === 'right')) {
      onClose?.();
    }
  }, [swipeToClose, position, onClose]);

  // Handle pan gesture
  const handlePan = useCallback((event: any, info: any) => {
    if (!swipeToClose) return;
    
    let offset = 0;
    if (position === 'bottom') {
      offset = Math.max(0, info.offset.y);
    } else if (position === 'right') {
      offset = Math.max(0, info.offset.x);
    }
    
    setDragOffset(offset);
  }, [swipeToClose, position]);

  // Handle pan end
  const handlePanEnd = useCallback((event: any, info: any) => {
    if (!swipeToClose) return;
    
    let shouldClose = false;
    if (position === 'bottom') {
      shouldClose = info.offset.y > 100 || info.velocity.y > 500;
    } else if (position === 'right') {
      shouldClose = info.offset.x > 100 || info.velocity.x > 500;
    }
    
    if (shouldClose) {
      onClose?.();
    }
    
    setDragOffset(0);
    setIsDragging(false);
  }, [swipeToClose, position, onClose]);

  // Render setting item
  const renderSettingItem = (item: SettingItem, level: number = 0) => {
    const currentValue = localValues[item.id] ?? item.value;
    const isExpanded = expandedSections.has(item.id);
    
    if (item.type === 'section') {
      return (
        <div key={item.id} className={`setting-section level-${level}`}>
          <motion.div
            className="section-header"
            onClick={() => toggleSection(item.id)}
            whileTap={{ scale: 0.98 }}
          >
            <div className="section-header-content">
              <div className="section-icon">{item.icon}</div>
              <div className="section-info">
                <span className="section-label">{item.label}</span>
                {item.description && (
                  <span className="section-description">{item.description}</span>
                )}
              </div>
              <motion.div
                className="section-chevron"
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} />
              </motion.div>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {isExpanded && item.children && (
              <motion.div
                className="section-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.children.map(child => renderSettingItem(child, level + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }
    
    return (
      <motion.div
        key={item.id}
        className={`setting-item ${item.disabled ? 'disabled' : ''} ${item.dangerous ? 'dangerous' : ''}`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="setting-content">
          <div className="setting-info">
            <div className="setting-icon">{item.icon}</div>
            <div className="setting-text">
              <span className="setting-label">{item.label}</span>
              {item.description && (
                <span className="setting-description">{item.description}</span>
              )}
            </div>
          </div>
          
          <div className="setting-control">
            {item.type === 'toggle' && (
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={currentValue || false}
                  onChange={(e) => handleSettingChange(item.id, e.target.checked)}
                  disabled={item.disabled}
                />
                <span className="toggle-slider" />
              </label>
            )}
            
            {item.type === 'select' && (
              <select
                value={currentValue || ''}
                onChange={(e) => handleSettingChange(item.id, e.target.value)}
                disabled={item.disabled}
                className="setting-select"
              >
                {item.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {item.type === 'range' && (
              <div className="range-control">
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={currentValue || item.min}
                  onChange={(e) => handleSettingChange(item.id, Number(e.target.value))}
                  disabled={item.disabled}
                  className="setting-range"
                />
                <span className="range-value">
                  {currentValue || item.min}{item.unit}
                </span>
              </div>
            )}
            
            {item.type === 'input' && (
              <input
                type="text"
                value={currentValue || ''}
                onChange={(e) => handleSettingChange(item.id, e.target.value)}
                disabled={item.disabled}
                className="setting-input"
              />
            )}
            
            {item.type === 'button' && (
              <button
                onClick={() => {
                  if (item.dangerous) {
                    handleDangerousAction(item.id, item.onClick || (() => {}));
                  } else {
                    item.onClick?.();
                  }
                }}
                disabled={item.disabled}
                className={`setting-button ${item.dangerous ? 'dangerous' : ''}`}
              >
                {item.dangerous ? <AlertTriangle size={16} /> : <Settings size={16} />}
                Action
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="settings-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onClose?.();
              }
            }}
          >
            <TouchGestureHandler
              onSwipe={handleSwipe}
              className="settings-gesture-area"
            >
              <motion.div
                className={`mobile-settings ${position} ${className}`}
                style={{
                  transform: position === 'bottom' 
                    ? `translateY(${dragOffset}px)` 
                    : position === 'right'
                    ? `translateX(${dragOffset}px)`
                    : 'none'
                }}
                initial={{
                  y: position === 'bottom' ? '100%' : 0,
                  x: position === 'right' ? '100%' : 0,
                  scale: position === 'fullscreen' ? 0.9 : 1
                }}
                animate={{
                  y: 0,
                  x: 0,
                  scale: 1
                }}
                exit={{
                  y: position === 'bottom' ? '100%' : 0,
                  x: position === 'right' ? '100%' : 0,
                  scale: position === 'fullscreen' ? 0.9 : 1
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }}
                drag={swipeToClose ? (position === 'bottom' ? 'y' : position === 'right' ? 'x' : false) : false}
                dragConstraints={{
                  top: 0,
                  left: 0,
                  right: position === 'right' ? 200 : 0,
                  bottom: position === 'bottom' ? 200 : 0
                }}
                dragElastic={0.1}
                onDrag={handlePan}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handlePanEnd}
              >
                {/* Header */}
                {showHeader && (
                  <div className="settings-header">
                    <div className="header-content">
                      <h2 className="settings-title">{title}</h2>
                      <button
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close settings"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    {/* Search */}
                    {showSearch && (
                      <div className="search-container">
                        <div className="search-input-wrapper">
                          <Settings size={16} className="search-icon" />
                          <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                          />
                          {searchQuery && (
                            <button
                              className="search-clear"
                              onClick={() => setSearchQuery('')}
                              aria-label="Clear search"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Drag Handle */}
                    {swipeToClose && position === 'bottom' && (
                      <div className="drag-handle" />
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="settings-content">
                  {filteredSettings.length > 0 ? (
                    filteredSettings.map(setting => renderSettingItem(setting))
                  ) : (
                    <div className="settings-empty">
                      <Settings size={24} />
                      <span>No settings found</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {showFooter && (
                  <div className="settings-footer">
                    {hasUnsavedChanges && (
                      <div className="unsaved-changes">
                        <Info size={16} />
                        <span>You have unsaved changes</span>
                      </div>
                    )}
                    
                    <div className="footer-actions">
                      {onReset && (
                        <button
                          className="footer-button secondary"
                          onClick={onReset}
                        >
                          <RefreshCw size={16} />
                          Reset
                        </button>
                      )}
                      
                      {onSave && (
                        <button
                          className="footer-button primary"
                          onClick={onSave}
                          disabled={!hasUnsavedChanges}
                        >
                          <Save size={16} />
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </TouchGestureHandler>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            className="confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="confirm-dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="confirm-header">
                <AlertTriangle size={24} className="confirm-icon" />
                <h3>Confirm Action</h3>
              </div>
              
              <p className="confirm-message">
                This action cannot be undone. Are you sure you want to continue?
              </p>
              
              <div className="confirm-actions">
                <button
                  className="confirm-button cancel"
                  onClick={() => setShowConfirmDialog(null)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-button confirm"
                  onClick={() => {
                    const setting = settings.find(s => s.id === showConfirmDialog);
                    setting?.onClick?.();
                    setShowConfirmDialog(null);
                  }}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles */}
      <style>{`
        .settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        
        .settings-gesture-area {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        
        .mobile-settings {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.2);
        }
        
        .mobile-settings.bottom {
          width: 100%;
          max-width: 500px;
          max-height: 80vh;
          border-radius: 16px 16px 0 0;
          border-bottom: none;
        }
        
        .mobile-settings.right {
          width: 350px;
          height: 100%;
          border-radius: 0;
          border-right: none;
          margin-left: auto;
        }
        
        .mobile-settings.fullscreen {
          width: 100%;
          height: 100%;
          border-radius: 0;
          border: none;
        }
        
        .settings-header {
          padding: 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .settings-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        
        .close-button {
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
        
        .close-button:hover {
          background: rgba(0, 0, 0, 0.1);
        }
        
        .search-container {
          margin-bottom: 16px;
        }
        
        .search-input-wrapper {
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
        
        .drag-handle {
          width: 40px;
          height: 4px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
          margin: 0 auto;
        }
        
        .settings-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
        }
        
        .setting-section {
          margin-bottom: 8px;
        }
        
        .section-header {
          padding: 16px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .section-header:hover {
          background: rgba(0, 0, 0, 0.02);
        }
        
        .section-header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .section-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #3b82f6;
        }
        
        .section-info {
          flex: 1;
          min-width: 0;
        }
        
        .section-label {
          display: block;
          font-weight: 600;
          color: #1f2937;
          font-size: 1rem;
        }
        
        .section-description {
          display: block;
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 2px;
        }
        
        .section-chevron {
          color: #6b7280;
          flex-shrink: 0;
        }
        
        .section-content {
          overflow: hidden;
        }
        
        .setting-item {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }
        
        .setting-item:hover {
          background: rgba(0, 0, 0, 0.02);
        }
        
        .setting-item.disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        
        .setting-item.dangerous {
          border-left: 3px solid #ef4444;
        }
        
        .setting-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        
        .setting-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }
        
        .setting-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #6b7280;
        }
        
        .setting-text {
          flex: 1;
          min-width: 0;
        }
        
        .setting-label {
          display: block;
          font-weight: 500;
          color: #1f2937;
          font-size: 0.875rem;
        }
        
        .setting-description {
          display: block;
          color: #6b7280;
          font-size: 0.75rem;
          margin-top: 2px;
          line-height: 1.3;
        }
        
        .setting-control {
          flex-shrink: 0;
        }
        
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          cursor: pointer;
        }
        
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #e5e7eb;
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: '';
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .toggle-switch input:checked + .toggle-slider {
          background: #3b82f6;
        }
        
        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }
        
        .setting-select {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          padding: 6px 8px;
          font-size: 0.875rem;
          color: #374151;
          outline: none;
          cursor: pointer;
          min-width: 100px;
        }
        
        .setting-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .range-control {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;
        }
        
        .setting-range {
          flex: 1;
          height: 4px;
          border-radius: 2px;
          background: #e5e7eb;
          outline: none;
          cursor: pointer;
        }
        
        .setting-range::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .setting-range::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .range-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          min-width: 40px;
          text-align: right;
        }
        
        .setting-input {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          padding: 6px 8px;
          font-size: 0.875rem;
          color: #374151;
          outline: none;
          min-width: 100px;
        }
        
        .setting-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .setting-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .setting-button:hover {
          background: rgba(0, 0, 0, 0.1);
        }
        
        .setting-button.dangerous {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        
        .setting-button.dangerous:hover {
          background: rgba(239, 68, 68, 0.2);
        }
        
        .settings-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          color: #6b7280;
          text-align: center;
        }
        
        .settings-empty span {
          margin-top: 8px;
          font-size: 0.875rem;
        }
        
        .settings-footer {
          padding: 16px 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(0, 0, 0, 0.02);
        }
        
        .unsaved-changes {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #f59e0b;
          font-size: 0.875rem;
          margin-bottom: 12px;
        }
        
        .footer-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        
        .footer-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid;
        }
        
        .footer-button.secondary {
          background: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.1);
          color: #374151;
        }
        
        .footer-button.secondary:hover {
          background: rgba(0, 0, 0, 0.1);
        }
        
        .footer-button.primary {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }
        
        .footer-button.primary:hover {
          background: #2563eb;
        }
        
        .footer-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .confirm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .confirm-dialog {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        
        .confirm-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .confirm-icon {
          color: #f59e0b;
        }
        
        .confirm-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .confirm-message {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0 0 20px 0;
        }
        
        .confirm-actions {
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        
        .confirm-button {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid;
          min-width: 80px;
        }
        
        .confirm-button.cancel {
          background: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.1);
          color: #374151;
        }
        
        .confirm-button.cancel:hover {
          background: rgba(0, 0, 0, 0.1);
        }
        
        .confirm-button.confirm {
          background: #ef4444;
          border-color: #ef4444;
          color: white;
        }
        
        .confirm-button.confirm:hover {
          background: #dc2626;
        }
        
        /* Dark theme */
        @media (prefers-color-scheme: dark) {
          .mobile-settings {
            background: rgba(17, 24, 39, 0.95);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .settings-title {
            color: #f9fafb;
          }
          
          .settings-header {
            background: rgba(0, 0, 0, 0.2);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .close-button {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            color: #d1d5db;
          }
          
          .close-button:hover {
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
          
          .section-header:hover,
          .setting-item:hover {
            background: rgba(255, 255, 255, 0.05);
          }
          
          .section-label,
          .setting-label {
            color: #f9fafb;
          }
          
          .section-description,
          .setting-description {
            color: #9ca3af;
          }
          
          .setting-select,
          .setting-input {
            background: rgba(0, 0, 0, 0.3);
            border-color: rgba(255, 255, 255, 0.1);
            color: #f9fafb;
          }
          
          .setting-button {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            color: #d1d5db;
          }
          
          .setting-button:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .settings-footer {
            background: rgba(0, 0, 0, 0.2);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .footer-button.secondary {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            color: #d1d5db;
          }
          
          .footer-button.secondary:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .confirm-dialog {
            background: rgba(17, 24, 39, 0.95);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .confirm-header h3 {
            color: #f9fafb;
          }
          
          .confirm-message {
            color: #9ca3af;
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 480px) {
          .mobile-settings.right {
            width: 100%;
          }
          
          .settings-header {
            padding: 16px;
          }
          
          .setting-item {
            padding: 12px 16px;
          }
          
          .settings-footer {
            padding: 12px 16px;
          }
          
          .footer-actions {
            flex-direction: column;
          }
          
          .footer-button {
            justify-content: center;
          }
        }
        
        /* Landscape orientation */
        @media (orientation: landscape) and (max-height: 500px) {
          .mobile-settings.bottom {
            max-height: 90vh;
          }
          
          .settings-header {
            padding: 12px 20px;
          }
          
          .header-content {
            margin-bottom: 12px;
          }
          
          .search-container {
            margin-bottom: 12px;
          }
          
          .setting-item {
            padding: 10px 20px;
          }
          
          .settings-footer {
            padding: 12px 20px;
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .setting-item,
          .section-header,
          .close-button,
          .footer-button,
          .confirm-button {
            transition: none;
          }
          
          .section-chevron {
            transition: none;
          }
          
          .toggle-slider,
          .toggle-slider:before {
            transition: none;
          }
        }
      `}</style>
    </>
  );
};

export default MobileSettings;
export type { MobileSettingsProps, SettingItem };