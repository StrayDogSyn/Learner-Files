import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '../utils/lazyLoading';
import { 
  ExternalLink, 
  Github, 
  Play, 
  Brain, 
  Calculator, 
  BookOpen, 
  Timer, 
  Zap,
  Star,
  Users,
  TrendingUp
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  demoUrl: string;
  githubUrl: string;
  imageUrl: string;
  category: 'AI' | 'Web App' | 'Tool' | 'Game';
  featured: boolean;
  stats: {
    users?: string;
    rating?: number;
    performance?: string;
  };
  aiFeatures?: string[];
}

const featuredProjects: Project[] = [
  {
    id: 'quiz-ninja',
    title: 'QuizNinja',
    description: 'AI-powered adaptive quiz platform with intelligent question generation',
    longDescription: 'Advanced quiz application featuring AI-driven question generation, adaptive difficulty scaling, and personalized learning paths. Integrates machine learning algorithms to optimize learning outcomes.',
    technologies: ['React', 'TypeScript', 'OpenAI API', 'Node.js', 'Machine Learning'],
    demoUrl: '/quiz-ninja',
    githubUrl: 'https://github.com/straydogsyn/quiz-ninja',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20quiz%20application%20interface%20with%20AI%20elements%20dark%20theme%20neon%20accents%20futuristic%20design&image_size=landscape_16_9',
    category: 'AI',
    featured: true,
    stats: {
      users: '10K+',
      rating: 4.8,
      performance: '99.9%'
    },
    aiFeatures: ['Adaptive Difficulty', 'Smart Question Generation', 'Learning Analytics']
  },
  {
    id: 'ai-calculator',
    title: 'AI Calculator Pro',
    description: 'Next-generation calculator with natural language processing and equation solving',
    longDescription: 'Revolutionary calculator that understands natural language input, solves complex equations, and provides step-by-step explanations using advanced AI algorithms.',
    technologies: ['React', 'TypeScript', 'NLP', 'Mathematical APIs', 'AI/ML'],
    demoUrl: '/calculator',
    githubUrl: 'https://github.com/straydogsyn/ai-calculator',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20calculator%20interface%20with%20AI%20brain%20holographic%20display%20mathematical%20equations%20floating%20dark%20background&image_size=landscape_16_9',
    category: 'AI',
    featured: true,
    stats: {
      users: '25K+',
      rating: 4.9,
      performance: '99.8%'
    },
    aiFeatures: ['Natural Language Input', 'Step-by-Step Solutions', 'Equation Recognition']
  },
  {
    id: 'comptia-trainer',
    title: 'CompTIA AI Trainer',
    description: 'Intelligent certification training platform with personalized study plans',
    longDescription: 'Comprehensive CompTIA certification training platform powered by AI to create personalized study plans, adaptive practice tests, and intelligent progress tracking.',
    technologies: ['React', 'TypeScript', 'AI/ML', 'Data Analytics', 'Progressive Web App'],
    demoUrl: '/comptia',
    githubUrl: 'https://github.com/straydogsyn/comptia-trainer',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20certification%20training%20platform%20cybersecurity%20themed%20AI%20dashboard%20progress%20charts%20modern%20interface&image_size=landscape_16_9',
    category: 'AI',
    featured: true,
    stats: {
      users: '15K+',
      rating: 4.7,
      performance: '99.5%'
    },
    aiFeatures: ['Personalized Learning', 'Adaptive Testing', 'Progress Prediction']
  },
  {
    id: 'countdown-master',
    title: 'Countdown Master',
    description: 'Smart countdown timer with AI-powered productivity insights',
    longDescription: 'Advanced countdown timer application featuring AI-driven productivity analytics, smart break suggestions, and personalized time management recommendations.',
    technologies: ['React', 'TypeScript', 'PWA', 'AI Analytics', 'Local Storage'],
    demoUrl: '/countdown',
    githubUrl: 'https://github.com/straydogsyn/countdown-master',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sleek%20countdown%20timer%20interface%20with%20AI%20productivity%20analytics%20charts%20modern%20minimalist%20design%20glowing%20elements&image_size=landscape_16_9',
    category: 'Tool',
    featured: true,
    stats: {
      users: '8K+',
      rating: 4.6,
      performance: '99.9%'
    },
    aiFeatures: ['Productivity Analytics', 'Smart Suggestions', 'Usage Patterns']
  }
];

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI': return <Brain className="w-5 h-5" />;
      case 'Web App': return <Zap className="w-5 h-5" />;
      case 'Tool': return <Calculator className="w-5 h-5" />;
      case 'Game': return <Play className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="card-feature bg-[var(--deep-black)]/90 backdrop-blur-sm border border-[var(--hunter-green)]/30 rounded-2xl overflow-hidden hover:border-[var(--electric-blue)] transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--electric-blue)]/20">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <LazyImage
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full transition-transform duration-500 group-hover:scale-110"
            placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTExIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzU1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--deep-black)]/80 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-[var(--ai-purple)]/90 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
            {getCategoryIcon(project.category)}
            {project.category}
          </div>
          
          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-[var(--electric-blue)]/90 backdrop-blur-sm rounded-full text-white text-xs font-bold">
              <Star className="w-3 h-3 fill-current" />
              FEATURED
            </div>
          )}
        </div>
        
        {/* Project Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 font-heading">{project.title}</h3>
            <p className="text-white/70 text-sm leading-relaxed font-body">{project.description}</p>
          </div>
          
          {/* AI Features */}
          {project.aiFeatures && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--ai-purple)] text-sm font-semibold">
                <Brain className="w-4 h-4" />
                AI Features
              </div>
              <div className="flex flex-wrap gap-1">
                {project.aiFeatures.map((feature, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-[var(--ai-purple)]/20 text-[var(--ai-purple)] text-xs rounded-md border border-[var(--ai-purple)]/30"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Technologies */}
          <div className="space-y-2">
            <div className="text-[var(--hunter-green)] text-sm font-semibold">Technologies</div>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((tech, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 bg-[var(--hunter-green)]/20 text-[var(--hunter-green)] text-xs rounded-md border border-[var(--hunter-green)]/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-3 border-t border-white/10">
            {project.stats.users && (
              <div className="text-center">
                <div className="flex items-center justify-center text-[var(--electric-blue)] mb-1">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-white font-bold text-sm">{project.stats.users}</div>
                <div className="text-white/60 text-xs">Users</div>
              </div>
            )}
            {project.stats.rating && (
              <div className="text-center">
                <div className="flex items-center justify-center text-[var(--electric-blue)] mb-1">
                  <Star className="w-4 h-4" />
                </div>
                <div className="text-white font-bold text-sm">{project.stats.rating}</div>
                <div className="text-white/60 text-xs">Rating</div>
              </div>
            )}
            {project.stats.performance && (
              <div className="text-center">
                <div className="flex items-center justify-center text-[var(--electric-blue)] mb-1">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-white font-bold text-sm">{project.stats.performance}</div>
                <div className="text-white/60 text-xs">Uptime</div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <motion.a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-cta flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--electric-blue)] to-[var(--ai-purple)] text-white font-bold rounded-lg transition-all duration-300"
            >
              <Play className="w-4 h-4" />
              Live Demo
            </motion.a>
            
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center justify-center gap-2 px-4 py-3 bg-transparent border-2 border-[var(--hunter-green)] text-[var(--hunter-green)] font-semibold rounded-lg hover:bg-[var(--hunter-green)] hover:text-white transition-all duration-300"
            >
              <Github className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedProjects: React.FC = () => {
  return (
    <section id="projects" className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-black)] via-[var(--deep-black)]/95 to-[var(--deep-black)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,var(--electric-blue)/10,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,var(--ai-purple)/10,transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--ai-purple)]/20 border border-[var(--ai-purple)]/30 rounded-full text-[var(--ai-purple)] font-semibold mb-6"
          >
            <Brain className="w-5 h-5" />
            Flagship AI Solutions
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-heading">
            Transforming Ideas into
            <span className="block bg-gradient-to-r from-[var(--electric-blue)] via-[var(--ai-purple)] to-[var(--hunter-green)] bg-clip-text text-transparent">
              Intelligent Solutions
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-body">
            Explore our portfolio of AI-enhanced applications that demonstrate the power of 
            human creativity combined with artificial intelligence.
          </p>
        </motion.div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        
        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('gallery');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-secondary inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-[var(--hunter-green)] text-[var(--hunter-green)] font-bold rounded-xl hover:bg-[var(--hunter-green)] hover:text-white transition-all duration-300"
          >
            <BookOpen className="w-5 h-5" />
            Explore All Projects
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;