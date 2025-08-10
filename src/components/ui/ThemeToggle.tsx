import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'dropdown';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  variant = 'button' 
}) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('system');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
    
    // Add transition class for smooth theme switching
    root.classList.add('theme-transition');
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setIsDropdownOpen(false);
  };

  const getCurrentIcon = () => {
    if (!mounted) return Monitor;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      return systemTheme === 'dark' ? Moon : Sun;
    }
    return theme === 'dark' ? Moon : Sun;
  };

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ] as const;

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="
            group relative flex items-center justify-center
            w-10 h-10 rounded-lg
            bg-glass-dark backdrop-blur-md
            border border-glass-border
            text-metallic-300 hover:text-white
            transition-all duration-300
            hover:scale-105 hover:shadow-glow
            focus:outline-none focus:ring-2 focus:ring-hunter-green-400
          "
          aria-label="Toggle theme"
          aria-expanded={isDropdownOpen}
        >
          {React.createElement(getCurrentIcon(), { size: 18 })}
          
          {/* Ripple Effect */}
          <div className="
            absolute inset-0 rounded-lg
            bg-gradient-to-r from-hunter-green-400/20 to-metallic-400/20
            opacity-0 group-active:opacity-100
            transition-opacity duration-150
          " />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            
            {/* Menu */}
            <div className="
              absolute top-full right-0 mt-2 z-50
              min-w-[140px] py-2
              bg-glass-dark backdrop-blur-md
              border border-glass-border rounded-lg
              shadow-xl animate-fade-in
            ">
              {themes.map((themeOption) => {
                const IconComponent = themeOption.icon;
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => handleThemeChange(themeOption.value)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2
                      text-left text-sm transition-colors duration-200
                      hover:bg-glass-light
                      ${
                        theme === themeOption.value
                          ? 'text-hunter-green-400 bg-glass-light'
                          : 'text-metallic-300 hover:text-white'
                      }
                    `}
                  >
                    <IconComponent size={16} />
                    {themeOption.label}
                    {theme === themeOption.value && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-hunter-green-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Simple button variant
  return (
    <button
      onClick={() => {
        const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        handleThemeChange(nextTheme);
      }}
      className={`
        group relative flex items-center justify-center
        w-10 h-10 rounded-lg
        bg-glass-dark backdrop-blur-md
        border border-glass-border
        text-metallic-300 hover:text-white
        transition-all duration-300
        hover:scale-105 hover:shadow-glow
        focus:outline-none focus:ring-2 focus:ring-hunter-green-400
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
      title={`Current: ${theme} theme`}
    >
      {React.createElement(getCurrentIcon(), { 
        size: 18,
        className: 'transition-transform duration-300 group-hover:rotate-12'
      })}
      
      {/* Ripple Effect */}
      <div className="
        absolute inset-0 rounded-lg
        bg-gradient-to-r from-hunter-green-400/20 to-metallic-400/20
        opacity-0 group-active:opacity-100
        transition-opacity duration-150
      " />
    </button>
  );
};

export default ThemeToggle;