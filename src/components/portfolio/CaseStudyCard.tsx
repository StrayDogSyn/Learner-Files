import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, TrendingUp, Users, Zap, Shield } from 'lucide-react';
import { ProjectCaseStudy } from '../../data/projectMetrics';

interface CaseStudyCardProps {
  project: ProjectCaseStudy;
  className?: string;
  onViewDetails?: (projectId: string) => void;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  project,
  className = '',
  onViewDetails
}) => {
  const handleViewDemo = () => {
    if (project.demoUrl) {
      window.open(project.demoUrl, '_blank');
    }
  };

  const handleViewGithub = () => {
    if (project.githubUrl) {
      window.open(project.githubUrl, '_blank');
    }
  };

  const handleViewDetails = () => {
    onViewDetails?.(project.id);
  };

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-emerald-400/50 transition-all duration-500 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Image */}
      {project.imageUrl && (
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white font-orbitron mb-2">
              {project.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            {project.demoUrl && (
              <motion.button
                onClick={handleViewDemo}
                className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View live demo"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </motion.button>
            )}
            {project.githubUrl && (
              <motion.button
                onClick={handleViewGithub}
                className="p-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 hover:border-gray-400/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View source code"
              >
                <Github className="w-4 h-4 text-gray-400" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Performance</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.metrics.performance}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Accuracy</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.metrics.accuracy}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Accessibility</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.metrics.accessibility}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">Satisfaction</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.metrics.userSatisfaction}</p>
          </div>
        </div>

        {/* Features Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">
              {project.metrics.features} Features Implemented
            </span>
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-4">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Technologies</h4>
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded-md border border-white/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Key Challenge Preview */}
        {project.challenges.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Key Challenge</h4>
            <p className="text-sm text-gray-300 line-clamp-2">
              {project.challenges[0].problem}
            </p>
          </div>
        )}

        {/* View Details Button */}
        <motion.button
          onClick={handleViewDetails}
          className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border border-emerald-400/30 hover:border-emerald-400/50 rounded-lg text-white font-medium transition-all duration-300 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Case Study
        </motion.button>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl" />
      </div>
    </motion.div>
  );
};

export default CaseStudyCard;