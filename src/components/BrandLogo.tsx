import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Cpu } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showTagline?: boolean;
  className?: string;
  variant?: 'straydog' | 'hunter-cortana';
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'md', 
  animated = true, 
  showTagline = false,
  className = '',
  variant = 'straydog'
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
    initial: { opacity: 0, scale: 0.8, y: -10 },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0
    },
    hover: {
      scale: 1.05,
      filter: 'drop-shadow(0 0 20px rgba(192, 192, 192, 0.3))'
    }
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 0.8 },
    animate: {
      rotate: 0,
      scale: 1
    },
    hover: {
      rotate: [0, 5, -5, 0],
      scale: 1.1,
      filter: 'drop-shadow(0 0 12px rgba(80, 200, 120, 0.4))'
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
      y: 0,
      transition: { delay: 0.2 }
    }
  };

  const shimmerVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1] as const
      }
    }
  };

  if (variant === 'straydog') {
    return (
      <motion.div
        className={`flex items-center gap-3 ${className}`}
        variants={animated ? logoVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={animated ? "hover" : undefined}
      >
        {/* StrayDog Icon */}
        <motion.div
          className="relative glass-container p-2 rounded-lg"
          variants={animated ? iconVariants : undefined}
        >
          <Shield 
            size={iconSizes[size]} 
            className="text-metallic-silver"
          />
          <motion.div
            className="absolute -top-1 -right-1"
            animate={animated ? {
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            } : undefined}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Cpu 
              size={iconSizes[size] * 0.5} 
              className="text-emerald-accent"
            />
          </motion.div>
        </motion.div>

        {/* StrayDog Syndications Text */}
        <motion.div
          className="flex flex-col"
          variants={animated ? textVariants : undefined}
        >
          <motion.a 
            href="https://www.straydog-syndications-llc.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit StrayDog Syndications LLC"
            className={`font-heading font-bold ${sizeClasses[size]} leading-tight branding-text hover:text-emerald-accent transition-colors duration-300 cursor-pointer`}
            variants={animated ? shimmerVariants : undefined}
            animate={animated ? "animate" : undefined}
          >
            StrayDog Syndications
          </motion.a>
          
          {showTagline && (
            <motion.div
              className="text-xs font-body font-medium tracking-wide branding-text-secondary"
              variants={animated ? taglineVariants : undefined}
            >
              Applied AI Solutions Engineering
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // Hunter & Cortana variant (legacy)
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
        className="relative glass-container p-2 rounded-lg"
        variants={animated ? iconVariants : undefined}
      >
        <Cpu 
          size={iconSizes[size]} 
          className="text-hunter-green"
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
            className="text-emerald-accent"
          />
        </motion.div>
      </motion.div>

      {/* Brand Text */}
      <motion.div
        className="flex flex-col"
        variants={animated ? textVariants : undefined}
      >
        <motion.div 
          className={`font-heading font-bold ${sizeClasses[size]} leading-tight`}
          variants={animated ? shimmerVariants : undefined}
          animate={animated ? "animate" : undefined}
        >
          <span className="text-hunter-green">Hunter</span>
          <span className="text-metallic-silver mx-1">&</span>
          <span className="text-emerald-accent">Cortana</span>
        </motion.div>
        
        {showTagline && (
          <motion.div
            className="text-xs text-sage-grey-green font-body font-medium tracking-wide"
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