$(() => {
  'use strict';

  class NavigationManager {
    constructor() {
      this.menus = {
        main: $('.navbar-main'),
        inner: $('.inner-nav'),
        innermost: $('.innermost-nav')
      };
      
      this.init();
      this.attachEventListeners();
    }

    init() {
      Object.values(this.menus).forEach(menu => menu.hide());
    }

    toggleMenu(menuToShow, menusToHide) {
      menusToHide.forEach(menu => menu.hide('fast'));
      menuToShow.toggle('fast').fadeTo('fast', 1);
    }

    attachEventListeners() {
      // Main dropdown menu
      $('#dropdownMenu').on('click', () => {
        this.toggleMenu(
          this.menus.main, 
          [this.menus.inner, this.menus.innermost]
        );
      });

      // First level submenu
      $('.menu-button').on('click', () => {
        this.toggleMenu(
          this.menus.inner, 
          [this.menus.innermost]
        );
      });

      // Second level submenu
      $('.second-button').on('click', () => {
        this.toggleMenu(
          this.menus.innermost, 
          []
        );
      });

      // Close all menus
      $('.third-button').on('click', () => {
        Object.values(this.menus).forEach(menu => 
          menu.hide('fast').fadeTo('fast', 0)
        );
      });

      // Hover effects
      $('.firstMenu').hover(
        () => this.menus.inner.show('fast').slideDown('slow'),
        () => {} // Keep open on hover out
      );

      $('.secondMenu').hover(
        () => this.menus.innermost.show('fast').slideDown('slow'),
        () => {} // Keep open on hover out
      );

      // Toggle effects for second submenu
      $('.secondMenu, .thirdmenu').on('click', () => {
        this.menus.innermost.toggle('fast');
      });

      // Dynamic list item addition
      $('#input-submit').on('click', () => {
        const input = $('.input-box');
        const text = input.val().trim();
        
        if (text) {
          $('.empty').append(`<li>${text}</li>`);
          input.val('');
        }
      });
    }
  }

  // Initialize Navigation
  new NavigationManager();
});