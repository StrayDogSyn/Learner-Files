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
      }      // Set up event listeners
      setupEventListeners();
      
      // Initialize stats display
      initializeStatsDisplay();
      
      // Initialize cosmic background effects
      initializeBackgroundEffects();
      
      // Initialize stats display
      initializeStatsDisplay();
      
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
  // Initialize stats display with enhanced interactive gameplay features
  function initializeStatsDisplay() {
    const heroesVillainsBtn = document.getElementById('heroes-villains-btn');
    const yearsStoriesBtn = document.getElementById('years-stories-btn');
    
    if (heroesVillainsBtn && yearsStoriesBtn) {
      // Add click handlers for special abilities
      heroesVillainsBtn.addEventListener('click', activateCharacterFocus);
      yearsStoriesBtn.addEventListener('click', activateTimeMaster);
      
      // Update with real Marvel API data if available
      updateStatsFromAPI();
      
      // Initialize cooldown tracking
      window.gameFeatures = {
        characterFocus: { active: false, cooldown: false, duration: 30000, cooldownTime: 60000 },
        timeMaster: { active: false, cooldown: false, duration: 20000, cooldownTime: 45000 }
      };
    }
  }

  // Character Focus Feature: +5 bonus points for correct answers
  function activateCharacterFocus() {
    const feature = window.gameFeatures.characterFocus;
    
    if (feature.cooldown) {
      showBonusNotification('Character Focus is on cooldown!', 'warning');
      return;
    }
    
    if (feature.active) {
      showBonusNotification('Character Focus is already active!', 'info');
      return;
    }
    
    // Activate feature
    feature.active = true;
    document.body.classList.add('character-focus-active');
    document.getElementById('heroes-villains-btn').classList.add('activated');
    
    showBonusNotification('Character Focus Activated! +5 Bonus Points per Correct Answer!', 'success');
    
    // Update quiz engine if available
    if (quizEngine) {
      quizEngine.activateCharacterFocus();
    }
    
    // Deactivate after duration
    setTimeout(() => {
      feature.active = false;
      document.body.classList.remove('character-focus-active');
      document.getElementById('heroes-villains-btn').classList.remove('activated');
      document.getElementById('heroes-villains-btn').classList.add('cooldown');
      
      // Start cooldown
      feature.cooldown = true;
      setTimeout(() => {
        feature.cooldown = false;
        document.getElementById('heroes-villains-btn').classList.remove('cooldown');
        showBonusNotification('Character Focus Ready!', 'info');
      }, feature.cooldownTime);
      
    }, feature.duration);
  }

  // Time Master Feature: Adds extra time and slows down timer
  function activateTimeMaster() {
    const feature = window.gameFeatures.timeMaster;
    
    if (feature.cooldown) {
      showBonusNotification('Time Master is on cooldown!', 'warning');
      return;
    }
    
    if (feature.active) {
      showBonusNotification('Time Master is already active!', 'info');
      return;
    }
    
    // Activate feature
    feature.active = true;
    document.body.classList.add('time-master-active');
    document.getElementById('years-stories-btn').classList.add('activated');
    
    showBonusNotification('Time Master Activated! +10 Seconds & Slower Timer!', 'success');
    
    // Update quiz engine if available
    if (quizEngine) {
      quizEngine.activateTimeMaster();
    }
    
    // Deactivate after duration
    setTimeout(() => {
      feature.active = false;
      document.body.classList.remove('time-master-active');
      document.getElementById('years-stories-btn').classList.remove('activated');
      document.getElementById('years-stories-btn').classList.add('cooldown');
      
      // Start cooldown
      feature.cooldown = true;
      setTimeout(() => {
        feature.cooldown = false;
        document.getElementById('years-stories-btn').classList.remove('cooldown');
        showBonusNotification('Time Master Ready!', 'info');
      }, feature.cooldownTime);
      
    }, feature.duration);
  }

  // Show bonus notification with different types
  function showBonusNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `bonus-notification ${type}`;
    notification.textContent = message;
    
    // Add type-specific styling
    switch (type) {
      case 'success':
        notification.style.color = 'var(--hero-green)';
        notification.style.borderLeft = '4px solid var(--hero-green)';
        break;
      case 'warning':
        notification.style.color = 'var(--primary-gold)';
        notification.style.borderLeft = '4px solid var(--primary-gold)';
        break;
      case 'info':
        notification.style.color = 'var(--primary-blue)';
        notification.style.borderLeft = '4px solid var(--primary-blue)';
        break;
    }
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 2500);
  }

  // Update stats with real Marvel API data (if available)
  async function updateStatsFromAPI() {
    try {
      if (quizEngine && quizEngine.marvelService) {
        // Try to get real character count from Marvel API
        const characterData = await quizEngine.marvelService.getCharacters(1, 1);
        if (characterData && characterData.total) {
          document.getElementById('total-characters').textContent = `${characterData.total.toLocaleString()}+`;
        }
        
        // Update comics info
        const currentYear = new Date().getFullYear();
        const marvelAge = currentYear - 1939;
        document.getElementById('total-comics').textContent = `${marvelAge}+`;
      }
    } catch (error) {
      console.log('Could not fetch real Marvel stats, using default values');
      // Keep default values if API is not available
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
