import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Clock,
  Target,
  Flame,
  Shield,
  Star,
  Shuffle,
  TrendingUp,
  Brain,
  Gamepad2,
  Timer,
  Award,
  Lightning,
  Swords,
  Eye,
  Dice1,
  Dice6
} from 'lucide-react';
import {
  GameMode,
  GameModeSettings,
  ChallengeVariant,
  SpeedRoundSettings,
  SurvivalModeSettings,
  BlitzModeSettings,
  PuzzleModeSettings
} from '../../types/knucklebones';

interface GameModesProps {
  onModeSelect: (mode: GameMode, settings: GameModeSettings) => void;
  onChallengeStart: (challenge: ChallengeVariant) => void;
  currentMode?: GameMode;
  className?: string;
}

interface ModeCardProps {
  mode: GameMode;
  isSelected: boolean;
  onSelect: () => void;
  onConfigure: () => void;
}

interface SpeedRoundConfigProps {
  settings: SpeedRoundSettings;
  onSettingsChange: (settings: SpeedRoundSettings) => void;
  onStart: () => void;
  onCancel: () => void;
}

interface ChallengeConfigProps {
  challenge: ChallengeVariant;
  onStart: () => void;
  onCancel: () => void;
}

const GAME_MODES: GameMode[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional Knucklebones gameplay with standard rules',
    icon: 'dice',
    difficulty: 'beginner',
    estimatedDuration: 300,
    features: ['Turn-based', 'Standard scoring', 'No time pressure'],
    unlockRequirement: null
  },
  {
    id: 'speed_round',
    name: 'Speed Round',
    description: 'Fast-paced games with time limits on each turn',
    icon: 'zap',
    difficulty: 'intermediate',
    estimatedDuration: 180,
    features: ['Time pressure', 'Quick decisions', 'Bonus points for speed'],
    unlockRequirement: { type: 'wins', value: 5 }
  },
  {
    id: 'blitz',
    name: 'Blitz Mode',
    description: 'Ultra-fast games with simultaneous play',
    icon: 'lightning',
    difficulty: 'advanced',
    estimatedDuration: 120,
    features: ['Simultaneous turns', 'Real-time action', 'Reflex-based'],
    unlockRequirement: { type: 'rating', value: 1500 }
  },
  {
    id: 'survival',
    name: 'Survival',
    description: 'Endless mode where difficulty increases over time',
    icon: 'shield',
    difficulty: 'expert',
    estimatedDuration: 600,
    features: ['Endless gameplay', 'Increasing difficulty', 'High score tracking'],
    unlockRequirement: { type: 'streak', value: 10 }
  },
  {
    id: 'puzzle',
    name: 'Puzzle Mode',
    description: 'Solve specific board configurations and challenges',
    icon: 'brain',
    difficulty: 'varied',
    estimatedDuration: 240,
    features: ['Logic puzzles', 'Predetermined scenarios', 'Star ratings'],
    unlockRequirement: { type: 'achievements', value: 3 }
  },
  {
    id: 'tournament',
    name: 'Tournament',
    description: 'Competitive bracket-style elimination matches',
    icon: 'trophy',
    difficulty: 'expert',
    estimatedDuration: 900,
    features: ['Bracket system', 'Multiple rounds', 'Prize pools'],
    unlockRequirement: { type: 'rating', value: 1200 }
  }
];

