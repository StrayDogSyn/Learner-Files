'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTransform3D, transform3DPresets, Transform3DPreset } from '@/hooks/useTransform3D';
import { cn } from '@/lib/utils';

interface Transform3DProps {
  children: React.ReactNode;
  preset?: Transform3DPreset;
  config?: {
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
  };
  className?: string;
  containerClassName?: string;
}

export const Transform3D: React.FC<Transform3DProps> = ({
  children,
  preset,
  config,
  className,
  containerClassName
}) => {
  const finalConfig = preset ? transform3DPresets[preset] : config;
  
  if (!finalConfig) {
    throw new Error('Transform3D requires either a preset or config');
  }
  
  const {
    ref,
    containerStyle,
    elementStyle,
    handlers,
    isActive
  } = useTransform3D(finalConfig);
  
  return (
    <div
      ref={ref}
      className={cn('transform-gpu', containerClassName)}
      style={containerStyle}
    >
      <motion.div
        className={cn(
          'transform-gpu transition-transform',
          isActive && 'transform-active',
          className
        )}
        style={elementStyle}
        {...handlers}
        whileHover={finalConfig.trigger === 'hover' ? {
          rotateX: ('rotateX' in finalConfig ? finalConfig.rotateX : 0) || 0,
          rotateY: ('rotateY' in finalConfig ? finalConfig.rotateY : 0) || 0,
          rotateZ: ('rotateZ' in finalConfig ? finalConfig.rotateZ : 0) || 0,
          translateX: ('translateX' in finalConfig ? finalConfig.translateX : 0) || 0,
          translateY: ('translateY' in finalConfig ? finalConfig.translateY : 0) || 0,
          translateZ: ('translateZ' in finalConfig ? finalConfig.translateZ : 0) || 0,
          scale: ('scale' in finalConfig ? finalConfig.scale : 1) || 1,
        } : undefined}
        whileTap={finalConfig.trigger === 'click' ? {
          scale: 0.95
        } : undefined}
        transition={{
          duration: (('duration' in finalConfig ? finalConfig.duration : 300) || 300) / 1000,
          ease: ('easing' in finalConfig ? finalConfig.easing : 'easeOut') || 'easeOut'
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Specialized components for common use cases
export const CardHover3D: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Transform3D preset="cardHover" className={className}>
    {children}
  </Transform3D>
);

export const CardFlip3D: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Transform3D preset="cardFlip" className={className}>
    {children}
  </Transform3D>
);

export const FloatIn3D: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Transform3D preset="floatIn" className={className}>
    {children}
  </Transform3D>
);

export const TiltLeft3D: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Transform3D preset="tiltLeft" className={className}>
    {children}
  </Transform3D>
);

export const TiltRight3D: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Transform3D preset="tiltRight" className={className}>
    {children}
  </Transform3D>
);