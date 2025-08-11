/**
 * Configuration Utility
 * Handles CLI configuration management and persistence
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

// Default configuration
const DEFAULT_CONFIG = {
  api: {
    baseURL: 'http://localhost:3000/api',
    timeout: 30000,
    retries: 3
  },
  auth: {
    token: null,
    user: null
  },
  sync: {
    enabled: false,
    interval: 300,
    conflictResolution: 'prompt',
    dataTypes: ['portfolio', 'analytics', 'games', 'settings']
  },
  display: {
    format: 'table',
    colors: true,
    animations: true,
    pageSize: 10
  },
  analytics: {
    enabled: true,
    anonymous: true
  },
  debug: false,
  version: '1.0.0'
};

// Configuration file paths
const CONFIG_DIR = path.join(os.homedir(), '.solo-portfolio');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const CACHE_DIR = path.join(CONFIG_DIR, 'cache');
const LOGS_DIR = path.join(CONFIG_DIR, 'logs');

// In-memory configuration cache
let configCache = null;

/**
 * Initialize configuration system
 */
function init() {
  try {
    // Ensure config directory exists
    fs.ensureDirSync(CONFIG_DIR);
    fs.ensureDirSync(CACHE_DIR);
    fs.ensureDirSync(LOGS_DIR);
    
    // Load or create config file
    if (!fs.existsSync(CONFIG_FILE)) {
      save(DEFAULT_CONFIG);
    }
    
    // Load config into cache
    load();
    
    return true;
  } catch (error) {
    console.error(chalk.red('Failed to initialize configuration:'), error.message);
    return false;
  }
}

/**
 * Load configuration from file
 */
function load() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const fileContent = fs.readFileSync(CONFIG_FILE, 'utf8');
      const fileConfig = JSON.parse(fileContent);
      
      // Merge with defaults to ensure all keys exist
      configCache = mergeDeep(DEFAULT_CONFIG, fileConfig);
    } else {
      configCache = { ...DEFAULT_CONFIG };
    }
    
    return configCache;
  } catch (error) {
    console.error(chalk.red('Failed to load configuration:'), error.message);
    configCache = { ...DEFAULT_CONFIG };
    return configCache;
  }
}

/**
 * Save configuration to file
 */
function save(config = configCache) {
  try {
    fs.ensureDirSync(CONFIG_DIR);
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    configCache = config;
    return true;
  } catch (error) {
    console.error(chalk.red('Failed to save configuration:'), error.message);
    return false;
  }
}

/**
 * Get configuration value by key path
 */
function get(keyPath, defaultValue = undefined) {
  if (!configCache) {
    load();
  }
  
  if (!keyPath) {
    return configCache;
  }
  
  const keys = keyPath.split('.');
  let value = configCache;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  
  return value;
}

/**
 * Set configuration value by key path
 */
function set(keyPath, value) {
  if (!configCache) {
    load();
  }
  
  const keys = keyPath.split('.');
  let current = configCache;
  
  // Navigate to the parent of the target key
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  // Set the value
  current[keys[keys.length - 1]] = value;
  
  // Save to file
  return save();
}

/**
 * Delete configuration value by key path
 */
function del(keyPath) {
  if (!configCache) {
    load();
  }
  
  const keys = keyPath.split('.');
  let current = configCache;
  
  // Navigate to the parent of the target key
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      return false; // Key doesn't exist
    }
    current = current[key];
  }
  
  // Delete the key
  const targetKey = keys[keys.length - 1];
  if (targetKey in current) {
    delete current[targetKey];
    return save();
  }
  
  return false;
}

/**
 * Check if configuration key exists
 */
function has(keyPath) {
  return get(keyPath) !== undefined;
}

/**
 * Reset configuration to defaults
 */
function reset() {
  try {
    configCache = { ...DEFAULT_CONFIG };
    return save();
  } catch (error) {
    console.error(chalk.red('Failed to reset configuration:'), error.message);
    return false;
  }
}

/**
 * Get all configuration keys
 */
function keys(keyPath = '') {
  const value = get(keyPath);
  
  if (value && typeof value === 'object') {
    return Object.keys(value);
  }
  
  return [];
}

/**
 * Get configuration file path
 */
function getConfigPath() {
  return CONFIG_FILE;
}

/**
 * Get configuration directory path
 */
function getConfigDir() {
  return CONFIG_DIR;
}

/**
 * Get cache directory path
 */
function getCacheDir() {
  return CACHE_DIR;
}

/**
 * Get logs directory path
 */
function getLogsDir() {
  return LOGS_DIR;
}

/**
 * Import configuration from file
 */
function importConfig(filePath) {
  try {
    const importedConfig = fs.readJsonSync(filePath);
    configCache = mergeDeep(DEFAULT_CONFIG, importedConfig);
    return save();
  } catch (error) {
    console.error(chalk.red('Failed to import configuration:'), error.message);
    return false;
  }
}

/**
 * Export configuration to file
 */
