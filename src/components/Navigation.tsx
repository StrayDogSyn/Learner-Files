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
  ExternalLink,
  Cpu,
  Shield
} from 'lucide-react';
import { useBreadcrumbs, BreadcrumbItem } from '@/hooks/useBreadcrumbs';
import BrandLogo from './BrandLogo';
import ProjectBreadcrumbs from './navigation/ProjectBreadcrumbs';

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
    name: 'StrayDog Syndications',
    url: 'https://straydogsyn.github.io/Learner-Files/',
    description: 'Applied AI Solutions Engineering',
    icon: '🛡️'
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

const flagshipApps: NavigationItem[] = [
  { id: 'calculator', label: 'Calculator', href: '/calculator', icon: <Cpu className="w-4 h-4" /> },
  { id: 'quiz-ninja', label: 'Quiz Ninja', href: '/quiz-ninja', icon: <Code className="w-4 h-4" /> },
  { id: 'knucklebones', label: 'Knucklebones', href: '/knucklebones', icon: <Shield className="w-4 h-4" /> },
  { id: 'countdown', label: 'Countdown', href: '/countdown', icon: <Globe className="w-4 h-4" /> },
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
  <div 
    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-hunter-green via-emerald-accent to-metallic-silver progress-indicator"
    data-progress={progress}
  />
);

const QuickAccessToolbar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute right-0 top-full mt-2 w-64 glass-dropdown rounded-lg z-50"
      >
        <div className="p-3">
          <h3 className="text-sm font-semibold text-white mb-2">Flagship Applications</h3>
          <div className="grid grid-cols-2 gap-2">
            {flagshipApps.map((app) => (
              <a
                key={app.id}
                href={app.href}
                onClick={onClose}
                className="flex items-center space-x-2 p-2 rounded-lg glass-button-hover transition-colors text-sm"
              >
                {app.icon}
                <span>{app.label}</span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
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
          className="fixed inset-0 z-50 flex items-center justify-center glass-modal-backdrop"
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
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-medium-grey w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search projects, skills, or content..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="glass-search-input w-full pl-12 pr-4 py-4 rounded-lg text-light-smoke placeholder-medium-grey focus:outline-none focus:ring-2 focus:ring-emerald-accent/50 focus:border-transparent"
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
          transition={{ type: 'spring' as const, damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-80 max-w-[80vw] z-50 lg:hidden"
          style={{
            background: 'rgba(28, 28, 28, 0.95)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)'
          }}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h2 id="mobile-menu-title" className="text-xl font-bold text-light-smoke font-heading-primary">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-all duration-200 hover:bg-white/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)'
                }}
                aria-label="Close menu"
                title="Close menu"
              >
                <X className="w-5 h-5 text-light-smoke" />
              </button>
            </div>
            
            <nav className="flex-1 p-6" role="navigation" aria-label="Mobile navigation">
              <ul className="space-y-4" role="menu">
                {navigationItems.map((item) => (
                  <li key={item.id} role="none">
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-light-smoke hover:text-white transition-all duration-200"
                      role="menuitem"
                      tabIndex={0}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(8px)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-6" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <button 
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-white rounded-lg transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, rgba(53, 94, 59, 0.8), rgba(80, 200, 120, 0.8))',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(80, 200, 120, 0.3)',
                  boxShadow: '0 4px 15px rgba(80, 200, 120, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(80, 200, 120, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(80, 200, 120, 0.2)';
                }}
                aria-label="Open AI Assistant"
                title="Open AI Assistant"
              >
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
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);
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
        setIsQuickAccessOpen(false);
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
      <div className="fixed top-0 left-0 right-0 h-1 glass-background z-50">
        <ProgressIndicator progress={scrollProgress} />
      </div>

      {/* Main Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'backdrop-blur-md bg-charcoal-black/80 border-b border-white/10 shadow-glass-medium' 
            : 'backdrop-blur-sm bg-charcoal-black/20'
        }`}
        data-theme={isDark ? 'dark' : 'light'}
        style={{
          background: isScrolled 
            ? 'rgba(28, 28, 28, 0.8)' 
            : 'rgba(28, 28, 28, 0.2)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'blur(8px)',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Brand */}
            <BrandLogo 
              size="md" 
              animated={true} 
              showTagline={false}
              variant="straydog"
              className="cursor-pointer"
            />

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
                      ? 'text-emerald-accent'
                      : 'text-light-smoke hover:text-white'
                  }`}
                  style={{
                    background: activeSection === item.id 
                      ? 'rgba(80, 200, 120, 0.2)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(8px)',
                    border: activeSection === item.id 
                      ? '1px solid rgba(80, 200, 120, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 glass-button-active rounded-lg"
                      transition={{ type: 'spring' as const, damping: 25, stiffness: 200 }}
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
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                title="Search (Ctrl/Cmd + K)"
                aria-label="Open search dialog"
                aria-keyshortcuts="Control+k Meta+k"
              >
                <Search className="w-4 h-4 text-light-smoke" />
              </motion.button>

              {/* Quick Access Toolbar */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
                  className="p-2 rounded-lg transition-all duration-200 flex items-center space-x-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  title="Quick Access to Flagship Apps"
                  aria-label="Quick access to flagship applications"
                  aria-expanded={isQuickAccessOpen}
                  aria-haspopup="menu"
                >
                  <Cpu className="w-4 h-4 text-light-smoke" />
                  <ChevronDown className="w-3 h-3 text-light-smoke" />
                </motion.button>
                
                <QuickAccessToolbar 
                  isOpen={isQuickAccessOpen} 
                  onClose={() => setIsQuickAccessOpen(false)} 
                />
              </div>

              {/* Multi-site Navigation */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMultiSiteOpen(!isMultiSiteOpen)}
                  className="p-2 rounded-lg transition-all duration-200 flex items-center space-x-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  aria-label="Multi-site navigation menu"
                  aria-expanded={isMultiSiteOpen}
                  aria-haspopup="menu"
                  title="Navigate to other sites"
                >
                  <Globe className="w-4 h-4 text-light-smoke" />
                  <ChevronDown className="w-3 h-3 text-light-smoke" />
                </motion.button>

                <AnimatePresence>
                  {isMultiSiteOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 glass-dropdown rounded-lg"
                    >
                      <div className="p-2">
                        {multiSiteItems.map((item) => (
                          <a
                            key={item.name}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 rounded-lg glass-button-hover transition-colors"
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
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-light-smoke" /> : <Moon className="w-4 h-4 text-light-smoke" />}
              </motion.button>

              {/* AI Assistant */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, rgba(53, 94, 59, 0.8), rgba(80, 200, 120, 0.8))',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(80, 200, 120, 0.3)',
                  boxShadow: '0 4px 15px rgba(80, 200, 120, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(80, 200, 120, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(80, 200, 120, 0.2)';
                }}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">AI Assistant</span>
              </motion.button>

              {/* Status Indicator */}
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full" style={{
                background: 'rgba(80, 200, 120, 0.2)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(80, 200, 120, 0.3)'
              }}>
                <span className="w-2 h-2 bg-emerald-accent rounded-full animate-pulse" />
                <span className="text-xs text-emerald-accent font-medium">AI Online</span>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                aria-label="Open mobile navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                title="Open navigation menu"
              >
                <Menu className="w-5 h-5 text-light-smoke" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Enhanced Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <div className="glass-breadcrumbs">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <ProjectBreadcrumbs />
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
