/**
 * GitHub Integration Configuration and Setup Guide
 * Complete guide for setting up and using the GitHub API integration
 */

// Environment Configuration
export interface GitHubConfig {
  token: string;
  username: string;
  apiVersion: string;
  baseUrl: string;
  rateLimit: {
    maxRequests: number;
    windowMs: number;
  };
  cache: {
    defaultTtlMinutes: number;
    maxEntries: number;
  };
}

// Default configuration
export const defaultConfig: GitHubConfig = {
  token: process.env.GITHUB_TOKEN || '',
  username: process.env.GITHUB_USERNAME || '',
  apiVersion: 'v3',
  baseUrl: 'https://api.github.com',
  rateLimit: {
    maxRequests: 5000, // Authenticated rate limit
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  cache: {
    defaultTtlMinutes: 60,
    maxEntries: 1000,
  },
};

// Setup instructions
export const setupInstructions = `
GitHub Integration Setup Instructions
=====================================

1. ENVIRONMENT SETUP
   Create a .env file in your project root with:
   
   GITHUB_TOKEN=your_personal_access_token_here
   GITHUB_USERNAME=your_github_username
   
2. GITHUB PERSONAL ACCESS TOKEN
   Go to GitHub Settings > Developer settings > Personal access tokens
   Generate a new token with these scopes:
   - repo (for private repositories)
   - user (for user information)
   - read:org (for organization data)
   
3. INSTALLATION
   npm install # Install dependencies
   
4. BASIC USAGE
   import GitHubIntegration from './lib/github-integration';
   
   const github = new GitHubIntegration(
     process.env.GITHUB_TOKEN!,
     process.env.GITHUB_USERNAME
   );
   
   // Get user stats
   const stats = await github.getGitHubStats();
   
   // Get repository data
   const repoData = await github.getRepoData('microsoft/vscode');
   
   // Get user activity
   const activity = await github.getUserActivity();
   
   // Get contribution data
   const contributions = await github.getContributionData();

5. RATE LIMITING
   The integration automatically handles GitHub's rate limits:
   - Authenticated: 5,000 requests/hour
   - Unauthenticated: 60 requests/hour
   
   Check rate limit status:
   const rateLimitInfo = github.getRateLimitInfo();

6. CACHING
   Data is automatically cached to reduce API calls:
   - Repository data: 1 hour
   - User activity: 30 minutes
   - Contribution data: 2 hours
   - User stats: 1 hour
   
   Clear cache if needed:
   github.clearCache();

7. ERROR HANDLING
   All methods throw descriptive errors that you should catch:
   
   try {
     const data = await github.getRepoData('invalid/repo');
   } catch (error) {
     console.error('Failed to fetch repo:', error.message);
   }

8. TYPESCRIPT SUPPORT
   Full TypeScript support with comprehensive interfaces:
   - GitHubRepo
   - GitHubUser
   - UserActivity
   - ContributionData
   - RepoData
`;

// Example .env file template
export const envTemplate = `
# GitHub API Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_USERNAME=your-username

# Optional: Custom API settings
GITHUB_API_VERSION=v3
GITHUB_BASE_URL=https://api.github.com
`;

// Package.json dependencies
export const requiredDependencies = {
  dependencies: {
    // No external dependencies required - uses native fetch
  },
  devDependencies: {
    '@types/node': '^20.0.0', // For Node.js types
    'typescript': '^5.0.0',   // For TypeScript support
  },
};

// Usage examples for different scenarios
export const usageExamples = {
  // Basic repository analysis
  repositoryAnalysis: `
const github = new GitHubIntegration(token, username);

// Analyze a specific repository
const analyzeRepository = async (repoName: string) => {
  const data = await github.getRepoData(repoName);
  
  console.log(\`Repository: \${data.repository.name}\`);
  console.log(\`Stars: \${data.repository.stargazers_count}\`);
  console.log(\`Language: \${data.repository.language}\`);
  console.log(\`Contributors: \${data.contributors.length}\`);
  console.log(\`Last commit: \${data.commits[0]?.commit.message}\`);
};
`,

  // User portfolio generation
  portfolioGeneration: `
const github = new GitHubIntegration(token, username);

// Generate a complete portfolio
const generatePortfolio = async () => {
  const [stats, activity, contributions] = await Promise.all([
    github.getGitHubStats(),
    github.getUserActivity(),
    github.getContributionData()
  ]);
  
  return {
    profile: stats.user,
    statistics: {
      repositories: stats.totalRepos,
      stars: stats.totalStars,
      followers: stats.user.followers
    },
    activity: {
      recentCommits: activity.recentCommits.slice(0, 10),
      pullRequests: activity.pullRequests.length,
      contributions: contributions.totalContributions
    },
    topProjects: stats.topRepositories.slice(0, 5)
  };
};
`,

  // Real-time dashboard
  realtimeDashboard: `
const github = new GitHubIntegration(token, username);

// Create a real-time updating dashboard
class GitHubDashboard {
  private updateInterval: NodeJS.Timeout;
  
  async start() {
    // Initial load
    await this.updateData();
    
    // Update every 5 minutes
    this.updateInterval = setInterval(() => {
      this.updateData();
    }, 5 * 60 * 1000);
  }
  
  private async updateData() {
    try {
      const stats = await github.getGitHubStats();
      const activity = await github.getUserActivity();
      
      // Update UI with fresh data
      this.renderStats(stats);
      this.renderActivity(activity);
    } catch (error) {
      console.error('Dashboard update failed:', error);
    }
  }
  
  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}
`,

  // Multi-user comparison
  userComparison: `
const github = new GitHubIntegration(token);

// Compare multiple GitHub users
const compareUsers = async (usernames: string[]) => {
  const comparisons = await Promise.all(
    usernames.map(async (username) => {
      const stats = await github.getGitHubStats(username);
      const contributions = await github.getContributionData(username);
      
      return {
        username,
        stats: {
          repositories: stats.totalRepos,
          stars: stats.totalStars,
          followers: stats.user.followers,
          contributions: contributions.totalContributions,
          streak: contributions.longestStreak
        }
      };
    })
  );
  
  // Sort by total stars
  return comparisons.sort((a, b) => b.stats.stars - a.stats.stars);
};
`,

  // Repository monitoring
  repositoryMonitoring: `
const github = new GitHubIntegration(token, username);

// Monitor repository health and activity
class RepositoryMonitor {
  private repositories: string[];
  
  constructor(repos: string[]) {
    this.repositories = repos;
  }
  
  async generateHealthReport() {
    const reports = await Promise.all(
      this.repositories.map(async (repo) => {
        const data = await github.getRepoData(repo);
        const lastCommit = new Date(data.commits[0]?.commit.author.date);
        const daysSinceLastCommit = Math.floor(
          (Date.now() - lastCommit.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return {
          repository: repo,
          health: {
            isActive: daysSinceLastCommit < 30,
            openIssues: data.repository.open_issues_count,
            lastCommitDays: daysSinceLastCommit,
            contributors: data.contributors.length,
            stars: data.repository.stargazers_count,
            forks: data.repository.forks_count
          }
        };
      })
    );
    
    return reports;
  }
}
`,
};

// Performance optimization tips
export const performanceTips = `
Performance Optimization Tips
============================

1. CACHING STRATEGY
   - Use appropriate cache TTL for your use case
   - Clear cache selectively when needed
   - Monitor cache hit rates

2. BATCH REQUESTS
   - Use Promise.all() for parallel API calls
   - Group related data fetches together
   - Avoid sequential API calls when possible

3. RATE LIMIT MANAGEMENT
   - Monitor rate limit usage with getRateLimitInfo()
   - Implement exponential backoff for retries
   - Use webhooks for real-time updates when possible

4. DATA OPTIMIZATION
   - Request only the data you need
   - Use pagination for large datasets
   - Filter data on the client side when appropriate

5. ERROR HANDLING
   - Implement graceful fallbacks
   - Cache previous successful responses
   - Provide meaningful error messages to users

6. MEMORY MANAGEMENT
   - Clear unused cache entries periodically
   - Limit the size of data structures
   - Use streaming for large datasets
`;

export default {
  defaultConfig,
  setupInstructions,
  envTemplate,
  requiredDependencies,
  usageExamples,
  performanceTips,
};
