// Glassmorphic UI Components Export
// Centralized exports for all glassmorphic components

export { GlassmorphicCard, type GlassmorphicCardProps } from './GlassmorphicCard';
export { GlassmorphicButton, type GlassmorphicButtonProps } from './GlassmorphicButton';
export { GlassmorphicInput, type GlassmorphicInputProps } from './GlassmorphicInput';
export { 
  GlassmorphicModal, 
  type GlassmorphicModalProps,
  useModal,
  ModalProvider,
  useModalContext
} from './GlassmorphicModal';

// Re-export utility functions
export { cn } from '../../utils/cn';

// Component variants and types for TypeScript
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'metallic';
export type CardVariant = 'base' | 'elevated' | 'subtle' | 'intense';
export type InputVariant = 'default' | 'filled' | 'minimal';
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type BlurLevel = 'sm' | 'md' | 'lg' | 'xl';
export type BorderStyle = 'none' | 'subtle' | 'visible';

// Common props interface
export interface GlassmorphicBaseProps {
  className?: string;
  glow?: boolean;
  shimmer?: boolean;
}

// Theme configuration
export const GLASSMORPHIC_THEME = {
  colors: {
    charcoal: {
      900: '#0A0A0A',
      800: '#1C1C1C',
      700: '#2A2A2A'
    },
    hunterGreen: {
      500: '#355E3B',
      400: '#50C878'
    },
    metallic: {
      400: '#C0C0C0',
      300: '#D7D7D7'
    }
  },
  effects: {
    blur: {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl'
    },
    glass: {
      base: 'bg-glass-base',
      elevated: 'bg-glass-elevated',
      subtle: 'bg-glass-subtle',
      intense: 'bg-glass-intense'
    }
  }
} as const;

// Default export removed to avoid scope issues
// Use named imports instead