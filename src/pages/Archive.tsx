import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Archive as ArchiveIcon, 
  Calendar, 
  Code, 
  ExternalLink, 
  Github, 
  Search, 
  Filter, 
  Star,
  Clock,
  BookOpen,
  Lightbulb,
  Target,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArchivedProject {
  id: string;
  name: string;
  description: string;
  category: 'game' | 'utility' | 'learning' | 'experiment';
  technologies: string[];
  dateCreated: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'completed' | 'archived' | 'concept';
  learningOutcomes: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
}

const Archive: React.FC = () => {
  const [projects, setProjects] = useState<ArchivedProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ArchivedProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading archived projects
    const loadArchivedProjects = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const archivedProjects: ArchivedProject[] = [
        {
          id: '1',
          name: 'Rock Paper Scissors',
          description: 'Classic game implementation with score tracking and animated results. My first interactive JavaScript project.',
          category: 'game',
          technologies: ['HTML', 'CSS', 'JavaScript'],
          dateCreated: '2023-06-15',
          difficulty: 'beginner',
          status: 'completed',
          learningOutcomes: ['DOM manipulation', 'Event handling', 'Game logic', 'CSS animations'],
          githubUrl: 'https://github.com/straydogsyn/rps-game',
          demoUrl: 'https://straydogsyn.github.io/rps-game'
        },
        {
          id: '2',
          name: 'Todo List App',
          description: 'Feature-rich todo application with local storage, categories, and due dates. Learned about data persistence.',
          category: 'utility',
          technologies: ['HTML', 'CSS', 'JavaScript', 'Local Storage'],
          dateCreated: '2023-07-22',
          difficulty: 'intermediate',
          status: 'completed',
          learningOutcomes: ['Local storage', 'CRUD operations', 'Data filtering', 'Form validation'],
          githubUrl: 'https://github.com/straydogsyn/todo-app'
        },
        {
          id: '3',
          name: 'Circle Maker',
          description: 'Interactive canvas application for creating and manipulating circles. Explored HTML5 Canvas API.',
          category: 'experiment',
          technologies: ['HTML', 'CSS', 'JavaScript', 'Canvas API'],
          dateCreated: '2023-08-10',
          difficulty: 'intermediate',
          status: 'completed',
          learningOutcomes: ['Canvas API', 'Mouse events', 'Coordinate systems', 'Dynamic rendering'],
          githubUrl: 'https://github.com/straydogsyn/circle-maker'
        },
        {
          id: '4',
          name: 'Weather Widget',
          description: 'Simple weather display using OpenWeatherMap API. First experience with external APIs.',
          category: 'utility',
          technologies: ['HTML', 'CSS', 'JavaScript', 'API Integration'],
          dateCreated: '2023-09-05',
          difficulty: 'intermediate',
          status: 'completed',
          learningOutcomes: ['API consumption', 'Async/await', 'Error handling', 'JSON parsing'],
          githubUrl: 'https://github.com/straydogsyn/weather-widget'
        },
        {
          id: '5',
          name: 'Memory Card Game',
          description: 'Card matching game with multiple difficulty levels and timer. Enhanced understanding of state management.',
          category: 'game',
          technologies: ['HTML', 'CSS', 'JavaScript'],
          dateCreated: '2023-09-20',
          difficulty: 'intermediate',
          status: 'completed',
          learningOutcomes: ['State management', 'Array manipulation', 'Timer functions', 'Game algorithms'],
          githubUrl: 'https://github.com/straydogsyn/memory-game'
        },
        {
          id: '6',
          name: 'Color Palette Generator',
          description: 'Tool for generating harmonious color palettes. Experimented with color theory and algorithms.',
          category: 'utility',
          technologies: ['HTML', 'CSS', 'JavaScript', 'Color Theory'],
          dateCreated: '2023-10-12',
          difficulty: 'advanced',
          status: 'completed',
          learningOutcomes: ['Color algorithms', 'HSL color space', 'Design principles', 'User experience'],
          githubUrl: 'https://github.com/straydogsyn/color-palette'
        },
        {
          id: '7',
          name: 'Typing Speed Test',
          description: 'WPM calculator with accuracy tracking and progress statistics. Focused on performance optimization.',
          category: 'utility',
          technologies: ['HTML', 'CSS', 'JavaScript', 'Performance API'],
          dateCreated: '2023-11-08',
          difficulty: 'intermediate',
          status: 'completed',
          learningOutcomes: ['Performance measurement', 'Real-time calculations', 'Statistics', 'User feedback'],
          githubUrl: 'https://github.com/straydogsyn/typing-test'
        },
        {
          id: '8',
          name: 'Expense Tracker',
          description: 'Personal finance tracker with charts and categories. Early exploration of data visualization.',
          category: 'utility',
          technologies: ['HTML', 'CSS', 'JavaScript', 'Chart.js'],
          dateCreated: '2023-12-03',
          difficulty: 'advanced',
          status: 'completed',
          learningOutcomes: ['Data visualization', 'Chart libraries', 'Financial calculations', 'Data export'],
          githubUrl: 'https://github.com/straydogsyn/expense-tracker'
        }
      ];
      
      setProjects(archivedProjects);
      setFilteredProjects(archivedProjects);
      setIsLoading(false);
    };

    loadArchivedProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(project => project.difficulty === selectedDifficulty);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, selectedDifficulty]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'game': return '🎮';
      case 'utility': return '🛠️';
      case 'learning': return '📚';
      case 'experiment': return '🧪';
      default: return '📁';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 border-red-500/30 bg-red-500/20';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-hunter-green p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-8 border border-emerald-500/20 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ArchiveIcon className="w-6 h-6 text-emerald-400 animate-pulse" />
              <span className="text-xl text-emerald-400">Loading Archive...</span>
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-hunter-green p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ArchiveIcon className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-white">Project Archive</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A collection of learning projects and experiments that shaped my development journey. 
            Each project represents a milestone in my coding evolution.
          </p>
          <div className="mt-4">
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>View Current Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass p-6 border border-emerald-500/20"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects, technologies, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="all">All Categories</option>
                <option value="game">Games</option>
                <option value="utility">Utilities</option>
                <option value="learning">Learning</option>
                <option value="experiment">Experiments</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(project.category)}</span>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {project.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {new Date(project.dateCreated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded border border-gray-600/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div className="mb-4">
                  <div className="flex items-center space-x-1 mb-2">
                    <Lightbulb className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-medium">Key Learnings</span>
                  </div>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {project.learningOutcomes.slice(0, 3).map((outcome, idx) => (
                      <li key={idx} className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-600/30">
                  <div className="flex items-center space-x-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                        aria-label="View on GitHub"
                      >
                        <Github className="w-4 h-4 text-gray-400" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors"
                        aria-label="View demo"
                      >
                        <ExternalLink className="w-4 h-4 text-emerald-400" />
                      </a>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    project.status === 'archived' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-8 border border-emerald-500/20 text-center"
          >
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
            <p className="text-gray-400">
              Try adjusting your search terms or filters to find more projects.
            </p>
          </motion.div>
        )}

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass p-6 border border-emerald-500/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">{projects.length}</div>
              <div className="text-sm text-gray-400">Total Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {new Set(projects.flatMap(p => p.technologies)).size}
              </div>
              <div className="text-sm text-gray-400">Technologies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((Date.now() - new Date(projects[0]?.dateCreated || '').getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-400">Days Learning</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Archive;