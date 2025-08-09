import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Globe, 
  MessageCircle,
  Home,
  FolderOpen,
  Code,
  Briefcase,
  FileText,
  Mail,
  ExternalLink
} from 'lucide-react';
import { useBreadcrumbs, BreadcrumbItem } from '@/hooks/useBreadcrumbs';

// Types
interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface MultiSiteItem {
  name: string;
  url: string;
  description: string;
  icon?: string;
}

// Navigation data
const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
  { id: 'projects', label: 'Projects', href: '/projects', icon: <FolderOpen className="w-4 h-4" /> },
  { id: 'portfolio', label: 'Portfolio', href: '/portfolio', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'bio', label: 'Bio', href: '/bio', icon: <FileText className="w-4 h-4" /> },
  { id: 'contact', label: 'Contact', href: '/contact', icon: <Mail className="w-4 h-4" /> },
];

const multiSiteItems: MultiSiteItem[] = [
  {
    name: 'Hunter & Cortana Portfolio',
    url: 'https://straydogsyn.github.io/Learner-Files/',
    description: 'Applied AI Solutions Engineering',
    icon: '🧠'
  },
  {
    name: 'AI Playground',
    url: '#playground',
    description: 'Interactive AI demonstrations',
    icon: '🎮'
  },
  {
    name: 'Case Studies',
    url: '#case-studies',
    description: 'Detailed project breakdowns',
    icon: '📊'
  },
  {
    name: 'Research Papers',
    url: '#research',
    description: 'AI research and publications',
    icon: '📄'
  }
];

// Custom hooks
const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
};

const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  useEffect(() => {
    // Set active section based on current route
    const path = location.pathname;
    const currentSection = navigationItems.find(item => item.href === path)?.id || 'home';
    setActiveSection(currentSection);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return activeSection;
};

// Components
const ProgressIndicator: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-hunter-green to-electric-blue transition-all duration-300"
       style={{ width: `${progress}%` }} />
);

const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <div className="flex items-center space-x-2 text-sm text-white/60">
    {items.map((item, index) => (
      <React.Fragment key={item.href}>
        {index > 0 && <span className="text-white/40">/</span>}
        <a
          href={item.href}
          className="hover:text-white transition-colors duration-200"
        >
          {item.label}
        </a>
      </React.Fragment>
    ))}
  </div>
);

const QuickSearch: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md mx-4"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search projects, skills, or content..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-80 max-w-[80vw] z-50 bg-white/10 backdrop-blur-xl border-l border-white/20 lg:hidden"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <nav className="flex-1 p-6">
              <ul className="space-y-4">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-6 border-t border-white/20">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-hunter-green to-electric-blue text-white rounded-lg hover:shadow-lg transition-all duration-200">
                <MessageCircle className="w-4 h-4" />
                <span>AI Assistant</span>
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// Main Navigation component
export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMultiSiteOpen, setIsMultiSiteOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  
  const scrollProgress = useScrollProgress();
  const activeSection = useActiveSection();
  const breadcrumbs = useBreadcrumbs();

  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        setIsMultiSiteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle theme toggle
  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  }, [isDark]);

  // Handle navigation click
  const handleNavClick = (href: string) => {
    if (href === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(href.replace('/', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <ProgressIndicator progress={scrollProgress} />
      </div>

      {/* Main Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg' 
            : 'bg-transparent'
        }`}
        data-theme={isDark ? 'dark' : 'light'}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-hunter-green to-electric-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-base">H&C</span>
              </div>
              <span className="text-white font-heading font-bold text-lg lg:text-xl hidden sm:block">
                Hunter & Cortana
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-electric-blue bg-electric-blue/20 border border-electric-blue/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-hunter-green/20 to-electric-blue/10 rounded-lg"
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Quick Search */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                title="Search (Ctrl/Cmd + K)"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              {/* Multi-site Navigation */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMultiSiteOpen(!isMultiSiteOpen)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white flex items-center space-x-1"
                >
                  <Globe className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3" />
                </motion.button>

                <AnimatePresence>
                  {isMultiSiteOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl"
                    >
                      <div className="p-2">
                        {multiSiteItems.map((item) => (
                          <a
                            key={item.name}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                          >
                            <span className="text-lg">{item.icon}</span>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-white/60">{item.description}</div>
                            </div>
                            <ExternalLink className="w-3 h-3 ml-auto" />
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.button>

              {/* AI Assistant */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-hunter-green to-electric-blue text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">AI Assistant</span>
              </motion.button>

              {/* Status Indicator */}
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-success/20 border border-success/30 rounded-full">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs text-success font-medium">AI Online</span>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          </div>
        )}
      </nav>

      {/* Quick Search Modal */}
      <QuickSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Navigation;
