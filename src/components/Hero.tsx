import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  Download, 
  Github, 
  Linkedin, 
  Mail, 
  Code, 
  Sparkles, 
  Moon, 
  Sun,
  ChevronDown,
  ExternalLink,
  Brain,
  Cpu,
  Zap
} from 'lucide-react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Container, Engine } from 'tsparticles-engine';
import BrandLogo from './BrandLogo';
import SkillBadges from './SkillBadges';

// Utility function for smooth scrolling to sections
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Enhanced Typewriter effect component
const TypewriterText: React.FC<{ 
  text: string; 
  speed?: number; 
  delay?: number;
  className?: string;
  onComplete?: () => void;
}> = ({ text, speed = 80, delay = 0, className = '', onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else if (!isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
    }, delay);
    
    return () => clearTimeout(startTimeout);
  }, [currentIndex, text, speed, delay, isComplete, onComplete]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="inline-block w-0.5 h-6 bg-emerald-accent ml-1"
      />
    </span>
  );
};

// Enhanced Particle System with react-tsparticles
const ParticleBackground: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Particles loaded callback
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      className="absolute inset-0"
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#50C878", "#C0C0C0", "#48494B"],
          },
          links: {
            color: "#50C878",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.3,
            random: true,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
            random: true,
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.1,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

// Tech stack carousel component
const TechStackCarousel: React.FC = () => {
  const techStack = [
    { name: 'React', icon: '⚛️', color: 'var(--electric-blue)' },
    { name: 'TypeScript', icon: '📘', color: 'var(--electric-blue)' },
    { name: 'AI/ML', icon: '🤖', color: 'var(--ai-purple)' },
    { name: 'Node.js', icon: '🟢', color: 'var(--hunter-green)' },
    { name: 'Python', icon: '🐍', color: 'var(--ai-purple)' },
    { name: 'OpenAI', icon: '🧠', color: 'var(--ai-purple)' },
    { name: 'Three.js', icon: '🎨', color: 'var(--electric-blue)' },
    { name: 'Tailwind', icon: '🎨', color: 'var(--hunter-green)' },
  ];

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-4"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...techStack, ...techStack].map((tech, index) => (
          <motion.div
            key={`${tech.name}-${index}`}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            whileHover={{ scale: 1.05, y: -2 }}
            style={{ borderColor: tech.color }}
          >
            <span className="text-lg">{tech.icon}</span>
            <span className="text-sm font-medium text-white">{tech.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Availability status component
const AvailabilityStatus: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time availability updates
      const now = new Date();
      setLastUpdate(now);
      // Randomly change availability (for demo purposes)
      if (Math.random() > 0.95) {
        setIsAvailable(prev => !prev);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-400' : 'bg-red-400'}`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-sm font-medium text-white">
        {isAvailable ? 'Available for Hire' : 'Currently Busy'}
      </span>
      <span className="text-xs text-white/60">
        {lastUpdate.toLocaleTimeString()}
      </span>
    </motion.div>
  );
};

// Dynamic greeting component
const DynamicGreeting: React.FC = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    let newGreeting = '';
    
    if (hour < 12) {
      newGreeting = 'Good morning';
    } else if (hour < 17) {
      newGreeting = 'Good afternoon';
    } else {
      newGreeting = 'Good evening';
    }
    
    setGreeting(newGreeting);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-lg font-medium text-white/80"
    >
      {greeting}, I'm
    </motion.div>
  );
};

// Theme toggle component
const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  }, [isDark]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDark(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
    </motion.button>
  );
};

// Main Hero component
export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    }
  }, [mouseX, mouseY]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden glass-background-main"
      onMouseMove={handleMouseMove}
    >
      {/* Animated glassmorphic background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(53, 94, 59, 0.3), transparent 40%)`,
        }}
      />

      {/* Enhanced Particle Background */}
      <ParticleBackground />

      {/* Parallax background elements */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-hunter-green/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-metallic-silver/20 rounded-full blur-3xl" />
      </motion.div>

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            className="space-y-8"
            style={{ opacity }}
          >
            {/* Brand Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6"
            >
              <BrandLogo size="lg" animated variant="straydog" />
            </motion.div>

            {/* Dynamic greeting */}
            <DynamicGreeting />

            {/* Availability status */}
            <AvailabilityStatus />

            {/* Main heading with typewriter effect */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl lg:text-6xl font-bold font-heading"
              >
                <a 
                  href="https://www.straydog-syndications-llc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Visit StrayDog Syndications LLC"
                  className="branding-text hover:text-emerald-accent transition-colors duration-300 cursor-pointer"
                >
                  StrayDog Syndications
                </a>
                <br />
                <TypewriterText
                  text="Applied AI Solutions Engineering"
                  speed={100}
                  delay={1000}
                  className="branding-text text-2xl lg:text-4xl"
                />
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-light-smoke max-w-lg leading-relaxed font-body"
              >
                Transforming Ideas into Intelligent Solutions through the fusion of human creativity and artificial intelligence.
              </motion.p>
            </div>

            {/* Tech stack carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="py-4"
            >
              <SkillBadges />
            </motion.div>

            {/* Enhanced CTA buttons with ripple effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('projects')}
                className="group inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all duration-300 relative overflow-hidden"
                aria-label="Explore AI solutions and projects"
                role="button"
                tabIndex={0}
                style={{
                  background: 'linear-gradient(135deg, rgba(53, 94, 59, 0.9), rgba(80, 200, 120, 0.9))',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(80, 200, 120, 0.4)',
                  boxShadow: '0 8px 32px rgba(80, 200, 120, 0.3)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(80, 200, 120, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(80, 200, 120, 0.3)';
                }}
              >
                <span className="relative z-10">Explore AI Solutions</span>
                <Brain className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                {/* Ripple effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('demonstrations')}
                className="group inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-300 relative overflow-hidden"
                aria-label="Try interactive AI demonstrations"
                role="button"
                tabIndex={0}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  color: 'var(--light-smoke)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                }}
              >
                <Zap className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Try AI Demos</span>
                {/* Ripple effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </motion.button>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex gap-4"
            >
              {[
                { icon: Github, href: 'https://github.com/straydogsyn', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com/in/hunter-cortana', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:hunter@cortana-ai.dev', label: 'Email' }
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-icon-button group p-3 rounded-full transition-all duration-300"
                  aria-label={`Visit ${label} profile`}
                  title={`Connect on ${label}`}
                  tabIndex={0}
                >
                  <Icon className="w-5 h-5 text-medium-grey group-hover:text-emerald-accent transition-colors duration-300" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Stats and Cards */}
          <motion.div
            className="space-y-6"
            style={{ opacity }}
          >
            {/* Stats cards */}
            {[
              { number: '25+', label: 'AI Projects', icon: <Brain className="w-6 h-6" /> },
              { number: '5+', label: 'Years Experience', icon: <Sparkles className="w-6 h-6" /> },
              { number: '100%', label: 'AI Integration', icon: <Cpu className="w-6 h-6" /> }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-6 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-light-smoke">{stat.number}</div>
                    <div className="text-medium-grey">{stat.label}</div>
                  </div>
                  <div className="text-emerald-accent">{stat.icon}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.button
          onClick={() => scrollToSection('about')}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="glass-icon-button group p-2 rounded-full transition-all duration-300"
          aria-label="Scroll to about section"
          role="button"
          tabIndex={0}
          title="Scroll down to learn more"
        >
          <ChevronDown className="w-6 h-6 text-light-smoke group-hover:text-emerald-accent transition-colors duration-300" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
