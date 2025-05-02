$(() => {
  "use strict";

  class QuizGame {
    constructor() {
      this.state = {
        currentQuestion: 0,
        score: 0,
        attempts: 0,
        playerName: '',
        questions: []
      };

      this.elements = {
        result: document.getElementById('result'),
        gameScreens: {
          start: $('#start'),
          intro: $('#intro'),
          maestro: $('#maestro'),
          outro: $('#outro'),
          result: $('#result'),
          reset: $('#reset')
        }
      };

      this.marvelService = new MarvelService();
      this.init();
    }

    init() {
      this.hideAllScreens();
      this.attachEventListeners();
    }

    hideAllScreens() {
      Object.values(this.elements.gameScreens).forEach(screen => screen.hide());
      this.elements.gameScreens.start.show();
    }

    attachEventListeners() {
      this.elements.gameScreens.start.on('click', () => this.startGame());
      $('#submitOne').on('click', () => this.handleSubmit('first', '#intro', '#maestro'));
      $('#submitTwo').on('click', () => this.handleSubmit('second', '#maestro', '#outro'));
      $('#submitThree').on('click', () => this.handleSubmit('third', '#outro', '#intro'));
      $('.btn-cancel').on('click', () => this.handleGameOver('forfeit'));
      this.elements.gameScreens.reset.on('click', () => this.resetGame());
    }

    async startGame() {
      try {
        await this.loadQuestions();
        this.state.attempts++;
        this.transitionToScreen('start', 'intro');
        this.displayCurrentQuestion();
      } catch (error) {
        console.error('Game initialization failed:', error);
        this.showError('Unable to load game content. Please try again.');
      }
    }

    async loadQuestions() {
      await this.marvelService.fetchCharacters();
      this.state.questions = this.marvelService.generateQuestions();
      
      if (!this.state.questions.length) {
        throw new Error('No questions generated');
      }
    }

    handleSubmit(inputId, currentPanel, nextPanel) {
      const name = $(`#${inputId}`).val().trim();
      
      if (!name || name.toLowerCase() === 'your name') {
        this.handleGameOver('invalid');
        return;
      }

      this.state.playerName = name;
      this.state.attempts++;
      this.transitionToScreen(currentPanel, nextPanel);
      this.updateEmoji();
      this.displayCurrentQuestion();
    }

    displayCurrentQuestion() {
      if (!this.state.questions.length) return;

      const question = this.state.questions[this.state.currentQuestion];
      const template = `
        <img src="${question.image}" alt="${question.name}" class="marvel-character-img">
        <h3 class="mt-3">Who is this Marvel character?</h3>
        <div class="options-container mt-3">
          ${question.options.map(option => 
            `<button class="option-btn btn btn-primary m-2" data-answer="${option}">${option}</button>`
          ).join('')}
        </div>
      `;

      $('#counter').html(template);
      $('.option-btn').on('click', (e) => this.checkAnswer($(e.target).data('answer')));
    }

    checkAnswer(selectedAnswer) {
      const currentQuestion = this.state.questions[this.state.currentQuestion];
      if (selectedAnswer === currentQuestion.name) {
        this.state.score++;
      }

      this.state.currentQuestion++;
      
      if (this.state.currentQuestion >= this.state.questions.length) {
        this.handleGameOver('complete');
      } else {
        this.displayCurrentQuestion();
      }
    }

    updateEmoji() {
      const emojis = ['😀', '😎', '🤔', '🧐', '🤓'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      $('#manyFaces').html(randomEmoji);
    }

    handleGameOver(reason) {
      const messages = {
        complete: `Game Over! You scored ${this.state.score} out of ${this.state.questions.length} questions!`,
        forfeit: `Ha Ha Ha, I caught you ${this.state.attempts} times!!!`,
        invalid: 'Nice try! But that\'s not a valid name...'
      };

      this.showMessage(messages[reason] || 'Game Over!');
      this.elements.gameScreens.reset.show();
    }

    showMessage(message) {
      this.elements.gameScreens.result.show();
      this.elements.result.innerHTML = message;
    }

    showError(message) {
      this.showMessage(message);
      this.elements.gameScreens.reset.show();
    }

    transitionToScreen(from, to) {
      $(from).hide().removeAttr('autofocus');
      $(to).show().attr('autofocus');
    }

    resetGame() {
      window.location.reload();
    }
  }

  // Initialize the game
  new QuizGame();
});
