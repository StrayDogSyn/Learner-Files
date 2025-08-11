import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Crown, Zap, Target, Clock, Share2, Lock } from 'lucide-react';
import { useGameStore, Achievement, Badge } from '../../store/gameStore';

interface AchievementCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  {
    id: 'exploration',
    name: 'Exploration',
    icon: <Target className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    description: 'Discover different sections of the portfolio'
  },
  {
    id: 'coding',
    name: 'Coding',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    description: 'Complete coding challenges and assessments'
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: <Star className="w-6 h-6" />,
    color: 'from-purple-500 to-violet-500',
    description: 'Engage with educational content'
  },
  {
    id: 'social',
    name: 'Social',
    icon: <Share2 className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-500',
    description: 'Share achievements and interact socially'
  },
  {
    id: 'mastery',
    name: 'Mastery',
    icon: <Crown className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    description: 'Demonstrate advanced skills and expertise'
  }
];

const RARITY_CONFIG = {
  common: {
    color: 'from-gray-400 to-gray-600',
    textColor: 'text-gray-300',
    borderColor: 'border-gray-500',
    bgColor: 'bg-gray-500/10',
    name: 'Common'
  },
  rare: {
    color: 'from-blue-400 to-blue-600',
    textColor: 'text-blue-300',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
    name: 'Rare'
  },
  epic: {
    color: 'from-purple-400 to-purple-600',
    textColor: 'text-purple-300',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-500/10',
    name: 'Epic'
  },
  legendary: {
    color: 'from-yellow-400 to-orange-600',
    textColor: 'text-yellow-300',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-500/10',
    name: 'Legendary'
  }
};

export const AchievementSystem: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showNotification, setShowNotification] = useState<Achievement | null>(null);
  
  const {
    achievements,
    unlockedAchievements,
    badges,
    level,
    xp,
    xpToNextLevel,
    totalXP,
    getAchievementsByRarity,
    getRecentAchievements,
    shareAchievement
  } = useGameStore();

  // Filter achievements based on selected filters
  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || 
      achievement.id.includes(selectedCategory) ||
      (selectedCategory === 'exploration' && ['welcome', 'first-visit', 'section-explorer', 'time-traveler'].includes(achievement.id)) ||
      (selectedCategory === 'coding' && ['first-algorithm', 'algorithm-master', 'first-code-run', 'code-saver', 'first-problem-solved', 'speed-demon'].includes(achievement.id)) ||
      (selectedCategory === 'learning' && ['first-assessment', 'perfect-score', 'streak-master'].includes(achievement.id)) ||
      (selectedCategory === 'social' && ['code-sharer', 'code-evangelist'].includes(achievement.id)) ||
      (selectedCategory === 'mastery' && ['challenge-master', 'algorithm-expert', 'high-scorer'].includes(achievement.id));
    
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    const unlockedMatch = !showUnlockedOnly || unlockedAchievements.includes(achievement.id);
    
    return categoryMatch && rarityMatch && unlockedMatch;
  });

  // Calculate statistics
  const totalAchievements = achievements.length;
  const unlockedCount = unlockedAchievements.length;
  const completionPercentage = (unlockedCount / totalAchievements) * 100;
  
  const rarityStats = {
    common: getAchievementsByRarity('common').length,
    rare: getAchievementsByRarity('rare').length,
    epic: getAchievementsByRarity('epic').length,
    legendary: getAchievementsByRarity('legendary').length
  };

  const recentAchievements = getRecentAchievements(3);

  // Listen for new achievements (simulated)
  useEffect(() => {
    const lastUnlocked = achievements.find(a => 
      unlockedAchievements.includes(a.id) && 
      a.unlockedAt && 
      Date.now() - new Date(a.unlockedAt).getTime() < 5000
    );
    
    if (lastUnlocked && !showNotification) {
      setShowNotification(lastUnlocked);
      setTimeout(() => setShowNotification(null), 4000);
    }
  }, [unlockedAchievements, achievements, showNotification]);

  const handleShareAchievement = async (achievement: Achievement) => {
    shareAchievement(achievement.id);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Achievement Unlocked: ${achievement.title}`,
          text: `I just unlocked "${achievement.title}" - ${achievement.description}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `🏆 Achievement Unlocked: ${achievement.title}\n${achievement.description}\n\nCheck out this interactive portfolio!`;
      navigator.clipboard.writeText(text);
      alert('Achievement details copied to clipboard!');
    }
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
            Achievement System
            <Award className="text-purple-400" />
          </h1>
          <p className="text-gray-300 text-lg">
            Track your progress and unlock achievements as you explore
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Level Progress */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                  <div className="bg-slate-900 rounded-full w-full h-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{level}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-white font-medium">Level</h3>
              <p className="text-gray-400 text-sm">{xpToNextLevel} XP to next</p>
            </div>

            {/* Total XP */}
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{totalXP.toLocaleString()}</div>
              <h3 className="text-white font-medium">Total XP</h3>
              <p className="text-gray-400 text-sm">Experience Points</p>
            </div>

            {/* Achievements */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{unlockedCount}/{totalAchievements}</div>
              <h3 className="text-white font-medium">Achievements</h3>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-gray-400 text-sm mt-1">{completionPercentage.toFixed(1)}% Complete</p>
            </div>

            {/* Badges */}
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{badges.length}</div>
              <h3 className="text-white font-medium">Badges</h3>
              <p className="text-gray-400 text-sm">Earned Badges</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
          >
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="text-blue-400" />
              Recent Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentAchievements.map(achievement => {
                const rarity = RARITY_CONFIG[achievement.rarity];
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`${rarity.bgColor} border ${rarity.borderColor} rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform`}
                    onClick={() => setSelectedAchievement(achievement)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{achievement.icon}</div>
                      <h3 className="text-white font-medium text-sm">{achievement.title}</h3>
                      <p className={`text-xs ${rarity.textColor} mt-1`}>{rarity.name}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-white text-xl font-bold mb-4">Filters</h2>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  All Categories
                </button>
                {ACHIEVEMENT_CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedCategory === category.id ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rarity Filter */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3">Rarity</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedRarity('all')}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    selectedRarity === 'all' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  All Rarities
                </button>
                {Object.entries(RARITY_CONFIG).map(([rarity, config]) => (
                  <button
                    key={rarity}
                    onClick={() => setSelectedRarity(rarity)}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedRarity === rarity ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className={config.textColor}>{config.name}</span>
                    <span className="text-xs">{rarityStats[rarity as keyof typeof rarityStats]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Show Unlocked Only */}
            <div>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnlockedOnly}
                  onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                  className="rounded"
                />
                <span>Show unlocked only</span>
              </label>
            </div>
          </motion.div>

          {/* Achievements Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredAchievements.map(achievement => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id);
                  const rarity = RARITY_CONFIG[achievement.rarity];
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border cursor-pointer transition-all hover:scale-105 ${
                        isUnlocked ? rarity.borderColor : 'border-gray-600'
                      } ${isUnlocked ? '' : 'opacity-60'}`}
                      onClick={() => setSelectedAchievement(achievement)}
                    >
                      {/* Rarity Indicator */}
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                        isUnlocked ? rarity.bgColor : 'bg-gray-500/20'
                      } ${isUnlocked ? rarity.textColor : 'text-gray-400'}`}>
                        {rarity.name}
                      </div>

                      {/* Lock Overlay */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                          <Lock className="text-gray-400" size={32} />
                        </div>
                      )}

                      <div className="text-center">
                        <div className="text-4xl mb-3">{achievement.icon}</div>
                        <h3 className={`font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm mb-3 ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>
                        
                        {/* Progress Bar for Progressive Achievements */}
                        {achievement.maxProgress && achievement.maxProgress > 1 && (
                          <div className="mb-3">
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  isUnlocked ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-600'
                                }`}
                                style={{ width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {achievement.progress || 0} / {achievement.maxProgress}
                            </p>
                          </div>
                        )}
                        
                        {isUnlocked && achievement.unlockedAt && (
                          <p className="text-xs text-gray-400">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Achievement Detail Modal */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{selectedAchievement.icon}</div>
                  <h2 className="text-white text-2xl font-bold mb-2">{selectedAchievement.title}</h2>
                  <p className="text-gray-300 mb-4">{selectedAchievement.description}</p>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    RARITY_CONFIG[selectedAchievement.rarity].bgColor
                  } ${RARITY_CONFIG[selectedAchievement.rarity].textColor}`}>
                    {RARITY_CONFIG[selectedAchievement.rarity].name}
                  </div>
                  
                  {unlockedAchievements.includes(selectedAchievement.id) && (
                    <div className="space-y-3">
                      {selectedAchievement.unlockedAt && (
                        <p className="text-gray-400 text-sm">
                          Unlocked on {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                      
                      <button
                        onClick={() => handleShareAchievement(selectedAchievement)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
                      >
                        <Share2 size={16} />
                        Share Achievement
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievement Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 0.8 }}
              className="fixed top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
            >
              <div className="flex items-center gap-3">
                <Trophy className="text-white" size={24} />
                <div>
                  <h3 className="font-bold">Achievement Unlocked!</h3>
                  <p className="text-sm">{showNotification.title}</p>
                </div>
                <div className="text-2xl">{showNotification.icon}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AchievementSystem;