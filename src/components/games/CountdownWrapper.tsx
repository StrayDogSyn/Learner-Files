import React, { useState, useEffect, useCallback } from 'react';
import GameWrapper from '../GameWrapper';
import Countdown from '../../projects/Countdown';
import { useGameStore } from '../../store/gameStore';
import { GlassButton } from '../ui';
import { Timer, Play, Pause, RotateCcw, Bell, Settings } from 'lucide-react';

interface CountdownWrapperProps {
  className?: string;
}

interface CountdownGameState {
  currentTimer: {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isRunning: boolean;
    isPaused: boolean;
    startTime: Date | null;
    endTime: Date | null;
    remainingTime: number;
  };
  presets: Array<{
    id: string;
    name: string;
    duration: number; // in seconds
    color: string;
    sound: string;
  }>;
  history: Array<{
    id: string;
    name: string;
    duration: number;
    completedAt: Date;
    wasCompleted: boolean;
    actualDuration: number;
  }>;
  settings: {
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    autoStart: boolean;
    showMilliseconds: boolean;
    theme: 'default' | 'minimal' | 'digital' | 'analog';
    alarmSound: 'beep' | 'chime' | 'bell' | 'custom';
    volume: number;
  };
  statistics: {
    totalTimers: number;
    completedTimers: number;
    totalTimeTracked: number;
    averageTimerDuration: number;
    longestTimer: number;
    shortestTimer: number;
    mostUsedPreset: string;
    streakDays: number;
    lastUsed: Date | null;
  };
}

