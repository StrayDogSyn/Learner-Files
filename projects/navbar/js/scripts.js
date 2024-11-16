// Default Page settings
$(() => {
  $('.navbar-main').hide();
  $('.inner-nav').hide();
  $('.innermost-nav').hide();

  // Event Listeners for buttons

  $('#dropdownMenu').on('click', () => {
    $('.navbar-main').toggle('fast').fadeTo('fast');
    $('.inner-nav').hide('fast');
    $('.innermost-nav').hide('fast');
  });

  $('.menu-button').on('click', () => {
    $('.inner-nav').toggle('fast').fadeTo('fast');
    $('.innermost-nav').hide('fast');
  });

  $('.second-button').on('click', () => {
    $('.innermost-nav').toggle('fast').fadeTo('fast');
  });

  $('.third-button').on('click', () => {
    $('.navbar-main').hide('fast').fadeTo('fast');
    $('.inner-nav').hide('fast').fadeTo('fast');
    $('.innermost-nav').hide('fast').fadeTo('fast');
  });

  // hover/toggle effect for 1st submenu

  $('.firstMenu').hover(() => {
    $('.inner-nav').show('fast')
      .slideDown('slow');
  });

  // hover/toggle effect for 2nd submenu

  $('.secondMenu').hover(() => {
    $('.innermost-nav').show('fast')
      .slideDown('slow');
  });

  $('.secondMenu').click(() => {
    $('.innermost-nav').toggle('fast');
  });

  $('.thirdmenu').click(() => {
    $('.innermost-nav').toggle('fast');
  })
  // adds item added from input to dropdown menu

  $('#input-submit').click(function () {
    let userText = $('.input-box').val();
    // appends the text to the bottom of the list
    $('.empty').append("<li>" + userText + "</li>");
    // clears the input box
    $('.input-box').val('');
  });
  // end ready
});