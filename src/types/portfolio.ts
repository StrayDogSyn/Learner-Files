// Core data types for interactive portfolio components

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  startDate: string;
  endDate?: string;
  starCount?: number;
  lastUpdated?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Programming Languages' | 'Database' | 'Cloud';
  proficiency: number; // 0-100
  yearsOfExperience: number;
  description?: string;
  relatedProjects?: string[]; // Project IDs
}

export interface SkillCategory {
  id: string;
  name: 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Programming Languages' | 'Database' | 'Cloud';
  skills: Skill[];
  color: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  type: 'work' | 'project' | 'achievement';
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  achievements?: string[];
  media?: MediaItem[];
}

export interface MediaItem {
  id?: string;
  type: 'image' | 'video' | 'link';
  url: string;
  title?: string;
  caption?: string;
  description?: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
  payload: any;
}

export interface Repository {
  id: string;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
  topics: string[];
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string;
  executable?: boolean;
  featured?: boolean;
  tags: string[];
}

// Animation variants for Framer Motion
export interface AnimationVariants {
  hidden: any;
  visible: any;
  hover?: any;
  exit?: any;
}

// API Response types
export interface GitHubRepoResponse {
  stargazers_count: number;
  updated_at: string;
  language: string;
  topics: string[];
  description: string;
  html_url: string;
}

export interface GitHubUserEventsResponse {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
  payload: any;
}

// AI Integration types
export interface SkillDescriptionRequest {
  skill: string;
  experience_level: string;
  context?: string;
}

export interface SkillDescriptionResponse {
  description: string;
  examples: string[];
}

export interface CodeExplanationRequest {
  code: string;
  language: string;
  complexity?: string;
}

export interface CodeExplanationResponse {
  explanation: string;
  key_concepts: string[];
  suggestions: string[];
}

// Filter and search types
export interface ProjectFilters {
  technologies: string[];
  searchQuery: string;
  featured?: boolean;
}

export interface ExperienceFilters {
  type?: 'work' | 'project' | 'achievement';
  technologies?: string[];
}

// Loading and error states
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Component props interfaces
export interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export interface SkillProgressBarProps {
  skill: Skill;
  animated?: boolean;
  onClick?: (skill: Skill) => void;
}

export interface TimelineEntryProps {
  experience: Experience;
  isExpanded?: boolean;
  onToggle: (id: string) => void;
}

export interface CodeBlockProps {
  snippet: CodeSnippet;
  onExecute?: (code: string) => void;
  onExplain?: (code: string, language: string) => void;
}

export interface ActivityItemProps {
  event: GitHubEvent;
  showRepo?: boolean;
}