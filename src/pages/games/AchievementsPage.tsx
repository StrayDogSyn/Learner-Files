// Temporary stub for AchievementsPage
import React, { useState } from 'react';
import { Award, Star, Trophy, Target, Zap, Crown, Shield, Flame } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'gameplay' | 'social' | 'progression' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedDate?: string;
  reward: string;
}

const AchievementsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first game',
      icon: <Target className="w-6 h-6" />,
      category: 'progression',
      rarity: 'common',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedDate: '2024-01-10',
      reward: '100 XP'
    },
    {
      id: '2',
      title: 'Speed Demon',
      description: 'Complete Calculator Challenge in under 2 minutes',
      icon: <Zap className="w-6 h-6" />,
      category: 'gameplay',
      rarity: 'rare',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedDate: '2024-01-12',
      reward: '500 XP + Speed Badge'
    },
    {
      id: '3',
      title: 'Quiz Master',
      description: 'Answer 100 quiz questions correctly',
      icon: <Crown className="w-6 h-6" />,
      category: 'gameplay',
      rarity: 'epic',
      progress: 87,
      maxProgress: 100,
      unlocked: false,
      reward: '1000 XP + Master Badge'
    },
    {
      id: '4',
      title: 'Social Butterfly',
      description: 'Share your score 10 times',
      icon: <Star className="w-6 h-6" />,
      category: 'social',
      rarity: 'common',
      progress: 3,
      maxProgress: 10,
      unlocked: false,
      reward: '200 XP'
    },
    {
      id: '5',
      title: 'Legendary Player',
      description: 'Reach the top 10 in global leaderboard',
      icon: <Trophy className="w-6 h-6" />,
      category: 'special',
      rarity: 'legendary',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      reward: '5000 XP + Legendary Badge'
    },
    {
      id: '6',
      title: 'Streak Master',
      description: 'Maintain a 7-day playing streak',
      icon: <Flame className="w-6 h-6" />,
      category: 'progression',
      rarity: 'rare',
      progress: 4,
      maxProgress: 7,
      unlocked: false,
      reward: '750 XP + Streak Badge'
    },
    {
      id: '7',
      title: 'Guardian',
      description: 'Help 5 new players complete their first game',
      icon: <Shield className="w-6 h-6" />,
      category: 'social',
      rarity: 'epic',
      progress: 2,
      maxProgress: 5,
      unlocked: false,
      reward: '1500 XP + Guardian Badge'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-300';
      case 'rare':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-300';
      case 'epic':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-300';
      case 'legendary':
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-300';
      default:
        return 'from-white/5 to-white/10 border-white/10 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gameplay':
        return <Target className="w-5 h-5" />;
      case 'social':
        return <Star className="w-5 h-5" />;
      case 'progression':
        return <Trophy className="w-5 h-5" />;
      case 'special':
        return <Crown className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
      return false;
    }
    if (showUnlockedOnly && !achievement.unlocked) {
      return false;
    }
    return true;
  });

  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const completionPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Achievements</h1>
          </div>
          
          <p className="text-gray-300 mb-8">
            Unlock achievements by completing challenges and reaching milestones in our games.
          </p>
          
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-lg font-semibold text-white">Progress</span>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{completionPercentage}%</div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Star className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-semibold text-white">Unlocked</span>
              </div>
              <div className="text-3xl font-bold text-blue-400">{unlockedAchievements}</div>
              <div className="text-sm text-gray-400">of {totalAchievements} total</div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-semibold text-white">Rare+</span>
              </div>
              <div className="text-3xl font-bold text-purple-400">
                {achievements.filter(a => a.unlocked && (a.rarity === 'rare' || a.rarity === 'epic' || a.rarity === 'legendary')).length}
              </div>
              <div className="text-sm text-gray-400">rare achievements</div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="w-6 h-6 text-green-400" />
                <span className="text-lg font-semibold text-white">Total XP</span>
              </div>
              <div className="text-3xl font-bold text-green-400">2,350</div>
              <div className="text-sm text-gray-400">experience points</div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="gameplay">Gameplay</option>
              <option value="social">Social</option>
              <option value="progression">Progression</option>
              <option value="special">Special</option>
            </select>
            
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={showUnlockedOnly}
                onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
              />
              <span>Show unlocked only</span>
            </label>
          </div>
          
          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`glass-card p-6 bg-gradient-to-br border transition-all duration-300 hover:scale-105 ${
                  achievement.unlocked ? getRarityColor(achievement.rarity) : 'from-white/5 to-white/10 border-white/10 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    achievement.unlocked 
                      ? 'bg-white/20' 
                      : 'bg-white/10'
                  }`}>
                    <div className={achievement.unlocked ? 'text-white' : 'text-gray-500'}>
                      {achievement.icon}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(achievement.category)}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      achievement.unlocked 
                        ? getRarityColor(achievement.rarity).split(' ')[2] + ' bg-current/20'
                        : 'text-gray-500 bg-gray-500/20'
                    }`}>
                      {achievement.rarity}
                    </span>
                  </div>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 ${
                  achievement.unlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {achievement.title}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  achievement.unlocked ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                
                {!achievement.unlocked && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className={`text-sm ${
                    achievement.unlocked ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {achievement.unlocked ? 'Unlocked' : 'Locked'}
                  </div>
                  
                  <div className={`text-sm font-medium ${
                    achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'
                  }`}>
                    {achievement.reward}
                  </div>
                </div>
                
                {achievement.unlocked && achievement.unlockedDate && (
                  <div className="text-xs text-gray-400 mt-2">
                    Unlocked on {achievement.unlockedDate}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No achievements found</h3>
              <p className="text-gray-500">Try adjusting your filters or start playing to unlock achievements!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;