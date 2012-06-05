SelectionToolJS
===============

Hold down mousebutton and drag to select dom items
"""
$('body').SelectionToolJS({
  		lookFor: '.my_item',
			markOn: function(item){
				item.addClass('bounce animated');
			},
			markOff: function(item){
				item.removeClass('bounce animated');
			},
			markEnd: function(item){
				item.removeClass('bounce animated');
			}
});
"""