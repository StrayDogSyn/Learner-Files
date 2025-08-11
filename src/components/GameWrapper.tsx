import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Settings, Maximize2, Minimize2,
  Volume2, VolumeX, Trophy, BarChart3, Share2, Download,
  Home, ArrowLeft, Clock, Star, Award, Target
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GlassCard, GlassButton, GlassLoader, GlassModal, GlassBadge } from './ui';
import { useGameAnalytics } from '../hooks/useGameAnalytics';
import { useGameState } from '../hooks/useGameState';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';

interface GameWrapperProps {
  gameId: string;
  title: string;
  description?: string;
  category?: 'puzzle' | 'strategy' | 'arcade' | 'educational' | 'utility';
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  children: React.ReactNode;
  className?: string;
  enableAnalytics?: boolean;
  enablePerformanceTracking?: boolean;
  enableSaveState?: boolean;
  enableFullscreen?: boolean;
  enableAudio?: boolean;
  customControls?: React.ReactNode;
  onGameStart?: () => void;
  onGameEnd?: (score?: number, stats?: any) => void;
  onGamePause?: () => void;
  onGameResume?: () => void;
  onGameReset?: () => void;
}

interface GameSession {
  id: string;
  gameId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  score?: number;
  achievements?: string[];
  stats?: any;
}

