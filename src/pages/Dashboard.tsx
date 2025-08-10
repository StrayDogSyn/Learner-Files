import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Star, 
  Code, 
  Clock, 
  Target,
  Activity,
  Award,
  Zap,
  Globe
} from 'lucide-react';

interface PortfolioStats {
  totalViews: number;
  uniqueVisitors: number;
  projectsCompleted: number;
  averageRating: number;
  totalCodeLines: number;
  technologiesUsed: number;
  githubStars: number;
  deployments: number;
}

interface ProjectMetric {
  name: string;
  views: number;
  rating: number;
  completionRate: number;
  techStack: string[];
  lastUpdated: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<PortfolioStats>({
    totalViews: 0,
    uniqueVisitors: 0,
    projectsCompleted: 0,
    averageRating: 0,
    totalCodeLines: 0,
    technologiesUsed: 0,
    githubStars: 0,
    deployments: 0
  });

  const [projectMetrics, setProjectMetrics] = useState<ProjectMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real implementation, this would come from analytics API
      setStats({
        totalViews: 12847,
        uniqueVisitors: 3421,
        projectsCompleted: 5,
        averageRating: 4.7,
        totalCodeLines: 15420,
        technologiesUsed: 12,
        githubStars: 89,
        deployments: 23
      });

      setProjectMetrics([
        {
          name: 'Calculator App',
          views: 2341,
          rating: 4.8,
          completionRate: 95,
          techStack: ['React', 'TypeScript', 'CSS'],
          lastUpdated: '2024-01-15'
        },
        {
          name: 'Knucklebones Game',
          views: 1876,
          rating: 4.6,
          completionRate: 88,
          techStack: ['React', 'TypeScript', 'Framer Motion'],
          lastUpdated: '2024-01-12'
        },
        {
          name: 'Quiz Ninja',
          views: 3124,
          rating: 4.9,
          completionRate: 92,
          techStack: ['React', 'TypeScript', 'API Integration'],
          lastUpdated: '2024-01-10'
        },
        {
          name: 'Countdown Timer',
          views: 1567,
          rating: 4.5,
          completionRate: 85,
          techStack: ['React', 'TypeScript', 'Web APIs'],
          lastUpdated: '2024-01-08'
        },
        {
          name: 'CompTIA Trainer',
          views: 4239,
          rating: 4.8,
          completionRate: 98,
          techStack: ['React', 'TypeScript', 'Local Storage'],
          lastUpdated: '2024-01-20'
        }
      ]);
      
      setIsLoading(false);
    };

    loadAnalytics();
  }, []);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change?: string;
    color?: string;
  }> = ({ icon, title, value, change, color = 'emerald' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
        {change && (
          <div className="text-right">
            <div className="flex items-center space-x-1 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">{change}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const ProgressBar: React.FC<{
    label: string;
    value: number;
    max: number;
    color?: string;
  }> = ({ label, value, max, color = 'emerald' }) => {
    const percentage = Math.min((value / max) * 100, 100);
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          <span className={`text-${color}-400`}>{value}/{max}</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-2 bg-${color}-500 rounded-full`}
          />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-hunter-green p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-8 border border-emerald-500/20 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
              <span className="text-xl text-emerald-400">Loading Analytics...</span>
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-hunter-green p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Portfolio Analytics
          </h1>
          <p className="text-gray-400">
            Comprehensive insights into portfolio performance and engagement
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Eye className="w-6 h-6 text-emerald-400" />}
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            change="+12.5%"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-blue-400" />}
            title="Unique Visitors"
            value={stats.uniqueVisitors.toLocaleString()}
            change="+8.3%"
            color="blue"
          />
          <StatCard
            icon={<Star className="w-6 h-6 text-yellow-400" />}
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            change="+0.2"
            color="yellow"
          />
          <StatCard
            icon={<Target className="w-6 h-6 text-purple-400" />}
            title="Projects"
            value={stats.projectsCompleted}
            change="+1"
            color="purple"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Code className="w-6 h-6 text-green-400" />}
            title="Lines of Code"
            value={stats.totalCodeLines.toLocaleString()}
            color="green"
          />
          <StatCard
            icon={<Zap className="w-6 h-6 text-orange-400" />}
            title="Technologies"
            value={stats.technologiesUsed}
            color="orange"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-pink-400" />}
            title="GitHub Stars"
            value={stats.githubStars}
            color="pink"
          />
          <StatCard
            icon={<Globe className="w-6 h-6 text-cyan-400" />}
            title="Deployments"
            value={stats.deployments}
            color="cyan"
          />
        </div>

        {/* Project Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass p-6 border border-emerald-500/20"
        >
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Project Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Metrics */}
            <div className="space-y-6">
              {projectMetrics.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="glass p-4 border border-gray-600/30"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{project.name}</h3>
                      <p className="text-sm text-gray-400">
                        Updated: {new Date(project.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">{project.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{project.views}</span>
                      </div>
                    </div>
                  </div>
                  
                  <ProgressBar
                    label="Completion Rate"
                    value={project.completionRate}
                    max={100}
                  />
                  
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">Tech Stack:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Performance Overview */}
            <div className="space-y-6">
              <div className="glass p-4 border border-gray-600/30">
                <h3 className="font-semibold text-white mb-4 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <span>Performance Overview</span>
                </h3>
                
                <div className="space-y-4">
                  <ProgressBar
                    label="Overall Portfolio Health"
                    value={92}
                    max={100}
                  />
                  <ProgressBar
                    label="Code Quality Score"
                    value={88}
                    max={100}
                    color="blue"
                  />
                  <ProgressBar
                    label="User Engagement"
                    value={76}
                    max={100}
                    color="purple"
                  />
                  <ProgressBar
                    label="Technical Diversity"
                    value={85}
                    max={100}
                    color="orange"
                  />
                </div>
              </div>
              
              <div className="glass p-4 border border-gray-600/30">
                <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-sm text-gray-300">CompTIA Trainer updated</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-300">New visitor from GitHub</span>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm text-gray-300">Quiz Ninja featured</span>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;