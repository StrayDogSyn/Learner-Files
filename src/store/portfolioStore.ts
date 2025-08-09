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
  
  toggleTheme: () => void;
  toggleAnimations: () => void;
  
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