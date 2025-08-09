import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, TrendingUp, Code, Lightbulb, Target } from 'lucide-react';

interface TechnicalChallengeProps {
  projectId: string;
  challenge: {
    problem: string;
    solution: string;
    impact: string;
    technologies: string[];
    metrics?: {
      before: string;
      after: string;
      improvement: string;
    };
    codeExample?: {
      title: string;
      code: string;
      language: string;
    };
  };
  className?: string;
}

const TechnicalChallenge: React.FC<TechnicalChallengeProps> = ({
  projectId,
  challenge,
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className={`technical-challenge-container ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="article"
      aria-labelledby={`challenge-title-${projectId}`}
    >
      <div className="glass-panel p-8 rounded-2xl border border-white/20 backdrop-blur-lg bg-white/5">
        <motion.h3
          id={`challenge-title-${projectId}`}
          className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
          variants={itemVariants}
        >
          <Code className="w-6 h-6 text-hunter-green-primary" />
          Technical Challenge
        </motion.h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem Section */}
          <motion.div
            className="challenge-section"
            variants={itemVariants}
            whileHover={cardVariants.hover}
          >
            <div className="glass-card p-6 rounded-xl bg-red-500/10 border border-red-500/20 h-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h4 className="text-lg font-semibold text-red-300">Problem</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {challenge.problem}
              </p>
            </div>
          </motion.div>

          {/* Solution Section */}
          <motion.div
            className="challenge-section"
            variants={itemVariants}
            whileHover={cardVariants.hover}
          >
            <div className="glass-card p-6 rounded-xl bg-blue-500/10 border border-blue-500/20 h-full">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <h4 className="text-lg font-semibold text-blue-300">Solution</h4>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                {challenge.solution}
              </p>
              <div className="flex flex-wrap gap-2">
                {challenge.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Impact Section */}
          <motion.div
            className="challenge-section"
            variants={itemVariants}
            whileHover={cardVariants.hover}
          >
            <div className="glass-card p-6 rounded-xl bg-green-500/10 border border-green-500/20 h-full">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-green-400" />
                <h4 className="text-lg font-semibold text-green-300">Impact</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {challenge.impact}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Metrics Section */}
        {challenge.metrics && (
          <motion.div
            className="metrics-section mt-8"
            variants={itemVariants}
          >
            <div className="glass-card p-6 rounded-xl bg-hunter-green-primary/10 border border-hunter-green-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-hunter-green-primary" />
                <h4 className="text-lg font-semibold text-hunter-green-primary">Performance Metrics</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="metric-item text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {challenge.metrics.before}
                  </div>
                  <div className="text-sm text-gray-400">Before</div>
                </div>
                <div className="metric-item text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {challenge.metrics.after}
                  </div>
                  <div className="text-sm text-gray-400">After</div>
                </div>
                <div className="metric-item text-center">
                  <div className="text-2xl font-bold text-hunter-green-primary mb-1">
                    {challenge.metrics.improvement}
                  </div>
                  <div className="text-sm text-gray-400">Improvement</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Code Example Section */}
        {challenge.codeExample && (
          <motion.div
            className="code-example-section mt-8"
            variants={itemVariants}
          >
            <div className="glass-card p-6 rounded-xl bg-charcoal-primary/20 border border-charcoal-primary/30">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-metallic-gold" />
                <h4 className="text-lg font-semibold text-metallic-gold">
                  {challenge.codeExample.title}
                </h4>
              </div>
              <div className="relative">
                <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto border border-gray-700/50">
                  <code className={`language-${challenge.codeExample.language} text-sm text-gray-300`}>
                    {challenge.codeExample.code}
                  </code>
                </pre>
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 text-xs bg-gray-700/80 text-gray-300 rounded">
                    {challenge.codeExample.language}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TechnicalChallenge;

// Example usage data structure for reference:
/*
const calculatorChallenge = {
  problem: "Users needed a calculator that could handle complex scientific operations while maintaining an intuitive interface. Standard calculators lacked visual feedback and error handling.",
  solution: "Implemented a state machine architecture with React hooks for calculation logic, added explosion animations for visual feedback, and created comprehensive error handling with user-friendly messages.",
  impact: "Achieved 99.9% calculation accuracy, reduced user errors by 75%, and increased user engagement through interactive animations. The calculator now handles edge cases gracefully and provides clear feedback.",
  technologies: ["React", "TypeScript", "Framer Motion", "State Machines", "CSS Animations"],
  metrics: {
    before: "Basic calculator",
    after: "Scientific calculator",
    improvement: "300% more features"
  },
  codeExample: {
    title: "State Machine Implementation",
    code: `const useCalculator = () => {
  const [state, setState] = useState({
    display: '0',
    operation: null,
    waitingForOperand: false
  });
  
  const calculate = (firstOperand, secondOperand, operation) => {
    switch (operation) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '*': return firstOperand * secondOperand;
      case '/': return firstOperand / secondOperand;
      default: return secondOperand;
    }
  };
  
  return { state, calculate };
};`,
    language: "typescript"
  }
};
*/