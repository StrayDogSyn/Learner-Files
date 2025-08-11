import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Code, Trophy, Clock, CheckCircle, XCircle, Star, Zap } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface Question {
  id: string;
  type: 'multiple-choice' | 'code-completion' | 'true-false' | 'drag-drop';
  category: 'JavaScript' | 'React' | 'CSS' | 'HTML' | 'General';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  code?: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  points: number;
}

interface GameMode {
  id: string;
  name: string;
  description: string;
  timeLimit: number; // in seconds
  questionCount: number;
  difficulty: 'Mixed' | 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
}

const GAME_MODES: GameMode[] = [
  {
    id: 'quick-fire',
    name: 'Quick Fire',
    description: 'Answer as many questions as possible in 2 minutes',
    timeLimit: 120,
    questionCount: 20,
    difficulty: 'Mixed',
    icon: '⚡'
  },
  {
    id: 'react-master',
    name: 'React Master',
    description: 'Test your React knowledge with 15 challenging questions',
    timeLimit: 300,
    questionCount: 15,
    difficulty: 'Intermediate',
    icon: '⚛️'
  },
  {
    id: 'js-fundamentals',
    name: 'JS Fundamentals',
    description: 'Master JavaScript basics with 10 essential questions',
    timeLimit: 180,
    questionCount: 10,
    difficulty: 'Beginner',
    icon: '📚'
  },
  {
    id: 'expert-challenge',
    name: 'Expert Challenge',
    description: 'Ultimate test for advanced developers',
    timeLimit: 600,
    questionCount: 25,
    difficulty: 'Advanced',
    icon: '🔥'
  }
];

