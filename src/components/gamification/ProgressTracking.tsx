import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, Star, BookOpen, Code, Gamepad2, Trophy, CheckCircle, Circle, Lock } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import styles from './ProgressTracking.module.css';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  sections: LearningSection[];
  totalXP: number;
}

interface LearningSection {
  id: string;
  title: string;
  description: string;
  type: 'reading' | 'interactive' | 'challenge' | 'game';
  xpReward: number;
  timeEstimate: string;
  completed: boolean;
  locked: boolean;
  content?: {
    url?: string;
    component?: string;
    description?: string;
  };
}

interface ProgressStats {
  totalSectionsCompleted: number;
  totalSections: number;
  totalXPEarned: number;
  totalXPAvailable: number;
  averageTimePerSection: number;
  streakDays: number;
  pathsCompleted: number;
  currentLevel: number;
}

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'frontend-fundamentals',
    title: 'Frontend Fundamentals',
    description: 'Master the basics of modern frontend development',
    icon: <Code className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    estimatedTime: '2-3 hours',
    difficulty: 'beginner',
    prerequisites: [],
    totalXP: 500,
    sections: [
      {
        id: 'html-basics',
        title: 'HTML Structure & Semantics',
        description: 'Learn about semantic HTML and proper document structure',
        type: 'reading',
        xpReward: 50,
        timeEstimate: '20 min',
        completed: false,
        locked: false,
        content: { description: 'Explore HTML5 semantic elements and accessibility best practices' }
      },
      {
        id: 'css-styling',
        title: 'CSS Styling & Layout',
        description: 'Master CSS Grid, Flexbox, and modern styling techniques',
        type: 'interactive',
        xpReward: 75,
        timeEstimate: '30 min',
        completed: false,
        locked: false,
        content: { component: 'CSSPlayground', description: 'Interactive CSS playground with live preview' }
      },
      {
        id: 'js-fundamentals',
        title: 'JavaScript Fundamentals',
        description: 'Core JavaScript concepts and ES6+ features',
        type: 'challenge',
        xpReward: 100,
        timeEstimate: '45 min',
        completed: false,
        locked: true,
        content: { component: 'JSChallenges', description: 'Hands-on JavaScript coding challenges' }
      },
      {
        id: 'dom-manipulation',
        title: 'DOM Manipulation',
        description: 'Learn to interact with the Document Object Model',
        type: 'interactive',
        xpReward: 75,
        timeEstimate: '25 min',
        completed: false,
        locked: true,
        content: { component: 'DOMPlayground', description: 'Interactive DOM manipulation exercises' }
      },
      {
        id: 'responsive-design',
        title: 'Responsive Design',
        description: 'Create layouts that work on all devices',
        type: 'challenge',
        xpReward: 100,
        timeEstimate: '40 min',
        completed: false,
        locked: true,
        content: { component: 'ResponsiveChallenge', description: 'Build responsive layouts step by step' }
      },
      {
        id: 'frontend-game',
        title: 'Frontend Skills Game',
        description: 'Test your frontend knowledge in a fun game format',
        type: 'game',
        xpReward: 100,
        timeEstimate: '15 min',
        completed: false,
        locked: true,
        content: { component: 'FrontendGame', description: 'Gamified frontend skills assessment' }
      }
    ]
  },
  {
    id: 'react-mastery',
    title: 'React Mastery',
    description: 'Deep dive into React and modern state management',
    icon: <Star className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    estimatedTime: '3-4 hours',
    difficulty: 'intermediate',
    prerequisites: ['frontend-fundamentals'],
    totalXP: 750,
    sections: [
      {
        id: 'react-components',
        title: 'Component Architecture',
        description: 'Learn to build reusable and maintainable components',
        type: 'interactive',
        xpReward: 100,
        timeEstimate: '35 min',
        completed: false,
        locked: false,
        content: { component: 'ComponentBuilder', description: 'Build components with live preview' }
      },
      {
        id: 'state-management',
        title: 'State Management',
        description: 'Master useState, useEffect, and custom hooks',
        type: 'challenge',
        xpReward: 125,
        timeEstimate: '45 min',
        completed: false,
        locked: true,
        content: { component: 'StateChallenge', description: 'State management coding challenges' }
      },
      {
        id: 'context-api',
        title: 'Context API & Global State',
        description: 'Learn global state management with Context API',
        type: 'interactive',
        xpReward: 100,
        timeEstimate: '30 min',
        completed: false,
        locked: true,
        content: { component: 'ContextPlayground', description: 'Interactive Context API examples' }
      },
      {
        id: 'performance-optimization',
        title: 'Performance Optimization',
        description: 'Optimize React apps with memoization and lazy loading',
        type: 'reading',
        xpReward: 75,
        timeEstimate: '25 min',
        completed: false,
        locked: true,
        content: { description: 'Performance best practices and optimization techniques' }
      },
      {
        id: 'testing-react',
        title: 'Testing React Components',
        description: 'Write effective tests for React applications',
        type: 'challenge',
        xpReward: 125,
        timeEstimate: '40 min',
        completed: false,
        locked: true,
        content: { component: 'TestingChallenge', description: 'Learn testing with hands-on examples' }
      },
      {
        id: 'react-mastery-game',
        title: 'React Expert Challenge',
        description: 'Prove your React mastery in this comprehensive challenge',
        type: 'game',
        xpReward: 225,
        timeEstimate: '30 min',
        completed: false,
        locked: true,
        content: { component: 'ReactMasteryGame', description: 'Advanced React skills assessment' }
      }
    ]
  },
  {
    id: 'algorithms-data-structures',
    title: 'Algorithms & Data Structures',
    description: 'Master computer science fundamentals',
    icon: <Target className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    estimatedTime: '4-5 hours',
    difficulty: 'advanced',
    prerequisites: ['frontend-fundamentals'],
    totalXP: 1000,
    sections: [
      {
        id: 'big-o-notation',
        title: 'Big O Notation',
        description: 'Understand algorithm complexity and performance analysis',
        type: 'reading',
        xpReward: 100,
        timeEstimate: '30 min',
        completed: false,
        locked: false,
        content: { description: 'Learn to analyze algorithm efficiency and time complexity' }
      },
      {
        id: 'arrays-strings',
        title: 'Arrays & Strings',
        description: 'Master array and string manipulation algorithms',
        type: 'challenge',
        xpReward: 150,
        timeEstimate: '50 min',
        completed: false,
        locked: true,
        content: { component: 'ArrayStringChallenge', description: 'Solve array and string problems' }
      },
      {
        id: 'linked-lists',
        title: 'Linked Lists',
        description: 'Implement and manipulate linked list data structures',
        type: 'interactive',
        xpReward: 125,
        timeEstimate: '40 min',
        completed: false,
        locked: true,
        content: { component: 'LinkedListVisualizer', description: 'Visual linked list operations' }
      },
      {
        id: 'stacks-queues',
        title: 'Stacks & Queues',
        description: 'Learn LIFO and FIFO data structures',
        type: 'game',
        xpReward: 125,
        timeEstimate: '35 min',
        completed: false,
        locked: true,
        content: { component: 'StackQueueGame', description: 'Interactive stack and queue games' }
      },
      {
        id: 'trees-graphs',
        title: 'Trees & Graphs',
        description: 'Explore hierarchical and network data structures',
        type: 'interactive',
        xpReward: 200,
        timeEstimate: '60 min',
        completed: false,
        locked: true,
        content: { component: 'TreeGraphVisualizer', description: 'Visual tree and graph algorithms' }
      },
      {
        id: 'sorting-searching',
        title: 'Sorting & Searching',
        description: 'Master fundamental sorting and searching algorithms',
        type: 'challenge',
        xpReward: 175,
        timeEstimate: '45 min',
        completed: false,
        locked: true,
        content: { component: 'SortSearchChallenge', description: 'Implement and optimize sorting algorithms' }
      },
      {
        id: 'algorithm-mastery',
        title: 'Algorithm Mastery Test',
        description: 'Comprehensive test of algorithm and data structure knowledge',
        type: 'game',
        xpReward: 125,
        timeEstimate: '45 min',
        completed: false,
        locked: true,
        content: { component: 'AlgorithmMasteryTest', description: 'Final algorithm mastery assessment' }
      }
    ]
  }
];

