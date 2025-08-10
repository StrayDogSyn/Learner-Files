import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { getOptimizedAnimationSettings, prefersReducedMotion } from '../utils/performanceOptimizations';

// Import all the Phase 8 components
import { GlassContainer, GlassCard, GlassButton, GlassNav, GlassModal, GlassInput, GlassTooltip, GlassBadge } from './GlassmorphicEnhancements';
import { ShimmerContainer, ShimmerText, ShimmerCard, RevealAnimation, StaggeredReveal, TypewriterEffect } from './ShimmerAnimations';
import { AdvancedHover, MetallicButton, FloatingCard, NeonGlow, ParticleHover } from './AdvancedHoverEffects';
import { ParallaxContainer, ParallaxHero, ScrollTriggeredParallax, MouseParallax } from './ParallaxEffects';
import { PageTransition, LoadingTransition, StaggeredEntrance, FlipCardTransition } from './SmoothPageTransitions';

interface PolishedPortfolioProps {
  className?: string;
}

export const PolishedPortfolio: React.FC<PolishedPortfolioProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [animationSettings, setAnimationSettings] = useState(getOptimizedAnimationSettings());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update animation settings based on device performance
    setAnimationSettings(getOptimizedAnimationSettings());
  }, []);

  const projects = [
    {
      id: 1,
      title: 'AI-Powered Analytics Dashboard',
      description: 'Advanced data visualization with machine learning insights',
      tech: ['React', 'TypeScript', 'D3.js', 'Python'],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20analytics%20dashboard%20with%20charts%20and%20graphs%20dark%20theme%20professional&image_size=landscape_16_9'
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with real-time features',
      tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20e-commerce%20website%20interface%20clean%20design%20shopping%20cart&image_size=landscape_16_9'
    },
    {
      id: 3,
      title: 'Mobile Fitness App',
      description: 'Cross-platform fitness tracking with social features',
      tech: ['React Native', 'Firebase', 'Redux', 'Health APIs'],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fitness%20mobile%20app%20interface%20workout%20tracking%20modern%20ui&image_size=landscape_16_9'
    }
  ];

  const skills = [
    { name: 'React/Next.js', level: 95, color: 'blue' },
    { name: 'TypeScript', level: 90, color: 'purple' },
    { name: 'Node.js', level: 85, color: 'green' },
    { name: 'Python', level: 80, color: 'orange' },
    { name: 'AWS/Cloud', level: 75, color: 'pink' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechCorp',
      content: 'Exceptional work quality and attention to detail. Delivered beyond expectations.',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20headshot%20business%20attire%20friendly%20smile&image_size=square'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      company: 'StartupXYZ',
      content: 'Brilliant technical skills and great communication. A true professional.',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20headshot%20business%20suit%20confident%20expression&image_size=square'
    }
  ];

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900', className)}>
      {/* Performance-optimized CSS imports */}
      <style>{`
        @import url('/src/styles/performance-optimizations.css');
      `}</style>

      <LoadingTransition isLoading={isLoading} type="fade">
        <div className="relative">
          {/* Hero Section with Parallax */}
          <ParallaxHero 
            height="h-screen" 
            overlayOpacity={0.3}
            className="relative overflow-hidden"
          >
            <div className="text-center text-white z-10 relative">
              <RevealAnimation direction="up" delay={300}>
                <TypewriterEffect 
                  text="Full-Stack Developer & UI/UX Designer"
                  speed={50}
                  className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                />
              </RevealAnimation>
              
              <RevealAnimation direction="up" delay={800}>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  Creating exceptional digital experiences with cutting-edge technology and innovative design
                </p>
              </RevealAnimation>
              
              <RevealAnimation direction="up" delay={1200}>
                <div className="flex gap-4 justify-center">
                  <MetallicButton 
                    variant="gold" 
                    size="lg"
                    onClick={() => setShowModal(true)}
                  >
                    View My Work
                  </MetallicButton>
                  <GlassButton variant="secondary" size="lg">
                    Download Resume
                  </GlassButton>
                </div>
              </RevealAnimation>
            </div>
            
            {/* Floating particles */}
            {animationSettings.enableParticles && (
              <ParticleHover particleCount={animationSettings.maxParticles}>
                <div className="absolute inset-0" />
              </ParticleHover>
            )}
          </ParallaxHero>

          {/* Navigation */}
          <GlassNav floating position="top" className="fixed top-4 left-4 right-4 z-50">
            <div className="flex items-center justify-between">
              <div className="text-white font-bold text-xl">Portfolio</div>
              <nav className="flex space-x-6">
                {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
                  <AdvancedHover key={item} effect="glow" color="blue" intensity="subtle">
                    <a href={`#${item.toLowerCase()}`} className="text-white hover:text-blue-300 transition-colors">
                      {item}
                    </a>
                  </AdvancedHover>
                ))}
              </nav>
            </div>
          </GlassNav>

          {/* Projects Section */}
          <section id="projects" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollTriggeredParallax>
                <h2 className="text-4xl font-bold text-white text-center mb-12">
                  Featured Projects
                </h2>
              </ScrollTriggeredParallax>
              
              <StaggeredEntrance delay={200} type="slide" direction="up">
                {projects.map((project) => (
                  <div key={project.id} className="mb-8">
                    <AdvancedHover effect="lift" intensity="medium">
                      <FloatingCard 
                        depth="medium" 
                        tiltIntensity={5}
                        className="p-6 cursor-pointer"
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <div className="grid md:grid-cols-2 gap-6 items-center">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                              {project.title}
                            </h3>
                            <p className="text-gray-300 mb-4">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.tech.map((tech) => (
                                <GlassBadge key={tech} variant="default" size="sm">
                                  {tech}
                                </GlassBadge>
                              ))}
                            </div>
                          </div>
                          <div className="relative">
                            <ShimmerContainer variant="wave" loading={false}>
                              <img 
                                src={project.image} 
                                alt={project.title}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            </ShimmerContainer>
                          </div>
                        </div>
                      </FloatingCard>
                    </AdvancedHover>
                  </div>
                ))}
              </StaggeredEntrance>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="py-20 px-4 bg-black/20">
            <div className="max-w-4xl mx-auto">
              <ScrollTriggeredParallax>
                <h2 className="text-4xl font-bold text-white text-center mb-12">
                  Technical Skills
                </h2>
              </ScrollTriggeredParallax>
              
              <div className="grid md:grid-cols-2 gap-8">
                <StaggeredEntrance delay={150} type="slide" direction="left">
                  {skills.map((skill) => (
                    <GlassContainer key={skill.name} variant="medium" className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{skill.name}</span>
                        <span className="text-gray-300">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className={`h-2 rounded-full bg-gradient-to-r from-${skill.color}-400 to-${skill.color}-600`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </GlassContainer>
                  ))}
                </StaggeredEntrance>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <ScrollTriggeredParallax>
                <h2 className="text-4xl font-bold text-white text-center mb-12">
                  Client Testimonials
                </h2>
              </ScrollTriggeredParallax>
              
              <div className="grid md:grid-cols-2 gap-8">
                <StaggeredEntrance delay={300} type="scale">
                  {testimonials.map((testimonial, index) => (
                    <FlipCardTransition
                      key={index}
                      trigger="hover"
                      frontContent={
                        <GlassCard className="h-64 flex flex-col justify-center text-center">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full mx-auto mb-4"
                          />
                          <h3 className="text-white font-bold">{testimonial.name}</h3>
                          <p className="text-gray-300 text-sm">{testimonial.role} at {testimonial.company}</p>
                        </GlassCard>
                      }
                      backContent={
                        <GlassCard className="h-64 flex flex-col justify-center text-center p-6">
                          <p className="text-white italic mb-4">"{testimonial.content}"</p>
                          <div className="text-yellow-400 text-xl">★★★★★</div>
                        </GlassCard>
                      }
                    />
                  ))}
                </StaggeredEntrance>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 px-4 bg-black/20">
            <div className="max-w-2xl mx-auto">
              <ScrollTriggeredParallax>
                <h2 className="text-4xl font-bold text-white text-center mb-12">
                  Get In Touch
                </h2>
              </ScrollTriggeredParallax>
              
              <GlassContainer variant="medium" className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <GlassInput 
                      label="Name" 
                      placeholder="Your name"
                      required
                    />
                    <GlassInput 
                      label="Email" 
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <GlassInput 
                    label="Subject" 
                    placeholder="Project inquiry"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Message
                    </label>
                    <textarea 
                      className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      rows={5}
                      placeholder="Tell me about your project..."
                      required
                    />
                  </div>
                  <div className="text-center">
                    <MetallicButton variant="platinum" size="lg" type="submit">
                      Send Message
                    </MetallicButton>
                  </div>
                </form>
              </GlassContainer>
            </div>
          </section>

          {/* Project Modal */}
          <AnimatePresence>
            {showModal && (
              <GlassModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Project Gallery"
                size="large"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <GlassCard key={project.id} className="p-4">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="text-white font-bold mb-2">{project.title}</h4>
                      <p className="text-gray-300 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech) => (
                          <GlassBadge key={tech} variant="secondary" size="xs">
                            {tech}
                          </GlassBadge>
                        ))}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </GlassModal>
            )}
          </AnimatePresence>
        </div>
      </LoadingTransition>
    </div>
  );
};

export default PolishedPortfolio;