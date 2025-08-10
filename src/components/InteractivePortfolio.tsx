import React, { useState, useEffect } from 'react';
import { FloatingActionButton } from './ui/FloatingActionButton';
import { ThemeToggle } from './ui/ThemeToggle';
import { 
  ProjectCardSkeleton, 
  TimelineItemSkeleton, 
  ServiceCardSkeleton,
  BlogPostSkeleton,
  ContentSkeleton 
} from './ui/LoadingSkeleton';
import {
  RippleButton,
  InteractiveCard,
  FloatingLabelInput,
  AnimatedButton,
  AnimatedProgress,
  Tooltip
} from './ui/MicroInteractions';
import {
  MetallicHover,
  MetallicNavItem,
  MetallicButton,
  MetallicCard,
  MetallicIcon,
  MetallicBadge
} from './ui/MetallicEffects';
import {
  TransitionProvider,
  PageTransition,
  StaggeredAnimation,
  ModalTransition,
  TabTransition,
  AccordionTransition,
  LoadingStateTransition,
  useTransition
} from './ui/StateTransitions';
import { Download, Mail, ArrowUp, Github, ExternalLink, Code, Palette, Wrench } from 'lucide-react';

// Enhanced Navigation Component
interface EnhancedNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-glass-dark/80 backdrop-blur-md border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <MetallicHover effect="glow" intensity="medium" color="gold">
            <div className="text-2xl font-bold text-metallic-gold">
              SOLO
            </div>
          </MetallicHover>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <MetallicNavItem
                key={item.id}
                active={activeSection === item.id}
                onClick={() => onSectionChange(item.id)}
              >
                {item.label}
              </MetallicNavItem>
            ))}
          </div>
          
          {/* Theme Toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle variant="button" />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Enhanced Project Card
interface EnhancedProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    image: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    category: 'AI' | 'Web' | 'Tools';
  };
  isLoading?: boolean;
}

const EnhancedProjectCard: React.FC<EnhancedProjectCardProps> = ({
  project,
  isLoading = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (isLoading) {
    return <ProjectCardSkeleton />;
  }

  return (
    <MetallicCard hoverable clickable className="group">
      <div className="space-y-4">
        {/* Project Image */}
        <div className="relative overflow-hidden rounded-lg">
          <LoadingStateTransition
            isLoading={!imageLoaded}
            loadingComponent={
              <div className="w-full h-48 bg-glass-dark animate-shimmer rounded-lg" />
            }
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              onLoad={() => setImageLoaded(true)}
            />
          </LoadingStateTransition>
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <MetallicBadge variant="default">
              {project.category}
            </MetallicBadge>
          </div>
        </div>
        
        {/* Project Info */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-white group-hover:text-metallic-gold transition-colors">
            {project.title}
          </h3>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {project.description}
          </p>
          
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <MetallicBadge key={index} size="sm" variant="default">
                {tech}
              </MetallicBadge>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {project.githubUrl && (
              <Tooltip content="View Source Code">
                <MetallicButton variant="outline" size="sm">
                  <MetallicIcon size="sm">
                    <Github className="w-4 h-4" />
                  </MetallicIcon>
                  Code
                </MetallicButton>
              </Tooltip>
            )}
            
            {project.liveUrl && (
              <Tooltip content="View Live Demo">
                <MetallicButton variant="primary" size="sm">
                  <MetallicIcon size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </MetallicIcon>
                  Demo
                </MetallicButton>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </MetallicCard>
  );
};

// Enhanced Service Card
interface EnhancedServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    price?: string;
  };
  isLoading?: boolean;
}

const EnhancedServiceCard: React.FC<EnhancedServiceCardProps> = ({
  service,
  isLoading = false
}) => {
  if (isLoading) {
    return <ServiceCardSkeleton />;
  }

  return (
    <MetallicCard hoverable className="text-center group">
      <div className="space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <MetallicIcon size="lg" animated>
            {service.icon}
          </MetallicIcon>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-white group-hover:text-metallic-gold transition-colors">
          {service.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed">
          {service.description}
        </p>
        
        {/* Features */}
        <ul className="space-y-2 text-sm text-gray-400">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-metallic-gold rounded-full" />
              {feature}
            </li>
          ))}
        </ul>
        
        {/* Price */}
        {service.price && (
          <div className="pt-4">
            <div className="text-2xl font-bold text-metallic-gold">
              {service.price}
            </div>
          </div>
        )}
        
        {/* CTA Button */}
        <div className="pt-4">
          <MetallicButton variant="primary" size="md">
            Get Started
          </MetallicButton>
        </div>
      </div>
    </MetallicCard>
  );
};

