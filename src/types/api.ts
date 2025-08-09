// Type definitions for API Service
export interface GitHubCommit {
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

export interface GitHubStats {
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

export interface GitHubRepository {
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

export interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ClaudeRequest {
  model: string;
  messages: ClaudeMessage[];
  context?: Record<string, unknown> | string;
  max_tokens: number;
  temperature?: number;
}

export interface ClaudeResponse {
  content: Array<{
    text: string;
    type: string;
  }>;
  id: string;
  model: string;
  role: string;
  stop_reason: string | null;
  stop_sequence: string | null;
  type: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

export interface AnalyticsEvent {
  event: string;
  properties: AnalyticsProperties;
  timestamp: string;
  sessionId: string;
  userId?: string;
}

export interface CodewarsUser {
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

export interface EmailData {
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

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface WeatherData {
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

export interface ServiceHealth {
  service: string;
  status: 'ok' | 'error';
  latency?: number;
}

// API Service Configuration
export interface APIServiceConfig {
  githubToken?: string;
  claudeEndpoint?: string;
  claudeApiKey?: string;
  analyticsEndpoint?: string;
  weatherApiKey?: string;
  defaultFromEmail?: string;
}

// Error types
export class APIError extends Error {
  constructor(
    message: string,
    public service: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class RateLimitError extends APIError {
  constructor(service: string, retryAfter?: number) {
    super(`Rate limit exceeded for ${service}`, service, 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
  
  retryAfter?: number;
}

// Utility types
export type CacheData = GitHubStats | GitHubRepository[] | CodewarsUser | WeatherData | unknown;

export interface CacheEntry {
  data: CacheData;
  expiry: number;
}

export interface RateLimitTracker {
  count: number;
  resetTime: number;
}

// Environment variable types
export interface ProcessEnv {
  REACT_APP_GITHUB_TOKEN?: string;
  VITE_GITHUB_TOKEN?: string;
  REACT_APP_CLAUDE_ENDPOINT?: string;
  VITE_CLAUDE_ENDPOINT?: string;
  REACT_APP_CLAUDE_KEY?: string;
  VITE_CLAUDE_KEY?: string;
  REACT_APP_ANALYTICS_ENDPOINT?: string;
  VITE_ANALYTICS_ENDPOINT?: string;
  REACT_APP_WEATHER_API_KEY?: string;
  VITE_WEATHER_API_KEY?: string;
  REACT_APP_DEFAULT_FROM_EMAIL?: string;
  VITE_DEFAULT_FROM_EMAIL?: string;
}

export {};
