'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import { Glass } from '@/components/atoms/Glass';
import OptimizedImage from '@/components/ui/OptimizedImage';
import usePerformanceMonitoring from '@/hooks/usePerformanceMonitoring';
import { ArrowRight, Download, Github, Linkedin, Mail, Code, Sparkles } from 'lucide-react';

const FloatingCard: React.FC<{ 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
}> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      duration: 0.8, 
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
    className={`float ${className}`}
  >
    {children}
  </motion.div>
);

const GlowingOrb: React.FC<{ size: string; color: string; position: string }> = ({ 
  size, 
  color, 
  position 
}) => (
  <motion.div
    className={`absolute ${position} ${size} rounded-full blur-3xl opacity-20`}
    style={{ backgroundColor: color }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.4, 0.2]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const SkillBadge: React.FC<{ skill: string; delay: number }> = ({ skill, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.1, y: -2 }}
    className="group"
  >
    <Glass 
      variant="button" 
      interactive
      className="px-3 py-1.5 text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-300"
    >
      {skill}
    </Glass>
  </motion.div>
);

const StatCard: React.FC<{ 
  number: string; 
  label: string; 
  delay: number;
  icon: React.ReactNode;
}> = ({ number, label, delay, icon }) => (
  <FloatingCard delay={delay}>
    <Glass 
      variant="card" 
      interactive
      className="p-6 text-center group hover-glow"
    >
      <div className="flex items-center justify-center mb-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
        {icon}
      </div>
      <Typography variant="h3" className="text-white font-bold mb-1">
        {number}
      </Typography>
      <Typography variant="bodySmall" className="text-white/60">
        {label}
      </Typography>
    </Glass>
  </FloatingCard>
);

export const EnhancedHero: React.FC = () => {
  const { startTiming } = usePerformanceMonitoring();
  const skills = ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'AI/ML'];
  
  const stats = [
    { number: '50+', label: 'Projects', icon: <Code className="w-6 h-6" /> },
    { number: '3+', label: 'Years Exp', icon: <Sparkles className="w-6 h-6" /> },
    { number: '95%', label: 'Client Satisfaction', icon: <Github className="w-6 h-6" /> }
  ];

  // Measure hero section load time
  useEffect(() => {
    const endTiming = startTiming('hero-section-render');
    return () => {
      endTiming();
    };
  }, [startTiming]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Orbs */}
      <GlowingOrb size="w-96 h-96" color="#3B82F6" position="top-10 -left-20" />
      <GlowingOrb size="w-80 h-80" color="#8B5CF6" position="bottom-20 -right-16" />
      <GlowingOrb size="w-64 h-64" color="#F59E0B" position="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Glass variant="button" className="inline-flex items-center px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse" />
                <Typography variant="bodySmall" className="text-white/80">
                Available for new opportunities
              </Typography>
              </Glass>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <Typography variant="h1" className="text-5xl lg:text-7xl font-bold">
                <span className="text-white">Creative</span>
                <br />
                <span className="gradient-text">Developer</span>
              </Typography>
              
              <Typography 
                variant="body" 
                className="text-xl text-white/70 max-w-lg leading-relaxed"
              >
                Crafting exceptional digital experiences with cutting-edge technology 
                and innovative design solutions.
              </Typography>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {skills.map((skill, index) => (
                <SkillBadge key={skill} skill={skill} delay={0.6 + index * 0.1} />
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                variant="accent" 
                size="lg" 
                className="group hover-lift"
              >
                View My Work
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="hover-glow"
              >
                <Download className="mr-2 w-5 h-5" />
                Download CV
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex gap-4"
            >
              {[
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Mail, href: '#', label: 'Email' }
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Glass 
                    variant="button" 
                    interactive
                    className="p-3 text-white/60 group-hover:text-white transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </Glass>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Stats Cards */}
          <div className="space-y-6">
            {stats.map((stat, index) => (
              <StatCard 
                key={stat.label}
                {...stat} 
                delay={1.2 + index * 0.2}
              />
            ))}
            
            {/* Featured Project Preview */}
            <FloatingCard delay={1.8}>
              <Glass 
                variant="modal" 
                interactive
                shimmer
                className="p-6 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h6" className="text-white font-semibold">
                    Latest Project
                  </Typography>
                  <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                
                {/* Project Preview Image */}
                <div className="mb-4 rounded-lg overflow-hidden">
                  <OptimizedImage
                    src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20portfolio%20website%20with%20glassmorphism%20effects%20dark%20theme%20professional%20design&image_size=landscape_4_3"
                    alt="AI-Powered Portfolio Preview"
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={false}
                    placeholder="blur"
                  />
                </div>
                
                <Typography variant="bodySmall" className="text-white/70 mb-4">
                  AI-Powered Portfolio with Advanced Glassmorphism
                </Typography>
                
                <div className="flex gap-2">
                  {['Next.js', 'TypeScript', 'AI'].map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Glass>
            </FloatingCard>
            
            {/* Profile Image */}
            <FloatingCard delay={2.0}>
              <Glass 
                variant="card" 
                className="p-4 text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <OptimizedImage
                    src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20modern%20minimalist%20style%20friendly%20confident&image_size=square"
                    alt="Developer Profile"
                    width={96}
                    height={96}
                    className="w-full h-full rounded-full object-cover border-2 border-white/20"
                    priority={true}
                    placeholder="blur"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-gray-900" />
                </div>
                <Typography variant="bodySmall" className="text-white/80">
                  Available for hire
                </Typography>
              </Glass>
            </FloatingCard>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EnhancedHero;