import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Check, X, Trophy, Brain, Code, Lightbulb } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface TestCase {
  input: any;
  expectedOutput: any;
  description: string;
}

interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  testCases: TestCase[];
  starterCode: string;
  hints: string[];
  timeLimit: number; // in minutes
  category: string;
}

const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        expectedOutput: [0, 1],
        description: 'Basic case'
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        expectedOutput: [1, 2],
        description: 'Different indices'
      },
      {
        input: { nums: [3, 3], target: 6 },
        expectedOutput: [0, 1],
        description: 'Duplicate numbers'
      }
    ],
    starterCode: `function twoSum(nums, target) {
    // Your code here
    
}`,
    hints: [
      'Try using a hash map to store numbers you\'ve seen',
      'For each number, check if target - number exists in the map',
      'Remember to return the indices, not the values'
    ],
    timeLimit: 15,
    category: 'Array'
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character.'
    ],
    testCases: [
      {
        input: { s: ['h', 'e', 'l', 'l', 'o'] },
        expectedOutput: ['o', 'l', 'l', 'e', 'h'],
        description: 'Basic string'
      },
      {
        input: { s: ['H', 'a', 'n', 'n', 'a', 'h'] },
        expectedOutput: ['h', 'a', 'n', 'n', 'a', 'H'],
        description: 'Palindrome-like string'
      }
    ],
    starterCode: `function reverseString(s) {
    // Your code here
    // Modify s in-place
}`,
    hints: [
      'Use two pointers approach',
      'Swap characters from start and end',
      'Move pointers towards center'
    ],
    timeLimit: 10,
    category: 'String'
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}".'
    ],
    testCases: [
      {
        input: { s: '()' },
        expectedOutput: true,
        description: 'Simple valid case'
      },
      {
        input: { s: '()[]{}' },
        expectedOutput: true,
        description: 'Multiple valid pairs'
      },
      {
        input: { s: '(]' },
        expectedOutput: false,
        description: 'Invalid pair'
      },
      {
        input: { s: '([)]' },
        expectedOutput: false,
        description: 'Incorrect nesting'
      }
    ],
    starterCode: `function isValid(s) {
    // Your code here
    
}`,
    hints: [
      'Use a stack data structure',
      'Push opening brackets, pop when you see closing brackets',
      'Check if the popped bracket matches the current closing bracket'
    ],
    timeLimit: 20,
    category: 'Stack'
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    description: 'The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1.',
    examples: [
      {
        input: 'n = 2',
        output: '1',
        explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.'
      },
      {
        input: 'n = 3',
        output: '2',
        explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.'
      },
      {
        input: 'n = 4',
        output: '3',
        explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.'
      }
    ],
    constraints: [
      '0 <= n <= 30'
    ],
    testCases: [
      {
        input: { n: 0 },
        expectedOutput: 0,
        description: 'Base case 0'
      },
      {
        input: { n: 1 },
        expectedOutput: 1,
        description: 'Base case 1'
      },
      {
        input: { n: 5 },
        expectedOutput: 5,
        description: 'Regular case'
      },
      {
        input: { n: 10 },
        expectedOutput: 55,
        description: 'Larger case'
      }
    ],
    starterCode: `function fib(n) {
    // Your code here
    
}`,
    hints: [
      'Consider both recursive and iterative approaches',
      'Base cases: F(0) = 0, F(1) = 1',
      'For efficiency, try dynamic programming or memoization'
    ],
    timeLimit: 15,
    category: 'Dynamic Programming'
  }
];

