export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  video?: string;
  technologies: string[];
  category: 'web-app' | 'game' | 'tool' | 'api' | 'mobile';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  metrics: {
    performance?: number;
    users?: number;
    downloads?: number;
    stars?: number;
  };
  challenges: string[];
  solutions: string[];
  results: string[];
  dateCompleted: string;
  duration: string;
}

export const projects: Project[] = [
  {
    id: 'knucklebones-game',
    title: 'Knucklebones - Interactive Strategy Game',
    description: 'A sophisticated dice-based strategy game with AI opponents and real-time multiplayer capabilities.',
    longDescription: 'Knucklebones is a complex strategy game that combines luck and skill in a unique dice-placement mechanic. Players must strategically place dice to maximize their score while disrupting their opponent\'s strategy. The game features multiple difficulty levels, AI opponents with different playing styles, and a sleek, modern interface.',
    image: '/images/projects/knucklebones.png',
    video: '/videos/knucklebones-demo.mp4',
    technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'Game Logic', 'AI Algorithms'],
    category: 'game',
    complexity: 'advanced',
    featured: true,
    liveUrl: '/projects/knucklebones',
    githubUrl: 'https://github.com/username/knucklebones',
    metrics: {
      performance: 98,
      users: 1200,
      stars: 45
    },
    challenges: [
      'Implementing complex game logic with multiple rule variations',
      'Creating responsive AI opponents with different difficulty levels',
      'Optimizing canvas rendering for smooth animations'
    ],
    solutions: [
      'Developed modular game engine with pluggable rule systems',
      'Implemented minimax algorithm with alpha-beta pruning for AI',
      'Used requestAnimationFrame for optimized rendering pipeline'
    ],
    results: [
      'Achieved 98% performance score on Lighthouse',
      'Over 1,200 active players within first month',
      'Featured in indie game development communities'
    ],
    dateCompleted: '2024-12-15',
    duration: '3 weeks'
  },
  {
    id: 'marvel-quiz',
    title: 'Marvel Universe Quiz Platform',
    description: 'An interactive knowledge platform featuring dynamic questions, scoring systems, and character profiles.',
    longDescription: 'A comprehensive quiz application that tests users\' knowledge of the Marvel Universe. Features include dynamic question generation, multiple difficulty levels, character profile integration, and detailed scoring analytics. The platform includes over 500 questions across different Marvel properties.',
    image: '/images/projects/marvel-quiz.png',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Express'],
    category: 'web-app',
    complexity: 'intermediate',
    featured: true,
    liveUrl: '/projects/quiz-ninja2.1',
    githubUrl: 'https://github.com/username/marvel-quiz',
    metrics: {
      performance: 95,
      users: 850,
      stars: 32
    },
    challenges: [
      'Managing large dataset of questions and character information',
      'Implementing fair scoring system across difficulty levels',
      'Creating engaging user interface for quiz experience'
    ],
    solutions: [
      'Implemented efficient database indexing and caching strategies',
      'Developed weighted scoring algorithm based on question difficulty',
      'Used progressive web app features for offline functionality'
    ],
    results: [
      'Achieved 95% performance score with optimized loading',
      '850+ registered users with high engagement rates',
      'Average session duration of 12 minutes'
    ],
    dateCompleted: '2024-11-20',
    duration: '2 weeks'
  },
  {
    id: 'comptia-trainer',
    title: 'CompTIA Certification Trainer',
    description: 'Professional certification training platform with adaptive learning and progress tracking.',
    longDescription: 'A comprehensive training platform designed to help IT professionals prepare for CompTIA certifications. Features adaptive learning algorithms, detailed progress tracking, practice exams, and personalized study plans based on individual performance patterns.',
    image: '/images/projects/comptia.png',
    technologies: ['Vue.js', 'Python', 'Django', 'PostgreSQL', 'Redis'],
    category: 'web-app',
    complexity: 'advanced',
    featured: true,
    liveUrl: '/projects/compTIA',
    githubUrl: 'https://github.com/username/comptia-trainer',
    metrics: {
      performance: 96,
      users: 2100,
      stars: 67
    },
    challenges: [
      'Implementing adaptive learning algorithms',
      'Creating comprehensive question bank with explanations',
      'Building robust progress tracking and analytics'
    ],
    solutions: [
      'Developed machine learning model for personalized recommendations',
      'Created modular content management system for easy updates',
      'Implemented real-time analytics dashboard with data visualization'
    ],
    results: [
      '96% performance score with excellent user experience',
      '2,100+ active learners with 78% completion rate',
      'Average certification pass rate improvement of 35%'
    ],
    dateCompleted: '2024-10-30',
    duration: '4 weeks'
  },
  {
    id: 'calculator-app',
    title: 'Advanced Scientific Calculator',
    description: 'Feature-rich calculator with scientific functions, history, and customizable themes.',
    longDescription: 'A sophisticated calculator application that goes beyond basic arithmetic. Includes scientific functions, equation solving, graphing capabilities, calculation history, and multiple theme options. Built with accessibility and usability as primary concerns.',
    image: '/images/projects/calculator.png',
    technologies: ['JavaScript', 'CSS3', 'HTML5', 'Math.js', 'Chart.js'],
    category: 'tool',
    complexity: 'intermediate',
    featured: false,
    liveUrl: '/projects/calculator',
    githubUrl: 'https://github.com/username/calculator',
    metrics: {
      performance: 99,
      users: 450,
      stars: 23
    },
    challenges: [
      'Implementing complex mathematical operations accurately',
      'Creating intuitive user interface for scientific functions',
      'Ensuring accessibility for users with disabilities'
    ],
    solutions: [
      'Integrated Math.js library for precise calculations',
      'Designed progressive disclosure UI for advanced features',
      'Implemented full keyboard navigation and screen reader support'
    ],
    results: [
      'Achieved 99% performance score with instant calculations',
      '450+ daily active users across multiple platforms',
      'Accessibility compliance with WCAG 2.1 AA standards'
    ],
    dateCompleted: '2024-09-15',
    duration: '1 week'
  },
  {
    id: 'todo-manager',
    title: 'Advanced Todo Management System',
    description: 'Productivity application with project organization, collaboration features, and analytics.',
    longDescription: 'A comprehensive task management system designed for both individual productivity and team collaboration. Features include project organization, deadline tracking, team collaboration tools, productivity analytics, and integration with popular calendar applications.',
    image: '/images/projects/todo.png',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
    category: 'web-app',
    complexity: 'advanced',
    featured: false,
    liveUrl: '/projects/toDoList',
    githubUrl: 'https://github.com/username/todo-manager',
    metrics: {
      performance: 94,
      users: 680,
      stars: 41
    },
    challenges: [
      'Implementing real-time collaboration features',
      'Creating intuitive project organization system',
      'Building comprehensive analytics and reporting'
    ],
    solutions: [
      'Used Socket.io for real-time updates and collaboration',
      'Developed hierarchical task organization with drag-and-drop',
      'Created custom analytics engine with data visualization'
    ],
    results: [
      '94% performance score with real-time synchronization',
      '680+ active users with high retention rates',
      'Average productivity improvement of 25% reported by users'
    ],
    dateCompleted: '2024-08-22',
    duration: '3 weeks'
  },
  {
    id: 'rps-game',
    title: 'Rock Paper Scissors Championship',
    description: 'Multiplayer game with tournaments, statistics, and AI opponents.',
    longDescription: 'An enhanced version of the classic Rock Paper Scissors game featuring tournament modes, detailed statistics tracking, multiple AI opponents with different strategies, and online multiplayer capabilities. Includes achievement system and leaderboards.',
    image: '/images/projects/rps.png',
    technologies: ['JavaScript', 'WebSocket', 'CSS3', 'Chart.js', 'Node.js'],
    category: 'game',
    complexity: 'intermediate',
    featured: false,
    liveUrl: '/projects/rps',
    githubUrl: 'https://github.com/username/rps-championship',
    metrics: {
      performance: 97,
      users: 320,
      stars: 18
    },
    challenges: [
      'Implementing fair matchmaking system',
      'Creating engaging AI opponents with different strategies',
      'Building real-time multiplayer functionality'
    ],
    solutions: [
      'Developed ELO-based rating system for balanced matches',
      'Implemented multiple AI strategies using game theory',
      'Used WebSocket for low-latency real-time gameplay'
    ],
    results: [
      '97% performance score with smooth real-time gameplay',
      '320+ registered players with active tournaments',
      'Average session duration of 8 minutes'
    ],
    dateCompleted: '2024-07-10',
    duration: '1.5 weeks'
  }
];

export const categories = [
  { id: 'all', label: 'All Projects', count: projects.length },
  { id: 'web-app', label: 'Web Applications', count: projects.filter(p => p.category === 'web-app').length },
  { id: 'game', label: 'Games', count: projects.filter(p => p.category === 'game').length },
  { id: 'tool', label: 'Tools', count: projects.filter(p => p.category === 'tool').length },
  { id: 'featured', label: 'Featured', count: projects.filter(p => p.featured).length }
];

export const technologies = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js', 'Express',
  'MongoDB', 'PostgreSQL', 'Python', 'Django', 'HTML5', 'CSS3',
  'WebSocket', 'Socket.io', 'Chart.js', 'Math.js', 'Redis'
];

export const complexityLevels = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' }
];