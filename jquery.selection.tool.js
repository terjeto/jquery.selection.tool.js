(function($) {
	$.fn.SelectionToolJS = function(options){
		var options = $.extend({
			selectClass: false, // BOOLEAN: will use inline css style
			hitRule: 'full', // STR 'full' or 'partial' supported
			cursor: false, // STR (css cursor style)
			lookFor: false, // STR (jquery selector) REQUIRED, jquery selector string
			exclude: false, // STR (classname)
			enableDrag: false, // False or object: {start: function, drag: function, stop: function}
			selectOn: false, // FUNCTION - trigger on each item found during drag
			selectOff: false, // FUNCTION - trigger on each item when off marker
			selectEnd: false, // FUNCTION - triggers after mark operation finishes
			selectStart: false
		}, options);
		var getRelativeMousePos = function(e, self){
			var x = 0;
			var y = 0;
			e = e || window.event;
			if (e.pageX || e.pageY) {
				x = e.pageX;
				y = e.pageY;
			} else if (e.clientX || e.clientY) {
				x = e.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
				y = e.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop;
			}
			x = x - self.offset().left;
			y = y - self.offset().top;
			return {x: x, y: y};
		};
		var hit = function(self, item, dim){
			var l = (parseInt(item.css('left'), 10) || (item.offset().left - self.offset().left)) - self.scrollLeft();
			var t = (parseInt(item.css('top'), 10) || (item.offset().top - self.offset().top))  - self.scrollTop();
			var w = item.outerWidth(), h = item.outerHeight();
			if(options.hitRule=='full'){
				if(l>=dim.left && l+w<=dim.left+dim.width && t>=dim.top && t+h<=dim.top+dim.height){
					return true;
				}
			} else if(options.hitRule=='partial'){
				if(	l<dim.left+dim.width &&
					l+w > dim.left &&
					t < dim.top+dim.height &&
					t+h > dim.top
				) {
					return true;
				}
			}
			return false;
		}
		/*
			TODO
			('destroy'), ('triggerall'), ('enable'), ('disable')
		*/
		return this.each(function(){
			var self = $(this);
			if(!options.lookFor){
				return;
			}
			if(options.cursor){
				self.css({cursor: options.cursor});
			}
			self.draggable({
				helper: function(e){
					self.removeClass('SelectionToolJS_selected');
					var dragger = $('<div />');
					if($(e.target).closest('.SelectionToolJS_selected').length && options.enableDrag){
						dragger.css({width: self.outerWidth(), height: self.outerHeight(), zIndex: 10});
						dragger.data('isDragging', $(e.target).closest('.SelectionToolJS_selected'));
					}
					return dragger;
				},
				start: function(e, ui){
					var m = getRelativeMousePos(e, self);
					if(ui.helper.data('isDragging')){
						// DRAG MODE
						var dragItems = self.find('.SelectionToolJS_selected');
						dragItems.each(function(){
							$(this).css({left: $(this).offset().left - self.offset().left - parseInt($(this).css('margin-left'), 10), top: $(this).offset().top - self.offset().top - parseInt($(this).css('margin-top'), 10)});
						});
						dragItems.css({position: 'absolute'}).appendTo(ui.helper);
						ui.helper.data('isDragging').appendTo(ui.helper);
						var counter = 1;
						dragItems.each(function(){
							//var rnd = 10 - Math.random() * 20;
							if(this != ui.helper.data('isDragging').get(0)){
								$(this).animate({marginLeft: counter*7, marginTop: counter*10, left: parseInt(ui.helper.data('isDragging').css('left'), 10) + parseInt($(this).css('margin-left'), 10), top: parseInt(ui.helper.data('isDragging').css('top'),10) + parseInt($(this).css('margin-top'), 10)});
							}
							counter++;
						});
						if(options.enableDrag.start){
							options.enableDrag.start(e, ui, dragItems);
						}
					} else {
						// SELECT MODE
						ui.helper.marker = $('<div />').css({zIndex: 100, position: 'absolute', left: m.x, top: m.y}).appendTo(self);
						if(options.selectClass){
							ui.helper.marker.addClass(options.selectClass);
						} else {
							ui.helper.marker.css({background: 'rgba(114, 159, 207, .4)'});
						}
						if(options.selectStart){options.selectStart(e, ui.helper.marker);}
					}
				},
				drag: function(e, ui){
					if(ui.helper.data('isDragging')){
						var dragItems = self.find('.SelectionToolJS_selected');
					} else {
						var dim = {width: Math.abs(ui.position.left - self.offset().left), height: Math.abs(ui.position.top - self.offset().top)};
						if(ui.position.left < self.offset().left){
							ui.helper.marker.css({marginLeft: -dim.width});
						} else {
							ui.helper.marker.css({marginLeft: 0});
						}
						if(ui.position.top < self.offset().top){
							ui.helper.marker.css({marginTop: -dim.height});
						} else {
							ui.helper.marker.css({marginTop: 0});
						}
						ui.helper.marker.css({width: dim.width, height: dim.height});
						var dim = {
							left: ui.helper.marker.position().left + parseInt(ui.helper.marker.css('marginLeft'), 10),
							top: ui.helper.marker.position().top + parseInt(ui.helper.marker.css('marginTop'), 10),
							width: ui.helper.marker.width(),
							height: ui.helper.marker.height()
						}
						//console.log($.toJSON(dim));
						$(options.lookFor).each(function(){
							if(!options.exclude || options.exclude && !$(this).hasClass(options.exclude)){
								if(hit(self, $(this), dim)){
									if(!$(this).hasClass('SelectionToolJS_selected')){
										$(this).addClass('SelectionToolJS_selected');
										if(options.selectOn){options.selectOn($(this), ui.helper.marker);}
									}
								} else {
									if($(this).hasClass('SelectionToolJS_selected')){
										$(this).removeClass('SelectionToolJS_selected');
										if(options.selectOff){options.selectOff($(this), ui.helper.marker);}
									}
								}
							}
						});
					}
				},
				stop: function(e, ui){
					if(ui.helper.data('isDragging')){
						var dragItems = self.find('.SelectionToolJS_selected');
						dragItems.stop();
						if(options.enableDrag.stop){
							options.enableDrag.stop(e, ui, dragItems);
						}
					} else {
						ui.helper.marker.remove();
						if(options.selectEnd){options.selectEnd(ui.helper.marker);}
					}
				}
			});
		});
	}
})(jQuery);