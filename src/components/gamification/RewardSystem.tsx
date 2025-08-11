import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Star, 
  Trophy, 
  Zap, 
  CheckCircle, 
  Lock, 
  Crown, 
  Sparkles,
  Target,
  Award,
  Gem,
  Medal
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface PortfolioSection {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  completed: boolean;
  icon: React.ReactNode;
  category: 'exploration' | 'interaction' | 'engagement' | 'mastery';
  requirements?: string[];
}

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'badge' | 'title' | 'xp_multiplier' | 'unlock' | 'cosmetic';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: React.ReactNode;
  requirement: {
    type: 'sections_completed' | 'total_xp' | 'achievements' | 'streak';
    value: number;
  };
  unlocked: boolean;
  dateUnlocked?: Date;
}

export const RewardSystem: React.FC = () => {
  const [portfolioSections, setPortfolioSections] = useState<PortfolioSection[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showRewardModal, setShowRewardModal] = useState<Reward | null>(null);
  const { userProgress, addXP, addAchievement, achievements } = useGameStore();

  // Initialize portfolio sections
  useEffect(() => {
    const sections: PortfolioSection[] = [
      {
        id: 'home-visit',
        name: 'Portfolio Explorer',
        description: 'Visit the main portfolio page',
        xpReward: 25,
        completed: false,
        icon: <Star className="w-5 h-5" />,
        category: 'exploration'
      },
      {
        id: 'about-read',
        name: 'Getting to Know Me',
        description: 'Read the about section',
        xpReward: 50,
        completed: false,
        icon: <Target className="w-5 h-5" />,
        category: 'exploration'
      },
      {
        id: 'projects-browse',
        name: 'Project Browser',
        description: 'Browse through project showcase',
        xpReward: 75,
        completed: false,
        icon: <Trophy className="w-5 h-5" />,
        category: 'exploration'
      },
      {
        id: 'game-play',
        name: 'Game Master',
        description: 'Play any interactive game',
        xpReward: 100,
        completed: false,
        icon: <Zap className="w-5 h-5" />,
        category: 'interaction'
      },
      {
        id: 'code-challenge',
        name: 'Code Warrior',
        description: 'Complete a coding challenge',
        xpReward: 150,
        completed: false,
        icon: <Medal className="w-5 h-5" />,
        category: 'interaction'
      },
      {
        id: 'contact-engage',
        name: 'Connection Maker',
        description: 'Use the contact form or social links',
        xpReward: 75,
        completed: false,
        icon: <Gift className="w-5 h-5" />,
        category: 'engagement'
      },
      {
        id: 'share-portfolio',
        name: 'Portfolio Ambassador',
        description: 'Share portfolio on social media',
        xpReward: 125,
        completed: false,
        icon: <Crown className="w-5 h-5" />,
        category: 'engagement'
      },
      {
        id: 'return-visitor',
        name: 'Loyal Visitor',
        description: 'Return to the portfolio multiple times',
        xpReward: 200,
        completed: false,
        icon: <Gem className="w-5 h-5" />,
        category: 'engagement'
      },
      {
        id: 'full-exploration',
        name: 'Portfolio Master',
        description: 'Complete all sections and interactions',
        xpReward: 500,
        completed: false,
        icon: <Sparkles className="w-5 h-5" />,
        category: 'mastery',
        requirements: ['home-visit', 'about-read', 'projects-browse', 'game-play', 'code-challenge']
      }
    ];
    setPortfolioSections(sections);
  }, []);

  // Initialize rewards
  useEffect(() => {
    const rewardsList: Reward[] = [
      {
        id: 'first-steps',
        title: 'First Steps',
        description: 'Complete your first portfolio section',
        type: 'badge',
        rarity: 'common',
        icon: <Star className="w-6 h-6" />,
        requirement: { type: 'sections_completed', value: 1 },
        unlocked: false
      },
      {
        id: 'explorer',
        title: 'Portfolio Explorer',
        description: 'Complete 3 portfolio sections',
        type: 'badge',
        rarity: 'common',
        icon: <Target className="w-6 h-6" />,
        requirement: { type: 'sections_completed', value: 3 },
        unlocked: false
      },
      {
        id: 'dedicated-visitor',
        title: 'Dedicated Visitor',
        description: 'Complete 5 portfolio sections',
        type: 'title',
        rarity: 'rare',
        icon: <Trophy className="w-6 h-6" />,
        requirement: { type: 'sections_completed', value: 5 },
        unlocked: false
      },
      {
        id: 'xp-hunter',
        title: 'XP Hunter',
        description: 'Earn 500 total XP',
        type: 'xp_multiplier',
        rarity: 'rare',
        icon: <Zap className="w-6 h-6" />,
        requirement: { type: 'total_xp', value: 500 },
        unlocked: false
      },
      {
        id: 'achievement-collector',
        title: 'Achievement Collector',
        description: 'Unlock 10 achievements',
        type: 'badge',
        rarity: 'epic',
        icon: <Award className="w-6 h-6" />,
        requirement: { type: 'achievements', value: 10 },
        unlocked: false
      },
      {
        id: 'portfolio-legend',
        title: 'Portfolio Legend',
        description: 'Complete all portfolio sections',
        type: 'title',
        rarity: 'legendary',
        icon: <Crown className="w-6 h-6" />,
        requirement: { type: 'sections_completed', value: portfolioSections.length },
        unlocked: false
      }
    ];
    setRewards(rewardsList);
  }, [portfolioSections.length]);

  // Check for completed sections and unlock rewards
  useEffect(() => {
    const completedSections = portfolioSections.filter(s => s.completed).length;
    const totalXP = userProgress.totalXP;
    const unlockedAchievements = achievements.filter(a => a.unlocked).length;

    setRewards(prev => prev.map(reward => {
      if (reward.unlocked) return reward;

      let shouldUnlock = false;
      switch (reward.requirement.type) {
        case 'sections_completed':
          shouldUnlock = completedSections >= reward.requirement.value;
          break;
        case 'total_xp':
          shouldUnlock = totalXP >= reward.requirement.value;
          break;
        case 'achievements':
          shouldUnlock = unlockedAchievements >= reward.requirement.value;
          break;
      }

      if (shouldUnlock && !reward.unlocked) {
        setShowRewardModal(reward);
        return { ...reward, unlocked: true, dateUnlocked: new Date() };
      }

      return reward;
    }));
  }, [portfolioSections, userProgress.totalXP, achievements]);

  const completeSection = (sectionId: string) => {
    setPortfolioSections(prev => prev.map(section => {
      if (section.id === sectionId && !section.completed) {
        addXP(section.xpReward);
        addAchievement({
          id: `section-${sectionId}`,
          title: section.name,
          description: section.description,
          icon: '🎯',
          rarity: 'common'
        });
        return { ...section, completed: true };
      }
      return section;
    }));
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const categories = [
    { id: 'all', label: 'All Sections' },
    { id: 'exploration', label: 'Exploration' },
    { id: 'interaction', label: 'Interaction' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'mastery', label: 'Mastery' }
  ];

  const filteredSections = selectedCategory === 'all' 
    ? portfolioSections 
    : portfolioSections.filter(section => section.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Gift className="text-purple-400" />
            Portfolio Rewards
            <Sparkles className="text-yellow-400" />
          </h1>
          <p className="text-gray-300 text-lg">
            Explore the portfolio and earn rewards for your engagement!
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-green-400">
              {portfolioSections.filter(s => s.completed).length}
            </div>
            <div className="text-sm text-gray-300">Sections Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {portfolioSections.length - portfolioSections.filter(s => s.completed).length}
            </div>
            <div className="text-sm text-gray-300">Sections Remaining</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {rewards.filter(r => r.unlocked).length}
            </div>
            <div className="text-sm text-gray-300">Rewards Unlocked</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {portfolioSections.reduce((sum, s) => sum + (s.completed ? s.xpReward : 0), 0)}
            </div>
            <div className="text-sm text-gray-300">XP Earned</div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Portfolio Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {filteredSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 ${
                section.completed ? 'bg-green-500/20 border-green-400/50' : 'hover:bg-white/20'
              } transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  section.completed ? 'bg-green-500/30 text-green-400' : 'bg-purple-500/30 text-purple-400'
                }`}>
                  {section.completed ? <CheckCircle className="w-5 h-5" /> : section.icon}
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 font-medium text-sm">+{section.xpReward} XP</div>
                  <div className="text-xs text-gray-400 capitalize">{section.category}</div>
                </div>
              </div>
              
              <h3 className={`text-lg font-bold mb-2 ${
                section.completed ? 'text-green-400' : 'text-white'
              }`}>
                {section.name}
              </h3>
              
              <p className="text-gray-300 text-sm mb-4">
                {section.description}
              </p>
              
              {section.requirements && (
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Requirements:</div>
                  <div className="space-y-1">
                    {section.requirements.map(req => {
                      const reqSection = portfolioSections.find(s => s.id === req);
                      return (
                        <div key={req} className="flex items-center gap-2 text-xs">
                          {reqSection?.completed ? (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          ) : (
                            <Lock className="w-3 h-3 text-gray-400" />
                          )}
                          <span className={reqSection?.completed ? 'text-green-400' : 'text-gray-400'}>
                            {reqSection?.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => completeSection(section.id)}
                disabled={section.completed || (section.requirements && !section.requirements.every(req => 
                  portfolioSections.find(s => s.id === req)?.completed
                ))}
                className={`w-full py-2 px-4 rounded-xl font-medium transition-all duration-300 ${
                  section.completed
                    ? 'bg-green-500/30 text-green-400 cursor-not-allowed'
                    : section.requirements && !section.requirements.every(req => 
                        portfolioSections.find(s => s.id === req)?.completed
                      )
                    ? 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-500/30 text-purple-400 hover:bg-purple-500/50'
                }`}
              >
                {section.completed ? 'Completed!' : 'Mark Complete'}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Rewards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Available Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 ${
                  reward.unlocked ? getRarityColor(reward.rarity) : 'border-gray-600'
                } transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    reward.unlocked ? getRarityColor(reward.rarity).replace('text-', 'bg-').replace('border-', '').replace('-400', '-500/30 text-') + '-400' : 'bg-gray-500/30 text-gray-400'
                  }`}>
                    {reward.unlocked ? reward.icon : <Lock className="w-6 h-6" />}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full border ${
                    getRarityColor(reward.rarity)
                  } capitalize`}>
                    {reward.rarity}
                  </div>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 ${
                  reward.unlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {reward.title}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  reward.unlocked ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {reward.description}
                </p>
                
                <div className={`text-xs ${
                  reward.unlocked ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {reward.unlocked ? (
                    `Unlocked ${reward.dateUnlocked?.toLocaleDateString()}`
                  ) : (
                    `Requirement: ${reward.requirement.type.replace('_', ' ')} ${reward.requirement.value}`
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reward Unlock Modal */}
      <AnimatePresence>
        {showRewardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRewardModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <div className={`inline-flex p-4 rounded-full mb-4 ${
                  getRarityColor(showRewardModal.rarity).replace('text-', 'bg-').replace('border-', '').replace('-400', '-500/30')
                }`}>
                  {showRewardModal.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Reward Unlocked!</h2>
                <h3 className={`text-xl font-bold mb-2 ${getRarityColor(showRewardModal.rarity).split(' ')[0]}`}>
                  {showRewardModal.title}
                </h3>
                <p className="text-gray-300">{showRewardModal.description}</p>
              </div>
              
              <button
                onClick={() => setShowRewardModal(null)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardSystem;