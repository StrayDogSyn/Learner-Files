import React, { useState, useEffect, useRef } from 'react';
import './RockPaperScissors.css';

type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'loss' | 'tie';

interface GameState {
  score: {
    wins: number;
    losses: number;
    ties: number;
  };
  currentMatch: {
    playerChoice: Choice | null;
    computerChoice: Choice | null;
    isComplete: boolean;
  };
  playerName: string;
  gameOver: boolean;
}

const RockPaperScissors: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: { wins: 0, losses: 0, ties: 0 },
    currentMatch: { playerChoice: null, computerChoice: null, isComplete: false },
    playerName: '',
    gameOver: false
  });
  
  const [feedback, setFeedback] = useState('Choose to Begin');
  const [showWinIcon, setShowWinIcon] = useState(false);
  const [showLoseIcon, setShowLoseIcon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  const outcomes = {
    rock: { beats: 'scissors', losesTo: 'paper' },
    paper: { beats: 'rock', losesTo: 'scissors' },
    scissors: { beats: 'paper', losesTo: 'rock' }
  };
  
  const WINNING_SCORE = 10;
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.currentMatch.isComplete || gameState.gameOver) return;
      
      const keyActions: { [key: string]: () => void } = {
        'r': () => handlePlayerChoice('rock'),
        'p': () => handlePlayerChoice('paper'),
        's': () => handlePlayerChoice('scissors'),
        'n': () => playAgain(),
        'Enter': () => resetGame(),
        'Escape': () => startGame()
      };
      
      if (keyActions[event.key]) {
        event.preventDefault();
        keyActions[event.key]();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);
  
  // Canvas animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Simple canvas animation
    ctx.fillStyle = '#667eea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Rock Paper Scissors', canvas.width / 2, canvas.height / 2);
  }, []);
  
  const startGame = () => {
    const name = prompt('Enter your name to begin:');
    if (!name) return;
    
    setGameState(prev => ({ ...prev, playerName: name }));
    setGameStarted(true);
    setFeedback(`Welcome ${name}!`);
  };
  
  const getComputerChoice = (): Choice => {
    return choices[Math.floor(Math.random() * choices.length)];
  };
  
  const handlePlayerChoice = (choice: Choice) => {
    if (gameState.currentMatch.isComplete || gameState.gameOver) return;
    
    const computerChoice = getComputerChoice();
    
    setGameState(prev => ({
      ...prev,
      currentMatch: {
        playerChoice: choice,
        computerChoice,
        isComplete: true
      }
    }));
    
    // Determine winner and update score
    setTimeout(() => {
      determineWinner(choice, computerChoice);
    }, 500);
  };
  
  const determineWinner = (playerChoice: Choice, computerChoice: Choice) => {
    let result: GameResult;
    let message: string;
    
    if (playerChoice === computerChoice) {
      result = 'tie';
      message = "It's a tie!";
    } else if (outcomes[playerChoice].beats === computerChoice) {
      result = 'win';
      message = 'You win!';
    } else {
      result = 'loss';
      message = 'You lose!';
    }
    
    updateScore(result);
    setFeedback(message);
    checkGameOver(result);
  };
  
  const updateScore = (result: GameResult) => {
    setGameState(prev => {
      const newScore = { ...prev.score };
      if (result === 'win') newScore.wins++;
      else if (result === 'loss') newScore.losses++;
      else newScore.ties++;
      
      return { ...prev, score: newScore };
    });
  };
  
  const checkGameOver = (result: GameResult) => {
    const newWins = result === 'win' ? gameState.score.wins + 1 : gameState.score.wins;
    const newLosses = result === 'loss' ? gameState.score.losses + 1 : gameState.score.losses;
    
    if (newWins === WINNING_SCORE) {
      setGameState(prev => ({ ...prev, gameOver: true }));
      setShowWinIcon(true);
      setFeedback('Congratulations! You won the game!');
    } else if (newLosses === WINNING_SCORE) {
      setGameState(prev => ({ ...prev, gameOver: true }));
      setShowLoseIcon(true);
      setFeedback('Game Over! Better luck next time!');
    }
  };
  
  const playAgain = () => {
    if (!gameState.gameOver) {
      setGameState(prev => ({
        ...prev,
        currentMatch: {
          playerChoice: null,
          computerChoice: null,
          isComplete: false
        }
      }));
      setFeedback('Make your choice!');
    }
  };
  
  const resetGame = () => {
    setGameState({
      score: { wins: 0, losses: 0, ties: 0 },
      currentMatch: { playerChoice: null, computerChoice: null, isComplete: false },
      playerName: '',
      gameOver: false
    });
    setFeedback('Game Reset - Make your choice!');
    setShowWinIcon(false);
    setShowLoseIcon(false);
    setGameStarted(false);
  };
  
  const getChoiceIcon = (choice: Choice) => {
    const icons = {
      rock: 'fa-hand-rock',
      paper: 'fa-hand-paper',
      scissors: 'fa-hand-scissors'
    };
    return icons[choice];
  };
  
  return (
    <div className="rps-container">
      {/* Navigation Toggle */}
      <label className="top-label" htmlFor="toggle" onClick={() => setShowNavigation(!showNavigation)}>
        ❔
      </label>
      
      {/* Hidden Navigation */}
      {showNavigation && (
        <aside className="top-hidden-nav">
          <ol className="list-unstyled text-center fs-6 fw-bold">
            <li className="mb-2">
              <p className="lead text-white fs-6">Shortcuts <i className="fa fa-keyboard fa-lg ms-2"></i></p>
            </li>
            <li className="mb-1 text-white small">New Game: 'Enter'</li>
            <li className="mb-1 text-white small">Replay: 'n'</li>
            <li className="mb-1 text-white small">Rock: 'r'</li>
            <li className="mb-1 text-white small">Paper: 'p'</li>
            <li className="mb-1 text-white small">Scissors: 's'</li>
          </ol>
        </aside>
      )}
      
      {/* Header */}
      <header className="text-center mb-3 fade-in game-header">
        <h1 className="display-5 text-white fw-bold mb-2">
          <i className="fa fa-hand-scissors me-2"></i>
          Rock, Paper, Scissors
        </h1>
        <p className="lead text-white mb-0">A classic game reimagined</p>
      </header>
      
      {/* Canvas */}
      {!gameStarted && (
        <div className="text-center mb-3">
          <canvas 
            ref={canvasRef} 
            width="480" 
            height="80" 
            className="my-1 canvas rounded-5"
          ></canvas>
        </div>
      )}
      
      <main className="game-container">
        <section className="section-modern">
          <div className="card box-shadow fade-in">
            <div className="card-body p-3">
              <div className="row g-3">
                <div className="col-lg-8">
                  {/* Welcome Message */}
                  <div className="title text-center mb-3">
                    <i className="fa fa-hand-sparkles fa-2x"></i>
                    <span className="display-6 mx-2">
                      {gameState.playerName ? `Welcome ${gameState.playerName}!` : 'Ready Player One?'}
                    </span>
                    <i className="fa fa-hand-spock fa-2x"></i>
                  </div>
                  
                  {/* Start Button */}
                  {!gameStarted && (
                    <div className="text-center mb-3">
                      <button 
                        className="btn btn-outline-success btn-lg rounded-5 initialism"
                        onClick={startGame}
                        title="Test Your Might!"
                      >
                        <i className="fa fa-play-circle fa-1x me-2"></i>Click to Begin
                      </button>
                    </div>
                  )}
                  
                  {/* Result Icons */}
                  <section className="text-center mb-3">
                    <div className="position-relative">
                      {showWinIcon && (
                        <img className="result-icon result-win show" src="/assets/icon-star.svg" alt="A Gold Star" />
                      )}
                      {showLoseIcon && (
                        <i className="fa fa-sad-cry fa-6x result-icon result-lose show text-danger"></i>
                      )}
                    </div>
                  </section>
                  
                  {/* Player Section */}
                  {gameStarted && (
                    <div>
                      <figure className="figure">
                        <div className="d-flex justify-content-center game-choice-buttons mb-3">
                          <button 
                            className="btn btn-outline-success btn-lg d-flex flex-column align-items-center p-2"
                            onClick={() => handlePlayerChoice('rock')}
                            title="Choose Rock!"
                            disabled={gameState.currentMatch.isComplete}
                          >
                            <i className="fa fa-3x fa-hand-rock mb-1"></i>
                            <span className="fw-bold small">Rock</span>
                          </button>
                          <button 
                            className="btn btn-outline-success btn-lg d-flex flex-column align-items-center p-2"
                            onClick={() => handlePlayerChoice('paper')}
                            title="Choose Paper!"
                            disabled={gameState.currentMatch.isComplete}
                          >
                            <i className="fa fa-3x fa-hand-paper mb-1"></i>
                            <span className="fw-bold small">Paper</span>
                          </button>
                          <button 
                            className="btn btn-outline-success btn-lg d-flex flex-column align-items-center p-2"
                            onClick={() => handlePlayerChoice('scissors')}
                            title="Choose Scissors!"
                            disabled={gameState.currentMatch.isComplete}
                          >
                            <i className="fa fa-3x fa-hand-scissors mb-1"></i>
                            <span className="fw-bold small">Scissors</span>
                          </button>
                        </div>
                        <figcaption>
                          <h2 className="text-center mb-2 h5">{feedback}</h2>
                        </figcaption>
                        
                        {/* Player Choice Display */}
                        <div className="d-flex justify-content-center gap-2 mb-3">
                          {gameState.currentMatch.playerChoice && (
                            <div className="choice-display">
                              <i className={`fa fa-3x ${getChoiceIcon(gameState.currentMatch.playerChoice)} text-primary`}></i>
                              <p className="small mt-1">Your Choice</p>
                            </div>
                          )}
                        </div>
                      </figure>
                    </div>
                  )}
                  
                  {/* Computer Section */}
                  {gameStarted && (
                    <div>
                      <figure className="figure">
                        <div className="text-center mb-2">
                          <i className="fab fa-mandalorian fa-4x text-danger" title="There will be nothing to stop us this time..."></i>
                        </div>
                        <figcaption>
                          <h2 className="text-center mb-2 h5">E-Wreck chooses...</h2>
                        </figcaption>
                        
                        {/* Computer Choice Display */}
                        <div className="d-flex justify-content-center gap-2 mb-3">
                          {gameState.currentMatch.computerChoice && (
                            <div className="choice-display">
                              <i className={`fa fa-3x ${getChoiceIcon(gameState.currentMatch.computerChoice)} text-danger`}></i>
                              <p className="small mt-1">E-Wreck's Choice</p>
                            </div>
                          )}
                        </div>
                      </figure>
                    </div>
                  )}
                </div>
                
                {/* Scoreboard */}
                {gameStarted && (
                  <div className="col-lg-4">
                    <aside className="card scorecard box-shadow background p-2">
                      <div className="btn-group container-fluid my-auto mb-3">
                        <button 
                          className="btn btn-outline-success rounded-5 btn-md mx-auto"
                          onClick={playAgain}
                          disabled={gameState.gameOver}
                        >
                          <i className="fa fa-grin-tongue-wink fa-lg me-2"></i>Replay?
                        </button>
                      </div>
                      <div className="card-body text-center p-2">
                        <small className="initialism fw-bold text-white">Won</small>
                        <p className="fs-4 fw-bold mb-2 won">{gameState.score.wins}</p>
                        <small className="initialism fw-bold text-white">Tied</small>
                        <p className="fs-4 fw-bold mb-2 tied">{gameState.score.ties}</p>
                        <small className="initialism fw-bold text-white">Lost</small>
                        <p className="fs-4 fw-bold mb-2 lose">{gameState.score.losses}</p>
                      </div>
                      <div className="text-center mt-2">
                        <button 
                          className="btn btn-outline-danger rounded-5 initialism btn-sm"
                          onClick={resetGame}
                        >
                          <i className="fa fa-angry me-2"></i>Surrender?
                        </button>
                      </div>
                    </aside>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="section-modern mt-3">
          <div className="card box-shadow fade-in">
            <div className="card-body p-3">
              <h3 className="mb-3 h5">About This Project</h3>
              <p className="small mb-3">Built with interactive JavaScript, Canvas effects, and responsive design.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RockPaperScissors;