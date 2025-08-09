import React, { useCallback, useMemo } from 'react';
import { DiceGroup, DiceGroupResult } from '../../types/knucklebones';

export interface AIDecision {
  diceType: number;
  diceCount: number;
  confidence: number;
  reasoning: string;
  expectedValue: number;
}

export interface AIAnalysis {
  probabilityDistribution: Record<number, number>;
  expectedValues: Record<number, number>;
  riskAssessment: {
    conservative: number;
    balanced: number;
    aggressive: number;
  };
  optimalStrategy: AIDecision;
}

export interface AIOpponentProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  gameHistory: DiceGroupResult[][];
  currentPool: DiceGroup[];
  availableDice: number[];
  onDecisionMade: (decision: AIDecision) => void;
  playerStats?: {
    averageRoll: number;
    preferredDice: number[];
    riskTolerance: number;
  };
}

export const useAIOpponent = ({
  difficulty,
  gameHistory,
  currentPool,
  availableDice,
  onDecisionMade,
  playerStats
}: AIOpponentProps) => {
  // Probability calculations for different dice types
  const calculateProbabilities = useCallback((diceType: number) => {
    const outcomes = Array.from({ length: diceType }, (_, i) => i + 1);
    const probability = 1 / diceType;
    
    return {
      mean: (diceType + 1) / 2,
      variance: (diceType * diceType - 1) / 12,
      distribution: outcomes.reduce((acc, outcome) => {
        acc[outcome] = probability;
        return acc;
      }, {} as Record<number, number>)
    };
  }, []);

  // Analyze game history for patterns
  const analyzeGameHistory = useCallback(() => {
    if (gameHistory.length === 0) return null;

    const rollFrequency: Record<number, number> = {};
    const diceTypeUsage: Record<number, number> = {};
    let totalRolls = 0;

    gameHistory.forEach(round => {
      round.forEach(group => {
        diceTypeUsage[group.type] = (diceTypeUsage[group.type] || 0) + group.count;
        group.results.forEach(roll => {
          rollFrequency[roll] = (rollFrequency[roll] || 0) + 1;
          totalRolls++;
        });
      });
    });

    return {
      rollFrequency,
      diceTypeUsage,
      totalRolls,
      averageRoll: Object.entries(rollFrequency).reduce(
        (sum, [roll, freq]) => sum + (parseInt(roll) * freq),
        0
      ) / totalRolls
    };
  }, [gameHistory]);

  // Calculate expected value for a dice choice
  const calculateExpectedValue = useCallback((diceType: number, diceCount: number) => {
    const probData = calculateProbabilities(diceType);
    const baseExpectedValue = probData.mean * diceCount;
    
    // Adjust based on current pool synergy
    const poolSynergy = currentPool.reduce((synergy, group) => {
      if (group.type === diceType) {
        // Bonus for consistency
        return synergy + (group.count * 0.1);
      }
      // Penalty for diversity (depending on strategy)
      return synergy - 0.05;
    }, 0);

    // Risk adjustment based on variance
    const riskAdjustment = difficulty === 'easy' ? -probData.variance * 0.1 :
                          difficulty === 'medium' ? -probData.variance * 0.05 :
                          difficulty === 'hard' ? 0 :
                          probData.variance * 0.05; // Expert takes calculated risks

    return baseExpectedValue + poolSynergy + riskAdjustment;
  }, [calculateProbabilities, currentPool, difficulty]);

  // Strategic decision making based on difficulty
  const makeStrategicDecision = useCallback((): AIDecision => {
    const gameAnalysis = analyzeGameHistory();
    const decisions: AIDecision[] = [];

    // Evaluate each available dice type
    availableDice.forEach(diceType => {
      for (let count = 1; count <= 5; count++) {
        const expectedValue = calculateExpectedValue(diceType, count);
        const probData = calculateProbabilities(diceType);
        
        let confidence = 0.5; // Base confidence
        let reasoning = `Rolling ${count}d${diceType}`;

        // Adjust confidence based on difficulty and analysis
        switch (difficulty) {
          case 'easy':
            // Simple strategy: prefer lower variance
            confidence = Math.max(0.1, 0.8 - (probData.variance / 10));
            reasoning += " (conservative approach)";
            break;
            
          case 'medium':
            // Balanced strategy: consider expected value
            confidence = Math.min(0.9, 0.3 + (expectedValue / 10));
            if (gameAnalysis && gameAnalysis.averageRoll > probData.mean) {
              confidence += 0.1;
              reasoning += " (adapting to game trends)";
            }
            break;
            
          case 'hard':
            // Advanced strategy: counter-play and optimization
            confidence = Math.min(0.95, 0.4 + (expectedValue / 8));
            if (playerStats) {
              // Counter player's preferred dice
              if (playerStats.preferredDice.includes(diceType)) {
                confidence -= 0.1;
                reasoning += " (countering player strategy)";
              }
              // Exploit player's risk tolerance
              if (playerStats.riskTolerance < 0.5 && probData.variance > 5) {
                confidence += 0.15;
                reasoning += " (exploiting conservative play)";
              }
            }
            break;
            
          case 'expert':
            // Master strategy: complex analysis and adaptation
            confidence = Math.min(0.98, 0.5 + (expectedValue / 6));
            
            // Advanced pattern recognition
            if (gameAnalysis) {
              const recentTrend = gameHistory.slice(-3);
              const recentAverage = recentTrend.length > 0 ? 
                recentTrend.flat().reduce((sum, group) => 
                  sum + group.results.reduce((a, b) => a + b, 0), 0
                ) / recentTrend.flat().reduce((sum, group) => sum + group.results.length, 0) : 0;
              
              if (recentAverage > probData.mean) {
                confidence += 0.1;
                reasoning += " (exploiting hot streak)";
              } else if (recentAverage < probData.mean * 0.8) {
                confidence += 0.05;
                reasoning += " (regression to mean expected)";
              }
            }
            
            // Meta-game considerations
            if (currentPool.length > 3) {
              confidence *= 0.9; // More conservative with complex pools
              reasoning += " (managing complexity)";
            }
            break;
        }

        decisions.push({
          diceType,
          diceCount: count,
          confidence,
          reasoning,
          expectedValue
        });
      }
    });

    // Select best decision based on confidence and expected value
    return decisions.reduce((best, current) => {
      const bestScore = best.confidence * best.expectedValue;
      const currentScore = current.confidence * current.expectedValue;
      return currentScore > bestScore ? current : best;
    });
  }, [availableDice, calculateExpectedValue, calculateProbabilities, analyzeGameHistory, difficulty, playerStats, currentPool, gameHistory]);

  // Comprehensive analysis for debugging/display
  const getFullAnalysis = useCallback((): AIAnalysis => {
    const probabilityDistribution: Record<number, number> = {};
    const expectedValues: Record<number, number> = {};
    
    availableDice.forEach(diceType => {
      const probData = calculateProbabilities(diceType);
      probabilityDistribution[diceType] = probData.mean;
      expectedValues[diceType] = calculateExpectedValue(diceType, 1);
    });

    const optimalStrategy = makeStrategicDecision();
    
    return {
      probabilityDistribution,
      expectedValues,
      riskAssessment: {
        conservative: Math.min(...Object.values(expectedValues)),
        balanced: Object.values(expectedValues).reduce((a, b) => a + b, 0) / Object.values(expectedValues).length,
        aggressive: Math.max(...Object.values(expectedValues))
      },
      optimalStrategy
    };
  }, [availableDice, calculateProbabilities, calculateExpectedValue, makeStrategicDecision]);

  // Auto-decision making with delay for realism
  const makeDecision = useCallback(() => {
    const decision = makeStrategicDecision();
    
    // Add realistic thinking delay based on difficulty
    const thinkingTime = {
      easy: 500 + Math.random() * 1000,
      medium: 1000 + Math.random() * 1500,
      hard: 1500 + Math.random() * 2000,
      expert: 2000 + Math.random() * 3000
    }[difficulty];

    setTimeout(() => {
      onDecisionMade(decision);
    }, thinkingTime);
  }, [makeStrategicDecision, difficulty, onDecisionMade]);

  // Memoized analysis for performance
  const currentAnalysis = useMemo(() => getFullAnalysis(), [
    getFullAnalysis,
    currentPool,
    gameHistory.length
  ]);

  return {
    makeDecision,
    getAnalysis: () => currentAnalysis,
    getDifficultyDescription: () => {
      const descriptions = {
        easy: "Makes simple, conservative decisions with basic probability awareness",
        medium: "Uses balanced strategy with game history analysis",
        hard: "Employs advanced counter-strategies and player adaptation",
        expert: "Masters complex pattern recognition and meta-game optimization"
      };
      return descriptions[difficulty];
    }
  };
};

// React component for AI Opponent UI
export const AIOpponent: React.FC<AIOpponentProps> = (props) => {
  const ai = useAIOpponent(props);
  const analysis = ai.getAnalysis();

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">AI Opponent</h3>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
          {props.difficulty.charAt(0).toUpperCase() + props.difficulty.slice(1)}
        </span>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Strategy</h4>
          <p className="text-sm text-gray-400">{ai.getDifficultyDescription()}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Current Analysis</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-xs text-gray-400">Optimal Move</div>
              <div className="text-sm text-white font-medium">
                {analysis.optimalStrategy.diceCount}d{analysis.optimalStrategy.diceType}
              </div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-xs text-gray-400">Confidence</div>
              <div className="text-sm text-white font-medium">
                {Math.round(analysis.optimalStrategy.confidence * 100)}%
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Reasoning</h4>
          <p className="text-xs text-gray-400">{analysis.optimalStrategy.reasoning}</p>
        </div>
        
        <button
          onClick={ai.makeDecision}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Make AI Decision
        </button>
      </div>
    </div>
  );
};

export default AIOpponent;