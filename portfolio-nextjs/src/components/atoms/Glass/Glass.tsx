'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  GlassConfig, 
  glassPresets, 
  generateGlassClasses, 
  createGlassStyle,
  microInteractions
} from '@/lib/glass-effects';

interface GlassProps extends Omit<HTMLMotionProps<'div'>, 'style'> {
  variant?: keyof typeof glassPresets | 'custom';
  config?: GlassConfig;
  shimmer?: boolean;
  float?: boolean;
  pulseGlow?: boolean;
  interactive?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Glass = forwardRef<HTMLDivElement, GlassProps>((
  {
    variant = 'card',
    config,
    shimmer = false,
    float = false,
    pulseGlow = false,
    interactive = false,
    children,
    className,
    style,
    ...props
  },
  ref
) => {
  // Determine the glass configuration
  const glassConfig = config || (variant !== 'custom' ? glassPresets[variant] : glassPresets.card);
  
  // Generate glass classes
  const glassClasses = generateGlassClasses(glassConfig);
  
  // Generate glass styles
  const glassStyle = createGlassStyle(glassConfig);
  
  // Combine classes
  const combinedClasses = cn(
    'relative rounded-xl overflow-hidden',
    glassClasses,
    {
      'shimmer': shimmer,
      'float': float,
      'pulse-glow': pulseGlow,
      [microInteractions.hover.scale]: interactive,
      [microInteractions.hover.glow]: interactive,
      'cursor-pointer': interactive
    },
    className
  );
  
  // Animation variants
  const animationVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: interactive ? {
      y: -2,
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    } : {},
    tap: interactive ? {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    } : {}
  };
  
  return (
    <motion.div
      ref={ref}
      className={combinedClasses}
      style={{ ...glassStyle, ...style }}
      variants={animationVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {/* Shimmer overlay */}
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
      
      {/* Gradient overlay for enhanced depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Interactive glow effect */}
      {interactive && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />
      )}
    </motion.div>
  );
});

Glass.displayName = 'Glass';

export default Glass;