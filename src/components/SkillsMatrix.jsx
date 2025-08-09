/**
 * Interactive Skills Matrix Component
 * Features: Hover effects, animations, filtering, sorting, project links, export
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Database, 
  Palette, 
  Server, 
  Smartphone, 
  Globe,
  Zap,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';

const SkillsMatrix = () => {
  const [selectedCategory, setSelectedCategory] = useState('frontend');
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const skillCategories = [
    {
      id: 'frontend',
      name: 'Frontend',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      skills: [
        { name: 'React.js', level: 95, experience: '4+ years', projects: 15 },
        { name: 'TypeScript', level: 90, experience: '3+ years', projects: 12 },
        { name: 'Next.js', level: 88, experience: '3+ years', projects: 10 },
        { name: 'Tailwind CSS', level: 92, experience: '3+ years', projects: 18 },
        { name: 'Vue.js', level: 75, experience: '2+ years', projects: 8 },
        { name: 'Angular', level: 70, experience: '2+ years', projects: 6 }
      ]
    },
    {
      id: 'backend',
      name: 'Backend',
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      skills: [
        { name: 'Node.js', level: 90, experience: '4+ years', projects: 20 },
        { name: 'Express.js', level: 88, experience: '4+ years', projects: 18 },
        { name: 'Python', level: 85, experience: '3+ years', projects: 12 },
        { name: 'Django', level: 80, experience: '2+ years', projects: 8 },
        { name: 'PostgreSQL', level: 82, experience: '3+ years', projects: 15 },
        { name: 'MongoDB', level: 78, experience: '2+ years', projects: 10 }
      ]
    },
    {
      id: 'mobile',
      name: 'Mobile',
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'React Native', level: 85, experience: '3+ years', projects: 12 },
        { name: 'Flutter', level: 75, experience: '2+ years', projects: 8 },
        { name: 'iOS Development', level: 70, experience: '2+ years', projects: 6 },
        { name: 'Android Development', level: 72, experience: '2+ years', projects: 7 }
      ]
    },
    {
      id: 'design',
      name: 'Design',
      icon: Palette,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'Figma', level: 88, experience: '3+ years', projects: 25 },
        { name: 'Adobe XD', level: 80, experience: '2+ years', projects: 15 },
        { name: 'Photoshop', level: 75, experience: '2+ years', projects: 12 },
        { name: 'Illustrator', level: 70, experience: '2+ years', projects: 8 }
      ]
    },
    {
      id: 'devops',
      name: 'DevOps',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      skills: [
        { name: 'Docker', level: 82, experience: '3+ years', projects: 18 },
        { name: 'AWS', level: 78, experience: '2+ years', projects: 12 },
        { name: 'CI/CD', level: 80, experience: '3+ years', projects: 15 },
        { name: 'Kubernetes', level: 70, experience: '2+ years', projects: 8 }
      ]
    }
  ];

  const currentCategory = skillCategories.find(cat => cat.id === selectedCategory);

  const getLevelColor = (level) => {
    if (level >= 90) return 'from-green-400 to-emerald-500';
    if (level >= 80) return 'from-blue-400 to-cyan-500';
    if (level >= 70) return 'from-yellow-400 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const getLevelText = (level) => {
    if (level >= 90) return 'Expert';
    if (level >= 80) return 'Advanced';
    if (level >= 70) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Skills & Expertise
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive overview of my technical skills, experience, and proficiency levels across various technologies and domains.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {skillCategories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <category.icon className="w-5 h-5" />
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentCategory?.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                onHoverStart={() => setHoveredSkill(skill.name)}
                onHoverEnd={() => setHoveredSkill(null)}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Skill Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {skill.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getLevelColor(skill.level)} text-white`}>
                    {getLevelText(skill.level)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Proficiency</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${getLevelColor(skill.level)}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                    />
                  </div>
                </div>

                {/* Skill Details */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{skill.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{skill.projects} projects completed</span>
                  </div>
                </div>

                {/* Hover Effect */}
                {hoveredSkill === skill.name && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Continuous Learning & Growth
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              I'm constantly expanding my skill set through personal projects, online courses, and real-world applications. 
              Technology evolves rapidly, and I believe in staying ahead of the curve.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Award className="w-5 h-5" />
                <span className="font-medium">Certified Developer</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Active Learner</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Skill Growth</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsMatrix;