const DIFFICULTY_CONFIG = {
  beginner: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'Beginner' },
  intermediate: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Intermediate' },
  advanced: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Advanced' }
};

const TYPE_CONFIG = {
  reading: { icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-400', label: 'Reading' },
  interactive: { icon: <Code className="w-4 h-4" />, color: 'text-purple-400', label: 'Interactive' },
  challenge: { icon: <Target className="w-4 h-4" />, color: 'text-orange-400', label: 'Challenge' },
  game: { icon: <Gamepad2 className="w-4 h-4" />, color: 'text-green-400', label: 'Game' }
};

export const ProgressTracking: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(LEARNING_PATHS);
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalSectionsCompleted: 0,
    totalSections: 0,
    totalXPEarned: 0,
    totalXPAvailable: 0,
    averageTimePerSection: 0,
    streakDays: 3,
    pathsCompleted: 0,
    currentLevel: 1
  });
  const [showCelebration, setShowCelebration] = useState(false);
  
  const { addXP, unlockAchievement, level } = useGameStore();

  // Calculate progress statistics
  useEffect(() => {
    const totalSections = learningPaths.reduce((sum, path) => sum + path.sections.length, 0);
    const completedSections = learningPaths.reduce((sum, path) => 
      sum + path.sections.filter(section => section.completed).length, 0
    );
    const totalXPAvailable = learningPaths.reduce((sum, path) => sum + path.totalXP, 0);
    const earnedXP = learningPaths.reduce((sum, path) => 
      sum + path.sections.filter(section => section.completed).reduce((xpSum, section) => xpSum + section.xpReward, 0), 0
    );
    const pathsCompleted = learningPaths.filter(path => 
      path.sections.every(section => section.completed)
    ).length;

    setProgressStats({
      totalSectionsCompleted: completedSections,
      totalSections,
      totalXPEarned: earnedXP,
      totalXPAvailable,
      averageTimePerSection: completedSections > 0 ? 25 : 0, // Mock average
      streakDays: 3, // Mock streak
      pathsCompleted,
      currentLevel: level
    });
  }, [learningPaths, level]);

  // Update section locks based on completion
  useEffect(() => {
    setLearningPaths(prevPaths => 
      prevPaths.map(path => ({
        ...path,
        sections: path.sections.map((section, index) => {
          if (index === 0) return { ...section, locked: false };
          const prevSection = path.sections[index - 1];
          return { ...section, locked: !prevSection.completed };
        })
      }))
    );
  }, []);

  const completeSection = (pathId: string, sectionId: string) => {
    setLearningPaths(prevPaths => 
      prevPaths.map(path => {
        if (path.id !== pathId) return path;
        
        return {
          ...path,
          sections: path.sections.map(section => {
            if (section.id !== sectionId) return section;
            
            if (!section.completed) {
              // Award XP and unlock achievements
              addXP(section.xpReward);
              
              // Check for achievements
              const completedCount = path.sections.filter(s => s.completed).length + 1;
              if (completedCount === 1) {
                unlockAchievement('first-lesson');
              }
              if (completedCount === path.sections.length) {
                unlockAchievement('path-completed');
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 3000);
              }
              
              return { ...section, completed: true };
            }
            
            return section;
          })
        };
      })
    );
  };

  const getPathProgress = (path: LearningPath) => {
    const completed = path.sections.filter(section => section.completed).length;
    const total = path.sections.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  const isPathUnlocked = (path: LearningPath) => {
    if (path.prerequisites.length === 0) return true;
    
    return path.prerequisites.every(prereqId => {
      const prereqPath = learningPaths.find(p => p.id === prereqId);
      return prereqPath && prereqPath.sections.every(section => section.completed);
    });
  };

  const getEstimatedTimeRemaining = (path: LearningPath) => {
    const incompleteSections = path.sections.filter(section => !section.completed);
    const totalMinutes = incompleteSections.reduce((sum, section) => {
      const minutes = parseInt(section.timeEstimate.split(' ')[0]);
      return sum + minutes;
    }, 0);
    
    if (totalMinutes < 60) return `${totalMinutes} min`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <TrendingUp className="text-blue-400" />
            Learning Progress
            <BookOpen className="text-green-400" />
          </h1>
          <p className="text-gray-300 text-lg">
            Track your learning journey and master new skills
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
        >
          <h2 className="text-white text-xl font-bold mb-4">Your Progress Overview</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {progressStats.totalSectionsCompleted}/{progressStats.totalSections}
              </div>
              <div className="text-gray-300 text-sm">Sections Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {progressStats.totalXPEarned.toLocaleString()}
              </div>
              <div className="text-gray-300 text-sm">XP Earned</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {progressStats.pathsCompleted}
              </div>
              <div className="text-gray-300 text-sm">Paths Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {progressStats.streakDays}
              </div>
              <div className="text-gray-300 text-sm">Day Streak</div>
            </div>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round((progressStats.totalSectionsCompleted / progressStats.totalSections) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(progressStats.totalSectionsCompleted / progressStats.totalSections) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {!selectedPath ? (
          /* Learning Paths Grid */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {learningPaths.map((path, index) => {
              const progress = getPathProgress(path);
              const isUnlocked = isPathUnlocked(path);
              const difficulty = DIFFICULTY_CONFIG[path.difficulty];
              
              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 cursor-pointer transition-all ${
                    isUnlocked ? 'hover:scale-105' : 'opacity-60'
                  }`}
                  onClick={() => isUnlocked && setSelectedPath(path)}
                >
                  {!isUnlocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="text-gray-400" size={20} />
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${path.color} mb-4`}>
                      {path.icon}
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">{path.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{path.description}</p>
                    
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className={`px-2 py-1 rounded-full ${difficulty.bg} ${difficulty.color} font-medium`}>
                        {difficulty.label}
                      </span>
                      <span className="text-gray-400">{path.estimatedTime}</span>
                    </div>
                    
                    {path.prerequisites.length > 0 && (
                      <div className="text-xs text-gray-400 mb-3">
                        Prerequisites: {path.prerequisites.join(', ')}
                      </div>
                    )}
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Progress</span>
                      <span>{progress.completed}/{progress.total} sections</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${styles.progressBar} bg-gradient-to-r ${path.color} h-2 rounded-full transition-all duration-500`}
                        style={{ '--progress-width': `${progress.percentage}%` } as React.CSSProperties}
                      />
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between text-sm">
                    <div className="text-center">
                      <div className="text-white font-bold">{path.totalXP}</div>
                      <div className="text-gray-400">Total XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">{path.sections.length}</div>
                      <div className="text-gray-400">Sections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">{getEstimatedTimeRemaining(path)}</div>
                      <div className="text-gray-400">Remaining</div>
                    </div>
                  </div>
                  
                  {progress.percentage === 100 && (
                    <div className="mt-4 p-2 bg-green-500/20 rounded-lg text-center">
                      <Trophy className="text-yellow-400 mx-auto mb-1" size={20} />
                      <span className="text-green-400 font-medium text-sm">Completed!</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* Selected Path Detail */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedPath(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                >
                  ←
                </button>
                <div className={`p-3 rounded-full bg-gradient-to-r ${selectedPath.color}`}>
                  {selectedPath.icon}
                </div>
                <div>
                  <h2 className="text-white text-2xl font-bold">{selectedPath.title}</h2>
                  <p className="text-gray-300">{selectedPath.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-medium ${DIFFICULTY_CONFIG[selectedPath.difficulty].color}`}>
                  {DIFFICULTY_CONFIG[selectedPath.difficulty].label}
                </div>
                <div className="text-gray-400 text-sm">{selectedPath.estimatedTime}</div>
              </div>
            </div>
            
            {/* Path Progress */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-bold">Path Progress</h3>
                <span className="text-blue-400">
                  {getPathProgress(selectedPath).completed}/{getPathProgress(selectedPath).total} completed
                </span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className={`${styles.progressBar} bg-gradient-to-r ${selectedPath.color} h-3 rounded-full transition-all duration-500`}
                  style={{ '--progress-width': `${getPathProgress(selectedPath).percentage}%` } as React.CSSProperties}
                />
              </div>
            </div>
            
            {/* Sections */}
            <div className="space-y-4">
              {selectedPath.sections.map((section, index) => {
                const typeConfig = TYPE_CONFIG[section.type];
                
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border transition-all ${
                      section.completed ? 'border-green-500/50 bg-green-500/10' :
                      section.locked ? 'border-gray-600 opacity-60' : 'border-white/20 hover:border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {section.completed ? (
                            <CheckCircle className="text-green-400" size={24} />
                          ) : section.locked ? (
                            <Lock className="text-gray-400" size={24} />
                          ) : (
                            <Circle className="text-gray-400" size={24} />
                          )}
                        </div>
                        
                        <div>
                          <h4 className="text-white text-lg font-bold mb-1">{section.title}</h4>
                          <p className="text-gray-300 text-sm mb-2">{section.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`flex items-center gap-1 ${typeConfig.color}`}>
                              {typeConfig.icon}
                              {typeConfig.label}
                            </span>
                            <span className="text-gray-400">{section.timeEstimate}</span>
                            <span className="text-blue-400">+{section.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!section.locked && !section.completed && (
                          <button
                            onClick={() => completeSection(selectedPath.id, section.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Start
                          </button>
                        )}
                        
                        {section.completed && (
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Celebration Modal */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/20 text-center"
              >
                <Trophy className="text-yellow-400 mx-auto mb-4" size={64} />
                <h2 className="text-white text-2xl font-bold mb-2">Path Completed! 🎉</h2>
                <p className="text-gray-300 mb-4">
                  Congratulations! You've completed the learning path.
                </p>
                <button
                  onClick={() => setShowCelebration(false)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
                >
                  Continue Learning
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProgressTracking;