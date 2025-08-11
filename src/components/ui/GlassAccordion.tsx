import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface GlassAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
  variant?: 'default' | 'separated' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: {
    header: 'px-4 py-3 text-sm',
    content: 'px-4 py-3 text-sm'
  },
  md: {
    header: 'px-6 py-4 text-base',
    content: 'px-6 py-4 text-base'
  },
  lg: {
    header: 'px-8 py-6 text-lg',
    content: 'px-8 py-6 text-lg'
  }
};

const GlassAccordion: React.FC<GlassAccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className,
  variant = 'default',
  size = 'md'
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);
  const sizeConfig = sizes[size];

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setOpenItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };

  const getItemClasses = (index: number, isLast: boolean) => {
    const baseClasses = 'bg-white/10 backdrop-blur-md border border-white/20';
    
    switch (variant) {
      case 'separated':
        return cn(baseClasses, 'rounded-lg mb-2');
      case 'minimal':
        return cn('border-b border-white/10 last:border-b-0');
      default:
        return cn(
          baseClasses,
          index === 0 && 'rounded-t-lg',
          isLast && 'rounded-b-lg',
          !isLast && 'border-b-0'
        );
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {items.map((item, index) => {
        const isOpen = openItems.includes(item.id);
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <motion.div
            key={item.id}
            className={getItemClasses(index, isLast)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {/* Header */}
            <motion.button
              className={cn(
                'w-full flex items-center justify-between text-left',
                'transition-all duration-200 font-medium text-white',
                'focus:outline-none focus:ring-2 focus:ring-emerald-400/50',
                item.disabled && 'opacity-50 cursor-not-allowed',
                !item.disabled && 'hover:bg-white/5',
                variant === 'separated' && 'rounded-lg',
                variant === 'default' && index === 0 && !isOpen && 'rounded-t-lg',
                variant === 'default' && isLast && !isOpen && 'rounded-b-lg',
                sizeConfig.header
              )}
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              whileHover={!item.disabled ? { backgroundColor: 'rgba(255, 255, 255, 0.05)' } : undefined}
              whileTap={!item.disabled ? { scale: 0.99 } : undefined}
            >
              <div className="flex items-center space-x-3">
                {Icon && (
                  <Icon className="w-5 h-5 text-emerald-400" />
                )}
                <span>{item.title}</span>
              </div>
              
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-white/60" />
              </motion.div>
            </motion.button>

            {/* Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className={cn(
                    'border-t border-white/10 text-white/80',
                    sizeConfig.content
                  )}>
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GlassAccordion;