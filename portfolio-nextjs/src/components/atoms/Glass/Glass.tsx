import React from 'react';
import { motion } from 'framer-motion';
import { useGlassEffect, GlassConfig, glassPresets } from '@/hooks/useGlassEffect';
import { clsx } from 'clsx';

interface GlassProps {
  children: React.ReactNode;
  className?: string;
  config?: GlassConfig | keyof typeof glassPresets;
  as?: keyof JSX.IntrinsicElements;
  animate?: boolean;
}

export const Glass: React.FC<GlassProps> = ({
  children,
  className,
  config = 'card',
  as: Component = 'div',
  animate = true,
  ...props
}) => {
  const { classes, style } = useGlassEffect(config);
  
  const combinedClassName = clsx(
    classes,
    'rounded-xl',
    className
  );
  
  if (animate) {
    return (
      <motion.div
        className={combinedClassName}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return React.createElement(
    Component,
    {
      className: combinedClassName,
      style,
      ...props
    },
    children
  );
};