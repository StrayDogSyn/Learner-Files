import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'blue' | 'purple' | 'orange';
  label?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'ios' | 'minimal';
  icons?: {
    checked?: React.ComponentType<{ className?: string }>;
    unchecked?: React.ComponentType<{ className?: string }>;
  };
}

const sizes = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
    text: 'text-sm',
    icon: 'w-2.5 h-2.5'
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
    text: 'text-base',
    icon: 'w-3 h-3'
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7',
    text: 'text-lg',
    icon: 'w-4 h-4'
  }
};

const colors = {
  emerald: {
    checked: 'bg-emerald-500/80 border-emerald-400',
    unchecked: 'bg-white/20 border-white/30'
  },
  blue: {
    checked: 'bg-blue-500/80 border-blue-400',
    unchecked: 'bg-white/20 border-white/30'
  },
  purple: {
    checked: 'bg-purple-500/80 border-purple-400',
    unchecked: 'bg-white/20 border-white/30'
  },
  orange: {
    checked: 'bg-orange-500/80 border-orange-400',
    unchecked: 'bg-white/20 border-white/30'
  }
};

const GlassToggle: React.FC<GlassToggleProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'md',
  color = 'emerald',
  label,
  description,
  className,
  variant = 'default',
  icons
}) => {
  const [internalChecked, setInternalChecked] = React.useState(checked ?? defaultChecked);
  const isChecked = checked ?? internalChecked;
  
  const sizeConfig = sizes[size];
  const colorConfig = colors[color];
  const CheckedIcon = icons?.checked;
  const UncheckedIcon = icons?.unchecked;

  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setInternalChecked(newChecked);
    onChange?.(newChecked);
  };

  const getTrackClasses = () => {
    const baseClasses = cn(
      'relative inline-flex items-center backdrop-blur-md border rounded-full',
      'transition-all duration-200 cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
      sizeConfig.track,
      disabled && 'opacity-50 cursor-not-allowed'
    );

    switch (variant) {
      case 'ios':
        return cn(
          baseClasses,
          isChecked ? colorConfig.checked : colorConfig.unchecked,
          isChecked ? 'focus:ring-emerald-400/50' : 'focus:ring-white/50'
        );
      case 'minimal':
        return cn(
          baseClasses,
          'bg-transparent border-2',
          isChecked ? `border-${color}-400` : 'border-white/30'
        );
      default:
        return cn(
          baseClasses,
          isChecked ? colorConfig.checked : colorConfig.unchecked,
          'shadow-lg'
        );
    }
  };

  const getThumbClasses = () => {
    const baseClasses = cn(
      'absolute bg-white rounded-full shadow-md transform transition-transform duration-200',
      'flex items-center justify-center',
      sizeConfig.thumb
    );

    return cn(
      baseClasses,
      isChecked ? sizeConfig.translate : 'translate-x-0.5'
    );
  };

  const ToggleSwitch = (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isChecked}
      className={getTrackClasses()}
      onClick={handleToggle}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      <motion.span
        className={getThumbClasses()}
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {/* Icons */}
        {(CheckedIcon || UncheckedIcon) && (
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            {isChecked && CheckedIcon ? (
              <CheckedIcon className={cn(sizeConfig.icon, `text-${color}-600`)} />
            ) : !isChecked && UncheckedIcon ? (
              <UncheckedIcon className={cn(sizeConfig.icon, 'text-gray-400')} />
            ) : null}
          </motion.div>
        )}
      </motion.span>
      
      {/* Track indicator for minimal variant */}
      {variant === 'minimal' && (
        <motion.div
          className={cn(
            'absolute inset-0.5 rounded-full',
            isChecked ? `bg-${color}-400/20` : 'bg-transparent'
          )}
          initial={false}
          animate={{ opacity: isChecked ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );

  if (label || description) {
    return (
      <div className={cn('flex items-start space-x-3', className)}>
        {ToggleSwitch}
        <div className="flex-1">
          {label && (
            <label
              className={cn(
                'font-medium text-white cursor-pointer',
                sizeConfig.text,
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={!disabled ? handleToggle : undefined}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={cn(
              'text-white/60 mt-1',
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
            )}>
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {ToggleSwitch}
    </div>
  );
};

// Toggle Group Component
interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface GlassToggleGroupProps {
  options: ToggleOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  size?: GlassToggleProps['size'];
  variant?: 'default' | 'pills';
}

export const GlassToggleGroup: React.FC<GlassToggleGroupProps> = ({
  options,
  value,
  onChange,
  className,
  size = 'md',
  variant = 'default'
}) => {
  const sizeConfig = sizes[size];

  return (
    <div className={cn(
      'inline-flex bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-1',
      className
    )}>
      {options.map((option) => {
        const isSelected = option.value === value;
        const Icon = option.icon;

        return (
          <motion.button
            key={option.value}
            type="button"
            className={cn(
              'relative flex items-center space-x-2 rounded-md transition-all duration-200',
              'font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400/50',
              sizeConfig.text,
              size === 'sm' ? 'px-3 py-1.5' : size === 'md' ? 'px-4 py-2' : 'px-6 py-3',
              isSelected
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !option.disabled && onChange?.(option.value)}
            disabled={option.disabled}
            whileHover={!option.disabled ? { scale: 1.02 } : undefined}
            whileTap={!option.disabled ? { scale: 0.98 } : undefined}
          >
            {Icon && <Icon className={sizeConfig.icon} />}
            <span>{option.label}</span>
            
            {isSelected && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-md -z-10"
                layoutId="selectedToggle"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default GlassToggle;