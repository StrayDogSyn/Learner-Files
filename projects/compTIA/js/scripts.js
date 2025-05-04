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
      hintPenalty: 1,
      questionIndex: 0
    };

    // Initialize DOM elements
    this.initElements();
    
    // Set up question bank
    this.questionBank = this.initQuestionBank();
    
    // Initialize quiz
    this.init();
  }

  initElements() {
    this.elements = {
      question: document.getElementById("question"),
      feedback: document.getElementById("feedback"),
      answers: {
        1: document.getElementById("answer1"),
        2: document.getElementById("answer2"),
        3: document.getElementById("answer3"),
        4: document.getElementById("answer4")
      },
      choices: {
        1: document.getElementById("choice1"),
        2: document.getElementById("choice2"),
        3: document.getElementById("choice3"),
        4: document.getElementById("choice4")
      },
      buttons: {
        start: document.getElementById("start"),
        next: document.getElementById("next"),
        hint: document.getElementById("cheater"),
        reset: document.getElementById("reset"),
        submit: document.getElementById("submit")
      },
      forms: {
        answers: document.getElementById("answers"),
        quiz: document.querySelector("form[name='quiz']")
      },
      display: {
        score: document.getElementById("score"),
        timer: document.getElementById("timer"),
        welcome: document.getElementById("welcome"),
        hintText: document.getElementById("hintText"),
        correct: document.getElementById("correct"),
        wrong: document.getElementById("wrong"),
        intro: document.getElementById("intro")
      },
      inputs: {
        userName: document.getElementById("user-name"),
        questionText: document.getElementById("question-text"),
        firstResponse: document.getElementById("first-response"),
        secondResponse: document.getElementById("second-response"),
        thirdResponse: document.getElementById("third-response"),
        fourthResponse: document.getElementById("fourth-response"),
        choices: document.getElementById("choices")
      },
      modals: {
        userInput: new bootstrap.Modal(document.getElementById("user-input")),
        userHint: new bootstrap.Modal(document.getElementById("user-hint")),
        userQuestion: new bootstrap.Modal(document.getElementById("user-question"))
      }
    };
  }

  init() {
    // Set initial state
    this.hideElement(this.elements.display.correct);
    this.hideElement(this.elements.display.wrong);
    this.hideElement(this.elements.buttons.next);
    this.updateScore();
    
    // Attach event listeners
    this.attachEventListeners();
    
    // Format time initially
    this.updateTimerDisplay();
  }

  initQuestionBank() {
    return [
      new Question(
        "Which network cable type is most resistant to electromagnetic interference?",
        ["Unshielded Twisted Pair (UTP)", "Fiber Optic", "Coaxial Cable", "Shielded Twisted Pair (STP)"],
        1
      ),
      new Question(
        "What is the maximum data transfer rate of USB 3.0?",
        ["480 Mbps", "5 Gbps", "10 Gbps", "20 Gbps"],
        1
      ),
      new Question(
        "Which Windows tool can be used to create a system image backup?",
        ["Disk Management", "Device Manager", "Backup and Restore", "System Restore"],
        2
      ),
      new Question(
        "What is the default subnet mask for a Class C IP address?",
        ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
        2
      ),
      new Question(
        "Which security protocol is used to encrypt data in transit over the web?",
        ["WPA", "WEP", "TLS/SSL", "IPSec"],
        2
      ),
      new Question(
        "Which RAID level provides fault tolerance through disk mirroring?",
        ["RAID 0", "RAID 1", "RAID 5", "RAID 10"],
        1
      ),
      new Question(
        "What command would you use to view the routing table on a Windows PC?",
        ["ipconfig", "tracert", "netstat", "route print"],
        3
      ),
      new Question(
        "Which type of malware locks user files and demands payment for the decryption key?",
        ["Adware", "Worm", "Trojan", "Ransomware"],
        3
      ),
      new Question(
        "What is the purpose of the POST process?",
        ["To load the operating system", "To test hardware components", "To initialize user settings", "To establish a network connection"],
        1
      ),
      new Question(
        "Which wireless encryption standard is currently considered the most secure?",
        ["WEP", "WPA", "WPA2", "WPA3"],
        3
      )
    ];
  }

  attachEventListeners() {
    // Quiz control buttons
    this.elements.buttons.start.addEventListener('click', () => this.showUserInputModal());
    this.elements.buttons.next.addEventListener('click', () => this.loadNextQuestion());
    this.elements.buttons.reset.addEventListener('click', () => this.resetQuiz());
    this.elements.buttons.hint.addEventListener('click', () => this.showHint());
    this.elements.buttons.submit.addEventListener('click', () => this.showUserQuestionModal());
    
    // Form submissions
    document.getElementById("confirm").addEventListener('click', () => this.handleUserNameInput());
    document.getElementById("confirmHint").addEventListener('click', () => this.useHint());
    document.getElementById("confirmQuestions").addEventListener('click', () => this.handleUserQuestion());
    
    // Radio button selection
    for (let i = 1; i <= 4; i++) {
      this.elements.choices[i].addEventListener('change', () => this.handleAnswer(i - 1));
    }
    
    // Keyboard shortcuts
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
        '[': () => this.startQuiz(),
        ']': () => this.showUserInputModal(),
        'h': () => this.showHint(),
        'q': () => this.showUserQuestionModal(),
        'Escape': () => this.confirmReset()
      };
      
      if (keyActions[e.key]) {
        e.preventDefault();
        keyActions[e.key]();
      }
    });
  }

  showUserInputModal() {
    this.elements.modals.userInput.show();
  }
  
  showUserQuestionModal() {
    this.elements.modals.userQuestion.show();
  }
  
  showHint() {
    this.elements.modals.userHint.show();
  }

  handleUserNameInput() {
    const userName = this.elements.inputs.userName.value.trim();
    if (!userName) {
      alert('Please enter your name to continue!');
      return;
    }
    
    this.state.userName = userName;
    this.elements.display.welcome.innerHTML = `<i class="fa fa-user-graduate"></i> Good Luck on your test, ${this.state.userName}!`;
    this.startQuiz();
  }

  startQuiz() {
    if (!this.state.userName) {
      this.showUserInputModal();
      return;
    }
    
    this.state.isQuizActive = true;
    this.hideElement(this.elements.buttons.start);
    this.hideElement(this.elements.display.intro);
    this.showElement(this.elements.buttons.next);
    this.showElement(this.elements.forms.answers);
    
    // Start timer
    this.startTimer();
    
    // Load first question
    this.loadNextQuestion();
  }

  startTimer() {
    // Clear any existing timer
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    
    this.updateTimerDisplay();
    
    this.state.interval = setInterval(() => {
      this.state.timeRemaining--;
      this.updateTimerDisplay();
      
      if (this.state.timeRemaining <= 0) {
        this.endQuiz();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.state.timeRemaining / 60);
    const seconds = this.state.timeRemaining % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    this.elements.display.timer.textContent = formattedTime;
  }

  loadNextQuestion() {
    this.hideElement(this.elements.display.correct);
    this.hideElement(this.elements.display.wrong);
    this.clearAnswerSelection();
    
    // Check if we've reached the end of our questions
    if (this.state.questionIndex >= this.questionBank.length) {
      this.endQuiz();
      return;
    }
    
    // Get next question
    this.state.currentQuestion = this.questionBank[this.state.questionIndex++];
    
    // Display question
    this.elements.question.textContent = this.state.currentQuestion.questionText;
    
    // Display answers
    for (let i = 1; i <= 4; i++) {
      this.elements.answers[i].textContent = this.state.currentQuestion.answers[i-1];
    }
    
    // Set hint text
    this.elements.display.hintText.textContent = 
      `The answer is: ${this.state.currentQuestion.answers[this.state.currentQuestion.correctAnswer]}`;
  }

  selectAnswer(index) {
    if (this.elements.choices[index + 1]) {
      this.elements.choices[index + 1].checked = true;
      this.handleAnswer(index);
    }
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
    
    // Auto-advance to next question after short delay
    setTimeout(() => this.loadNextQuestion(), 1500);
  }

  useHint() {
    if (this.state.score <= 0) {
      alert('You need at least 1 point to use a hint!');
      return;
    }
    
    this.state.score = Math.max(0, this.state.score - this.state.hintPenalty);
    this.updateScore();
  }

  handleUserQuestion() {
    const questionText = this.elements.inputs.questionText.value.trim();
    const answers = [
      this.elements.inputs.firstResponse.value.trim(),
      this.elements.inputs.secondResponse.value.trim(),
      this.elements.inputs.thirdResponse.value.trim(),
      this.elements.inputs.fourthResponse.value.trim()
    ];
    
    // Get selected correct answer
    const choiceValue = this.elements.inputs.choices.value;
    let correctAnswer;
    
    switch(choiceValue) {
      case 'first': correctAnswer = 0; break;
      case 'second': correctAnswer = 1; break;
      case 'third': correctAnswer = 2; break;
      case 'fourth': correctAnswer = 3; break;
      default: correctAnswer = 0;
    }
    
    // Validate question
    if (!this.validateUserQuestion(questionText, answers)) {
      return;
    }
    
    // Add question to bank
    this.questionBank.push(new Question(questionText, answers, correctAnswer));
    
    // Clear form
    this.elements.inputs.questionText.value = '';
    this.elements.inputs.firstResponse.value = '';
    this.elements.inputs.secondResponse.value = '';
    this.elements.inputs.thirdResponse.value = '';
    this.elements.inputs.fourthResponse.value = '';
    
    // Show confirmation
    alert('Your question has been added to the quiz!');
  }

  validateUserQuestion(question, answers) {
    if (!question || question.length < 10) {
      alert('Please enter a valid question (at least 10 characters).');
      return false;
    }
    
    if (answers.some(answer => !answer)) {
      alert('Please fill in all four answers.');
      return false;
    }
    
    return true;
  }

  updateScore() {
    this.elements.display.score.textContent = this.state.score;
  }

  clearAnswerSelection() {
    for (let i = 1; i <= 4; i++) {
      if (this.elements.choices[i]) {
        this.elements.choices[i].checked = false;
      }
    }
  }

  endQuiz() {
    // Stop timer
    clearInterval(this.state.interval);
    
    // Hide quiz elements
    this.hideElement(this.elements.display.correct);
    this.hideElement(this.elements.display.wrong);
    this.hideElement(this.elements.buttons.next);
    this.hideElement(this.elements.forms.answers);
    
    // Show ending message
    const totalQuestions = this.state.questionIndex;
    const percentageScore = totalQuestions > 0 ? Math.round((this.state.score / totalQuestions) * 100) : 0;
    
    let resultMessage = `Quiz Complete! Your score: ${this.state.score} out of ${totalQuestions} (${percentageScore}%)`;
    
    if (percentageScore >= 70) {
      resultMessage += "<br><span class='text-success'>Congratulations! You passed!</span>";
    } else {
      resultMessage += "<br><span class='text-danger'>You need to score at least 70% to pass. Try again!</span>";
    }
    
    this.elements.feedback.innerHTML = resultMessage;
    this.elements.feedback.classList.add('p-4');
    this.showElement(this.elements.feedback);
    this.showElement(this.elements.buttons.reset);
    
    // Update state
    this.state.isQuizActive = false;
  }

  resetQuiz() {
    if (!this.confirmReset()) return;
    
    // Reset state
    this.state.score = 0;
    this.state.timeRemaining = 1220;
    this.state.currentQuestion = null;
    this.state.questionIndex = 0;
    clearInterval(this.state.interval);
    
    // Reset UI
    this.updateScore();
    this.updateTimerDisplay();
    this.hideElement(this.elements.display.correct);
    this.hideElement(this.elements.display.wrong);
    this.hideElement(this.elements.buttons.next);
    this.hideElement(this.elements.buttons.reset);
    this.hideElement(this.elements.feedback);
    this.hideElement(this.elements.forms.answers);
    this.showElement(this.elements.display.intro);
    this.showElement(this.elements.buttons.start);
    
    // Reset question bank
    this.questionBank = this.initQuestionBank();
    this.elements.question.textContent = "What is this test anyway?";
    this.clearAnswerSelection();
  }

  confirmReset() {
    return confirm('Are you sure you want to reset the quiz? All progress will be lost.');
  }

  showElement(element) {
    if (element) {
      element.style.display = 'block';
    }
  }

  hideElement(element) {
    if (element) {
      element.style.display = 'none';
    }
  }
}

class Question {
  constructor(questionText, answers, correctAnswer) {
    this.questionText = questionText;
    this.answers = answers;
    this.correctAnswer = correctAnswer;
  }
}

// Initialize the quiz when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    window.quizApp = new CompTIAQuiz();
  } catch (err) {
    console.error('Error initializing quiz:', err);
  }
});
