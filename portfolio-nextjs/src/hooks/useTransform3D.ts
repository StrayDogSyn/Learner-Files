'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface Transform3DConfig {
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  scale?: number;
  duration?: number;
  easing?: string;
  trigger?: 'hover' | 'scroll' | 'click' | 'always';
}

export const useTransform3D = (config: Transform3DConfig) => {
  const [isActive, setIsActive] = useState(config.trigger === 'always');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  
  useEffect(() => {
    if (config.trigger === 'scroll') {
      setIsActive(inView);
    }
  }, [inView, config.trigger]);
  
  const transform3DStyle = {
    perspective: `${config.perspective || 1000}px`,
    transformStyle: 'preserve-3d' as const,
  };
  
  const elementStyle = {
    transform: isActive ? [
      config.rotateX ? `rotateX(${config.rotateX}deg)` : '',
      config.rotateY ? `rotateY(${config.rotateY}deg)` : '',
      config.rotateZ ? `rotateZ(${config.rotateZ}deg)` : '',
      config.translateX ? `translateX(${config.translateX}px)` : '',
      config.translateY ? `translateY(${config.translateY}px)` : '',
      config.translateZ ? `translateZ(${config.translateZ}px)` : '',
      config.scale ? `scale(${config.scale})` : '',
    ].filter(Boolean).join(' ') : 'none',
    transition: `transform ${config.duration || 300}ms ${config.easing || 'ease-out'}`,
    transformOrigin: 'center center',
  };
  
  const handlers = {
    onMouseEnter: () => config.trigger === 'hover' && setIsActive(true),
    onMouseLeave: () => config.trigger === 'hover' && setIsActive(false),
    onClick: () => config.trigger === 'click' && setIsActive(!isActive),
  };
  
  return {
    ref,
    containerStyle: transform3DStyle,
    elementStyle,
    handlers,
    isActive,
  };
};

// Preset configurations for common 3D effects
export const transform3DPresets = {
  cardHover: {
    perspective: 1000,
    rotateX: 5,
    rotateY: 10,
    translateZ: 20,
    scale: 1.02,
    duration: 300,
    trigger: 'hover' as const
  },
  cardFlip: {
    perspective: 1000,
    rotateY: 180,
    duration: 600,
    trigger: 'hover' as const
  },
  floatIn: {
    perspective: 1000,
    translateY: -20,
    translateZ: 30,
    scale: 1.05,
    duration: 500,
    trigger: 'scroll' as const
  },
  tiltLeft: {
    perspective: 1000,
    rotateY: -15,
    translateZ: 10,
    duration: 400,
    trigger: 'hover' as const
  },
  tiltRight: {
    perspective: 1000,
    rotateY: 15,
    translateZ: 10,
    duration: 400,
    trigger: 'hover' as const
  }
} as const;

export type Transform3DPreset = keyof typeof transform3DPresets;