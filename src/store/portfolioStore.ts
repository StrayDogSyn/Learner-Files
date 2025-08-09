import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Project,
  Skill,
  Experience,
  GitHubEvent,
  CodeSnippet,
  ProjectFilters,
  ExperienceFilters,
  AsyncState
} from '../types/portfolio';

interface PortfolioState {
  // Data
  projects: AsyncState<Project[]>;
  skills: AsyncState<Skill[]>;
  experiences: AsyncState<Experience[]>;
  githubEvents: AsyncState<GitHubEvent[]>;
  codeSnippets: AsyncState<CodeSnippet[]>;
  
  // UI State
  selectedProject: Project | null;
  selectedSkill: Skill | null;
  expandedExperience: string | null;
  activeCodeSnippet: string | null;
  
  // Filters
  projectFilters: ProjectFilters;
  experienceFilters: ExperienceFilters;
  
  // Theme and preferences
  theme: 'light' | 'dark';
  animationsEnabled: boolean;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  setProjectsLoading: (loading: boolean) => void;
  setProjectsError: (error: Error | null) => void;
  
  setSkills: (skills: Skill[]) => void;
  setSkillsLoading: (loading: boolean) => void;
  setSkillsError: (error: Error | null) => void;
  
  setExperiences: (experiences: Experience[]) => void;
  setExperiencesLoading: (loading: boolean) => void;
  setExperiencesError: (error: Error | null) => void;
  
  setGitHubEvents: (events: GitHubEvent[]) => void;
  setGitHubEventsLoading: (loading: boolean) => void;
  setGitHubEventsError: (error: Error | null) => void;
  
  setCodeSnippets: (snippets: CodeSnippet[]) => void;
  setCodeSnippetsLoading: (loading: boolean) => void;
  setCodeSnippetsError: (error: Error | null) => void;
  
  selectProject: (project: Project | null) => void;
  selectSkill: (skill: Skill | null) => void;
  toggleExperience: (id: string) => void;
  setActiveCodeSnippet: (id: string | null) => void;
  
  updateProjectFilters: (filters: Partial<ProjectFilters>) => void;
  updateExperienceFilters: (filters: Partial<ExperienceFilters>) => void;
  clearFilters: () => void;
  
  setTheme: (theme: 'light' | 'dark') => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  toggleTheme: () => void;
  toggleAnimations: () => void;
  
  initializeStore: () => void;
  
  // Computed getters
  getFilteredProjects: () => Project[];
  getFilteredExperiences: () => Experience[];
  getSkillsByCategory: () => Record<string, Skill[]>;
}

const initialAsyncState = <T>(): AsyncState<T[]> => ({
  data: null,
  loading: false,
  error: null
});

const initialProjectFilters: ProjectFilters = {
  technologies: [],
  searchQuery: '',
  featured: undefined
};

const initialExperienceFilters: ExperienceFilters = {
  type: undefined,
  technologies: undefined
};

export const usePortfolioStore = create<PortfolioState>()(devtools(
  (set, get) => ({
    // Initial state
    projects: initialAsyncState<Project>(),
    skills: initialAsyncState<Skill>(),
    experiences: initialAsyncState<Experience>(),
    githubEvents: initialAsyncState<GitHubEvent>(),
    codeSnippets: initialAsyncState<CodeSnippet>(),
    
    selectedProject: null,
    selectedSkill: null,
    expandedExperience: null,
    activeCodeSnippet: null,
    
    projectFilters: initialProjectFilters,
    experienceFilters: initialExperienceFilters,
    
    theme: 'light',
    animationsEnabled: true,
    
    // Project actions
    setProjects: (projects) => set(
      (state) => ({
        projects: { ...state.projects, data: projects, loading: false, error: null }
      }),
      false,
      'setProjects'
    ),
    
    setProjectsLoading: (loading) => set(
      (state) => ({
        projects: { ...state.projects, loading }
      }),
      false,
      'setProjectsLoading'
    ),
    
    setProjectsError: (error) => set(
      (state) => ({
        projects: { ...state.projects, error, loading: false }
      }),
      false,
      'setProjectsError'
    ),
    
    // Skills actions
    setSkills: (skills) => set(
      (state) => ({
        skills: { ...state.skills, data: skills, loading: false, error: null }
      }),
      false,
      'setSkills'
    ),
    
    setSkillsLoading: (loading) => set(
      (state) => ({
        skills: { ...state.skills, loading }
      }),
      false,
      'setSkillsLoading'
    ),
    
    setSkillsError: (error) => set(
      (state) => ({
        skills: { ...state.skills, error, loading: false }
      }),
      false,
      'setSkillsError'
    ),
    
    // Experience actions
    setExperiences: (experiences) => set(
      (state) => ({
        experiences: { ...state.experiences, data: experiences, loading: false, error: null }
      }),
      false,
      'setExperiences'
    ),
    
    setExperiencesLoading: (loading) => set(
      (state) => ({
        experiences: { ...state.experiences, loading }
      }),
      false,
      'setExperiencesLoading'
    ),
    
    setExperiencesError: (error) => set(
      (state) => ({
        experiences: { ...state.experiences, error, loading: false }
      }),
      false,
      'setExperiencesError'
    ),
    
    // GitHub events actions
    setGitHubEvents: (events) => set(
      (state) => ({
        githubEvents: { ...state.githubEvents, data: events, loading: false, error: null }
      }),
      false,
      'setGitHubEvents'
    ),
    
    setGitHubEventsLoading: (loading) => set(
      (state) => ({
        githubEvents: { ...state.githubEvents, loading }
      }),
      false,
      'setGitHubEventsLoading'
    ),
    
    setGitHubEventsError: (error) => set(
      (state) => ({
        githubEvents: { ...state.githubEvents, error, loading: false }
      }),
      false,
      'setGitHubEventsError'
    ),
    
    // Code snippets actions
    setCodeSnippets: (snippets) => set(
      (state) => ({
        codeSnippets: { ...state.codeSnippets, data: snippets, loading: false, error: null }
      }),
      false,
      'setCodeSnippets'
    ),
    
    setCodeSnippetsLoading: (loading) => set(
      (state) => ({
        codeSnippets: { ...state.codeSnippets, loading }
      }),
      false,
      'setCodeSnippetsLoading'
    ),
    
    setCodeSnippetsError: (error) => set(
      (state) => ({
        codeSnippets: { ...state.codeSnippets, error, loading: false }
      }),
      false,
      'setCodeSnippetsError'
    ),
    
    // UI state actions
    selectProject: (project) => set({ selectedProject: project }, false, 'selectProject'),
    selectSkill: (skill) => set({ selectedSkill: skill }, false, 'selectSkill'),
    
    toggleExperience: (id) => set(
      (state) => ({
        expandedExperience: state.expandedExperience === id ? null : id
      }),
      false,
      'toggleExperience'
    ),
    
    setActiveCodeSnippet: (id) => set(
      { activeCodeSnippet: id },
      false,
      'setActiveCodeSnippet'
    ),
    
    // Filter actions
    updateProjectFilters: (filters) => set(
      (state) => ({
        projectFilters: { ...state.projectFilters, ...filters }
      }),
      false,
      'updateProjectFilters'
    ),
    
    updateExperienceFilters: (filters) => set(
      (state) => ({
        experienceFilters: { ...state.experienceFilters, ...filters }
      }),
      false,
      'updateExperienceFilters'
    ),
    
    clearFilters: () => set(
      {
        projectFilters: initialProjectFilters,
        experienceFilters: initialExperienceFilters
      },
      false,
      'clearFilters'
    ),
    
    // Theme actions
    setTheme: (theme) => set({ theme }, false, 'setTheme'),
    
    setAnimationsEnabled: (enabled) => set(
      { animationsEnabled: enabled },
      false,
      'setAnimationsEnabled'
    ),
    
    toggleTheme: () => set(
      (state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }),
      false,
      'toggleTheme'
    ),
    
    toggleAnimations: () => set(
      (state) => ({ animationsEnabled: !state.animationsEnabled }),
      false,
      'toggleAnimations'
    ),
    
    // Initialize store with mock data
    initializeStore: () => {
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'Interactive Portfolio',
          description: 'A modern portfolio showcasing interactive components with React, TypeScript, and Framer Motion',
          technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
          githubUrl: 'https://github.com/octocat/interactive-portfolio',
          liveUrl: 'https://portfolio.example.com',
          imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20portfolio%20website%20interface%20with%20dark%20theme%20and%20interactive%20elements&image_size=landscape_16_9',
          featured: true,
          status: 'completed',
          startDate: '2024-01-01',
          endDate: '2024-01-15'
        },
        {
          id: '2',
          title: 'Task Management App',
          description: 'Full-stack task management application with real-time collaboration features',
          technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Socket.io'],
          githubUrl: 'https://github.com/octocat/task-manager',
          liveUrl: 'https://tasks.example.com',
          imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=task%20management%20dashboard%20interface%20with%20kanban%20boards%20and%20charts&image_size=landscape_16_9',
          featured: true,
          status: 'completed',
          startDate: '2023-11-01',
          endDate: '2023-12-15'
        },
        {
          id: '3',
          title: 'E-commerce Platform',
          description: 'Modern e-commerce solution with payment integration and inventory management',
          technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Stripe'],
          githubUrl: 'https://github.com/octocat/ecommerce',
          imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=ecommerce%20website%20product%20catalog%20with%20shopping%20cart%20interface&image_size=landscape_16_9',
          featured: false,
          status: 'in-progress',
          startDate: '2024-01-20'
        }
      ];
      
      const mockSkills: Skill[] = [
        {
          id: '1',
          name: 'React',
          category: 'Frontend',
          proficiency: 90,
          yearsOfExperience: 4,
          description: 'Advanced React development with hooks, context, and modern patterns',
          relatedProjects: ['1', '2']
        },
        {
          id: '2',
          name: 'TypeScript',
          category: 'Programming Languages',
          proficiency: 85,
          yearsOfExperience: 3,
          description: 'Strong typing and advanced TypeScript features for scalable applications',
          relatedProjects: ['1', '2']
        },
        {
          id: '3',
          name: 'Node.js',
          category: 'Backend',
          proficiency: 80,
          yearsOfExperience: 3,
          description: 'Server-side JavaScript development with Express.js and various databases',
          relatedProjects: ['2', '3']
        },
        {
          id: '4',
          name: 'PostgreSQL',
          category: 'Database',
          proficiency: 75,
          yearsOfExperience: 2,
          description: 'Relational database design, optimization, and complex queries',
          relatedProjects: ['2']
        },
        {
          id: '5',
          name: 'AWS',
          category: 'Cloud',
          proficiency: 70,
          yearsOfExperience: 2,
          description: 'Cloud infrastructure, deployment, and serverless architectures',
          relatedProjects: ['1', '2']
        }
      ];
      
      const mockExperiences: Experience[] = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: 'Tech Innovations Inc.',
          type: 'work',
          startDate: '2022-01-01',
          endDate: '2024-01-01',
          description: 'Led frontend development for multiple client projects using React and TypeScript',
          technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
          achievements: [
            'Improved application performance by 40%',
            'Mentored 3 junior developers',
            'Implemented design system used across 5 projects'
          ],
          media: [
            {
              type: 'image',
              url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20office%20workspace%20with%20developers%20coding&image_size=landscape_4_3',
              caption: 'Team collaboration at Tech Innovations'
            }
          ]
        },
        {
          id: '2',
          title: 'Full Stack Developer',
          company: 'StartupXYZ',
          type: 'work',
          startDate: '2020-06-01',
          endDate: '2021-12-31',
          description: 'Built and maintained full-stack applications from concept to deployment',
          technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Docker'],
          achievements: [
            'Developed MVP that secured $2M in funding',
            'Reduced server costs by 30% through optimization',
            'Built CI/CD pipeline reducing deployment time by 60%'
          ],
          media: [
            {
              type: 'link',
              url: 'https://startupxyz.com',
              caption: 'StartupXYZ Platform'
            }
          ]
        }
      ];
      
      const mockCodeSnippets: CodeSnippet[] = [
        {
          id: '1',
          title: 'React Custom Hook for API Calls',
          language: 'typescript',
          code: `import { useState, useEffect } from 'react';\n\ninterface UseApiResult<T> {\n  data: T | null;\n  loading: boolean;\n  error: Error | null;\n}\n\nexport function useApi<T>(url: string): UseApiResult<T> {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<Error | null>(null);\n\n  useEffect(() => {\n    const fetchData = async () => {\n      try {\n        setLoading(true);\n        const response = await fetch(url);\n        if (!response.ok) {\n          throw new Error('Failed to fetch data');\n        }\n        const result = await response.json();\n        setData(result);\n      } catch (err) {\n        setError(err as Error);\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    fetchData();\n  }, [url]);\n\n  return { data, loading, error };\n}`,
          description: 'A reusable custom hook for making API calls with loading and error states',
          tags: ['React', 'TypeScript', 'Hooks'],
          featured: true
        },
        {
          id: '2',
          title: 'Debounced Search Function',
          language: 'javascript',
          code: `function debounce(func, delay) {\n  let timeoutId;\n  \n  return function (...args) {\n    clearTimeout(timeoutId);\n    \n    timeoutId = setTimeout(() => {\n      func.apply(this, args);\n    }, delay);\n  };\n}\n\n// Usage example\nconst debouncedSearch = debounce((query) => {\n  console.log('Searching for:', query);\n  // Perform search operation\n}, 300);\n\n// Call the debounced function\ndebouncedSearch('react');\ndebouncedSearch('react hooks'); // Only this will execute after 300ms`,
          description: 'Utility function to debounce rapid function calls, useful for search inputs',
          tags: ['JavaScript', 'Performance', 'Utility'],
          featured: false
        },
        {
          id: '3',
          title: 'CSS Grid Auto-Fit Layout',
          language: 'css',
          code: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1rem;\n  padding: 1rem;\n}\n\n.grid-item {\n  background: #f0f0f0;\n  border-radius: 8px;\n  padding: 1rem;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  transition: transform 0.2s ease;\n}\n\n.grid-item:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);\n}`,
          description: 'Responsive CSS Grid layout that automatically adjusts columns based on available space',
          tags: ['CSS', 'Grid', 'Responsive'],
          featured: true
        }
      ];
      
      // Set all the mock data
      set((state) => ({
        projects: { ...state.projects, data: mockProjects },
        skills: { ...state.skills, data: mockSkills },
        experiences: { ...state.experiences, data: mockExperiences },
        codeSnippets: { ...state.codeSnippets, data: mockCodeSnippets }
      }), false, 'initializeStore');
    },
    
    // Computed getters
    getFilteredProjects: () => {
      const { projects, projectFilters } = get();
      if (!projects.data) return [];
      
      return projects.data.filter((project) => {
        // Search query filter
        if (projectFilters.searchQuery) {
          const query = projectFilters.searchQuery.toLowerCase();
          const matchesTitle = project.title.toLowerCase().includes(query);
          const matchesDescription = project.description.toLowerCase().includes(query);
          const matchesTech = project.technologies.some(tech => 
            tech.toLowerCase().includes(query)
          );
          
          if (!matchesTitle && !matchesDescription && !matchesTech) {
            return false;
          }
        }
        
        // Technology filter
        if (projectFilters.technologies.length > 0) {
          const hasMatchingTech = projectFilters.technologies.some(tech =>
            project.technologies.includes(tech)
          );
          if (!hasMatchingTech) return false;
        }
        
        // Featured filter
        if (projectFilters.featured !== undefined) {
          if (project.featured !== projectFilters.featured) return false;
        }
        
        return true;
      });
    },
    
    getFilteredExperiences: () => {
      const { experiences, experienceFilters } = get();
      if (!experiences.data) return [];
      
      return experiences.data.filter((experience) => {
        // Type filter
        if (experienceFilters.type && experience.type !== experienceFilters.type) {
          return false;
        }
        
        // Technology filter
        if (experienceFilters.technologies && experienceFilters.technologies.length > 0) {
          const hasMatchingTech = experienceFilters.technologies.some(tech =>
            experience.technologies.includes(tech)
          );
          if (!hasMatchingTech) return false;
        }
        
        return true;
      });
    },
    
    getSkillsByCategory: () => {
      const { skills } = get();
      if (!skills.data) return {};
      
      return skills.data.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, Skill[]>);
    }
  }),
  {
    name: 'portfolio-store'
  }
));

// Selectors for better performance
export const useProjects = () => usePortfolioStore((state) => state.projects);
export const useSkills = () => usePortfolioStore((state) => state.skills);
export const useExperiences = () => usePortfolioStore((state) => state.experiences);
export const useGitHubEvents = () => usePortfolioStore((state) => state.githubEvents);
export const useCodeSnippets = () => usePortfolioStore((state) => state.codeSnippets);

export const useSelectedProject = () => usePortfolioStore((state) => state.selectedProject);
export const useSelectedSkill = () => usePortfolioStore((state) => state.selectedSkill);
export const useExpandedExperience = () => usePortfolioStore((state) => state.expandedExperience);
export const useActiveCodeSnippet = () => usePortfolioStore((state) => state.activeCodeSnippet);

export const useProjectFilters = () => usePortfolioStore((state) => state.projectFilters);
export const useExperienceFilters = () => usePortfolioStore((state) => state.experienceFilters);

export const useTheme = () => usePortfolioStore((state) => state.theme);
export const useAnimationsEnabled = () => usePortfolioStore((state) => state.animationsEnabled);