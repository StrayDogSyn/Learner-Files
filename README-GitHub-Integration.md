# Comprehensive GitHub API Integration

A powerful, feature-rich GitHub API integration with caching, rate limiting, and comprehensive data fetching capabilities.

## 🚀 Features

- **Complete Data Fetching**: Repository details, user stats, contributions, activity feeds
- **Smart Caching**: Automatic caching with configurable TTL to minimize API calls
- **Rate Limit Management**: Automatic rate limit tracking and handling
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Error Handling**: Robust error handling with descriptive messages
- **React Components**: Ready-to-use React components for dashboard creation
- **Performance Optimized**: Efficient data fetching with parallel requests

## 📦 Installation

```bash
# No external dependencies required - uses native fetch API
npm install
```

## ⚙️ Setup

1. **Create a GitHub Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with these scopes:
     - `repo` (for private repositories)
     - `user` (for user information)
     - `read:org` (for organization data)

2. **Environment Configuration**
   Create a `.env` file:
   ```env
   GITHUB_TOKEN=your_personal_access_token_here
   GITHUB_USERNAME=your_github_username
   ```

3. **Import and Initialize**
   ```typescript
   import GitHubIntegration from './lib/github-integration';
   
   const github = new GitHubIntegration(
     process.env.GITHUB_TOKEN!,
     process.env.GITHUB_USERNAME
   );
   ```

## 🔥 Core Features

### Repository Data Fetching

```typescript
// Get comprehensive repository information
const repoData = await github.getRepoData('microsoft/vscode');

console.log({
  repository: repoData.repository.name,
  stars: repoData.repository.stargazers_count,
  commits: repoData.commits.length,
  contributors: repoData.contributors.length,
  languages: repoData.languages,
  releases: repoData.releases.length
});
```

### User Activity Analysis

```typescript
// Get detailed user activity
const activity = await github.getUserActivity();

console.log({
  recentCommits: activity.recentCommits.length,
  pullRequests: activity.pullRequests.length,
  issues: activity.issues.length,
  starredRepos: activity.starredRepos.length,
  activityFeed: activity.activityFeed.slice(0, 10)
});
```

### Contribution Graph Data

```typescript
// Generate contribution graph data
const contributions = await github.getContributionData();

console.log({
  totalContributions: contributions.totalContributions,
  currentStreak: contributions.currentStreak,
  longestStreak: contributions.longestStreak,
  weeks: contributions.weeks.length
});
```

### Comprehensive Statistics

```typescript
// Get complete GitHub statistics
const stats = await github.getGitHubStats();

console.log({
  user: stats.user.name,
  totalRepos: stats.totalRepos,
  totalStars: stats.totalStars,
  topLanguages: Object.keys(stats.languageStats).slice(0, 5),
  topRepos: stats.topRepositories.slice(0, 3)
});
```

## 🎨 React Components

### GitHub Dashboard Component

```typescript
import GitHubDashboard from './components/GitHubDashboard';

function App() {
  return (
    <GitHubDashboard 
      token={process.env.GITHUB_TOKEN!}
      username={process.env.GITHUB_USERNAME!}
    />
  );
}
```

### Custom Hook for Data Fetching

```typescript
import { useGitHubData } from './hooks/useGitHubData';

function MyComponent() {
  const { github, loading, error, fetchData } = useGitHubData(token, username);
  
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetchData(() => github.getGitHubStats())
      .then(setStats);
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Your UI */}</div>;
}
```

## 📊 Advanced Usage Examples

### Repository Portfolio Analysis

```typescript
const analyzePortfolio = async (repositories: string[]) => {
  const analysis = await Promise.all(
    repositories.map(async (repo) => {
      const data = await github.getRepoData(repo);
      
      return {
        name: data.repository.name,
        metrics: {
          stars: data.repository.stargazers_count,
          forks: data.repository.forks_count,
          issues: data.repository.open_issues_count,
          lastUpdated: data.repository.updated_at,
          primaryLanguage: data.repository.language,
          contributors: data.contributors.length
        }
      };
    })
  );
  
  return analysis.sort((a, b) => b.metrics.stars - a.metrics.stars);
};
```

### Activity Timeline Generation

```typescript
const generateTimeline = async (username: string) => {
  const activity = await github.getUserActivity(username);
  
  const timeline = activity.activityFeed
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(item => ({
      date: item.date,
      type: item.type,
      description: item.title,
      repository: item.repository,
      url: item.url
    }));
  
  return timeline;
};
```

### Language Statistics Visualization

```typescript
const generateLanguageStats = async (username: string) => {
  const stats = await github.getGitHubStats(username);
  
  const totalRepos = Object.values(stats.languageStats)
    .reduce((sum, count) => sum + count, 0);
  
  return Object.entries(stats.languageStats)
    .map(([language, count]) => ({
      language,
      count,
      percentage: (count / totalRepos * 100).toFixed(1),
      color: getLanguageColor(language)
    }))
    .sort((a, b) => b.count - a.count);
};
```

## 🔧 Configuration Options

### Caching Configuration

```typescript
// Cache repository data for 2 hours
const repoData = await github.getRepoData('repo-name');
// Subsequent calls within 2 hours return cached data

// Clear cache when needed
github.clearCache();

// Get cache statistics
const cacheStats = github.getCacheStats();
console.log(`Cache size: ${cacheStats.size} entries`);
```

### Rate Limit Management

```typescript
// Check rate limit status
const rateLimitInfo = github.getRateLimitInfo();
console.log(`Remaining: ${rateLimitInfo.remaining}/${rateLimitInfo.limit}`);
console.log(`Reset time: ${new Date(rateLimitInfo.reset)}`);

// Rate limits are automatically handled
// Authenticated: 5,000 requests/hour
// Unauthenticated: 60 requests/hour
```

## 🛡️ Error Handling

```typescript
try {
  const data = await github.getRepoData('invalid/repository');
} catch (error) {
  if (error.message.includes('404')) {
    console.log('Repository not found');
  } else if (error.message.includes('403')) {
    console.log('Rate limit exceeded or access denied');
  } else {
    console.log('Unexpected error:', error.message);
  }
}
```

## 📈 Performance Optimization

### Parallel Data Fetching

```typescript
// Fetch multiple data sources simultaneously
const [stats, activity, contributions] = await Promise.all([
  github.getGitHubStats(),
  github.getUserActivity(),
  github.getContributionData()
]);
```

### Efficient Repository Monitoring

```typescript
const monitorRepositories = async (repositories: string[]) => {
  // Fetch all repository data in parallel
  const results = await Promise.allSettled(
    repositories.map(repo => github.getRepoData(repo))
  );
  
  return results.map((result, index) => ({
    repository: repositories[index],
    status: result.status,
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
};
```

## 🔄 Utility Functions

The integration includes helpful utility functions:

```typescript
import { 
  formatNumber, 
  formatDate, 
  getLanguageColor, 
  getContributionIntensity 
} from './lib/github-integration';

// Format large numbers (1000 → 1K, 1000000 → 1M)
const starsFormatted = formatNumber(1543); // "1.5K"

// Format relative dates
const timeAgo = formatDate('2023-12-01T10:00:00Z'); // "2 months ago"

// Get language colors for visualization
const jsColor = getLanguageColor('JavaScript'); // "#f1e05a"

// Get contribution intensity description
const intensity = getContributionIntensity(3); // "7-9 contributions"
```

## 📚 TypeScript Interfaces

The integration provides comprehensive TypeScript support:

```typescript
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  // ... and many more properties
}

interface UserActivity {
  recentCommits: GitHubCommit[];
  pullRequests: GitHubPullRequest[];
  issues: GitHubIssue[];
  starredRepos: GitHubRepo[];
  activityFeed: ActivityItem[];
}

interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
  longestStreak: number;
  currentStreak: number;
}
```

## 🎯 Use Cases

- **Portfolio Websites**: Display your GitHub statistics and projects
- **Team Dashboards**: Monitor team repository activity and contributions
- **Project Analytics**: Analyze repository health and contributor activity
- **Developer Tools**: Build tools that integrate with GitHub data
- **Statistical Analysis**: Generate reports on coding patterns and activity

## 🔒 Security Best Practices

- Store your GitHub token securely in environment variables
- Use the minimum required token scopes
- Implement proper error handling for authentication failures
- Monitor rate limit usage to avoid service interruptions
- Cache data appropriately to minimize API calls

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

For questions and support, please open an issue on the repository.