export const TechnicalInterviewSim: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem>(CODING_PROBLEMS[0]);
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, error?: string}>>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    problemsSolved: 0,
    totalTime: 0,
    averageTime: 0
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const { addAchievement, addXP, completeChallenge } = useGameStore();

  useEffect(() => {
    setCode(selectedProblem.starterCode);
    setTestResults([]);
    setShowHints(false);
    setCurrentHint(0);
    resetTimer();
  }, [selectedProblem]);

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      alert('Time\'s up! The interview session has ended.');
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTimerActive, timeLeft]);

  const startTimer = () => {
    setTimeLeft(selectedProblem.timeLimit * 60);
    setIsTimerActive(true);
    startTimeRef.current = Date.now();
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(selectedProblem.timeLimit * 60);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    const results: Array<{passed: boolean, error?: string}> = [];

    try {
      // Create a function from the user's code
      const userFunction = new Function('return ' + code)();
      
      for (const testCase of selectedProblem.testCases) {
        try {
          let result;
          
          // Handle different function signatures
          if (selectedProblem.id === 'two-sum') {
            result = userFunction(testCase.input.nums, testCase.input.target);
          } else if (selectedProblem.id === 'reverse-string') {
            const inputCopy = [...testCase.input.s];
            userFunction(inputCopy);
            result = inputCopy;
          } else if (selectedProblem.id === 'valid-parentheses') {
            result = userFunction(testCase.input.s);
          } else if (selectedProblem.id === 'fibonacci') {
            result = userFunction(testCase.input.n);
          }
          
          const passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);
          results.push({ passed });
        } catch (error) {
          results.push({ passed: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }
    } catch (error) {
      // Syntax error in user code
      selectedProblem.testCases.forEach(() => {
        results.push({ passed: false, error: 'Syntax error in code' });
      });
    }

    setTestResults(results);
    setIsRunning(false);

    // Check if all tests passed
    const allPassed = results.every(result => result.passed);
    if (allPassed) {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const score = Math.max(1000 - timeSpent, 100); // Higher score for faster completion
      
      // Update session stats
      setSessionStats(prev => ({
        problemsSolved: prev.problemsSolved + 1,
        totalTime: prev.totalTime + timeSpent,
        averageTime: Math.floor((prev.totalTime + timeSpent) / (prev.problemsSolved + 1))
      }));
      
      // Award achievements and XP
      completeChallenge(selectedProblem.id, score, timeSpent);
      
      const xpReward = {
        'Easy': 100,
        'Medium': 200,
        'Hard': 300
      }[selectedProblem.difficulty];
      
      addXP(xpReward);
      
      // First problem achievement
      if (sessionStats.problemsSolved === 0) {
        addAchievement({
          id: 'first-problem-solved',
          title: 'Problem Solver',
          description: 'Solved your first coding problem',
          icon: '🧩',
          rarity: 'common'
        });
      }
      
      // Speed achievements
      if (timeSpent < 60) {
        addAchievement({
          id: 'speed-demon',
          title: 'Speed Demon',
          description: 'Solved a problem in under 1 minute',
          icon: '⚡',
          rarity: 'rare'
        });
      }
      
      setIsTimerActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(result => result.passed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="text-purple-400" />
            Technical Interview Simulator
            <Trophy className="text-yellow-400" />
          </h1>
          <p className="text-gray-300 text-lg">
            Practice coding problems in a realistic interview environment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Problem Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <Code className="text-blue-400" />
              Problems
            </h2>
            
            <div className="space-y-3 mb-6">
              {CODING_PROBLEMS.map(problem => (
                <button
                  key={problem.id}
                  onClick={() => setSelectedProblem(problem)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedProblem.id === problem.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/20 text-gray-300 hover:bg-white/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{problem.title}</span>
                    <span className={`text-sm ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="text-sm opacity-75">{problem.category}</div>
                  <div className="text-xs opacity-60 mt-1">{problem.timeLimit} min</div>
                </button>
              ))}
            </div>

            {/* Session Stats */}
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Session Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Problems Solved:</span>
                  <span className="text-green-400">{sessionStats.problemsSolved}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Total Time:</span>
                  <span>{formatTime(sessionStats.totalTime)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Average Time:</span>
                  <span>{formatTime(sessionStats.averageTime)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Problem Details & Code Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Problem Description */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-white text-2xl font-bold mb-2">{selectedProblem.title}</h2>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProblem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      selectedProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedProblem.difficulty}
                    </span>
                    <span className="text-gray-400">{selectedProblem.category}</span>
                  </div>
                </div>
                
                {/* Timer */}
                <div className="text-center">
                  <div className={`text-2xl font-mono font-bold ${
                    timeLeft < 60 ? 'text-red-400' : 'text-white'
                  }`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={startTimer}
                      disabled={isTimerActive}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Play size={16} />
                      Start
                    </button>
                    <button
                      onClick={resetTimer}
                      className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Clock size={16} />
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{selectedProblem.description}</p>

              {/* Examples */}
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">Examples:</h3>
                {selectedProblem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-3 mb-2">
                    <div className="text-gray-300 text-sm">
                      <div><strong>Input:</strong> {example.input}</div>
                      <div><strong>Output:</strong> {example.output}</div>
                      {example.explanation && (
                        <div><strong>Explanation:</strong> {example.explanation}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div>
                <h3 className="text-white font-medium mb-2">Constraints:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  {selectedProblem.constraints.map((constraint, index) => (
                    <li key={index}>• {constraint}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <span className="text-white font-medium">Code Editor</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Lightbulb size={16} />
                    Hints
                  </button>
                  <button
                    onClick={runTests}
                    disabled={isRunning}
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Play size={16} />
                    {isRunning ? 'Running...' : 'Run Tests'}
                  </button>
                </div>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-4 bg-gray-900 text-green-400 font-mono text-sm resize-none focus:outline-none"
                placeholder="Write your solution here..."
                spellCheck={false}
              />
            </div>

            {/* Hints */}
            <AnimatePresence>
              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-yellow-500/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/20"
                >
                  <h3 className="text-yellow-400 font-medium mb-3 flex items-center gap-2">
                    <Lightbulb className="text-yellow-400" />
                    Hints
                  </h3>
                  <div className="space-y-2">
                    {selectedProblem.hints.slice(0, currentHint + 1).map((hint, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-gray-300 text-sm"
                      >
                        {index + 1}. {hint}
                      </motion.div>
                    ))}
                  </div>
                  {currentHint < selectedProblem.hints.length - 1 && (
                    <button
                      onClick={() => setCurrentHint(prev => prev + 1)}
                      className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Show Next Hint
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Test Results */}
            {testResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`backdrop-blur-lg rounded-2xl p-6 border ${
                  allTestsPassed 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-red-500/10 border-red-500/20'
                }`}
              >
                <h3 className={`font-medium mb-4 flex items-center gap-2 ${
                  allTestsPassed ? 'text-green-400' : 'text-red-400'
                }`}>
                  {allTestsPassed ? <Check /> : <X />}
                  Test Results ({testResults.filter(r => r.passed).length}/{testResults.length} passed)
                </h3>
                
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        result.passed ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}
                    >
                      {result.passed ? (
                        <Check className="text-green-400" size={20} />
                      ) : (
                        <X className="text-red-400" size={20} />
                      )}
                      <div>
                        <div className="text-white font-medium">
                          Test Case {index + 1}: {selectedProblem.testCases[index].description}
                        </div>
                        {result.error && (
                          <div className="text-red-300 text-sm mt-1">
                            Error: {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {allTestsPassed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 text-center"
                  >
                    <div className="text-green-400 text-xl font-bold mb-2">
                      🎉 Congratulations! All tests passed!
                    </div>
                    <div className="text-gray-300">
                      You've successfully solved this problem!
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalInterviewSim;