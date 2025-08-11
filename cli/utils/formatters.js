/**
 * Formatters Utility
 * Provides consistent formatting functions for CLI output
 */

const chalk = require('chalk');
const moment = require('moment');

/**
 * Format numbers with thousands separators
 */
function formatNumber(num) {
  if (typeof num !== 'number') {
    return '0';
  }
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toLocaleString();
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format duration in milliseconds to human readable format
 */
function formatDuration(ms) {
  if (typeof ms !== 'number' || ms < 0) {
    return '0s';
  }
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Format percentage
 */
function formatPercentage(value, total, decimals = 1) {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format date/time
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return 'N/A';
  return moment(date).format(format);
}

/**
 * Format relative time (time ago)
 */
function formatRelativeTime(date) {
  if (!date) return 'Never';
  return moment(date).fromNow();
}

/**
 * Format status with colors
 */
function formatStatus(status) {
  const statusMap = {
    active: chalk.green('ACTIVE'),
    inactive: chalk.red('INACTIVE'),
    pending: chalk.yellow('PENDING'),
    draft: chalk.gray('DRAFT'),
    published: chalk.green('PUBLISHED'),
    archived: chalk.gray('ARCHIVED'),
    featured: chalk.cyan('FEATURED'),
    online: chalk.green('ONLINE'),
    offline: chalk.red('OFFLINE'),
    synced: chalk.green('SYNCED'),
    syncing: chalk.yellow('SYNCING'),
    error: chalk.red('ERROR'),
    success: chalk.green('SUCCESS'),
    warning: chalk.yellow('WARNING'),
    info: chalk.blue('INFO')
  };
  
  return statusMap[status.toLowerCase()] || status.toUpperCase();
}

/**
 * Format boolean values
 */
function formatBoolean(value) {
  return value ? chalk.green('✓ Yes') : chalk.red('✗ No');
}

/**
 * Format array as comma-separated list
 */
function formatList(array, maxItems = 3) {
  if (!Array.isArray(array) || array.length === 0) {
    return 'None';
  }
  
  if (array.length <= maxItems) {
    return array.join(', ');
  }
  
  return array.slice(0, maxItems).join(', ') + ` +${array.length - maxItems} more`;
}

/**
 * Format score/rating
 */
function formatScore(score, maxScore = 100) {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) {
    return chalk.green(`${score}/${maxScore}`);
  } else if (percentage >= 70) {
    return chalk.yellow(`${score}/${maxScore}`);
  } else {
    return chalk.red(`${score}/${maxScore}`);
  }
}

/**
 * Format progress bar
 */
function formatProgressBar(current, total, width = 20, showPercentage = true) {
  const percentage = Math.min(current / total, 1);
  const filled = Math.round(percentage * width);
  const empty = width - filled;
  
  const bar = chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  
  if (showPercentage) {
    const percent = Math.round(percentage * 100);
    return `${bar} ${percent}%`;
  }
  
  return bar;
}

/**
 * Format table cell with truncation
 */
function formatTableCell(text, maxLength = 30) {
  if (!text) return '';
  
  const str = String(text);
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Format URL for display
 */
function formatUrl(url, maxLength = 50) {
  if (!url) return 'N/A';
  
  if (url.length <= maxLength) {
    return chalk.blue(url);
  }
  
  return chalk.blue(url.substring(0, maxLength - 3) + '...');
}

/**
 * Format file size with appropriate units
 */
function formatFileSize(size) {
  return formatBytes(size);
}

/**
 * Format version number
 */
function formatVersion(version) {
  if (!version) return 'Unknown';
  return chalk.cyan(`v${version}`);
}

/**
 * Format error message
 */
function formatError(error) {
  if (typeof error === 'string') {
    return chalk.red(`✗ ${error}`);
  }
  
  if (error && error.message) {
    return chalk.red(`✗ ${error.message}`);
  }
  
  return chalk.red('✗ Unknown error');
}

/**
 * Format success message
 */
function formatSuccess(message) {
  return chalk.green(`✓ ${message}`);
}

/**
 * Format warning message
 */
function formatWarning(message) {
  return chalk.yellow(`⚠ ${message}`);
}

/**
 * Format info message
 */
function formatInfo(message) {
  return chalk.blue(`ℹ ${message}`);
}

/**
 * Format JSON with syntax highlighting
 */
function formatJson(obj, indent = 2) {
  const json = JSON.stringify(obj, null, indent);
  
  return json
    .replace(/"([^"]+)":/g, chalk.blue('"$1"') + ':')
    .replace(/: "([^"]*)"/g, ': ' + chalk.green('"$1"'))
    .replace(/: (\d+)/g, ': ' + chalk.yellow('$1'))
    .replace(/: (true|false)/g, ': ' + chalk.magenta('$1'))
    .replace(/: null/g, ': ' + chalk.gray('null'));
}

