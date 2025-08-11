import { BaseAPIClient } from './BaseAPIClient';
import {
  GitHubConfig,
  GitHubRepository,
  GitHubUser,
  GitHubIssue,
  GitHubPullRequest,
  GitHubCommit,
  GitHubBranch,
  GitHubRelease,
  GitHubWebhook,
  GitHubWorkflow,
  GitHubContent,
  GitHubError,
  APIResponse
} from './types';

/**
 * GitHub API Service
 * Provides comprehensive GitHub integration
 * Features:
 * - Repository management
 * - Issue and PR management
 * - Commit and branch operations
 * - Workflow automation
 * - Webhook management
 * - Content management
 * - User and organization operations
 */
export class GitHubService extends BaseAPIClient {
  private githubConfig: GitHubConfig;
  private rateLimitInfo: {
    remaining: number;
    reset: number;
    limit: number;
  } | null = null;

  constructor(config: GitHubConfig) {
    super({
      baseURL: config.baseURL || 'https://api.github.com',
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': config.userAgent || 'Learner-Files-App/1.0'
      },
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      rateLimit: {
        requests: 5000, // GitHub's rate limit
        window: 3600000 // 1 hour
      }
    });

    this.githubConfig = config;

    // Add GitHub-specific response interceptor for rate limiting
    this.addResponseInterceptor({
      onResponse: async (response) => {
        // Track GitHub rate limit headers
        const headers = response.headers;
        if (headers['x-ratelimit-remaining']) {
          this.rateLimitInfo = {
            remaining: parseInt(headers['x-ratelimit-remaining']),
            reset: parseInt(headers['x-ratelimit-reset']),
            limit: parseInt(headers['x-ratelimit-limit'])
          };
        }
        return response;
      },
      onResponseError: async (error) => {
        return this.handleGitHubError(error);
      }
    });
  }

  /**
   * Repository Operations
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const response = await this.get<GitHubRepository>(`/repos/${owner}/${repo}`);
    return response.data;
  }

  async listRepositories(
    type: 'all' | 'owner' | 'public' | 'private' | 'member' = 'all',
    sort: 'created' | 'updated' | 'pushed' | 'full_name' = 'updated',
    direction: 'asc' | 'desc' = 'desc',
    perPage = 30,
    page = 1
  ): Promise<GitHubRepository[]> {
    const response = await this.get<GitHubRepository[]>('/user/repos', {
      params: {
        type,
        sort,
        direction,
        per_page: perPage,
        page
      }
    });
    return response.data;
  }

  async createRepository(data: {
    name: string;
    description?: string;
    private?: boolean;
    auto_init?: boolean;
    gitignore_template?: string;
    license_template?: string;
    allow_squash_merge?: boolean;
    allow_merge_commit?: boolean;
    allow_rebase_merge?: boolean;
  }): Promise<GitHubRepository> {
    const response = await this.post<GitHubRepository>('/user/repos', data);
    return response.data;
  }

  async updateRepository(
    owner: string,
    repo: string,
    data: Partial<GitHubRepository>
  ): Promise<GitHubRepository> {
    const response = await this.patch<GitHubRepository>(`/repos/${owner}/${repo}`, data);
    return response.data;
  }

  async deleteRepository(owner: string, repo: string): Promise<void> {
    await this.delete(`/repos/${owner}/${repo}`);
  }

  /**
   * Branch Operations
   */
  async listBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
    const response = await this.get<GitHubBranch[]>(`/repos/${owner}/${repo}/branches`);
    return response.data;
  }

  async getBranch(owner: string, repo: string, branch: string): Promise<GitHubBranch> {
    const response = await this.get<GitHubBranch>(`/repos/${owner}/${repo}/branches/${branch}`);
    return response.data;
  }

  async createBranch(
    owner: string,
    repo: string,
    branchName: string,
    fromSha: string
  ): Promise<GitHubBranch> {
    const response = await this.post<GitHubBranch>(`/repos/${owner}/${repo}/git/refs`, {
      ref: `refs/heads/${branchName}`,
      sha: fromSha
    });
    return response.data;
  }

  async deleteBranch(owner: string, repo: string, branch: string): Promise<void> {
    await this.delete(`/repos/${owner}/${repo}/git/refs/heads/${branch}`);
  }

  /**
   * Commit Operations
   */
  async listCommits(
    owner: string,
    repo: string,
    options?: {
      sha?: string;
      path?: string;
      author?: string;
      since?: string;
      until?: string;
      per_page?: number;
      page?: number;
    }
  ): Promise<GitHubCommit[]> {
    const response = await this.get<GitHubCommit[]>(`/repos/${owner}/${repo}/commits`, {
      params: options
    });
    return response.data;
  }

  async getCommit(owner: string, repo: string, sha: string): Promise<GitHubCommit> {
    const response = await this.get<GitHubCommit>(`/repos/${owner}/${repo}/commits/${sha}`);
    return response.data;
  }

  async createCommit(
    owner: string,
    repo: string,
    data: {
      message: string;
      tree: string;
      parents: string[];
      author?: {
        name: string;
        email: string;
        date?: string;
      };
      committer?: {
        name: string;
        email: string;
        date?: string;
      };
    }
  ): Promise<GitHubCommit> {
    const response = await this.post<GitHubCommit>(`/repos/${owner}/${repo}/git/commits`, data);
    return response.data;
  }

  /**
   * Issue Operations
   */
  async listIssues(
    owner: string,
    repo: string,
    options?: {
      state?: 'open' | 'closed' | 'all';
      labels?: string;
      sort?: 'created' | 'updated' | 'comments';
      direction?: 'asc' | 'desc';
      since?: string;
      per_page?: number;
      page?: number;
    }
  ): Promise<GitHubIssue[]> {
    const response = await this.get<GitHubIssue[]>(`/repos/${owner}/${repo}/issues`, {
      params: options
    });
    return response.data;
  }

  async getIssue(owner: string, repo: string, issueNumber: number): Promise<GitHubIssue> {
    const response = await this.get<GitHubIssue>(`/repos/${owner}/${repo}/issues/${issueNumber}`);
    return response.data;
  }

  async createIssue(
    owner: string,
    repo: string,
    data: {
      title: string;
      body?: string;
      assignees?: string[];
      milestone?: number;
      labels?: string[];
    }
  ): Promise<GitHubIssue> {
    const response = await this.post<GitHubIssue>(`/repos/${owner}/${repo}/issues`, data);
    return response.data;
  }

  async updateIssue(
    owner: string,
    repo: string,
    issueNumber: number,
    data: Partial<GitHubIssue>
  ): Promise<GitHubIssue> {
    const response = await this.patch<GitHubIssue>(
      `/repos/${owner}/${repo}/issues/${issueNumber}`,
      data
    );
    return response.data;
  }

  async closeIssue(owner: string, repo: string, issueNumber: number): Promise<GitHubIssue> {
    return this.updateIssue(owner, repo, issueNumber, { state: 'closed' });
  }

  /**
   * Pull Request Operations
   */
  async listPullRequests(
    owner: string,
    repo: string,
    options?: {
      state?: 'open' | 'closed' | 'all';
      head?: string;
      base?: string;
      sort?: 'created' | 'updated' | 'popularity';
      direction?: 'asc' | 'desc';
      per_page?: number;
      page?: number;
    }
  ): Promise<GitHubPullRequest[]> {
    const response = await this.get<GitHubPullRequest[]>(`/repos/${owner}/${repo}/pulls`, {
      params: options
    });
    return response.data;
  }

  async getPullRequest(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<GitHubPullRequest> {
    const response = await this.get<GitHubPullRequest>(
      `/repos/${owner}/${repo}/pulls/${pullNumber}`
    );
    return response.data;
  }

  async createPullRequest(
    owner: string,
    repo: string,
    data: {
      title: string;
      head: string;
      base: string;
      body?: string;
      maintainer_can_modify?: boolean;
      draft?: boolean;
    }
  ): Promise<GitHubPullRequest> {
    const response = await this.post<GitHubPullRequest>(`/repos/${owner}/${repo}/pulls`, data);
    return response.data;
  }

  async updatePullRequest(
    owner: string,
    repo: string,
    pullNumber: number,
    data: Partial<GitHubPullRequest>
  ): Promise<GitHubPullRequest> {
    const response = await this.patch<GitHubPullRequest>(
      `/repos/${owner}/${repo}/pulls/${pullNumber}`,
      data
    );
    return response.data;
  }

  async mergePullRequest(
    owner: string,
    repo: string,
    pullNumber: number,
    options?: {
      commit_title?: string;
      commit_message?: string;
      merge_method?: 'merge' | 'squash' | 'rebase';
    }
  ): Promise<{ sha: string; merged: boolean; message: string }> {
    const response = await this.put<{ sha: string; merged: boolean; message: string }>(
      `/repos/${owner}/${repo}/pulls/${pullNumber}/merge`,
      options
    );
    return response.data;
  }

  /**
   * Content Operations
   */
  async getContent(
    owner: string,
    repo: string,
    path: string,
    ref?: string
  ): Promise<GitHubContent> {
    const response = await this.get<GitHubContent>(`/repos/${owner}/${repo}/contents/${path}`, {
      params: ref ? { ref } : undefined
    });
    return response.data;
  }

  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    data: {
      message: string;
      content: string; // Base64 encoded
      sha?: string; // Required for updates
      branch?: string;
      committer?: {
        name: string;
        email: string;
      };
      author?: {
        name: string;
        email: string;
      };
    }
  ): Promise<{
    content: GitHubContent;
    commit: GitHubCommit;
  }> {
    const response = await this.put<{
      content: GitHubContent;
      commit: GitHubCommit;
    }>(`/repos/${owner}/${repo}/contents/${path}`, data);
    return response.data;
  }

  async deleteFile(
    owner: string,
    repo: string,
    path: string,
    data: {
      message: string;
      sha: string;
      branch?: string;
      committer?: {
        name: string;
        email: string;
      };
      author?: {
        name: string;
        email: string;
      };
    }
  ): Promise<{ commit: GitHubCommit }> {
    const response = await this.delete<{ commit: GitHubCommit }>(
      `/repos/${owner}/${repo}/contents/${path}`,
      { data }
    );
    return response.data;
  }

  /**
   * Release Operations
   */
  async listReleases(owner: string, repo: string): Promise<GitHubRelease[]> {
    const response = await this.get<GitHubRelease[]>(`/repos/${owner}/${repo}/releases`);
    return response.data;
  }

  async getRelease(owner: string, repo: string, releaseId: number): Promise<GitHubRelease> {
    const response = await this.get<GitHubRelease>(`/repos/${owner}/${repo}/releases/${releaseId}`);
    return response.data;
  }

  async getLatestRelease(owner: string, repo: string): Promise<GitHubRelease> {
    const response = await this.get<GitHubRelease>(`/repos/${owner}/${repo}/releases/latest`);
    return response.data;
  }

  async createRelease(
    owner: string,
    repo: string,
    data: {
      tag_name: string;
      target_commitish?: string;
      name?: string;
      body?: string;
      draft?: boolean;
      prerelease?: boolean;
    }
  ): Promise<GitHubRelease> {
    const response = await this.post<GitHubRelease>(`/repos/${owner}/${repo}/releases`, data);
    return response.data;
  }

  /**
   * Workflow Operations
   */
  async listWorkflows(owner: string, repo: string): Promise<GitHubWorkflow[]> {
    const response = await this.get<{ workflows: GitHubWorkflow[] }>(
      `/repos/${owner}/${repo}/actions/workflows`
    );
    return response.data.workflows;
  }

  async getWorkflow(owner: string, repo: string, workflowId: number): Promise<GitHubWorkflow> {
    const response = await this.get<GitHubWorkflow>(
      `/repos/${owner}/${repo}/actions/workflows/${workflowId}`
    );
    return response.data;
  }

  async triggerWorkflow(
    owner: string,
    repo: string,
    workflowId: number,
    ref: string,
    inputs?: Record<string, any>
  ): Promise<void> {
    await this.post(`/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
      ref,
      inputs
    });
  }

  /**
   * Webhook Operations
   */
  async listWebhooks(owner: string, repo: string): Promise<GitHubWebhook[]> {
    const response = await this.get<GitHubWebhook[]>(`/repos/${owner}/${repo}/hooks`);
    return response.data;
  }

  async createWebhook(
    owner: string,
    repo: string,
    data: {
      config: {
        url: string;
        content_type?: 'json' | 'form';
        secret?: string;
        insecure_ssl?: '0' | '1';
      };
      events?: string[];
      active?: boolean;
    }
  ): Promise<GitHubWebhook> {
    const response = await this.post<GitHubWebhook>(`/repos/${owner}/${repo}/hooks`, {
      name: 'web',
      ...data
    });
    return response.data;
  }

  async updateWebhook(
    owner: string,
    repo: string,
    hookId: number,
    data: Partial<GitHubWebhook>
  ): Promise<GitHubWebhook> {
    const response = await this.patch<GitHubWebhook>(
      `/repos/${owner}/${repo}/hooks/${hookId}`,
      data
    );
    return response.data;
  }

  async deleteWebhook(owner: string, repo: string, hookId: number): Promise<void> {
    await this.delete(`/repos/${owner}/${repo}/hooks/${hookId}`);
  }

  /**
   * User Operations
   */
  async getCurrentUser(): Promise<GitHubUser> {
    const response = await this.get<GitHubUser>('/user');
    return response.data;
  }

  async getUser(username: string): Promise<GitHubUser> {
    const response = await this.get<GitHubUser>(`/users/${username}`);
    return response.data;
  }

  async listFollowers(username?: string): Promise<GitHubUser[]> {
    const endpoint = username ? `/users/${username}/followers` : '/user/followers';
    const response = await this.get<GitHubUser[]>(endpoint);
    return response.data;
  }

  async listFollowing(username?: string): Promise<GitHubUser[]> {
    const endpoint = username ? `/users/${username}/following` : '/user/following';
    const response = await this.get<GitHubUser[]>(endpoint);
    return response.data;
  }

  /**
   * Search Operations
   */
  async searchRepositories(
    query: string,
    options?: {
      sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
      order?: 'desc' | 'asc';
      per_page?: number;
      page?: number;
    }
  ): Promise<{ total_count: number; items: GitHubRepository[] }> {
    const response = await this.get<{ total_count: number; items: GitHubRepository[] }>(
      '/search/repositories',
      {
        params: {
          q: query,
          ...options
        }
      }
    );
    return response.data;
  }

  async searchIssues(
    query: string,
    options?: {
      sort?: 'comments' | 'reactions' | 'reactions-+1' | 'reactions--1' | 'reactions-smile' | 'reactions-thinking_face' | 'reactions-heart' | 'reactions-tada' | 'interactions' | 'created' | 'updated';
      order?: 'desc' | 'asc';
      per_page?: number;
      page?: number;
    }
  ): Promise<{ total_count: number; items: GitHubIssue[] }> {
    const response = await this.get<{ total_count: number; items: GitHubIssue[] }>(
      '/search/issues',
      {
        params: {
          q: query,
          ...options
        }
      }
    );
    return response.data;
  }

  async searchUsers(
    query: string,
    options?: {
      sort?: 'followers' | 'repositories' | 'joined';
      order?: 'desc' | 'asc';
      per_page?: number;
      page?: number;
    }
  ): Promise<{ total_count: number; items: GitHubUser[] }> {
    const response = await this.get<{ total_count: number; items: GitHubUser[] }>(
      '/search/users',
      {
        params: {
          q: query,
          ...options
        }
      }
    );
    return response.data;
  }

  /**
   * Utility Methods
   */
  getRateLimitInfo(): {
    remaining: number;
    reset: number;
    limit: number;
  } | null {
    return this.rateLimitInfo;
  }

  async checkRateLimit(): Promise<{
    rate: {
      limit: number;
      remaining: number;
      reset: number;
      used: number;
    };
  }> {
    const response = await this.get<{
      rate: {
        limit: number;
        remaining: number;
        reset: number;
        used: number;
      };
    }>('/rate_limit');
    return response.data;
  }

  encodeContent(content: string): string {
    return btoa(unescape(encodeURIComponent(content)));
  }

  decodeContent(content: string): string {
    return decodeURIComponent(escape(atob(content)));
  }

  /**
   * Error handling
   */
  private handleGitHubError(error: any): GitHubError {
    if (error.status === 401) {
      return {
        message: 'Bad credentials or token expired',
        status: 401,
        code: 'UNAUTHORIZED',
        type: 'authentication_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: false
      };
    }

    if (error.status === 403) {
      const message = error.details?.message || 'Forbidden';
      if (message.includes('rate limit')) {
        return {
          message: 'API rate limit exceeded',
          status: 403,
          code: 'RATE_LIMIT_EXCEEDED',
          type: 'rate_limit_error',
          details: error.details,
          timestamp: Date.now(),
          retryCount: error.retryCount || 0,
          isRetryable: true
        };
      }
      
      return {
        message: 'Insufficient permissions',
        status: 403,
        code: 'FORBIDDEN',
        type: 'permission_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: false
      };
    }

    if (error.status === 404) {
      return {
        message: 'Resource not found',
        status: 404,
        code: 'NOT_FOUND',
        type: 'not_found_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: false
      };
    }

    if (error.status === 422) {
      return {
        message: 'Validation failed',
        status: 422,
        code: 'VALIDATION_ERROR',
        type: 'validation_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: false
      };
    }

    return {
      message: error.message || 'Unknown GitHub API error',
      status: error.status,
      code: error.code || 'UNKNOWN_ERROR',
      type: 'api_error',
      details: error.details,
      timestamp: Date.now(),
      retryCount: error.retryCount || 0,
      isRetryable: error.isRetryable || false
    };
  }

  /**
   * Convenience methods for common workflows
   */
  async forkRepository(owner: string, repo: string, organization?: string): Promise<GitHubRepository> {
    const data = organization ? { organization } : {};
    const response = await this.post<GitHubRepository>(`/repos/${owner}/${repo}/forks`, data);
    return response.data;
  }

  async starRepository(owner: string, repo: string): Promise<void> {
    await this.put(`/user/starred/${owner}/${repo}`);
  }

  async unstarRepository(owner: string, repo: string): Promise<void> {
    await this.delete(`/user/starred/${owner}/${repo}`);
  }

  async watchRepository(owner: string, repo: string): Promise<void> {
    await this.put(`/repos/${owner}/${repo}/subscription`, {
      subscribed: true
    });
  }

  async unwatchRepository(owner: string, repo: string): Promise<void> {
    await this.delete(`/repos/${owner}/${repo}/subscription`);
  }

  async getRepositoryStats(owner: string, repo: string): Promise<{
    stars: number;
    forks: number;
    watchers: number;
    issues: number;
    pullRequests: number;
    commits: number;
  }> {
    const [repo_data, issues, pulls, commits] = await Promise.all([
      this.getRepository(owner, repo),
      this.listIssues(owner, repo, { state: 'all', per_page: 1 }),
      this.listPullRequests(owner, repo, { state: 'all', per_page: 1 }),
      this.listCommits(owner, repo, { per_page: 1 })
    ]);

    return {
      stars: repo_data.stargazers_count || 0,
      forks: repo_data.forks_count || 0,
      watchers: repo_data.watchers_count || 0,
      issues: issues.length,
      pullRequests: pulls.length,
      commits: commits.length
    };
  }
}