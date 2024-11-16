// Rock Paper Scissors Game => TLM Project by E. Hunter RI-JJM-6

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
function canvasSupport () {
 return !!document.createElement('canvas').getContext;
}

function canvasApp () {
 if (!canvasSupport()) {
 return;
 }
 var theCanvas = document.getElementById("canvasOne");
 var context = theCanvas.getContext("2d");
 function drawScreen() {
 //background
 context.globalAlpha = 1;
 context.fillStyle = "#000000";
 context.fillRect(0, 0, 680, 480);
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
 context.font = "32px 'Liberation Mono', 'Courier New', monospace";
 context.textBaseline = "top";
 context.globalAlpha = alpha;
 context.fillStyle = "#3A3F";
 context.fillText (text, 35, 65);
 }
 var text = "Would you like to play a game..?";
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