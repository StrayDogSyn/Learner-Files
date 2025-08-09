import axios, { AxiosResponse, AxiosError } from 'axios';
import { Octokit } from '@octokit/rest';

// Types for better TypeScript support
interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    } | null;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

interface GitHubStats {
  stars: number;
  forks: number;
  watchers: number;
  lastUpdate: string;
  commits: GitHubCommit[];
  languages: Record<string, number>;
  openIssues: number;
  description?: string;
  homepage?: string;
  topics?: string[];
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ClaudeRequest {
  model: string;
  messages: ClaudeMessage[];
  context?: Record<string, unknown> | string;
  max_tokens: number;
  temperature?: number;
}

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

interface AnalyticsEvent {
  event: string;
  properties: AnalyticsProperties;
  timestamp: string;
  sessionId: string;
  userId?: string;
}

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
}

type CacheData = GitHubStats | GitHubRepository[] | CodewarsUser | WeatherData | unknown;

interface CodewarsUser {
  username: string;
  name: string;
  honor: number;
  clan: string;
  leaderboardPosition: number;
  skills: string[];
  ranks: {
    overall: {
      rank: number;
      name: string;
      color: string;
      score: number;
    };
    languages: Record<string, {
      rank: number;
      name: string;
      color: string;
      score: number;
    }>;
  };
  codeChallenges: {
    totalAuthored: number;
    totalCompleted: number;
  };
}

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    encoding?: string;
  }>;
}

class APIService {
  private github: Octokit;
  private claudeEndpoint: string;
  private analyticsEndpoint: string;
  private cache: Map<string, { data: CacheData; expiry: number }>;
  private requestQueue: Map<string, Promise<CacheData>>;
  private rateLimitTracker: Map<string, { count: number; resetTime: number }>;
  
