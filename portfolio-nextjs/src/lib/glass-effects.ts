/**
 * Advanced Glassmorphism Effects Library
 * Provides utilities for creating sophisticated glass effects and micro-interactions
 */

export interface GlassConfig {
  blur?: number;
  opacity?: number;
  border?: boolean;
  borderOpacity?: number;
  gradient?: boolean;
  shadow?: boolean;
  animation?: 'none' | 'float' | 'pulse' | 'glow' | 'shimmer';
  intensity?: 'subtle' | 'medium' | 'strong';
}

export const glassPresets = {
  card: {
    blur: 16,
    opacity: 0.1,
    border: true,
    borderOpacity: 0.2,
    gradient: true,
    shadow: true,
    animation: 'none',
    intensity: 'medium'
  } as GlassConfig,
  
  modal: {
    blur: 24,
    opacity: 0.15,
    border: true,
    borderOpacity: 0.3,
    gradient: true,
    shadow: true,
    animation: 'float',
    intensity: 'strong'
  } as GlassConfig,
  
  navigation: {
    blur: 20,
    opacity: 0.08,
    border: true,
    borderOpacity: 0.15,
    gradient: false,
    shadow: false,
    animation: 'none',
    intensity: 'subtle'
  } as GlassConfig,
  
  button: {
    blur: 12,
    opacity: 0.12,
    border: true,
    borderOpacity: 0.25,
    gradient: true,
    shadow: true,
    animation: 'glow',
    intensity: 'medium'
  } as GlassConfig,
  
  floating: {
    blur: 18,
    opacity: 0.1,
    border: true,
    borderOpacity: 0.2,
    gradient: true,
    shadow: true,
    animation: 'float',
    intensity: 'medium'
  } as GlassConfig
};

export const generateGlassClasses = (config: GlassConfig): string => {
  const classes: string[] = [];
  
  // Base glass effect
  classes.push('backdrop-blur-md');
  
  // Blur intensity
  if (config.blur) {
    if (config.blur <= 8) classes.push('backdrop-blur-sm');
    else if (config.blur <= 16) classes.push('backdrop-blur-md');
    else if (config.blur <= 24) classes.push('backdrop-blur-lg');
    else classes.push('backdrop-blur-xl');
  }
  
  // Background opacity
  if (config.opacity) {
    const opacityValue = Math.round(config.opacity * 100);
    classes.push(`bg-white/${opacityValue}`);
  }
  
  // Border
  if (config.border) {
    classes.push('border');
    const borderOpacity = config.borderOpacity || 0.2;
    const borderOpacityValue = Math.round(borderOpacity * 100);
    classes.push(`border-white/${borderOpacityValue}`);
  }
  
  // Gradient overlay
  if (config.gradient) {
    classes.push('bg-gradient-to-br', 'from-white/10', 'to-white/5');
  }
  
  // Shadow
  if (config.shadow) {
    switch (config.intensity) {
      case 'subtle':
        classes.push('shadow-lg', 'shadow-black/10');
        break;
      case 'medium':
        classes.push('shadow-xl', 'shadow-black/20');
        break;
      case 'strong':
        classes.push('shadow-2xl', 'shadow-black/30');
        break;
      default:
        classes.push('shadow-xl', 'shadow-black/20');
    }
  }
  
  // Animations
  if (config.animation && config.animation !== 'none') {
    classes.push('transition-all', 'duration-300');
    
    switch (config.animation) {
      case 'float':
        classes.push('hover:translate-y-[-2px]', 'hover:shadow-2xl');
        break;
      case 'pulse':
        classes.push('hover:scale-[1.02]');
        break;
      case 'glow':
        classes.push('hover:shadow-blue-500/20', 'hover:border-blue-400/30');
        break;
      case 'shimmer':
        classes.push('relative', 'overflow-hidden');
        break;
    }
  }
  
  return classes.join(' ');
};

export const createGlassStyle = (config: GlassConfig): React.CSSProperties => {
  const style: React.CSSProperties = {};
  
  if (config.blur) {
    style.backdropFilter = `blur(${config.blur}px)`;
  }
  
  if (config.opacity) {
    style.backgroundColor = `rgba(255, 255, 255, ${config.opacity})`;
  }
  
  return style;
};

// Micro-interaction utilities
export const microInteractions = {
  hover: {
    scale: 'hover:scale-[1.02] transition-transform duration-200',
    lift: 'hover:translate-y-[-2px] transition-transform duration-200',
    glow: 'hover:shadow-lg hover:shadow-blue-500/25 transition-shadow duration-300',
    blur: 'hover:backdrop-blur-lg transition-all duration-300',
    opacity: 'hover:bg-white/15 transition-colors duration-300'
  },
  
  focus: {
    ring: 'focus:ring-2 focus:ring-blue-500/50 focus:outline-none',
    glow: 'focus:shadow-lg focus:shadow-blue-500/25',
    border: 'focus:border-blue-400/50'
  },
  
  active: {
    scale: 'active:scale-[0.98]',
    press: 'active:translate-y-[1px]'
  }
};

// Advanced glass component variants
export const glassVariants = {
  'glass-card': generateGlassClasses(glassPresets.card),
  'glass-modal': generateGlassClasses(glassPresets.modal),
  'glass-nav': generateGlassClasses(glassPresets.navigation),
  'glass-button': generateGlassClasses(glassPresets.button),
  'glass-floating': generateGlassClasses(glassPresets.floating)
};

// Shimmer effect for loading states
export const shimmerEffect = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .shimmer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: shimmer 2s infinite;
  }
`;

// Floating animation keyframes
export const floatingAnimation = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .float {
    animation: float 6s ease-in-out infinite;
  }
`;

// Pulse glow animation
export const pulseGlowAnimation = `
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
  }
  
  .pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }
`;