#!/usr/bin/env node

/**
 * SOLO Portfolio CLI - Main Entry Point
 * Command-line interface for portfolio ecosystem management
 */

const { Command } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

// Import command modules
const portfolioCommands = require('../commands/portfolio');
const analyticsCommands = require('../commands/analytics');
const gameCommands = require('../commands/games');
const syncCommands = require('../commands/sync');
const devCommands = require('../commands/dev');
const configCommands = require('../commands/config');

// Initialize CLI
const program = new Command();

// Check for updates
const notifier = updateNotifier({ pkg });
if (notifier.update) {
  console.log(
    boxen(
      `Update available: ${chalk.dim(notifier.update.current)} → ${chalk.green(notifier.update.latest)}\n` +
      `Run ${chalk.cyan('npm i -g solo-portfolio-cli')} to update`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'yellow'
      }
    )
  );
}

// ASCII Art Banner
function showBanner() {
  console.log(
    chalk.cyan(
      figlet.textSync('SOLO CLI', {
        font: 'ANSI Shadow',
        horizontalLayout: 'fitted'
      })
    )
  );
  
  console.log(
    boxen(
      `${chalk.bold('SOLO Portfolio CLI')} ${chalk.dim(`v${pkg.version}`)}\n` +
      `${chalk.gray('Multi-platform portfolio ecosystem management')}\n\n` +
      `${chalk.blue('Portfolio:')} Manage projects, analytics, and content\n` +
      `${chalk.green('Analytics:')} Track performance and engagement\n` +
      `${chalk.magenta('Games:')} Manage gamification and achievements\n` +
      `${chalk.yellow('Sync:')} Cross-platform data synchronization\n` +
      `${chalk.cyan('Dev:')} Developer tools and utilities`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
      }
    )
  );
}

// Program configuration
program
  .name('solo')
  .description('SOLO Portfolio CLI - Multi-platform ecosystem management')
  .version(pkg.version, '-v, --version', 'Display version number')
  .option('-q, --quiet', 'Suppress output')
  .option('--no-banner', 'Hide banner')
  .option('--json', 'Output in JSON format')
  .option('--config <path>', 'Specify config file path')
  .hook('preAction', (thisCommand) => {
    if (!thisCommand.opts().noBanner && !thisCommand.opts().quiet) {
      showBanner();
    }
  });

// Portfolio Management Commands
program
  .command('portfolio')
  .alias('p')
  .description('Portfolio management commands')
  .action(() => {
    portfolioCommands.showHelp();
  });

program
  .command('portfolio:list')
  .alias('p:ls')
  .description('List all portfolio projects')
  .option('-f, --format <type>', 'Output format (table, json, csv)', 'table')
  .option('-s, --sort <field>', 'Sort by field (name, date, status)', 'date')
  .option('--filter <criteria>', 'Filter projects by criteria')
  .action(portfolioCommands.list);

program
  .command('portfolio:show <id>')
  .alias('p:show')
  .description('Show detailed project information')
  .option('-f, --format <type>', 'Output format (detailed, json)', 'detailed')
  .action(portfolioCommands.show);

program
  .command('portfolio:create')
  .alias('p:new')
  .description('Create a new portfolio project')
  .option('-t, --template <name>', 'Use project template')
  .option('-i, --interactive', 'Interactive project creation')
  .action(portfolioCommands.create);

program
  .command('portfolio:update <id>')
  .alias('p:update')
  .description('Update project information')
  .option('-f, --file <path>', 'Update from JSON file')
  .option('-i, --interactive', 'Interactive update')
  .action(portfolioCommands.update);

program
  .command('portfolio:delete <id>')
  .alias('p:rm')
  .description('Delete a portfolio project')
  .option('-f, --force', 'Force deletion without confirmation')
  .action(portfolioCommands.delete);

program
  .command('portfolio:export')
  .alias('p:export')
  .description('Export portfolio data')
  .option('-f, --format <type>', 'Export format (json, csv, pdf)', 'json')
  .option('-o, --output <path>', 'Output file path')
  .option('--include <items>', 'Include specific data (projects,analytics,games)')
  .action(portfolioCommands.export);

// Analytics Commands
program
  .command('analytics')
  .alias('a')
  .description('Analytics and insights commands')
  .action(() => {
    analyticsCommands.showHelp();
  });

program
  .command('analytics:overview')
  .alias('a:overview')
  .description('Show analytics overview')
  .option('-p, --period <days>', 'Time period in days', '30')
  .option('-f, --format <type>', 'Output format (table, chart, json)', 'table')
  .action(analyticsCommands.overview);

program
  .command('analytics:visitors')
  .alias('a:visitors')
  .description('Show visitor analytics')
  .option('-p, --period <days>', 'Time period in days', '7')
  .option('--breakdown <type>', 'Breakdown by (daily, hourly, country)', 'daily')
  .action(analyticsCommands.visitors);

program
  .command('analytics:projects')
  .alias('a:projects')
  .description('Show project performance analytics')
  .option('-t, --top <number>', 'Show top N projects', '10')
  .option('-m, --metric <type>', 'Sort by metric (views, engagement, time)', 'views')
  .action(analyticsCommands.projects);

program
  .command('analytics:export')
  .alias('a:export')
  .description('Export analytics data')
  .option('-p, --period <days>', 'Time period in days', '30')
  .option('-f, --format <type>', 'Export format (json, csv, xlsx)', 'csv')
  .option('-o, --output <path>', 'Output file path')
  .action(analyticsCommands.export);

