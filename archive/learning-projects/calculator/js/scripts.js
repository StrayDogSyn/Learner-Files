class Calculator {
  constructor() {
    this.state = {
      runningTotal: 0,
      buffer: "0",
      previousOperator: null,
      needsReset: false,
      lastOperation: "",
      memory: 0,
    };
    this.screen = document.querySelector(".screen");
    this.init();
  }

  init() {
    document.querySelector(".calc-buttons")
      .addEventListener("click", this.handleClick.bind(this));
      
    // Add keyboard support
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    
    // Add support for Enter/Space on focused buttons
    document.querySelector(".calc-buttons")
      .addEventListener("keydown", this.handleButtonKeyDown.bind(this));
    
    // Initial render
    this.render();
  }
  
  // Handle keyboard events on focused buttons
  handleButtonKeyDown(event) {
    if (event.target.classList.contains("calc-button")) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.target.click();
      }
    }
  }
  
  handleKeyDown(event) {
    const key = event.key;
    
    // Comprehensive list of calculator keys including numpad
    const calculatorKeys = [
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
      "+", "-", "*", "/", "=", "Enter", "Escape", "Backspace", "c", "C", ".",
      "NumpadEnter", "NumpadAdd", "NumpadSubtract", "NumpadMultiply", "NumpadDivide",
      "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", 
      "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9",
      "NumpadDecimal", "Delete", "Clear"
    ];
    
    // Prevent default behavior for calculator keys
    if (calculatorKeys.includes(key)) {
      event.preventDefault();
    }
    
    // Add visual feedback for key press
    this.addKeyPressEffect(key);
    
    // Map keyboard keys to calculator buttons (including numpad)
    if (this.isNumber(key) || this.isNumpadNumber(key)) {
      const number = this.getNumberFromKey(key);
      this.handleNumber(number);
    } else if (key === "+" || key === "NumpadAdd") {
      this.handleSymbol("+");
    } else if (key === "-" || key === "NumpadSubtract") {
      this.handleSymbol("-");
    } else if (key === "*" || key === "NumpadMultiply") {
      this.handleSymbol("×");
    } else if (key === "/" || key === "NumpadDivide") {
      this.handleSymbol("÷");
    } else if (key === "=" || key === "Enter" || key === "NumpadEnter") {
      this.handleSymbol("=");
    } else if (key === "Escape" || key.toLowerCase() === "c" || key === "Clear") {
      this.handleSymbol("C");
    } else if (key === "Backspace" || key === "Delete") {
      this.handleSymbol("←");
    } else if (key === "." || key === "NumpadDecimal") {
      // Handle decimal point (if you want to add decimal support)
      this.handleDecimal();
    }
    
    this.render();
  }
  
  // Helper method to check if key is a numpad number
  isNumpadNumber(key) {
    return key.startsWith("Numpad") && !isNaN(key.slice(-1));
  }
  
  // Helper method to extract number from any key type
  getNumberFromKey(key) {
    if (key.startsWith("Numpad")) {
      return key.slice(-1);
    }
    return key;
  }
  
  // Add visual feedback when keys are pressed
  addKeyPressEffect(key) {
    // Find button by text content and add visual feedback
    const buttons = document.querySelectorAll('.calc-button');
    buttons.forEach(button => {
      const buttonText = button.textContent.trim();
      let shouldHighlight = false;
      
      if (this.isNumber(key) || this.isNumpadNumber(key)) {
        const number = this.getNumberFromKey(key);
        shouldHighlight = buttonText === number && !button.classList.contains('function');
      } else if ((key === "+" || key === "NumpadAdd") && buttonText === "+") {
        shouldHighlight = true;
      } else if ((key === "-" || key === "NumpadSubtract") && buttonText === "-") {
        shouldHighlight = true;
      } else if ((key === "*" || key === "NumpadMultiply") && buttonText === "×") {
        shouldHighlight = true;
      } else if ((key === "/" || key === "NumpadDivide") && buttonText === "÷") {
        shouldHighlight = true;
      } else if ((key === "=" || key === "Enter" || key === "NumpadEnter") && buttonText === "=") {
        shouldHighlight = true;
      } else if ((key === "Escape" || key.toLowerCase() === "c" || key === "Clear") && buttonText === "C") {
        shouldHighlight = true;
      } else if ((key === "Backspace" || key === "Delete") && buttonText === "←") {
        shouldHighlight = true;
      }
      
      if (shouldHighlight) {
        button.classList.add('key-pressed');
        setTimeout(() => {
          button.classList.remove('key-pressed');
        }, 150);
      }
    });
  }
  
  // Handle decimal point input (basic implementation)
  handleDecimal() {
    if (!this.state.buffer.includes('.') && this.state.buffer !== "Error") {
      this.state.buffer += '.';
      this.render();
    }
  }

  isNumber(value) {
    return !isNaN(value) && value !== " ";
  }

  handleClick(event) {
    if (!event.target.classList.contains("calc-button")) return;
    
    const value = event.target.innerText;
    
    // Add button press animation
    event.target.classList.add("pulse");
    setTimeout(() => {
      event.target.classList.remove("pulse");
    }, 150);
    
    this.isNumber(value) ? this.handleNumber(value) : this.handleSymbol(value);
    this.render();
  }

  handleNumber(value) {
    // Prevent extremely long numbers
    if (this.state.buffer.length >= 12 && !this.state.needsReset) {
      return;
    }
    
    if (this.state.buffer === "0" || this.state.needsReset) {
      this.state.buffer = value;
      this.state.needsReset = false;
    } else {
      this.state.buffer += value;
    }
  }

  handleSymbol(symbol) {
    switch (symbol) {
      case "C":
        this.reset();
        break;
      case "←":
        this.backspace();
        break;
      case "=":
        this.calculate();
        break;
      default:
        this.handleOperator(symbol);
    }
  }

  reset() {
    this.state = {
      runningTotal: 0,
      buffer: "0",
      previousOperator: null,
      needsReset: false,
      lastOperation: "",
      memory: this.state.memory // Preserve memory across reset
    };
  }

  backspace() {
    if (this.state.buffer.length === 1) {
      this.state.buffer = "0";
    } else {
      this.state.buffer = this.state.buffer.slice(0, -1);
    }
  }

  handleOperator(operator) {
    const value = parseFloat(this.state.buffer);
    
    // Store the operation for display purposes
    this.state.lastOperation = `${this.state.runningTotal} ${operator} ${value}`;

    if (this.state.runningTotal === 0) {
      this.state.runningTotal = value;
    } else {
      this.state.runningTotal = this.executeOperation(
        this.state.runningTotal,
        value,
        this.state.previousOperator
      );
    }

    this.state.previousOperator = operator;
    this.state.buffer = this.formatNumber(this.state.runningTotal.toString());
    this.state.needsReset = true;
  }

  calculate() {
    if (!this.state.previousOperator) return;

    const value = parseFloat(this.state.buffer);
    
    // Update the last operation for display
    this.state.lastOperation = `${this.state.runningTotal} ${this.state.previousOperator} ${value} =`;
    
    this.state.runningTotal = this.executeOperation(
      this.state.runningTotal,
      value,
      this.state.previousOperator
    );
    
    this.state.buffer = this.formatNumber(this.state.runningTotal.toString());
    this.state.previousOperator = null;
  }
  executeOperation(a, b, operator) {
    switch (operator) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": 
        if (b === 0) {
          // Trigger explosion effect before returning error
          this.triggerExplosion();
          return "Error";
        }
        return a / b;
      default: return b;
    }
  }
  
  formatNumber(number) {
    // Handle error cases
    if (number === "Error") return number;
    
    // Check if number is too large
    if (parseFloat(number) > 1e12) {
      return parseFloat(number).toExponential(2);
    }
    
    // Format to avoid floating point errors
    const parsed = parseFloat(number);
    
    // Handle decimals (max 8 decimal places)
    if (number.includes('.')) {
      const parts = number.split('.');
      if (parts[1].length > 8) {
        return parsed.toFixed(8).replace(/\.?0+$/, '');
      }
    }
    
    return number;
  }
  render() {
    // Handle display for errors
    if (this.state.buffer === "Error") {
      this.screen.innerText = "Error";
      this.screen.classList.add('error');
      // Remove error class after animation
      setTimeout(() => {
        this.screen.classList.remove('error');
      }, 500);
      return;
    }
    
    // Remove error class if not in error state
    this.screen.classList.remove('error');
    
    // Format large numbers with commas
    const displayValue = this.formatNumber(this.state.buffer);
    this.screen.innerText = displayValue;
  }
    triggerExplosion() {
    // Show warning message first
    this.showWarningMessage();
    
    // Delay explosion for dramatic effect
    setTimeout(() => {
      // Create explosion overlay
      const explosionOverlay = document.createElement('div');
      explosionOverlay.className = 'explosion-overlay';
      document.body.appendChild(explosionOverlay);
      
      // Get calculator position and dimensions
      const calculator = document.querySelector('.wrapper');
      const rect = calculator.getBoundingClientRect();
      
      // Create screen flash effect
      this.createScreenFlash();
      
      // Create pixelated fragments
      this.createPixelatedFragments(rect);
      
      // Shake the entire page
      this.shakeScreen();
      
      // Play explosion sound effect (optional)
      this.playExplosionSound();
      
      // Reset calculator after explosion animation
      setTimeout(() => {
        this.reset();
        this.render();
        explosionOverlay.remove();
      }, 3000);
    }, 1000);
  }
  
  showWarningMessage() {
    const warning = document.createElement('div');
    warning.className = 'explosion-warning';
    warning.innerHTML = `
      <div class="warning-content">
        <i class="fa fa-exclamation-triangle"></i>
        <h2>CRITICAL ERROR</h2>
        <p>Division by zero detected!</p>
        <p>Initiating emergency protocols...</p>
        <div class="warning-countdown">
          <span id="countdown">3</span>
        </div>
      </div>
    `;
    document.body.appendChild(warning);
    
    // Countdown animation
    let count = 3;
    const countdownEl = warning.querySelector('#countdown');
    const countdown = setInterval(() => {
      count--;
      if (count > 0) {
        countdownEl.textContent = count;
        countdownEl.style.transform = 'scale(1.5)';
        setTimeout(() => {
          countdownEl.style.transform = 'scale(1)';
        }, 100);
      } else {
        clearInterval(countdown);
        warning.remove();
      }
    }, 300);
  }
  
  createScreenFlash() {
    const flash = document.createElement('div');
    flash.className = 'explosion-flash';
    document.body.appendChild(flash);
    
    setTimeout(() => {
      flash.remove();
    }, 200);
  }
    createPixelatedFragments(calculatorRect) {
    const fragmentCount = 40;
    const calculator = document.querySelector('.wrapper');
    
    // Add explosion class to calculator for additional effects
    calculator.classList.add('exploding');
    
    // Remove exploding class after animation
    setTimeout(() => {
      calculator.classList.remove('exploding');
    }, 300);
    
    for (let i = 0; i < fragmentCount; i++) {
      const fragment = document.createElement('div');
      
      // Vary fragment types for more visual interest
      const fragmentType = Math.random();
      if (fragmentType < 0.7) {
        fragment.className = 'pixel-fragment';
      } else if (fragmentType < 0.9) {
        fragment.className = 'spark-fragment';
      } else {
        fragment.className = 'smoke-fragment';
      }
      
      // Random fragment size and color based on type
      let size, colors;
      if (fragment.className === 'spark-fragment') {
        size = Math.random() * 8 + 4;
        colors = ['#ffff00', '#ffaa00', '#ff6600', '#ff4444'];
      } else if (fragment.className === 'smoke-fragment') {
        size = Math.random() * 30 + 20;
        colors = ['#666', '#888', '#aaa', '#999'];
      } else {
        size = Math.random() * 20 + 10;
        colors = ['#ff4444', '#ff8800', '#ffaa00', '#fff', '#ff6666'];
      }
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      fragment.style.width = size + 'px';
      fragment.style.height = size + 'px';
      fragment.style.backgroundColor = color;
      
      if (fragment.className === 'spark-fragment') {
        fragment.style.boxShadow = `0 0 ${size}px ${color}`;
        fragment.style.borderRadius = '50%';
      } else if (fragment.className === 'smoke-fragment') {
        fragment.style.borderRadius = '50%';
        fragment.style.opacity = '0.6';
      } else {
        fragment.style.boxShadow = `0 0 ${size/2}px ${color}`;
      }
      
      // Position at calculator center initially
      const centerX = calculatorRect.left + calculatorRect.width / 2;
      const centerY = calculatorRect.top + calculatorRect.height / 2;
      
      fragment.style.left = centerX + 'px';
      fragment.style.top = centerY + 'px';
      
      document.body.appendChild(fragment);
      
      // Animate fragment with physics
      this.animateFragment(fragment, centerX, centerY);
    }
  }
    animateFragment(fragment, startX, startY) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 300 + 100;
    const gravity = 980; // pixels per second squared
    const bounce = 0.7;
    const friction = 0.98;
    
    // Different physics for different fragment types
    const isSpark = fragment.classList.contains('spark-fragment');
    const isSmoke = fragment.classList.contains('smoke-fragment');
    
    let x = startX;
    let y = startY;
    let vx = Math.cos(angle) * velocity * (isSpark ? 1.5 : isSmoke ? 0.5 : 1);
    let vy = Math.sin(angle) * velocity * (isSpark ? 1.5 : isSmoke ? 0.3 : 1);
    let rotation = 0;
    let rotationSpeed = (Math.random() - 0.5) * (isSpark ? 30 : isSmoke ? 5 : 20);
    
    const startTime = Date.now();
    const duration = isSpark ? 2 : isSmoke ? 4 : 3;
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      const deltaTime = 0.016; // 60fps
      
      // Apply physics based on fragment type
      if (isSmoke) {
        // Smoke rises and disperses
        vy -= gravity * deltaTime * 0.1; // Lighter gravity for smoke
        vx *= 0.995; // Gradual slowdown
      } else {
        // Normal gravity for sparks and pixels
        vy += gravity * deltaTime;
      }
      
      x += vx * deltaTime;
      y += vy * deltaTime;
      rotation += rotationSpeed;
      
      // Bounce off edges (not for smoke)
      if (!isSmoke) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        if (x <= 0 || x >= windowWidth) {
          vx *= -bounce;
          x = Math.max(0, Math.min(windowWidth, x));
        }
        
        if (y >= windowHeight) {
          vy *= -bounce;
          y = windowHeight;
          vx *= friction; // Apply friction on ground contact
          rotationSpeed *= friction;
        }
      }
      
      // Update fragment position
      fragment.style.transform = `translate(${x - startX}px, ${y - startY}px) rotate(${rotation}deg)`;
      
      // Fade out over time with different rates
      let opacity;
      if (isSpark) {
        opacity = Math.max(0, 1 - elapsed / 2); // Sparks fade quickly
      } else if (isSmoke) {
        opacity = Math.max(0, 0.6 - elapsed / 4); // Smoke fades slowly
      } else {
        opacity = Math.max(0, 1 - elapsed / 3); // Normal fade
      }
      
      fragment.style.opacity = opacity;
      
      // Scale smoke fragments as they disperse
      if (isSmoke) {
        const scale = 1 + elapsed * 0.5;
        fragment.style.transform += ` scale(${scale})`;
      }
      
      // Continue animation or cleanup
      if (elapsed < duration && opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        fragment.remove();
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  shakeScreen() {
    document.body.classList.add('screen-shake');
    setTimeout(() => {
      document.body.classList.remove('screen-shake');
    }, 1000);
  }
  
  playExplosionSound() {
    // Create a simple explosion sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create explosion sound effect
      const duration = 0.5;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create noise for explosion effect
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1, audioContext.currentTime + duration);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      // Audio not supported or blocked
      console.log('Audio not available');
    }
  }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
  new Calculator();
  
  // Add class to enable animations after load
  document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('visible');
  });
});