import React, { useState, useEffect, useRef } from 'react';
import '../css/modern.css';
import './QuizNinja.css';

interface QuizQuestion {
  question: string;
  answer: string;
}

const QuizNinja: React.FC = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(240);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [isGameActive, setIsGameActive] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [showCorrect, setShowCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [showNavigation, setShowNavigation] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Quiz questions data
  const quizData: QuizQuestion[] = [
    { question: "What was Wolverine's original code name?", answer: "Weapon X" },
    { question: "What group does 'Starlord' lead?", answer: "Guardians of the Galaxy" },
    { question: "Who was the older brother of Cyclops?", answer: "Havoc" },
    { question: "What is Black Widow's real name?", answer: "Natasha Romanov" },
    { question: "Which Asgardian guards the Bifrost?", answer: "Heimdal" },
    { question: "What team is Ms. Marvel part of?", answer: "New Avengers" },
    { question: "Who is Tony Stark's AI assistant?", answer: "JARVIS" },
    { question: "What is Thor's hammer called?", answer: "Mjolnir" },
    { question: "What is Spider-Man's real name?", answer: "Peter Parker" },
    { question: "Who is known as the Mad Titan?", answer: "Thanos" }
  ];
  
  // Load high score on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('hiScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);
  
  // Timer effect
  useEffect(() => {
    if (isGameActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining <= 0 && isGameActive) {
      gameOver();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, isGameActive]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameActive) return;
      
      if (e.key === 'Enter' && selectedAnswer) {
        e.preventDefault();
        checkAnswer(selectedAnswer);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isGameActive, selectedAnswer]);
  
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const startGame = () => {
    setScore(0);
    setTimeRemaining(240);
    setQuestions(shuffleArray([...quizData]));
    setAnsweredQuestions(new Set());
    setIsGameActive(true);
    setFeedback('');
    setShowCorrect(false);
    setSelectedAnswer('');
    chooseQuestion();
  };
  
  const chooseQuestion = () => {
    if (questions.length === 0 || answeredQuestions.size === quizData.length) {
      gameOver();
      return;
    }
    
    let questionIndex;
    do {
      questionIndex = Math.floor(Math.random() * questions.length);
    } while (answeredQuestions.has(questionIndex));
    
    const question = questions[questionIndex];
    setCurrentQuestion(question);
    setAnsweredQuestions(prev => new Set([...prev, questionIndex]));
    
    // Generate options
    const allAnswers = quizData.map(q => q.answer);
    const optionsSet = new Set([question.answer]);
    
    while (optionsSet.size < 4) {
      const randomAnswer = allAnswers[Math.floor(Math.random() * allAnswers.length)];
      if (randomAnswer !== question.answer) {
        optionsSet.add(randomAnswer);
      }
    }
    
    setOptions(shuffleArray([...optionsSet]));
    setSelectedAnswer('');
    setFeedback('');
    setShowCorrect(false);
  };
  
  const checkAnswer = (answer: string) => {
    if (!currentQuestion) return;
    
    const isCorrect = answer === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback('❌ Wrong!');
      setCorrectAnswer(currentQuestion.answer);
      setShowCorrect(true);
    }
    
    // Show next question after delay
    setTimeout(() => {
      setFeedback('');
      setShowCorrect(false);
      chooseQuestion();
    }, 2000);
  };
  
  const gameOver = () => {
    setIsGameActive(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Update high score
    if (score > highScore) {
      const newHighScore = score;
      setHighScore(newHighScore);
      localStorage.setItem('hiScore', newHighScore.toString());
    }
    
    setFeedback(`Game Over! You scored ${score} out of ${quizData.length}`);
  };
  
  const handleOptionClick = (option: string) => {
    setSelectedAnswer(option);
    checkAnswer(option);
  };
  
  return (
    <div className="quiz-ninja-container">
      {/* Navigation Toggle */}
      <label className="top-label" htmlFor="toggle" onClick={() => setShowNavigation(!showNavigation)}>
        ❔
      </label>
      
      {/* Hidden Navigation */}
      {showNavigation && (
        <aside className="hidden-nav">
          <a href="#"><i className="fa fa-map fa-lg"></i> Game Map</a>
          <a href="#"><i className="fa fa-tools fa-lg"></i> Settings</a>
        </aside>
      )}
      
      <div className="game-container">
        <header>
          <figure className="figure-img">
            <i className="fa fa-times-circle fa-4x game-icon"></i>
            <figcaption className="initialism text-center">
              Welcome to Xavier's School For Gifted Children
            </figcaption>
          </figure>
          
          <div className="stats-container">
            <div className="stat-item">
              <span>High Score: {highScore}</span>
            </div>
            <div className="stat-item">
              <span>Score: </span>
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <i title="Beat the Clock!" className="fa fa-clock fa-lg"></i>
              <span>{timeRemaining}</span>
            </div>
          </div>
        </header>
        
        {currentQuestion && isGameActive && (
          <>
            <section className="question-section text-center">
              {currentQuestion.question}
            </section>
            
            <form className="answer-form">
              <div className="answers">
                {options.map((option, index) => (
                  <label 
                    key={index} 
                    className="option-button"
                    onClick={() => handleOptionClick(option)}
                  >
                    <input 
                      type="radio" 
                      name="answer" 
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={() => setSelectedAnswer(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </form>
          </>
        )}
        
        {feedback && (
          <section className="feedback-section text-center">
            {feedback}
          </section>
        )}
        
        {showCorrect && (
          <section className="correct-section text-center">
            The correct answer was: {correctAnswer}
          </section>
        )}
        
        {!isGameActive && (
          <button 
            className="start-button"
            onClick={startGame}
            title="Click to Play!"
          >
            <i className="fa fa-expand-arrows-alt"></i> Start Game
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizNinja;