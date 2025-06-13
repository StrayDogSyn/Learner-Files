/**
 * Modern To-Do List Application
 * Features: Drag & Drop, Categories, Priorities, Due Dates, Search, Filters, Bulk Actions
 * Dependencies: jQuery, jQuery UI, Bootstrap
 */

$(document).ready(function() {
    'use strict';

    // Application State
    const TodoApp = {
        tasks: JSON.parse(localStorage.getItem('modernTodos')) || [],
        currentFilter: 'all',
        currentSort: 'created',
        searchQuery: '',
        selectedTasks: new Set(),
        editingTaskId: null,

        // Initialize the application
        init() {
            this.setupEventListeners();
            this.setupSortable();
            this.setupDateInput();
            this.render();
            this.updateStats();
            console.log('Modern To-Do List initialized!');
        },

        // Event Listeners Setup
        setupEventListeners() {
            // Task form submission
            $('#taskForm').on('submit', (e) => {
                e.preventDefault();
                this.addTask();
            });

            // Character counter for task input
            $('#taskInput').on('input', () => {
                const length = $('#taskInput').val().length;
                $('#charCount').text(length);
                
                if (length > 180) {
                    $('#charCount').css('color', '#e84393');
                } else if (length > 150) {
                    $('#charCount').css('color', '#fdcb6e');
                } else {
                    $('#charCount').css('color', '#6c757d');
                }
            });

            // Toggle advanced options
            $('#toggleOptions').on('click', () => {
                const $options = $('#taskOptions');
                const $btn = $('#toggleOptions');
                
                if ($options.is(':visible')) {
                    $options.slideUp(300);
                    $btn.removeClass('active');
                } else {
                    $options.slideDown(300);
                    $btn.addClass('active');
                }
            });

            // Search functionality
            $('#searchInput').on('input', debounce(() => {
                this.searchQuery = $('#searchInput').val().toLowerCase().trim();
                $('#clearSearch').toggle(this.searchQuery.length > 0);
                this.render();
            }, 300));

            $('#clearSearch').on('click', () => {
                $('#searchInput').val('');
                this.searchQuery = '';
                $('#clearSearch').hide();
                this.render();
            });

            // Filter buttons
            $('.filter-btn').on('click', (e) => {
                const filter = $(e.target).data('filter');
                this.setFilter(filter);
            });

            // Sort dropdown
            $('#sortBy').on('change', () => {
                this.currentSort = $('#sortBy').val();
                this.render();
            });

            // Bulk actions
            $('#bulkComplete').on('click', () => this.bulkComplete());
            $('#bulkDelete').on('click', () => this.bulkDelete());
            $('#clearSelection').on('click', () => this.clearSelection());

            // Quick actions
            $('#clearCompleted').on('click', () => this.clearCompleted());
            $('#exportTasks').on('click', () => this.exportTasks());

            // Modal actions
            $('#saveTaskChanges').on('click', () => this.saveTaskEdit());
            
            // Edit task form character counter
            $('#editTaskText').on('input', () => {
                const length = $('#editTaskText').val().length;
                $('#editCharCount').text(length);
            });

            // Task list event delegation
            $('#taskList').on('click', '.task-checkbox', (e) => {
                const taskId = $(e.target).closest('.task-item').data('task-id');
                this.toggleTask(taskId);
            });

            $('#taskList').on('click', '.bulk-select-checkbox', (e) => {
                const taskId = $(e.target).closest('.task-item').data('task-id');
                this.toggleTaskSelection(taskId);
            });

            $('#taskList').on('click', '.btn-edit', (e) => {
                const taskId = $(e.target).closest('.task-item').data('task-id');
                this.editTask(taskId);
            });

            $('#taskList').on('click', '.btn-delete', (e) => {
                const taskId = $(e.target).closest('.task-item').data('task-id');
                this.deleteTask(taskId);
            });

            $('#taskList').on('dblclick', '.task-text', (e) => {
                const taskId = $(e.target).closest('.task-item').data('task-id');
                this.editTask(taskId);
            });

            // Keyboard shortcuts
            $(document).on('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'a':
                            if (this.tasks.length > 0) {
                                e.preventDefault();
                                this.selectAllTasks();
                            }
                            break;
                        case 'Delete':
                        case 'Backspace':
                            if (this.selectedTasks.size > 0) {
                                e.preventDefault();
                                this.bulkDelete();
                            }
                            break;
                    }
                }
                
                if (e.key === 'Escape') {
                    this.clearSelection();
                    $('#searchInput').val('').trigger('input');
                }
            });
        },

        // Setup jQuery UI Sortable
        setupSortable() {
            $('#taskList').sortable({
                handle: '.drag-handle',
                placeholder: 'task-placeholder',
                tolerance: 'pointer',
                cursor: 'grabbing',
                helper: (e, item) => {
                    item.addClass('dragging');
                    return item;
                },
                start: (e, ui) => {
                    ui.item.addClass('ui-sortable-helper');
                },
                stop: (e, ui) => {
                    ui.item.removeClass('dragging ui-sortable-helper');
                    this.updateTaskOrder();
                },
                update: () => {
                    this.updateTaskOrder();
                }
            });
        },

        // Setup date input with minimum date
        setupDateInput() {
            const today = new Date().toISOString().split('T')[0];
            $('#taskDueDate, #editTaskDueDate').attr('min', today);
        },

        // Add new task
        addTask() {
            const text = $('#taskInput').val().trim();
            if (!text) return;

            const task = {
                id: Date.now() + Math.random(),
                text: text,
                completed: false,
                priority: $('#taskPriority').val(),
                category: $('#taskCategory').val(),
                dueDate: $('#taskDueDate').val(),
                createdAt: new Date().toISOString(),
                order: this.tasks.length
            };

            this.tasks.push(task);
            this.saveToStorage();
            this.render();
            this.updateStats();

            // Reset form
            $('#taskForm')[0].reset();
            $('#taskOptions').slideUp(300);
            $('#toggleOptions').removeClass('active');
            $('#charCount').text('0').css('color', '#6c757d');

            // Show success animation
            this.showNotification('Task added successfully!', 'success');
        },

        // Toggle task completion
        toggleTask(taskId) {
            const task = this.tasks.find(t => t.id == taskId);
            if (task) {
                task.completed = !task.completed;
                task.completedAt = task.completed ? new Date().toISOString() : null;
                this.saveToStorage();
                this.render();
                this.updateStats();
                
                const message = task.completed ? 'Task completed!' : 'Task reopened!';
                this.showNotification(message, task.completed ? 'success' : 'info');
            }
        },

        // Delete task with confirmation
        deleteTask(taskId) {
            const task = this.tasks.find(t => t.id == taskId);
            if (task) {
                this.showConfirmDialog(
                    `Are you sure you want to delete "${task.text}"?`,
                    () => {
                        this.tasks = this.tasks.filter(t => t.id != taskId);
                        this.selectedTasks.delete(taskId);
                        this.saveToStorage();
                        this.render();
                        this.updateStats();
                        this.showNotification('Task deleted!', 'error');
                    }
                );
            }
        },

        // Edit task
        editTask(taskId) {
            const task = this.tasks.find(t => t.id == taskId);
            if (task) {
                this.editingTaskId = taskId;
                $('#editTaskText').val(task.text);
                $('#editTaskPriority').val(task.priority);
                $('#editTaskCategory').val(task.category);
                $('#editTaskDueDate').val(task.dueDate);
                $('#editCharCount').text(task.text.length);
                
                const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
                modal.show();
            }
        },

        // Save task edit
        saveTaskEdit() {
            if (!this.editingTaskId) return;

            const task = this.tasks.find(t => t.id == this.editingTaskId);
            const newText = $('#editTaskText').val().trim();
            
            if (task && newText) {
                task.text = newText;
                task.priority = $('#editTaskPriority').val();
                task.category = $('#editTaskCategory').val();
                task.dueDate = $('#editTaskDueDate').val();
                task.updatedAt = new Date().toISOString();

                this.saveToStorage();
                this.render();
                this.updateStats();

                const modal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
                modal.hide();
                
                this.showNotification('Task updated!', 'success');
            }
        },

        // Filter tasks
        setFilter(filter) {
            this.currentFilter = filter;
            $('.filter-btn').removeClass('active');
            $(`.filter-btn[data-filter="${filter}"]`).addClass('active');
            this.render();
        },

        // Get filtered and sorted tasks
        getFilteredTasks() {
            let filtered = [...this.tasks];

            // Apply search filter
            if (this.searchQuery) {
                filtered = filtered.filter(task => 
                    task.text.toLowerCase().includes(this.searchQuery) ||
                    (task.category && task.category.toLowerCase().includes(this.searchQuery))
                );
            }

            // Apply status filter
            switch (this.currentFilter) {
                case 'pending':
                    filtered = filtered.filter(task => !task.completed);
                    break;
                case 'completed':
                    filtered = filtered.filter(task => task.completed);
                    break;
            }

            // Apply sorting
            filtered.sort((a, b) => {
                switch (this.currentSort) {
                    case 'priority':
                        const priorityOrder = { high: 3, medium: 2, low: 1 };
                        return priorityOrder[b.priority] - priorityOrder[a.priority];
                    case 'dueDate':
                        if (!a.dueDate && !b.dueDate) return 0;
                        if (!a.dueDate) return 1;
                        if (!b.dueDate) return -1;
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    case 'alphabetical':
                        return a.text.localeCompare(b.text);
                    case 'created':
                    default:
                        return a.order - b.order;
                }
            });

            return filtered;
        },

        // Render task list
        render() {
            const filteredTasks = this.getFilteredTasks();
            const $taskList = $('#taskList');
            
            if (filteredTasks.length === 0) {
                $taskList.empty();
                if (this.searchQuery || this.currentFilter !== 'all') {
                    $('#noResults').show();
                    $('#emptyState').hide();
                } else {
                    $('#emptyState').show();
                    $('#noResults').hide();
                }
            } else {
                $('#emptyState, #noResults').hide();
                
                const tasksHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
                $taskList.html(tasksHTML);
            }

            this.updateFilterCounts();
            this.updateBulkActions();
        },

        // Create task HTML
        createTaskHTML(task) {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
            const priorityClass = `priority-${task.priority}`;
            const categoryEmoji = this.getCategoryEmoji(task.category);
            const dueDateDisplay = task.dueDate ? this.formatDate(task.dueDate) : '';
            const timestamp = this.formatRelativeTime(task.createdAt);

            return `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                    <div class="task-checkbox-wrapper">
                        <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                             title="${task.completed ? 'Mark as pending' : 'Mark as completed'}"></div>
                        <div class="bulk-select-checkbox ${this.selectedTasks.has(task.id) ? 'checked' : ''}"
                             title="Select for bulk actions"></div>
                    </div>
                    
                    <div class="task-content">
                        <div class="task-text" title="Double-click to edit">${this.escapeHtml(task.text)}</div>
                        
                        <div class="task-meta">
                            <span class="task-priority ${priorityClass}">${task.priority}</span>
                            ${task.category ? `<span class="task-category">${categoryEmoji} ${task.category}</span>` : ''}
                            ${task.dueDate ? `<span class="task-due-date ${isOverdue ? 'overdue' : ''}" title="${isOverdue ? 'Overdue!' : 'Due date'}">
                                <i class="fas fa-calendar-alt me-1"></i>${dueDateDisplay}
                            </span>` : ''}
                        </div>
                        
                        <div class="task-timestamp">
                            <i class="fas fa-clock me-1"></i>
                            Created ${timestamp}
                            ${task.updatedAt ? ` • Updated ${this.formatRelativeTime(task.updatedAt)}` : ''}
                        </div>
                    </div>
                    
                    <div class="task-actions">
                        <button class="task-action-btn drag-handle" title="Drag to reorder">
                            <i class="fas fa-grip-vertical"></i>
                        </button>
                        <button class="task-action-btn btn-edit" title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action-btn btn-delete" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        },

        // Update task order after drag and drop
        updateTaskOrder() {
            const taskIds = $('#taskList .task-item').map((i, el) => $(el).data('task-id')).get();
            
            taskIds.forEach((id, index) => {
                const task = this.tasks.find(t => t.id == id);
                if (task) task.order = index;
            });
            
            this.saveToStorage();
        },

        // Task selection for bulk actions
        toggleTaskSelection(taskId) {
            if (this.selectedTasks.has(taskId)) {
                this.selectedTasks.delete(taskId);
            } else {
                this.selectedTasks.add(taskId);
            }
            this.updateBulkActions();
            this.render();
        },

        selectAllTasks() {
            const filteredTasks = this.getFilteredTasks();
            filteredTasks.forEach(task => this.selectedTasks.add(task.id));
            this.updateBulkActions();
            this.render();
        },

        clearSelection() {
            this.selectedTasks.clear();
            this.updateBulkActions();
            this.render();
        },

        // Bulk actions
        bulkComplete() {
            if (this.selectedTasks.size === 0) return;
            
            this.selectedTasks.forEach(taskId => {
                const task = this.tasks.find(t => t.id == taskId);
                if (task && !task.completed) {
                    task.completed = true;
                    task.completedAt = new Date().toISOString();
                }
            });
            
            this.clearSelection();
            this.saveToStorage();
            this.render();
            this.updateStats();
            this.showNotification(`${this.selectedTasks.size} tasks completed!`, 'success');
        },

        bulkDelete() {
            if (this.selectedTasks.size === 0) return;
            
            const count = this.selectedTasks.size;
            this.showConfirmDialog(
                `Are you sure you want to delete ${count} selected task${count > 1 ? 's' : ''}?`,
                () => {
                    this.tasks = this.tasks.filter(task => !this.selectedTasks.has(task.id));
                    this.clearSelection();
                    this.saveToStorage();
                    this.render();
                    this.updateStats();
                    this.showNotification(`${count} tasks deleted!`, 'error');
                }
            );
        },

        clearCompleted() {
            const completedTasks = this.tasks.filter(task => task.completed);
            if (completedTasks.length === 0) return;
            
            this.showConfirmDialog(
                `Are you sure you want to delete all ${completedTasks.length} completed tasks?`,
                () => {
                    this.tasks = this.tasks.filter(task => !task.completed);
                    this.clearSelection();
                    this.saveToStorage();
                    this.render();
                    this.updateStats();
                    this.showNotification(`${completedTasks.length} completed tasks deleted!`, 'error');
                }
            );
        },

        // Update bulk actions visibility
        updateBulkActions() {
            const hasSelection = this.selectedTasks.size > 0;
            $('#bulkActions').toggle(hasSelection);
            $('#selectedCount').text(this.selectedTasks.size);
        },

        // Update statistics
        updateStats() {
            const total = this.tasks.length;
            const completed = this.tasks.filter(task => task.completed).length;
            const pending = total - completed;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            $('#totalTasks').text(total);
            $('#pendingTasks').text(pending);
            $('#completedTasks').text(completed);
            $('#progressPercent').text(`${progress}%`);

            // Show/hide clear completed button
            $('#clearCompleted').toggle(completed > 0);
        },

        // Update filter counts
        updateFilterCounts() {
            const all = this.tasks.length;
            const active = this.tasks.filter(task => !task.completed).length;
            const done = this.tasks.filter(task => task.completed).length;

            $('#countAll').text(all);
            $('#countActive').text(active);
            $('#countDone').text(done);
        },

        // Export tasks
        exportTasks() {
            if (this.tasks.length === 0) {
                this.showNotification('No tasks to export!', 'warning');
                return;
            }

            const exportData = {
                exportDate: new Date().toISOString(),
                tasks: this.tasks.map(task => ({
                    text: task.text,
                    completed: task.completed,
                    priority: task.priority,
                    category: task.category,
                    dueDate: task.dueDate,
                    createdAt: task.createdAt,
                    completedAt: task.completedAt
                }))
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `my-tasks-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            this.showNotification('Tasks exported successfully!', 'success');
        },

        // Utility functions
        saveToStorage() {
            localStorage.setItem('modernTodos', JSON.stringify(this.tasks));
        },

        getCategoryEmoji(category) {
            const emojis = {
                work: '💼',
                personal: '👤',
                shopping: '🛒',
                health: '🏥',
                education: '📚'
            };
            return emojis[category] || '📂';
        },

        formatDate(dateString) {
            const date = new Date(dateString);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            if (date.toDateString() === today.toDateString()) {
                return 'Today';
            } else if (date.toDateString() === tomorrow.toDateString()) {
                return 'Tomorrow';
            } else {
                return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
                });
            }
        },

        formatRelativeTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 60) return 'just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
            
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        showNotification(message, type = 'info') {
            const colors = {
                success: '#00b894',
                error: '#e84393',
                warning: '#fdcb6e',
                info: '#74b9ff'
            };

            // Create notification element
            const notification = $(`
                <div class="toast-notification" style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${colors[type]};
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 9999;
                    font-weight: 500;
                    max-width: 300px;
                    animation: slideInRight 0.3s ease;
                ">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
            `);

            $('body').append(notification);

            // Auto-hide after 3 seconds
            setTimeout(() => {
                notification.fadeOut(300, () => notification.remove());
            }, 3000);
        },

        showConfirmDialog(message, onConfirm) {
            $('#confirmMessage').text(message);
            $('#confirmAction').off('click').on('click', () => {
                onConfirm();
                const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
                modal.hide();
            });
            
            const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
            modal.show();
        }
    };

    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Add slide-in animation styles
    $('<style>').prop('type', 'text/css').html(`
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .task-placeholder {
            background: rgba(108, 92, 231, 0.1);
            border: 2px dashed #6c5ce7;
            border-radius: 12px;
            height: 80px;
            margin-bottom: 0.75rem;
        }
    `).appendTo('head');

    // Initialize the application
    TodoApp.init();

    // Add some sample tasks for demonstration (only if no tasks exist)
    if (TodoApp.tasks.length === 0) {
        const sampleTasks = [
            {
                id: Date.now() + 1,
                text: "Welcome to your new modern to-do list! 🎉",
                completed: false,
                priority: "high",
                category: "personal",
                dueDate: "",
                createdAt: new Date().toISOString(),
                order: 0
            },
            {
                id: Date.now() + 2,
                text: "Try dragging tasks to reorder them",
                completed: false,
                priority: "medium",
                category: "education",
                dueDate: "",
                createdAt: new Date(Date.now() - 60000).toISOString(),
                order: 1
            },
            {
                id: Date.now() + 3,
                text: "Double-click this task to edit it",
                completed: true,
                priority: "low",
                category: "education",
                dueDate: "",
                createdAt: new Date(Date.now() - 120000).toISOString(),
                completedAt: new Date().toISOString(),
                order: 2
            }
        ];

        TodoApp.tasks = sampleTasks;
        TodoApp.saveToStorage();
        TodoApp.render();
        TodoApp.updateStats();
    }
});
      
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