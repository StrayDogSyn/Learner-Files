// Shared Types Library
// Common TypeScript interfaces and types for all platforms

// Base Entity Types
export interface BaseEntity {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  version?: number;
  metadata?: Record<string, any>;
}

export interface SoftDeletableEntity extends BaseEntity {
  deletedAt?: Date | string | null;
  isDeleted?: boolean;
}

export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

// User and Authentication Types
export interface User extends BaseEntity {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: SocialLinks;
  preferences?: UserPreferences;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: Date | string;
  loginCount?: number;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  twitch?: string;
  discord?: string;
  website?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  updates: boolean;
  security: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showLocation: boolean;
  allowMessaging: boolean;
  allowFollowing: boolean;
}

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export type UserRole = 'admin' | 'moderator' | 'user' | 'guest';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

// Authentication Types
export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date | string;
  permissions: string[];
  scopes: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  acceptTerms: boolean;
  newsletter?: boolean;
}

export interface PasswordResetRequest {
  email: string;
  captcha?: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

// Portfolio Types
export interface Portfolio extends BaseEntity {
  userId: string;
  title: string;
  description?: string;
  tagline?: string;
  logo?: string;
  banner?: string;
  theme: PortfolioTheme;
  layout: PortfolioLayout;
  sections: PortfolioSection[];
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  testimonials: Testimonial[];
  contact: ContactInfo;
  seo: SEOSettings;
  analytics: AnalyticsSettings;
  isPublic: boolean;
  customDomain?: string;
  slug: string;
  views: number;
  likes: number;
  shares: number;
}

export interface PortfolioTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  shadows: boolean;
  animations: boolean;
  glassmorphism: boolean;
}

export interface PortfolioLayout {
  header: HeaderLayout;
  navigation: NavigationLayout;
  hero: HeroLayout;
  sections: SectionLayout[];
  footer: FooterLayout;
}

export interface HeaderLayout {
  type: 'fixed' | 'sticky' | 'static';
  transparent: boolean;
  showLogo: boolean;
  showNavigation: boolean;
  showCTA: boolean;
}

export interface NavigationLayout {
  type: 'horizontal' | 'vertical' | 'hamburger';
  position: 'top' | 'left' | 'right';
  items: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

export interface HeroLayout {
  type: 'minimal' | 'centered' | 'split' | 'video' | 'carousel';
  showImage: boolean;
  showCTA: boolean;
  showSocial: boolean;
  backgroundType: 'color' | 'gradient' | 'image' | 'video';
  backgroundValue: string;
}

export interface SectionLayout {
  id: string;
  type: PortfolioSectionType;
  title: string;
  visible: boolean;
  order: number;
  columns: number;
  spacing: string;
  background: string;
}

export interface FooterLayout {
  showSocial: boolean;
  showContact: boolean;
  showCopyright: boolean;
  showBackToTop: boolean;
  columns: number;
}

export interface PortfolioSection {
  id: string;
  type: PortfolioSectionType;
  title: string;
  subtitle?: string;
  content?: string;
  data?: any;
  layout: SectionLayout;
  visible: boolean;
  order: number;
}

export type PortfolioSectionType = 
  | 'hero'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'testimonials'
  | 'blog'
  | 'contact'
  | 'custom';

// Project Types
export interface Project extends BaseEntity {
  portfolioId: string;
  title: string;
  description: string;
  shortDescription?: string;
  image?: string;
  images?: string[];
  video?: string;
  demoUrl?: string;
  sourceUrl?: string;
  technologies: Technology[];
  category: ProjectCategory;
  tags: string[];
  status: ProjectStatus;
  featured: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  duration?: string;
  teamSize?: number;
  role?: string;
  challenges?: string;
  solutions?: string;
  results?: string;
  metrics?: ProjectMetric[];
  testimonial?: Testimonial;
  order: number;
  views: number;
  likes: number;
  shares: number;
}

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  icon?: string;
  color?: string;
  proficiency?: number;
  yearsOfExperience?: number;
}

export interface ProjectMetric {
  label: string;
  value: string | number;
  unit?: string;
  improvement?: string;
}

export type ProjectCategory = 
  | 'web-development'
  | 'mobile-development'
  | 'desktop-development'
  | 'game-development'
  | 'data-science'
  | 'machine-learning'
  | 'devops'
  | 'design'
  | 'other';

export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';

export type TechnologyCategory = 
  | 'frontend'
  | 'backend'
  | 'database'
  | 'mobile'
  | 'desktop'
  | 'devops'
  | 'cloud'
  | 'design'
  | 'testing'
  | 'other';

// Skill Types
export interface Skill extends BaseEntity {
  portfolioId: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0-100
  yearsOfExperience: number;
  icon?: string;
  color?: string;
  description?: string;
  certifications?: string[];
  projects?: string[]; // Project IDs
  order: number;
  featured: boolean;
}

export type SkillCategory = 
  | 'programming-languages'
  | 'frameworks'
  | 'databases'
  | 'tools'
  | 'cloud-platforms'
  | 'soft-skills'
  | 'other';

// Experience Types
export interface Experience extends BaseEntity {
  portfolioId: string;
  company: string;
  position: string;
  description: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: Technology[];
  startDate: Date | string;
  endDate?: Date | string;
  current: boolean;
  location?: string;
  employmentType: EmploymentType;
  companyLogo?: string;
  companyWebsite?: string;
  order: number;
}

export type EmploymentType = 
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'freelance'
  | 'internship'
  | 'volunteer';

// Education Types
export interface Education extends BaseEntity {
  portfolioId: string;
  institution: string;
  degree: string;
  field: string;
  description?: string;
  gpa?: number;
  maxGpa?: number;
  startDate: Date | string;
  endDate?: Date | string;
  current: boolean;
  location?: string;
  institutionLogo?: string;
  institutionWebsite?: string;
  achievements?: string[];
  coursework?: string[];
  order: number;
}

// Certification Types
export interface Certification extends BaseEntity {
  portfolioId: string;
  name: string;
  issuer: string;
  description?: string;
  credentialId?: string;
  credentialUrl?: string;
  issueDate: Date | string;
  expiryDate?: Date | string;
  neverExpires: boolean;
  logo?: string;
  skills?: string[];
  order: number;
}

// Testimonial Types
export interface Testimonial extends BaseEntity {
  portfolioId: string;
  projectId?: string;
  name: string;
  position?: string;
  company?: string;
  content: string;
  rating?: number; // 1-5
  avatar?: string;
  linkedin?: string;
  email?: string;
  featured: boolean;
  approved: boolean;
  order: number;
}

// Contact Types
export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  availability?: string;
  preferredContact?: 'email' | 'phone' | 'linkedin';
  socialLinks?: SocialLinks;
  calendlyUrl?: string;
  resumeUrl?: string;
}

export interface ContactMessage extends BaseEntity {
  portfolioId: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  company?: string;
  budget?: string;
  timeline?: string;
  projectType?: string;
  status: MessageStatus;
  priority: MessagePriority;
  tags?: string[];
  notes?: string;
  respondedAt?: Date | string;
  archivedAt?: Date | string;
}

export type MessageStatus = 'new' | 'read' | 'replied' | 'archived' | 'spam';
export type MessagePriority = 'low' | 'medium' | 'high' | 'urgent';

// SEO Types
export interface SEOSettings {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  structuredData?: Record<string, any>;
}

// Analytics Types
export interface AnalyticsSettings {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  hotjarId?: string;
  mixpanelToken?: string;
  enabled: boolean;
  trackPageViews: boolean;
  trackEvents: boolean;
  trackConversions: boolean;
}

