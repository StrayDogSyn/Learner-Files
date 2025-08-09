import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Code, Database, Brain, Settings, ExternalLink } from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';
import type { Skill, SkillCategory } from '../types/portfolio';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface InteractiveSkillsChartProps {
  className?: string;
  showProjects?: boolean;
  maxSkillsPerCategory?: number;
}

interface SkillProgressBarProps {
  skill: Skill;
  animated?: boolean;
  onClick?: (skill: Skill) => void;
  isSelected?: boolean;
}

const categoryIcons = {
  'Frontend': Code,
  'Backend': Database,
  'AI/ML': Brain,
  'DevOps': Settings,
  'Programming Languages': Code,
  'Database': Database,
  'Cloud': Cloud
};

const categoryColors = {
  'Frontend': {
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-700',
    progress: 'bg-blue-500'
  },
  'Backend': {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-200 dark:border-green-700',
    progress: 'bg-green-500'
  },
  'AI/ML': {
    bg: 'bg-purple-100 dark:bg-purple-900',
    text: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-200 dark:border-purple-700',
    progress: 'bg-purple-500'
  },
  'DevOps': {
    bg: 'bg-orange-100 dark:bg-orange-900',
    text: 'text-orange-800 dark:text-orange-200',
    border: 'border-orange-200 dark:border-orange-700',
    progress: 'bg-orange-500'
  },
  'Programming Languages': {
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-200 dark:border-red-700',
    progress: 'bg-red-500'
  },
  'Database': {
    bg: 'bg-indigo-100 dark:bg-indigo-900',
    text: 'text-indigo-800 dark:text-indigo-200',
    border: 'border-indigo-200 dark:border-indigo-700',
    progress: 'bg-indigo-500'
  },
  'Cloud': {
    bg: 'bg-teal-100 dark:bg-teal-900',
    text: 'text-teal-800 dark:text-teal-200',
    border: 'border-teal-200 dark:border-teal-700',
    progress: 'bg-teal-500'
  }
};

