/**
 * Knucklebones Dice Simulator Application Logic
 * Handles all UI interactions and application state
 */

$(document).ready(function () {
  // Application State
  let currentDiceType = 4;
  let currentDiceCount = 1;
  
  /**
   * Initialize the application
   */
  function initApp() {
    setupDiceTypeSelection();
    setupDiceCountControls();
    setupRollButton();
    setupClearButton();
    updateCurrentSelectionDisplay();
  }

  /**
   * Set up the dice type selection buttons
   */
  function setupDiceTypeSelection() {
    $('.dice-type-btn').click(function() {
      // Update active state
      $('.dice-type-btn').removeClass('active');
      $(this).addClass('active');
      
      // Update state
      currentDiceType = $(this).data('dice-type');
      
      // Update display
      updateCurrentSelectionDisplay();
    });
  }

  /**
   * Set up the dice count slider and display
   */
  function setupDiceCountControls() {
    const diceCountSlider = $('#diceCount');
    const diceCountDisplay = $('#diceCountValue');
    
    diceCountSlider.on('input', function() {
      currentDiceCount = parseInt($(this).val());
      diceCountDisplay.text(currentDiceCount);
      updateCurrentSelectionDisplay();
    });
  }

  /**
   * Update the current selection display text and icon
   */
  function updateCurrentSelectionDisplay() {
    $('#currentSelectionText').text(`Rolling ${currentDiceCount}d${currentDiceType}`);
    
    // Update the preview icon
    const iconClass = getDiceIconClass(currentDiceType.toString());
    $('#previewDiceIcon').attr('class', `fas ${iconClass} fa-4x fa-spin`);
  }

  /**
   * Set up the roll button
   */
  function setupRollButton() {
    $('#rollDiceBtn').click(function() {
      rollDice(currentDiceType, currentDiceCount);
    });
  }

  /**
   * Set up the clear button
   */
  function setupClearButton() {
    $('#clearResults').click(function() {
      // Clear the results
      $('#rollResults').empty().append(`
        <div class="empty-results-message text-center py-5">
          <i class="fas fa-dice fa-3x mb-3"></i>
          <p>Your dice results will appear here</p>
        </div>
      `);
      
      // Reset statistics
      updateRollStatistics([]);
    });
  }
  
  /**
   * Roll dice and display results
   * @param {number} diceType - The type of dice to roll (e.g., 6 for d6)
   * @param {number} diceCount - How many dice to roll
   */
  function rollDice(diceType, diceCount) {
    // Get the roll function from DiceUtils
    const rollFunction = window.DiceUtils[`roll${diceType}`];
    
    if (typeof rollFunction !== 'function') {
      console.error(`No roll function found for d${diceType}`);
      return;
    }
    
    // Generate the roll results
    const results = [];
    for (let i = 0; i < diceCount; i++) {
      const roll = rollFunction();
      results.push(roll);
    }
    
    // Display the results
    displayRollResults(diceType, results);
    
    // Update statistics
    updateRollStatistics(results);
  }
  
  /**
   * Display roll results in the UI
   * @param {number} diceType - The type of dice rolled
   * @param {Array<number>} results - The results of the roll
   */
  function displayRollResults(diceType, results) {
    // Remove empty message if present
    $('.empty-results-message').remove();
    
    // Create a new roll result element
    const iconClass = getDiceIconClass(diceType.toString());
    const displaySuffix = diceType === 100 ? '%' : '';
    
    const diceValuesHTML = results.map(result => 
      `<div class="dice-value dice-pop">${result}${displaySuffix}</div>`
    ).join('');
    
    const $rollResult = $(`
      <div class="roll-result">
        <div class="roll-dice-icon">
          <i class="fas ${iconClass}"></i>
        </div>
        <div class="roll-details">
          <div class="roll-header">
            <strong>${results.length}d${diceType} Roll</strong>
            <span>Total: ${results.reduce((sum, val) => sum + val, 0)}</span>
          </div>
          <div class="roll-dice-values">
            ${diceValuesHTML}
          </div>
        </div>
      </div>
    `);
    
    // Add to results container
    $('#rollResults').prepend($rollResult);
    
    // Limit the number of displayed results
    const maxResults = 10;
    if ($('#rollResults .roll-result').length > maxResults) {
      $('#rollResults .roll-result').last().remove();
    }
  }
  
  /**
   * Update roll statistics based on current roll
   * @param {Array<number>} results - The results of the current roll
   */
  function updateRollStatistics(results) {
    if (results.length === 0) {
      // Reset stats
      $('#rollTotal').text('0');
      $('#rollAverage').text('0');
      $('#rollHighest').text('0');
      $('#rollLowest').text('0');
      return;
    }
    
    const total = results.reduce((sum, val) => sum + val, 0);
    const average = (total / results.length).toFixed(1);
    const highest = Math.max(...results);
    const lowest = Math.min(...results);
    
    $('#rollTotal').text(total);
    $('#rollAverage').text(average);
    $('#rollHighest').text(highest);
    $('#rollLowest').text(lowest);
  }

  /**
   * Get the appropriate FontAwesome icon class for a die type
   * @param {string} dieType - The type of die
   * @returns {string} The appropriate FontAwesome icon class
   */
  function getDiceIconClass(dieType) {
    switch(dieType) {
      case '3':  return 'fa-dice-three';
      case '4':  return 'fa-dice-d4';
      case '6':  return 'fa-dice-d6';
      case '8':  return 'fa-dice-d8';
      case '10': return 'fa-dice-d10';
      case '12': return 'fa-dice-d12';
      case '20': return 'fa-dice-d20';
      case '100': return 'fa-percentage';
      default:   return 'fa-dice';
    }
  }

  // Initialize the application
  initApp();
});