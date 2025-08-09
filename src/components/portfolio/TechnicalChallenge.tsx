import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Lightbulb, Target, Code } from 'lucide-react';
import { ArchitectureDiagram } from '../../data/architectureDiagrams';

interface TechnicalChallengeProps {
  architecture: ArchitectureDiagram;
  className?: string;
}

export const TechnicalChallenge: React.FC<TechnicalChallengeProps> = ({
  architecture,
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
      aria-labelledby={`challenge-title-${architecture.id}`}
    >
      <div className="glass-panel p-8 rounded-2xl border border-white/20 backdrop-blur-lg bg-white/5">
        <motion.h3
          id={`challenge-title-${architecture.id}`}
          className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
          variants={itemVariants}
        >
          <Code className="w-6 h-6 text-hunter-green-primary" />
          Technical Challenge
        </motion.h3>

        {/* Technical Challenges */}
        <div className="space-y-6">
          {architecture.technicalChallenges.map((challenge, index) => (
            <motion.div
              key={index}
              className="challenge-item"
              variants={itemVariants}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Problem Section */}
                <motion.div
                  className="challenge-section"
                  whileHover={cardVariants.hover}
                >
                  <div className="glass-card p-6 rounded-xl bg-red-500/10 border border-red-500/20 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <h4 className="text-lg font-semibold text-red-300">Challenge</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {challenge.challenge}
                    </p>
                  </div>
                </motion.div>

                {/* Solution Section */}
                <motion.div
                  className="challenge-section"
                  whileHover={cardVariants.hover}
                >
                  <div className="glass-card p-6 rounded-xl bg-blue-500/10 border border-blue-500/20 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="w-5 h-5 text-blue-400" />
                      <h4 className="text-lg font-semibold text-blue-300">Solution</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                       {challenge.solution}
                     </p>
                  </div>
                </motion.div>

                {/* Impact Section */}
                <motion.div
                  className="challenge-section"
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
            </motion.div>
          ))}
        </div>


      </div>
    </motion.div>
  );
};

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