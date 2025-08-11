// Glassmorphic UI Components Library
// Export all components for easy importing

export { default as GlassCard } from './GlassCard';
export { default as GlassButton } from './GlassButton';
export { default as GlassInput } from './GlassInput';
export { default as GlassModal } from './GlassModal';
export { default as GlassNavigation } from './GlassNavigation';
export { default as GlassLoader } from './GlassLoader';
export { default as GlassToast, GlassToastContainer } from './GlassToast';
export { default as GlassProgress } from './GlassProgress';
export { default as GlassTable } from './GlassTable';
export { default as GlassTabs } from './GlassTabs';
export { default as GlassDropdown } from './GlassDropdown';
export { default as GlassAccordion } from './GlassAccordion';
export { default as GlassBadge, GlassBadgeGroup } from './GlassBadge';
export { default as GlassSlider } from './GlassSlider';
export { default as GlassToggle, GlassToggleGroup } from './GlassToggle';
export { default as GlassDatePicker } from './GlassDatePicker';

// Component types for TypeScript
export type { ToastProps } from './GlassToast';

// Re-export common types that might be useful
export interface GlassComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface GlassVariantProps {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Theme configuration
export const glassTheme = {
  colors: {
    emerald: {
      primary: 'emerald-400',
      secondary: 'emerald-500',
      accent: 'emerald-300'
    },
    blue: {
      primary: 'blue-400',
      secondary: 'blue-500',
      accent: 'blue-300'
    },
    purple: {
      primary: 'purple-400',
      secondary: 'purple-500',
      accent: 'purple-300'
    },
    orange: {
      primary: 'orange-400',
      secondary: 'orange-500',
      accent: 'orange-300'
    }
  },
  glass: {
    background: 'bg-white/10',
    border: 'border-white/20',
    backdrop: 'backdrop-blur-md'
  },
  animations: {
    duration: {
      fast: 0.15,
      normal: 0.3,
      slow: 0.5
    },
    easing: {
      default: 'ease-out',
      spring: { type: 'spring', damping: 25, stiffness: 300 }
    }
  }
};

// Utility function for consistent glassmorphic styling
export const getGlassClasses = (variant: 'light' | 'medium' | 'heavy' = 'medium') => {
  const variants = {
    light: 'bg-white/5 backdrop-blur-sm border border-white/10',
    medium: 'bg-white/10 backdrop-blur-md border border-white/20',
    heavy: 'bg-white/20 backdrop-blur-lg border border-white/30'
  };
  
  return variants[variant];
};

// Animation presets
export const glassAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  }
};