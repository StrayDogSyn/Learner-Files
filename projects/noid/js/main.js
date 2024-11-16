$(() => {
  "use strict";

  //////////////////////
  //* DOM References *//
  //////////////////////

  const $end = document.getElementById('result');
  let count = 0;
  let name = '';
  $('#result').hide(),
  $('#reset').hide(),
  $('#intro').hide(),
  $('#maestro').hide(),
  $('#outro').hide();

  ///////////////////////
  //* Event Listeners *//
  ///////////////////////

  $('#start').on('click', startingLine);
  $('#submitOne').on('click', () => {
    name = $('#first').val();
    if(name.toLowerCase() !== 'your name'){
      runContinue();
    } else {
      smartGuy();
    }
  });
  $('#submitTwo').on('click', () => {
    name = $('#second').val();
    if(name.toLowerCase() !== 'your name'){
      runCarryOn();
    } else {
      smartGuy();
    }
  });
  $('#submitThree').on('click', () => {
    name = $('#third').val();
    if(name.toLowerCase() !== 'your name'){
      runReturn();
    } else {
      smartGuy();
    }
  });


  $('#cancelOne').on('click', soreLoser);
  $('#cancelTwo').on('click', soreLoser);
  $('#cancelThree').on('click', soreLoser);
  $('#reset').on('click', resetPage);

  /////////////////
  //* Functions *//
  /////////////////

  function update(element, content) {
    element.innerHTML = content;
  }

  function startingLine(){
    count++;
    $('#start').hide(), $('#start').removeAttr('autofocus');
    $('#intro').show(), $('#intro').attr('autofocus');

  }
  function runContinue(){
    $('#intro').hide(), $('#intro').removeAttr('autofocus');
    $('#maestro').show(), $('#maestro').attr('autofocus');
    count++;
    if(count >= 5){
      $('#manyFaces').removeClass('fa-grimace').addClass('fa-angry');
    }
  }
  function runCarryOn(){
    $('#maestro').hide(), $('#maestro').removeAttr('autofocus');
    $('#outro').show(), $('#outro').attr('autofocus');
    count++;
    if(count >= 10){
      $('#manyFaces').removeClass('fa-angry').addClass('fa-sad-tear');
    }

    }
  function runReturn(){
    $('#outro').hide(), $('#outro').removeAttr('autofocus');
    $('#intro').show(), $('#intro').attr('autofocus');
    count++;
    if(count >= 15){
      $('#manyFaces').removeClass('fa-sad-tear').addClass('fa-sad-cry');
    }

  }
  function smartGuy() {
    $('#result').show();
    update($end, `You the man! It only took ${count} tries to catch on...`);
    $('#reset').show();
  }

  function soreLoser(){
    $('#result').show();
    update($end, `Ha Ha Ha, I caught mad rec on you ${count} times!!!`);
    $('#reset').show();
  }
  function resetPage(){
      window.location.reload();
  }
});
