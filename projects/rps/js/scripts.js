/* Rock Paper Scissors Game => TLM Project by E. Hunter RI-JJM-6 */
'use strict';
/* DOM Elements */

const $start = document.getElementById("start");
const $end = document.getElementById("end");
const $replay = document.getElementById("play-again");
const $name = document.getElementById("readyPlayerOne");
const $player = document.getElementById("playerOne");
const $opponent = document.getElementById("playerTwo");
const $canvas = document.getElementById("canvasOne");
const $feedback = document.getElementById("user-selection");
const $scoreboard = document.getElementById("scoreboard");
const $wonGame = document.getElementById("won");
const $tieGame = document.getElementById("tied");
const $loseGame = document.getElementById("lost");
const $footer = document.getElementById("pageFooter");
const $sponsor = document.getElementById("tlm");

// hidden images  DOM references //

const $clickRock = document.getElementById("clickRock");
const $clickPaper = document.getElementById("clickPaper");
const $clickScissor = document.getElementById("clickScissor");
const $playerRock = document.getElementById("player-rock");
const $playerPaper = document.getElementById("player-paper");
const $playerScissor = document.getElementById("player-scissors");
const $opponentRock = document.getElementById("computer-rock");
const $opponentPaper = document.getElementById("computer-paper");
const $opponentScissor = document.getElementById("computer-scissors");
const $winner = document.getElementById("starWin");
const $loser = document.getElementById("sadLose");

/* Default Settings */

let selectionMade = false;
// increased length of array to improve random selection curve
const picked = [
  'rock', 'paper', 'scissors',
  'rock', 'scissors', 'paper',
  'scissors', 'rock', 'paper',
  'scissors', 'paper', 'rock'];
let win = 0;
let tied = 0;
let lost = 0;

// hide various elements on page until game initializes

hide($player), hide($opponent), hide($scoreboard), hide($end), hide($winner), hide($loser);
hide($playerRock), hide($playerPaper), hide($playerScissor);
hide($opponentRock), hide($opponentPaper), hide($opponentScissor);

/* Event Listeners */

// initializes new game
document.getElementById('start').onclick = function () {
  let playerName = prompt("Enter your name to begin");
  update($name, "Welcome " + playerName + "!");
  newGame();
};
// initializes new round
document.getElementById('play-again').onclick = function () {
  replayGame();
};
// resets the application
document.getElementById('game-over').onclick = function () {
  window.location.reload();
};

// player choice initializes rounds, code adapted from starter file
document.getElementById('clickRock').onclick = function () {
  if (!selectionMade) playerPick('rock'), show($playerRock);
};
document.getElementById('clickPaper').onclick = function () {
  if (!selectionMade) playerPick('paper'), computerPick(), show($playerPaper);
};
document.getElementById('clickScissor').onclick = function () {
  if (!selectionMade) playerPick('scissors'), show($playerScissor);
};

// key press Event Listeners
window.addEventListener('keydown', function (event){
  if (event.defaultPrevented) {
    return;
    // does nothing if the event was already processed
  }
  switch (event.key) {
    case 'r':
      if (!selectionMade) playerPick('rock'), show($playerRock);
      break;
    case 'p':
      if (!selectionMade) playerPick('paper'), computerPick(), show($playerPaper);
      break;
    case 's':
      if (!selectionMade) playerPick('scissors'), show($playerScissor);
      break;
    case 'n':
      replayGame();
      break;
    case 'Enter':
      window.location.reload();
      break;
    case 'Escape':
      let playerName = prompt("Enter your name to begin");
      update($name, "Welcome " + playerName + "!");
      newGame();
      break;
    default:
      return;
      // quit whenever this fails to handle event
  }
  // cancels the default action to avoid it being handled twice
  event.preventDefault();
},true);// end of adapted code

/* Function declarations */

// hides and shows specific DOM Elements throughout the game

function hide(element) {
  element.style.display = "none";
}
function show(element) {
  element.style.display = "block";
}

// updates DOM Elements

function update(element, content) {
  let p = element.firstChild;
  p.textContent = content;
  element.appendChild(p);
  }

// begins the game by hiding splash screen

function newGame() {
  hide($start), hide($footer), hide($canvas), hide($sponsor);
  show($player), show($opponent), show($scoreboard), show($end);
}

function playGame(value) {
  selectionMade = true;
  const random = computerPick();
  showComputerIcon(random);
  declareWinner(value, random);
  // determines the winner
  function declareWinner(value, random) {
    if(value === 'rock') {
      if (random === 'scissors'){
      updateScore('win');
      } else if(random === 'paper') {
        updateScore('lose');
      } else {
        updateScore('tie');
      }
    }
    if(value === 'paper') {
      if (random === 'rock'){
      updateScore('win');
      } else if(random === 'scissors') {
        updateScore('lose');
      } else {
        updateScore('tie');
      }
    }
    if(value === 'scissors') {
      if (random === 'paper'){
      updateScore('win');
      } else if(random === 'rock') {
        updateScore('lose');
      } else {
        updateScore('tie');
      }
    }
  }
}

// updates the scoreboard

function updateScore(score) {
  if(score === 'win') {
    win++;
    update($wonGame, win);
  } else if(score === 'lose') {
    lost++;
    update($loseGame, lost);
  } else {
    tied++;
    update($tieGame, tied);
  }
  updateMessage(score);
    if((win >= 10) || (lost >=10)) {
    gameWon();
    }
}
// displays outcome

function updateMessage(result){
  update($feedback, "You " + result + "!");
}

// enables the 'first to 10 wins' parameter

function gameWon(){
  show($winner);
}
function gameLost(){
  show($loser);
}

// resets the game screen

function replayGame(value, random) {
  const player = playerPick();
  const opponent = computerPick();
  selectionMade = false;
  show($clickScissor), show($clickRock), show($clickPaper);
  update($feedback, "Choose Again?!");
  // clears the icons from last pick
  clearPlayerIcons(value);
  clearOpponentIcons(opponent);
}

// randomly selects from picked[0, 11]
function computerPick() {
  let random = picked[Math.floor(Math.random() * 12)];
  return random;
}

function playerPick(value) {
  hide($clickScissor), hide($clickRock), hide($clickPaper);
  playGame(value);
  computerPick();
}

// reveals opponents choice to player

function showComputerIcon(result) {
  if (result === 'rock') {
    show($opponentRock);
  } else if (result === 'paper') {
    show($opponentPaper);
  } else
    show($opponentScissor);
}

// resets the icons for next pick

function clearPlayerIcons(player) {
  hide($playerRock);
  hide ($playerPaper);
  hide($playerScissor);
  show($clickRock);
  show($clickPaper);
  show($clickScissor);
}

function clearOpponentIcons(opponent) {
  hide($opponentRock);
  hide ($opponentPaper);
  hide($opponentScissor);
}

// ends the current game

function gameOver() {
  show($start), show($footer), show($canvas);
  hide($player), hide($opponent), hide($scoreboard), hide($end);
}

