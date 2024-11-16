$(() => {
    "use strict";
    $('form').on('submit', (evt) => {
        evt.preventDefault();
        let item = $('input').val();
        $(`<li>${item} <button class="delete">Delete</button></li>`).appendTo('.list');
        $('.delete').on('click', deleteItem);
        $('input').val('');
    });


    function deleteItem(evt) {
        let parent = evt.target.parentNode;
        $(parent).remove();
    }

});