import {
  APIConfig,
  APIRequest,
  APIResponse,
  APIError,
  RateLimitState,
  CacheEntry,
  CacheConfig,
  RequestInterceptor,
  ResponseInterceptor,
  APIMetrics,
  HealthCheck
} from './types';

/**
 * Base API Client with comprehensive features:
 * - Rate limiting
 * - Retry logic with exponential backoff
 * - Request/Response caching
 * - Request/Response interceptors
 * - Metrics collection
 * - Health monitoring
 * - Error handling
 */
export class BaseAPIClient {
  protected config: APIConfig;
  protected rateLimitState: RateLimitState;
  protected cache: Map<string, CacheEntry>;
  protected cacheConfig: CacheConfig;
  protected requestInterceptors: RequestInterceptor[];
  protected responseInterceptors: ResponseInterceptor[];
  protected metrics: APIMetrics;
  protected abortControllers: Map<string, AbortController>;

  constructor(config: APIConfig, cacheConfig?: Partial<CacheConfig>) {
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      rateLimit: {
        requests: 100,
        window: 60000 // 1 minute
      },
      ...config
    };

    this.cacheConfig = {
      enabled: true,
      defaultTTL: 300000, // 5 minutes
      maxSize: 100,
      strategy: 'lru',
      ...cacheConfig
    };

    this.rateLimitState = {
      requests: [],
      blocked: false
    };

