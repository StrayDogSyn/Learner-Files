import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import GlassButton from './GlassButton';

interface GlassDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  format?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
}

const sizes = {
  sm: {
    input: 'px-3 py-2 text-sm',
    calendar: 'text-sm'
  },
  md: {
    input: 'px-4 py-3 text-base',
    calendar: 'text-base'
  },
  lg: {
    input: 'px-6 py-4 text-lg',
    calendar: 'text-lg'
  }
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const GlassDatePicker: React.FC<GlassDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  className,
  size = 'md',
  disabled = false,
  minDate,
  maxDate,
  format = 'MM/DD/YYYY'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? value.getMonth() : new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(value ? value.getFullYear() : new Date().getFullYear());
  const datePickerRef = useRef<HTMLDivElement>(null);
  const sizeConfig = sizes[size];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return `${month}/${day}/${year}`;
    }
  };

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (isDateDisabled(selectedDate)) return;
    
    onChange?.(selectedDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="w-8 h-8" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected = value && 
        value.getDate() === day && 
        value.getMonth() === currentMonth && 
        value.getFullYear() === currentYear;
      const isDisabled = isDateDisabled(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <motion.button
          key={day}
          type="button"
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium',
            'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50',
            isSelected && 'bg-emerald-500 text-white shadow-lg',
            !isSelected && !isDisabled && 'text-white hover:bg-white/10',
            isToday && !isSelected && 'bg-white/20 text-emerald-400',
            isDisabled && 'text-white/30 cursor-not-allowed'
          )}
          onClick={() => handleDateSelect(day)}
          disabled={isDisabled}
          whileHover={!isDisabled ? { scale: 1.1 } : undefined}
          whileTap={!isDisabled ? { scale: 0.9 } : undefined}
        >
          {day}
        </motion.button>
      );
    }

    return days;
  };

  return (
    <div ref={datePickerRef} className={cn('relative', className)}>
      {/* Input */}
      <motion.button
        type="button"
        className={cn(
          'w-full flex items-center justify-between',
          'bg-white/10 backdrop-blur-md border border-white/20 rounded-lg',
          'text-white transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'hover:bg-white/15 hover:border-white/30',
          sizeConfig.input
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.01 } : undefined}
        whileTap={!disabled ? { scale: 0.99 } : undefined}
      >
        <span className={cn(
          !value && 'text-white/50'
        )}>
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar className="w-4 h-4 text-white/60" />
      </motion.button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 z-50 mt-1"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className={cn(
              'bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-4',
              sizeConfig.calendar
            )}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <GlassButton
                  variant="ghost"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={() => navigateMonth('prev')}
                />
                
                <h3 className="font-semibold text-white">
                  {MONTHS[currentMonth]} {currentYear}
                </h3>
                
                <GlassButton
                  variant="ghost"
                  size="sm"
                  icon={ChevronRight}
                  onClick={() => navigateMonth('next')}
                />
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="w-8 h-8 flex items-center justify-center text-xs font-medium text-white/60"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlassDatePicker;