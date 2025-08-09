export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  version?: string;
  stars?: number;
  forks?: number;
  lastUpdate?: string;
  viewCount?: number;
}

export const projects: Project[] = [
  {
    id: 'dice-duel-pro',
    title: 'Dice Duel Pro',
    description: 'A sophisticated dice-based strategy game with AI opponents and real-time multiplayer capabilities.',
    imageUrl: '/images/projects/dice-duel-pro.jpg',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'Canvas API', 'WebSocket'],
    liveUrl: '/projects/dice-duel-pro',
    githubUrl: 'https://github.com/username/dice-duel-pro',
    featured: true,
    version: '2.1.0',
    stars: 45,
    forks: 12,
    lastUpdate: '2024-01-15',
    viewCount: 1250
  },
  {
    id: 'quiz-master-pro',
    title: 'Quiz Master Pro',
    description: 'An interactive knowledge platform featuring dynamic questions, scoring systems, and character profiles.',
    imageUrl: '/images/projects/quiz-master-pro.jpg',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Express'],
    liveUrl: '/projects/quiz-master-pro',
    githubUrl: 'https://github.com/username/quiz-master-pro',
    featured: true,
    version: '1.8.2',
    stars: 32,
    forks: 8,
    lastUpdate: '2024-01-10',
    viewCount: 890
  },
  {
    id: 'knucklebones-game',
    title: 'Knucklebones - Interactive Strategy Game',
    description: 'A complex strategy game that combines luck and skill in a unique dice-placement mechanic.',
    imageUrl: '/images/projects/knucklebones.jpg',
    technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'Game Logic', 'AI Algorithms'],
    liveUrl: '/projects/knucklebones',
    githubUrl: 'https://github.com/username/knucklebones',
    featured: true,
    version: '1.5.0',
    stars: 67,
    forks: 15,
    lastUpdate: '2024-01-20',
    viewCount: 2100
  },
  {
    id: 'marvel-quiz',
    title: 'Marvel Universe Quiz Platform',
    description: 'A comprehensive quiz application that tests users\' knowledge of the Marvel Universe.',
    imageUrl: '/images/projects/marvel-quiz.jpg',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Express'],
    liveUrl: '/projects/quiz-ninja2.1',
    githubUrl: 'https://github.com/username/marvel-quiz',
    featured: false,
    version: '2.0.1',
    stars: 28,
    forks: 6,
    lastUpdate: '2024-01-05',
    viewCount: 650
  },
  {
    id: 'comptia-trainer',
    title: 'CompTIA Certification Trainer',
    description: 'Professional certification training platform with adaptive learning and progress tracking.',
    imageUrl: '/images/projects/comptia.jpg',
    technologies: ['Vue.js', 'Python', 'Django', 'PostgreSQL', 'Redis'],
    liveUrl: '/projects/compTIA',
    githubUrl: 'https://github.com/username/comptia-trainer',
    featured: true,
    version: '3.2.0',
    stars: 89,
    forks: 23,
    lastUpdate: '2024-01-18',
    viewCount: 3200
  },
  {
    id: 'calculator-app',
    title: 'Advanced Scientific Calculator',
    description: 'Feature-rich calculator with scientific functions, history, and customizable themes.',
    imageUrl: '/images/projects/calculator.jpg',
    technologies: ['JavaScript', 'CSS3', 'HTML5', 'Math.js', 'Chart.js'],
    liveUrl: '/projects/calculator',
    githubUrl: 'https://github.com/username/calculator',
    featured: false,
    version: '1.3.0',
    stars: 23,
    forks: 4,
    lastUpdate: '2024-01-12',
    viewCount: 450
  },
  {
    id: 'todo-manager',
    title: 'Advanced Todo Management System',
    description: 'Productivity application with project organization, collaboration features, and analytics.',
    imageUrl: '/images/projects/todo.jpg',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
    liveUrl: '/projects/toDoList',
    githubUrl: 'https://github.com/username/todo-manager',
    featured: false,
    version: '2.0.0',
    stars: 41,
    forks: 11,
    lastUpdate: '2024-01-08',
    viewCount: 780
  },
  {
    id: 'rps-game',
    title: 'Rock Paper Scissors Championship',
    description: 'Multiplayer game with tournaments, statistics, and AI opponents.',
    imageUrl: '/images/projects/rps.jpg',
    technologies: ['JavaScript', 'WebSocket', 'CSS3', 'Chart.js', 'Node.js'],
    liveUrl: '/projects/rps',
    githubUrl: 'https://github.com/username/rps-championship',
    featured: false,
    version: '1.2.0',
    stars: 18,
    forks: 3,
    lastUpdate: '2024-01-03',
    viewCount: 320
  },
  {
    id: 'caseflow-manager',
    title: 'CaseFlow Manager - AI Case Management',
    description: 'Intelligent case management system with Claude 4.1 integration for automated workflow optimization.',
    imageUrl: '/images/projects/caseflow.jpg',
    technologies: ['Claude 4.1', 'Vue.js', 'Node.js', 'Express', 'MongoDB', 'Docker', 'AWS'],
    liveUrl: '/projects/caseflow-demo',
    githubUrl: 'https://github.com/username/caseflow-manager',
    featured: true,
    version: '4.0.0',
    stars: 156,
    forks: 34,
    lastUpdate: '2024-01-25',
    viewCount: 4500
  },
  {
    id: 'justiceai-platform',
    title: 'JusticeAI Platform - Claude 4.1 Legal Assistant',
    description: 'AI-powered legal platform serving 15,000+ professionals with Claude 4.1 integration for case analysis and bias detection.',
    imageUrl: '/images/projects/justiceai.jpg',
    technologies: ['Claude 4.1', 'Next.js 14', 'TypeScript', 'Python', 'TensorFlow', 'PostgreSQL', 'Redis'],
    liveUrl: '/projects/justiceai-demo',
    githubUrl: 'https://github.com/username/justiceai-platform',
    featured: true,
    version: '5.1.0',
    stars: 234,
    forks: 67,
    lastUpdate: '2024-01-30',
    viewCount: 8900
  }
];