const GameWrapper: React.FC<GameWrapperProps> = ({
  gameId,
  title,
  description,
  category = 'puzzle',
  difficulty = 'medium',
  children,
  className,
  enableAnalytics = true,
  enablePerformanceTracking = true,
  enableSaveState = true,
  enableFullscreen = true,
  enableAudio = true,
  customControls,
  onGameStart,
  onGameEnd,
  onGamePause,
  onGameResume,
  onGameReset
}) => {
  // Game state management
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  
  // Refs
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameTimeRef = useRef<NodeJS.Timeout | null>(null);
  
  // Custom hooks
  const analytics = useGameAnalytics(gameId, enableAnalytics);
  const gameState = useGameState(gameId, enableSaveState);
  const { metrics, startTracking, stopTracking } = usePerformanceMetrics({
    trackingInterval: 1000,
    enableMemoryTracking: enablePerformanceTracking,
    enableUserInteractionTracking: enablePerformanceTracking
  });

  // Load saved data on mount
  useEffect(() => {
    const savedBestScore = localStorage.getItem(`${gameId}_bestScore`);
    const savedAchievements = localStorage.getItem(`${gameId}_achievements`);
    
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
    
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, [gameId]);

  // Game timer effect
  useEffect(() => {
    if (isPlaying && !isPaused) {
      gameTimeRef.current = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    } else {
      if (gameTimeRef.current) {
        clearInterval(gameTimeRef.current);
      }
    }

    return () => {
      if (gameTimeRef.current) {
        clearInterval(gameTimeRef.current);
      }
    };
  }, [isPlaying, isPaused]);

  // Performance tracking
  useEffect(() => {
    if (isPlaying && enablePerformanceTracking) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [isPlaying, enablePerformanceTracking, startTracking, stopTracking]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'r':
        case 'R':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleReset();
          }
          break;
        case 'f':
        case 'F':
          if (enableFullscreen) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        case 'm':
        case 'M':
          if (enableAudio) {
            e.preventDefault();
            toggleMute();
          }
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, isFullscreen, enableFullscreen, enableAudio]);

  const startGame = () => {
    const session: GameSession = {
      id: Date.now().toString(),
      gameId,
      startTime: new Date()
    };
    
    setCurrentSession(session);
    setIsPlaying(true);
    setIsPaused(false);
    setGameTime(0);
    
    analytics.trackGameStart(gameId);
    onGameStart?.();
  };

  const endGame = (score?: number, stats?: any) => {
    if (currentSession) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - currentSession.startTime.getTime()) / 1000);
      
      const completedSession: GameSession = {
        ...currentSession,
        endTime,
        duration,
        score,
        stats
      };
      
      // Update best score
      if (score !== undefined && (bestScore === null || score > bestScore)) {
        setBestScore(score);
        localStorage.setItem(`${gameId}_bestScore`, score.toString());
      }
      
      analytics.trackGameEnd(gameId, completedSession);
      onGameEnd?.(score, stats);
    }
    
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSession(null);
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      startGame();
    } else {
      const newPausedState = !isPaused;
      setIsPaused(newPausedState);
      
      if (newPausedState) {
        analytics.trackGamePause(gameId);
        onGamePause?.();
      } else {
        analytics.trackGameResume(gameId);
        onGameResume?.();
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setGameTime(0);
    setCurrentSession(null);
    
    analytics.trackGameReset(gameId);
    onGameReset?.();
  };

  const toggleFullscreen = async () => {
    if (!enableFullscreen || !gameContainerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await gameContainerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen not supported or failed:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    analytics.trackAudioToggle(gameId, !isMuted);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      case 'expert': return 'purple';
      default: return 'default';
    }
  };

  return (
    <div 
      ref={gameContainerRef}
      className={cn(
        'relative w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
        isFullscreen && 'fixed inset-0 z-50',
        className
      )}
    >
      {/* Game Header */}
      <motion.div
        className="relative z-10 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            {/* Game Info */}
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {description && (
                  <p className="text-white/70 text-sm mt-1">{description}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <GlassBadge variant={getDifficultyColor() as any} size="sm">
                    {difficulty}
                  </GlassBadge>
                  <GlassBadge variant="info" size="sm">
                    {category}
                  </GlassBadge>
                </div>
              </div>
            </div>

            {/* Game Stats */}
            <div className="flex items-center space-x-6 text-white/80">
              <div className="text-center">
                <Clock className="w-4 h-4 mx-auto mb-1" />
                <div className="text-sm font-mono">{formatTime(gameTime)}</div>
              </div>
              
              {bestScore !== null && (
                <div className="text-center">
                  <Trophy className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-sm font-mono">{bestScore}</div>
                </div>
              )}
              
              {enablePerformanceTracking && (
                <div className="text-center">
                  <BarChart3 className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-sm font-mono">{metrics.fps}fps</div>
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="flex items-center space-x-2">
              <GlassButton
                variant="ghost"
                size="sm"
                icon={isPlaying ? (isPaused ? Play : Pause) : Play}
                onClick={handlePlayPause}
                className="text-emerald-400 hover:text-emerald-300"
              />
              
              <GlassButton
                variant="ghost"
                size="sm"
                icon={RotateCcw}
                onClick={handleReset}
                className="text-orange-400 hover:text-orange-300"
              />
              
              {enableAudio && (
                <GlassButton
                  variant="ghost"
                  size="sm"
                  icon={isMuted ? VolumeX : Volume2}
                  onClick={toggleMute}
                  className="text-blue-400 hover:text-blue-300"
                />
              )}
              
              {enableFullscreen && (
                <GlassButton
                  variant="ghost"
                  size="sm"
                  icon={isFullscreen ? Minimize2 : Maximize2}
                  onClick={toggleFullscreen}
                  className="text-purple-400 hover:text-purple-300"
                />
              )}
              
              <GlassButton
                variant="ghost"
                size="sm"
                icon={BarChart3}
                onClick={() => setShowStats(true)}
                className="text-cyan-400 hover:text-cyan-300"
              />
              
              <GlassButton
                variant="ghost"
                size="sm"
                icon={Settings}
                onClick={() => setShowSettings(true)}
                className="text-gray-400 hover:text-gray-300"
              />
              
              {customControls}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Game Content */}
      <div className="relative z-0 flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center h-96">
            <GlassLoader size="lg" variant="spinner" text="Loading game..." />
          </div>
        }>
          <AnimatePresence mode="wait">
            {isPaused ? (
              <motion.div
                key="paused"
                className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GlassCard className="p-8 text-center">
                  <Pause className="w-16 h-16 mx-auto mb-4 text-white/60" />
                  <h2 className="text-2xl font-bold text-white mb-2">Game Paused</h2>
                  <p className="text-white/70 mb-6">Press Space or click Play to continue</p>
                  <GlassButton onClick={handlePlayPause} icon={Play}>
                    Resume Game
                  </GlassButton>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </div>

      {/* Settings Modal */}
      <GlassModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Game Settings"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-white/80">
            <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Play/Pause:</span>
                <span className="font-mono bg-white/10 px-2 py-1 rounded">Space</span>
              </div>
              <div className="flex justify-between">
                <span>Reset:</span>
                <span className="font-mono bg-white/10 px-2 py-1 rounded">Ctrl+R</span>
              </div>
              {enableFullscreen && (
                <div className="flex justify-between">
                  <span>Fullscreen:</span>
                  <span className="font-mono bg-white/10 px-2 py-1 rounded">F</span>
                </div>
              )}
              {enableAudio && (
                <div className="flex justify-between">
                  <span>Mute:</span>
                  <span className="font-mono bg-white/10 px-2 py-1 rounded">M</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassModal>

      {/* Stats Modal */}
      <GlassModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        title="Game Statistics"
        size="lg"
      >
        <div className="space-y-6">
          {/* Performance Metrics */}
          {enablePerformanceTracking && (
            <div>
              <h3 className="text-white font-semibold mb-3">Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{metrics.fps}</div>
                  <div className="text-sm text-white/60">FPS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{metrics.memory}MB</div>
                  <div className="text-sm text-white/60">Memory</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{metrics.cpu}%</div>
                  <div className="text-sm text-white/60">CPU</div>
                </div>
              </div>
            </div>
          )}

          {/* Game Stats */}
          <div>
            <h3 className="text-white font-semibold mb-3">Session Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{formatTime(gameTime)}</div>
                <div className="text-sm text-white/60">Time Played</div>
              </div>
              {bestScore !== null && (
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">{bestScore}</div>
                  <div className="text-sm text-white/60">Best Score</div>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement, index) => (
                  <GlassBadge key={index} variant="success" icon={Award}>
                    {achievement}
                  </GlassBadge>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassModal>
    </div>
  );
};

export default GameWrapper;