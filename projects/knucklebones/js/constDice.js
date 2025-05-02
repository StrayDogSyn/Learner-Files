/* Knuckle Bones of Ficklest Fortunes
 * Tabletop RPG Dice Emulator
 * StrayDog Syndications L.L.C.
 * Copyright 2024
 * All Rights Reserved
 */

class DiceGame {
  constructor() {
    this.diceTypes = {
      d4: new Dice(4),
      d6: new Dice(6),
      d20: new Dice(20)
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
      const dieType = $icon.attr('id').substring(1, 3);
      
      this.handleDiceRoll(dieType, $output, $icon);
    });

    // Roll all dice button
    $('#rollAll').click(() => this.rollAllDice());

    // Clear all results button
    $('#clearAll').click(() => this.clearAllResults());
  }

  async handleDiceRoll(dieType, $output, $icon) {
    this.isRolling = true;
    
    // Add rolling animation
    $icon.addClass('rolling');
    $output.parent().addClass('active');
    
    // Simulate roll delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = this.diceTypes[dieType].roll;
    
    // Update display with animation
    $output
      .html(result)
      .removeClass(this.colors.join(' '))
      .addClass(this.colors[this.getNextColor()])
      .addClass('pop-in');
    
    // Add to roll history
    this.addToHistory(dieType, result);
    
    // Remove animations
    setTimeout(() => {
      $icon.removeClass('rolling');
      $output.removeClass('pop-in');
      $output.parent().removeClass('active');
      this.isRolling = false;
    }, 300);
  }

  addToHistory(dieType, result) {
    this.rollHistory.push({ dieType, result, timestamp: new Date() });
    this.updateResults();
  }

  updateResults() {
    const $results = $('#rollResults');
    $results.empty();
    
    // Show last 5 rolls
    this.rollHistory.slice(-5).forEach(roll => {
      const $result = $('<div>')
        .addClass('result-item')
        .html(`
          <span class="die-type">d${roll.dieType}</span>
          <span class="roll-value ${this.colors[this.currentColor]}">${roll.result}</span>
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
      const dieType = $icon.attr('id').substring(1, 3);
      
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

  .active {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
`;

document.head.appendChild(style);

// Initialize the game
const game = new DiceGame();