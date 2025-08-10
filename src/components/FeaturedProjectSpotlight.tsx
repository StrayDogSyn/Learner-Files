import React, { useState, useEffect } from 'react';
import { Star, GitFork, Calendar, ExternalLink, Github, Eye, Award, Zap, Code, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { ProjectWithStats } from '../hooks/useGitHubStats';

interface FeaturedProjectSpotlightProps {
  projects: ProjectWithStats[];
  onProjectClick?: (project: ProjectWithStats) => void;
  autoRotate?: boolean;
  rotateInterval?: number;
}

const FeaturedProjectSpotlight: React.FC<FeaturedProjectSpotlightProps> = ({
  projects,
  onProjectClick,
  autoRotate = true,
  rotateInterval = 8000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoRotate);
  const [imageLoaded, setImageLoaded] = useState(false);

  const featuredProjects = projects.filter(project => project.featured);

  // Auto-rotate functionality
  useEffect(() => {
    if (!isAutoPlaying || featuredProjects.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredProjects.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredProjects.length, rotateInterval]);

  // Reset image loaded state when project changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  if (featuredProjects.length === 0) {
    return null;
  }

  const currentProject = featuredProjects[currentIndex];
  const stats = currentProject.githubStats;
  const displayStars = stats?.stars ?? currentProject.stars;
  const displayForks = stats?.forks ?? currentProject.forks;
  const displayLanguage = stats?.language ?? currentProject.language;
  const displayLastUpdate = stats?.lastUpdate ?? currentProject.lastUpdate;

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI':
        return <Zap className="w-6 h-6" />;
      case 'Web':
        return <Code className="w-6 h-6" />;
      case 'Tools':
        return <Award className="w-6 h-6" />;
      default:
        return <Code className="w-6 h-6" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'AI':
        return 'from-purple-500/30 via-pink-500/20 to-red-500/30';
      case 'Web':
        return 'from-blue-500/30 via-cyan-500/20 to-teal-500/30';
      case 'Tools':
        return 'from-emerald-500/30 via-green-500/20 to-lime-500/30';
      default:
        return 'from-gray-500/30 via-slate-500/20 to-zinc-500/30';
    }
  };

  const nextProject = () => {
    setCurrentIndex(prev => (prev + 1) % featuredProjects.length);
    setIsAutoPlaying(false);
  };

  const prevProject = () => {
    setCurrentIndex(prev => (prev - 1 + featuredProjects.length) % featuredProjects.length);
    setIsAutoPlaying(false);
  };

  const goToProject = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          Featured Project Spotlight
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Discover my most impactful and innovative projects that showcase cutting-edge technologies and creative solutions.
        </p>
      </div>

      {/* Main Spotlight */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background with animated gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(currentProject.category)} opacity-80`} />
        
        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-tl from-emerald-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative flex flex-col lg:flex-row min-h-[500px]">
          {/* Project Image */}
          <div className="lg:w-1/2 relative overflow-hidden">
            <div className="relative h-64 lg:h-full">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
              )}
              <img
                src={currentProject.imageUrl}
                alt={currentProject.title}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent lg:bg-gradient-to-t lg:from-transparent lg:via-transparent lg:to-transparent" />
              
              {/* Category badge */}
              <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20">
                {getCategoryIcon(currentProject.category)}
                <span className="text-white font-semibold">{currentProject.category}</span>
              </div>
              
              {/* Featured badge */}
              <div className="absolute top-6 right-6 px-4 py-2 bg-emerald-500/80 backdrop-blur-md rounded-full border border-emerald-400/30">
                <span className="text-white font-bold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Featured
                </span>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              {/* Title and Version */}
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  {currentProject.title}
                </h3>
                <div className="flex items-center gap-4 text-gray-300">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium">
                    v{currentProject.version}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Updated {displayLastUpdate}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-200 text-lg leading-relaxed">
                {currentProject.description}
              </p>

              {/* Technologies */}
              <div>
                <h4 className="text-white font-semibold mb-3">Built with</h4>
                <div className="flex flex-wrap gap-2">
                  {currentProject.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm text-gray-300 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                    >
                      {tech}
                    </span>
                  ))}
                  {currentProject.technologies.length > 5 && (
                    <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 rounded-lg border border-emerald-500/30">
                      +{currentProject.technologies.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {displayStars !== undefined && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div className="text-2xl font-bold text-white">{formatNumber(displayStars)}</div>
                    <div className="text-xs text-gray-400">Stars</div>
                  </div>
                )}
                
                {displayForks !== undefined && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                      <GitFork className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-white">{formatNumber(displayForks)}</div>
                    <div className="text-xs text-gray-400">Forks</div>
                  </div>
                )}
                
                {currentProject.viewCount && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-white">{formatNumber(currentProject.viewCount)}</div>
                    <div className="text-xs text-gray-400">Views</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {currentProject.liveUrl && (
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 hover:scale-105 transition-all duration-300 font-semibold group"
                  >
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Live Demo
                  </a>
                )}
                {currentProject.githubUrl && (
                  <a
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-gray-300 rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 font-semibold group"
                  >
                    <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Source Code
                  </a>
                )}
                <button
                  onClick={() => onProjectClick?.(currentProject)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500/20 backdrop-blur-sm text-blue-300 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 hover:scale-105 transition-all duration-300 font-semibold group"
                >
                  <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        {featuredProjects.length > 1 && (
          <>
            {/* Previous/Next Buttons */}
            <button
              onClick={prevProject}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-black/70 hover:scale-110 transition-all duration-300 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextProject}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-black/70 hover:scale-110 transition-all duration-300 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Auto-play toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 backdrop-blur-md rounded-full border transition-all duration-300 z-10 ${
                isAutoPlaying 
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' 
                  : 'bg-white/10 border-white/20 text-gray-300'
              }`}
            >
              <span className="text-sm font-medium">
                {isAutoPlaying ? 'Auto-playing' : 'Paused'}
              </span>
            </button>
          </>
        )}
      </div>

      {/* Project Indicators */}
      {featuredProjects.length > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          {featuredProjects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => goToProject(index)}
              className={`group relative transition-all duration-300 ${
                index === currentIndex ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`w-16 h-16 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                index === currentIndex 
                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/30' 
                  : 'border-white/20 hover:border-white/40'
              }`}>
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-emerald-500/20' 
                    : 'bg-black/40 group-hover:bg-black/20'
                }`} />
              </div>
              
              {/* Progress indicator for current project */}
              {index === currentIndex && isAutoPlaying && (
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-100 ease-linear"
                    style={{
                      animation: `progress ${rotateInterval}ms linear infinite`
                    }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Custom CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default FeaturedProjectSpotlight;