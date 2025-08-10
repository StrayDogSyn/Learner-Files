import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Layers,
  ArrowDown,
  Sparkles,
  Target,
  Zap,
  Users,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Star,
  Award,
  TrendingUp,
  Code,
  Brain,
  Rocket
} from 'lucide-react';

// Import all the section components
import ServicesSection from './ServicesSection';
import TimelineSection from './TimelineSection';
import TechStackSection from './TechStackSection';
import AchievementsSection from './AchievementsSection';
import BlogPreviewSection from './BlogPreviewSection';
import FAQSection from './FAQSection';

interface SectionNavItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const sectionNavItems: SectionNavItem[] = [
  {
    id: 'services',
    title: 'Services',
    description: 'AI Integration, Web Development & Consulting',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    id: 'timeline',
    title: 'Experience',
    description: 'Career milestones and educational background',
    icon: <Target className="w-5 h-5" />,
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-emerald-500/20'
  },
  {
    id: 'tech-stack',
    title: 'Tech Stack',
    description: 'Technologies, frameworks and tools I use',
    icon: <Code className="w-5 h-5" />,
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-indigo-500/20'
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'Milestones, metrics and accomplishments',
    icon: <Award className="w-5 h-5" />,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-orange-500/20'
  },
  {
    id: 'blog',
    title: 'Blog',
    description: 'Technical articles and insights',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'text-indigo-400',
    gradient: 'from-indigo-500/20 to-purple-500/20'
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Frequently asked questions',
    icon: <HelpCircle className="w-5 h-5" />,
    color: 'text-pink-400',
    gradient: 'from-pink-500/20 to-rose-500/20'
  }
];

const SectionNavigation: React.FC<{ onNavigate: (sectionId: string) => void }> = ({ onNavigate }) => {
  const navRef = useRef(null);
  const isInView = useInView(navRef, { once: true, margin: '-50px' });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onNavigate(sectionId);
  };

  return (
    <motion.div
      ref={navRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
    >
      {sectionNavItems.map((item, index) => (
        <motion.button
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => scrollToSection(item.id)}
          className="group text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`
            p-6 rounded-2xl backdrop-blur-xl border border-white/10
            bg-gradient-to-br ${item.gradient}
            hover:border-white/20 hover:shadow-2xl
            transition-all duration-500 h-full
            relative overflow-hidden
          `}>
            {/* Icon */}
            <div className={`
              inline-flex p-3 rounded-xl mb-4
              bg-white/10 border border-white/20
              ${item.color} group-hover:scale-110
              transition-all duration-300
            `}>
              {item.icon}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
              {item.title}
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              {item.description}
            </p>

            {/* Arrow */}
            <div className="flex items-center text-white/60 group-hover:text-white/80 transition-colors">
              <span className="text-sm font-medium mr-2">Explore</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Hover Effect */}
            <div className={`
              absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
              bg-gradient-to-br ${item.gradient}
              blur-xl transition-opacity duration-500 -z-10
            `} />
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
};

const ContentSections: React.FC = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: '-100px' });

  const handleNavigate = (sectionId: string) => {
    // Optional: Add analytics or state management here
    console.log(`Navigating to section: ${sectionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Layers className="w-4 h-4 mr-2 text-blue-400" />
              <span className="text-white/80 text-sm font-medium">Comprehensive Portfolio</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Content
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Sections
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed mb-8">
              Explore detailed sections showcasing my services, experience, technical expertise, 
              achievements, latest insights, and answers to common questions. Each section is 
              designed with glassmorphic elements and smooth animations for an engaging experience.
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">6</div>
                <div className="text-sm text-white/60">Sections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-white/60">Components</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-white/60">Responsive</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">∞</div>
                <div className="text-sm text-white/60">Possibilities</div>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col items-center"
            >
              <span className="text-white/60 text-sm mb-2">Explore Sections</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown className="w-5 h-5 text-white/60" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Section Navigation */}
          <SectionNavigation onNavigate={handleNavigate} />
        </div>
      </section>

      {/* Content Sections */}
      <div className="relative z-10">
        {/* Services Section */}
        <div id="services" className="scroll-mt-20">
          <ServicesSection />
        </div>

        {/* Timeline Section */}
        <div id="timeline" className="scroll-mt-20">
          <TimelineSection />
        </div>

        {/* Tech Stack Section */}
        <div id="tech-stack" className="scroll-mt-20">
          <TechStackSection />
        </div>

        {/* Achievements Section */}
        <div id="achievements" className="scroll-mt-20">
          <AchievementsSection />
        </div>

        {/* Blog Preview Section */}
        <div id="blog" className="scroll-mt-20">
          <BlogPreviewSection />
        </div>

        {/* FAQ Section */}
        <div id="faq" className="scroll-mt-20">
          <FAQSection />
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">
                Ready to Build Something Amazing?
              </h2>
            </div>
            
            <p className="text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Let's collaborate to bring your ideas to life with cutting-edge technology, 
              innovative design, and exceptional user experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  inline-flex items-center px-8 py-4 rounded-xl font-semibold
                  bg-gradient-to-r from-blue-500 to-purple-500
                  text-white shadow-lg hover:shadow-xl
                  transition-all duration-300
                "
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start a Project
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  inline-flex items-center px-8 py-4 rounded-xl font-semibold
                  bg-white/10 hover:bg-white/20 text-white
                  border border-white/20 hover:border-white/30
                  backdrop-blur-sm transition-all duration-300
                "
              >
                <Brain className="w-5 h-5 mr-2" />
                Schedule Consultation
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContentSections;