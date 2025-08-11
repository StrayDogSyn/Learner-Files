import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, Star, Zap, Clock, Target, TrendingUp, Users, Filter, RefreshCw } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar?: string;
  totalXP: number;
  level: number;
  achievements: number;
  challengesSolved: number;
  averageTime: number;
  streak: number;
  rank: number;
  rankChange: number; // +1, -1, 0 for up, down, same
  lastActive: Date;
  badges: string[];
  specialTitle?: string;
}

interface ChallengeLeaderboard {
  challengeId: string;
  challengeName: string;
  entries: {
    username: string;
    time: number;
    score: number;
    completedAt: Date;
    codeLength: number;
    language: string;
  }[];
}

const MOCK_LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    id: '1',
    username: 'CodeMaster2024',
    avatar: '🚀',
    totalXP: 15420,
    level: 42,
    achievements: 28,
    challengesSolved: 156,
    averageTime: 8.5,
    streak: 15,
    rank: 1,
    rankChange: 0,
    lastActive: new Date(),
    badges: ['speed-demon', 'algorithm-expert', 'streak-master'],
    specialTitle: 'Algorithm Virtuoso'
  },
  {
    id: '2',
    username: 'ReactNinja',
    avatar: '⚛️',
    totalXP: 14890,
    level: 39,
    achievements: 25,
    challengesSolved: 142,
    averageTime: 9.2,
    streak: 12,
    rank: 2,
    rankChange: 1,
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    badges: ['react-master', 'ui-wizard', 'problem-solver'],
    specialTitle: 'Frontend Architect'
  },
  {
    id: '3',
    username: 'AlgoWizard',
    avatar: '🧙‍♂️',
    totalXP: 14200,
    level: 38,
    achievements: 30,
    challengesSolved: 134,
    averageTime: 7.8,
    streak: 8,
    rank: 3,
    rankChange: -1,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    badges: ['algorithm-master', 'speed-demon', 'perfectionist'],
    specialTitle: 'Data Structure Sage'
  },
  {
    id: '4',
    username: 'JSGuru',
    avatar: '💛',
    totalXP: 13750,
    level: 36,
    achievements: 22,
    challengesSolved: 128,
    averageTime: 10.1,
    streak: 5,
    rank: 4,
    rankChange: 0,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 4),
    badges: ['js-expert', 'problem-solver', 'consistent-coder']
  },
  {
    id: '5',
    username: 'PythonPro',
    avatar: '🐍',
    totalXP: 13200,
    level: 35,
    achievements: 24,
    challengesSolved: 119,
    averageTime: 11.3,
    streak: 7,
    rank: 5,
    rankChange: 2,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 6),
    badges: ['python-master', 'data-scientist', 'algorithm-expert']
  }
];

const MOCK_CHALLENGE_LEADERBOARDS: ChallengeLeaderboard[] = [
  {
    challengeId: 'two-sum',
    challengeName: 'Two Sum',
    entries: [
      { username: 'SpeedCoder', time: 2.3, score: 100, completedAt: new Date(), codeLength: 45, language: 'JavaScript' },
      { username: 'AlgoMaster', time: 2.8, score: 95, completedAt: new Date(), codeLength: 52, language: 'Python' },
      { username: 'CodeNinja', time: 3.1, score: 90, completedAt: new Date(), codeLength: 48, language: 'JavaScript' }
    ]
  },
  {
    challengeId: 'fibonacci',
    challengeName: 'Fibonacci Sequence',
    entries: [
      { username: 'MathWiz', time: 1.8, score: 100, completedAt: new Date(), codeLength: 32, language: 'Python' },
      { username: 'RecursionKing', time: 2.1, score: 98, completedAt: new Date(), codeLength: 38, language: 'JavaScript' },
      { username: 'OptimizeQueen', time: 2.4, score: 95, completedAt: new Date(), codeLength: 29, language: 'Python' }
    ]
  }
];

const TIMEFRAME_OPTIONS = [
  { value: 'daily', label: 'Today', icon: <Clock className="w-4 h-4" /> },
  { value: 'weekly', label: 'This Week', icon: <Target className="w-4 h-4" /> },
  { value: 'monthly', label: 'This Month', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'alltime', label: 'All Time', icon: <Trophy className="w-4 h-4" /> }
];

const CATEGORY_OPTIONS = [
  { value: 'overall', label: 'Overall', icon: <Trophy className="w-4 h-4" /> },
  { value: 'algorithms', label: 'Algorithms', icon: <Zap className="w-4 h-4" /> },
  { value: 'speed', label: 'Speed Coding', icon: <Clock className="w-4 h-4" /> },
  { value: 'achievements', label: 'Achievements', icon: <Medal className="w-4 h-4" /> }
];

export const LeaderboardSystem: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [showChallengeLeaderboards, setShowChallengeLeaderboards] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  
  const { totalXP, level, unlockedAchievements } = useGameStore();

  // Simulate current user in leaderboard
  const currentUser: LeaderboardEntry = {
    id: 'current',
    username: 'You',
    avatar: '👤',
    totalXP,
    level,
    achievements: unlockedAchievements.length,
    challengesSolved: 8, // From game store
    averageTime: 12.5,
    streak: 3,
    rank: 0,
    rankChange: 0,
    lastActive: new Date(),
    badges: ['newcomer', 'first-steps']
  };

  // Combine and sort leaderboard data
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const allEntries = [...MOCK_LEADERBOARD_DATA, currentUser]
      .sort((a, b) => {
        switch (selectedCategory) {
          case 'speed':
            return a.averageTime - b.averageTime;
          case 'achievements':
            return b.achievements - a.achievements;
          case 'algorithms':
            return b.challengesSolved - a.challengesSolved;
          default:
            return b.totalXP - a.totalXP;
        }
      })
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
    
    setLeaderboardData(allEntries);
    
    const userRank = allEntries.find(entry => entry.id === 'current')?.rank || null;
    setCurrentUserRank(userRank);
  }, [selectedCategory, totalXP, level, unlockedAchievements.length]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={24} />;
      case 2:
        return <Medal className="text-gray-300" size={24} />;
      case 3:
        return <Medal className="text-amber-600" size={24} />;
      default:
        return <span className="text-gray-400 font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="text-green-400" size={16} />;
    if (change < 0) return <TrendingUp className="text-red-400 rotate-180" size={16} />;
    return <div className="w-4 h-4" />;
  };

  const getActivityStatus = (lastActive: Date) => {
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);
    
    if (diffMinutes < 5) return { status: 'online', color: 'bg-green-400', text: 'Online' };
    if (diffMinutes < 60) return { status: 'recent', color: 'bg-yellow-400', text: `${Math.floor(diffMinutes)}m ago` };
    if (diffMinutes < 1440) return { status: 'today', color: 'bg-blue-400', text: `${Math.floor(diffMinutes / 60)}h ago` };
    return { status: 'offline', color: 'bg-gray-400', text: 'Offline' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-400" />
            Leaderboard
            <Users className="text-purple-400" />
          </h1>
          <p className="text-gray-300 text-lg">
            Compete with other developers and climb the ranks
          </p>
        </motion.div>

        {/* Current User Stats */}
        {currentUserRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-purple-500/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{currentUser.avatar}</div>
                <div>
                  <h2 className="text-white text-xl font-bold">Your Rank: #{currentUserRank}</h2>
                  <p className="text-gray-300">Level {level} • {totalXP.toLocaleString()} XP</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">{unlockedAchievements.length}</div>
                <p className="text-gray-300 text-sm">Achievements</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Filters</h2>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`text-white ${isRefreshing ? 'animate-spin' : ''}`} size={16} />
              </button>
            </div>
            
            {/* Timeframe Filter */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3">Timeframe</h3>
              <div className="space-y-2">
                {TIMEFRAME_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedTimeframe(option.value)}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedTimeframe === option.value ? 'bg-blue