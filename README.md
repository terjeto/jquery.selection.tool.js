jquery selection tool
Developed by Terje at www.symphonical.com

For demo see: http://jsfiddle.net/terjeto/jW2Cv/embedded/result/

=====================

Hold down mousebutton and drag to select dom elements.

    $('.demo1').disableSelection().SelectionToolJS({
        lookFor: '.demo1_item',
    	hitRule: 'partial',
    	selectClass: 'marker',
    	cursor: 'crosshair',
    	selectStart: function(e){
    		log($('.demo1'), 'Start', true);
    	},
    	selectOn: function(item, ui){
    		item.addClass('selected');
    		log($('.demo1'), 'Selected');
    	},
    	selectOff: function(item, ui){
    		item.removeClass('selected');
    		log($('.demo1'), 'Deselected');
    	},
    	selectEnd: function(ui){
    		log($('.demo1'), 'End');
    	},
    	enableDrag: {
    		start: function(e, ui, dragItems){
    			log($('.demo1'), 'Start drag', true);
    			dragItems.addClass('demo1_is_dragging');
    		},
    		drag: function(e, ui){
    		},
    		stop: function(e, ui, dragItems){
    			$('.demo1_item').removeClass('demo1_is_dragging');
    			$('.demo1_item').stop().css({left: '', top: '', margin: '10px 5px', position: 'relative'}).appendTo('.demo1_item_container');
    			log($('.demo1'), 'End drag');
    		}
    	}
    });
