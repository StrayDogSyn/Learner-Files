/**
 * Knucklebones Dice Simulator Application Logic
 * Handles all UI interactions and application state
 */

$(document).ready(function () {
  // Rainbow colors for dice results
  const rainbowColors = ["red", "dkorange", "dkpurple", "green", "dkblue", 
                       "indigo", "silver", "navy", "dkgreen", "orange"];
  let currentColor = 0;

  /**
   * Initialize the application
   */
  function initApp() {
    setupDiceTabs();
    setupDiceButtons();
    setupControlButtons();
  }

  /**
   * Set up the dice tab selection
   */
  function setupDiceTabs() {
    $('.dice-grid').hide();
    $('#d6Grid').show();
    $('.dice-select').removeClass('active');
    $('.dice-select[data-dice="d6"]').addClass('active');

    $('.dice-select').click(function() {
      const diceType = $(this).data('dice');
      $('.dice-grid').hide();
      $(`#${diceType}Grid`).show();
      $('.dice-select').removeClass('active');
      $(this).addClass('active');
    });
  }

  /**
   * Set up the dice roll buttons
   */
  function setupDiceButtons() {
    $('.dice-btn').on('click', function() {
      const id = $(this).attr('id');
      const outputId = id.replace('btn', 'num');
      const dieType = id.match(/btn(\d+)/)[1];
      const rollFunction = window['roll' + dieType];
      
      if (typeof rollFunction === 'function') {
        // Update output with roll result
        const result = rollFunction();
        const displayResult = dieType == 100 ? result + '%' : result;
        
        $('#' + outputId)
          .text(displayResult)
          .removeClass(rainbowColors.join(' '))
          .addClass(rainbowColors[currentColor]);
        
        // Update color for next roll
        currentColor = (currentColor + 1) % rainbowColors.length;
        
        // Add roll to results
        addToRollHistory(dieType, displayResult);
      }
    });
  }

  /**
   * Set up the control buttons
   */
  function setupControlButtons() {
    // Roll All button
    $('#rollAll').click(function() {
      $('.dice-grid:visible .dice-btn').each(function() {
        $(this).trigger('click');
      });
    });

    // Clear All button
    $('#clearAll').click(function() {
      $('output').text('0').removeClass(rainbowColors.join(' '));
      $('#rollResults').empty();
    });
  }
  
  /**
   * Add a roll to the history display
   * @param {string} dieType - The type of die rolled
   * @param {string} result - The result of the roll
   */
  function addToRollHistory(dieType, result) {
    const iconClass = dieType == 20 ? 'fa-dice-d20' : 
                     dieType == 6 ? 'fa-dice-d6' : 
                     dieType == 4 ? 'fa-dice-d4' : 
                     dieType == 10 ? 'fa-dice-d10' :
                     dieType == 12 ? 'fa-dice-d12' :
                     dieType == 100 ? 'fa-percentage' : 'fa-dice';
                     
    const time = new Date().toLocaleTimeString();
    
    const $result = $('<div>')
      .addClass('result-item')
      .html(`
        <span class="die-type">
          <i class="fas ${iconClass}"></i> d${dieType}
        </span>
        <span class="roll-time">${time}</span>
        <span class="roll-value ${rainbowColors[currentColor]}">
          ${result}
        </span>
      `);
    
    $('#rollResults').prepend($result);
    
    // Keep only last 5 results
    if ($('#rollResults .result-item').length > 5) {
      $('#rollResults .result-item').last().remove();
    }
  }

  // Initialize the application
  initApp();
});