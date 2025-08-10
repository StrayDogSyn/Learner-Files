import React, { useState } from 'react';
import { Star, GitFork, Calendar, ExternalLink, Github, Eye, Code, Zap, Award } from 'lucide-react';
import { ProjectWithStats } from '../hooks/useGitHubStats';

interface ProjectCard3DProps {
  project: ProjectWithStats;
  onClick?: () => void;
  className?: string;
}

const ProjectCard3D: React.FC<ProjectCard3DProps> = ({ project, onClick, className = '' }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const stats = project.githubStats;
  const displayStars = stats?.stars ?? project.stars;
  const displayForks = stats?.forks ?? project.forks;
  const displayLanguage = stats?.language ?? project.language;
  const displayLastUpdate = stats?.lastUpdate ?? project.lastUpdate;

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI':
        return <Zap className="w-5 h-5" />;
      case 'Web':
        return <Code className="w-5 h-5" />;
      case 'Tools':
        return <Award className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'AI':
        return 'from-purple-500/20 via-pink-500/20 to-red-500/20';
      case 'Web':
        return 'from-blue-500/20 via-cyan-500/20 to-teal-500/20';
      case 'Tools':
        return 'from-emerald-500/20 via-green-500/20 to-lime-500/20';
      default:
        return 'from-gray-500/20 via-slate-500/20 to-zinc-500/20';
    }
  };

  return (
    <div className={`group perspective-1000 ${className}`}>
      <div
        className={`relative w-full h-96 transition-all duration-700 transform-style-preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        } ${isHovered ? 'scale-105' : ''}`}
        onClick={() => {
          setIsFlipped(!isFlipped);
          onClick?.();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className={`relative w-full h-full bg-gradient-to-br ${getCategoryGradient(project.category)} backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500`}>
            {/* Glassmorphic overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-emerald-500/20 to-transparent rounded-full blur-lg animate-pulse delay-1000" />
            </div>

            {/* Project Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Category badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/20">
                {getCategoryIcon(project.category)}
                <span className="text-white text-sm font-medium">{project.category}</span>
              </div>
              
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/80 backdrop-blur-md rounded-full border border-emerald-400/30">
                  <span className="text-white text-sm font-semibold">Featured</span>
                </div>
              )}
              
              {/* Stats overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white">
                {displayStars !== undefined && (
                  <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{formatNumber(displayStars)}</span>
                  </div>
                )}
                {displayForks !== undefined && (
                  <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                    <GitFork className="w-4 h-4" />
                    <span className="text-sm font-medium">{formatNumber(displayForks)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="relative p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-white/10 backdrop-blur-sm text-xs text-gray-300 rounded-md border border-white/20 hover:bg-white/20 transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-emerald-500/20 backdrop-blur-sm text-xs text-emerald-300 rounded-md border border-emerald-500/30">
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>

              {/* Bottom info */}
              <div className="flex items-center justify-between text-sm">
                {displayLanguage && (
                  <span className="text-emerald-400 font-medium">{displayLanguage}</span>
                )}
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">{displayLastUpdate}</span>
                </div>
              </div>
            </div>

            {/* Flip indicator */}
            <div className="absolute bottom-4 right-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 text-xs">
                <Eye className="w-3 h-3" />
                <span>Click to flip</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className={`relative w-full h-full bg-gradient-to-br ${getCategoryGradient(project.category)} backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl`}>
            {/* Glassmorphic overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-xl animate-pulse delay-500" />
            </div>

            <div className="relative p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(project.category)}
                  <h3 className="text-lg font-bold text-white">{project.title}</h3>
                </div>
                <span className="text-emerald-400 text-sm font-medium">v{project.version}</span>
              </div>

              {/* Detailed Description */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Description</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* All Technologies */}
                <div>
                  <h4 className="text-white font-semibold mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-white/10 backdrop-blur-sm text-xs text-gray-300 rounded border border-white/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* GitHub Topics */}
                {stats?.topics && stats.topics.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Topics</h4>
                    <div className="flex flex-wrap gap-1">
                      {stats.topics.slice(0, 6).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-emerald-500/20 backdrop-blur-sm text-xs text-emerald-300 rounded border border-emerald-500/30"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {displayStars !== undefined && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2 text-yellow-400 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">Stars</span>
                      </div>
                      <span className="text-white font-bold">{formatNumber(displayStars)}</span>
                    </div>
                  )}
                  
                  {displayForks !== undefined && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2 text-blue-400 mb-1">
                        <GitFork className="w-4 h-4" />
                        <span className="text-sm font-medium">Forks</span>
                      </div>
                      <span className="text-white font-bold">{formatNumber(displayForks)}</span>
                    </div>
                  )}
                  
                  {stats?.watchers !== undefined && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2 text-green-400 mb-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Watchers</span>
                      </div>
                      <span className="text-white font-bold">{formatNumber(stats.watchers)}</span>
                    </div>
                  )}
                  
                  {stats?.issues !== undefined && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2 text-red-400 mb-1">
                        <span className="text-sm font-medium">Issues</span>
                      </div>
                      <span className="text-white font-bold">{stats.issues}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 hover:scale-105 transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="font-medium">Live Demo</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-gray-300 rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300"
                  >
                    <Github className="w-4 h-4" />
                    <span className="font-medium">Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard3D;