function exportConfig(filePath) {
  try {
    fs.writeJsonSync(filePath, configCache, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(chalk.red('Failed to export configuration:'), error.message);
    return false;
  }
}

/**
 * Validate configuration
 */
function validate() {
  const errors = [];
  
  try {
    // Check required fields
    if (!get('api.baseURL')) {
      errors.push('API base URL is required');
    }
    
    // Validate API timeout
    const timeout = get('api.timeout');
    if (timeout && (typeof timeout !== 'number' || timeout < 1000)) {
      errors.push('API timeout must be a number >= 1000ms');
    }
    
    // Validate sync interval
    const syncInterval = get('sync.interval');
    if (syncInterval && (typeof syncInterval !== 'number' || syncInterval < 60)) {
      errors.push('Sync interval must be a number >= 60 seconds');
    }
    
    // Validate display page size
    const pageSize = get('display.pageSize');
    if (pageSize && (typeof pageSize !== 'number' || pageSize < 1 || pageSize > 100)) {
      errors.push('Display page size must be between 1 and 100');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  } catch (error) {
    return {
      valid: false,
      errors: [`Configuration validation failed: ${error.message}`]
    };
  }
}

/**
 * Get configuration schema
 */
function getSchema() {
  return {
    api: {
      baseURL: { type: 'string', required: true, description: 'Portfolio API base URL' },
      timeout: { type: 'number', default: 30000, description: 'Request timeout in milliseconds' },
      retries: { type: 'number', default: 3, description: 'Number of request retries' }
    },
    auth: {
      token: { type: 'string', description: 'Authentication token' },
      user: { type: 'object', description: 'User information' }
    },
    sync: {
      enabled: { type: 'boolean', default: false, description: 'Enable auto-sync' },
      interval: { type: 'number', default: 300, description: 'Sync interval in seconds' },
      conflictResolution: { type: 'string', default: 'prompt', description: 'Conflict resolution strategy' },
      dataTypes: { type: 'array', default: ['portfolio', 'analytics', 'games', 'settings'], description: 'Data types to sync' }
    },
    display: {
      format: { type: 'string', default: 'table', description: 'Default output format' },
      colors: { type: 'boolean', default: true, description: 'Enable colored output' },
      animations: { type: 'boolean', default: true, description: 'Enable animations' },
      pageSize: { type: 'number', default: 10, description: 'Items per page' }
    },
    analytics: {
      enabled: { type: 'boolean', default: true, description: 'Enable analytics collection' },
      anonymous: { type: 'boolean', default: true, description: 'Anonymous analytics' }
    },
    debug: { type: 'boolean', default: false, description: 'Enable debug mode' },
    version: { type: 'string', description: 'Configuration version' }
  };
}

/**
 * Migrate configuration to new version
 */
function migrate() {
  const currentVersion = get('version');
  const targetVersion = DEFAULT_CONFIG.version;
  
  if (currentVersion === targetVersion) {
    return true; // No migration needed
  }
  
  try {
    // Add migration logic here for future versions
    console.log(chalk.yellow(`Migrating configuration from ${currentVersion} to ${targetVersion}...`));
    
    // Update version
    set('version', targetVersion);
    
    console.log(chalk.green('Configuration migrated successfully'));
    return true;
  } catch (error) {
    console.error(chalk.red('Configuration migration failed:'), error.message);
    return false;
  }
}

/**
 * Clear cache
 */
function clearCache() {
  try {
    fs.emptyDirSync(CACHE_DIR);
    return true;
  } catch (error) {
    console.error(chalk.red('Failed to clear cache:'), error.message);
    return false;
  }
}

/**
 * Clear logs
 */
function clearLogs() {
  try {
    fs.emptyDirSync(LOGS_DIR);
    return true;
  } catch (error) {
    console.error(chalk.red('Failed to clear logs:'), error.message);
    return false;
  }
}

/**
 * Get configuration info
 */
function info() {
  return {
    configFile: CONFIG_FILE,
    configDir: CONFIG_DIR,
    cacheDir: CACHE_DIR,
    logsDir: LOGS_DIR,
    version: get('version'),
    size: getConfigSize(),
    lastModified: getLastModified()
  };
}

/**
 * Get configuration file size
 */
function getConfigSize() {
  try {
    const stats = fs.statSync(CONFIG_FILE);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

/**
 * Get last modified time
 */
function getLastModified() {
  try {
    const stats = fs.statSync(CONFIG_FILE);
    return stats.mtime;
  } catch (error) {
    return null;
  }
}

// Helper functions

/**
 * Deep merge objects
 */
function mergeDeep(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

// Initialize configuration on module load
init();

module.exports = {
  // Core methods
  init,
  load,
  save,
  get,
  set,
  delete: del,
  has,
  reset,
  keys,
  
  // Path methods
  getConfigPath,
  getConfigDir,
  getCacheDir,
  getLogsDir,
  
  // Import/Export
  importConfig,
  exportConfig,
  
  // Validation
  validate,
  getSchema,
  
  // Maintenance
  migrate,
  clearCache,
  clearLogs,
  
  // Info
  info,
  
  // Constants
  DEFAULT_CONFIG
};