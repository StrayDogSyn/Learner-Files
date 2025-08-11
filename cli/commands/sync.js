/**
 * Sync Commands
 * Handles cross-platform synchronization and data management
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
const { formatBytes, formatDuration } = require('../utils/formatters');

/**
 * Show sync commands help
 */
function showHelp() {
  console.log(
    boxen(
      `${chalk.bold.cyan('Cross-Platform Sync Commands')}\n\n` +
      `${chalk.yellow('Status & Info:')}\n` +
      `  solo sync:status              Check sync status\n` +
      `  solo sync:devices             List connected devices\n` +
      `  solo sync:conflicts           Show sync conflicts\n\n` +
      `${chalk.green('Data Sync:')}\n` +
      `  solo sync:pull                Pull latest data\n` +
      `  solo sync:push                Push local changes\n` +
      `  solo sync:auto                Enable auto-sync\n\n` +
      `${chalk.blue('Conflict Resolution:')}\n` +
      `  solo sync:resolve             Resolve conflicts\n` +
      `  solo sync:merge               Merge conflicting data\n` +
      `  solo sync:reset               Reset sync state`,
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
 * Check synchronization status
 */
async function status(options) {
  const spinner = ora('Checking sync status...').start();
  
  try {
    const syncStatus = await api.get('/sync/status');
    spinner.succeed('Sync status loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(syncStatus, null, 2));
      return;
    }
    
    displaySyncStatus(syncStatus);
    
  } catch (error) {
    spinner.fail('Failed to check sync status');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * List connected devices
 */
async function devices(options) {
  const spinner = ora('Fetching connected devices...').start();
  
  try {
    const devicesData = await api.get('/sync/devices');
    spinner.succeed('Devices loaded');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(devicesData, null, 2));
      return;
    }
    
    displayDevices(devicesData, options);
    
  } catch (error) {
    spinner.fail('Failed to fetch devices');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show sync conflicts
 */
async function conflicts(options) {
  const spinner = ora('Checking for conflicts...').start();
  
  try {
    const conflictsData = await api.get('/sync/conflicts');
    spinner.succeed('Conflicts checked');
    
    if (options.format === 'json') {
      console.log(JSON.stringify(conflictsData, null, 2));
      return;
    }
    
    displayConflicts(conflictsData, options);
    
  } catch (error) {
    spinner.fail('Failed to check conflicts');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Pull latest data from remote
 */
async function pull(options) {
  const spinner = ora('Pulling latest data...').start();
  
  try {
    const pullOptions = {
      force: options.force || false,
      dataTypes: options.types ? options.types.split(',') : ['all'],
      conflictResolution: options.conflictResolution || 'prompt'
    };
    
    const pullResult = await api.post('/sync/pull', pullOptions);
    
    if (pullResult.conflicts && pullResult.conflicts.length > 0 && !options.force) {
      spinner.warn('Conflicts detected during pull');
      
      console.log(chalk.yellow('\n⚠️  Sync conflicts detected:'));
      pullResult.conflicts.forEach(conflict => {
        console.log(`  • ${conflict.type}: ${conflict.description}`);
      });
      
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'How would you like to resolve these conflicts?',
          choices: [
            { name: 'Resolve interactively', value: 'interactive' },
            { name: 'Keep local changes', value: 'local' },
            { name: 'Accept remote changes', value: 'remote' },
            { name: 'Cancel pull', value: 'cancel' }
          ]
        }
      ]);
      
      if (action === 'cancel') {
        console.log(chalk.yellow('Pull cancelled'));
        return;
      }
      
      // Resolve conflicts based on user choice
      await resolveConflicts(pullResult.conflicts, action);
    }
    
    spinner.succeed('Data pulled successfully');
    
    displayPullResult(pullResult);
    
  } catch (error) {
    spinner.fail('Pull failed');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Push local changes to remote
 */
async function push(options) {
  const spinner = ora('Pushing local changes...').start();
  
  try {
    // Check for pending changes
    const pendingChanges = await api.get('/sync/pending');
    
    if (pendingChanges.changes.length === 0) {
      spinner.succeed('No changes to push');
      console.log(chalk.green('✅ Everything is up to date'));
      return;
    }
    
    if (!options.force) {
      console.log(chalk.cyan('\n📤 Pending changes to push:'));
      pendingChanges.changes.forEach(change => {
        console.log(`  ${getChangeIcon(change.type)} ${change.description}`);
      });
      
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Push ${pendingChanges.changes.length} changes?`,
          default: true
        }
      ]);
      
      if (!confirm) {
        console.log(chalk.yellow('Push cancelled'));
        return;
      }
    }
    
    const pushOptions = {
      force: options.force || false,
      dataTypes: options.types ? options.types.split(',') : ['all'],
      message: options.message || 'CLI sync push'
    };
    
    const pushResult = await api.post('/sync/push', pushOptions);
    
    spinner.succeed('Changes pushed successfully');
    
    displayPushResult(pushResult);
    
  } catch (error) {
    spinner.fail('Push failed');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Enable or configure auto-sync
 */
async function autoSync(options) {
  const spinner = ora('Configuring auto-sync...').start();
  
  try {
    let autoSyncConfig;
    
    if (options.interactive) {
      spinner.stop();
      autoSyncConfig = await configureAutoSyncInteractive();
      spinner.start('Applying auto-sync configuration...');
    } else {
      autoSyncConfig = {
        enabled: options.enable !== false,
        interval: options.interval || 300, // 5 minutes
        dataTypes: options.types ? options.types.split(',') : ['all'],
        conflictResolution: options.conflictResolution || 'prompt'
      };
    }
    
    const result = await api.post('/sync/auto-sync', autoSyncConfig);
    
    spinner.succeed('Auto-sync configured');
    
    console.log(
      boxen(
        `${chalk.green('🔄 Auto-Sync Configuration')}\n\n` +
        `${chalk.bold('Status:')} ${result.enabled ? chalk.green('Enabled') : chalk.red('Disabled')}\n` +
        `${chalk.bold('Interval:')} ${result.interval} seconds\n` +
        `${chalk.bold('Data Types:')} ${result.dataTypes.join(', ')}\n` +
        `${chalk.bold('Conflict Resolution:')} ${result.conflictResolution}`,
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green'
        }
      )
    );
    
  } catch (error) {
    spinner.fail('Failed to configure auto-sync');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Resolve sync conflicts
 */
async function resolve(options) {
  const spinner = ora('Loading conflicts...').start();
  
  try {
    const conflictsData = await api.get('/sync/conflicts');
    
    if (conflictsData.conflicts.length === 0) {
      spinner.succeed('No conflicts to resolve');
      console.log(chalk.green('✅ All data is synchronized'));
      return;
    }
    
    spinner.succeed(`Found ${conflictsData.conflicts.length} conflicts`);
    
    if (options.strategy) {
      // Resolve all conflicts with the specified strategy
      await resolveConflicts(conflictsData.conflicts, options.strategy);
    } else {
      // Interactive resolution
      await resolveConflictsInteractive(conflictsData.conflicts);
    }
    
  } catch (error) {
    spinner.fail('Failed to resolve conflicts');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Merge conflicting data
 */
async function merge(options) {
  const spinner = ora('Preparing data merge...').start();
  
  try {
    const mergeOptions = {
      strategy: options.strategy || 'smart',
      dataTypes: options.types ? options.types.split(',') : ['all'],
      preserveLocal: options.preserveLocal || false
    };
    
    const mergeResult = await api.post('/sync/merge', mergeOptions);
    
    spinner.succeed('Data merged successfully');
    
    displayMergeResult(mergeResult);
    
  } catch (error) {
    spinner.fail('Merge failed');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Reset sync state
 */
async function reset(options) {
  console.log(chalk.red('⚠️  WARNING: This will reset all sync state and may cause data loss!'));
  
  if (!options.force) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to reset sync state?',
        default: false
      }
    ]);
    
    if (!confirm) {
      console.log(chalk.yellow('Reset cancelled'));
      return;
    }
  }
  
  const spinner = ora('Resetting sync state...').start();
  
  try {
    const resetOptions = {
      clearLocal: options.clearLocal || false,
      clearRemote: options.clearRemote || false,
      resetDevices: options.resetDevices || false
    };
    
    await api.post('/sync/reset', resetOptions);
    
    spinner.succeed('Sync state reset successfully');
    
    console.log(
      boxen(
        `${chalk.green('🔄 Sync Reset Complete')}\n\n` +
        `Sync state has been reset.\n` +
        `You may need to re-authenticate devices.`,
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

function displaySyncStatus(syncStatus) {
  const statusColor = syncStatus.status === 'synced' ? chalk.green : 
                     syncStatus.status === 'syncing' ? chalk.yellow : chalk.red;
  
  console.log(
    boxen(
      `${chalk.bold.cyan('🔄 Sync Status')}\n\n` +
      `${chalk.bold('Status:')} ${statusColor(syncStatus.status.toUpperCase())}\n` +
      `${chalk.bold('Last Sync:')} ${syncStatus.lastSync ? moment(syncStatus.lastSync).fromNow() : 'Never'}\n` +
      `${chalk.bold('Connected Devices:')} ${syncStatus.connectedDevices}\n` +
      `${chalk.bold('Pending Changes:')} ${syncStatus.pendingChanges}\n` +
      `${chalk.bold('Conflicts:')} ${syncStatus.conflicts}\n\n` +
      `${chalk.yellow('Data Status:')}\n` +
      `  Portfolio: ${getDataStatus(syncStatus.dataStatus.portfolio)}\n` +
      `  Analytics: ${getDataStatus(syncStatus.dataStatus.analytics)}\n` +
      `  Games: ${getDataStatus(syncStatus.dataStatus.games)}\n` +
      `  Settings: ${getDataStatus(syncStatus.dataStatus.settings)}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
      }
    )
  );
  
  // Show recent sync activity
  if (syncStatus.recentActivity && syncStatus.recentActivity.length > 0) {
    console.log('\n' + chalk.bold('📋 Recent Sync Activity:'));
    syncStatus.recentActivity.slice(0, 5).forEach(activity => {
      const timeAgo = moment(activity.timestamp).fromNow();
      console.log(`  ${getSyncActivityIcon(activity.type)} ${activity.description} ${chalk.gray(timeAgo)}`);
    });
  }
}

function displayDevices(devicesData, options) {
  console.log(chalk.bold.cyan('📱 Connected Devices\n'));
  
  if (devicesData.devices.length === 0) {
    console.log(chalk.yellow('📭 No devices connected'));
    console.log(chalk.gray('Connect devices through the web or mobile app to enable sync.'));
    return;
  }
  
  const tableData = [
    ['Device', 'Platform', 'Last Seen', 'Status', 'Version']
  ];
  
  devicesData.devices.forEach(device => {
    tableData.push([
      device.name,
      getPlatformDisplay(device.platform),
      moment(device.lastSeen).fromNow(),
      getDeviceStatus(device.status),
      device.version || 'Unknown'
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
  
  // Device summary
  console.log(
    boxen(
      `${chalk.bold('Device Summary:')}\n` +
      `Total Devices: ${chalk.green(devicesData.devices.length)}\n` +
      `Active: ${chalk.green(devicesData.summary.active)}\n` +
      `Offline: ${chalk.red(devicesData.summary.offline)}\n` +
      `Last Activity: ${moment(devicesData.summary.lastActivity).fromNow()}`,
      { padding: 1, borderStyle: 'round' }
    )
  );
}

function displayConflicts(conflictsData, options) {
  console.log(chalk.bold.cyan('⚠️  Sync Conflicts\n'));
  
  if (conflictsData.conflicts.length === 0) {
    console.log(chalk.green('✅ No conflicts detected'));
    console.log(chalk.gray('All data is synchronized across devices.'));
    return;
  }
  
  console.log(chalk.yellow(`Found ${conflictsData.conflicts.length} conflicts:\n`));
  
  conflictsData.conflicts.forEach((conflict, index) => {
    console.log(
      boxen(
        `${chalk.bold.red(`Conflict #${index + 1}`)}\n\n` +
        `${chalk.bold('Type:')} ${conflict.type}\n` +
        `${chalk.bold('Description:')} ${conflict.description}\n` +
        `${chalk.bold('Local Value:')} ${conflict.localValue}\n` +
        `${chalk.bold('Remote Value:')} ${conflict.remoteValue}\n` +
        `${chalk.bold('Last Modified:')} Local: ${moment(conflict.localModified).fromNow()}, Remote: ${moment(conflict.remoteModified).fromNow()}`,
        {
          padding: 1,
          margin: { top: 0, bottom: 1, left: 0, right: 0 },
          borderStyle: 'round',
          borderColor: 'red'
        }
      )
    );
  });
  
  console.log(chalk.cyan('\n💡 Use `solo sync:resolve` to resolve these conflicts.'));
}

function displayPullResult(pullResult) {
  console.log(
    boxen(
      `${chalk.green('📥 Pull Complete')}\n\n` +
      `${chalk.bold('Changes Applied:')} ${pullResult.changesApplied}\n` +
      `${chalk.bold('Conflicts Resolved:')} ${pullResult.conflictsResolved}\n` +
      `${chalk.bold('Data Updated:')} ${pullResult.dataUpdated.join(', ')}\n` +
      `${chalk.bold('Sync Time:')} ${formatDuration(pullResult.syncTime)}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    )
  );
}

function displayPushResult(pushResult) {
  console.log(
    boxen(
      `${chalk.green('📤 Push Complete')}\n\n` +
      `${chalk.bold('Changes Pushed:')} ${pushResult.changesPushed}\n` +
      `${chalk.bold('Data Synchronized:')} ${pushResult.dataSynchronized.join(', ')}\n` +
      `${chalk.bold('Devices Notified:')} ${pushResult.devicesNotified}\n` +
      `${chalk.bold('Sync Time:')} ${formatDuration(pushResult.syncTime)}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    )
  );
}

function displayMergeResult(mergeResult) {
  console.log(
    boxen(
      `${chalk.green('🔀 Merge Complete')}\n\n` +
      `${chalk.bold('Items Merged:')} ${mergeResult.itemsMerged}\n` +
      `${chalk.bold('Conflicts Resolved:')} ${mergeResult.conflictsResolved}\n` +
      `${chalk.bold('Strategy Used:')} ${mergeResult.strategy}\n` +
      `${chalk.bold('Data Preserved:')} ${mergeResult.dataPreserved ? 'Yes' : 'No'}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    )
  );
}

// Helper functions

function getDataStatus(status) {
  const colors = {
    synced: chalk.green,
    pending: chalk.yellow,
    conflict: chalk.red,
    error: chalk.red
  };
  return colors[status] ? colors[status](status.toUpperCase()) : status;
}

function getSyncActivityIcon(type) {
  const icons = {
    pull: '📥',
    push: '📤',
    conflict: '⚠️',
    merge: '🔀',
    auto_sync: '🔄'
  };
  return icons[type] || '📝';
}

function getPlatformDisplay(platform) {
  const platforms = {
    web: '🌐 Web',
    mobile: '📱 Mobile',
    desktop: '💻 Desktop',
    pwa: '📲 PWA',
    cli: '⌨️ CLI'
  };
  return platforms[platform] || platform;
}

function getDeviceStatus(status) {
  const colors = {
    online: chalk.green,
    offline: chalk.red,
    syncing: chalk.yellow
  };
  return colors[status] ? colors[status](status.toUpperCase()) : status;
}

function getChangeIcon(type) {
  const icons = {
    create: '➕',
    update: '✏️',
    delete: '🗑️',
    move: '📁'
  };
  return icons[type] || '📝';
}

async function configureAutoSyncInteractive() {
  console.log(chalk.cyan('🔄 Auto-Sync Configuration\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'enabled',
      message: 'Enable auto-sync?',
      default: true
    },
    {
      type: 'list',
      name: 'interval',
      message: 'Sync interval:',
      choices: [
        { name: '1 minute', value: 60 },
        { name: '5 minutes', value: 300 },
        { name: '15 minutes', value: 900 },
        { name: '30 minutes', value: 1800 },
        { name: '1 hour', value: 3600 }
      ],
      default: 300,
      when: answers => answers.enabled
    },
    {
      type: 'checkbox',
      name: 'dataTypes',
      message: 'Data types to sync:',
      choices: [
        { name: 'Portfolio projects', value: 'portfolio', checked: true },
        { name: 'Analytics data', value: 'analytics', checked: true },
        { name: 'Game data', value: 'games', checked: true },
        { name: 'User settings', value: 'settings', checked: true }
      ],
      when: answers => answers.enabled
    },
    {
      type: 'list',
      name: 'conflictResolution',
      message: 'Conflict resolution strategy:',
      choices: [
        { name: 'Prompt for each conflict', value: 'prompt' },
        { name: 'Always keep local changes', value: 'local' },
        { name: 'Always accept remote changes', value: 'remote' },
        { name: 'Smart merge when possible', value: 'smart' }
      ],
      default: 'prompt',
      when: answers => answers.enabled
    }
  ]);
  
  return answers;
}

async function resolveConflicts(conflicts, strategy) {
  const spinner = ora('Resolving conflicts...').start();
  
  try {
    const resolution = {
      strategy,
      conflicts: conflicts.map(conflict => ({
        id: conflict.id,
        resolution: strategy
      }))
    };
    
    await api.post('/sync/resolve', resolution);
    
    spinner.succeed(`Resolved ${conflicts.length} conflicts using ${strategy} strategy`);
    
  } catch (error) {
    spinner.fail('Failed to resolve conflicts');
    throw error;
  }
}

async function resolveConflictsInteractive(conflicts) {
  console.log(chalk.cyan('\n🔧 Interactive Conflict Resolution\n'));
  
  for (let i = 0; i < conflicts.length; i++) {
    const conflict = conflicts[i];
    
    console.log(
      boxen(
        `${chalk.bold.yellow(`Conflict ${i + 1} of ${conflicts.length}`)}\n\n` +
        `${chalk.bold('Type:')} ${conflict.type}\n` +
        `${chalk.bold('Description:')} ${conflict.description}\n\n` +
        `${chalk.bold('Local:')} ${conflict.localValue}\n` +
        `${chalk.bold('Remote:')} ${conflict.remoteValue}`,
        {
          padding: 1,
          borderStyle: 'round',
          borderColor: 'yellow'
        }
      )
    );
    
    const { resolution } = await inquirer.prompt([
      {
        type: 'list',
        name: 'resolution',
        message: 'How would you like to resolve this conflict?',
        choices: [
          { name: 'Keep local value', value: 'local' },
          { name: 'Accept remote value', value: 'remote' },
          { name: 'Merge both values', value: 'merge' },
          { name: 'Skip this conflict', value: 'skip' }
        ]
      }
    ]);
    
    if (resolution !== 'skip') {
      const spinner = ora('Applying resolution...').start();
      
      try {
        await api.post('/sync/resolve', {
          conflicts: [{ id: conflict.id, resolution }]
        });
        
        spinner.succeed('Conflict resolved');
      } catch (error) {
        spinner.fail('Failed to resolve conflict');
        console.error(chalk.red('Error:'), error.message);
      }
    }
    
    console.log(); // Add spacing
  }
}

module.exports = {
  showHelp,
  status,
  devices,
  conflicts,
  pull,
  push,
  auto: autoSync,
  resolve,
  merge,
  reset
};