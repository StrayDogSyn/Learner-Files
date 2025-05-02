/////////////////////////////////////////////////////
//    * CompTIA Super Quiz Project                 //
//    * By Eric H. Petross                         //
//    * RI-JJM-6 => The Last Mile Program          //
//    * 2024 Copyright StrayDog Syndications LLC.  //
//    * All Rights Reserved                        //
/////////////////////////////////////////////////////

class CompTIAQuiz {
  constructor() {
    this.state = {
      score: 0,
      timeRemaining: 1220, // 20 minutes + 20 seconds
      currentQuestion: null,
      userName: '',
      interval: null,
      isQuizActive: false,
      hintPenalty: 1
    };

    this.elements = {
      question: document.getElementById("question"),
      feedback: document.getElementById("feedback"),
      answers: {
        1: document.getElementById("answer1"),
        2: document.getElementById("answer2"),
        3: document.getElementById("answer3"),
        4: document.getElementById("answer4")
      },
      controls: {
        start: document.getElementById("start"),
        hint: document.getElementById("cheater"),
        reset: document.getElementById("reset")
      },
      forms: {
        answers: document.getElementById("answers"),
        quiz: document.getElementById("quiz")
      },
      display: {
        score: document.getElementById("score"),
        timer: document.getElementById("timer"),
        name: document.getElementById("welcome"),
        hintText: document.getElementById("hintText"),
        correct: document.getElementById("correct"),
        wrong: document.getElementById("wrong"),
        intro: document.getElementById("intro")
      }
    };

    this.questionBank = [];
    this.init();
  }

  init() {
    this.hideInitialElements();
    this.attachEventListeners();
    this.updateScore();
  }

  hideInitialElements() {
    const { correct, wrong, answers, reset, hint } = this.elements.display;
    [correct, wrong, answers, reset, hint].forEach(el => this.hideElement(el));
    this.showElement(this.elements.display.intro);
  }

  attachEventListeners() {
    // Quiz flow controls
    this.elements.controls.start.addEventListener('click', () => this.startQuiz());
    this.elements.forms.answers.addEventListener('click', (e) => {
      if (e.target.matches('input[type="radio"]')) {
        this.handleAnswer(Number(e.target.value));
      }
    });
    this.elements.controls.reset.addEventListener('click', () => this.resetQuiz());
    this.elements.controls.hint.addEventListener('click', () => this.useHint());

    // User input handling
    document.querySelector('#confirm').addEventListener('click', () => this.handleUserNameInput());
    document.querySelector('#confirmQuestions').addEventListener('click', () => this.handleUserQuestion());

    // Keyboard controls
    this.attachKeyboardControls();
  }

  attachKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      if (!this.state.isQuizActive) return;

      const keyActions = {
        '1': () => this.selectAnswer(0),
        '2': () => this.selectAnswer(1),
        '3': () => this.selectAnswer(2),
        '4': () => this.selectAnswer(3),
        'h': () => this.useHint(),
        'Escape': () => this.confirmReset()
      };

