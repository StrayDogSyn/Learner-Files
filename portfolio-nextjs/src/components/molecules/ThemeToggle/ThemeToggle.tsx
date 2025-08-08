'use client';

import React from 'react';
import { Button } from '@/components/atoms/Button';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

// Simple icons as SVG components since we haven't installed lucide-react yet
const SunIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SystemIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  variant = 'button',
  size = 'md'
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
    
    switch (theme) {
      case 'light':
        return <SunIcon className={iconSize} />;
      case 'dark':
        return <MoonIcon className={iconSize} />;
      case 'system':
        return <SystemIcon className={iconSize} />;
      default:
        return <MoonIcon className={iconSize} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      case 'system':
        return 'System theme';
      default:
        return 'Toggle theme';
    }
  };

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <div className="glass-card rounded-lg border border-white/20 p-1">
          <div className="flex items-center space-x-1">
            {(['light', 'dark', 'system'] as const).map((themeOption) => {
              const isActive = theme === themeOption;
              const Icon = themeOption === 'light' ? SunIcon : themeOption === 'dark' ? MoonIcon : SystemIcon;
              
              return (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={cn(
                    'p-2 rounded-md transition-all duration-200 relative',
                    isActive
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                  title={`Switch to ${themeOption} mode`}
                >
                  <Icon className="w-4 h-4" />
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent rounded-md" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
      onClick={toggleTheme}
      className={cn(
        'relative group',
        className
      )}
      title={getLabel()}
    >
      <div className="relative transition-transform duration-300 group-hover:scale-110">
        {getIcon()}
      </div>
      
      {/* Theme indicator */}
      <div className={cn(
        'absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white/20 transition-colors duration-200',
        resolvedTheme === 'dark' ? 'bg-blue-500' : 'bg-amber-500'
      )} />
    </Button>
  );
};

export default ThemeToggle;