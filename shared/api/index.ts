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
        return cached;
      }
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Version': this.config.version,
      'X-Platform': this.config.platform,
      ...options.headers as Record<string, string>
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    if (this.config.userAgent) {
      headers['User-Agent'] = this.config.userAgent;
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: options.signal || AbortSignal.timeout(this.config.timeout)
    };

    // Handle offline mode
    if (!this.isOnline && this.config.enableOffline) {
      if (options.method !== 'GET') {
        this.addToQueue(fullUrl, requestOptions);
        throw new Error('Request queued for when online');
      }
      throw new Error('No internet connection');
    }

    try {
      this.emit('request:start', { url: fullUrl, options: requestOptions });
      
      const response = await fetch(fullUrl, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const apiError: APIError = {
          code: errorData.code || response.status.toString(),
          message: errorData.message || response.statusText,
          details: errorData.details
        };
        throw apiError;
      }

      const data: APIResponse<T> = await response.json();
      
      // Cache successful GET requests
      if (useCache && options.method === 'GET') {
        const cacheKey = this.getCacheKey(fullUrl);
        this.setCache(cacheKey, data);
      }

      this.emit('request:success', { url: fullUrl, data });
      return data;

    } catch (error) {
      this.emit('request:error', { url: fullUrl, error });
      
      if (this.config.enableLogging) {
        console.error('API Request failed:', { url: fullUrl, error });
      }
      
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(url: string, params?: QueryParams, options?: RequestOptions): Promise<APIResponse<T>> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    const fullUrl = `${url}${queryString}`;
    
    return this.makeRequest<T>(fullUrl, {
      method: 'GET',
      signal: options?.signal
    }, options?.cache !== false);
  }

  async post<T>(url: string, data?: any, options?: RequestOptions): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      signal: options?.signal
    }, false);
  }

  async put<T>(url: string, data?: any, options?: RequestOptions): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      signal: options?.signal
    }, false);
  }

  async patch<T>(url: string, data?: any, options?: RequestOptions): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      signal: options?.signal
    }, false);
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'DELETE',
      signal: options?.signal
    }, false);
  }

  // File Upload
  async upload<T>(url: string, file: File | FormData, options?: RequestOptions): Promise<APIResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    return this.makeRequest<T>(url, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
      signal: options?.signal
    }, false);
  }
}

// API Endpoints
export class PortfolioAPI {
  constructor(private client: APIClient) {}

  // Authentication
  async login(credentials: LoginCredentials): Promise<APIResponse<{ user: User; token: string; refreshToken: string }>> {
    return this.client.post('/auth/login', credentials);
  }

  async register(data: RegisterData): Promise<APIResponse<{ user: User; token: string; refreshToken: string }>> {
    return this.client.post('/auth/register', data);
  }

  async logout(): Promise<APIResponse<void>> {
    return this.client.post('/auth/logout');
  }

  async refreshToken(): Promise<APIResponse<{ token: string; refreshToken: string }>> {
    return this.client.post('/auth/refresh');
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<APIResponse<void>> {
    return this.client.post('/auth/password-reset', data);
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<APIResponse<void>> {
    return this.client.post('/auth/password-reset/confirm', data);
  }

  // User Management
  async getCurrentUser(): Promise<APIResponse<User>> {
    return this.client.get('/user/me');
  }

  async updateUser(data: Partial<User>): Promise<APIResponse<User>> {
    return this.client.patch('/user/me', data);
  }

  async uploadAvatar(file: File): Promise<APIResponse<{ url: string }>> {
    return this.client.upload('/user/avatar', file);
  }

  // Portfolio Management
  async getPortfolios(params?: QueryParams): Promise<APIResponse<Portfolio[]>> {
    return this.client.get('/portfolios', params);
  }

  async getPortfolio(id: string): Promise<APIResponse<Portfolio>> {
    return this.client.get(`/portfolios/${id}`);
  }

  async getPortfolioBySlug(slug: string): Promise<APIResponse<Portfolio>> {
    return this.client.get(`/portfolios/slug/${slug}`);
  }

  async createPortfolio(data: Partial<Portfolio>): Promise<APIResponse<Portfolio>> {
    return this.client.post('/portfolios', data);
  }

  async updatePortfolio(id: string, data: Partial<Portfolio>): Promise<APIResponse<Portfolio>> {
    return this.client.patch(`/portfolios/${id}`, data);
  }

  async deletePortfolio(id: string): Promise<APIResponse<void>> {
    return this.client.delete(`/portfolios/${id}`);
  }

  async publishPortfolio(id: string): Promise<APIResponse<Portfolio>> {
    return this.client.post(`/portfolios/${id}/publish`);
  }

  async unpublishPortfolio(id: string): Promise<APIResponse<Portfolio>> {
    return this.client.post(`/portfolios/${id}/unpublish`);
  }

  // Project Management
  async getProjects(portfolioId: string, params?: QueryParams): Promise<APIResponse<Project[]>> {
    return this.client.get(`/portfolios/${portfolioId}/projects`, params);
  }

  async getProject(portfolioId: string, projectId: string): Promise<APIResponse<Project>> {
    return this.client.get(`/portfolios/${portfolioId}/projects/${projectId}`);
  }

  async createProject(portfolioId: string, data: Partial<Project>): Promise<APIResponse<Project>> {
    return this.client.post(`/portfolios/${portfolioId}/projects`, data);
  }

  async updateProject(portfolioId: string, projectId: string, data: Partial<Project>): Promise<APIResponse<Project>> {
    return this.client.patch(`/portfolios/${portfolioId}/projects/${projectId}`, data);
  }

  async deleteProject(portfolioId: string, projectId: string): Promise<APIResponse<void>> {
    return this.client.delete(`/portfolios/${portfolioId}/projects/${projectId}`);
  }

  async uploadProjectImage(portfolioId: string, projectId: string, file: File): Promise<APIResponse<{ url: string }>> {
    return this.client.upload(`/portfolios/${portfolioId}/projects/${projectId}/images`, file);
  }

  // Contact Management
  async getContactMessages(portfolioId: string, params?: QueryParams): Promise<APIResponse<ContactMessage[]>> {
    return this.client.get(`/portfolios/${portfolioId}/contacts`, params);
  }

  async getContactMessage(portfolioId: string, messageId: string): Promise<APIResponse<ContactMessage>> {
    return this.client.get(`/portfolios/${portfolioId}/contacts/${messageId}`);
  }

  async createContactMessage(portfolioId: string, data: Partial<ContactMessage>): Promise<APIResponse<ContactMessage>> {
    return this.client.post(`/portfolios/${portfolioId}/contacts`, data);
  }

  async updateContactMessage(portfolioId: string, messageId: string, data: Partial<ContactMessage>): Promise<APIResponse<ContactMessage>> {
    return this.client.patch(`/portfolios/${portfolioId}/contacts/${messageId}`, data);
  }

  async deleteContactMessage(portfolioId: string, messageId: string): Promise<APIResponse<void>> {
    return this.client.delete(`/portfolios/${portfolioId}/contacts/${messageId}`);
  }

  // Analytics
  async getAnalytics(portfolioId: string, params?: { startDate?: string; endDate?: string }): Promise<APIResponse<AnalyticsMetrics>> {
    return this.client.get(`/portfolios/${portfolioId}/analytics`, params);
  }

  async trackEvent(portfolioId: string, event: Partial<AnalyticsEvent>): Promise<APIResponse<void>> {
    return this.client.post(`/portfolios/${portfolioId}/analytics/events`, event);
  }

  async getAnalyticsEvents(portfolioId: string, params?: QueryParams): Promise<APIResponse<AnalyticsEvent[]>> {
    return this.client.get(`/portfolios/${portfolioId}/analytics/events`, params);
  }

  // File Management
  async uploadFile(file: File, folder?: string): Promise<APIResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }
    return this.client.upload('/files/upload', formData);
  }

  async deleteFile(filename: string): Promise<APIResponse<void>> {
    return this.client.delete(`/files/${filename}`);
  }

  // Search
  async search(query: string, type?: string): Promise<APIResponse<any[]>> {
    return this.client.get('/search', { q: query, type });
  }

  // Health Check
  async healthCheck(): Promise<APIResponse<{ status: string; timestamp: string }>> {
    return this.client.get('/health');
  }
}

// Create default API client instance
export const createAPIClient = (config?: Partial<APIConfig>): APIClient => {
  return new APIClient(config);
};

// Create default portfolio API instance
export const createPortfolioAPI = (config?: Partial<APIConfig>): PortfolioAPI => {
  const client = createAPIClient(config);
  return new PortfolioAPI(client);
};

// Default instances
export const apiClient = createAPIClient();
export const portfolioAPI = createPortfolioAPI();

// Error handling utilities
export const isAPIError = (error: any): error is APIError => {
  return error && typeof error.code === 'string' && typeof error.message === 'string';
};

export const handleAPIError = (error: any): string => {
  if (isAPIError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Response utilities
export const isSuccessResponse = <T>(response: APIResponse<T>): response is APIResponse<T> & { success: true; data: T } => {
  return response.success === true && response.data !== undefined;
};

export const extractData = <T>(response: APIResponse<T>): T => {
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error(response.error?.message || 'API request failed');
};

/**
 * Shared API Client Library
 * 
 * Provides a unified API layer for all platforms with:
 * - Consistent error handling and response formatting
 * - Automatic retry logic and request queuing
 * - Offline support with request queuing
 * - Response caching for performance
 * - Authentication token management
 * - File upload capabilities
 * - Event system for monitoring requests
 * - Platform-specific configurations
 * 
 * Usage:
 * ```typescript
 * import { portfolioAPI, createAPIClient } from '@shared/api';
 * 
 * // Use default instance
 * const portfolios = await portfolioAPI.getPortfolios();
 * 
 * // Create custom instance
 * const customAPI = createAPIClient({
 *   baseURL: 'https://api.example.com',
 *   platform: 'mobile'
 * });
 * ```
 */