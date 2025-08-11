/**
 * Electron Preload Script for SOLO Portfolio Desktop App
 * Provides secure API bridge between main and renderer processes
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatformInfo: () => ipcRenderer.invoke('get-platform-info'),
  
  // File system operations
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  exportPortfolio: () => ipcRenderer.invoke('export-portfolio'),
  
  // Menu and navigation
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-project', callback);
    ipcRenderer.on('menu-preferences', callback);
    ipcRenderer.on('navigate-to', callback);
    ipcRenderer.on('quick-screenshot', callback);
    ipcRenderer.on('quick-note', callback);
    ipcRenderer.on('export-portfolio-data', callback);
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // Platform-specific features
  platform: {
    isElectron: true,
    isDesktop: true,
    isMobile: false,
    isPWA: false
  },
  
  // Desktop-specific utilities
  desktop: {
    // Window controls
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    
    // Notifications
    showNotification: (title, options) => {
      if (Notification.permission === 'granted') {
        return new Notification(title, options);
      }
    },
    
    // Clipboard
    writeToClipboard: (text) => ipcRenderer.send('clipboard-write', text),
    readFromClipboard: () => ipcRenderer.invoke('clipboard-read'),
    
    // System integration
    openExternal: (url) => ipcRenderer.send('open-external', url),
    showInFolder: (path) => ipcRenderer.send('show-in-folder', path)
  },
  
  // Cross-platform sync
  sync: {
    // Portfolio data sync
    syncPortfolioData: (data) => ipcRenderer.send('sync-portfolio-data', data),
    onPortfolioSynced: (callback) => ipcRenderer.on('portfolio-synced', callback),
    
    // User preferences sync
    syncPreferences: (preferences) => ipcRenderer.send('sync-preferences', preferences),
    onPreferencesSynced: (callback) => ipcRenderer.on('preferences-synced', callback),
    
    // Analytics sync
    syncAnalytics: (analytics) => ipcRenderer.send('sync-analytics', analytics),
    onAnalyticsSynced: (callback) => ipcRenderer.on('analytics-synced', callback),
    
    // Achievement sync
    syncAchievements: (achievements) => ipcRenderer.send('sync-achievements', achievements),
    onAchievementsSynced: (callback) => ipcRenderer.on('achievements-synced', callback)
  },
  
  // Performance monitoring
  performance: {
    getMemoryUsage: () => ipcRenderer.invoke('get-memory-usage'),
    getCPUUsage: () => ipcRenderer.invoke('get-cpu-usage'),
    getSystemInfo: () => ipcRenderer.invoke('get-system-info')
  },
  
  // Development tools
  dev: {
    openDevTools: () => ipcRenderer.send('open-dev-tools'),
    reload: () => ipcRenderer.send('reload-app'),
    toggleDevTools: () => ipcRenderer.send('toggle-dev-tools')
  }
});

// Expose desktop-specific enhancements
contextBridge.exposeInMainWorld('desktopEnhancements', {
  // Enhanced file operations
  fileSystem: {
    readFile: (filePath) => ipcRenderer.invoke('fs-read-file', filePath),
    writeFile: (filePath, data) => ipcRenderer.invoke('fs-write-file', filePath, data),
    exists: (filePath) => ipcRenderer.invoke('fs-exists', filePath),
    mkdir: (dirPath) => ipcRenderer.invoke('fs-mkdir', dirPath),
    readdir: (dirPath) => ipcRenderer.invoke('fs-readdir', dirPath)
  },
  
  // Native dialogs
  dialogs: {
    showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
    showErrorBox: (title, content) => ipcRenderer.send('show-error-box', title, content),
    showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
    showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options)
  },
  
  // System integration
  system: {
    getSystemTheme: () => ipcRenderer.invoke('get-system-theme'),
    onThemeChanged: (callback) => ipcRenderer.on('theme-changed', callback),
    setAppBadge: (count) => ipcRenderer.send('set-app-badge', count),
    clearAppBadge: () => ipcRenderer.send('clear-app-badge')
  },
  
  // Window management
  window: {
    setTitle: (title) => ipcRenderer.send('set-window-title', title),
    setSize: (width, height) => ipcRenderer.send('set-window-size', width, height),
    center: () => ipcRenderer.send('center-window'),
    setAlwaysOnTop: (flag) => ipcRenderer.send('set-always-on-top', flag),
    flashFrame: () => ipcRenderer.send('flash-frame')
  },
  
  // Keyboard shortcuts
  shortcuts: {
    register: (accelerator, callback) => {
      ipcRenderer.send('register-shortcut', accelerator);
      ipcRenderer.on(`shortcut-${accelerator}`, callback);
    },
    unregister: (accelerator) => ipcRenderer.send('unregister-shortcut', accelerator)
  },
  
  // Tray integration
  tray: {
    create: (options) => ipcRenderer.send('create-tray', options),
    destroy: () => ipcRenderer.send('destroy-tray'),
    setTooltip: (tooltip) => ipcRenderer.send('set-tray-tooltip', tooltip),
    setContextMenu: (menu) => ipcRenderer.send('set-tray-context-menu', menu)
  }
});

// Expose portfolio-specific desktop features
contextBridge.exposeInMainWorld('portfolioDesktop', {
  // Project management
  projects: {
    exportProject: (projectId) => ipcRenderer.invoke('export-project', projectId),
    importProject: () => ipcRenderer.invoke('import-project'),
    backupProjects: () => ipcRenderer.invoke('backup-projects'),
    restoreProjects: () => ipcRenderer.invoke('restore-projects')
  },
  
  // Analytics export
  analytics: {
    exportData: (dateRange) => ipcRenderer.invoke('export-analytics', dateRange),
    generateReport: (options) => ipcRenderer.invoke('generate-analytics-report', options)
  },
  
  // Game data management
  games: {
    exportScores: () => ipcRenderer.invoke('export-game-scores'),
    importScores: () => ipcRenderer.invoke('import-game-scores'),
    backupGameData: () => ipcRenderer.invoke('backup-game-data')
  },
  
  // Portfolio presentation
  presentation: {
    enterPresentationMode: () => ipcRenderer.send('enter-presentation-mode'),
    exitPresentationMode: () => ipcRenderer.send('exit-presentation-mode'),
    nextSlide: () => ipcRenderer.send('presentation-next-slide'),
    previousSlide: () => ipcRenderer.send('presentation-previous-slide')
  },
  
  // Offline capabilities
  offline: {
    enableOfflineMode: () => ipcRenderer.send('enable-offline-mode'),
    disableOfflineMode: () => ipcRenderer.send('disable-offline-mode'),
    syncWhenOnline: () => ipcRenderer.send('sync-when-online'),
    getOfflineStatus: () => ipcRenderer.invoke('get-offline-status')
  }
});

// Platform detection helper
contextBridge.exposeInMainWorld('platformInfo', {
  isElectron: true,
  isDesktop: true,
  isMobile: false,
  isPWA: false,
  platform: process.platform,
  arch: process.arch,
  versions: process.versions
});

// Enhanced error handling
window.addEventListener('error', (event) => {
  ipcRenderer.send('renderer-error', {
    message: event.error.message,
    stack: event.error.stack,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  ipcRenderer.send('renderer-unhandled-rejection', {
    reason: event.reason,
    promise: event.promise
  });
});

console.log('Electron preload script loaded successfully');