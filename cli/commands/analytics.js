/**
 * Analytics Commands
 * Handles portfolio analytics, insights, and reporting
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { table } = require('table');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const boxen = require('boxen');
const Chart = require('cli-chart');

const api = require('../utils/api');
const config = require('../utils/config');
const { formatBytes, formatDuration, formatNumber } = require('../utils/formatters');

/**
 * Show analytics commands help
 */
function showHelp() {
  console.log(
    boxen(
      `${chalk.bold.cyan('Analytics & Insights Commands')}\n\n` +
      `${chalk.yellow('Overview:')}\n` +
      `  solo analytics:overview       Portfolio analytics overview\n` +
      `  solo analytics:dashboard      Interactive analytics dashboard\n\n` +
      `${chalk.green('Detailed Reports:')}\n` +
      `  solo analytics:visitors       Visitor analytics\n` +
      `  solo analytics:projects       Project performance\n` +
      `  solo analytics:platforms      Cross-platform usage\n` +
      `  solo analytics:engagement     User engagement metrics\n\n` +
      `${chalk.blue('Data Export:')}\n` +
      `  solo analytics:export         Export analytics data\n` +
      `  solo analytics:report         Generate detailed report\n` +
      `  solo analytics:trends         Show usage trends`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
      }
    )
  );
}

/**
 * Show analytics overview
 */
async function overview(options) {
  const spinner = ora('Fetching analytics overview...').start();
  
  try {
    const analytics = await api.get('/analytics/overview', {
      params: {
        period: options.period || '30d',
        timezone: options.timezone || 'UTC'
      }
    });
    
    spinner.succeed('Analytics loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(analytics, null, 2));
      return;
    }
    
    displayOverview(analytics, options.period);
    
  } catch (error) {
    spinner.fail('Failed to fetch analytics');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Interactive analytics dashboard
 */
async function dashboard() {
  console.log(chalk.cyan('📊 Portfolio Analytics Dashboard\n'));
  
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Select analytics view:',
        choices: [
          { name: '📈 Overview', value: 'overview' },
          { name: '👥 Visitors', value: 'visitors' },
          { name: '🚀 Projects', value: 'projects' },
          { name: '📱 Platforms', value: 'platforms' },
          { name: '⚡ Performance', value: 'performance' },
          { name: '🎯 Goals', value: 'goals' },
          { name: '📊 Custom Query', value: 'custom' },
          { name: '🚪 Exit', value: 'exit' }
        ]
      }
    ]);
    
    if (action === 'exit') {
      console.log(chalk.green('👋 Goodbye!'));
      break;
    }
    
    await handleDashboardAction(action);
    
    // Wait for user input before continuing
    await inquirer.prompt([{
      type: 'input',
      name: 'continue',
      message: 'Press Enter to continue...'
    }]);
    
    console.clear();
  }
}

/**
 * Show visitor analytics
 */
async function visitors(options) {
  const spinner = ora('Analyzing visitor data...').start();
  
  try {
    const visitorData = await api.get('/analytics/visitors', {
      params: {
        period: options.period || '30d',
        breakdown: options.breakdown || 'daily'
      }
    });
    
    spinner.succeed('Visitor data loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(visitorData, null, 2));
      return;
    }
    
    displayVisitorAnalytics(visitorData, options);
    
  } catch (error) {
    spinner.fail('Failed to fetch visitor data');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show project performance analytics
 */
async function projects(options) {
  const spinner = ora('Analyzing project performance...').start();
  
  try {
    const projectData = await api.get('/analytics/projects', {
      params: {
        period: options.period || '30d',
        sort: options.sort || 'views',
        limit: options.limit || 10
      }
    });
    
    spinner.succeed('Project data loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(projectData, null, 2));
      return;
    }
    
    displayProjectAnalytics(projectData, options);
    
  } catch (error) {
    spinner.fail('Failed to fetch project data');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show cross-platform usage analytics
 */
async function platforms(options) {
  const spinner = ora('Analyzing platform usage...').start();
  
  try {
    const platformData = await api.get('/analytics/platforms', {
      params: {
        period: options.period || '30d'
      }
    });
    
    spinner.succeed('Platform data loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(platformData, null, 2));
      return;
    }
    
    displayPlatformAnalytics(platformData, options);
    
  } catch (error) {
    spinner.fail('Failed to fetch platform data');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show engagement metrics
 */
async function engagement(options) {
  const spinner = ora('Analyzing user engagement...').start();
  
  try {
    const engagementData = await api.get('/analytics/engagement', {
      params: {
        period: options.period || '30d',
        metrics: options.metrics || 'all'
      }
    });
    
    spinner.succeed('Engagement data loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(engagementData, null, 2));
      return;
    }
    
    displayEngagementAnalytics(engagementData, options);
    
  } catch (error) {
    spinner.fail('Failed to fetch engagement data');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Export analytics data
 */
async function exportAnalytics(options) {
  const spinner = ora('Preparing analytics export...').start();
  
  try {
    // Determine what to include
    const includes = options.include ? options.include.split(',') : ['overview', 'visitors', 'projects'];
    
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        period: options.period || '30d',
        includes
      }
    };
    
    // Fetch data based on includes
    for (const include of includes) {
      spinner.text = `Fetching ${include} data...`;
      exportData[include] = await api.get(`/analytics/${include}`, {
        params: { period: options.period || '30d' }
      });
    }
    
    spinner.text = 'Generating export file...';
    
    // Generate output file
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const defaultFilename = `analytics-export-${timestamp}.${options.format}`;
    const outputPath = options.output || defaultFilename;
    
    switch (options.format) {
      case 'json':
        await fs.writeJson(outputPath, exportData, { spaces: 2 });
        break;
      case 'csv':
        await exportToCSV(exportData, outputPath);
        break;
      case 'xlsx':
        await exportToExcel(exportData, outputPath);
        break;
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
    
    spinner.succeed(`Analytics exported to ${outputPath}`);
    
    // Show export summary
    const stats = await fs.stat(outputPath);
    console.log(
      boxen(
        `${chalk.green('📊 Analytics Export Complete')}\n\n` +
        `${chalk.bold('File:')} ${outputPath}\n` +
        `${chalk.bold('Size:')} ${formatBytes(stats.size)}\n` +
        `${chalk.bold('Format:')} ${options.format.toUpperCase()}\n` +
        `${chalk.bold('Period:')} ${options.period || '30d'}\n` +
        `${chalk.bold('Includes:')} ${includes.join(', ')}`,
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green'
        }
      )
    );
    
  } catch (error) {
    spinner.fail('Export failed');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Generate detailed analytics report
 */
async function generateReport(options) {
  const spinner = ora('Generating analytics report...').start();
  
  try {
    const reportData = await api.get('/analytics/report', {
      params: {
        period: options.period || '30d',
        format: 'detailed'
      }
    });
    
    spinner.succeed('Report generated');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(reportData, null, 2));
      return;
    }
    
    displayDetailedReport(reportData, options);
    
  } catch (error) {
    spinner.fail('Failed to generate report');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show usage trends
 */
async function trends(options) {
  const spinner = ora('Analyzing usage trends...').start();
  
  try {
    const trendData = await api.get('/analytics/trends', {
      params: {
        period: options.period || '90d',
        metric: options.metric || 'visitors'
      }
    });
    
    spinner.succeed('Trend data loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(trendData, null, 2));
      return;
    }
    
    displayTrendAnalysis(trendData, options);
    
  } catch (error) {
    spinner.fail('Failed to fetch trend data');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

// Display functions

function displayOverview(analytics, period) {
  const periodLabel = getPeriodLabel(period);
  
  console.log(
    boxen(
      `${chalk.bold.cyan('📊 Portfolio Analytics Overview')} ${chalk.gray(`(${periodLabel})`)}\n\n` +
      `${chalk.yellow('👥 Visitors:')}\n` +
      `  Total: ${chalk.bold(formatNumber(analytics.visitors.total))}\n` +
      `  Unique: ${chalk.bold(formatNumber(analytics.visitors.unique))}\n` +
      `  Returning: ${chalk.bold(formatNumber(analytics.visitors.returning))} (${getPercentage(analytics.visitors.returning, analytics.visitors.total)})\n\n` +
      `${chalk.green('📈 Engagement:')}\n` +
      `  Page Views: ${chalk.bold(formatNumber(analytics.pageViews))}\n` +
      `  Avg. Session: ${chalk.bold(formatDuration(analytics.avgSessionDuration))}\n` +
      `  Bounce Rate: ${chalk.bold(analytics.bounceRate)}%\n\n` +
      `${chalk.blue('🚀 Top Projects:')}\n` +
      analytics.topProjects.slice(0, 3).map(project => 
        `  ${project.name}: ${formatNumber(project.views)} views`
      ).join('\n') + '\n\n' +
      `${chalk.magenta('📱 Platforms:')}\n` +
      `  Web: ${analytics.platforms.web}%\n` +
      `  Mobile: ${analytics.platforms.mobile}%\n` +
      `  Desktop: ${analytics.platforms.desktop}%`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
      }
    )
  );
  
  // Show trend indicators
  if (analytics.trends) {
    console.log('\n' + chalk.bold('📈 Trends:'));
    displayTrendIndicators(analytics.trends);
  }
}

function displayVisitorAnalytics(data, options) {
  console.log(chalk.bold.cyan('👥 Visitor Analytics\n'));
  
  // Summary stats
  console.log(
    boxen(
      `${chalk.bold('Summary:')}\n` +
      `Total Visitors: ${chalk.green(formatNumber(data.summary.total))}\n` +
      `Unique Visitors: ${chalk.blue(formatNumber(data.summary.unique))}\n` +
      `New Visitors: ${chalk.yellow(formatNumber(data.summary.new))}\n` +
      `Returning Visitors: ${chalk.magenta(formatNumber(data.summary.returning))}`,
      { padding: 1, borderStyle: 'round' }
    )
  );
  
  // Geographic breakdown
  if (data.geographic && data.geographic.length > 0) {
    console.log('\n' + chalk.bold('🌍 Geographic Distribution:'));
    displayGeographicTable(data.geographic);
  }
  
  // Time-based breakdown
  if (data.timeline && data.timeline.length > 0) {
    console.log('\n' + chalk.bold('⏰ Timeline:'));
    displayTimelineChart(data.timeline, 'visitors');
  }
}

function displayProjectAnalytics(data, options) {
  console.log(chalk.bold.cyan('🚀 Project Performance Analytics\n'));
  
  if (data.projects && data.projects.length > 0) {
    const tableData = [
      ['Rank', 'Project', 'Views', 'Unique', 'Avg. Time', 'Bounce Rate']
    ];
    
    data.projects.forEach((project, index) => {
      tableData.push([
        (index + 1).toString(),
        project.name,
        formatNumber(project.views),
        formatNumber(project.uniqueViews),
        formatDuration(project.avgTime),
        `${project.bounceRate}%`
      ]);
    });
    
    console.log(table(tableData, {
      border: {
        topBody: '─',
        topJoin: '┬',
        topLeft: '┌',
        topRight: '┐',
        bottomBody: '─',
        bottomJoin: '┴',
        bottomLeft: '└',
        bottomRight: '┘',
        bodyLeft: '│',
        bodyRight: '│',
        bodyJoin: '│',
        joinBody: '─',
        joinLeft: '├',
        joinRight: '┤',
        joinJoin: '┼'
      }
    }));
  }
  
  // Performance insights
  if (data.insights) {
    console.log('\n' + chalk.bold('💡 Insights:'));
    data.insights.forEach(insight => {
      console.log(`  ${getInsightIcon(insight.type)} ${insight.message}`);
    });
  }
}

function displayPlatformAnalytics(data, options) {
  console.log(chalk.bold.cyan('📱 Cross-Platform Usage Analytics\n'));
  
  // Platform distribution
  if (data.distribution) {
    console.log(chalk.bold('Platform Distribution:'));
    Object.entries(data.distribution).forEach(([platform, stats]) => {
      const percentage = ((stats.users / data.totalUsers) * 100).toFixed(1);
      console.log(`  ${getPlatformIcon(platform)} ${platform}: ${formatNumber(stats.users)} users (${percentage}%)`);
    });
  }
  
  // Cross-platform user journey
  if (data.crossPlatform) {
    console.log('\n' + chalk.bold('🔄 Cross-Platform Usage:'));
    console.log(`  Multi-platform users: ${formatNumber(data.crossPlatform.multiPlatformUsers)}`);
    console.log(`  Platform switches: ${formatNumber(data.crossPlatform.switches)}`);
    console.log(`  Sync events: ${formatNumber(data.crossPlatform.syncEvents)}`);
  }
  
  // Platform-specific metrics
  if (data.platformMetrics) {
    console.log('\n' + chalk.bold('📊 Platform Metrics:'));
    const metricsTable = [
      ['Platform', 'Avg. Session', 'Pages/Session', 'Bounce Rate']
    ];
    
    Object.entries(data.platformMetrics).forEach(([platform, metrics]) => {
      metricsTable.push([
        platform,
        formatDuration(metrics.avgSession),
        metrics.pagesPerSession.toFixed(1),
        `${metrics.bounceRate}%`
      ]);
    });
    
    console.log(table(metricsTable));
  }
}

function displayEngagementAnalytics(data, options) {
  console.log(chalk.bold.cyan('⚡ User Engagement Analytics\n'));
  
  // Engagement overview
  console.log(
    boxen(
      `${chalk.bold('Engagement Overview:')}\n` +
      `Page Views: ${chalk.green(formatNumber(data.pageViews))}\n` +
      `Sessions: ${chalk.blue(formatNumber(data.sessions))}\n` +
      `Avg. Session Duration: ${chalk.yellow(formatDuration(data.avgSessionDuration))}\n` +
      `Pages per Session: ${chalk.magenta(data.pagesPerSession.toFixed(1))}\n` +
      `Bounce Rate: ${chalk.red(data.bounceRate)}%`,
      { padding: 1, borderStyle: 'round' }
    )
  );
  
  // Engagement by content type
  if (data.contentEngagement) {
    console.log('\n' + chalk.bold('📄 Content Engagement:'));
    const contentTable = [
      ['Content Type', 'Views', 'Avg. Time', 'Engagement Rate']
    ];
    
    Object.entries(data.contentEngagement).forEach(([type, metrics]) => {
      contentTable.push([
        type,
        formatNumber(metrics.views),
        formatDuration(metrics.avgTime),
        `${metrics.engagementRate}%`
      ]);
    });
    
    console.log(table(contentTable));
  }
  
  // User actions
  if (data.userActions) {
    console.log('\n' + chalk.bold('🎯 User Actions:'));
    Object.entries(data.userActions).forEach(([action, count]) => {
      console.log(`  ${getActionIcon(action)} ${action}: ${formatNumber(count)}`);
    });
  }
}

// Helper functions

function getPeriodLabel(period) {
  const labels = {
    '1d': 'Last 24 hours',
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    '1y': 'Last year'
  };
  return labels[period] || period;
}

function getPercentage(value, total) {
  return total > 0 ? `${((value / total) * 100).toFixed(1)}%` : '0%';
}

function displayTrendIndicators(trends) {
  Object.entries(trends).forEach(([metric, trend]) => {
    const icon = trend.direction === 'up' ? '📈' : trend.direction === 'down' ? '📉' : '➡️';
    const color = trend.direction === 'up' ? chalk.green : trend.direction === 'down' ? chalk.red : chalk.yellow;
    console.log(`  ${icon} ${metric}: ${color(trend.change)}`);  
  });
}

function displayGeographicTable(geographic) {
  const data = [
    ['Country', 'Visitors', 'Percentage']
  ];
  
  geographic.slice(0, 10).forEach(country => {
    data.push([
      country.name,
      formatNumber(country.visitors),
      `${country.percentage}%`
    ]);
  });
  
  console.log(table(data));
}

function displayTimelineChart(timeline, metric) {
  // Simple ASCII chart for timeline data
  const maxValue = Math.max(...timeline.map(item => item[metric]));
  const chartWidth = 50;
  
  timeline.forEach(item => {
    const barLength = Math.round((item[metric] / maxValue) * chartWidth);
    const bar = '█'.repeat(barLength);
    const date = moment(item.date).format('MMM DD');
    console.log(`  ${date}: ${chalk.blue(bar)} ${formatNumber(item[metric])}`);
  });
}

function getPlatformIcon(platform) {
  const icons = {
    web: '🌐',
    mobile: '📱',
    desktop: '💻',
    pwa: '📲',
    cli: '⌨️'
  };
  return icons[platform.toLowerCase()] || '📊';
}

function getInsightIcon(type) {
  const icons = {
    positive: '✅',
    negative: '⚠️',
    neutral: 'ℹ️',
    trend: '📈'
  };
  return icons[type] || 'ℹ️';
}

function getActionIcon(action) {
  const icons = {
    'project_view': '👁️',
    'contact_click': '📧',
    'download': '⬇️',
    'share': '🔗',
    'game_play': '🎮',
    'search': '🔍'
  };
  return icons[action] || '🎯';
}

async function handleDashboardAction(action) {
  switch (action) {
    case 'overview':
      await overview({ period: '30d' });
      break;
    case 'visitors':
      await visitors({ period: '30d' });
      break;
    case 'projects':
      await projects({ period: '30d' });
      break;
    case 'platforms':
      await platforms({ period: '30d' });
      break;
    case 'performance':
      await engagement({ period: '30d' });
      break;
    case 'goals':
      console.log(chalk.yellow('🎯 Goals tracking coming soon!'));
      break;
    case 'custom':
      await handleCustomQuery();
      break;
  }
}

async function handleCustomQuery() {
  const { query } = await inquirer.prompt([
    {
      type: 'input',
      name: 'query',
      message: 'Enter custom analytics query:',
      validate: input => input.length > 0 || 'Query cannot be empty'
    }
  ]);
  
  console.log(chalk.yellow(`Executing query: ${query}`));
  console.log(chalk.gray('Custom queries will be implemented in future versions.'));
}

module.exports = {
  showHelp,
  overview,
  dashboard,
  visitors,
  projects,
  platforms,
  engagement,
  export: exportAnalytics,
  report: generateReport,
  trends
};