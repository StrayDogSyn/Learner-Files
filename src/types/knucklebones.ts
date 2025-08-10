// Game State Types
export interface GameState {
  id: string;
  players: Player[];
  currentPlayer: number;
  gameMode: GameMode;
  status: 'waiting' | 'playing' | 'finished';
  winner?: string;
  rounds: number;
  maxRounds: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isAI: boolean;
  type?: 'human' | 'ai' | 'spectator';
  avatar?: string;
  statistics: PlayerStatistics;
}

export interface PlayerStatistics {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  winRate: number;
  rollHistory: RollResult[];
}

// Game Mode Types
export interface GameMode {
  id: string;
  name: string;
  description: string;
  icon?: string;
  rules?: GameRules;
  timeLimit?: number;
  maxPlayers?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'varied' | 'easy' | 'medium' | 'hard';
  features: string[];
  estimatedDuration?: number;
  unlockRequirement?: UnlockRequirement | null;
}

export interface UnlockRequirement {
  type: 'wins' | 'rating' | 'streak' | 'achievements';
  value: number;
}

export interface GameModeSettings {
  timeLimit?: number;
  maxPlayers?: number;
  difficulty?: string;
  customRules?: any;
}

export interface ChallengeVariant {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  objectives: string[];
  rewards: ChallengeRewards;
  timeLimit: number;
  attempts: number;
}

export interface ChallengeRewards {
  xp: number;
  title: string;
  badge: string;
}

export interface SpeedRoundSettings {
  turnTimeLimit: number;
  bonusMultiplier: number;
  penaltyForTimeout: number;
}

export interface SurvivalModeSettings {
  startingLives: number;
  difficultyIncrease: number;
  bonusLifeScore: number;
}

export interface BlitzModeSettings {
  simultaneousTurns: boolean;
  actionTimeLimit: number;
  reflexBonus: number;
}

export interface PuzzleModeSettings {
  puzzleType: string;
  targetScore: number;
  movesLimit: number;
}

export interface GameRules {
  diceCount: number;
  maxRolls: number;
  scoringSystem: 'standard' | 'bonus' | 'multiplier';
  specialRules: string[];
}

// AI Opponent Types
export interface AIOpponentSettings {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  strategy: 'aggressive' | 'defensive' | 'balanced' | 'adaptive';
  thinkingTime: number;
  isEnabled: boolean;
  personalityTraits?: string[];
}

export interface AIAnalysis {
  bestMove: DiceAction;
  confidence: number;
  reasoning: string;
  alternativeMoves: DiceAction[];
  riskAssessment: number;
}

export interface DiceAction {
  type: 'roll' | 'hold' | 'reroll';
  diceIndices: number[];
  expectedValue: number;
  probability: number;
}

// Multiplayer Types
export interface MultiplayerSession {
  id: string;
  hostId: string;
  players: Player[];
  gameState: GameState;
  isPrivate: boolean;
  maxPlayers: number;
  spectators: Spectator[];
  chatMessages: ChatMessage[];
  createdAt: Date;
}

export interface Spectator {
  id: string;
  name: string;
  joinedAt: Date;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'system' | 'game';
}

// Additional Multiplayer Types
export interface GameSession {
  id: string;
  gameState: GameState;
  players: Player[];
  spectators: Spectator[];
  status: 'waiting' | 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  rounds: GameRound[];
}

export interface GameRound {
  roundNumber: number;
  playerActions: PlayerAction[];
  scores: { [playerId: string]: number };
  startedAt: Date;
  endedAt?: Date;
}

export interface GameRoom {
  id: string;
  name: string;
  description?: string;
  hostId: string;
  maxPlayers: number;
  currentPlayers: number;
  gameMode: GameMode;
  isPrivate: boolean;
  password?: string;
  status: 'waiting' | 'active' | 'full';
  createdAt: Date;
}

export interface WebSocketMessage {
  type: 'join' | 'leave' | 'move' | 'chat' | 'game_update' | 'error';
  payload: any;
  timestamp: Date;
  senderId?: string;
  targetId?: string;
}

export interface PlayerAction {
  type?: 'roll' | 'hold' | 'reroll' | 'end_turn';
  actionType: 'roll' | 'hold' | 'reroll' | 'end_turn' | 'aggressive_roll' | 'conservative_roll' | 'strategic_block' | 'risk_taking' | 'defensive_play' | 'random_play'; // Alternative field name
  playerId: string;
  data?: any;
  diceGroups?: DiceGroupResult[]; // For dice-related actions
  timestamp: Date;
  gameId?: string;
  outcome?: ActionOutcome;
  riskLevel?: number;
  timeToDecide?: number;
  strategy?: string;
  pressureLevel?: number;
}

export interface ActionOutcome {
  success: boolean;
  patternType?: string;
  scoreChange?: number;
  bonusPoints?: number;
}

// Statistics Types
export interface GameStatistics {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  averageScore: number;
  bestScore: number;
  rollDistribution: RollDistribution;
  performanceMetrics: PerformanceMetrics;
  trends: StatisticsTrend[];
}

export interface RollDistribution {
  [key: number]: number; // dice value -> frequency
}

export interface RollDistributionChart {
  value: number;
  count: number;
  deviation: number;
}

export interface PerformanceMetrics {
  efficiency: number;
  consistency: number;
  riskTaking: number;
  adaptability: number;
  decisionSpeed: number;
  strategy: number;
  speed: number;
  riskManagement: number;
  decisionMaking: number;
}

export interface StatisticsTrend {
  metric: string;
  values: number[];
  timestamps: Date[];
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Tournament Types
export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'single-elimination' | 'double-elimination' | 'round-robin';
  status: 'upcoming' | 'active' | 'completed' | 'registration';
  participants: TournamentParticipant[];
  brackets: TournamentBracket[];
  bracket?: TournamentBracket;
  prizes: Prize[];
  rules: TournamentRules;
  startDate: Date;
  endDate?: Date;
  maxPlayers: number;
  startTime?: Date;
  prizePool?: number;
}

export interface TournamentParticipant {
  id: string;
  playerId: string;
  playerName: string;
  seed: number;
  currentRound: number;
  isEliminated: boolean;
  wins: number;
  losses: number;
}

export interface TournamentBracket {
  id: string;
  round: number;
  matches: TournamentMatch[];
  rounds: TournamentRound[];
}

export interface TournamentRound {
  round: number;
  name: string;
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  player1Id: string;
  player2Id: string;
  winnerId?: string;
  winner?: string;
  score1: number;
  score2: number;
  scores?: { [playerId: string]: number };
  status: 'pending' | 'active' | 'completed';
  scheduledTime?: Date;
  completedTime?: Date;
  round: number;
  participants: string[];
}

export interface Prize {
  position: number;
  title: string;
  description: string;
  value?: number;
}

export interface TournamentRules {
  gameMode: GameMode;
  bestOf: number;
  timeLimit: number;
  advancementCriteria: string;
}

// Additional Tournament Types
export interface TournamentSettings {
  name: string;
  type: 'single-elimination' | 'double-elimination' | 'round-robin';
  maxParticipants: number;
  maxPlayers: number;
  entryFee?: number;
  prizePool?: number;
  startTime?: Date;
  format: 'best-of-1' | 'best-of-3' | 'best-of-5';
  timeLimit: number;
  isPrivate: boolean;
  description?: string;
  registrationDeadline?: Date;
  participants?: TournamentParticipant[];
  gameSettings?: {
    roundLimit: number;
    timeLimit: number;
    diceCount: number;
  };
}

export interface LeaderboardEntry {
  id: string;
  playerId: string;
  playerName: string;
  rank: number;
  rating: number;
  wins: number;
  losses: number;
  winRate: number;
  totalGames: number;
  currentStreak: number;
  bestStreak: number;
  averageScore: number;
  totalScore: number;
  achievements: string[];
  isOnline: boolean;
  lastActiveDate: Date;
  playerType: 'human' | 'ai';
  title?: string;
  streak: number;
  ratingChange: number;
}

export interface RankingSystem {
  type: 'elo' | 'glicko' | 'points' | 'wins';
  name: string;
  baseRating: number;
  kFactor?: number;
  decayRate?: number;
  seasonLength?: number;
}

// Data Visualization Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface VisualizationConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend: boolean;
  animated: boolean;
}

// Additional Data Visualization Types
export interface WinRateData {
  mode: string;
  wins: number;
  losses: number;
  winRate: number;
  averageScore: number;
  bestScore: number;
}

export interface TimeSeriesData {
  date: string;
  gamesPlayed: number;
  winRate: number;
  averageScore: number;
  efficiency: number;
  streakLength: number;
}

export interface HeatmapData {
  row: number;
  col: number;
  value: number;
  frequency: number;
  successRate: number;
}

// Dice and Game Mechanics
export interface DiceResult {
  value: number;
  id: string;
  isSelected: boolean;
  isHeld: boolean;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
}

export interface DiceGroup {
  type: number; // dice type (d4, d6, d8, etc.)
  count: number; // number of dice
  results: number[]; // actual roll results
  id: string;
}

export interface DiceGroupResult {
  group: DiceGroup;
  timestamp: Date;
  playerId: string;
  total: number;
}

export interface RollResult {
  id: string;
  dice: DiceResult[];
  timestamp: Date;
  playerId: string;
  gameId: string;
  rollNumber: number;
  totalValue: number;
}

// 3D Physics Types
export interface Physics3DSettings {
  gravity: number;
  restitution: number;
  friction: number;
  airResistance: number;
  tableHeight: number;
  diceSize: number;
}

export interface CameraSettings {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  fov: number;
  near: number;
  far: number;
}

export interface LightingSettings {
  ambient: { intensity: number; color: string };
  directional: { intensity: number; color: string; position: { x: number; y: number; z: number } };
  shadows: boolean;
}

// Machine Learning Types
export interface MLPrediction {
  predictedOutcome: number;
  confidence: number;
  factors: MLFactor[];
  recommendations: string[];
  recommendedAction?: string;
  alternatives?: any[];
  reasoning?: string;
  timestamp?: Date;
}

export interface MLFactor {
  name: string;
  weight: number;
  value: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface DicePattern {
  id: string;
  type: string;
  values: number[];
  probability: number;
  playerId?: string;
  sessionId?: string;
  roundNumber?: number;
  timestamp?: Date;
}

export interface ProbabilityDistribution {
  win: number;
  lose: number;
  draw: number;
  confidence: number;
}

export interface PatternAnalysis {
  patterns: DicePattern[];
  frequencies: { [key: string]: number };
  trends: any[];
  anomalies: Anomaly[];
  confidence: number;
  timestamp: Date;
}

export interface DetectedPattern {
  type: string;
  description: string;
  frequency: number;
  significance: number;
  examples: RollResult[];
}

export interface Anomaly {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  data: any;
}

// All types are already exported above with their interface declarations