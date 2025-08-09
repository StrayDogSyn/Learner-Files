import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '../store/portfolioStore';
import FilterableProjectGrid from '../components/FilterableProjectGrid';
import InteractiveSkillsChart from '../components/InteractiveSkillsChart';
import CodeShowcase from '../components/CodeShowcase';
import ExperienceTimeline from '../components/ExperienceTimeline';
import GitHubActivityFeed from '../components/GitHubActivityFeed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  User, 
  Briefcase, 
  Code, 
  Github, 
  Award,
  ChevronDown,
  Moon,
  Sun,
  Settings,
  Accessibility
} from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

interface SectionProps {
  id: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, icon: Icon, children, className = '' }) => {
  const animationsEnabled = usePortfolioStore((state) => state.animationsEnabled);
  const sectionRef = useRef<HTMLElement>(null);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      variants={animationsEnabled ? sectionVariants : undefined}
      initial={animationsEnabled ? 'hidden' : undefined}
      whileInView={animationsEnabled ? 'visible' : undefined}
      viewport={{ once: true, margin: '-100px' }}
      className={`py-16 px-4 sm:px-6 lg:px-8 ${className}`}
      aria-labelledby={`${id}-heading`}
      tabIndex={-1}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            id={`${id}-heading`}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3"
          >
            <Icon className="w-10 h-10" aria-hidden="true" />
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" aria-hidden="true" />
        </div>
        {children}
      </div>
    </motion.section>
  );
};

const NavigationMenu: React.FC = () => {
  const { theme, setTheme, animationsEnabled, setAnimationsEnabled } = usePortfolioStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'experience', label: 'Experience', icon: User },
    { id: 'github', label: 'GitHub', icon: Github },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: animationsEnabled ? 'smooth' : 'auto',
        block: 'start'
      });
      element.focus();
    }
    setIsMenuOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToSection(sectionId);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Interactive Portfolio
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4" role="menubar">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  onKeyDown={(e) => handleKeyDown(e, id)}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  role="menuitem"
                  aria-label={`Navigate to ${label} section`}
                >
                  <Icon className="w-4 h-4 inline mr-2" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Settings and Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Accessibility Toggle */}
            <button
              onClick={() => setAnimationsEnabled(!animationsEnabled)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label={`${animationsEnabled ? 'Disable' : 'Enable'} animations`}
              title={`${animationsEnabled ? 'Disable' : 'Enable'} animations`}
            >
              <Accessibility className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                aria-label="Open navigation menu"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Mobile Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu">
                    {sections.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        onKeyDown={(e) => handleKeyDown(e, id)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                        role="menuitem"
                      >
                        <Icon className="w-4 h-4 inline mr-2" aria-hidden="true" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
};

const Portfolio: React.FC = () => {
  const { theme, initializeStore } = usePortfolioStore();

  // Initialize store with mock data
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <SkipLink />
        <NavigationMenu />
        
        <main 
          id="main-content"
          className="pt-16"
          role="main"
          aria-label="Portfolio content"
        >
          {/* Hero Section */}
          <section 
            className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900"
            aria-labelledby="hero-heading"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 
                  id="hero-heading"
                  className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
                >
                  Interactive Portfolio
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Explore dynamic components showcasing projects, skills, code samples, 
                  experience timeline, and real-time GitHub activity with full accessibility support.
                </p>
                <button
                  onClick={() => {
                    const element = document.getElementById('projects');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      element.focus();
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  aria-label="Explore portfolio sections"
                >
                  Explore Portfolio
                  <ChevronDown className="w-5 h-5" aria-hidden="true" />
                </button>
              </motion.div>
            </div>
          </section>

          {/* Projects Section */}
          <Section 
            id="projects" 
            title="Featured Projects" 
            icon={Briefcase}
            className="bg-white dark:bg-gray-800"
          >
            <FilterableProjectGrid />
          </Section>

          {/* Skills Section */}
          <Section 
            id="skills" 
            title="Skills & Expertise" 
            icon={Award}
            className="bg-gray-50 dark:bg-gray-900"
          >
            <InteractiveSkillsChart />
          </Section>

          {/* Code Section */}
          <Section 
            id="code" 
            title="Code Showcase" 
            icon={Code}
            className="bg-white dark:bg-gray-800"
          >
            <CodeShowcase />
          </Section>

          {/* Experience Section */}
          <Section 
            id="experience" 
            title="Professional Experience" 
            icon={User}
            className="bg-gray-50 dark:bg-gray-900"
          >
            <ExperienceTimeline />
          </Section>

          {/* GitHub Section */}
          <Section 
            id="github" 
            title="GitHub Activity" 
            icon={Github}
            className="bg-white dark:bg-gray-800"
          >
            <GitHubActivityFeed 
              username="octocat" 
              maxEvents={15}
              showStats={true}
              refreshInterval={300000}
            />
          </Section>
        </main>

        {/* Footer */}
        <footer 
          className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8"
          role="contentinfo"
          aria-label="Site footer"
        >
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400 mb-4">
              Built with React, TypeScript, Tailwind CSS, and Framer Motion
            </p>
            <p className="text-gray-500 text-sm">
              Featuring full accessibility support, keyboard navigation, and screen reader compatibility
            </p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
};

export default Portfolio;