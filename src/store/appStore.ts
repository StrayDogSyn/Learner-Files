import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  GameId,
  GameCategory,
  GameDifficulty,
  GameMetadata
} from '@/components/games';
import type {
  UnifiedAPIService,
  ServiceStatus,
  APIMetrics
} from '@/services/api';

// Theme types
export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink';

// Navigation types
export type NavigationItem = {
  id: string;
  label: string;
  path: string;
  icon?: string;
  category?: string;
  isExternal?: boolean;
  requiresAuth?: boolean;
  badge?: string | number;
};

// User types
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  preferences: UserPreferences;
  stats: UserStats;
  achievements: Achievement[];
  createdAt: number;
  lastLoginAt: number;
};

export type UserPreferences = {
  theme: Theme;
  colorScheme: ColorScheme;
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
  privacy: PrivacySettings;
  gameSettings: GameSettings;
};

export type NotificationSettings = {
  email: boolean;
  push: boolean;
  desktop: boolean;
  sound: boolean;
  achievements: boolean;
  updates: boolean;
  marketing: boolean;
};

export type AccessibilitySettings = {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
};

export type PrivacySettings = {
  analytics: boolean;
  cookies: boolean;
  dataSharing: boolean;
  profileVisibility: 'public' | 'private' | 'friends';
};

export type GameSettings = {
  defaultDifficulty: GameDifficulty;
  autoSave: boolean;
  soundEffects: boolean;
  backgroundMusic: boolean;
  hapticFeedback: boolean;
  showHints: boolean;
  trackPerformance: boolean;
};

export type UserStats = {
  totalPlayTime: number;
  gamesPlayed: number;
  achievementsUnlocked: number;
  favoriteGame?: GameId;
  streak: {
    current: number;
    longest: number;
    lastPlayDate: number;
  };
  skillLevels: Record<GameCategory, number>;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: GameCategory | 'general';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlockedAt?: number;
  hidden: boolean;
};

// Project types
export type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  status: 'active' | 'completed' | 'archived' | 'draft';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  startDate: number;
  endDate?: number;
  lastModified: number;
  metadata: Record<string, any>;
  settings: Record<string, any>;
};

// Session types
export type Session = {
  id: string;
  userId?: string;
  startTime: number;
  lastActivity: number;
  isActive: boolean;
  device: {
    type: 'desktop' | 'tablet' | 'mobile';
    os: string;
    browser: string;
    screen: {
      width: number;
      height: number;
      pixelRatio: number;
    };
  };
  location?: {
    country: string;
    region: string;
    city: string;
    timezone: string;
  };
  performance: {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
    networkSpeed: 'slow' | 'medium' | 'fast';
  };
};

// API types
export type APIState = {
  isInitialized: boolean;
  services: Record<string, ServiceStatus>;
  metrics: Record<string, APIMetrics>;
  lastHealthCheck: number;
  errors: APIError[];
};

export type APIError = {
  id: string;
  service: string;
  message: string;
  timestamp: number;
  resolved: boolean;
};

// UI types
export type UIState = {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  fullscreen: boolean;
  loading: boolean;
  modal: {
    isOpen: boolean;
    type?: string;
    data?: any;
  };
  toast: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    actions?: Array<{
      label: string;
      action: () => void;
    }>;
  }[];
  breadcrumbs: Array<{
    label: string;
    path?: string;
  }>;
  searchQuery: string;
  searchResults: any[];
  searchLoading: boolean;
};

// Main store state
export interface AppState {
  // Core state
  initialized: boolean;
  version: string;
  buildDate: string;
  
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  ui: UIState;
  
  // Navigation state
  navigation: {
    currentPath: string;
    history: string[];
    items: NavigationItem[];
    favorites: string[];
  };
  
  // Projects state
  projects: {
    items: Project[];
    activeProject: string | null;
    recentProjects: string[];
    categories: string[];
    tags: string[];
  };
  
