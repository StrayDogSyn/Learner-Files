// Advanced Countdown Timer Types

export interface TimeLeft {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Timer {
  id: string;
  name: string;
  description?: string;
  targetDate: Date;
  category: TimerCategory;
  priority: TimerPriority;
  status: TimerStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  tags: string[];
  color: string;
  soundAlert?: SoundAlert;
  notifications: NotificationSettings;
  timeLeft: TimeLeft;
  isExpired: boolean;
  repeatSettings?: RepeatSettings;
  milestones: Milestone[];
  analytics: TimerAnalytics;
}

export interface TimerCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export type TimerPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TimerStatus = 'active' | 'paused' | 'completed' | 'cancelled' | 'scheduled';

export interface SoundAlert {
  enabled: boolean;
  soundType: 'beep' | 'chime' | 'bell' | 'custom';
  customSoundUrl?: string;
  volume: number; // 0-1
  repeat: number; // number of times to play
}

export interface NotificationSettings {
  browser: boolean;
  email: boolean;
  push: boolean;
  intervals: number[]; // minutes before completion to notify
  customMessage?: string;
}

export interface RepeatSettings {
  enabled: boolean;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number;
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6, Sunday = 0
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  targetDate: Date;
  completed: boolean;
  completedAt?: Date;
  color: string;
  icon?: string;
}

export interface TimerAnalytics {
  totalTimeTracked: number;
  completionRate: number;
  averageCompletionTime: number;
  streakCount: number;
  longestStreak: number;
  lastCompletedDate?: Date;
  productivityScore: number;
  focusTime: number;
  breakTime: number;
}

// Pomodoro-specific types
export interface PomodoroSession {
  id: string;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number; // in minutes
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  interrupted: boolean;
  interruptionReason?: string;
  productivity: number; // 1-10 scale
  notes?: string;
  tags: string[];
}

export interface PomodoroSettings {
  workDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  strictMode: boolean; // prevents pausing
}

export interface PomodoroStats {
  totalSessions: number;
  completedSessions: number;
  totalFocusTime: number; // minutes
  totalBreakTime: number; // minutes
  averageProductivity: number;
  streakDays: number;
  longestStreak: number;
  dailyGoal: number; // sessions per day
  weeklyGoal: number; // sessions per week
  monthlyStats: MonthlyPomodoroStats[];
}

export interface MonthlyPomodoroStats {
  month: string; // YYYY-MM
  totalSessions: number;
  completedSessions: number;
  totalFocusTime: number;
  averageProductivity: number;
  bestDay: {
    date: string;
    sessions: number;
    focusTime: number;
  };
}

// Event Management types
export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  category: EventCategory;
  priority: TimerPriority;
  status: EventStatus;
  attendees: Attendee[];
  reminders: Reminder[];
  recurrence?: RecurrenceRule;
  timezone: string;
  url?: string;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export type EventStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'postponed';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  role: 'organizer' | 'required' | 'optional';
}

export interface Reminder {
  id: string;
  type: 'notification' | 'email' | 'sms';
  timing: number; // minutes before event
  message?: string;
  sent: boolean;
  sentAt?: Date;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
  endDate?: Date;
  occurrences?: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// Time Zone types
export interface TimeZone {
  id: string;
  name: string;
  abbreviation: string;
  offset: number; // minutes from UTC
  isDST: boolean;
  city: string;
  country: string;
}

export interface WorldClock {
  id: string;
  timezone: TimeZone;
  label: string;
  isPrimary: boolean;
  order: number;
}

// Theme types
export interface Theme {
  id: string;
  name: string;
  description?: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  animations: ThemeAnimations;
  effects: ThemeEffects;
  background: ThemeBackground;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeFonts {
  primary: string;
  secondary: string;
  monospace: string;
  sizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
}

export interface ThemeAnimations {
  enabled: boolean;
  duration: 'fast' | 'normal' | 'slow';
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  reducedMotion: boolean;
}

export interface ThemeEffects {
  glassmorphism: boolean;
  shadows: boolean;
  blur: boolean;
  particles: boolean;
  gradients: boolean;
}

export interface ThemeBackground {
  type: 'solid' | 'gradient' | 'image' | 'video' | 'particles';
  value: string;
  opacity: number;
  overlay: boolean;
  overlayColor: string;
  overlayOpacity: number;
}

// Analytics types
export interface ProductivityAnalytics {
  userId: string;
  period: AnalyticsPeriod;
  totalTime: number; // minutes
  focusTime: number; // minutes
  breakTime: number; // minutes
  completedTasks: number;
  totalTasks: number;
  productivityScore: number; // 0-100
  focusScore: number; // 0-100
  consistencyScore: number; // 0-100
  peakHours: number[]; // hours of day (0-23)
  mostProductiveDays: number[]; // days of week (0-6)
  categoryBreakdown: CategoryAnalytics[];
  trends: AnalyticsTrend[];
  goals: ProductivityGoal[];
  achievements: Achievement[];
}

export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface CategoryAnalytics {
  categoryId: string;
  categoryName: string;
  totalTime: number;
  completedTasks: number;
  totalTasks: number;
  averageCompletionTime: number;
  productivityScore: number;
}

export interface AnalyticsTrend {
  date: string;
  value: number;
  metric: 'productivity' | 'focus' | 'completion' | 'time';
  change: number; // percentage change from previous period
}

export interface ProductivityGoal {
  id: string;
  name: string;
  description?: string;
  type: 'time' | 'tasks' | 'streak' | 'score';
  target: number;
  current: number;
  period: AnalyticsPeriod;
  startDate: Date;
  endDate: Date;
  achieved: boolean;
  achievedAt?: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'productivity' | 'consistency' | 'milestone' | 'streak';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  progress: number; // 0-100
  requirements: AchievementRequirement[];
}

export interface AchievementRequirement {
  type: 'time' | 'tasks' | 'streak' | 'score';
  value: number;
  period?: AnalyticsPeriod;
  completed: boolean;
}

// Sharing and Collaboration types
export interface SharedTimer {
  id: string;
  timerId: string;
  ownerId: string;
  shareType: 'public' | 'private' | 'team';
  permissions: SharePermissions;
  accessCode?: string;
  expiresAt?: Date;
  viewers: TimerViewer[];
  collaborators: TimerCollaborator[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SharePermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canComment: boolean;
}

export interface TimerViewer {
  id: string;
  name?: string;
  email?: string;
  joinedAt: Date;
  lastSeenAt: Date;
  isAnonymous: boolean;
}

export interface TimerCollaborator {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
  permissions: SharePermissions;
  invitedAt: Date;
  joinedAt?: Date;
  status: 'pending' | 'active' | 'inactive';
}

// Data Persistence types
export interface UserData {
  userId: string;
  timers: Timer[];
  categories: TimerCategory[];
  events: Event[];
  pomodoroSettings: PomodoroSettings;
  pomodoroSessions: PomodoroSession[];
  worldClocks: WorldClock[];
  themes: Theme[];
  activeTheme: string;
  analytics: ProductivityAnalytics;
  achievements: Achievement[];
  goals: ProductivityGoal[];
  preferences: UserPreferences;
  lastSyncAt: Date;
  version: string;
}

export interface UserPreferences {
  defaultTimerDuration: number; // minutes
  defaultCategory: string;
  autoStartTimers: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  language: string;
  weekStartsOn: number; // 0-6, Sunday = 0
  workingHours: {
    start: string; // HH:mm
    end: string; // HH:mm
    days: number[]; // 0-6
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface SyncResponse {
  success: boolean;
  conflicts: SyncConflict[];
  lastSyncAt: Date;
  nextSyncAt: Date;
}

export interface SyncConflict {
  type: 'timer' | 'category' | 'event' | 'settings';
  id: string;
  localVersion: any;
  remoteVersion: any;
  resolution: 'local' | 'remote' | 'merge' | 'manual';
}

// Component Props types
export interface CountdownProps {
  targetDate?: Date;
  timers?: Timer[];
  mode?: 'single' | 'multi' | 'pomodoro' | 'event';
  theme?: Theme;
  showAnalytics?: boolean;
  showWorldClock?: boolean;
  enableSharing?: boolean;
  enableVoice?: boolean;
  onTimerComplete?: (timer: Timer) => void;
  onTimerUpdate?: (timer: Timer) => void;
  onModeChange?: (mode: string) => void;
}

export interface TimerCardProps {
  timer: Timer;
  compact?: boolean;
  showControls?: boolean;
  showAnalytics?: boolean;
  onEdit?: (timer: Timer) => void;
  onDelete?: (timerId: string) => void;
  onDuplicate?: (timer: Timer) => void;
  onShare?: (timer: Timer) => void;
}

export interface PomodoroProps {
  settings: PomodoroSettings;
  onSettingsChange: (settings: PomodoroSettings) => void;
  onSessionComplete: (session: PomodoroSession) => void;
  showStats?: boolean;
  autoStart?: boolean;
}

export interface AnalyticsDashboardProps {
  analytics: ProductivityAnalytics;
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  showGoals?: boolean;
  showAchievements?: boolean;
  showTrends?: boolean;
}

// Hook return types
export interface UseTimerReturn {
  timer: Timer;
  timeLeft: TimeLeft;
  isRunning: boolean;
  isPaused: boolean;
  isExpired: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  addTime: (minutes: number) => void;
  setTargetDate: (date: Date) => void;
}

export interface UseTimersReturn {
  timers: Timer[];
  activeTimers: Timer[];
  completedTimers: Timer[];
  createTimer: (timer: Omit<Timer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Timer>;
  updateTimer: (id: string, updates: Partial<Timer>) => Promise<Timer>;
  deleteTimer: (id: string) => Promise<void>;
  duplicateTimer: (id: string) => Promise<Timer>;
  shareTimer: (id: string, shareType: 'public' | 'private' | 'team') => Promise<SharedTimer>;
  importTimers: (data: Timer[]) => Promise<void>;
  exportTimers: (format: 'json' | 'csv' | 'ical') => Promise<string>;
}

export interface UsePomodoroReturn {
  currentSession: PomodoroSession | null;
  settings: PomodoroSettings;
  stats: PomodoroStats;
  isRunning: boolean;
  timeLeft: number;
  sessionType: 'work' | 'shortBreak' | 'longBreak';
  sessionCount: number;
  startSession: (type?: 'work' | 'shortBreak' | 'longBreak') => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: (productivity?: number, notes?: string) => void;
  skipSession: () => void;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
}

export interface UseAnalyticsReturn {
  analytics: ProductivityAnalytics;
  loading: boolean;
  error: string | null;
  refreshAnalytics: () => Promise<void>;
  updatePeriod: (period: AnalyticsPeriod) => void;
  exportAnalytics: (format: 'json' | 'csv' | 'pdf') => Promise<string>;
}

// Utility types
export type TimerAction = 
  | { type: 'CREATE_TIMER'; payload: Timer }
  | { type: 'UPDATE_TIMER'; payload: { id: string; updates: Partial<Timer> } }
  | { type: 'DELETE_TIMER'; payload: string }
  | { type: 'START_TIMER'; payload: string }
  | { type: 'PAUSE_TIMER'; payload: string }
  | { type: 'COMPLETE_TIMER'; payload: string }
  | { type: 'RESET_TIMER'; payload: string }
  | { type: 'SET_TIMERS'; payload: Timer[] };

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
  persistent?: boolean;
  timestamp: Date;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

// Error types
export class CountdownError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'CountdownError';
  }
}

export class TimerValidationError extends CountdownError {
  constructor(message: string, public field: string, public value: any) {
    super(message, 'TIMER_VALIDATION_ERROR', { field, value });
    this.name = 'TimerValidationError';
  }
}

export class SyncError extends CountdownError {
  constructor(message: string, public syncType: string, public conflicts: SyncConflict[]) {
    super(message, 'SYNC_ERROR', { syncType, conflicts });
    this.name = 'SyncError';
  }
}