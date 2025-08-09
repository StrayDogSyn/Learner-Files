import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showTagline?: boolean;
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'md', 
  animated = true, 
  showTagline = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1
    },
    hover: {
      scale: 1.05
    }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 10, -10, 0]
    },
    hover: {
      rotate: 360
    }
  };

  const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0
    }
  };

  const taglineVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      variants={animated ? logoVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      whileHover={animated ? "hover" : undefined}
    >
      {/* AI Brain Icon */}
      <motion.div
        className="relative"
        variants={animated ? iconVariants : undefined}
      >
        <Brain 
          size={iconSizes[size]} 
          className="text-hunter-green"
          style={{ color: 'var(--hunter-green)' }}
        />
        <motion.div
          className="absolute -top-1 -right-1"
          animate={animated ? {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          } : undefined}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Zap 
            size={iconSizes[size] * 0.6} 
            className="text-electric-blue"
            style={{ color: 'var(--electric-blue)' }}
          />
        </motion.div>
      </motion.div>

      {/* Brand Text */}
      <motion.div
        className="flex flex-col"
        variants={animated ? textVariants : undefined}
      >
        <div className={`font-heading font-bold ${sizeClasses[size]} text-white leading-tight`}>
          <span className="text-hunter-green" style={{ color: 'var(--hunter-green)' }}>
            Hunter
          </span>
          <span className="text-gray-300 mx-1">&</span>
          <span className="text-electric-blue" style={{ color: 'var(--electric-blue)' }}>
            Cortana
          </span>
        </div>
        
        {showTagline && (
          <motion.div
            className="text-xs text-gray-400 font-body font-medium tracking-wide"
            variants={animated ? taglineVariants : undefined}
          >
            Applied AI Solutions Engineering
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BrandLogo;