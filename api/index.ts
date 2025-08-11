// Unified API Layer
// Express.js server with GraphQL and REST endpoints for all platforms

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Import shared types
import {
  User,
  Portfolio,
  Project,
  ContactMessage,
  AnalyticsEvent,
  AnalyticsMetrics,
  APIResponse,
  APIError,
  AuthSession,
  LoginCredentials,
  RegisterData
} from '../shared/types';

// Import route handlers
import authRoutes from './routes/auth';
import portfolioRoutes from './routes/portfolios';
import projectRoutes from './routes/projects';
import contactRoutes from './routes/contacts';
import analyticsRoutes from './routes/analytics';
import fileRoutes from './routes/files';
import userRoutes from './routes/users';

// Import GraphQL schema and resolvers
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

// Environment configuration
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Create Express app
const app = express();
const httpServer = createServer(app);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Version', 'X-Platform']
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const platform = req.headers['x-platform'] || 'unknown';
  const version = req.headers['x-api-version'] || 'v1';
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Platform: ${platform}, Version: ${version}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Authentication middleware
export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Access token is required'
      }
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Invalid or expired token'
        }
      });
    }
    
    (req as any).user = user;
    next();
  });
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (!err) {
        (req as any).user = user;
      }
    });
  }
  
  next();
};

// Error handling middleware
const errorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  
  const apiError: APIError = {
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred',
    details: NODE_ENV === 'development' ? err.stack : undefined
  };
  
  const response: APIResponse = {
    success: false,
    error: apiError,
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] as string || Math.random().toString(36).substr(2, 9)
  };
  
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json(response);
};

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Allow images, documents, and archives
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, documents, and archives are allowed.'));
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const response: APIResponse<{ status: string; timestamp: string; uptime: number; memory: any }> = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    },
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substr(2, 9)
  };
  
  res.json(response);
});

// API version endpoint
app.get('/version', (req, res) => {
  const response: APIResponse<{ version: string; build: string; node: string }> = {
    success: true,
    data: {
      version: process.env.npm_package_version || '1.0.0',
      build: process.env.BUILD_NUMBER || 'development',
      node: process.version
    },
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substr(2, 9)
  };
  
  res.json(response);
});

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/files', fileRoutes);

// Search endpoint
app.get('/api/search', optionalAuth, async (req, res, next) => {
  try {
    const { q: query, type, limit = 10, offset = 0 } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_QUERY',
          message: 'Search query is required'
        }
      });
    }
    
    // Mock search implementation
    // In a real application, this would search across portfolios, projects, etc.
    const results: any[] = [];
    
    const response: APIResponse<any[]> = {
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9),
      pagination: {
        page: Math.floor(Number(offset) / Number(limit)) + 1,
        pageSize: Number(limit),
        total: results.length,
        totalPages: Math.ceil(results.length / Number(limit)),
        hasNext: Number(offset) + Number(limit) < results.length,
        hasPrev: Number(offset) > 0
      }
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GraphQL Schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// WebSocket server for GraphQL subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
});

const serverCleanup = useServer(
  {
    schema,
    context: async (ctx) => {
      // Extract auth token from connection params
      const token = ctx.connectionParams?.authorization?.replace('Bearer ', '');
      let user = null;
      
      if (token) {
        try {
          user = jwt.verify(token, JWT_SECRET);
        } catch (err) {
          console.warn('Invalid WebSocket auth token:', err);
        }
      }
      
      return { user };
    }
  },
  wsServer
);

// Apollo Server setup
const apolloServer = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          }
        };
      }
    }
  ],
  formatError: (err) => {
    console.error('GraphQL Error:', err);
    return {
      message: err.message,
      code: err.extensions?.code || 'INTERNAL_ERROR',
      path: err.path,
      locations: err.locations
    };
  }
});

// GraphQL context function
const createGraphQLContext = async ({ req }: { req: express.Request }) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user = null;
  
  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.warn('Invalid GraphQL auth token:', err);
    }
  }
  
  return {
    user,
    req
  };
};

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`
    },
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substr(2, 9)
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Server startup
const startServer = async () => {
  try {
    // Start Apollo Server
    await apolloServer.start();
    
    // Apply GraphQL middleware
    app.use(
      '/graphql',
      cors<cors.CorsRequest>({
        origin: CORS_ORIGIN.split(','),
        credentials: true
      }),
      express.json(),
      expressMiddleware(apolloServer, {
        context: createGraphQLContext
      })
    );
    
    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
      console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}/graphql`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 API docs: http://localhost:${PORT}/api/docs`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Export for testing
export { app, httpServer, apolloServer };

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}

/**
 * Unified API Layer
 * 
 * Provides a comprehensive backend API with:
 * - RESTful endpoints for all portfolio operations
 * - GraphQL API with real-time subscriptions
 * - Authentication and authorization
 * - File upload capabilities
 * - Rate limiting and security
 * - Error handling and logging
 * - Health monitoring
 * - Cross-platform support
 * - WebSocket support for real-time features
 * 
 * Features:
 * - JWT-based authentication
 * - Role-based access control
 * - Request/response logging
 * - CORS configuration
 * - Security headers
 * - File upload with validation
 * - Search functionality
 * - Pagination support
 * - Error standardization
 * - Graceful shutdown
 * 
 * Endpoints:
 * - GET /health - Health check
 * - GET /version - API version info
 * - POST /api/auth/* - Authentication
 * - GET|POST|PUT|DELETE /api/portfolios/* - Portfolio management
 * - GET|POST|PUT|DELETE /api/projects/* - Project management
 * - GET|POST /api/contacts/* - Contact messages
 * - GET|POST /api/analytics/* - Analytics tracking
 * - POST /api/files/* - File uploads
 * - GET /api/search - Search functionality
 * - POST /graphql - GraphQL endpoint
 * - WS /graphql - GraphQL subscriptions
 */