'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, SortAsc, SortDesc, Calendar, Star, TrendingUp } from 'lucide-react';
import { ProjectFilter, FilterState } from './ProjectFilter';
import { ProjectCard } from '../molecules/ProjectCard';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { projects } from '../../data/projects';

type SortOption = 'date' | 'name' | 'performance' | 'users' | 'stars';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export const ProjectShowcase: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    technology: 'all',
    complexity: 'all',
    featured: false
  });
  
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    const filtered = projects.filter(project => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.longDescription.toLowerCase().includes(searchTerm) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== 'all') {
        if (filters.category === 'featured') {
          if (!project.featured) return false;
        } else if (project.category !== filters.category) {
          return false;
        }
      }

      // Technology filter
      if (filters.technology !== 'all') {
        if (!project.technologies.includes(filters.technology)) return false;
      }

      // Complexity filter
      if (filters.complexity !== 'all') {
        if (project.complexity !== filters.complexity) return false;
      }

      // Featured filter
      if (filters.featured && !project.featured) return false;

      return true;
    });

    // Sort projects
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.dateCompleted).getTime();
          bValue = new Date(b.dateCompleted).getTime();
          break;
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'performance':
          aValue = a.metrics.performance || 0;
          bValue = b.metrics.performance || 0;
          break;
        case 'users':
          aValue = a.metrics.users || 0;
          bValue = b.metrics.users || 0;
          break;
        case 'stars':
          aValue = a.metrics.stars || 0;
          bValue = b.metrics.stars || 0;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [filters, sortBy, sortDirection]);

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) return null;
    return sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Typography variant="h1" className="text-white mb-4">
            Project Showcase
          </Typography>
          <Typography variant="body" className="text-gray-300 max-w-2xl mx-auto">
            Explore my portfolio of innovative projects, from interactive games to professional web applications.
            Each project demonstrates cutting-edge technologies and creative problem-solving.
          </Typography>
        </motion.div>

        {/* Filter Component */}
        <ProjectFilter
          filters={filters}
          onFiltersChange={setFilters}
          resultsCount={filteredAndSortedProjects.length}
        />

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
        >
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 mr-2">Sort by:</span>
            <Button
              variant={sortBy === 'date' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleSortChange('date')}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Date
              {getSortIcon('date')}
            </Button>
            <Button
              variant={sortBy === 'performance' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleSortChange('performance')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Performance
              {getSortIcon('performance')}
            </Button>
            <Button
              variant={sortBy === 'stars' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleSortChange('stars')}
              className="flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Stars
              {getSortIcon('stars')}
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2"
            >
              <Grid className="w-4 h-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              List
            </Button>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        <AnimatePresence mode="wait">
          {filteredAndSortedProjects.length > 0 ? (
            <motion.div
              key={`${viewMode}-${filteredAndSortedProjects.length}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`grid gap-8 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}
            >
              {filteredAndSortedProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <Typography variant="h3" className="text-white mb-4">
                  No Projects Found
                </Typography>
                <Typography variant="body" className="text-gray-400 mb-6">
                  Try adjusting your filters or search terms to find more projects.
                </Typography>
                <Button
                  variant="primary"
                  onClick={() => setFilters({
                    search: '',
                    category: 'all',
                    technology: 'all',
                    complexity: 'all',
                    featured: false
                  })}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Clear All Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics */}
        {filteredAndSortedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {filteredAndSortedProjects.length}
              </div>
              <div className="text-gray-300">Projects Shown</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {Math.round(
                  filteredAndSortedProjects.reduce((acc, p) => acc + (p.metrics.performance || 0), 0) /
                  filteredAndSortedProjects.filter(p => p.metrics.performance).length
                ) || 0}%
              </div>
              <div className="text-gray-300">Avg Performance</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {filteredAndSortedProjects.reduce((acc, p) => acc + (p.metrics.users || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-300">Total Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {filteredAndSortedProjects.reduce((acc, p) => acc + (p.metrics.stars || 0), 0)}
              </div>
              <div className="text-gray-300">GitHub Stars</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};