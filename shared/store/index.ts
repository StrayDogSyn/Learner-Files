// Shared State Management Library
// Unified state management using Zustand for all platforms

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  User,
  Portfolio,
  Project,
  ContactMessage,
  AnalyticsMetrics,
  AnalyticsEvent,
  AuthSession,
  UserPreferences,
  NotificationData,
  GameState,
  AppState,
  UserState,
  PortfolioState,
  ProjectState,
  AnalyticsState,
  UIState,
  SettingsState,
  PortfolioFilters,
  ProjectFilters,
  DateRange,
  PaginationInfo,
  ModalState,
  ToastState
} from '../types';
import { portfolioAPI } from '../api';

// Storage adapters for different platforms
const getStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage;
  }
  // For Node.js/CLI environments, use a simple in-memory storage
  const memoryStorage = {
    getItem: (key: string) => memoryStorage[key] || null,
    setItem: (key: string, value: string) => { memoryStorage[key] = value; },
    removeItem: (key: string) => { delete memoryStorage[key]; }
  } as any;
  return memoryStorage;
};

// User Store
interface UserStore extends UserState {
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: AuthSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>()()
  (persist(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial state
        currentUser: null,
        session: null,
        loading: false,
        error: null,

        // Actions
        setUser: (user) => set((state) => {
          state.currentUser = user;
        }),

        setSession: (session) => set((state) => {
          state.session = session;
          if (session) {
            portfolioAPI.setAuthToken(session.accessToken, session.refreshToken);
          } else {
            portfolioAPI.clearAuthToken();
          }
        }),

        setLoading: (loading) => set((state) => {
          state.loading = loading;
        }),

        setError: (error) => set((state) => {
          state.error = error;
        }),

        login: async (email, password) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await portfolioAPI.login({ email, password });
            if (response.success && response.data) {
              const { user, token, refreshToken } = response.data;
              const session: AuthSession = {
                user,
                accessToken: token,
                refreshToken,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                permissions: [],
                scopes: []
              };
              
              set((state) => {
                state.currentUser = user;
                state.session = session;
                state.loading = false;
              });
              
              portfolioAPI.setAuthToken(token, refreshToken);
            }
          } catch (error: any) {
            set((state) => {
              state.error = error.message || 'Login failed';
              state.loading = false;
            });
            throw error;
          }
        },

        logout: async () => {
          try {
            await portfolioAPI.logout();
          } catch (error) {
            console.warn('Logout API call failed:', error);
          } finally {
            set((state) => {
              state.currentUser = null;
              state.session = null;
              state.error = null;
            });
            portfolioAPI.clearAuthToken();
          }
        },

        register: async (data) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await portfolioAPI.register(data);
            if (response.success && response.data) {
              const { user, token, refreshToken } = response.data;
              const session: AuthSession = {
                user,
                accessToken: token,
                refreshToken,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                permissions: [],
                scopes: []
              };
              
              set((state) => {
                state.currentUser = user;
                state.session = session;
                state.loading = false;
              });
              
              portfolioAPI.setAuthToken(token, refreshToken);
            }
          } catch (error: any) {
            set((state) => {
              state.error = error.message || 'Registration failed';
              state.loading = false;
            });
            throw error;
          }
        },

        updateUser: async (data) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await portfolioAPI.updateUser(data);
            if (response.success && response.data) {
              set((state) => {
                state.currentUser = response.data;
                state.loading = false;
              });
            }
          } catch (error: any) {
            set((state) => {
              state.error = error.message || 'Update failed';
              state.loading = false;
            });
            throw error;
          }
        },

        refreshSession: async () => {
          const { session } = get();
          if (!session?.refreshToken) return;

          try {
            const response = await portfolioAPI.refreshToken();
            if (response.success && response.data) {
              const { token, refreshToken } = response.data;
              set((state) => {
                if (state.session) {
                  state.session.accessToken = token;
                  state.session.refreshToken = refreshToken;
                  state.session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                }
              });
              portfolioAPI.setAuthToken(token, refreshToken);
            }
          } catch (error) {
            // Refresh failed, logout user
            get().logout();
          }
        },

        clearError: () => set((state) => {
          state.error = null;
        })
      }))
    ),
    {
      name: 'user-store',
      storage: createJSONStorage(() => getStorage()),
      partialize: (state) => ({
        currentUser: state.currentUser,
        session: state.session
      })
    }
  ));

// Portfolio Store
interface PortfolioStore extends PortfolioState {
  // Actions
  setPortfolios: (portfolios: Portfolio[]) => void;
  setCurrent: (portfolio: Portfolio | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<PortfolioFilters>) => void;
  setPagination: (pagination: PaginationInfo) => void;
  fetchPortfolios: (params?: any) => Promise<void>;
  fetchPortfolio: (id: string) => Promise<void>;
  fetchPortfolioBySlug: (slug: string) => Promise<void>;
  createPortfolio: (data: Partial<Portfolio>) => Promise<Portfolio>;
  updatePortfolio: (id: string, data: Partial<Portfolio>) => Promise<void>;
  deletePortfolio: (id: string) => Promise<void>;
  clearError: () => void;
}

export const usePortfolioStore = create<PortfolioStore>()()
  (subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      current: null,
      portfolios: [],
      loading: false,
      error: null,
      filters: {},
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      },

      // Actions
      setPortfolios: (portfolios) => set((state) => {
        state.portfolios = portfolios;
      }),

      setCurrent: (portfolio) => set((state) => {
        state.current = portfolio;
      }),

      setLoading: (loading) => set((state) => {
        state.loading = loading;
      }),

      setError: (error) => set((state) => {
        state.error = error;
      }),

      setFilters: (filters) => set((state) => {
        state.filters = { ...state.filters, ...filters };
      }),

      setPagination: (pagination) => set((state) => {
        state.pagination = pagination;
      }),

      fetchPortfolios: async (params) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          const response = await portfolioAPI.getPortfolios(params);
          if (response.success && response.data) {
            set((state) => {
              state.portfolios = response.data!;
              state.pagination = response.pagination || state.pagination;
              state.loading = false;
            });
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Failed to fetch portfolios';
            state.loading = false;
          });
        }
      },

      fetchPortfolio: async (id) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          const response = await portfolioAPI.getPortfolio(id);
          if (response.success && response.data) {
            set((state) => {
              state.current = response.data!;
              state.loading = false;
            });
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Failed to fetch portfolio';
            state.loading = false;
          });
        }
      },

      fetchPortfolioBySlug: async (slug) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          const response = await portfolioAPI.getPortfolioBySlug(slug);
          if (response.success && response.data) {
            set((state) => {
              state.current = response.data!;
              state.loading = false;
            });
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Failed to fetch portfolio';
            state.loading = false;
          });
        }
      },

      createPortfolio: async (data) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          const response = await portfolioAPI.createPortfolio(data);
          if (response.success && response.data) {
            set((state) => {
              state.portfolios.push(response.data!);
              state.current = response.data!;
              state.loading = false;
            });
            return response.data;
          }
          throw new Error('Failed to create portfolio');
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Failed to create portfolio';
            state.loading = false;
          });
          throw error;
        }
      },

      updatePortfolio: async (id, data) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          const response = await portfolioAPI.updatePortfolio(id, data);
          if (response.success && response.data) {
            set((state) => {
              const index = state.portfolios.findIndex(p => p.id === id);
              if (index !== -1) {
                state.portfolios[index] = response.data!;
              }
              if (state.current?.id === id) {
                state.current = response.data!;
              }
              state.loading = false;
            });
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Failed to update portfolio';
            state.loading = false;
          });
          throw error;
        }
      },

      deletePortfolio: async (id) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          await portfolioAPI.deletePortfolio(id);
          set((state) => {
            state.portfolios = state.portfolios.filter(p => p.id !== id);
            if (state.current?.id === id) {
              state.current = null;
            }
            state.loading = false;
          });
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Failed to delete portfolio';
            state.loading = false;
          });
          throw error;
        }
      },

      clearError: () => set((state) => {
        state.error = null;
      })
    }))
  ));

// UI Store
interface UIStore extends UIState {
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<NotificationData, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  openModal: (modal: Omit<ModalState, 'open'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  addToast: (toast: Omit<ToastState, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useUIStore = create<UIStore>()()
  (persist(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial state
        theme: 'auto',
        sidebarOpen: true,
        mobileMenuOpen: false,
        loading: false,
        notifications: [],
        modals: [],
        toasts: [],

        // Actions
        setTheme: (theme) => set((state) => {
          state.theme = theme;
        }),

        toggleSidebar: () => set((state) => {
          state.sidebarOpen = !state.sidebarOpen;
        }),

        setSidebarOpen: (open) => set((state) => {
          state.sidebarOpen = open;
        }),

        toggleMobileMenu: () => set((state) => {
          state.mobileMenuOpen = !state.mobileMenuOpen;
        }),

        setMobileMenuOpen: (open) => set((state) => {
          state.mobileMenuOpen = open;
        }),

        setLoading: (loading) => set((state) => {
          state.loading = loading;
        }),

        addNotification: (notification) => set((state) => {
          const newNotification: NotificationData = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString()
          };
          state.notifications.unshift(newNotification);
        }),

        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id);
        }),

