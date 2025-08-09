import { useMemo } from 'react';
import { clsx } from 'clsx';

export interface GlassConfig {
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  opacity?: number;
  border?: boolean;
  borderOpacity?: number;
  gradient?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animation?: 'none' | 'float' | 'pulse' | 'glow' | 'shimmer';
  intensity?: 'subtle' | 'medium' | 'strong';
}

const glassPresets = {
  card: {
    blur: 'lg',
    opacity: 0.1,
    border: true,
    borderOpacity: 0.2,
    gradient: true,
    shadow: 'xl',
    animation: 'none',
    intensity: 'medium'
  },
  modal: {
    blur: '2xl',
    opacity: 0.15,
    border: true,
    borderOpacity: 0.3,
    gradient: true,
    shadow: '2xl',
    animation: 'float',
    intensity: 'strong'
  },
  navigation: {
    blur: 'xl',
    opacity: 0.08,
    border: true,
    borderOpacity: 0.15,
    gradient: false,
    shadow: 'lg',
    animation: 'none',
    intensity: 'subtle'
  },
  button: {
    blur: 'md',
    opacity: 0.12,
    border: true,
    borderOpacity: 0.25,
    gradient: true,
    shadow: 'lg',
    animation: 'glow',
    intensity: 'medium'
  }
} as const;

export const useGlassEffect = (config: GlassConfig | keyof typeof glassPresets) => {
  const glassConfig = typeof config === 'string' ? glassPresets[config] : config;
  
  const classes = useMemo(() => {
    const classNames: string[] = [];
    
    // Backdrop blur
    if (glassConfig.blur) {
      classNames.push(`backdrop-blur-${glassConfig.blur}`);
    }
    
    // Background with opacity
    if (glassConfig.opacity) {
      const opacityValue = Math.round(glassConfig.opacity * 100);
      classNames.push(`bg-white/${opacityValue}`);
    }
    
    // Border
    if (glassConfig.border) {
      classNames.push('border');
      if (glassConfig.borderOpacity) {
        const borderOpacity = Math.round(glassConfig.borderOpacity * 100);
        classNames.push(`border-white/${borderOpacity}`);
      }
    }
    
    // Gradient overlay
    if (glassConfig.gradient) {
      classNames.push('bg-gradient-to-br', 'from-white/10', 'to-white/5');
    }
    
    // Shadow
    if (glassConfig.shadow) {
      classNames.push(`shadow-${glassConfig.shadow}`);
      switch (glassConfig.intensity) {
        case 'subtle':
          classNames.push('shadow-black/10');
          break;
        case 'medium':
          classNames.push('shadow-black/20');
          break;
        case 'strong':
          classNames.push('shadow-black/30');
          break;
      }
    }
    
    // Animations
    if (glassConfig.animation && glassConfig.animation !== 'none') {
      classNames.push('transition-all', 'duration-300');
      
      switch (glassConfig.animation) {
        case 'float':
          classNames.push('animate-float');
          break;
        case 'pulse':
          classNames.push('hover:scale-105');
          break;
        case 'glow':
          classNames.push('animate-glow');
          break;
        case 'shimmer':
          classNames.push('animate-shimmer', 'relative', 'overflow-hidden');
          break;
      }
    }
    
    return clsx(classNames);
  }, [glassConfig]);
  
  const style = useMemo(() => {
    const styles: React.CSSProperties = {};
    
    if (glassConfig.blur) {
      const blurValues = {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px'
      };
      styles.backdropFilter = `blur(${blurValues[glassConfig.blur]})`;
      styles.WebkitBackdropFilter = `blur(${blurValues[glassConfig.blur]})`;
    }
    
    return styles;
  }, [glassConfig]);
  
  return { classes, style };
};

export { glassPresets };