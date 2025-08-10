import React, { useState, useEffect, useRef } from 'react';
import './CompTIA.css';

interface QuizQuestion {
  question: string;
  choices: string[];
  correctAnswer: number;
  explanation: string;
}

const CompTIA: React.FC = () => {
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showUserInput, setShowUserInput] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showUserQuestion, setShowUserQuestion] = useState(false);
  const [hintText, setHintText] = useState('');
  
  // User question form state
  const [questionText, setQuestionText] = useState('');
  const [firstResponse, setFirstResponse] = useState('');
  const [secondResponse, setSecondResponse] = useState('');
  const [thirdResponse, setThirdResponse] = useState('');
  const [fourthResponse, setFourthResponse] = useState('');
  const [correctChoice, setCorrectChoice] = useState('first');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Quiz questions
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      question: 'Which of the following hardware components is most likely to fail first in a computer system?',
      choices: ['CPU', 'Hard Drive', 'RAM', 'Motherboard'],
      correctAnswer: 1,
      explanation: 'Hard drives with moving parts are typically the first components to fail in a system due to mechanical wear.'
    },
    {
      question: 'Which protocol is used to securely connect to a remote server for file transfers?',
      choices: ['FTP', 'SFTP', 'HTTP', 'SMTP'],
      correctAnswer: 1,
      explanation: 'SFTP (Secure File Transfer Protocol) provides encrypted file transfer capabilities.'
    },
    {
      question: 'What does SOHO stand for in networking terminology?',
      choices: ['Small Office/Home Office', 'Secure Online Home Operations', 'System Organized Hardware Operations', 'Standard Office Hardware Organization'],
      correctAnswer: 0,
      explanation: 'SOHO stands for Small Office/Home Office, referring to the small network environments in homes or small businesses.'
    },
    {
      question: 'Which of the following is an example of two-factor authentication?',
      choices: ['Username and password', 'Password and security question', 'Password and fingerprint scan', 'Two different passwords'],
      correctAnswer: 2,
      explanation: 'Two-factor authentication requires two different types of verification: something you know (password) and something you have/are (fingerprint scan).'
    },
    {
      question: 'What is the default subnet mask for a Class C IP address?',
      choices: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
      correctAnswer: 2,
      explanation: 'The default subnet mask for a Class C network is 255.255.255.0 (/24).'
    }
  ]);
  
  // Timer effect
  useEffect(() => {
    if (quizStarted && !quizEnded) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev >= 59) {
            setMinutes(m => m + 1);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizStarted, quizEnded]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!quizStarted) return;
      
      switch (event.key) {
        case '1':
          if (!answerSubmitted) setSelectedAnswer(0);
          break;
        case '2':
          if (!answerSubmitted) setSelectedAnswer(1);
          break;
        case '3':
          if (!answerSubmitted) setSelectedAnswer(2);
          break;
        case '4':
          if (!answerSubmitted) setSelectedAnswer(3);
          break;
        case 'Escape':
          resetQuiz();
          break;
        case 'q':
        case 'Q':
          setShowUserQuestion(true);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [quizStarted, answerSubmitted]);
  
  const startQuiz = () => {
    const name = userName.trim() || 'Candidate';
    setUserName(name);
    setQuizStarted(true);
    setShowUserInput(false);
    setSeconds(0);
    setMinutes(0);
  };
  
  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    
    const question = quizQuestions[currentQuestion];
    setAnswerSubmitted(true);
    
    if (selectedAnswer === question.correctAnswer) {
      setShowCorrect(true);
      setShowWrong(false);
      setScore(prev => prev + 1);
      setFeedback(`✓ ${question.explanation}`);
    } else {
      setShowWrong(true);
      setShowCorrect(false);
      setFeedback(`✗ ${question.explanation}`);
    }
  };
  
  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
      setShowCorrect(false);
      setShowWrong(false);
      setFeedback('');
    } else {
      endQuiz();
    }
  };
  
  const endQuiz = () => {
    setQuizEnded(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSeconds(0);
    setMinutes(0);
    setQuizStarted(false);
    setQuizEnded(false);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setShowCorrect(false);
    setShowWrong(false);
    setFeedback('');
    setUserName('');
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  const showHintModal = () => {
    const correctAnswerText = quizQuestions[currentQuestion].choices[quizQuestions[currentQuestion].correctAnswer];
    setHintText(correctAnswerText);
    setShowHint(true);
    // Subtract point for using hint
    setScore(prev => Math.max(0, prev - 1));
  };
  
  const addUserQuestion = () => {
    if (questionText && firstResponse && secondResponse && thirdResponse && fourthResponse) {
      let correctIndex;
      switch (correctChoice) {
        case 'first': correctIndex = 0; break;
        case 'second': correctIndex = 1; break;
        case 'third': correctIndex = 2; break;
        case 'fourth': correctIndex = 3; break;
        default: correctIndex = 0;
      }
      
      const newQuestion: QuizQuestion = {
        question: questionText,
        choices: [firstResponse, secondResponse, thirdResponse, fourthResponse],
        correctAnswer: correctIndex,
        explanation: `The correct answer is: ${[firstResponse, secondResponse, thirdResponse, fourthResponse][correctIndex]}`
      };
      
      setQuizQuestions(prev => [...prev, newQuestion]);
      
      // Clear form
      setQuestionText('');
      setFirstResponse('');
      setSecondResponse('');
      setThirdResponse('');
      setFourthResponse('');
      setShowUserQuestion(false);
      
      alert('Your question has been added to the quiz!');
    } else {
      alert('Please fill in all fields to submit a question.');
    }
  };
  
  const percentage = Math.round((score / quizQuestions.length) * 100);
  const progress = (currentQuestion / quizQuestions.length) * 100;
  
  return (
    <div className="comptia-container">
      {/* User Input Modal */}
      {showUserInput && (
        <div className="modal-overlay">
          <div className="modal-content Tred text-center text-dark rounded-5">
            <div className="modal-header">
              <h5 className="modal-title text-white">
                <i className="fa fa-tools fa-lg text-white"></i> Welcome Future PC Technician!
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowUserInput(false)}
              ></button>
            </div>
            <div className="modal-body">
              <label htmlFor="user-name" className="text-white text-shadow">
                Enter your name to begin <i className="fa fa-caret-right fa-lg"></i>
              </label>
              <input 
                type="text" 
                className="text-white" 
                id="user-name" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                maxLength={75}
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-warning" 
                onClick={() => setShowUserInput(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={startQuiz}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hint Modal */}
      {showHint && (
        <div className="modal-overlay">
          <div className="modal-content Tred text-center text-dark rounded-5">
            <div className="modal-header">
              <h5 className="modal-title text-white">
                <i className="fa fa-lightbulb fa-lg text-white"></i> Hint
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowHint(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p className="text-white text-shadow">{hintText}</p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-warning" 
                onClick={() => setShowHint(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* User Question Modal */}
      {showUserQuestion && (
        <div className="modal-overlay">
          <div className="modal-content Tred text-center text-dark rounded-5">
            <div className="modal-header">
              <h5 className="modal-title text-white">
                <i className="fa fa-tools fa-lg text-white"></i> Submit Your Question
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowUserQuestion(false)}
              ></button>
            </div>
            <div className="modal-body mx-auto">
              <textarea 
                className="text-dark box-shadow myBorder mb-3 px-auto bg-light" 
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                maxLength={500}
                rows={10}
                cols={50}
                placeholder="Enter your Question"
                autoFocus
              />
              <input 
                type="text" 
                className="text-dark bg-light mb-2 mx-auto" 
                value={firstResponse}
                onChange={(e) => setFirstResponse(e.target.value)}
                maxLength={75}
                placeholder="First Response"
              />
              <label className="text-white text-shadow">First Response to Question</label>
              <input 
                type="text" 
                className="text-dark bg-light mb-2 mx-auto" 
                value={secondResponse}
                onChange={(e) => setSecondResponse(e.target.value)}
                maxLength={75}
                placeholder="Second Response"
              />
              <label className="text-white text-shadow">Second Response to Question</label>
              <input 
                type="text" 
                className="text-dark bg-light mb-2 mx-auto" 
                value={thirdResponse}
                onChange={(e) => setThirdResponse(e.target.value)}
                maxLength={75}
                placeholder="Third Response"
              />
              <label className="text-white text-shadow">Third Response to Question</label>
              <input 
                type="text" 
                className="text-dark bg-light mb-2 mx-auto" 
                value={fourthResponse}
                onChange={(e) => setFourthResponse(e.target.value)}
                maxLength={75}
                placeholder="Fourth Response"
              />
              <label className="text-white text-shadow">Fourth Response to Question</label>
              <label className="text-white text-shadow">
                <i className="fa fa-sort-numeric-down-alt"></i> Confirm Correct Response <i className="fa fa-caret-right"></i>
              </label>
              <select 
                value={correctChoice}
                onChange={(e) => setCorrectChoice(e.target.value)}
                className="text-white mx-auto px-2"
              >
                <option value="first" className="text-dark">First Response</option>
                <option value="second" className="text-dark">Second Response</option>
                <option value="third" className="text-dark">Third Response</option>
                <option value="fourth" className="text-dark">Fourth Response</option>
              </select>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-warning" 
                onClick={() => setShowUserQuestion(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={addUserQuestion}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="container-fluid myBorder Tred mb-3 box-shadow">
        <header className="container-fluid text-center">
          <h1 className="text-white display-4 my-4 fw-bold Times text-shadow">
            CompTIA™ Certification Exams
          </h1>
        </header>
      </div>
      
      <div className="container-fluid Tgold text-center mb-5 box-shadow">
        <h1 className="text-white Times initialism fs-1 fw-bold myBorder box-shadow text-shadow">Exam Guide</h1>
        <h2 className="bg-dark text-white Times fs-3 initialism box-shadow">
          Revised for exams 220-801, 220-802 &amp; SYO-601
        </h2>
        
        <div className="card Tred box-shadow">
          <div className="card-header">
            <h2 className="myBorder score Tgold fw-bold box-shadow">
              Total Score: <span id="score" className="fw-bold">{score}</span>
            </h2>
          </div>
          
          <section className="container-fluid Tred mb-5 box-shadow">
            <div className="Twhite fs-4 fw-bold mb-5">
              {!quizStarted ? (
                <>
                  <section className="box-shadow">
                    What is this test anyway?
                  </section>
                  <div className="container-fluid card-body">
                    <p className="lead fw-bold">
                      Includes coverage of all objectives for CompTIA™ Eight Edition A+ exams 220-801 &amp; 220-802* <br />
                      as well as the CompTIA™ Sixth Edition Security+ exam SYO-601.<br />
                      <em className="fs-6">* In full modules version only, demo version contains partial quizes for Security+ &amp; A+ Exams</em><br />
                      Ideal as both a study tool &amp; skills assessment for the comprehensive CompTIA™ accredited certifications. 
                      A successful completion goal of 70% or better on this practice quiz is recommended before attempting the actual CompTIA™ Certification exams.
                    </p>
                  </div>
                </>
              ) : quizEnded ? (
                <>
                  <section className="box-shadow">
                    Quiz Complete!
                  </section>
                  <div className="container-fluid card-body">
                    {percentage >= 70 ? (
                      <div className="alert alert-success">
                        <h3>Congratulations, {userName}!</h3>
                        <p className="lead">You passed with a score of {percentage}%!</p>
                        <p>You answered {score} out of {quizQuestions.length} questions correctly.</p>
                        <p>Time taken: {minutes}:{seconds < 10 ? '0' + seconds : seconds}</p>
                      </div>
                    ) : (
                      <div className="alert alert-warning">
                        <h3>Thank you, {userName}!</h3>
                        <p className="lead">Your score is {percentage}%.</p>
                        <p>You answered {score} out of {quizQuestions.length} questions correctly.</p>
                        <p>For CompTIA certification exams, a 70% or better is recommended.</p>
                        <p>Time taken: {minutes}:{seconds < 10 ? '0' + seconds : seconds}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <section className="box-shadow">
                    {quizQuestions[currentQuestion].question}
                  </section>
                  <div className="question-counter">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar comptia-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </>
              )}
              
              {quizStarted && !quizEnded && (
                <form className="card Twhite">
                  {quizQuestions[currentQuestion].choices.map((choice, index) => (
                    <div key={index} className="mb-3 fs-4">
                      <input 
                        name="answers-group" 
                        type="radio" 
                        value={index} 
                        id={`choice${index + 1}`}
                        className="text-center fw-bold initialism"
                        checked={selectedAnswer === index}
                        onChange={() => setSelectedAnswer(index)}
                        disabled={answerSubmitted}
                      />
                      <label htmlFor={`choice${index + 1}`} className={`answer-label ${selectedAnswer === index ? 'selected' : ''}`}>
                        <i className="fa fa-check-circle me-2"></i> {choice}
                      </label>
                    </div>
                  ))}
                </form>
              )}
              
              {feedback && (
                <section className="card text-center fs-3 fw-bold bg-dark text-white box-shadow feedback">
                  {feedback}
                </section>
              )}
              
              {showCorrect && (
                <section className="card text-center fs-4 fw-bold bg-success text-white box-shadow">
                  Correct!
                </section>
              )}
              
              {showWrong && (
                <section className="card text-center fs-4 fw-bold bg-danger box-shadow">
                  Incorrect!!
                </section>
              )}
            </div>
            
            <div className="card-footer myBorder mx-auto mb-3 box-shadow justify-content-between">
              {!quizStarted ? (
                <>
                  <button 
                    type="button" 
                    className="btn btn-outline-dark text-white rounded-3 box-shadow text-shadow px-5 mx-auto my-2"
                    onClick={() => setShowUserQuestion(true)}
                    title="Submit your own questions!"
                  >
                    <i className="fa fa-arrow-alt-circle-left fa-lg"></i> Submit a Question
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-dark text-white rounded-3 box-shadow text-shadow px-5 mx-auto my-2"
                    onClick={() => setShowUserInput(true)}
                    title="Ready? Let's test your mettle..."
                  >
                    Begin Exam <i className="fa fa-arrow-alt-circle-right fa-lg"></i>
                  </button>
                </>
              ) : quizEnded ? (
                <button 
                  type="button" 
                  className="btn btn-warning rounded-2 border-dark box-shadow"
                  onClick={resetQuiz}
                >
                  <i className="fa fa-undo-alt me-2"></i>
                  <span className="me-1">Reset Quiz <i className="fa fa-question-circle"></i></span>
                </button>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="btn btn-outline-dark text-white rounded-3 box-shadow text-shadow px-5 mx-auto my-2"
                    onClick={() => setShowUserQuestion(true)}
                    title="Submit your own questions!"
                  >
                    <i className="fa fa-arrow-alt-circle-left fa-lg"></i> Submit a Question
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-dark text-white rounded-3 box-shadow text-shadow px-5 mx-auto my-2"
                    onClick={showHintModal}
                    title="Need a little help?"
                  >
                    Need a hint <i className="fa fa-question-circle"></i>
                  </button>
                  {selectedAnswer !== null && !answerSubmitted && (
                    <button 
                      type="button" 
                      className="btn btn-success rounded-2 border-dark box-shadow"
                      onClick={checkAnswer}
                    >
                      <i className="fa fa-check me-2"></i>
                      <span className="me-1">Submit Answer</span>
                    </button>
                  )}
                  {answerSubmitted && (
                    <button 
                      type="button" 
                      className="btn btn-warning rounded-2 border-dark box-shadow"
                      onClick={nextQuestion}
                    >
                      <i className="fa fa-sync-alt me-2"></i>
                      <span className="me-1">Next Question <i className="fa fa-question-circle"></i></span>
                    </button>
                  )}
                  <button 
                    type="button" 
                    className="btn btn-warning rounded-2 border-dark box-shadow"
                    onClick={resetQuiz}
                  >
                    <i className="fa fa-undo-alt me-2"></i>
                    <span className="me-1">Reset Quiz <i className="fa fa-question-circle"></i></span>
                  </button>
                </>
              )}
            </div>
            
            <div className="myBorder Tgold fw-bold box-shadow">
              <h2>
                <i className="fa fa-user-graduate fs-lg"></i> {userName || 'Candidate'}
              </h2>
            </div>
            
            <div className="card-footer container">
              <h2 className="myBorder score Tgold fw-bold box-shadow">
                <i className="fa fa-hourglass fa-1x"></i>
                <span title="Time Elapsed">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
              </h2>
            </div>
          </section>
        </div>
        
        <h4 className="white-text-shadow">
          <a href="https://www.straydog-syndications-llc.com" target="_blank" rel="noopener noreferrer" title="Visit StrayDog Syndications LLC">
            <img className="logo img-sm img-fluid img-thumbnail box-shadow" src="./assets/images/stray-gear.png" alt="StrayDog Syndications Logo" />
          </a>
          &copy; <a href="https://www.straydog-syndications-llc.com" target="_blank" rel="noopener noreferrer" title="Visit StrayDog Syndications LLC" className="text-white text-decoration-none">StrayDog Syndications LLC</a> 2024. All Rights Reserved.
          <img className="logo img-sm img-fluid img-thumbnail box-shadow bg-dark" src="./assets/images/tlm-logo.png" alt="The Last Mile Logo" />
          <br />Proud Participant of The Last Mile™ Program
        </h4>
      </div>
    </div>
  );
};

export default CompTIA;