SelectionToolJS
===============

Hold down mousebutton and drag to select dom items

    $('body').SelectionToolJS({
        lookFor: '.my_item',
        markOn: function(item){
        },
        markOff: function(item){
        },
        markEnd: function(item){
        }
    });
