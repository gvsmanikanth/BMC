(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * accordion.js
 * Pairs with styling found in modules/_accordion.scss
 *
 * Expects the following markup:
 * 	ul.accordion
 * 		li.accordion-item
 * 			a.accordion-item-anchor
 * 		 	div.accordion-item-content
 */

var Accordion;
// allow use globally

(function($) {

	Accordion = function(accordionContainer) {

		this.itemSelector = '.accordion-item';
		this.$container = $(accordionContainer);
		this.$items = this.$container.find(this.itemSelector);
		this.openedItem = null;
		this.itemToOpen = null;

		this.slideOptions = {
			duration : 400,
			easing : 'easeOut'
		};

		this.addHandlers();
	};

	Accordion.prototype.addHandlers = function() {

		var self = this;

		// handles clicking of item-anchor
		self.$items.find('.accordion-item-anchor').each(function(i, anchor) {

			$(anchor).on('click', function(e) {
				e.preventDefault();
				self.toggleOpen($(anchor).parents(self.itemSelector));
				window.onResizeSetHeight();
				//Added to adjust height of card components on accordion open.
				//window.location.hash = this.href;
				var hashValue = this.href.split("#");
				if (hashValue[1])
					window.location.hash = hashValue[1];
			});
		});

		// handles on load opening anchor
		var hash = window.location.hash.substring(1);
		$(window).on('load', function() {

			if (hash != '') {
				var jumpToElement = self.$container.find('#' + hash);
				var jumpToItem = $(jumpToElement).parent(self.itemSelector);

				

				// if we have an element to jump to, and it has a matching selector for an item
				if (jumpToElement.length > 0 && jumpToItem.length > 0) {
					self.toggleOpen(jumpToItem);
				}
			}
			else{
					var defaultOpen = self.$container.find(".defalut-open");
					var jumpToItemDefault = $(defaultOpen).parent(self.itemSelector);
					if (jumpToItemDefault.length > 0 && jumpToItemDefault.length > 0) {
						self.toggleOpen(jumpToItemDefault);
					}
				}

		});
	};

	Accordion.prototype.toggleOpen = function(item) {

		var self = this;
		self.itemToOpen = item;

		// case to handle if current item is already open
		if ($(self.openedItem).is(item) && item.hasClass('open')) {

			self.closeItem(self.openedItem);
			self.itemToOpen = null;
			self.openedItem = null;
			return self;
		}

		// close existing item
		if ($(self.openedItem).length) {
			self.closeItem(self.openedItem);
		}
		else{
			self.openItem(self.itemToOpen);
		}

		// open new item
		//self.openItem(item);
		

		return self;

	};

	Accordion.prototype.openItem = function(item) {

		var self = this;

		$(item).addClass('open');
		$(item).find('.accordion-item-content').finish().slideDown("normal", function() {
			$('html, body').finish();
			$('html, body').animate({
				scrollTop : $(item).find('.accordion-item-content').offset().top - 200
			 }, 100);
		});
		
		self.openedItem = item;
			
		return this;
	};

	Accordion.prototype.closeItem = function(item) {

		var self = this;

		$(item).removeClass('open');
		$(item).find('.accordion-item-content').finish().slideUp("normal", function() {
			self.openItem(self.itemToOpen);
		});

		// $('html, body').finish();
		// $('html, body').animate({
			// scrollTop : $(item).find('.accordion-item-content').offset().top - 200
		// }, 0);

		return this;
	};

	$(document).ready(function() {

		$('.accordion').each(function(i, accordionContainer) {
			new Accordion(accordionContainer);
		});

	});

})(jQuery); 
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2FjY29yZGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIGFjY29yZGlvbi5qc1xuICogUGFpcnMgd2l0aCBzdHlsaW5nIGZvdW5kIGluIG1vZHVsZXMvX2FjY29yZGlvbi5zY3NzXG4gKlxuICogRXhwZWN0cyB0aGUgZm9sbG93aW5nIG1hcmt1cDpcbiAqIFx0dWwuYWNjb3JkaW9uXG4gKiBcdFx0bGkuYWNjb3JkaW9uLWl0ZW1cbiAqIFx0XHRcdGEuYWNjb3JkaW9uLWl0ZW0tYW5jaG9yXG4gKiBcdFx0IFx0ZGl2LmFjY29yZGlvbi1pdGVtLWNvbnRlbnRcbiAqL1xuXG52YXIgQWNjb3JkaW9uO1xuLy8gYWxsb3cgdXNlIGdsb2JhbGx5XG5cbihmdW5jdGlvbigkKSB7XG5cblx0QWNjb3JkaW9uID0gZnVuY3Rpb24oYWNjb3JkaW9uQ29udGFpbmVyKSB7XG5cblx0XHR0aGlzLml0ZW1TZWxlY3RvciA9ICcuYWNjb3JkaW9uLWl0ZW0nO1xuXHRcdHRoaXMuJGNvbnRhaW5lciA9ICQoYWNjb3JkaW9uQ29udGFpbmVyKTtcblx0XHR0aGlzLiRpdGVtcyA9IHRoaXMuJGNvbnRhaW5lci5maW5kKHRoaXMuaXRlbVNlbGVjdG9yKTtcblx0XHR0aGlzLm9wZW5lZEl0ZW0gPSBudWxsO1xuXHRcdHRoaXMuaXRlbVRvT3BlbiA9IG51bGw7XG5cblx0XHR0aGlzLnNsaWRlT3B0aW9ucyA9IHtcblx0XHRcdGR1cmF0aW9uIDogNDAwLFxuXHRcdFx0ZWFzaW5nIDogJ2Vhc2VPdXQnXG5cdFx0fTtcblxuXHRcdHRoaXMuYWRkSGFuZGxlcnMoKTtcblx0fTtcblxuXHRBY2NvcmRpb24ucHJvdG90eXBlLmFkZEhhbmRsZXJzID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQvLyBoYW5kbGVzIGNsaWNraW5nIG9mIGl0ZW0tYW5jaG9yXG5cdFx0c2VsZi4kaXRlbXMuZmluZCgnLmFjY29yZGlvbi1pdGVtLWFuY2hvcicpLmVhY2goZnVuY3Rpb24oaSwgYW5jaG9yKSB7XG5cblx0XHRcdCQoYW5jaG9yKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0c2VsZi50b2dnbGVPcGVuKCQoYW5jaG9yKS5wYXJlbnRzKHNlbGYuaXRlbVNlbGVjdG9yKSk7XG5cdFx0XHRcdHdpbmRvdy5vblJlc2l6ZVNldEhlaWdodCgpO1xuXHRcdFx0XHQvL0FkZGVkIHRvIGFkanVzdCBoZWlnaHQgb2YgY2FyZCBjb21wb25lbnRzIG9uIGFjY29yZGlvbiBvcGVuLlxuXHRcdFx0XHQvL3dpbmRvdy5sb2NhdGlvbi5oYXNoID0gdGhpcy5ocmVmO1xuXHRcdFx0XHR2YXIgaGFzaFZhbHVlID0gdGhpcy5ocmVmLnNwbGl0KFwiI1wiKTtcblx0XHRcdFx0aWYgKGhhc2hWYWx1ZVsxXSlcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2hWYWx1ZVsxXTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0Ly8gaGFuZGxlcyBvbiBsb2FkIG9wZW5pbmcgYW5jaG9yXG5cdFx0dmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSk7XG5cdFx0JCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdGlmIChoYXNoICE9ICcnKSB7XG5cdFx0XHRcdHZhciBqdW1wVG9FbGVtZW50ID0gc2VsZi4kY29udGFpbmVyLmZpbmQoJyMnICsgaGFzaCk7XG5cdFx0XHRcdHZhciBqdW1wVG9JdGVtID0gJChqdW1wVG9FbGVtZW50KS5wYXJlbnQoc2VsZi5pdGVtU2VsZWN0b3IpO1xuXG5cdFx0XHRcdFxuXG5cdFx0XHRcdC8vIGlmIHdlIGhhdmUgYW4gZWxlbWVudCB0byBqdW1wIHRvLCBhbmQgaXQgaGFzIGEgbWF0Y2hpbmcgc2VsZWN0b3IgZm9yIGFuIGl0ZW1cblx0XHRcdFx0aWYgKGp1bXBUb0VsZW1lbnQubGVuZ3RoID4gMCAmJiBqdW1wVG9JdGVtLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRzZWxmLnRvZ2dsZU9wZW4oanVtcFRvSXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0dmFyIGRlZmF1bHRPcGVuID0gc2VsZi4kY29udGFpbmVyLmZpbmQoXCIuZGVmYWx1dC1vcGVuXCIpO1xuXHRcdFx0XHRcdHZhciBqdW1wVG9JdGVtRGVmYXVsdCA9ICQoZGVmYXVsdE9wZW4pLnBhcmVudChzZWxmLml0ZW1TZWxlY3Rvcik7XG5cdFx0XHRcdFx0aWYgKGp1bXBUb0l0ZW1EZWZhdWx0Lmxlbmd0aCA+IDAgJiYganVtcFRvSXRlbURlZmF1bHQubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0c2VsZi50b2dnbGVPcGVuKGp1bXBUb0l0ZW1EZWZhdWx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdH0pO1xuXHR9O1xuXG5cdEFjY29yZGlvbi5wcm90b3R5cGUudG9nZ2xlT3BlbiA9IGZ1bmN0aW9uKGl0ZW0pIHtcblxuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRzZWxmLml0ZW1Ub09wZW4gPSBpdGVtO1xuXG5cdFx0Ly8gY2FzZSB0byBoYW5kbGUgaWYgY3VycmVudCBpdGVtIGlzIGFscmVhZHkgb3BlblxuXHRcdGlmICgkKHNlbGYub3BlbmVkSXRlbSkuaXMoaXRlbSkgJiYgaXRlbS5oYXNDbGFzcygnb3BlbicpKSB7XG5cblx0XHRcdHNlbGYuY2xvc2VJdGVtKHNlbGYub3BlbmVkSXRlbSk7XG5cdFx0XHRzZWxmLml0ZW1Ub09wZW4gPSBudWxsO1xuXHRcdFx0c2VsZi5vcGVuZWRJdGVtID0gbnVsbDtcblx0XHRcdHJldHVybiBzZWxmO1xuXHRcdH1cblxuXHRcdC8vIGNsb3NlIGV4aXN0aW5nIGl0ZW1cblx0XHRpZiAoJChzZWxmLm9wZW5lZEl0ZW0pLmxlbmd0aCkge1xuXHRcdFx0c2VsZi5jbG9zZUl0ZW0oc2VsZi5vcGVuZWRJdGVtKTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdHNlbGYub3Blbkl0ZW0oc2VsZi5pdGVtVG9PcGVuKTtcblx0XHR9XG5cblx0XHQvLyBvcGVuIG5ldyBpdGVtXG5cdFx0Ly9zZWxmLm9wZW5JdGVtKGl0ZW0pO1xuXHRcdFxuXG5cdFx0cmV0dXJuIHNlbGY7XG5cblx0fTtcblxuXHRBY2NvcmRpb24ucHJvdG90eXBlLm9wZW5JdGVtID0gZnVuY3Rpb24oaXRlbSkge1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0JChpdGVtKS5hZGRDbGFzcygnb3BlbicpO1xuXHRcdCQoaXRlbSkuZmluZCgnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnKS5maW5pc2goKS5zbGlkZURvd24oXCJub3JtYWxcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCdodG1sLCBib2R5JykuZmluaXNoKCk7XG5cdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRcdHNjcm9sbFRvcCA6ICQoaXRlbSkuZmluZCgnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnKS5vZmZzZXQoKS50b3AgLSAyMDBcblx0XHRcdCB9LCAxMDApO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHNlbGYub3BlbmVkSXRlbSA9IGl0ZW07XG5cdFx0XHRcblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRBY2NvcmRpb24ucHJvdG90eXBlLmNsb3NlSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pIHtcblxuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdCQoaXRlbSkucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHQkKGl0ZW0pLmZpbmQoJy5hY2NvcmRpb24taXRlbS1jb250ZW50JykuZmluaXNoKCkuc2xpZGVVcChcIm5vcm1hbFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHNlbGYub3Blbkl0ZW0oc2VsZi5pdGVtVG9PcGVuKTtcblx0XHR9KTtcblxuXHRcdC8vICQoJ2h0bWwsIGJvZHknKS5maW5pc2goKTtcblx0XHQvLyAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHQvLyBzY3JvbGxUb3AgOiAkKGl0ZW0pLmZpbmQoJy5hY2NvcmRpb24taXRlbS1jb250ZW50Jykub2Zmc2V0KCkudG9wIC0gMjAwXG5cdFx0Ly8gfSwgMCk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRcdCQoJy5hY2NvcmRpb24nKS5lYWNoKGZ1bmN0aW9uKGksIGFjY29yZGlvbkNvbnRhaW5lcikge1xuXHRcdFx0bmV3IEFjY29yZGlvbihhY2NvcmRpb25Db250YWluZXIpO1xuXHRcdH0pO1xuXG5cdH0pO1xuXG59KShqUXVlcnkpOyAiXX0=
