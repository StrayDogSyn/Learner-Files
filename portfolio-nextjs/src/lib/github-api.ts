/**
 * GitHub API Integration Service
 * Provides functions to fetch repository data, user stats, and contribution information
 */

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

export interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  languageStats: Record<string, number>;
  contributionStreak: number;
  mostStarredRepo: GitHubRepo | null;
  recentActivity: GitHubRepo[];
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
}

class GitHubService {
  private baseUrl = 'https://api.github.com';
  private username: string;
  private token?: string;

  constructor(username: string, token?: string) {
    this.username = username;
    this.token = token;
  }

  private async fetchWithAuth(url: string): Promise<Response> {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App'
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    return response;
  }

  async getUser(): Promise<GitHubUser> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/users/${this.username}`);
    return response.json();
  }

  async getRepositories(options: {
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
    type?: 'all' | 'owner' | 'member';
  } = {}): Promise<GitHubRepo[]> {
    const {
      sort = 'updated',
      direction = 'desc',
      per_page = 100,
      type = 'owner'
    } = options;

    const params = new URLSearchParams({
      sort,
      direction,
      per_page: per_page.toString(),
      type
    });

    const response = await this.fetchWithAuth(
      `${this.baseUrl}/users/${this.username}/repos?${params}`
    );
    
    return response.json();
  }

  async getRepository(repoName: string): Promise<GitHubRepo> {
    const response = await this.fetchWithAuth(
      `${this.baseUrl}/repos/${this.username}/${repoName}`
    );
    return response.json();
  }

  async getLanguageStats(repos: GitHubRepo[]): Promise<Record<string, number>> {
    const languageStats: Record<string, number> = {};
    
    for (const repo of repos) {
      if (repo.language && !repo.archived && !repo.disabled) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
      }
    }
    
    return languageStats;
  }

  async getCommitCount(repoName: string): Promise<number> {
    try {
      const response = await this.fetchWithAuth(
        `${this.baseUrl}/repos/${this.username}/${repoName}/commits?per_page=1`
      );
      
      const linkHeader = response.headers.get('Link');
      if (linkHeader) {
        const match = linkHeader.match(/page=(\d+)>; rel="last"/);
        return match ? parseInt(match[1], 10) : 1;
      }
      
      return 1;
    } catch {
      // Failed to get commit count
      return 0;
    }
  }

  async getContributionData(): Promise<ContributionData | null> {
    try {
      // Note: This requires GraphQL API or scraping GitHub's contribution graph
      // For now, we'll return mock data or implement a simplified version
      const response = await this.fetchWithAuth(
        `${this.baseUrl}/users/${this.username}/events?per_page=100`
      );
      
      const events = await response.json();
      
      // Process events to create contribution-like data
      const contributionMap = new Map<string, number>();
      
      events.forEach((event: { type: string; created_at: string }) => {
        if (event.type === 'PushEvent') {
          const date = new Date(event.created_at).toISOString().split('T')[0];
          contributionMap.set(date, (contributionMap.get(date) || 0) + 1);
        }
      });
      
      // Convert to contribution format (simplified)
      const totalContributions = Array.from(contributionMap.values())
        .reduce((sum, count) => sum + count, 0);
      
      return {
        totalContributions,
        weeks: [], // Simplified for now
        contributionCalendar: {
          totalContributions,
          weeks: []
        }
      };
    } catch {
      // Failed to get contribution data
      return null;
    }
  }

  async getStats(): Promise<GitHubStats> {
    try {
      const [user, repos] = await Promise.all([
        this.getUser(),
        this.getRepositories({ per_page: 100 })
      ]);

      // Filter out archived and disabled repos for stats
      const activeRepos = repos.filter(repo => !repo.archived && !repo.disabled);
      
      const totalStars = activeRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = activeRepos.reduce((sum, repo) => sum + repo.forks_count, 0);
      
      // Get language statistics
      const languageStats = await this.getLanguageStats(activeRepos);
      
      // Find most starred repository
      const mostStarredRepo = activeRepos.reduce((prev, current) => 
        (prev.stargazers_count > current.stargazers_count) ? prev : current
      );
      
      // Get recent activity (last 5 updated repos)
      const recentActivity = activeRepos
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5);
      
      // Calculate total commits (simplified - would need individual repo calls for accuracy)
      const totalCommits = activeRepos.length * 10; // Rough estimate
      
      return {
        totalRepos: user.public_repos,
        totalStars,
        totalForks,
        totalCommits,
        languageStats,
        contributionStreak: 0, // Would need contribution data
        mostStarredRepo: mostStarredRepo || null,
        recentActivity
      };
    } catch (error) {
      // Failed to get GitHub stats
      throw error;
    }
  }

  async getFeaturedRepositories(repoNames: string[]): Promise<GitHubRepo[]> {
    try {
      const repos = await Promise.all(
        repoNames.map(name => this.getRepository(name))
      );
      return repos;
    } catch {
      // Failed to get featured repositories
      return [];
    }
  }
}

// Export a configured instance
export const createGitHubService = (username: string, token?: string) => {
  return new GitHubService(username, token);
};

// Default service instance (can be configured via environment variables)
export const githubService = createGitHubService(
  process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'your-username',
  process.env.GITHUB_TOKEN
);

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
    Angular: '#DD0031'
  };
  
  return colors[language] || '#8b949e';
};

export const calculateContributionLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};