      if (keyActions[e.key]) {
        e.preventDefault();
        keyActions[e.key]();
      }
    });
  }

  startQuiz() {
    if (!this.state.userName) {
      alert('Please enter your name first!');
      return;
    }

    this.state.isQuizActive = true;
    this.toggleElements();
    this.startTimer();
    this.loadNextQuestion();
  }

  toggleElements() {
    const { start, submit, intro, credits, reset, hint, answers } = this.elements.controls;
    [start, submit, intro, credits].forEach(el => this.hideElement(el));
    [hint, answers].forEach(el => this.showElement(el));
  }

  startTimer() {
    this.updateTimer();
    this.state.interval = setInterval(() => this.updateTimer(), 1000);
  }

  updateTimer() {
    this.state.timeRemaining--;
    this.updateElement(this.elements.display.timer, this.state.timeRemaining);
    if (this.state.timeRemaining <= 0) {
      this.endQuiz();
    }
  }

  loadNextQuestion() {
    if (this.questionBank.length === 0) {
      this.endQuiz();
      return;
    }

    this.state.currentQuestion = this.questionBank.pop();
    this.displayQuestion(this.state.currentQuestion);
  }

  displayQuestion(question) {
    this.updateElement(this.elements.question, question.questionText);
    
    question.answers.forEach((answer, index) => {
      this.updateElement(this.elements.answers[index + 1], answer);
    });

    this.updateElement(this.elements.display.hintText, question.answers[question.correctAnswer]);
  }

  handleAnswer(choice) {
    const isCorrect = choice === this.state.currentQuestion.correctAnswer;
    
    if (isCorrect) {
      this.state.score++;
      this.updateScore();
      this.showElement(this.elements.display.correct);
      this.hideElement(this.elements.display.wrong);
    } else {
      this.showElement(this.elements.display.wrong);
      this.hideElement(this.elements.display.correct);
    }

    this.clearAnswerSelection();
    this.loadNextQuestion();
  }

  useHint() {
    if (this.state.score <= 0) {
      alert('You need at least 1 point to use a hint!');
      return;
    }
    
    this.state.score = Math.max(0, this.state.score - this.state.hintPenalty);
    this.updateScore();
    this.showElement(this.elements.display.hintText);
    
    // Hide hint after 3 seconds
    setTimeout(() => {
      this.hideElement(this.elements.display.hintText);
    }, 3000);
  }

  handleUserNameInput() {
    const userName = document.querySelector('#user-name').value;
    const validName = /(\S+)/gi;
    
    if (!validName.test(userName)) {
      this.state.userName = prompt('Please enter your name to continue!');
    } else {
      this.state.userName = userName;
    }
    
    this.updateElement(this.elements.display.name, 
      `Good Luck on your test, ${this.state.userName}!`);
  }

  handleUserQuestion() {
    const questionText = document.querySelector('#user-question').value.trim();
    const answers = Array.from({ length: 4 }, (_, i) => 
      document.querySelector(`#answer-${i + 1}`).value.trim()
    );
    const correctAnswer = parseInt(document.querySelector('#correct-answer').value);

    if (!this.validateUserQuestion(questionText, answers, correctAnswer)) {
      return;
    }

    this.questionBank.push(new Question(questionText, answers, false, correctAnswer));
    this.clearQuestionForm();
  }

  validateUserQuestion(question, answers, correctAnswer) {
    if (!question || answers.some(a => !a)) {
      alert('Please fill in all fields');
      return false;
    }
    
    if (isNaN(correctAnswer) || correctAnswer < 1 || correctAnswer > 4) {
      alert('Please enter a valid correct answer number (1-4)');
      return false;
    }
    
    return true;
  }

  clearQuestionForm() {
    document.querySelector('#user-question').value = '';
    Array.from({ length: 4 }, (_, i) => 
      document.querySelector(`#answer-${i + 1}`).value = ''
    );
    document.querySelector('#correct-answer').value = '';
  }

  endQuiz() {
    clearInterval(this.state.interval);
    this.state.isQuizActive = false;
    this.hideQuizElements();
    this.showElement(this.elements.controls.reset);
    
    const finalScore = Math.round((this.state.score / this.questionBank.length) * 100);
    this.updateElement(this.elements.feedback, 
      `Quiz complete! Final score: ${finalScore}%`);
  }

  hideQuizElements() {
    const { answers, hint } = this.elements.controls;
    const { correct, wrong, hintText } = this.elements.display;
    
    [answers, hint, correct, wrong, hintText].forEach(el => this.hideElement(el));
  }

  resetQuiz() {
    if (confirm('Are you sure you want to reset the quiz? All progress will be lost.')) {
      this.state = {
        score: 0,
        timeRemaining: 1220,
        currentQuestion: null,
        userName: '',
        interval: null,
        isQuizActive: false,
        hintPenalty: 1
      };
      
      this.updateScore();
      this.hideQuizElements();
      this.showElement(this.elements.display.intro);
      this.showElement(this.elements.controls.start);
    }
  }

  selectAnswer(num) {
    const radio = document.querySelector(`#choice${num + 1}`);
    if (radio && !this.state.isAnswerSelected) {
      radio.click();
    }
  }

  clearAnswerSelection() {
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.checked = false);
  }

  updateScore() {
    this.updateElement(this.elements.display.score, this.state.score);
  }

  updateElement(element, content) {
    if (element) {
      element.innerText = content;
    }
  }

  showElement(element) {
    if (element) element.style.display = "block";
  }

  hideElement(element) {
    if (element) element.style.display = "none";
  }
}

class Question {
  constructor(questionText, answers, asked = false, correctAnswer) {
    this.questionText = questionText;
    this.answers = answers;
    this.asked = asked;
    this.correctAnswer = correctAnswer;
  }
}

// Initialize the quiz
document.addEventListener('DOMContentLoaded', () => {
  const quiz = new CompTIAQuiz();
});
