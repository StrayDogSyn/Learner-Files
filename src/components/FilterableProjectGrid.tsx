import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, ExternalLink, Github, Calendar } from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';
import type { Project } from '../types/portfolio';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface FilterableProjectGridProps {
  className?: string;
  showFilters?: boolean;
  maxItems?: number;
}

interface GitHubRepoData {
  stargazers_count: number;
  updated_at: string;
  language: string;
  topics: string[];
}

const ProjectCard: React.FC<{ project: Project; onSelect: (project: Project) => void }> = ({ 
  project, 
  onSelect 
}) => {
  const animationsEnabled = usePortfolioStore((state) => state.animationsEnabled);
  
  // Fetch GitHub data for this project
  const { data: githubData } = useQuery({
    queryKey: ['github-repo', project.githubUrl],
    queryFn: async (): Promise<GitHubRepoData | null> => {
      if (!project.githubUrl) return null;
      
      try {
        const repoPath = project.githubUrl.replace('https://github.com/', '');
        const response = await axios.get(`https://api.github.com/repos/${repoPath}`);
        return {
          stargazers_count: response.data.stargazers_count,
          updated_at: response.data.updated_at,
          language: response.data.language,
          topics: response.data.topics || []
        };
      } catch (error) {
        console.warn('Failed to fetch GitHub data for', project.title, error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!project.githubUrl
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <motion.div
      variants={animationsEnabled ? cardVariants : undefined}
      initial={animationsEnabled ? 'hidden' : undefined}
      animate={animationsEnabled ? 'visible' : undefined}
        whileHover={animationsEnabled ? 'hover' : undefined}
        exit={animationsEnabled ? 'exit' : undefined}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project);
        }
      }}
      aria-label={`View details for ${project.title}`}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.imageUrl}
          alt={`${project.title} preview`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {project.featured && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}
        {githubData && (
          <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Star className="w-3 h-3" />
            {githubData.stargazers_count}
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <div className="flex gap-2 ml-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${project.title} on GitHub`}
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${project.title} live demo`}
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* GitHub Info */}
        {githubData && (
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {githubData.language && (
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                {githubData.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Updated {formatDate(githubData.updated_at)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FilterableProjectGrid: React.FC<FilterableProjectGridProps> = ({
  className = '',
  showFilters = true,
  maxItems
}) => {
  const {
    projects,
    projectFilters,
    updateProjectFilters,
    clearFilters,
    selectProject,
    getFilteredProjects,
    animationsEnabled
  } = usePortfolioStore();

  const [availableTechnologies, setAvailableTechnologies] = useState<string[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Get all unique technologies from projects
  useEffect(() => {
    if (projects.data) {
      const allTechs = projects.data.flatMap(project => project.technologies);
      const uniqueTechs = Array.from(new Set(allTechs)).sort();
      setAvailableTechnologies(uniqueTechs);
    }
  }, [projects.data]);

  const filteredProjects = useMemo(() => {
    const filtered = getFilteredProjects();
    return maxItems ? filtered.slice(0, maxItems) : filtered;
  }, [getFilteredProjects, maxItems]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProjectFilters({ searchQuery: e.target.value });
  };

  const handleTechnologyToggle = (tech: string) => {
    const currentTechs = projectFilters.technologies;
    const newTechs = currentTechs.includes(tech)
      ? currentTechs.filter(t => t !== tech)
      : [...currentTechs, tech];
    
    updateProjectFilters({ technologies: newTechs });
  };

  const handleFeaturedToggle = () => {
    const newFeatured = projectFilters.featured === true ? undefined : true;
    updateProjectFilters({ featured: newFeatured });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  if (projects.loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (projects.error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-600 dark:text-red-400 mb-4">Failed to load projects</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Projects
          {filteredProjects.length > 0 && (
            <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
              ({filteredProjects.length})
            </span>
          )}
        </h2>
        
        {showFilters && (
          <button
            onClick={() => setShowAllFilters(!showAllFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-expanded={showAllFilters}
            aria-controls="project-filters"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        )}
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={projectFilters.searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search projects"
            />
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showAllFilters && (
              <motion.div
                id="project-filters"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {/* Featured Toggle */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projectFilters.featured === true}
                        onChange={handleFeaturedToggle}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Featured projects only
                      </span>
                    </label>
                  </div>

                  {/* Technology Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableTechnologies.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => handleTechnologyToggle(tech)}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            projectFilters.technologies.includes(tech)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                          aria-pressed={projectFilters.technologies.includes(tech)}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(projectFilters.searchQuery || 
                    projectFilters.technologies.length > 0 || 
                    projectFilters.featured !== undefined) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {projects.data?.length === 0 
              ? 'No projects available yet.' 
              : 'No projects match your current filters.'}
          </p>
          {(projectFilters.searchQuery || 
            projectFilters.technologies.length > 0 || 
            projectFilters.featured !== undefined) && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <motion.div
          variants={animationsEnabled ? containerVariants : {}}
          initial={animationsEnabled ? 'hidden' : undefined}
          animate={animationsEnabled ? 'visible' : undefined}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={selectProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default FilterableProjectGrid;