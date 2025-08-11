// API Service Types

// Base API Configuration
export interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  rateLimit: {
    requests: number;
    window: number; // in milliseconds
  };
  headers?: Record<string, string>;
}

// Request/Response Types
export interface APIRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  retries?: number;
  priority?: 'low' | 'normal' | 'high';
  cache?: boolean;
  cacheTTL?: number;
}

export interface APIResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: APIRequest;
  timestamp: number;
  cached?: boolean;
  retryCount?: number;
}

export interface APIError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  timestamp: number;
  retryCount?: number;
  isRetryable?: boolean;
}

// Rate Limiting
export interface RateLimitState {
  requests: Array<{ timestamp: number; endpoint: string }>;
  blocked: boolean;
  resetTime?: number;
}

// Cache Types
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface CacheConfig {
  enabled: boolean;
  defaultTTL: number;
  maxSize: number;
  strategy: 'lru' | 'fifo' | 'ttl';
}

// Interceptor Types
export interface RequestInterceptor {
  onRequest?: (config: APIRequest) => APIRequest | Promise<APIRequest>;
  onRequestError?: (error: APIError) => APIError | Promise<APIError>;
}

export interface ResponseInterceptor {
  onResponse?: (response: APIResponse) => APIResponse | Promise<APIResponse>;
  onResponseError?: (error: APIError) => APIError | Promise<APIError>;
}

// Service-Specific Types

// Claude AI Service
export interface ClaudeConfig extends APIConfig {
  apiKey: string;
  model: 'claude-3-5-sonnet-20241022' | 'claude-3-5-haiku-20241022' | 'claude-3-opus-20240229';
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  stop_sequences: string[];
  systemPrompt?: string;
  stream?: boolean;
  safetySettings?: {
    enableContentFiltering: boolean;
    filterLevel: 'low' | 'medium' | 'high';
  };
}

export interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{
    type: 'text' | 'image';
    text?: string;
    source?: {
      type: 'base64';
      media_type: string;
      data: string;
    };
  }>;
}

export interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
  temperature?: number;
  top_p?: number;
  top_k?: number;
  stop_sequences?: string[];
  stream?: boolean;
  system?: string;
  metadata?: {
    user_id?: string;
    conversation_id?: string;
  };
  userId?: string;
  conversationId?: string;
  systemPrompt?: string;
}

export interface ClaudeResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: Array<{
    type: 'text';
    text: string;
  }>;
  model: string;
  stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence';
  stop_sequence?: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ClaudeStreamResponse {
  type: 'message_start' | 'content_block_start' | 'content_block_delta' | 'content_block_stop' | 'message_delta' | 'message_stop';
  message?: ClaudeResponse;
  index?: number;
  delta?: {
    type: 'text_delta';
    text: string;
  };
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ClaudeUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  timestamp: Date;
  requestId: string;
  model: string;
  error?: string;
}

export interface ClaudeError extends APIError {
  type: 'authentication_error' | 'permission_error' | 'not_found_error' | 'rate_limit_error' | 'api_error' | 'overloaded_error';
  param?: string;
}

// GitHub Service
export interface GitHubConfig extends APIConfig {
  token: string;
  owner: string;
  repo: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: GitHubUser;
  committer: GitHubUser;
  html_url: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  user: GitHubUser;
  assignee: GitHubUser | null;
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description: string;
  }>;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
}

// Analytics Service
export interface AnalyticsConfig extends APIConfig {
  trackingId: string;
  userId?: string;
  sessionId?: string;
  enableDebug?: boolean;
}

export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsPageView {
  page: string;
  title: string;
  referrer?: string;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, any>;
}

export interface AnalyticsUser {
  id: string;
  properties: Record<string, any>;
  traits?: Record<string, any>;
  timestamp?: number;
}

export interface AnalyticsSession {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: number;
  events: number;
  properties?: Record<string, any>;
}

// Email Service
export interface EmailConfig extends APIConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  provider: 'sendgrid' | 'mailgun' | 'ses' | 'resend';
  apiEndpoint?: string;
  defaultFrom?: {
    email: string;
    name: string;
  };
  retryDelay: number;
  enableTracking?: boolean;
}

export interface EmailRecipient {
  email: string;
  name?: string;
  type?: 'to' | 'cc' | 'bcc';
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  type?: string;
  disposition?: 'attachment' | 'inline';
  contentId?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html?: string;
  text?: string;
  variables?: Record<string, any>;
}

export interface EmailRequest {
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  subject: string;
  html?: string;
  text?: string;
  template?: {
    id: string;
    variables?: Record<string, any>;
  };
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
  tags?: string[];
  metadata?: Record<string, any>;
  scheduledAt?: Date;
  priority?: 'low' | 'normal' | 'high';
}

export interface EmailResponse {
  id: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'spam';
  message: string;
  timestamp: number;
  recipients: Array<{
    email: string;
    status: string;
    error?: string;
  }>;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  fromEmail: string;
  fromName: string;
  recipients: EmailRecipient[];
  template?: EmailTemplate;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  scheduledAt?: Date;
  sentAt?: Date;
  stats: EmailStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

export interface EmailError extends APIError {
  emailId?: string;
  recipient?: string;
  provider?: string;
  retryable: boolean;
}

// Webhook Types
export interface WebhookConfig {
  url: string;
  secret?: string;
  events: string[];
  active: boolean;
}

export interface WebhookPayload {
  event: string;
  timestamp: number;
  data: any;
  signature?: string;
}

// Monitoring and Metrics
export interface APIMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    retried: number;
  };
  latency: {
    average: number;
    p50: number;
    p95: number;
    p99: number;
  };
  errors: {
    total: number;
    byStatus: Record<number, number>;
    byEndpoint: Record<string, number>;
  };
  rateLimit: {
    hits: number;
    blocks: number;
    resetTime?: number;
  };
  cache: {
    hits: number;
    misses: number;
    size: number;
  };
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: number;
  timestamp: number;
  details?: Record<string, any>;
}

// Service Status
export interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  uptime: number;
  lastCheck: number;
  metrics: APIMetrics;
  health: HealthCheck;
}

// Export all types
export type APIServiceType = 'claude' | 'github' | 'analytics' | 'email';
export type HTTPMethod = APIRequest['method'];
export type Priority = APIRequest['priority'];
export type CacheStrategy = CacheConfig['strategy'];
export type EmailProvider = EmailConfig['provider'];
export type ClaudeModel = ClaudeConfig['model'];