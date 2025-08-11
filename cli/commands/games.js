/**
 * Games Commands
 * Handles game data, scores, achievements, and statistics
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { table } = require('table');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const boxen = require('boxen');

const api = require('../utils/api');
const config = require('../utils/config');
const { formatNumber, formatDuration } = require('../utils/formatters');

/**
 * Show games commands help
 */
function showHelp() {
  console.log(
    boxen(
      `${chalk.bold.cyan('Games & Achievements Commands')}\n\n` +
      `${chalk.yellow('Scores & Stats:')}\n` +
      `  solo games:scores             View high scores\n` +
      `  solo games:stats              Game statistics\n` +
      `  solo games:leaderboard        Global leaderboard\n\n` +
      `${chalk.green('Achievements:')}\n` +
      `  solo games:achievements       View achievements\n` +
      `  solo games:progress           Achievement progress\n` +
      `  solo games:unlock <id>        Unlock achievement\n\n` +
      `${chalk.blue('Data Management:')}\n` +
      `  solo games:export             Export game data\n` +
      `  solo games:backup             Backup game saves\n` +
      `  solo games:reset              Reset game data`,
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
 * Show high scores
 */
async function scores(options) {
  const spinner = ora('Fetching high scores...').start();
  
  try {
    const scoresData = await api.get('/games/scores', {
      params: {
        game: options.game || 'all',
        limit: options.limit || 10,
        period: options.period || 'all'
      }
    });
    
    spinner.succeed('High scores loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(scoresData, null, 2));
      return;
    }
    
    displayHighScores(scoresData, options);
    
  } catch (error) {
    spinner.fail('Failed to fetch scores');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show game statistics
 */
async function stats(options) {
  const spinner = ora('Analyzing game statistics...').start();
  
  try {
    const statsData = await api.get('/games/stats', {
      params: {
        game: options.game || 'all',
        period: options.period || '30d'
      }
    });
    
    spinner.succeed('Statistics loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(statsData, null, 2));
      return;
    }
    
    displayGameStats(statsData, options);
    
  } catch (error) {
    spinner.fail('Failed to fetch statistics');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show global leaderboard
 */
async function leaderboard(options) {
  const spinner = ora('Fetching global leaderboard...').start();
  
  try {
    const leaderboardData = await api.get('/games/leaderboard', {
      params: {
        game: options.game || 'all',
        limit: options.limit || 20,
        timeframe: options.timeframe || 'all'
      }
    });
    
    spinner.succeed('Leaderboard loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(leaderboardData, null, 2));
      return;
    }
    
    displayLeaderboard(leaderboardData, options);
    
  } catch (error) {
    spinner.fail('Failed to fetch leaderboard');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show achievements
 */
async function achievements(options) {
  const spinner = ora('Loading achievements...').start();
  
  try {
    const achievementsData = await api.get('/games/achievements', {
      params: {
        status: options.status || 'all',
        category: options.category || 'all'
      }
    });
    
    spinner.succeed('Achievements loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(achievementsData, null, 2));
      return;
    }
    
    displayAchievements(achievementsData, options);
    
  } catch (error) {
    spinner.fail('Failed to fetch achievements');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show achievement progress
 */
async function progress(options) {
  const spinner = ora('Calculating achievement progress...').start();
  
  try {
    const progressData = await api.get('/games/achievements/progress', {
      params: {
        category: options.category || 'all'
      }
    });
    
    spinner.succeed('Progress calculated');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(progressData, null, 2));
      return;
    }
    
    displayAchievementProgress(progressData, options);
    
  } catch (error) {
    spinner.fail('Failed to fetch progress');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Unlock an achievement
 */
async function unlock(achievementId, options) {
  if (!achievementId) {
    console.error(chalk.red('Error: Achievement ID is required'));
    console.log(chalk.yellow('Usage: solo games:unlock <achievement-id>'));
    process.exit(1);
  }
  
  const spinner = ora(`Unlocking achievement ${achievementId}...`).start();
  
  try {
    const result = await api.post(`/games/achievements/${achievementId}/unlock`);
    
    if (result.success) {
      spinner.succeed('Achievement unlocked!');
      
      console.log(
        boxen(
          `${chalk.green('🏆 Achievement Unlocked!')}\n\n` +
          `${chalk.bold('Name:')} ${result.achievement.name}\n` +
          `${chalk.bold('Description:')} ${result.achievement.description}\n` +
          `${chalk.bold('Points:')} ${result.achievement.points}\n` +
          `${chalk.bold('Rarity:')} ${getRarityDisplay(result.achievement.rarity)}`,
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'yellow'
          }
        )
      );
    } else {
      spinner.fail('Failed to unlock achievement');
      console.log(chalk.yellow('Reason:'), result.reason);
    }
    
  } catch (error) {
    spinner.fail('Failed to unlock achievement');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Export game data
 */
async function exportGameData(options) {
  const spinner = ora('Preparing game data export...').start();
  
  try {
    // Determine what to include
    const includes = options.include ? options.include.split(',') : ['scores', 'achievements', 'stats'];
    
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        includes
      }
    };
    
    // Fetch data based on includes
    if (includes.includes('scores')) {
      spinner.text = 'Fetching scores...';
      exportData.scores = await api.get('/games/scores');
    }
    
    if (includes.includes('achievements')) {
      spinner.text = 'Fetching achievements...';
      exportData.achievements = await api.get('/games/achievements');
    }
    
    if (includes.includes('stats')) {
      spinner.text = 'Fetching statistics...';
      exportData.stats = await api.get('/games/stats');
    }
    
    if (includes.includes('saves')) {
      spinner.text = 'Fetching save data...';
      exportData.saves = await api.get('/games/saves');
    }
    
    spinner.text = 'Generating export file...';
    
    // Generate output file
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const defaultFilename = `games-export-${timestamp}.${options.format}`;
    const outputPath = options.output || defaultFilename;
    
    switch (options.format) {
      case 'json':
        await fs.writeJson(outputPath, exportData, { spaces: 2 });
        break;
      case 'csv':
        await exportToCSV(exportData, outputPath);
        break;
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
    
    spinner.succeed(`Game data exported to ${outputPath}`);
    
    // Show export summary
    const stats = await fs.stat(outputPath);
    console.log(
      boxen(
        `${chalk.green('🎮 Game Data Export Complete')}\n\n` +
        `${chalk.bold('File:')} ${outputPath}\n` +
        `${chalk.bold('Size:')} ${formatBytes(stats.size)}\n` +
        `${chalk.bold('Format:')} ${options.format.toUpperCase()}\n` +
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
 * Backup game saves
 */
async function backup(options) {
  const spinner = ora('Creating game data backup...').start();
  
  try {
    const backupData = await api.get('/games/backup');
    
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const backupPath = options.output || `game-backup-${timestamp}.json`;
    
    await fs.writeJson(backupPath, backupData, { spaces: 2 });
    
    spinner.succeed(`Backup created: ${backupPath}`);
    
    console.log(
      boxen(
        `${chalk.green('💾 Backup Complete')}\n\n` +
        `${chalk.bold('File:')} ${backupPath}\n` +
        `${chalk.bold('Games:')} ${backupData.games ? backupData.games.length : 0}\n` +
        `${chalk.bold('Achievements:')} ${backupData.achievements ? backupData.achievements.length : 0}\n` +
        `${chalk.bold('Save Files:')} ${backupData.saves ? backupData.saves.length : 0}`,
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green'
        }
      )
    );
    
  } catch (error) {
    spinner.fail('Backup failed');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Reset game data
 */
async function reset(options) {
  console.log(chalk.red('⚠️  WARNING: This will permanently delete all game data!'));
  
  if (!options.force) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you absolutely sure you want to reset all game data?',
        default: false
      }
    ]);
    
    if (!confirm) {
      console.log(chalk.yellow('Operation cancelled'));
      return;
    }
    
    // Double confirmation
    const { doubleConfirm } = await inquirer.prompt([
      {
        type: 'input',
        name: 'doubleConfirm',
        message: 'Type "RESET" to confirm:',
        validate: input => input === 'RESET' || 'Please type "RESET" to confirm'
      }
    ]);
  }
  
  const spinner = ora('Resetting game data...').start();
  
  try {
    await api.post('/games/reset', {
      confirmReset: true
    });
    
    spinner.succeed('Game data reset successfully');
    
    console.log(
      boxen(
        `${chalk.green('🔄 Reset Complete')}\n\n` +
        `All game data has been permanently deleted.\n` +
        `You can start fresh with new games and achievements.`,
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green'
        }
      )
    );
    
  } catch (error) {
    spinner.fail('Reset failed');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

// Display functions

function displayHighScores(scoresData, options) {
  console.log(chalk.bold.cyan('🏆 High Scores\n'));
  
  if (scoresData.games) {
    Object.entries(scoresData.games).forEach(([gameName, scores]) => {
      console.log(chalk.bold.yellow(`${getGameIcon(gameName)} ${gameName}:`));
      
      if (scores.length === 0) {
        console.log(chalk.gray('  No scores recorded yet\n'));
        return;
      }
      
      const tableData = [
        ['Rank', 'Score', 'Player', 'Date', 'Duration']
      ];
      
      scores.slice(0, options.limit || 10).forEach((score, index) => {
        tableData.push([
          getRankDisplay(index + 1),
          formatNumber(score.score),
          score.player || 'Anonymous',
          moment(score.date).format('MMM DD, YYYY'),
          formatDuration(score.duration || 0)
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
      
      console.log();
    });
  }
}

function displayGameStats(statsData, options) {
  console.log(chalk.bold.cyan('📊 Game Statistics\n'));
  
  // Overall stats
  if (statsData.overall) {
    console.log(
      boxen(
        `${chalk.bold('Overall Statistics:')}\n` +
        `Total Games Played: ${chalk.green(formatNumber(statsData.overall.totalGames))}\n` +
        `Total Play Time: ${chalk.blue(formatDuration(statsData.overall.totalPlayTime))}\n` +
        `Average Session: ${chalk.yellow(formatDuration(statsData.overall.avgSession))}\n` +
        `Achievements Unlocked: ${chalk.magenta(statsData.overall.achievementsUnlocked)}/${statsData.overall.totalAchievements}`,
        { padding: 1, borderStyle: 'round' }
      )
    );
  }
  
  // Per-game stats
  if (statsData.games) {
    console.log('\n' + chalk.bold('📈 Per-Game Statistics:'));
    
    const gameStatsTable = [
      ['Game', 'Plays', 'Best Score', 'Total Time', 'Avg. Score']
    ];
    
    Object.entries(statsData.games).forEach(([gameName, stats]) => {
      gameStatsTable.push([
        gameName,
        formatNumber(stats.plays),
        formatNumber(stats.bestScore),
        formatDuration(stats.totalTime),
        formatNumber(stats.avgScore)
      ]);
    });
    
    console.log(table(gameStatsTable));
  }
  
  // Recent activity
  if (statsData.recentActivity) {
    console.log('\n' + chalk.bold('🕒 Recent Activity:'));
    statsData.recentActivity.slice(0, 5).forEach(activity => {
      const timeAgo = moment(activity.timestamp).fromNow();
      console.log(`  ${getActivityIcon(activity.type)} ${activity.description} ${chalk.gray(timeAgo)}`);
    });
  }
}

function displayLeaderboard(leaderboardData, options) {
  console.log(chalk.bold.cyan('🌟 Global Leaderboard\n'));
  
  if (leaderboardData.entries && leaderboardData.entries.length > 0) {
    const tableData = [
      ['Rank', 'Player', 'Score', 'Game', 'Date']
    ];
    
    leaderboardData.entries.forEach((entry, index) => {
      tableData.push([
        getRankDisplay(index + 1),
        entry.player || 'Anonymous',
        formatNumber(entry.score),
        entry.game,
        moment(entry.date).format('MMM DD')
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
  } else {
    console.log(chalk.yellow('📭 No leaderboard entries found'));
  }
  
  // Leaderboard stats
  if (leaderboardData.stats) {
    console.log('\n' + chalk.bold('📊 Leaderboard Stats:'));
    console.log(`  Total Players: ${formatNumber(leaderboardData.stats.totalPlayers)}`);
    console.log(`  Total Scores: ${formatNumber(leaderboardData.stats.totalScores)}`);
    console.log(`  Highest Score: ${formatNumber(leaderboardData.stats.highestScore)}`);
    console.log(`  Most Active Game: ${leaderboardData.stats.mostActiveGame}`);
  }
}

function displayAchievements(achievementsData, options) {
  console.log(chalk.bold.cyan('🏆 Achievements\n'));
  
  if (achievementsData.achievements) {
    // Group by category
    const categories = {};
    achievementsData.achievements.forEach(achievement => {
      const category = achievement.category || 'General';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(achievement);
    });
    
    Object.entries(categories).forEach(([category, achievements]) => {
      console.log(chalk.bold.yellow(`${getCategoryIcon(category)} ${category}:`));
      
      achievements.forEach(achievement => {
        const status = achievement.unlocked ? '✅' : '🔒';
        const rarity = getRarityDisplay(achievement.rarity);
        const points = chalk.yellow(`${achievement.points}pts`);
        
        console.log(`  ${status} ${achievement.name} ${rarity} ${points}`);
        console.log(`     ${chalk.gray(achievement.description)}`);
        
        if (achievement.progress && !achievement.unlocked) {
          const progressBar = createProgressBar(achievement.progress.current, achievement.progress.required);
          console.log(`     ${progressBar} ${achievement.progress.current}/${achievement.progress.required}`);
        }
        
        console.log();
      });
    });
  }
  
  // Achievement summary
  if (achievementsData.summary) {
    console.log(
      boxen(
        `${chalk.bold('Achievement Summary:')}\n` +
        `Unlocked: ${chalk.green(achievementsData.summary.unlocked)}/${achievementsData.summary.total}\n` +
        `Completion: ${chalk.blue(achievementsData.summary.completionRate)}%\n` +
        `Total Points: ${chalk.yellow(formatNumber(achievementsData.summary.totalPoints))}\n` +
        `Rarest Achievement: ${achievementsData.summary.rarestAchievement || 'None'}`,
        { padding: 1, borderStyle: 'round' }
      )
    );
  }
}

function displayAchievementProgress(progressData, options) {
  console.log(chalk.bold.cyan('📈 Achievement Progress\n'));
  
  if (progressData.inProgress) {
    console.log(chalk.bold('🎯 In Progress:'));
    
    progressData.inProgress.forEach(achievement => {
      const progressBar = createProgressBar(achievement.progress.current, achievement.progress.required);
      const percentage = Math.round((achievement.progress.current / achievement.progress.required) * 100);
      
      console.log(`  ${achievement.name}`);
      console.log(`  ${progressBar} ${percentage}% (${achievement.progress.current}/${achievement.progress.required})`);
      console.log(`  ${chalk.gray(achievement.description)}\n`);
    });
  }
  
  // Progress summary
  if (progressData.summary) {
    console.log(
      boxen(
        `${chalk.bold('Progress Summary:')}\n` +
        `Achievements in Progress: ${chalk.yellow(progressData.summary.inProgress)}\n` +
        `Close to Unlocking: ${chalk.green(progressData.summary.closeToUnlocking)}\n` +
        `Average Progress: ${chalk.blue(progressData.summary.avgProgress)}%`,
        { padding: 1, borderStyle: 'round' }
      )
    );
  }
}

// Helper functions

function getGameIcon(gameName) {
  const icons = {
    'Snake': '🐍',
    'Tetris': '🧩',
    'Pong': '🏓',
    'Breakout': '🧱',
    'Memory': '🧠',
    'Puzzle': '🧩'
  };
  return icons[gameName] || '🎮';
}

function getRankDisplay(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return rank.toString();
}

function getRarityDisplay(rarity) {
  const rarities = {
    common: chalk.gray('●'),
    uncommon: chalk.green('●'),
    rare: chalk.blue('●'),
    epic: chalk.magenta('●'),
    legendary: chalk.yellow('●')
  };
  return rarities[rarity] || chalk.gray('●');
}

function getCategoryIcon(category) {
  const icons = {
    'General': '🎯',
    'Gaming': '🎮',
    'Social': '👥',
    'Progress': '📈',
    'Special': '⭐',
    'Hidden': '🔍'
  };
  return icons[category] || '🏆';
}

function getActivityIcon(type) {
  const icons = {
    'game_played': '🎮',
    'achievement_unlocked': '🏆',
    'high_score': '🌟',
    'milestone': '🎯'
  };
  return icons[type] || '📝';
}

function createProgressBar(current, required, width = 20) {
  const percentage = Math.min(current / required, 1);
  const filled = Math.round(percentage * width);
  const empty = width - filled;
  
  return chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  showHelp,
  scores,
  stats,
  leaderboard,
  achievements,
  progress,
  unlock,
  export: exportGameData,
  backup,
  reset
};