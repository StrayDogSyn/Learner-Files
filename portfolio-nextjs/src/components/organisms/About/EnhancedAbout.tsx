'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Glass } from '@/components/atoms/Glass';
import { 
  Code2, 
  Brain, 
  Rocket, 
  Users, 
  ChevronRight,
  Play,
  Scale,
  Shield,
  Target
} from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools' | 'soft';
  icon: React.ReactNode;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

const skills: Skill[] = [
  { name: 'Claude 4.1 Integration', level: 98, category: 'frontend', icon: <Brain className="w-5 h-5" /> },
  { name: 'React/Next.js', level: 95, category: 'frontend', icon: <Code2 className="w-5 h-5" /> },
  { name: 'AI/ML Systems', level: 92, category: 'backend', icon: <Brain className="w-5 h-5" /> },
  { name: 'TypeScript', level: 90, category: 'frontend', icon: <Code2 className="w-5 h-5" /> },
  { name: 'Bias Detection Systems', level: 88, category: 'tools', icon: <Shield className="w-5 h-5" /> },
  { name: 'Justice Reform Tech', level: 95, category: 'tools', icon: <Scale className="w-5 h-5" /> },
  { name: 'AI-Enhanced Development', level: 96, category: 'soft', icon: <Rocket className="w-5 h-5" /> },
  { name: 'Social Impact Leadership', level: 90, category: 'soft', icon: <Users className="w-5 h-5" /> }
];

const experiences: Experience[] = [
  {
    title: 'AI-Enhanced Full Stack Developer',
    company: 'Justice Reform Technology Initiative',
    period: '2023 - Present',
    description: 'Leading development of AI-powered justice reform platforms using Claude 4.1. Built bias detection systems that reduced discriminatory outcomes by 40% and improved legal accessibility for underserved communities.',
    technologies: ['Claude 4.1', 'React', 'Next.js', 'TypeScript', 'Python', 'TensorFlow']
  },
  {
    title: 'Senior AI Integration Specialist',
    company: 'Legal Technology Solutions',
    period: '2022 - 2023',
    description: 'Architected and implemented AI-driven legal document analysis systems. Developed automated bias detection algorithms and created accessible legal guidance platforms serving 10,000+ users.',
    technologies: ['AI/ML', 'Natural Language Processing', 'React', 'Node.js', 'PostgreSQL']
  },
  {
    title: '10x Developer & Innovation Lead',
    company: 'Social Impact Tech Collective',
    period: '2021 - 2022',
    description: 'Pioneered AI-enhanced development workflows achieving 300% productivity gains. Led cross-functional teams in building technology solutions for social justice organizations.',
    technologies: ['AI Tools', 'React', 'TypeScript', 'Python', 'Cloud Architecture']
  }
];

const SkillCard: React.FC<{ skill: Skill; delay: number }> = ({ skill, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Glass
        config="card"
        className="p-6 group hover-glow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
              {skill.icon}
            </div>
            <Typography variant="h6" className="text-white font-semibold">
              {skill.name}
            </Typography>
          </div>
          <Typography variant="bodySmall" className="text-blue-400 font-bold">
            {skill.level}%
          </Typography>
        </div>
        
        <div className="relative">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: isHovered ? `${skill.level}%` : '0%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </Glass>
    </motion.div>
  );
};

const ExperienceCard: React.FC<{ experience: Experience; delay: number }> = ({ experience, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    <Glass
      config="card"
      className="p-6 group hover-lift"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <Typography variant="h6" className="text-white font-semibold mb-1">
            {experience.title}
          </Typography>
          <Typography variant="bodySmall" className="text-blue-400 font-medium">
            {experience.company}
          </Typography>
        </div>
        <Typography variant="bodySmall" className="text-white/60">
          {experience.period}
        </Typography>
      </div>
      
      <Typography variant="bodySmall" className="text-white/70 mb-4 leading-relaxed">
        {experience.description}
      </Typography>
      
      <div className="flex flex-wrap gap-2">
        {experience.technologies.map((tech) => (
          <span 
            key={tech}
            className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30"
          >
            {tech}
          </span>
        ))}
      </div>
    </Glass>
  </motion.div>
);

const StatisticCard: React.FC<{ 
  icon: React.ReactNode; 
  value: string; 
  label: string; 
  delay: number;
}> = ({ icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.05 }}
  >
    <Glass
      config="card"
      className="p-6 text-center group"
    >
      <div className="text-blue-400 mb-3 flex justify-center group-hover:text-blue-300 transition-colors duration-300">
        {icon}
      </div>
      <Typography variant="h4" className="text-white font-bold mb-1">
        {value}
      </Typography>
      <Typography variant="bodySmall" className="text-white/60">
        {label}
      </Typography>
    </Glass>
  </motion.div>
);

export const EnhancedAbout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'skills' | 'experience'>('skills');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  
  const filteredSkills = skillFilter === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === skillFilter);
  
  const statistics = [
    { icon: <Brain className="w-8 h-8" />, value: '50+', label: 'AI Integrations' },
    { icon: <Scale className="w-8 h-8" />, value: '40%', label: 'Bias Reduction' },
    { icon: <Users className="w-8 h-8" />, value: '10K+', label: 'Users Served' },
    { icon: <Target className="w-8 h-8" />, value: '300%', label: 'Productivity Gain' }
  ];
  
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Typography variant="h2" className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">About </span>
            <span className="gradient-text">Me</span>
          </Typography>
          
          <Typography 
            variant="body" 
            className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
          >
            AI-Enhanced Full Stack Developer specializing in justice reform technology. 
            I leverage Claude 4.1 and advanced AI systems to build solutions that reduce 
            bias, improve legal accessibility, and create meaningful social impact through technology.
          </Typography>
        </motion.div>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => (
            <StatisticCard 
              key={stat.label}
              {...stat} 
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>
        
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center mb-12"
        >
          <Glass config="navigation" className="p-2 flex gap-2">
            {[
              { key: 'skills', label: 'Skills & Expertise' },
              { key: 'experience', label: 'Experience' }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={activeTab === key ? 'accent' : 'ghost'}
                onClick={() => setActiveTab(key as 'skills' | 'experience')}
                className="relative"
              >
                {label}
                {activeTab === key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-500/20 rounded-lg"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Button>
            ))}
          </Glass>
        </motion.div>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Skill Filters */}
              <div className="flex justify-center mb-8">
                <Glass config="button" className="p-2 flex gap-2 flex-wrap">
                  {[
                    { key: 'all', label: 'All Skills' },
                    { key: 'frontend', label: 'Frontend' },
                    { key: 'backend', label: 'Backend' },
                    { key: 'tools', label: 'Tools' },
                    { key: 'soft', label: 'Soft Skills' }
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      variant={skillFilter === key ? 'accent' : 'ghost'}
                      size="sm"
                      onClick={() => setSkillFilter(key)}
                    >
                      {label}
                    </Button>
                  ))}
                </Glass>
              </div>
              
              {/* Skills Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map((skill, index) => (
                  <SkillCard 
                    key={skill.name} 
                    skill={skill} 
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {experiences.map((experience, index) => (
                <ExperienceCard 
                  key={experience.title} 
                  experience={experience} 
                  delay={index * 0.2}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <Glass config="modal" className="inline-block p-8">
            <Typography variant="h5" className="text-white font-semibold mb-4">
              Transform Justice Through Technology
            </Typography>
            <Typography variant="body" className="text-white/70 mb-6 max-w-md">
              Ready to build AI-enhanced solutions for justice reform? Let&apos;s discuss 
              how we can create technology that makes a real difference.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" className="group">
                <Play className="mr-2 w-4 h-4" />
                View Portfolio
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button variant="outline">
                Get In Touch
              </Button>
            </div>
          </Glass>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedAbout;