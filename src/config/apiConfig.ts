/**
 * API Service Configuration Helper
 * Provides centralized configuration management for the API Integration Layer
 */

import type { APIServiceConfig } from '../types/api';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Partial<APIServiceConfig> = {
  claudeEndpoint: 'https://api.anthropic.com/v1/messages',
  analyticsEndpoint: '/api/analytics'
};

/**
 * Environment variable mapping for different build tools
 */
const ENV_MAPPINGS = {
  githubToken: ['REACT_APP_GITHUB_TOKEN', 'VITE_GITHUB_TOKEN', 'GITHUB_TOKEN'],
  claudeEndpoint: ['REACT_APP_CLAUDE_ENDPOINT', 'VITE_CLAUDE_ENDPOINT'],
  claudeApiKey: ['REACT_APP_CLAUDE_KEY', 'VITE_CLAUDE_KEY', 'CLAUDE_API_KEY'],
  analyticsEndpoint: ['REACT_APP_ANALYTICS_ENDPOINT', 'VITE_ANALYTICS_ENDPOINT'],
  weatherApiKey: ['REACT_APP_WEATHER_API_KEY', 'VITE_WEATHER_API_KEY', 'OPENWEATHER_API_KEY'],
  defaultFromEmail: ['REACT_APP_DEFAULT_FROM_EMAIL', 'VITE_DEFAULT_FROM_EMAIL', 'DEFAULT_FROM_EMAIL']
};

/**
 * Get environment variable with fallback options
 */
function getEnvVar(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim() !== '') {
      return value.trim();
    }
  }
  return undefined;
}

/**
 * Load configuration from environment variables
 */
export function loadConfig(): APIServiceConfig {
  const config: APIServiceConfig = {
    githubToken: getEnvVar(ENV_MAPPINGS.githubToken),
    claudeEndpoint: getEnvVar(ENV_MAPPINGS.claudeEndpoint) || DEFAULT_CONFIG.claudeEndpoint,
    claudeApiKey: getEnvVar(ENV_MAPPINGS.claudeApiKey),
    analyticsEndpoint: getEnvVar(ENV_MAPPINGS.analyticsEndpoint) || DEFAULT_CONFIG.analyticsEndpoint,
    weatherApiKey: getEnvVar(ENV_MAPPINGS.weatherApiKey),
    defaultFromEmail: getEnvVar(ENV_MAPPINGS.defaultFromEmail)
  };

  return config;
}

/**
 * Validate required configuration
 */
export function validateConfig(config: APIServiceConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // GitHub token is required for most functionality
  if (!config.githubToken) {
    errors.push('GitHub token is required. Set REACT_APP_GITHUB_TOKEN or VITE_GITHUB_TOKEN');
  }

  // Validate email format if provided
  if (config.defaultFromEmail && !isValidEmail(config.defaultFromEmail)) {
    errors.push('Default from email must be a valid email address');
  }

  // Validate URLs if provided
  if (config.claudeEndpoint && !isValidUrl(config.claudeEndpoint)) {
    errors.push('Claude endpoint must be a valid URL');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Check if environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if environment is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get API service features availability
 */
export function getFeatureAvailability(config: APIServiceConfig) {
  return {
    github: !!config.githubToken,
    claude: !!config.claudeApiKey,
    weather: !!config.weatherApiKey,
    email: !!config.defaultFromEmail,
    analytics: !!config.analyticsEndpoint
  };
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Simple URL validation
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Print configuration status (for debugging)
 */
export function printConfigStatus(config: APIServiceConfig): void {
  if (!isDevelopment()) return;

  const features = getFeatureAvailability(config);
  const { valid, errors } = validateConfig(config);

  console.group('🔧 API Service Configuration');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Configuration valid:', valid ? '✅' : '❌');
  
  if (!valid) {
    console.group('❌ Configuration Errors:');
    errors.forEach(error => console.log(`- ${error}`));
    console.groupEnd();
  }

  console.group('🚀 Available Features:');
  Object.entries(features).forEach(([feature, available]) => {
    console.log(`${available ? '✅' : '❌'} ${feature.charAt(0).toUpperCase() + feature.slice(1)}`);
  });
  console.groupEnd();

  console.groupEnd();
}

/**
 * Create a configuration object with validation
 */
export function createConfig(): { config: APIServiceConfig; isValid: boolean; errors: string[] } {
  const config = loadConfig();
  const { valid, errors } = validateConfig(config);
  
  if (isDevelopment()) {
    printConfigStatus(config);
  }

  return {
    config,
    isValid: valid,
    errors
  };
}

export default {
  loadConfig,
  validateConfig,
  isDevelopment,
  isProduction,
  getFeatureAvailability,
  printConfigStatus,
  createConfig
};
