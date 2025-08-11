import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface GameEvent {
  type: 'start' | 'end' | 'pause' | 'resume' | 'reset' | 'achievement' | 'audio_toggle' | 'custom';
  gameId: string;
  timestamp: Date;
  data?: any;
}

interface GameStats {
  totalSessions: number;
  totalPlayTime: number; // in seconds
  completedSessions: number;
  averageScore: number;
  bestScore: number;
  achievements: string[];
  lastPlayed?: Date;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  category?: 'puzzle' | 'strategy' | 'arcade' | 'educational' | 'utility';
  customStats?: Record<string, any>;
}

interface GameState {
  [gameId: string]: any;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  animationsEnabled: boolean;
  autoSave: boolean;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  notifications: boolean;
  analytics: boolean;
  performance: boolean;
}

interface GameStoreState {
  // Game states
  gameStates: GameState;
  
  // Game statistics
  gameStats: Record<string, GameStats>;
  
  // Analytics events
  analyticsEvents: GameEvent[];
  
  // User preferences
  preferences: UserPreferences;
  
  // Current session info
  currentSession: {
    gameId: string | null;
    startTime: Date | null;
    isPlaying: boolean;
    isPaused: boolean;
  };
  
  // Global stats
  globalStats: {
    totalGamesPlayed: number;
    totalPlayTime: number;
    favoriteGame: string | null;
    achievementCount: number;
    lastActivity: Date | null;
  };
}

interface GameStoreActions {
  // Game state actions
  updateGameState: (gameId: string, state: any) => void;
  getGameState: (gameId: string) => any;
  deleteGameState: (gameId: string) => void;
  
  // Game stats actions
  updateGameStats: (gameId: string, stats: Partial<GameStats>) => void;
  getGameStats: (gameId: string) => GameStats;
  resetGameStats: (gameId: string) => void;
  
  // Analytics actions
  addAnalyticsEvent: (event: GameEvent) => void;
  getAnalyticsEvents: (gameId?: string) => GameEvent[];
  clearAnalyticsEvents: (gameId?: string) => void;
  
  // Preferences actions
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  
  // Session actions
  startSession: (gameId: string) => void;
  endSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  
  // Global stats actions
  updateGlobalStats: () => void;
  
  // Utility actions
  exportData: () => string;
  importData: (data: string) => boolean;
  clearAllData: () => void;
}

type GameStore = GameStoreState & GameStoreActions;

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  soundEnabled: true,
  animationsEnabled: true,
  autoSave: true,
  language: 'en',
  difficulty: 'medium',
  notifications: true,
  analytics: true,
  performance: true
};

const defaultGameStats: GameStats = {
  totalSessions: 0,
  totalPlayTime: 0,
  completedSessions: 0,
  averageScore: 0,
  bestScore: 0,
  achievements: []
};

