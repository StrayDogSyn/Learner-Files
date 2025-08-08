// Visual Effects Engine - Advanced animations and effects
class VisualEffects {
    constructor() {
        this.audioContext = null;
        this.initAudioContext();
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    // Screen transition effects
    animateQuestionIn() {
        const container = document.querySelector('.question-container');
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
        
        // Animate character image
        const image = document.getElementById('character-image');
        image.style.transform = 'scale(0.8)';
        image.style.opacity = '0';
        
        setTimeout(() => {
            image.style.transition = 'all 0.8s ease-out';
            image.style.transform = 'scale(1)';
            image.style.opacity = '1';
        }, 300);
        
        // Animate answer buttons with stagger
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach((btn, index) => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                btn.style.transition = 'all 0.5s ease-out';
                btn.style.opacity = '1';
                btn.style.transform = 'translateX(0)';
            }, 600 + (index * 100));
        });
    }
    
    // Correct answer effects
    showCorrectEffect() {
        this.createParticleExplosion('#00c851', '✓');
        this.flashScreen('#00c851', 0.2);
        this.shakeElement('.score-value', 'bounce');
        
        // Create success particle system
        this.createFloatingParticles(['⭐', '✨', '💫'], 15);
    }
    
    // Wrong answer effects
    showWrongEffect() {
        this.createParticleExplosion('#e62429', '✗');
        this.flashScreen('#e62429', 0.3);
        this.shakeElement('.timer-circle', 'shake');
        
        // Screen shake
        this.shakeScreen();
    }
    
    // Time up effects
    showTimeUpEffect() {
        this.createWarningFlash();
        this.pulseElement('.timer-circle');
        
        // Create warning particles
        this.createFloatingParticles(['⏰', '⚠️', '💥'], 10);
    }
    
    // Score animation
    animateScoreIncrease(points) {
        const scoreElement = document.getElementById('current-score');
        const currentScore = parseInt(scoreElement.textContent);
        const targetScore = currentScore + points;
        
        // Floating points indicator
        this.showFloatingPoints(points);
        
        // Animate score counter
        this.animateNumber(scoreElement, currentScore, targetScore, 800);
        
        // Glow effect
        scoreElement.style.textShadow = '0 0 20px var(--primary-gold)';
        setTimeout(() => {
            scoreElement.style.textShadow = '';
        }, 1000);
    }
    
    showFloatingPoints(points) {
        const scoreDisplay = document.querySelector('.score-display');
        const floatingElement = document.createElement('div');
        floatingElement.textContent = `+${points}`;
        floatingElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--primary-gold);
            font-size: 1.5rem;
            font-weight: 800;
            pointer-events: none;
            z-index: 1000;
            text-shadow: 0 0 10px var(--primary-gold);
        `;
        
        scoreDisplay.style.position = 'relative';
        scoreDisplay.appendChild(floatingElement);
        
        // Animate upward movement
        floatingElement.style.transition = 'all 1s ease-out';
        setTimeout(() => {
            floatingElement.style.transform = 'translate(-50%, -200%)';
            floatingElement.style.opacity = '0';
        }, 100);
        
        setTimeout(() => {
            floatingElement.remove();
        }, 1100);
    }
    
    // Number animation utility
    animateNumber(element, start, end, duration) {
        const startTime = Date.now();
        const difference = end - start;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (difference * easeOut));
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    // Particle system
    createParticleExplosion(color, symbol) {
        for (let i = 0; i < 12; i++) {
            this.createParticle(color, symbol, i);
        }
    }
    
    createParticle(color, symbol, index) {
        const particle = document.createElement('div');
        particle.textContent = symbol;
        particle.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            color: ${color};
            font-size: 2rem;
            font-weight: bold;
            pointer-events: none;
            z-index: 9999;
            text-shadow: 0 0 10px ${color};
        `;
        
        document.body.appendChild(particle);
        
        const angle = (index / 12) * Math.PI * 2;
        const velocity = 150 + Math.random() * 100;
        const lifetime = 1000 + Math.random() * 500;
        
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.style.transition = `all ${lifetime}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        
        setTimeout(() => {
            particle.style.transform = `translate(${vx}px, ${vy}px) scale(0) rotate(720deg)`;
            particle.style.opacity = '0';
        }, 50);
        
        setTimeout(() => {
            particle.remove();
        }, lifetime + 100);
    }
    
    createFloatingParticles(symbols, count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createFloatingParticle(symbols[Math.floor(Math.random() * symbols.length)]);
            }, i * 150);
        }
    }
    
    createFloatingParticle(symbol) {
        const particle = document.createElement('div');
        particle.textContent = symbol;
        particle.style.cssText = `
            position: fixed;
            top: 100vh;
            left: ${Math.random() * 100}vw;
            font-size: ${1 + Math.random()}rem;
            pointer-events: none;
            z-index: 9998;
            animation: floatUp ${3 + Math.random() * 2}s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 5000);
    }
    
    // Screen effects
    flashScreen(color, opacity) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: ${color};
            opacity: 0;
            pointer-events: none;
            z-index: 9997;
            transition: opacity 0.1s ease;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = opacity;
        }, 10);
        
        setTimeout(() => {
            flash.style.opacity = '0';
        }, 150);
        
        setTimeout(() => {
            flash.remove();
        }, 300);
    }
    
    shakeScreen() {
        document.body.style.animation = 'screenShake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
    
    createWarningFlash() {
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            this.flashScreen('#ff6b35', 0.4);
            flashCount++;
            if (flashCount >= 3) {
                clearInterval(flashInterval);
            }
        }, 200);
    }
    
    // Element animations
    shakeElement(selector, type = 'shake') {
        const element = document.querySelector(selector);
        if (!element) return;
        
        element.style.animation = `${type} 0.6s ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }
    
    pulseElement(selector) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        element.style.animation = 'pulse 1s ease-in-out 3';
        setTimeout(() => {
            element.style.animation = '';
        }, 3000);
    }
    
    // Powerup effects
    showPowerupEffect(message) {
        const powerupDisplay = document.createElement('div');
        powerupDisplay.textContent = message;
        powerupDisplay.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--gradient-gold);
            color: #000;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: 700;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
            animation: powerupPop 2s ease-out forwards;
        `;
        
        document.body.appendChild(powerupDisplay);
        
        setTimeout(() => {
            powerupDisplay.remove();
        }, 2000);
    }
    
    showHint(hintText) {
        const hintModal = document.createElement('div');
        hintModal.innerHTML = `
            <div class="hint-modal">
                <div class="hint-content">
                    <h3>💡 Character Hint</h3>
                    <p>${hintText}</p>
                    <button onclick="this.closest('.hint-modal').remove()">Got it!</button>
                </div>
            </div>
        `;
        hintModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .hint-content {
                background: var(--gradient-cosmic);
                padding: 2rem;
                border-radius: 15px;
                text-align: center;
                max-width: 500px;
                margin: 0 1rem;
                color: white;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            .hint-content h3 {
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            .hint-content p {
                margin-bottom: 1.5rem;
                line-height: 1.5;
            }
            .hint-content button {
                background: var(--primary-gold);
                color: #000;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .hint-content button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(hintModal);
        
        setTimeout(() => {
            style.remove();
        }, 5000);
    }
    
    // Loading animations
    startLoadingAnimation() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.transition = 'width 2s ease-out';
                progressBar.style.width = '100%';
            }, 100);
        }
    }
    
    // Results animations
    showResultsAnimation() {
        const elements = [
            '.rank-badge',
            '.final-score',
            '.stats-grid',
            '.action-buttons'
        ];
        
        elements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
        
        // Confetti effect for good scores
        setTimeout(() => {
            this.createConfetti();
        }, 1000);
    }
    
    createConfetti() {
        const colors = ['#e62429', '#0056a3', '#ffd700', '#00c851', '#7b2cbf'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 30);
        }
    }
    
    createConfettiPiece(color) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: 10px;
            height: 10px;
            background: ${color};
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            z-index: 9996;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // Sound effects
    playSelectSound() {
        this.playTone(800, 0.1, 0.1);
    }
    
    playPowerupSound() {
        this.playTone(1200, 0.3, 0.2);
        setTimeout(() => this.playTone(1600, 0.2, 0.1), 100);
    }
    
    playTone(frequency, duration, volume = 0.1) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // Utility methods
    showMessage(message, duration = 3000) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 10000;
            animation: slideInUp 0.3s ease-out;
        `;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.style.animation = 'slideOutDown 0.3s ease-in';
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, duration);
    }
    
    showErrorMessage(message) {
        const errorElement = document.createElement('div');
        errorElement.innerHTML = `
            <div class="error-content">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <button onclick="this.closest('div').remove()">Dismiss</button>
            </div>
        `;
        errorElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .error-content {
                background: var(--primary-red);
                padding: 2rem;
                border-radius: 15px;
                text-align: center;
                max-width: 400px;
                margin: 0 1rem;
                color: white;
                box-shadow: 0 20px 60px rgba(230, 36, 41, 0.3);
            }
            .error-content button {
                background: white;
                color: var(--primary-red);
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 1rem;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(errorElement);
    }
    
    showAnswerReview(answers) {
        const reviewModal = document.createElement('div');
        reviewModal.innerHTML = `
            <div class="review-modal">
                <div class="review-content">
                    <h2>📋 Answer Review</h2>
                    <div class="review-list">
                        ${answers.map((answer, index) => `
                            <div class="review-item ${answer.isCorrect ? 'correct' : 'wrong'}">
                                <img src="${answer.image}" alt="${answer.question}" class="review-image">
                                <div class="review-info">
                                    <h4>Question ${index + 1}: ${answer.question}</h4>
                                    <p><strong>Your answer:</strong> ${answer.userAnswer || 'No answer'}</p>
                                    <p><strong>Correct answer:</strong> ${answer.correctAnswer}</p>
                                    <p><strong>Time:</strong> ${(answer.timeSpent / 1000).toFixed(1)}s</p>
                                </div>
                                <div class="review-status">
                                    ${answer.isCorrect ? '✅' : '❌'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="this.closest('.review-modal').remove()">Close Review</button>
                </div>
            </div>
        `;
        
        // Add styles for review modal
        const reviewStyles = document.createElement('style');
        reviewStyles.textContent = `
            .review-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10003;
                animation: fadeIn 0.3s ease-out;
                overflow-y: auto;
            }
            .review-content {
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                padding: 2rem;
                border-radius: 15px;
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                margin: 2rem;
                color: white;
            }
            .review-list {
                margin: 2rem 0;
            }
            .review-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                margin: 1rem 0;
                border-radius: 10px;
                border-left: 4px solid;
            }
            .review-item.correct {
                background: rgba(0, 200, 81, 0.1);
                border-left-color: var(--hero-green);
            }
            .review-item.wrong {
                background: rgba(230, 36, 41, 0.1);
                border-left-color: var(--primary-red);
            }
            .review-image {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 8px;
            }
            .review-info {
                flex: 1;
            }
            .review-info h4 {
                margin-bottom: 0.5rem;
                color: var(--primary-gold);
            }
            .review-info p {
                margin: 0.25rem 0;
                font-size: 0.9rem;
            }
            .review-status {
                font-size: 1.5rem;
            }
            .review-content button {
                background: var(--primary-red);
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 1rem;
                width: 100%;
            }
        `;
        
        document.head.appendChild(reviewStyles);
        document.body.appendChild(reviewModal);
    }
    
    resetAnimations() {
        // Clear any existing animations
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animation = '';
        });
    }
}

// Add required CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes screenShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px); }
        75% { transform: translateX(3px); }
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
    }
    
    @keyframes floatUp {
        0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        100% { 
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes powerupPop {
        0% {
            transform: translateX(-50%) scale(0);
            opacity: 0;
        }
        50% {
            transform: translateX(-50%) scale(1.1);
            opacity: 1;
        }
        100% {
            transform: translateX(-50%) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;

document.head.appendChild(animationStyles);
