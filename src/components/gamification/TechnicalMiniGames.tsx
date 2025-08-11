import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Trophy, Clock, Target, Zap, Brain, Code, Layers } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface GameState {
  isPlaying: boolean;
  score: number;
  timeLeft: number;
  level: number;
  gameOver: boolean;
}

interface MiniGame {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'data-structures' | 'algorithms' | 'design-patterns';
  difficulty: 'easy' | 'medium' | 'hard';
  component: React.ComponentType<{ onGameEnd: (score: number) => void }>;
}

// Stack Game - Demonstrates Stack Data Structure
const StackGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
  const [stack, setStack] = useState<number[]>([]);
  const [targetSequence, setTargetSequence] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [message, setMessage] = useState('');

  const generateTarget = useCallback(() => {
    const sequence = [];
    for (let i = 0; i < 5; i++) {
      sequence.push(Math.floor(Math.random() * 10) + 1);
    }
    setTargetSequence(sequence);
  }, []);

  useEffect(() => {
    generateTarget();
  }, [generateTarget]);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
      onGameEnd(score);
    }
  }, [timeLeft, gameActive, score, onGameEnd]);

  const push = () => {
    if (!gameActive) {
      setGameActive(true);
    }
    setStack([...stack, currentNumber]);
    setCurrentNumber(currentNumber + 1);
  };

  const pop = () => {
    if (stack.length === 0) return;
    
    const poppedValue = stack[stack.length - 1];
    const newStack = stack.slice(0, -1);
    setStack(newStack);
    
    // Check if popped value matches target sequence
    if (poppedValue === targetSequence[0]) {
      const newTarget = targetSequence.slice(1);
      setTargetSequence(newTarget);
      setScore(score + 10);
      setMessage('✅ Correct!');
      
      if (newTarget.length === 0) {
        generateTarget();
        setScore(score + 50); // Bonus for completing sequence
        setMessage('🎉 Sequence completed! +50 bonus');
      }
    } else {
      setMessage('❌ Wrong order!');
    }
    
    setTimeout(() => setMessage(''), 1500);
  };

  const reset = () => {
    setStack([]);
    setCurrentNumber(1);
    setScore(0);
    setTimeLeft(60);
    setGameActive(false);
    generateTarget();
    setMessage('');
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-xl font-bold">Stack Master</h3>
        <div className="flex gap-4 text-sm">
          <span className="text-blue-400">Score: {score}</span>
          <span className="text-yellow-400">Time: {timeLeft}s</span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-300 text-sm mb-2">Target sequence to pop:</p>
        <div className="flex gap-2">
          {targetSequence.map((num, index) => (
            <div key={index} className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold">
              {num}
            </div>
          ))}
        </div>
      </div>
      
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white font-medium mb-4"
        >
          {message}
        </motion.div>
      )}
      
      <div className="mb-4">
        <p className="text-gray-300 text-sm mb-2">Stack (LIFO):</p>
        <div className="min-h-[100px] bg-gray-800 rounded-lg p-2 flex flex-col-reverse items-center justify-start gap-1">
          <AnimatePresence>
            {stack.map((num, index) => (
              <motion.div
                key={`${num}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold"
              >
                {num}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={push}
          disabled={timeLeft === 0}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Push {currentNumber}
        </button>
        <button
          onClick={pop}
          disabled={stack.length === 0 || timeLeft === 0}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Pop
        </button>
        <button
          onClick={reset}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};

// Binary Search Game - Demonstrates Binary Search Algorithm
const BinarySearchGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [target, setTarget] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [mid, setMid] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [found, setFound] = useState(false);
  const [message, setMessage] = useState('');
  const [round, setRound] = useState(1);

  const generateNewRound = useCallback(() => {
    const size = 15 + round * 5; // Increase difficulty
    const arr = Array.from({ length: size }, (_, i) => (i + 1) * 2);
    const targetIndex = Math.floor(Math.random() * arr.length);
    const targetValue = arr[targetIndex];
    
    setNumbers(arr);
    setTarget(targetValue);
    setLeft(0);
    setRight(arr.length - 1);
    setMid(Math.floor((0 + arr.length - 1) / 2));
    setAttempts(0);
    setMaxAttempts(Math.ceil(Math.log2(arr.length)) + 2);
    setFound(false);
    setGameActive(true);
    setMessage(`Round ${round}: Find ${targetValue} in ${maxAttempts} attempts or less!`);
  }, [round, maxAttempts]);

  useEffect(() => {
    generateNewRound();
  }, [generateNewRound]);

  const makeGuess = (direction: 'lower' | 'higher' | 'found') => {
    if (!gameActive || found) return;
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (direction === 'found') {
      if (numbers[mid] === target) {
        setFound(true);
        const points = Math.max(50 - (newAttempts - 1) * 5, 10);
        setScore(score + points);
        setMessage(`🎉 Found it! +${points} points`);
        
        setTimeout(() => {
          setRound(round + 1);
          generateNewRound();
        }, 2000);
      } else {
        setMessage('❌ That\'s not the target!');
      }
    } else {
      let newLeft = left;
      let newRight = right;
      
      if (direction === 'lower') {
        newRight = mid - 1;
      } else {
        newLeft = mid + 1;
      }
      
      if (newLeft > newRight) {
        setGameActive(false);
        setMessage('❌ Search space exhausted!');
        setTimeout(() => onGameEnd(score), 2000);
        return;
      }
      
      const newMid = Math.floor((newLeft + newRight) / 2);
      setLeft(newLeft);
      setRight(newRight);
      setMid(newMid);
      
      if (newAttempts >= maxAttempts) {
        setGameActive(false);
        setMessage('❌ Too many attempts!');
        setTimeout(() => onGameEnd(score), 2000);
      }
    }
  };

  const reset = () => {
    setScore(0);
    setRound(1);
    generateNewRound();
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-xl font-bold">Binary Search Master</h3>
        <div className="flex gap-4 text-sm">
          <span className="text-blue-400">Score: {score}</span>
          <span className="text-yellow-400">Round: {round}</span>
          <span className="text-red-400">Attempts: {attempts}/{maxAttempts}</span>
        </div>
      </div>
      
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white font-medium mb-4 p-2 bg-blue-500/20 rounded-lg"
        >
          {message}
        </motion.div>
      )}
      
      <div className="mb-4">
        <p className="text-gray-300 text-sm mb-2">Sorted Array:</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {numbers.map((num, index) => {
            let bgColor = 'bg-gray-600';
            if (index >= left && index <= right) bgColor = 'bg-blue-500/50';
            if (index === mid) bgColor = 'bg-yellow-500';
            
            return (
              <div
                key={index}
                className={`w-8 h-8 ${bgColor} rounded flex items-center justify-center text-white text-xs font-bold`}
              >
                {num}
              </div>
            );
          })}
        </div>
        
        <div className="text-center mb-4">
          <p className="text-white">Current middle element: <span className="font-bold text-yellow-400">{numbers[mid]}</span></p>
          <p className="text-gray-300 text-sm">Target: <span className="font-bold text-green-400">{target}</span></p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => makeGuess('lower')}
          disabled={!gameActive || found}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Target is Lower
        </button>
        <button
          onClick={() => makeGuess('found')}
          disabled={!gameActive || found}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Found It!
        </button>
        <button
          onClick={() => makeGuess('higher')}
          disabled={!gameActive || found}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Target is Higher
        </button>
        <button
          onClick={reset}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};

// Observer Pattern Game - Demonstrates Observer Design Pattern
const ObserverPatternGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
  const [publishers, setPublishers] = useState<{ id: string; name: string; active: boolean }[]>([]);
  const [subscribers, setSubscribers] = useState<{ id: string; name: string; subscribedTo: string[]; notifications: string[] }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameActive, setGameActive] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [taskQueue, setTaskQueue] = useState<string[]>([]);

  const initializeGame = useCallback(() => {
    const newPublishers = [
      { id: 'news', name: 'News Feed', active: false },
      { id: 'weather', name: 'Weather Service', active: false },
      { id: 'stocks', name: 'Stock Market', active: false },
      { id: 'social', name: 'Social Media', active: false }
    ];
    
    const newSubscribers = [
      { id: 'user1', name: 'Mobile App', subscribedTo: [], notifications: [] },
      { id: 'user2', name: 'Web Dashboard', subscribedTo: [], notifications: [] },
      { id: 'user3', name: 'Email Service', subscribedTo: [], notifications: [] },
      { id: 'user4', name: 'SMS Service', subscribedTo: [], notifications: [] }
    ];
    
    setPublishers(newPublishers);
    setSubscribers(newSubscribers);
    
    const tasks = [
      'Subscribe Mobile App to News Feed',
      'Subscribe Web Dashboard to Weather Service',
      'Publish news update',
      'Subscribe Email Service to Stock Market',
      'Publish weather alert',
      'Subscribe SMS Service to Social Media',
      'Publish stock update'
    ];
    
    setTaskQueue(tasks);
    setCurrentTask(tasks[0]);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
      onGameEnd(score);
    }
  }, [timeLeft, gameActive, score, onGameEnd]);

  const subscribe = (subscriberId: string, publisherId: string) => {
    if (!gameActive) setGameActive(true);
    
    setSubscribers(prev => prev.map(sub => {
      if (sub.id === subscriberId) {
        const newSubscribedTo = [...sub.subscribedTo, publisherId];
        return { ...sub, subscribedTo: newSubscribedTo };
      }
      return sub;
    }));
    
    // Check if this completes the current task
    const subscriber = subscribers.find(s => s.id === subscriberId);
    const publisher = publishers.find(p => p.id === publisherId);
    
    if (subscriber && publisher && currentTask.includes(subscriber.name) && currentTask.includes(publisher.name)) {
      setScore(score + 20);
      completeTask();
    }
  };

  const publish = (publisherId: string) => {
    if (!gameActive) setGameActive(true);
    
    const publisher = publishers.find(p => p.id === publisherId);
    if (!publisher) return;
    
    // Notify all subscribers
    const notification = `${publisher.name} update`;
    setSubscribers(prev => prev.map(sub => {
      if (sub.subscribedTo.includes(publisherId)) {
        return { ...sub, notifications: [...sub.notifications.slice(-2), notification] };
      }
      return sub;
    }));
    
    // Check if this completes the current task
    if (currentTask.includes('Publish') && currentTask.toLowerCase().includes(publisher.name.toLowerCase().split(' ')[0])) {
      setScore(score + 30);
      completeTask();
    }
  };

  const completeTask = () => {
    const newTaskQueue = taskQueue.slice(1);
    setTaskQueue(newTaskQueue);
    
    if (newTaskQueue.length > 0) {
      setCurrentTask(newTaskQueue[0]);
    } else {
      setGameActive(false);
      setScore(score + 100); // Bonus for completing all tasks
      setTimeout(() => onGameEnd(score + 100), 1000);
    }
  };

  const reset = () => {
    setScore(0);
    setTimeLeft(90);
    setGameActive(false);
    initializeGame();
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-xl font-bold">Observer Pattern</h3>
        <div className="flex gap-4 text-sm">
          <span className="text-blue-400">Score: {score}</span>
          <span className="text-yellow-400">Time: {timeLeft}s</span>
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-blue-500/20 rounded-lg">
        <p className="text-white font-medium">Current Task:</p>
        <p className="text-blue-300">{currentTask}</p>
        <p className="text-gray-400 text-sm mt-1">Tasks remaining: {taskQueue.length}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Publishers */}
        <div>
          <h4 className="text-white font-medium mb-2">Publishers (Subjects)</h4>
          <div className="space-y-2">
            {publishers.map(publisher => (
              <div key={publisher.id} className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{publisher.name}</span>
                  <button
                    onClick={() => publish(publisher.id)}
                    disabled={timeLeft === 0}
                    className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Publish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Subscribers */}
        <div>
          <h4 className="text-white font-medium mb-2">Subscribers (Observers)</h4>
          <div className="space-y-2">
            {subscribers.map(subscriber => (
              <div key={subscriber.id} className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
                <div className="mb-2">
                  <span className="text-white font-medium">{subscriber.name}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    Subscribed to: {subscriber.subscribedTo.length > 0 ? subscriber.subscribedTo.join(', ') : 'None'}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {publishers.map(publisher => (
                    <button
                      key={publisher.id}
                      onClick={() => subscribe(subscriber.id, publisher.id)}
                      disabled={subscriber.subscribedTo.includes(publisher.id) || timeLeft === 0}
                      className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-2 py-1 rounded text-xs transition-colors"
                    >
                      Sub to {publisher.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
                
                {subscriber.notifications.length > 0 && (
                  <div className="text-xs">
                    <div className="text-gray-400">Recent notifications:</div>
                    {subscriber.notifications.slice(-2).map((notif, index) => (
                      <div key={index} className="text-green-300">• {notif}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button
        onClick={reset}
        className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
      >
        Reset Game
      </button>
    </div>
  );
};

const MINI_GAMES: MiniGame[] = [
  {
    id: 'stack-game',
    title: 'Stack Master',
    description: 'Learn LIFO (Last In, First Out) principle with an interactive stack game',
    icon: <Layers className="w-6 h-6" />,
    category: 'data-structures',
    difficulty: 'easy',
    component: StackGame
  },
  {
    id: 'binary-search',
    title: 'Binary Search Master',
    description: 'Master the binary search algorithm with this interactive game',
    icon: <Target className="w-6 h-6" />,
    category: 'algorithms',
    difficulty: 'medium',
    component: BinarySearchGame
  },
  {
    id: 'observer-pattern',
    title: 'Observer Pattern',
    description: 'Understand the Observer design pattern through publisher-subscriber interactions',
    icon: <Brain className="w-6 h-6" />,
    category: 'design-patterns',
    difficulty: 'hard',
    component: ObserverPatternGame
  }
];

const CATEGORY_CONFIG = {
  'data-structures': {
    name: 'Data Structures',
    color: 'from-blue-500 to-cyan-500',
    icon: <Layers className="w-5 h-5" />
  },
  'algorithms': {
    name: 'Algorithms',
    color: 'from-green-500 to-emerald-500',
    icon: <Zap className="w-5 h-5" />
  },
  'design-patterns': {
    name: 'Design Patterns',
    color: 'from-purple-500 to-pink-500',
    icon: <Brain className="w-5 h-5" />
  }
};

const DIFFICULTY_CONFIG = {
  easy: { color: 'text-green-400', label: 'Easy' },
  medium: { color: 'text-yellow-400', label: 'Medium' },
  hard: { color: 'text-red-400', label: 'Hard' }
};

export const TechnicalMiniGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [gameScores, setGameScores] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  
  const { addXP, unlockAchievement } = useGameStore();

  const filteredGames = MINI_GAMES.filter(game => 
    selectedCategory === 'all' || game.category === selectedCategory
  );

  const handleGameEnd = (score: number) => {
    if (!selectedGame) return;
    
    setLastScore(score);
    setGameScores(prev => ({
      ...prev,
      [selectedGame.id]: Math.max(prev[selectedGame.id] || 0, score)
    }));
    
    // Award XP based on score and difficulty
    const baseXP = score;
    const difficultyMultiplier = selectedGame.difficulty === 'hard' ? 2 : selectedGame.difficulty === 'medium' ? 1.5 : 1;
    const totalXP = Math.floor(baseXP * difficultyMultiplier);
    
    addXP(totalXP, `Completed ${selectedGame.title}`);
    
    // Check for achievements
    if (score > 100) {
      unlockAchievement('mini-game-master');
    }
    
    if (score > 200) {
      unlockAchievement('technical-expert');
    }
    
    setShowResults(true);
  };

  const closeResults = () => {
    setShowResults(false);
    setSelectedGame(null);
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
            <Code className="text-blue-400" />
            Technical Mini Games
            <Trophy className="text-yellow-400" />
          </h1>
          <p className="text-gray-300 text-lg">
            Learn computer science concepts through interactive games
          </p>
        </motion.div>

        {!selectedGame ? (
          <>
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    All Games
                  </button>
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        selectedCategory === key ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {config.icon}
                      {config.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Games Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredGames.map((game, index) => {
                const category = CATEGORY_CONFIG[game.category];
                const difficulty = DIFFICULTY_CONFIG[game.difficulty];
                const highScore = gameScores[game.id] || 0;
                
                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedGame(game)}
                  >
                    <div className="text-center mb-4">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${category.color} mb-4`}>
                        {game.icon}
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">{game.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{game.description}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className={`font-medium ${difficulty.color}`}>
                          {difficulty.label}
                        </span>
                        <span className="text-blue-400">
                          {category.name}
                        </span>
                      </div>
                      
                      {highScore > 0 && (
                        <div className="mt-3 p-2 bg-yellow-500/20 rounded-lg">
                          <span className="text-yellow-400 font-medium">High Score: {highScore}</span>
                        </div>
                      )}
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                      <Play size={16} />
                      Play Game
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        ) : (
          /* Game View */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                >
                  ←
                </button>
                <div>
                  <h2 className="text-white text-2xl font-bold">{selectedGame.title}</h2>
                  <p className="text-gray-300">{selectedGame.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-medium ${DIFFICULTY_CONFIG[selectedGame.difficulty].color}`}>
                  {DIFFICULTY_CONFIG[selectedGame.difficulty].label}
                </div>
                <div className="text-blue-400 text-sm">
                  {CATEGORY_CONFIG[selectedGame.category].name}
                </div>
              </div>
            </div>
            
            <selectedGame.component onGameEnd={handleGameEnd} />
          </motion.div>
        )}

        {/* Results Modal */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={closeResults}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <Trophy className="text-yellow-400 mx-auto mb-4" size={48} />
                  <h2 className="text-white text-2xl font-bold mb-2">Game Complete!</h2>
                  <p className="text-gray-300 mb-4">You scored {lastScore} points</p>
                  
                  {selectedGame && (
                    <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
                      <h3 className="text-white font-medium mb-2">{selectedGame.title}</h3>
                      <div className="text-sm text-gray-300">
                        <p>Difficulty: <span className={DIFFICULTY_CONFIG[selectedGame.difficulty].color}>{DIFFICULTY_CONFIG[selectedGame.difficulty].label}</span></p>
                        <p>Category: <span className="text-blue-400">{CATEGORY_CONFIG[selectedGame.category].name}</span></p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowResults(false);
                        // Restart the same game
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={closeResults}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Back to Games
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TechnicalMiniGames;