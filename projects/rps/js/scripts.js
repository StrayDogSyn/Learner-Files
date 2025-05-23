/* Rock Paper Scissors Game => TLM Project by E. Hunter RI-JJM-6 */
'use strict';

class RockPaperScissors {
  constructor() {
    this.state = {
      score: {
        wins: 0,
        losses: 0,
        ties: 0
      },
      currentMatch: {
        playerChoice: null,
        computerChoice: null,
        isComplete: false
      },
      playerName: '',
      gameOver: false
    };

    this.choices = ['rock', 'paper', 'scissors'];
    this.outcomes = {
      rock: { beats: 'scissors', losesTo: 'paper' },
      paper: { beats: 'rock', losesTo: 'scissors' },
      scissors: { beats: 'paper', losesTo: 'rock' }
    };

    this.elements = {
      displays: {
        score: {
          wins: document.getElementById('won'),
          losses: document.getElementById('lost'),
          ties: document.getElementById('tied')
        },
        results: {
          winner: document.getElementById('starWin'),
          loser: document.getElementById('sadLose')
        },
        feedback: document.getElementById('user-selection')
      },
      sections: {
        playerOne: document.getElementById('playerOne'),
        playerTwo: document.getElementById('playerTwo'),
        scoreboard: document.getElementById('scoreboard'),
        gameOver: document.getElementById('end')
      },
      buttons: {
        rock: document.getElementById('clickRock'),
        paper: document.getElementById('clickPaper'),
        scissors: document.getElementById('clickScissor')
      },
      playerIcons: {
        rock: document.getElementById('player-rock'),
        paper: document.getElementById('player-paper'),
        scissors: document.getElementById('player-scissors')
      },
      computerIcons: {
        rock: document.getElementById('computer-rock'),
        paper: document.getElementById('computer-paper'),
        scissors: document.getElementById('computer-scissors')
      },
      welcome: document.getElementById('readyPlayerOne'),
      canvas: document.getElementById('canvasOne'),
      footer: document.getElementById('pageFooter'),
      sponsor: document.getElementById('tlm')
    };

    this.init();
  }

  init() {
    this.hideInitialElements();
    this.attachEventListeners();
  }

  hideInitialElements() {
    const { sections, playerIcons, computerIcons, displays } = this.elements;
    const elementsToHide = [
      sections.playerOne,
      sections.playerTwo,
      sections.scoreboard,
      sections.gameOver,
      displays.results.winner,
      displays.results.loser,
      ...Object.values(playerIcons),
      ...Object.values(computerIcons)
    ];

    elementsToHide.forEach(el => this.hideElement(el));
  }