  // Games state
  games: {
    metadata: Record<GameId, GameMetadata>;
    favorites: GameId[];
    recentlyPlayed: GameId[];
    statistics: Record<GameId, any>;
    achievements: Record<GameId, Achievement[]>;
  };
  
  // Session state
  session: Session;
  
  // API state
  api: APIState;
  
  // Cache state
  cache: {
    data: Record<string, any>;
    timestamps: Record<string, number>;
    ttl: Record<string, number>;
  };
}

// Store actions
export interface AppActions {
  // Initialization
  initialize: () => Promise<void>;
  reset: () => void;
  
  // User actions
  setUser: (user: User | null) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  updateUserStats: (stats: Partial<UserStats>) => void;
  addAchievement: (achievement: Achievement) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setFullscreen: (fullscreen: boolean) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  showToast: (toast: Omit<UIState['toast'][0], 'id'>) => void;
  hideToast: (id: string) => void;
  setBreadcrumbs: (breadcrumbs: UIState['breadcrumbs']) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void;
  setSearchLoading: (loading: boolean) => void;
  
  // Navigation actions
  setCurrentPath: (path: string) => void;
  addToHistory: (path: string) => void;
  addToFavorites: (path: string) => void;
  removeFromFavorites: (path: string) => void;
  updateNavigationItems: (items: NavigationItem[]) => void;
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'lastModified'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  addToRecentProjects: (id: string) => void;
  
  // Game actions
  updateGameMetadata: (gameId: GameId, metadata: Partial<GameMetadata>) => void;
  addToGameFavorites: (gameId: GameId) => void;
  removeFromGameFavorites: (gameId: GameId) => void;
  addToRecentlyPlayed: (gameId: GameId) => void;
  updateGameStatistics: (gameId: GameId, stats: any) => void;
  addGameAchievement: (gameId: GameId, achievement: Achievement) => void;
  
  // Session actions
  updateSession: (updates: Partial<Session>) => void;
  trackActivity: () => void;
  
  // API actions
  setAPIService: (service: UnifiedAPIService) => void;
  updateAPIStatus: (services: Record<string, ServiceStatus>) => void;
  updateAPIMetrics: (metrics: Record<string, APIMetrics>) => void;
  addAPIError: (error: Omit<APIError, 'id'>) => void;
  resolveAPIError: (id: string) => void;
  
  // Cache actions
  setCache: (key: string, data: any, ttl?: number) => void;
  getCache: (key: string) => any;
  clearCache: (key?: string) => void;
  cleanExpiredCache: () => void;
  
  // Utility actions
  exportData: () => string;
  importData: (data: string) => void;
  clearAllData: () => void;
}

// Default values
const defaultUser: User = {
  id: '',
  name: '',
  email: '',
  role: 'guest',
  preferences: {
    theme: 'system',
    colorScheme: 'blue',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: {
      email: true,
      push: true,
      desktop: true,
      sound: true,
      achievements: true,
      updates: true,
      marketing: false
    },
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      screenReader: false,
      keyboardNavigation: false
    },
    privacy: {
      analytics: true,
      cookies: true,
      dataSharing: false,
      profileVisibility: 'public'
    },
    gameSettings: {
      defaultDifficulty: 'medium',
      autoSave: true,
      soundEffects: true,
      backgroundMusic: true,
      hapticFeedback: true,
      showHints: true,
      trackPerformance: true
    }
  },
  stats: {
    totalPlayTime: 0,
    gamesPlayed: 0,
    achievementsUnlocked: 0,
    streak: {
      current: 0,
      longest: 0,
      lastPlayDate: 0
    },
    skillLevels: {
      puzzle: 1,
      strategy: 1,
      action: 1,
      educational: 1,
      utility: 1
    }
  },
  achievements: [],
  createdAt: Date.now(),
  lastLoginAt: Date.now()
};

const defaultUIState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  fullscreen: false,
  loading: false,
  modal: {
    isOpen: false
  },
  toast: [],
  breadcrumbs: [],
  searchQuery: '',
  searchResults: [],
  searchLoading: false
};

