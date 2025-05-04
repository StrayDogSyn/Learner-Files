// CompTIA Quiz Application - Enhanced Version

// Quiz Variables
let currentQuestion = 0;
let score = 0;
let userName = '';
let timer;
let seconds = 0;
let minutes = 0;
let correctAnswer = 0;
let totalQuestions = 0;

// Quiz Questions Array
const quizQuestions = [
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
];

// DOM Ready function
$(document).ready(function() {
  // Initialize the quiz
  initializeQuiz();
  
  // Event listeners
  $('#confirm').on('click', startQuiz);
  $('#next').on('click', nextQuestion);
  $('#reset').on('click', resetQuiz);
  $('#confirmHint').on('click', showHint);
  $('#confirmQuestions').on('click', addUserQuestion);
  
  // Show/Hide the help menu with keyboard shortcut '?'
  $(document).on('keydown', handleKeyboardShortcuts);
  
  // Update progress bar based on question
  updateProgressBar();
});

// Initialize quiz setup
function initializeQuiz() {
  // Hide elements that should be hidden initially
  $('#next').hide();
  $('#correct').hide();
  $('#wrong').hide();
  $('#question-counter').hide();
  
  // Set total questions
  totalQuestions = quizQuestions.length;
  
  // Update the "Question X of Y" text
  $('#question-counter').text(`Question ${currentQuestion + 1} of ${totalQuestions}`);
  
  // Disable the hint and submit buttons until quiz starts
  $('#cheater').prop('disabled', true);
  $('#submit').prop('disabled', true);
}

// Start the quiz
function startQuiz() {
  // Get and validate user name
  userName = $('#user-name').val().trim();
  
  if (userName === '') {
    userName = 'Candidate';
  }
  
  // Update welcome message
  $('#welcome').text(userName);
  
  // Hide intro and show first question
  $('#intro').hide();
  $('#question-counter').show();
  
  // Enable buttons
  $('#cheater').prop('disabled', false);
  $('#submit').prop('disabled', false);
  
  // Start the timer
  startTimer();
  
  // Load the first question
  loadQuestion(currentQuestion);
  
  // Update progress
  updateProgressBar();
}

// Load a question
function loadQuestion(index) {
  // Hide previous feedback
  $('#correct').hide();
  $('#wrong').hide();
  $('#next').hide();
  $('#feedback').empty();
  
  // Clear previous selections
  $('input[name="answers-group"]').prop('checked', false);
  
  // Get the current question
  const question = quizQuestions[index];
  
  // Update the UI with current question data
  $('#question').text(question.question);
  $('#answer1').html(`<i class="fa fa-check-circle me-2"></i> ${question.choices[0]}`);
  $('#answer2').html(`<i class="fa fa-check-circle me-2"></i> ${question.choices[1]}`);
  $('#answer3').html(`<i class="fa fa-check-circle me-2"></i> ${question.choices[2]}`);
  $('#answer4').html(`<i class="fa fa-check-circle me-2"></i> ${question.choices[3]}`);
  
  // Update correct answer for validation
  correctAnswer = question.correctAnswer;
  
  // Update question counter
  $('#question-counter').text(`Question ${index + 1} of ${totalQuestions}`);
  
  // Add event listener for answer selection
  $('input[name="answers-group"]').on('change', checkAnswer);
  
  // Add animation class
  $('#question').addClass('fade-in');
  $('#answers').addClass('fade-in');
  
  // Update progress
  updateProgressBar();
}

// Check the selected answer
function checkAnswer() {
  // Get the selected answer
  const selectedAnswer = parseInt($('input[name="answers-group"]:checked').val());
  
  // Get the current question
  const question = quizQuestions[currentQuestion];
  
  // Check if the answer is correct
  if (selectedAnswer === correctAnswer) {
    $('#correct').show();
    $('#wrong').hide();
    score++;
    $('#score').text(score);
    $('#feedback').html(`<div class="alert alert-success"><i class="fa fa-check-circle fa-lg me-2"></i> ${question.explanation}</div>`);
  } else {
    $('#wrong').show();
    $('#correct').hide();
    $('#feedback').html(`<div class="alert alert-danger"><i class="fa fa-times-circle fa-lg me-2"></i> ${question.explanation}</div>`);
  }
  
  // Show next button
  $('#next').show();
  
  // Disable the radio inputs after selection
  $('input[name="answers-group"]').prop('disabled', true);
}

// Move to next question
function nextQuestion() {
  // Enable the radio inputs for the new question
  $('input[name="answers-group"]').prop('disabled', false);
  
  // Check if there are more questions
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    loadQuestion(currentQuestion);
  } else {
    // End of quiz
    endQuiz();
  }
}

