import { useState, useCallback } from 'react';
import { GameMode, GameModeSettings } from '../types/knucklebones';

interface UseGameModesReturn {
  availableModes: GameMode[];
  selectedMode: GameMode | null;
  selectMode: (mode: GameMode) => void;
  createCustomMode: (name: string, settings: GameModeSettings) => GameMode;
}

export const useGameModes = (): UseGameModesReturn => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const availableModes: GameMode[] = [
    {
      id: 'classic',
      name: 'Classic Knucklebones',
      description: 'Traditional 3x3 grid game with standard scoring',
      difficulty: 'medium',
      estimatedDuration: 15,
      maxPlayers: 2,
      features: ['Standard scoring', 'Dice elimination', 'Strategic placement']
    },
    {
      id: 'speed',
      name: 'Speed Round',
      description: 'Fast-paced game with time pressure',
      timeLimit: 300,
      difficulty: 'hard',
      estimatedDuration: 5,
      maxPlayers: 4,
      features: ['Time limit', 'Quick decisions', 'Bonus points for speed']
    },
    {
      id: 'ai_challenge',
      name: 'AI Challenge',
      description: 'Test your skills against advanced AI opponents',
      difficulty: 'varied',
      estimatedDuration: 20,
      maxPlayers: 1,
      features: ['AI opponent', 'Difficulty scaling', 'Move analysis']
    },
    {
      id: 'tournament',
      name: 'Tournament Mode',
      description: 'Competitive bracket-style tournament',
      timeLimit: 600,
      difficulty: 'hard',
      estimatedDuration: 60,
      maxPlayers: 16,
      features: ['Bracket system', 'Elimination rounds', 'Leaderboards']
    },
    {
      id: 'chaos',
      name: 'Chaos Mode',
      description: 'Unpredictable game with random events',
      difficulty: 'expert',
      estimatedDuration: 25,
      maxPlayers: 6,
      features: ['Random events', 'Power-ups', 'Dynamic board', 'Chaos multipliers']
    },
    {
      id: 'zen',
      name: 'Zen Mode',
      description: 'Relaxed gameplay with no time pressure',
      difficulty: 'easy',
      estimatedDuration: 30,
      maxPlayers: 2,
      features: ['No time limit', 'Undo moves', 'Hint system', 'Relaxing atmosphere']
    }
  ];

  const selectMode = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
  }, []);

  const createCustomMode = useCallback((name: string, settings: GameModeSettings): GameMode => {
    const customMode: GameMode = {
      id: `custom_${Date.now()}`,
      name,
      description: 'Custom game mode created by player',
      difficulty: 'varied',
      estimatedDuration: 20,
      maxPlayers: 8,
      features: ['Custom rules', 'Player-defined settings']
    };
    
    return customMode;
  }, []);

  return {
    availableModes,
    selectedMode,
    selectMode,
    createCustomMode
  };
};

export default useGameModes;