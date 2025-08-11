import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Briefcase, Archive, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import GlassButton from './GlassButton';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/bio', label: 'Bio', icon: User },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/archive', label: 'Archive', icon: Archive }
];

const GlassNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className="hidden md:flex fixed top-6 left-1/2 transform -translate-x-1/2 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3">
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300',
                    'hover:bg-white/20 hover:text-white',
                    isActive
                      ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/40'
                      : 'text-white/80'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <motion.div
          className="fixed top-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <GlassButton
            variant="secondary"
            size="md"
            onClick={toggleMenu}
            icon={isOpen ? X : Menu}
          />
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed top-0 right-0 h-full w-80 z-50 bg-white/10 backdrop-blur-md border-l border-white/20"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-6 pt-20">
                <div className="space-y-4">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link
                          to={item.path}
                          onClick={toggleMenu}
                          className={cn(
                            'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300',
                            'hover:bg-white/20 hover:text-white',
                            isActive
                              ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/40'
                              : 'text-white/80'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default GlassNavigation;