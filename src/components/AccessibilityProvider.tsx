import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  useReducedMotion, 
  useHighContrast, 
  useFocusVisible,
  SkipLink,
  announceToScreenReader
} from '../utils/accessibility';

interface AccessibilityContextType {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  isFocusVisible: boolean;
  keyboardNavigation: boolean;
  announceMessage: (message: string, priority?: 'polite' | 'assertive') => void;
  setKeyboardNavigation: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const prefersHighContrast = useHighContrast();
  const isFocusVisible = useFocusVisible();
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setKeyboardNavigation(true);
        document.body.classList.add('keyboard-nav-active');
      }
    };

    const handleMouseDown = () => {
      setKeyboardNavigation(false);
      document.body.classList.remove('keyboard-nav-active');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Apply accessibility classes to body
  useEffect(() => {
    const body = document.body;
    
    if (prefersReducedMotion) {
      body.classList.add('prefers-reduced-motion');
    } else {
      body.classList.remove('prefers-reduced-motion');
    }

    if (prefersHighContrast) {
      body.classList.add('prefers-high-contrast');
    } else {
      body.classList.remove('prefers-high-contrast');
    }

    if (isFocusVisible) {
      body.classList.add('focus-visible-enabled');
    } else {
      body.classList.remove('focus-visible-enabled');
    }
  }, [prefersReducedMotion, prefersHighContrast, isFocusVisible]);

  const announceMessage = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  };

  const value: AccessibilityContextType = {
    prefersReducedMotion,
    prefersHighContrast,
    isFocusVisible,
    keyboardNavigation,
    announceMessage,
    setKeyboardNavigation
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {/* Skip Links */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      
      {/* Live Region for Announcements */}
      <div
        id="live-region"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      
      {/* Assertive Live Region for Urgent Announcements */}
      <div
        id="live-region-assertive"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
      
      {children}
    </AccessibilityContext.Provider>
  );
};

// Accessible Heading Component
export const AccessibleHeading: React.FC<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ level, children, className = '', id }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag 
      id={id}
      className={`${className} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      tabIndex={-1}
    >
      {children}
    </Tag>
  );
};

// Accessible Button Component
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  type?: 'button' | 'submit' | 'reset';
}> = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ariaLabel,
  ariaDescribedBy,
  type = 'button'
}) => {
  const { prefersReducedMotion } = useAccessibility();
  
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const motionClasses = prefersReducedMotion ? '' : 'transform hover:scale-105 active:scale-95';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${motionClasses} ${className}`}
    >
      {children}
    </button>
  );
};

// Accessible Link Component
export const AccessibleLink: React.FC<{
  href: string;
  children: React.ReactNode;
  external?: boolean;
  download?: boolean;
  className?: string;
  ariaLabel?: string;
}> = ({ href, children, external = false, download = false, className = '', ariaLabel }) => {
  const linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href,
    className: `inline-flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${className}`,
    'aria-label': ariaLabel
  };
  
  if (external) {
    linkProps.target = '_blank';
    linkProps.rel = 'noopener noreferrer';
    linkProps['aria-label'] = `${ariaLabel || children} (opens in new tab)`;
  }
  
  if (download) {
    linkProps.download = true;
    linkProps['aria-label'] = `${ariaLabel || children} (download)`;
  }
  
  return (
    <a {...linkProps}>
      {children}
      {external && (
        <svg 
          className="ml-1 w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
          />
        </svg>
      )}
    </a>
  );
};

// Accessible Form Field Component
export const AccessibleFormField: React.FC<{
  id: string;
  label: string;
  children: React.ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
}> = ({ id, label, children, description, error, required = false, className = '' }) => {
  const { announceMessage } = useAccessibility();
  
  useEffect(() => {
    if (error) {
      announceMessage(`Error in ${label}: ${error}`, 'assertive');
    }
  }, [error, label, announceMessage]);
  
  return (
    <div className={`form-field ${className}`}>
      <label 
        id={`${id}-label`}
        htmlFor={id}
        className="form-label"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <div 
          id={`${id}-desc`}
          className="form-description"
        >
          {description}
        </div>
      )}
      
      {children}
      
      {error && (
        <div 
          id={`${id}-error`}
          className="error-text"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default AccessibilityProvider;