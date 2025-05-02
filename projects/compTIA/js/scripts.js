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
      currentQuestion: null,
      timeRemaining: 1220, // 20 minutes + 20 seconds
      interval: null,
      userName: '',
      isQuizActive: false
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
      display: {
        score: document.getElementById("score"),
        timer: document.getElementById("timer"),
        name: document.getElementById("welcome"),
        hintText: document.getElementById("hintText"),
        correct: document.getElementById("correct"),
        wrong: document.getElementById("wrong"),
        intro: document.getElementById("intro")
      },
      forms: {
        answers: document.getElementById("answers"),
        quiz: document.getElementById("quiz")
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
    window.addEventListener('keydown', (event) => {
      if (event.defaultPrevented) return;

      const keyActions = {
        '1': () => this.selectAnswer(0),
        '2': () => this.selectAnswer(1),
        '3': () => this.selectAnswer(2),
        '4': () => this.selectAnswer(3),
        '[': () => this.startQuiz(),
        ']': () => this.changeUserName(),
        'q': () => document.querySelector('#submit').click(),
        'Escape': () => this.confirmReset(),
        '/': () => document.querySelector('#toggle').click()
      };

      if (keyActions[event.key]) {
        event.preventDefault();
        keyActions[event.key]();
      }
    });
  }

  startQuiz() {
    this.state.isQuizActive = true;
    this.state.score = 0;
    this.updateScore();
    
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
    this.state.timeRemaining = 1220;
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
    this.state.score = Math.max(0, this.state.score - 1);
    this.updateScore();
  }

  handleUserQuestion() {
    const question = {
      questionText: document.querySelector('#question-text').value,
      answers: [
        document.querySelector('#first-response').value,
        document.querySelector('#second-response').value,
        document.querySelector('#third-response').value,
        document.querySelector('#fourth-response').value
      ],
      correctAnswer: Number(document.querySelector('#select-answer').value)
    };

    this.questionBank.push(new Question(
      question.questionText,
      question.answers,
      false,
      question.correctAnswer
    ));

    this.clearQuestionForm();
  }

  clearQuestionForm() {
    ['#question-text', '#first-response', '#second-response', 
     '#third-response', '#fourth-response'].forEach(selector => {
      document.querySelector(selector).value = '';
    });
  }

  endQuiz() {
    const finalScore = ((this.state.score / this.questionBank.length) * 100).toFixed(2);
    const message = `Quiz over, you scored ${this.state.score} out of ${this.questionBank.length} total points, resulting in a ${finalScore}%!`;
    
    this.hideQuizElements();
    this.updateElement(this.elements.feedback, message);
    clearInterval(this.state.interval);
  }

  hideQuizElements() {
    const { correct, question, answers, hint, wrong } = this.elements.display;
    [correct, question, answers, hint, wrong].forEach(el => this.hideElement(el));
    this.showElement(this.elements.controls.reset);
  }

  resetQuiz() {
    window.location.reload();
  }

  confirmReset() {
    if (confirm("This will reset the quiz, are you sure that's what you want?")) {
      this.resetQuiz();
    }
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

  selectAnswer(num) {
    const radio = document.querySelector(`#choice${num + 1}`);
    if (radio && !this.state.isAnswerSelected) {
      radio.click();
    }
  }

  clearAnswerSelection() {
    document.querySelectorAll('input[name="answers-group"]')
      .forEach(radio => radio.checked = false);
  }
}

// Question class definition
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
