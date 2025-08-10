import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  Code,
  Database,
  Cloud,
  Smartphone,
  Brain,
  Shield,
  Zap,
  Layers,
  Globe,
  Cpu,
  Server,
  Monitor,
  Star,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';

interface TechSkill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0-100
  experience: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  projects: number;
  description: string;
  certifications?: string[];
}

interface TechCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  skills: TechSkill[];
}

const techStack: TechCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: <Monitor className="w-6 h-6" />,
    color: 'text-blue-400',
    skills: [
      {
        id: 'react',
        name: 'React',
        category: 'Frontend',
        proficiency: 95,
        experience: '5+ years',
        icon: <Code className="w-5 h-5" />,
        color: 'text-blue-400',
        gradient: 'from-blue-500/20 to-cyan-500/20',
        projects: 25,
        description: 'Advanced React development with hooks, context, and modern patterns',
        certifications: ['React Professional', 'Advanced React Patterns']
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        category: 'Frontend',
        proficiency: 90,
        experience: '4+ years',
        icon: <Code className="w-5 h-5" />,
        color: 'text-blue-500',
        gradient: 'from-blue-600/20 to-indigo-500/20',
        projects: 30,
        description: 'Type-safe development with advanced TypeScript features'
      },
      {
        id: 'nextjs',
        name: 'Next.js',
        category: 'Frontend',
        proficiency: 88,
        experience: '3+ years',
        icon: <Globe className="w-5 h-5" />,
        color: 'text-gray-300',
        gradient: 'from-gray-500/20 to-slate-500/20',
        projects: 15,
        description: 'Full-stack React framework with SSR and static generation'
      },
      {
        id: 'vue',
        name: 'Vue.js',
        category: 'Frontend',
        proficiency: 82,
        experience: '3+ years',
        icon: <Code className="w-5 h-5" />,
        color: 'text-green-400',
        gradient: 'from-green-500/20 to-emerald-500/20',
        projects: 12,
        description: 'Progressive framework for building user interfaces'
      }
    ]
  },
  {
    id: 'backend',
    name: 'Backend Development',
    icon: <Server className="w-6 h-6" />,
    color: 'text-green-400',
    skills: [
      {
        id: 'nodejs',
        name: 'Node.js',
        category: 'Backend',
        proficiency: 92,
        experience: '5+ years',
        icon: <Server className="w-5 h-5" />,
        color: 'text-green-500',
        gradient: 'from-green-500/20 to-lime-500/20',
        projects: 28,
        description: 'Scalable server-side JavaScript applications'
      },
      {
        id: 'python',
        name: 'Python',
        category: 'Backend',
        proficiency: 90,
        experience: '6+ years',
        icon: <Code className="w-5 h-5" />,
        color: 'text-yellow-400',
        gradient: 'from-yellow-500/20 to-orange-500/20',
        projects: 35,
        description: 'Versatile programming for web development and data science'
      },
      {
        id: 'express',
        name: 'Express.js',
        category: 'Backend',
        proficiency: 88,
        experience: '4+ years',
        icon: <Zap className="w-5 h-5" />,
        color: 'text-gray-300',
        gradient: 'from-gray-500/20 to-zinc-500/20',
        projects: 22,
        description: 'Fast, unopinionated web framework for Node.js'
      },
      {
        id: 'fastapi',
        name: 'FastAPI',
        category: 'Backend',
        proficiency: 85,
        experience: '2+ years',
        icon: <Zap className="w-5 h-5" />,
        color: 'text-teal-400',
        gradient: 'from-teal-500/20 to-cyan-500/20',
        projects: 8,
        description: 'Modern, fast web framework for building APIs with Python'
      }
    ]
  },
  {
    id: 'database',
    name: 'Database & Storage',
    icon: <Database className="w-6 h-6" />,
    color: 'text-purple-400',
    skills: [
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        category: 'Database',
        proficiency: 88,
        experience: '4+ years',
        icon: <Database className="w-5 h-5" />,
        color: 'text-blue-600',
        gradient: 'from-blue-600/20 to-indigo-600/20',
        projects: 20,
        description: 'Advanced relational database with complex queries and optimization'
      },
      {
        id: 'mongodb',
        name: 'MongoDB',
        category: 'Database',
        proficiency: 82,
        experience: '3+ years',
        icon: <Database className="w-5 h-5" />,
        color: 'text-green-600',
        gradient: 'from-green-600/20 to-emerald-600/20',
        projects: 15,
        description: 'NoSQL document database for flexible data modeling'
      },
      {
        id: 'redis',
        name: 'Redis',
        category: 'Database',
        proficiency: 78,
        experience: '2+ years',
        icon: <Zap className="w-5 h-5" />,
        color: 'text-red-500',
        gradient: 'from-red-500/20 to-pink-500/20',
        projects: 12,
        description: 'In-memory data structure store for caching and sessions'
      }
    ]
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: <Brain className="w-6 h-6" />,
    color: 'text-purple-400',
    skills: [
      {
        id: 'tensorflow',
        name: 'TensorFlow',
        category: 'AI/ML',
        proficiency: 85,
        experience: '3+ years',
        icon: <Brain className="w-5 h-5" />,
        color: 'text-orange-500',
        gradient: 'from-orange-500/20 to-red-500/20',
        projects: 10,
        description: 'Deep learning framework for neural networks and AI models'
      },
      {
        id: 'pytorch',
        name: 'PyTorch',
        category: 'AI/ML',
        proficiency: 80,
        experience: '2+ years',
        icon: <Brain className="w-5 h-5" />,
        color: 'text-red-600',
        gradient: 'from-red-600/20 to-pink-600/20',
        projects: 8,
        description: 'Dynamic neural network framework for research and production'
      },
      {
        id: 'openai',
        name: 'OpenAI APIs',
        category: 'AI/ML',
        proficiency: 90,
        experience: '2+ years',
        icon: <Cpu className="w-5 h-5" />,
        color: 'text-green-400',
        gradient: 'from-green-400/20 to-teal-400/20',
        projects: 15,
        description: 'Integration with GPT models and AI-powered applications'
      }
    ]
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    icon: <Cloud className="w-6 h-6" />,
    color: 'text-cyan-400',
    skills: [
      {
        id: 'aws',
        name: 'AWS',
        category: 'Cloud',
        proficiency: 88,
        experience: '4+ years',
        icon: <Cloud className="w-5 h-5" />,
        color: 'text-orange-400',
        gradient: 'from-orange-400/20 to-yellow-400/20',
        projects: 18,
        description: 'Comprehensive cloud services and infrastructure management',
        certifications: ['Solutions Architect Professional', 'DevOps Engineer']
      },
      {
        id: 'docker',
        name: 'Docker',
        category: 'DevOps',
        proficiency: 85,
        experience: '3+ years',
        icon: <Layers className="w-5 h-5" />,
        color: 'text-blue-500',
        gradient: 'from-blue-500/20 to-cyan-500/20',
        projects: 25,
        description: 'Containerization for consistent deployment environments'
      },
      {
        id: 'kubernetes',
        name: 'Kubernetes',
        category: 'DevOps',
        proficiency: 75,
        experience: '2+ years',
        icon: <Layers className="w-5 h-5" />,
        color: 'text-blue-600',
        gradient: 'from-blue-600/20 to-indigo-600/20',
        projects: 8,
        description: 'Container orchestration for scalable applications'
      }
    ]
  }
];

const SkillCard: React.FC<{ skill: TechSkill; index: number }> = ({ skill, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animatedProficiency, setAnimatedProficiency] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setAnimatedProficiency(prev => {
            if (prev >= skill.proficiency) {
              clearInterval(interval);
              return skill.proficiency;
            }
            return prev + 2;
          });
        }, 20);
      }, index * 100);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, skill.proficiency, index]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        p-6 rounded-xl backdrop-blur-xl border border-white/10
        bg-gradient-to-br ${skill.gradient}
        shadow-lg hover:shadow-2xl transition-all duration-500
        hover:border-white/20 hover:-translate-y-1
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-white/10 ${skill.color}`}>
              {skill.icon}
            </div>
            <div>
              <h3 className="font-bold text-white">{skill.name}</h3>
              <p className="text-sm text-white/60">{skill.experience}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{animatedProficiency}%</div>
            <div className="text-xs text-white/60">{skill.projects} projects</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">Proficiency</span>
            <span className="text-sm text-white/70">{skill.proficiency}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isInView ? `${animatedProficiency}%` : 0 }}
              transition={{ duration: 1.5, delay: index * 0.1 }}
              className={`h-full bg-gradient-to-r ${skill.gradient.replace('/20', '')} rounded-full relative`}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full" />
              <motion.div
                animate={isHovered ? { x: [0, 10, 0] } : { x: 0 }}
                transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                className="absolute right-0 top-0 w-2 h-full bg-white/40 rounded-full"
              />
            </motion.div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/70 text-sm mb-4 leading-relaxed">
          {skill.description}
        </p>

        {/* Certifications */}
        {skill.certifications && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={isHovered ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex items-center mb-2">
              <Award className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm font-semibold text-white/80">Certifications</span>
            </div>
            <div className="space-y-1">
              {skill.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center text-xs text-white/60">
                  <Star className="w-3 h-3 mr-2 text-yellow-400" />
                  {cert}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Hover Effect */}
        <motion.div
          animate={isHovered ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 right-4 opacity-20"
        >
          <TrendingUp className="w-5 h-5 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const CategorySection: React.FC<{ category: TechCategory; index: number }> = ({ category, index }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="mb-16"
    >
      {/* Category Header */}
      <div className="flex items-center mb-8">
        <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm ${category.color} mr-4`}>
          {category.icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{category.name}</h3>
          <p className="text-white/60">{category.skills.length} technologies</p>
        </div>
        <div className="flex-1 ml-6">
          <div className="h-px bg-gradient-to-r from-white/20 to-transparent" />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.skills.map((skill, skillIndex) => (
          <SkillCard key={skill.id} skill={skill} index={skillIndex} />
        ))}
      </div>
    </motion.div>
  );
};

const TechStackSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Calculate overall stats
  const totalSkills = techStack.reduce((acc, category) => acc + category.skills.length, 0);
  const averageProficiency = Math.round(
    techStack.reduce((acc, category) => 
      acc + category.skills.reduce((skillAcc, skill) => skillAcc + skill.proficiency, 0), 0
    ) / totalSkills
  );
  const totalProjects = techStack.reduce((acc, category) => 
    acc + category.skills.reduce((skillAcc, skill) => skillAcc + skill.projects, 0), 0
  );
  const totalCertifications = techStack.reduce((acc, category) => 
    acc + category.skills.reduce((skillAcc, skill) => skillAcc + (skill.certifications?.length || 0), 0), 0
  );

  return (
    <section ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl" />
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
            <Cpu className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-white/80 text-sm font-medium">Technical Expertise</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Technology Stack &amp;
            <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Core Competencies
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            A comprehensive overview of my technical skills, proficiency levels, and hands-on experience 
            across various technologies and frameworks.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { label: 'Technologies', value: totalSkills, icon: <Code className="w-6 h-6" />, color: 'text-blue-400' },
            { label: 'Avg. Proficiency', value: `${averageProficiency}%`, icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-400' },
            { label: 'Total Projects', value: totalProjects, icon: <Layers className="w-6 h-6" />, color: 'text-purple-400' },
            { label: 'Certifications', value: totalCertifications, icon: <Award className="w-6 h-6" />, color: 'text-yellow-400' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
              className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className={`${stat.color} mb-3 flex justify-center`}>{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech Categories */}
        <div className="space-y-16">
          {techStack.map((category, index) => (
            <CategorySection key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Looking for Specific Technology Expertise?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              I'm always learning and adapting to new technologies. If you don't see what you're looking for, 
              let's discuss how I can help with your specific tech stack.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                inline-flex items-center px-8 py-3 rounded-xl font-semibold
                bg-gradient-to-r from-purple-500 to-blue-500
                text-white shadow-lg hover:shadow-xl
                transition-all duration-300
              "
            >
              Discuss Your Project
              <ChevronRight className="w-4 h-4 ml-2" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;