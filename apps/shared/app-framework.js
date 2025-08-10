/**
 * App Framework Module
 * Hunter & Cortana Portfolio v2.0
 * Unified framework for portfolio applications
 */

export class AppFramework {
  constructor(appConfig) {
    this.config = appConfig;
    this.isFullscreen = false;
    this.isSidebarOpen = true;
    this.currentTheme = 'dark';
    this.initializeApp();
  }
  
  /**
   * Initialize the application
   */
  initializeApp() {
    this.createHeader();
    this.createSidebar();
    this.initializeTheme();
    this.initializeFullscreen();
    this.initializeSettings();
    this.trackAnalytics();
    this.initializeKeyboardShortcuts();
  }
  
  /**
   * Create application header
   */
  createHeader() {
    const header = `
      <header class="app-header glass-panel">
        <div class="app-logo">
          <img src="/assets/logos/Header.png" alt="Hunter & Cortana" class="logo-img">
          <div class="app-info">
            <span class="app-name">${this.config.name}</span>
            <span class="app-version">v${this.config.version}</span>
          </div>
        </div>
        
        <nav class="app-nav">
          <button class="btn-icon" id="sidebar-toggle" title="Toggle Sidebar">
            <i class="fas fa-bars"></i>
          </button>
          
          <button class="btn-icon" id="fullscreen-toggle" title="Toggle Fullscreen">
            <i class="fas fa-expand"></i>
          </button>
          
          <button class="btn-icon" id="settings-toggle" title="Settings">
            <i class="fas fa-cog"></i>
          </button>
          
          <a href="/" class="btn-icon" title="Back to Portfolio">
            <i class="fas fa-home"></i>
          </a>
        </nav>
      </header>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', header);
    
    // Add header styles
    this.addHeaderStyles();
  }
  
  /**
   * Create application sidebar
   */
  createSidebar() {
    const sidebar = `
      <aside class="app-sidebar glass-panel ${this.isSidebarOpen ? 'open' : 'closed'}">
        <div class="sidebar-content">
          <div class="sidebar-header">
            <h3>Features</h3>
            <button class="btn-icon sidebar-close" id="sidebar-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <nav class="sidebar-nav">
            ${this.config.features.map(feature => `
              <button class="sidebar-item" data-feature="${feature.id}">
                <i class="${feature.icon}"></i>
                <span>${feature.name}</span>
                ${feature.badge ? `<span class="badge">${feature.badge}</span>` : ''}
              </button>
            `).join('')}
          </nav>
          
          <div class="sidebar-footer">
            <div class="sidebar-stats">
              <div class="stat">
                <i class="fas fa-clock"></i>
                <span>Session: <span id="session-time">00:00</span></span>
              </div>
              <div class="stat">
                <i class="fas fa-user"></i>
                <span>User: ${this.config.user || 'Guest'}</span>
              </div>
            </div>
            
            <button class="btn-glass btn-block" id="help-btn">
              <i class="fas fa-question-circle"></i>
              Help & Documentation
            </button>
          </div>
        </div>
      </aside>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', sidebar);
    
    // Add sidebar styles
    this.addSidebarStyles();
  }
  
