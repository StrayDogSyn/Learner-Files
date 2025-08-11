import React, { useState, useEffect, useCallback } from 'react';
import GameWrapper from '../GameWrapper';
import QuizNinja from '../../projects/QuizNinja';
import { useGameStore } from '../../store/gameStore';
import { GlassButton } from '../ui';
import { Brain, Clock, Target, Zap, Award } from 'lucide-react';

interface QuizNinjaWrapperProps {
  className?: string;
}

interface QuizNinjaGameState {
  currentScore: number;
  questionsAnswered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  currentStreak: number;
  longestStreak: number;
  timeRemaining: number;
  gameMode: 'timed' | 'endless' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  categories: string[];
  questionHistory: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeToAnswer: number;
    category: string;
    timestamp: Date;
  }>;
  powerUps: {
    fiftyFifty: number;
    skipQuestion: number;
    extraTime: number;
    doublePoints: number;
  };
  sessionStats: {
    startTime: Date;
    fastestAnswer: number;
    slowestAnswer: number;
    averageAnswerTime: number;
    categoriesPlayed: string[];
  };
}

const QuizNinjaWrapper: React.FC<QuizNinjaWrapperProps> = ({ className }) => {
  const [gameState, setGameState] = useState<QuizNinjaGameState | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizStats, setQuizStats] = useState({
    totalQuestions: 0,
    totalCorrect: 0,
    totalSessions: 0,
    bestScore: 0,
    bestStreak: 0,
    totalTime: 0,
    averageAccuracy: 0,
    favoriteCategory: 'general',
    expertCategories: [] as string[],
    achievementPoints: 0
  });
  
  const { updateGameState, getGameState, updateGameStats, getGameStats } = useGameStore();
  
  // Load saved game state and stats
  useEffect(() => {
    const savedState = getGameState('quizninja');
    const savedStats = getGameStats('quizninja');
    
    if (savedState) {
      setGameState({
        ...savedState,
        questionHistory: savedState.questionHistory?.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })) || [],
        sessionStats: {
          ...savedState.sessionStats,
          startTime: new Date(savedState.sessionStats?.startTime || Date.now())
        }
      });
    }
    
    if (savedStats.customStats) {
      setQuizStats(savedStats.customStats);
    }
  }, [getGameState, getGameStats]);
  
  // Save game state when it changes
  useEffect(() => {
    if (gameState) {
      updateGameState('quizninja', gameState);
    }
  }, [gameState, updateGameState]);
  
  // Handle quiz start
  const handleQuizStart = useCallback(() => {
    setIsQuizActive(true);
    
    // Initialize default game state if none exists
    if (!gameState) {
      const initialState: QuizNinjaGameState = {
        currentScore: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        currentStreak: 0,
        longestStreak: 0,
        timeRemaining: 300, // 5 minutes
        gameMode: 'timed',
        difficulty: 'medium',
        categories: ['general'],
        questionHistory: [],
        powerUps: {
          fiftyFifty: 3,
          skipQuestion: 2,
          extraTime: 1,
          doublePoints: 1
        },
        sessionStats: {
          startTime: new Date(),
          fastestAnswer: Infinity,
          slowestAnswer: 0,
          averageAnswerTime: 0,
          categoriesPlayed: ['general']
        }
      };
      setGameState(initialState);
    } else {
      // Reset session stats for new game
      setGameState({
        ...gameState,
        currentScore: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        currentStreak: 0,
        questionHistory: [],
        sessionStats: {
          startTime: new Date(),
          fastestAnswer: Infinity,
          slowestAnswer: 0,
          averageAnswerTime: 0,
          categoriesPlayed: gameState.categories
        }
      });
    }
  }, [gameState]);
  
  // Handle quiz end
  const handleQuizEnd = useCallback((finalScore?: number, stats?: any) => {
    setIsQuizActive(false);
    
    if (gameState) {
      const sessionDuration = Math.floor(
        (new Date().getTime() - gameState.sessionStats.startTime.getTime()) / 1000
      );
      
      const accuracy = gameState.questionsAnswered > 0 ? 
        (gameState.correctAnswers / gameState.questionsAnswered) * 100 : 0;
      
      const newStats = {
        ...quizStats,
        totalQuestions: quizStats.totalQuestions + gameState.questionsAnswered,
        totalCorrect: quizStats.totalCorrect + gameState.correctAnswers,
        totalSessions: quizStats.totalSessions + 1,
        bestScore: Math.max(quizStats.bestScore, gameState.currentScore),
        bestStreak: Math.max(quizStats.bestStreak, gameState.longestStreak),
        totalTime: quizStats.totalTime + sessionDuration,
        averageAccuracy: calculateOverallAccuracy(quizStats, gameState),
        favoriteCategory: getMostPlayedCategory(gameState.questionHistory),
        expertCategories: getExpertCategories(gameState.questionHistory),
        achievementPoints: quizStats.achievementPoints + calculateAchievementPoints(gameState)
      };
      
      setQuizStats(newStats);
      
      // Update store with comprehensive stats
      updateGameStats('quizninja', {
        totalSessions: newStats.totalSessions,
        totalPlayTime: newStats.totalTime,
        completedSessions: newStats.totalSessions,
        bestScore: newStats.bestScore,
        averageScore: newStats.totalSessions > 0 ? 
          (quizStats.totalQuestions > 0 ? quizStats.totalCorrect / quizStats.totalQuestions * 100 : 0) : 0,
        achievements: getAchievements(newStats),
        customStats: newStats,
        category: 'educational',
        difficulty: gameState.difficulty
      });
    }
  }, [gameState, quizStats, updateGameStats]);
  
  // Handle quiz reset
  const handleQuizReset = useCallback(() => {
    if (gameState) {
      setGameState({
        ...gameState,
        currentScore: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        currentStreak: 0,
        questionHistory: [],
        timeRemaining: gameState.gameMode === 'timed' ? 300 : gameState.timeRemaining,
        sessionStats: {
          startTime: new Date(),
          fastestAnswer: Infinity,
          slowestAnswer: 0,
          averageAnswerTime: 0,
          categoriesPlayed: gameState.categories
        }
      });
    }
    setIsQuizActive(true);
  }, [gameState]);
  
  // Helper functions
  const calculateOverallAccuracy = (stats: typeof quizStats, currentGame: QuizNinjaGameState): number => {
    const totalQuestions = stats.totalQuestions + currentGame.questionsAnswered;
    const totalCorrect = stats.totalCorrect + currentGame.correctAnswers;
    return totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  };
  
  const getMostPlayedCategory = (history: QuizNinjaGameState['questionHistory']): string => {
    const categoryCount: Record<string, number> = {};
    history.forEach(q => {
      categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
    });
    
    return Object.entries(categoryCount).reduce((a, b) => 
      categoryCount[a[0]] > categoryCount[b[0]] ? a : b
    )?.[0] || 'general';
  };
  
  const getExpertCategories = (history: QuizNinjaGameState['questionHistory']): string[] => {
    const categoryStats: Record<string, { correct: number; total: number }> = {};
    
    history.forEach(q => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { correct: 0, total: 0 };
      }
      categoryStats[q.category].total++;
      if (q.isCorrect) {
        categoryStats[q.category].correct++;
      }
    });
    
    return Object.entries(categoryStats)
      .filter(([_, stats]) => stats.total >= 10 && (stats.correct / stats.total) >= 0.8)
      .map(([category]) => category);
  };
  
  const calculateAchievementPoints = (gameState: QuizNinjaGameState): number => {
    let points = 0;
    points += gameState.correctAnswers * 10; // 10 points per correct answer
    points += gameState.longestStreak * 5; // 5 points per streak
    points += Math.floor(gameState.currentScore / 100) * 25; // Bonus for high scores
    return points;
  };
  
  // Get achievements based on stats
  const getAchievements = (stats: typeof quizStats): string[] => {
    const achievements: string[] = [];
    
    if (stats.totalQuestions >= 1) achievements.push('First Question');
    if (stats.totalQuestions >= 100) achievements.push('Quiz Enthusiast');
    if (stats.totalQuestions >= 500) achievements.push('Knowledge Seeker');
    if (stats.totalQuestions >= 1000) achievements.push('Quiz Master');
    if (stats.bestStreak >= 5) achievements.push('Streak Starter');
    if (stats.bestStreak >= 15) achievements.push('On Fire');
    if (stats.bestStreak >= 30) achievements.push('Unstoppable');
    if (stats.averageAccuracy >= 70) achievements.push('Accurate');
    if (stats.averageAccuracy >= 85) achievements.push('Precise');
    if (stats.averageAccuracy >= 95) achievements.push('Perfect');
    if (stats.expertCategories.length >= 1) achievements.push('Category Expert');
    if (stats.expertCategories.length >= 3) achievements.push('Multi-Expert');
    if (stats.totalSessions >= 10) achievements.push('Regular Player');
    if (stats.achievementPoints >= 1000) achievements.push('Point Collector');
    
    return achievements;
  };
  
  // Track question answered
  const trackQuestionAnswered = useCallback((
    question: string,
    userAnswer: string,
    correctAnswer: string,
    isCorrect: boolean,
    timeToAnswer: number,
    category: string
  ) => {
    if (gameState) {
      const newQuestion = {
        question,
        userAnswer,
        correctAnswer,
        isCorrect,
        timeToAnswer,
        category,
        timestamp: new Date()
      };
      
      const newStreak = isCorrect ? gameState.currentStreak + 1 : 0;
      
      setGameState({
        ...gameState,
        questionsAnswered: gameState.questionsAnswered + 1,
        correctAnswers: gameState.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: gameState.incorrectAnswers + (isCorrect ? 0 : 1),
        currentStreak: newStreak,
        longestStreak: Math.max(gameState.longestStreak, newStreak),
        questionHistory: [...gameState.questionHistory, newQuestion].slice(-50), // Keep last 50
        sessionStats: {
          ...gameState.sessionStats,
          fastestAnswer: Math.min(gameState.sessionStats.fastestAnswer, timeToAnswer),
          slowestAnswer: Math.max(gameState.sessionStats.slowestAnswer, timeToAnswer),
          averageAnswerTime: calculateAverageAnswerTime(gameState.questionHistory, timeToAnswer),
          categoriesPlayed: Array.from(new Set([...gameState.sessionStats.categoriesPlayed, category]))
        }
      });
    }
  }, [gameState]);
  
  const calculateAverageAnswerTime = (history: QuizNinjaGameState['questionHistory'], newTime: number): number => {
    const allTimes = [...history.map(q => q.timeToAnswer), newTime];
    return allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length;
  };
  
  // Custom controls for QuizNinja
  const customControls = (
    <>
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Brain}
        onClick={() => {
          // Cycle through difficulties
          if (gameState) {
            const difficulties: Array<'easy' | 'medium' | 'hard' | 'expert'> = ['easy', 'medium', 'hard', 'expert'];
            const currentIndex = difficulties.indexOf(gameState.difficulty);
            const nextDifficulty = difficulties[(currentIndex + 1) % difficulties.length];
            
            setGameState({
              ...gameState,
              difficulty: nextDifficulty
            });
          }
        }}
        className="text-purple-400 hover:text-purple-300"

      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Clock}
        onClick={() => {
          // Cycle through game modes
          if (gameState) {
            const modes: Array<'timed' | 'endless' | 'challenge'> = ['timed', 'endless', 'challenge'];
            const currentIndex = modes.indexOf(gameState.gameMode);
            const nextMode = modes[(currentIndex + 1) % modes.length];
            
            setGameState({
              ...gameState,
              gameMode: nextMode,
              timeRemaining: nextMode === 'timed' ? 300 : gameState.timeRemaining
            });
          }
        }}
        className="text-blue-400 hover:text-blue-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Zap}
        onClick={() => {
          console.log('Power-ups:', gameState?.powerUps || {});
        }}
        className="text-yellow-400 hover:text-yellow-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Award}
        onClick={() => {
          console.log('Achievements:', getAchievements(quizStats));
        }}
        className="text-green-400 hover:text-green-300"
      />
    </>
  );
  
  return (
    <GameWrapper
      gameId="quizninja"
      title="Quiz Ninja"
      description="Test your knowledge across multiple categories with timed challenges!"
      category="educational"
      difficulty={gameState?.difficulty || 'medium'}
      className={className}
      enableAnalytics={true}
      enablePerformanceTracking={true}
      enableSaveState={true}
      enableFullscreen={true}
      enableAudio={true}
      customControls={customControls}
      onGameStart={handleQuizStart}
      onGameEnd={handleQuizEnd}
      onGameReset={handleQuizReset}
    >
      <div className="w-full h-full min-h-[600px] p-4">
        {/* Quiz Statistics Display */}
        {quizStats.totalQuestions > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-6 text-sm text-white/70">
              <span>Questions: {quizStats.totalQuestions}</span>
              <span>Accuracy: {Math.round(quizStats.averageAccuracy)}%</span>
              <span>Best Score: {quizStats.bestScore}</span>
              <span>Best Streak: {quizStats.bestStreak}</span>
              <span>Expert Categories: {quizStats.expertCategories.length}</span>
            </div>
          </div>
        )}
        
        {/* Current Game Display */}
        {gameState && isQuizActive && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-4 text-sm text-white/80">
              <span>Score: {gameState.currentScore}</span>
              <span>Streak: {gameState.currentStreak}</span>
              <span>Correct: {gameState.correctAnswers}/{gameState.questionsAnswered}</span>
              <span>Mode: {gameState.gameMode}</span>
              {gameState.gameMode === 'timed' && (
                <span>Time: {Math.floor(gameState.timeRemaining / 60)}:{(gameState.timeRemaining % 60).toString().padStart(2, '0')}</span>
              )}
            </div>
          </div>
        )}
        
        {/* Power-ups Display */}
        {gameState && Object.values(gameState.powerUps).some(count => count > 0) && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-3 text-xs text-white/60">
              <span className="font-semibold">Power-ups:</span>
              {gameState.powerUps.fiftyFifty > 0 && <span>50/50: {gameState.powerUps.fiftyFifty}</span>}
              {gameState.powerUps.skipQuestion > 0 && <span>Skip: {gameState.powerUps.skipQuestion}</span>}
              {gameState.powerUps.extraTime > 0 && <span>Time: {gameState.powerUps.extraTime}</span>}
              {gameState.powerUps.doublePoints > 0 && <span>2x: {gameState.powerUps.doublePoints}</span>}
            </div>
          </div>
        )}
        
        {/* QuizNinja Game Component */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <QuizNinja />
          </div>
        </div>
        
        {/* Game Instructions */}
        <div className="mt-4 text-center text-white/60 text-sm">
          <p>Answer questions quickly and accurately to build your streak and score!</p>
          <p className="mt-1">
            <span className="font-semibold">Modes:</span> Timed (5 min), Endless, Challenge • 
            <span className="font-semibold">Power-ups:</span> 50/50, Skip, Extra Time, Double Points
          </p>
        </div>
      </div>
    </GameWrapper>
  );
};

export default QuizNinjaWrapper;