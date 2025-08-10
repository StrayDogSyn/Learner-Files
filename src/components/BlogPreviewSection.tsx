import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Tag,
  ArrowRight,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Eye,
  ChevronRight,
  Rss,
  Search,
  Filter,
  Star
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
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
}

interface BlogCategory {
  id: string;
  name: string;
  count: number;
  color: string;
}

// Mock blog data - In a real implementation, this would come from GitHub Pages API or a CMS
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable AI Applications with Modern Architecture',
    excerpt: 'Explore the latest patterns and best practices for developing AI-powered applications that can scale to millions of users while maintaining performance and reliability.',
    content: 'Full article content would be loaded from GitHub Pages...',
    author: {
      name: 'SOLO Developer',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20minimalist%20style&image_size=square'
    },
    publishedAt: '2024-01-15',
    readTime: 8,
    tags: ['AI', 'Architecture', 'Scalability', 'Performance'],
    category: 'AI & Machine Learning',
    featured: true,
    views: 2847,
    likes: 156,
    comments: 23,
    coverImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20AI%20architecture%20diagram%20futuristic%20blue%20purple%20gradient&image_size=landscape_16_9',
    slug: 'building-scalable-ai-applications',
    gradient: 'from-blue-500/20 to-purple-500/20'
  },
  {
    id: '2',
    title: 'The Future of Web Development: React Server Components',
    excerpt: 'Dive deep into React Server Components and how they\'re revolutionizing the way we build modern web applications with better performance and user experience.',
    content: 'Full article content would be loaded from GitHub Pages...',
    author: {
      name: 'SOLO Developer',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20minimalist%20style&image_size=square'
    },
    publishedAt: '2024-01-10',
    readTime: 12,
    tags: ['React', 'Server Components', 'Performance', 'Web Development'],
    category: 'Frontend Development',
    featured: true,
    views: 3521,
    likes: 234,
    comments: 45,
    coverImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=React%20server%20components%20architecture%20modern%20web%20development%20blue%20cyan&image_size=landscape_16_9',
    slug: 'react-server-components-future',
    gradient: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    id: '3',
    title: 'Optimizing Database Performance: Advanced PostgreSQL Techniques',
    excerpt: 'Learn advanced PostgreSQL optimization techniques that can dramatically improve your application\'s database performance and reduce query execution times.',
    content: 'Full article content would be loaded from GitHub Pages...',
    author: {
      name: 'SOLO Developer',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20minimalist%20style&image_size=square'
    },
    publishedAt: '2024-01-05',
    readTime: 15,
    tags: ['PostgreSQL', 'Database', 'Performance', 'Optimization'],
    category: 'Backend Development',
    featured: false,
    views: 1923,
    likes: 89,
    comments: 17,
    coverImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=database%20optimization%20PostgreSQL%20performance%20charts%20green%20blue&image_size=landscape_16_9',
    slug: 'postgresql-performance-optimization',
    gradient: 'from-green-500/20 to-teal-500/20'
  },
  {
    id: '4',
    title: 'Cloud-Native Development with Kubernetes and Docker',
    excerpt: 'Master the art of cloud-native development using Kubernetes and Docker to build, deploy, and scale applications in modern cloud environments.',
    content: 'Full article content would be loaded from GitHub Pages...',
    author: {
      name: 'SOLO Developer',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20minimalist%20style&image_size=square'
    },
    publishedAt: '2023-12-28',
    readTime: 10,
    tags: ['Kubernetes', 'Docker', 'Cloud', 'DevOps'],
    category: 'DevOps & Cloud',
    featured: false,
    views: 2156,
    likes: 127,
    comments: 31,
    coverImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cloud%20native%20kubernetes%20docker%20containers%20orange%20blue%20tech&image_size=landscape_16_9',
    slug: 'cloud-native-kubernetes-docker',
    gradient: 'from-orange-500/20 to-red-500/20'
  },
  {
    id: '5',
    title: 'TypeScript Best Practices for Large-Scale Applications',
    excerpt: 'Discover essential TypeScript patterns and practices that will help you build maintainable, type-safe applications at enterprise scale.',
    content: 'Full article content would be loaded from GitHub Pages...',
    author: {
      name: 'SOLO Developer',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20minimalist%20style&image_size=square'
    },
    publishedAt: '2023-12-20',
    readTime: 7,
    tags: ['TypeScript', 'Best Practices', 'Enterprise', 'Code Quality'],
    category: 'Programming',
    featured: false,
    views: 1654,
    likes: 98,
    comments: 12,
    coverImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=TypeScript%20code%20quality%20enterprise%20development%20blue%20purple&image_size=landscape_16_9',
    slug: 'typescript-best-practices',
    gradient: 'from-indigo-500/20 to-purple-500/20'
  },
  {
    id: '6',
    title: 'Building Real-Time Applications with WebSockets and Socket.IO',
    excerpt: 'Learn how to create engaging real-time applications using WebSockets and Socket.IO for instant communication and live updates.',
    content: 'Full article content would be loaded from GitHub Pages...',
    author: {
      name: 'SOLO Developer',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20minimalist%20style&image_size=square'
    },
    publishedAt: '2023-12-15',
    readTime: 9,
    tags: ['WebSockets', 'Real-time', 'Socket.IO', 'Communication'],
    category: 'Web Development',
    featured: false,
    views: 1432,
    likes: 76,
    comments: 19,
    coverImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=real%20time%20websockets%20communication%20network%20green%20cyan&image_size=landscape_16_9',
    slug: 'websockets-realtime-applications',
    gradient: 'from-emerald-500/20 to-cyan-500/20'
  }
];

const categories: BlogCategory[] = [
  { id: 'all', name: 'All Posts', count: blogPosts.length, color: 'text-white' },
  { id: 'ai', name: 'AI & ML', count: 1, color: 'text-purple-400' },
  { id: 'frontend', name: 'Frontend', count: 1, color: 'text-blue-400' },
  { id: 'backend', name: 'Backend', count: 1, color: 'text-green-400' },
  { id: 'devops', name: 'DevOps', count: 1, color: 'text-orange-400' },
  { id: 'programming', name: 'Programming', count: 2, color: 'text-indigo-400' }
];

const BlogCard: React.FC<{ post: BlogPost; index: number; featured?: boolean }> = ({ 
  post, 
  index, 
  featured = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative ${
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        h-full rounded-2xl backdrop-blur-xl border border-white/10
        bg-gradient-to-br ${post.gradient}
        shadow-lg hover:shadow-2xl transition-all duration-500
        hover:border-white/20 hover:-translate-y-1 overflow-hidden
        ${featured ? 'min-h-[400px]' : 'min-h-[350px]'}
      `}>
        {/* Cover Image */}
        <div className={`relative overflow-hidden ${
          featured ? 'h-48' : 'h-40'
        }`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-yellow-500/90 text-black text-xs font-semibold backdrop-blur-sm">
                Featured
              </span>
            </div>
          )}
          
          {/* Category */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
              {post.category}
            </span>
          </div>
          
          {/* Stats Overlay */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-4 text-white/80">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{formatNumber(post.views)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{formatNumber(post.likes)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.comments}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Info */}
          <div className="flex items-center justify-between mb-4 text-sm text-white/60">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{post.author.name}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-white mb-3 line-clamp-2 group-hover:text-white/90 transition-colors ${
            featured ? 'text-xl' : 'text-lg'
          }`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className={`text-white/70 mb-4 leading-relaxed ${
            featured ? 'line-clamp-3' : 'line-clamp-2'
          }`}>
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, featured ? 4 : 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-md text-xs bg-white/10 text-white/70 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Read More Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              w-full py-3 px-4 rounded-xl font-medium
              bg-white/10 hover:bg-white/20 text-white
              border border-white/20 hover:border-white/30
              backdrop-blur-sm transition-all duration-300
              flex items-center justify-center group/btn
            "
          >
            Read Article
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Hover Effects */}
        <motion.div
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-6 right-6 opacity-20"
        >
          <BookOpen className="w-6 h-6 text-white" />
        </motion.div>

        {/* Glow Effect */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          bg-gradient-to-br ${post.gradient}
          blur-xl transition-opacity duration-500 -z-10
        `} />
      </div>
    </motion.article>
  );
};

const CategoryFilter: React.FC<{ 
  categories: BlogCategory[]; 
  activeCategory: string; 
  onCategoryChange: (category: string) => void; 
}> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.id)}
          className={`
            px-4 py-2 rounded-xl font-medium transition-all duration-300
            backdrop-blur-sm border
            ${
              activeCategory === category.id
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15 hover:text-white'
            }
          `}
        >
          {category.name}
          <span className="ml-2 text-xs opacity-70">({category.count})</span>
        </motion.button>
      ))}
    </div>
  );
};

const BlogPreviewSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || 
      post.category.toLowerCase().includes(activeCategory) ||
      post.tags.some(tag => tag.toLowerCase().includes(activeCategory));
    
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <section ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
          >
            <BookOpen className="w-4 h-4 mr-2 text-indigo-400" />
            <span className="text-white/80 text-sm font-medium">Latest Insights</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Blog &amp; Technical
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Articles
            </span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Explore in-depth articles about modern web development, AI integration, 
            and cutting-edge technologies. Stay updated with the latest trends and best practices.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative mb-6 max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full pl-12 pr-4 py-3 rounded-xl
                bg-white/10 backdrop-blur-sm border border-white/20
                text-white placeholder-white/60
                focus:outline-none focus:border-white/40 focus:bg-white/15
                transition-all duration-300
              "
            />
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Star className="w-6 h-6 mr-3 text-yellow-400" />
              Featured Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} featured />
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-blue-400" />
              Recent Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/70 mb-2">No articles found</h3>
            <p className="text-white/50">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to Stay Updated?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Subscribe to get notified about new articles and insights on modern web development, 
              AI integration, and technology trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  inline-flex items-center px-8 py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-indigo-500 to-purple-500
                  text-white shadow-lg hover:shadow-xl
                  transition-all duration-300
                "
              >
                <Rss className="w-4 h-4 mr-2" />
                Subscribe to Blog
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  inline-flex items-center px-8 py-3 rounded-xl font-semibold
                  bg-white/10 hover:bg-white/20 text-white
                  border border-white/20 hover:border-white/30
                  backdrop-blur-sm transition-all duration-300
                "
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View All Articles
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;