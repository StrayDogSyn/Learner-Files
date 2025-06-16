// Marvel Universe Quiz Engine - Advanced Quiz Logic
class QuizEngine {
    constructor() {
        this.state = {
            currentQuestion: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            difficulty: 'medium',
            questions: [],
            answers: [],
            timeRemaining: 30,
            totalTime: 0,
            powerups: {
                fiftyFifty: 3,
                extraTime: 2,
                hint: 2
            },
            gameStartTime: null,
            questionStartTime: null,
            questionTimes: [],
            characterFocusActive: false,
            characterFocusBonus: 0,
            timeMasterActive: false,
            timerMultiplier: 1
        };          this.difficultySettings = {
            easy: { questions: 25, timePerQuestion: 45, pointsPerCorrect: 10 },
            medium: { questions: 50, timePerQuestion: 30, pointsPerCorrect: 15 },
            hard: { questions: 75, timePerQuestion: 20, pointsPerCorrect: 20 }
        };
        
        this.timer = null;
        this.sounds = {
            correct: document.getElementById('correct-sound'),
            wrong: document.getElementById('wrong-sound'),
            background: document.getElementById('background-music')
        };
        
        this.marvelService = new MarvelService();
        this.effects = new VisualEffects();
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showWelcomeScreen();
    }
    
    bindEvents() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDifficulty(e.target.dataset.difficulty));
        });
        
        // Start quiz
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        
        // Power-ups
        document.getElementById('fifty-fifty').addEventListener('click', () => this.usePowerup('fiftyFifty'));
        document.getElementById('extra-time').addEventListener('click', () => this.usePowerup('extraTime'));
        document.getElementById('hint').addEventListener('click', () => this.usePowerup('hint'));
        
        // Results actions
        document.getElementById('play-again').addEventListener('click', () => this.resetQuiz());
        document.getElementById('share-score').addEventListener('click', () => this.shareScore());
        document.getElementById('view-answers').addEventListener('click', () => this.showAnswerReview());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    selectDifficulty(difficulty) {
        this.state.difficulty = difficulty;
        
        // Update UI
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('selected');
        
        // Update stats display
        const settings = this.difficultySettings[difficulty];
        document.getElementById('total-questions').textContent = settings.questions;
        
        this.effects.playSelectSound();
    }
      async startQuiz() {
        try {
            this.showLoadingScreen();
            document.getElementById('loading-status').textContent = 'Loading Marvel characters...';
            
            // Load questions based on difficulty
            await this.loadQuestions();
            
            document.getElementById('loading-status').textContent = 'Preloading character images...';
            
            // Preload images for all questions
            this.state.questions = await this.preloadImages(this.state.questions);
            
            document.getElementById('loading-status').textContent = 'Preparing your Marvel adventure...';
            
            // Initialize game state
            this.state.gameStartTime = Date.now();
            this.state.currentQuestion = 0;
            this.state.score = 0;
            this.state.correctAnswers = 0;
            this.state.wrongAnswers = 0;
            this.state.questionTimes = [];
            
            // Start background music
            this.playBackgroundMusic();
            
            // Show first question
            setTimeout(() => {
                this.showQuizScreen();
                this.displayQuestion();
            }, 1500);
            
        } catch (error) {
            console.error('Failed to start quiz:', error);
            this.showError('Failed to load quiz content. Please try again.');
        }
    }
      async loadQuestions() {
        const settings = this.difficultySettings[this.state.difficulty];
        
        // Update loading status
        document.getElementById('loading-status').textContent = `Fetching Marvel characters for ${settings.questions} questions...`;
        
        // Fetch characters from Marvel API
        await this.marvelService.fetchCharacters();
        
        document.getElementById('loading-status').textContent = `Generating ${settings.questions} epic quiz questions...`;
        
        // Generate questions
        this.state.questions = this.marvelService.generateQuestions(settings.questions);
        
        if (this.state.questions.length === 0) {
            throw new Error('No questions could be generated');
        }
        
        document.getElementById('loading-status').textContent = `Preparing your ${this.state.questions.length}-question Marvel challenge...`;
        
        console.log(`Quiz loaded with ${this.state.questions.length} questions for ${this.state.difficulty} difficulty`);
    }
    
    async preloadImages(questions) {
        console.log('Preloading character images...');
        const imagePromises = questions.map((question, index) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`Image ${index + 1}/${questions.length} loaded: ${question.name}`);
                    resolve({ success: true, question });
                };
                img.onerror = () => {
                    console.warn(`Image ${index + 1}/${questions.length} failed: ${question.name}`);
                    // Update question with placeholder image
                    question.image = this.createCharacterPlaceholder(question.name);
                    resolve({ success: false, question });
                };
                img.src = question.image;
            });
        });
        
        const results = await Promise.all(imagePromises);
        const successCount = results.filter(r => r.success).length;
        console.log(`Image preloading complete: ${successCount}/${questions.length} successful`);
        
        return results.map(r => r.question);
    }
    
    displayQuestion() {
        const question = this.state.questions[this.state.currentQuestion];
        const settings = this.difficultySettings[this.state.difficulty];
        
        if (!question) {
            this.endQuiz();
            return;
        }
        
        // Update HUD
        document.getElementById('current-question').textContent = this.state.currentQuestion + 1;
        document.getElementById('current-score').textContent = this.state.score;
        
        // Update progress bar
        const progress = ((this.state.currentQuestion) / this.state.questions.length) * 100;
        document.getElementById('quiz-progress').style.width = `${progress}%`;        // Display character image with enhanced error handling
        const characterImage = document.getElementById('character-image');
        
        // Reset any previous error states
        characterImage.classList.remove('image-error');
        
        // Add loading state
        characterImage.classList.add('image-loading');
        
        characterImage.src = question.image;
        characterImage.alt = question.name;
        
        // Add comprehensive error handling for image loading
        characterImage.onerror = function() {
            console.warn('Failed to load image:', question.image);
            console.log('Attempting to load fallback image for:', question.name);
            
            // Try alternative image sources
            const fallbackSources = [
                question.image.replace('http://', 'https://'),
                question.image.replace('https://', 'http://'),
                // Create a character-specific placeholder
                this.createCharacterPlaceholder(question.name)
            ];
            
            this.tryFallbackImage(fallbackSources, 0);
        }.bind(this);
        
        // Success handler
        characterImage.onload = function() {
            console.log('Image loaded successfully:', question.image);
            characterImage.classList.remove('image-loading', 'image-error');
            characterImage.classList.add('image-loaded');
        };
        
        // Set a timeout for slow loading images
        setTimeout(() => {
            if (characterImage.classList.contains('image-loading')) {
                console.warn('Image loading timeout, using fallback');
                characterImage.src = this.createCharacterPlaceholder(question.name);
            }
        }, 5000);
        
        // Display question
        document.getElementById('question-title').textContent = 'Who is this Marvel character?';
        document.getElementById('question-subtitle').textContent = 'Choose the correct answer below';
        
        // Generate answer buttons
        this.generateAnswerButtons(question.options, question.name);
        
        // Start timer
        this.state.timeRemaining = settings.timePerQuestion;
        this.state.questionStartTime = Date.now();
        this.startTimer();
        
        // Add entrance animation
        this.effects.animateQuestionIn();
    }
    
    generateAnswerButtons(options, correctAnswer) {
        const container = document.getElementById('answers-container');
        container.innerHTML = '';
        
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn animate-in';
            button.textContent = option;
            button.dataset.answer = option;
            button.dataset.index = index;
            button.style.animationDelay = `${index * 0.1}s`;
            
            button.addEventListener('click', () => this.selectAnswer(option, button));
            
            container.appendChild(button);
        });
    }
    
    selectAnswer(selectedAnswer, buttonElement) {
        if (buttonElement.classList.contains('disabled')) return;
        
        const question = this.state.questions[this.state.currentQuestion];
        const isCorrect = selectedAnswer === question.name;
        const questionTime = Date.now() - this.state.questionStartTime;
        
        // Stop timer
        this.stopTimer();
        
        // Disable all buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.add('disabled');
        });
        
        // Show correct answer
        if (isCorrect) {
            buttonElement.classList.add('correct');
            this.handleCorrectAnswer(questionTime);
            this.effects.showCorrectEffect();
            this.playSound('correct');
        } else {
            buttonElement.classList.add('wrong');
            this.showCorrectAnswer(question.name);
            this.handleWrongAnswer();
            this.effects.showWrongEffect();
            this.playSound('wrong');
        }
        
        // Record answer
        this.state.answers.push({
            question: question.name,
            userAnswer: selectedAnswer,
            correctAnswer: question.name,
            isCorrect: isCorrect,
            timeSpent: questionTime,
            image: question.image
        });
        
        this.state.questionTimes.push(questionTime);
        
        // Move to next question after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }    handleCorrectAnswer(timeSpent) {
        // Use enhanced scoring system
        const points = this.calculateScore(true, timeSpent / 1000);
        
        this.state.score += points;
        this.state.correctAnswers++;
        
        // Update score display
        document.getElementById('current-score').textContent = this.state.score;
        
        // Show floating score
        this.showFloatingScore(`+${points}`);
    }
    
    handleWrongAnswer() {
        this.state.wrongAnswers++;
        
        // Shake effect for wrong answer
        this.effects.shakeScreen();
    }
    
    showCorrectAnswer(correctAnswer) {
        document.querySelectorAll('.answer-btn').forEach(btn => {
            if (btn.dataset.answer === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }
    
    nextQuestion() {
        this.state.currentQuestion++;
        
        if (this.state.currentQuestion >= this.state.questions.length) {
            this.endQuiz();
        } else {
            this.displayQuestion();
        }
    }
    
    startTimer() {
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.state.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.state.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    updateTimerDisplay() {
        const timerText = document.getElementById('timer-text');
        const timerFill = document.getElementById('timer-fill');
        const settings = this.difficultySettings[this.state.difficulty];
        
        timerText.textContent = this.state.timeRemaining;
        
        // Update circular progress
        const percentage = (this.state.timeRemaining / settings.timePerQuestion) * 100;
        const degrees = (percentage / 100) * 360;
        
        if (percentage > 50) {
            timerFill.style.background = `conic-gradient(var(--hero-green) ${degrees}deg, transparent ${degrees}deg)`;
        } else if (percentage > 25) {
            timerFill.style.background = `conic-gradient(var(--primary-gold) ${degrees}deg, transparent ${degrees}deg)`;
        } else {
            timerFill.style.background = `conic-gradient(var(--primary-red) ${degrees}deg, transparent ${degrees}deg)`;
        }
        
        // Warning effects
        if (this.state.timeRemaining <= 5) {
            timerText.style.animation = 'textPulse 0.5s ease-in-out infinite';
        } else {
            timerText.style.animation = 'none';
        }
    }
    
    timeUp() {
        this.stopTimer();
        
        // Auto-select random answer or mark as wrong
        const question = this.state.questions[this.state.currentQuestion];
        this.state.answers.push({
            question: question.name,
            userAnswer: null,
            correctAnswer: question.name,
            isCorrect: false,
            timeSpent: this.difficultySettings[this.state.difficulty].timePerQuestion * 1000,
            image: question.image
        });
        
        this.state.wrongAnswers++;
        this.state.questionTimes.push(this.difficultySettings[this.state.difficulty].timePerQuestion * 1000);
        
        // Show correct answer
        this.showCorrectAnswer(question.name);
        
        // Effects
        this.effects.showTimeUpEffect();
        this.playSound('wrong');
        
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }
    
    usePowerup(type) {
        if (this.state.powerups[type] <= 0) return;
        
        this.state.powerups[type]--;
        this.updatePowerupDisplay(type);
        
        switch (type) {
            case 'fiftyFifty':
                this.fiftyFiftyPowerup();
                break;
            case 'extraTime':
                this.extraTimePowerup();
                break;
            case 'hint':
                this.hintPowerup();
                break;
        }
        
        this.effects.playPowerupSound();
    }
    
    fiftyFiftyPowerup() {
        const answerButtons = document.querySelectorAll('.answer-btn:not(.disabled)');
        const question = this.state.questions[this.state.currentQuestion];
        const wrongButtons = Array.from(answerButtons).filter(btn => 
            btn.dataset.answer !== question.name
        );
        
        // Remove 2 wrong answers
        for (let i = 0; i < 2 && i < wrongButtons.length; i++) {
            wrongButtons[i].style.opacity = '0.3';
            wrongButtons[i].classList.add('disabled');
        }
        
        this.effects.showPowerupEffect('50/50 Used!');
    }
    
    extraTimePowerup() {
        this.state.timeRemaining += 15;
        this.updateTimerDisplay();
        this.effects.showPowerupEffect('+15 Seconds!');
    }
    
    hintPowerup() {
        const question = this.state.questions[this.state.currentQuestion];
        const hint = question.description || 'No additional information available';
        
        this.effects.showHint(hint);
        this.effects.showPowerupEffect('Hint Revealed!');
    }
    
    updatePowerupDisplay(type) {
        const button = document.getElementById(type.replace(/([A-Z])/g, '-$1').toLowerCase());
        const countElement = button.querySelector('.powerup-count');
        countElement.textContent = this.state.powerups[type];
        
        if (this.state.powerups[type] <= 0) {
            button.disabled = true;
        }
    }
    
    endQuiz() {
        this.stopTimer();
        this.stopBackgroundMusic();
        
        // Calculate final stats
        this.calculateFinalStats();
        
        // Show results
        this.showResultsScreen();
    }
    
    calculateFinalStats() {
        const totalQuestions = this.state.questions.length;
        const accuracy = Math.round((this.state.correctAnswers / totalQuestions) * 100);
        const totalTime = Date.now() - this.state.gameStartTime;
        const avgTime = Math.round(this.state.questionTimes.reduce((a, b) => a + b, 0) / this.state.questionTimes.length / 1000);
        const maxScore = totalQuestions * this.difficultySettings[this.state.difficulty].pointsPerCorrect;
        
        // Determine rank
        let rank, rankIcon;
        if (accuracy >= 90) {
            rank = 'Marvel Legend';
            rankIcon = '👑';
        } else if (accuracy >= 75) {
            rank = 'Superhero';
            rankIcon = '🦸‍♂️';
        } else if (accuracy >= 60) {
            rank = 'Hero';
            rankIcon = '🏆';
        } else if (accuracy >= 40) {
            rank = 'Rookie';
            rankIcon = '🥉';
        } else {
            rank = 'Trainee';
            rankIcon = '📚';
        }
        
        // Update results display
        document.getElementById('final-score').textContent = this.state.score;
        document.getElementById('max-score').textContent = maxScore;
        document.getElementById('correct-answers').textContent = this.state.correctAnswers;
        document.getElementById('wrong-answers').textContent = this.state.wrongAnswers;
        document.getElementById('avg-time').textContent = `${avgTime}s`;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        document.getElementById('rank-title').textContent = rank;
        document.querySelector('.badge-icon').textContent = rankIcon;
        
        // Store results for sharing
        this.finalResults = {
            score: this.state.score,
            maxScore: maxScore,
            accuracy: accuracy,
            rank: rank,
            difficulty: this.state.difficulty,
            totalTime: Math.round(totalTime / 1000)
        };
    }
    
    handleKeyboard(e) {
        // Only handle keyboard in quiz screen
        if (!document.getElementById('quiz-screen').classList.contains('active')) return;
        
        const key = e.key;
        
        // Answer selection (1-4 keys)
        if (['1', '2', '3', '4'].includes(key)) {
            const answerIndex = parseInt(key) - 1;
            const answerButtons = document.querySelectorAll('.answer-btn:not(.disabled)');
            if (answerButtons[answerIndex]) {
                answerButtons[answerIndex].click();
            }
        }
        
        // Powerup shortcuts
        if (e.ctrlKey) {
            switch (key) {
                case '1':
                    document.getElementById('fifty-fifty').click();
                    break;
                case '2':
                    document.getElementById('extra-time').click();
                    break;
                case '3':
                    document.getElementById('hint').click();
                    break;
            }
        }
    }
    
    shareScore() {
        const shareText = `🦸‍♂️ I just scored ${this.finalResults.score}/${this.finalResults.maxScore} on the Marvel Universe Quiz! 
📊 Accuracy: ${this.finalResults.accuracy}%
🏆 Rank: ${this.finalResults.rank}
⚡ Difficulty: ${this.finalResults.difficulty.toUpperCase()}

Can you beat my score? Play now!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Marvel Universe Quiz Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.effects.showMessage('Score copied to clipboard!');
            });
        }
    }
    
    showAnswerReview() {
        // Create answer review modal or screen
        this.effects.showAnswerReview(this.state.answers);
    }
    
    resetQuiz() {
        // Reset all state
        this.state = {
            currentQuestion: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            difficulty: 'medium',
            questions: [],
            answers: [],
            timeRemaining: 30,
            totalTime: 0,
            powerups: {
                fiftyFifty: 3,
                extraTime: 2,
                hint: 2
            },
            gameStartTime: null,
            questionStartTime: null,
            questionTimes: [],
            characterFocusActive: false,
            characterFocusBonus: 0,
            timeMasterActive: false,
            timerMultiplier: 1
        };
        
        // Reset powerup displays
        Object.keys(this.state.powerups).forEach(type => {
            this.updatePowerupDisplay(type);
            const button = document.getElementById(type.replace(/([A-Z])/g, '-$1').toLowerCase());
            button.disabled = false;
        });
        
        // Show welcome screen
        this.showWelcomeScreen();
    }
    
    showWelcomeScreen() {
        this.hideAllScreens();
        document.getElementById('welcome-screen').classList.add('active');
        this.effects.resetAnimations();
    }
    
    showLoadingScreen() {
        this.hideAllScreens();
        document.getElementById('loading-screen').classList.add('active');
        this.effects.startLoadingAnimation();
    }
    
    showQuizScreen() {
        this.hideAllScreens();
        document.getElementById('quiz-screen').classList.add('active');
    }
    
    showResultsScreen() {
        this.hideAllScreens();
        document.getElementById('results-screen').classList.add('active');
        this.effects.showResultsAnimation();
    }
    
    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }
    
    showError(message) {
        this.effects.showErrorMessage(message);
    }
    
    playSound(type) {
        if (this.sounds[type]) {
            this.sounds[type].currentTime = 0;
            this.sounds[type].play().catch(e => console.log('Sound play failed:', e));
        }
    }
    
    playBackgroundMusic() {
        if (this.sounds.background) {
            this.sounds.background.volume = 0.3;
            this.sounds.background.play().catch(e => console.log('Background music play failed:', e));
        }
    }
    
    stopBackgroundMusic() {
        if (this.sounds.background) {
            this.sounds.background.pause();
        }
    }
    
    // Character Focus Feature: Bonus points for correct answers
    activateCharacterFocus() {
        this.state.characterFocusActive = true;
        this.state.characterFocusBonus = 5;
        console.log('🎯 Character Focus activated - bonus points enabled!');
        
        // Visual effect on character image
        const characterImage = document.querySelector('.character-image');
        if (characterImage) {
            characterImage.style.filter = 'brightness(1.2) contrast(1.1)';
            characterImage.style.animation = 'focusPulse 2s ease-in-out infinite';
        }
    }
    
    // Time Master Feature: Extra time and slower countdown
    activateTimeMaster() {
        this.state.timeMasterActive = true;
        this.state.timeRemaining += 10; // Add 10 seconds immediately
        this.state.timerMultiplier = 0.7; // Slow down timer by 30%
        
        console.log('⏰ Time Master activated - time bonus enabled!');
        
        // Update timer display
        this.updateTimerDisplay();
        
        // Visual effect on timer
        const timerContainer = document.querySelector('.timer-container');
        if (timerContainer) {
            timerContainer.style.animation = 'timerGlow 1s ease-in-out infinite alternate';
        }
    }
    
    // Enhanced scoring with character focus bonus
    calculateScore(isCorrect, timeUsed) {
        const settings = this.difficultySettings[this.state.difficulty];
        let points = 0;
        
        if (isCorrect) {
            // Base points
            points = settings.pointsPerCorrect;
            
            // Time bonus (faster answers get more points)
            const timeBonus = Math.max(0, Math.floor((settings.timePerQuestion - timeUsed) / 2));
            points += timeBonus;
            
            // Character focus bonus
            if (this.state.characterFocusActive) {
                points += this.state.characterFocusBonus;
                this.showBonusEffect(`+${this.state.characterFocusBonus} Character Focus Bonus!`);
            }
            
            console.log(`Score: ${points} (base: ${settings.pointsPerCorrect}, time: ${timeBonus}, focus: ${this.state.characterFocusActive ? this.state.characterFocusBonus : 0})`);
        }
        
        return points;
    }
    
    // Show bonus effect notification
    showBonusEffect(message) {
        const bonusElement = document.createElement('div');
        bonusElement.className = 'floating-bonus';
        bonusElement.textContent = message;
        bonusElement.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            color: var(--primary-gold);
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 9999;
            pointer-events: none;
            animation: floatUp 2s ease-out forwards;
        `;
        
        document.body.appendChild(bonusElement);
        
        setTimeout(() => {
            if (bonusElement.parentNode) {
                bonusElement.remove();
            }
        }, 2000);
    }
    
    // Show floating score animation
    showFloatingScore(scoreText) {
        const floatingScore = document.createElement('div');
        floatingScore.className = 'floating-score';
        floatingScore.textContent = scoreText;
        floatingScore.style.cssText = `
            position: fixed;
            top: 20%;
            right: 20px;
            color: var(--hero-green);
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 9999;
            pointer-events: none;
            animation: floatUpScore 2s ease-out forwards;
        `;
        
        document.body.appendChild(floatingScore);
        
        setTimeout(() => {
            if (floatingScore.parentNode) {
                floatingScore.remove();
            }
        }, 2000);
    }
    
    // Enhanced timer that respects time master multiplier
    updateTimer() {
        if (this.state.timeRemaining <= 0) {
            this.timeUp();
            return;
        }
        
        // Apply time master multiplier if active
        const decrement = this.state.timeMasterActive ? (this.state.timerMultiplier || 1) : 1;
        this.state.timeRemaining -= decrement;
        
        this.updateTimerDisplay();
        
        // Change timer color based on time remaining
        const timerText = document.getElementById('timer-text');
        const timerFill = document.getElementById('timer-fill');
        
        if (timerText && timerFill) {
            const percentage = this.state.timeRemaining / this.difficultySettings[this.state.difficulty].timePerQuestion;
            
            if (percentage > 0.5) {
                timerText.style.color = '#00ff51'; // Green
                timerFill.style.background = 'conic-gradient(#00ff51 0deg, transparent 0deg)';
            } else if (percentage > 0.25) {
                timerText.style.color = '#ffd700'; // Gold
                timerFill.style.background = 'conic-gradient(#ffd700 0deg, transparent 0deg)';
            } else {
                timerText.style.color = '#ff0000'; // Red
                timerFill.style.background = 'conic-gradient(#ff0000 0deg, transparent 0deg)';
            }
            
            // Update the conic gradient
            const angle = (1 - percentage) * 360;
            timerFill.style.background = `conic-gradient(${timerText.style.color} ${angle}deg, transparent ${angle}deg)`;
        }
    }
    
    createCharacterPlaceholder(characterName) {
        // Create a dynamic SVG placeholder with character name
        const svg = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#e62429;stop-opacity:0.9" />
                    <stop offset="50%" style="stop-color:#7b2cbf;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#0056a3;stop-opacity:0.9" />
                </linearGradient>
                <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
                    <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.3)"/>
                </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#grad1)"/>
            <rect width="200" height="200" fill="url(#dots)"/>
            <circle cx="100" cy="70" r="25" fill="rgba(255,255,255,0.2)" stroke="#FFD700" stroke-width="2"/>
            <text x="100" y="105" text-anchor="middle" fill="#FFF" font-family="Arial, sans-serif" font-size="14" font-weight="bold">MARVEL</text>
            <text x="100" y="125" text-anchor="middle" fill="#FFD700" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${characterName}</text>
            <text x="100" y="145" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="10">CHARACTER</text>
            <rect x="50" y="160" width="100" height="2" fill="#FFD700" opacity="0.6"/>
        </svg>`;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
    
    tryFallbackImage(sources, index) {
        if (index >= sources.length) {
            console.error('All image sources failed, using final placeholder');
            const characterImage = document.getElementById('character-image');
            characterImage.src = this.createCharacterPlaceholder('Unknown Character');
            characterImage.classList.add('image-error');
            return;
        }
        
        const characterImage = document.getElementById('character-image');
        const testImg = new Image();
        
        testImg.onload = () => {
            console.log('Fallback image loaded:', sources[index]);
            characterImage.src = sources[index];
            characterImage.classList.remove('image-loading', 'image-error');
            characterImage.classList.add('image-loaded');
        };
        
        testImg.onerror = () => {
            console.warn('Fallback image failed:', sources[index]);
            this.tryFallbackImage(sources, index + 1);
        };
        
        testImg.src = sources[index];
    }
}
