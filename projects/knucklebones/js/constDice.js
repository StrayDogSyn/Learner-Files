/* Knuckle Bones of Ficklest Fortunes
 * Tabletop RPG Dice Emulator
 * StrayDog Syndications L.L.C.
 * Copyright 2024
 * All Rights Reserved
 */

class DiceGame {
  constructor() {
    this.diceTypes = {
      d3: new Dice(3),
      d4: new Dice(4),
      d6: new Dice(6),
      d8: new Dice(8),
      d10: new Dice(10),
      d12: new Dice(12),
      d20: new Dice(20),
      d100: new Dice(100)
    };

    // Expanded color palette for more variety
    this.colors = [
      "red", "blue", "green", "yellow", "purple", 
      "orange", "indigo", "dkblue", "dkgreen", "dkorange"
    ];
    
    // Dice icon mapping for better visual representation
    this.diceIcons = {
      d3: 'fa-dice',
      d4: 'fa-dice-d4',
      d6: 'fa-dice-d6',
      d8: 'fa-dice',
      d10: 'fa-dice-d10',
      d12: 'fa-dice-d12',
      d20: 'fa-dice-d20',
      d100: 'fa-percentage'
    };
    
    this.currentColor = 0;
    this.rollHistory = [];
    this.isRolling = false;
    this.activeTab = 'd6'; // Default active tab
    this.init();
  }

  init() {
    this.updateDiceIcons();
    this.attachEventListeners();
    this.setupDicePanels();
  }

  updateDiceIcons() {
    // Update dice icons based on the mapping
    Object.entries(this.diceTypes).forEach(([type, dice]) => {
      const iconClass = this.diceIcons[type] || 'fa-dice';
      $(`.dice-select[data-dice="${type}"] i`).removeClass().addClass(`fas ${iconClass}`);
      
      // Update all dice of this type
      $(`#${type}Grid i`).each((i, el) => {
        const $icon = $(el);
        if (!$icon.hasClass(iconClass)) {
          $icon.removeClass('fa-dice fa-dice-d4 fa-dice-d6 fa-dice-d8 fa-dice-d10 fa-dice-d12 fa-dice-d20 fa-percentage')
               .addClass(iconClass);
        }
      });
    });
  }

  setupDicePanels() {
    // Initially hide all dice grids except active tab
    $('.dice-grid').hide();
    $(`#${this.activeTab}Grid`).show();
    $(`.dice-select[data-dice="${this.activeTab}"]`).addClass('active');
    
    // Setup dice type selection
    $('.dice-select').click((e) => {
      const diceType = $(e.currentTarget).data('dice');
      this.activeTab = diceType;
      $('.dice-grid').hide();
      $(`#${diceType}Grid`).show();
      $('.dice-select').removeClass('active');
      $(e.currentTarget).addClass('active');
    });
  }

