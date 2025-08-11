import React, { useState, useEffect, useCallback } from 'react';
import GameWrapper from '../GameWrapper';
import RockPaperScissors from '../../projects/RockPaperScissors';
import { useGameStore } from '../../store/gameStore';
import { GlassButton } from '../ui';
import { Hand, Brain, Zap, Trophy, Target, BarChart3 } from 'lucide-react';

interface RockPaperScissorsWrapperProps {
  className?: string;
}

interface RPSGameState {
  currentGame: {
    playerChoice: 'rock' | 'paper' | 'scissors' | null;
    computerChoice: 'rock' | 'paper' | 'scissors' | null;
    result: 'win' | 'lose' | 'tie' | null;
    round: number;
    gameMode: 'classic' | 'best-of-3' | 'best-of-5' | 'endless' | 'tournament';
    isActive: boolean;
  };
  score: {
    player: number;
    computer: number;
    ties: number;
    totalGames: number;
  };
  streaks: {
    current: number;
    longest: number;
    type: 'win' | 'lose' | 'tie' | null;
  };
  statistics: {
    rockPlayed: number;
    paperPlayed: number;
    scissorsPlayed: number;
    rockWins: number;
    paperWins: number;
    scissorsWins: number;
    predictedMoves: number;
    totalMoves: number;
    averageGameDuration: number;
    fastestWin: number;
    longestGame: number;
  };
  aiDifficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  gameHistory: Array<{
    id: string;
    playerChoice: 'rock' | 'paper' | 'scissors';
    computerChoice: 'rock' | 'paper' | 'scissors';
    result: 'win' | 'lose' | 'tie';
    timestamp: Date;
    round: number;
    gameMode: string;
    reactionTime: number;
  }>;
  patterns: {
    playerPatterns: Record<string, number>;
    predictedNext: 'rock' | 'paper' | 'scissors' | null;
    confidence: number;
  };
  achievements: string[];
}

