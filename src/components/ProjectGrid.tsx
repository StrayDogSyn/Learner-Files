import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Star, Eye, Heart } from 'lucide-react';
import ProjectCard from './ProjectCard';

// Types
interface Project {
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
}

interface ProjectGridProps {
  projects: Project[];
  className?: string;
}

// Filter component
const FilterBar: React.FC<{
  technologies: string[];
  selectedTechs: string[];
  onTechChange: (tech: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}> = ({ technologies, selectedTechs, onTechChange, searchQuery, onSearchChange, viewMode, onViewModeChange }) => {
  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
        />
      </div>

      {/* Technology Filters */}
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <motion.button
            key={tech}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedTechs.includes(tech)
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
            }`}
            onClick={() => onTechChange(tech)}
          >
            {tech}
          </motion.button>
        ))}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">View:</span>
          <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              className={`p-2 rounded-md transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
              onClick={() => onViewModeChange('grid')}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-md transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
              onClick={() => onViewModeChange('list')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-white/60 text-sm">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            Total Views
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            Favorites
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            Stars
          </span>
        </div>
      </div>
    </div>
  );
};

// Main ProjectGrid component
export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // Get all unique technologies
  const allTechnologies = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, [projects]);

  // Filter projects based on search and technology filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));

      // Technology filter
      const matchesTechs = selectedTechs.length === 0 || 
        selectedTechs.some(tech => project.technologies.includes(tech));

      return matchesSearch && matchesTechs;
    });
  }, [projects, searchQuery, selectedTechs]);

  // Handle technology filter toggle
  const handleTechChange = (tech: string) => {
    setSelectedTechs(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  // Handle favorite toggle
  const handleFavorite = (projectId: string) => {
    setFavorites(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  // Handle share
  const handleShare = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project && navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: project.liveUrl || project.githubUrl || window.location.href
      });
    }
  };

  // Handle view tracking
  const handleView = (projectId: string) => {
    setViewCounts(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || 0) + 1
    }));
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Filter Bar */}
      <FilterBar
        technologies={allTechnologies}
        selectedTechs={selectedTechs}
        onTechChange={handleTechChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between text-white/60">
        <span>
          Showing {filteredProjects.length} of {projects.length} projects
        </span>
        {selectedTechs.length > 0 && (
          <span>
            Filtered by: {selectedTechs.join(', ')}
          </span>
        )}
      </div>

      {/* Project Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProjectCard
                project={{
                  ...project,
                  viewCount: viewCounts[project.id] || project.viewCount || 0
                }}
                onFavorite={handleFavorite}
                onShare={handleShare}
                onView={handleView}
                className={viewMode === 'list' ? 'flex-row h-32' : ''}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-white/60 text-lg mb-4">
            No projects found matching your criteria
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTechs([]);
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectGrid;
