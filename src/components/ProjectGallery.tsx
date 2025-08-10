import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, GitFork, Calendar, ExternalLink, Github } from 'lucide-react';
import { projects, Project } from '../data/projects';
import { useProjectsWithStats, ProjectWithStats } from '../hooks/useGitHubStats';

type CategoryFilter = 'All' | 'AI' | 'Web' | 'Tools';
type SortOption = 'name' | 'stars' | 'updated' | 'featured';

interface ProjectGalleryProps {
  onProjectClick?: (project: ProjectWithStats) => void;
  showFeaturedOnly?: boolean;
  maxProjects?: number;
  className?: string;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  onProjectClick,
  showFeaturedOnly = false,
  maxProjects,
  className
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showFilters, setShowFilters] = useState(false);

  const { projectsWithStats, isLoading } = useProjectsWithStats(projects);

  const categories: CategoryFilter[] = ['All', 'AI', 'Web', 'Tools'];

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projectsWithStats;

    // Apply featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(project => project.featured);
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query)) ||
        (project.githubStats?.topics || []).some(topic => topic.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'stars':
          const aStars = a.githubStats?.stars || a.stars || 0;
          const bStars = b.githubStats?.stars || b.stars || 0;
          return bStars - aStars;
        case 'updated':
          const aDateStr = a.githubStats?.lastUpdate || a.lastUpdate || '2020-01-01';
          const bDateStr = b.githubStats?.lastUpdate || b.lastUpdate || '2020-01-01';
          const aDate = new Date(aDateStr);
          const bDate = new Date(bDateStr);
          return bDate.getTime() - aDate.getTime();
        case 'featured':
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
      }
    });

    // Apply max projects limit
    if (maxProjects) {
      filtered = filtered.slice(0, maxProjects);
    }

    return filtered;
  }, [projectsWithStats, selectedCategory, searchQuery, sortBy, showFeaturedOnly, maxProjects]);

  const getCategoryCount = (category: CategoryFilter) => {
    if (category === 'All') return projectsWithStats.length;
    return projectsWithStats.filter(p => p.category === category).length;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className={`w-full ${className || ''}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Project Showcase
            </h2>
            <p className="text-gray-300">
              Explore my latest projects across AI, Web Development, and Tools
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Search and Filters */}
        <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects, technologies, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const count = getCategoryCount(category);
                const isActive = selectedCategory === category;
                
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/30'
                    } backdrop-blur-md`}
                  >
                    {category}
                    <span className="ml-2 text-xs opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
            >
              <option value="featured" className="bg-gray-800">Featured First</option>
              <option value="name" className="bg-gray-800">Name A-Z</option>
              <option value="stars" className="bg-gray-800">Most Stars</option>
              <option value="updated" className="bg-gray-800">Recently Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 h-80">
                <div className="bg-white/20 rounded-lg h-40 mb-4"></div>
                <div className="bg-white/20 rounded h-4 mb-2"></div>
                <div className="bg-white/20 rounded h-3 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="bg-white/20 rounded h-6 w-16"></div>
                  <div className="bg-white/20 rounded h-6 w-20"></div>
                </div>
                <div className="flex justify-between">
                  <div className="bg-white/20 rounded h-4 w-12"></div>
                  <div className="bg-white/20 rounded h-4 w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && (
        <>
          {filteredAndSortedProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                <p className="text-gray-400">
                  Try adjusting your search criteria or category filter
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectClick?.(project)}
                  formatNumber={formatNumber}
                />
              ))}
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-8 text-center text-gray-400">
            Showing {filteredAndSortedProjects.length} of {projectsWithStats.length} projects
            {searchQuery && (
              <span className="ml-2">
                for &quot;{searchQuery}&quot;
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Project Card Component
interface ProjectCardProps {
  project: ProjectWithStats;
  onClick: () => void;
  formatNumber: (num: number) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, formatNumber }) => {
  const stats = project.githubStats;
  const displayStars = stats?.stars ?? project.stars;
  const displayForks = stats?.forks ?? project.forks;
  const displayLanguage = stats?.language ?? project.language;
  const displayLastUpdate = stats?.lastUpdate ?? project.lastUpdate;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20"
    >
      {/* Project Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 h-40 bg-gradient-to-br from-emerald-500/20 to-blue-500/20">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {project.featured && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
          {project.category}
        </div>
      </div>

      {/* Project Info */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300">
          {project.title}
        </h3>
        
        <p className="text-gray-300 text-sm line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded border border-white/20"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-white/10 text-xs text-gray-400 rounded border border-white/20">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            {displayStars !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{formatNumber(displayStars)}</span>
              </div>
            )}
            {displayForks !== undefined && (
              <div className="flex items-center gap-1">
                <GitFork className="w-4 h-4" />
                <span>{formatNumber(displayForks)}</span>
              </div>
            )}
          </div>
          
          {displayLanguage && (
            <span className="text-emerald-400">{displayLanguage}</span>
          )}
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>Updated {displayLastUpdate}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors duration-300 text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-3 py-1 bg-white/10 text-gray-300 rounded border border-white/20 hover:bg-white/20 transition-colors duration-300 text-xs"
            >
              <Github className="w-3 h-3" />
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectGallery;