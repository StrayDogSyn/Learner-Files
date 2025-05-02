// KnuckleBones Dice Simulator JavaScript
// This file is maintained for backward compatibility and now imports the modularized code

// The dice utility functions are now in dice-utils.js
// The application logic is now in knucklebones-app.js

// Debug code to verify functionality - remove after testing
$(document).ready(function() {
  console.log("knuckleBeta.js loaded");
  
  // Verify dice utilities are available
  if (window.DiceUtils) {
    console.log("DiceUtils is available:", window.DiceUtils);
  } else {
    console.error("DiceUtils is not available - dice-utils.js may not be loaded correctly");
  }
  
  // Add a test dice roll when d6 button is clicked
  $('#btn6a').on('click', function() {
    console.log("D6 button clicked");
    var result = window.DiceUtils.roll6();
    console.log("D6 roll result:", result);
  });
});