export const useGameStore = create<GameStore>()()
  (persist(
    immer((set, get) => ({
      // Initial state
      gameStates: {},
      gameStats: {},
      analyticsEvents: [],
      preferences: defaultPreferences,
      currentSession: {
        gameId: null,
        startTime: null,
        isPlaying: false,
        isPaused: false
      },
      globalStats: {
        totalGamesPlayed: 0,
        totalPlayTime: 0,
        favoriteGame: null,
        achievementCount: 0,
        lastActivity: null
      },
      
      // Game state actions
      updateGameState: (gameId: string, state: any) => {
        set((draft) => {
          draft.gameStates[gameId] = state;
        });
      },
      
      getGameState: (gameId: string) => {
        return get().gameStates[gameId] || null;
      },
      
      deleteGameState: (gameId: string) => {
        set((draft) => {
          delete draft.gameStates[gameId];
        });
      },
      
      // Game stats actions
      updateGameStats: (gameId: string, stats: Partial<GameStats>) => {
        set((draft) => {
          if (!draft.gameStats[gameId]) {
            draft.gameStats[gameId] = { ...defaultGameStats };
          }
          Object.assign(draft.gameStats[gameId], stats);
        });
        
        // Update global stats
        get().updateGlobalStats();
      },
      
      getGameStats: (gameId: string) => {
        return get().gameStats[gameId] || { ...defaultGameStats };
      },
      
      resetGameStats: (gameId: string) => {
        set((draft) => {
          draft.gameStats[gameId] = { ...defaultGameStats };
        });
      },
      
      // Analytics actions
      addAnalyticsEvent: (event: GameEvent) => {
        set((draft) => {
          draft.analyticsEvents.push({
            ...event,
            timestamp: new Date(event.timestamp)
          });
          
          // Keep only last 1000 events
          if (draft.analyticsEvents.length > 1000) {
            draft.analyticsEvents = draft.analyticsEvents.slice(-1000);
          }
        });
      },
      
      getAnalyticsEvents: (gameId?: string) => {
        const events = get().analyticsEvents;
        return gameId ? events.filter(event => event.gameId === gameId) : events;
      },
      
      clearAnalyticsEvents: (gameId?: string) => {
        set((draft) => {
          if (gameId) {
            draft.analyticsEvents = draft.analyticsEvents.filter(
              event => event.gameId !== gameId
            );
          } else {
            draft.analyticsEvents = [];
          }
        });
      },
      
      // Preferences actions
      updatePreferences: (preferences: Partial<UserPreferences>) => {
        set((draft) => {
          Object.assign(draft.preferences, preferences);
        });
      },
      
      resetPreferences: () => {
        set((draft) => {
          draft.preferences = { ...defaultPreferences };
        });
      },
      
      // Session actions
      startSession: (gameId: string) => {
        set((draft) => {
          draft.currentSession = {
            gameId,
            startTime: new Date(),
            isPlaying: true,
            isPaused: false
          };
          draft.globalStats.lastActivity = new Date();
        });
      },
      
      endSession: () => {
        const session = get().currentSession;
        if (session.gameId && session.startTime) {
          const duration = Math.floor(
            (new Date().getTime() - session.startTime.getTime()) / 1000
          );
          
          // Update game stats
          const currentStats = get().getGameStats(session.gameId);
          get().updateGameStats(session.gameId, {
            ...currentStats,
            totalPlayTime: currentStats.totalPlayTime + duration,
            completedSessions: currentStats.completedSessions + 1
          });
        }
        
        set((draft) => {
          draft.currentSession = {
            gameId: null,
            startTime: null,
            isPlaying: false,
            isPaused: false
          };
        });
      },
      
      pauseSession: () => {
        set((draft) => {
          draft.currentSession.isPaused = true;
        });
      },
      
      resumeSession: () => {
        set((draft) => {
          draft.currentSession.isPaused = false;
        });
      },
      
      // Global stats actions
      updateGlobalStats: () => {
        set((draft) => {
          const allStats = Object.values(draft.gameStats);
          
          draft.globalStats.totalGamesPlayed = Object.keys(draft.gameStats).length;
          draft.globalStats.totalPlayTime = allStats.reduce(
            (sum, stats) => sum + stats.totalPlayTime, 0
          );
          draft.globalStats.achievementCount = allStats.reduce(
            (sum, stats) => sum + stats.achievements.length, 0
          );
          
          // Find favorite game (most played)
          let favoriteGame = null;
          let maxPlayTime = 0;
          
          Object.entries(draft.gameStats).forEach(([gameId, stats]) => {
            if (stats.totalPlayTime > maxPlayTime) {
              maxPlayTime = stats.totalPlayTime;
              favoriteGame = gameId;
            }
          });
          
          draft.globalStats.favoriteGame = favoriteGame;
        });
      },
      
      // Utility actions
      exportData: () => {
        const state = get();
        return JSON.stringify({
          gameStates: state.gameStates,
          gameStats: state.gameStats,
          analyticsEvents: state.analyticsEvents,
          preferences: state.preferences,
          globalStats: state.globalStats,
          exportedAt: new Date().toISOString(),
          version: '1.0.0'
        }, null, 2);
      },
      
      importData: (data: string) => {
        try {
          const importedData = JSON.parse(data);
          
          set((draft) => {
            if (importedData.gameStates) {
              draft.gameStates = importedData.gameStates;
            }
            if (importedData.gameStats) {
              draft.gameStats = importedData.gameStats;
            }
            if (importedData.analyticsEvents) {
              draft.analyticsEvents = importedData.analyticsEvents.map((event: any) => ({
                ...event,
                timestamp: new Date(event.timestamp)
              }));
            }
            if (importedData.preferences) {
              draft.preferences = { ...defaultPreferences, ...importedData.preferences };
            }
            if (importedData.globalStats) {
              draft.globalStats = importedData.globalStats;
            }
          });
          
          return true;
        } catch (error) {
          console.error('Failed to import data:', error);
          return false;
        }
      },
      
      clearAllData: () => {
        set((draft) => {
          draft.gameStates = {};
          draft.gameStats = {};
          draft.analyticsEvents = [];
          draft.preferences = { ...defaultPreferences };
          draft.currentSession = {
            gameId: null,
            startTime: null,
            isPlaying: false,
            isPaused: false
          };
          draft.globalStats = {
            totalGamesPlayed: 0,
            totalPlayTime: 0,
            favoriteGame: null,
            achievementCount: 0,
            lastActivity: null
          };
        });
      }
    })),
    {
      name: 'game-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        gameStates: state.gameStates,
        gameStats: state.gameStats,
        analyticsEvents: state.analyticsEvents.slice(-100), // Only persist last 100 events
        preferences: state.preferences,
        globalStats: state.globalStats
        // Don't persist currentSession as it's runtime state
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle migrations between versions
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...persistedState,
            preferences: { ...defaultPreferences, ...persistedState.preferences },
            globalStats: persistedState.globalStats || {
              totalGamesPlayed: 0,
              totalPlayTime: 0,
              favoriteGame: null,
              achievementCount: 0,
              lastActivity: null
            }
          };
        }
        return persistedState;
      }
    }
  ));

