export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'AI' | 'Web' | 'Tools';
  imageUrl: string;
  screenshots?: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  githubRepo?: string; // owner/repo format for API calls
  featured?: boolean;
  version?: string;
  stars?: number;
  forks?: number;
  language?: string;
  lastUpdate?: string;
  viewCount?: number;
  testimonials?: {
    author: string;
    role: string;
    content: string;
    avatar?: string;
  }[];
}

export const projects: Project[] = [
  {
    id: 'dice-duel-pro',
    title: 'Dice Duel Pro',
    description: 'A sophisticated dice-based strategy game with AI opponents and real-time multiplayer capabilities.',
    category: 'Web',
    imageUrl: '/images/projects/dice-duel-pro.jpg',
    screenshots: ['/images/projects/dice-duel-1.jpg', '/images/projects/dice-duel-2.jpg'],
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'Canvas API', 'WebSocket'],
    liveUrl: '/projects/dice-duel-pro',
    githubUrl: 'https://github.com/straydogsyn/dice-duel-pro',
    githubRepo: 'straydogsyn/dice-duel-pro',
    featured: true,
    version: '2.1.0',
    stars: 45,
    forks: 12,
    language: 'JavaScript',
    lastUpdate: '2024-01-15',
    viewCount: 1250,
    testimonials: [
      {
        author: 'Alex Chen',
        role: 'Game Developer',
        content: 'Excellent implementation of multiplayer mechanics and AI strategy.',
        avatar: '/images/avatars/alex.jpg'
      }
    ]
  },
  {
    id: 'quiz-master-pro',
    title: 'Quiz Master Pro',
    description: 'An interactive knowledge platform featuring dynamic questions, scoring systems, and character profiles.',
    category: 'Web',
    imageUrl: '/images/projects/quiz-master-pro.jpg',
    screenshots: ['/images/projects/quiz-1.jpg', '/images/projects/quiz-2.jpg'],
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Express'],
    liveUrl: '#/quiz-ninja',
    githubUrl: 'https://github.com/straydogsyn/quiz-master-pro',
    githubRepo: 'straydogsyn/quiz-master-pro',
    featured: true,
    version: '1.8.2',
    stars: 32,
    forks: 8,
    language: 'TypeScript',
    lastUpdate: '2024-01-10',
    viewCount: 890
  },
  {
    id: 'knucklebones-game',
    title: 'Knucklebones - Interactive Strategy Game',
    description: 'A complex strategy game that combines luck and skill in a unique dice-placement mechanic.',
    category: 'Web',
    imageUrl: '/images/projects/knucklebones.jpg',
    screenshots: ['/images/projects/knucklebones-1.jpg', '/images/projects/knucklebones-2.jpg'],
    technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'Game Logic', 'AI Algorithms'],
    liveUrl: '#/knucklebones',
    githubUrl: 'https://github.com/straydogsyn/knucklebones',
    githubRepo: 'straydogsyn/knucklebones',
    featured: true,
    version: '1.5.0',
    stars: 67,
    forks: 15,
    language: 'JavaScript',
    lastUpdate: '2024-01-20',
    viewCount: 2100
  },
  {
    id: 'marvel-quiz',
    title: 'Marvel Universe Quiz Platform',
    description: 'A comprehensive quiz application that tests users\' knowledge of the Marvel Universe.',
    category: 'Web',
    imageUrl: '/images/projects/marvel-quiz.jpg',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Express'],
    liveUrl: '#/quiz-ninja',
    githubUrl: 'https://github.com/straydogsyn/marvel-quiz',
    githubRepo: 'straydogsyn/marvel-quiz',
    featured: false,
    version: '2.0.1',
    stars: 28,
    forks: 6,
    language: 'TypeScript',
    lastUpdate: '2024-01-05',
    viewCount: 650
  },
  {
    id: 'comptia-trainer',
    title: 'CompTIA Certification Trainer',
    description: 'Professional certification training platform with adaptive learning and progress tracking.',
    category: 'Tools',
    imageUrl: '/images/projects/comptia.jpg',
    screenshots: ['/images/projects/comptia-1.jpg', '/images/projects/comptia-2.jpg'],
    technologies: ['Vue.js', 'Python', 'Django', 'PostgreSQL', 'Redis'],
    liveUrl: '#/comptia-trainer',
    githubUrl: 'https://github.com/straydogsyn/comptia-trainer',
    githubRepo: 'straydogsyn/comptia-trainer',
    featured: true,
    version: '3.2.0',
    stars: 89,
    forks: 23,
    language: 'Vue',
    lastUpdate: '2024-01-18',
    viewCount: 3200
  },
  {
    id: 'calculator-app',
    title: 'Advanced Scientific Calculator',
    description: 'Feature-rich calculator with scientific functions, history, and customizable themes.',
    category: 'Tools',
    imageUrl: '/images/projects/calculator.jpg',
    screenshots: ['/images/projects/calculator-1.jpg', '/images/projects/calculator-2.jpg'],
    technologies: ['JavaScript', 'CSS3', 'HTML5', 'Math.js', 'Chart.js'],
    liveUrl: '#/calculator',
    githubUrl: 'https://github.com/straydogsyn/calculator',
    githubRepo: 'straydogsyn/calculator',
    featured: false,
    version: '1.3.0',
    stars: 23,
    forks: 4,
    language: 'JavaScript',
    lastUpdate: '2024-01-12',
    viewCount: 450
  },
  {
    id: 'todo-manager',
    title: 'Advanced Todo Management System',
    description: 'Productivity application with project organization, collaboration features, and analytics.',
    category: 'Tools',
    imageUrl: '/images/projects/todo.jpg',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
    liveUrl: '/projects/toDoList',
    githubUrl: 'https://github.com/straydogsyn/todo-manager',
    githubRepo: 'straydogsyn/todo-manager',
    featured: false,
    version: '2.0.0',
    stars: 41,
    forks: 11,
    language: 'React',
    lastUpdate: '2024-01-08',
    viewCount: 780
  },
  {
    id: 'rps-game',
    title: 'Rock Paper Scissors Championship',
    description: 'Multiplayer game with tournaments, statistics, and AI opponents.',
    category: 'Web',
    imageUrl: '/images/projects/rps.jpg',
    technologies: ['JavaScript', 'WebSocket', 'CSS3', 'Chart.js', 'Node.js'],
    liveUrl: '/projects/rps',
    githubUrl: 'https://github.com/straydogsyn/rps-championship',
    githubRepo: 'straydogsyn/rps-championship',
    featured: false,
    version: '1.2.0',
    stars: 18,
    forks: 3,
    language: 'JavaScript',
    lastUpdate: '2024-01-03',
    viewCount: 320
  },
  {
    id: 'caseflow-manager',
    title: 'CaseFlow Manager - AI Case Management',
    description: 'Intelligent case management system with Claude 4.1 integration for automated workflow optimization.',
    category: 'AI',
    imageUrl: '/images/projects/caseflow.jpg',
    screenshots: ['/images/projects/caseflow-1.jpg', '/images/projects/caseflow-2.jpg', '/images/projects/caseflow-3.jpg'],
    technologies: ['Claude 4.1', 'Vue.js', 'Node.js', 'Express', 'MongoDB', 'Docker', 'AWS'],
    liveUrl: '/projects/caseflow-demo',
    githubUrl: 'https://github.com/straydogsyn/caseflow-manager',
    githubRepo: 'straydogsyn/caseflow-manager',
    featured: true,
    version: '4.0.0',
    stars: 156,
    forks: 34,
    language: 'Vue',
    lastUpdate: '2024-01-25',
    viewCount: 4500,
    testimonials: [
      {
        author: 'Sarah Johnson',
        role: 'Legal Operations Director',
        content: 'Revolutionary AI integration that transformed our case management workflow.',
        avatar: '/images/avatars/sarah.jpg'
      }
    ]
  },
  {
    id: 'justiceai-platform',
    title: 'JusticeAI Platform - Claude 4.1 Legal Assistant',
    description: 'AI-powered legal platform serving 15,000+ professionals with Claude 4.1 integration for case analysis and bias detection.',
    category: 'AI',
    imageUrl: '/images/projects/justiceai.jpg',
    screenshots: ['/images/projects/justiceai-1.jpg', '/images/projects/justiceai-2.jpg', '/images/projects/justiceai-3.jpg'],
    technologies: ['Claude 4.1', 'Next.js 14', 'TypeScript', 'Python', 'TensorFlow', 'PostgreSQL', 'Redis'],
    liveUrl: '/projects/justiceai-demo',
    githubUrl: 'https://github.com/straydogsyn/justiceai-platform',
    githubRepo: 'straydogsyn/justiceai-platform',
    featured: true,
    version: '5.1.0',
    stars: 234,
    forks: 67,
    language: 'TypeScript',
    lastUpdate: '2024-01-30',
    viewCount: 8900,
    testimonials: [
      {
        author: 'Michael Rodriguez',
        role: 'Senior Partner',
        content: 'Game-changing AI platform that revolutionized our legal research and case analysis.',
        avatar: '/images/avatars/michael.jpg'
      },
      {
        author: 'Dr. Emily Watson',
        role: 'Legal Tech Researcher',
        content: 'Impressive bias detection capabilities and seamless Claude 4.1 integration.',
        avatar: '/images/avatars/emily.jpg'
      }
    ]
  }
];