  attachEventListeners() {
    // Game controls
    Object.entries(this.elements.buttons).forEach(([choice, button]) => {
      button.addEventListener('click', () => this.handlePlayerChoice(choice));
      // Add keyboard accessibility
      button.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handlePlayerChoice(choice);
        }
      });
    });

    // Game flow
    document.getElementById('start').addEventListener('click', () => this.startGame());
    document.getElementById('play-again').addEventListener('click', () => this.playAgain());
    document.getElementById('game-over').addEventListener('click', () => this.resetGame());

    // Keyboard controls
    window.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  handleKeyPress(event) {
    const keyActions = {
      'r': () => this.handlePlayerChoice('rock'),
      'p': () => this.handlePlayerChoice('paper'),
      's': () => this.handlePlayerChoice('scissors'),
      'n': () => this.playAgain(),
      'Enter': () => this.resetGame(),
      'Escape': () => this.startGame()
    };

    if (keyActions[event.key] && !this.state.currentMatch.isComplete) {
      event.preventDefault();
      keyActions[event.key]();
    }
  }

  startGame() {
    const name = prompt('Enter your name to begin:');
    if (!name) return;

    this.state.playerName = name;
    this.updateElement(this.elements.welcome, `Welcome ${name}!`);
    this.showGameElements();
  }

  showGameElements() {
    const { sections, canvas, footer, sponsor } = this.elements;
    const hideElements = [footer, canvas, sponsor];
    const showElements = [
      sections.playerOne, 
      sections.playerTwo, 
      sections.scoreboard, 
      sections.gameOver
    ];

    hideElements.forEach(el => this.hideElement(el));
    showElements.forEach(el => this.showElement(el));
  }

  handlePlayerChoice(choice) {
    if (this.state.currentMatch.isComplete || this.state.gameOver) return;

    const computerChoice = this.getComputerChoice();
    this.updateMatchState(choice, computerChoice);
    this.updateDisplay();
    this.determineWinner();
    this.checkGameOver();
  }

  getComputerChoice() {
    return this.choices[Math.floor(Math.random() * this.choices.length)];
  }

  updateMatchState(playerChoice, computerChoice) {
    this.state.currentMatch = {
      playerChoice,
      computerChoice,
      isComplete: true
    };
  }

  updateDisplay() {
    const { playerChoice, computerChoice } = this.state.currentMatch;
    
    // Hide all icons first
    Object.values(this.elements.playerIcons).forEach(icon => this.hideElement(icon));
    Object.values(this.elements.computerIcons).forEach(icon => this.hideElement(icon));
    
    // Show selected icons
    this.showElement(this.elements.playerIcons[playerChoice]);
    this.showElement(this.elements.computerIcons[computerChoice]);
  }

  determineWinner() {
    const { playerChoice, computerChoice } = this.state.currentMatch;
    
    if (playerChoice === computerChoice) {
      this.updateScore('tie');
      return;
    }

    if (this.outcomes[playerChoice].beats === computerChoice) {
      this.updateScore('win');
    } else {
      this.updateScore('loss');
    }
  }

  updateScore(result) {
    const { score } = this.state;
    const messages = {
      win: 'You win!',
      loss: 'You lose!',
      tie: "It's a tie!"
    };

    score[result === 'win' ? 'wins' : result === 'loss' ? 'losses' : 'ties']++;
    
    this.updateElement(
      this.elements.displays.score[result === 'win' ? 'wins' : result === 'loss' ? 'losses' : 'ties'],
      score[result === 'win' ? 'wins' : result === 'loss' ? 'losses' : 'ties']
    );
    
    this.updateElement(this.elements.displays.feedback, messages[result]);
  }

  checkGameOver() {
    const { wins, losses } = this.state.score;
    const WINNING_SCORE = 10;

    if (wins === WINNING_SCORE || losses === WINNING_SCORE) {
      this.state.gameOver = true;
      this.showElement(wins === WINNING_SCORE ? 
        this.elements.displays.results.winner : 
        this.elements.displays.results.loser
      );
    }
  }

  playAgain() {
    if (!this.state.gameOver) {
      this.state.currentMatch = {
        playerChoice: null,
        computerChoice: null,
        isComplete: false
      };
      this.updateDisplay();
      this.updateElement(this.elements.displays.feedback, 'Make your choice!');
    }
  }

  resetGame() {
    this.state = {
      score: {
        wins: 0,
        losses: 0,
        ties: 0
      },
      currentMatch: {
        playerChoice: null,
        computerChoice: null,
        isComplete: false
      },
      playerName: '',
      gameOver: false
    };

    Object.values(this.elements.displays.score).forEach(el => this.updateElement(el, '0'));
    this.hideElement(this.elements.displays.results.winner);
    this.hideElement(this.elements.displays.results.loser);
    this.updateElement(this.elements.displays.feedback, 'Game Reset - Make your choice!');
    this.updateDisplay();
  }

  showElement(element) {
    if (element) element.style.display = "block";
  }

  hideElement(element) {
    if (element) element.style.display = "none";
  }

  updateElement(element, content) {
    if (element) element.textContent = content;
  }
}

// Initialize the game
new RockPaperScissors();

