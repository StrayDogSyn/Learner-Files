'use client';

import { useState, useRef } from 'react';
import { useAnimation, Variants } from 'framer-motion';

interface MicroInteractionConfig {
  type: 'button' | 'card' | 'icon' | 'text' | 'image';
  variant: string;
  duration?: number;
  delay?: number;
  stagger?: number;
  trigger?: 'hover' | 'tap' | 'focus' | 'inView';
}

// Animation variants for different interaction types
const buttonVariants: Variants = {
  idle: { scale: 1, rotate: 0 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
  pulse: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.6, repeat: Infinity }
  },
  shake: {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.5 }
  },
  bounce: {
    y: [0, -10, 0],
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  glow: {
    boxShadow: [
      '0 0 0 0 rgba(59, 130, 246, 0)',
      '0 0 0 10px rgba(59, 130, 246, 0.1)',
      '0 0 0 0 rgba(59, 130, 246, 0)'
    ],
    transition: { duration: 1, repeat: Infinity }
  }
};

const cardVariants: Variants = {
  idle: { 
    scale: 1, 
    rotateX: 0, 
    rotateY: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  hover: { 
    scale: 1.02,
    rotateX: 5,
    rotateY: 5,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3 }
  },
  flip: {
    rotateY: 180,
    transition: { duration: 0.6 }
  },
  slideUp: {
    y: [20, 0],
    opacity: [0, 1],
    transition: { duration: 0.5 }
  },
  fadeIn: {
    opacity: [0, 1],
    scale: [0.9, 1],
    transition: { duration: 0.4 }
  }
};

const iconVariants: Variants = {
  idle: { rotate: 0, scale: 1 },
  spin: {
    rotate: 360,
    transition: { duration: 1, ease: 'linear', repeat: Infinity }
  },
  wiggle: {
    rotate: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  },
  bounce: {
    y: [0, -5, 0],
    transition: { duration: 0.3, repeat: 2 }
  },
  heartbeat: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.6, repeat: Infinity }
  }
};

const textVariants: Variants = {
  idle: { opacity: 1, y: 0 },
  typewriter: {
    opacity: [0, 1],
    transition: { duration: 0.05, ease: 'linear' }
  },
  slideUp: {
    y: [20, 0],
    opacity: [0, 1],
    transition: { duration: 0.4 }
  },
  fadeIn: {
    opacity: [0, 1],
    transition: { duration: 0.6 }
  },
  glow: {
    textShadow: [
      '0 0 0 transparent',
      '0 0 10px rgba(251, 191, 36, 0.8)',
      '0 0 0 transparent'
    ],
    transition: { duration: 2, repeat: Infinity }
  }
};

const imageVariants: Variants = {
  idle: { scale: 1, filter: 'brightness(1)' },
  zoom: {
    scale: 1.1,
    transition: { duration: 0.3 }
  },
  blur: {
    filter: 'blur(2px)',
    transition: { duration: 0.3 }
  },
  brighten: {
    filter: 'brightness(1.2)',
    transition: { duration: 0.3 }
  },
  parallax: {
    y: [0, -50],
    transition: { duration: 0.8 }
  }
};

const variantMap = {
  button: buttonVariants,
  card: cardVariants,
  icon: iconVariants,
  text: textVariants,
  image: imageVariants
};

export const useMicroInteractions = (config: MicroInteractionConfig) => {
  const [isActive, setIsActive] = useState(false);
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  
  const variants = variantMap[config.type];
  
  const triggerAnimation = async () => {
    if (config.variant in variants) {
      await controls.start(config.variant);
      if (config.trigger !== 'hover') {
        controls.start('idle');
      }
    }
  };
  
  const handlers = {
    onMouseEnter: () => {
      if (config.trigger === 'hover') {
        setIsActive(true);
        controls.start(config.variant);
      }
    },
    onMouseLeave: () => {
      if (config.trigger === 'hover') {
        setIsActive(false);
        controls.start('idle');
      }
    },
    onTap: () => {
      if (config.trigger === 'tap') {
        triggerAnimation();
      }
    },
    onFocus: () => {
      if (config.trigger === 'focus') {
        triggerAnimation();
      }
    }
  };
  
  const motionProps = {
    ref,
    variants,
    animate: controls,
    initial: 'idle',
    ...handlers
  };
  
  return {
    ref,
    motionProps,
    triggerAnimation,
    isActive,
    controls
  };
};

// Preset configurations for common micro-interactions
export const microInteractionPresets = {
  primaryButton: {
    type: 'button' as const,
    variant: 'hover',
    trigger: 'hover' as const
  },
  pulseButton: {
    type: 'button' as const,
    variant: 'pulse',
    trigger: 'hover' as const
  },
  projectCard: {
    type: 'card' as const,
    variant: 'hover',
    trigger: 'hover' as const
  },
  flipCard: {
    type: 'card' as const,
    variant: 'flip',
    trigger: 'tap' as const
  },
  spinIcon: {
    type: 'icon' as const,
    variant: 'spin',
    trigger: 'hover' as const
  },
  glowText: {
    type: 'text' as const,
    variant: 'glow',
    trigger: 'hover' as const
  },
  zoomImage: {
    type: 'image' as const,
    variant: 'zoom',
    trigger: 'hover' as const
  }
} as const;

export type MicroInteractionPreset = keyof typeof microInteractionPresets;