// Enhanced Contact Form
const EnhancedContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    // Reset form or show success message
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <MetallicCard className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Get In Touch</h2>
          <p className="text-gray-300">Let's discuss your next project</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingLabelInput
            label="Your Name"
            value={formData.name}
            onChange={(value) => updateField('name', value)}
            required
            error={errors.name}
          />
          
          <FloatingLabelInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => updateField('email', value)}
            required
            error={errors.email}
          />
        </div>
        
        <FloatingLabelInput
          label="Subject"
          value={formData.subject}
          onChange={(value) => updateField('subject', value)}
          required
          error={errors.subject}
        />
        
        <div className="relative">
          <textarea
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="Your Message"
            rows={6}
            required
            className="
              w-full px-4 py-3 pt-6
              bg-glass-dark backdrop-blur-sm
              border border-glass-border rounded-lg
              text-white placeholder-gray-400
              transition-all duration-300 ease-out
              focus:outline-none focus:ring-2 focus:ring-metallic-gold/50
              focus:border-metallic-gold
              resize-none
            "
          />
          <label className="
            absolute left-4 top-2 text-xs text-metallic-gold
            pointer-events-none
          ">
            Message *
          </label>
        </div>
        
        <div className="text-center">
          <AnimatedButton
            variant="primary"
            size="lg"
            loading={isSubmitting}
            icon={<Mail className="w-5 h-5" />}
            iconPosition="left"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </AnimatedButton>
        </div>
      </form>
    </MetallicCard>
  );
};

// Main Interactive Portfolio Component
interface InteractivePortfolioProps {
  className?: string;
}

const InteractivePortfolio: React.FC<InteractivePortfolioProps> = ({
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const { startTransition } = useTransition();

  // Mock data
  const projects = [
    {
      id: '1',
      title: 'AI-Powered Analytics Dashboard',
      description: 'A comprehensive analytics platform with machine learning insights and real-time data visualization.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20analytics%20dashboard%20with%20charts%20and%20graphs%20dark%20theme%20professional&image_size=landscape_4_3',
      technologies: ['React', 'TypeScript', 'Python', 'TensorFlow'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://demo.com',
      category: 'AI' as const
    },
    {
      id: '2',
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration and inventory management.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20ecommerce%20website%20interface%20clean%20design%20shopping%20cart&image_size=landscape_4_3',
      technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://demo.com',
      category: 'Web' as const
    }
  ];

  const services = [
    {
      id: '1',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies and best practices.',
      icon: <Code className="w-8 h-8" />,
      features: ['Responsive Design', 'Performance Optimization', 'SEO Ready'],
      price: 'From $2,500'
    },
    {
      id: '2',
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces that enhance user experience.',
      icon: <Palette className="w-8 h-8" />,
      features: ['User Research', 'Wireframing', 'Prototyping'],
      price: 'From $1,500'
    },
    {
      id: '3',
      title: 'Consulting',
      description: 'Technical consulting and architecture planning for your projects.',
      icon: <Wrench className="w-8 h-8" />,
      features: ['Code Review', 'Architecture Planning', 'Performance Audit'],
      price: 'From $150/hr'
    }
  ];

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = (section: string) => {
    startTransition(() => {
      setActiveSection(section);
    });
  };

  return (
    <TransitionProvider>
      <div className={`min-h-screen bg-charcoal-900 ${className}`}>
        {/* Enhanced Navigation */}
        <EnhancedNavigation
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        
        {/* Main Content */}
        <main className="pt-16">
          <PageTransition type="fade" duration={300}>
            {activeSection === 'projects' && (
              <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Featured Projects</h2>
                    <p className="text-gray-300 text-lg">Showcasing my latest work and innovations</p>
                  </div>
                  
                  <StaggeredAnimation
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    staggerDelay={150}
                    animationType="fadeInUp"
                  >
                    {projects.map((project) => (
                      <EnhancedProjectCard
                        key={project.id}
                        project={project}
                        isLoading={isLoading}
                      />
                    ))}
                  </StaggeredAnimation>
                </div>
              </section>
            )}
            
            {activeSection === 'services' && (
              <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Services</h2>
                    <p className="text-gray-300 text-lg">How I can help bring your ideas to life</p>
                  </div>
                  
                  <StaggeredAnimation
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    staggerDelay={200}
                    animationType="scaleIn"
                  >
                    {services.map((service) => (
                      <EnhancedServiceCard
                        key={service.id}
                        service={service}
                        isLoading={isLoading}
                      />
                    ))}
                  </StaggeredAnimation>
                </div>
              </section>
            )}
            
            {activeSection === 'contact' && (
              <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                  <EnhancedContactForm />
                </div>
              </section>
            )}
          </PageTransition>
        </main>
        
        {/* Floating Action Button */}
        <FloatingActionButton />
      </div>
    </TransitionProvider>
  );
};

export default InteractivePortfolio;
export {
  EnhancedNavigation,
  EnhancedProjectCard,
  EnhancedServiceCard,
  EnhancedContactForm
};