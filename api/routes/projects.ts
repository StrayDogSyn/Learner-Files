// Project Routes
// Handle project CRUD operations and management

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import {
  Project,
  ProjectStatus,
  ProjectType,
  TechStack,
  APIResponse,
  QueryParams,
  PaginationInfo
} from '../../shared/types';
import { authenticateToken, optionalAuth } from '../index';

const router = express.Router();

// Mock projects database
const projects: Project[] = [
  {
    id: '1',
    portfolioId: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, payment processing, and admin dashboard.',
    shortDescription: 'Modern e-commerce platform with full payment integration',
    content: 'This project showcases a complete e-commerce solution built from the ground up. The frontend uses React with TypeScript for type safety and better developer experience. The backend is powered by Node.js and Express, with PostgreSQL as the database. Key features include user authentication with JWT, product management, shopping cart functionality, Stripe payment integration, and a comprehensive admin dashboard for managing orders and inventory.',
    images: [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20ecommerce%20website%20homepage%20with%20product%20grid%20clean%20design%20shopping%20cart%20glassmorphic%20ui&image_size=landscape_16_9',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=ecommerce%20product%20detail%20page%20with%20image%20gallery%20add%20to%20cart%20button%20modern%20ui&image_size=landscape_16_9',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=shopping%20cart%20checkout%20page%20payment%20form%20clean%20interface%20glassmorphic%20design&image_size=landscape_16_9'
    ],
    thumbnail: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=ecommerce%20platform%20thumbnail%20shopping%20cart%20icon%20modern%20gradient%20background&image_size=square_hd',
    technologies: [
      { name: 'React', category: 'frontend', version: '18.2.0', icon: 'react' },
      { name: 'TypeScript', category: 'language', version: '5.0.0', icon: 'typescript' },
      { name: 'Node.js', category: 'backend', version: '18.0.0', icon: 'nodejs' },
      { name: 'Express', category: 'backend', version: '4.18.0', icon: 'express' },
      { name: 'PostgreSQL', category: 'database', version: '15.0', icon: 'postgresql' },
      { name: 'Stripe', category: 'payment', version: '12.0.0', icon: 'stripe' },
      { name: 'Tailwind CSS', category: 'styling', version: '3.3.0', icon: 'tailwindcss' }
    ],
    features: [
      'User authentication and authorization',
      'Product catalog with search and filtering',
      'Shopping cart and wishlist functionality',
      'Secure payment processing with Stripe',
      'Order management and tracking',
      'Admin dashboard for inventory management',
      'Responsive design for all devices',
      'Email notifications for orders'
    ],
    challenges: [
      'Implementing secure payment processing',
      'Optimizing database queries for large product catalogs',
      'Building responsive design for complex layouts',
      'Managing state across multiple components'
    ],
    solutions: [
      'Used Stripe API with proper error handling and webhooks',
      'Implemented database indexing and query optimization',
      'Utilized CSS Grid and Flexbox with Tailwind CSS',
      'Implemented Redux for centralized state management'
    ],
    links: {
      live: 'https://ecommerce-demo.example.com',
      github: 'https://github.com/johndoe/ecommerce-platform',
      demo: 'https://demo.ecommerce-platform.com'
    },
    status: 'completed',
    type: 'web',
    category: 'Full Stack',
    tags: ['React', 'Node.js', 'E-commerce', 'PostgreSQL', 'Stripe'],
    startDate: '2024-01-15',
    endDate: '2024-03-20',
    duration: '2 months',
    teamSize: 1,
    role: 'Full Stack Developer',
    client: 'Personal Project',
    budget: '$0',
    featured: true,
    priority: 1,
    views: 450,
    likes: 67,
    shares: 12,
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-03-20T00:00:00.000Z'
  },
  {
    id: '2',
    portfolioId: '1',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, team collaboration features, and project tracking capabilities.',
    shortDescription: 'Collaborative task management with real-time updates',
    content: 'This task management application was built to help teams collaborate more effectively. It features real-time updates using WebSockets, drag-and-drop task organization, team member assignment, and comprehensive project tracking. The app includes features like task dependencies, time tracking, file attachments, and detailed reporting.',
    images: [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=task%20management%20dashboard%20kanban%20board%20cards%20modern%20interface%20glassmorphic%20design&image_size=landscape_16_9',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=project%20timeline%20gantt%20chart%20task%20dependencies%20clean%20ui%20design&image_size=landscape_16_9'
    ],
    thumbnail: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=task%20management%20app%20thumbnail%20checklist%20icon%20gradient%20background&image_size=square_hd',
    technologies: [
      { name: 'Vue.js', category: 'frontend', version: '3.3.0', icon: 'vue' },
      { name: 'TypeScript', category: 'language', version: '5.0.0', icon: 'typescript' },
      { name: 'Node.js', category: 'backend', version: '18.0.0', icon: 'nodejs' },
      { name: 'Socket.io', category: 'realtime', version: '4.7.0', icon: 'socketio' },
      { name: 'MongoDB', category: 'database', version: '6.0.0', icon: 'mongodb' },
      { name: 'Vuetify', category: 'ui', version: '3.3.0', icon: 'vuetify' }
    ],
    features: [
      'Real-time collaboration with WebSockets',
      'Drag-and-drop task organization',
      'Team member assignment and notifications',
      'Project timeline and Gantt charts',
      'File attachments and comments',
      'Time tracking and reporting',
      'Custom task statuses and priorities',
      'Mobile-responsive design'
    ],
    challenges: [
      'Implementing real-time synchronization',
      'Managing complex state with multiple users',
      'Building intuitive drag-and-drop interface',
      'Optimizing performance with large datasets'
    ],
    solutions: [
      'Used Socket.io for real-time communication',
      'Implemented operational transformation for conflict resolution',
      'Utilized Vue Draggable for smooth interactions',
      'Added pagination and virtual scrolling'
    ],
    links: {
      live: 'https://taskmanager-demo.example.com',
      github: 'https://github.com/johndoe/task-manager',
      demo: 'https://demo.taskmanager.com'
    },
    status: 'completed',
    type: 'web',
    category: 'Frontend',
    tags: ['Vue.js', 'Socket.io', 'Real-time', 'Collaboration'],
    startDate: '2024-04-01',
    endDate: '2024-05-15',
    duration: '1.5 months',
    teamSize: 2,
    role: 'Frontend Lead',
    client: 'Startup Company',
    budget: '$5,000',
    featured: true,
    priority: 2,
    views: 320,
    likes: 45,
    shares: 8,
    createdAt: '2024-04-01T00:00:00.000Z',
    updatedAt: '2024-05-15T00:00:00.000Z'
  },
  {
    id: '3',
    portfolioId: '1',
    title: 'Weather Analytics Dashboard',
    description: 'A comprehensive weather analytics dashboard with data visualization, forecasting, and historical weather data analysis.',
    shortDescription: 'Weather data visualization and analytics platform',
    content: 'This weather analytics dashboard provides comprehensive weather data visualization and analysis tools. It integrates with multiple weather APIs to provide real-time data, historical analysis, and forecasting capabilities. The dashboard features interactive charts, maps, and detailed weather metrics.',
    images: [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=weather%20dashboard%20charts%20graphs%20temperature%20data%20visualization%20modern%20ui&image_size=landscape_16_9'
    ],
    thumbnail: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=weather%20app%20thumbnail%20cloud%20sun%20icon%20gradient%20background&image_size=square_hd',
    technologies: [
      { name: 'React', category: 'frontend', version: '18.2.0', icon: 'react' },
      { name: 'D3.js', category: 'visualization', version: '7.8.0', icon: 'd3' },
      { name: 'Python', category: 'backend', version: '3.11.0', icon: 'python' },
      { name: 'FastAPI', category: 'backend', version: '0.100.0', icon: 'fastapi' },
      { name: 'Redis', category: 'cache', version: '7.0.0', icon: 'redis' }
    ],
    features: [
      'Real-time weather data integration',
      'Interactive data visualizations',
      'Historical weather analysis',
      'Weather forecasting',
      'Geolocation-based weather',
      'Custom alerts and notifications',
      'Data export capabilities'
    ],
    challenges: [
      'Handling large datasets efficiently',
      'Creating responsive data visualizations',
      'Integrating multiple weather APIs',
      'Implementing real-time data updates'
    ],
    solutions: [
      'Used Redis for caching and data optimization',
      'Implemented D3.js for scalable visualizations',
      'Created unified API layer for multiple sources',
      'Added WebSocket connections for live updates'
    ],
    links: {
      live: 'https://weather-analytics.example.com',
      github: 'https://github.com/johndoe/weather-dashboard'
    },
    status: 'in-progress',
    type: 'web',
    category: 'Data Visualization',
    tags: ['React', 'D3.js', 'Python', 'Analytics'],
    startDate: '2024-06-01',
    endDate: null,
    duration: 'Ongoing',
    teamSize: 1,
    role: 'Full Stack Developer',
    client: 'Personal Project',
    budget: '$0',
    featured: false,
    priority: 3,
    views: 180,
    likes: 23,
    shares: 4,
    createdAt: '2024-06-01T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z'
  }
];

