import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Brain,
  Code,
  Users,
  Zap,
  Globe,
  Smartphone,
  Database,
  Cloud,
  Shield,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  technologies: string[];
  pricing: {
    starting: string;
    type: string;
  };
  gradient: string;
  accentColor: string;
}

const services: Service[] = [
  {
    id: 'ai-integration',
    title: 'AI Integration & Automation',
    description: 'Transform your business with cutting-edge AI solutions that automate processes, enhance decision-making, and drive innovation.',
    icon: <Brain className="w-8 h-8" />,
    features: [
      'Custom AI Model Development',
      'Machine Learning Pipeline Setup',
      'Natural Language Processing',
      'Computer Vision Solutions',
      'Predictive Analytics',
      'AI-Powered Chatbots'
    ],
    technologies: ['TensorFlow', 'PyTorch', 'OpenAI', 'Hugging Face', 'LangChain', 'Python'],
    pricing: {
      starting: '$5,000',
      type: 'per project'
    },
    gradient: 'from-purple-500/20 via-blue-500/20 to-cyan-500/20',
    accentColor: 'text-purple-400'
  },
  {
    id: 'web-development',
    title: 'Full-Stack Web Development',
    description: 'Build modern, scalable web applications with cutting-edge technologies and best practices for optimal performance.',
    icon: <Code className="w-8 h-8" />,
    features: [
      'React/Next.js Applications',
      'Node.js Backend Development',
      'Database Design & Optimization',
      'API Development & Integration',
      'Cloud Deployment & DevOps',
      'Performance Optimization'
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    pricing: {
      starting: '$3,000',
      type: 'per project'
    },
    gradient: 'from-green-500/20 via-emerald-500/20 to-teal-500/20',
    accentColor: 'text-green-400'
  },
  {
    id: 'consulting',
    title: 'Technical Consulting & Strategy',
    description: 'Strategic guidance to help your business leverage technology effectively and make informed technical decisions.',
    icon: <Users className="w-8 h-8" />,
    features: [
      'Technology Stack Assessment',
      'Architecture Design & Review',
      'Code Quality Audits',
      'Performance Optimization',
      'Team Training & Mentoring',
      'Digital Transformation Strategy'
    ],
    technologies: ['System Design', 'DevOps', 'Security', 'Scalability', 'Best Practices'],
    pricing: {
      starting: '$150',
      type: 'per hour'
    },
    gradient: 'from-orange-500/20 via-red-500/20 to-pink-500/20',
    accentColor: 'text-orange-400'
  }
];

const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glassmorphic Card */}
      <div className={`
        relative p-8 rounded-2xl backdrop-blur-xl border border-white/10
        bg-gradient-to-br ${service.gradient}
        shadow-2xl hover:shadow-3xl transition-all duration-500
        hover:border-white/20 hover:bg-opacity-80
        transform hover:-translate-y-2 hover:scale-[1.02]
      `}>
        {/* Glow Effect */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          bg-gradient-to-br ${service.gradient}
          blur-xl transition-opacity duration-500 -z-10
        `} />

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className={`
            p-3 rounded-xl bg-white/10 backdrop-blur-sm
            ${service.accentColor} group-hover:scale-110 transition-transform duration-300
          `}>
            {service.icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{service.pricing.starting}</div>
            <div className="text-sm text-white/60">{service.pricing.type}</div>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors">
          {service.title}
        </h3>
        <p className="text-white/70 mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
            Key Features
          </h4>
          <ul className="space-y-2">
            {service.features.map((feature, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: (index * 0.2) + (idx * 0.1) }}
                className="flex items-center text-white/80 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-white/60 to-white/30 mr-3" />
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Technologies
          </h4>
          <div className="flex flex-wrap gap-2">
            {service.technologies.map((tech, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: (index * 0.2) + (idx * 0.05) }}
                className="
                  px-3 py-1 rounded-full text-xs font-medium
                  bg-white/10 text-white/80 backdrop-blur-sm
                  hover:bg-white/20 transition-colors duration-200
                "
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            w-full py-3 px-6 rounded-xl font-semibold
            bg-white/10 hover:bg-white/20 text-white
            border border-white/20 hover:border-white/30
            backdrop-blur-sm transition-all duration-300
            flex items-center justify-center group/btn
          `}
        >
          Get Started
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </motion.button>

        {/* Floating Elements */}
        <motion.div
          animate={isHovered ? { y: -5, rotate: 5 } : { y: 0, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 right-4 opacity-20"
        >
          <Star className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const ServicesSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
          >
            <Globe className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-white/80 text-sm font-medium">Professional Services</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transform Your Business with
            <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Expert Solutions
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            From AI integration to full-stack development, I provide comprehensive technical solutions 
            that drive innovation and accelerate your business growth.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Let's discuss your requirements and create a custom solution that perfectly fits your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  px-8 py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-purple-500 to-blue-500
                  text-white shadow-lg hover:shadow-xl
                  transition-all duration-300
                "
              >
                Schedule Consultation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  px-8 py-3 rounded-xl font-semibold
                  bg-white/10 hover:bg-white/20 text-white
                  border border-white/20 hover:border-white/30
                  backdrop-blur-sm transition-all duration-300
                "
              >
                View Portfolio
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;