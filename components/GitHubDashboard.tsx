/**
 * React Component Examples for GitHub Integration
 * Demonstrates how to use the GitHub API integration in React components
 */

import React, { useState, useEffect, useCallback } from 'react';
import GitHubIntegration, {
  UserActivity,
  ContributionData,
  RepoData,
  formatNumber,
  formatDate,
  getLanguageColor,
  GitHubUser,
  GitHubRepo,
} from '../lib/github-integration';

// Types for component props
interface GitHubDashboardProps {
  token: string;
  username: string;
}

interface GitHubStats {
  user: GitHubUser;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  languageStats: Record<string, number>;
  topRepositories: GitHubRepo[];
  recentActivity: GitHubRepo[];
}

interface RepositoryCardProps {
  repoName: string;
  github: GitHubIntegration;
}

interface ContributionGraphProps {
  contributions: ContributionData;
}

// Custom hook for GitHub data
function useGitHubData(token: string, username: string) {
  const [github] = useState(() => new GitHubIntegration(token, username));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async <T,>(
    fetcher: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { github, loading, error, fetchData };
}

// Repository Card Component
const RepositoryCard: React.FC<RepositoryCardProps> = ({ repoName, github }) => {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        setLoading(true);
        const data = await github.getRepoData(repoName);
        setRepoData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repository data');
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [repoName, github]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (error || !repoData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-red-200">
        <div className="text-red-600">
          <h3 className="font-semibold">Error loading repository</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const { repository, languages, contributors, releases } = repoData;
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            <a 
              href={repository.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              {repository.name}
            </a>
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {repository.description || 'No description available'}
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            ⭐ {formatNumber(repository.stargazers_count)}
          </span>
          <span className="flex items-center">
            🍴 {formatNumber(repository.forks_count)}
          </span>
        </div>
      </div>

      {/* Language breakdown */}
      <div className="mb-4">
        <div className="flex rounded-md overflow-hidden h-2 mb-2">
          {Object.entries(languages).map(([language, bytes]) => {
            const percentage = (bytes / totalBytes) * 100;
            return (
              <div
                key={language}
                style={{
                  backgroundColor: getLanguageColor(language),
                  width: `${percentage}%`,
                }}
                title={`${language}: ${percentage.toFixed(1)}%`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(languages).slice(0, 3).map(([language, bytes]) => {
            const percentage = ((bytes / totalBytes) * 100).toFixed(1);
            return (
              <span key={language} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {language} {percentage}%
              </span>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <div className="font-semibold text-gray-900">{contributors.length}</div>
          <div className="text-gray-600">Contributors</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{releases.length}</div>
          <div className="text-gray-600">Releases</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">
            {formatDate(repository.updated_at)}
          </div>
          <div className="text-gray-600">Updated</div>
        </div>
      </div>
    </div>
  );
};

// Contribution Graph Component
const ContributionGraph: React.FC<ContributionGraphProps> = ({ contributions }) => {
  const getIntensityClass = (level: 0 | 1 | 2 | 3 | 4): string => {
    const classes = {
      0: 'bg-gray-100',
      1: 'bg-green-200',
      2: 'bg-green-400',
      3: 'bg-green-600',
      4: 'bg-green-800',
    };
    return classes[level];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Contribution Activity
      </h3>
      
      <div className="mb-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(contributions.totalContributions)}
          </div>
          <div className="text-sm text-gray-600">Total Contributions</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">
            {contributions.currentStreak}
          </div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {contributions.longestStreak}
          </div>
          <div className="text-sm text-gray-600">Longest Streak</div>
        </div>
      </div>

      {/* Contribution grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col space-y-1">
          {/* Day labels */}
          <div className="flex space-x-1 text-xs text-gray-500 mb-2">
            <div className="w-3"></div>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className={`w-3 text-center ${index % 2 === 0 ? '' : 'opacity-0'}`}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Contribution squares */}
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {contributions.weeks.slice(-52).map((week, weekIndex) => 
              week.contributionDays.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${getIntensityClass(day.level)}`}
                  title={`${day.count} contributions on ${day.date}`}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getIntensityClass(level as 0 | 1 | 2 | 3 | 4)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

// Activity Feed Component
const ActivityFeed: React.FC<{ activity: UserActivity }> = ({ activity }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activity.activityFeed.slice(0, 20).map((item, index) => {
          const getTypeIcon = (type: string) => {
            switch (type) {
              case 'commit': return '📝';
              case 'pr': return '🔄';
              case 'issue': return '🐛';
              case 'star': return '⭐';
              case 'fork': return '🍴';
              case 'create': return '🎉';
              default: return '📋';
            }
          };

          return (
            <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
              <span className="text-lg">{getTypeIcon(item.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    {item.title}
                  </a>
                </p>
                {item.details && (
                  <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{formatDate(item.date)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Dashboard Component
const GitHubDashboard: React.FC<GitHubDashboardProps> = ({ token, username }) => {
  const { github, loading, error, fetchData } = useGitHubData(token, username);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [activity, setActivity] = useState<UserActivity | null>(null);
  const [contributions, setContributions] = useState<ContributionData | null>(null);
  const [featuredRepos] = useState(['microsoft/vscode', 'facebook/react', 'nodejs/node']);

  useEffect(() => {
    const loadDashboardData = async () => {
      const [statsData, activityData, contributionsData] = await Promise.all([
        fetchData(() => github.getGitHubStats()),
        fetchData(() => github.getUserActivity()),
        fetchData(() => github.getContributionData()),
      ]);

      if (statsData) setStats(statsData);
      if (activityData) setActivity(activityData);
      if (contributionsData) setContributions(contributionsData);
    };

    loadDashboardData();
  }, [github, fetchData]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GitHub Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive overview of GitHub activity and statistics
          </p>
        </div>

        {loading && !stats && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatNumber(stats.totalRepos)}
              </div>
              <div className="text-gray-600">Repositories</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {formatNumber(stats.totalStars)}
              </div>
              <div className="text-gray-600">Stars Earned</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatNumber(stats.totalForks)}
              </div>
              <div className="text-gray-600">Forks</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {formatNumber(stats.user.followers)}
              </div>
              <div className="text-gray-600">Followers</div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Contribution Graph */}
            {contributions && <ContributionGraph contributions={contributions} />}

            {/* Featured Repositories */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Featured Repositories
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredRepos.map(repo => (
                  <RepositoryCard key={repo} repoName={repo} github={github} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Activity Feed */}
            {activity && <ActivityFeed activity={activity} />}

            {/* Top Languages */}
            {stats && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Languages
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.languageStats)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 8)
                    .map(([language, count]) => {
                      const percentage = ((count as number / stats.totalRepos) * 100).toFixed(1);
                      return (
                        <div key={language} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getLanguageColor(language) }}
                            />
                            <span className="text-sm font-medium">{language}</span>
                          </div>
                          <span className="text-sm text-gray-600">{percentage}%</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubDashboard;