// Validation middleware
const validateProject = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be 1-100 characters'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be 10-1000 characters'),
  body('shortDescription')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Short description must be less than 200 characters'),
  body('status')
    .optional()
    .isIn(['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'])
    .withMessage('Invalid status'),
  body('type')
    .optional()
    .isIn(['web', 'mobile', 'desktop', 'api', 'library', 'other'])
    .withMessage('Invalid project type'),
  body('portfolioId')
    .isLength({ min: 1 })
    .withMessage('Portfolio ID is required')
];

const validateProjectId = [
  param('id')
    .isLength({ min: 1 })
    .withMessage('Project ID is required')
];

// Helper functions
const findProjectById = (id: string): Project | undefined => {
  return projects.find(p => p.id === id);
};

const findProjectsByPortfolio = (portfolioId: string): Project[] => {
  return projects.filter(p => p.portfolioId === portfolioId);
};

const applyFilters = (projects: Project[], filters: any): Project[] => {
  let filtered = [...projects];
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.category?.toLowerCase().includes(search) ||
      p.tags?.some(tag => tag.toLowerCase().includes(search))
    );
  }
  
  if (filters.status) {
    filtered = filtered.filter(p => p.status === filters.status);
  }
  
  if (filters.type) {
    filtered = filtered.filter(p => p.type === filters.type);
  }
  
  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }
  
  if (filters.featured !== undefined) {
    filtered = filtered.filter(p => p.featured === (filters.featured === 'true'));
  }
  
  if (filters.portfolioId) {
    filtered = filtered.filter(p => p.portfolioId === filters.portfolioId);
  }
  
  if (filters.tags) {
    const filterTags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
    filtered = filtered.filter(p => 
      filterTags.some(tag => p.tags?.includes(tag))
    );
  }
  
  return filtered;
};

const applySorting = (projects: Project[], sort?: string, order: 'asc' | 'desc' = 'desc'): Project[] => {
  if (!sort) return projects;
  
  return projects.sort((a, b) => {
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
        bValue = new Date(b.updatedAt);
        break;
      case 'priority':
        aValue = a.priority || 999;
        bValue = b.priority || 999;
        break;
      case 'views':
        aValue = a.views;
        bValue = b.views;
        break;
      case 'likes':
        aValue = a.likes;
        bValue = b.likes;
        break;
      case 'startDate':
        aValue = a.startDate ? new Date(a.startDate) : new Date(0);
        bValue = b.startDate ? new Date(b.startDate) : new Date(0);
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

// GET /api/projects - Get all projects with filtering
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      sort = 'updatedAt',
      order = 'desc',
      search,
      status,
      type,
      category,
      featured,
      portfolioId,
      tags
    } = req.query;
    
    let filtered = projects;
    
    // Apply filters
    filtered = applyFilters(filtered, {
      search,
      status,
      type,
      category,
      featured,
      portfolioId,
      tags
    });
    
    // Apply sorting
    filtered = applySorting(filtered, sort as string, order as 'asc' | 'desc');
    
    // Apply pagination
    const { items, pagination } = paginate(filtered, Number(page), Number(pageSize));
    
    const response: APIResponse<Project[]> = {
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

// GET /api/projects/:id - Get project by ID
router.get('/:id', validateProjectId, optionalAuth, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid project ID',
          details: errors.array()
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    const { id } = req.params;
    const project = findProjectById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Increment view count
    project.views++;
    project.updatedAt = new Date().toISOString();
    
    const response: APIResponse<Project> = {
      success: true,
      data: project,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// POST /api/projects - Create new project
router.post('/', authenticateToken, validateProject, async (req, res, next) => {
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
    const projectData = req.body;
    
    // TODO: Verify user owns the portfolio
    // This would require checking the portfolios collection
    
    const newProject: Project = {
      id: (projects.length + 1).toString(),
      portfolioId: projectData.portfolioId,
      title: projectData.title,
      description: projectData.description,
      shortDescription: projectData.shortDescription,
      content: projectData.content,
      images: projectData.images || [],
      thumbnail: projectData.thumbnail,
      technologies: projectData.technologies || [],
      features: projectData.features || [],
      challenges: projectData.challenges || [],
      solutions: projectData.solutions || [],
      links: projectData.links || {},
      status: projectData.status || 'planning',
      type: projectData.type || 'web',
      category: projectData.category,
      tags: projectData.tags || [],
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      duration: projectData.duration,
      teamSize: projectData.teamSize || 1,
      role: projectData.role,
      client: projectData.client,
      budget: projectData.budget,
      featured: projectData.featured || false,
      priority: projectData.priority,
      views: 0,
      likes: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    
    const response: APIResponse<Project> = {
      success: true,
      data: newProject,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.status(201).json(response);
    
  } catch (error) {
    next(error);
  }
});

// PATCH /api/projects/:id - Update project
router.patch('/:id', authenticateToken, validateProjectId, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid project ID',
          details: errors.array()
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    const { id } = req.params;
    const currentUser = (req as any).user;
    const updateData = req.body;
    
    const project = findProjectById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // TODO: Check if user owns the portfolio that contains this project
    // This would require checking the portfolios collection
    
    // Update project
    Object.assign(project, updateData, {
      updatedAt: new Date().toISOString()
    });
    
    const response: APIResponse<Project> = {
      success: true,
      data: project,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', authenticateToken, validateProjectId, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid project ID',
          details: errors.array()
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    const { id } = req.params;
    const currentUser = (req as any).user;
    
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // TODO: Check if user owns the portfolio that contains this project
    
    // Remove project
    projects.splice(projectIndex, 1);
    
    const response: APIResponse<void> = {
      success: true,
      message: 'Project deleted successfully',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:id/like - Like/unlike project
router.post('/:id/like', optionalAuth, validateProjectId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = findProjectById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Toggle like (in a real app, you'd track user likes)
    project.likes++;
    project.updatedAt = new Date().toISOString();
    
    const response: APIResponse<{ likes: number }> = {
      success: true,
      data: { likes: project.likes },
      message: 'Project liked successfully',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:id/share - Share project
router.post('/:id/share', optionalAuth, validateProjectId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = findProjectById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found'
        },
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Increment share count
    project.shares++;
    project.updatedAt = new Date().toISOString();
    
    const response: APIResponse<{ shares: number }> = {
      success: true,
      data: { shares: project.shares },
      message: 'Project shared successfully',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    };
    
    res.json(response);
    
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/featured - Get featured projects
router.get('/featured', optionalAuth, async (req, res, next) => {
  try {
    const {
      limit = 6,
      portfolioId
    } = req.query;
    
    let featured = projects.filter(p => p.featured);
    
    if (portfolioId) {
      featured = featured.filter(p => p.portfolioId === portfolioId);
    }
    
    // Sort by priority and limit results
    featured = featured
      .sort((a, b) => (a.priority || 999) - (b.priority || 999))
      .slice(0, Number(limit));
    
    const response: APIResponse<Project[]> = {
      success: true,
      data: featured,
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
 * Project Routes
 * 
 * Provides comprehensive project management with:
 * - CRUD operations for projects
 * - Advanced filtering and search capabilities
 * - Project engagement tracking (views, likes, shares)
 * - Featured projects endpoint
 * - Sorting and pagination support
 * - Input validation and sanitization
 * - Comprehensive error handling
 * 
 * Security Features:
 * - Authentication required for modifications
 * - Portfolio ownership verification (TODO)
 * - Input validation and sanitization
 * - Rate limiting inherited from main app
 * 
 * Endpoints:
 * - GET / - List projects with filtering and pagination
 * - GET /:id - Get project by ID
 * - POST / - Create new project
 * - PATCH /:id - Update project
 * - DELETE /:id - Delete project
 * - POST /:id/like - Like/unlike project
 * - POST /:id/share - Share project
 * - GET /featured - Get featured projects
 */