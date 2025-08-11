import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Trophy, 
  Zap, 
  Target, 
  Brain, 
  Gamepad2, 
  Users, 
  Share2, 
  Play, 
  ChevronRight,
  Star,
  Award,
  TrendingUp,
  Clock,
  BookOpen,
  Cpu
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { AlgorithmVisualization } from '../components/gamification/AlgorithmVisualization';
import { LiveCodeEditor } from '../components/gamification/LiveCodeEditor';
import { TechnicalInterviewSim } from '../components/gamification/TechnicalInterviewSim';
import { SkillAssessmentGames } from '../components/gamification/SkillAssessmentGames';
import { AchievementSystem } from '../components/gamification/AchievementSystem';
import { LeaderboardSystem } from '../components/gamification/LeaderboardSystem';
import { TechnicalMiniGames } from '../components/gamification/TechnicalMiniGames';
import { ProgressTracking } from '../components/gamification/ProgressTracking';
import { SocialSharing } from '../components/gamification/SocialSharing';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  xpReward: number;
  category: 'coding' | 'algorithms' | 'interview' | 'games' | 'progress';
}

const GamificationHub: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { userProgress, achievements, addXP } = useGameStore();

  const features: FeatureCard[] = [
    {
      id: 'algorithm-viz',
      title: 'Algorithm Visualization',
      description: 'Interactive playground for sorting and searching algorithms with step-by-step visualization',
      icon: <Cpu className="w-6 h-6" />,
      component: AlgorithmVisualization,
      difficulty: 'Intermediate',
      estimatedTime: '15-30 min',
      xpReward: 150,
      category: 'algorithms'
    },
    {
      id: 'live-editor',
      title: 'Live Code Editor',
      description: 'Real-time code editor with instant preview and syntax highlighting for multiple languages',
      icon: <Code className="w-6 h-6" />,
      component: LiveCodeEditor,
      difficulty: 'Beginner',
      estimatedTime: '10-20 min',
      xpReward: 100,
      category: 'coding'
    },
    {
      id: 'interview-sim',
      title: 'Technical Interview Simulator',
      description: 'Practice coding interviews with real problems, timer, and automated test validation',
      icon: <Brain className="w-6 h-6" />,
      component: TechnicalInterviewSim,
      difficulty: 'Advanced',
      estimatedTime: '30-60 min',
      xpReward: 250,
      category: 'interview'
    },
    {
      id: 'skill-assessment',
      title: 'Skill Assessment Games',
      description: 'Interactive JavaScript and React challenges to test your programming knowledge',
      icon: <Target className="w-6 h-6" />,
      component: SkillAssessmentGames,
      difficulty: 'Intermediate',
      estimatedTime: '20-40 min',
      xpReward: 200,
      category: 'coding'
    },
    {
      id: 'mini-games',
      title: 'Technical Mini-Games',
      description: 'Fun games demonstrating data structures, algorithms, and design patterns',
      icon: <Gamepad2 className="w-6 h-6" />,
      component: TechnicalMiniGames,
      difficulty: 'Beginner',
      estimatedTime: '5-15 min',
      xpReward: 75,
      category: 'games'
    },
    {
      id: 'achievements',
      title: 'Achievement System',
      description: 'Track your progress with badges, achievements, and milestone rewards',
      icon: <Trophy className="w-6 h-6" />,
      component: AchievementSystem,
      difficulty: 'Beginner',
      estimatedTime: '5-10 min',
      xpReward: 50,
      category: 'progress'
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      description: 'Compete with other developers and see how you rank globally',
      icon: <Users className="w-6 h-6" />,
      component: LeaderboardSystem,
      difficulty: 'Beginner',
      estimatedTime: '5-10 min',
      xpReward: 25,
      category: 'progress'
    },
    {
      id: 'progress-tracking',
      title: 'Learning Paths',
      description: 'Structured learning paths with progress tracking and personalized recommendations',
      icon: <BookOpen className="w-6 h-6" />,
      component: ProgressTracking,
      difficulty: 'Beginner',
      estimatedTime: '10-30 min',
      xpReward: 100,
      category: 'progress'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Features', icon: <Star className="w-4 h-4" /> },
    { id: 'coding', label: 'Coding', icon: <Code className="w-4 h-4" /> },
    { id: 'algorithms', label: 'Algorithms', icon: <Cpu className="w-4 h-4" /> },
    { id: 'interview', label: 'Interview Prep', icon: <Brain className="w-4 h-4" /> },
    { id: 'games', label: 'Games', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
    addXP(10); // Small XP reward for exploring features
  };

  const ActiveFeatureComponent = activeFeature 
    ? features.find(f => f.id === activeFeature)?.component 
    : null;

  if (activeFeature && ActiveFeatureComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="fixed top-4 left-4 z-50">
          <motion.button
            onClick={() => setActiveFeature(null)}
            className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Hub
          </motion.button>
        </div>
        <ActiveFeatureComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <Zap className="text-yellow-400" />
            Gamification Hub
            <Trophy className="text-yellow-400" />
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Interactive coding challenges, skill assessments, and learning experiences
          </p>
          
          {/* User Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-yellow-400">{userProgress.totalXP}</div>
              <div className="text-sm text-gray-300">Total XP</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-purple-400">{userProgress.level}</div>
              <div className="text-sm text-gray-300">Level</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-green-400">{achievements.filter(a => a.unlocked).length}</div>
              <div className="text-sm text-gray-300">Achievements</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-400">{userProgress.challengesCompleted}</div>
              <div className="text-sm text-gray-300">Challenges</div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category.icon}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <AnimatePresence>
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleFeatureClick(feature.id)}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getDifficultyColor(feature.difficulty)}`}>
                      {feature.difficulty}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {feature.estimatedTime}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {feature.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">+{feature.xpReward} XP</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-white group-hover:translate-x-1 transition-transform">
                    <span className="text-sm">Start</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Recent Achievements</h3>
            </div>
            <div className="space-y-2">
              {achievements.filter(a => a.unlocked).slice(-3).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">{achievement.title}</span>
                </div>
              ))}
              {achievements.filter(a => a.unlocked).length === 0 && (
                <p className="text-gray-400 text-sm">Complete challenges to earn achievements!</p>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-white">Progress Overview</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Level Progress</span>
                  <span className="text-white">{userProgress.level}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(userProgress.totalXP % 1000) / 10}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {1000 - (userProgress.totalXP % 1000)} XP to next level
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Share Progress</h3>
            </div>
            <SocialSharing />
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Level Up Your Skills?
            </h2>
            <p className="text-gray-300 mb-6">
              Choose any feature above to start your coding journey. Earn XP, unlock achievements, and compete with developers worldwide!
            </p>
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={() => handleFeatureClick('algorithm-viz')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
                Start with Algorithms
              </motion.button>
              <motion.button
                onClick={() => handleFeatureClick('live-editor')}
                className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl text-white font-medium border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Code className="w-4 h-4" />
                Try Live Editor
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GamificationHub;