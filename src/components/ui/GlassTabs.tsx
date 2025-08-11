import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface GlassTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: {
    tab: 'px-3 py-2 text-sm',
    content: 'p-4'
  },
  md: {
    tab: 'px-4 py-3 text-base',
    content: 'p-6'
  },
  lg: {
    tab: 'px-6 py-4 text-lg',
    content: 'p-8'
  }
};

const GlassTabs: React.FC<GlassTabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
  className,
  variant = 'default',
  size = 'md'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const sizeConfig = sizes[size];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  const getTabVariantClasses = (isActive: boolean, disabled: boolean) => {
    const baseClasses = cn(
      'relative transition-all duration-200 font-medium',
      sizeConfig.tab,
      disabled && 'opacity-50 cursor-not-allowed'
    );

    switch (variant) {
      case 'pills':
        return cn(
          baseClasses,
          'rounded-lg',
          isActive
            ? 'bg-white/20 text-white shadow-lg backdrop-blur-md'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        );
      case 'underline':
        return cn(
          baseClasses,
          'border-b-2 rounded-none',
          isActive
            ? 'border-emerald-400 text-white'
            : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
        );
      default:
        return cn(
          baseClasses,
          'rounded-t-lg border-b-2',
          isActive
            ? 'bg-white/10 border-emerald-400 text-white backdrop-blur-md'
            : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'
        );
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Navigation */}
      <div className={cn(
        'flex',
        variant === 'underline' ? 'border-b border-white/20' : 'mb-1'
      )}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              className={getTabVariantClasses(isActive, tab.disabled || false)}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              whileHover={!tab.disabled ? { scale: 1.02 } : undefined}
              whileTap={!tab.disabled ? { scale: 0.98 } : undefined}
            >
              <div className="flex items-center space-x-2">
                {Icon && (
                  <Icon className="w-4 h-4" />
                )}
                <span>{tab.label}</span>
              </div>

              {/* Active indicator for pills and default variants */}
              {isActive && variant !== 'underline' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-lg -z-10"
                  layoutId="activeTab"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className={cn(
        'bg-white/5 backdrop-blur-md border border-white/10 rounded-lg',
        variant === 'default' && 'rounded-tl-none',
        sizeConfig.content
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTabContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GlassTabs;