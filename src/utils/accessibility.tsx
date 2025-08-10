import React, { useEffect, useRef, useState } from 'react';

// ARIA Live Region Types
export type AriaLiveType = 'polite' | 'assertive' | 'off';

// Focus Management
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    previousActiveElement.current = document.activeElement as HTMLElement;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        previousActiveElement.current?.focus();
      }
    };

    container.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
};

// Announce to Screen Readers
export const announceToScreenReader = (message: string, priority: AriaLiveType = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Screen Reader Only Text
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

// Skip Link Component
export const SkipLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
  >
    {children}
  </a>
);

// Keyboard Navigation Hook
export const useKeyboardNavigation = (items: HTMLElement[], isActive: boolean = true) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive || items.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          setCurrentIndex((prev) => (prev + 1) % items.length);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
          break;
        case 'Home':
          e.preventDefault();
          setCurrentIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentIndex(items.length - 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          items[currentIndex]?.click();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, currentIndex, isActive]);

  useEffect(() => {
    if (isActive && items[currentIndex]) {
      items[currentIndex].focus();
    }
  }, [currentIndex, items, isActive]);

  return { currentIndex, setCurrentIndex };
};

// ARIA Attributes Generator
export const generateAriaAttributes = (options: {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  live?: AriaLiveType;
  atomic?: boolean;
  busy?: boolean;
  hidden?: boolean;
  level?: number;
  setSize?: number;
  posInSet?: number;
  controls?: string;
  owns?: string;
  flowTo?: string;
  role?: string;
}) => {
  const attributes: Record<string, string | boolean | number> = {};

  if (options.label) attributes['aria-label'] = options.label;
  if (options.labelledBy) attributes['aria-labelledby'] = options.labelledBy;
  if (options.describedBy) attributes['aria-describedby'] = options.describedBy;
  if (options.expanded !== undefined) attributes['aria-expanded'] = options.expanded;
  if (options.selected !== undefined) attributes['aria-selected'] = options.selected;
  if (options.checked !== undefined) attributes['aria-checked'] = options.checked;
  if (options.disabled !== undefined) attributes['aria-disabled'] = options.disabled;
  if (options.required !== undefined) attributes['aria-required'] = options.required;
  if (options.invalid !== undefined) attributes['aria-invalid'] = options.invalid;
  if (options.live) attributes['aria-live'] = options.live;
  if (options.atomic !== undefined) attributes['aria-atomic'] = options.atomic;
  if (options.busy !== undefined) attributes['aria-busy'] = options.busy;
  if (options.hidden !== undefined) attributes['aria-hidden'] = options.hidden;
  if (options.level) attributes['aria-level'] = options.level;
  if (options.setSize) attributes['aria-setsize'] = options.setSize;
  if (options.posInSet) attributes['aria-posinset'] = options.posInSet;
  if (options.controls) attributes['aria-controls'] = options.controls;
  if (options.owns) attributes['aria-owns'] = options.owns;
  if (options.flowTo) attributes['aria-flowto'] = options.flowTo;
  if (options.role) attributes['role'] = options.role;

  return attributes;
};

// Color Contrast Checker
export const checkColorContrast = (foreground: string, background: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Reduced Motion Detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// High Contrast Detection
export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
};

// Focus Visible Hook
export const useFocusVisible = () => {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [hadKeyboardEvent, setHadKeyboardEvent] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.altKey || e.ctrlKey) return;
      setHadKeyboardEvent(true);
    };

    const handlePointerDown = () => {
      setHadKeyboardEvent(false);
    };

    const handleFocus = () => {
      setIsFocusVisible(hadKeyboardEvent);
    };

    const handleBlur = () => {
      setIsFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('touchstart', handlePointerDown, true);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handlePointerDown, true);
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('touchstart', handlePointerDown, true);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
    };
  }, [hadKeyboardEvent]);

  return isFocusVisible;
};