const QUESTIONS: Question[] = [
  {
    id: 'js-1',
    type: 'multiple-choice',
    category: 'JavaScript',
    difficulty: 'Beginner',
    question: 'What is the correct way to declare a variable in JavaScript?',
    options: ['var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
    correctAnswer: 0,
    explanation: 'In JavaScript, variables are declared using var, let, or const keywords.',
    points: 10
  },
  {
    id: 'js-2',
    type: 'code-completion',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    question: 'Complete the function to reverse a string:',
    code: `function reverseString(str) {
  return str.____().____().____();
}`,
    correctAnswer: 'split("").reverse().join("")',
    explanation: 'To reverse a string, split it into an array, reverse the array, then join it back.',
    points: 20
  },
  {
    id: 'react-1',
    type: 'multiple-choice',
    category: 'React',
    difficulty: 'Beginner',
    question: 'What is JSX?',
    options: [
      'A JavaScript library',
      'A syntax extension for JavaScript',
      'A CSS framework',
      'A database query language'
    ],
    correctAnswer: 1,
    explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React.',
    points: 10
  },
  {
    id: 'react-2',
    type: 'multiple-choice',
    category: 'React',
    difficulty: 'Intermediate',
    question: 'Which hook is used to manage state in functional components?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correctAnswer: 1,
    explanation: 'useState is the primary hook for managing state in functional React components.',
    points: 15
  },
  {
    id: 'js-3',
    type: 'true-false',
    category: 'JavaScript',
    difficulty: 'Beginner',
    question: 'JavaScript is a statically typed language.',
    correctAnswer: false,
    explanation: 'JavaScript is a dynamically typed language, meaning variable types are determined at runtime.',
    points: 10
  },
  {
    id: 'react-3',
    type: 'code-completion',
    category: 'React',
    difficulty: 'Advanced',
    question: 'Complete the useEffect hook to run only on mount:',
    code: `useEffect(() => {
  console.log('Component mounted');
}, ____);`,
    correctAnswer: '[]',
    explanation: 'An empty dependency array [] makes useEffect run only once on component mount.',
    points: 25
  },
  {
    id: 'js-4',
    type: 'multiple-choice',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    question: 'What does the "this" keyword refer to in JavaScript?',
    options: [
      'The current function',
      'The global object',
      'The object that owns the method',
      'It depends on the context'
    ],
    correctAnswer: 3,
    explanation: 'The "this" keyword in JavaScript refers to different objects depending on how it is used.',
    points: 20
  },
  {
    id: 'css-1',
    type: 'multiple-choice',
    category: 'CSS',
    difficulty: 'Beginner',
    question: 'Which CSS property is used to change the text color?',
    options: ['font-color', 'text-color', 'color', 'foreground-color'],
    correctAnswer: 2,
    explanation: 'The "color" property is used to set the color of text in CSS.',
    points: 10
  },
  {
    id: 'react-4',
    type: 'multiple-choice',
    category: 'React',
    difficulty: 'Advanced',
    question: 'What is the purpose of React.memo()?',
    options: [
      'To memorize component state',
      'To prevent unnecessary re-renders',
      'To cache API responses',
      'To store component data'
    ],
    correctAnswer: 1,
    explanation: 'React.memo() is a higher-order component that prevents unnecessary re-renders by memoizing the result.',
    points: 30
  },
  {
    id: 'js-5',
    type: 'code-completion',
    category: 'JavaScript',
    difficulty: 'Advanced',
    question: 'Complete the async/await function:',
    code: `____ function fetchData() {
  try {
    const response = ____ fetch('/api/data');
    const data = ____ response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}`,
    correctAnswer: 'async await await',
    explanation: 'async/await syntax allows you to write asynchronous code that looks synchronous.',
    points: 25
  }
];

export const SkillAssessmentGames: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<(string | number | boolean)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStats, setGameStats] = useState({
    totalGames: 0,
    averageScore: 0,
    bestScore: 0,
    totalQuestions: 0,
    correctAnswers: 0
  });
  const { addAchievement, addXP, completeChallenge } = useGameStore();

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameActive) {
      endGame();
    }
  }, [isGameActive, timeLeft]);

  const startGame = (mode: GameMode) => {
    setSelectedMode(mode);
    
    // Filter questions based on mode
    let filteredQuestions = QUESTIONS;
    if (mode.difficulty !== 'Mixed') {
      filteredQuestions = QUESTIONS.filter(q => q.difficulty === mode.difficulty);
    }
    
    // Shuffle and select questions
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, mode.questionCount);
    
    setGameQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeLeft(mode.timeLimit);
    setIsGameActive(true);
    setGameCompleted(false);
    setScore(0);
    setStreak(0);
    setShowExplanation(false);
    
    // Award achievement for starting first game
    if (gameStats.totalGames === 0) {
      addAchievement({
        id: 'first-assessment',
        title: 'Assessment Rookie',
        description: 'Started your first skill assessment',
        icon: '🎯',
        rarity: 'common'
      });
    }
  };

  const submitAnswer = (answer: string | number | boolean) => {
    const currentQuestion = gameQuestions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    setUserAnswers(prev => [...prev, answer]);
    
    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      addXP(currentQuestion.points);
    } else {
      setStreak(0);
    }
    
    setShowExplanation(true);
    
    // Auto-advance after showing explanation
    setTimeout(() => {
      setShowExplanation(false);
      if (currentQuestionIndex < gameQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        endGame();
      }
    }, 3000);
  };

  const endGame = () => {
    setIsGameActive(false);
    setGameCompleted(true);
    
    const correctCount = userAnswers.filter((answer, index) => 
      answer === gameQuestions[index]?.correctAnswer
    ).length;
    
    const accuracy = (correctCount / gameQuestions.length) * 100;
    
    // Update game stats
    setGameStats(prev => ({
      totalGames: prev.totalGames + 1,
      averageScore: Math.round((prev.averageScore * prev.totalGames + score) / (prev.totalGames + 1)),
      bestScore: Math.max(prev.bestScore, score),
      totalQuestions: prev.totalQuestions + gameQuestions.length,
      correctAnswers: prev.correctAnswers + correctCount
    }));
    
    // Complete challenge for leaderboard
    if (selectedMode) {
      completeChallenge(selectedMode.id, score, selectedMode.timeLimit - timeLeft);
    }
    
    // Award achievements based on performance
    if (accuracy === 100) {
      addAchievement({
        id: 'perfect-score',
        title: 'Perfect Score',
        description: 'Answered all questions correctly',
        icon: '💯',
        rarity: 'epic'
      });
    }
    
    if (maxStreak >= 5) {
      addAchievement({
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Achieved a 5+ answer streak',
        icon: '🔥',
        rarity: 'rare'
      });
    }
    
    if (score >= 500) {
      addAchievement({
        id: 'high-scorer',
        title: 'High Scorer',
        description: 'Scored 500+ points in a single game',
        icon: '🏆',
        rarity: 'epic'
      });
    }
  };

  const resetGame = () => {
    setSelectedMode(null);
    setCurrentQuestionIndex(0);
    setGameQuestions([]);
    setUserAnswers([]);
    setTimeLeft(0);
    setIsGameActive(false);
    setGameCompleted(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setShowExplanation(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const currentQuestion = gameQuestions[currentQuestionIndex];
  const progress = gameQuestions.length > 0 ? ((currentQuestionIndex + 1) / gameQuestions.length) * 100 : 0;

  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Brain className="text-purple-400" />
              Skill Assessment Games
              <Trophy className="text-yellow-400" />
            </h1>
            <p className="text-gray-300 text-lg">
              Test your JavaScript, React, and web development knowledge
            </p>
          </motion.div>

          {/* Game Modes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {GAME_MODES.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all cursor-pointer group"
                onClick={() => startGame(mode)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{mode.icon}</div>
                  <h3 className="text-white text-xl font-bold mb-2">{mode.name}</h3>
                  <p className="text-gray-300 mb-4">{mode.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-blue-400 font-medium">Time</div>
                      <div className="text-white">{formatTime(mode.timeLimit)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-medium">Questions</div>
                      <div className="text-white">{mode.questionCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-medium">Level</div>
                      <div className={getDifficultyColor(mode.difficulty)}>{mode.difficulty}</div>
                    </div>
                  </div>
                  
                  <button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all group-hover:scale-105">
                    Start Game
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Game Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="text-yellow-400" />
              Your Statistics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{gameStats.totalGames}</div>
                <div className="text-gray-300 text-sm">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{gameStats.averageScore}</div>
                <div className="text-gray-300 text-sm">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{gameStats.bestScore}</div>
                <div className="text-gray-300 text-sm">Best Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{gameStats.totalQuestions}</div>
                <div className="text-gray-300 text-sm">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">
                  {gameStats.totalQuestions > 0 ? Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100) : 0}%
                </div>
                <div className="text-gray-300 text-sm">Accuracy</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    const accuracy = (userAnswers.filter((answer, index) => 
      answer === gameQuestions[index]?.correctAnswer
    ).length / gameQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-4">Game Complete!</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">{score}</div>
                <div className="text-gray-300">Final Score</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{accuracy.toFixed(1)}%</div>
                <div className="text-gray-300">Accuracy</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{maxStreak}</div>
                <div className="text-gray-300">Best Streak</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">{formatTime(selectedMode.timeLimit - timeLeft)}</div>
                <div className="text-gray-300">Time Used</div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => startGame(selectedMode)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={resetGame}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Choose New Mode
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{selectedMode.name}</h1>
              <p className="text-gray-300">{selectedMode.description}</p>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-mono font-bold ${
                timeLeft < 30 ? 'text-red-400' : 'text-white'
              }`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-gray-400 text-sm">Time Left</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-white text-sm mb-2">
              <span>Question {currentQuestionIndex + 1} of {gameQuestions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          
          {/* Streak Counter */}
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-2 text-orange-400"
            >
              <Zap className="animate-pulse" />
              <span className="font-bold">Streak: {streak}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          {currentQuestion && !showExplanation && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    currentQuestion.category === 'JavaScript' ? 'bg-yellow-500/20 text-yellow-400' :
                    currentQuestion.category === 'React' ? 'bg-blue-500/20 text-blue-400' :
                    currentQuestion.category === 'CSS' ? 'bg-pink-500/20 text-pink-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {currentQuestion.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)} bg-white/10`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-gray-400 text-sm ml-auto">{currentQuestion.points} pts</span>
                </div>
                
                <h2 className="text-white text-xl font-medium mb-4">{currentQuestion.question}</h2>
                
                {currentQuestion.code && (
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                      <code>{currentQuestion.code}</code>
                    </pre>
                  </div>
                )}
              </div>
              
              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => submitAnswer(index)}
                    className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white border border-white/20 hover:border-white/40"
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
                
                {currentQuestion.type === 'true-false' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => submitAnswer(true)}
                      className="p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-white border border-green-500/40 hover:border-green-500/60"
                    >
                      True
                    </button>
                    <button
                      onClick={() => submitAnswer(false)}
                      className="p-4 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-white border border-red-500/40 hover:border-red-500/60"
                    >
                      False
                    </button>
                  </div>
                )}
                
                {currentQuestion.type === 'code-completion' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter your answer..."
                      className="w-full p-4 bg-gray-900 text-green-400 font-mono rounded-lg border border-white/20 focus:border-white/40 focus:outline-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          submitAnswer((e.target as HTMLInputElement).value.trim());
                        }
                      }}
                    />
                    <p className="text-gray-400 text-sm mt-2">Press Enter to submit</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Explanation */}
          {showExplanation && currentQuestion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`backdrop-blur-lg rounded-2xl p-6 border ${
                userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? (
                  <CheckCircle className="text-green-400" size={24} />
                ) : (
                  <XCircle className="text-red-400" size={24} />
                )}
                <h3 className={`text-xl font-bold ${
                  userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                </h3>
              </div>
              
              <p className="text-white mb-2">
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </p>
              
              {userAnswers[currentQuestionIndex] !== currentQuestion.correctAnswer && (
                <p className="text-gray-300">
                  <strong>Correct Answer:</strong> {currentQuestion.correctAnswer}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillAssessmentGames;