class WorkInfoTabs {
  constructor() {
    this.tabs = document.querySelectorAll('.info-box li a');
    this.panels = document.querySelectorAll('.info-box article');
    this.init();
  }

  init() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        this.activateTab(tab, index);
      });
    });

    // Activate first tab by default
    if (this.tabs.length) {
      this.activateTab(this.tabs[0], 0);
    }
  }

  activateTab(selectedTab, panelIndex) {
    // Deactivate all tabs
    this.tabs.forEach(tab => tab.classList.remove('active'));
    this.panels.forEach(panel => panel.classList.remove('active-panel'));

    // Activate selected tab and panel
    selectedTab.classList.add('active');
    this.panels[panelIndex].classList.add('active-panel');

    // Ensure panel is visible and scrolled into view
    this.panels[panelIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Initialize tabs when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new WorkInfoTabs();
});
