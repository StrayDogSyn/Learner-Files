import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiceGroupResult, DiceResult } from '../../types/knucklebones';

interface DicePhysics3DProps {
  isRolling: boolean;
  onRollComplete: (results: DiceGroupResult[]) => void;
  diceCount: number;
  className?: string;
  theme?: 'glass' | 'neon' | 'classic';
  enablePhysics?: boolean;
  rollForce?: number;
}

interface DiceProps {
  id: string;
  theme: 'glass' | 'neon' | 'classic';
  onSettle: (value: number, id: string) => void;
  delay: number;
}

const Dice2D: React.FC<DiceProps> = ({ id, theme, onSettle, delay }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState(1);
  const [finalValue, setFinalValue] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Start rolling animation
    const startTime = setTimeout(() => {
      setIsRolling(true);
      
      // Rapid value changes during roll
      intervalRef.current = setInterval(() => {
        setCurrentValue(Math.floor(Math.random() * 6) + 1);
      }, 100);
      
      // Stop rolling and settle on final value
      timeoutRef.current = setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        const final = Math.floor(Math.random() * 6) + 1;
        setFinalValue(final);
        setCurrentValue(final);
        setIsRolling(false);
        onSettle(final, id);
      }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds
    }, delay);

    return () => {
      clearTimeout(startTime);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [id, onSettle, delay]);

  const getDiceStyle = () => {
    const baseClasses = "w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all duration-200";
    
    switch (theme) {
      case 'glass':
        return `${baseClasses} bg-white/20 border-white/30 text-white backdrop-blur-md shadow-lg`;
      case 'neon':
        return `${baseClasses} bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan-400/50 shadow-lg`;
      case 'classic':
        return `${baseClasses} bg-white border-gray-300 text-gray-800 shadow-lg`;
      default:
        return `${baseClasses} bg-white/20 border-white/30 text-white backdrop-blur-md shadow-lg`;
    }
  };

  const getDotPattern = (value: number) => {
    const dotPositions = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]]
    };

    return dotPositions[value as keyof typeof dotPositions] || [[1, 1]];
  };

  return (
    <motion.div
      className={getDiceStyle()}
      animate={{
        rotateX: isRolling ? [0, 360, 720, 1080] : 0,
        rotateY: isRolling ? [0, 180, 540, 720] : 0,
        scale: isRolling ? [1, 1.1, 0.9, 1] : 1,
      }}
      transition={{
        duration: isRolling ? 1.5 : 0.3,
        ease: isRolling ? "easeInOut" : "easeOut"
      }}
    >
      {theme === 'classic' ? (
        // Show dots for classic theme
        <div className="relative w-full h-full">
          <div className="absolute inset-1 grid grid-cols-3 grid-rows-3">
            {getDotPattern(currentValue).map(([row, col], index) => (
              <div
                key={index}
                className="flex items-center justify-center"
                style={{ gridRow: row + 1, gridColumn: col + 1 }}
              >
                <div className="w-2 h-2 bg-gray-800 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Show number for glass/neon themes
        <span className={isRolling ? "animate-pulse" : ""}>
          {currentValue}
        </span>
      )}
    </motion.div>
  );
};

const DicePhysics3D: React.FC<DicePhysics3DProps> = ({
  isRolling,
  onRollComplete,
  diceCount = 2,
  className = '',
  theme = 'glass',
  enablePhysics = true,
  rollForce = 10
}) => {
  const [diceResults, setDiceResults] = useState<Map<string, number>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [allSettled, setAllSettled] = useState(false);

  const handleDiceSettle = useCallback((value: number, id: string) => {
    setDiceResults(prev => {
      const newResults = new Map(prev);
      newResults.set(id, value);
      
      // Check if all dice have settled
      if (newResults.size === diceCount) {
          const results: DiceGroupResult[] = [{
            group: {
              id: 'main',
              type: 6, // d6 dice
              count: diceCount,
              results: Array.from(newResults.values())
            },
            timestamp: new Date(),
            playerId: 'player1',
            total: Array.from(newResults.values()).reduce((sum, val) => sum + val, 0)
          }];
        
        setTimeout(() => {
          setShowResults(true);
          setAllSettled(true);
          onRollComplete(results);
        }, 500);
      }
      
      return newResults;
    });
  }, [diceCount, onRollComplete]);

  useEffect(() => {
    if (isRolling) {
      setDiceResults(new Map());
      setShowResults(false);
      setAllSettled(false);
    }
  }, [isRolling]);

  if (!enablePhysics || !isRolling) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          {/* Main dice container */}
          <motion.div
            className="flex gap-8 items-center justify-center p-8"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {Array(diceCount).fill(0).map((_, index) => (
              <Dice2D
                key={`dice-${index}`}
                id={`dice-${index}`}
                theme={theme}
                onSettle={handleDiceSettle}
                delay={index * 200} // Stagger the dice rolls
              />
            ))}
          </motion.div>

          {/* Results display */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 text-white text-center">
                  <p className="text-sm opacity-80 mb-2">Roll Complete!</p>
                  <div className="flex gap-2">
                    {Array.from(diceResults.values()).map((value, index) => (
                      <span key={index} className="text-lg font-bold">
                        {value}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs opacity-60 mt-2">
                    Total: {Array.from(diceResults.values()).reduce((sum, val) => sum + val, 0)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* UI Overlay */}
          <div className="absolute top-4 left-4 text-white">
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-2">Rolling Dice...</h3>
              <p className="text-sm opacity-80">2D Animation Active</p>
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-xs">Simulated Physics</span>
              </div>
            </motion.div>
          </div>

          {/* Theme indicator */}
          <div className="absolute bottom-4 right-4 text-white">
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xs opacity-80 mb-1">Theme: {theme}</p>
              <p className="text-xs">🎲 2D Dice Simulation</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DicePhysics3D;

// Hook for managing 2D dice rolls (maintaining same interface)
export const useDicePhysics3D = () => {
  const [isRolling, setIsRolling] = useState(false);
  const [results, setResults] = useState<DiceGroupResult[]>([]);
  const [settings, setSettings] = useState({
    theme: 'glass' as const,
    enablePhysics: true,
    rollForce: 10,
    diceCount: 2
  });

  const rollDice = useCallback((count: number = 2) => {
    setSettings(prev => ({ ...prev, diceCount: count }));
    setIsRolling(true);
    setResults([]);
  }, []);

  const handleRollComplete = useCallback((newResults: DiceGroupResult[]) => {
    setResults(newResults);
    setIsRolling(false);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    isRolling,
    results,
    settings,
    rollDice,
    handleRollComplete,
    updateSettings
  };
};