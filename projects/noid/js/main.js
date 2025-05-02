$(() => {
  "use strict";

  class QuizGame {
    constructor() {
      this.marvelService = new MarvelService();
      this.currentQuestion = 0;
      this.score = 0;
      this.count = 0;
      this.name = '';
      this.questions = [];
      this.initializeDOM();
      this.attachEventListeners();
    }

    initializeDOM() {
      this.$end = document.getElementById('result');
      $('#result, #reset, #intro, #maestro, #outro').hide();
    }

    attachEventListeners() {
      $('#start').on('click', () => this.startGame());
      $('#submitOne').on('click', () => this.handleSubmit('first', '#intro', '#maestro'));
      $('#submitTwo').on('click', () => this.handleSubmit('second', '#maestro', '#outro'));
      $('#submitThree').on('click', () => this.handleSubmit('third', '#outro', '#intro'));
      $('.btn-cancel').on('click', () => this.soreLoser());
      $('#reset').on('click', () => this.resetPage());
    }

    async startGame() {
      try {
        await this.marvelService.fetchCharacters();
        this.questions = this.marvelService.generateQuestions();
        this.count++;
        $('#start').hide().removeAttr('autofocus');
        $('#intro').show().attr('autofocus');
        this.displayCurrentQuestion();
      } catch (error) {
        console.error('Failed to start game:', error);
        this.showError('Failed to load Marvel characters. Please try again.');
      }
    }

    handleSubmit(inputId, currentPanel, nextPanel) {
      this.name = $(`#${inputId}`).val();
      if (this.name.toLowerCase() !== 'your name') {
        $(currentPanel).hide().removeAttr('autofocus');
        $(nextPanel).show().attr('autofocus');
        this.count++;
        this.updateEmoji();
        this.displayCurrentQuestion();
      } else {
        this.smartGuy();
      }
    }

    displayCurrentQuestion() {
      if (this.questions.length > 0) {
        const question = this.questions[this.currentQuestion];
        $('#counter').html(`
          <img src="${question.image}" alt="${question.name}" class="marvel-character-img">
          <h3 class="mt-3">Who is this Marvel character?</h3>
          <div class="options-container mt-3">
            ${question.options.map(option => 
              `<button class="option-btn btn btn-primary m-2" data-answer="${option}">${option}</button>`
            ).join('')}
          </div>
        `);

        $('.option-btn').on('click', (e) => this.checkAnswer($(e.target).data('answer')));
      }
    }

    checkAnswer(selectedAnswer) {
      const correctAnswer = this.questions[this.currentQuestion].name;
      if (selectedAnswer === correctAnswer) {
        this.score++;
      }
      this.currentQuestion++;
      if (this.currentQuestion < this.questions.length) {
        this.displayCurrentQuestion();
      } else {
        this.showFinalScore();
      }
    }

    updateEmoji() {
      const $faces = $('#manyFaces');
      if (this.count >= 15) {
        $faces.removeClass('fa-sad-tear').addClass('fa-sad-cry');
      } else if (this.count >= 10) {
        $faces.removeClass('fa-angry').addClass('fa-sad-tear');
      } else if (this.count >= 5) {
        $faces.removeClass('fa-grimace').addClass('fa-angry');
      }
    }

    showFinalScore() {
      $('#result').show();
      this.updateElement(this.$end, 
        `Game Over! You scored ${this.score} out of ${this.questions.length} questions!`);
      $('#reset').show();
    }

    smartGuy() {
      $('#result').show();
      this.updateElement(this.$end, `You the man! It only took ${this.count} tries to catch on...`);
      $('#reset').show();
    }

    soreLoser() {
      $('#result').show();
      this.updateElement(this.$end, `Ha Ha Ha, I caught mad rec on you ${this.count} times!!!`);
      $('#reset').show();
    }

    updateElement(element, content) {
      element.innerHTML = content;
    }

    showError(message) {
      $('#result').show();
      this.updateElement(this.$end, message);
      $('#reset').show();
    }

    resetPage() {
      window.location.reload();
    }
  }

  // Initialize the game
  new QuizGame();
});