        markNotificationRead: (id) => set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          if (notification) {
            notification.read = true;
          }
        }),

        clearNotifications: () => set((state) => {
          state.notifications = [];
        }),

        openModal: (modal) => set((state) => {
          const newModal: ModalState = {
            ...modal,
            open: true
          };
          state.modals.push(newModal);
        }),

        closeModal: (id) => set((state) => {
          const modal = state.modals.find(m => m.id === id);
          if (modal) {
            modal.open = false;
          }
        }),

        closeAllModals: () => set((state) => {
          state.modals.forEach(modal => {
            modal.open = false;
          });
        }),

        addToast: (toast) => set((state) => {
          const newToast: ToastState = {
            ...toast,
            id: Math.random().toString(36).substr(2, 9)
          };
          state.toasts.push(newToast);
        }),

        removeToast: (id) => set((state) => {
          state.toasts = state.toasts.filter(t => t.id !== id);
        }),

        clearToasts: () => set((state) => {
          state.toasts = [];
        })
      }))
    ),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => getStorage()),
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen
      })
    }
  ));

// Analytics Store
interface AnalyticsStore extends AnalyticsState {
  // Actions
  setMetrics: (metrics: AnalyticsMetrics | null) => void;
  setEvents: (events: AnalyticsEvent[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDateRange: (dateRange: DateRange) => void;
  fetchMetrics: (portfolioId: string, params?: any) => Promise<void>;
  fetchEvents: (portfolioId: string, params?: any) => Promise<void>;
  trackEvent: (portfolioId: string, event: Partial<AnalyticsEvent>) => Promise<void>;
  clearError: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>()()
  (subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      metrics: null,
      events: [],
      loading: false,
      error: null,
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      },

      // Actions
      setMetrics: (metrics) => set((state) => {
        state.metrics = metrics;
      }),

      setEvents: (events) => set((state) => {
        state.events = events;
      }),

      setLoading: (loading) => set((state) => {
        state.loading = loading;
      }),

      setError: (error) => set((state) => {
        state.error = error;
      }),

      setDateRange: (dateRange) => set((state) => {
        state.dateRange = dateRange;
      }),

      fetchMetrics: async (portfolioId, params) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          const response = await portfolioAPI.getAnalytics(portfolioId, params);
          if (response.success && response.data) {
            set((state) => {
              state.metrics = response.data!;
              state.loading = false;
            });
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Failed to fetch analytics';
            state.loading = false;
          });
        }
      },

      fetchEvents: async (portfolioId, params) => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          const response = await portfolioAPI.getAnalyticsEvents(portfolioId, params);
          if (response.success && response.data) {
            set((state) => {
              state.events = response.data!;
              state.loading = false;
            });
          }
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Failed to fetch events';
            state.loading = false;
          });
        }
      },

      trackEvent: async (portfolioId, event) => {
        try {
          await portfolioAPI.trackEvent(portfolioId, event);
        } catch (error) {
          console.warn('Failed to track event:', error);
        }
      },

      clearError: () => set((state) => {
        state.error = null;
      })
    }))
  ));

