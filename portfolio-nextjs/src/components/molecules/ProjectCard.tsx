'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, Github, Star, Users, TrendingUp, Calendar, Clock, Award } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web-app': return '🌐';
      case 'game': return '🎮';
      case 'tool': return '🛠️';
      case 'api': return '⚡';
      case 'mobile': return '📱';
      default: return '💻';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Featured Badge */}
      {project.featured && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="absolute -top-2 -right-2 z-20"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Award className="w-3 h-3" />
            Featured
          </div>
        </motion.div>
      )}

      <motion.div
        animate={{
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ duration: 0.3 }}
        className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500"
      >
        {/* Animated Background Gradient */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.3 : 0.1,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 -z-10"
        />

        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setImageLoaded(true)}
              className={`object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
            )}
          </motion.div>
          
          {/* Overlay with Category */}
          <div className="absolute top-4 left-4">
            <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white flex items-center gap-2">
              <span>{getCategoryIcon(project.category)}</span>
              {project.category.replace('-', ' ').toUpperCase()}
            </div>
          </div>

          {/* Complexity Badge */}
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getComplexityColor(project.complexity)}`}>
              {project.complexity.toUpperCase()}
            </div>
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex gap-3">
              {project.liveUrl && (
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30"
                  onClick={() => window.open(project.liveUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30"
                  onClick={() => window.open(project.githubUrl, '_blank')}
                >
                  <Github className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Description */}
          <div className="mb-4">
            <Typography variant="h3" className="text-white mb-2 group-hover:text-blue-300 transition-colors">
              {project.title}
            </Typography>
            <Typography variant="body" className="text-gray-300 line-clamp-2">
              {project.description}
            </Typography>
          </div>

          {/* Technologies */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * techIndex }}
                  className="px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-xs font-medium text-blue-300 hover:bg-white/20 transition-colors"
                >
                  {tech}
                </motion.span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-xs font-medium text-gray-400">
                  +{project.technologies.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {project.metrics.performance && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">{project.metrics.performance}% Performance</span>
              </div>
            )}
            {project.metrics.users && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">{project.metrics.users.toLocaleString()} Users</span>
              </div>
            )}
            {project.metrics.stars && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300">{project.metrics.stars} Stars</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">{project.duration}</span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Calendar className="w-4 h-4" />
            <span>Completed {new Date(project.dateCompleted).toLocaleDateString()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {project.liveUrl && (
              <Button
                variant="primary"
                size="sm"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => window.open(project.liveUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live
              </Button>
            )}
            {project.githubUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="border border-white/20 hover:border-white/40 hover:bg-white/10"
                onClick={() => window.open(project.githubUrl, '_blank')}
              >
                <Github className="w-4 h-4 mr-2" />
                Code
              </Button>
            )}
          </div>
        </div>

        {/* Animated Border */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.95
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, transparent, transparent)',
            borderImage: 'linear-gradient(45deg, #60a5fa, #a855f7, #ec4899) 1'
          }}
        />
      </motion.div>
    </motion.div>
  );
};