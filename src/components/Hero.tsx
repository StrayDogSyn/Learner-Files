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
  ExternalLink
} from 'lucide-react';

// Typewriter effect component
const TypewriterText: React.FC<{ 
  text: string; 
  speed?: number; 
  delay?: number;
  className?: string;
}> = ({ text, speed = 100, delay = 0, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentIndex(0);
      setDisplayText('');
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-6 bg-current ml-1"
      />
    </span>
  );
};

// Particle effect component
const ParticleSystem: React.FC = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 10 + particle.speed * 20,
            repeat: Infinity,
            delay: particle.id * 0.1,
          }}
        />
      ))}
    </div>
  );
};

// Tech stack carousel component
const TechStackCarousel: React.FC = () => {
  const techStack = [
    { name: 'React', icon: '⚛️', color: '#61DAFB' },
    { name: 'TypeScript', icon: '📘', color: '#3178C6' },
    { name: 'Next.js', icon: '⚡', color: '#000000' },
    { name: 'Node.js', icon: '🟢', color: '#339933' },
    { name: 'Python', icon: '🐍', color: '#3776AB' },
    { name: 'AI/ML', icon: '🤖', color: '#FF6B6B' },
    { name: 'Three.js', icon: '🎨', color: '#000000' },
    { name: 'Tailwind', icon: '🎨', color: '#06B6D4' },
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      onMouseMove={handleMouseMove}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(120, 119, 198, 0.3), transparent 40%)`,
        }}
      />

      {/* Particle system */}
      <ParticleSystem />

      {/* Parallax background elements */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
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
                className="text-5xl lg:text-7xl font-bold"
              >
                <span className="text-white">Creative</span>
                <br />
                <TypewriterText
                  text="Developer"
                  speed={150}
                  delay={1000}
                  className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                />
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-white/70 max-w-lg leading-relaxed"
              >
                Crafting exceptional digital experiences with cutting-edge technology 
                and innovative design solutions.
              </motion.p>
            </div>

            {/* Tech stack carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="py-4"
            >
              <TechStackCarousel />
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
              >
                View My Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                Download CV
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
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:contact@example.com', label: 'Email' }
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors duration-300" />
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
              { number: '50+', label: 'Projects', icon: <Code className="w-6 h-6" /> },
              { number: '3+', label: 'Years Exp', icon: <Sparkles className="w-6 h-6" /> },
              { number: '95%', label: 'Client Satisfaction', icon: <Github className="w-6 h-6" /> }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-white/60">{stat.label}</div>
                  </div>
                  <div className="text-blue-400">{stat.icon}</div>
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
          className="group p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          <ChevronDown className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors duration-300" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
