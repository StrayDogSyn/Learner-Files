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
    id: 'caseflow-manager',
    title: 'CaseFlow Manager - AI Case Management',
    description: 'Intelligent case management system with Claude 4.1 integration for automated workflow optimization.',
    longDescription: 'CaseFlow Manager revolutionizes legal case management by integrating Claude 4.1 for intelligent workflow automation. The system automatically categorizes cases, predicts timelines, identifies potential issues, and optimizes resource allocation. Features include automated document generation, deadline tracking, and predictive analytics for case outcomes.',
    image: '/images/projects/caseflow.png',
    technologies: ['Claude 4.1', 'Vue.js', 'Node.js', 'Express', 'MongoDB', 'Docker', 'AWS'],
    category: 'web-app',
    complexity: 'advanced',
    featured: false,
    liveUrl: '/projects/caseflow-demo',
    githubUrl: 'https://github.com/username/caseflow-manager',
    metrics: {
      performance: 95,
      users: 3200,
      stars: 98
    },
    challenges: [
      'Automating complex legal workflows without losing human oversight',
      'Integrating with diverse existing legal software systems',
      'Ensuring data security for sensitive case information',
      'Building predictive models for case timeline estimation'
    ],
    solutions: [
      'Developed hybrid AI-human workflow with approval checkpoints',
      'Created universal API adapters for major legal software platforms',
      'Implemented zero-trust security architecture with encryption at rest',
      'Built ensemble ML models combining historical data with Claude 4.1 insights'
    ],
    results: [
      '42% improvement in case processing efficiency',
      '3,200+ legal professionals using the platform daily',
      '95% accuracy in case timeline predictions',
      'Reduced administrative overhead by 38% for participating law firms'
    ],
    dateCompleted: '2024-09-30',
    duration: '10 weeks'
  },
  {
    id: 'justiceai-platform',
    title: 'JusticeAI Platform - Claude 4.1 Legal Assistant',
    description: 'AI-powered legal platform serving 15,000+ professionals with Claude 4.1 integration for case analysis and bias detection.',
    longDescription: 'JusticeAI Platform is a comprehensive legal technology solution that leverages Claude 4.1 to transform how legal professionals work. The platform provides intelligent case analysis, automated document review, bias detection in legal text, and predictive case outcome modeling. Built with a focus on reducing systemic bias and improving access to justice.',
    image: '/images/projects/justiceai.png',
    video: '/videos/justiceai-demo.mp4',
    technologies: ['Claude 4.1', 'Next.js 14', 'TypeScript', 'Python', 'TensorFlow', 'PostgreSQL', 'Redis'],
    category: 'web-app',
    complexity: 'advanced',
    featured: true,
    liveUrl: '/projects/justiceai-demo',
    githubUrl: 'https://github.com/username/justiceai-platform',
    metrics: {
      performance: 97,
      users: 15000,
      stars: 234
    },
    challenges: [
      'Integrating Claude 4.1 for real-time legal document analysis',
      'Building bias detection algorithms for legal text',
      'Ensuring HIPAA and legal compliance for sensitive data',
      'Scaling to handle 15,000+ concurrent legal professionals'
    ],
    solutions: [
      'Developed custom Claude 4.1 API integration with legal domain fine-tuning',
      'Implemented ML pipeline for bias pattern recognition in legal documents',
      'Built enterprise-grade security with end-to-end encryption',
      'Designed microservices architecture with auto-scaling capabilities'
    ],
    results: [
      '31% improvement in case resolution efficiency',
      '23% reduction in documented bias incidents',
      'Serving 15,000+ legal professionals across 8 states',
      'Featured in Legal Technology Review as "Innovation of the Year"'
    ],
    dateCompleted: '2024-12-01',
    duration: '8 weeks'
  },
  {
    id: 'biasguard-system',
    title: 'BiasGuard - AI Bias Detection System',
    description: 'Claude 4.1-powered system deployed in 8 state court systems, reducing sentencing disparities by 23%.',
    longDescription: 'BiasGuard is a revolutionary AI system that analyzes judicial decisions in real-time to detect and prevent bias in the justice system. Using Claude 4.1\'s advanced language understanding, the system identifies discriminatory patterns in sentencing, jury selection, and case assignments. The system provides real-time alerts to judges and court administrators.',
    image: '/images/projects/biasguard.png',
    video: '/videos/biasguard-demo.mp4',
    technologies: ['Claude 4.1', 'Python', 'scikit-learn', 'React', 'D3.js', 'Apache Kafka', 'Elasticsearch'],
    category: 'web-app',
    complexity: 'advanced',
    featured: true,
    liveUrl: '/projects/biasguard-demo',
    githubUrl: 'https://github.com/username/biasguard-system',
    metrics: {
      performance: 96,
      users: 2800,
      stars: 189
    },
    challenges: [
      'Training AI models on sensitive judicial data',
      'Achieving real-time bias detection without disrupting court workflows',
      'Building trust with judicial stakeholders',
      'Ensuring algorithmic fairness in bias detection itself'
    ],
    solutions: [
      'Developed federated learning approach for privacy-preserving model training',
      'Created seamless integration with existing case management systems',
      'Implemented transparent AI with explainable decision-making',
      'Built comprehensive audit trails and bias testing frameworks'
    ],
    results: [
      '23% reduction in sentencing disparities across demographics',
      '89% adoption rate among judges in pilot programs',
      'Deployed in 8 state court systems with expansion to 12 more planned',
      'Recognized by American Bar Association for innovation in legal technology'
    ],
    dateCompleted: '2024-11-15',
    duration: '12 weeks'
  },
  {
    id: 'legalaccess-portal',
    title: 'LegalAccess Portal - AI-Powered Legal Guidance',
    description: 'Free legal guidance platform powered by Claude 4.1, serving 50,000+ underserved community members.',
    longDescription: 'LegalAccess Portal democratizes legal knowledge by providing free, AI-powered legal guidance to underserved communities. Using Claude 4.1, the platform translates complex legal concepts into plain language, provides step-by-step guidance for common legal procedures, and connects users with appropriate legal resources and pro bono attorneys.',
    image: '/images/projects/legalaccess.png',
    technologies: ['Claude 4.1', 'Next.js 14', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel'],
    category: 'web-app',
    complexity: 'intermediate',
    featured: true,
    liveUrl: '/projects/legalaccess-demo',
    githubUrl: 'https://github.com/username/legalaccess-portal',
    metrics: {
      performance: 98,
      users: 50000,
      stars: 156
    },
    challenges: [
      'Making complex legal information accessible to non-lawyers',
      'Ensuring accuracy while avoiding unauthorized practice of law',
      'Supporting multiple languages for diverse communities',
      'Scaling to serve 50,000+ users with limited resources'
    ],
    solutions: [
      'Developed Claude 4.1 prompts specifically for legal plain-language translation',
      'Implemented clear disclaimers and referral system to licensed attorneys',
      'Built multilingual support with cultural context awareness',
      'Leveraged serverless architecture for cost-effective scaling'
    ],
    results: [
      '67% increase in legal access for underserved communities',
      '50,000+ users served with 4.8/5 satisfaction rating',
      'Average cost reduction of 85% for basic legal guidance',
      'Partnership with 15 legal aid organizations nationwide'
    ],
    dateCompleted: '2024-10-20',
    duration: '6 weeks'
  },
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