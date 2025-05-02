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

    this.colors = [
      "red", "blue", "green", "yellow", "purple"
    ];
    
    this.currentColor = 0;
    this.rollHistory = [];
    this.isRolling = false;
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.setupDicePanels();
  }

  setupDicePanels() {
    // Initially hide all dice grids except d6
    $('.dice-grid').hide();
    $('#d6Grid').show();
    
    // Setup dice type selection
    $('.dice-select').click(function() {
      const diceType = $(this).data('dice');
      $('.dice-grid').hide();
      $(`#${diceType}Grid`).show();
      $('.dice-select').removeClass('active');
      $(this).addClass('active');
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
  }

  getDieType(iconId) {
    // Extract the die type from the icon ID (e.g., "d20a" -> "d20")
    const match = iconId.match(/d\d+/);
    return match ? match[0] : 'd6'; // Default to d6 if no match
  }

  async handleDiceRoll(dieType, $output, $icon) {
    this.isRolling = true;
    
    // Add rolling animation
    $icon.addClass('rolling');
    $output.parent().addClass('active');
    
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

  getRollTime(dieType) {
    // Larger dice roll longer
    const baseSides = parseInt(dieType.substring(1));
    return 300 + Math.min(baseSides * 10, 500);
  }

  addToHistory(dieType, result) {
    this.rollHistory.push({ 
      dieType, 
      result, 
      timestamp: new Date().toLocaleTimeString() 
    });
    this.updateResults();
  }

  updateResults() {
    const $results = $('#rollResults');
    $results.empty();
    
    // Show last 5 rolls
    this.rollHistory.slice(-5).reverse().forEach(roll => {
      const $result = $('<div>')
        .addClass('result-item')
        .html(`
          <span class="die-type">
            <i class="fas fa-dice"></i> ${roll.dieType}
          </span>
          <span class="roll-time">${roll.timestamp}</span>
          <span class="roll-value ${this.colors[this.currentColor]}">
            ${roll.result}
          </span>
        `);
      $results.append($result);
    });
  }

  async rollAllDice() {
    if (this.isRolling) return;
    
    const $visibleDice = $('.dice-grid:visible .popover');
    for (const die of $visibleDice) {
      const $die = $(die);
      const $icon = $die.find('i');
      const $output = $die.find('output');
      const dieType = this.getDieType($icon.attr('id'));
      
      await this.handleDiceRoll(dieType, $output, $icon);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  clearAllResults() {
    $('.output').html('0').removeClass(this.colors.join(' '));
    this.rollHistory = [];
    this.updateResults();
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

// Add CSS animations
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
`;

document.head.appendChild(style);

// Initialize the game
const game = new DiceGame();