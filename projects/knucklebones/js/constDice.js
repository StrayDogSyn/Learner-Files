/* Knuckle Bones of Ficklest Fortunes
 * Tabletop RPG Dice Emulator
 * StrayDog Syndications L.L.C.
 * Copyright 2024
 * All Rights Reserved
 */

class DiceGame {
  constructor() {
    this.diceTypes = {
      d2: new Dice(2),
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
      "red", "dkorange", "dkpurple", "green", "dkblue", 
      "indigo", "silver", "navy", "dkgreen", "orange", 
      "dkgold", "black", "violet", "fire", "yellow", 
      "dkslate", "blue"
    ];
    
    this.currentColor = 0;
    this.init();
  }

  init() {
    // Initialize each die type
    Object.entries(this.diceTypes).forEach(([type, die]) => {
      die.sides = die.constructor.sides;
    });

    this.attachEventListeners();
  }

  attachEventListeners() {
    const diceGroups = {
      d4: 6,   // 6 d4 dice
      d6: 6,   // 6 d6 dice
      d8: 6,   // 6 d8 dice
      d10: 6,  // 6 d10 dice
      d12: 6,  // 6 d12 dice
      d20: 4,  // 4 d20 dice
      d100: 4  // 4 d100 dice
    };

    // Attach click handlers for each die group
    Object.entries(diceGroups).forEach(([dieType, count]) => {
      for (let i = 0; i < count; i++) {
        const letter = String.fromCharCode(97 + i); // a, b, c, etc.
        const buttonId = `btn${dieType.slice(1)}${letter}`;
        const outputId = `num${dieType.slice(1)}${letter}`;

        $(`#${buttonId}`).click(() => this.handleDiceRoll(dieType, outputId));
      }
    });
  }

  handleDiceRoll(dieType, outputId) {
    const result = this.diceTypes[dieType].roll;
    const display = dieType === 'd100' ? `${result}%` : result;

    $(`#${outputId}`)
      .html(display)
      .removeClass(this.colors[this.currentColor])
      .addClass(this.colors[this.getNextColor()]);
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

  static get sides() {
    return this.constructor.sides;
  }
}

// Initialize the game
const game = new DiceGame();