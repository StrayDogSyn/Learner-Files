import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Search, Grid3X3, List, Carousel, Clock, Star, Eye, Calendar, Filter, SortAsc, SortDesc } from 'lucide-react';
import { projects, Project } from '../data/projects';

type ViewMode = 'grid' | 'list' | 'carousel' | 'timeline';
type SortOption = 'popular' | 'recent' | 'alphabetical' | 'custom';
type FilterCategory = 'all' | 'game' | 'tool' | 'educational';

interface ProjectGalleryProps {
  className?: string;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ className = '' }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = activeFilter === 'all' || 
                           (activeFilter === 'game' && project.technologies.some(tech => ['Game Logic', 'AI Algorithms', 'WebSocket'].includes(tech))) ||
                           (activeFilter === 'tool' && project.technologies.some(tech => ['Calculator', 'Math.js', 'Chart.js'].includes(tech))) ||
                           (activeFilter === 'educational' && project.technologies.some(tech => ['CompTIA', 'Training', 'Quiz'].includes(tech)));
      
      return matchesSearch && matchesFilter;
    });

    // Sort projects
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.lastUpdate || '').getTime() - new Date(a.lastUpdate || '').getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'custom':
        // Keep original order
        break;
    }

    return filtered;
  }, [searchQuery, activeFilter, sortBy]);

  const handleFilterChange = useCallback((filter: FilterCategory) => {
    setActiveFilter(filter);
  }, []);

  const handleQuickPlay = useCallback((project: Project) => {
    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank');
    }
  }, []);

  const handleViewDetails = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const filterButtons = [
    { key: 'all', label: 'All Projects', count: projects.length },
    { key: 'game', label: 'Games', count: projects.filter(p => p.technologies.some(tech => ['Game Logic', 'AI Algorithms', 'WebSocket'].includes(tech))).length },
    { key: 'tool', label: 'Tools', count: projects.filter(p => p.technologies.some(tech => ['Calculator', 'Math.js', 'Chart.js'].includes(tech))).length },
    { key: 'educational', label: 'Educational', count: projects.filter(p => p.technologies.some(tech => ['CompTIA', 'Training', 'Quiz'].includes(tech))).length }
  ];

  const viewModeButtons = [
    { key: 'grid', icon: Grid3X3, label: 'Grid' },
    { key: 'list', icon: List, label: 'List' },
    { key: 'carousel', icon: Carousel, label: 'Carousel' },
    { key: 'timeline', icon: Clock, label: 'Timeline' }
  ];

  const sortOptions = [
    { key: 'popular', icon: Star, label: 'Most Popular' },
    { key: 'recent', icon: Calendar, label: 'Recently Updated' },
    { key: 'alphabetical', icon: SortAsc, label: 'Alphabetical' },
    { key: 'custom', icon: SortDesc, label: 'Custom Order' }
  ];

  return (
    <div className={`project-gallery ${className}`}>
      {/* Filter Bar */}
      <motion.div 
        className="filter-bar sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              {filterButtons.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange(key as FilterCategory)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === key
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {label}
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {viewModeButtons.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key as ViewMode)}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === key
                      ? 'bg-white text-blue-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              {sortOptions.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key as SortOption)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    sortBy === key
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`projects-container ${
            viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
            viewMode === 'list' ? 'space-y-4' :
            viewMode === 'carousel' ? 'flex overflow-x-auto gap-6 pb-4' :
            'space-y-6'
          }`}
        >
          <AnimatePresence mode="wait">
            {filteredAndSortedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                layout
                className={`project-card group ${
                  viewMode === 'grid' ? 'h-full' :
                  viewMode === 'list' ? 'flex gap-6' :
                  viewMode === 'carousel' ? 'flex-shrink-0 w-80' :
                  'border-l-4 border-blue-500 pl-6'
                }`}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 2,
                  transition: { duration: 0.2 }
                }}
              >
                <div className={`card-preview relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 ${
                  viewMode === 'list' ? 'w-48 h-32' : 'h-48'
                }`}>
                  {/* Project Preview */}
                  {project.liveUrl ? (
                    <iframe
                      src={project.liveUrl}
                      loading="lazy"
                      className="w-full h-full border-0"
                      title={`${project.title} preview`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            {project.title.charAt(0)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Preview Unavailable</p>
                      </div>
                    </div>
                  )}

                  {/* Overlay */}
                  <motion.div
                    className="overlay absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <button
                      onClick={() => handleQuickPlay(project)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 transform hover:scale-105"
                    >
                      Quick Play
                    </button>
                    <button
                      onClick={() => handleViewDetails(project)}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200 transform hover:scale-105"
                    >
                      View Details
                    </button>
                  </motion.div>
                </div>

                <div className={`card-info p-4 ${
                  viewMode === 'list' ? 'flex-1' : ''
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack Badges */}
                  <div className="tech-badges flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: techIndex * 0.1 }}
                        whileHover={{ scale: 1.05, backgroundColor: '#3B82F6', color: 'white' }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-md">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="stats flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {project.stars || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-blue-500" />
                      {project.viewCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-green-500" />
                      {project.lastUpdate ? new Date(project.lastUpdate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    {project.liveUrl && (
                      <button
                        onClick={() => handleQuickPlay(project)}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        Live Demo
                      </button>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors duration-200 text-center"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredAndSortedProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedProject.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Stats</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>⭐ Stars: {selectedProject.stars || 0}</p>
                      <p>👁️ Views: {selectedProject.viewCount || 0}</p>
                      <p>🕐 Updated: {selectedProject.lastUpdate || 'N/A'}</p>
                      <p>📦 Version: {selectedProject.version || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      View Live Demo
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      View on GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectGallery;
