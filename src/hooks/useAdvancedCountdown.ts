import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Timer,
  TimeLeft,
  UseTimerReturn,
  UseTimersReturn,
  UsePomodoroReturn,
  UseAnalyticsReturn,
  PomodoroSession,
  PomodoroSettings,
  PomodoroStats,
  ProductivityAnalytics,
  AnalyticsPeriod,
  TimerCategory,
  SharedTimer,
  Notification,
  NotificationType
} from '../types/countdown';

// Individual Timer Hook
export const useTimer = (initialTimer: Timer): UseTimerReturn => {
  const [timer, setTimer] = useState<Timer>(initialTimer);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const calculateTimeLeft = useCallback((targetDate: Date): TimeLeft => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    return {
      total: distance,
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  }, []);

  const updateTimer = useCallback(() => {
    const newTimeLeft = calculateTimeLeft(timer.targetDate);
    setTimeLeft(newTimeLeft);
    
    if (newTimeLeft.total <= 0 && !isExpired) {
      setIsExpired(true);
      setIsRunning(false);
      setTimer(prev => ({
        ...prev,
        status: 'completed',
        completedAt: new Date(),
        isExpired: true
      }));
      
      // Trigger completion callback
      if (timer.notifications.browser) {
        showNotification('Timer Complete!', `${timer.name} has finished.`, 'success');
      }
      
      // Play sound alert
      if (timer.soundAlert?.enabled) {
        playSound(timer.soundAlert);
      }
    }
  }, [timer, isExpired, calculateTimeLeft]);

  const start = useCallback(() => {
    if (isExpired) return;
    
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    
    setTimer(prev => ({
      ...prev,
      status: 'active',
      updatedAt: new Date()
    }));
  }, [isExpired]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
    pausedTimeRef.current = Date.now();
    
    setTimer(prev => ({
      ...prev,
      status: 'paused',
      updatedAt: new Date()
    }));
  }, []);

  const resume = useCallback(() => {
    if (!isPaused) return;
    
    const pausedDuration = Date.now() - pausedTimeRef.current;
    const newTargetDate = new Date(timer.targetDate.getTime() + pausedDuration);
    
    setTimer(prev => ({
      ...prev,
      targetDate: newTargetDate,
      status: 'active',
      updatedAt: new Date()
    }));
    
    setIsRunning(true);
    setIsPaused(false);
  }, [isPaused, timer.targetDate]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    
    setTimer(prev => ({
      ...prev,
      status: 'cancelled',
      updatedAt: new Date()
    }));
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setIsExpired(false);
    
    const originalDuration = timer.targetDate.getTime() - timer.createdAt.getTime();
    const newTargetDate = new Date(Date.now() + originalDuration);
    
    setTimer(prev => ({
      ...prev,
      targetDate: newTargetDate,
      status: 'scheduled',
      completedAt: undefined,
      isExpired: false,
      updatedAt: new Date()
    }));
  }, [timer]);

  const addTime = useCallback((minutes: number) => {
    const newTargetDate = new Date(timer.targetDate.getTime() + (minutes * 60 * 1000));
    setTimer(prev => ({
      ...prev,
      targetDate: newTargetDate,
      updatedAt: new Date()
    }));
  }, [timer.targetDate]);

  const setTargetDate = useCallback((date: Date) => {
    setTimer(prev => ({
      ...prev,
      targetDate: date,
      updatedAt: new Date()
    }));
    setIsExpired(false);
  }, []);

  // Update timer every second when running
  useEffect(() => {
    if (isRunning && !isExpired) {
      intervalRef.current = setInterval(updateTimer, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isExpired, updateTimer]);

  // Initial time calculation
  useEffect(() => {
    updateTimer();
  }, [updateTimer]);

  return {
    timer,
    timeLeft,
    isRunning,
    isPaused,
    isExpired,
    start,
    pause,
    resume,
    stop,
    reset,
    addTime,
    setTargetDate
  };
};

// Multiple Timers Management Hook
export const useTimers = (): UseTimersReturn => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [categories, setCategories] = useState<TimerCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeTimers = timers.filter(timer => 
    timer.status === 'active' || timer.status === 'paused'
  );
  
  const completedTimers = timers.filter(timer => 
    timer.status === 'completed'
  );

  const generateId = () => {
    return `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const createTimer = useCallback(async (timerData: Omit<Timer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Timer> => {
    setLoading(true);
    setError(null);
    
    try {
      const newTimer: Timer = {
        ...timerData,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        timeLeft: {
          total: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        isExpired: false,
        analytics: {
          totalTimeTracked: 0,
          completionRate: 0,
          averageCompletionTime: 0,
          streakCount: 0,
          longestStreak: 0,
          productivityScore: 0,
          focusTime: 0,
          breakTime: 0
        }
      };
      
      setTimers(prev => [...prev, newTimer]);
      
      // Save to localStorage
      const updatedTimers = [...timers, newTimer];
      localStorage.setItem('countdown_timers', JSON.stringify(updatedTimers));
      
      return newTimer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create timer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [timers]);

  const updateTimer = useCallback(async (id: string, updates: Partial<Timer>): Promise<Timer> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedTimers = timers.map(timer => 
        timer.id === id 
          ? { ...timer, ...updates, updatedAt: new Date() }
          : timer
      );
      
      setTimers(updatedTimers);
      
      // Save to localStorage
      localStorage.setItem('countdown_timers', JSON.stringify(updatedTimers));
      
      const updatedTimer = updatedTimers.find(timer => timer.id === id);
      if (!updatedTimer) {
        throw new Error('Timer not found after update');
      }
      
      return updatedTimer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update timer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [timers]);

  const deleteTimer = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedTimers = timers.filter(timer => timer.id !== id);
      setTimers(updatedTimers);
      
      // Save to localStorage
      localStorage.setItem('countdown_timers', JSON.stringify(updatedTimers));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete timer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [timers]);

  const duplicateTimer = useCallback(async (id: string): Promise<Timer> => {
    const originalTimer = timers.find(timer => timer.id === id);
    if (!originalTimer) {
      throw new Error('Timer not found');
    }
    
    const duplicatedTimer = {
      ...originalTimer,
      name: `${originalTimer.name} (Copy)`,
      targetDate: new Date(Date.now() + (originalTimer.targetDate.getTime() - originalTimer.createdAt.getTime()))
    };
    
    return createTimer(duplicatedTimer);
  }, [timers, createTimer]);

  const shareTimer = useCallback(async (id: string, shareType: 'public' | 'private' | 'team'): Promise<SharedTimer> => {
    const timer = timers.find(t => t.id === id);
    if (!timer) {
      throw new Error('Timer not found');
    }
    
    const sharedTimer: SharedTimer = {
      id: generateId(),
      timerId: id,
      ownerId: 'current_user', // This would come from auth context
      shareType,
      permissions: {
        canView: true,
        canEdit: shareType === 'team',
        canDelete: false,
        canShare: shareType === 'public',
        canComment: true
      },
      accessCode: shareType === 'private' ? Math.random().toString(36).substr(2, 8).toUpperCase() : undefined,
      viewers: [],
      collaborators: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real app, this would be saved to a backend
    localStorage.setItem(`shared_timer_${sharedTimer.id}`, JSON.stringify(sharedTimer));
    
    return sharedTimer;
  }, [timers]);

  const importTimers = useCallback(async (data: Timer[]): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const validatedTimers = data.map(timer => ({
        ...timer,
        id: generateId(), // Generate new IDs to avoid conflicts
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      setTimers(prev => [...prev, ...validatedTimers]);
      
      // Save to localStorage
      const allTimers = [...timers, ...validatedTimers];
      localStorage.setItem('countdown_timers', JSON.stringify(allTimers));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import timers');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [timers]);

  const exportTimers = useCallback(async (format: 'json' | 'csv' | 'ical'): Promise<string> => {
    switch (format) {
      case 'json':
        return JSON.stringify(timers, null, 2);
      
      case 'csv':
        const headers = ['Name', 'Description', 'Target Date', 'Category', 'Status', 'Created At'];
        const rows = timers.map(timer => [
          timer.name,
          timer.description || '',
          timer.targetDate.toISOString(),
          timer.category.name,
          timer.status,
          timer.createdAt.toISOString()
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      
      case 'ical':
        const icalEvents = timers.map(timer => {
          const start = timer.targetDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
          return [
            'BEGIN:VEVENT',
            `UID:${timer.id}`,
            `DTSTART:${start}`,
            `SUMMARY:${timer.name}`,
            `DESCRIPTION:${timer.description || ''}`,
            'END:VEVENT'
          ].join('\n');
        });
        
        return [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Countdown Timer//EN',
          ...icalEvents,
          'END:VCALENDAR'
        ].join('\n');
      
      default:
        throw new Error('Unsupported export format');
    }
  }, [timers]);

  // Load timers from localStorage on mount
  useEffect(() => {
    const savedTimers = localStorage.getItem('countdown_timers');
    if (savedTimers) {
      try {
        const parsedTimers = JSON.parse(savedTimers).map((timer: any) => ({
          ...timer,
          createdAt: new Date(timer.createdAt),
          updatedAt: new Date(timer.updatedAt),
          targetDate: new Date(timer.targetDate),
          completedAt: timer.completedAt ? new Date(timer.completedAt) : undefined
        }));
        setTimers(parsedTimers);
      } catch (err) {
        console.error('Failed to load timers from localStorage:', err);
      }
    }
  }, []);

  return {
    timers,
    activeTimers,
    completedTimers,
    createTimer,
    updateTimer,
    deleteTimer,
    duplicateTimer,
    shareTimer,
    importTimers,
    exportTimers
  };
};

// Pomodoro Timer Hook
export const usePomodoro = (): UsePomodoroReturn => {
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true,
    notificationsEnabled: true,
    strictMode: false
  });
  const [stats, setStats] = useState<PomodoroStats>({
    totalSessions: 0,
    completedSessions: 0,
    totalFocusTime: 0,
    totalBreakTime: 0,
    averageProductivity: 0,
    streakDays: 0,
    longestStreak: 0,
    dailyGoal: 8,
    weeklyGoal: 40,
    monthlyStats: []
  });
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sessionType: 'work' | 'shortBreak' | 'longBreak' = 
    currentSession?.type || 'work';

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const startSession = useCallback((type: 'work' | 'shortBreak' | 'longBreak' = 'work') => {
    const duration = type === 'work' 
      ? settings.workDuration 
      : type === 'shortBreak' 
        ? settings.shortBreakDuration 
        : settings.longBreakDuration;
    
    const session: PomodoroSession = {
      id: generateSessionId(),
      type,
      duration,
      startTime: new Date(),
      completed: false,
      interrupted: false,
      productivity: 0,
      tags: [],
      notes: ''
    };
    
    setCurrentSession(session);
    setTimeLeft(duration * 60); // Convert to seconds
    setIsRunning(true);
    
    if (type === 'work') {
      setSessionCount(prev => prev + 1);
    }
  }, [settings]);

  const pauseSession = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeSession = useCallback(() => {
    if (currentSession && !currentSession.completed) {
      setIsRunning(true);
    }
  }, [currentSession]);

  const completeSession = useCallback((productivity: number = 5, notes: string = '') => {
    if (!currentSession) return;
    
    const completedSession: PomodoroSession = {
      ...currentSession,
      endTime: new Date(),
      completed: true,
      productivity,
      notes
    };
    
    setCurrentSession(completedSession);
    setIsRunning(false);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      completedSessions: prev.completedSessions + 1,
      totalFocusTime: currentSession.type === 'work' 
        ? prev.totalFocusTime + currentSession.duration
        : prev.totalFocusTime,
      totalBreakTime: currentSession.type !== 'work'
        ? prev.totalBreakTime + currentSession.duration
        : prev.totalBreakTime,
      averageProductivity: (prev.averageProductivity * prev.completedSessions + productivity) / (prev.completedSessions + 1)
    }));
    
    // Save session to localStorage
    const savedSessions = JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]');
    savedSessions.push(completedSession);
    localStorage.setItem('pomodoro_sessions', JSON.stringify(savedSessions));
    
    // Auto-start next session if enabled
    if (currentSession.type === 'work') {
      const isLongBreak = sessionCount % settings.sessionsUntilLongBreak === 0;
      const nextType = isLongBreak ? 'longBreak' : 'shortBreak';
      
      if (settings.autoStartBreaks) {
        setTimeout(() => startSession(nextType), 1000);
      }
    } else if (settings.autoStartWork) {
      setTimeout(() => startSession('work'), 1000);
    }
    
    // Show notification
    if (settings.notificationsEnabled) {
      const message = currentSession.type === 'work' 
        ? 'Work session completed! Time for a break.'
        : 'Break time is over! Ready to focus?';
      showNotification('Pomodoro Timer', message, 'success');
    }
  }, [currentSession, sessionCount, settings, startSession]);

  const skipSession = useCallback(() => {
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      interrupted: true,
      interruptionReason: 'Skipped by user'
    } : null);
    
    setIsRunning(false);
    setTimeLeft(0);
  }, [currentSession]);

  const updateSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    localStorage.setItem('pomodoro_settings', JSON.stringify({ ...settings, ...newSettings }));
  }, [settings]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, completeSession]);

  // Load settings and stats on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoro_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error('Failed to load Pomodoro settings:', err);
      }
    }
    
    const savedSessions = localStorage.getItem('pomodoro_sessions');
    if (savedSessions) {
      try {
        const sessions: PomodoroSession[] = JSON.parse(savedSessions);
        // Calculate stats from saved sessions
        const totalSessions = sessions.length;
        const completedSessions = sessions.filter(s => s.completed).length;
        const totalFocusTime = sessions
          .filter(s => s.type === 'work' && s.completed)
          .reduce((sum, s) => sum + s.duration, 0);
        const totalBreakTime = sessions
          .filter(s => s.type !== 'work' && s.completed)
          .reduce((sum, s) => sum + s.duration, 0);
        const averageProductivity = sessions
          .filter(s => s.completed)
          .reduce((sum, s) => sum + s.productivity, 0) / completedSessions || 0;
        
        setStats(prev => ({
          ...prev,
          totalSessions,
          completedSessions,
          totalFocusTime,
          totalBreakTime,
          averageProductivity
        }));
      } catch (err) {
        console.error('Failed to load Pomodoro sessions:', err);
      }
    }
  }, []);

  return {
    currentSession,
    settings,
    stats,
    isRunning,
    timeLeft,
    sessionType,
    sessionCount,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    skipSession,
    updateSettings
  };
};

// Analytics Hook
export const useAnalytics = (period: AnalyticsPeriod = 'week'): UseAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<ProductivityAnalytics>({
    userId: 'current_user',
    period,
    totalTime: 0,
    focusTime: 0,
    breakTime: 0,
    completedTasks: 0,
    totalTasks: 0,
    productivityScore: 0,
    focusScore: 0,
    consistencyScore: 0,
    peakHours: [],
    mostProductiveDays: [],
    categoryBreakdown: [],
    trends: [],
    goals: [],
    achievements: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would fetch from an API
      // For now, we'll calculate from localStorage data
      const timers = JSON.parse(localStorage.getItem('countdown_timers') || '[]');
      const sessions = JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]');
      
      // Calculate analytics from local data
      const now = new Date();
      const periodStart = getPeriodStart(now, period);
      
      const periodTimers = timers.filter((timer: any) => 
        new Date(timer.createdAt) >= periodStart
      );
      
      const periodSessions = sessions.filter((session: any) => 
        new Date(session.startTime) >= periodStart
      );
      
      const totalTime = periodSessions.reduce((sum: number, session: any) => 
        sum + session.duration, 0
      );
      
      const focusTime = periodSessions
        .filter((session: any) => session.type === 'work')
        .reduce((sum: number, session: any) => sum + session.duration, 0);
      
      const breakTime = totalTime - focusTime;
      
      const completedTasks = periodTimers.filter((timer: any) => 
        timer.status === 'completed'
      ).length;
      
      const totalTasks = periodTimers.length;
      
      const productivityScore = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;
      
      const focusScore = totalTime > 0 
        ? Math.round((focusTime / totalTime) * 100)
        : 0;
      
      setAnalytics({
        userId: 'current_user',
        period,
        totalTime,
        focusTime,
        breakTime,
        completedTasks,
        totalTasks,
        productivityScore,
        focusScore,
        consistencyScore: calculateConsistencyScore(periodSessions),
        peakHours: calculatePeakHours(periodSessions),
        mostProductiveDays: calculateMostProductiveDays(periodSessions),
        categoryBreakdown: [],
        trends: [],
        goals: [],
        achievements: []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [period]);

  const updatePeriod = useCallback((newPeriod: AnalyticsPeriod) => {
    setAnalytics(prev => ({ ...prev, period: newPeriod }));
  }, []);

  const exportAnalytics = useCallback(async (format: 'json' | 'csv' | 'pdf'): Promise<string> => {
    switch (format) {
      case 'json':
        return JSON.stringify(analytics, null, 2);
      
      case 'csv':
        const headers = ['Metric', 'Value'];
        const rows = [
          ['Total Time (minutes)', analytics.totalTime.toString()],
          ['Focus Time (minutes)', analytics.focusTime.toString()],
          ['Break Time (minutes)', analytics.breakTime.toString()],
          ['Completed Tasks', analytics.completedTasks.toString()],
          ['Total Tasks', analytics.totalTasks.toString()],
          ['Productivity Score', analytics.productivityScore.toString()],
          ['Focus Score', analytics.focusScore.toString()],
          ['Consistency Score', analytics.consistencyScore.toString()]
        ];
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      
      case 'pdf':
        // In a real app, this would generate a PDF
        throw new Error('PDF export not implemented yet');
      
      default:
        throw new Error('Unsupported export format');
    }
  }, [analytics]);

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics,
    updatePeriod,
    exportAnalytics
  };
};

// Utility functions
const getPeriodStart = (date: Date, period: AnalyticsPeriod): Date => {
  const start = new Date(date);
  
  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'quarter':
      const quarter = Math.floor(start.getMonth() / 3);
      start.setMonth(quarter * 3, 1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
  }
  
  return start;
};

const calculateConsistencyScore = (sessions: any[]): number => {
  if (sessions.length === 0) return 0;
  
  const days = new Set(sessions.map(session => 
    new Date(session.startTime).toDateString()
  ));
  
  const totalDays = Math.ceil(
    (Date.now() - new Date(sessions[0].startTime).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return Math.round((days.size / Math.max(totalDays, 1)) * 100);
};

const calculatePeakHours = (sessions: any[]): number[] => {
  const hourCounts = new Array(24).fill(0);
  
  sessions.forEach(session => {
    const hour = new Date(session.startTime).getHours();
    hourCounts[hour]++;
  });
  
  const maxCount = Math.max(...hourCounts);
  return hourCounts
    .map((count, hour) => ({ hour, count }))
    .filter(({ count }) => count === maxCount)
    .map(({ hour }) => hour);
};

const calculateMostProductiveDays = (sessions: any[]): number[] => {
  const dayCounts = new Array(7).fill(0);
  
  sessions.forEach(session => {
    const day = new Date(session.startTime).getDay();
    dayCounts[day]++;
  });
  
  const maxCount = Math.max(...dayCounts);
  return dayCounts
    .map((count, day) => ({ day, count }))
    .filter(({ count }) => count === maxCount)
    .map(({ day }) => day);
};

const showNotification = (title: string, message: string, type: NotificationType) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/favicon.ico'
    });
  }
};

const playSound = (soundAlert: any) => {
  try {
    const audio = new Audio();
    
    switch (soundAlert.soundType) {
      case 'beep':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBji