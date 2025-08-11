import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import GlassButton from './GlassButton';

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const toastVariants = {
  success: {
    bg: 'bg-emerald-500/20 border-emerald-400/40',
    icon: CheckCircle,
    iconColor: 'text-emerald-400'
  },
  error: {
    bg: 'bg-red-500/20 border-red-400/40',
    icon: AlertCircle,
    iconColor: 'text-red-400'
  },
  warning: {
    bg: 'bg-yellow-500/20 border-yellow-400/40',
    icon: AlertTriangle,
    iconColor: 'text-yellow-400'
  },
  info: {
    bg: 'bg-blue-500/20 border-blue-400/40',
    icon: Info,
    iconColor: 'text-blue-400'
  }
};

const GlassToast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = 'info',
  onClose
}) => {
  const variant = toastVariants[type];
  const Icon = variant.icon;

  return (
    <motion.div
      className={cn(
        'backdrop-blur-md border rounded-lg p-4 shadow-lg max-w-sm w-full',
        variant.bg
      )}
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
      layout
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', variant.iconColor)} />
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-medium text-white mb-1">
              {title}
            </h4>
          )}
          <p className="text-sm text-white/80">
            {message}
          </p>
        </div>
        
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={() => onClose(id)}
          icon={X}
          className="flex-shrink-0 -mt-1 -mr-1"
        />
      </div>
    </motion.div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const GlassToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <GlassToast
            key={toast.id}
            {...toast}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GlassToast;