    this.cache = new Map();
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.abortControllers = new Map();

    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        retried: 0
      },
      latency: {
        average: 0,
        p50: 0,
        p95: 0,
        p99: 0
      },
      errors: {
        total: 0,
        byStatus: {},
        byEndpoint: {}
      },
      rateLimit: {
        hits: 0,
        blocks: 0
      },
      cache: {
        hits: 0,
        misses: 0,
        size: 0
      }
    };

    // Cleanup old cache entries periodically
    setInterval(() => this.cleanupCache(), 60000); // Every minute
  }

  /**
   * Make an API request with full feature support
   */
  async request<T = any>(request: APIRequest): Promise<APIResponse<T>> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    let retryCount = 0;
    const maxRetries = request.retries ?? this.config.retries;

    // Apply request interceptors
    let processedRequest = await this.applyRequestInterceptors(request);

    // Check rate limiting
    if (this.isRateLimited(processedRequest.url)) {
      this.metrics.rateLimit.blocks++;
      throw this.createAPIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(processedRequest);
    if (processedRequest.cache !== false && this.cacheConfig.enabled) {
      const cachedResponse = this.getFromCache<T>(cacheKey);
      if (cachedResponse) {
        this.metrics.cache.hits++;
        return {
          ...cachedResponse,
          cached: true,
          timestamp: Date.now()
        };
      }
      this.metrics.cache.misses++;
    }

    // Create abort controller for this request
    const abortController = new AbortController();
    this.abortControllers.set(requestId, abortController);

    // Set timeout
    const timeout = processedRequest.timeout ?? this.config.timeout;
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, timeout);

    try {
      // Retry loop with exponential backoff
      while (retryCount <= maxRetries) {
        try {
          this.metrics.requests.total++;
          this.updateRateLimit(processedRequest.url);

          const response = await this.executeRequest<T>(processedRequest, abortController.signal);
          const endTime = Date.now();
          const latency = endTime - startTime;

          // Update metrics
          this.metrics.requests.successful++;
          this.updateLatencyMetrics(latency);

          // Apply response interceptors
          const processedResponse = await this.applyResponseInterceptors({
            ...response,
            timestamp: endTime,
            retryCount
          });

          // Cache successful responses
          if (processedRequest.cache !== false && this.cacheConfig.enabled && response.status < 400) {
            this.setCache(cacheKey, processedResponse, processedRequest.cacheTTL);
          }

          clearTimeout(timeoutId);
          this.abortControllers.delete(requestId);

          return processedResponse;

        } catch (error) {
          retryCount++;
          this.metrics.requests.failed++;

          const apiError = this.normalizeError(error, retryCount);
          
          // Update error metrics
          this.metrics.errors.total++;
          if (apiError.status) {
            this.metrics.errors.byStatus[apiError.status] = 
              (this.metrics.errors.byStatus[apiError.status] || 0) + 1;
          }
          this.metrics.errors.byEndpoint[processedRequest.url] = 
            (this.metrics.errors.byEndpoint[processedRequest.url] || 0) + 1;

          // Check if we should retry
          if (retryCount <= maxRetries && this.shouldRetry(apiError, retryCount)) {
            this.metrics.requests.retried++;
            const delay = this.calculateRetryDelay(retryCount);
            await this.sleep(delay);
            continue;
          }

          // Apply error interceptors
          const processedError = await this.applyErrorInterceptors(apiError);
          
          clearTimeout(timeoutId);
          this.abortControllers.delete(requestId);
          
          throw processedError;
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);
      throw error;
    }

    throw this.createAPIError('Maximum retries exceeded', 0, 'MAX_RETRIES_EXCEEDED');
  }

  /**
   * Execute the actual HTTP request
   */
  protected async executeRequest<T>(
    request: APIRequest,
    signal: AbortSignal
  ): Promise<APIResponse<T>> {
    const url = new URL(request.url, this.config.baseURL);
    
    // Add query parameters
    if (request.params) {
      Object.entries(request.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...request.headers
    };

    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
      signal
    };

    // Add body for non-GET requests
    if (request.method !== 'GET' && request.data) {
      if (request.data instanceof FormData) {
        fetchOptions.body = request.data;
        delete headers['Content-Type']; // Let browser set it for FormData
      } else {
        fetchOptions.body = JSON.stringify(request.data);
      }
    }

    const response = await fetch(url.toString(), fetchOptions);
    
    let data: T;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text/')) {
      data = await response.text() as unknown as T;
    } else {
      data = await response.blob() as unknown as T;
    }

    if (!response.ok) {
      throw this.createAPIError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        'HTTP_ERROR',
        data
      );
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: this.headersToObject(response.headers),
      config: request,
      timestamp: Date.now()
    };
  }

  /**
   * Rate limiting logic
   */
  protected isRateLimited(endpoint: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.rateLimit.window;
    
    // Clean old requests
    this.rateLimitState.requests = this.rateLimitState.requests.filter(
      req => req.timestamp > windowStart
    );

    // Check if we're over the limit
    const requestsInWindow = this.rateLimitState.requests.length;
    return requestsInWindow >= this.config.rateLimit.requests;
  }

  protected updateRateLimit(endpoint: string): void {
    this.rateLimitState.requests.push({
      timestamp: Date.now(),
      endpoint
    });
    this.metrics.rateLimit.hits++;
  }

  /**
   * Caching logic
   */
  protected generateCacheKey(request: APIRequest): string {
    const keyData = {
      url: request.url,
      method: request.method,
      params: request.params,
      data: request.method === 'GET' ? undefined : request.data
    };
    return btoa(JSON.stringify(keyData));
  }

  protected getFromCache<T>(key: string): APIResponse<T> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  protected setCache<T>(key: string, data: APIResponse<T>, ttl?: number): void {
    if (!this.cacheConfig.enabled) return;

    const cacheTTL = ttl ?? this.cacheConfig.defaultTTL;
    
    // Implement cache size limit
    if (this.cache.size >= this.cacheConfig.maxSize) {
      this.evictCache();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: cacheTTL,
      key
    });

    this.metrics.cache.size = this.cache.size;
  }

  protected evictCache(): void {
    if (this.cacheConfig.strategy === 'lru') {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    } else if (this.cacheConfig.strategy === 'ttl') {
      // Remove expired entries first
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.timestamp + entry.ttl) {
          this.cache.delete(key);
          break;
        }
      }
    }
  }

  protected cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
      }
    }
    this.metrics.cache.size = this.cache.size;
  }

  /**
   * Retry logic
   */
  protected shouldRetry(error: APIError, retryCount: number): boolean {
    // Don't retry client errors (4xx) except for specific cases
    if (error.status && error.status >= 400 && error.status < 500) {
      return error.status === 429 || error.status === 408; // Rate limit or timeout
    }

    // Retry server errors (5xx) and network errors
    return error.status === undefined || error.status >= 500;
  }

  protected calculateRetryDelay(retryCount: number): number {
    // Exponential backoff with jitter
    const baseDelay = this.config.retryDelay;
    const exponentialDelay = baseDelay * Math.pow(2, retryCount - 1);
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
    return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
  }

  /**
   * Interceptors
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  protected async applyRequestInterceptors(request: APIRequest): Promise<APIRequest> {
    let processedRequest = request;
    
    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onRequest) {
        try {
          processedRequest = await interceptor.onRequest(processedRequest);
        } catch (error) {
          if (interceptor.onRequestError) {
            await interceptor.onRequestError(this.normalizeError(error));
          }
          throw error;
        }
      }
    }
    
    return processedRequest;
  }

  protected async applyResponseInterceptors<T>(response: APIResponse<T>): Promise<APIResponse<T>> {
    let processedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onResponse) {
        try {
          processedResponse = await interceptor.onResponse(processedResponse);
        } catch (error) {
          if (interceptor.onResponseError) {
            await interceptor.onResponseError(this.normalizeError(error));
          }
          throw error;
        }
      }
    }
    
    return processedResponse;
  }

  protected async applyErrorInterceptors(error: APIError): Promise<APIError> {
    let processedError = error;
    
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onResponseError) {
        try {
          processedError = await interceptor.onResponseError(processedError);
        } catch (interceptorError) {
          // If interceptor throws, use original error
          break;
        }
      }
    }
    
    return processedError;
  }

  /**
   * Utility methods
   */
  protected normalizeError(error: any, retryCount = 0): APIError {
    if (error.name === 'AbortError') {
      return this.createAPIError('Request timeout', 408, 'TIMEOUT', undefined, retryCount);
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return this.createAPIError('Network error', 0, 'NETWORK_ERROR', undefined, retryCount);
    }

    if (error.status) {
      return {
        message: error.message || 'API Error',
        status: error.status,
        code: error.code,
        details: error.details,
        timestamp: Date.now(),
        retryCount,
        isRetryable: this.shouldRetry(error, retryCount)
      };
    }

    return this.createAPIError(
      error.message || 'Unknown error',
      0,
      'UNKNOWN_ERROR',
      error,
      retryCount
    );
  }

  protected createAPIError(
    message: string,
    status?: number,
    code?: string,
    details?: any,
    retryCount = 0
  ): APIError {
    return {
      message,
      status,
      code,
      details,
      timestamp: Date.now(),
      retryCount,
      isRetryable: status ? this.shouldRetry({ message, status } as APIError, retryCount) : false
    };
  }

  protected headersToObject(headers: Headers): Record<string, string> {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  protected generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected updateLatencyMetrics(latency: number): void {
    // Simple running average for now
    // In production, you'd want a more sophisticated approach
    const total = this.metrics.requests.successful;
    this.metrics.latency.average = 
      ((this.metrics.latency.average * (total - 1)) + latency) / total;
  }

  /**
   * Public utility methods
   */
  cancelRequest(requestId: string): void {
    const controller = this.abortControllers.get(requestId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
    }
  }

  cancelAllRequests(): void {
    for (const [id, controller] of this.abortControllers.entries()) {
      controller.abort();
    }
    this.abortControllers.clear();
  }

  clearCache(): void {
    this.cache.clear();
    this.metrics.cache.size = 0;
  }

  getMetrics(): APIMetrics {
    return { ...this.metrics };
  }

  async healthCheck(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      await this.request({
        url: '/health',
        method: 'GET',
        timeout: 5000,
        retries: 0,
        cache: false
      });
      
      return {
        service: 'api',
        status: 'healthy',
        latency: Date.now() - startTime,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        service: 'api',
        status: 'unhealthy',
        latency: Date.now() - startTime,
        timestamp: Date.now(),
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  // Convenience methods
  async get<T = any>(url: string, config?: Partial<APIRequest>): Promise<APIResponse<T>> {
    return this.request<T>({ url, method: 'GET', ...config });
  }

  async post<T = any>(url: string, data?: any, config?: Partial<APIRequest>): Promise<APIResponse<T>> {
    return this.request<T>({ url, method: 'POST', data, ...config });
  }

  async put<T = any>(url: string, data?: any, config?: Partial<APIRequest>): Promise<APIResponse<T>> {
    return this.request<T>({ url, method: 'PUT', data, ...config });
  }

  async patch<T = any>(url: string, data?: any, config?: Partial<APIRequest>): Promise<APIResponse<T>> {
    return this.request<T>({ url, method: 'PATCH', data, ...config });
  }

  async delete<T = any>(url: string, config?: Partial<APIRequest>): Promise<APIResponse<T>> {
    return this.request<T>({ url, method: 'DELETE', ...config });
  }
}