export interface AnalyticsEvent {
  id: string;
  portfolioId: string;
  type: AnalyticsEventType;
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: Date | string;
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  device?: DeviceInfo;
  referrer?: string;
  page?: string;
}

export type AnalyticsEventType = 
  | 'page_view'
  | 'project_view'
  | 'contact_form_submit'
  | 'resume_download'
  | 'social_link_click'
  | 'external_link_click'
  | 'scroll_depth'
  | 'time_on_page'
  | 'bounce'
  | 'conversion';

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  screenResolution: string;
  viewport: string;
}

export interface AnalyticsMetrics {
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  bounceRate: number;
  averageSessionDuration: number;
  topPages: PageMetric[];
  topReferrers: ReferrerMetric[];
  deviceBreakdown: DeviceMetric[];
  locationBreakdown: LocationMetric[];
  timeRange: DateRange;
}

export interface PageMetric {
  page: string;
  views: number;
  uniqueViews: number;
  averageTimeOnPage: number;
  bounceRate: number;
}

export interface ReferrerMetric {
  referrer: string;
  visits: number;
  percentage: number;
}

export interface DeviceMetric {
  device: string;
  visits: number;
  percentage: number;
}

export interface LocationMetric {
  country: string;
  city?: string;
  visits: number;
  percentage: number;
}

// Game Types
export interface GameState {
  score: number;
  level: number;
  lives: number;
  energy: number;
  experience: number;
  coins: number;
  gems: number;
  powerUps: PowerUp[];
  achievements: Achievement[];
  settings: GameSettings;
  statistics: GameStatistics;
  saveData: GameSaveData;
}

export interface PowerUp {
  id: string;
  name: string;
  type: PowerUpType;
  duration: number;
  effect: number;
  icon: string;
  rarity: Rarity;
  cost: number;
  unlocked: boolean;
  active: boolean;
  expiresAt?: Date | string;
}

export type PowerUpType = 
  | 'speed_boost'
  | 'score_multiplier'
  | 'shield'
  | 'extra_life'
  | 'energy_boost'
  | 'coin_magnet'
  | 'time_freeze';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: Rarity;
  points: number;
  requirement: AchievementRequirement;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date | string;
  hidden: boolean;
}

export type AchievementCategory = 
  | 'score'
  | 'time'
  | 'collection'
  | 'skill'
  | 'exploration'
  | 'social'
  | 'special';

export interface AchievementRequirement {
  type: 'score' | 'time' | 'count' | 'streak' | 'level' | 'custom';
  target: number;
  condition?: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  difficulty: GameDifficulty;
  controls: ControlScheme;
  graphics: GraphicsQuality;
  language: string;
  notifications: boolean;
}

export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'expert';
export type ControlScheme = 'touch' | 'keyboard' | 'gamepad' | 'auto';
export type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra';

export interface GameStatistics {
  totalPlayTime: number;
  gamesPlayed: number;
  highScore: number;
  totalScore: number;
  averageScore: number;
  bestTime: number;
  totalDeaths: number;
  achievementsUnlocked: number;
  powerUpsUsed: number;
  coinsCollected: number;
  gemsCollected: number;
  levelsCompleted: number;
  streakRecord: number;
  firstPlayedAt: Date | string;
  lastPlayedAt: Date | string;
}

export interface GameSaveData {
  version: string;
  playerId: string;
  timestamp: Date | string;
  checksum: string;
  compressed: boolean;
  data: Record<string, any>;
}

// API Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
  timestamp: string;
  requestId: string;
  pagination?: PaginationInfo;
  meta?: Record<string, any>;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
  stack?: string;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, any>;
  include?: string[];
  fields?: string[];
}

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

// Utility Types
export interface DateRange {
  start: Date | string;
  end: Date | string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: Coordinates;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date | string;
  uploadedBy?: string;
}

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  image?: string;
  url?: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date | string;
  expiresAt?: Date | string;
}

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'message'
  | 'update'
  | 'reminder';

// State Management Types
export interface AppState {
  user: UserState;
  portfolio: PortfolioState;
  projects: ProjectState;
  analytics: AnalyticsState;
  game: GameState;
  ui: UIState;
  settings: SettingsState;
}

export interface UserState {
  currentUser: User | null;
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
}

export interface PortfolioState {
  current: Portfolio | null;
  portfolios: Portfolio[];
  loading: boolean;
  error: string | null;
  filters: PortfolioFilters;
  pagination: PaginationInfo;
}

export interface PortfolioFilters {
  search?: string;
  category?: string;
  tags?: string[];
  status?: string;
  featured?: boolean;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  filters: ProjectFilters;
  pagination: PaginationInfo;
}

export interface ProjectFilters {
  search?: string;
  category?: ProjectCategory;
  technologies?: string[];
  status?: ProjectStatus;
  featured?: boolean;
}

export interface AnalyticsState {
  metrics: AnalyticsMetrics | null;
  events: AnalyticsEvent[];
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
}

export interface UIState {
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  loading: boolean;
  notifications: NotificationData[];
  modals: ModalState[];
  toasts: ToastState[];
}

export interface ModalState {
  id: string;
  type: string;
  props?: Record<string, any>;
  open: boolean;
}

export interface ToastState {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  actions?: ToastAction[];
}

export interface ToastAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

export interface SettingsState {
  preferences: UserPreferences;
  loading: boolean;
  error: string | null;
  dirty: boolean;
}

// Event Types
export interface CustomEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
  source?: string;
}

export interface EventHandler<T = any> {
  (event: CustomEvent<T>): void;
}

export interface EventEmitter {
  on<T>(event: string, handler: EventHandler<T>): void;
  off<T>(event: string, handler: EventHandler<T>): void;
  emit<T>(event: string, payload: T): void;
  once<T>(event: string, handler: EventHandler<T>): void;
}

// Form Types
export interface FormField<T = any> {
  name: string;
  label?: string;
  type: FormFieldType;
  value: T;
  defaultValue?: T;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  validation?: ValidationRule[];
  options?: FormFieldOption[];
  multiple?: boolean;
  accept?: string;
  min?: number | string;
  max?: number | string;
  step?: number;
  rows?: number;
  cols?: number;
  pattern?: string;
  autocomplete?: string;
  helperText?: string;
  error?: string;
}

export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'slider'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'image'
  | 'color'
  | 'range'
  | 'hidden';

export interface FormFieldOption {
  label: string;
  value: any;
  disabled?: boolean;
  group?: string;
}

export interface ValidationRule {
  type: ValidationType;
  value?: any;
  message: string;
  custom?: (value: any) => boolean;
}

export type ValidationType = 
  | 'required'
  | 'email'
  | 'url'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'custom';

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  dirty: boolean;
  valid: boolean;
  submitting: boolean;
  submitted: boolean;
}

// Export utility types
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export type Record<K extends keyof any, T> = {
  [P in K]: T;
};

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

/**
 * Shared Types Library
 * 
 * Provides comprehensive TypeScript interfaces and types
 * for consistent data structures across all platforms.
 * 
 * Features:
 * - Base entity types with common fields
 * - User and authentication types
 * - Portfolio and project data structures
 * - Analytics and metrics types
 * - Game state and achievement types
 * - API response and error types
 * - Form and validation types
 * - State management interfaces
 * - Event system types
 * - Utility and helper types
 * 
 * Usage:
 * ```typescript
 * import { User, Portfolio, Project, APIResponse } from '@shared/types';
 * 
 * // Type-safe API responses
 * const response: APIResponse<User[]> = await fetchUsers();
 * 
 * // Consistent data structures
 * const portfolio: Portfolio = {
 *   id: '1',
 *   title: 'My Portfolio',
 *   // ... other fields
 * };
 * ```
 */