import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Github, Star, GitFork, Calendar, Eye, Download, Share2, Maximize2 } from 'lucide-react';
import { ProjectWithStats } from '../hooks/useGitHubStats';

interface ProjectModalProps {
  project: ProjectWithStats | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Reset state when modal opens/closes or project changes
  useEffect(() => {
    if (isOpen && project) {
      setCurrentImageIndex(0);
      setIsImageFullscreen(false);
      setImageLoading(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, project]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen || !project) return;

    switch (e.key) {
      case 'Escape':
        if (isImageFullscreen) {
          setIsImageFullscreen(false);
        } else {
          onClose();
        }
        break;
      case 'ArrowLeft':
        if (project.screenshots && project.screenshots.length > 1) {
          setCurrentImageIndex(prev => 
            prev === 0 ? project.screenshots!.length - 1 : prev - 1
          );
        }
        break;
      case 'ArrowRight':
        if (project.screenshots && project.screenshots.length > 1) {
          setCurrentImageIndex(prev => 
            prev === project.screenshots!.length - 1 ? 0 : prev + 1
          );
        }
        break;
    }
  }, [isOpen, project, isImageFullscreen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen || !project) return null;

  const stats = project.githubStats;
  const displayStars = stats?.stars ?? project.stars;
  const displayForks = stats?.forks ?? project.forks;
  const displayLanguage = stats?.language ?? project.language;
  const displayLastUpdate = stats?.lastUpdate ?? project.lastUpdate;

  const images = project.screenshots && project.screenshots.length > 0 
    ? project.screenshots 
    : [project.imageUrl];

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleShare = async () => {
    if (navigator.share && project.liveUrl) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: project.liveUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const url = project.liveUrl || project.githubUrl || window.location.href;
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Modal Content */}
        <div className="relative w-full max-w-6xl max-h-[90vh] bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                <span className="text-emerald-300 text-sm font-medium">{project.category}</span>
              </div>
              {project.featured && (
                <div className="px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                  <span className="text-yellow-300 text-sm font-semibold">Featured</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                title="Share project"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
            {/* Image Carousel */}
            <div className="lg:w-1/2 relative bg-black/50">
              <div className="relative h-64 lg:h-full min-h-[300px]">
                <img
                  src={images[currentImageIndex]}
                  alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = project.imageUrl;
                  }}
                />
                
                {/* Loading overlay */}
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                  </div>
                )}

                {/* Image navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Fullscreen button */}
                <button
                  onClick={() => setIsImageFullscreen(true)}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>

                {/* Image indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-emerald-500 w-6' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Project Details */}
            <div className="lg:w-1/2 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Title and Version */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Version {project.version}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {displayLastUpdate}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{project.description}</p>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white/10 backdrop-blur-sm text-gray-300 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* GitHub Topics */}
                {stats?.topics && stats.topics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {stats.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-3 py-1 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 rounded-lg border border-emerald-500/30"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {displayStars !== undefined && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="flex items-center gap-2 text-yellow-400 mb-2">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-medium">Stars</span>
                        </div>
                        <span className="text-2xl font-bold text-white">{formatNumber(displayStars)}</span>
                      </div>
                    )}
                    
                    {displayForks !== undefined && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                          <GitFork className="w-5 h-5" />
                          <span className="font-medium">Forks</span>
                        </div>
                        <span className="text-2xl font-bold text-white">{formatNumber(displayForks)}</span>
                      </div>
                    )}
                    
                    {stats?.watchers !== undefined && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="flex items-center gap-2 text-green-400 mb-2">
                          <Eye className="w-5 h-5" />
                          <span className="font-medium">Watchers</span>
                        </div>
                        <span className="text-2xl font-bold text-white">{formatNumber(stats.watchers)}</span>
                      </div>
                    )}
                    
                    {project.viewCount && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="flex items-center gap-2 text-purple-400 mb-2">
                          <Eye className="w-5 h-5" />
                          <span className="font-medium">Views</span>
                        </div>
                        <span className="text-2xl font-bold text-white">{formatNumber(project.viewCount)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Testimonials */}
                {project.testimonials && project.testimonials.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Testimonials</h3>
                    <div className="space-y-3">
                      {project.testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                          <p className="text-gray-300 italic mb-2">&quot;{testimonial.content}&quot;</p>
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">{testimonial.author}</span>
                            {testimonial.role && <span> - {testimonial.role}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 hover:scale-105 transition-all duration-300 font-medium"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-gray-300 rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 font-medium"
                    >
                      <Github className="w-5 h-5" />
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isImageFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-60 flex items-center justify-center p-4"
          onClick={() => setIsImageFullscreen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={images[currentImageIndex]}
              alt={`${project.title} screenshot ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsImageFullscreen(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => 
                      prev === 0 ? images.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => 
                      prev === images.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectModal;