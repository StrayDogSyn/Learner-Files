import React, { useState, useEffect, useCallback } from 'react';
import GameWrapper from '../GameWrapper';
import CompTIA from '../../projects/CompTIA';
import { useGameStore } from '../../store/gameStore';
import { GlassButton } from '../ui';
import { BookOpen, Brain, Target, Award, Clock, BarChart3 } from 'lucide-react';

interface CompTIAWrapperProps {
  className?: string;
}

interface CompTIAGameState {
  currentExam: {
    examType: 'A+' | 'Network+' | 'Security+' | 'Cloud+' | 'CySA+' | 'CASP+' | 'PenTest+';
    currentQuestion: number;
    totalQuestions: number;
    timeRemaining: number;
    isActive: boolean;
    isPaused: boolean;
    startTime: Date | null;
    answers: Record<number, string | string[]>;
    flaggedQuestions: number[];
    reviewMode: boolean;
  };
  examHistory: Array<{
    id: string;
    examType: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    completedAt: Date;
    passed: boolean;
    domains: Record<string, { correct: number; total: number }>;
    difficulty: 'practice' | 'simulation' | 'certification';
  }>;
  studyProgress: {
    totalStudyTime: number;
    questionsAnswered: number;
    correctAnswers: number;
    weakDomains: string[];
    strongDomains: string[];
    studyStreak: number;
    lastStudyDate: Date | null;
    certificationGoals: string[];
    completedCertifications: string[];
  };
  performance: {
    overallAccuracy: number;
    averageScore: number;
    bestScore: number;
    improvementRate: number;
    consistencyScore: number;
    timeManagement: number;
    domainMastery: Record<string, number>;
    readinessLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  settings: {
    examMode: 'practice' | 'timed' | 'simulation';
    showExplanations: boolean;
    randomizeQuestions: boolean;
    flaggingEnabled: boolean;
    audioEnabled: boolean;
    theme: 'default' | 'exam-like' | 'dark' | 'high-contrast';
    difficulty: 'adaptive' | 'beginner' | 'intermediate' | 'advanced';
  };
  achievements: string[];
  statistics: {
    totalExams: number;
    passedExams: number;
    averagePassRate: number;
    totalStudyHours: number;
    questionsPerHour: number;
    favoriteExamType: string;
    masteredDomains: string[];
    certificationProgress: Record<string, number>;
  };
}

const CompTIAWrapper: React.FC<CompTIAWrapperProps> = ({ className }) => {
  const [gameState, setGameState] = useState<CompTIAGameState | null>(null);
  const [isExamActive, setIsExamActive] = useState(false);
  const [studyStats, setStudyStats] = useState({
    totalSessions: 0,
    totalStudyTime: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    averageScore: 0,
    bestScore: 0,
    passRate: 0,
    studyStreak: 0,
    certificationProgress: 0,
    readinessScore: 0,
    weakestDomain: 'Hardware',
    strongestDomain: 'Hardware',
    targetCertification: 'A+',
    estimatedReadiness: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    achievements: [] as string[]
  });
  
  const { updateGameState, getGameState, updateGameStats, getGameStats } = useGameStore();
  
  // Map CompTIA difficulty to GameWrapper difficulty
  const mapDifficultyToGameWrapper = (difficulty: string): 'easy' | 'medium' | 'hard' | 'expert' => {
    switch (difficulty) {
      case 'beginner': return 'easy';
      case 'intermediate': return 'medium';
      case 'advanced': return 'hard';
      case 'adaptive': return 'expert';
      default: return 'medium';
    }
  };
  
  // CompTIA exam types and domains
  const examTypes = {
    'A+': ['Hardware', 'Networking', 'Mobile Devices', 'Operating Systems', 'Security', 'Troubleshooting'],
    'Network+': ['Network Architecture', 'Network Operations', 'Network Security', 'Troubleshooting', 'Industry Standards'],
    'Security+': ['Attacks & Threats', 'Architecture & Design', 'Implementation', 'Operations & Incident Response', 'Governance & Risk'],
    'Cloud+': ['Cloud Architecture', 'Security', 'Deployment', 'Operations & Support', 'Troubleshooting'],
    'CySA+': ['Threat & Vulnerability Management', 'Software & Systems Security', 'Security Operations', 'Incident Response'],
    'CASP+': ['Risk Management', 'Enterprise Security Architecture', 'Research & Collaboration', 'Integration of Computing'],
    'PenTest+': ['Planning & Scoping', 'Information Gathering', 'Vulnerability Assessment', 'Penetration Testing', 'Reporting']
  };
  
  // Load saved game state and stats
  useEffect(() => {
    const savedState = getGameState('comptia');
    const savedStats = getGameStats('comptia');
    
    if (savedState) {
      setGameState({
        ...savedState,
        currentExam: {
          ...savedState.currentExam,
          startTime: savedState.currentExam.startTime ? new Date(savedState.currentExam.startTime) : null
        },
        examHistory: savedState.examHistory?.map((item: any) => ({
          ...item,
          completedAt: new Date(item.completedAt)
        })) || [],
        studyProgress: {
          ...savedState.studyProgress,
          lastStudyDate: savedState.studyProgress?.lastStudyDate ? new Date(savedState.studyProgress.lastStudyDate) : null
        }
      });
    } else {
      // Initialize with default state
      const initialState: CompTIAGameState = {
        currentExam: {
          examType: 'A+',
          currentQuestion: 1,
          totalQuestions: 90,
          timeRemaining: 5400, // 90 minutes
          isActive: false,
          isPaused: false,
          startTime: null,
          answers: {},
          flaggedQuestions: [],
          reviewMode: false
        },
        examHistory: [],
        studyProgress: {
          totalStudyTime: 0,
          questionsAnswered: 0,
          correctAnswers: 0,
          weakDomains: [],
          strongDomains: [],
          studyStreak: 0,
          lastStudyDate: null,
          certificationGoals: ['A+'],
          completedCertifications: []
        },
        performance: {
          overallAccuracy: 0,
          averageScore: 0,
          bestScore: 0,
          improvementRate: 0,
          consistencyScore: 0,
          timeManagement: 0,
          domainMastery: {},
          readinessLevel: 'beginner'
        },
        settings: {
          examMode: 'practice',
          showExplanations: true,
          randomizeQuestions: true,
          flaggingEnabled: true,
          audioEnabled: true,
          theme: 'default',
          difficulty: 'adaptive'
        },
        achievements: [],
        statistics: {
          totalExams: 0,
          passedExams: 0,
          averagePassRate: 0,
          totalStudyHours: 0,
          questionsPerHour: 0,
          favoriteExamType: 'A+',
          masteredDomains: [],
          certificationProgress: {}
        }
      };
      setGameState(initialState);
    }
    
    if (savedStats.customStats) {
      setStudyStats(savedStats.customStats);
    }
  }, [getGameState, getGameStats]);
  
  // Save game state when it changes
  useEffect(() => {
    if (gameState) {
      updateGameState('comptia', gameState);
    }
  }, [gameState, updateGameState]);
  
  // Handle exam start
  const handleExamStart = useCallback(() => {
    setIsExamActive(true);
    
    if (gameState) {
      const now = new Date();
      setGameState({
        ...gameState,
        currentExam: {
          ...gameState.currentExam,
          isActive: true,
          isPaused: false,
          startTime: now,
          currentQuestion: 1,
          answers: {},
          flaggedQuestions: [],
          reviewMode: false
        },
        studyProgress: {
          ...gameState.studyProgress,
          lastStudyDate: now
        }
      });
    }
  }, [gameState]);
  
  // Handle exam completion
  const handleExamComplete = useCallback((finalScore?: number, results?: any) => {
    setIsExamActive(false);
    
    if (gameState) {
      const examDuration = gameState.currentExam.startTime ? 
        Math.floor((new Date().getTime() - gameState.currentExam.startTime.getTime()) / 1000) : 0;
      
      const score = finalScore || 0;
      const passed = score >= 70; // Typical CompTIA passing score
      const correctAnswers = Math.floor((score / 100) * gameState.currentExam.totalQuestions);
      
      const examResult = {
        id: `exam-${Date.now()}`,
        examType: gameState.currentExam.examType,
        score,
        totalQuestions: gameState.currentExam.totalQuestions,
        correctAnswers,
        timeSpent: examDuration,
        completedAt: new Date(),
        passed,
        domains: calculateDomainScores(gameState.currentExam.examType, results),
        difficulty: gameState.settings.examMode as 'practice' | 'simulation' | 'certification'
      };
      
      const newStats = {
        ...studyStats,
        totalSessions: studyStats.totalSessions + 1,
        totalStudyTime: studyStats.totalStudyTime + examDuration,
        questionsAnswered: studyStats.questionsAnswered + gameState.currentExam.totalQuestions,
        correctAnswers: studyStats.correctAnswers + correctAnswers,
        averageScore: calculateAverageScore(studyStats, score),
        bestScore: Math.max(studyStats.bestScore, score),
        passRate: calculatePassRate(studyStats, passed),
        certificationProgress: calculateCertificationProgress(gameState, score),
        readinessScore: calculateReadinessScore(studyStats, score, passed),
        weakestDomain: getWeakestDomain(examResult.domains),
        strongestDomain: getStrongestDomain(examResult.domains),
        estimatedReadiness: getReadinessLevel(studyStats, score),
        achievements: getAchievements({
          ...studyStats,
          totalSessions: studyStats.totalSessions + 1,
          bestScore: Math.max(studyStats.bestScore, score)
        }, passed, score)
      };
      
      setStudyStats(newStats);
      
      setGameState({
        ...gameState,
        examHistory: [...gameState.examHistory, examResult].slice(-20), // Keep last 20
        studyProgress: {
          ...gameState.studyProgress,
          totalStudyTime: gameState.studyProgress.totalStudyTime + examDuration,
          questionsAnswered: gameState.studyProgress.questionsAnswered + gameState.currentExam.totalQuestions,
          correctAnswers: gameState.studyProgress.correctAnswers + correctAnswers,
          weakDomains: updateWeakDomains(gameState.studyProgress.weakDomains, examResult.domains),
          strongDomains: updateStrongDomains(gameState.studyProgress.strongDomains, examResult.domains),
          completedCertifications: passed && gameState.settings.examMode === 'simulation' ? 
            [...gameState.studyProgress.completedCertifications, gameState.currentExam.examType] : 
            gameState.studyProgress.completedCertifications
        },
        performance: {
          ...gameState.performance,
          overallAccuracy: (gameState.studyProgress.correctAnswers + correctAnswers) / 
            (gameState.studyProgress.questionsAnswered + gameState.currentExam.totalQuestions) * 100,
          averageScore: newStats.averageScore,
          bestScore: newStats.bestScore,
          readinessLevel: newStats.estimatedReadiness
        },
        statistics: {
          ...gameState.statistics,
          totalExams: gameState.statistics.totalExams + 1,
          passedExams: gameState.statistics.passedExams + (passed ? 1 : 0),
          averagePassRate: newStats.passRate,
          totalStudyHours: (gameState.statistics.totalStudyHours * 3600 + examDuration) / 3600,
          favoriteExamType: gameState.currentExam.examType
        },
        currentExam: {
          ...gameState.currentExam,
          isActive: false,
          isPaused: false
        }
      });
      
      // Update store with comprehensive stats
      updateGameStats('comptia', {
        totalSessions: newStats.totalSessions,
        totalPlayTime: newStats.totalStudyTime,
        completedSessions: newStats.totalSessions,
        bestScore: newStats.bestScore,
        averageScore: newStats.averageScore,
        achievements: newStats.achievements,
        customStats: newStats,
        category: 'educational',
        difficulty: gameState.settings.difficulty
      });
    }
  }, [gameState, studyStats, updateGameStats]);
  
  // Handle exam reset
  const handleExamReset = useCallback(() => {
    if (gameState) {
      setGameState({
        ...gameState,
        currentExam: {
          ...gameState.currentExam,
          currentQuestion: 1,
          isActive: false,
          isPaused: false,
          startTime: null,
          answers: {},
          flaggedQuestions: [],
          reviewMode: false,
          timeRemaining: getExamDuration(gameState.currentExam.examType)
        }
      });
    }
    setIsExamActive(false);
  }, [gameState]);
  
  // Helper functions
  const calculateDomainScores = (examType: string, results: any): Record<string, { correct: number; total: number }> => {
    const domains = examTypes[examType as keyof typeof examTypes] || [];
    const domainScores: Record<string, { correct: number; total: number }> = {};
    
    domains.forEach(domain => {
      domainScores[domain] = {
        correct: Math.floor(Math.random() * 10) + 5, // Simulated for now
        total: 15
      };
    });
    
    return domainScores;
  };
  
  const calculateAverageScore = (stats: typeof studyStats, newScore: number): number => {
    return ((stats.averageScore * stats.totalSessions) + newScore) / (stats.totalSessions + 1);
  };
  
  const calculatePassRate = (stats: typeof studyStats, passed: boolean): number => {
    const totalPassed = stats.totalSessions * (stats.passRate / 100) + (passed ? 1 : 0);
    return (totalPassed / (stats.totalSessions + 1)) * 100;
  };
  
  const calculateCertificationProgress = (gameState: CompTIAGameState, score: number): number => {
    const targetScore = 70;
    return Math.min((score / targetScore) * 100, 100);
  };
  
  const calculateReadinessScore = (stats: typeof studyStats, score: number, passed: boolean): number => {
    let readiness = stats.readinessScore;
    
    if (passed) {
      readiness += 10;
      if (score >= 85) readiness += 5;
      if (score >= 95) readiness += 5;
    } else {
      readiness = Math.max(0, readiness - 5);
    }
    
    return Math.min(readiness, 100);
  };
  
  const getWeakestDomain = (domains: Record<string, { correct: number; total: number }>): string => {
    let weakest = '';
    let lowestScore = 1;
    
    Object.entries(domains).forEach(([domain, stats]) => {
      const score = stats.correct / stats.total;
      if (score < lowestScore) {
        lowestScore = score;
        weakest = domain;
      }
    });
    
    return weakest || 'Hardware';
  };
  
  const getStrongestDomain = (domains: Record<string, { correct: number; total: number }>): string => {
    let strongest = '';
    let highestScore = 0;
    
    Object.entries(domains).forEach(([domain, stats]) => {
      const score = stats.correct / stats.total;
      if (score > highestScore) {
        highestScore = score;
        strongest = domain;
      }
    });
    
    return strongest || 'Hardware';
  };
  
  const getReadinessLevel = (stats: typeof studyStats, score: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' => {
    if (stats.averageScore >= 90 && stats.passRate >= 90) return 'expert';
    if (stats.averageScore >= 80 && stats.passRate >= 75) return 'advanced';
    if (stats.averageScore >= 70 && stats.passRate >= 60) return 'intermediate';
    return 'beginner';
  };
  
  const updateWeakDomains = (current: string[], domainScores: Record<string, { correct: number; total: number }>): string[] => {
    const weak = Object.entries(domainScores)
      .filter(([_, stats]) => (stats.correct / stats.total) < 0.7)
      .map(([domain]) => domain);
    
    return Array.from(new Set([...current, ...weak])).slice(0, 5);
  };
  
  const updateStrongDomains = (current: string[], domainScores: Record<string, { correct: number; total: number }>): string[] => {
    const strong = Object.entries(domainScores)
      .filter(([_, stats]) => (stats.correct / stats.total) >= 0.85)
      .map(([domain]) => domain);
    
    return Array.from(new Set([...current, ...strong])).slice(0, 5);
  };
  
  const getExamDuration = (examType: string): number => {
    const durations: Record<string, number> = {
      'A+': 5400, // 90 minutes
      'Network+': 5400,
      'Security+': 5400,
      'Cloud+': 5400,
      'CySA+': 9900, // 165 minutes
      'CASP+': 9900,
      'PenTest+': 9900
    };
    return durations[examType] || 5400;
  };
  
  const getAchievements = (stats: typeof studyStats, passed: boolean, score: number): string[] => {
    const achievements: string[] = [];
    
    if (stats.totalSessions >= 1) achievements.push('First Exam');
    if (stats.totalSessions >= 10) achievements.push('Study Warrior');
    if (stats.totalSessions >= 50) achievements.push('Certification Seeker');
    if (stats.totalSessions >= 100) achievements.push('CompTIA Expert');
    if (passed) achievements.push('Exam Passer');
    if (score >= 85) achievements.push('High Achiever');
    if (score >= 95) achievements.push('Excellence');
    if (stats.passRate >= 80) achievements.push('Consistent Performer');
    if (stats.bestScore >= 90) achievements.push('Top Scorer');
    if (stats.studyStreak >= 7) achievements.push('Week Warrior');
    if (stats.studyStreak >= 30) achievements.push('Month Master');
    if (stats.totalStudyTime >= 36000) achievements.push('10 Hour Club');
    if (stats.totalStudyTime >= 180000) achievements.push('50 Hour Club');
    if (stats.readinessScore >= 80) achievements.push('Certification Ready');
    
    return achievements;
  };
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Change exam type
  const changeExamType = useCallback(() => {
    if (gameState) {
      const types = Object.keys(examTypes) as Array<keyof typeof examTypes>;
      const currentIndex = types.indexOf(gameState.currentExam.examType);
      const nextType = types[(currentIndex + 1) % types.length];
      
      setGameState({
        ...gameState,
        currentExam: {
          ...gameState.currentExam,
          examType: nextType,
          totalQuestions: nextType === 'A+' ? 90 : 85,
          timeRemaining: getExamDuration(nextType)
        }
      });
    }
  }, [gameState]);
  
  // Change exam mode
  const changeExamMode = useCallback(() => {
    if (gameState) {
      const modes: Array<'practice' | 'timed' | 'simulation'> = ['practice', 'timed', 'simulation'];
      const currentIndex = modes.indexOf(gameState.settings.examMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      
      setGameState({
        ...gameState,
        settings: {
          ...gameState.settings,
          examMode: nextMode
        }
      });
    }
  }, [gameState]);
  
  // Custom controls for CompTIA
  const customControls = (
    <>
      <GlassButton
        variant="ghost"
        size="sm"
        icon={BookOpen}
        onClick={changeExamType}
        className="text-blue-400 hover:text-blue-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Clock}
        onClick={changeExamMode}
        className="text-green-400 hover:text-green-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Brain}
        onClick={() => {
          if (gameState) {
            const difficulties: Array<'adaptive' | 'beginner' | 'intermediate' | 'advanced'> = 
              ['adaptive', 'beginner', 'intermediate', 'advanced'];
            const currentIndex = difficulties.indexOf(gameState.settings.difficulty);
            const nextDifficulty = difficulties[(currentIndex + 1) % difficulties.length];
            
            setGameState({
              ...gameState,
              settings: {
                ...gameState.settings,
                difficulty: nextDifficulty
              }
            });
          }
        }}
        className="text-purple-400 hover:text-purple-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Target}
        onClick={() => {
          console.log('Study Progress:', gameState?.studyProgress || {});
        }}
        className="text-yellow-400 hover:text-yellow-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={Award}
        onClick={() => {
          console.log('Achievements:', studyStats.achievements);
        }}
        className="text-orange-400 hover:text-orange-300"
      />
      
      <GlassButton
        variant="ghost"
        size="sm"
        icon={BarChart3}
        onClick={() => {
          console.log('Performance Stats:', studyStats);
        }}
        className="text-cyan-400 hover:text-cyan-300"
      />
    </>
  );
  
  return (
    <GameWrapper
      gameId="comptia"
      title="CompTIA Study Center"
      description="Comprehensive CompTIA certification exam preparation and practice!"
      category="educational"
      difficulty={mapDifficultyToGameWrapper(gameState?.settings.difficulty || 'adaptive')}
      className={className}
      enableAnalytics={true}
      enablePerformanceTracking={true}
      enableSaveState={true}
      enableFullscreen={true}
      enableAudio={gameState?.settings.audioEnabled}
      customControls={customControls}
      onGameStart={handleExamStart}
      onGameEnd={handleExamComplete}
      onGameReset={handleExamReset}
    >
      <div className="w-full h-full min-h-[600px] p-4">
        {/* Study Statistics Display */}
        {studyStats.totalSessions > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-6 text-sm text-white/70">
              <span>Sessions: {studyStats.totalSessions}</span>
              <span>Avg Score: {Math.round(studyStats.averageScore)}%</span>
              <span>Pass Rate: {Math.round(studyStats.passRate)}%</span>
              <span>Best: {studyStats.bestScore}%</span>
              <span>Readiness: {Math.round(studyStats.readinessScore)}%</span>
            </div>
          </div>
        )}
        
        {/* Current Exam Display */}
        {gameState && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-4 text-sm text-white/80">
              <span>Exam: {gameState.currentExam.examType}</span>
              <span>Questions: {gameState.currentExam.totalQuestions}</span>
              <span>Mode: {gameState.settings.examMode}</span>
              <span>Time: {formatTime(gameState.currentExam.timeRemaining)}</span>
              {gameState.currentExam.isActive && (
                <span>Current: {gameState.currentExam.currentQuestion}/{gameState.currentExam.totalQuestions}</span>
              )}
            </div>
          </div>
        )}
        
        {/* Domain Performance */}
        {studyStats.totalSessions > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="flex space-x-4 text-xs text-white/60">
              <span>Target: {studyStats.targetCertification}</span>
              <span>Level: {studyStats.estimatedReadiness}</span>
              <span>Strongest: {studyStats.strongestDomain}</span>
              <span>Weakest: {studyStats.weakestDomain}</span>
              <span>Progress: {Math.round(studyStats.certificationProgress)}%</span>
            </div>
          </div>
        )}
        
        {/* Study Streak */}
        {studyStats.studyStreak > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="text-xs text-white/50">
              <span>Study Streak: </span>
              <span className="font-semibold text-green-400">{studyStats.studyStreak} days</span>
            </div>
          </div>
        )}
        
        {/* CompTIA Game Component */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <CompTIA />
          </div>
        </div>
        
        {/* Game Instructions */}
        <div className="mt-4 text-center text-white/60 text-sm">
          <p>Practice CompTIA certification exams with realistic questions and detailed explanations!</p>
          <p className="mt-1">
            <span className="font-semibold">Certifications:</span> A+, Network+, Security+, Cloud+, CySA+, CASP+, PenTest+ • 
            <span className="font-semibold">Modes:</span> Practice, Timed, Simulation
          </p>
        </div>
      </div>
    </GameWrapper>
  );
};

export default CompTIAWrapper;