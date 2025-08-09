// Advanced QuizNinja Types

export interface QuizQuestion {
  id: string;
  question: string;
  answer: string;
  options?: string[];
  type: QuestionType;
  subject: Subject;
  difficulty: DifficultyLevel;
  tags: string[];
  explanation?: string;
  timeLimit?: number;
  points: number;
  metadata?: QuestionMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionMetadata {
  source?: string;
  author?: string;
  verified: boolean;
  reportCount: number;
  averageRating: number;
  timesAnswered: number;
  correctAnswerRate: number;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  CODE_CHALLENGE = 'code_challenge',
  DRAG_DROP = 'drag_drop',
  IMAGE_BASED = 'image_based',
  AUDIO_BASED = 'audio_based',
  FILL_BLANK = 'fill_blank',
  MATCHING = 'matching',
  ORDERING = 'ordering'
}

export enum Subject {
  PROGRAMMING = 'programming',
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  REACT = 'react',
  NODE_JS = 'nodejs',
  MATHEMATICS = 'mathematics',
  SCIENCE = 'science',
  PHYSICS = 'physics',
  CHEMISTRY = 'chemistry',
  BIOLOGY = 'biology',
  HISTORY = 'history',
  GEOGRAPHY = 'geography',
  LITERATURE = 'literature',
  GENERAL_KNOWLEDGE = 'general_knowledge',
  MARVEL = 'marvel',
  CUSTOM = 'custom'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  experience: number;
  totalScore: number;
  achievements: Achievement[];
  preferences: UserPreferences;
  statistics: UserStatistics;
  learningPath: LearningPath;
  createdAt: Date;
  lastActive: Date;
}

export interface UserPreferences {
  preferredSubjects: Subject[];
  difficultyLevel: DifficultyLevel;
  studyReminders: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  language: string;
  timeZone: string;
}

export interface UserStatistics {
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  bestStreak: number;
  currentStreak: number;
  timeSpent: number; // in minutes
  subjectStats: Record<Subject, SubjectStats>;
  difficultyStats: Record<DifficultyLevel, DifficultyStats>;
  weeklyProgress: WeeklyProgress[];
  monthlyProgress: MonthlyProgress[];
}

export interface SubjectStats {
  questionsAnswered: number;
  correctAnswers: number;
  averageTime: number;
  lastPracticed: Date;
  masteryLevel: number; // 0-100
}

export interface DifficultyStats {
  questionsAnswered: number;
  correctAnswers: number;
  averageScore: number;
  averageTime: number;
}

export interface WeeklyProgress {
  week: string; // ISO week format
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;
  subjectsStudied: Subject[];
}

export interface MonthlyProgress {
  month: string; // YYYY-MM format
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;
  averageScore: number;
  improvementRate: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: AchievementRequirement;
  unlockedAt?: Date;
  progress: number; // 0-100
}

export enum AchievementCategory {
  STREAK = 'streak',
  SCORE = 'score',
  SUBJECT_MASTERY = 'subject_mastery',
  TIME_BASED = 'time_based',
  SOCIAL = 'social',
  SPECIAL = 'special'
}

export interface AchievementRequirement {
  type: 'streak' | 'score' | 'questions' | 'time' | 'subject_mastery';
  value: number;
  subject?: Subject;
  difficulty?: DifficultyLevel;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  subjects: Subject[];
  estimatedDuration: number; // in hours
  difficulty: DifficultyLevel;
  progress: number; // 0-100
  milestones: Milestone[];
  isCustom: boolean;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  requirements: MilestoneRequirement[];
  reward: MilestoneReward;
  completed: boolean;
  completedAt?: Date;
}

export interface MilestoneRequirement {
  type: 'questions' | 'score' | 'streak' | 'time';
  value: number;
  subject?: Subject;
  difficulty?: DifficultyLevel;
}

export interface MilestoneReward {
  experience: number;
  badge?: string;
  title?: string;
  unlocks?: string[];
}

export interface QuizSession {
  id: string;
  userId: string;
  type: QuizType;
  subject?: Subject;
  difficulty?: DifficultyLevel;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  startTime: Date;
  endTime?: Date;
  score: number;
  maxScore: number;
  timeSpent: number;
  completed: boolean;
  settings: QuizSettings;
}

export enum QuizType {
  PRACTICE = 'practice',
  TIMED = 'timed',
  ADAPTIVE = 'adaptive',
  STUDY_MODE = 'study_mode',
  CHALLENGE = 'challenge',
  TOURNAMENT = 'tournament',
  COLLABORATIVE = 'collaborative'
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  attempts: number;
  hintsUsed: number;
  confidence: number; // 1-5 scale
  answeredAt: Date;
}

export interface QuizSettings {
  timeLimit?: number;
  questionCount?: number;
  randomOrder: boolean;
  showExplanations: boolean;
  allowHints: boolean;
  allowSkip: boolean;
  immediatefeedback: boolean;
  adaptiveDifficulty: boolean;
}

export interface StudySession {
  id: string;
  userId: string;
  type: StudyType;
  subject: Subject;
  materials: StudyMaterial[];
  notes: StudyNote[];
  flashcards: Flashcard[];
  startTime: Date;
  endTime?: Date;
  goals: StudyGoal[];
  progress: StudyProgress;
}

export enum StudyType {
  FLASHCARDS = 'flashcards',
  NOTES_REVIEW = 'notes_review',
  PRACTICE_QUIZ = 'practice_quiz',
  GUIDED_LEARNING = 'guided_learning',
  FREE_STUDY = 'free_study'
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: 'text' | 'video' | 'audio' | 'interactive';
  content: string;
  url?: string;
  duration?: number;
  difficulty: DifficultyLevel;
  tags: string[];
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  subject: Subject;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  attachments: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: Subject;
  difficulty: DifficultyLevel;
  tags: string[];
  reviewCount: number;
  correctCount: number;
  lastReviewed?: Date;
  nextReview: Date;
  interval: number; // spaced repetition interval in days
  easeFactor: number; // spaced repetition ease factor
}

export interface StudyGoal {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: 'questions' | 'minutes' | 'topics' | 'flashcards';
  deadline?: Date;
  completed: boolean;
}

export interface StudyProgress {
  timeSpent: number;
  materialsCompleted: number;
  notesCreated: number;
  flashcardsReviewed: number;
  goalsCompleted: number;
}

export interface AIQuestionRequest {
  subject: Subject;
  difficulty: DifficultyLevel;
  type: QuestionType;
  count: number;
  topics?: string[];
  excludeTopics?: string[];
  context?: string;
  language?: string;
}

export interface AIQuestionResponse {
  questions: QuizQuestion[];
  metadata: {
    model: string;
    generatedAt: Date;
    processingTime: number;
    confidence: number;
  };
}

export interface SpacedRepetitionCard {
  id: string;
  questionId: string;
  userId: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  nextReview: Date;
  lastReviewed?: Date;
  quality: number; // 0-5 scale
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  rank: number;
  subject?: Subject;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all_time';
  achievements: number;
  level: number;
}

export interface TeamQuiz {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: TeamMember[];
  questions: QuizQuestion[];
  settings: TeamQuizSettings;
  status: 'waiting' | 'active' | 'completed';
  startTime?: Date;
  endTime?: Date;
  results?: TeamQuizResults;
}

export interface TeamMember {
  userId: string;
  username: string;
  avatar?: string;
  role: 'creator' | 'member';
  joinedAt: Date;
  score?: number;
  answers?: QuizAnswer[];
}

export interface TeamQuizSettings {
  maxMembers: number;
  timeLimit: number;
  questionCount: number;
  subject: Subject;
  difficulty: DifficultyLevel;
  allowChat: boolean;
  showRealTimeResults: boolean;
}

export interface TeamQuizResults {
  teamScore: number;
  individualScores: Record<string, number>;
  rankings: LeaderboardEntry[];
  statistics: TeamQuizStatistics;
}

export interface TeamQuizStatistics {
  averageScore: number;
  totalTime: number;
  questionsAnswered: number;
  correctAnswers: number;
  participationRate: number;
}

export interface PerformancePrediction {
  userId: string;
  subject: Subject;
  difficulty: DifficultyLevel;
  predictedScore: number;
  confidence: number;
  recommendedStudyTime: number;
  weakAreas: string[];
  strongAreas: string[];
  optimalStudyTimes: string[];
  generatedAt: Date;
}

export interface QuizExport {
  format: 'json' | 'csv' | 'pdf';
  data: {
    userProfile: UserProfile;
    sessions: QuizSession[];
    statistics: UserStatistics;
    achievements: Achievement[];
    notes: StudyNote[];
  };
  generatedAt: Date;
  version: string;
}

export interface QuizImport {
  format: 'json' | 'csv';
  questions?: QuizQuestion[];
  flashcards?: Flashcard[];
  notes?: StudyNote[];
  settings?: Partial<UserPreferences>;
}

// Event types for real-time features
export interface QuizEvent {
  type: QuizEventType;
  payload: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export enum QuizEventType {
  QUESTION_ANSWERED = 'question_answered',
  QUIZ_STARTED = 'quiz_started',
  QUIZ_COMPLETED = 'quiz_completed',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  LEVEL_UP = 'level_up',
  STREAK_UPDATED = 'streak_updated',
  TEAM_MEMBER_JOINED = 'team_member_joined',
  TEAM_MEMBER_LEFT = 'team_member_left',
  REAL_TIME_SCORE_UPDATE = 'real_time_score_update'
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Search and filter types
export interface QuestionFilter {
  subjects?: Subject[];
  difficulties?: DifficultyLevel[];
  types?: QuestionType[];
  tags?: string[];
  search?: string;
  verified?: boolean;
  minRating?: number;
}

export interface SortOption {
  field: 'createdAt' | 'difficulty' | 'rating' | 'timesAnswered';
  direction: 'asc' | 'desc';
}

// Analytics types
export interface AnalyticsData {
  overview: AnalyticsOverview;
  subjectBreakdown: SubjectAnalytics[];
  difficultyProgression: DifficultyProgression[];
  timeAnalytics: TimeAnalytics;
  streakAnalytics: StreakAnalytics;
  predictionAccuracy: PredictionAccuracy;
}

export interface AnalyticsOverview {
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  totalTimeSpent: number;
  currentLevel: number;
  nextLevelProgress: number;
  improvementRate: number;
}

export interface SubjectAnalytics {
  subject: Subject;
  questionsAnswered: number;
  accuracy: number;
  averageTime: number;
  masteryLevel: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface DifficultyProgression {
  difficulty: DifficultyLevel;
  questionsAnswered: number;
  accuracy: number;
  averageTime: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface TimeAnalytics {
  dailyAverage: number;
  weeklyTotal: number;
  monthlyTotal: number;
  peakHours: number[];
  studyPattern: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface StreakAnalytics {
  currentStreak: number;
  longestStreak: number;
  streakHistory: StreakRecord[];
}

export interface StreakRecord {
  date: Date;
  streakLength: number;
  questionsAnswered: number;
}

export interface PredictionAccuracy {
  overallAccuracy: number;
  subjectAccuracy: Record<Subject, number>;
  difficultyAccuracy: Record<DifficultyLevel, number>;
  lastUpdated: Date;
}