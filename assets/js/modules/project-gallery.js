/**
 * Project Gallery Module
 * Hunter & Cortana Portfolio v2.0
 * Project filtering and display system
 */

export class ProjectGallery {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.filters = {
      category: 'all',
      technology: 'all',
      year: 'all',
      search: ''
    };
    this.currentPage = 1;
    this.projectsPerPage = 12;
    this.init();
  }
  
  async init() {
    await this.loadProjects();
    this.renderFilters();
    this.renderProjects();
    this.attachEventListeners();
    this.initSearch();
  }
  
  /**
   * Load projects from JSON file
   */
  async loadProjects() {
    try {
      const response = await fetch('/data/projects.json');
      if (!response.ok) {
        throw new Error('Failed to load projects');
      }
      this.projects = await response.json();
      this.filteredProjects = [...this.projects];
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to sample data
      this.projects = this.getSampleProjects();
      this.filteredProjects = [...this.projects];
    }
  }
  
  /**
   * Sample projects data for fallback
   */
  getSampleProjects() {
    return [
      {
        id: 1,
        title: 'Neural Dice Arena',
        description: 'AI-powered strategic dice game with ML predictions and real-time multiplayer',
        category: 'ai',
        technology: ['TensorFlow', 'WebGL', 'WebRTC'],
        year: 2024,
        featured: true,
        thumbnail: '/assets/images/projects/neural-dice.jpg',
        demo: '/apps/neural-dice',
        github: 'https://github.com/StrayDogSyn/neural-dice',
        rating: 4.9,
        users: '10k+',
        status: 'live'
      },
      {
        id: 2,
        title: 'Adaptive Learning Platform',
        description: 'Personalized learning system with AI-driven content recommendations',
        category: 'ai',
        technology: ['React', 'Node.js', 'OpenAI API'],
        year: 2024,
        featured: true,
        thumbnail: '/assets/images/projects/adaptive-learn.jpg',
        demo: '/apps/adaptive-learn',
        github: 'https://github.com/StrayDogSyn/adaptive-learn',
        rating: 4.8,
        users: '5k+',
        status: 'live'
      },
      {
        id: 3,
        title: 'Quantum Calculator',
        description: 'Advanced scientific calculator with quantum computing simulations',
        category: 'tools',
        technology: ['TypeScript', 'WebAssembly', 'Three.js'],
        year: 2024,
        featured: true,
        thumbnail: '/assets/images/projects/quantum-calc.jpg',
        demo: '/apps/quantum-calc',
        github: 'https://github.com/StrayDogSyn/quantum-calc',
        rating: 4.7,
        users: '3k+',
        status: 'live'
      },
      {
        id: 4,
        title: 'Neural Tic-Tac-Toe',
        description: 'AI opponent using neural networks with adjustable difficulty levels',
        category: 'ai',
        technology: ['JavaScript', 'TensorFlow.js'],
        year: 2023,
        featured: false,
        thumbnail: '/assets/images/projects/neural-ttt.jpg',
        demo: '/apps/neural-ttt',
        github: 'https://github.com/StrayDogSyn/neural-ttt',
        rating: 4.6,
        users: '2k+',
        status: 'live'
      },
      {
        id: 5,
        title: 'ChronoFlow',
        description: 'Productivity suite with time tracking and AI-powered insights',
        category: 'tools',
        technology: ['React', 'Firebase', 'Chart.js'],
        year: 2023,
        featured: false,
        thumbnail: '/assets/images/projects/chronoflow.jpg',
        demo: '/apps/chronoflow',
        github: 'https://github.com/StrayDogSyn/chronoflow',
        rating: 4.5,
        users: '1k+',
        status: 'live'
      },
      {
        id: 6,
        title: 'CertMaster',
        description: 'Certification preparation platform with adaptive testing',
        category: 'tools',
        technology: ['Vue.js', 'Express', 'MongoDB'],
        year: 2023,
        featured: false,
        thumbnail: '/assets/images/projects/certmaster.jpg',
        demo: '/apps/certmaster',
        github: 'https://github.com/StrayDogSyn/certmaster',
        rating: 4.4,
        users: '500+',
        status: 'live'
      }
    ];
  }
  
  /**
   * Render filter controls
   */
  renderFilters() {
    const filterContainer = document.querySelector('.filters-container');
    if (!filterContainer) return;
    
    const categories = this.getUniqueValues('category');
    const technologies = this.getUniqueValues('technology');
    const years = this.getUniqueValues('year');
    
    const filterHTML = `
      <div class="filter-bar glass-panel">
        <div class="filter-group">
          <label class="filter-label">Category:</label>
          <button class="filter-btn active" data-filter="category" data-value="all">All</button>
          ${categories.map(cat => `
            <button class="filter-btn" data-filter="category" data-value="${cat}">
              ${this.formatCategory(cat)}
            </button>
          `).join('')}
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Technology:</label>
          <button class="filter-btn active" data-filter="technology" data-value="all">All</button>
          ${technologies.map(tech => `
            <button class="filter-btn" data-filter="technology" data-value="${tech}">
              ${tech}
            </button>
          `).join('')}
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Year:</label>
          <button class="filter-btn active" data-filter="year" data-value="all">All</button>
          ${years.sort((a, b) => b - a).map(year => `
            <button class="filter-btn" data-filter="year" data-value="${year}">
              ${year}
            </button>
          `).join('')}
        </div>
        
        <div class="filter-search">
          <div class="search-input-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input type="text" placeholder="Search projects..." class="search-input" id="project-search">
          </div>
        </div>
      </div>
    `;
    
    filterContainer.innerHTML = filterHTML;
  }
  
  /**
   * Get unique values from project array
   */
  getUniqueValues(field) {
    const values = new Set();
    this.projects.forEach(project => {
      if (field === 'technology') {
        project.technology.forEach(tech => values.add(tech));
      } else {
        values.add(project[field]);
      }
    });
    return Array.from(values);
  }
  
  /**
   * Format category names for display
   */
  formatCategory(category) {
    const categoryMap = {
      'ai': 'AI/ML',
      'web': 'Web Apps',
      'tools': 'Tools',
      'games': 'Games',
      'mobile': 'Mobile'
    };
    return categoryMap[category] || category;
  }
  
  /**
   * Render projects grid
   */
  renderProjects() {
    const container = document.querySelector('.projects-grid');
    if (!container) return;
    
    const startIndex = (this.currentPage - 1) * this.projectsPerPage;
    const endIndex = startIndex + this.projectsPerPage;
    const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);
    
    if (projectsToShow.length === 0) {
      container.innerHTML = `
        <div class="no-results glass-panel">
          <i class="fas fa-search"></i>
          <h3>No projects found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button class="btn btn-primary" onclick="projectGallery.clearFilters()">
            Clear Filters
          </button>
        </div>
      `;
      return;
    }
    
    container.innerHTML = projectsToShow.map(project => `
      <article class="project-card glass-panel hover-glow animate-on-scroll" 
               data-category="${project.category}"
               data-technology="${project.technology.join(' ')}"
               data-year="${project.year}">
        <div class="project-thumbnail">
          <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
          ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
          <div class="project-overlay">
            <div class="project-actions">
              <a href="${project.demo}" class="btn btn-primary btn-sm" target="_blank">
                <i class="fas fa-external-link-alt"></i>
                Live Demo
              </a>
              <a href="${project.github}" class="btn btn-glass btn-sm" target="_blank">
                <i class="fab fa-github"></i>
                Source
              </a>
            </div>
          </div>
        </div>
        
        <div class="project-content">
          <div class="project-header">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-meta">
              <span class="project-category">${this.formatCategory(project.category)}</span>
              <span class="project-year">${project.year}</span>
            </div>
          </div>
          
          <p class="project-description">${project.description}</p>
          
          <div class="project-tech-stack">
            ${project.technology.map(tech => `
              <span class="tech-pill">${tech}</span>
            `).join('')}
          </div>
          
          <div class="project-metrics">
            <div class="metric">
              <i class="fas fa-star"></i>
              <span>${project.rating}/5</span>
            </div>
            <div class="metric">
              <i class="fas fa-users"></i>
              <span>${project.users}</span>
            </div>
            <div class="metric">
              <i class="fas fa-circle ${project.status === 'live' ? 'text-success' : 'text-warning'}"></i>
              <span>${project.status}</span>
            </div>
          </div>
        </div>
      </article>
    `).join('');
    
    this.renderPagination();
  }
  
  /**
   * Render pagination controls
   */
  renderPagination() {
    const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
    const paginationContainer = document.querySelector('.pagination-container');
    
    if (!paginationContainer || totalPages <= 1) {
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }
    
    let paginationHTML = '<div class="pagination glass-panel">';
    
    // Previous button
    paginationHTML += `
      <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
              onclick="projectGallery.goToPage(${this.currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
      </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
        paginationHTML += `
          <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                  onclick="projectGallery.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
        paginationHTML += '<span class="pagination-ellipsis">...</span>';
      }
    }
    
    // Next button
    paginationHTML += `
      <button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
              onclick="projectGallery.goToPage(${this.currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;
    
    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
  }
  
  /**
   * Go to specific page
   */
  goToPage(page) {
    const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
    if (page < 1 || page > totalPages) return;
    
    this.currentPage = page;
    this.renderProjects();
    
    // Scroll to top of projects section
    const projectsSection = document.querySelector('.projects-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  /**
   * Filter projects based on current filters
   */
  filterProjects() {
    this.filteredProjects = this.projects.filter(project => {
      // Category filter
      if (this.filters.category !== 'all' && project.category !== this.filters.category) {
        return false;
      }
      
      // Technology filter
      if (this.filters.technology !== 'all' && !project.technology.includes(this.filters.technology)) {
        return false;
      }
      
      // Year filter
      if (this.filters.year !== 'all' && project.year !== parseInt(this.filters.year)) {
        return false;
      }
      
      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        const searchableText = `${project.title} ${project.description} ${project.technology.join(' ')}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
    
    this.currentPage = 1; // Reset to first page when filtering
    this.renderProjects();
    this.updateFilterButtons();
  }
  
  /**
   * Update filter button states
   */
  updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const filterType = btn.dataset.filter;
      const filterValue = btn.dataset.value;
      
      if (this.filters[filterType] === filterValue) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  /**
   * Clear all filters
   */
  clearFilters() {
    this.filters = {
      category: 'all',
      technology: 'all',
      year: 'all',
      search: ''
    };
    
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
      searchInput.value = '';
    }
    
    this.filterProjects();
  }
  
  /**
   * Initialize search functionality
   */
  initSearch() {
    const searchInput = document.getElementById('project-search');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.filters.search = e.target.value.trim();
        this.filterProjects();
      }, 300);
    });
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Filter button clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        const filterType = e.target.dataset.filter;
        const filterValue = e.target.dataset.value;
        
        this.filters[filterType] = filterValue;
        this.filterProjects();
      }
    });
    
    // Project card interactions
    document.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.project-card');
      if (projectCard) {
        // Add click tracking
        const projectTitle = projectCard.querySelector('.project-title').textContent;
        if (typeof gtag !== 'undefined') {
          gtag('event', 'project_view', {
            event_category: 'engagement',
            event_label: projectTitle
          });
        }
      }
    });
  }
}

// Initialize project gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.projects-grid')) {
    window.projectGallery = new ProjectGallery();
  }
});

export default ProjectGallery;
