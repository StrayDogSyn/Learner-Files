/**
 * Interactive Skills Matrix Component
 * Features: Hover effects, animations, filtering, sorting, project links, export
 */

import React, { useState, useEffect, useRef } from 'react';

// Mock motion components for demonstration (replace with actual framer-motion)
const motion = {
  div: ({ children, variants, initial, animate, className, onMouseEnter, onMouseLeave, onClick, ...props }) => 
    React.createElement('div', { className, onMouseEnter, onMouseLeave, onClick, ...props }, children)
};

const AnimatePresence = ({ children }) => children;

const SkillsMatrix = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('level');
  const [sortOrder, setSortOrder] = useState('desc');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const matrixRef = useRef(null);
  const observerRef = useRef(null);

  const skills = {
    frontend: [
      { 
        name: 'React', 
        level: 90, 
        experience: '3 years',
        projects: ['Portfolio Website', 'E-commerce Dashboard', 'Social Media App'],
        description: 'Component-based UI library with hooks and state management',
        certifications: ['React Developer Certification'],
        color: '#61DAFB'
      },
      { 
        name: 'TypeScript', 
        level: 85, 
        experience: '2 years',
        projects: ['GitHub Integration', 'API Management Tool'],
        description: 'Strongly typed superset of JavaScript for scalable applications',
        certifications: [],
        color: '#3178C6'
      },
      { 
        name: 'Tailwind CSS', 
        level: 95, 
        experience: '2 years',
        projects: ['Modern UI Components', 'Responsive Dashboards'],
        description: 'Utility-first CSS framework for rapid UI development',
        certifications: [],
        color: '#06B6D4'
      },
      { 
        name: 'Vue.js', 
        level: 75, 
        experience: '1 year',
        projects: ['Admin Panel', 'Data Visualization Tool'],
        description: 'Progressive JavaScript framework for building user interfaces',
        certifications: [],
        color: '#4FC08D'
      },
      { 
        name: 'Next.js', 
        level: 80, 
        experience: '1.5 years',
        projects: ['SSR Blog Platform', 'E-commerce Site'],
        description: 'React framework with SSR, routing, and performance optimizations',
        certifications: [],
        color: '#000000'
      }
    ],
    backend: [
      { 
        name: 'Node.js', 
        level: 85, 
        experience: '3 years',
        projects: ['REST API Server', 'Real-time Chat App', 'Microservices'],
        description: 'JavaScript runtime for server-side development',
        certifications: ['Node.js Application Developer'],
        color: '#339933'
      },
      { 
        name: 'Python', 
        level: 80, 
        experience: '2 years',
        projects: ['Data Analysis Scripts', 'ML Models', 'Automation Tools'],
        description: 'Versatile language for web development, data science, and automation',
        certifications: ['Python Institute PCAP'],
        color: '#3776AB'
      },
      { 
        name: 'Express.js', 
        level: 88, 
        experience: '3 years',
        projects: ['API Gateway', 'Authentication Service'],
        description: 'Minimal and flexible Node.js web application framework',
        certifications: [],
        color: '#000000'
      },
      { 
        name: 'PostgreSQL', 
        level: 75, 
        experience: '2 years',
        projects: ['User Management System', 'Analytics Database'],
        description: 'Advanced open-source relational database system',
        certifications: [],
        color: '#336791'
      }
    ],
    ai_ml: [
      { 
        name: 'Claude API', 
        level: 75, 
        experience: '6 months',
        projects: ['AI Chat Assistant', 'Content Generation Tool'],
        description: 'Advanced AI language model API for conversational AI',
        certifications: [],
        color: '#FF6B35'
      },
      { 
        name: 'LangChain', 
        level: 70, 
        experience: '6 months',
        projects: ['Document QA System', 'AI Workflow Automation'],
        description: 'Framework for developing applications with language models',
        certifications: [],
        color: '#2E8B57'
      },
      { 
        name: 'OpenAI API', 
        level: 80, 
        experience: '8 months',
        projects: ['Text Summarizer', 'Code Generator', 'Image Analysis'],
        description: 'GPT and DALL-E APIs for various AI applications',
        certifications: [],
        color: '#412991'
      },
      { 
        name: 'TensorFlow', 
        level: 65, 
        experience: '1 year',
        projects: ['Image Classification', 'Time Series Prediction'],
        description: 'Open-source machine learning framework',
        certifications: [],
        color: '#FF6F00'
      }
    ],
    tools: [
      { 
        name: 'Git', 
        level: 90, 
        experience: '4 years',
        projects: ['All Development Projects', 'Open Source Contributions'],
        description: 'Distributed version control system for tracking changes',
        certifications: [],
        color: '#F05032'
      },
      { 
        name: 'Docker', 
        level: 75, 
        experience: '1 year',
        projects: ['Containerized Applications', 'Development Environment'],
        description: 'Containerization platform for application deployment',
        certifications: [],
        color: '#2496ED'
      },
      { 
        name: 'AWS', 
        level: 70, 
        experience: '1.5 years',
        projects: ['Cloud Infrastructure', 'Serverless Functions'],
        description: 'Amazon Web Services cloud computing platform',
        certifications: ['AWS Cloud Practitioner'],
        color: '#232F3E'
      },
      { 
        name: 'VS Code', 
        level: 95, 
        experience: '4 years',
        projects: ['All Development Work', 'Extension Development'],
        description: 'Lightweight but powerful source code editor',
        certifications: [],
        color: '#007ACC'
      }
    ]
  };

  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (matrixRef.current) {
      observerRef.current.observe(matrixRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Get all skills as flat array
  const getAllSkills = () => {
    return Object.entries(skills).flatMap(([category, categorySkills]) =>
      categorySkills.map(skill => ({ ...skill, category }))
    );
  };

  // Filter and sort skills
  const getFilteredAndSortedSkills = () => {
    let filteredSkills = getAllSkills();

    // Filter by category
    if (selectedCategory !== 'all') {
      filteredSkills = filteredSkills.filter(skill => skill.category === selectedCategory);
    }

    // Sort skills
    filteredSkills.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'level':
          valueA = a.level;
          valueB = b.level;
          break;
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'experience':
          valueA = parseFloat(a.experience);
          valueB = parseFloat(b.experience);
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    return filteredSkills;
  };

  // Export as PDF
  const exportAsPDF = async () => {
    if (matrixRef.current) {
      const canvas = await html2canvas(matrixRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.text('Skills Matrix', 20, 20);
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('skills-matrix.pdf');
    }
  };

  // Export as PNG
  const exportAsImage = async () => {
    if (matrixRef.current) {
      const canvas = await html2canvas(matrixRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = 'skills-matrix.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Toggle skill comparison
  const toggleSkillComparison = (skill) => {
    if (compareMode) {
      setSelectedSkills(prev => {
        const isSelected = prev.some(s => s.name === skill.name);
        if (isSelected) {
          return prev.filter(s => s.name !== skill.name);
        } else if (prev.length < 3) {
          return [...prev, skill];
        }
        return prev;
      });
    }
  };

  // Get skill level color
  const getSkillLevelColor = (level) => {
    if (level >= 90) return 'from-green-500 to-green-600';
    if (level >= 80) return 'from-blue-500 to-blue-600';
    if (level >= 70) return 'from-yellow-500 to-yellow-600';
    if (level >= 60) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const filteredSkills = getFilteredAndSortedSkills();
  const categories = Object.keys(skills);

  return (
    <div className="skills-matrix bg-gray-50 min-h-screen py-12 px-4" ref={matrixRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Skills Matrix</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive visualization of technical skills, experience levels, and project applications
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' & ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="level">Proficiency Level</option>
                <option value="name">Name</option>
                <option value="experience">Experience</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  compareMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {compareMode ? 'Exit Compare' : 'Compare Skills'}
              </button>
              
              <div className="relative group">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  Export
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={exportAsImage}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PNG
                  </button>
                  <button
                    onClick={exportAsPDF}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compare Mode Info */}
          {compareMode && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-800">
                Compare Mode: Click on skills to compare (max 3). Selected: {selectedSkills.length}/3
              </p>
              {selectedSkills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSkills.map(skill => (
                    <span
                      key={skill.name}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredSkills.map((skill, index) => {
            const isSelected = selectedSkills.some(s => s.name === skill.name);
            
            return (
              <motion.div
                key={skill.name}
                variants={skillVariants}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${
                  compareMode && isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                onClick={() => toggleSkillComparison(skill)}
              >
                {/* Skill Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: skill.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded-md">
                      {skill.category.replace('_', ' & ')}
                    </span>
                    <span>{skill.experience}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Proficiency</span>
                    <span className="text-sm font-bold text-gray-900">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getSkillLevelColor(skill.level)} rounded-full`}
                      initial={{ width: 0 }}
                      animate={isVisible ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ 
                        duration: 1, 
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  </div>
                </div>

                {/* Additional Info on Hover */}
                <AnimatePresence>
                  {hoveredSkill?.name === skill.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="bg-gray-50 rounded-md p-3">
                        <p className="text-xs text-gray-600 mb-2">{skill.description}</p>
                        
                        {skill.projects.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-700 mb-1">Projects:</p>
                            <div className="flex flex-wrap gap-1">
                              {skill.projects.slice(0, 2).map(project => (
                                <span
                                  key={project}
                                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                >
                                  {project}
                                </span>
                              ))}
                              {skill.projects.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{skill.projects.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {skill.certifications.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">Certifications:</p>
                            {skill.certifications.map(cert => (
                              <span
                                key={cert}
                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-1"
                              >
                                ✓ {cert}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Comparison Panel */}
        {compareMode && selectedSkills.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Skill Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Skill</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-700">Level</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-700">Experience</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-700">Projects</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-700">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSkills.map(skill => (
                    <tr key={skill.name} className="border-b border-gray-100">
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: skill.color }}
                          />
                          <span className="font-medium">{skill.name}</span>
                        </div>
                      </td>
                      <td className="text-center py-3">
                        <span className={`px-2 py-1 rounded-md text-sm font-medium ${
                          skill.level >= 90 ? 'bg-green-100 text-green-800' :
                          skill.level >= 80 ? 'bg-blue-100 text-blue-800' :
                          skill.level >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {skill.level}%
                        </span>
                      </td>
                      <td className="text-center py-3 text-sm text-gray-600">
                        {skill.experience}
                      </td>
                      <td className="text-center py-3 text-sm text-gray-600">
                        {skill.projects.length}
                      </td>
                      <td className="text-center py-3">
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                          {skill.category.replace('_', ' & ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Skills Summary */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => {
              const categorySkills = skills[category];
              const avgLevel = Math.round(
                categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length
              );
              
              return (
                <div key={category} className="text-center">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' & ')}
                  </h4>
                  <div className="text-3xl font-bold text-blue-600 mb-1">{avgLevel}%</div>
                  <div className="text-sm text-gray-600">Average Proficiency</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {categorySkills.length} skills
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsMatrix;
