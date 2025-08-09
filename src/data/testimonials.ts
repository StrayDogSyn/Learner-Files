export interface UserTestimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  rating: number; // 1-5 stars
  content: string;
  projectId?: string; // Associated project
  date: string;
  verified: boolean;
  tags: string[];
}

export interface TestimonialStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const testimonials: UserTestimonial[] = [
  {
    id: 'test-001',
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    company: 'TechCorp',
    rating: 5,
    content: 'The Scientific Calculator is incredibly well-built! The glassmorphic design is stunning and the performance is lightning-fast. The scientific functions work flawlessly.',
    projectId: 'calculator',
    date: '2024-01-15',
    verified: true,
    tags: ['design', 'performance', 'functionality']
  },
  {
    id: 'test-002',
    name: 'Marcus Rodriguez',
    role: 'Software Engineer',
    company: 'StartupXYZ',
    rating: 5,
    content: 'Quiz Ninja is addictive! The smooth animations and intuitive interface make learning fun. Great job on the progress tracking system.',
    projectId: 'quiz-ninja',
    date: '2024-01-12',
    verified: true,
    tags: ['user-experience', 'animations', 'learning']
  },
  {
    id: 'test-003',
    name: 'Emily Watson',
    role: 'UX Designer',
    company: 'DesignStudio',
    rating: 5,
    content: 'The attention to accessibility and user experience across all projects is outstanding. The glassmorphic design system is consistently applied and beautiful.',
    projectId: 'general',
    date: '2024-01-10',
    verified: true,
    tags: ['accessibility', 'design-system', 'consistency']
  },
  {
    id: 'test-004',
    name: 'David Kim',
    role: 'Game Developer',
    company: 'IndieGames',
    rating: 4,
    content: 'Knucklebones game logic is impressive! The AI opponent provides a good challenge. Would love to see multiplayer functionality in the future.',
    projectId: 'knucklebones',
    date: '2024-01-08',
    verified: true,
    tags: ['game-logic', 'ai', 'strategy']
  },
  {
    id: 'test-005',
    name: 'Lisa Thompson',
    role: 'Product Manager',
    company: 'ProductCo',
    rating: 5,
    content: 'The Countdown Timer is exactly what I needed for my productivity workflow. Clean interface, reliable functionality, and great notification system.',
    projectId: 'countdown',
    date: '2024-01-05',
    verified: true,
    tags: ['productivity', 'reliability', 'notifications']
  },
  {
    id: 'test-006',
    name: 'Alex Johnson',
    role: 'Full Stack Developer',
    rating: 5,
    content: 'Exceptional code quality and architecture. The TypeScript implementation is clean and the component structure is well-organized. Impressive portfolio!',
    projectId: 'general',
    date: '2024-01-03',
    verified: true,
    tags: ['code-quality', 'architecture', 'typescript']
  },
  {
    id: 'test-007',
    name: 'Rachel Green',
    role: 'Student',
    company: 'University',
    rating: 5,
    content: 'These projects helped me understand React concepts better. The code is well-commented and the implementations are educational. Thank you!',
    projectId: 'general',
    date: '2024-01-01',
    verified: false,
    tags: ['educational', 'react', 'learning']
  },
  {
    id: 'test-008',
    name: 'Michael Brown',
    role: 'Tech Lead',
    company: 'Enterprise Corp',
    rating: 4,
    content: 'Solid technical implementation across all projects. The performance metrics and real-time updates show attention to detail. Great work!',
    projectId: 'general',
    date: '2023-12-28',
    verified: true,
    tags: ['performance', 'technical', 'metrics']
  }
];

export const getTestimonialsByProject = (projectId: string): UserTestimonial[] => {
  return testimonials.filter(testimonial => 
    testimonial.projectId === projectId || testimonial.projectId === 'general'
  );
};

export const getTestimonialStats = (projectId?: string): TestimonialStats => {
  const relevantTestimonials = projectId 
    ? getTestimonialsByProject(projectId)
    : testimonials;
  
  const totalReviews = relevantTestimonials.length;
  const averageRating = relevantTestimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews;
  
  const ratingDistribution = {
    5: relevantTestimonials.filter(t => t.rating === 5).length,
    4: relevantTestimonials.filter(t => t.rating === 4).length,
    3: relevantTestimonials.filter(t => t.rating === 3).length,
    2: relevantTestimonials.filter(t => t.rating === 2).length,
    1: relevantTestimonials.filter(t => t.rating === 1).length,
  };
  
  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution
  };
};

export const getFeaturedTestimonials = (limit: number = 3): UserTestimonial[] => {
  return testimonials
    .filter(t => t.verified && t.rating >= 4)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const getTestimonialsByTag = (tag: string): UserTestimonial[] => {
  return testimonials.filter(testimonial => 
    testimonial.tags.includes(tag)
  );
};

export const addTestimonial = (testimonial: Omit<UserTestimonial, 'id' | 'date' | 'verified'>): UserTestimonial => {
  const newTestimonial: UserTestimonial = {
    ...testimonial,
    id: `test-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    verified: false
  };
  
  testimonials.push(newTestimonial);
  return newTestimonial;
};

export default testimonials;