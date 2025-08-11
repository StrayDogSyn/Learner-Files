import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'blue' | 'purple' | 'orange';
  showValue?: boolean;
  showTicks?: boolean;
  tickCount?: number;
  label?: string;
  disabled?: boolean;
  vertical?: boolean;
}

const sizes = {
  sm: {
    track: 'h-1',
    thumb: 'w-4 h-4',
    container: vertical => vertical ? 'w-1 h-32' : 'h-1',
    text: 'text-xs'
  },
  md: {
    track: 'h-2',
    thumb: 'w-5 h-5',
    container: vertical => vertical ? 'w-2 h-40' : 'h-2',
    text: 'text-sm'
  },
  lg: {
    track: 'h-3',
    thumb: 'w-6 h-6',
    container: vertical => vertical ? 'w-3 h-48' : 'h-3',
    text: 'text-base'
  }
};

const colors = {
  emerald: {
    track: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    thumb: 'bg-emerald-400 border-emerald-300'
  },
  blue: {
    track: 'bg-gradient-to-r from-blue-400 to-blue-600',
    thumb: 'bg-blue-400 border-blue-300'
  },
  purple: {
    track: 'bg-gradient-to-r from-purple-400 to-purple-600',
    thumb: 'bg-purple-400 border-purple-300'
  },
  orange: {
    track: 'bg-gradient-to-r from-orange-400 to-orange-600',
    thumb: 'bg-orange-400 border-orange-300'
  }
};

const GlassSlider: React.FC<GlassSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = min,
  onChange,
  onChangeEnd,
  className,
  size = 'md',
  color = 'emerald',
  showValue = false,
  showTicks = false,
  tickCount = 5,
  label,
  disabled = false,
  vertical = false
}) => {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const currentValue = value ?? internalValue;
  const sizeConfig = sizes[size];
  const colorConfig = colors[color];
  
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const updateValue = useCallback((clientX: number, clientY: number) => {
    if (!trackRef.current || disabled) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    let newPercentage;
    
    if (vertical) {
      newPercentage = ((rect.bottom - clientY) / rect.height) * 100;
    } else {
      newPercentage = ((clientX - rect.left) / rect.width) * 100;
    }
    
    newPercentage = Math.max(0, Math.min(100, newPercentage));
    const newValue = min + (newPercentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    setInternalValue(clampedValue);
    onChange?.(clampedValue);
  }, [min, max, step, onChange, disabled, vertical]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateValue(e.clientX, e.clientY);
    }
  }, [isDragging, updateValue]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onChangeEnd?.(currentValue);
    }
  }, [isDragging, currentValue, onChangeEnd]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const ticks = showTicks ? Array.from({ length: tickCount }, (_, i) => {
    const tickValue = min + (i / (tickCount - 1)) * (max - min);
    const tickPercentage = ((tickValue - min) / (max - min)) * 100;
    return { value: tickValue, percentage: tickPercentage };
  }) : [];

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className={cn('font-medium text-white/80', sizeConfig.text)}>
            {label}
          </label>
          {showValue && (
            <span className={cn('font-medium text-white/60', sizeConfig.text)}>
              {currentValue}
            </span>
          )}
        </div>
      )}
      
      {/* Slider Container */}
      <div className={cn(
        'relative flex items-center',
        vertical ? 'flex-col h-48 w-8' : 'w-full h-8'
      )}>
        {/* Track */}
        <div
          ref={trackRef}
          className={cn(
            'relative bg-white/20 backdrop-blur-sm rounded-full cursor-pointer',
            vertical ? 'w-2 h-full' : 'w-full h-2',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onMouseDown={handleMouseDown}
        >
          {/* Progress */}
          <motion.div
            className={cn(
              'absolute rounded-full',
              colorConfig.track,
              vertical ? 'w-full bottom-0' : 'h-full left-0'
            )}
            style={{
              [vertical ? 'height' : 'width']: `${percentage}%`
            }}
            initial={false}
            animate={{
              [vertical ? 'height' : 'width']: `${percentage}%`
            }}
            transition={{ duration: isDragging ? 0 : 0.2 }}
          />
          
          {/* Thumb */}
          <motion.div
            className={cn(
              'absolute border-2 rounded-full shadow-lg cursor-grab active:cursor-grabbing',
              'backdrop-blur-md transform -translate-x-1/2 -translate-y-1/2',
              colorConfig.thumb,
              sizeConfig.thumb,
              disabled && 'cursor-not-allowed'
            )}
            style={{
              [vertical ? 'bottom' : 'left']: `${percentage}%`,
              [vertical ? 'left' : 'top']: '50%'
            }}
            whileHover={!disabled ? { scale: 1.1 } : undefined}
            whileDrag={{ scale: 1.2 }}
            animate={{
              [vertical ? 'bottom' : 'left']: `${percentage}%`
            }}
            transition={{ duration: isDragging ? 0 : 0.2 }}
          />
          
          {/* Ticks */}
          {showTicks && (
            <div className={cn(
              'absolute',
              vertical ? 'left-full ml-2 h-full' : 'top-full mt-2 w-full'
            )}>
              {ticks.map((tick, index) => (
                <div
                  key={index}
                  className={cn(
                    'absolute text-white/50',
                    sizeConfig.text,
                    vertical ? 'transform -translate-y-1/2' : 'transform -translate-x-1/2'
                  )}
                  style={{
                    [vertical ? 'bottom' : 'left']: `${tick.percentage}%`
                  }}
                >
                  {Math.round(tick.value)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlassSlider;