import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Twitter, Facebook, Linkedin, Link, Download, Copy, Check, Trophy, Star, Zap, Crown } from 'lucide-react';
import { useGameStore, Achievement } from '../../store/gameStore';

interface ShareableContent {
  type: 'achievement' | 'milestone' | 'challenge' | 'level';
  title: string;
  description: string;
  icon: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
  achievement?: Achievement;
  customMessage?: string;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  shareUrl: (content: ShareableContent) => string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <Twitter className="w-5 h-5" />,
    color: 'bg-blue-500 hover:bg-blue-600',
    shareUrl: (content) => {
      const text = `🎉 ${content.title}\n${content.description}\n\nCheck out this interactive portfolio!`;
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    }
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    color: 'bg-blue-700 hover:bg-blue-800',
    shareUrl: (content) => {
      const text = `${content.title} - ${content.description}`;
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(text)}`;
    }
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
    color: 'bg-blue-600 hover:bg-blue-700',
    shareUrl: (content) => {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(content.title + ' - ' + content.description)}`;
    }
  }
];

interface SocialSharingProps {
  content?: ShareableContent;
  onClose?: () => void;
  className?: string;
}

export const SocialSharing: React.FC<SocialSharingProps> = ({ content, onClose, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { shareAchievement, addXP } = useGameStore();

  // Default content if none provided
  const defaultContent: ShareableContent = {
    type: 'milestone',
    title: 'Check out this Interactive Portfolio!',
    description: 'Exploring an amazing developer portfolio with gamification elements and coding challenges.',
    icon: '🚀',
    stats: [
      { label: 'Interactive Features', value: '10+' },
      { label: 'Coding Challenges', value: '15+' },
      { label: 'Mini Games', value: '5+' }
    ]
  };

  const shareContent = content || defaultContent;

  const generateShareText = (platform?: string) => {
    const baseText = customMessage || `🎉 ${shareContent.title}\n${shareContent.description}`;
    
    if (shareContent.stats && shareContent.stats.length > 0) {
      const statsText = shareContent.stats.map(stat => `${stat.label}: ${stat.value}`).join(' | ');
      return `${baseText}\n\n📊 ${statsText}\n\nCheck out this interactive portfolio!`;
    }
    
    return `${baseText}\n\nCheck out this interactive portfolio!`;
  };

  const handlePlatformShare = async (platform: SocialPlatform) => {
    setSelectedPlatform(platform.id);
    
    // Track sharing action
    if (shareContent.achievement) {
      shareAchievement(shareContent.achievement.id);
    }
    addXP(25, 'Shared content on social media');
    
    // Open share URL
    const shareUrl = platform.shareUrl(shareContent);
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    setTimeout(() => setSelectedPlatform(null), 1000);
  };

  const handleCopyLink = async () => {
    try {
      const shareText = generateShareText();
      const fullText = `${shareText}\n\n🔗 ${window.location.href}`;
      
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      addXP(10, 'Copied share link');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareContent.title,
          text: shareContent.description,
          url: window.location.href
        });
        
        if (shareContent.achievement) {
          shareAchievement(shareContent.achievement.id);
        }
        addXP(25, 'Shared via native sharing');
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    }
  };

  const generateShareImage = () => {
    // This would generate a custom share image with the achievement/content
    // For now, we'll simulate this functionality
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 1200;
    canvas.height = 630;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#7c3aed');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(shareContent.title, canvas.width / 2, 200);
    
    // Description
    ctx.font = '32px Arial';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(shareContent.description, canvas.width / 2, 280);
    
    // Icon/Emoji
    ctx.font = '120px Arial';
    ctx.fillText(shareContent.icon, canvas.width / 2, 420);
    
    // Stats
    if (shareContent.stats) {
      ctx.font = '24px Arial';
      ctx.fillStyle = '#94a3b8';
      const statsText = shareContent.stats.map(stat => `${stat.label}: ${stat.value}`).join(' • ');
      ctx.fillText(statsText, canvas.width / 2, 520);
    }
    
    // Download the image
    const link = document.createElement('a');
    link.download = `${shareContent.title.replace(/\s+/g, '_')}_share.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    addXP(15, 'Generated share image');
  };

  const getTypeIcon = () => {
    switch (shareContent.type) {
      case 'achievement':
        return <Trophy className="text-yellow-400" />;
      case 'level':
        return <Crown className="text-purple-400" />;
      case 'challenge':
        return <Zap className="text-blue-400" />;
      default:
        return <Star className="text-green-400" />;
    }
  };

  const getTypeColor = () => {
    switch (shareContent.type) {
      case 'achievement':
        return 'from-yellow-500 to-orange-500';
      case 'level':
        return 'from-purple-500 to-pink-500';
      case 'challenge':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Share2 className="text-blue-400" size={24} />
          <h2 className="text-white text-xl font-bold">Share Your Achievement</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Content Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${getTypeColor()} p-6 rounded-xl mb-6 text-white`}
      >
        <div className="flex items-center gap-4 mb-4">
          {getTypeIcon()}
          <div>
            <h3 className="text-xl font-bold">{shareContent.title}</h3>
            <p className="text-white/80">{shareContent.description}</p>
          </div>
          <div className="text-4xl ml-auto">{shareContent.icon}</div>
        </div>
        
        {shareContent.stats && shareContent.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {shareContent.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Custom Message */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-2">Custom Message (Optional)</label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Add your own message to the share..."
          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
          rows={3}
        />
      </div>

      {/* Share Buttons */}
      <div className="space-y-4">
        {/* Social Platforms */}
        <div>
          <h3 className="text-white font-medium mb-3">Share on Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SOCIAL_PLATFORMS.map(platform => (
              <motion.button
                key={platform.id}
                onClick={() => handlePlatformShare(platform)}
                disabled={selectedPlatform === platform.id}
                className={`${platform.color} text-white p-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedPlatform === platform.id ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.div>
                ) : (
                  platform.icon
                )}
                {platform.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-white font-medium mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Native Share */}
            {navigator.share && (
              <button
                onClick={handleNativeShare}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Native Share
              </button>
            )}
            
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Text
                </>
              )}
            </button>
            
            {/* Generate Image */}
            <button
              onClick={generateShareImage}
              className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Save Image
            </button>
          </div>
        </div>

        {/* Advanced Options */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            <Link className="w-4 h-4" />
            Advanced Options
          </button>
          
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="space-y-3">
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Share URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={window.location.href}
                        readOnly
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Generated Text</label>
                    <textarea
                      value={generateShareText()}
                      readOnly
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Hook for easy sharing from other components
export const useSharing = () => {
  const { shareAchievement, addXP } = useGameStore();
  
  const shareAchievementContent = (achievement: Achievement) => {
    const content: ShareableContent = {
      type: 'achievement',
      title: `Achievement Unlocked: ${achievement.title}`,
      description: achievement.description,
      icon: achievement.icon,
      achievement,
      stats: [
        { label: 'XP Earned', value: achievement.xpReward },
        { label: 'Rarity', value: achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1) }
      ]
    };
    
    return content;
  };
  
  const shareLevelUp = (level: number, totalXP: number) => {
    const content: ShareableContent = {
      type: 'level',
      title: `Level Up! Reached Level ${level}`,
      description: `Just leveled up in this amazing interactive portfolio!`,
      icon: '🎉',
      stats: [
        { label: 'Current Level', value: level },
        { label: 'Total XP', value: totalXP.toLocaleString() }
      ]
    };
    
    return content;
  };
  
  const shareChallengeCompletion = (challengeName: string, time: number, score: number) => {
    const content: ShareableContent = {
      type: 'challenge',
      title: `Challenge Completed: ${challengeName}`,
      description: `Just solved a coding challenge with an awesome score!`,
      icon: '💻',
      stats: [
        { label: 'Time', value: `${time}s` },
        { label: 'Score', value: score },
        { label: 'Challenge', value: challengeName }
      ]
    };
    
    return content;
  };
  
  return {
    shareAchievementContent,
    shareLevelUp,
    shareChallengeCompletion
  };
};

export default SocialSharing;