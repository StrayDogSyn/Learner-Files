import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface GlassDropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
  disabled?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  maxHeight?: string;
}

const sizes = {
  sm: {
    trigger: 'px-3 py-2 text-sm',
    option: 'px-3 py-2 text-sm'
  },
  md: {
    trigger: 'px-4 py-3 text-base',
    option: 'px-4 py-3 text-base'
  },
  lg: {
    trigger: 'px-6 py-4 text-lg',
    option: 'px-6 py-4 text-lg'
  }
};

const GlassDropdown: React.FC<GlassDropdownProps> = ({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  className,
  size = 'md',
  variant = 'default',
  disabled = false,
  searchable = false,
  multiple = false,
  maxHeight = '200px'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (Array.isArray(value) ? value : value ? [value] : []) : value ? [value] : []
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sizeConfig = sizes[size];

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find(option => option.value === value);
  const selectedLabels = selectedValues.map(val => 
    options.find(opt => opt.value === val)?.label
  ).filter(Boolean);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (optionValue: string) => {
    if (multiple) {
      const newSelectedValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(val => val !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newSelectedValues);
      onChange?.(newSelectedValues.join(','));
    } else {
      setSelectedValues([optionValue]);
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const displayText = multiple
    ? selectedLabels.length > 0
      ? selectedLabels.length === 1
        ? selectedLabels[0]
        : `${selectedLabels.length} selected`
      : placeholder
    : selectedOption?.label || placeholder;

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger */}
      <motion.button
        type="button"
        className={cn(
          'w-full flex items-center justify-between',
          'bg-white/10 backdrop-blur-md border border-white/20 rounded-lg',
          'text-white transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50',
          variant === 'minimal' && 'bg-transparent border-white/10',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'hover:bg-white/15 hover:border-white/30',
          sizeConfig.trigger
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.01 } : undefined}
        whileTap={!disabled ? { scale: 0.99 } : undefined}
      >
        <span className={cn(
          'truncate',
          !selectedOption && !selectedLabels.length && 'text-white/50'
        )}>
          {displayText}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2',
            isOpen && 'rotate-180'
          )}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 z-50 mt-1"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden">
              {/* Search Input */}
              {searchable && (
                <div className="p-2 border-b border-white/10">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  />
                </div>
              )}

              {/* Options */}
              <div className="max-h-[200px] overflow-y-auto" style={{ maxHeight }}>
                {filteredOptions.length === 0 ? (
                  <div className={cn('text-white/50 text-center', sizeConfig.option)}>
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option, index) => {
                    const isSelected = multiple
                      ? selectedValues.includes(option.value)
                      : option.value === value;
                    const Icon = option.icon;

                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        className={cn(
                          'w-full flex items-center justify-between text-left transition-colors',
                          'hover:bg-white/10 focus:bg-white/10 focus:outline-none',
                          option.disabled && 'opacity-50 cursor-not-allowed',
                          isSelected && 'bg-emerald-400/20 text-emerald-300',
                          sizeConfig.option
                        )}
                        onClick={() => !option.disabled && handleOptionSelect(option.value)}
                        disabled={option.disabled}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.1, delay: index * 0.02 }}
                      >
                        <div className="flex items-center space-x-2">
                          {Icon && <Icon className="w-4 h-4" />}
                          <span className="text-white">{option.label}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </motion.button>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlassDropdown;