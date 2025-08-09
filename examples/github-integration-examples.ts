/**
 * GitHub Integration Usage Examples
 * Demonstrates how to use the comprehensive GitHub API integration
 */

import GitHubIntegration, {
  UserActivity,
  ContributionData,
  RepoData,
  formatNumber,
  getLanguageColor,
  formatDate,
} from '../lib/github-integration';

// Example usage class
export class GitHubExamples {
  private github: GitHubIntegration;

  constructor(token: string, username?: string) {
    this.github = new GitHubIntegration(token, username);
  }

  /**
   * Example: Display comprehensive repository information
   */
  async displayRepositoryInfo(repoName: string): Promise<void> {
    try {
      console.log(`🔍 Fetching data for repository: ${repoName}`);
      
      const repoData: RepoData = await this.github.getRepoData(repoName);
      
      console.log('\n📊 Repository Information:');
      console.log(`Name: ${repoData.repository.name}`);
      console.log(`Description: ${repoData.repository.description || 'No description'}`);
      console.log(`⭐ Stars: ${formatNumber(repoData.repository.stargazers_count)}`);
      console.log(`🍴 Forks: ${formatNumber(repoData.repository.forks_count)}`);
      console.log(`📝 Language: ${repoData.repository.language || 'Not specified'}`);
      console.log(`📅 Created: ${formatDate(repoData.repository.created_at)}`);
      console.log(`🔄 Last updated: ${formatDate(repoData.repository.updated_at)}`);
      
      console.log('\n📈 Languages used:');
      const totalBytes = Object.values(repoData.languages).reduce((sum, bytes) => sum + bytes, 0);
      Object.entries(repoData.languages).forEach(([language, bytes]) => {
        const percentage = ((bytes / totalBytes) * 100).toFixed(1);
        console.log(`  ${language}: ${percentage}% (${getLanguageColor(language)})`);
      });

      console.log(`\n👥 Contributors: ${repoData.contributors.length}`);
      console.log(`📝 Recent commits: ${repoData.commits.length}`);
      console.log(`🚀 Releases: ${repoData.releases.length}`);

      if (repoData.releases.length > 0) {
        const latestRelease = repoData.releases[0];
        console.log(`\n🏷️ Latest release: ${latestRelease.tag_name}`);
        console.log(`   Published: ${formatDate(latestRelease.published_at)}`);
      }

    } catch (error) {
      console.error('❌ Error fetching repository data:', error);
    }
  }

  /**
   * Example: Generate user activity report
   */
  async generateActivityReport(username?: string): Promise<void> {
    try {
      console.log(`📊 Generating activity report...`);
      
      const activity: UserActivity = await this.github.getUserActivity(username);
      
      console.log('\n🔥 Recent Activity Summary:');
      console.log(`📝 Recent commits: ${activity.recentCommits.length}`);
      console.log(`🔄 Pull requests: ${activity.pullRequests.length}`);
      console.log(`🐛 Issues: ${activity.issues.length}`);
      console.log(`⭐ Starred repositories: ${activity.starredRepos.length}`);

      console.log('\n📝 Latest commits:');
      activity.recentCommits.slice(0, 5).forEach((commit, index) => {
        console.log(`  ${index + 1}. ${commit.commit.message.split('\n')[0]} (${formatDate(commit.commit.author.date)})`);
      });

      console.log('\n🔄 Recent pull requests:');
      activity.pullRequests.slice(0, 3).forEach((pr, index) => {
        const statusEmoji = pr.state === 'open' ? '🟢' : pr.state === 'merged' ? '🟣' : '🔴';
        console.log(`  ${index + 1}. ${statusEmoji} ${pr.title} in ${pr.repository.name}`);
      });

      console.log('\n⭐ Recently starred repositories:');
      activity.starredRepos.slice(0, 5).forEach((repo, index) => {
        console.log(`  ${index + 1}. ${repo.full_name} (${repo.language || 'Unknown'})`);
      });

    } catch (error) {
      console.error('❌ Error generating activity report:', error);
    }
  }

  /**
   * Example: Create contribution graph visualization
   */
  async visualizeContributions(username?: string): Promise<void> {
    try {
      console.log(`📈 Creating contribution visualization...`);
      
      const contributions: ContributionData = await this.github.getContributionData(username);
      
      console.log('\n🔥 Contribution Statistics:');
      console.log(`Total contributions: ${formatNumber(contributions.totalContributions)}`);
      console.log(`Current streak: ${contributions.currentStreak} days`);
      console.log(`Longest streak: ${contributions.longestStreak} days`);

      // Simple ASCII visualization of recent weeks
      console.log('\n📊 Recent contribution activity:');
      const recentWeeks = contributions.weeks.slice(-8); // Last 8 weeks
      
      recentWeeks.forEach((week) => {
        const weekContributions = week.contributionDays
          .map(day => {
            switch (day.level) {
              case 0: return '⬜';
              case 1: return '🟩';
              case 2: return '🟨';
              case 3: return '🟧';
              case 4: return '🟥';
              default: return '⬜';
            }
          })
          .join('');
        
        const weekStart = new Date(week.firstDay).toLocaleDateString();
        console.log(`  ${weekStart}: ${weekContributions}`);
      });

      console.log('\n🎨 Legend: ⬜ None 🟩 Low 🟨 Medium 🟧 High 🟥 Very High');

    } catch (error) {
      console.error('❌ Error visualizing contributions:', error);
    }
  }

  /**
   * Example: Comprehensive GitHub statistics dashboard
   */
  async createStatsDashboard(username?: string): Promise<void> {
    try {
      console.log(`🚀 Creating GitHub statistics dashboard...`);
      
      const stats = await this.github.getGitHubStats(username);
      const rateLimitInfo = this.github.getRateLimitInfo();
      
      console.log('\n👤 User Profile:');
      console.log(`Name: ${stats.user.name || stats.user.login}`);
      console.log(`Bio: ${stats.user.bio || 'No bio available'}`);
      console.log(`Company: ${stats.user.company || 'Not specified'}`);
      console.log(`Location: ${stats.user.location || 'Not specified'}`);
      console.log(`Followers: ${formatNumber(stats.user.followers)}`);
      console.log(`Following: ${formatNumber(stats.user.following)}`);

      console.log('\n📊 Repository Statistics:');
      console.log(`Total repositories: ${formatNumber(stats.totalRepos)}`);
      console.log(`Total stars earned: ${formatNumber(stats.totalStars)}`);
      console.log(`Total forks: ${formatNumber(stats.totalForks)}`);
      console.log(`Estimated commits: ${formatNumber(stats.totalCommits)}`);

      console.log('\n💻 Programming Languages:');
      const sortedLanguages = Object.entries(stats.languageStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
      
      sortedLanguages.forEach(([language, count], index) => {
        const percentage = ((count / stats.totalRepos) * 100).toFixed(1);
        console.log(`  ${index + 1}. ${language}: ${count} repos (${percentage}%)`);
      });

      console.log('\n🏆 Top Repositories:');
      stats.topRepositories.slice(0, 5).forEach((repo, index) => {
        console.log(`  ${index + 1}. ${repo.name} (⭐${formatNumber(repo.stargazers_count)}, ${repo.language || 'Unknown'})`);
      });

      console.log('\n⚡ Rate Limit Status:');
      console.log(`Remaining requests: ${rateLimitInfo.remaining}/${rateLimitInfo.limit}`);
      console.log(`Reset time: ${new Date(rateLimitInfo.reset).toLocaleTimeString()}`);

    } catch (error) {
      console.error('❌ Error creating stats dashboard:', error);
    }
  }

  /**
   * Example: Monitor multiple repositories
   */
  async monitorRepositories(repoNames: string[]): Promise<void> {
    try {
      console.log(`🔍 Monitoring ${repoNames.length} repositories...`);
      
      const results = await Promise.allSettled(
        repoNames.map(repo => this.github.getRepoData(repo))
      );

      console.log('\n📊 Repository Health Report:');
      
      results.forEach((result, index) => {
        const repoName = repoNames[index];
        
        if (result.status === 'fulfilled') {
          const data = result.value;
          const lastCommit = data.commits[0];
          const daysSinceLastCommit = Math.floor(
            (Date.now() - new Date(lastCommit.commit.author.date).getTime()) / (1000 * 60 * 60 * 24)
          );
          
          console.log(`\n  📁 ${repoName}:`);
          console.log(`     ⭐ ${formatNumber(data.repository.stargazers_count)} stars`);
          console.log(`     🍴 ${formatNumber(data.repository.forks_count)} forks`);
          console.log(`     🐛 ${data.repository.open_issues_count} open issues`);
          console.log(`     📝 Last commit: ${daysSinceLastCommit} days ago`);
          console.log(`     🏷️ ${data.releases.length} releases`);
          console.log(`     Status: ${daysSinceLastCommit < 30 ? '🟢 Active' : daysSinceLastCommit < 90 ? '🟡 Moderate' : '🔴 Inactive'}`);
        } else {
          console.log(`\n  ❌ ${repoName}: Failed to fetch data`);
        }
      });

    } catch (error) {
      console.error('❌ Error monitoring repositories:', error);
    }
  }

  /**
   * Example: Get cache statistics and performance info
   */
  getCacheInfo(): void {
    const cacheStats = this.github.getCacheStats();
    console.log('\n💾 Cache Information:');
    console.log(`Cached entries: ${cacheStats.size}`);
    console.log(`Cache keys: ${cacheStats.keys.join(', ')}`);
  }

  /**
   * Example: Clear cache and force fresh data
   */
  clearCache(): void {
    this.github.clearCache();
    console.log('✅ Cache cleared successfully');
  }
}

// Usage examples
export async function runExamples() {
  // Initialize with your GitHub token
  const token = process.env.GITHUB_TOKEN || 'your-github-token';
  const username = process.env.GITHUB_USERNAME || 'your-username';
  
  const examples = new GitHubExamples(token, username);

  try {
    // Example 1: Repository analysis
    console.log('='.repeat(50));
    console.log('📁 REPOSITORY ANALYSIS');
    console.log('='.repeat(50));
    await examples.displayRepositoryInfo('microsoft/vscode');

    // Example 2: User activity report
    console.log('\n' + '='.repeat(50));
    console.log('👤 USER ACTIVITY REPORT');
    console.log('='.repeat(50));
    await examples.generateActivityReport();

    // Example 3: Contribution visualization
    console.log('\n' + '='.repeat(50));
    console.log('📈 CONTRIBUTION VISUALIZATION');
    console.log('='.repeat(50));
    await examples.visualizeContributions();

    // Example 4: Comprehensive dashboard
    console.log('\n' + '='.repeat(50));
    console.log('🚀 GITHUB STATISTICS DASHBOARD');
    console.log('='.repeat(50));
    await examples.createStatsDashboard();

    // Example 5: Multi-repository monitoring
    console.log('\n' + '='.repeat(50));
    console.log('🔍 REPOSITORY MONITORING');
    console.log('='.repeat(50));
    await examples.monitorRepositories([
      'microsoft/typescript',
      'facebook/react',
      'nodejs/node'
    ]);

    // Example 6: Cache information
    console.log('\n' + '='.repeat(50));
    console.log('💾 CACHE INFORMATION');
    console.log('='.repeat(50));
    examples.getCacheInfo();

  } catch (error) {
    console.error('❌ Example execution failed:', error);
  }
}

// Export for use in other modules
export default GitHubExamples;