const RockPaperScissorsWrapper: React.FC<RockPaperScissorsWrapperProps> = ({ className }) => {
  const [gameState, setGameState] = useState<RPSGameState | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameStats, setGameStats] = useState({
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    totalTies: 0,
    winRate: 0,
    longestWinStreak: 0,
    longestLoseStreak: 0,
    averageReactionTime: 0,
    favoriteChoice: 'rock' as 'rock' | 'paper' | 'scissors',
    strongestChoice: 'rock' as 'rock' | 'paper' | 'scissors',
    weakestChoice: 'rock' as 'rock' | 'paper' | 'scissors',
    aiPredictionAccuracy: 0,
    masterLevel: 1,
    experiencePoints: 0,
    achievements: [] as string[]
  });
  
  const { updateGameState, getGameState, updateGameStats, getGameStats } = useGameStore();
  
  // Load saved game state and stats
  useEffect(() => {
    const savedState = getGameState('rockpaperscissors');
    const savedStats = getGameStats('rockpaperscissors');
    
    if (savedState) {
      setGameState({
        ...savedState,
        gameHistory: savedState.gameHistory?.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })) || []
      });
    } else {
      // Initialize with default state
      const initialState: RPSGameState = {
        currentGame: {
          playerChoice: null,
          computerChoice: null,
          result: null,
          round: 1,
          gameMode: 'classic',
          isActive: false
        },
        score: {
          player: 0,
          computer: 0,
          ties: 0,
          totalGames: 0
        },
        streaks: {
          current: 0,
          longest: 0,
          type: null
        },
        statistics: {
          rockPlayed: 0,
          paperPlayed: 0,
          scissorsPlayed: 0,
          rockWins: 0,
          paperWins: 0,
          scissorsWins: 0,
          predictedMoves: 0,
          totalMoves: 0,
          averageGameDuration: 0,
          fastestWin: Infinity,
          longestGame: 0
        },
        aiDifficulty: 'medium',
        gameHistory: [],
        patterns: {
          playerPatterns: {},
          predictedNext: null,
          confidence: 0
        },
        achievements: []
      };
      setGameState(initialState);
    }
    
    if (savedStats.customStats) {
      setGameStats(savedStats.customStats);
    }
  }, [getGameState, getGameStats]);
  
  // Save game state when it changes
  useEffect(() => {
    if (gameState) {
      updateGameState('rockpaperscissors', gameState);
    }
  }, [gameState, updateGameState]);
  
  // Handle game start
  const handleGameStart = useCallback(() => {
    setIsGameActive(true);
    
    if (gameState) {
      setGameState({
        ...gameState,
        currentGame: {
          ...gameState.currentGame,
          isActive: true,
          round: 1,
          playerChoice: null,
          computerChoice: null,
          result: null
        }
      });
    }
  }, [gameState]);
  
  // Handle game end
  const handleGameEnd = useCallback((finalScore?: { player: number; computer: number }) => {
    setIsGameActive(false);
    
    if (gameState) {
      const gameResult = finalScore || gameState.score;
      const isWin = gameResult.player > gameResult.computer;
      const isTie = gameResult.player === gameResult.computer;
      
      const newStats = {
        ...gameStats,
        totalGames: gameStats.totalGames + 1,
        totalWins: gameStats.totalWins + (isWin ? 1 : 0),
        totalLosses: gameStats.totalLosses + (!isWin && !isTie ? 1 : 0),
        totalTies: gameStats.totalTies + (isTie ? 1 : 0),
        winRate: ((gameStats.totalWins + (isWin ? 1 : 0)) / (gameStats.totalGames + 1)) * 100,
        longestWinStreak: Math.max(gameStats.longestWinStreak, gameState.streaks.longest),
        favoriteChoice: getMostPlayedChoice(gameState.statistics),
        strongestChoice: getStrongestChoice(gameState.statistics),
        weakestChoice: getWeakestChoice(gameState.statistics),
        aiPredictionAccuracy: calculateAIPredictionAccuracy(gameState),
        masterLevel: calculateMasterLevel(gameStats.totalGames + 1, gameStats.totalWins + (isWin ? 1 : 0)),
        experiencePoints: gameStats.experiencePoints + calculateExperiencePoints(gameState, isWin, isTie),
        achievements: getAchievements({
          ...gameStats,
          totalGames: gameStats.totalGames + 1,
          totalWins: gameStats.totalWins + (isWin ? 1 : 0)
        }, gameState)
      };
      
      setGameStats(newStats);
      
      // Update store with comprehensive stats
      updateGameStats('rockpaperscissors', {
        totalSessions: newStats.totalGames,
        totalPlayTime: gameState.statistics.averageGameDuration * newStats.totalGames,
        completedSessions: newStats.totalGames,
        bestScore: newStats.longestWinStreak,
        averageScore: newStats.winRate,
        achievements: newStats.achievements,
        customStats: newStats,
        category: 'strategy',
        difficulty: gameState.aiDifficulty
      });
      
      setGameState({
        ...gameState,
        currentGame: {
          ...gameState.currentGame,
          isActive: false
        }
      });
    }
  }, [gameState, gameStats, updateGameStats]);
  
  // Handle game reset
  const handleGameReset = useCallback(() => {
    if (gameState) {
      setGameState({
        ...gameState,
        currentGame: {
          ...gameState.currentGame,
          playerChoice: null,
          computerChoice: null,
          result: null,
          round: 1,
          isActive: false
        },
        score: {
          player: 0,
          computer: 0,
          ties: 0,
          totalGames: gameState.score.totalGames
        },
        streaks: {
          current: 0,
          longest: gameState.streaks.longest,
          type: null
        }
      });
    }
    setIsGameActive(false);
  }, [gameState]);
  
  // Track move played
  const trackMove = useCallback((
    playerChoice: 'rock' | 'paper' | 'scissors',
    computerChoice: 'rock' | 'paper' | 'scissors',
    result: 'win' | 'lose' | 'tie',
    reactionTime: number
  ) => {
    if (gameState) {
      const moveEntry = {
        id: `move-${Date.now()}`,
        playerChoice,
        computerChoice,
        result,
        timestamp: new Date(),
        round: gameState.currentGame.round,
        gameMode: gameState.currentGame.gameMode,
        reactionTime
      };
      
      const newStreak = result === 'win' ? 
        (gameState.streaks.type === 'win' ? gameState.streaks.current + 1 : 1) :
        result === 'lose' ?
        (gameState.streaks.type === 'lose' ? gameState.streaks.current + 1 : 1) :
        (gameState.streaks.type === 'tie' ? gameState.streaks.current + 1 : 1);
      
      setGameState({
        ...gameState,
        currentGame: {
          ...gameState.currentGame,
          playerChoice,
          computerChoice,
          result,
          round: gameState.currentGame.round + 1
        },
        score: {
          ...gameState.score,
          player: gameState.score.player + (result === 'win' ? 1 : 0),
          computer: gameState.score.computer + (result === 'lose' ? 1 : 0),
          ties: gameState.score.ties + (result === 'tie' ? 1 : 0),
          totalGames: gameState.score.totalGames + 1
        },
        streaks: {
          current: newStreak,
          longest: Math.max(gameState.streaks.longest, newStreak),
          type: result
        },
        statistics: {
          ...gameState.statistics,
          rockPlayed: gameState.statistics.rockPlayed + (playerChoice === 'rock' ? 1 : 0),
          paperPlayed: gameState.statistics.paperPlayed + (playerChoice === 'paper' ? 1 : 0),
          scissorsPlayed: gameState.statistics.scissorsPlayed + (playerChoice === 'scissors' ? 1 : 0),
          rockWins: gameState.statistics.rockWins + (playerChoice === 'rock' && result === 'win' ? 1 : 0),
          paperWins: gameState.statistics.paperWins + (playerChoice === 'paper' && result === 'win' ? 1 : 0),
          scissorsWins: gameState.statistics.scissorsWins + (playerChoice === 'scissors' && result === 'win' ? 1 : 0),
          totalMoves: gameState.statistics.totalMoves + 1,
          fastestWin: result === 'win' ? Math.min(gameState.statistics.fastestWin, reactionTime) : gameState.statistics.fastestWin
        },
        gameHistory: [...gameState.gameHistory, moveEntry].slice(-100), // Keep last 100
        patterns: updatePlayerPatterns(gameState.patterns, playerChoice)
      });
    }
  }, [gameState]);
  
  // Helper functions
  const getMostPlayedChoice = (stats: RPSGameState['statistics']): 'rock' | 'paper' | 'scissors' => {
    const choices = {
      rock: stats.rockPlayed,
      paper: stats.paperPlayed,
      scissors: stats.scissorsPlayed
    };
    
    return Object.entries(choices).reduce((a, b) => choices[a[0] as keyof typeof choices] > choices[b[0] as keyof typeof choices] ? a : b)[0] as 'rock' | 'paper' | 'scissors';
  };
  
  const getStrongestChoice = (stats: RPSGameState['statistics']): 'rock' | 'paper' | 'scissors' => {
    const winRates = {
      rock: stats.rockPlayed > 0 ? stats.rockWins / stats.rockPlayed : 0,
      paper: stats.paperPlayed > 0 ? stats.paperWins / stats.paperPlayed : 0,
      scissors: stats.scissorsPlayed > 0 ? stats.scissorsWins / stats.scissorsPlayed : 0
    };
    
    return Object.entries(winRates).reduce((a, b) => winRates[a[0] as keyof typeof winRates] > winRates[b[0] as keyof typeof winRates] ? a : b)[0] as 'rock' | 'paper' | 'scissors';
  };
  
  const getWeakestChoice = (stats: RPSGameState['statistics']): 'rock' | 'paper' | 'scissors' => {
    const winRates = {
      rock: stats.rockPlayed > 0 ? stats.rockWins / stats.rockPlayed : 1,
      paper: stats.paperPlayed > 0 ? stats.paperWins / stats.paperPlayed : 1,
      scissors: stats.scissorsPlayed > 0 ? stats.scissorsWins / stats.scissorsPlayed : 1
    };
    
    return Object.entries(winRates).reduce((a, b) => winRates[a[0] as keyof typeof winRates] < winRates[b[0] as keyof typeof winRates] ? a : b)[0] as 'rock' | 'paper' | 'scissors';
  };
  
  const calculateAIPredictionAccuracy = (gameState: RPSGameState): number => {
    if (gameState.statistics.totalMoves === 0) return 0;
    return (gameState.statistics.predictedMoves / gameState.statistics.totalMoves) * 100;
  };
  
  const calculateMasterLevel = (totalGames: number, totalWins: number): number => {
    const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
    const experienceLevel = Math.floor(totalGames / 10);
    const skillLevel = Math.floor(winRate / 10);
    return Math.min(Math.max(1, experienceLevel + skillLevel), 10);
  };
  
  const calculateExperiencePoints = (gameState: RPSGameState, isWin: boolean, isTie: boolean): number => {
    let points = 10; // Base points for playing
    
    if (isWin) points += 25;
    if (isTie) points += 5;
    if (gameState.streaks.current >= 3) points += gameState.streaks.current * 5;
    if (gameState.currentGame.gameMode === 'tournament') points *= 1.5;
    if (gameState.aiDifficulty === 'hard') points *= 1.3;
    if (gameState.aiDifficulty === 'adaptive') points *= 1.5;
    
    return Math.round(points);
  };
  
  const updatePlayerPatterns = (patterns: RPSGameState['patterns'], choice: 'rock' | 'paper' | 'scissors'): RPSGameState['patterns'] => {
    const newPatterns = { ...patterns.playerPatterns };
    newPatterns[choice] = (newPatterns[choice] || 0) + 1;
    
    // Simple prediction based on frequency
    const totalMoves = Object.values(newPatterns).reduce((sum, count) => sum + count, 0);
    const mostFrequent = Object.entries(newPatterns).reduce((a, b) => newPatterns[a[0]] > newPatterns[b[0]] ? a : b)[0] as 'rock' | 'paper' | 'scissors';
    
    // Counter the most frequent choice
    const counter = {
      rock: 'paper',
      paper: 'scissors',
      scissors: 'rock'
    } as const;
    
    return {
      playerPatterns: newPatterns,
      predictedNext: counter[mostFrequent],
      confidence: totalMoves > 0 ? (newPatterns[mostFrequent] / totalMoves) * 100 : 0
    };
  };
  
  const getAchievements = (stats: typeof gameStats, gameState: RPSGameState): string[] => {
    const achievements: string[] = [];
    
    if (stats.totalGames >= 1) achievements.push('First Game');
    if (stats.totalGames >= 10) achievements.push('Getting Started');
    if (stats.totalGames >= 50) achievements.push('Experienced Player');
    if (stats.totalGames >= 100) achievements.push('RPS Veteran');
    if (stats.totalWins >= 5) achievements.push('Winner');
    if (stats.totalWins >= 25) achievements.push('Champion');
    if (stats.totalWins >= 100) achievements.push('Master');
    if (stats.winRate >= 60) achievements.push('Skilled');
    if (stats.winRate >= 75) achievements.push('Expert');
    if (stats.winRate >= 90) achievements.push('Legendary');
    if (stats.longestWinStreak >= 5) achievements.push('On Fire');
    if (stats.longestWinStreak >= 10) achievements.push('Unstoppable');
    if (stats.longestWinStreak >= 20) achievements.push('Godlike');
    if (gameState.statistics.fastestWin < 1000) achievements.push('Lightning Fast');
    if (stats.masterLevel >= 5) achievements.push('Advanced Player');
    if (stats.masterLevel >= 10) achievements.push('Grandmaster');
    if (stats.experiencePoints >= 1000) achievements.push('Point Collector');
    
    return achievements;
  };
  
  // Change AI difficulty
  const changeAIDifficulty = useCallback(() => {
    if (gameState) {
      const difficulties: Array<'easy' | 'medium' | 'hard' | 'adaptive'> = ['easy', 'medium', 'hard', 'adaptive'];
      const currentIndex = difficulties.indexOf(gameState.aiDifficulty);
      const nextDifficulty = difficulties[(currentIndex + 1) % difficulties.length];
      
      setGameState({
        ...gameState,
        aiDifficulty: nextDifficulty
      });
    }
  }, [gameState]);
  
  // Change game mode
  const changeGameMode = useCallback(() => {
    if (gameState) {
      const modes: Array<'classic' | 'best-of-3' | 'best-of-5' | 'endless' | 'tournament'> = 
        ['classic', 'best-of-3', 'best-of-5', 'endless', 'tournament'];
      const currentIndex = modes.indexOf(gameState.currentGame.gameMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      
      setGameState({
        ...gameState,
        currentGame: {
          ...gameState.currentGame,
          gameMode: nextMode
        }
      });
    }
  }, [gameState]);
  
  // Custom controls for RockPaperScissors
  const customControls = (
    <>
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Brain}
        onClick={changeAIDifficulty}
        className="text-purple-400 hover:text-purple-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Target}
        onClick={changeGameMode}
        className="text-blue-400 hover:text-blue-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Zap}
        onClick={() => {
          console.log('Player Patterns:', gameState?.patterns || {});
        }}
        className="text-yellow-400 hover:text-yellow-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Trophy}
        onClick={() => {
          console.log('Achievements:', gameStats.achievements);
        }}
        className="text-green-400 hover:text-green-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={BarChart3}
        onClick={() => {
          console.log('Game Statistics:', gameStats);
        }}
        className="text-cyan-400 hover:text-cyan-300"
      />
    </>
  );
  
  return (
    <GameWrapper
      gameId="rockpaperscissors"
      title="Rock Paper Scissors"
      description="Classic strategy game with AI opponents and pattern recognition!"
      category="strategy"
      difficulty={gameState?.aiDifficulty === 'adaptive' ? 'expert' : (gameState?.aiDifficulty || 'medium')}
      className={className}
      enableAnalytics={true}
      enablePerformanceTracking={true}
      enableSaveState={true}
      enableFullscreen={true}
      enableAudio={true}
      customControls={customControls}
      onGameStart={handleGameStart}
      onGameEnd={(score, stats) => {
        // Adapter to convert GameWrapper's signature to our handleGameEnd signature
        if (gameState) {
          handleGameEnd({ player: gameState.score.player, computer: gameState.score.computer });
        }
      }}
      onGameReset={handleGameReset}
    >
      <div className="w-full h-full min-h-[600px] p-4">
        {/* Game Statistics Display */}
        {gameStats.totalGames > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-6 text-sm text-white/70">
              <span>Games: {gameStats.totalGames}</span>
              <span>Win Rate: {Math.round(gameStats.winRate)}%</span>
              <span>Best Streak: {gameStats.longestWinStreak}</span>
              <span>Level: {gameStats.masterLevel}</span>
              <span>XP: {gameStats.experiencePoints}</span>
            </div>
          </div>
        )}
        
        {/* Current Game Display */}
        {gameState && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-4 text-sm text-white/80">
              <span>Score: {gameState.score.player}-{gameState.score.computer}-{gameState.score.ties}</span>
              <span>Round: {gameState.currentGame.round}</span>
              <span>Streak: {gameState.streaks.current} {gameState.streaks.type || ''}</span>
              <span>Mode: {gameState.currentGame.gameMode}</span>
              <span>AI: {gameState.aiDifficulty}</span>
            </div>
          </div>
        )}
        
        {/* Choice Statistics */}
        {gameState && gameState.statistics.totalMoves > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-4 text-xs text-white/60">
              <span>Rock: {gameState.statistics.rockPlayed} ({gameState.statistics.rockWins}W)</span>
              <span>Paper: {gameState.statistics.paperPlayed} ({gameState.statistics.paperWins}W)</span>
              <span>Scissors: {gameState.statistics.scissorsPlayed} ({gameState.statistics.scissorsWins}W)</span>
              <span>Favorite: {gameStats.favoriteChoice}</span>
              <span>Strongest: {gameStats.strongestChoice}</span>
            </div>
          </div>
        )}
        
        {/* AI Prediction Display */}
        {gameState && gameState.patterns.predictedNext && (
          <div className="mb-4 flex justify-center">
            <div className="text-xs text-white/50">
              <span>AI Predicts You'll Play: </span>
              <span className="font-semibold text-yellow-400">{gameState.patterns.predictedNext}</span>
              <span className="ml-2">({Math.round(gameState.patterns.confidence)}% confidence)</span>
            </div>
          </div>
        )}
        
        {/* RockPaperScissors Game Component */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <RockPaperScissors />
          </div>
        </div>
        
        {/* Game Instructions */}
        <div className="mt-4 text-center text-white/60 text-sm">
          <p>Choose your move wisely! The AI learns your patterns and adapts its strategy.</p>
          <p className="mt-1">
            <span className="font-semibold">Modes:</span> Classic, Best-of-3/5, Endless, Tournament • 
            <span className="font-semibold">AI Levels:</span> Easy, Medium, Hard, Adaptive
          </p>
        </div>
      </div>
    </GameWrapper>
  );
};

export default RockPaperScissorsWrapper;