// Game Management Commands
program
  .command('games')
  .alias('g')
  .description('Game and achievement management')
  .action(() => {
    gameCommands.showHelp();
  });

program
  .command('games:scores')
  .alias('g:scores')
  .description('Show game scores and leaderboards')
  .option('-g, --game <name>', 'Specific game name')
  .option('-t, --top <number>', 'Show top N scores', '10')
  .action(gameCommands.scores);

program
  .command('games:achievements')
  .alias('g:achievements')
  .description('Show achievements and progress')
  .option('-u, --user <id>', 'Specific user ID')
  .option('--unlocked', 'Show only unlocked achievements')
  .action(gameCommands.achievements);

program
  .command('games:stats')
  .alias('g:stats')
  .description('Show game statistics')
  .option('-p, --period <days>', 'Time period in days', '30')
  .option('-g, --game <name>', 'Specific game name')
  .action(gameCommands.stats);

// Synchronization Commands
program
  .command('sync')
  .alias('s')
  .description('Cross-platform synchronization')
  .action(() => {
    syncCommands.showHelp();
  });

program
  .command('sync:status')
  .alias('s:status')
  .description('Show synchronization status')
  .option('-p, --platform <name>', 'Specific platform (web, desktop, mobile)')
  .action(syncCommands.status);

program
  .command('sync:pull')
  .alias('s:pull')
  .description('Pull data from remote platforms')
  .option('-p, --platform <name>', 'Specific platform')
  .option('-f, --force', 'Force sync even if conflicts exist')
  .action(syncCommands.pull);

program
  .command('sync:push')
  .alias('s:push')
  .description('Push local data to remote platforms')
  .option('-p, --platform <name>', 'Specific platform')
  .option('--dry-run', 'Show what would be synced without executing')
  .action(syncCommands.push);

program
  .command('sync:resolve')
  .alias('s:resolve')
  .description('Resolve synchronization conflicts')
  .option('-i, --interactive', 'Interactive conflict resolution')
  .action(syncCommands.resolve);

// Developer Tools Commands
program
  .command('dev')
  .alias('d')
  .description('Developer tools and utilities')
  .action(() => {
    devCommands.showHelp();
  });

program
  .command('dev:serve')
  .alias('d:serve')
  .description('Start local development server')
  .option('-p, --port <number>', 'Server port', '3000')
  .option('--host <address>', 'Server host', 'localhost')
  .option('--open', 'Open browser automatically')
  .action(devCommands.serve);

program
  .command('dev:build')
  .alias('d:build')
  .description('Build portfolio for production')
  .option('-e, --env <environment>', 'Build environment', 'production')
  .option('--analyze', 'Analyze bundle size')
  .action(devCommands.build);

program
  .command('dev:test')
  .alias('d:test')
  .description('Run tests and quality checks')
  .option('-w, --watch', 'Watch mode')
  .option('-c, --coverage', 'Generate coverage report')
  .action(devCommands.test);

program
  .command('dev:deploy')
  .alias('d:deploy')
  .description('Deploy portfolio to platforms')
  .option('-p, --platform <name>', 'Deployment platform (vercel, netlify, github)')
  .option('--preview', 'Deploy as preview')
  .action(devCommands.deploy);

// Configuration Commands
program
  .command('config')
  .alias('c')
  .description('Configuration management')
  .action(() => {
    configCommands.showHelp();
  });

program
  .command('config:get <key>')
  .alias('c:get')
  .description('Get configuration value')
  .action(configCommands.get);

program
  .command('config:set <key> <value>')
  .alias('c:set')
  .description('Set configuration value')
  .action(configCommands.set);

program
  .command('config:list')
  .alias('c:list')
  .description('List all configuration values')
  .option('--show-secrets', 'Show secret values')
  .action(configCommands.list);

program
  .command('config:reset')
  .alias('c:reset')
  .description('Reset configuration to defaults')
  .option('-f, --force', 'Force reset without confirmation')
  .action(configCommands.reset);

// Utility Commands
program
  .command('qr [url]')
  .description('Generate QR code for portfolio URL')
  .option('-s, --size <size>', 'QR code size (small, medium, large)', 'medium')
  .action((url, options) => {
    const qrcode = require('qrcode-terminal');
    const targetUrl = url || 'https://soloportfolio.dev';
    
    console.log(chalk.cyan('\n📱 QR Code for Portfolio:'));
    console.log(chalk.gray(`URL: ${targetUrl}\n`));
    
    qrcode.generate(targetUrl, { small: options.size === 'small' });
  });

program
  .command('open [section]')
  .description('Open portfolio in browser')
  .option('-p, --platform <name>', 'Platform (web, desktop)', 'web')
  .action((section, options) => {
    const open = require('open');
    const baseUrl = 'https://soloportfolio.dev';
    const url = section ? `${baseUrl}/${section}` : baseUrl;
    
    console.log(chalk.cyan(`🌐 Opening ${url}...`));
    open(url);
  });

program
  .command('doctor')
  .description('Diagnose portfolio ecosystem health')
  .option('--fix', 'Attempt to fix issues automatically')
  .action((options) => {
    require('../utils/doctor').run(options);
  });

// Global error handling
process.on('uncaughtException', (error) => {
  console.error(chalk.red('❌ Uncaught Exception:'), error.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Unhandled Rejection at:'), promise, 'reason:', reason);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  showBanner();
  program.outputHelp();
}

module.exports = program;