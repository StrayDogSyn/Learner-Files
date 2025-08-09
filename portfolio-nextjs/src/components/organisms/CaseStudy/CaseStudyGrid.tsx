'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Glass } from '@/components/atoms/Glass';
import { CaseStudy, caseStudies, getCaseStudiesByCategory, getCaseStudiesByTechnology } from '@/data/case-studies';
import {
  ExternalLink,
  Github,
  Calendar,
  Users,
  Briefcase,
  Filter,
  Search,
  X,
  ChevronRight,
  Star,
  TrendingUp,
  Eye
} from 'lucide-react';

interface CaseStudyGridProps {
  onSelectCaseStudy?: (caseStudy: CaseStudy) => void;
  showFilters?: boolean;
  maxItems?: number;
}

const CaseStudyCard: React.FC<{
  caseStudy: CaseStudy;
  onSelect?: (caseStudy: CaseStudy) => void;
  delay: number;
}> = ({ caseStudy, onSelect, delay }) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(caseStudy);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <Glass config="card" className="p-6 h-full hover-glow">
        {/* Project Image */}
        <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
          <Image
            src={caseStudy.images[0] || 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20web%20application%20interface%20design%20clean%20professional&image_size=landscape_16_9'}
            alt={caseStudy.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {caseStudy.featured && (
            <div className="absolute top-3 right-3">
              <Glass config="button" className="px-2 py-1">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <Typography variant="caption" className="text-yellow-400 font-medium">
                    Featured
                  </Typography>
                </div>
              </Glass>
            </div>
          )}
          
          {/* View Details Button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="accent" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          {/* Title & Category */}
          <div>
            <Typography variant="h5" className="text-white font-bold mb-1 group-hover:text-blue-300 transition-colors duration-300">
              {caseStudy.title}
            </Typography>
            <Typography variant="bodySmall" className="text-blue-400 font-medium">
              {caseStudy.category}
            </Typography>
          </div>
          
          {/* Description */}
          <Typography variant="bodySmall" className="text-white/70 line-clamp-3">
            {caseStudy.description}
          </Typography>
          
          {/* Project Info */}
          <div className="flex items-center gap-4 text-white/50 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{caseStudy.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{caseStudy.teamSize}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              <span>{caseStudy.role}</span>
            </div>
          </div>
          
          {/* Key Metrics */}
          {Object.entries(caseStudy.metrics).some(([, value]) => value) && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(caseStudy.metrics)
                .filter(([, value]) => value)
                .slice(0, 2)
                .map(([key, value]) => {
                  const labels = {
                    performanceImprovement: 'Performance',
                    userEngagement: 'Engagement',
                    loadTime: 'Load Time',
                    conversionRate: 'Conversion',
                    userSatisfaction: 'Satisfaction'
                  };
                  
                  return (
                    <div key={key} className="flex items-center gap-1 text-xs">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-white/60">
                        {labels[key as keyof typeof labels] || key}: 
                      </span>
                      <span className="text-green-400 font-medium">{value}</span>
                    </div>
                  );
                })
              }
            </div>
          )}
          
          {/* Technologies */}
          <div className="flex flex-wrap gap-1">
            {caseStudy.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-white/10 rounded text-xs text-white/70"
              >
                {tech}
              </span>
            ))}
            {caseStudy.technologies.length > 4 && (
              <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/50">
                +{caseStudy.technologies.length - 4}
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {caseStudy.liveUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(caseStudy.liveUrl, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Live Demo
              </Button>
            )}
            
            {caseStudy.githubUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(caseStudy.githubUrl, '_blank');
                }}
              >
                <Github className="w-4 h-4 mr-1" />
                Code
              </Button>
            )}
          </div>
        </div>
      </Glass>
    </motion.div>
  );
};

const FilterChip: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <Button
    variant={active ? "accent" : "ghost"}
    size="sm"
    onClick={onClick}
    className={`transition-all duration-300 ${
      active ? 'scale-105' : 'hover:scale-105'
    }`}
  >
    {label}
    {active && <X className="w-3 h-3 ml-1" />}
  </Button>
);

export const CaseStudyGrid: React.FC<CaseStudyGridProps> = ({
  onSelectCaseStudy,
  showFilters = true,
  maxItems
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Get unique categories and technologies
  const categories = Array.from(new Set(caseStudies.map(cs => cs.category)));
  const technologies = Array.from(new Set(caseStudies.flatMap(cs => cs.technologies)));
  
  // Filter case studies
  const filteredCaseStudies = useMemo(() => {
    let filtered = caseStudies;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cs => 
        cs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cs.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cs.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Category filter
    if (selectedCategory) {
      filtered = getCaseStudiesByCategory(selectedCategory);
    }
    
    // Technology filter
    if (selectedTechnology) {
      filtered = getCaseStudiesByTechnology(selectedTechnology);
    }
    
    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(cs => cs.featured);
    }
    
    // Apply search to filtered results
    if (searchTerm && (selectedCategory || selectedTechnology)) {
      filtered = filtered.filter(cs => 
        cs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cs.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cs.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Limit results if maxItems is specified
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }
    
    return filtered;
  }, [searchTerm, selectedCategory, selectedTechnology, showFeaturedOnly, maxItems]);
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedTechnology(null);
    setShowFeaturedOnly(false);
  };
  
  const hasActiveFilters = searchTerm || selectedCategory || selectedTechnology || showFeaturedOnly;
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Typography variant="h2" className="text-white font-bold mb-4">
          Project <span className="gradient-text">Case Studies</span>
        </Typography>
        <Typography variant="body" className="text-white/70 max-w-2xl mx-auto">
          Detailed breakdowns of my most impactful projects, showcasing problem-solving approaches,
          technical implementations, and measurable results.
        </Typography>
      </motion.div>
      
      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Glass config="card" className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects, technologies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors duration-300"
              />
            </div>
            
            {/* Filter Categories */}
            <div className="space-y-4">
              {/* Categories */}
              <div>
                <Typography variant="h6" className="text-white font-medium mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Categories
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <FilterChip
                      key={category}
                      label={category}
                      active={selectedCategory === category}
                      onClick={() => setSelectedCategory(
                        selectedCategory === category ? null : category
                      )}
                    />
                  ))}
                </div>
              </div>
              
              {/* Technologies */}
              <div>
                <Typography variant="h6" className="text-white font-medium mb-3">
                  Technologies
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {technologies.slice(0, 12).map((tech) => (
                    <FilterChip
                      key={tech}
                      label={tech}
                      active={selectedTechnology === tech}
                      onClick={() => setSelectedTechnology(
                        selectedTechnology === tech ? null : tech
                      )}
                    />
                  ))}
                </div>
              </div>
              
              {/* Special Filters */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <FilterChip
                    label="Featured Projects"
                    active={showFeaturedOnly}
                    onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  />
                </div>
                
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          </Glass>
        </motion.div>
      )}
      
      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex items-center justify-between"
      >
        <Typography variant="bodySmall" className="text-white/60">
          {filteredCaseStudies.length} project{filteredCaseStudies.length !== 1 ? 's' : ''} found
        </Typography>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-blue-400">
            <Filter className="w-4 h-4" />
            <Typography variant="bodySmall">Filters active</Typography>
          </div>
        )}
      </motion.div>
      
      {/* Case Studies Grid */}
      <AnimatePresence mode="wait">
        {filteredCaseStudies.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCaseStudies.map((caseStudy, index) => (
              <CaseStudyCard
                key={caseStudy.id}
                caseStudy={caseStudy}
                onSelect={onSelectCaseStudy}
                delay={0.6 + index * 0.1}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <Glass config="card" className="p-8 max-w-md mx-auto">
              <Search className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <Typography variant="h5" className="text-white font-medium mb-2">
                No projects found
              </Typography>
              <Typography variant="bodySmall" className="text-white/60 mb-4">
                Try adjusting your search terms or filters to find what you&apos;re looking for.
              </Typography>
              {hasActiveFilters && (
                <Button variant="accent" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Load More Button */}
      {!maxItems && filteredCaseStudies.length >= 6 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Button variant="outline" size="lg">
            Load More Projects
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CaseStudyGrid;