// Selectors for better performance
export const useGameStates = () => useGameStore(state => state.gameStates);
export const useGameStats = () => useGameStore(state => state.gameStats);
export const useAnalyticsEvents = () => useGameStore(state => state.analyticsEvents);
export const usePreferences = () => useGameStore(state => state.preferences);
export const useCurrentSession = () => useGameStore(state => state.currentSession);
export const useGlobalStats = () => useGameStore(state => state.globalStats);

// Specific game selectors
export const useGameState = (gameId: string) => 
  useGameStore(state => state.gameStates[gameId]);

export const useGameStatistics = (gameId: string) => 
  useGameStore(state => state.gameStats[gameId] || defaultGameStats);

export const useGameAnalytics = (gameId: string) => 
  useGameStore(state => state.analyticsEvents.filter(event => event.gameId === gameId));

// Action selectors
export const useGameActions = () => useGameStore(state => ({
  updateGameState: state.updateGameState,
  getGameState: state.getGameState,
  deleteGameState: state.deleteGameState,
  updateGameStats: state.updateGameStats,
  getGameStats: state.getGameStats,
  resetGameStats: state.resetGameStats,
  addAnalyticsEvent: state.addAnalyticsEvent,
  getAnalyticsEvents: state.getAnalyticsEvents,
  clearAnalyticsEvents: state.clearAnalyticsEvents,
  updatePreferences: state.updatePreferences,
  resetPreferences: state.resetPreferences,
  startSession: state.startSession,
  endSession: state.endSession,
  pauseSession: state.pauseSession,
  resumeSession: state.resumeSession,
  updateGlobalStats: state.updateGlobalStats,
  exportData: state.exportData,
  importData: state.importData,
  clearAllData: state.clearAllData
}));

export type { 
  GameEvent, 
  GameStats, 
  GameState, 
  UserPreferences, 
  GameStoreState, 
  GameStoreActions 
};