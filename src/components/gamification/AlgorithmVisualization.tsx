import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Zap, Trophy } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface ArrayElement {
  value: number;
  id: string;
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
  isFound?: boolean;
}

interface AlgorithmStep {
  array: ArrayElement[];
  description: string;
  comparisons: number;
  swaps: number;
}

const ALGORITHMS = {
  BUBBLE_SORT: 'Bubble Sort',
  QUICK_SORT: 'Quick Sort',
  MERGE_SORT: 'Merge Sort',
  BINARY_SEARCH: 'Binary Search',
  LINEAR_SEARCH: 'Linear Search'
};

const SPEEDS = {
  SLOW: 1000,
  MEDIUM: 500,
  FAST: 200,
  INSTANT: 50
};

export const AlgorithmVisualization: React.FC = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [algorithm, setAlgorithm] = useState(ALGORITHMS.BUBBLE_SORT);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(SPEEDS.MEDIUM);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [searchTarget, setSearchTarget] = useState<number>(0);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, timeComplexity: '' });
  const { addAchievement, addXP } = useGameStore();

  const generateRandomArray = useCallback((size: number = 10) => {
    const newArray: ArrayElement[] = [];
    for (let i = 0; i < size; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 100) + 1,
        id: `element-${i}`,
      });
    }
    setArray(newArray);
    setCurrentStep(0);
    setSteps([]);
    setStats({ comparisons: 0, swaps: 0, timeComplexity: '' });
  }, []);

  const bubbleSort = useCallback((arr: ArrayElement[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const workingArray = [...arr];
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < workingArray.length - 1; i++) {
      for (let j = 0; j < workingArray.length - i - 1; j++) {
        // Mark elements being compared
        const stepArray = workingArray.map((el, idx) => ({
          ...el,
          isComparing: idx === j || idx === j + 1,
          isSorted: idx >= workingArray.length - i
        }));
        
        comparisons++;
        steps.push({
          array: stepArray,
          description: `Comparing ${workingArray[j].value} and ${workingArray[j + 1].value}`,
          comparisons,
          swaps
        });

        if (workingArray[j].value > workingArray[j + 1].value) {
          // Swap elements
          [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];
          swaps++;
          
          const swapArray = workingArray.map((el, idx) => ({
            ...el,
            isSwapping: idx === j || idx === j + 1,
            isSorted: idx >= workingArray.length - i
          }));
          
          steps.push({
            array: swapArray,
            description: `Swapped ${workingArray[j + 1].value} and ${workingArray[j].value}`,
            comparisons,
            swaps
          });
        }
      }
    }

    // Mark all as sorted
    const finalArray = workingArray.map(el => ({ ...el, isSorted: true }));
    steps.push({
      array: finalArray,
      description: 'Array is now sorted!',
      comparisons,
      swaps
    });

    return steps;
  }, []);

  const binarySearch = useCallback((arr: ArrayElement[], target: number): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const sortedArray = [...arr].sort((a, b) => a.value - b.value);
    let left = 0;
    let right = sortedArray.length - 1;
    let comparisons = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      comparisons++;

      const stepArray = sortedArray.map((el, idx) => ({
        ...el,
        isComparing: idx === mid,
        isFound: false
      }));

      steps.push({
        array: stepArray,
        description: `Checking middle element: ${sortedArray[mid].value} (target: ${target})`,
        comparisons,
        swaps: 0
      });

      if (sortedArray[mid].value === target) {
        const foundArray = sortedArray.map((el, idx) => ({
          ...el,
          isFound: idx === mid
        }));
        steps.push({
          array: foundArray,
          description: `Found target ${target} at position ${mid}!`,
          comparisons,
          swaps: 0
        });
        break;
      } else if (sortedArray[mid].value < target) {
        left = mid + 1;
        steps.push({
          array: stepArray,
          description: `${sortedArray[mid].value} < ${target}, searching right half`,
          comparisons,
          swaps: 0
        });
      } else {
        right = mid - 1;
        steps.push({
          array: stepArray,
          description: `${sortedArray[mid].value} > ${target}, searching left half`,
          comparisons,
          swaps: 0
        });
      }
    }

    if (left > right) {
      steps.push({
        array: sortedArray,
        description: `Target ${target} not found in array`,
        comparisons,
        swaps: 0
      });
    }

    return steps;
  }, []);

  const runAlgorithm = useCallback(() => {
    let algorithmSteps: AlgorithmStep[] = [];
    let timeComplexity = '';

    switch (algorithm) {
      case ALGORITHMS.BUBBLE_SORT:
        algorithmSteps = bubbleSort(array);
        timeComplexity = 'O(n²)';
        break;
      case ALGORITHMS.BINARY_SEARCH:
        algorithmSteps = binarySearch(array, searchTarget);
        timeComplexity = 'O(log n)';
        break;
      default:
        return;
    }

    setSteps(algorithmSteps);
    setStats(prev => ({ ...prev, timeComplexity }));
    setCurrentStep(0);
    setIsPlaying(true);

    // Award achievement for first algorithm run
    addAchievement({
      id: 'first-algorithm',
      title: 'Algorithm Explorer',
      description: 'Ran your first algorithm visualization',
      icon: '🔬',
      rarity: 'common'
    });
    addXP(50);
  }, [algorithm, array, searchTarget, bubbleSort, binarySearch, addAchievement, addXP]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        if (currentStep === steps.length - 1) {
          setIsPlaying(false);
          // Award completion achievement
          addAchievement({
            id: 'algorithm-master',
            title: 'Algorithm Master',
            description: 'Completed an algorithm visualization',
            icon: '🏆',
            rarity: 'rare'
          });
          addXP(100);
        }
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, steps.length, speed, addAchievement, addXP]);

  useEffect(() => {
    generateRandomArray();
  }, [generateRandomArray]);

  const currentArray = steps[currentStep]?.array || array;
  const currentDescription = steps[currentStep]?.description || 'Ready to start';
  const currentStats = steps[currentStep] || stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Zap className="text-yellow-400" />
            Algorithm Visualization Playground
            <Trophy className="text-yellow-400" />
          </h1>
          <p className="text-gray-300 text-lg">
            Interactive demonstrations of sorting and searching algorithms
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white"
                disabled={isPlaying}
              >
                {Object.values(ALGORITHMS).map(alg => (
                  <option key={alg} value={alg} className="bg-gray-800">
                    {alg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Speed
              </label>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white"
              >
                <option value={SPEEDS.SLOW} className="bg-gray-800">Slow</option>
                <option value={SPEEDS.MEDIUM} className="bg-gray-800">Medium</option>
                <option value={SPEEDS.FAST} className="bg-gray-800">Fast</option>
                <option value={SPEEDS.INSTANT} className="bg-gray-800">Instant</option>
              </select>
            </div>

            {algorithm.includes('Search') && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Search Target
                </label>
                <input
                  type="number"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(Number(e.target.value))}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white"
                  min="1"
                  max="100"
                  disabled={isPlaying}
                />
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Array Size
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={array.length}
                onChange={(e) => generateRandomArray(Number(e.target.value))}
                className="w-full"
                disabled={isPlaying}
              />
              <span className="text-white text-sm">{array.length} elements</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={runAlgorithm}
              disabled={isPlaying}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Play size={20} />
              Start
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={steps.length === 0}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Pause' : 'Resume'}
            </button>

            <button
              onClick={() => generateRandomArray(array.length)}
              disabled={isPlaying}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </motion.div>

        {/* Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="mb-6">
            <h3 className="text-white text-lg font-medium mb-2">Current Step:</h3>
            <p className="text-gray-300">{currentDescription}</p>
          </div>

          <div className="flex flex-wrap justify-center items-end gap-2 min-h-[300px] mb-6">
            <AnimatePresence>
              {currentArray.map((element, index) => (
                <motion.div
                  key={element.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    backgroundColor: element.isFound
                      ? '#10B981'
                      : element.isSorted
                      ? '#8B5CF6'
                      : element.isSwapping
                      ? '#F59E0B'
                      : element.isComparing
                      ? '#EF4444'
                      : '#6B7280',
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="w-12 rounded-t-lg flex items-end justify-center text-white font-bold text-sm border-2 border-white/30"
                    style={{ height: `${element.value * 2 + 20}px` }}
                  >
                    {element.value}
                  </div>
                  <div className="text-white text-xs mt-1">{index}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          {steps.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-white text-sm mb-2">
                <span>Progress</span>
                <span>{currentStep} / {steps.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-lg font-medium mb-2">Comparisons</h3>
            <p className="text-3xl font-bold text-blue-400">{currentStats.comparisons}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-lg font-medium mb-2">Swaps</h3>
            <p className="text-3xl font-bold text-green-400">{currentStats.swaps}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-lg font-medium mb-2">Time Complexity</h3>
            <p className="text-3xl font-bold text-purple-400">{stats.timeComplexity}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlgorithmVisualization;