/**
 * Knucklebones Dice Simulator Application Logic
 * Handles all UI interactions and application state
 */

$(document).ready(function () {
  // Application State
  let selectedDiceType = 4;
  let selectedDiceCount = 1;
  let dicePool = []; // Will store objects like {type: 6, count: 3}
  
  /**
   * Initialize the application
   */
  function initApp() {
    setupDiceTypeSelection();
    setupDiceCountControls();
    setupAddToPoolButton();
    setupRollButton();
    setupClearButton();
    setupDicePoolInteractions();
    setupQuickCombinations();
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
      selectedDiceType = parseInt($(this).data('dice-type'));
    });
  }

  /**
   * Set up the dice count slider and display
   */
  function setupDiceCountControls() {
    const diceCountSlider = $('#diceCount');
    const diceCountDisplay = $('#diceCountValue');
    
    diceCountSlider.on('input', function() {
      selectedDiceCount = parseInt($(this).val());
      diceCountDisplay.text(selectedDiceCount);
    });
  }

  /**
   * Set up the add to pool button
   */
  function setupAddToPoolButton() {
    $('#addToPoolBtn').click(function() {
      addDiceToPool(selectedDiceType, selectedDiceCount);
    });
  }

  /**
   * Add dice to the dice pool
   * @param {number} diceType - The type of dice to add
   * @param {number} diceCount - How many dice to add
   * @param {boolean} clearFirst - Whether to clear the pool first (for quick combinations)
   */
  function addDiceToPool(diceType, diceCount, clearFirst = false) {
    if (clearFirst) {
      dicePool = [];
    }
    
    // Check if this dice type is already in the pool
    const existingDiceIndex = dicePool.findIndex(dice => dice.type === diceType);
    
    if (existingDiceIndex !== -1) {
      // Update the count of existing dice
      dicePool[existingDiceIndex].count += diceCount;
    } else {
      // Add new dice type to pool
      dicePool.push({
        type: diceType,
        count: diceCount
      });
    }
    
    // Update the UI
    updateDicePoolDisplay();
  }
  
  /**
   * Update the dice pool display
   */
  function updateDicePoolDisplay() {
    const $dicePool = $('#selectedDicePool');
    
    // Clear the current display
    $dicePool.empty();
    
    if (dicePool.length === 0) {
      // Show empty message
      $dicePool.append('<p class="text-center text-muted empty-pool-message">Add dice to your pool using the buttons below</p>');
      return;
    }
    
    // Add each dice group to the pool display
    dicePool.forEach((dice, index) => {
      const iconClass = getDiceIconClass(dice.type.toString());
      
      const $diceItem = $(`
        <div class="dice-pool-item" data-index="${index}">
          <i class="dice-pool-icon fas ${iconClass}"></i>
          <span class="dice-pool-count">${dice.count}</span>
          <span>d${dice.type}</span>
          <button class="remove-dice" title="Remove these dice">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `);
      
      $dicePool.append($diceItem);
    });
  }
  
  /**
   * Setup dice pool interactions (removing dice)
   */
  function setupDicePoolInteractions() {
    // Use event delegation for dynamically added elements
    $('#selectedDicePool').on('click', '.remove-dice', function() {
      const index = $(this).closest('.dice-pool-item').data('index');
      
      // Remove the dice group from the pool
      dicePool.splice(index, 1);
      
      // Update the UI
      updateDicePoolDisplay();
    });
  }

  /**
   * Set up the roll button
   */
  function setupRollButton() {
    $('#rollDiceBtn').click(function() {
      if (dicePool.length === 0) {
        // If pool is empty, roll the currently selected dice
        rollDice([{type: selectedDiceType, count: selectedDiceCount}]);
      } else {
        // Roll all dice in the pool
        rollDice(dicePool);
      }
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
   * Setup quick combinations
   */
  function setupQuickCombinations() {
    $('.combination-btn').click(function() {
      const combination = $(this).data('combination');
      
      // Clear the current dice pool
      dicePool = [];
      
      // Add the appropriate dice based on the combination
      switch(combination) {
        case 'attack':
          addDiceToPool(20, 1);
          break;
          
        case 'damage-s':
          addDiceToPool(6, 1);
          break;
          
        case 'damage-m':
          addDiceToPool(8, 2);
          break;
          
        case 'damage-l':
          addDiceToPool(10, 3);
          break;
          
        case 'ability':
          addDiceToPool(6, 4);
          break;
      }
      
      // Roll the dice immediately
      rollDice(dicePool);
    });
  }
  
  /**
   * Roll multiple dice types and display results
   * @param {Array} diceGroups - Array of objects with type and count
   */
  function rollDice(diceGroups) {
    // Remove empty message if present
    $('.empty-results-message').remove();
    
    // Group all results to gather statistics
    const allResults = [];
    
    // Generate results for each dice group
    const diceGroupResults = diceGroups.map(group => {
      const { type, count } = group;
      const results = [];
      
      // Generate the roll results for this dice type
      const rollFunction = window.DiceUtils[`roll${type}`];
      if (typeof rollFunction === 'function') {
        for (let i = 0; i < count; i++) {
          const roll = rollFunction();
          results.push(roll);
          allResults.push(roll);
        }
      }
      
      return {
        type,
        count,
        results,
        total: results.reduce((sum, val) => sum + val, 0)
      };
    });
    
    // Display the results
    displayMultiRollResults(diceGroupResults);
    
    // Update statistics
    updateRollStatistics(allResults);
  }
  
  /**
   * Display multiple dice roll results in the UI
   * @param {Array} diceGroupResults - Results for each dice group
   */
  function displayMultiRollResults(diceGroupResults) {
    // Calculate grand total across all dice
    const grandTotal = diceGroupResults.reduce((sum, group) => sum + group.total, 0);
    
    // Create a summary of the roll
    const rollSummary = diceGroupResults.map(group => 
      `${group.count}d${group.type}`
    ).join(' + ');
    
    // Create the container for this roll
    const $rollResult = $(`
      <div class="multi-roll-result">
        <div class="multi-roll-header">
          <strong>${rollSummary}</strong>
          <span>Total: ${grandTotal}</span>
        </div>
        <div class="multi-roll-body">
          ${renderDiceGroups(diceGroupResults)}
        </div>
      </div>
    `);
    
    // Add to results container
    $('#rollResults').prepend($rollResult);
    
    // Limit the number of displayed results
    const maxResults = 10;
    if ($('#rollResults .multi-roll-result').length > maxResults) {
      $('#rollResults .multi-roll-result').last().remove();
    }
  }
  
  /**
   * Render HTML for all dice groups
   * @param {Array} diceGroupResults - Results for each dice group
   * @returns {string} HTML for the dice groups
   */
  function renderDiceGroups(diceGroupResults) {
    return diceGroupResults.map(group => {
      const iconClass = getDiceIconClass(group.type.toString());
      const displaySuffix = group.type === 100 ? '%' : '';
      
      const diceValuesHTML = group.results.map(result => 
        `<div class="dice-value dice-pop">${result}${displaySuffix}</div>`
      ).join('');
      
      return `
        <div class="dice-group">
          <div class="dice-group-header">
            <i class="dice-group-icon fas ${iconClass}"></i>
            <strong>${group.count}d${group.type}</strong>
            <span class="ms-auto">Group Total: ${group.total}</span>
          </div>
          <div class="roll-dice-values">
            ${diceValuesHTML}
          </div>
        </div>
      `;
    }).join('');
  }
  
  /**
   * Update roll statistics based on all roll results
   * @param {Array<number>} results - All dice results combined
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