/**
 * Format command usage
 */
function formatUsage(command, description) {
  return `${chalk.cyan(command)} - ${chalk.gray(description)}`;
}

/**
 * Format key-value pair
 */
function formatKeyValue(key, value, keyColor = 'cyan', valueColor = 'white') {
  return `${chalk[keyColor](key)}: ${chalk[valueColor](value)}`;
}

/**
 * Format header text
 */
function formatHeader(text, level = 1) {
  const colors = [chalk.bold.cyan, chalk.bold.yellow, chalk.bold.green];
  const color = colors[level - 1] || chalk.bold.white;
  
  return color(text);
}

/**
 * Format code block
 */
function formatCode(code, language = '') {
  // Simple syntax highlighting for common languages
  if (language === 'json') {
    return formatJson(JSON.parse(code));
  }
  
  return chalk.gray(code);
}

/**
 * Format diff (added/removed lines)
 */
function formatDiff(line, type) {
  switch (type) {
    case 'added':
      return chalk.green(`+ ${line}`);
    case 'removed':
      return chalk.red(`- ${line}`);
    case 'modified':
      return chalk.yellow(`~ ${line}`);
    default:
      return `  ${line}`;
  }
}

/**
 * Format loading spinner states
 */
function formatSpinner(text, state = 'loading') {
  const spinners = {
    loading: '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏',
    success: '✓',
    error: '✗',
    warning: '⚠'
  };
  
  if (state === 'loading') {
    // This would be used with a spinner library
    return text;
  }
  
  return `${spinners[state]} ${text}`;
}

/**
 * Format badge/tag
 */
function formatBadge(text, color = 'blue') {
  const colors = {
    blue: chalk.blue,
    green: chalk.green,
    yellow: chalk.yellow,
    red: chalk.red,
    gray: chalk.gray,
    cyan: chalk.cyan,
    magenta: chalk.magenta
  };
  
  const colorFn = colors[color] || chalk.blue;
  return colorFn(`[${text}]`);
}

/**
 * Format priority level
 */
function formatPriority(priority) {
  const priorities = {
    low: chalk.green('LOW'),
    medium: chalk.yellow('MEDIUM'),
    high: chalk.red('HIGH'),
    critical: chalk.red.bold('CRITICAL')
  };
  
  return priorities[priority.toLowerCase()] || priority.toUpperCase();
}

/**
 * Format platform name with icon
 */
function formatPlatform(platform) {
  const platforms = {
    web: '🌐 Web',
    mobile: '📱 Mobile',
    desktop: '💻 Desktop',
    pwa: '📲 PWA',
    cli: '⌨️ CLI',
    api: '🔌 API'
  };
  
  return platforms[platform.toLowerCase()] || platform;
}

/**
 * Format metric with trend indicator
 */
function formatMetric(value, previousValue, unit = '') {
  const trend = value > previousValue ? '📈' : value < previousValue ? '📉' : '➡️';
  const change = previousValue ? ((value - previousValue) / previousValue * 100).toFixed(1) : 0;
  
  return `${formatNumber(value)}${unit} ${trend} ${change}%`;
}

/**
 * Format command line arguments
 */
function formatArgs(args) {
  return args.map(arg => {
    if (arg.startsWith('--')) {
      return chalk.green(arg);
    } else if (arg.startsWith('-')) {
      return chalk.yellow(arg);
    } else {
      return chalk.white(arg);
    }
  }).join(' ');
}

module.exports = {
  // Numbers and sizes
  formatNumber,
  formatBytes,
  formatFileSize,
  formatPercentage,
  formatCurrency,
  formatScore,
  formatMetric,
  
  // Time and dates
  formatDuration,
  formatDate,
  formatRelativeTime,
  
  // Status and states
  formatStatus,
  formatBoolean,
  formatPriority,
  formatPlatform,
  
  // Visual elements
  formatProgressBar,
  formatBadge,
  formatSpinner,
  
  // Text formatting
  formatTableCell,
  formatUrl,
  formatVersion,
  formatList,
  formatHeader,
  formatCode,
  formatJson,
  formatDiff,
  
  // Messages
  formatError,
  formatSuccess,
  formatWarning,
  formatInfo,
  
  // Command line
  formatUsage,
  formatKeyValue,
  formatArgs
};