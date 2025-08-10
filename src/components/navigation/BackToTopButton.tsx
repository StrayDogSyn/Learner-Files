import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ArrowUp, Rocket, Zap } from 'lucide-react';

interface BackToTopButtonProps {
  className?: string;
  variant?: 'simple' | 'animated' | 'progress' | 'rocket';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  showAfter?: number;
  smoothDuration?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'purple' | 'gradient' | 'dark';
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  className = '',
  variant = 'animated',
  position = 'bottom-right',
  showAfter = 300,
  smoothDuration = 800,
  size = 'md',
  color = 'gradient'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setIsVisible(scrollTop > showAfter);
    };

    const throttledHandleScroll = throttle(handleScroll, 16); // ~60fps
    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [showAfter]);

  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  const scrollToTop = () => {
    setIsScrolling(true);
    
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };
    
    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / smoothDuration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition * (1 - easedProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  const getPositionClasses = () => {
    const baseClasses = 'fixed z-50';
    switch (position) {
      case 'bottom-left':
        return `${baseClasses} bottom-6 left-6`;
      case 'bottom-center':
        return `${baseClasses} bottom-6 left-1/2 transform -translate-x-1/2`;
      case 'bottom-right':
      default:
        return `${baseClasses} bottom-6 right-6`;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-10 h-10';
      case 'lg':
        return 'w-16 h-16';
      case 'md':
      default:
        return 'w-12 h-12';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'dark':
        return 'bg-gray-800 hover:bg-gray-900 text-white';
      case 'gradient':
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      case 'md':
      default:
        return 'w-5 h-5';
    }
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    },
    hover: {
      scale: 1.1,
      y: -2,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const rocketVariants = {
    idle: {
      y: 0,
      rotate: 0
    },
    hover: {
      y: -4,
      rotate: -5,
      transition: {
        type: 'spring',
        stiffness: 300
      }
    },
    scrolling: {
      y: -8,
      rotate: -10,
      transition: {
        duration: 0.3
      }
    }
  };

  const renderIcon = () => {
    const iconClasses = getIconSize();
    
    switch (variant) {
      case 'simple':
        return <ChevronUp className={iconClasses} />;
      case 'rocket':
        return (
          <motion.div
            variants={rocketVariants}
            animate={isScrolling ? 'scrolling' : 'idle'}
          >
            <Rocket className={iconClasses} />
          </motion.div>
        );
      case 'animated':
        return (
          <motion.div
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <ArrowUp className={iconClasses} />
          </motion.div>
        );
      case 'progress':
      default:
        return <ChevronUp className={iconClasses} />;
    }
  };

  const renderButton = () => {
    const baseClasses = `${getSizeClasses()} ${getColorClasses()} rounded-full shadow-lg backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all duration-200`;
    
    if (variant === 'progress') {
      return (
        <div className="relative">
          {/* Progress Ring */}
          <svg className={`${getSizeClasses()} absolute inset-0 transform -rotate-90`}>
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="2"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - scrollProgress / 100)}`}
              className="transition-all duration-150 ease-out"
            />
          </svg>
          
          {/* Button */}
          <div className={baseClasses}>
            {renderIcon()}
          </div>
        </div>
      );
    }
    
    return (
      <div className={baseClasses}>
        {renderIcon()}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover="hover"
          whileTap="tap"
          onClick={scrollToTop}
          className={`${getPositionClasses()} ${className}`}
          aria-label="Back to top"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              scrollToTop();
            }
          }}
        >
          {renderButton()}
          
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"
          >
            Back to top
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </motion.div>
          
          {/* Pulse Effect */}
          {variant === 'animated' && (
            <motion.div
              className={`absolute inset-0 ${getColorClasses()} rounded-full opacity-30`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
          
          {/* Rocket Trail Effect */}
          {variant === 'rocket' && isScrolling && (
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 20 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="w-1 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-full opacity-70"></div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTopButton;