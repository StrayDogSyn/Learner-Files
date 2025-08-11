// Shared API Client Library
// Unified API layer for all platforms with consistent error handling and caching

import { 
  APIResponse, 
  APIError, 
  QueryParams, 
  RequestOptions,
  User,
  Portfolio,
  Project,
  ContactMessage,
  AnalyticsEvent,
  AnalyticsMetrics,
  LoginCredentials,
  RegisterData,
  PasswordResetRequest,
  PasswordResetConfirm
} from '../types';

// Base API Configuration
export interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  apiKey?: string;
  version: string;
  platform: 'web' | 'mobile' | 'desktop' | 'cli';
  userAgent?: string;
  enableCache: boolean;
  cacheTimeout: number;
  enableOffline: boolean;
  enableRetry: boolean;
  enableLogging: boolean;
}

// Default API Configuration
const DEFAULT_CONFIG: APIConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  retries: 3,
  version: 'v1',
  platform: 'web',
  enableCache: true,
  cacheTimeout: 300000, // 5 minutes
  enableOffline: true,
  enableRetry: true,
  enableLogging: process.env.NODE_ENV === 'development'
};

// Cache Interface
interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

// Request Queue for Offline Support
interface QueuedRequest {
  id: string;
  url: string;
  options: RequestInit;
  timestamp: number;
  retries: number;
}

// API Client Class
export class APIClient {
  private config: APIConfig;
  private cache: Map<string, CacheEntry> = new Map();
  private requestQueue: QueuedRequest[] = [];
  private isOnline: boolean = true;
  private authToken?: string;
  private refreshToken?: string;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: Partial<APIConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.setupNetworkListener();
    this.setupRequestInterceptors();
  }

  // Network Status Management
  private setupNetworkListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.processRequestQueue();
        this.emit('network:online');
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.emit('network:offline');
      });

      this.isOnline = navigator.onLine;
    }
  }

  // Request Interceptors
  private setupRequestInterceptors(): void {
    // Add default headers and auth token
  }

  // Event System
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Authentication
  setAuthToken(token: string, refreshToken?: string): void {
    this.authToken = token;
    this.refreshToken = refreshToken;
  }

  clearAuthToken(): void {
    this.authToken = undefined;
    this.refreshToken = undefined;
  }

  // Cache Management
  private getCacheKey(url: string, params?: QueryParams): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}:${paramString}`;
  }

  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() < entry.expiresAt) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    if (!this.config.enableCache) return;
    
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.config.cacheTimeout
    };
    this.cache.set(key, entry);
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Request Queue Management
  private addToQueue(url: string, options: RequestInit): void {
    if (!this.config.enableOffline) return;

    const request: QueuedRequest = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      options,
      timestamp: Date.now(),
      retries: 0
    };
    this.requestQueue.push(request);
  }

  private async processRequestQueue(): Promise<void> {
    if (!this.isOnline || this.requestQueue.length === 0) return;

    const requests = [...this.requestQueue];
    this.requestQueue = [];

    for (const request of requests) {
      try {
        await this.makeRequest(request.url, request.options);
        this.emit('queue:success', request);
      } catch (error) {
        if (request.retries < this.config.retries) {
          request.retries++;
          this.requestQueue.push(request);
        } else {
          this.emit('queue:failed', { request, error });
        }
      }
    }
  }

  // Core Request Method
  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {},
    useCache: boolean = true
  ): Promise<APIResponse<T>> {
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseURL}/${url.replace(/^\//,'')}`;
    
    // Check cache first
    if (useCache && options.method === 'GET') {
      const cacheKey = this.getCacheKey(fullUrl);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cache