const CountdownWrapper: React.FC<CountdownWrapperProps> = ({ className }) => {
  const [gameState, setGameState] = useState<CountdownGameState | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerStats, setTimerStats] = useState({
    totalSessions: 0,
    totalTime: 0,
    completedTimers: 0,
    averageDuration: 0,
    longestSession: 0,
    shortestSession: Infinity,
    favoritePreset: 'Pomodoro',
    productivityScore: 0,
    focusStreak: 0,
    dailyGoal: 1800, // 30 minutes
    weeklyGoal: 12600, // 3.5 hours
    achievements: [] as string[]
  });
  
  const { updateGameState, getGameState, updateGameStats, getGameStats } = useGameStore();
  
  // Default presets
  const defaultPresets = [
    { id: 'pomodoro', name: 'Pomodoro', duration: 1500, color: '#ef4444', sound: 'bell' },
    { id: 'short-break', name: 'Short Break', duration: 300, color: '#22c55e', sound: 'chime' },
    { id: 'long-break', name: 'Long Break', duration: 900, color: '#3b82f6', sound: 'chime' },
    { id: 'focus', name: 'Deep Focus', duration: 3600, color: '#8b5cf6', sound: 'beep' },
    { id: 'quick', name: 'Quick Timer', duration: 60, color: '#f59e0b', sound: 'beep' },
    { id: 'meditation', name: 'Meditation', duration: 600, color: '#06b6d4', sound: 'bell' }
  ];
  
  // Load saved game state and stats
  useEffect(() => {
    const savedState = getGameState('countdown');
    const savedStats = getGameStats('countdown');
    
    if (savedState) {
      setGameState({
        ...savedState,
        currentTimer: {
          ...savedState.currentTimer,
          startTime: savedState.currentTimer.startTime ? new Date(savedState.currentTimer.startTime) : null,
          endTime: savedState.currentTimer.endTime ? new Date(savedState.currentTimer.endTime) : null
        },
        history: savedState.history?.map((item: any) => ({
          ...item,
          completedAt: new Date(item.completedAt)
        })) || [],
        statistics: {
          ...savedState.statistics,
          lastUsed: savedState.statistics?.lastUsed ? new Date(savedState.statistics.lastUsed) : null
        }
      });
    } else {
      // Initialize with default state
      const initialState: CountdownGameState = {
        currentTimer: {
          hours: 0,
          minutes: 25,
          seconds: 0,
          totalSeconds: 1500,
          isRunning: false,
          isPaused: false,
          startTime: null,
          endTime: null,
          remainingTime: 1500
        },
        presets: defaultPresets,
        history: [],
        settings: {
          soundEnabled: true,
          notificationsEnabled: true,
          autoStart: false,
          showMilliseconds: false,
          theme: 'default',
          alarmSound: 'bell',
          volume: 0.7
        },
        statistics: {
          totalTimers: 0,
          completedTimers: 0,
          totalTimeTracked: 0,
          averageTimerDuration: 0,
          longestTimer: 0,
          shortestTimer: Infinity,
          mostUsedPreset: 'pomodoro',
          streakDays: 0,
          lastUsed: null
        }
      };
      setGameState(initialState);
    }
    
    if (savedStats.customStats) {
      setTimerStats(savedStats.customStats);
    }
  }, [getGameState, getGameStats]);
  
  // Save game state when it changes
  useEffect(() => {
    if (gameState) {
      updateGameState('countdown', gameState);
    }
  }, [gameState, updateGameState]);
  
  // Handle timer start
  const handleTimerStart = useCallback(() => {
    setIsTimerActive(true);
    
    if (gameState) {
      const now = new Date();
      const endTime = new Date(now.getTime() + gameState.currentTimer.remainingTime * 1000);
      
      setGameState({
        ...gameState,
        currentTimer: {
          ...gameState.currentTimer,
          isRunning: true,
          isPaused: false,
          startTime: now,
          endTime: endTime
        },
        statistics: {
          ...gameState.statistics,
          totalTimers: gameState.statistics.totalTimers + 1,
          lastUsed: now
        }
      });
    }
  }, [gameState]);
  
  // Handle timer pause
  const handleTimerPause = useCallback(() => {
    if (gameState && gameState.currentTimer.isRunning) {
      setGameState({
        ...gameState,
        currentTimer: {
          ...gameState.currentTimer,
          isRunning: false,
          isPaused: true
        }
      });
    }
  }, [gameState]);
  
  // Handle timer resume
  const handleTimerResume = useCallback(() => {
    if (gameState && gameState.currentTimer.isPaused) {
      const now = new Date();
      const endTime = new Date(now.getTime() + gameState.currentTimer.remainingTime * 1000);
      
      setGameState({
        ...gameState,
        currentTimer: {
          ...gameState.currentTimer,
          isRunning: true,
          isPaused: false,
          endTime: endTime
        }
      });
    }
  }, [gameState]);
  
  // Handle timer completion
  const handleTimerComplete = useCallback((wasCompleted: boolean = true) => {
    setIsTimerActive(false);
    
    if (gameState) {
      const actualDuration = gameState.currentTimer.totalSeconds - gameState.currentTimer.remainingTime;
      const completedAt = new Date();
      
      const historyEntry = {
        id: `timer-${Date.now()}`,
        name: `Timer ${gameState.currentTimer.totalSeconds}s`,
        duration: gameState.currentTimer.totalSeconds,
        completedAt,
        wasCompleted,
        actualDuration
      };
      
      const newStats = {
        ...timerStats,
        totalSessions: timerStats.totalSessions + 1,
        totalTime: timerStats.totalTime + actualDuration,
        completedTimers: timerStats.completedTimers + (wasCompleted ? 1 : 0),
        averageDuration: (timerStats.totalTime + actualDuration) / (timerStats.totalSessions + 1),
        longestSession: Math.max(timerStats.longestSession, actualDuration),
        shortestSession: Math.min(timerStats.shortestSession, actualDuration),
        productivityScore: calculateProductivityScore(timerStats, actualDuration, wasCompleted),
        focusStreak: wasCompleted ? timerStats.focusStreak + 1 : 0,
        achievements: getAchievements({
          ...timerStats,
          totalSessions: timerStats.totalSessions + 1,
          completedTimers: timerStats.completedTimers + (wasCompleted ? 1 : 0)
        })
      };
      
      setTimerStats(newStats);
      
      setGameState({
        ...gameState,
        history: [...gameState.history, historyEntry].slice(-50), // Keep last 50
        statistics: {
          ...gameState.statistics,
          completedTimers: gameState.statistics.completedTimers + (wasCompleted ? 1 : 0),
          totalTimeTracked: gameState.statistics.totalTimeTracked + actualDuration,
          averageTimerDuration: (gameState.statistics.totalTimeTracked + actualDuration) / 
            (gameState.statistics.completedTimers + (wasCompleted ? 1 : 0) || 1),
          longestTimer: Math.max(gameState.statistics.longestTimer, actualDuration),
          shortestTimer: gameState.statistics.shortestTimer === Infinity ? 
            actualDuration : Math.min(gameState.statistics.shortestTimer, actualDuration)
        },
        currentTimer: {
          ...gameState.currentTimer,
          isRunning: false,
          isPaused: false,
          remainingTime: gameState.currentTimer.totalSeconds
        }
      });
      
      // Update store with comprehensive stats
      updateGameStats('countdown', {
        totalSessions: newStats.totalSessions,
        totalPlayTime: newStats.totalTime,
        completedSessions: newStats.completedTimers,
        bestScore: newStats.longestSession,
        averageScore: newStats.averageDuration,
        achievements: newStats.achievements,
        customStats: newStats,
        category: 'utility',
        difficulty: 'easy'
      });
    }
  }, [gameState, timerStats, updateGameStats]);
  
  // Handle timer reset
  const handleTimerReset = useCallback(() => {
    if (gameState) {
      setGameState({
        ...gameState,
        currentTimer: {
          ...gameState.currentTimer,
          isRunning: false,
          isPaused: false,
          startTime: null,
          endTime: null,
          remainingTime: gameState.currentTimer.totalSeconds
        }
      });
    }
    setIsTimerActive(false);
  }, [gameState]);
  
  // Helper functions
  const calculateProductivityScore = (stats: typeof timerStats, duration: number, completed: boolean): number => {
    let score = stats.productivityScore;
    
    if (completed) {
      score += Math.min(duration / 60, 60); // Max 60 points per hour
      if (duration >= 1500) score += 10; // Bonus for 25+ minute sessions
      if (duration >= 3600) score += 20; // Bonus for 1+ hour sessions
    } else {
      score = Math.max(0, score - 5); // Penalty for incomplete sessions
    }
    
    return Math.round(score);
  };
  
  const getAchievements = (stats: typeof timerStats): string[] => {
    const achievements: string[] = [];
    
    if (stats.totalSessions >= 1) achievements.push('First Timer');
    if (stats.totalSessions >= 10) achievements.push('Getting Started');
    if (stats.totalSessions >= 50) achievements.push('Timer Enthusiast');
    if (stats.totalSessions >= 100) achievements.push('Time Master');
    if (stats.completedTimers >= 5) achievements.push('Focused');
    if (stats.completedTimers >= 25) achievements.push('Disciplined');
    if (stats.completedTimers >= 100) achievements.push('Zen Master');
    if (stats.focusStreak >= 3) achievements.push('On a Roll');
    if (stats.focusStreak >= 10) achievements.push('Unstoppable');
    if (stats.longestSession >= 3600) achievements.push('Marathon Session');
    if (stats.totalTime >= 36000) achievements.push('10 Hour Club');
    if (stats.totalTime >= 180000) achievements.push('50 Hour Club');
    if (stats.productivityScore >= 100) achievements.push('Productive');
    if (stats.productivityScore >= 500) achievements.push('Super Productive');
    
    return achievements;
  };
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Set preset timer
  const setPresetTimer = useCallback((preset: typeof defaultPresets[0]) => {
    if (gameState) {
      setGameState({
        ...gameState,
        currentTimer: {
          ...gameState.currentTimer,
          hours: Math.floor(preset.duration / 3600),
          minutes: Math.floor((preset.duration % 3600) / 60),
          seconds: preset.duration % 60,
          totalSeconds: preset.duration,
          remainingTime: preset.duration,
          isRunning: false,
          isPaused: false,
          startTime: null,
          endTime: null
        },
        statistics: {
          ...gameState.statistics,
          mostUsedPreset: preset.id
        }
      });
      
      setTimerStats({
        ...timerStats,
        favoritePreset: preset.name
      });
    }
  }, [gameState, timerStats]);
  
  // Custom controls for Countdown
  const customControls = (
    <>
      <GlassButton
        variant="ghost"
        size="sm"
        icon={gameState?.currentTimer.isRunning ? Pause : Play}
        onClick={() => {
          if (gameState?.currentTimer.isRunning) {
            handleTimerPause();
          } else if (gameState?.currentTimer.isPaused) {
            handleTimerResume();
          } else {
            handleTimerStart();
          }
        }}
        className="text-green-400 hover:text-green-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={RotateCcw}
        onClick={handleTimerReset}
        className="text-blue-400 hover:text-blue-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Bell}
        onClick={() => {
          if (gameState) {
            setGameState({
              ...gameState,
              settings: {
                ...gameState.settings,
                soundEnabled: !gameState.settings.soundEnabled
              }
            });
          }
        }}
        className={`${gameState?.settings.soundEnabled ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-gray-300'}`}
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Settings}
        onClick={() => {
          console.log('Timer Settings:', gameState?.settings || {});
        }}
        className="text-purple-400 hover:text-purple-300"
      />
    </>
  );
  
  return (
    <GameWrapper
      gameId="countdown"
      title="Countdown Timer"
      description="Focus timer with presets for productivity, meditation, and breaks!"
      category="utility"
      difficulty="easy"
      className={className}
      enableAnalytics={true}
      enablePerformanceTracking={true}
      enableSaveState={true}
      enableFullscreen={true}
      enableAudio={gameState?.settings.soundEnabled}
      customControls={customControls}
      onGameStart={handleTimerStart}
      onGameEnd={() => handleTimerComplete(false)}
      onGameReset={handleTimerReset}
    >
      <div className="w-full h-full min-h-[600px] p-4">
        {/* Timer Statistics Display */}
        {timerStats.totalSessions > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-6 text-sm text-white/70">
              <span>Sessions: {timerStats.totalSessions}</span>
              <span>Completed: {timerStats.completedTimers}</span>
              <span>Total Time: {formatTime(timerStats.totalTime)}</span>
              <span>Streak: {timerStats.focusStreak}</span>
              <span>Score: {timerStats.productivityScore}</span>
            </div>
          </div>
        )}
        
        {/* Current Timer Display */}
        {gameState && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-4 text-sm text-white/80">
              <span>Current: {formatTime(gameState.currentTimer.remainingTime)}</span>
              <span>Status: {gameState.currentTimer.isRunning ? 'Running' : gameState.currentTimer.isPaused ? 'Paused' : 'Stopped'}</span>
              <span>Preset: {timerStats.favoritePreset}</span>
              {gameState.currentTimer.endTime && (
                <span>Ends: {gameState.currentTimer.endTime.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        )}
        
        {/* Preset Timers */}
        {gameState && (
          <div className="mb-4 flex justify-center">
            <div className="flex flex-wrap gap-2 max-w-2xl">
              {gameState.presets.map((preset) => (
                <GlassButton
                  key={preset.id}
                  variant="secondary"
                  size="sm"
                  onClick={() => setPresetTimer(preset)}
                  className={`text-xs`}
                >
                  {preset.name} ({formatTime(preset.duration)})
                </GlassButton>
              ))}
            </div>
          </div>
        )}
        
        {/* Daily Progress */}
        {timerStats.totalTime > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="text-xs text-white/60">
              <span>Daily Goal Progress: </span>
              <span className={timerStats.totalTime >= timerStats.dailyGoal ? 'text-green-400' : 'text-yellow-400'}>
                {formatTime(Math.min(timerStats.totalTime, timerStats.dailyGoal))} / {formatTime(timerStats.dailyGoal)}
              </span>
              <span className="ml-2">({Math.round((timerStats.totalTime / timerStats.dailyGoal) * 100)}%)</span>
            </div>
          </div>
        )}
        
        {/* Countdown Game Component */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <Countdown />
          </div>
        </div>
        
        {/* Game Instructions */}
        <div className="mt-4 text-center text-white/60 text-sm">
          <p>Use preset timers or set custom durations for focused work sessions!</p>
          <p className="mt-1">
            <span className="font-semibold">Presets:</span> Pomodoro (25m), Breaks (5m/15m), Deep Focus (60m) • 
            <span className="font-semibold">Features:</span> Sound alerts, Progress tracking, Productivity scoring
          </p>
        </div>
      </div>
    </GameWrapper>
  );
};

export default CountdownWrapper;