import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Grid, List, Filter, Search, X } from 'lucide-react';
import MobileCard from './MobileCard';
import TouchGestureHandler from './TouchGestureHandler';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  featured?: boolean;
  url?: string;
  github?: string;
  status: 'completed' | 'in-progress' | 'planned';
  technologies: string[];
}

interface MobileProjectGalleryProps {
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
  className?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  itemsPerPage?: number;
}

type ViewMode = 'grid' | 'list' | 'carousel';
type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'category';

const MobileProjectGallery: React.FC<MobileProjectGalleryProps> = ({
  projects,
  onProjectSelect,
  className = '',
  showFilters = true,
  showSearch = true,
  itemsPerPage = 6
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const galleryRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Get unique categories and tags
  const categories = ['all', ...new Set(projects.map(p => p.category))];
  const allTags = [...new Set(projects.flatMap(p => p.tags))];

  // Filter and sort projects
  const filteredProjects = useCallback(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => project.tags.includes(tag));
      
      return matchesSearch && matchesCategory && matchesTags;
    });

    // Sort projects
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'oldest':
        filtered.reverse();
        break;
      default: // newest
        break;
    }

    return filtered;
  }, [projects, searchQuery, selectedCategory, selectedTags, sortBy]);

  const displayedProjects = filteredProjects();
  const totalPages = Math.ceil(displayedProjects.length / itemsPerPage);
  const currentProjects = displayedProjects.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle project selection
  const handleProjectSelect = (project: Project) => {
    if (onProjectSelect) {
      onProjectSelect(project);
    }
  };

  // Handle carousel swipe
  const handleCarouselSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'left' && carouselIndex < displayedProjects.length - 1) {
      setCarouselIndex(carouselIndex + 1);
    } else if (direction === 'right' && carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  // Handle page swipe
  const handlePageSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'left' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'right' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setCurrentPage(0);
  };

  // Reset carousel index when projects change
  useEffect(() => {
    setCarouselIndex(0);
  }, [displayedProjects]);

  // Auto-advance carousel (optional)
  useEffect(() => {
    if (viewMode === 'carousel' && displayedProjects.length > 1) {
      const interval = setInterval(() => {
        setCarouselIndex(prev => 
          prev >= displayedProjects.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [viewMode, displayedProjects.length]);

  return (
    <div className={`mobile-project-gallery ${className}`}>
      {/* Header */}
      <div className="gallery-header">
        <div className="gallery-title">
          <h2>Projects</h2>
          <span className="project-count">
            {displayedProjects.length} {displayedProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
        
        <div className="gallery-controls">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : viewMode === 'list' ? 'carousel' : 'grid')}
            className="view-toggle"
            aria-label={`Switch to ${viewMode === 'grid' ? 'list' : viewMode === 'list' ? 'carousel' : 'grid'} view`}
          >
            {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
          </button>
          
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`filter-toggle ${showFilterPanel ? 'active' : ''}`}
              aria-label="Toggle filters"
            >
              <Filter size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="clear-search"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="filter-panel"
          >
            {/* Categories */}
            <div className="filter-section">
              <h4>Category</h4>
              <div className="filter-options">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="filter-section">
              <h4>Technologies</h4>
              <div className="filter-options tags">
                {allTags.slice(0, 10).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`filter-option tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="filter-section">
              <h4>Sort by</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="sort-select"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="category">Category</option>
              </select>
            </div>

            <button onClick={clearFilters} className="clear-filters">
              Clear all filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Content */}
      <div ref={galleryRef} className="gallery-content">
        {viewMode === 'carousel' ? (
          <TouchGestureHandler
            onSwipe={handleCarouselSwipe}
            className="carousel-container"
          >
            <div className="carousel-wrapper">
              <AnimatePresence mode="wait">
                {displayedProjects.length > 0 && (
                  <motion.div
                    key={carouselIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="carousel-item"
                  >
                    <MobileCard
                      title={displayedProjects[carouselIndex].title}
                      description={displayedProjects[carouselIndex].description}
                      image={displayedProjects[carouselIndex].image}
                      tags={displayedProjects[carouselIndex].technologies}
                      onTap={() => handleProjectSelect(displayedProjects[carouselIndex])}
                      expandable
                      favoritable
                      shareable
                      bookmarkable
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Carousel Indicators */}
              <div className="carousel-indicators">
                {displayedProjects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={`indicator ${index === carouselIndex ? 'active' : ''}`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Carousel Navigation */}
              <div className="carousel-nav">
                <button
                  onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                  disabled={carouselIndex === 0}
                  className="nav-btn prev"
                  aria-label="Previous project"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => setCarouselIndex(Math.min(displayedProjects.length - 1, carouselIndex + 1))}
                  disabled={carouselIndex === displayedProjects.length - 1}
                  className="nav-btn next"
                  aria-label="Next project"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </TouchGestureHandler>
        ) : (
          <TouchGestureHandler
            onSwipe={handlePageSwipe}
            className={`projects-container ${viewMode}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`projects-grid ${viewMode}`}
              >
                {currentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="project-item"
                  >
                    <MobileCard
                      title={project.title}
                      subtitle={project.category}
                      description={project.description}
                      image={project.image}
                      tags={project.technologies}
                      onTap={() => handleProjectSelect(project)}
                      expandable={viewMode === 'list'}
                      favoritable
                      shareable
                      bookmarkable
                      actions={[
                        {
                          label: 'View Project',
                          onClick: () => handleProjectSelect(project),
                          variant: 'primary'
                        },
                        ...(project.github ? [{
                          label: 'GitHub',
                          onClick: () => window.open(project.github, '_blank'),
                          variant: 'secondary' as const
                        }] : [])
                      ]}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </TouchGestureHandler>
        )}
      </div>

      {/* Pagination */}
      {viewMode !== 'carousel' && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="page-btn"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="page-indicators">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`page-indicator ${index === currentPage ? 'active' : ''}`}
                aria-label={`Go to page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="page-btn"
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Empty State */}
      {displayedProjects.length === 0 && (
        <div className="empty-state">
          <p>No projects found matching your criteria.</p>
          <button onClick={clearFilters} className="clear-filters">
            Clear filters
          </button>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .mobile-project-gallery {
          width: 100%;
          max-width: 100%;
          padding: 16px;
        }
        
        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .gallery-title h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          color: var(--text-primary, #1f2937);
        }
        
        .project-count {
          font-size: 0.875rem;
          color: var(--text-secondary, #6b7280);
          margin-left: 8px;
        }
        
        .gallery-controls {
          display: flex;
          gap: 8px;
        }
        
        .view-toggle,
        .filter-toggle {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          color: var(--text-primary, #1f2937);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .filter-toggle.active {
          background: var(--accent-color, #3b82f6);
          color: white;
        }
        
        .search-container {
          margin-bottom: 16px;
        }
        
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-secondary, #6b7280);
          z-index: 1;
        }
        
        .search-input {
          width: 100%;
          padding: 12px 12px 12px 44px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          color: var(--text-primary, #1f2937);
          font-size: 1rem;
          outline: none;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          border-color: var(--accent-color, #3b82f6);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .clear-search {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-secondary, #6b7280);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
        
        .filter-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          overflow: hidden;
        }
        
        .filter-section {
          margin-bottom: 16px;
        }
        
        .filter-section h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0 0 8px 0;
        }
        
        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        
        .filter-options.tags {
          max-height: 80px;
          overflow-y: auto;
        }
        
        .filter-option {
          padding: 6px 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary, #6b7280);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .filter-option.active {
          background: var(--accent-color, #3b82f6);
          color: white;
          border-color: var(--accent-color, #3b82f6);
        }
        
        .sort-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary, #1f2937);
          font-size: 0.875rem;
        }
        
        .clear-filters {
          width: 100%;
          padding: 10px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .gallery-content {
          margin-bottom: 16px;
        }
        
        .projects-grid.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        
        .projects-grid.list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .carousel-container {
          position: relative;
        }
        
        .carousel-wrapper {
          position: relative;
          min-height: 400px;
        }
        
        .carousel-item {
          width: 100%;
        }
        
        .carousel-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }
        
        .indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .indicator.active {
          background: var(--accent-color, #3b82f6);
          transform: scale(1.2);
        }
        
        .carousel-nav {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
          padding: 0 16px;
          pointer-events: none;
        }
        
        .nav-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          pointer-events: auto;
          transition: all 0.2s ease;
        }
        
        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }
        
        .page-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary, #1f2937);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .page-indicators {
          display: flex;
          gap: 4px;
        }
        
        .page-indicator {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-secondary, #6b7280);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .page-indicator.active {
          background: var(--accent-color, #3b82f6);
          color: white;
          border-color: var(--accent-color, #3b82f6);
        }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary, #6b7280);
        }
        
        @media (max-width: 640px) {
          .projects-grid.grid {
            grid-template-columns: 1fr;
          }
          
          .gallery-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .gallery-controls {
            align-self: flex-end;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .carousel-item,
          .projects-grid,
          .filter-panel {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileProjectGallery;
export type { MobileProjectGalleryProps, Project };