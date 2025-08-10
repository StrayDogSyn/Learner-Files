import { useState, useEffect } from 'react';
import { githubApi, GitHubStats } from '../services/githubApi';
import { Project } from '../data/projects';

export interface ProjectWithStats extends Project {
  githubStats?: GitHubStats;
  isLoadingStats?: boolean;
  statsError?: string;
}

/**
 * Custom hook to fetch GitHub statistics for a single repository
 * @param repoPath - Repository path in format 'owner/repo'
 * @returns Object with stats, loading state, and error
 */
export function useGitHubStats(repoPath: string | undefined) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repoPath) return;

    setIsLoading(true);
    setError(null);

    githubApi.getRepoStats(repoPath)
      .then(data => {
        setStats(data);
        if (!data) {
          setError('Failed to fetch repository statistics');
        }
      })
      .catch(err => {
        setError(err.message || 'An error occurred while fetching stats');
        setStats(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [repoPath]);

  return { stats, isLoading, error };
}

/**
 * Custom hook to fetch GitHub statistics for multiple projects
 * @param projects - Array of projects with githubRepo property
 * @returns Array of projects enhanced with GitHub statistics
 */
export function useProjectsWithStats(projects: Project[]): {
  projectsWithStats: ProjectWithStats[];
  isLoading: boolean;
  hasErrors: boolean;
} {
  const [projectsWithStats, setProjectsWithStats] = useState<ProjectWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    if (!projects.length) return;

    setIsLoading(true);
    setHasErrors(false);

    // Initialize projects with loading state
    const initialProjects: ProjectWithStats[] = projects.map(project => ({
      ...project,
      isLoadingStats: !!project.githubRepo,
      statsError: undefined
    }));
    setProjectsWithStats(initialProjects);

    // Fetch stats for projects with GitHub repos
    const projectsWithRepos = projects.filter(p => p.githubRepo);
    const repoPaths = projectsWithRepos.map(p => p.githubRepo!);

    if (repoPaths.length === 0) {
      setIsLoading(false);
      return;
    }

    githubApi.getMultipleRepoStats(repoPaths)
      .then(statsArray => {
        const updatedProjects = projects.map(project => {
          if (!project.githubRepo) {
            return { ...project };
          }

          const repoIndex = repoPaths.indexOf(project.githubRepo);
          const stats = statsArray[repoIndex];

          return {
            ...project,
            githubStats: stats || undefined,
            isLoadingStats: false,
            statsError: stats ? undefined : 'Failed to load GitHub stats'
          };
        });

        setProjectsWithStats(updatedProjects);
        setHasErrors(statsArray.some(stat => stat === null));
      })
      .catch(error => {
        console.error('Error fetching multiple repo stats:', error);
        const errorProjects = projects.map(project => ({
          ...project,
          isLoadingStats: false,
          statsError: project.githubRepo ? 'Failed to load GitHub stats' : undefined
        }));
        setProjectsWithStats(errorProjects);
        setHasErrors(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [projects]);

  return { projectsWithStats, isLoading, hasErrors };
}

/**
 * Custom hook for searching GitHub repositories
 * @returns Object with search function, results, loading state, and error
 */
export function useGitHubSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (
    query: string,
    sort: 'stars' | 'forks' | 'updated' = 'stars',
    order: 'asc' | 'desc' = 'desc'
  ) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await githubApi.searchRepositories(query, sort, order);
      setResults(searchResults);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    isLoading,
    error,
    search,
    clearResults
  };
}