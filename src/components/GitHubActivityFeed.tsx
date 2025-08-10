import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  Star, 
  Eye, 
  Calendar,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Activity,
  Users,
  Code
} from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';
import type { GitHubEvent, Repository } from '../types/portfolio';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface GitHubActivityFeedProps {
  className?: string;
  username?: string;
  maxEvents?: number;
  showStats?: boolean;
  refreshInterval?: number;
}

interface ActivityItemProps {
  event: GitHubEvent;
  showRepo?: boolean;
}

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  languages: Record<string, number>;
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const eventTypeIcons = {
  PushEvent: GitCommit,
  CreateEvent: GitBranch,
  WatchEvent: Star,
  ForkEvent: GitBranch,
  PullRequestEvent: GitPullRequest,
  IssuesEvent: Activity,
  default: Github
};

const eventTypeColors = {
  PushEvent: 'text-green-600 bg-green-100 dark:bg-green-900',
  CreateEvent: 'text-blue-600 bg-blue-100 dark:bg-blue-900',
  WatchEvent: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900',
  ForkEvent: 'text-purple-600 bg-purple-100 dark:bg-purple-900',
  PullRequestEvent: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900',
  IssuesEvent: 'text-red-600 bg-red-100 dark:bg-red-900',
  default: 'text-gray-600 bg-gray-100 dark:bg-gray-900'
};

const ActivityItem: React.FC<ActivityItemProps> = ({ event, showRepo = true }) => {
  const animationsEnabled = usePortfolioStore((state) => state.animationsEnabled);
  const Icon = eventTypeIcons[event.type as keyof typeof eventTypeIcons] || eventTypeIcons.default;
  const colors = eventTypeColors[event.type as keyof typeof eventTypeColors] || eventTypeColors.default;
  
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - eventDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return eventDate.toLocaleDateString();
  };
  
  const getEventDescription = () => {
    switch (event.type) {
      case 'PushEvent':
        const commits = event.payload?.commits?.length || 1;
        return `Pushed ${commits} commit${commits !== 1 ? 's' : ''}`;
      case 'CreateEvent':
        return `Created ${event.payload?.ref_type || 'repository'}`;
      case 'WatchEvent':
        return 'Starred repository';
      case 'ForkEvent':
        return 'Forked repository';
      case 'PullRequestEvent':
        return `${event.payload?.action || 'opened'} pull request`;
      case 'IssuesEvent':
        return `${event.payload?.action || 'opened'} issue`;
      default:
        return event.type.replace('Event', '');
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={animationsEnabled ? itemVariants : undefined}
      initial={animationsEnabled ? 'hidden' : undefined}
      animate={animationsEnabled ? 'visible' : undefined}
      whileHover={animationsEnabled ? 'hover' : undefined}
      className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      {/* Event Icon */}
      <div className={`p-2 rounded-full ${colors}`}>
        <Icon className="w-4 h-4" />
      </div>
      
      {/* Event Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white">
              {getEventDescription()}
              {showRepo && (
                <>
                  {' in '}
                  <a
                    href={event.repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {event.repo.name}
                  </a>
                </>
              )}
            </p>
            
            {/* Additional Details */}
            {event.type === 'PushEvent' && event.payload?.commits && (
              <div className="mt-2 space-y-1">
                {event.payload.commits.slice(0, 3).map((commit: any, index: number) => (
                  <p key={index} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">
                      {commit.sha?.substring(0, 7)}
                    </code>
                    {' '}{commit.message}
                  </p>
                ))}
                {event.payload.commits.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    +{event.payload.commits.length - 3} more commits
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimeAgo(event.created_at)}
            </span>
            <a
              href={event.repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={`View ${event.repo.name} on GitHub`}
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ContributionGraph: React.FC<{ contributions: ContributionDay[] }> = ({ contributions }) => {
  const animationsEnabled = usePortfolioStore((state) => state.animationsEnabled);
  
  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100 dark:bg-gray-800';
      case 1: return 'bg-green-200 dark:bg-green-900';
      case 2: return 'bg-green-300 dark:bg-green-700';
      case 3: return 'bg-green-400 dark:bg-green-600';
      case 4: return 'bg-green-500 dark:bg-green-500';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const squareVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.001,
        duration: 0.2
      }
    })
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Contribution Activity
      </h4>
      <div className="grid grid-cols-53 gap-1">
        {contributions.map((day, index) => (
          <motion.div
            key={day.date}
            custom={index}
            variants={animationsEnabled ? squareVariants : {}}
            initial={animationsEnabled ? 'hidden' : undefined}
            animate={animationsEnabled ? 'visible' : undefined}
            className={`w-2 h-2 rounded-sm ${getLevelColor(day.level)}`}
            title={`${day.count} contributions on ${day.date}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-2 h-2 rounded-sm ${getLevelColor(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

interface StatsCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  color
}) => {
  const animationsEnabled = usePortfolioStore((state) => state.animationsEnabled);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -4,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={animationsEnabled ? cardVariants : {}}
      initial={animationsEnabled ? 'hidden' : undefined}
            animate={animationsEnabled ? 'visible' : undefined}
      whileHover={animationsEnabled ? 'hover' : undefined}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

const GitHubActivityFeed: React.FC<GitHubActivityFeedProps> = ({
  className = '',
  username = 'octocat', // Default username for demo
  maxEvents = 10,
  showStats = true,
  refreshInterval = 300000 // 5 minutes
}) => {
  const {
    githubEvents,
    setGitHubEvents,
    setGitHubEventsLoading,
    setGitHubEventsError
  } = usePortfolioStore();

  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch GitHub events
  const { data: events, error: eventsError, isLoading: eventsLoading } = useQuery({
    queryKey: ['github-events', username],
    queryFn: async (): Promise<GitHubEvent[]> => {
      try {
        const response = await axios.get(`https://api.github.com/users/${username}/events/public`);
        return response.data.slice(0, maxEvents).map((event: any) => ({
          id: event.id,
          type: event.type,
          repo: {
            name: event.repo.name,
            url: event.repo.url.replace('api.github.com/repos', 'github.com')
          },
          created_at: event.created_at,
          payload: event.payload
        }));
      } catch (error) {
        console.error('Failed to fetch GitHub events:', error);
        throw error;
      }
    },
    staleTime: refreshInterval,
    refetchInterval: refreshInterval,
    enabled: !!username
  });

  // Fetch GitHub stats
  const { data: stats } = useQuery({
    queryKey: ['github-stats', username],
    queryFn: async (): Promise<GitHubStats> => {
      try {
        const [userResponse, reposResponse] = await Promise.all([
          axios.get(`https://api.github.com/users/${username}`),
          axios.get(`https://api.github.com/users/${username}/repos?per_page=100`)
        ]);
        
        const repos = reposResponse.data;
        const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0);
        
        const languages: Record<string, number> = {};
        repos.forEach((repo: any) => {
          if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
          }
        });
        
        return {
          totalRepos: userResponse.data.public_repos,
          totalStars,
          totalForks,
          totalCommits: 0, // Would need additional API calls to get accurate commit count
          languages
        };
      } catch (error) {
        console.error('Failed to fetch GitHub stats:', error);
        throw error;
      }
    },
    staleTime: 600000, // 10 minutes
    enabled: !!username && showStats
  });

  // Generate mock contribution data (in a real app, this would come from GitHub's GraphQL API)
  const generateContributions = (): ContributionDay[] => {
    const contributions: ContributionDay[] = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const count = Math.floor(Math.random() * 10);
      const level = count === 0 ? 0 : Math.min(Math.floor(count / 2) + 1, 4) as 0 | 1 | 2 | 3 | 4;
      
      contributions.push({
        date: date.toISOString().split('T')[0],
        count,
        level
      });
    }
    
    return contributions;
  };

  const contributions = generateContributions();

  // Update store when data changes
  useEffect(() => {
    setGitHubEventsLoading(eventsLoading);
    if (events) {
      setGitHubEvents(events);
    }
    if (eventsError) {
      setGitHubEventsError(eventsError as Error);
    }
  }, [events, eventsError, eventsLoading, setGitHubEvents, setGitHubEventsLoading, setGitHubEventsError]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['github-events', username] });
    await queryClient.invalidateQueries({ queryKey: ['github-stats', username] });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  if (eventsLoading && !events) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          {showStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-20"></div>
              ))}
            </div>
          )}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-16 mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-600 dark:text-red-400 mb-4">Failed to load GitHub activity</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Github className="w-8 h-8" />
          GitHub Activity
        </h2>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          aria-label="Refresh GitHub activity"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {showStats && stats && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <StatsCard
            icon={Code}
            label="Repositories"
            value={stats.totalRepos}
            color="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            icon={Star}
            label="Total Stars"
            value={stats.totalStars}
            color="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
          />
          <StatsCard
            icon={GitBranch}
            label="Total Forks"
            value={stats.totalForks}
            color="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
          />
          <StatsCard
            icon={TrendingUp}
            label="Languages"
            value={Object.keys(stats.languages).length}
            color="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
          />
        </motion.div>
      )}

      {/* Contribution Graph */}
      <ContributionGraph contributions={contributions} />

      {/* Activity Feed */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
          {events && (
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({events.length})
            </span>
          )}
        </h3>
        
        {events && events.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {events.map((event) => (
                <ActivityItem
                  key={event.id}
                  event={event}
                  showRepo={true}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No recent activity found for {username}
            </p>
          </div>
        )}
      </div>

      {/* Top Languages */}
      {showStats && stats && Object.keys(stats.languages).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Languages
          </h4>
          <div className="space-y-3">
            {Object.entries(stats.languages)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([language, count]) => {
                const percentage = (count / stats.totalRepos) * 100;
                return (
                  <div key={language} className="flex items-center gap-3">
                    <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                      {language}
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right">
                      {count}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubActivityFeed;