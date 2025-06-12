/* Canvas HTML manipulation code for the intro screen*/

/* Code adapted from;
 * pg 30 | Chapter 1: Introduction to HTML5 Canvas
 * HTML5 Canvas, Second Edition
 * by Steve Fulton and Jeff Fulton
 * Copyright © 2013 8bitrocket Studios. All rights reserved.
 * Printed in the United States of America.
 * Published by O’Reilly Media, Inc., 1005 Gravenstein Highway North
 * Sebastopol, CA 95472 */
window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded() {
  canvasApp();
  /* differs from source code, adapted to function without modernizer.js,
   * image functions were also removed since text only was desired */
}
// HTML Canvas settings
function canvasSupport() {
  return !!document.createElement('canvas').getContext;
}

function canvasApp() {
  if (!canvasSupport()) {
    return;
  }
  var theCanvas = document.getElementById("canvasOne");
  var context = theCanvas.getContext("2d");
  
  // Get actual canvas dimensions
  var canvasWidth = theCanvas.width;
  var canvasHeight = theCanvas.height;
  
  function drawScreen() {
    //background
    context.globalAlpha = 1;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    
    //image
    context.globalAlpha = .25;
    if (fadeIn) {
      alpha += .01;
      if (alpha >= 1) {
        alpha = 1;
        fadeIn = false;
      }
    } else {
      alpha -= .01;
      if (alpha < 0) {
        alpha = 0;
        fadeIn = true;
      }
    }
      //text
    // Scale font size based on canvas width
    var fontSize = Math.min(canvasWidth / 15, 48); // Scale font, max 48px
    context.font = fontSize + "px 'Liberation Mono', 'Courier New', monospace";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.globalAlpha = alpha;
    context.fillStyle = "#3A3F";
    
    // Center the text based on actual canvas dimensions
    var textX = canvasWidth / 2;
    var textY = canvasHeight / 2;
    context.fillText(text, textX, textY);
  }
  var text = "Welcome to my Unretrofied Page";
  var alpha = 0;
  var fadeIn = true;
  //image
  function gameLoop() {
    window.setTimeout(gameLoop, 25);
    drawScreen();
  }
  gameLoop();

}
 // end of canvasApp encapsulation