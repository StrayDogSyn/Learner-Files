import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface GlassTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: keyof T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

function GlassTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  sortBy,
  sortDirection,
  onSort,
  loading = false,
  emptyMessage = 'No data available'
}: GlassTableProps<T>) {
  const handleSort = (key: keyof T) => {
    if (onSort) {
      onSort(key);
    }
  };

  if (loading) {
    return (
      <div className={cn(
        'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden',
        className
      )}>
        <div className="p-8 text-center">
          <motion.div
            className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn(
        'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden',
        className
      )}>
        <div className="p-8 text-center">
          <p className="text-white/60">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((column, index) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-6 py-4 text-left text-sm font-semibold text-white/80',
                    column.sortable && 'cursor-pointer hover:text-white transition-colors',
                    column.className
                  )}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={column.sortable ? { scale: 1.02 } : undefined}
                  >
                    <span>{column.header}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            'w-3 h-3 transition-colors',
                            sortBy === column.key && sortDirection === 'asc'
                              ? 'text-emerald-400'
                              : 'text-white/40'
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            'w-3 h-3 -mt-1 transition-colors',
                            sortBy === column.key && sortDirection === 'desc'
                              ? 'text-emerald-400'
                              : 'text-white/40'
                          )}
                        />
                      </div>
                    )}
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      'px-6 py-4 text-sm text-white/70',
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] || '')
                    }
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default GlassTable;