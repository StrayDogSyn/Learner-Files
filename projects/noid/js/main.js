$(() => {
  "use strict";

  // Initialize the advanced Marvel Quiz game
  let quizEngine = null;
  let visualEffects = null;

  // DOM Elements
  const elements = {
    screens: {
      welcome: document.getElementById('welcome-screen'),
      loading: document.getElementById('loading-screen'),
      quiz: document.getElementById('quiz-screen'),
      results: document.getElementById('results-screen')
    },
    navigation: {
      startButton: document.getElementById('start-quiz'),
      playAgainButton: document.getElementById('play-again'),
      shareButton: document.getElementById('share-score'),
      viewAnswersButton: document.getElementById('view-answers')
    },
    difficulty: {
      buttons: document.querySelectorAll('.difficulty-btn'),
      container: document.querySelector('.difficulty-selector')
    }
  };

  // Initialize the application
  function initializeApp() {
    try {
      // Initialize visual effects
      if (typeof VisualEffects !== 'undefined') {
        visualEffects = new VisualEffects();
      }
      
      // Initialize quiz engine
      if (typeof QuizEngine !== 'undefined' && typeof MarvelService !== 'undefined') {
        quizEngine = new QuizEngine({
          marvelApi: new MarvelService(),
          effects: visualEffects
        });
      }

      // Set up event listeners
      setupEventListeners();
      
      // Initialize cosmic background effects
      initializeBackgroundEffects();
      
      console.log('🦸‍♂️ Marvel Quiz - Advanced Edition Initialized!');
      
    } catch (error) {
      console.error('❌ Failed to initialize Marvel Quiz:', error);
      showFallbackInterface();
    }
  }

  // Set up all event listeners
  function setupEventListeners() {
    // Start quiz button
    elements.navigation.startButton?.addEventListener('click', startQuiz);
    
    // Difficulty selection
    elements.difficulty.buttons.forEach(btn => {
      btn.addEventListener('click', () => selectDifficulty(btn));
    });

    // Results screen actions
    elements.navigation.playAgainButton?.addEventListener('click', playAgain);
    elements.navigation.shareButton?.addEventListener('click', shareScore);
    elements.navigation.viewAnswersButton?.addEventListener('click', viewAnswers);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Window resize handler for responsive effects
    window.addEventListener('resize', debounce(handleResize, 250));
  }

  // Start the quiz with selected difficulty
  function startQuiz() {
    const selectedDifficulty = document.querySelector('.difficulty-btn.selected');
    const difficulty = selectedDifficulty?.dataset.difficulty || 'medium';
    
    // Show loading screen
    showScreen('loading');
    
    // Start visual effects
    visualEffects?.showLoadingEffects();
    
    // Initialize quiz with selected difficulty
    if (quizEngine) {
      quizEngine.startQuiz(difficulty).then(() => {
        showScreen('quiz');
        visualEffects?.hideLoadingEffects();
      }).catch(error => {
        console.error('Failed to start quiz:', error);
        showError('Failed to load quiz. Please try again.');
        showScreen('welcome');
      });
    } else {
      // Fallback if quiz engine not available
      setTimeout(() => {
        showScreen('quiz');
        showError('Quiz engine not fully loaded. Some features may be limited.');
      }, 2000);
    }
  }

  // Select difficulty level
  function selectDifficulty(selectedBtn) {
    elements.difficulty.buttons.forEach(btn => btn.classList.remove('selected'));
    selectedBtn.classList.add('selected');
    
    // Add selection effect
    visualEffects?.playSelectionEffect(selectedBtn);
  }

  // Play again - restart quiz
  function playAgain() {
    if (visualEffects) {
      visualEffects.playTransitionEffect(() => {
        showScreen('welcome');
        quizEngine?.reset();
      });
    } else {
      showScreen('welcome');
      quizEngine?.reset();
    }
  }

  // Share score functionality
  function shareScore() {
    const score = quizEngine?.getScore() || 0;
    const totalQuestions = quizEngine?.getTotalQuestions() || 10;
    const accuracy = Math.round((score / (totalQuestions * 10)) * 100);
    
    const shareText = `🦸‍♂️ I just scored ${score}/${totalQuestions * 10} (${accuracy}%) on the Marvel Universe Quiz! Think you can beat me? 💪 #MarvelQuiz #SuperHero`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Marvel Universe Quiz Score',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
          visualEffects?.showNotification('Score copied to clipboard!', 'success');
        });
      } else {
        // Further fallback
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        visualEffects?.showNotification('Score copied to clipboard!', 'success');
      }
    }
  }

  // View detailed answers
  function viewAnswers() {
    const answers = quizEngine?.getAnswerHistory() || [];
    console.log('Answer history:', answers);
    visualEffects?.showNotification('Answer review feature coming soon!', 'info');
  }

  // Handle keyboard shortcuts
  function handleKeyboardShortcuts(event) {
    const currentScreen = getCurrentScreen();
    
    switch(event.key) {
      case 'Enter':
        if (currentScreen === 'welcome') {
          event.preventDefault();
          startQuiz();
        }
        break;
      case 'Escape':
        if (currentScreen === 'quiz') {
          // Could pause or show menu
        }
        break;
      case '1':
      case '2':
      case '3':
      case '4':
        if (currentScreen === 'quiz') {
          event.preventDefault();
          const answerIndex = parseInt(event.key) - 1;
          quizEngine?.selectAnswer(answerIndex);
        }
        break;
    }
  }

  // Initialize cosmic background effects
  function initializeBackgroundEffects() {
    createCosmicParticles();
    createEnergyWaves();
  }

  // Create animated cosmic particles
  function createCosmicParticles() {
    const container = document.querySelector('.cosmic-particles');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'cosmic-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: radial-gradient(circle, #fff, #00f3ff);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${Math.random() * 20 + 10}s linear infinite;
        opacity: ${Math.random() * 0.8 + 0.2};
      `;
      container.appendChild(particle);
    }
  }

  // Create energy wave effects
  function createEnergyWaves() {
    const container = document.querySelector('.energy-waves');
    if (!container) return;

    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.className = 'energy-wave';
      wave.style.cssText = `
        position: absolute;
        width: 200%;
        height: 200%;
        border: 2px solid rgba(255, 215, 0, 0.3);
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        animation: pulse ${6 + i * 2}s ease-in-out infinite;
        animation-delay: ${i * 2}s;
      `;
      container.appendChild(wave);
    }
  }

  // Utility functions
  function showScreen(screenName) {
    Object.values(elements.screens).forEach(screen => {
      if (screen) screen.classList.remove('active');
    });
    if (elements.screens[screenName]) {
      elements.screens[screenName].classList.add('active');
    }
  }

  function getCurrentScreen() {
    const activeScreen = document.querySelector('.screen.active');
    return activeScreen?.id.replace('-screen', '') || 'welcome';
  }

  function showError(message) {
    if (visualEffects) {
      visualEffects.showNotification(message, 'error');
    } else {
      alert(message);
    }
  }

  function handleResize() {
    // Handle responsive adjustments
    visualEffects?.handleResize();
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Fallback interface for when advanced features fail
  function showFallbackInterface() {
    document.body.innerHTML = `
      <div class="fallback-container" style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 2rem;
      ">
        <div>
          <h1>🦸‍♂️ Marvel Quiz</h1>
          <p>Advanced features are loading...</p>
          <p>Please refresh the page or check your internet connection.</p>
          <button onclick="location.reload()" style="
            background: #e62429;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
          ">Reload Page</button>
        </div>
      </div>
    `;
  }

  // Initialize when DOM is ready
  initializeApp();
});