// Game Store
interface GameStore extends GameState {
  // Actions
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  setLevel: (level: number) => void;
  setLives: (lives: number) => void;
  setEnergy: (energy: number) => void;
  addExperience: (exp: number) => void;
  addCoins: (coins: number) => void;
  addGems: (gems: number) => void;
  activatePowerUp: (powerUpId: string) => void;
  deactivatePowerUp: (powerUpId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  updateStatistics: (stats: Partial<GameStatistics>) => void;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()()
  (persist(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial state
        score: 0,
        level: 1,
        lives: 3,
        energy: 100,
        experience: 0,
        coins: 0,
        gems: 0,
        powerUps: [],
        achievements: [],
        settings: {
          soundEnabled: true,
          musicEnabled: true,
          vibrationEnabled: true,
          difficulty: 'normal',
          controls: 'auto',
          graphics: 'high',
          language: 'en',
          notifications: true
        },
        statistics: {
          totalPlayTime: 0,
          gamesPlayed: 0,
          highScore: 0,
          totalScore: 0,
          averageScore: 0,
          bestTime: 0,
          totalDeaths: 0,
          achievementsUnlocked: 0,
          powerUpsUsed: 0,
          coinsCollected: 0,
          gemsCollected: 0,
          levelsCompleted: 0,
          streakRecord: 0,
          firstPlayedAt: new Date().toISOString(),
          lastPlayedAt: new Date().toISOString()
        },
        saveData: {
          version: '1.0.0',
          playerId: '',
          timestamp: new Date().toISOString(),
          checksum: '',
          compressed: false,
          data: {}
        },

        // Actions
        setScore: (score) => set((state) => {
          state.score = score;
          if (score > state.statistics.highScore) {
            state.statistics.highScore = score;
          }
        }),

        addScore: (points) => set((state) => {
          state.score += points;
          state.statistics.totalScore += points;
          if (state.score > state.statistics.highScore) {
            state.statistics.highScore = state.score;
          }
        }),

        setLevel: (level) => set((state) => {
          state.level = level;
        }),

        setLives: (lives) => set((state) => {
          state.lives = lives;
        }),

        setEnergy: (energy) => set((state) => {
          state.energy = Math.max(0, Math.min(100, energy));
        }),

        addExperience: (exp) => set((state) => {
          state.experience += exp;
        }),

        addCoins: (coins) => set((state) => {
          state.coins += coins;
          state.statistics.coinsCollected += coins;
        }),

        addGems: (gems) => set((state) => {
          state.gems += gems;
          state.statistics.gemsCollected += gems;
        }),

        activatePowerUp: (powerUpId) => set((state) => {
          const powerUp = state.powerUps.find(p => p.id === powerUpId);
          if (powerUp) {
            powerUp.active = true;
            powerUp.expiresAt = new Date(Date.now() + powerUp.duration * 1000).toISOString();
            state.statistics.powerUpsUsed++;
          }
        }),

        deactivatePowerUp: (powerUpId) => set((state) => {
          const powerUp = state.powerUps.find(p => p.id === powerUpId);
          if (powerUp) {
            powerUp.active = false;
            powerUp.expiresAt = undefined;
          }
        }),

        unlockAchievement: (achievementId) => set((state) => {
          const achievement = state.achievements.find(a => a.id === achievementId);
          if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
            state.statistics.achievementsUnlocked++;
          }
        }),

        updateSettings: (settings) => set((state) => {
          state.settings = { ...state.settings, ...settings };
        }),

        updateStatistics: (stats) => set((state) => {
          state.statistics = { ...state.statistics, ...stats };
          state.statistics.lastPlayedAt = new Date().toISOString();
        }),

        saveGame: () => {
          const state = get();
          const saveData = {
            version: '1.0.0',
            playerId: state.saveData.playerId || Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            checksum: '',
            compressed: false,
            data: {
              score: state.score,
              level: state.level,
              lives: state.lives,
              energy: state.energy,
              experience: state.experience,
              coins: state.coins,
              gems: state.gems,
              powerUps: state.powerUps,
              achievements: state.achievements,
              statistics: state.statistics
            }
          };
          
          set((state) => {
            state.saveData = saveData;
          });
        },

        loadGame: () => {
          const state = get();
          const { data } = state.saveData;
          if (data && Object.keys(data).length > 0) {
            set((state) => {
              Object.assign(state, data);
            });
          }
        },

        resetGame: () => set((state) => {
          state.score = 0;
          state.level = 1;
          state.lives = 3;
          state.energy = 100;
          state.experience = 0;
          state.coins = 0;
          state.gems = 0;
          state.powerUps.forEach(p => {
            p.active = false;
            p.expiresAt = undefined;
          });
          state.statistics.gamesPlayed++;
        })
      }))
    ),
    {
      name: 'game-store',
      storage: createJSONStorage(() => getStorage())
    }
  ));

// Combined App Store (for accessing all stores)
export const useAppStore = () => {
  const user = useUserStore();
  const portfolio = usePortfolioStore();
  const ui = useUIStore();
  const analytics = useAnalyticsStore();
  const game = useGameStore();

  return {
    user,
    portfolio,
    ui,
    analytics,
    game
  };
};

// Store utilities
export const resetAllStores = () => {
  useUserStore.getState().logout();
  usePortfolioStore.setState({
    current: null,
    portfolios: [],
    loading: false,
    error: null,
    filters: {},
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    }
  });
  useUIStore.setState({
    theme: 'auto',
    sidebarOpen: true,
    mobileMenuOpen: false,
    loading: false,
    notifications: [],
    modals: [],
    toasts: []
  });
  useAnalyticsStore.setState({
    metrics: null,
    events: [],
    loading: false,
    error: null,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString()
    }
  });
};

// Store persistence utilities
export const clearPersistedStores = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user-store');
    localStorage.removeItem('ui-store');
    localStorage.removeItem('game-store');
  }
};

/**
 * Shared State Management Library
 * 
 * Provides unified state management using Zustand with:
 * - Persistent storage across sessions
 * - Immer integration for immutable updates
 * - Subscription support for reactive updates
 * - Platform-agnostic storage adapters
 * - Type-safe store interfaces
 * - Automatic API integration
 * - Error handling and loading states
 * - Cross-store communication
 * 
 * Usage:
 * ```typescript
 * import { useUserStore, usePortfolioStore, useAppStore } from '@shared/store';
 * 
 * // Use individual stores
 * const { currentUser, login } = useUserStore();
 * const { portfolios, fetchPortfolios } = usePortfolioStore();
 * 
 * // Use combined app store
 * const { user, portfolio, ui } = useAppStore();
 * ```
 */