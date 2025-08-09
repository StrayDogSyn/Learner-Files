/**
 * Example usage of the API Integration Layer
 * This file demonstrates how to use the various API services
 */

import apiService from '../services/apiService';
import type { GitHubStats, CodewarsUser, EmailData, AnalyticsProperties } from '../types/api';

// Example 1: GitHub Integration
export async function exampleGitHubUsage() {
  try {
    // Fetch stats for a specific repository
    const repoStats: GitHubStats | null = await apiService.fetchProjectStats('Learner-Files');
    
    if (repoStats) {
      console.log('Repository Stats:', {
        stars: repoStats.stars,
        forks: repoStats.forks,
        languages: Object.keys(repoStats.languages),
        lastCommit: repoStats.commits[0]?.commit.message
      });
    }

    // Fetch all repositories
    const allRepos = await apiService.fetchAllRepositories();
    console.log(`Found ${allRepos.length} repositories`);

    // Track the GitHub API usage
    await apiService.trackEvent('github_api_usage', {
      action: 'fetch_repo_stats',
      repo: 'Learner-Files',
      success: repoStats !== null
    });

  } catch (error) {
    console.error('GitHub API Error:', error);
    await apiService.trackEvent('github_api_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Example 2: Claude AI Integration
export async function exampleClaudeUsage() {
  try {
    // Simple message to Claude
    const response = await apiService.sendToClaude(
      "Explain the benefits of TypeScript in a modern web development project."
    );
    console.log('Claude Response:', response);

    // Message with context
    const contextualResponse = await apiService.sendToClaude(
      "How can I improve this codebase?",
      {
        projectType: "React TypeScript Portfolio",
        technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
        currentFocus: "API Integration"
      },
      {
        max_tokens: 1500,
        temperature: 0.8
      }
    );
    console.log('Contextual Response:', contextualResponse);

    await apiService.trackEvent('claude_api_usage', {
      prompt_length: contextualResponse.length,
      has_context: true
    });

  } catch (error) {
    console.error('Claude API Error:', error);
  }
}

// Example 3: Analytics Tracking
export async function exampleAnalyticsUsage() {
  // Track page views
  await apiService.trackPageView('/portfolio', {
    section: 'projects',
    user_type: 'visitor'
  });

  // Track user interactions
  await apiService.trackUserInteraction('click', 'project_card', {
    project_name: 'API Integration Layer',
    card_position: 1
  });

  // Track custom events
  const customProperties: AnalyticsProperties = {
    feature: 'dark_mode',
    enabled: true,
    user_preference: 'auto'
  };
  
  await apiService.trackEvent('feature_toggle', customProperties);

  // Track performance metrics
  await apiService.trackEvent('performance_metric', {
    metric: 'page_load_time',
    value: 1247, // milliseconds
    page: '/portfolio'
  });
}

// Example 4: Codewars Integration
export async function exampleCodewarsUsage() {
  try {
    const codewarsData: CodewarsUser | null = await apiService.fetchCodewarsStats('StrayDogSyn');
    
    if (codewarsData) {
      console.log('Codewars Stats:', {
        honor: codewarsData.honor,
        totalCompleted: codewarsData.codeChallenges.totalCompleted,
        overallRank: codewarsData.ranks.overall.name,
        topLanguages: Object.keys(codewarsData.ranks.languages).slice(0, 5)
      });

      await apiService.trackEvent('codewars_data_fetched', {
        honor_points: codewarsData.honor,
        challenges_completed: codewarsData.codeChallenges.totalCompleted
      });
    }
  } catch (error) {
    console.error('Codewars API Error:', error);
  }
}

// Example 5: Email Service
export async function exampleEmailUsage() {
  const emailData: EmailData = {
    to: 'contact@example.com',
    subject: 'Portfolio Contact Form Submission',
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> John Doe</p>
      <p><strong>Email:</strong> john.doe@example.com</p>
      <p><strong>Message:</strong></p>
      <p>I'm interested in discussing a potential project collaboration.</p>
    `,
    text: 'New contact form submission from John Doe (john.doe@example.com): I\'m interested in discussing a potential project collaboration.',
    replyTo: 'john.doe@example.com'
  };

  try {
    const result = await apiService.sendEmail(emailData);
    
    if (result.success) {
      console.log('Email sent successfully:', result.messageId);
      await apiService.trackEvent('email_sent', {
        type: 'contact_form',
        success: true
      });
    } else {
      console.error('Email failed to send:', result.error);
      await apiService.trackEvent('email_sent', {
        type: 'contact_form',
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Email service error:', error);
  }
}

// Example 6: Weather Integration (Bonus Feature)
export async function exampleWeatherUsage() {
  try {
    const weatherData = await apiService.fetchWeather('San Francisco, CA');
    
    if (weatherData) {
      console.log('Current Weather:', {
        city: weatherData.name,
        temperature: `${weatherData.main.temp}°C`,
        condition: weatherData.weather[0]?.description,
        humidity: `${weatherData.main.humidity}%`
      });

      await apiService.trackEvent('weather_data_fetched', {
        location: weatherData.name,
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0]?.main
      });
    }
  } catch (error) {
    console.error('Weather API Error:', error);
  }
}

// Example 7: Service Health Monitoring
export async function exampleHealthCheck() {
  try {
    const healthStatus = await apiService.healthCheck();
    
    console.log('Service Health Status:');
    healthStatus.forEach(service => {
      console.log(`- ${service.service}: ${service.status} (${service.latency}ms)`);
    });

    const unhealthyServices = healthStatus.filter(s => s.status === 'error');
    if (unhealthyServices.length > 0) {
      await apiService.trackEvent('service_health_issue', {
        affected_services: unhealthyServices.map(s => s.service).join(', '),
        total_services_down: unhealthyServices.length
      });
    }
  } catch (error) {
    console.error('Health check error:', error);
  }
}

// Example 8: Cache Management
export async function exampleCacheManagement() {
  // Check cache status
  console.log('Cache Statistics:', {
    totalEntries: apiService.getCacheSize(),
    cacheKeys: apiService.getCacheKeys()
  });

  // Clear specific cache entries
  apiService.clearCache('github_.*'); // Clear all GitHub-related cache entries

  // Clear all cache
  // apiService.clearCache();

  await apiService.trackEvent('cache_management', {
    action: 'clear_github_cache',
    entries_cleared: apiService.getCacheKeys().filter(key => key.startsWith('github_')).length
  });
}

// Example 9: Error Handling and Retry Logic
export async function exampleErrorHandling() {
  try {
    // This might fail due to rate limiting or network issues
    const stats = await apiService.fetchProjectStats('non-existent-repo');
    console.log('Stats:', stats);
  } catch (error) {
    console.error('Expected error for non-existent repo:', error);
    
    // Track error for monitoring
    await apiService.trackEvent('api_error', {
      service: 'github',
      operation: 'fetch_project_stats',
      error_type: error instanceof Error ? error.constructor.name : 'UnknownError',
      error_message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

// Example 10: Batch Operations
export async function exampleBatchOperations() {
  const repositories = ['Learner-Files', 'portfolio-nextjs', 'calculator'];
  
  try {
    // Fetch stats for multiple repositories in parallel
    const statsPromises = repositories.map(repo => 
      apiService.fetchProjectStats(repo).catch(error => {
        console.warn(`Failed to fetch stats for ${repo}:`, error);
        return null;
      })
    );

    const allStats = await Promise.all(statsPromises);
    const successfulFetches = allStats.filter(stats => stats !== null);
    
    console.log(`Successfully fetched stats for ${successfulFetches.length}/${repositories.length} repositories`);

    await apiService.trackEvent('batch_operation', {
      operation: 'fetch_multiple_repo_stats',
      total_repos: repositories.length,
      successful_fetches: successfulFetches.length,
      success_rate: (successfulFetches.length / repositories.length) * 100
    });

  } catch (error) {
    console.error('Batch operation error:', error);
  }
}

// Combined demo function
export async function runAllExamples() {
  console.log('🚀 Starting API Integration Layer Examples...\n');

  await exampleGitHubUsage();
  console.log('✅ GitHub examples completed\n');

  await exampleAnalyticsUsage();
  console.log('✅ Analytics examples completed\n');

  await exampleCodewarsUsage();
  console.log('✅ Codewars examples completed\n');

  await exampleWeatherUsage();
  console.log('✅ Weather examples completed\n');

  await exampleHealthCheck();
  console.log('✅ Health check examples completed\n');

  await exampleCacheManagement();
  console.log('✅ Cache management examples completed\n');

  await exampleErrorHandling();
  console.log('✅ Error handling examples completed\n');

  await exampleBatchOperations();
  console.log('✅ Batch operation examples completed\n');

  // Note: Email and Claude examples require API keys and might incur costs
  console.log('💡 Email and Claude examples skipped (require API keys)\n');
  
  console.log('🎉 All API Integration Layer examples completed!');
}

export default {
  runAllExamples,
  exampleGitHubUsage,
  exampleClaudeUsage,
  exampleAnalyticsUsage,
  exampleCodewarsUsage,
  exampleEmailUsage,
  exampleWeatherUsage,
  exampleHealthCheck,
  exampleCacheManagement,
  exampleErrorHandling,
  exampleBatchOperations
};
