/**
 * API Utility
 * Handles HTTP requests to the portfolio API
 */

const axios = require('axios');
const chalk = require('chalk');
const config = require('./config');

// Create axios instance with default configuration
const api = axios.create({
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'SOLO-Portfolio-CLI/1.0.0'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get base URL from config
    const baseURL = getBaseURL();
    if (baseURL) {
      config.baseURL = baseURL;
    }
    
    // Add authentication if available
    const auth = getAuthToken();
    if (auth) {
      config.headers.Authorization = `Bearer ${auth}`;
    }
    
    // Add API key if available
    const apiKey = getApiKey();
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }
    
    // Log request in debug mode
    if (isDebugMode()) {
      console.log(chalk.gray(`→ ${config.method.toUpperCase()} ${config.url}`));
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in debug mode
    if (isDebugMode()) {
      console.log(chalk.gray(`← ${response.status} ${response.config.url}`));
    }
    
    return response.data;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          throw new Error('Authentication failed. Please check your credentials.');
        case 403:
          throw new Error('Access denied. You don\'t have permission for this action.');
        case 404:
          throw new Error('Resource not found. Please check the URL or ID.');
        case 429:
          throw new Error('Rate limit exceeded. Please try again later.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data?.message || `HTTP ${status}: ${error.message}`);
      }
    } else if (error.request) {
      // Network error
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to the portfolio API. Is the server running?');
      } else if (error.code === 'ENOTFOUND') {
        throw new Error('Cannot resolve API hostname. Check your internet connection.');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('Request timed out. The server may be overloaded.');
      } else {
        throw new Error(`Network error: ${error.message}`);
      }
    } else {
      // Other error
      throw new Error(`Request failed: ${error.message}`);
    }
  }
);

// Helper functions

function getBaseURL() {
  // Try different sources for base URL
  return (
    process.env.PORTFOLIO_API_URL ||
    config.get('api.baseURL') ||
    'http://localhost:3000/api' // Default fallback
  );
}

function getAuthToken() {
  return (
    process.env.PORTFOLIO_AUTH_TOKEN ||
    config.get('auth.token')
  );
}

function getApiKey() {
  return (
    process.env.PORTFOLIO_API_KEY ||
    config.get('api.key')
  );
}

function isDebugMode() {
  return (
    process.env.DEBUG === 'true' ||
    process.env.NODE_ENV === 'development' ||
    config.get('debug') === true
  );
}

// API methods

/**
 * GET request
 */
async function get(url, options = {}) {
  try {
    return await api.get(url, options);
  } catch (error) {
    throw error;
  }
}

/**
 * POST request
 */
async function post(url, data = {}, options = {}) {
  try {
    return await api.post(url, data, options);
  } catch (error) {
    throw error;
  }
}

/**
 * PUT request
 */
async function put(url, data = {}, options = {}) {
  try {
    return await api.put(url, data, options);
  } catch (error) {
    throw error;
  }
}

/**
 * PATCH request
 */
async function patch(url, data = {}, options = {}) {
  try {
    return await api.patch(url, data, options);
  } catch (error) {
    throw error;
  }
}

/**
 * DELETE request
 */
async function del(url, options = {}) {
  try {
    return await api.delete(url, options);
  } catch (error) {
    throw error;
  }
}

/**
 * Upload file
 */
async function upload(url, file, options = {}) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const config = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'multipart/form-data'
      }
    };
    
    return await api.post(url, formData, config);
  } catch (error) {
    throw error;
  }
}

/**
 * Download file
 */
async function download(url, options = {}) {
  try {
    const config = {
      ...options,
      responseType: 'stream'
    };
    
    return await api.get(url, config);
  } catch (error) {
    throw error;
  }
}

/**
 * Check API health
 */
async function health() {
  try {
    const response = await api.get('/health');
    return {
      status: 'healthy',
      ...response
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

/**
 * Get API version
 */
async function version() {
  try {
    return await api.get('/version');
  } catch (error) {
    throw error;
  }
}

/**
 * Authenticate with the API
 */
async function authenticate(credentials) {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.token) {
      // Store token in config
      config.set('auth.token', response.token);
      config.set('auth.user', response.user);
      
      return {
        success: true,
        token: response.token,
        user: response.user
      };
    }
    
    throw new Error('Authentication failed: No token received');
  } catch (error) {
    throw error;
  }
}

/**
 * Logout and clear authentication
 */
async function logout() {
  try {
    // Try to logout from server
    await api.post('/auth/logout');
  } catch (error) {
    // Ignore server errors during logout
  } finally {
    // Always clear local auth data
    config.delete('auth.token');
    config.delete('auth.user');
  }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  return !!(getAuthToken() && config.get('auth.user'));
}

/**
 * Get current user info
 */
function getCurrentUser() {
  return config.get('auth.user');
}

/**
 * Refresh authentication token
 */
async function refreshToken() {
  try {
    const response = await api.post('/auth/refresh');
    
    if (response.token) {
      config.set('auth.token', response.token);
      return response.token;
    }
    
    throw new Error('Token refresh failed');
  } catch (error) {
    // Clear invalid token
    config.delete('auth.token');
    config.delete('auth.user');
    throw error;
  }
}

/**
 * Set custom headers for requests
 */
function setHeaders(headers) {
  Object.assign(api.defaults.headers, headers);
}

/**
 * Set base URL
 */
function setBaseURL(baseURL) {
  api.defaults.baseURL = baseURL;
  config.set('api.baseURL', baseURL);
}

/**
 * Set timeout
 */
function setTimeout(timeout) {
  api.defaults.timeout = timeout;
  config.set('api.timeout', timeout);
}

/**
 * Create a new API instance with custom config
 */
function createInstance(customConfig = {}) {
  return axios.create({
    ...api.defaults,
    ...customConfig
  });
}

/**
 * Batch requests
 */
async function batch(requests) {
  try {
    const promises = requests.map(request => {
      const { method, url, data, ...options } = request;
      
      switch (method.toLowerCase()) {
        case 'get':
          return get(url, options);
        case 'post':
          return post(url, data, options);
        case 'put':
          return put(url, data, options);
        case 'patch':
          return patch(url, data, options);
        case 'delete':
          return del(url, options);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    });
    
    return await Promise.allSettled(promises);
  } catch (error) {
    throw error;
  }
}

/**
 * Retry a request with exponential backoff
 */
async function retry(requestFn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        break;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      if (isDebugMode()) {
        console.log(chalk.yellow(`Retrying request (attempt ${attempt + 1}/${maxRetries})...`));
      }
    }
  }
  
  throw lastError;
}

module.exports = {
  // Core methods
  get,
  post,
  put,
  patch,
  delete: del,
  
  // File operations
  upload,
  download,
  
  // Utility methods
  health,
  version,
  
  // Authentication
  authenticate,
  logout,
  isAuthenticated,
  getCurrentUser,
  refreshToken,
  
  // Configuration
  setHeaders,
  setBaseURL,
  setTimeout,
  
  // Advanced
  createInstance,
  batch,
  retry,
  
  // Direct access to axios instance
  instance: api
};