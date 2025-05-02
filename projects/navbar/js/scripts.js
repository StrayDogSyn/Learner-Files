$(() => {
  'use strict';

  class NavigationManager {
    constructor() {
      this.state = {
        activeMenus: new Set(),
        isAnimating: false,
        animationDuration: 300
      };

      this.menus = {
        main: $('.navbar-main'),
        inner: $('.inner-nav'),
        innermost: $('.innermost-nav')
      };

      this.animations = {
        show: {
          duration: 'fast',
          easing: 'swing'
        },
        hide: {
          duration: 'fast',
          easing: 'swing'
        }
      };
      
      this.init();
    }

    init() {
      this.hideAllMenus();
      this.attachEventListeners();
    }

    hideAllMenus() {
      Object.values(this.menus).forEach(menu => menu.hide());
    }

    attachEventListeners() {
      // Main dropdown menu
      $('#dropdownMenu').on('click', () => {
        if (this.state.isAnimating) return;
        
        this.toggleMenu(
          this.menus.main, 
          [this.menus.inner, this.menus.innermost]
        );
      });

      // First level submenu
      $('.menu-button').on('click', () => {
        if (this.state.isAnimating) return;
        
        this.toggleMenu(
          this.menus.inner, 
          [this.menus.innermost]
        );
      });

      // Second level submenu
      $('.second-button').on('click', () => {
        if (this.state.isAnimating) return;
        
        this.toggleMenu(
          this.menus.innermost, 
          []
        );
      });

      // Close all menus
      $('.third-button').on('click', () => {
        if (this.state.isAnimating) return;
        
        this.closeAllMenus();
      });

      // Hover effects with improved handling
      $('.firstMenu').hover(
        () => {
          if (!this.state.isAnimating) {
            this.menus.inner
              .stop(true, true)
              .show(this.animations.show.duration)
              .slideDown(this.animations.show.duration);
          }
        },
        () => {} // Keep open on hover out
      );

      $('.secondMenu').hover(
        () => {
          if (!this.state.isAnimating) {
            this.menus.innermost
              .stop(true, true)
              .show(this.animations.show.duration)
              .slideDown(this.animations.show.duration);
          }
        },
        () => {} // Keep open on hover out
      );

      // Dynamic list item addition with validation
      $('#input-submit').on('click', () => this.addListItem());

      // Keyboard navigation
      $(document).on('keydown', (e) => this.handleKeyboardNavigation(e));
    }

    toggleMenu(menuToShow, menusToHide) {
      this.state.isAnimating = true;

      // Hide other menus first
      menusToHide.forEach(menu => {
        if (menu.is(':visible')) {
          menu.hide(this.animations.hide.duration);
        }
      });

      // Toggle the target menu
      menuToShow.toggle(this.animations.show.duration, () => {
        if (menuToShow.is(':visible')) {
          menuToShow.fadeTo(this.animations.show.duration, 1);
        }
        this.state.isAnimating = false;
      });

      // Update active menus state
      this.updateActiveMenus(menuToShow);
    }

    updateActiveMenus(menu) {
      const menuId = Object.keys(this.menus).find(key => this.menus[key].is(menu));
      
      if (menuId) {
        if (this.state.activeMenus.has(menuId)) {
          this.state.activeMenus.delete(menuId);
        } else {
          this.state.activeMenus.add(menuId);
        }
      }
    }

    closeAllMenus() {
      this.state.isAnimating = true;

      const promises = Object.values(this.menus).map(menu => 
        new Promise(resolve => {
          menu.fadeOut(this.animations.hide.duration, resolve);
        })
      );

      Promise.all(promises).then(() => {
        this.state.isAnimating = false;
        this.state.activeMenus.clear();
      });
    }

    addListItem() {
      const input = $('.input-box');
      const text = input.val().trim();
      
      if (!text) {
        this.showError('Please enter some text');
        return;
      }

      if (this.isDuplicateItem(text)) {
        this.showError('This item already exists');
        return;
      }

      $('.empty').append(
        $('<li>')
          .text(text)
          .hide()
          .fadeIn(this.animations.show.duration)
      );

      input.val('');
      this.hideError();
    }

    isDuplicateItem(text) {
      return $('.empty li').toArray().some(li => 
        $(li).text().toLowerCase() === text.toLowerCase()
      );
    }

    showError(message) {
      $('.error-message')
        .text(message)
        .fadeIn(this.animations.show.duration);
    }

    hideError() {
      $('.error-message').fadeOut(this.animations.hide.duration);
    }

    handleKeyboardNavigation(event) {
      const keyActions = {
        'Escape': () => this.closeAllMenus(),
        'Space': (e) => {
          e.preventDefault();
          if (document.activeElement.classList.contains('menu-button')) {
            document.activeElement.click();
          }
        }
      };

      if (keyActions[event.code]) {
        keyActions[event.code](event);
      }
    }
  }

  // Initialize Navigation
  new NavigationManager();
});