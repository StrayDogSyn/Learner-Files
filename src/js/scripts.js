// Search functionality for the portfolio site
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    if (searchForm && searchInput) {
        // Prevent form submission and handle search
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch();
        });
        
        // Real-time search as user types (with debounce)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (searchInput.value.length > 0) {
                    performSearch();
                } else {
                    clearSearchResults();
                }
            }, 300);
        });
    }
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            clearSearchResults();
            return;
        }
        
        // Define searchable content
        const searchableItems = [
            {
                title: 'Knucklebones Game',
                description: 'An interactive dice game built with JavaScript',
                url: './projects/knucklebones/index.html',
                keywords: ['game', 'dice', 'javascript', 'interactive', 'knucklebones']
            },
            {
                title: 'Calculator',
                description: 'A sleek, functional calculator using HTML, CSS, and JavaScript',
                url: './projects/calculator/index.html',
                keywords: ['calculator', 'math', 'javascript', 'html', 'css']
            },
            {
                title: 'Rock, Paper, Scissors',
                description: 'A classic game reimagined with modern web technologies',
                url: './projects/rps/index.html',
                keywords: ['game', 'rock', 'paper', 'scissors', 'javascript', 'classic']
            },
            {
                title: 'To-Do List',
                description: 'Task management application',
                url: './projects/toDoList/index.html',
                keywords: ['todo', 'task', 'management', 'list', 'productivity']
            },
            {
                title: 'Circle Maker',
                description: 'Interactive circle drawing tool',
                url: './projects/circle-maker/index.html',
                keywords: ['circle', 'drawing', 'canvas', 'interactive', 'graphics']
            },
            {
                title: 'Navbar Demo',
                description: 'Navigation bar demonstration',
                url: './projects/navbar/index.html',
                keywords: ['navbar', 'navigation', 'demo', 'bootstrap']
            },
            {
                title: 'Countdown Timer',
                description: 'Customizable countdown timer application',
                url: './projects/countdown/index.html',
                keywords: ['countdown', 'timer', 'clock', 'time']
            },
            {
                title: 'Marvel Universe Quiz',
                description: 'Test your knowledge of Marvel characters and stories',
                url: './projects/quiz-ninja2.1/index.html',
                keywords: ['quiz', 'marvel', 'superhero', 'trivia', 'game']
            },
            {
                title: 'CompTIA Certification Quiz',
                description: 'Study tool for CompTIA certification exams',
                url: './projects/compTIA/index.html',
                keywords: ['quiz', 'comptia', 'certification', 'study', 'it', 'technology']
            },
            {
                title: 'Resume',
                description: 'View my professional resume and experience',
                url: './resume/index.html',
                keywords: ['resume', 'cv', 'experience', 'skills', 'career']
            },
            {
                title: 'About Author',
                description: 'Learn more about Eric H. Petross (Hunter)',
                url: './bio.html',
                keywords: ['about', 'bio', 'biography', 'eric', 'petross', 'hunter']
            },
            {
                title: 'Contact Page',
                description: 'Get in touch with me',
                url: './contacts.html',
                keywords: ['contact', 'email', 'message', 'communication']
            }
        ];
        
        // Search through items
        const results = searchableItems.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(searchTerm);
            const descriptionMatch = item.description.toLowerCase().includes(searchTerm);
            const keywordMatch = item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));
            
            return titleMatch || descriptionMatch || keywordMatch;
        });
        
        displaySearchResults(results, searchTerm);
    }
    
    function displaySearchResults(results, searchTerm) {
        // Remove existing search results
        clearSearchResults();
        
        if (results.length === 0) {
            showNoResults(searchTerm);
            return;
        }
        
        // Create search results container
        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResults';
        resultsContainer.className = 'search-results-container mt-3';
        
        // Create results header
        const resultsHeader = document.createElement('div');
        resultsHeader.className = 'search-results-header mb-3';
        resultsHeader.innerHTML = `
            <h3 class="h5 text-light">
                <i class="fa fa-search me-2"></i>
                Search Results for "${searchTerm}" (${results.length} found)
            </h3>
            <button class="btn btn-sm btn-outline-light float-end" onclick="clearSearchResults()">
                <i class="fa fa-times me-1"></i>Clear
            </button>
        `;
        
        // Create results list
        const resultsList = document.createElement('div');
        resultsList.className = 'search-results-list';
        
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'card mb-2 search-result-item';
            resultItem.innerHTML = `
                <div class="card-body py-2">
                    <h4 class="h6 mb-1">
                        <a href="${result.url}" class="text-decoration-none">
                            <i class="fa fa-external-link-alt me-2"></i>${result.title}
                        </a>
                    </h4>
                    <p class="mb-0 small text-muted">${result.description}</p>
                </div>
            `;
            resultsList.appendChild(resultItem);
        });
        
        resultsContainer.appendChild(resultsHeader);
        resultsContainer.appendChild(resultsList);
        
        // Insert results after the main nav
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.insertBefore(resultsContainer, mainElement.firstChild);
        }
    }
    
    function showNoResults(searchTerm) {
        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResults';
        resultsContainer.className = 'search-results-container mt-3';
        
        resultsContainer.innerHTML = `
            <div class="card">
                <div class="card-body text-center py-4">
                    <i class="fa fa-search fa-3x text-muted mb-3"></i>
                    <h3 class="h5">No results found for "${searchTerm}"</h3>
                    <p class="text-muted">Try searching for projects, skills, or other keywords</p>
                    <button class="btn btn-outline-success" onclick="clearSearchResults()">
                        <i class="fa fa-times me-1"></i>Clear Search
                    </button>
                </div>
            </div>
        `;
        
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.insertBefore(resultsContainer, mainElement.firstChild);
        }
    }
    
    function clearSearchResults() {
        const existingResults = document.getElementById('searchResults');
        if (existingResults) {
            existingResults.remove();
        }
        
        // Clear search input if called from clear button
        if (searchInput) {
            searchInput.value = '';
        }
    }
    
    // Make clearSearchResults available globally for onclick handlers
    window.clearSearchResults = clearSearchResults;
});