// End the quiz
function endQuiz() {
  // Stop the timer
  clearInterval(timer);
  
  // Calculate percentage
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Hide question and answers
  $('#question').text('Quiz Complete!');
  $('#answers').hide();
  $('#question-counter').hide();
  
  // Show results
  let resultMessage = '';
  if (percentage >= 70) {
    resultMessage = `<div class="alert alert-success">
      <h3>Congratulations, ${userName}!</h3>
      <p class="lead">You passed with a score of ${percentage}%!</p>
      <p>You answered ${score} out of ${totalQuestions} questions correctly.</p>
      <p>Time taken: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}</p>
    </div>`;
  } else {
    resultMessage = `<div class="alert alert-warning">
      <h3>Thank you, ${userName}!</h3>
      <p class="lead">Your score is ${percentage}%.</p>
      <p>You answered ${score} out of ${totalQuestions} questions correctly.</p>
      <p>For CompTIA certification exams, a 70% or better is recommended.</p>
      <p>Time taken: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}</p>
    </div>`;
  }
  
  // Show reset button
  $('#next').hide();
  $('#feedback').html(resultMessage);
}

// Reset the quiz
function resetQuiz() {
  // Reset quiz variables
  currentQuestion = 0;
  score = 0;
  seconds = 0;
  minutes = 0;
  
  // Reset UI
  $('#score').text(score);
  $('#timer').text('0:00');
  $('#intro').show();
  $('#answers').show();
  $('#correct').hide();
  $('#wrong').hide();
  $('#feedback').empty();
  $('#question-counter').hide();
  
  // Stop timer
  clearInterval(timer);
  
  // Reset progress bar
  updateProgressBar();
  
  // Disable the hint and submit buttons
  $('#cheater').prop('disabled', true);
  $('#submit').prop('disabled', true);
  
  // Load the welcome message
  $('#question').text('What is this test anyway?');
  $('#welcome').text('Candidate');
  
  // Re-enable the radio inputs
  $('input[name="answers-group"]').prop('disabled', false);
  
  // Remove the selected answer
  $('input[name="answers-group"]').prop('checked', false);
}

// Start the timer
function startTimer() {
  // Reset timer
  seconds = 0;
  minutes = 0;
  $('#timer').text('0:00');
  
  // Start interval
  timer = setInterval(function() {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    $('#timer').text(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
  }, 1000);
}

// Show hint for the current question
function showHint() {
  // Get the correct answer for the current question
  const correctAnswerText = quizQuestions[currentQuestion].choices[correctAnswer];
  
  // Display the hint
  $('#hintText').text(correctAnswerText);
  
  // Subtract point for using hint
  score = Math.max(0, score - 1);
  $('#score').text(score);
}

// Add a user-submitted question
function addUserQuestion() {
  const questionText = $('#question-text').val().trim();
  const choice1 = $('#first-response').val().trim();
  const choice2 = $('#second-response').val().trim();
  const choice3 = $('#third-response').val().trim();
  const choice4 = $('#fourth-response').val().trim();
  const correctChoice = $('#choices').val();
  
  // Map correct choice to index
  let correctIndex;
  switch (correctChoice) {
    case 'first':
      correctIndex = 0;
      break;
    case 'second':
      correctIndex = 1;
      break;
    case 'third':
      correctIndex = 2;
      break;
    case 'fourth':
      correctIndex = 3;
      break;
    default:
      correctIndex = 0;
  }
  
  // Validate all fields
  if (questionText && choice1 && choice2 && choice3 && choice4) {
    // Create new question object
    const newQuestion = {
      question: questionText,
      choices: [choice1, choice2, choice3, choice4],
      correctAnswer: correctIndex,
      explanation: `The correct answer is: ${[choice1, choice2, choice3, choice4][correctIndex]}`
    };
    
    // Add to questions array
    quizQuestions.push(newQuestion);
    totalQuestions = quizQuestions.length;
    
    // Give feedback
    alert('Your question has been added to the quiz!');
    
    // Clear form
    $('#question-text').val('');
    $('#first-response').val('');
    $('#second-response').val('');
    $('#third-response').val('');
    $('#fourth-response').val('');
  } else {
    alert('Please fill in all fields to submit a question.');
  }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
  switch (event.key) {
    case '?':
      $('#toggle').trigger('click');
      break;
    case '[':
      if (!timer) {
        $('#start').trigger('click');
      }
      break;
    case ']':
      $('#start').trigger('click');
      break;
    case 'Escape':
      resetQuiz();
      break;
    case 'q':
    case 'Q':
      $('#submit').trigger('click');
      break;
    case '1':
      $('#choice1').prop('checked', true).trigger('change');
      break;
    case '2':
      $('#choice2').prop('checked', true).trigger('change');
      break;
    case '3':
      $('#choice3').prop('checked', true).trigger('change');
      break;
    case '4':
      $('#choice4').prop('checked', true).trigger('change');
      break;
  }
}

// Update progress bar
function updateProgressBar() {
  const progress = (currentQuestion / totalQuestions) * 100;
  $('.progress-bar').css('width', `${progress}%`).attr('aria-valuenow', progress);
}
