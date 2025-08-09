import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Zap, Gamepad2, Calculator } from 'lucide-react';

interface RelatedProject {
  id: string;
  title: string;
  description: string;
  path: string;
  technologies: string[];
  icon: React.ReactNode;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface RelatedProjectsProps {
  currentProjectId?: string;
  technologies?: string[];
  maxSuggestions?: number;
  className?: string;
}

const allProjects: RelatedProject[] = [
  {
    id: 'calculator',
    title: 'Scientific Calculator',
    description: 'Advanced calculator with scientific functions and real-time performance metrics',
    path: '/calculator',
    technologies: ['React', 'TypeScript', 'Math.js', 'Framer Motion'],
    icon: <Calculator className="w-5 h-5" />,
    difficulty: 'Intermediate'
  },
  {
    id: 'quiz-ninja',
    title: 'Quiz Ninja',
    description: 'Interactive quiz application with dynamic questions and progress tracking',
    path: '/quiz-ninja',
    technologies: ['React', 'TypeScript', 'Local Storage', 'CSS Animations'],
    icon: <Code className="w-5 h-5" />,
    difficulty: 'Beginner'
  },
  {
    id: 'knucklebones',
    title: 'Knucklebones Game',
    description: 'Strategic dice game with AI opponent and game logic optimization',
    path: '/knucklebones',
    technologies: ['React', 'TypeScript', 'Game Logic', 'AI Algorithms'],
    icon: <Gamepad2 className="w-5 h-5" />,
    difficulty: 'Advanced'
  },
  {
    id: 'countdown',
    title: 'Countdown Timer',
    description: 'Precision timer with multiple formats and notification system',
    path: '/countdown',
    technologies: ['React', 'TypeScript', 'Web APIs', 'Notifications'],
    icon: <Zap className="w-5 h-5" />,
    difficulty: 'Intermediate'
  }
];

const RelatedProjects: React.FC<RelatedProjectsProps> = ({
  currentProjectId,
  technologies = [],
  maxSuggestions = 3,
  className = ''
}) => {
  const getRelatedProjects = (): RelatedProject[] => {
    // Filter out current project
    const availableProjects = allProjects.filter(
      project => project.id !== currentProjectId
    );
    
    if (technologies.length === 0) {
      // Return random projects if no technologies specified
      return availableProjects
        .sort(() => Math.random() - 0.5)
        .slice(0, maxSuggestions);
    }
    
    // Score projects based on technology overlap
    const scoredProjects = availableProjects.map(project => {
      const commonTechs = project.technologies.filter(tech =>
        technologies.some(userTech => 
          tech.toLowerCase().includes(userTech.toLowerCase()) ||
          userTech.toLowerCase().includes(tech.toLowerCase())
        )
      );
      
      return {
        ...project,
        score: commonTechs.length
      };
    });
    
    // Sort by score and return top suggestions
    return scoredProjects
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSuggestions);
  };
  
  const relatedProjects = getRelatedProjects();
  
  if (relatedProjects.length === 0) {
    return null;
  }
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-charcoal';
    }
  };
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`glassmorphic-card p-6 ${className}`}
      aria-labelledby="related-projects-heading"
    >
      <h3 
        id="related-projects-heading"
        className="text-xl font-bold text-hunter-green mb-4 font-orbitron"
      >
        Related Projects
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatedProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Link
              to={project.path}
              className="block glassmorphic-card p-4 h-full transition-all duration-300 hover:shadow-lg hover:shadow-hunter-green/20 focus:outline-none focus:ring-2 focus:ring-hunter-green focus:ring-opacity-50"
              aria-label={`View ${project.title} project`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="text-hunter-green">
                    {project.icon}
                  </div>
                  <h4 className="font-semibold text-charcoal group-hover:text-hunter-green transition-colors duration-200">
                    {project.title}
                  </h4>
                </div>
                <ArrowRight className="w-4 h-4 text-charcoal opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              </div>
              
              <p className="text-sm text-charcoal opacity-80 mb-3 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>
                
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 2).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-hunter-green/10 text-hunter-green rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-charcoal/10 text-charcoal rounded-full">
                      +{project.technologies.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mt-4 text-center"
      >
        <Link
          to="/projects"
          className="inline-flex items-center space-x-2 text-hunter-green hover:text-hunter-green/80 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-hunter-green focus:ring-opacity-50 rounded px-2 py-1"
          aria-label="View all projects"
        >
          <span>View All Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default RelatedProjects;