// Live Region Hook
export const useLiveRegion = (initialMessage: string = '', priority: AriaLiveType = 'polite') => {
  const [message, setMessage] = useState(initialMessage);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const announce = (newMessage: string, newPriority?: AriaLiveType) => {
    setMessage(newMessage);
    if (liveRegionRef.current && newPriority) {
      liveRegionRef.current.setAttribute('aria-live', newPriority);
    }
  };

  const LiveRegion = () => (
    <div
      ref={liveRegionRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );

  return { announce, LiveRegion };
};

// Form Validation Announcements
export const useFormValidation = () => {
  const { announce } = useLiveRegion('', 'assertive');

  const announceError = (fieldName: string, error: string) => {
    announce(`Error in ${fieldName}: ${error}`);
  };

  const announceSuccess = (message: string) => {
    announce(`Success: ${message}`);
  };

  const announceFieldChange = (fieldName: string, value: string) => {
    announce(`${fieldName} changed to ${value}`);
  };

  return {
    announceError,
    announceSuccess,
    announceFieldChange
  };
};

// Accessible Modal Hook
export const useAccessibleModal = (isOpen: boolean) => {
  const modalRef = useFocusTrap(isOpen);
  const [previousBodyOverflow, setPreviousBodyOverflow] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      setPreviousBodyOverflow(document.body.style.overflow);
      document.body.style.overflow = 'hidden';
      
      // Set aria-hidden on main content
      const mainContent = document.querySelector('main, #root, [role="main"]');
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true');
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = previousBodyOverflow;
      
      // Remove aria-hidden from main content
      const mainContent = document.querySelector('main, #root, [role="main"]');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      const mainContent = document.querySelector('main, #root, [role="main"]');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
    };
  }, [isOpen, previousBodyOverflow]);

  return modalRef;
};

// Accessible Button Props
export const getAccessibleButtonProps = (options: {
  label?: string;
  description?: string;
  pressed?: boolean;
  expanded?: boolean;
  controls?: string;
  disabled?: boolean;
}) => {
  return {
    type: 'button' as const,
    ...generateAriaAttributes({
      label: options.label,
      describedBy: options.description ? `${options.controls}-desc` : undefined,
      expanded: options.expanded,
      controls: options.controls,
      disabled: options.disabled
    }),
    ...(options.pressed !== undefined && { 'aria-pressed': options.pressed })
  };
};

// Accessible Link Props
export const getAccessibleLinkProps = (options: {
  label?: string;
  description?: string;
  external?: boolean;
  download?: boolean;
}) => {
  const props: Record<string, any> = {
    ...generateAriaAttributes({
      label: options.label,
      describedBy: options.description ? 'link-desc' : undefined
    })
  };

  if (options.external) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
    props['aria-label'] = `${options.label || ''} (opens in new tab)`.trim();
  }

  if (options.download) {
    props.download = true;
    props['aria-label'] = `${options.label || ''} (download)`.trim();
  }

  return props;
};

// Accessible Form Field Props
export const getAccessibleFieldProps = (options: {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}) => {
  const describedBy = [];
  if (options.description) describedBy.push(`${options.id}-desc`);
  if (options.error) describedBy.push(`${options.id}-error`);

  return {
    id: options.id,
    'aria-labelledby': `${options.id}-label`,
    'aria-describedby': describedBy.length > 0 ? describedBy.join(' ') : undefined,
    'aria-required': options.required,
    'aria-invalid': !!options.error,
    disabled: options.disabled
  };
};

export default {
  useFocusTrap,
  announceToScreenReader,
  ScreenReaderOnly,
  SkipLink,
  useKeyboardNavigation,
  generateAriaAttributes,
  checkColorContrast,
  useReducedMotion,
  useHighContrast,
  useFocusVisible,
  useLiveRegion,
  useFormValidation,
  useAccessibleModal,
  getAccessibleButtonProps,
  getAccessibleLinkProps,
  getAccessibleFieldProps
};