const defaultSession: Session = {
  id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  startTime: Date.now(),
  lastActivity: Date.now(),
  isActive: true,
  device: {
    type: 'desktop',
    os: navigator.platform,
    browser: navigator.userAgent.split(' ').pop() || 'unknown',
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      pixelRatio: window.devicePixelRatio
    }
  },
  performance: {
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkSpeed: 'medium'
  }
};

// Create the store
export const useAppStore = create<AppState & AppActions>()
  (subscribeWithSelector(
    persist(
      immer((set, get) => ({
        // Initial state
        initialized: false,
        version: '1.0.0',
        buildDate: new Date().toISOString(),
        user: null,
        isAuthenticated: false,
        ui: defaultUIState,
        navigation: {
          currentPath: '/',
          history: ['/'],
          items: [],
          favorites: []
        },
        projects: {
          items: [],
          activeProject: null,
          recentProjects: [],
          categories: [],
          tags: []
        },
        games: {
          metadata: {},
          favorites: [],
          recentlyPlayed: [],
          statistics: {},
          achievements: {}
        },
        session: defaultSession,
        api: {
          isInitialized: false,
          services: {},
          metrics: {},
          lastHealthCheck: 0,
          errors: []
        },
        cache: {
          data: {},
          timestamps: {},
          ttl: {}
        },
        
        // Actions
        initialize: async () => {
          set((state) => {
            state.initialized = true;
            state.session.startTime = Date.now();
            state.session.lastActivity = Date.now();
          });
        },
        
        reset: () => {
          set((state) => {
            Object.assign(state, {
              user: null,
              isAuthenticated: false,
              ui: defaultUIState,
              navigation: {
                currentPath: '/',
                history: ['/'],
                items: [],
                favorites: []
              },
              projects: {
                items: [],
                activeProject: null,
                recentProjects: [],
                categories: [],
                tags: []
              },
              games: {
                metadata: {},
                favorites: [],
                recentlyPlayed: [],
                statistics: {},
                achievements: {}
              },
              cache: {
                data: {},
                timestamps: {},
                ttl: {}
              }
            });
          });
        },
        
        // User actions
        setUser: (user) => {
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
            if (user) {
              state.user!.lastLoginAt = Date.now();
            }
          });
        },
        
        updateUserPreferences: (preferences) => {
          set((state) => {
            if (state.user) {
              Object.assign(state.user.preferences, preferences);
            }
          });
        },
        
        updateUserStats: (stats) => {
          set((state) => {
            if (state.user) {
              Object.assign(state.user.stats, stats);
            }
          });
        },
        
        addAchievement: (achievement) => {
          set((state) => {
            if (state.user) {
              state.user.achievements.push({
                ...achievement,
                unlockedAt: Date.now()
              });
              state.user.stats.achievementsUnlocked++;
            }
          });
        },
        
        // UI actions
        setLoading: (loading) => {
          set((state) => {
            state.ui.loading = loading;
          });
        },
        
        setSidebarOpen: (open) => {
          set((state) => {
            state.ui.sidebarOpen = open;
          });
        },
        
        setSidebarCollapsed: (collapsed) => {
          set((state) => {
            state.ui.sidebarCollapsed = collapsed;
          });
        },
        
        setFullscreen: (fullscreen) => {
          set((state) => {
            state.ui.fullscreen = fullscreen;
          });
        },
        
        openModal: (type, data) => {
          set((state) => {
            state.ui.modal = {
              isOpen: true,
              type,
              data
            };
          });
        },
        
        closeModal: () => {
          set((state) => {
            state.ui.modal = {
              isOpen: false
            };
          });
        },
        
        showToast: (toast) => {
          set((state) => {
            const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            state.ui.toast.push({ ...toast, id });
          });
        },
        
        hideToast: (id) => {
          set((state) => {
            state.ui.toast = state.ui.toast.filter(t => t.id !== id);
          });
        },
        
        setBreadcrumbs: (breadcrumbs) => {
          set((state) => {
            state.ui.breadcrumbs = breadcrumbs;
          });
        },
        
        setSearchQuery: (query) => {
          set((state) => {
            state.ui.searchQuery = query;
          });
        },
        
        setSearchResults: (results) => {
          set((state) => {
            state.ui.searchResults = results;
          });
        },
        
        setSearchLoading: (loading) => {
          set((state) => {
            state.ui.searchLoading = loading;
          });
        },
        
        // Navigation actions
        setCurrentPath: (path) => {
          set((state) => {
            state.navigation.currentPath = path;
          });
        },
        
        addToHistory: (path) => {
          set((state) => {
            if (state.navigation.history[state.navigation.history.length - 1] !== path) {
              state.navigation.history.push(path);
              // Keep only last 50 items
              if (state.navigation.history.length > 50) {
                state.navigation.history = state.navigation.history.slice(-50);
              }
            }
          });
        },
        
        addToFavorites: (path) => {
          set((state) => {
            if (!state.navigation.favorites.includes(path)) {
              state.navigation.favorites.push(path);
            }
          });
        },
        
        removeFromFavorites: (path) => {
          set((state) => {
            state.navigation.favorites = state.navigation.favorites.filter(f => f !== path);
          });
        },
        
        updateNavigationItems: (items) => {
          set((state) => {
            state.navigation.items = items;
          });
        },
        
        // Project actions
        addProject: (project) => {
          set((state) => {
            const newProject: Project = {
              ...project,
              id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              lastModified: Date.now()
            };
            state.projects.items.push(newProject);
            
            // Update categories and tags
            if (!state.projects.categories.includes(project.category)) {
              state.projects.categories.push(project.category);
            }
            project.tags.forEach(tag => {
              if (!state.projects.tags.includes(tag)) {
                state.projects.tags.push(tag);
              }
            });
          });
        },
        
        updateProject: (id, updates) => {
          set((state) => {
            const project = state.projects.items.find(p => p.id === id);
            if (project) {
              Object.assign(project, updates, { lastModified: Date.now() });
            }
          });
        },
        
        deleteProject: (id) => {
          set((state) => {
            state.projects.items = state.projects.items.filter(p => p.id !== id);
            state.projects.recentProjects = state.projects.recentProjects.filter(p => p !== id);
            if (state.projects.activeProject === id) {
              state.projects.activeProject = null;
            }
          });
        },
        
        setActiveProject: (id) => {
          set((state) => {
            state.projects.activeProject = id;
            if (id) {
              get().addToRecentProjects(id);
            }
          });
        },
        
        addToRecentProjects: (id) => {
          set((state) => {
            state.projects.recentProjects = [
              id,
              ...state.projects.recentProjects.filter(p => p !== id)
            ].slice(0, 10); // Keep only last 10
          });
        },
        
        // Game actions
        updateGameMetadata: (gameId, metadata) => {
          set((state) => {
            state.games.metadata[gameId] = {
              ...state.games.metadata[gameId],
              ...metadata
            };
          });
        },
        
        addToGameFavorites: (gameId) => {
          set((state) => {
            if (!state.games.favorites.includes(gameId)) {
              state.games.favorites.push(gameId);
            }
          });
        },
        
        removeFromGameFavorites: (gameId) => {
          set((state) => {
            state.games.favorites = state.games.favorites.filter(g => g !== gameId);
          });
        },
        
        addToRecentlyPlayed: (gameId) => {
          set((state) => {
            state.games.recentlyPlayed = [
              gameId,
              ...state.games.recentlyPlayed.filter(g => g !== gameId)
            ].slice(0, 10); // Keep only last 10
          });
        },
        
        updateGameStatistics: (gameId, stats) => {
          set((state) => {
            state.games.statistics[gameId] = {
              ...state.games.statistics[gameId],
              ...stats
            };
          });
        },
        
        addGameAchievement: (gameId, achievement) => {
          set((state) => {
            if (!state.games.achievements[gameId]) {
              state.games.achievements[gameId] = [];
            }
            state.games.achievements[gameId].push({
              ...achievement,
              unlockedAt: Date.now()
            });
          });
        },
        
        // Session actions
        updateSession: (updates) => {
          set((state) => {
            Object.assign(state.session, updates);
          });
        },
        
        trackActivity: () => {
          set((state) => {
            state.session.lastActivity = Date.now();
          });
        },
        
        // API actions
        setAPIService: (service) => {
          set((state) => {
            state.api.isInitialized = true;
          });
        },
        
        updateAPIStatus: (services) => {
          set((state) => {
            state.api.services = services;
            state.api.lastHealthCheck = Date.now();
          });
        },
        
        updateAPIMetrics: (metrics) => {
          set((state) => {
            state.api.metrics = metrics;
          });
        },
        
        addAPIError: (error) => {
          set((state) => {
            const id = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            state.api.errors.push({ ...error, id, resolved: false });
          });
        },
        
        resolveAPIError: (id) => {
          set((state) => {
            const error = state.api.errors.find(e => e.id === id);
            if (error) {
              error.resolved = true;
            }
          });
        },
        
        // Cache actions
        setCache: (key, data, ttl = 300000) => { // Default 5 minutes
          set((state) => {
            state.cache.data[key] = data;
            state.cache.timestamps[key] = Date.now();
            state.cache.ttl[key] = ttl;
          });
        },
        
        getCache: (key) => {
          const state = get();
          const timestamp = state.cache.timestamps[key];
          const ttl = state.cache.ttl[key];
          
          if (!timestamp || !ttl) {
            return null;
          }
          
          if (Date.now() - timestamp > ttl) {
            // Expired, clean up
            get().clearCache(key);
            return null;
          }
          
          return state.cache.data[key];
        },
        
        clearCache: (key) => {
          set((state) => {
            if (key) {
              delete state.cache.data[key];
              delete state.cache.timestamps[key];
              delete state.cache.ttl[key];
            } else {
              state.cache.data = {};
              state.cache.timestamps = {};
              state.cache.ttl = {};
            }
          });
        },
        
        cleanExpiredCache: () => {
          const state = get();
          const now = Date.now();
          
          Object.keys(state.cache.timestamps).forEach(key => {
            const timestamp = state.cache.timestamps[key];
            const ttl = state.cache.ttl[key];
            
            if (now - timestamp > ttl) {
              get().clearCache(key);
            }
          });
        },
        
        // Utility actions
        exportData: () => {
          const state = get();
          return JSON.stringify({
            user: state.user,
            projects: state.projects,
            games: state.games,
            navigation: state.navigation,
            exportedAt: Date.now(),
            version: state.version
          }, null, 2);
        },
        
        importData: (data) => {
          try {
            const parsed = JSON.parse(data);
            set((state) => {
              if (parsed.user) state.user = parsed.user;
              if (parsed.projects) state.projects = parsed.projects;
              if (parsed.games) state.games = parsed.games;
              if (parsed.navigation) state.navigation = parsed.navigation;
            });
          } catch (error) {
            console.error('Failed to import data:', error);
            throw new Error('Invalid data format');
          }
        },
        
        clearAllData: () => {
          set((state) => {
            Object.assign(state, {
              user: null,
              isAuthenticated: false,
              projects: {
                items: [],
                activeProject: null,
                recentProjects: [],
                categories: [],
                tags: []
              },
              games: {
                metadata: {},
                favorites: [],
                recentlyPlayed: [],
                statistics: {},
                achievements: {}
              },
              navigation: {
                currentPath: '/',
                history: ['/'],
                items: [],
                favorites: []
              },
              cache: {
                data: {},
                timestamps: {},
                ttl: {}
              }
            });
          });
        }
      })),
      {
        name: 'learner-files-app-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          projects: state.projects,
          games: state.games,
          navigation: {
            favorites: state.navigation.favorites,
            items: state.navigation.items
          },
          ui: {
            sidebarCollapsed: state.ui.sidebarCollapsed,
            sidebarOpen: state.ui.sidebarOpen
          }
        }),
        version: 1,
        migrate: (persistedState: any, version: number) => {
          // Handle migrations between versions
          if (version === 0) {
            // Migration from version 0 to 1
            return {
              ...persistedState,
              version: '1.0.0'
            };
          }
          return persistedState;
        }
      }
    )
  ));

// Selectors for optimized access
export const useUser = () => useAppStore(state => state.user);
export const useIsAuthenticated = () => useAppStore(state => state.isAuthenticated);
export const useTheme = () => useAppStore(state => state.user?.preferences.theme || 'system');
export const useColorScheme = () => useAppStore(state => state.user?.preferences.colorScheme || 'blue');
export const useUI = () => useAppStore(state => state.ui);
export const useNavigation = () => useAppStore(state => state.navigation);
export const useProjects = () => useAppStore(state => state.projects);
export const useGames = () => useAppStore(state => state.games);
export const useSession = () => useAppStore(state => state.session);
export const useAPI = () => useAppStore(state => state.api);
export const useCache = () => useAppStore(state => state.cache);

// Action selectors
export const useAppActions = () => useAppStore(state => ({
  initialize: state.initialize,
  reset: state.reset,
  setUser: state.setUser,
  updateUserPreferences: state.updateUserPreferences,
  updateUserStats: state.updateUserStats,
  addAchievement: state.addAchievement,
  setLoading: state.setLoading,
  setSidebarOpen: state.setSidebarOpen,
  setSidebarCollapsed: state.setSidebarCollapsed,
  setFullscreen: state.setFullscreen,
  openModal: state.openModal,
  closeModal: state.closeModal,
  showToast: state.showToast,
  hideToast: state.hideToast,
  setBreadcrumbs: state.setBreadcrumbs,
  setSearchQuery: state.setSearchQuery,
  setSearchResults: state.setSearchResults,
  setSearchLoading: state.setSearchLoading,
  setCurrentPath: state.setCurrentPath,
  addToHistory: state.addToHistory,
  addToFavorites: state.addToFavorites,
  removeFromFavorites: state.removeFromFavorites,
  updateNavigationItems: state.updateNavigationItems,
  addProject: state.addProject,
  updateProject: state.updateProject,
  deleteProject: state.deleteProject,
  setActiveProject: state.setActiveProject,
  addToRecentProjects: state.addToRecentProjects,
  updateGameMetadata: state.updateGameMetadata,
  addToGameFavorites: state.addToGameFavorites,
  removeFromGameFavorites: state.removeFromGameFavorites,
  addToRecentlyPlayed: state.addToRecentlyPlayed,
  updateGameStatistics: state.updateGameStatistics,
  addGameAchievement: state.addGameAchievement,
  updateSession: state.updateSession,
  trackActivity: state.trackActivity,
  setAPIService: state.setAPIService,
  updateAPIStatus: state.updateAPIStatus,
  updateAPIMetrics: state.updateAPIMetrics,
  addAPIError: state.addAPIError,
  resolveAPIError: state.resolveAPIError,
  setCache: state.setCache,
  getCache: state.getCache,
  clearCache: state.clearCache,
  cleanExpiredCache: state.cleanExpiredCache,
  exportData: state.exportData,
  importData: state.importData,
  clearAllData: state.clearAllData
}));

// Initialize store on app start
if (typeof window !== 'undefined') {
  // Clean expired cache on startup
  useAppStore.getState().cleanExpiredCache();
  
  // Track activity on user interaction
  const trackActivity = () => useAppStore.getState().trackActivity();
  
  window.addEventListener('click', trackActivity);
  window.addEventListener('keydown', trackActivity);
  window.addEventListener('scroll', trackActivity);
  window.addEventListener('mousemove', trackActivity);
  
  // Clean expired cache every 5 minutes
  setInterval(() => {
    useAppStore.getState().cleanExpiredCache();
  }, 300000);
}