const SkillProgressBar: React.FC<SkillProgressBarProps> = ({ 
  skill, 
  animated = true, 
  onClick, 
  isSelected = false 
}) => {
  const animationsEnabled = usePortfolioStore((state) => state.animationsEnabled);
  const colors = categoryColors[skill.category];
  
  const progressVariants = {
    hidden: { width: 0 },
    visible: { 
      width: `${skill.proficiency}%`,
      transition: { 
          duration: animated && animationsEnabled ? 1.5 : 0,
          delay: animated && animationsEnabled ? 0.2 : 0,
          ease: "easeOut"
        }
    }
  };

  const barVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    selected: {
      scale: 1.02,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  };

  return (
    <motion.div
      variants={animationsEnabled ? barVariants : undefined}
      initial={animationsEnabled ? 'idle' : undefined}
      whileHover={animationsEnabled && onClick ? 'hover' : undefined}
      animate={isSelected && animationsEnabled ? 'selected' : 'idle'}
      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isSelected 
          ? `${colors.bg} ${colors.border} ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900`
          : `bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:${colors.bg}`
      }`}
      onClick={() => onClick?.(skill)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(skill);
        }
      }}
      aria-label={onClick ? `View details for ${skill.name}` : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className={`font-semibold ${isSelected ? colors.text : 'text-gray-900 dark:text-white'}`}>
          {skill.name}
        </h4>
        <span className={`text-sm font-medium ${
          isSelected ? colors.text : 'text-gray-600 dark:text-gray-400'
        }`}>
          {skill.proficiency}%
        </span>
      </div>
      
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          variants={animationsEnabled ? progressVariants : undefined}
          initial={animationsEnabled ? 'hidden' : undefined}
          animate={animationsEnabled ? 'visible' : undefined}
          className={`h-full ${colors.progress} rounded-full`}
          style={!animationsEnabled ? { width: `${skill.proficiency}%` } : {}}
        />
      </div>
      
      <div className="flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
        <span>{skill.yearsOfExperience} years</span>
        {skill.relatedProjects && skill.relatedProjects.length > 0 && (
          <span>{skill.relatedProjects.length} projects</span>
        )}
      </div>
    </motion.div>
  );
};

const SkillCategorySection: React.FC<{
  category: SkillCategory;
  skills: Skill[];
  isExpanded: boolean;
  onToggle: () => void;
  onSkillSelect: (skill: Skill) => void;
  selectedSkill: Skill | null;
  maxSkills?: number;
}> = ({ category, skills, isExpanded, onToggle, onSkillSelect, selectedSkill, maxSkills }) => {
  const animationsEnabled = usePortfolioStore((state) => state.animationsEnabled);
  const Icon = categoryIcons[category.name];
  const colors = categoryColors[category.name];
  
  const displayedSkills = maxSkills ? skills.slice(0, maxSkills) : skills;
  const hasMoreSkills = maxSkills && skills.length > maxSkills;
  
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={`rounded-xl border-2 ${colors.border} ${colors.bg} overflow-hidden`}>
      {/* Category Header */}
      <button
        onClick={onToggle}
        className={`w-full p-6 flex items-center justify-between ${colors.text} hover:bg-opacity-80 transition-colors`}
        aria-expanded={isExpanded}
        aria-controls={`skills-${category.name.toLowerCase()}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6" />
          <div className="text-left">
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p className="text-sm opacity-80">
              {skills.length} skill{skills.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Skills List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`skills-${category.name.toLowerCase()}`}
            variants={animationsEnabled ? containerVariants : undefined}
            initial={animationsEnabled ? 'hidden' : undefined}
            animate={animationsEnabled ? 'visible' : undefined}
            exit={animationsEnabled ? 'hidden' : undefined}
            className="px-6 pb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedSkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  variants={animationsEnabled ? skillVariants : undefined}
                >
                  <SkillProgressBar
                    skill={skill}
                    onClick={onSkillSelect}
                    isSelected={selectedSkill?.id === skill.id}
                  />
                </motion.div>
              ))}
            </div>
            
            {hasMoreSkills && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => {/* Could implement show more functionality */}}
                  className={`text-sm ${colors.text} hover:underline`}
                >
                  +{skills.length - maxSkills!} more skills
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SkillDetailModal: React.FC<{
  skill: Skill;
  onClose: () => void;
  projects: any[];
}> = ({ skill, onClose, projects }) => {
  const animationsEnabled = usePortfolioStore((state) => state.animationsEnabled);
  const colors = categoryColors[skill.category];
  
  const relatedProjects = projects.filter(project => 
    skill.relatedProjects?.includes(project.id)
  );

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={animationsEnabled ? backdropVariants : {}}
        initial={animationsEnabled ? 'hidden' : false}
        animate={animationsEnabled ? 'visible' : false}
        exit={animationsEnabled ? 'exit' : undefined}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          variants={animationsEnabled ? modalVariants : {}}
          initial={animationsEnabled ? 'hidden' : false}
          animate={animationsEnabled ? 'visible' : false}
          exit={animationsEnabled ? 'exit' : undefined}
          className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`p-6 ${colors.bg} ${colors.text}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{skill.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close skill details"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 opacity-80">{skill.category}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Proficiency and Experience */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {skill.proficiency}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Proficiency
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {skill.yearsOfExperience}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Years Experience
                </div>
              </div>
            </div>

            {/* Description */}
            {skill.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  About
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {skill.description}
                </p>
              </div>
            )}

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Related Projects ({relatedProjects.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {project.title}
                        </h4>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            aria-label={`View ${project.title} live demo`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {project.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InteractiveSkillsChart: React.FC<InteractiveSkillsChartProps> = ({
  className = '',
  showProjects = true,
  maxSkillsPerCategory
}) => {
  const {
    skills,
    projects,
    selectedSkill,
    selectSkill,
    getSkillsByCategory
  } = usePortfolioStore();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Frontend']));

  const skillsByCategory = getSkillsByCategory();
  const categories = Object.keys(skillsByCategory) as Array<keyof typeof categoryColors>;

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSkillSelect = (skill: Skill) => {
    selectSkill(selectedSkill?.id === skill.id ? null : skill);
  };

  if (skills.loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-32 mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (skills.error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-600 dark:text-red-400 mb-4">Failed to load skills</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Skills &amp; Expertise
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {skills.data?.length || 0} total skills
        </div>
      </div>

      {/* Skills by Category */}
      <div className="space-y-4">
        {categories.map((categoryName) => {
          const categorySkills = skillsByCategory[categoryName] || [];
          const category: SkillCategory = {
            id: categoryName.toLowerCase(),
            name: categoryName,
            skills: categorySkills,
            color: categoryColors[categoryName].progress
          };

          return (
            <SkillCategorySection
              key={categoryName}
              category={category}
              skills={categorySkills}
              isExpanded={expandedCategories.has(categoryName)}
              onToggle={() => toggleCategory(categoryName)}
              onSkillSelect={handleSkillSelect}
              selectedSkill={selectedSkill}
              maxSkills={maxSkillsPerCategory}
            />
          );
        })}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && showProjects && (
        <SkillDetailModal
          skill={selectedSkill}
          onClose={() => selectSkill(null)}
          projects={projects.data || []}
        />
      )}

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No skills data available yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractiveSkillsChart;