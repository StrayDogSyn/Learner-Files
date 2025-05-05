/**
 * Knucklebones Dice Simulator Application Logic
 * Handles all UI interactions and application state
 */

$(document).ready(function () {
  // Application State
  let selectedDiceType = 4;
  let selectedDiceCount = 1;
  let dicePool = []; // Will store objects like {type: 6, count: 3}
  let isDarkMode = localStorage.getItem('kbDarkMode') === 'true';
  let isDiceSoundEnabled = localStorage.getItem('kbDiceSound') !== 'false'; // Default to true
  let rollHistory = JSON.parse(localStorage.getItem('kbRollHistory') || '[]');
  
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
    setupGameOptions(); // Initialize Game Options menu functionality
    
    // Apply dark mode if it was previously enabled
    if (isDarkMode) {
      applyDarkMode();
    }
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
   * Set up Game Options menu functionality
   */
  function setupGameOptions() {
    // Save current dice pool
    $('#saveCurrentPool').click(function() {
      if (dicePool.length === 0) {
        showNotification('No dice in your pool to save', 'warning');
        return;
      }
      
      saveCurrentDicePool();
    });
    
    // Load saved pools
    $('#loadSavedPools').click(function() {
      showSavedPools();
    });
    
    // Toggle dark mode
    $('#toggleDarkMode').click(function() {
      isDarkMode = !isDarkMode;
      localStorage.setItem('kbDarkMode', isDarkMode);
      
      if (isDarkMode) {
        applyDarkMode();
        $(this).html('<i class="fas fa-sun me-2"></i>Toggle Light Mode');
      } else {
        removeDarkMode();
        $(this).html('<i class="fas fa-moon me-2"></i>Toggle Dark Mode');
      }
      
      showNotification(`${isDarkMode ? 'Dark' : 'Light'} mode enabled`, 'info');
    });
    
    // Toggle dice sound
    $('#toggleDiceSound').click(function() {
      isDiceSoundEnabled = !isDiceSoundEnabled;
      localStorage.setItem('kbDiceSound', isDiceSoundEnabled);
      
      if (isDiceSoundEnabled) {
        $(this).html('<i class="fas fa-volume-up me-2"></i>Toggle Dice Sound');
      } else {
        $(this).html('<i class="fas fa-volume-mute me-2"></i>Toggle Dice Sound');
      }
      
      showNotification(`Dice sounds ${isDiceSoundEnabled ? 'enabled' : 'disabled'}`, 'info');
    });
    
    // Show roll history
    $('#showRollHistory').click(function() {
      showRollHistory();
    });
    
    // Clear saved data
    $('#clearSavedData').click(function() {
      if (confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
        localStorage.removeItem('kbSavedPools');
        localStorage.removeItem('kbRollHistory');
        rollHistory = [];
        
        showNotification('All saved data has been cleared', 'success');
      }
    });
    
    // Update UI based on current settings
    updateGameOptionsUI();
  }
  
  /**
   * Update Game Options UI based on current settings
   */
  function updateGameOptionsUI() {
    if (isDarkMode) {
      $('#toggleDarkMode').html('<i class="fas fa-sun me-2"></i>Toggle Light Mode');
    }
    
    if (!isDiceSoundEnabled) {
      $('#toggleDiceSound').html('<i class="fas fa-volume-mute me-2"></i>Toggle Dice Sound');
    }
  }
  
  /**
   * Apply dark mode to the application
   */
  function applyDarkMode() {
    $('body').addClass('dark-mode');
    $('.card').addClass('dark-card');
    $('.dice-pool-item, .multi-roll-result, .roll-stats, .dice-group').addClass('dark-element');
    $('.empty-pool-message, .empty-results-message').addClass('dark-text');
  }
  
  /**
   * Remove dark mode from the application
   */
  function removeDarkMode() {
    $('body').removeClass('dark-mode');
    $('.card').removeClass('dark-card');
    $('.dice-pool-item, .multi-roll-result, .roll-stats, .dice-group').removeClass('dark-element');
    $('.empty-pool-message, .empty-results-message').removeClass('dark-text');
  }
  
  /**
   * Save the current dice pool with a custom name
   */
  function saveCurrentDicePool() {
    const poolName = prompt('Enter a name for this dice pool:');
    
    if (!poolName) return;
    
    // Get existing saved pools or create a new array
    const savedPools = JSON.parse(localStorage.getItem('kbSavedPools') || '[]');
    
    // Add this pool to the saved pools
    savedPools.push({
      name: poolName,
      dicePool: dicePool,
      timestamp: new Date().toISOString()
    });
    
    // Save back to local storage
    localStorage.setItem('kbSavedPools', JSON.stringify(savedPools));
    
    showNotification(`Dice pool "${poolName}" saved successfully`, 'success');
  }
  
  /**
   * Show a modal with saved pools
   */
  function showSavedPools() {
    const savedPools = JSON.parse(localStorage.getItem('kbSavedPools') || '[]');
    
    if (savedPools.length === 0) {
      showNotification('No saved dice pools found', 'info');
      return;
    }
    
    // Create a modal to display saved pools
    const $modal = $(`
      <div class="modal fade" id="savedPoolsModal" tabindex="-1" aria-labelledby="savedPoolsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="savedPoolsModalLabel">
                <i class="fas fa-folder-open me-2"></i>Saved Dice Pools
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="list-group saved-pools-list">
                ${savedPools.map((pool, index) => `
                  <button type="button" class="list-group-item list-group-item-action load-pool-btn" data-index="${index}">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="mb-1">${pool.name}</h6>
                        <p class="mb-1 small text-muted">
                          ${pool.dicePool.map(d => `${d.count}d${d.type}`).join(' + ')}
                        </p>
                      </div>
                      <button class="btn btn-sm btn-outline-danger delete-pool-btn" data-index="${index}">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `);
    
    // Add event handlers
    $modal.find('.load-pool-btn').click(function(e) {
      if ($(e.target).hasClass('delete-pool-btn')) return;
      
      const index = $(this).data('index');
      const pool = savedPools[index];
      
      // Clear current pool and load saved one
      dicePool = JSON.parse(JSON.stringify(pool.dicePool)); // Deep copy
      updateDicePoolDisplay();
      
      // Close modal
      $modal.modal('hide');
      
      showNotification(`Loaded dice pool: "${pool.name}"`, 'success');
    });
    
    $modal.find('.delete-pool-btn').click(function(e) {
      e.stopPropagation(); // Prevent triggering parent click
      
      const index = $(this).data('index');
      const pool = savedPools[index];
      
      if (confirm(`Delete saved pool "${pool.name}"?`)) {
        savedPools.splice(index, 1);
        localStorage.setItem('kbSavedPools', JSON.stringify(savedPools));
        $(this).closest('.list-group-item').remove();
        
        if (savedPools.length === 0) {
          $modal.modal('hide');
        }
        
        showNotification(`Deleted dice pool: "${pool.name}"`, 'info');
      }
    });
    
    // Add modal to body and show it
    $('body').append($modal);
    $modal.modal('show');
    
    // Remove modal from DOM when hidden
    $modal.on('hidden.bs.modal', function() {
      $(this).remove();
    });
  }
  
  /**
   * Show roll history in a modal
   */
  function showRollHistory() {
    if (rollHistory.length === 0) {
      showNotification('No roll history available', 'info');
      return;
    }
    
    // Create a modal to display roll history
    const $modal = $(`
      <div class="modal fade" id="rollHistoryModal" tabindex="-1" aria-labelledby="rollHistoryModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="rollHistoryModalLabel">
                <i class="fas fa-history me-2"></i>Roll History
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="list-group roll-history-list">
                ${rollHistory.slice(0, 50).map((record, index) => `
                  <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <h6 class="mb-1">${record.summary} = <strong>${record.total}</strong></h6>
                      <small class="text-muted">${new Date(record.timestamp).toLocaleString()}</small>
                    </div>
                    <p class="mb-1">
                      Results: ${record.results.join(', ')}
                    </p>
                  </div>
                `).join('')}
              </div>
              ${rollHistory.length > 50 ? '<div class="text-center mt-3 text-muted">Showing most recent 50 rolls</div>' : ''}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" id="clearHistoryBtn">Clear History</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `);
    
    // Add event handlers
    $modal.find('#clearHistoryBtn').click(function() {
      if (confirm('Are you sure you want to clear all roll history? This action cannot be undone.')) {
        rollHistory = [];
        localStorage.removeItem('kbRollHistory');
        $modal.modal('hide');
        showNotification('Roll history cleared', 'success');
      }
    });
    
    // Add modal to body and show it
    $('body').append($modal);
    $modal.modal('show');
    
    // Remove modal from DOM when hidden
    $modal.on('hidden.bs.modal', function() {
      $(this).remove();
    });
  }
  
  /**
   * Show a notification message
   * @param {string} message - The message to display
   * @param {string} type - The type of notification (success, info, warning, danger)
   */
  function showNotification(message, type = 'info') {
    // Create toast container if it doesn't exist
    if ($('#toastContainer').length === 0) {
      $('body').append('<div id="toastContainer" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;"></div>');
    }
    
    const $toast = $(`
      <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `);
    
    $('#toastContainer').append($toast);
    
    const toast = new bootstrap.Toast($toast, {
      autohide: true,
      delay: 3000
    });
    
    toast.show();
    
    // Remove toast from DOM after it's hidden
    $toast.on('hidden.bs.toast', function() {
      $(this).remove();
    });
  }

  /**
   * Roll dice with sound effect if enabled
   */
  function rollDice(diceGroups) {
    // Play dice roll sound if enabled
    if (isDiceSoundEnabled) {
      playDiceSound();
    }
    
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
    
    // Add to roll history
    const rollSummary = diceGroupResults.map(group => `${group.count}d${group.type}`).join(' + ');
    const total = allResults.reduce((sum, val) => sum + val, 0);
    
    // Add to history
    addToRollHistory(rollSummary, total, allResults);
  }
  
  /**
   * Add a roll to the history
   * @param {string} summary - Summary of dice rolled (e.g., "2d6 + 1d8")
   * @param {number} total - Total result of all dice
   * @param {Array<number>} results - Individual die results
   */
  function addToRollHistory(summary, total, results) {
    // Add new record to beginning of array (most recent first)
    rollHistory.unshift({
      summary,
      total,
      results,
      timestamp: new Date().toISOString()
    });
    
    // Keep history at a reasonable size (max 100 rolls)
    if (rollHistory.length > 100) {
      rollHistory = rollHistory.slice(0, 100);
    }
    
    // Save to local storage
    localStorage.setItem('kbRollHistory', JSON.stringify(rollHistory));
  }
  
  /**
   * Play dice rolling sound
   */
  function playDiceSound() {
    const audio = new Audio('https://cdn.freesound.org/previews/220/220156_4100837-lq.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => {
      // Silent error - browsers may block autoplay
      console.log("Couldn't play dice sound: ", e);
    });
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