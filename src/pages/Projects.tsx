import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Star, TrendingUp } from 'lucide-react';
import ProjectGrid from '@/components/ProjectGrid';
import RelatedProjects from '@/components/navigation/RelatedProjects';
import { TestimonialGrid, TestimonialStats } from '@/components/portfolio/UserTestimonial';
import { projects } from '@/data/projects';
import { getFeaturedTestimonials, getTestimonialStats } from '@/data/testimonials';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Projects() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const { trackInteraction } = useAnalytics();
  
  const featuredTestimonials = getFeaturedTestimonials(3);
  const testimonialStats = getTestimonialStats();
  
  // Get unique categories from projects
  const categories = ['all', ...new Set(projects.flatMap(p => p.technologies || []))];
  
  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                             project.technologies?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'stars':
          return (b.stars || 0) - (a.stars || 0);
        case 'recent':
           return new Date(b.lastUpdate || 0).getTime() - new Date(a.lastUpdate || 0).getTime();
        default:
          return 0;
      }
    });

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading projects...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              My Projects
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Explore my latest work and creative solutions. Each project showcases different technologies 
              and problem-solving approaches.
            </p>
            
            {/* Enhanced Stats with Testimonials */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glassmorphic-card p-4 text-center"
              >
                <div className="text-3xl font-bold text-hunter-green">{projects.length}</div>
                <div className="text-charcoal opacity-70 text-sm">Total Projects</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glassmorphic-card p-4 text-center"
              >
                <div className="text-3xl font-bold text-hunter-green">
                  {projects.filter(p => p.featured).length}
                </div>
                <div className="text-charcoal opacity-70 text-sm">Featured</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glassmorphic-card p-4 text-center"
              >
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-3xl font-bold text-hunter-green">
                    {testimonialStats.averageRating}
                  </span>
                </div>
                <div className="text-charcoal opacity-70 text-sm">User Rating</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="glassmorphic-card p-4 text-center"
              >
                <div className="text-3xl font-bold text-hunter-green">
                  {testimonialStats.totalReviews}
                </div>
                <div className="text-charcoal opacity-70 text-sm">Reviews</div>
              </motion.div>
            </div>
            
            {/* Search and Filter Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col md:flex-row gap-4 items-center justify-center pt-8 max-w-4xl mx-auto"
            >
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <label htmlFor="project-search" className="sr-only">Search projects</label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal opacity-60 w-4 h-4" />
                <input
                  id="project-search"
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    trackInteraction('search', 'projects_search', { query: e.target.value });
                  }}
                  aria-label="Search projects by name or technology"
                  className="glassmorphic-card w-full pl-10 pr-4 py-3 text-charcoal placeholder-charcoal/60 focus:outline-none focus:ring-2 focus:ring-hunter-green focus:ring-opacity-50"
                />
              </div>
              
              {/* Category Filter */}
              <div className="relative">
                <label htmlFor="category-filter" className="sr-only">Filter by category</label>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal opacity-60 w-4 h-4" />
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    trackInteraction('filter', 'category_filter', { category: e.target.value });
                  }}
                  aria-label="Filter projects by category"
                  title="Select project category"
                  className="glassmorphic-card pl-10 pr-8 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-hunter-green focus:ring-opacity-50 appearance-none"
                >
                  {categories.slice(0, 8).map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort */}
              <div className="relative">
                <label htmlFor="sort-projects" className="sr-only">Sort projects</label>
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal opacity-60 w-4 h-4" />
                <select
                  id="sort-projects"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    trackInteraction('sort', 'projects_sort', { sortBy: e.target.value });
                  }}
                  aria-label="Sort projects by criteria"
                  title="Select sorting criteria"
                  className="glassmorphic-card pl-10 pr-8 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-hunter-green focus:ring-opacity-50 appearance-none"
                >
                  <option value="featured">Featured First</option>
                  <option value="stars">Most Popular</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ProjectGrid projects={filteredProjects} />
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-charcoal opacity-60 text-lg">
                  No projects found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    trackInteraction('button', 'clear_filters');
                  }}
                  className="mt-4 px-6 py-2 glassmorphic-card text-hunter-green hover:bg-hunter-green hover:text-white transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* User Testimonials Section */}
      <section className="py-12 bg-gradient-to-r from-hunter-green/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4 font-orbitron">
              What Users Say
            </h2>
            <p className="text-charcoal opacity-70 max-w-2xl mx-auto">
              Real feedback from users who have experienced these projects firsthand.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-1">
              <TestimonialStats 
                totalReviews={testimonialStats.totalReviews}
                averageRating={testimonialStats.averageRating}
              />
            </div>
            <div className="lg:col-span-3">
              <TestimonialGrid 
                testimonials={featuredTestimonials}
                variant="compact"
                showProject={true}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Projects Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <RelatedProjects 
              technologies={selectedCategory !== 'all' ? [selectedCategory] : []}
              maxSuggestions={4}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
