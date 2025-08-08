'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { categories, technologies, complexityLevels } from '../../data/projects';

export interface FilterState {
  search: string;
  category: string;
  technology: string;
  complexity: string;
  featured: boolean;
}

interface ProjectFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultsCount: number;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  filters,
  onFiltersChange,
  resultsCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTechDropdown, setShowTechDropdown] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string | boolean) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: 'all',
      technology: 'all',
      complexity: 'all',
      featured: false
    });
  };

  const hasActiveFilters = filters.search || 
    filters.category !== 'all' || 
    filters.technology !== 'all' || 
    filters.complexity !== 'all' || 
    filters.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search projects by name, technology, or description..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:border-blue-400/50 transition-all duration-300"
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <Filter className="w-4 h-4" />
          Advanced Filters
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`} />
        </Button>
        
        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
          <span className="text-sm text-gray-400">
            {resultsCount} project{resultsCount !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    aria-label="Filter by category"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id} className="bg-gray-800">
                        {category.label} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Technology Filter */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Technology
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowTechDropdown(!showTechDropdown)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-left text-white focus:border-blue-400/50 focus:outline-none transition-all duration-300 flex items-center justify-between"
                    >
                      <span>
                        {filters.technology === 'all' ? 'All Technologies' : filters.technology}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        showTechDropdown ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <AnimatePresence>
                      {showTechDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto"
                        >
                          <button
                            onClick={() => {
                              updateFilter('technology', 'all');
                              setShowTechDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors border-b border-white/10"
                          >
                            All Technologies
                          </button>
                          {technologies.map((tech) => (
                            <button
                              key={tech}
                              onClick={() => {
                                updateFilter('technology', tech);
                                setShowTechDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                            >
                              {tech}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Complexity Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Complexity
                  </label>
                  <select
                    value={filters.complexity}
                    onChange={(e) => updateFilter('complexity', e.target.value)}
                    aria-label="Filter by complexity level"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                  >
                    {complexityLevels.map((level) => (
                      <option key={level.id} value={level.id} className="bg-gray-800">
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Show Only
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => updateFilter('featured', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      filters.featured ? 'bg-blue-500' : 'bg-white/20'
                    }`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        filters.featured ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </div>
                    <span className="ml-3 text-white">Featured Projects</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-wrap gap-2"
        >
          {filters.search && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm text-blue-300">
              Search: &quot;{filters.search}&quot;
              <button
                onClick={() => updateFilter('search', '')}
                className="hover:text-white transition-colors"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm text-purple-300">
              {categories.find(c => c.id === filters.category)?.label}
              <button
                onClick={() => updateFilter('category', 'all')}
                className="hover:text-white transition-colors"
                aria-label="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.technology !== 'all' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-sm text-green-300">
              {filters.technology}
              <button
                onClick={() => updateFilter('technology', 'all')}
                className="hover:text-white transition-colors"
                aria-label="Remove technology filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.complexity !== 'all' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-400/30 rounded-full text-sm text-orange-300">
              {complexityLevels.find(l => l.id === filters.complexity)?.label}
              <button
                onClick={() => updateFilter('complexity', 'all')}
                className="hover:text-white transition-colors"
                aria-label="Remove complexity filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.featured && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-full text-sm text-yellow-300">
              Featured Only
              <button
                onClick={() => updateFilter('featured', false)}
                className="hover:text-white transition-colors"
                aria-label="Remove featured filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};