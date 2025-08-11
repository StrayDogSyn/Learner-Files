import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: Date;
}

export interface UserProgress {
  sectionsVisited: string[];
  challengesCompleted: string[];
  timeSpent: number;
  lastVisit: Date;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  challenge: string;
  completedAt: Date;
  timeToComplete: number;
}

export interface GameState {
  // User Progress
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  
  // Achievements & Badges
  achievements: Achievement[];
  unlockedAchievements: string[];
  badges: Badge[];
  
  // Progress Tracking
  userProgress: UserProgress;
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];
  userRank: number;
  
  // Social Features
  sharedAchievements: string[];
  
  // Settings
  username: string;
  showNotifications: boolean;
  
  // Actions
  addXP: (amount: number) => void;
  addAchievement: (achievement: Omit<Achievement, 'unlockedAt'>) => void;
  addBadge: (badge: Omit<Badge, 'earnedAt'>) => void;
  updateProgress: (section: string) => void;
  completeChallenge: (challengeId: string, score: number, timeToComplete: number) => void;
  shareAchievement: (achievementId: string) => void;
  setUsername: (username: string) => void;
  resetProgress: () => void;
  getAchievementsByRarity: (rarity: Achievement['rarity']) => Achievement[];
  getRecentAchievements: (limit?: number) => Achievement[];
  calculateLevel: (xp: number) => { level: number; xpToNext: number };
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'welcome',
    title: 'Welcome Explorer',
    description: 'Welcome to the interactive portfolio!',
    icon: '👋',
    rarity: 'common',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'first-visit',
    title: 'First Steps',
    description: 'Visited your first portfolio section',
    icon: '🚀',
    rarity: 'common',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'section-explorer',
    title: 'Section Explorer',
    description: 'Visited 5 different portfolio sections',
    icon: '🗺️',
    rarity: 'rare',
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'time-traveler',
    title: 'Time Traveler',
    description: 'Spent 10 minutes exploring the portfolio',
    icon: '⏰',
    rarity: 'rare',
    progress: 0,
    maxProgress: 600 // 10 minutes in seconds
  },
  {
    id: 'challenge-master',
    title: 'Challenge Master',
    description: 'Completed 10 coding challenges',
    icon: '🏆',
    rarity: 'epic',
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'algorithm-expert',
    title: 'Algorithm Expert',
    description: 'Mastered all algorithm visualizations',
    icon: '🧠',
    rarity: 'legendary',
    progress: 0,
    maxProgress: 5
  }
];

