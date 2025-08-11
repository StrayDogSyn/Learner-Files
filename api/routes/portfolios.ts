// Portfolio Routes
// Handle portfolio CRUD operations and management

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import {
  Portfolio,
  Project,
  Skill,
  Experience,
  Education,
  Certification,
  Testimonial,
  ContactInfo,
  SEOSettings,
  AnalyticsSettings,
  PortfolioTheme,
  PortfolioLayout,
  PortfolioSection,
  APIResponse,
  QueryParams,
  PaginationInfo
} from '../../shared/types';
import { authenticateToken, optionalAuth } from '../index';

const router = express.Router();

// Mock portfolio database
const portfolios: Portfolio[] = [
  {
    id: '1',
    userId: '1',
    title: 'John Doe - Full Stack Developer',
    description: 'Passionate full-stack developer with 5+ years of experience building modern web applications.',
    tagline: 'Building the future, one line of code at a time',
    theme: {
      name: 'Glassmorphic Dark',
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      accentColor: '#f59e0b',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '12px',
      shadows: true,
      animations: true,
      glassmorphism: true
    },
    layout: {
      header: {
        type: 'sticky',
        transparent: true,
        showLogo: true,
        showNavigation: true,
        showCTA: true
      },
      navigation: {
        type: 'horizontal',
        position: 'top',
        items: [
          { id: '1', label: 'Home', href: '#home', icon: 'home' },
          { id: '2', label: 'About', href: '#about', icon: 'user' },
          { id: '3', label: 'Projects', href: '#projects', icon: 'briefcase' },
          { id: '4', label: 'Skills', href: '#skills', icon: 'code' },
          { id: '5', label: 'Contact', href: '#contact', icon: 'mail' }
        ]
      },
      hero: {
        type: 'centered',
        showImage: true,
        showCTA: true,
        showSocial: true,
        backgroundType: 'gradient',
        backgroundValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      sections: [
        {
          id: 'hero',
          type: 'hero',
          title: 'Hero',
          visible: true,
          order: 1,
          columns: 1,
          spacing: '0',
          background: 'transparent'
        },
        {
          id: 'about',
          type: 'about',
          title: 'About Me',
          visible: true,
          order: 2,
          columns: 1,
          spacing: '4rem',
          background: 'rgba(255, 255, 255, 0.05)'
        },
        {
          id: 'projects',
          type: 'projects',
          title: 'Featured Projects',
          visible: true,
          order: 3,
          columns: 3,
          spacing: '4rem',
          background: 'transparent'
        },
        {
          id: 'skills',
          type: 'skills',
          title: 'Skills & Technologies',
          visible: true,
          order: 4,
          columns: 4,
          spacing: '4rem',
          background: 'rgba(255, 255, 255, 0.05)'
        },
        {
          id: 'contact',
          type: 'contact',
          title: 'Get In Touch',
          visible: true,
          order: 5,
          columns: 1,
          spacing: '4rem',
          background: 'transparent'
        }
      ],
      footer: {
        showSocial: true,
        showContact: true,
        showCopyright: true,
        showBackToTop: true,
        columns: 3
      }
    },
    sections: [],
    projects: [],
    skills: [],
    experiences: [],
    education: [],
    certifications: [],
    testimonials: [],
    contact: {
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      timezone: 'PST',
      availability: 'Available for freelance work',
      preferredContact: 'email',
      socialLinks: {
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: 'https://twitter.com/johndoe'
      }
    },
    seo: {
      title: 'John Doe - Full Stack Developer Portfolio',
      description: 'Passionate full-stack developer with 5+ years of experience building modern web applications.',
      keywords: ['full-stack developer', 'react', 'node.js', 'javascript', 'portfolio'],
      ogTitle: 'John Doe - Full Stack Developer',
      ogDescription: 'Check out my portfolio showcasing modern web applications and development skills.',
      robots: 'index, follow'
    },
    analytics: {
      enabled: true,
      trackPageViews: true,
      trackEvents: true,
      trackConversions: true
    },
    isPublic: true,
    slug: 'john-doe-developer',
    views: 1250,
    likes: 89,
    shares: 23,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Validation middleware
const validatePortfolio = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be 1-100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('tagline')
    .optional()
    .isLength({ max: 150 })
    .withMessage('Tagline must be less than 150 characters'),
  body('slug')
    .optional()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens')
];

const validatePortfolioId = [
  param('id')
    .isLength({ min: 1 })
    .withMessage('Portfolio ID is required')
];

const validateSlug = [
  param('slug')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Invalid slug format')
];

// Helper functions
const findPortfolioById = (id: string): Portfolio | undefined => {
  return portfolios.find(p => p.id === id);
};

const findPortfolioBySlug = (slug: string): Portfolio | undefined => {
  return portfolios.find(p => p.slug === slug);
};

const findUserPortfolios = (userId: string): Portfolio[] => {
  return portfolios.filter(p => p.userId === userId);
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const applyFilters = (portfolios: Portfolio[], filters: any): Portfolio[] => {
  let filtered = [...portfolios];
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search) ||
      p.tagline?.toLowerCase().includes(search)
    );
  }
  
  if (filters.isPublic !== undefined) {
    filtered = filtered.filter(p => p.isPublic === (filters.isPublic === 'true'));
  }
  
  if (filters.userId) {
    filtered = filtered.filter(p => p.userId === filters.userId);
  }
  
  return filtered;
};

const applySorting = (portfolios: Portfolio[], sort?: string, order: 'asc' | 'desc' = 'desc'): Portfolio[] => {
  if (!sort) return portfolios;
  
  return portfolios.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sort) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = b.updatedAt;
        break;
      case 'views':
        aValue = a.views;
        bValue = b.views;
        break;
      case 'likes':
        aValue = a.likes;
        bValue = b.likes;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

const paginate = (items: any[], page: number, pageSize: number): { items: any[]; pagination: PaginationInfo } => {
  const offset = (page - 1) * pageSize;
  const paginatedItems = items.slice(offset, offset + pageSize);
  
  const pagination: PaginationInfo = {
    page,
    pageSize,
    total: items.length,
    totalPages: Math.ceil(items.length / pageSize),
    hasNext: offset + pageSize < items.length,
    hasPrev: page > 1
  };
  
  return { items: paginatedItems, pagination };
};

// Routes

// GET /api/portfolios - Get all portfolios (public + user's private)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      sort = 'updatedAt',
      order = 'desc',
      search,
      isPublic,
      userId
    } = req.query;
    
    let filtered = portfolios;
    
    // If user is authenticated, show their portfolios + public ones
    // If not authenticated, show only public portfolios
    const currentUser = (req as any).user;
    if (!currentUser) {
      filtered = portfolios.filter(p => p.isPublic);
    } else if (!userId || userId !== currentUser.id) {
      // Show public portfolios + user's own portfolios
      filtered = portfolios.filter(p => p.isPublic || p.userId === currentUser.id);
    }
    
    // Apply filters
    filtered = applyFilters(filtered, { search, isPublic, userId });
    
    // Apply sorting
    filtered = applySorting(filtered, sort as string, order as 'asc' | 'desc');
    
    // Apply pagination
    const { items, pagination } = paginate(filtered, Number(page), Number(pageSize));
    
    const response: APIResponse<Portfolio[]> = {
      success: true,
      data: items,
      pagination,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// GET /api/portfolios/:id - Get portfolio by ID
router.get('/:id', validatePortfolioId, optionalAuth, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid portfolio ID',
          details: errors.array()
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    const { id } = req.params;
    const portfolio = findPortfolioById(id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PORTFOLIO_NOT_FOUND',
          message: 'Portfolio not found'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Check access permissions
    const currentUser = (req as any).user;
    if (!portfolio.isPublic && (!currentUser || portfolio.userId !== currentUser.id)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have permission to view this portfolio'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Increment view count (only for public portfolios or different users)
    if (portfolio.isPublic && (!currentUser || portfolio.userId !== currentUser.id)) {
      portfolio.views++;
      portfolio.updatedAt = new Date().toISOString();
    }
    
    const response: APIResponse<Portfolio> = {
      success: true,
      data: portfolio,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// GET /api/portfolios/slug/:slug - Get portfolio by slug
router.get('/slug/:slug', validateSlug, optionalAuth, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid slug format',
          details: errors.array()
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    const { slug } = req.params;
    const portfolio = findPortfolioBySlug(slug);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PORTFOLIO_NOT_FOUND',
          message: 'Portfolio not found'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Check access permissions
    const currentUser = (req as any).user;
    if (!portfolio.isPublic && (!currentUser || portfolio.userId !== currentUser.id)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have permission to view this portfolio'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Increment view count
    if (portfolio.isPublic && (!currentUser || portfolio.userId !== currentUser.id)) {
      portfolio.views++;
      portfolio.updatedAt = new Date().toISOString();
    }
    
    const response: APIResponse<Portfolio> = {
      success: true,
      data: portfolio,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// POST /api/portfolios - Create new portfolio
router.post('/', authenticateToken, validatePortfolio, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    const currentUser = (req as any).user;
    const portfolioData = req.body;
    
    // Generate slug if not provided
    let slug = portfolioData.slug || generateSlug(portfolioData.title);
    
    // Ensure slug is unique
    let counter = 1;
    const originalSlug = slug;
    while (findPortfolioBySlug(slug)) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }
    
    const newPortfolio: Portfolio = {
      id: (portfolios.length + 1).toString(),
      userId: currentUser.id,
      title: portfolioData.title,
      description: portfolioData.description,
      tagline: portfolioData.tagline,
      theme: portfolioData.theme || {
        name: 'Default',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '8px',
        shadows: true,
        animations: true,
        glassmorphism: false
      },
      layout: portfolioData.layout || {
        header: { type: 'sticky', transparent: false, showLogo: true, showNavigation: true, showCTA: true },
        navigation: { type: 'horizontal', position: 'top', items: [] },
        hero: { type: 'centered', showImage: true, showCTA: true, showSocial: true, backgroundType: 'color', backgroundValue: '#f8fafc' },
        sections: [],
        footer: { showSocial: true, showContact: true, showCopyright: true, showBackToTop: true, columns: 3 }
      },
      sections: portfolioData.sections || [],
      projects: [],
      skills: [],
      experiences: [],
      education: [],
      certifications: [],
      testimonials: [],
      contact: portfolioData.contact || {},
      seo: portfolioData.seo || {},
      analytics: portfolioData.analytics || { enabled: false, trackPageViews: true, trackEvents: true, trackConversions: true },
      isPublic: portfolioData.isPublic !== undefined ? portfolioData.isPublic : false,
      slug,
      views: 0,
      likes: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    portfolios.push(newPortfolio);
    
    const response: APIResponse<Portfolio> = {
      success: true,
      data: newPortfolio,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.status(201).json(response);
    
  } catch (error) {
    next(error);
  }
});

// PATCH /api/portfolios/:id - Update portfolio
router.patch('/:id', authenticateToken, validatePortfolioId, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid portfolio ID',
          details: errors.array()
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    const { id } = req.params;
    const currentUser = (req as any).user;
    const updateData = req.body;
    
    const portfolio = findPortfolioById(id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PORTFOLIO_NOT_FOUND',
          message: 'Portfolio not found'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Check ownership
    if (portfolio.userId !== currentUser.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have permission to update this portfolio'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Update slug if title changed
    if (updateData.title && updateData.title !== portfolio.title) {
      let newSlug = updateData.slug || generateSlug(updateData.title);
      
      // Ensure slug is unique (excluding current portfolio)
      let counter = 1;
      const originalSlug = newSlug;
      while (findPortfolioBySlug(newSlug) && findPortfolioBySlug(newSlug)?.id !== id) {
        newSlug = `${originalSlug}-${counter}`;
        counter++;
      }
      
      updateData.slug = newSlug;
    }
    
    // Update portfolio
    Object.assign(portfolio, updateData, {
      updatedAt: new Date().toISOString()
    });
    
    const response: APIResponse<Portfolio> = {
      success: true,
      data: portfolio,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// DELETE /api/portfolios/:id - Delete portfolio
router.delete('/:id', authenticateToken, validatePortfolioId, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid portfolio ID',
          details: errors.array()
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    const { id } = req.params;
    const currentUser = (req as any).user;
    
    const portfolioIndex = portfolios.findIndex(p => p.id === id);
    
    if (portfolioIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PORTFOLIO_NOT_FOUND',
          message: 'Portfolio not found'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    const portfolio = portfolios[portfolioIndex];
    
    // Check ownership
    if (portfolio.userId !== currentUser.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have permission to delete this portfolio'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Remove portfolio
    portfolios.splice(portfolioIndex, 1);
    
    const response: APIResponse<void> = {
      success: true,
      message: 'Portfolio deleted successfully',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// POST /api/portfolios/:id/publish - Publish portfolio
router.post('/:id/publish', authenticateToken, validatePortfolioId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;
    
    const portfolio = findPortfolioById(id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PORTFOLIO_NOT_FOUND',
          message: 'Portfolio not found'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Check ownership
    if (portfolio.userId !== currentUser.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have permission to publish this portfolio'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    portfolio.isPublic = true;
    portfolio.updatedAt = new Date().toISOString();
    
    const response: APIResponse<Portfolio> = {
      success: true,
      data: portfolio,
      message: 'Portfolio published successfully',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// POST /api/portfolios/:id/unpublish - Unpublish portfolio
router.post('/:id/unpublish', authenticateToken, validatePortfolioId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;
    
    const portfolio = findPortfolioById(id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PORTFOLIO_NOT_FOUND',
          message: 'Portfolio not found'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Check ownership
    if (portfolio.userId !== currentUser.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have permission to unpublish this portfolio'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    portfolio.isPublic = false;
    portfolio.updatedAt = new Date().toISOString();
    
    const response: APIResponse<Portfolio> = {
      success: true,
      data: portfolio,
      message: 'Portfolio unpublished successfully',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

export default router;

/**
 * Portfolio Routes
 * 
 * Provides comprehensive portfolio management with:
 * - CRUD operations for portfolios
 * - Public/private portfolio access control
 * - Slug-based portfolio access
 * - Portfolio publishing/unpublishing
 * - Search and filtering capabilities
 * - Pagination support
 * - View tracking
 * - Input validation and sanitization
 * - Comprehensive error handling
 * 
 * Security Features:
 * - Authentication required for modifications
 * - Ownership verification
 * - Access control for private portfolios
 * - Input validation and sanitization
 * - Rate limiting inherited from main app
 * 
 * Endpoints:
 * - GET / - List portfolios with filtering and pagination
 * - GET /:id - Get portfolio by ID
 * - GET /slug/:slug - Get portfolio by slug
 * - POST / - Create new portfolio
 * - PATCH /:id - Update portfolio
 * - DELETE /:id - Delete portfolio
 * - POST /:id/publish - Publish portfolio
 * - POST /:id/unpublish - Unpublish portfolio
 */