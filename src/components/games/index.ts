// Game Wrapper Components
import KnucklebonesWrapper from './KnucklebonesWrapper';
import CalculatorWrapper from './CalculatorWrapper';
import QuizNinjaWrapper from './QuizNinjaWrapper';
import CountdownWrapper from './CountdownWrapper';
import RockPaperScissorsWrapper from './RockPaperScissorsWrapper';
import CompTIAWrapper from './CompTIAWrapper';

export { KnucklebonesWrapper, CalculatorWrapper, QuizNinjaWrapper, CountdownWrapper, RockPaperScissorsWrapper, CompTIAWrapper };

// Game Wrapper Types
export interface GameWrapperProps {
  className?: string;
}

// Game Categories
export const GAME_CATEGORIES = {
  STRATEGY: 'strategy',
  EDUCATIONAL: 'educational',
  PRODUCTIVITY: 'productivity',
  UTILITY: 'utility',
  ENTERTAINMENT: 'entertainment'
} as const;

// Game Difficulties
export const GAME_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
  ADAPTIVE: 'adaptive'
} as const;

// Game Metadata
export const GAME_METADATA = {
  knucklebones: {
    id: 'knucklebones',
    title: 'Knucklebones',
    description: 'Strategic dice placement game with AI opponents and tournaments!',
    category: GAME_CATEGORIES.STRATEGY,
    defaultDifficulty: GAME_DIFFICULTIES.MEDIUM,
    features: ['AI Opponents', 'Tournament Mode', 'Multiplayer', 'Statistics', 'Achievements'],
    tags: ['dice', 'strategy', 'ai', 'tournament', 'multiplayer']
  },
  calculator: {
    id: 'calculator',
    title: 'Advanced Calculator',
    description: 'Multi-mode calculator with scientific, programming, and graphing capabilities!',
    category: GAME_CATEGORIES.UTILITY,
    defaultDifficulty: GAME_DIFFICULTIES.EASY,
    features: ['Scientific Mode', 'Programming Mode', 'Graphing', 'Unit Conversion', 'History'],
    tags: ['calculator', 'math', 'scientific', 'programming', 'utility']
  },
  quizninja: {
    id: 'quizninja',
    title: 'Quiz Ninja',
    description: 'Test your knowledge across multiple categories with timed challenges!',
    category: GAME_CATEGORIES.EDUCATIONAL,
    defaultDifficulty: GAME_DIFFICULTIES.MEDIUM,
    features: ['Multiple Categories', 'Timed Challenges', 'Power-ups', 'Achievements', 'Statistics'],
    tags: ['quiz', 'trivia', 'knowledge', 'education', 'timed']
  },
  countdown: {
    id: 'countdown',
    title: 'Countdown Timer',
    description: 'Focus timer with presets for productivity, meditation, and breaks!',
    category: GAME_CATEGORIES.PRODUCTIVITY,
    defaultDifficulty: GAME_DIFFICULTIES.EASY,
    features: ['Preset Timers', 'Custom Durations', 'Sound Alerts', 'Progress Tracking', 'Productivity Scoring'],
    tags: ['timer', 'productivity', 'focus', 'pomodoro', 'meditation']
  },
  rockpaperscissors: {
    id: 'rockpaperscissors',
    title: 'Rock Paper Scissors',
    description: 'Classic strategy game with AI opponents and pattern recognition!',
    category: GAME_CATEGORIES.STRATEGY,
    defaultDifficulty: GAME_DIFFICULTIES.MEDIUM,
    features: ['AI Opponents', 'Pattern Recognition', 'Multiple Game Modes', 'Statistics', 'Achievements'],
    tags: ['rps', 'strategy', 'ai', 'pattern', 'classic']
  },
  comptia: {
    id: 'comptia',
    title: 'CompTIA Study Center',
    description: 'Comprehensive CompTIA certification exam preparation and practice!',
    category: GAME_CATEGORIES.EDUCATIONAL,
    defaultDifficulty: GAME_DIFFICULTIES.ADAPTIVE,
    features: ['Multiple Certifications', 'Timed Exams', 'Domain Tracking', 'Progress Analytics', 'Readiness Assessment'],
    tags: ['comptia', 'certification', 'study', 'exam', 'it']
  }
} as const;

// Game Registry
export const GAME_REGISTRY = {
  knucklebones: KnucklebonesWrapper,
  calculator: CalculatorWrapper,
  quizninja: QuizNinjaWrapper,
  countdown: CountdownWrapper,
  rockpaperscissors: RockPaperScissorsWrapper,
  comptia: CompTIAWrapper
} as const;

// Helper functions
export const getGameComponent = (gameId: keyof typeof GAME_REGISTRY) => {
  return GAME_REGISTRY[gameId];
};

export const getGameMetadata = (gameId: keyof typeof GAME_METADATA) => {
  return GAME_METADATA[gameId];
};

export const getAllGames = () => {
  return Object.keys(GAME_METADATA) as Array<keyof typeof GAME_METADATA>;
};

export const getGamesByCategory = (category: string) => {
  return Object.entries(GAME_METADATA)
    .filter(([_, metadata]) => metadata.category === category)
    .map(([gameId]) => gameId as keyof typeof GAME_METADATA);
};

export const searchGames = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return Object.entries(GAME_METADATA)
    .filter(([gameId, metadata]) => {
      return (
        gameId.toLowerCase().includes(lowercaseQuery) ||
        metadata.title.toLowerCase().includes(lowercaseQuery) ||
        metadata.description.toLowerCase().includes(lowercaseQuery) ||
        metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    })
    .map(([gameId]) => gameId as keyof typeof GAME_METADATA);
};

// Interface definitions
export interface GameMetadataInterface {
  id: string;
  title: string;
  description: string;
  category: string;
  defaultDifficulty: string;
  features: string[];
  tags: string[];
}

// Type exports
export type GameId = keyof typeof GAME_METADATA;
export type GameCategory = typeof GAME_CATEGORIES[keyof typeof GAME_CATEGORIES];
export type GameDifficulty = typeof GAME_DIFFICULTIES[keyof typeof GAME_DIFFICULTIES];
export type GameMetadata = GameMetadataInterface;