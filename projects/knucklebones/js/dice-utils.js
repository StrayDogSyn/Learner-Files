/**
 * Dice Rolling Utilities for Knucklebones
 * Contains all dice rolling functions used in the application
 */

// Dice rolling utility functions
const DiceUtils = {
  /**
   * Roll a 3-sided die
   * @returns {number} Random number between 1-3
   */
  roll3: function() { 
    return Math.floor(3 * Math.random()) + 1; 
  },

  /**
   * Roll a 4-sided die
   * @returns {number} Random number between 1-4
   */
  roll4: function() { 
    return Math.floor(4 * Math.random()) + 1; 
  },

  /**
   * Roll a 6-sided die
   * @returns {number} Random number between 1-6
   */
  roll6: function() { 
    return Math.floor(6 * Math.random()) + 1; 
  },

  /**
   * Roll an 8-sided die
   * @returns {number} Random number between 1-8
   */
  roll8: function() { 
    return Math.floor(8 * Math.random()) + 1; 
  },

  /**
   * Roll a 10-sided die
   * @returns {number} Random number between 1-10
   */
  roll10: function() { 
    return Math.floor(10 * Math.random()) + 1; 
  },

  /**
   * Roll a 12-sided die
   * @returns {number} Random number between 1-12
   */
  roll12: function() { 
    return Math.floor(12 * Math.random()) + 1; 
  },

  /**
   * Roll a 20-sided die
   * @returns {number} Random number between 1-20
   */
  roll20: function() { 
    return Math.floor(20 * Math.random()) + 1; 
  },

  /**
   * Roll a percentile die (d100)
   * @returns {number} Random number between 1-100
   */
  roll100: function() { 
    return Math.floor(100 * Math.random()) + 1; 
  }
};

// Make the DiceUtils available globally
window.DiceUtils = DiceUtils;

// For backward compatibility, expose the individual roll functions on the window object
window.roll3 = DiceUtils.roll3;
window.roll4 = DiceUtils.roll4;
window.roll6 = DiceUtils.roll6;
window.roll8 = DiceUtils.roll8;
window.roll10 = DiceUtils.roll10;
window.roll12 = DiceUtils.roll12;
window.roll20 = DiceUtils.roll20;
window.roll100 = DiceUtils.roll100;