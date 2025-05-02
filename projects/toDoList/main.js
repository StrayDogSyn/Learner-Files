$(() => {
  "use strict";
  
  class TodoList {
    constructor() {
      this.todos = JSON.parse(localStorage.getItem('todos')) || [];
      this.elements = {
        form: $('form'),
        input: $('.input-box'),
        list: $('.list'),
        clearAll: $('.clear-all'),
        errorMsg: $('.error-message')
      };

      this.init();
    }

    init() {
      this.renderTodos();
      this.attachEventListeners();
    }

    attachEventListeners() {
      this.elements.form.on('submit', (evt) => {
        evt.preventDefault();
        this.addTodo();
      });

      this.elements.list.on('click', '.delete', (evt) => {
        this.deleteTodo(evt);
      });

      this.elements.list.on('click', '.todo-checkbox', (evt) => {
        this.toggleTodoComplete($(evt.target).closest('li').index());
      });

      this.elements.clearAll.on('click', () => {
        this.clearCompleted();
      });

      // Add drag and drop functionality
      this.elements.list.sortable({
        update: (event, ui) => {
          this.updateTodoOrder();
        }
      });
    }

    addTodo() {
      const todoText = this.elements.input.val().trim();
      
      if (!todoText) {
        this.showError('Please enter a task');
        return;
      }

      if (this.todos.some(todo => todo.text === todoText)) {
        this.showError('This task already exists');
        return;
      }

      this.todos.push({
        text: todoText,
        completed: false,
        createdAt: new Date().toISOString()
      });

      this.saveTodos();
      this.renderTodos();
      this.elements.input.val('');
      this.hideError();
    }

    deleteTodo(evt) {
      const index = $(evt.target).closest('li').index();
      this.todos.splice(index, 1);
      this.saveTodos();
      this.renderTodos();
    }

    toggleTodoComplete(index) {
      this.todos[index].completed = !this.todos[index].completed;
      this.saveTodos();
      this.renderTodos();
    }

    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed);
      this.saveTodos();
      this.renderTodos();
    }

    updateTodoOrder() {
      const newOrder = [];
      this.elements.list.find('li').each((index, element) => {
        const todoText = $(element).find('.todo-text').text();
        const todo = this.todos.find(t => t.text === todoText);
        if (todo) newOrder.push(todo);
      });
      
      this.todos = newOrder;
      this.saveTodos();
    }

    renderTodos() {
      const list = this.elements.list;
      list.empty();
      
      this.todos.forEach(todo => {
        $(`<li class="todo-item ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <button class="delete btn btn-danger btn-sm">
              <i class="fa fa-trash"></i>
            </button>
          </li>`).appendTo(list);
      });

      // Update counter
      $('.todo-count').text(`${this.todos.length} tasks`);
    }

    saveTodos() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    showError(message) {
      this.elements.errorMsg.text(message).slideDown();
    }

    hideError() {
      this.elements.errorMsg.slideUp();
    }

    escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }

  // Initialize the Todo List
  new TodoList();
});