SelectionToolJS
===============

Hold down mousebutton and drag to select dom elements.

    $('body').SelectionToolJS({
        lookFor: '.my_item',
        markOn: function(item){
        },
        markOff: function(item){
        },
        markEnd: function(item){
        }
    });
