// code adapted from; -- JavaScript: Novice to Ninja 2014 -- see bottom of page for works cited section //
class QuizNinja {
  constructor() {
    this.state = {
      score: 0,
      currentQuestion: null,
      timeRemaining: 240,
      interval: null,
      questions: [],
      answeredQuestions: new Set(),
      isGameActive: false
    };

    this.elements = {
      question: document.getElementById("question"),
      score: document.getElementById("score"),
      feedback: document.getElementById("feedback"),
      start: document.getElementById("start"),
      form: document.getElementById("answer"),
      timer: document.getElementById("timer"),
      correct: document.getElementById("correct"),
      hiScore: document.getElementById("hiScore")
    };

    this.highScore = this.loadHighScore();
    this.init();
  }
  init() {
    this.elements.form.style.display = 'none';
    this.elements.feedback.style.display = 'none';
    this.elements.correct.style.display = 'none';
    this.updateScore();
    this.attachEventListeners();
    this.updateElement(this.elements.hiScore, `High Score: ${this.highScore}`);
  }

  attachEventListeners() {
    this.elements.start.addEventListener('click', () => this.startGame());
    this.elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const answer = new FormData(event.target).get('answer');
      this.checkAnswer(answer);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (!this.state.isGameActive) return;

      if (e.key === 'Enter' && document.activeElement.type === 'radio') {
        e.preventDefault();
        this.checkAnswer(document.activeElement.value);
      }
    });
  }
  startGame() {
    this.state = {
      ...this.state,
      score: 0,
      timeRemaining: 240,
      questions: this.shuffleArray([...quiz.questions]),
      answeredQuestions: new Set(),
      isGameActive: true
    };

    this.updateScore();
    this.startTimer();
    this.elements.start.style.display = 'none';
    this.elements.form.style.display = 'block';
    this.chooseQuestion();
  }

  startTimer() {
    this.updateTimer();
    this.state.interval = setInterval(() => this.updateTimer(), 1000);
  }

  updateTimer() {
    this.state.timeRemaining--;
    this.updateElement(this.elements.timer, this.state.timeRemaining);
    
    if (this.state.timeRemaining <= 0) {
      this.gameOver();
    }
  }

  chooseQuestion() {
    if (this.state.questions.length === 0 || 
        this.state.answeredQuestions.size === quiz.questions.length) {
      this.gameOver();
      return;
    }

    let questionIndex;
    do {
      questionIndex = Math.floor(Math.random() * this.state.questions.length);
    } while (this.state.answeredQuestions.has(questionIndex));

    this.state.currentQuestion = this.state.questions[questionIndex];
    this.state.answeredQuestions.add(questionIndex);
    
    this.displayQuestion();
  }

  displayQuestion() {
    const { question, answer } = this.state.currentQuestion;
    const options = this.generateOptions(answer);
    
    this.updateElement(this.elements.question, question);
    this.renderOptions(options);
  }

  generateOptions(correctAnswer) {
    const allAnswers = quiz.questions.map(q => q.answer);
    const options = new Set([correctAnswer]);
    
    while (options.size < 4) {
      const randomAnswer = allAnswers[Math.floor(Math.random() * allAnswers.length)];
      if (randomAnswer !== correctAnswer) {
        options.add(randomAnswer);
      }
    }

    return this.shuffleArray([...options]);
  }
  renderOptions(options) {
    const answersDiv = this.elements.form.querySelector('.answers');
    if (!answersDiv) {
      // Create answers div if it doesn't exist
      const div = document.createElement('div');
      div.className = 'answers';
      this.elements.form.appendChild(div);
    }
    
    const answersContainer = this.elements.form.querySelector('.answers');
    answersContainer.innerHTML = '';

    options.forEach((option, index) => {
      const label = document.createElement('label');
      label.className = 'option-button';
      label.style.display = 'block';
      label.style.marginBottom = 'var(--space-sm)';
      
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = option;
      input.id = `answer${index}`;
      input.style.marginRight = 'var(--space-sm)';
      
      const span = document.createElement('span');
      span.textContent = option;
      
      label.appendChild(input);
      label.appendChild(span);
      answersContainer.appendChild(label);

      // Add click handler to label
      label.addEventListener('click', () => {
        input.checked = true;
        this.checkAnswer(option);
      });
    });
  }
  checkAnswer(answer) {
    const isCorrect = answer === this.state.currentQuestion.answer;
    
    if (isCorrect) {
      this.state.score++;
      this.updateScore();
      this.elements.feedback.textContent = '✅ Correct!';
      this.elements.feedback.style.display = 'block';
      this.elements.feedback.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
      this.elements.feedback.style.color = '#059669';
    } else {
      this.elements.feedback.textContent = '❌ Wrong!';
      this.elements.feedback.style.display = 'block';
      this.elements.feedback.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
      this.elements.feedback.style.color = '#dc2626';
      this.elements.correct.textContent = `The correct answer was: ${this.state.currentQuestion.answer}`;
      this.elements.correct.style.display = 'block';
    }
    // Show next question after delay
    setTimeout(() => {
      this.elements.feedback.style.display = 'none';
      this.elements.correct.style.display = 'none';
      this.chooseQuestion();
    }, 2000);
  }
  gameOver() {
    clearInterval(this.state.interval);
    this.state.isGameActive = false;
    this.elements.form.style.display = 'none';
    this.elements.start.style.display = 'block';
    
    const finalScore = this.state.score;
    this.updateElement(
      this.elements.feedback,
      `Game Over! You scored ${finalScore} out of ${quiz.questions.length}`
    );
    this.elements.feedback.style.display = 'block';

    this.updateHighScore();
  }

  updateHighScore() {
    if (this.state.score > this.highScore) {
      this.highScore = this.state.score;
      localStorage.setItem("hiScore", this.highScore);
      this.updateElement(this.elements.hiScore, `High Score: ${this.highScore}`);
    }
  }

  loadHighScore() {
    return parseInt(localStorage.getItem("hiScore")) || 0;
  }

  updateScore() {
    this.updateElement(this.elements.score, this.state.score);
  }

  showFeedback(message, className) {
    this.updateElement(this.elements.feedback, message, className);
  }

  clearFeedback() {
    this.updateElement(this.elements.feedback, '', '');
  }

  updateElement(element, content, className) {
    if (element) {
      element.innerHTML = content;
      if (className !== undefined) {
        element.className = className;
      }
    }
  }

  showElement(element) {
    if (element) element.style.display = "block";
  }

  hideElement(element) {
    if (element) element.style.display = "none";
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

// Quiz content
const quiz = {
  name: "Marvel Universe Quiz",
  questions: [
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
  ]
};

// Initialize the quiz
document.addEventListener('DOMContentLoaded', () => {
  new QuizNinja();
});

/* Code adapted from tutorial exercises found in:
JavaScript: Novice to Ninja
by Darren Jones
Copyright © 2014 SitePoint Pty. Ltd
Published by SitePoint Pty. Ltd.
48 Cambridge Street Collingwood
VIC Australia 3066
Web: www.sitepoint.com
Email: business@sitepoint.com
ISBN 978-0-9924612-2-5 (print)
ISBN 978-0-9924612-1-8 (ebook)
*/