  attachEventListeners() {
    // Attach roll handlers
    $('.popover').click((e) => {
      if (this.isRolling) return;
      
      const $button = $(e.currentTarget);
      const $icon = $button.find('i');
      const $output = $button.find('output');
      const dieType = this.getDieType($icon.attr('id'));
      
      this.handleDiceRoll(dieType, $output, $icon);
    });

    // Roll all dice button
    $('#rollAll').click(() => this.rollAllDice());

    // Clear all results button
    $('#clearAll').click(() => this.clearAllResults());

    // Add keyboard shortcuts
    $(document).keydown((e) => {
      // Space or R to roll visible dice
      if (e.keyCode === 32 || e.keyCode === 82) {
        this.rollAllDice();
        e.preventDefault();
      }
      
      // C to clear results
      if (e.keyCode === 67) {
        this.clearAllResults();
        e.preventDefault();
      }
      
      // Number keys 1-8 to switch tabs
      if (e.keyCode >= 49 && e.keyCode <= 56) {
        const diceTypes = ['d3', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
        const index = e.keyCode - 49;
        if (index < diceTypes.length) {
          $(`.dice-select[data-dice="${diceTypes[index]}"]`).click();
        }
      }
    });
  }

  getDieType(iconId) {
    // Extract the die type from the icon ID (e.g., "d20a" -> "d20")
    const match = iconId.match(/d\d+/);
    return match ? match[0] : 'd6'; // Default to d6 if no match
  }

  async handleDiceRoll(dieType, $output, $icon) {
    this.isRolling = true;
    
    // Add rolling animation
    $icon.removeClass('fa-spin').addClass('rolling');
    $output.parent().addClass('active');
    
    // Play dice roll sound
    this.playRollSound(dieType);
    
    // Simulate roll delay with varying times for different dice
    const rollTime = this.getRollTime(dieType);
    await new Promise(resolve => setTimeout(resolve, rollTime));
    
    const result = this.diceTypes[dieType].roll;
    
    // Format result (add % for d100)
    const displayResult = dieType === 'd100' ? `${result}%` : result;
    
    // Update display with animation
    $output
      .html(displayResult)
      .removeClass(this.colors.join(' '))
      .addClass(this.colors[this.getNextColor()])
      .addClass('pop-in');
    
    // Add to roll history
    this.addToHistory(dieType, displayResult);
    
    // Remove animations
    setTimeout(() => {
      $icon.removeClass('rolling');
      $output.removeClass('pop-in');
      $output.parent().removeClass('active');
      this.isRolling = false;
    }, 300);
  }

  playRollSound(dieType) {
    // Simulate dice roll sound with Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Different dice have different sounds
      const baseFreq = 100 + parseInt(dieType.substring(1)) * 10;
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        baseFreq * 2, audioContext.currentTime + 0.1
      );
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      // Audio API not supported or other error, just ignore
      console.log("Audio not supported");
    }
  }

  getRollTime(dieType) {
    // Larger dice roll longer
    const baseSides = parseInt(dieType.substring(1));
    return 300 + Math.min(baseSides * 5, 300);
  }

  addToHistory(dieType, result) {
    // Add roll to history with die type icon
    const dieIcon = this.diceIcons[dieType] || 'fa-dice';
    
    this.rollHistory.push({ 
      dieType, 
      dieIcon,
      result, 
      timestamp: new Date().toLocaleTimeString() 
    });
    
    // Keep history at a reasonable size
    if (this.rollHistory.length > 20) {
      this.rollHistory = this.rollHistory.slice(-20);
    }
    
    this.updateResults();
  }

  updateResults() {
    const $results = $('#rollResults');
    $results.empty();
    
    // Show last 5 rolls
    this.rollHistory.slice(-5).reverse().forEach((roll, index) => {
      const $result = $('<div>')
        .addClass('result-item')
        .html(`
          <span class="die-type">
            <i class="fas ${roll.dieIcon}"></i> ${roll.dieType}
          </span>
          <span class="roll-time">${roll.timestamp}</span>
          <span class="roll-value ${this.colors[index % this.colors.length]}">
            ${roll.result}
          </span>
        `);
      $results.append($result);
    });
  }

  async rollAllDice() {
    if (this.isRolling) return;
    
    const $visibleDice = $('.dice-grid:visible .popover');
    
    // Add shake animation to all visible dice
    $visibleDice.addClass('shake-all');
    
    // Roll each die with a slight delay between them
    for (const die of $visibleDice) {
      const $die = $(die);
      const $icon = $die.find('i');
      const $output = $die.find('output');
      const dieType = this.getDieType($icon.attr('id'));
      
      await this.handleDiceRoll(dieType, $output, $icon);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    $visibleDice.removeClass('shake-all');
  }

  clearAllResults() {
    // Reset all dice to zero
    $('.output').html('0').removeClass(this.colors.join(' '));
    
    // Clear history with a fade effect
    const $results = $('#rollResults');
    $results.children().each((i, el) => {
      const $el = $(el);
      setTimeout(() => {
        $el.fadeOut(300, function() {
          $(this).remove();
        });
      }, i * 100);
    });
    
    // Reset history array
    setTimeout(() => {
      this.rollHistory = [];
    }, 500);
  }

  getNextColor() {
    this.currentColor = (this.currentColor + 1) % this.colors.length;
    return this.currentColor;
  }
}

class Dice {
  constructor(sides) {
    this.sides = sides;
  }

  get roll() {
    return this.rollDie();
  }

  rollDie() {
    return Math.floor(Math.random() * this.sides) + 1;
  }
}

// Add CSS animations and styles
const style = document.createElement('style');
style.textContent = `
  @keyframes pop-in {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }

  .pop-in {
    animation: pop-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    background: var(--surface-color);
    margin-bottom: 0.5rem;
    transform-origin: center;
    animation: pop-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .roll-time {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .active {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }

  @keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
  }

  .rolling {
    animation: shake 0.5s ease-in-out infinite;
  }

  .dice-select.active {
    background: var(--secondary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .shake-all {
    animation: shake 0.3s ease-in-out;
  }
  
  .dice-set {
    transition: all 0.3s ease;
  }
  
  /* Help tooltip for keyboard shortcuts */
  .game-controls::after {
    content: 'Keyboard: Space=Roll, C=Clear, 1-8=Select Dice';
    display: block;
    text-align: center;
    font-size: 0.8rem;
    opacity: 0.7;
    margin-top: 1rem;
  }
  
  /* Responsive adjustments */
  @media (max-width: 576px) {
    .result-item {
      flex-direction: column;
      text-align: center;
    }
    
    .roll-value {
      margin-top: 0.5rem;
      font-size: 1.5rem;
    }
  }
`;

document.head.appendChild(style);

// Initialize the game
const game = new DiceGame();