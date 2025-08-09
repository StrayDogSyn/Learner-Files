'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Play, Eye } from 'lucide-react';
import { Glass } from '@/components/atoms/Glass';
import { Transform3D } from '@/components/effects/Transform3D';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  demoVideoUrl?: string;
  category: string;
  featured?: boolean;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  longDescription,
  image,
  technologies,
  liveUrl,
  githubUrl,
  demoVideoUrl,
  category,
  featured = false,
  className
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  return (
    <div className={cn('relative group', className)}>
      <Transform3D
        preset="cardHover"
        className="h-full"
        containerClassName="perspective-1000"
      >
        <motion.div
          className="relative w-full h-96 preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          onClick={handleFlip}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <Glass
              config="card"
              className="relative h-full overflow-hidden group-hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Featured Badge */}
              {featured && (
                <motion.div
                  className="absolute top-4 right-4 z-10"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <Glass config="button" className="px-3 py-1">
                    <span className="text-amber-400 text-xs font-bold">FEATURED</span>
                  </Glass>
                </motion.div>
              )}
              
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Image Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Quick Actions */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center space-x-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {liveUrl && (
                        <motion.a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-5 h-5 text-white" />
                        </motion.a>
                      )}
                      
                      {githubUrl && (
                        <motion.a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-5 h-5 text-white" />
                        </motion.a>
                      )}
                      
                      {demoVideoUrl && (
                        <motion.button
                          className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Play className="w-5 h-5 text-white" />
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Glass config="button" className="px-3 py-1">
                    <span className="text-navy-100 text-xs font-medium uppercase tracking-wide">
                      {category}
                    </span>
                  </Glass>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-navy-100 mb-2 group-hover:text-amber-400 transition-colors">
                  {title}
                </h3>
                
                <p className="text-navy-300 text-sm mb-4 line-clamp-3">
                  {description}
                </p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {technologies.slice(0, 4).map((tech, index) => (
                    <motion.span
                      key={tech}
                      className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                  {technologies.length > 4 && (
                    <span className="px-2 py-1 bg-navy-700 text-navy-300 text-xs rounded-full">
                      +{technologies.length - 4}
                    </span>
                  )}
                </div>
                
                {/* Flip Indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-navy-400 text-xs">Click to flip</span>
                  <Eye className="w-4 h-4 text-navy-400" />
                </div>
              </div>
            </Glass>
          </div>
          
          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <Glass
              config="card"
              className="h-full p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-navy-100 mb-4">{title}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-amber-400 mb-2">About This Project</h4>
                    <p className="text-navy-300 text-sm leading-relaxed">
                      {longDescription || description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-amber-400 mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                {liveUrl && (
                  <motion.a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-navy-900 rounded-lg font-medium hover:from-amber-400 hover:to-amber-500 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Live</span>
                  </motion.a>
                )}
                
                <div className="flex space-x-3">
                  {githubUrl && (
                    <motion.a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 flex-1 py-2 border border-navy-600 text-navy-200 rounded-lg hover:bg-navy-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </motion.a>
                  )}
                  
                  {demoVideoUrl && (
                    <motion.button
                      className="flex items-center justify-center space-x-2 flex-1 py-2 border border-navy-600 text-navy-200 rounded-lg hover:bg-navy-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Play className="w-4 h-4" />
                      <span>Demo</span>
                    </motion.button>
                  )}
                </div>
                
                <button
                  onClick={handleFlip}
                  className="w-full py-2 text-navy-400 text-sm hover:text-navy-200 transition-colors"
                >
                  ← Back to preview
                </button>
              </div>
            </Glass>
          </div>
        </motion.div>
      </Transform3D>
    </div>
  );
};