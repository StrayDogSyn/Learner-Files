import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Github, 
  Star, 
  Users, 
  Calendar, 
  Eye, 
  Heart, 
  Share2, 
  Play,
  Bookmark,
  Filter,
  Search
} from 'lucide-react';

// Types
interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured?: boolean;
    version?: string;
    stars?: number;
    forks?: number;
    lastUpdate?: string;
    viewCount?: number;
  };
  onFavorite?: (projectId: string) => void;
  onShare?: (projectId: string) => void;
  onView?: (projectId: string) => void;
  className?: string;
}

interface GitHubStats {
  stars: number;
  forks: number;
  lastUpdate: string;
}

// GitHub API integration hook
const useGitHubStats = (githubUrl?: string) => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!githubUrl) return;
    
    try {
      setLoading(true);
      const repoPath = githubUrl.split('github.com/')[1];
      if (!repoPath) return;
      
      const response = await fetch(`https://api.github.com/repos/${repoPath}`);
      if (response.ok) {
        const data = await response.json();
        setStats({
          stars: data.stargazers_count,
          forks: data.forks_count,
          lastUpdate: new Date(data.updated_at).toLocaleDateString()
        });
      }
    } catch (error) {
      console.error('Failed to fetch GitHub stats:', error);
    } finally {
      setLoading(false);
    }
  }, [githubUrl]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading };
};

// Lazy loading image component
const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({ 
  src, 
  alt, 
  className = '' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            imgRef.current.src = src;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
      )}
      <img
        ref={imgRef}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
      />
      {isError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
          <span className="text-gray-400">Image not available</span>
        </div>
      )}
    </div>
  );
};

// Quick preview component
const QuickPreview: React.FC<{ url?: string; isVisible: boolean }> = ({ url, isVisible }) => {
  if (!url) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="relative w-full h-full max-w-2xl max-h-96 mx-4">
            <iframe
              src={url}
              className="w-full h-full rounded-lg border border-white/20"
              title="Project Preview"
            />
            <button className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <Eye className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main ProjectCard component
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onFavorite,
  onShare,
  onView,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [viewCount, setViewCount] = useState(project.viewCount || 0);
  
  const { stats, loading } = useGitHubStats(project.githubUrl);

  // Handle view tracking
  const handleView = useCallback(() => {
    setViewCount(prev => prev + 1);
    onView?.(project.id);
  }, [project.id, onView]);

  // Handle favorite toggle
  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(prev => !prev);
    onFavorite?.(project.id);
  }, [project.id, onFavorite]);

  // Handle share
  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: project.liveUrl || project.githubUrl || window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(project.liveUrl || project.githubUrl || window.location.href);
    }
    onShare?.(project.id);
  }, [project, onShare]);

  return (
    <motion.div
      className={`relative group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      {/* Card Header */}
      <div className="relative h-48 overflow-hidden">
        <LazyImage
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full"
        />
        
        {/* Project Status */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {project.featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold"
            >
              Featured
            </motion.div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-xs">Live</span>
            {project.version && (
              <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80">
                v{project.version}
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-4"
            >
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Play className="w-5 h-5 text-white" />
                </motion.a>
              )}
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
            >
              {tech}
            </motion.span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
        
        {/* Project Stats */}
        <div className="flex items-center justify-between text-xs text-white/60 mb-4">
          {stats && (
            <>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {stats.stars}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {stats.forks}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {stats.lastUpdate}
              </span>
            </>
          )}
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {viewCount}
          </span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-6 pb-6 flex gap-2">
        {project.liveUrl && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              window.open(project.liveUrl, '_blank');
            }}
          >
            <Play className="w-4 h-4" />
            Live Demo
          </motion.button>
        )}
        
        {project.githubUrl && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-white/10 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              window.open(project.githubUrl, '_blank');
            }}
          >
            <Github className="w-4 h-4" />
            View Code
          </motion.button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 left-4 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
            isFavorited 
              ? 'bg-red-500/80 text-white' 
              : 'bg-white/20 text-white/80 hover:bg-white/30'
          }`}
          onClick={handleFavorite}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white/80 hover:bg-white/30 transition-colors"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Quick Preview */}
      <QuickPreview 
        url={project.liveUrl} 
        isVisible={showPreview} 
      />
    </motion.div>
  );
};

export default ProjectCard;