const CHALLENGE_VARIANTS: ChallengeVariant[] = [
  {
    id: 'perfect_game',
    name: 'Perfect Game',
    description: 'Win without losing a single round',
    icon: 'star',
    difficulty: 'expert',
    objectives: ['Win all rounds', 'No losses allowed', 'Maintain perfect score'],
    rewards: { xp: 500, title: 'Perfectionist', badge: 'perfect_game' },
    timeLimit: 600,
    attempts: 3
  },
  {
    id: 'comeback_king',
    name: 'Comeback King',
    description: 'Win after being behind by 50+ points',
    icon: 'trending-up',
    difficulty: 'advanced',
    objectives: ['Fall behind by 50+ points', 'Come back to win', 'Maintain composure'],
    rewards: { xp: 300, title: 'Comeback King', badge: 'comeback' },
    timeLimit: 480,
    attempts: 5
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Win 5 games in under 10 minutes total',
    icon: 'zap',
    difficulty: 'intermediate',
    objectives: ['Win 5 consecutive games', 'Total time under 10 minutes', 'No losses'],
    rewards: { xp: 250, title: 'Speed Demon', badge: 'speed' },
    timeLimit: 600,
    attempts: 3
  },
  {
    id: 'dice_master',
    name: 'Dice Master',
    description: 'Achieve specific dice combinations in sequence',
    icon: 'dice-6',
    difficulty: 'advanced',
    objectives: ['Roll triple 6s', 'Roll sequential numbers', 'Roll all same numbers'],
    rewards: { xp: 400, title: 'Dice Master', badge: 'dice_master' },
    timeLimit: 900,
    attempts: 5
  },
  {
    id: 'strategist',
    name: 'Master Strategist',
    description: 'Win using only calculated moves (no random plays)',
    icon: 'brain',
    difficulty: 'expert',
    objectives: ['Use AI-recommended moves only', 'Win with 90%+ efficiency', 'No random decisions'],
    rewards: { xp: 600, title: 'Master Strategist', badge: 'strategist' },
    timeLimit: 720,
    attempts: 2
  }
];

const ModeCard: React.FC<ModeCardProps> = ({ mode, isSelected, onSelect, onConfigure }) => {
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      dice: Dice1,
      zap: Zap,
      lightning: Lightning,
      shield: Shield,
      brain: Brain,
      trophy: Award
    };
    const IconComponent = iconMap[iconName] || Gamepad2;
    return <IconComponent className="w-6 h-6" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      case 'varied': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const isUnlocked = !mode.unlockRequirement; // Simplified for demo

  return (
    <motion.div
      className={`relative p-6 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-blue-500/20 border-blue-400 ring-2 ring-blue-400/50'
          : isUnlocked
          ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
          : 'bg-gray-500/10 border-gray-500/20 opacity-60'
      }`}
      onClick={isUnlocked ? onSelect : undefined}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="text-center text-white">
            <Shield className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Locked</p>
            <p className="text-xs opacity-80">
              {mode.unlockRequirement?.type}: {mode.unlockRequirement?.value}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isSelected ? 'bg-blue-500/30' : 'bg-white/10'
          }`}>
            {getIcon(mode.icon)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{mode.name}</h3>
            <p className={`text-sm font-medium ${getDifficultyColor(mode.difficulty)}`}>
              {mode.difficulty.charAt(0).toUpperCase() + mode.difficulty.slice(1)}
            </p>
          </div>
        </div>
        
        <div className="text-right text-sm text-white/60">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {Math.floor(mode.estimatedDuration / 60)}m
          </div>
        </div>
      </div>

      <p className="text-white/80 text-sm mb-4">{mode.description}</p>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-white/90 mb-2">Features:</h4>
          <div className="flex flex-wrap gap-1">
            {mode.features.map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {isSelected && isUnlocked && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onConfigure();
            }}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Configure & Start
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const SpeedRoundConfig: React.FC<SpeedRoundConfigProps> = ({
  settings,
  onSettingsChange,
  onStart,
  onCancel
}) => {
  const handleSettingChange = (key: keyof SpeedRoundSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 max-w-md w-full mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Speed Round Settings
          </h2>
          <button
            onClick={onCancel}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Turn Time Limit: {settings.turnTimeLimit}s
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={settings.turnTimeLimit}
              onChange={(e) => handleSettingChange('turnTimeLimit', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>5s</span>
              <span>30s</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Speed Bonus Multiplier: {settings.speedBonusMultiplier}x
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={settings.speedBonusMultiplier}
              onChange={(e) => handleSettingChange('speedBonusMultiplier', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>1x</span>
              <span>3x</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Penalty for Timeout: -{settings.timeoutPenalty} points
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={settings.timeoutPenalty}
              onChange={(e) => handleSettingChange('timeoutPenalty', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>0</span>
              <span>50</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="warningEnabled"
              checked={settings.warningEnabled}
              onChange={(e) => handleSettingChange('warningEnabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
            />
            <label htmlFor="warningEnabled" className="text-sm text-white/80">
              Enable time warnings
            </label>
          </div>

          {settings.warningEnabled && (
            <div className="ml-7">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Warning at: {settings.warningThreshold}s remaining
              </label>
              <input
                type="range"
                min="1"
                max={settings.turnTimeLimit - 1}
                value={settings.warningThreshold}
                onChange={(e) => handleSettingChange('warningThreshold', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg text-white font-medium hover:from-yellow-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Start Speed Round
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ChallengeConfig: React.FC<ChallengeConfigProps> = ({ challenge, onStart, onCancel }) => {
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      star: Star,
      'trending-up': TrendingUp,
      zap: Zap,
      'dice-6': Dice6,
      brain: Brain
    };
    const IconComponent = iconMap[iconName] || Target;
    return <IconComponent className="w-6 h-6" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 max-w-lg w-full mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              {getIcon(challenge.icon)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{challenge.name}</h2>
              <p className={`text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-white/80 mb-6">{challenge.description}</p>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Objectives
            </h3>
            <div className="space-y-2">
              {challenge.objectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-2 text-white/80">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-sm">{objective}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">Time Limit</span>
              </div>
              <p className="text-lg font-bold text-yellow-400">
                {Math.floor(challenge.timeLimit / 60)}:{(challenge.timeLimit % 60).toString().padStart(2, '0')}
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Attempts</span>
              </div>
              <p className="text-lg font-bold text-blue-400">{challenge.attempts}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Rewards
            </h3>
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80">Experience Points</span>
                <span className="text-yellow-400 font-bold">+{challenge.rewards.xp} XP</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80">Title</span>
                <span className="text-purple-400 font-medium">{challenge.rewards.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Badge</span>
                <span className="text-blue-400 font-medium">{challenge.rewards.badge}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4" />
            Accept Challenge
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const GameModes: React.FC<GameModesProps> = ({
  onModeSelect,
  onChallengeStart,
  currentMode,
  className = ''
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(currentMode || null);
  const [showConfig, setShowConfig] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeVariant | null>(null);
  const [speedSettings, setSpeedSettings] = useState<SpeedRoundSettings>({
    turnTimeLimit: 15,
    speedBonusMultiplier: 1.5,
    timeoutPenalty: 10,
    warningEnabled: true,
    warningThreshold: 5
  });

  const handleModeSelect = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
  }, []);

  const handleModeConfig = useCallback(() => {
    if (!selectedMode) return;
    
    if (selectedMode.id === 'speed_round') {
      setShowConfig(true);
    } else {
      // For other modes, start immediately with default settings
      const defaultSettings: GameModeSettings = {
        mode: selectedMode.id,
        difficulty: selectedMode.difficulty,
        timeLimit: selectedMode.estimatedDuration
      };
      onModeSelect(selectedMode, defaultSettings);
    }
  }, [selectedMode, onModeSelect]);

  const handleSpeedRoundStart = useCallback(() => {
    if (!selectedMode) return;
    
    const settings: GameModeSettings = {
      mode: selectedMode.id,
      difficulty: selectedMode.difficulty,
      timeLimit: selectedMode.estimatedDuration,
      speedRoundSettings: speedSettings
    };
    
    onModeSelect(selectedMode, settings);
    setShowConfig(false);
  }, [selectedMode, speedSettings, onModeSelect]);

  const handleChallengeSelect = useCallback((challenge: ChallengeVariant) => {
    setSelectedChallenge(challenge);
  }, []);

  const handleChallengeStart = useCallback(() => {
    if (!selectedChallenge) return;
    
    onChallengeStart(selectedChallenge);
    setSelectedChallenge(null);
    setShowChallenges(false);
  }, [selectedChallenge, onChallengeStart]);

  const availableModes = useMemo(() => {
    // Filter modes based on unlock requirements (simplified for demo)
    return GAME_MODES;
  }, []);

  const availableChallenges = useMemo(() => {
    // Filter challenges based on unlock requirements (simplified for demo)
    return CHALLENGE_VARIANTS;
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-blue-400" />
          Game Modes
        </h2>
        
        <button
          onClick={() => setShowChallenges(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-700 transition-all flex items-center gap-2"
        >
          <Flame className="w-4 h-4" />
          Challenges
        </button>
      </div>

      {/* Mode Selection */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableModes.map(mode => (
          <ModeCard
            key={mode.id}
            mode={mode}
            isSelected={selectedMode?.id === mode.id}
            onSelect={() => handleModeSelect(mode)}
            onConfigure={handleModeConfig}
          />
        ))}
      </div>

      {/* Current Mode Info */}
      {selectedMode && (
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Selected: {selectedMode.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Difficulty</span>
              </div>
              <p className="text-lg font-bold text-blue-400">
                {selectedMode.difficulty.charAt(0).toUpperCase() + selectedMode.difficulty.slice(1)}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-white">Duration</span>
              </div>
              <p className="text-lg font-bold text-green-400">
                ~{Math.floor(selectedMode.estimatedDuration / 60)} min
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">Features</span>
              </div>
              <p className="text-sm text-yellow-400">
                {selectedMode.features.length} unique features
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Speed Round Configuration Modal */}
      <AnimatePresence>
        {showConfig && selectedMode?.id === 'speed_round' && (
          <SpeedRoundConfig
            settings={speedSettings}
            onSettingsChange={setSpeedSettings}
            onStart={handleSpeedRoundStart}
            onCancel={() => setShowConfig(false)}
          />
        )}
      </AnimatePresence>

      {/* Challenges Modal */}
      <AnimatePresence>
        {showChallenges && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-400" />
                  Daily Challenges
                </h2>
                <button
                  onClick={() => setShowChallenges(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {availableChallenges.map(challenge => (
                  <motion.div
                    key={challenge.id}
                    className="p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    onClick={() => handleChallengeSelect(challenge)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          {React.createElement(
                            challenge.icon === 'trending-up' ? TrendingUp :
                            challenge.icon === 'dice-6' ? Dice6 :
                            challenge.icon === 'star' ? Star :
                            challenge.icon === 'zap' ? Zap :
                            challenge.icon === 'brain' ? Brain : Target,
                            { className: 'w-5 h-5' }
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{challenge.name}</h3>
                          <p className="text-sm text-purple-400">{challenge.difficulty}</p>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm">
                        <div className="text-yellow-400 font-bold">+{challenge.rewards.xp} XP</div>
                        <div className="text-white/60">{challenge.attempts} attempts</div>
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-sm mb-3">{challenge.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-white/60">
                        <Timer className="w-3 h-3" />
                        {Math.floor(challenge.timeLimit / 60)}m limit
                      </div>
                      <div className="text-purple-400 font-medium">
                        {challenge.rewards.title}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Configuration Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <ChallengeConfig
            challenge={selectedChallenge}
            onStart={handleChallengeStart}
            onCancel={() => setSelectedChallenge(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameModes;

// Hook for game mode management
export const useGameModes = () => {
  const [currentMode, setCurrentMode] = useState<GameMode | null>(null);
  const [currentSettings, setCurrentSettings] = useState<GameModeSettings | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeVariant | null>(null);

  const startMode = useCallback((mode: GameMode, settings: GameModeSettings) => {
    setCurrentMode(mode);
    setCurrentSettings(settings);
  }, []);

  const startChallenge = useCallback((challenge: ChallengeVariant) => {
    setActiveChallenge(challenge);
  }, []);

  const endMode = useCallback(() => {
    setCurrentMode(null);
    setCurrentSettings(null);
  }, []);

  const endChallenge = useCallback(() => {
    setActiveChallenge(null);
  }, []);

  return {
    currentMode,
    currentSettings,
    activeChallenge,
    startMode,
    startChallenge,
    endMode,
    endChallenge
  };
};