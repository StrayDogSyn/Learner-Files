export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  html_url: string;
  topics: string[];
  size: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
}

export interface GitHubStats {
  stars: number;
  forks: number;
  language: string;
  lastUpdate: string;
  topics: string[];
  size: number;
  issues: number;
  watchers: number;
}

class GitHubApiService {
  private baseUrl = 'https://api.github.com';
  private cache = new Map<string, { data: GitHubStats; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch repository statistics from GitHub API
   * @param repoPath - Repository path in format 'owner/repo'
   * @returns Promise with repository statistics
   */
  async getRepoStats(repoPath: string): Promise<GitHubStats | null> {
    try {
      // Check cache first
      const cached = this.cache.get(repoPath);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const response = await fetch(`${this.baseUrl}/repos/${repoPath}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Website'
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch GitHub stats for ${repoPath}:`, response.status);
        return null;
      }

      const repo: GitHubRepo = await response.json();
      
      const stats: GitHubStats = {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown',
        lastUpdate: new Date(repo.updated_at).toISOString().split('T')[0],
        topics: repo.topics || [],
        size: repo.size,
        issues: repo.open_issues_count,
        watchers: repo.watchers_count
      };

      // Cache the result
      this.cache.set(repoPath, {
        data: stats,
        timestamp: Date.now()
      });

      return stats;
    } catch (error) {
      console.error(`Error fetching GitHub stats for ${repoPath}:`, error);
      return null;
    }
  }

  /**
   * Fetch multiple repositories statistics
   * @param repoPaths - Array of repository paths
   * @returns Promise with array of repository statistics
   */
  async getMultipleRepoStats(repoPaths: string[]): Promise<(GitHubStats | null)[]> {
    const promises = repoPaths.map(path => this.getRepoStats(path));
    return Promise.all(promises);
  }

  /**
   * Search repositories by query
   * @param query - Search query
   * @param sort - Sort criteria (stars, forks, updated)
   * @param order - Sort order (asc, desc)
   * @returns Promise with search results
   */
  async searchRepositories(
    query: string, 
    sort: 'stars' | 'forks' | 'updated' = 'stars',
    order: 'asc' | 'desc' = 'desc'
  ): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=${order}&per_page=10`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-Website'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error searching repositories:', error);
      return [];
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const githubApi = new GitHubApiService();
export default githubApi;