  constructor() {
    this.github = new Octokit({
      auth: process.env.REACT_APP_GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN
    });
    
    this.claudeEndpoint = process.env.REACT_APP_CLAUDE_ENDPOINT || 
                         process.env.VITE_CLAUDE_ENDPOINT || 
                         'https://api.anthropic.com/v1/messages';
    
    this.analyticsEndpoint = process.env.REACT_APP_ANALYTICS_ENDPOINT || 
                            process.env.VITE_ANALYTICS_ENDPOINT || 
                            '/api/analytics';
    
    this.cache = new Map();
    this.requestQueue = new Map();
    this.rateLimitTracker = new Map();
    
    // Setup axios defaults
    axios.defaults.timeout = 10000;
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for adding common headers
    axios.interceptors.request.use(
      (config) => {
        config.headers['User-Agent'] = 'StrayDogSyndicate-Portfolio/1.0';
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded, implementing backoff');
          return this.handleRateLimit(error);
        }
        return Promise.reject(error);
      }
    );
  }

  private async handleRateLimit(error: AxiosError): Promise<AxiosResponse> {
    const retryAfter = error.response?.headers['retry-after'] || '60';
    const delay = parseInt(retryAfter) * 1000;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    if (error.config) {
      return axios(error.config);
    }
    
    throw error;
  }

  private isRateLimited(service: string): boolean {
    const tracker = this.rateLimitTracker.get(service);
    if (!tracker) return false;
    
    const now = Date.now();
    if (now > tracker.resetTime) {
      this.rateLimitTracker.delete(service);
      return false;
    }
    
    return tracker.count >= 60; // Default rate limit
  }

  private updateRateLimit(service: string): void {
    const now = Date.now();
    const tracker = this.rateLimitTracker.get(service) || { count: 0, resetTime: now + 3600000 };
    
    if (now > tracker.resetTime) {
      tracker.count = 1;
      tracker.resetTime = now + 3600000; // 1 hour
    } else {
      tracker.count++;
    }
    
    this.rateLimitTracker.set(service, tracker);
  }

  // Enhanced GitHub Integration
  async fetchProjectStats(repo: string): Promise<GitHubStats | null> {
    const cacheKey = `github_${repo}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() < cached.expiry) {
        return cached.data as GitHubStats;
      }
      this.cache.delete(cacheKey);
    }

    // Check if request is already in progress
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey) as Promise<GitHubStats>;
    }

    // Check rate limiting
    if (this.isRateLimited('github')) {
      console.warn('GitHub rate limit reached, using cached data if available');
      return null;
    }

    const promise = this.fetchGitHubStatsInternal(repo, cacheKey);
    this.requestQueue.set(cacheKey, promise);
    
    try {
      const result = await promise;
      return result;
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  private async fetchGitHubStatsInternal(repo: string, cacheKey: string): Promise<GitHubStats | null> {
    try {
      this.updateRateLimit('github');
      
      const [repoData, commits, languages] = await Promise.all([
        this.github.repos.get({
          owner: 'StrayDogSyn',
          repo
        }),
        this.github.repos.listCommits({
          owner: 'StrayDogSyn',
          repo,
          per_page: 10
        }).catch(() => ({ data: [] })), // Handle private repos
        this.github.repos.listLanguages({
          owner: 'StrayDogSyn',
          repo
        }).catch(() => ({ data: {} }))
      ]);

      const stats: GitHubStats = {
        stars: repoData.data.stargazers_count,
        forks: repoData.data.forks_count,
        watchers: repoData.data.watchers_count,
        lastUpdate: repoData.data.updated_at,
        commits: commits.data.map(commit => ({
          sha: commit.sha,
          commit: {
            message: commit.commit.message,
            author: commit.commit.author ? {
              name: commit.commit.author.name || '',
              email: commit.commit.author.email || '',
              date: commit.commit.author.date || ''
            } : null
          },
          author: commit.author ? {
            login: commit.author.login,
            avatar_url: commit.author.avatar_url
          } : null
        })),
        languages: languages.data,
        openIssues: repoData.data.open_issues_count,
        description: repoData.data.description || undefined,
        homepage: repoData.data.homepage || undefined,
        topics: repoData.data.topics || []
      };

      // Cache for 1 hour
      this.cache.set(cacheKey, {
        data: stats,
        expiry: Date.now() + 3600000
      });

      return stats;
    } catch (error) {
      console.error(`Failed to fetch stats for ${repo}:`, error);
      return null;
    }
  }

  async fetchAllRepositories(): Promise<GitHubRepository[]> {
    try {
      this.updateRateLimit('github');
      
      const repos = await this.github.repos.listForUser({
        username: 'StrayDogSyn',
        per_page: 50
      });

      return repos.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count || 0,
        forks_count: repo.forks_count || 0,
        language: repo.language || null,
        updated_at: repo.updated_at || '',
        topics: repo.topics || []
      }));
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      return [];
    }
  }

  // Enhanced Claude 4.1 Integration
  async sendToClaude(
    message: string, 
    context?: Record<string, unknown> | string, 
    options: Partial<ClaudeRequest> = {}
  ): Promise<string> {
    try {
      this.updateRateLimit('claude');
      
      const requestPayload: ClaudeRequest = {
        model: options.model || 'claude-3-opus-20240229',
        messages: [{
          role: 'user',
          content: message
        }],
        max_tokens: options.max_tokens || 1000,
        temperature: options.temperature || 0.7,
        ...options
      };

      if (context) {
        requestPayload.messages.unshift({
          role: 'system',
          content: typeof context === 'string' ? context : JSON.stringify(context)
        });
      }

      const response: AxiosResponse = await axios.post(this.claudeEndpoint, requestPayload, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_CLAUDE_KEY || process.env.VITE_CLAUDE_KEY}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      });

      return response.data.content[0]?.text || response.data.content;
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(`Claude API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Enhanced Analytics Tracking
  async trackEvent(eventName: string, properties: AnalyticsProperties = {}): Promise<void> {
    try {
      const eventData: AnalyticsEvent = {
        event: eventName,
        properties: {
          ...properties,
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer
        },
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
        userId: this.getUserId()
      };

      // Send to analytics endpoint
      await axios.post(this.analyticsEndpoint, eventData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', eventData);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw - analytics shouldn't break the app
    }
  }

  async trackPageView(page: string, additionalProperties: AnalyticsProperties = {}): Promise<void> {
    await this.trackEvent('page_view', {
      page,
      ...additionalProperties
    });
  }

  async trackUserInteraction(action: string, element: string, additionalProperties: AnalyticsProperties = {}): Promise<void> {
    await this.trackEvent('user_interaction', {
      action,
      element,
      ...additionalProperties
    });
  }

  // Enhanced Codewars Integration
  async fetchCodewarsStats(username: string): Promise<CodewarsUser | null> {
    const cacheKey = `codewars_${username}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() < cached.expiry) {
        return cached.data as CodewarsUser;
      }
    }

    try {
      this.updateRateLimit('codewars');
      
      const [userResponse, completedResponse] = await Promise.all([
        axios.get(`https://www.codewars.com/api/v1/users/${username}`),
        axios.get(`https://www.codewars.com/api/v1/users/${username}/code-challenges/completed`)
          .catch(() => ({ data: { data: [] } })) // Handle if this endpoint fails
      ]);

      const userData: CodewarsUser = {
        ...userResponse.data,
        codeChallenges: {
          totalAuthored: userResponse.data.codeChallenges?.totalAuthored || 0,
          totalCompleted: userResponse.data.codeChallenges?.totalCompleted || completedResponse.data.data.length || 0
        }
      };

      // Cache for 4 hours (Codewars data changes less frequently)
      this.cache.set(cacheKey, {
        data: userData,
        expiry: Date.now() + 14400000
      });

      return userData;
    } catch (error) {
      console.error('Codewars API error:', error);
      return null;
    }
  }

  // Enhanced Email Service
  async sendEmail(data: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Validate email data
      if (!data.to || !data.subject) {
        throw new Error('Email must include recipient and subject');
      }

      const emailPayload = {
        ...data,
        from: data.from || process.env.REACT_APP_DEFAULT_FROM_EMAIL || process.env.VITE_DEFAULT_FROM_EMAIL,
        timestamp: new Date().toISOString()
      };

      const response: AxiosResponse = await axios.post('/api/send-email', emailPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      await this.trackEvent('email_sent', {
        to: data.to,
        subject: data.subject,
        success: true
      });

      return {
        success: true,
        messageId: response.data.messageId
      };
    } catch (error) {
      console.error('Email service error:', error);
      
      await this.trackEvent('email_sent', {
        to: data.to,
        subject: data.subject,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      };
    }
  }

  // Weather Service (bonus feature)
  async fetchWeather(location: string): Promise<WeatherData | null> {
    const cacheKey = `weather_${location}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() < cached.expiry) {
        return cached.data as WeatherData;
      }
    }

    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY || process.env.VITE_WEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('Weather API key not configured');
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
      );

      // Cache for 10 minutes
      this.cache.set(cacheKey, {
        data: response.data,
        expiry: Date.now() + 600000
      });

      return response.data;
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  }

  // Utility Methods
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string | undefined {
    return localStorage.getItem('userId') || undefined;
  }

  // Cache Management
  clearCache(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Health Check
  async healthCheck(): Promise<{ service: string; status: 'ok' | 'error'; latency?: number }[]> {
    const checks = [
      {
        name: 'GitHub API',
        test: () => this.github.rest.meta.get()
      },
      {
        name: 'Analytics Endpoint',
        test: () => axios.get(this.analyticsEndpoint + '/health').catch(() => ({ status: 200 }))
      }
    ];

    const results = await Promise.allSettled(
      checks.map(async (check) => {
        const start = Date.now();
        try {
          await check.test();
          return {
            service: check.name,
            status: 'ok' as const,
            latency: Date.now() - start
          };
        } catch {
          return {
            service: check.name,
            status: 'error' as const,
            latency: Date.now() - start
          };
        }
      })
    );

    return results.map(result => result.status === 'fulfilled' ? result.value : {
      service: 'Unknown',
      status: 'error' as const
    });
  }

  // Cleanup method
  destroy(): void {
    this.cache.clear();
    this.requestQueue.clear();
    this.rateLimitTracker.clear();
  }
}

// Export singleton instance
export default new APIService();
