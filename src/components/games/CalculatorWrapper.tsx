import React, { useState, useEffect, useCallback } from 'react';
import GameWrapper from '../GameWrapper';
import Calculator from '../../projects/Calculator';
import { useGameStore } from '../../store/gameStore';
import { GlassButton } from '../ui';
import { Calculator as CalculatorIcon, History, Zap, Settings } from 'lucide-react';

interface CalculatorWrapperProps {
  className?: string;
}

interface CalculatorGameState {
  currentMode: 'basic' | 'scientific' | 'programming' | 'matrix' | 'statistics' | 'graphing' | 'units' | 'solver';
  calculationHistory: Array<{
    expression: string;
    result: string;
    timestamp: Date;
    mode: string;
  }>;
  preferences: {
    angleUnit: 'degrees' | 'radians';
    precision: number;
    theme: 'dark' | 'light';
    soundEnabled: boolean;
  };
  sessionStats: {
    calculationsPerformed: number;
    modesUsed: string[];
    sessionStartTime: Date;
    complexCalculations: number;
    errorsEncountered: number;
  };
}

const CalculatorWrapper: React.FC<CalculatorWrapperProps> = ({ className }) => {
  const [gameState, setGameState] = useState<CalculatorGameState | null>(null);
  const [isCalculatorActive, setIsCalculatorActive] = useState(false);
  const [calculatorStats, setCalculatorStats] = useState({
    totalCalculations: 0,
    totalSessions: 0,
    favoriteMode: 'basic',
    totalTime: 0,
    complexCalculations: 0,
    accuracyRate: 100,
    modesUnlocked: ['basic']
  });
  
  const { updateGameState, getGameState, updateGameStats, getGameStats } = useGameStore();
  
  // Load saved game state and stats
  useEffect(() => {
    const savedState = getGameState('calculator');
    const savedStats = getGameStats('calculator');
    
    if (savedState) {
      setGameState({
        ...savedState,
        calculationHistory: savedState.calculationHistory?.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })) || [],
        sessionStats: {
          ...savedState.sessionStats,
          sessionStartTime: new Date(savedState.sessionStats?.sessionStartTime || Date.now())
        }
      });
    }
    
    if (savedStats.customStats) {
      setCalculatorStats(savedStats.customStats);
    }
  }, [getGameState, getGameStats]);
  
  // Save game state when it changes
  useEffect(() => {
    if (gameState) {
      updateGameState('calculator', gameState);
    }
  }, [gameState, updateGameState]);
  
  // Handle calculator start
  const handleCalculatorStart = useCallback(() => {
    setIsCalculatorActive(true);
    
    // Initialize default game state if none exists
    if (!gameState) {
      const initialState: CalculatorGameState = {
        currentMode: 'basic',
        calculationHistory: [],
        preferences: {
          angleUnit: 'degrees',
          precision: 10,
          theme: 'dark',
          soundEnabled: true
        },
        sessionStats: {
          calculationsPerformed: 0,
          modesUsed: ['basic'],
          sessionStartTime: new Date(),
          complexCalculations: 0,
          errorsEncountered: 0
        }
      };
      setGameState(initialState);
    } else {
      // Update session start time for existing state
      setGameState({
        ...gameState,
        sessionStats: {
          ...gameState.sessionStats,
          sessionStartTime: new Date(),
          calculationsPerformed: 0,
          complexCalculations: 0,
          errorsEncountered: 0
        }
      });
    }
  }, [gameState]);
  
  // Handle calculator end
  const handleCalculatorEnd = useCallback((finalScore?: number, stats?: any) => {
    setIsCalculatorActive(false);
    
    if (gameState) {
      const sessionDuration = Math.floor(
        (new Date().getTime() - gameState.sessionStats.sessionStartTime.getTime()) / 1000
      );
      
      const newStats = {
        ...calculatorStats,
        totalCalculations: calculatorStats.totalCalculations + gameState.sessionStats.calculationsPerformed,
        totalSessions: calculatorStats.totalSessions + 1,
        totalTime: calculatorStats.totalTime + sessionDuration,
        complexCalculations: calculatorStats.complexCalculations + gameState.sessionStats.complexCalculations,
        modesUnlocked: Array.from(new Set([...calculatorStats.modesUnlocked, ...gameState.sessionStats.modesUsed])),
        favoriteMode: getMostUsedMode(gameState.calculationHistory),
        accuracyRate: calculateAccuracyRate(gameState.sessionStats)
      };
      
      setCalculatorStats(newStats);
      
      // Update store with comprehensive stats
      updateGameStats('calculator', {
        totalSessions: newStats.totalSessions,
        totalPlayTime: newStats.totalTime,
        completedSessions: newStats.totalSessions,
        bestScore: newStats.totalCalculations,
        averageScore: newStats.totalSessions > 0 ? newStats.totalCalculations / newStats.totalSessions : 0,
        achievements: getAchievements(newStats),
        customStats: newStats,
        category: 'utility',
        difficulty: getCalculatorDifficulty(newStats)
      });
    }
  }, [gameState, calculatorStats, updateGameStats]);
  
  // Handle calculator reset
  const handleCalculatorReset = useCallback(() => {
    if (gameState) {
      setGameState({
        ...gameState,
        calculationHistory: [],
        sessionStats: {
          calculationsPerformed: 0,
          modesUsed: [gameState.currentMode],
          sessionStartTime: new Date(),
          complexCalculations: 0,
          errorsEncountered: 0
        }
      });
    }
    setIsCalculatorActive(true);
  }, [gameState]);
  
  // Helper functions
  const getMostUsedMode = (history: CalculatorGameState['calculationHistory']): string => {
    const modeCount: Record<string, number> = {};
    history.forEach(calc => {
      modeCount[calc.mode] = (modeCount[calc.mode] || 0) + 1;
    });
    
    return Object.entries(modeCount).reduce((a, b) => 
      modeCount[a[0]] > modeCount[b[0]] ? a : b
    )?.[0] || 'basic';
  };
  
  const calculateAccuracyRate = (sessionStats: CalculatorGameState['sessionStats']): number => {
    if (sessionStats.calculationsPerformed === 0) return 100;
    return Math.round(
      ((sessionStats.calculationsPerformed - sessionStats.errorsEncountered) / 
       sessionStats.calculationsPerformed) * 100
    );
  };
  
  const getCalculatorDifficulty = (stats: typeof calculatorStats): 'easy' | 'medium' | 'hard' | 'expert' => {
    const modesCount = stats.modesUnlocked.length;
    const complexRatio = stats.totalCalculations > 0 ? stats.complexCalculations / stats.totalCalculations : 0;
    
    if (modesCount >= 6 && complexRatio > 0.5) return 'expert';
    if (modesCount >= 4 && complexRatio > 0.3) return 'hard';
    if (modesCount >= 2 && complexRatio > 0.1) return 'medium';
    return 'easy';
  };
  
  // Get achievements based on stats
  const getAchievements = (stats: typeof calculatorStats): string[] => {
    const achievements: string[] = [];
    
    if (stats.totalCalculations >= 1) achievements.push('First Calculation');
    if (stats.totalCalculations >= 100) achievements.push('Calculator Novice');
    if (stats.totalCalculations >= 1000) achievements.push('Math Enthusiast');
    if (stats.totalCalculations >= 5000) achievements.push('Calculation Master');
    if (stats.modesUnlocked.length >= 3) achievements.push('Mode Explorer');
    if (stats.modesUnlocked.length >= 6) achievements.push('All Modes Unlocked');
    if (stats.complexCalculations >= 50) achievements.push('Complex Thinker');
    if (stats.accuracyRate >= 95) achievements.push('Precision Expert');
    if (stats.totalSessions >= 10) achievements.push('Regular User');
    if (stats.totalTime >= 3600) achievements.push('Time Invested'); // 1 hour
    
    return achievements;
  };
  
  // Track calculation performed
  const trackCalculation = useCallback((expression: string, result: string, mode: string, isComplex: boolean = false) => {
    if (gameState) {
      const newCalculation = {
        expression,
        result,
        timestamp: new Date(),
        mode
      };
      
      setGameState({
        ...gameState,
        calculationHistory: [...gameState.calculationHistory, newCalculation].slice(-100), // Keep last 100
        sessionStats: {
          ...gameState.sessionStats,
          calculationsPerformed: gameState.sessionStats.calculationsPerformed + 1,
          modesUsed: Array.from(new Set([...gameState.sessionStats.modesUsed, mode])),
          complexCalculations: gameState.sessionStats.complexCalculations + (isComplex ? 1 : 0)
        }
      });
    }
  }, [gameState]);
  
  // Custom controls for Calculator
  const customControls = (
    <>
      <GlassButton
        variant="ghost"
        size="sm"
        icon={History}
        onClick={() => {
          console.log('Calculation History:', gameState?.calculationHistory || []);
        }}
        className="text-blue-400 hover:text-blue-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Settings}
        onClick={() => {
          // Cycle through modes
          if (gameState) {
            const modes: Array<CalculatorGameState['currentMode']> = [
              'basic', 'scientific', 'programming', 'matrix', 'statistics', 'graphing', 'units', 'solver'
            ];
            const currentIndex = modes.indexOf(gameState.currentMode);
            const nextMode = modes[(currentIndex + 1) % modes.length];
            
            setGameState({
              ...gameState,
              currentMode: nextMode
            });
          }
        }}
        className="text-purple-400 hover:text-purple-300"

      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Zap}
        onClick={() => {
          // Toggle angle unit
          if (gameState) {
            setGameState({
              ...gameState,
              preferences: {
                ...gameState.preferences,
                angleUnit: gameState.preferences.angleUnit === 'degrees' ? 'radians' : 'degrees'
              }
            });
          }
        }}
        className="text-yellow-400 hover:text-yellow-300"

      />
    </>
  );
  
  return (
    <GameWrapper
      gameId="calculator"
      title="Advanced Calculator"
      description="Multi-mode calculator with scientific, programming, and graphing capabilities"
      category="utility"
      difficulty={getCalculatorDifficulty(calculatorStats)}
      className={className}
      enableAnalytics={true}
      enablePerformanceTracking={true}
      enableSaveState={true}
      enableFullscreen={true}
      enableAudio={true}
      customControls={customControls}
      onGameStart={handleCalculatorStart}
      onGameEnd={handleCalculatorEnd}
      onGameReset={handleCalculatorReset}
    >
      <div className="w-full h-full min-h-[600px] p-4">
        {/* Calculator Statistics Display */}
        {calculatorStats.totalCalculations > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-6 text-sm text-white/70">
              <span>Calculations: {calculatorStats.totalCalculations}</span>
              <span>Sessions: {calculatorStats.totalSessions}</span>
              <span>Modes: {calculatorStats.modesUnlocked.length}/8</span>
              <span>Accuracy: {calculatorStats.accuracyRate}%</span>
              <span>Favorite: {calculatorStats.favoriteMode}</span>
            </div>
          </div>
        )}
        
        {/* Current Session Display */}
        {gameState && isCalculatorActive && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-4 text-sm text-white/80">
              <span>Mode: {gameState.currentMode}</span>
              <span>Session Calcs: {gameState.sessionStats.calculationsPerformed}</span>
              <span>Angle: {gameState.preferences.angleUnit}</span>
              <span>Precision: {gameState.preferences.precision}</span>
            </div>
          </div>
        )}
        
        {/* Recent Calculations */}
        {gameState && gameState.calculationHistory.length > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="text-xs text-white/60 max-w-2xl">
              <span className="font-semibold">Recent: </span>
              {gameState.calculationHistory.slice(-3).map((calc, index) => (
                <span key={index} className="mr-4">
                  {calc.expression} = {calc.result}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Calculator Component */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-6xl">
            <Calculator />
          </div>
        </div>
        
        {/* Calculator Instructions */}
        <div className="mt-4 text-center text-white/60 text-sm">
          <p>Advanced calculator with multiple modes for different mathematical needs</p>
          <p className="mt-1">
            <span className="font-semibold">Modes:</span> Basic, Scientific, Programming, Matrix, Statistics, Graphing, Units, Solver • 
            <span className="font-semibold">Features:</span> History tracking, precision control, angle units
          </p>
        </div>
      </div>
    </GameWrapper>
  );
};

export default CalculatorWrapper;