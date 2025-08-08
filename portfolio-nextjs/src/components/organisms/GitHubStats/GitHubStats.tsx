'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Glass } from '@/components/atoms/Glass';
import { 
  githubService, 
  GitHubStats as GitHubStatsType, 
  GitHubRepo,
  formatNumber,
  getLanguageColor
} from '@/lib/github-api';
import {
  Star,
  GitFork,
  Code,
  Calendar,
  TrendingUp,
  ExternalLink,
  RefreshCw,
  Github,
  Activity,
  BookOpen
} from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  delay: number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  label, 
  value, 
  trend, 
  delay, 
  color = 'blue' 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02, y: -2 }}
  >
    <Glass 
      variant="card" 
      interactive
      className="p-6 group hover-glow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`text-${color}-400 group-hover:text-${color}-300 transition-colors duration-300`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      
      <Typography variant="h4" className="text-white font-bold mb-1">
        {typeof value === 'number' ? formatNumber(value) : value}
      </Typography>
      
      <Typography variant="bodySmall" className="text-white/60">
        {label}
      </Typography>
    </Glass>
  </motion.div>
);

const LanguageBar: React.FC<{ 
  languages: Record<string, number>; 
  delay: number;
}> = ({ languages, delay }) => {
  const total = Object.values(languages).reduce((sum, count) => sum + count, 0);
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Top 5 languages
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Glass variant="card" className="p-6">
        <Typography variant="h6" className="text-white font-semibold mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2 text-blue-400" />
          Top Languages
        </Typography>
        
        <div className="space-y-3">
          {sortedLanguages.map(([language, count], index) => {
            const percentage = (count / total) * 100;
            const color = getLanguageColor(language);
            
            return (
              <motion.div
                key={language}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: delay + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: color }}
                    />
                    <Typography variant="bodySmall" className="text-white/80">
                      {language}
                    </Typography>
                  </div>
                  <Typography variant="bodySmall" className="text-white/60">
                    {percentage.toFixed(1)}%
                  </Typography>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: delay + index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Glass>
    </motion.div>
  );
};

const RepoCard: React.FC<{ 
  repo: GitHubRepo; 
  delay: number;
}> = ({ repo, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02 }}
  >
    <Glass 
      variant="card" 
      interactive
      className="p-6 group hover-lift"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Typography variant="h6" className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors duration-300">
            {repo.name}
          </Typography>
          <Typography variant="bodySmall" className="text-white/70 line-clamp-2">
            {repo.description || 'No description available'}
          </Typography>
        </div>
        
        <a 
          href={repo.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors duration-300"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-white/60">
          {repo.language && (
            <div className="flex items-center">
              <div 
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              {repo.language}
            </div>
          )}
          
          <div className="flex items-center">
            <Star className="w-3 h-3 mr-1" />
            {repo.stargazers_count}
          </div>
          
          <div className="flex items-center">
            <GitFork className="w-3 h-3 mr-1" />
            {repo.forks_count}
          </div>
        </div>
        
        <Typography variant="bodySmall" className="text-white/50 text-xs">
          Updated {new Date(repo.updated_at).toLocaleDateString()}
        </Typography>
      </div>
    </Glass>
  </motion.div>
);

const LoadingState: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <Glass key={index} variant="card" shimmer className="p-6 h-32" />
    ))}
  </div>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <Glass variant="modal" className="p-8 text-center">
    <Typography variant="h6" className="text-white font-semibold mb-4">
      Failed to load GitHub data
    </Typography>
    <Typography variant="bodySmall" className="text-white/70 mb-6">
      Unable to fetch repository statistics. Please try again.
    </Typography>
    <Button variant="accent" onClick={onRetry}>
      <RefreshCw className="w-4 h-4 mr-2" />
      Retry
    </Button>
  </Glass>
);

export const GitHubStats: React.FC = () => {
  const [stats, setStats] = useState<GitHubStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await githubService.getStats();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">GitHub </span>
              <span className="gradient-text">Activity</span>
            </Typography>
          </div>
          <LoadingState />
        </div>
      </section>
    );
  }

  if (error || !stats) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">GitHub </span>
              <span className="gradient-text">Activity</span>
            </Typography>
          </div>
          <ErrorState onRetry={fetchStats} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Typography variant="h2" className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">GitHub </span>
            <span className="gradient-text">Activity</span>
          </Typography>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <Typography variant="body" className="text-white/70">
              Live statistics from my repositories
            </Typography>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchStats}
              className="group"
            >
              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </Button>
          </div>
          
          {lastUpdated && (
            <Typography variant="bodySmall" className="text-white/50">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<BookOpen className="w-6 h-6" />}
            label="Public Repositories"
            value={stats.totalRepos}
            delay={0.1}
            color="blue"
          />
          
          <StatCard
            icon={<Star className="w-6 h-6" />}
            label="Total Stars"
            value={stats.totalStars}
            delay={0.2}
            color="yellow"
          />
          
          <StatCard
            icon={<GitFork className="w-6 h-6" />}
            label="Total Forks"
            value={stats.totalForks}
            delay={0.3}
            color="green"
          />
          
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Contributions"
            value={stats.totalCommits}
            delay={0.4}
            color="purple"
          />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Language Statistics */}
          <LanguageBar languages={stats.languageStats} delay={0.5} />
          
          {/* Most Starred Repository */}
          {stats.mostStarredRepo && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Glass variant="card" className="p-6">
                <Typography variant="h6" className="text-white font-semibold mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  Most Starred Repository
                </Typography>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Typography variant="h6" className="text-blue-400 font-semibold">
                      {stats.mostStarredRepo.name}
                    </Typography>
                    <a 
                      href={stats.mostStarredRepo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  
                  <Typography variant="bodySmall" className="text-white/70">
                    {stats.mostStarredRepo.description || 'No description available'}
                  </Typography>
                  
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {stats.mostStarredRepo.stargazers_count}
                    </div>
                    <div className="flex items-center">
                      <GitFork className="w-3 h-3 mr-1" />
                      {stats.mostStarredRepo.forks_count}
                    </div>
                    {stats.mostStarredRepo.language && (
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-1"
                          style={{ backgroundColor: getLanguageColor(stats.mostStarredRepo.language) }}
                        />
                        {stats.mostStarredRepo.language}
                      </div>
                    )}
                  </div>
                </div>
              </Glass>
            </motion.div>
          )}
        </div>
        
        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Typography variant="h5" className="text-white font-semibold mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              Recent Activity
            </Typography>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.recentActivity.map((repo, index) => (
                <RepoCard 
                  key={repo.id} 
                  repo={repo} 
                  delay={0.8 + index * 0.1}
                />
              ))}
            </div>
          </motion.div>
        )}
        
        {/* GitHub Profile Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-12"
        >
          <Button 
            variant="accent" 
            size="lg" 
            className="group"
            onClick={() => window.open('https://github.com/your-username', '_blank')}
          >
            <Github className="w-5 h-5 mr-2" />
            View Full GitHub Profile
            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubStats;