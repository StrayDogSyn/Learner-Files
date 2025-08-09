/**
 * API Integration Tests
 * Tests for GitHub API integration and other external APIs
 */

import { fetchGitHubData, fetchProjectDetails, fetchUserStats } from '../utils/github-integration';

describe('API Integration Tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('GitHub API Integration', () => {
    test('fetchGitHubData returns user repositories', async () => {
      const mockRepos = [
        {
          id: 1,
          name: 'test-repo',
          description: 'A test repository',
          html_url: 'https://github.com/user/test-repo',
          stargazers_count: 10,
          forks_count: 5,
          language: 'JavaScript',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ];

      fetch.mockResponseOnce(JSON.stringify(mockRepos));

      const result = await fetchGitHubData('testuser');
      
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/repos?sort=updated&per_page=100'
      );
      expect(result).toEqual(mockRepos);
    });

    test('fetchGitHubData handles API errors gracefully', async () => {
      fetch.mockRejectOnce(new Error('API Error'));

      const result = await fetchGitHubData('testuser');
      
      expect(result).toEqual([]);
    });

    test('fetchGitHubData handles rate limiting', async () => {
      fetch.mockResponseOnce('', { status: 403 });

      const result = await fetchGitHubData('testuser');
      
      expect(result).toEqual([]);
    });

    test('fetchProjectDetails returns project information', async () => {
      const mockProject = {
        id: 1,
        name: 'test-project',
        description: 'A test project',
        stargazers_count: 15,
        forks_count: 8,
        language: 'TypeScript',
        topics: ['react', 'typescript']
      };

      fetch.mockResponseOnce(JSON.stringify(mockProject));

      const result = await fetchProjectDetails('testuser', 'test-project');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/testuser/test-project'
      );
      expect(result).toEqual(mockProject);
    });

    test('fetchUserStats returns user statistics', async () => {
      const mockUser = {
        login: 'testuser',
        name: 'Test User',
        public_repos: 25,
        followers: 100,
        following: 50
      };

      fetch.mockResponseOnce(JSON.stringify(mockUser));

      const result = await fetchUserStats('testuser');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser'
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('API Error Handling', () => {
    test('handles network errors', async () => {
      fetch.mockRejectOnce(new Error('Network error'));

      const result = await fetchGitHubData('testuser');
      
      expect(result).toEqual([]);
    });

    test('handles invalid JSON responses', async () => {
      fetch.mockResponseOnce('Invalid JSON');

      const result = await fetchGitHubData('testuser');
      
      expect(result).toEqual([]);
    });

    test('handles empty responses', async () => {
      fetch.mockResponseOnce('');

      const result = await fetchGitHubData('testuser');
      
      expect(result).toEqual([]);
    });

    test('handles 404 errors', async () => {
      fetch.mockResponseOnce('', { status: 404 });

      const result = await fetchGitHubData('nonexistentuser');
      
      expect(result).toEqual([]);
    });
  });

  describe('API Caching', () => {
    test('caches API responses', async () => {
      const mockData = [{ id: 1, name: 'repo' }];
      fetch.mockResponseOnce(JSON.stringify(mockData));

      // First call
      await fetchGitHubData('testuser');
      
      // Second call should use cache
      const result = await fetchGitHubData('testuser');
      
      // Should only have made one API call
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    test('respects cache expiration', async () => {
      const mockData = [{ id: 1, name: 'repo' }];
      fetch.mockResponse(JSON.stringify(mockData));

      // Mock date to simulate cache expiration
      const originalDate = Date.now;
      Date.now = jest.fn()
        .mockReturnValueOnce(1000) // First call
        .mockReturnValueOnce(2000) // Second call (within cache time)
        .mockReturnValueOnce(10000); // Third call (after cache expiration)

      await fetchGitHubData('testuser'); // First call
      await fetchGitHubData('testuser'); // Should use cache
      await fetchGitHubData('testuser'); // Should make new API call

      expect(fetch).toHaveBeenCalledTimes(2);
      
      Date.now = originalDate;
    });
  });

  describe('API Rate Limiting', () => {
    test('handles rate limit headers', async () => {
      const mockData = [{ id: 1, name: 'repo' }];
      fetch.mockResponseOnce(JSON.stringify(mockData), {
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': '1640995200'
        }
      });

      const result = await fetchGitHubData('testuser');
      
      expect(result).toEqual(mockData);
    });

    test('delays requests when rate limited', async () => {
      // First request succeeds
      fetch.mockResponseOnce(JSON.stringify([]), { status: 200 });
      
      // Second request is rate limited
      fetch.mockResponseOnce('', { status: 403 });

      await fetchGitHubData('testuser');
      const result = await fetchGitHubData('testuser');
      
      expect(result).toEqual([]);
    });
  });

  describe('Data Transformation', () => {
    test('transforms repository data correctly', async () => {
      const mockRepo = {
        id: 1,
        name: 'test-repo',
        description: 'Test repository',
        html_url: 'https://github.com/user/test-repo',
        stargazers_count: 10,
        forks_count: 5,
        language: 'JavaScript',
        updated_at: '2023-01-01T00:00:00Z',
        topics: ['react', 'frontend']
      };

      fetch.mockResponseOnce(JSON.stringify([mockRepo]));

      const result = await fetchGitHubData('testuser');
      
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'test-repo',
        description: 'Test repository',
        stars: 10,
        forks: 5,
        language: 'JavaScript'
      });
    });

    test('filters out private repositories', async () => {
      const mockRepos = [
        { id: 1, name: 'public-repo', private: false },
        { id: 2, name: 'private-repo', private: true }
      ];

      fetch.mockResponseOnce(JSON.stringify(mockRepos));

      const result = await fetchGitHubData('testuser', { includePrivate: false });
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('public-repo');
    });

    test('sorts repositories by criteria', async () => {
      const mockRepos = [
        { id: 1, name: 'repo-a', stargazers_count: 5, updated_at: '2023-01-01' },
        { id: 2, name: 'repo-b', stargazers_count: 15, updated_at: '2023-02-01' },
        { id: 3, name: 'repo-c', stargazers_count: 10, updated_at: '2023-03-01' }
      ];

      fetch.mockResponseOnce(JSON.stringify(mockRepos));

      const result = await fetchGitHubData('testuser', { sortBy: 'stars' });
      
      expect(result[0].stargazers_count).toBe(15);
      expect(result[1].stargazers_count).toBe(10);
      expect(result[2].stargazers_count).toBe(5);
    });
  });

  describe('Performance', () => {
    test('completes API calls within reasonable time', async () => {
      const mockData = [{ id: 1, name: 'repo' }];
      fetch.mockResponseOnce(JSON.stringify(mockData));

      const startTime = performance.now();
      await fetchGitHubData('testuser');
      const endTime = performance.now();

      // Should complete within 5 seconds
      expect(endTime - startTime).toBeLessThan(5000);
    });

    test('handles concurrent API calls', async () => {
      const mockData = [{ id: 1, name: 'repo' }];
      fetch.mockResponse(JSON.stringify(mockData));

      const promises = [
        fetchGitHubData('user1'),
        fetchGitHubData('user2'),
        fetchGitHubData('user3')
      ];

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('Real API Integration', () => {
    // These tests would run against real APIs in integration environment
    test.skip('fetches real GitHub data', async () => {
      // Skip in unit tests, run in integration tests
      const result = await fetchGitHubData('octocat');
      expect(Array.isArray(result)).toBe(true);
    });

    test.skip('handles real rate limiting', async () => {
      // Skip in unit tests, run in integration tests
      const promises = Array.from({ length: 100 }, () => 
        fetchGitHubData('octocat')
      );
      
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled');
      
      expect(successful.length).toBeGreaterThan(0);
    });
  });
});
