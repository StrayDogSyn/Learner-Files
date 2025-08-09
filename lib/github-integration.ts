/**
 * Comprehensive GitHub API Integration
 * Advanced GitHub API service with caching, rate limiting, and comprehensive data fetching
 */

// Core interfaces
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  visibility: 'public' | 'private';
  archived: boolean;
  disabled: boolean;
  size: number;
  default_branch: string;
  license?: {
    key: string;
    name: string;
    spdx_id: string;
  };
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
  repository?: GitHubRepo;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed' | 'merged';
  html_url: string;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  repository: {
    name: string;
    full_name: string;
  };
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
  updated_at: string;
  repository: {
    name: string;
    full_name: string;
  };
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: Record<string, unknown>;
  public: boolean;
  created_at: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  html_url: string;
  assets: Array<{
    name: string;
    download_count: number;
    browser_download_url: string;
  }>;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
  firstDay: string;
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
  contributionCalendar: {
    totalContributions: number;
    weeks: ContributionWeek[];
  };
  longestStreak: number;
  currentStreak: number;
}

export interface UserActivity {
  recentCommits: GitHubCommit[];
  pullRequests: GitHubPullRequest[];
  issues: GitHubIssue[];
  starredRepos: GitHubRepo[];
  activityFeed: ActivityItem[];
}

export interface ActivityItem {
  type: 'commit' | 'pr' | 'issue' | 'star' | 'fork' | 'create';
  date: string;
  repository: string;
  title: string;
  url: string;
  details?: string;
}

export interface RepoData {
  repository: GitHubRepo;
  commits: GitHubCommit[];
  contributors: GitHubUser[];
  languages: Record<string, number>;
  releases: GitHubRelease[];
  lastFetched: Date;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
  limit: number;
}

class GitHubIntegration {
  private token: string;
  private baseURL: string = 'https://api.github.com';
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private rateLimitRemaining: number = 60;
  private rateLimitReset: number = 0;
  private username?: string;

  constructor(token: string, username?: string) {
    this.token = token;
    this.username = username;
  }

  // Private helper methods
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Integration-Service',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Update rate limit info
    this.updateRateLimit(response);

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private updateRateLimit(response: Response): void {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    
    if (remaining) this.rateLimitRemaining = parseInt(remaining, 10);
    if (reset) this.rateLimitReset = parseInt(reset, 10) * 1000;
  }

  private getCacheKey(prefix: string, ...params: string[]): string {
    return `${prefix}_${params.join('_')}`;
  }

  private setCache<T>(key: string, data: T, ttlMinutes: number = 60): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }

  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  private calculateContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  }

  private calculateStreaks(contributions: ContributionDay[]): { longest: number; current: number } {
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    // Sort by date to ensure proper order
    const sortedContributions = contributions
      .filter(day => day.count > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (let i = 0; i < sortedContributions.length; i++) {
      const currentDate = new Date(sortedContributions[i].date);
      const prevDate = i > 0 ? new Date(sortedContributions[i - 1].date) : null;

      if (prevDate && currentDate.getTime() - prevDate.getTime() === 24 * 60 * 60 * 1000) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }

      longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Calculate current streak (from today backwards)
    const today = new Date();
    const recentContributions = contributions
      .filter(day => new Date(day.date) <= today && day.count > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (let i = 0; i < recentContributions.length; i++) {
      const date = new Date(recentContributions[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (date.toDateString() === expectedDate.toDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { longest: longestStreak, current: currentStreak };
  }

  // Public API methods

  /**
   * Fetch comprehensive repository data with caching
   */
  async getRepoData(repoName: string): Promise<RepoData> {
    const cacheKey = this.getCacheKey('repo', repoName);
    const cached = this.getCache<RepoData>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Fetch all repository data in parallel
      const [repository, commits, contributors, languages, releases] = await Promise.all([
        this.makeRequest<GitHubRepo>(`/repos/${repoName}`),
        this.makeRequest<GitHubCommit[]>(`/repos/${repoName}/commits?per_page=100`),
        this.makeRequest<GitHubUser[]>(`/repos/${repoName}/contributors?per_page=100`),
        this.makeRequest<Record<string, number>>(`/repos/${repoName}/languages`),
        this.makeRequest<GitHubRelease[]>(`/repos/${repoName}/releases?per_page=20`),
      ]);

      const repoData: RepoData = {
        repository,
        commits,
        contributors,
        languages,
        releases,
        lastFetched: new Date(),
      };

      // Cache for 1 hour
      this.setCache(cacheKey, repoData, 60);

      return repoData;
    } catch (error) {
      throw new Error(`Failed to fetch repository data: ${error}`);
    }
  }

  /**
   * Fetch comprehensive user activity data
   */
  async getUserActivity(username?: string): Promise<UserActivity> {
    const user = username || this.username;
    if (!user) {
      throw new Error('Username is required');
    }

    const cacheKey = this.getCacheKey('user_activity', user);
    const cached = this.getCache<UserActivity>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Fetch user activity data
      const [events, starredRepos] = await Promise.all([
        this.makeRequest<any[]>(`/users/${user}/events?per_page=100`),
        this.makeRequest<GitHubRepo[]>(`/users/${user}/starred?per_page=50`),
      ]);

      // Process events to extract commits, PRs, and issues
      const recentCommits: GitHubCommit[] = [];
      const pullRequests: GitHubPullRequest[] = [];
      const issues: GitHubIssue[] = [];
      const activityFeed: ActivityItem[] = [];

      for (const event of events) {
        const activityItem: Partial<ActivityItem> = {
          date: event.created_at,
          repository: event.repo?.name || 'Unknown',
          url: event.repo?.url || '#',
        };

        switch (event.type) {
          case 'PushEvent':
            if (event.payload?.commits) {
              for (const commit of event.payload.commits.slice(0, 3)) {
                recentCommits.push({
                  sha: commit.sha,
                  commit: {
                    author: {
                      name: commit.author.name,
                      email: commit.author.email,
                      date: event.created_at,
                    },
                    message: commit.message,
                  },
                  html_url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
                  repository: event.repo,
                });
              }
            }
            
            activityFeed.push({
              ...activityItem,
              type: 'commit',
              title: `Pushed to ${event.repo.name}`,
              details: `${event.payload?.commits?.length || 0} commits`,
            } as ActivityItem);
            break;

          case 'PullRequestEvent':
            if (event.payload?.pull_request) {
              const pr = event.payload.pull_request;
              pullRequests.push({
                id: pr.id,
                number: pr.number,
                title: pr.title,
                body: pr.body || '',
                state: pr.state,
                html_url: pr.html_url,
                created_at: pr.created_at,
                updated_at: pr.updated_at,
                merged_at: pr.merged_at,
                repository: {
                  name: event.repo.name.split('/')[1],
                  full_name: event.repo.name,
                },
              });

              activityFeed.push({
                ...activityItem,
                type: 'pr',
                title: `${event.payload.action} pull request in ${event.repo.name}`,
                details: pr.title,
                url: pr.html_url,
              } as ActivityItem);
            }
            break;

          case 'IssuesEvent':
            if (event.payload?.issue) {
              const issue = event.payload.issue;
              issues.push({
                id: issue.id,
                number: issue.number,
                title: issue.title,
                body: issue.body || '',
                state: issue.state,
                html_url: issue.html_url,
                created_at: issue.created_at,
                updated_at: issue.updated_at,
                repository: {
                  name: event.repo.name.split('/')[1],
                  full_name: event.repo.name,
                },
              });

              activityFeed.push({
                ...activityItem,
                type: 'issue',
                title: `${event.payload.action} issue in ${event.repo.name}`,
                details: issue.title,
                url: issue.html_url,
              } as ActivityItem);
            }
            break;

          case 'WatchEvent':
            activityFeed.push({
              ...activityItem,
              type: 'star',
              title: `Starred ${event.repo.name}`,
            } as ActivityItem);
            break;

          case 'ForkEvent':
            activityFeed.push({
              ...activityItem,
              type: 'fork',
              title: `Forked ${event.repo.name}`,
            } as ActivityItem);
            break;

          case 'CreateEvent':
            activityFeed.push({
              ...activityItem,
              type: 'create',
              title: `Created ${event.payload?.ref_type || 'repository'} in ${event.repo.name}`,
            } as ActivityItem);
            break;
        }
      }

      const userActivity: UserActivity = {
        recentCommits: recentCommits.slice(0, 20),
        pullRequests: pullRequests.slice(0, 20),
        issues: issues.slice(0, 20),
        starredRepos,
        activityFeed: activityFeed.slice(0, 50),
      };

      // Cache for 30 minutes
      this.setCache(cacheKey, userActivity, 30);

      return userActivity;
    } catch (error) {
      throw new Error(`Failed to fetch user activity: ${error}`);
    }
  }

  /**
   * Generate contribution graph data with statistics
   */
  async getContributionData(username?: string): Promise<ContributionData> {
    const user = username || this.username;
    if (!user) {
      throw new Error('Username is required');
    }

    const cacheKey = this.getCacheKey('contributions', user);
    const cached = this.getCache<ContributionData>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Note: GitHub's contribution calendar requires GraphQL API or web scraping
      // For this implementation, we'll use the events API as a proxy
      const events = await this.makeRequest<any[]>(`/users/${user}/events?per_page=300`);
      
      // Create contribution map from push events
      const contributionMap = new Map<string, number>();
      const today = new Date();
      const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

      // Initialize all days in the past year with 0 contributions
      for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        contributionMap.set(dateStr, 0);
      }

      // Process push events to count contributions
      events.forEach(event => {
        if (event.type === 'PushEvent' && event.payload?.commits) {
          const date = new Date(event.created_at).toISOString().split('T')[0];
          const currentCount = contributionMap.get(date) || 0;
          contributionMap.set(date, currentCount + event.payload.commits.length);
        }
      });

      // Convert to contribution days array
      const contributionDays: ContributionDay[] = Array.from(contributionMap.entries())
        .map(([date, count]) => ({
          date,
          count,
          level: this.calculateContributionLevel(count),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Group into weeks (starting Sunday)
      const weeks: ContributionWeek[] = [];
      let currentWeek: ContributionDay[] = [];
      let firstDayOfWeek = '';

      contributionDays.forEach(day => {
        const dayOfWeek = new Date(day.date).getDay();
        
        if (dayOfWeek === 0 && currentWeek.length > 0) {
          // Start new week
          weeks.push({
            contributionDays: [...currentWeek],
            firstDay: firstDayOfWeek,
          });
          currentWeek = [];
        }
        
        if (currentWeek.length === 0) {
          firstDayOfWeek = day.date;
        }
        
        currentWeek.push(day);
      });

      // Add the last week if it has data
      if (currentWeek.length > 0) {
        weeks.push({
          contributionDays: currentWeek,
          firstDay: firstDayOfWeek,
        });
      }

      const totalContributions = contributionDays.reduce((sum, day) => sum + day.count, 0);
      const streaks = this.calculateStreaks(contributionDays);

      const contributionData: ContributionData = {
        totalContributions,
        weeks,
        contributionCalendar: {
          totalContributions,
          weeks,
        },
        longestStreak: streaks.longest,
        currentStreak: streaks.current,
      };

      // Cache for 2 hours
      this.setCache(cacheKey, contributionData, 120);

      return contributionData;
    } catch (error) {
      throw new Error(`Failed to fetch contribution data: ${error}`);
    }
  }

  /**
   * Get comprehensive GitHub statistics for a user
   */
  async getGitHubStats(username?: string): Promise<{
    user: GitHubUser;
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    totalCommits: number;
    languageStats: Record<string, number>;
    topRepositories: GitHubRepo[];
    recentActivity: GitHubRepo[];
  }> {
    const user = username || this.username;
    if (!user) {
      throw new Error('Username is required');
    }

    const cacheKey = this.getCacheKey('stats', user);
    const cached = this.getCache<ReturnType<typeof this.getGitHubStats>>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const [userInfo, repositories] = await Promise.all([
        this.makeRequest<GitHubUser>(`/users/${user}`),
        this.makeRequest<GitHubRepo[]>(`/users/${user}/repos?per_page=100&sort=updated`),
      ]);

      const activeRepos = repositories.filter(repo => !repo.archived && !repo.disabled);
      
      const totalStars = activeRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = activeRepos.reduce((sum, repo) => sum + repo.forks_count, 0);
      
      // Calculate language statistics
      const languageStats: Record<string, number> = {};
      activeRepos.forEach(repo => {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      });

      // Get top repositories by stars
      const topRepositories = activeRepos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10);

      // Get recent activity
      const recentActivity = activeRepos
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 10);

      // Estimate total commits (this would require individual repo API calls for accuracy)
      const totalCommits = activeRepos.length * 15; // Rough estimate

      const stats = {
        user: userInfo,
        totalRepos: userInfo.public_repos,
        totalStars,
        totalForks,
        totalCommits,
        languageStats,
        topRepositories,
        recentActivity,
      };

      // Cache for 1 hour
      this.setCache(cacheKey, stats, 60);

      return stats;
    } catch (error) {
      throw new Error(`Failed to fetch GitHub stats: ${error}`);
    }
  }

  /**
   * Get rate limit information
   */
  getRateLimitInfo(): RateLimitInfo {
    return {
      remaining: this.rateLimitRemaining,
      reset: this.rateLimitReset,
      limit: this.token ? 5000 : 60,
    };
  }

  /**
   * Clear cache (useful for testing or forcing fresh data)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Utility functions
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getLanguageColor = (language: string): string => {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    'C#': '#239120',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#1572B6',
    Vue: '#4FC08D',
    React: '#61DAFB',
    Angular: '#DD0031',
    Shell: '#89e051',
    PowerShell: '#012456',
    Dockerfile: '#384d54',
    YAML: '#cb171e',
    JSON: '#292929',
    Markdown: '#083fa1',
  };
  
  return colors[language] || '#8b949e';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

// Export the GitHubIntegration class as default
export default GitHubIntegration;