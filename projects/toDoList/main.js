$(() => {
  "use strict";
  
  class TodoList {
    constructor() {
      this.todos = JSON.parse(localStorage.getItem('todos')) || [];
      this.init();
    }

    init() {
      this.renderTodos();
      this.attachEventListeners();
    }

    attachEventListeners() {
      $('form').on('submit', (evt) => {
        evt.preventDefault();
        this.addTodo();
      });

      $('.list').on('click', '.delete', (evt) => {
        this.deleteTodo(evt);
      });
    }

    addTodo() {
      const input = $('input');
      const todoText = input.val().trim();
      
      if (!todoText) return;

      this.todos.push(todoText);
      this.saveTodos();
      this.renderTodos();
      input.val('');
    }

    deleteTodo(evt) {
      const index = $(evt.target).closest('li').index();
      this.todos.splice(index, 1);
      this.saveTodos();
      this.renderTodos();
    }

    renderTodos() {
      const list = $('.list');
      list.empty();
      
      this.todos.forEach(todo => {
        $(`<li class="todo-item">
          ${todo}
          <button class="delete btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
         </li>`).appendTo(list);
      });
    }

    saveTodos() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  }

  // Initialize the Todo List
  new TodoList();
});