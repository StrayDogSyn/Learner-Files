'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Glass } from '@/components/atoms/Glass';
import { 
  Code2, 
  Palette, 
  Zap, 
  Brain, 
  Rocket, 
  Award, 
  Users, 
  Coffee,
  ChevronRight,
  Play
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
  { name: 'React/Next.js', level: 95, category: 'frontend', icon: <Code2 className="w-5 h-5" /> },
  { name: 'TypeScript', level: 90, category: 'frontend', icon: <Code2 className="w-5 h-5" /> },
  { name: 'Node.js', level: 85, category: 'backend', icon: <Zap className="w-5 h-5" /> },
  { name: 'Python', level: 80, category: 'backend', icon: <Brain className="w-5 h-5" /> },
  { name: 'UI/UX Design', level: 88, category: 'tools', icon: <Palette className="w-5 h-5" /> },
  { name: 'Problem Solving', level: 92, category: 'soft', icon: <Rocket className="w-5 h-5" /> },
  { name: 'Team Leadership', level: 85, category: 'soft', icon: <Users className="w-5 h-5" /> },
  { name: 'Communication', level: 90, category: 'soft', icon: <Coffee className="w-5 h-5" /> }
];

const experiences: Experience[] = [
  {
    title: 'Senior Full-Stack Developer',
    company: 'Tech Innovation Corp',
    period: '2022 - Present',
    description: 'Leading development of enterprise-scale applications with modern tech stack. Mentoring junior developers and architecting scalable solutions.',
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL']
  },
  {
    title: 'Frontend Developer',
    company: 'Digital Solutions Ltd',
    period: '2020 - 2022',
    description: 'Developed responsive web applications and improved user experience across multiple products. Collaborated with design teams to implement pixel-perfect interfaces.',
    technologies: ['React', 'Vue.js', 'JavaScript', 'SASS', 'Figma']
  },
  {
    title: 'Junior Developer',
    company: 'StartUp Ventures',
    period: '2019 - 2020',
    description: 'Built and maintained web applications using modern frameworks. Gained experience in full-stack development and agile methodologies.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL']
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
        variant="card" 
        interactive
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
      variant="card" 
      interactive
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
      variant="floating" 
      pulseGlow
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
    { icon: <Award className="w-8 h-8" />, value: '50+', label: 'Projects Completed' },
    { icon: <Users className="w-8 h-8" />, value: '25+', label: 'Happy Clients' },
    { icon: <Coffee className="w-8 h-8" />, value: '1000+', label: 'Cups of Coffee' },
    { icon: <Rocket className="w-8 h-8" />, value: '3+', label: 'Years Experience' }
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
            Passionate developer with a love for creating innovative solutions and 
            beautiful user experiences. I combine technical expertise with creative 
            thinking to build applications that make a difference.
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
          <Glass variant="navigation" className="p-2 flex gap-2">
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
                <Glass variant="button" className="p-2 flex gap-2 flex-wrap">
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
          <Glass variant="modal" className="inline-block p-8">
            <Typography variant="h5" className="text-white font-semibold mb-4">
              Let&apos;s Work Together
            </Typography>
            <Typography variant="body" className="text-white/70 mb-6 max-w-md">
              Ready to bring your ideas to life? Let&apos;s discuss how we can create 
              something amazing together.
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