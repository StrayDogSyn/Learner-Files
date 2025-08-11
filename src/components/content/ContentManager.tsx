/**
 * Dynamic Content Management System
 * Handles blog posts, portfolio items, and dynamic content loading
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Filter, 
  Search, 
  Tag,
  TrendingUp,
  BookOpen,
  Code,
  Lightbulb
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';
import GlassInput from '../ui/GlassInput';
import { usePerformanceTracking } from '../../utils/performanceMonitor';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  readTime: number;
  tags: string[];
  category: string;
  featured: boolean;
  views: number;
  likes: number;
  comments: number;
  coverImage: string;
  slug: string;
  gradient: string;
  status: 'draft' | 'published' | 'archived';
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'desktop' | 'ai' | 'game';
  status: 'completed' | 'in-progress' | 'planned';
  featured: boolean;
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  startDate: string;
  endDate?: string;
  client?: string;
  teamSize: number;
  role: string;
  challenges: string[];
  solutions: string[];
  results: string[];
  metrics?: {
    performance?: string;
    users?: string;
    conversion?: string;
  };
}

interface ContentFilters {
  category?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string;
  featured?: boolean;
  search?: string;
}

// Mock data - in real app, this would come from CMS/API
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications with TypeScript',
    excerpt: 'Learn advanced patterns and best practices for creating maintainable React applications using TypeScript.',
    content: 'Full article content would be loaded dynamically...',
    author: {
      name: 'SOLO Developer',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20minimalist%20style&image_size=square',
      bio: 'Full-stack developer passionate about modern web technologies'
    },
    publishedAt: '2024-01-15',
    readTime: 8,
    tags: ['React', 'TypeScript', 'Architecture', 'Best Practices'],
    category: 'Development',
    featured: true,
    views: 2543,
    likes: 156,
    comments: 23,
    coverImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=React%20TypeScript%20code%20architecture%20modern%20blue%20purple&image_size=landscape_16_9',
    slug: 'scalable-react-typescript',
    gradient: 'from-blue-500/20 to-purple-500/20',
    status: 'published'
  },
  {
    id: '2',
    title: 'The Future of AI in Web Development',
    excerpt: 'Exploring how artificial intelligence is transforming the way we build and interact with web applications.',
    content: 'Full article content would be loaded dynamically...',
    author: {
      name: 'SOLO Developer',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20minimalist%20style&image_size=square',
      bio: 'Full-stack developer passionate about modern web technologies'
    },
    publishedAt: '2024-01-10',
    readTime: 12,
    tags: ['AI', 'Machine Learning', 'Web Development', 'Future Tech'],
    category: 'Technology',
    featured: false,
    views: 1876,
    likes: 98,
    comments: 15,
    coverImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20artificial%20intelligence%20web%20development%20futuristic%20cyan%20purple&image_size=landscape_16_9',
    slug: 'ai-future-web-development',
    gradient: 'from-cyan-500/20 to-purple-500/20',
    status: 'published'
  },
  {
    id: '3',
    title: 'Mastering CSS Grid and Flexbox',
    excerpt: 'A comprehensive guide to modern CSS layout techniques with practical examples and use cases.',
    content: 'Full article content would be loaded dynamically...',
    author: {
      name: 'SOLO Developer',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20minimalist%20style&image_size=square',
      bio: 'Full-stack developer passionate about modern web technologies'
    },
    publishedAt: '2024-01-05',
    readTime: 6,
    tags: ['CSS', 'Grid', 'Flexbox', 'Layout', 'Design'],
    category: 'Design',
    featured: false,
    views: 3210,
    likes: 234,
    comments: 45,
    coverImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=CSS%20grid%20flexbox%20layout%20design%20colorful%20geometric&image_size=landscape_16_9',
    slug: 'css-grid-flexbox-mastery',
    gradient: 'from-green-500/20 to-blue-500/20',
    status: 'published'
  }
];

const mockPortfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with React, Node.js, and PostgreSQL',
    longDescription: 'A comprehensive e-commerce platform built with modern technologies, featuring user authentication, product management, shopping cart, payment processing, and admin dashboard.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
    category: 'web',
    status: 'completed',
    featured: true,
    images: [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20ecommerce%20website%20interface%20clean%20design&image_size=landscape_16_9',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=shopping%20cart%20checkout%20interface%20modern%20ui&image_size=landscape_16_9'
    ],
    liveUrl: 'https://example-ecommerce.com',
    githubUrl: 'https://github.com/example/ecommerce',
    startDate: '2023-09-01',
    endDate: '2023-12-15',
    client: 'Tech Startup Inc.',
    teamSize: 4,
    role: 'Full-Stack Developer & Team Lead',
    challenges: [
      'Implementing real-time inventory management',
      'Optimizing database queries for large product catalogs',
      'Ensuring PCI compliance for payment processing'
    ],
    solutions: [
      'Used Redis for caching and real-time updates',
      'Implemented database indexing and query optimization',
      'Integrated Stripe for secure payment processing'
    ],
    results: [
      '40% improvement in page load times',
      '99.9% uptime achieved',
      'Successfully processed $500K+ in transactions'
    ],
    metrics: {
      performance: '2.1s average load time',
      users: '10K+ active users',
      conversion: '3.2% conversion rate'
    }
  },
  {
    id: '2',
    title: 'AI-Powered Analytics Dashboard',
    description: 'Machine learning dashboard for business intelligence and data visualization',
    longDescription: 'An intelligent analytics platform that uses machine learning to provide insights from business data, featuring interactive charts, predictive analytics, and automated reporting.',
    technologies: ['React', 'Python', 'TensorFlow', 'D3.js', 'FastAPI', 'MongoDB'],
    category: 'ai',
    status: 'completed',
    featured: true,
    images: [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=analytics%20dashboard%20charts%20graphs%20data%20visualization&image_size=landscape_16_9',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20AI%20interface%20futuristic%20dashboard&image_size=landscape_16_9'
    ],
    liveUrl: 'https://example-analytics.com',
    githubUrl: 'https://github.com/example/analytics',
    startDate: '2023-06-01',
    endDate: '2023-11-30',
    client: 'Data Corp',
    teamSize: 6,
    role: 'Frontend Lead & ML Integration',
    challenges: [
      'Processing large datasets in real-time',
      'Creating intuitive data visualizations',
      'Integrating ML models with frontend'
    ],
    solutions: [
      'Implemented streaming data processing with Apache Kafka',
      'Used D3.js for custom interactive visualizations',
      'Created RESTful APIs for ML model integration'
    ],
    results: [
      '60% faster data processing',
      '85% user satisfaction rate',
      'Reduced manual reporting by 90%'
    ],
    metrics: {
      performance: '1.5s query response time',
      users: '500+ business analysts',
      conversion: '95% user adoption rate'
    }
  }
];

interface ContentManagerProps {
  type: 'blog' | 'portfolio';
  className?: string;
}

export function ContentManager({ type, className = '' }: ContentManagerProps) {
  const { trackRender, startTiming, endTiming } = usePerformanceTracking('ContentManager');
  const [filters, setFilters] = useState<ContentFilters>({});
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<BlogPost | PortfolioItem | null>(null);
  
  useEffect(() => {
    startTiming('content-load');
    return () => {
      endTiming('content-load');
      trackRender();
    };
  }, []);
  
  const data = type === 'blog' ? mockBlogPosts : mockPortfolioItems;
  
  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        ('excerpt' in item ? item.excerpt.toLowerCase().includes(searchTerm) : 
         item.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    
    // Apply featured filter
    if (filters.featured !== undefined) {
      filtered = filtered.filter(item => item.featured === filters.featured);
    }
    
    // Apply tag filter for blog posts
    if (filters.tags && filters.tags.length > 0 && type === 'blog') {
      filtered = filtered.filter(item => 
        'tags' in item && filters.tags!.some(tag => item.tags.includes(tag))
      );
    }
    
    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          const dateA = 'publishedAt' in a ? new Date(a.publishedAt) : new Date(a.startDate);
          const dateB = 'publishedAt' in b ? new Date(b.publishedAt) : new Date(b.startDate);
          return dateB.getTime() - dateA.getTime();
        case 'views':
          return ('views' in b ? b.views : 0) - ('views' in a ? a.views : 0);
        case 'likes':
          return ('likes' in b ? b.likes : 0) - ('likes' in a ? a.likes : 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [data, filters, sortBy, type]);
  
  const categories = useMemo(() => {
    const cats = [...new Set(data.map(item => item.category))];
    return cats;
  }, [data]);
  
  const allTags = useMemo(() => {
    if (type !== 'blog') return [];
    const tags = new Set<string>();
    (data as BlogPost[]).forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [data, type]);
  
  const handleFilterChange = (key: keyof ContentFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({});
  };
  
  const renderBlogCard = (post: BlogPost) => (
    <motion.div
      key={post.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className="cursor-pointer"
      onClick={() => setSelectedItem(post)}
    >
      <GlassCard className={`h-full overflow-hidden bg-gradient-to-br ${post.gradient}`}>
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block px-2 py-1 bg-white/20 rounded text-xs text-white/90">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-block px-2 py-1 bg-yellow-500/20 rounded text-xs text-yellow-300">
                Featured
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-white/70 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-white/60">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
  
  const renderPortfolioCard = (item: PortfolioItem) => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className="cursor-pointer"
      onClick={() => setSelectedItem(item)}
    >
      <GlassCard className="h-full overflow-hidden">
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={item.images[0]} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block px-2 py-1 bg-white/20 rounded text-xs text-white/90 capitalize">
              {item.category}
            </span>
            <span className={`inline-block px-2 py-1 rounded text-xs ${
              item.status === 'completed' ? 'bg-green-500/20 text-green-300' :
              item.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-blue-500/20 text-blue-300'
            }`}>
              {item.status.replace('-', ' ')}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            {item.title}
          </h3>
          
          <p className="text-white/70 text-sm mb-4 line-clamp-3">
            {item.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {item.technologies.slice(0, 4).map(tech => (
              <span key={tech} className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                {tech}
              </span>
            ))}
            {item.technologies.length > 4 && (
              <span className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                +{item.technologies.length - 4}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>{item.role}</span>
            {item.featured && (
              <span className="inline-block px-2 py-1 bg-yellow-500/20 rounded text-xs text-yellow-300">
                Featured
              </span>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
  
  return (
    <div className={`min-h-screen ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          {type === 'blog' ? 'Blog Posts' : 'Portfolio'}
        </h1>
        <p className="text-white/70 text-lg">
          {type === 'blog' 
            ? 'Insights, tutorials, and thoughts on web development'
            : 'Showcase of projects and technical achievements'
          }
        </p>
      </div>
      
      {/* Filters and Controls */}
      <GlassCard className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <GlassInput
            placeholder="Search..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            icon={Search}
          />
          
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="" className="bg-gray-800">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-gray-800 capitalize">
                {cat}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'likes')}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="date" className="bg-gray-800">Sort by Date</option>
            {type === 'blog' && (
              <>
                <option value="views" className="bg-gray-800">Sort by Views</option>
                <option value="likes" className="bg-gray-800">Sort by Likes</option>
              </>
            )}
          </select>
          
          <div className="flex items-center space-x-2">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              Clear Filters
            </GlassButton>
          </div>
        </div>
        
        {type === 'blog' && allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-white/60 text-sm">Tags:</span>
            {allTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => {
                  const currentTags = filters.tags || [];
                  const newTags = currentTags.includes(tag)
                    ? currentTags.filter(t => t !== tag)
                    : [...currentTags, tag];
                  handleFilterChange('tags', newTags.length > 0 ? newTags : undefined);
                }}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  filters.tags?.includes(tag)
                    ? 'bg-blue-500/30 text-blue-300'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </GlassCard>
      
      {/* Content Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredData.map(item => 
            type === 'blog' 
              ? renderBlogCard(item as BlogPost)
              : renderPortfolioCard(item as PortfolioItem)
          )}
        </AnimatePresence>
      </motion.div>
      
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-white/40 mb-4">
            <BookOpen className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-white/60 mb-2">
            No {type === 'blog' ? 'posts' : 'projects'} found
          </h3>
          <p className="text-white/40">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}

export default ContentManager;