import React, { useState, useEffect, useCallback } from 'react';
import GameWrapper from '../GameWrapper';
import Knucklebones from '../../projects/Knucklebones';
import { useGameStore } from '../../store/gameStore';
import { GlassButton } from '../ui';
import { RotateCcw, Settings, Trophy, Target } from 'lucide-react';

interface KnucklebonesWrapperProps {
  className?: string;
}

interface KnucklebonesGameState {
  playerBoard: number[][];
  aiBoard: number[][];
  currentPlayer: 'player' | 'ai';
  gamePhase: 'setup' | 'playing' | 'finished';
  score: { player: number; ai: number };
  moveHistory: any[];
  difficulty: 'easy' | 'medium' | 'hard';
  gameMode: 'single' | 'multiplayer' | 'tournament';
}

const KnucklebonesWrapper: React.FC<KnucklebonesWrapperProps> = ({ className }) => {
  const [gameState, setGameState] = useState<KnucklebonesGameState | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
    bestScore: 0,
    winStreak: 0,
    currentStreak: 0
  });
  
  const { updateGameState, getGameState, updateGameStats, getGameStats } = useGameStore();
  
  // Load saved game state and stats
  useEffect(() => {
    const savedState = getGameState('knucklebones');
    const savedStats = getGameStats('knucklebones');
    
    if (savedState) {
      setGameState(savedState);
    }
    
    if (savedStats.customStats) {
      setGameStats(savedStats.customStats);
    }
  }, [getGameState, getGameStats]);
  
  // Save game state when it changes
  useEffect(() => {
    if (gameState) {
      updateGameState('knucklebones', gameState);
    }
  }, [gameState, updateGameState]);
  
  // Handle game start
  const handleGameStart = useCallback(() => {
    setIsGameActive(true);
    
    // Initialize default game state if none exists
    if (!gameState) {
      const initialState: KnucklebonesGameState = {
        playerBoard: Array(3).fill(null).map(() => Array(3).fill(0)),
        aiBoard: Array(3).fill(null).map(() => Array(3).fill(0)),
        currentPlayer: 'player',
        gamePhase: 'playing',
        score: { player: 0, ai: 0 },
        moveHistory: [],
        difficulty: 'medium',
        gameMode: 'single'
      };
      setGameState(initialState);
    }
  }, [gameState]);
  
  // Handle game end
  const handleGameEnd = useCallback((finalScore?: number, stats?: any) => {
    setIsGameActive(false);
    
    if (gameState && finalScore !== undefined) {
      const playerWon = gameState.score.player > gameState.score.ai;
      const newStats = {
        ...gameStats,
        gamesPlayed: gameStats.gamesPlayed + 1,
        gamesWon: playerWon ? gameStats.gamesWon + 1 : gameStats.gamesWon,
        totalScore: gameStats.totalScore + gameState.score.player,
        bestScore: Math.max(gameStats.bestScore, gameState.score.player),
        currentStreak: playerWon ? gameStats.currentStreak + 1 : 0,
        winStreak: playerWon ? Math.max(gameStats.winStreak, gameStats.currentStreak + 1) : gameStats.winStreak
      };
      
      setGameStats(newStats);
      
      // Update store with comprehensive stats
      updateGameStats('knucklebones', {
        totalSessions: newStats.gamesPlayed,
        completedSessions: newStats.gamesPlayed,
        bestScore: newStats.bestScore,
        averageScore: newStats.gamesPlayed > 0 ? newStats.totalScore / newStats.gamesPlayed : 0,
        achievements: getAchievements(newStats),
        customStats: newStats,
        category: 'strategy',
        difficulty: gameState.difficulty
      });
    }
  }, [gameState, gameStats, updateGameStats]);
  
  // Handle game reset
  const handleGameReset = useCallback(() => {
    const initialState: KnucklebonesGameState = {
      playerBoard: Array(3).fill(null).map(() => Array(3).fill(0)),
      aiBoard: Array(3).fill(null).map(() => Array(3).fill(0)),
      currentPlayer: 'player',
      gamePhase: 'playing',
      score: { player: 0, ai: 0 },
      moveHistory: [],
      difficulty: gameState?.difficulty || 'medium',
      gameMode: gameState?.gameMode || 'single'
    };
    
    setGameState(initialState);
    setIsGameActive(true);
  }, [gameState]);
  
  // Get achievements based on stats
  const getAchievements = (stats: typeof gameStats): string[] => {
    const achievements: string[] = [];
    
    if (stats.gamesPlayed >= 1) achievements.push('First Game');
    if (stats.gamesPlayed >= 10) achievements.push('Veteran Player');
    if (stats.gamesPlayed >= 50) achievements.push('Knucklebones Master');
    if (stats.gamesWon >= 1) achievements.push('First Victory');
    if (stats.gamesWon >= 10) achievements.push('Winning Streak');
    if (stats.winStreak >= 5) achievements.push('Unstoppable');
    if (stats.bestScore >= 50) achievements.push('High Scorer');
    if (stats.bestScore >= 100) achievements.push('Perfect Game');
    if (stats.gamesWon > 0 && (stats.gamesWon / stats.gamesPlayed) >= 0.8) {
      achievements.push('Strategic Genius');
    }
    
    return achievements;
  };
  
  // Custom controls for Knucklebones
  const customControls = (
    <>
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Target}
        onClick={() => {
          // Toggle difficulty
          if (gameState) {
            const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
            const currentIndex = difficulties.indexOf(gameState.difficulty);
            const nextDifficulty = difficulties[(currentIndex + 1) % difficulties.length];
            
            setGameState({
              ...gameState,
              difficulty: nextDifficulty
            });
          }
        }}
        className="text-yellow-400 hover:text-yellow-300"
        title={`Difficulty: ${gameState?.difficulty || 'medium'}`}
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Trophy}
        onClick={() => {
          // Show achievements or stats modal
          console.log('Achievements:', getAchievements(gameStats));
        }}
        className="text-green-400 hover:text-green-300"
        title="View Achievements"
      />
    </>
  );
  
  return (
    <GameWrapper
      gameId="knucklebones"
      title="Knucklebones"
      description="Strategic dice placement game - outsmart your opponent!"
      category="strategy"
      difficulty={gameState?.difficulty || 'medium'}
      className={className}
      enableAnalytics={true}
      enablePerformanceTracking={true}
      enableSaveState={true}
      enableFullscreen={true}
      enableAudio={true}
      customControls={customControls}
      onGameStart={handleGameStart}
      onGameEnd={handleGameEnd}
      onGameReset={handleGameReset}
    >
      <div className="w-full h-full min-h-[600px] p-4">
        {/* Game Statistics Display */}
        {gameStats.gamesPlayed > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-6 text-sm text-white/70">
              <span>Games: {gameStats.gamesPlayed}</span>
              <span>Won: {gameStats.gamesWon}</span>
              <span>Win Rate: {gameStats.gamesPlayed > 0 ? Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100) : 0}%</span>
              <span>Best: {gameStats.bestScore}</span>
              <span>Streak: {gameStats.currentStreak}</span>
            </div>
          </div>
        )}
        
        {/* Current Game State Display */}
        {gameState && isGameActive && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-4 text-sm text-white/80">
              <span>Player: {gameState.score.player}</span>
              <span>AI: {gameState.score.ai}</span>
              <span>Turn: {gameState.currentPlayer}</span>
              <span>Difficulty: {gameState.difficulty}</span>
            </div>
          </div>
        )}
        
        {/* Knucklebones Game Component */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <Knucklebones />
          </div>
        </div>
        
        {/* Game Instructions */}
        <div className="mt-4 text-center text-white/60 text-sm">
          <p>Place dice strategically to maximize your score while blocking your opponent!</p>
          <p className="mt-1">
            <span className="font-semibold">Controls:</span> Click columns to place dice • 
            <span className="font-semibold">Goal:</span> Highest total score wins
          </p>
        </div>
      </div>
    </GameWrapper>
  );
};

export default KnucklebonesWrapper;