/**
 * Professional Project Case Studies
 * Detailed project information with metrics, challenges, and solutions
 */

export interface CaseStudyMetrics {
  performanceImprovement?: string;
  userEngagement?: string;
  codeReduction?: string;
  loadTime?: string;
  conversionRate?: string;
  userSatisfaction?: string;
  bugReduction?: string;
  developmentTime?: string;
}

export interface TechnicalChallenge {
  challenge: string;
  solution: string;
  impact: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: 'web-app' | 'mobile-app' | 'api' | 'ai-ml' | 'e-commerce' | 'saas';
  technologies: string[];
  duration: string;
  teamSize: string;
  role: string;
  client?: string;
  industry: string;
  
  // Visual assets
  thumbnail: string;
  images: string[];
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  
  // Case study details
  problem: string;
  solution: string;
  process: string[];
  challenges: TechnicalChallenge[];
  results: string[];
  metrics: CaseStudyMetrics;
  
  // Additional info
  testimonial?: {
    quote: string;
    author: string;
    position: string;
    company: string;
    avatar: string;
  };
  
  featured: boolean;
  status: 'completed' | 'in-progress' | 'concept';
  year: number;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'ai-portfolio-platform',
    title: 'AI-Powered Portfolio Platform',
    subtitle: 'Next.js 14 with Advanced Glassmorphism & Claude Integration',
    description: 'A cutting-edge portfolio platform featuring AI-powered chat, advanced glassmorphism effects, and real-time GitHub integration.',
    longDescription: 'This project represents the pinnacle of modern web development, combining Next.js 14 with App Router, TypeScript strict mode, and an innovative glassmorphism design system. The platform features an AI-powered chat system using Claude API, real-time GitHub statistics, and advanced micro-interactions that create an immersive user experience.',
    category: 'web-app',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Claude API', 'GitHub API', 'Vercel'],
    duration: '3 months',
    teamSize: '1 (Solo Project)',
    role: 'Full-Stack Developer & Designer',
    industry: 'Technology',
    
    thumbnail: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20portfolio%20website%20with%20glassmorphism%20effects%20dark%20theme%20blue%20gradients%20professional%20clean%20design&image_size=landscape_16_9',
    images: [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=portfolio%20homepage%20hero%20section%20glassmorphism%20dark%20theme%20modern%20typography&image_size=landscape_16_9',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chat%20interface%20modern%20design%20glass%20effects%20conversation%20bubbles&image_size=landscape_16_9',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=project%20showcase%20grid%20layout%20cards%20glassmorphism%20hover%20effects&image_size=landscape_16_9'
    ],
    liveUrl: 'https://portfolio-demo.vercel.app',
    githubUrl: 'https://github.com/username/ai-portfolio',
    
    problem: 'Traditional portfolios lack interactivity and fail to showcase modern development capabilities. Most portfolios are static, don\'t demonstrate real-time data integration, and lack the wow factor needed to stand out in a competitive market.',
    
    solution: 'Created an industry-leading portfolio platform that demonstrates cutting-edge web development techniques including AI integration, real-time APIs, advanced animations, and a sophisticated glassmorphism design system that creates an immersive user experience.',
    
    process: [
      'Research and competitive analysis of top developer portfolios',
      'Design system creation with atomic design principles',
      'Implementation of Next.js 14 with App Router and TypeScript',
      'Development of custom glassmorphism component library',
      'Integration of Claude AI for intelligent portfolio chat',
      'GitHub API integration for live repository statistics',
      'Performance optimization and accessibility improvements',
      'Deployment and monitoring setup'
    ],
    
    challenges: [
      {
        challenge: 'Creating performant glassmorphism effects without impacting page speed',
        solution: 'Implemented CSS-in-JS with optimized backdrop-filter usage and hardware acceleration',
        impact: 'Achieved 95+ Lighthouse performance score while maintaining visual fidelity'
      },
      {
        challenge: 'Integrating AI chat while maintaining user privacy and cost efficiency',
        solution: 'Implemented context-aware prompting with rate limiting and session management',
        impact: 'Reduced API costs by 60% while improving response relevance by 40%'
      },
      {
        challenge: 'Managing complex animations without blocking the main thread',
        solution: 'Used Framer Motion with optimized animation strategies and will-change properties',
        impact: 'Maintained 60fps animations across all devices and browsers'
      }
    ],
    
    results: [
      'Achieved 95+ scores across all Lighthouse metrics',
      'Implemented 15+ reusable glassmorphism components',
      'Created AI chat system with 95% user satisfaction',
      'Integrated real-time GitHub API with caching optimization',
      'Built responsive design supporting all device sizes',
      'Established comprehensive testing suite with 90% coverage'
    ],
    
    metrics: {
      performanceImprovement: '95+ Lighthouse Score',
      userEngagement: '300% increase in session duration',
      loadTime: '< 2s initial page load',
      userSatisfaction: '95% positive feedback',
      codeReduction: '40% fewer lines with atomic design',
      developmentTime: '50% faster with component library'
    },
    
    testimonial: {
      quote: 'This portfolio showcases exceptional technical skills and attention to detail. The glassmorphism effects and AI integration demonstrate mastery of modern web development.',
      author: 'Sarah Johnson',
      position: 'Senior Technical Recruiter',
      company: 'Tech Innovations Inc.',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20headshot%20business%20attire%20friendly%20smile&image_size=square'
    },
    
    featured: true,
    status: 'completed',
    year: 2024
  },
  
  {
    id: 'ecommerce-platform',
    title: 'Enterprise E-commerce Platform',
    subtitle: 'Scalable Multi-vendor Marketplace with Advanced Analytics',
    description: 'A comprehensive e-commerce solution supporting multiple vendors, real-time analytics, and advanced inventory management.',
    longDescription: 'Built a scalable e-commerce platform from the ground up, supporting thousands of vendors and millions of products. The platform features real-time analytics, advanced search capabilities, automated inventory management, and a sophisticated recommendation engine powered by machine learning.',
    category: 'e-commerce',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Elasticsearch', 'AWS', 'Stripe', 'Docker'],
    duration: '8 months',
    teamSize: '5 developers',
    role: 'Lead Full-Stack Developer',
    client: 'RetailTech Solutions',
    industry: 'E-commerce',
    
    thumbnail: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20ecommerce%20website%20clean%20design%20product%20grid%20shopping%20cart%20professional&image_size=landscape_16_9',
    images: [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=ecommerce%20dashboard%20analytics%20charts%20sales%20data%20modern%20interface&image_size=landscape_16_9',
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=product%20detail%20page%20ecommerce%20reviews%20ratings%20add%20to%20cart&image_size=landscape_16_9'
    ],
    liveUrl: 'https://marketplace-demo.com',
    
    problem: 'The client needed a scalable e-commerce platform that could handle multiple vendors, process thousands of transactions daily, and provide real-time analytics while maintaining high performance and security standards.',
    
    solution: 'Developed a microservices-based architecture with separate services for user management, product catalog, order processing, and analytics. Implemented advanced caching strategies, database optimization, and real-time data processing.',
    
    process: [
      'Requirements gathering and system architecture design',
      'Database schema design and optimization',
      'API development with RESTful and GraphQL endpoints',
      'Frontend development with React and state management',
      'Payment integration with Stripe and PayPal',
      'Search implementation with Elasticsearch',
      'Analytics dashboard development',
      'Performance testing and optimization',
      'Security audit and compliance implementation'
    ],
    
    challenges: [
      {
        challenge: 'Handling high-volume transactions during peak sales periods',
        solution: 'Implemented horizontal scaling with load balancers and database sharding',
        impact: 'Successfully handled 10x traffic increase during Black Friday sales'
      },
      {
        challenge: 'Complex inventory management across multiple vendors',
        solution: 'Built real-time inventory tracking with automated reorder points and vendor notifications',
        impact: 'Reduced stockouts by 75% and improved vendor satisfaction by 40%'
      }
    ],
    
    results: [
      'Processed over $2M in transactions in first quarter',
      'Achieved 99.9% uptime during peak traffic periods',
      'Reduced page load times by 60% through optimization',
      'Implemented fraud detection reducing chargebacks by 80%',
      'Built analytics dashboard used by 500+ vendors daily'
    ],
    
    metrics: {
      performanceImprovement: '60% faster page loads',
      userEngagement: '45% increase in conversion rate',
      loadTime: '< 1.5s average page load',
      conversionRate: '12% checkout conversion rate',
      bugReduction: '90% reduction in critical bugs'
    },
    
    featured: true,
    status: 'completed',
    year: 2023
  },
  
  {
    id: 'ai-content-generator',
    title: 'AI Content Generation Platform',
    subtitle: 'GPT-Powered Content Creation with Custom Training',
    description: 'An AI-powered platform for generating high-quality content with custom model training and brand voice adaptation.',
    longDescription: 'Developed a sophisticated AI content generation platform that helps businesses create consistent, high-quality content at scale. The platform features custom model training, brand voice adaptation, content optimization, and multi-format output generation.',
    category: 'ai-ml',
    technologies: ['Python', 'FastAPI', 'OpenAI GPT', 'TensorFlow', 'React', 'PostgreSQL', 'Redis', 'Celery'],
    duration: '6 months',
    teamSize: '3 developers',
    role: 'AI/ML Engineer & Backend Developer',
    client: 'ContentTech Startup',
    industry: 'Marketing Technology',
    
    thumbnail: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20content%20generation%20interface%20modern%20dashboard%20text%20editor%20artificial%20intelligence&image_size=landscape_16_9',
    images: [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20writing%20assistant%20interface%20content%20generation%20modern%20clean%20design&image_size=landscape_16_9'
    ],
    
    problem: 'Businesses struggle to create consistent, high-quality content at scale while maintaining their unique brand voice and meeting SEO requirements.',
    
    solution: 'Built an AI platform that learns from existing brand content to generate new content that matches the brand voice, includes SEO optimization, and supports multiple content formats.',
    
    process: [
      'Research and analysis of content generation requirements',
      'Custom model training pipeline development',
      'API development for content generation and optimization',
      'Frontend interface for content creation and editing',
      'Brand voice analysis and adaptation algorithms',
      'SEO optimization and keyword integration',
      'Quality scoring and content improvement suggestions'
    ],
    
    challenges: [
      {
        challenge: 'Training models to maintain consistent brand voice across different content types',
        solution: 'Developed custom fine-tuning pipeline with brand-specific datasets and voice consistency scoring',
        impact: 'Achieved 85% brand voice consistency score across all generated content'
      }
    ],
    
    results: [
      'Generated over 100,000 pieces of content for 200+ clients',
      'Achieved 85% brand voice consistency score',
      'Reduced content creation time by 70%',
      'Improved SEO rankings for 90% of client content'
    ],
    
    metrics: {
      performanceImprovement: '70% faster content creation',
      userEngagement: '60% increase in content engagement',
      userSatisfaction: '88% client satisfaction rate',
      developmentTime: '5x faster than manual content creation'
    },
    
    featured: false,
    status: 'completed',
    year: 2023
  },
  
  {
    id: 'real-time-collaboration',
    title: 'Real-time Collaboration Platform',
    subtitle: 'WebRTC-based Team Workspace with Live Editing',
    description: 'A comprehensive collaboration platform featuring real-time document editing, video conferencing, and project management tools.',
    longDescription: 'Created a modern collaboration platform that combines real-time document editing, video conferencing, screen sharing, and project management in a unified interface. Built with WebRTC for peer-to-peer communication and operational transformation for conflict-free collaborative editing.',
    category: 'saas',
    technologies: ['Vue.js', 'Node.js', 'Socket.io', 'WebRTC', 'MongoDB', 'Redis', 'Docker', 'Kubernetes'],
    duration: '10 months',
    teamSize: '6 developers',
    role: 'Frontend Lead & WebRTC Specialist',
    client: 'CollabTech Inc.',
    industry: 'Productivity Software',
    
    thumbnail: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=collaboration%20platform%20interface%20video%20call%20document%20editing%20modern%20workspace&image_size=landscape_16_9',
    images: [
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=real%20time%20document%20editor%20collaborative%20editing%20multiple%20cursors%20modern%20interface&image_size=landscape_16_9'
    ],
    
    problem: 'Remote teams needed a unified platform for collaboration that could handle real-time editing, video communication, and project management without switching between multiple tools.',
    
    solution: 'Developed an integrated platform with real-time collaborative editing using operational transformation, WebRTC-based video conferencing, and seamless project management tools.',
    
    process: [
      'User research and competitive analysis',
      'WebRTC implementation for peer-to-peer communication',
      'Operational transformation algorithm for collaborative editing',
      'Real-time synchronization with Socket.io',
      'Video conferencing with screen sharing capabilities',
      'Project management and task tracking features',
      'Performance optimization for large documents',
      'Security implementation and data encryption'
    ],
    
    challenges: [
      {
        challenge: 'Implementing conflict-free collaborative editing for large documents',
        solution: 'Built custom operational transformation engine with efficient diff algorithms',
        impact: 'Enabled seamless collaboration for documents with 10,000+ words'
      }
    ],
    
    results: [
      'Supported 50+ simultaneous collaborators per document',
      'Achieved sub-100ms latency for real-time updates',
      'Processed over 1M collaborative edits daily',
      'Maintained 99.8% uptime across all services'
    ],
    
    metrics: {
      performanceImprovement: '80% faster than competitors',
      userEngagement: '200% increase in daily active users',
      loadTime: '< 2s document load time',
      userSatisfaction: '92% user satisfaction score'
    },
    
    featured: false,
    status: 'completed',
    year: 2022
  }
];

export const getFeaturedCaseStudies = (): CaseStudy[] => {
  return caseStudies.filter(study => study.featured);
};

export const getCaseStudyById = (id: string): CaseStudy | undefined => {
  return caseStudies.find(study => study.id === id);
};

export const getCaseStudiesByCategory = (category: string): CaseStudy[] => {
  return caseStudies.filter(study => study.category === category);
};

export const getCaseStudiesByYear = (year: number): CaseStudy[] => {
  return caseStudies.filter(study => study.year === year);
};

export const getCaseStudiesByTechnology = (technology: string): CaseStudy[] => {
  return caseStudies.filter(study => 
    study.technologies.some(tech => 
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );
};