const calculateLevelFromXP = (xp: number) => {
  // Level formula: level = floor(sqrt(xp / 100))
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpForNextLevel = Math.pow(level, 2) * 100;
  const xpToNext = xpForNextLevel - xp;
  
  return { level, xpToNext };
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      totalXP: 0,
      achievements: INITIAL_ACHIEVEMENTS,
      unlockedAchievements: [],
      badges: [],
      userProgress: {
        sectionsVisited: [],
        challengesCompleted: [],
        timeSpent: 0,
        lastVisit: new Date()
      },
      leaderboard: [],
      userRank: 0,
      sharedAchievements: [],
      username: '',
      showNotifications: true,

      // Actions
      addXP: (amount: number) => {
        set((state) => {
          const newTotalXP = state.totalXP + amount;
          const { level, xpToNext } = calculateLevelFromXP(newTotalXP);
          
          // Check for level up achievements
          if (level > state.level) {
            // Level up achievement
            const levelUpAchievement: Achievement = {
              id: `level-${level}`,
              title: `Level ${level} Reached!`,
              description: `Congratulations on reaching level ${level}!`,
              icon: '⭐',
              rarity: level >= 10 ? 'legendary' : level >= 5 ? 'epic' : 'rare',
              unlockedAt: new Date()
            };
            
            return {
              ...state,
              xp: newTotalXP,
              totalXP: newTotalXP,
              level,
              xpToNextLevel: xpToNext,
              achievements: [...state.achievements, levelUpAchievement],
              unlockedAchievements: [...state.unlockedAchievements, levelUpAchievement.id]
            };
          }
          
          return {
            ...state,
            xp: newTotalXP,
            totalXP: newTotalXP,
            level,
            xpToNextLevel: xpToNext
          };
        });
      },

      addAchievement: (achievement: Omit<Achievement, 'unlockedAt'>) => {
        set((state) => {
          // Check if achievement already unlocked
          if (state.unlockedAchievements.includes(achievement.id)) {
            return state;
          }
          
          const newAchievement: Achievement = {
            ...achievement,
            unlockedAt: new Date()
          };
          
          // Award XP based on rarity
          const xpReward = {
            common: 25,
            rare: 50,
            epic: 100,
            legendary: 200
          }[achievement.rarity];
          
          return {
            ...state,
            achievements: state.achievements.map(a => 
              a.id === achievement.id ? newAchievement : a
            ),
            unlockedAchievements: [...state.unlockedAchievements, achievement.id],
            xp: state.xp + xpReward,
            totalXP: state.totalXP + xpReward
          };
        });
      },

      addBadge: (badge: Omit<Badge, 'earnedAt'>) => {
        set((state) => ({
          ...state,
          badges: [...state.badges, { ...badge, earnedAt: new Date() }]
        }));
      },

      updateProgress: (section: string) => {
        set((state) => {
          const sectionsVisited = state.userProgress.sectionsVisited.includes(section)
            ? state.userProgress.sectionsVisited
            : [...state.userProgress.sectionsVisited, section];
          
          const newState = {
            ...state,
            userProgress: {
              ...state.userProgress,
              sectionsVisited,
              lastVisit: new Date()
            }
          };
          
          // Check for section exploration achievements
          if (sectionsVisited.length === 1 && !state.unlockedAchievements.includes('first-visit')) {
            get().addAchievement({
              id: 'first-visit',
              title: 'First Steps',
              description: 'Visited your first portfolio section',
              icon: '🚀',
              rarity: 'common'
            });
          }
          
          if (sectionsVisited.length >= 5 && !state.unlockedAchievements.includes('section-explorer')) {
            get().addAchievement({
              id: 'section-explorer',
              title: 'Section Explorer',
              description: 'Visited 5 different portfolio sections',
              icon: '🗺️',
              rarity: 'rare'
            });
          }
          
          return newState;
        });
      },

      completeChallenge: (challengeId: string, score: number, timeToComplete: number) => {
        set((state) => {
          const challengesCompleted = state.userProgress.challengesCompleted.includes(challengeId)
            ? state.userProgress.challengesCompleted
            : [...state.userProgress.challengesCompleted, challengeId];
          
          const leaderboardEntry: LeaderboardEntry = {
            id: Date.now().toString(),
            username: state.username || 'Anonymous',
            score,
            challenge: challengeId,
            completedAt: new Date(),
            timeToComplete
          };
          
          const newLeaderboard = [...state.leaderboard, leaderboardEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 100); // Keep top 100
          
          const userRank = newLeaderboard.findIndex(entry => 
            entry.username === (state.username || 'Anonymous')
          ) + 1;
          
          return {
            ...state,
            userProgress: {
              ...state.userProgress,
              challengesCompleted
            },
            leaderboard: newLeaderboard,
            userRank
          };
        });
      },

      shareAchievement: (achievementId: string) => {
        set((state) => ({
          ...state,
          sharedAchievements: [...state.sharedAchievements, achievementId]
        }));
      },

      setUsername: (username: string) => {
        set((state) => ({ ...state, username }));
      },

      resetProgress: () => {
        set(() => ({
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          totalXP: 0,
          achievements: INITIAL_ACHIEVEMENTS,
          unlockedAchievements: [],
          badges: [],
          userProgress: {
            sectionsVisited: [],
            challengesCompleted: [],
            timeSpent: 0,
            lastVisit: new Date()
          },
          leaderboard: [],
          userRank: 0,
          sharedAchievements: [],
          username: '',
          showNotifications: true
        }));
      },

      getAchievementsByRarity: (rarity: Achievement['rarity']) => {
        const state = get();
        return state.achievements.filter(achievement => 
          achievement.rarity === rarity && 
          state.unlockedAchievements.includes(achievement.id)
        );
      },

      getRecentAchievements: (limit = 5) => {
        const state = get();
        return state.achievements
          .filter(achievement => state.unlockedAchievements.includes(achievement.id))
          .sort((a, b) => {
            if (!a.unlockedAt || !b.unlockedAt) return 0;
            return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
          })
          .slice(0, limit);
      },

      calculateLevel: calculateLevelFromXP
    }),
    {
      name: 'game-store',
      version: 1
    }
  )
);