  /**
   * Initialize theme system
   */
  initializeTheme() {
    this.currentTheme = localStorage.getItem('app-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('app-theme', this.currentTheme);
    
    // Update theme icon
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
      themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }
  
  /**
   * Initialize fullscreen functionality
   */
  initializeFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreen-toggle');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
      this.updateFullscreenButton();
    });
  }
  
  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen() {
    if (!this.isFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }
  
  /**
   * Update fullscreen button icon
   */
  updateFullscreenButton() {
    const fullscreenBtn = document.getElementById('fullscreen-toggle');
    if (fullscreenBtn) {
      const icon = fullscreenBtn.querySelector('i');
      icon.className = this.isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
    }
  }
  
  /**
   * Initialize settings panel
   */
  initializeSettings() {
    const settingsBtn = document.getElementById('settings-toggle');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        this.showSettings();
      });
    }
  }
  
  /**
   * Show settings modal
   */
  showSettings() {
    const settingsHTML = `
      <div class="settings-modal glass-panel-elevated">
        <div class="settings-header">
          <h3>Settings</h3>
          <button class="btn-icon" id="settings-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="settings-content">
          <div class="setting-group">
            <label>Theme</label>
            <select id="theme-select">
              <option value="dark" ${this.currentTheme === 'dark' ? 'selected' : ''}>Dark</option>
              <option value="light" ${this.currentTheme === 'light' ? 'selected' : ''}>Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          
          <div class="setting-group">
            <label>Sidebar</label>
            <label class="toggle">
              <input type="checkbox" id="sidebar-toggle-setting" ${this.isSidebarOpen ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
          
          <div class="setting-group">
            <label>Animations</label>
            <label class="toggle">
              <input type="checkbox" id="animations-toggle" checked>
              <span class="slider"></span>
            </label>
          </div>
          
          <div class="setting-group">
            <label>Sound Effects</label>
            <label class="toggle">
              <input type="checkbox" id="sound-toggle">
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
        <div class="settings-footer">
          <button class="btn btn-primary" id="save-settings">Save Settings</button>
          <button class="btn btn-glass" id="reset-settings">Reset to Default</button>
        </div>
      </div>
    `;
    
    // Remove existing modal
    const existingModal = document.querySelector('.settings-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', settingsHTML);
    
    // Add event listeners
    this.attachSettingsListeners();
  }
  
  /**
   * Attach settings modal event listeners
   */
  attachSettingsListeners() {
    const closeBtn = document.getElementById('settings-close');
    const saveBtn = document.getElementById('save-settings');
    const resetBtn = document.getElementById('reset-settings');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.querySelector('.settings-modal').remove();
      });
    }
    
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveSettings();
        document.querySelector('.settings-modal').remove();
      });
    }
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetSettings();
      });
    }
  }
  
  /**
   * Save settings to localStorage
   */
  saveSettings() {
    const settings = {
      theme: document.getElementById('theme-select').value,
      sidebarOpen: document.getElementById('sidebar-toggle-setting').checked,
      animations: document.getElementById('animations-toggle').checked,
      sound: document.getElementById('sound-toggle').checked
    };
    
    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    // Apply settings
    this.applySettings(settings);
  }
  
  /**
   * Apply settings to the app
   */
  applySettings(settings) {
    // Apply theme
    if (settings.theme !== 'auto') {
      this.currentTheme = settings.theme;
      document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
    
    // Apply sidebar state
    this.isSidebarOpen = settings.sidebarOpen;
    const sidebar = document.querySelector('.app-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('closed', !this.isSidebarOpen);
    }
    
    // Apply animations
    document.documentElement.style.setProperty(
      '--animation-duration', 
      settings.animations ? '0.3s' : '0s'
    );
  }
  
  /**
   * Reset settings to default
   */
  resetSettings() {
    const defaultSettings = {
      theme: 'dark',
      sidebarOpen: true,
      animations: true,
      sound: false
    };
    
    // Update form
    document.getElementById('theme-select').value = defaultSettings.theme;
    document.getElementById('sidebar-toggle-setting').checked = defaultSettings.sidebarOpen;
    document.getElementById('animations-toggle').checked = defaultSettings.animations;
    document.getElementById('sound-toggle').checked = defaultSettings.sound;
    
    // Apply immediately
    this.applySettings(defaultSettings);
  }
  
  /**
   * Initialize keyboard shortcuts
   */
  initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K: Open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearch();
      }
      
      // Ctrl/Cmd + B: Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        this.toggleSidebar();
      }
      
      // F11: Toggle fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        this.toggleFullscreen();
      }
      
      // Escape: Close modals
      if (e.key === 'Escape') {
        this.closeModals();
      }
    });
  }
  
  /**
   * Open search functionality
   */
  openSearch() {
    // Implementation depends on app-specific search
    console.log('Search opened');
  }
  
  /**
   * Toggle sidebar visibility
   */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.querySelector('.app-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('closed', !this.isSidebarOpen);
    }
  }
  
  /**
   * Close all modals
   */
  closeModals() {
    const modals = document.querySelectorAll('.settings-modal, .help-modal');
    modals.forEach(modal => modal.remove());
  }
  
  /**
   * Track analytics events
   */
  trackAnalytics() {
    // Track app usage
    if (typeof gtag !== 'undefined') {
      gtag('event', 'app_launch', {
        event_category: 'engagement',
        event_label: this.config.name,
        custom_parameter_1: this.config.version
      });
    }
    
    // Track feature usage
    document.addEventListener('click', (e) => {
      const featureBtn = e.target.closest('.sidebar-item');
      if (featureBtn) {
        const featureName = featureBtn.dataset.feature;
        if (typeof gtag !== 'undefined') {
          gtag('event', 'feature_used', {
            event_category: 'engagement',
            event_label: featureName,
            custom_parameter_1: this.config.name
          });
        }
      }
    });
  }
  
  /**
   * Add header styles
   */
  addHeaderStyles() {
    const styles = `
      <style>
        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-lg);
          z-index: var(--z-fixed);
          border-bottom: 1px solid var(--glass-white-10);
        }
        
        .app-logo {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        
        .logo-img {
          height: 40px;
          width: auto;
        }
        
        .app-info {
          display: flex;
          flex-direction: column;
        }
        
        .app-name {
          font-family: var(--font-primary);
          font-weight: 600;
          font-size: var(--text-lg);
          color: var(--color-metal-light);
        }
        
        .app-version {
          font-size: var(--text-xs);
          color: var(--color-metal);
        }
        
        .app-nav {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        
        .app-nav .btn-icon {
          background: var(--glass-white-5);
          border: 1px solid var(--glass-white-10);
          color: var(--color-metal-light);
          transition: var(--transition-smooth);
        }
        
        .app-nav .btn-icon:hover {
          background: var(--glass-white-10);
          border-color: var(--color-primary-light);
          color: var(--color-primary-light);
          transform: translateY(-2px);
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
  }
  
  /**
   * Add sidebar styles
   */
  addSidebarStyles() {
    const styles = `
      <style>
        .app-sidebar {
          position: fixed;
          top: 60px;
          left: 0;
          bottom: 0;
          width: 280px;
          z-index: var(--z-sticky);
          transition: transform var(--transition-smooth);
          border-right: 1px solid var(--glass-white-10);
        }
        
        .app-sidebar.closed {
          transform: translateX(-100%);
        }
        
        .sidebar-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: var(--space-lg);
        }
        
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--glass-white-10);
        }
        
        .sidebar-header h3 {
          margin: 0;
          color: var(--color-metal-light);
        }
        
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--glass-white-5);
          border: 1px solid var(--glass-white-10);
          border-radius: var(--radius-lg);
          color: var(--color-metal-light);
          text-decoration: none;
          transition: var(--transition-smooth);
          cursor: pointer;
        }
        
        .sidebar-item:hover {
          background: var(--glass-white-10);
          border-color: var(--color-primary-light);
          color: var(--color-primary-light);
          transform: translateX(4px);
        }
        
        .sidebar-item.active {
          background: var(--color-primary);
          border-color: var(--color-primary-light);
          color: white;
        }
        
        .badge {
          background: var(--color-primary-light);
          color: var(--color-base);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: 600;
          margin-left: auto;
        }
        
        .sidebar-footer {
          margin-top: var(--space-lg);
          padding-top: var(--space-md);
          border-top: 1px solid var(--glass-white-10);
        }
        
        .sidebar-stats {
          margin-bottom: var(--space-md);
        }
        
        .stat {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--text-sm);
          color: var(--color-metal);
          margin-bottom: var(--space-xs);
        }
        
        .settings-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          max-width: 90vw;
          z-index: var(--z-modal);
          padding: var(--space-xl);
        }
        
        .setting-group {
          margin-bottom: var(--space-lg);
        }
        
        .setting-group label {
          display: block;
          margin-bottom: var(--space-sm);
          color: var(--color-metal-light);
          font-weight: 500;
        }
        
        .setting-group select,
        .setting-group input[type="text"] {
          width: 100%;
          padding: var(--space-sm);
          background: var(--glass-white-5);
          border: 1px solid var(--glass-white-10);
          border-radius: var(--radius-md);
          color: var(--color-metal-light);
        }
        
        .toggle {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        
        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--color-metal-dark);
          transition: var(--transition-smooth);
          border-radius: 24px;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: var(--transition-smooth);
          border-radius: 50%;
        }
        
        input:checked + .slider {
          background-color: var(--color-primary);
        }
        
        input:checked + .slider:before {
          transform: translateX(26px);
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
  }
  
  /**
   * Start session timer
   */
  startSessionTimer() {
    const startTime = Date.now();
    
    setInterval(() => {
      const elapsed = Date.now() - startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      const sessionTimeElement = document.getElementById('session-time');
      if (sessionTimeElement) {
        sessionTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }
}

// Example usage for Neural Dice app
const neuralDiceConfig = {
  name: 'Neural Dice Arena',
  version: '2.0',
  user: 'Player',
  features: [
    { id: 'single-player', name: 'Single Player', icon: 'fas fa-user' },
    { id: 'multiplayer', name: 'Multiplayer', icon: 'fas fa-users', badge: 'New' },
    { id: 'ai-battle', name: 'AI Battle', icon: 'fas fa-robot' },
    { id: 'statistics', name: 'Statistics', icon: 'fas fa-chart-bar' },
    { id: 'settings', name: 'Settings', icon: 'fas fa-cog' },
    { id: 'help', name: 'Help', icon: 'fas fa-question-circle' }
  ]
};

// Initialize app framework when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.app-container')) {
    window.appFramework = new AppFramework(neuralDiceConfig);
    window.appFramework.startSessionTimer();
  }
});

export default AppFramework;
