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

		$('ul.accordion').each(function(i, accordionContainer) {
			new Accordion(accordionContainer);
		});

	});

})(jQuery);

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2FjY29yZGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogYWNjb3JkaW9uLmpzXG4gKiBQYWlycyB3aXRoIHN0eWxpbmcgZm91bmQgaW4gbW9kdWxlcy9fYWNjb3JkaW9uLnNjc3NcbiAqXG4gKiBFeHBlY3RzIHRoZSBmb2xsb3dpbmcgbWFya3VwOlxuICogXHR1bC5hY2NvcmRpb25cbiAqIFx0XHRsaS5hY2NvcmRpb24taXRlbVxuICogXHRcdFx0YS5hY2NvcmRpb24taXRlbS1hbmNob3JcbiAqIFx0XHQgXHRkaXYuYWNjb3JkaW9uLWl0ZW0tY29udGVudFxuICovXG5cbnZhciBBY2NvcmRpb247XG4vLyBhbGxvdyB1c2UgZ2xvYmFsbHlcblxuKGZ1bmN0aW9uKCQpIHtcblxuXHRBY2NvcmRpb24gPSBmdW5jdGlvbihhY2NvcmRpb25Db250YWluZXIpIHtcblxuXHRcdHRoaXMuaXRlbVNlbGVjdG9yID0gJy5hY2NvcmRpb24taXRlbSc7XG5cdFx0dGhpcy4kY29udGFpbmVyID0gJChhY2NvcmRpb25Db250YWluZXIpO1xuXHRcdHRoaXMuJGl0ZW1zID0gdGhpcy4kY29udGFpbmVyLmZpbmQodGhpcy5pdGVtU2VsZWN0b3IpO1xuXHRcdHRoaXMub3BlbmVkSXRlbSA9IG51bGw7XG5cdFx0dGhpcy5pdGVtVG9PcGVuID0gbnVsbDtcblxuXHRcdHRoaXMuc2xpZGVPcHRpb25zID0ge1xuXHRcdFx0ZHVyYXRpb24gOiA0MDAsXG5cdFx0XHRlYXNpbmcgOiAnZWFzZU91dCdcblx0XHR9O1xuXG5cdFx0dGhpcy5hZGRIYW5kbGVycygpO1xuXHR9O1xuXG5cdEFjY29yZGlvbi5wcm90b3R5cGUuYWRkSGFuZGxlcnMgPSBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdC8vIGhhbmRsZXMgY2xpY2tpbmcgb2YgaXRlbS1hbmNob3Jcblx0XHRzZWxmLiRpdGVtcy5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tYW5jaG9yJykuZWFjaChmdW5jdGlvbihpLCBhbmNob3IpIHtcblxuXHRcdFx0JChhbmNob3IpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRzZWxmLnRvZ2dsZU9wZW4oJChhbmNob3IpLnBhcmVudHMoc2VsZi5pdGVtU2VsZWN0b3IpKTtcblx0XHRcdFx0d2luZG93Lm9uUmVzaXplU2V0SGVpZ2h0KCk7XG5cdFx0XHRcdC8vQWRkZWQgdG8gYWRqdXN0IGhlaWdodCBvZiBjYXJkIGNvbXBvbmVudHMgb24gYWNjb3JkaW9uIG9wZW4uXG5cdFx0XHRcdC8vd2luZG93LmxvY2F0aW9uLmhhc2ggPSB0aGlzLmhyZWY7XG5cdFx0XHRcdHZhciBoYXNoVmFsdWUgPSB0aGlzLmhyZWYuc3BsaXQoXCIjXCIpO1xuXHRcdFx0XHRpZiAoaGFzaFZhbHVlWzFdKVxuXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaGFzaFZhbHVlWzFdO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvLyBoYW5kbGVzIG9uIGxvYWQgb3BlbmluZyBhbmNob3Jcblx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKTtcblx0XHQkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKGhhc2ggIT0gJycpIHtcblx0XHRcdFx0dmFyIGp1bXBUb0VsZW1lbnQgPSBzZWxmLiRjb250YWluZXIuZmluZCgnIycgKyBoYXNoKTtcblx0XHRcdFx0dmFyIGp1bXBUb0l0ZW0gPSAkKGp1bXBUb0VsZW1lbnQpLnBhcmVudChzZWxmLml0ZW1TZWxlY3Rvcik7XG5cblxuXG5cdFx0XHRcdC8vIGlmIHdlIGhhdmUgYW4gZWxlbWVudCB0byBqdW1wIHRvLCBhbmQgaXQgaGFzIGEgbWF0Y2hpbmcgc2VsZWN0b3IgZm9yIGFuIGl0ZW1cblx0XHRcdFx0aWYgKGp1bXBUb0VsZW1lbnQubGVuZ3RoID4gMCAmJiBqdW1wVG9JdGVtLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRzZWxmLnRvZ2dsZU9wZW4oanVtcFRvSXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0dmFyIGRlZmF1bHRPcGVuID0gc2VsZi4kY29udGFpbmVyLmZpbmQoXCIuZGVmYWx1dC1vcGVuXCIpO1xuXHRcdFx0XHRcdHZhciBqdW1wVG9JdGVtRGVmYXVsdCA9ICQoZGVmYXVsdE9wZW4pLnBhcmVudChzZWxmLml0ZW1TZWxlY3Rvcik7XG5cdFx0XHRcdFx0aWYgKGp1bXBUb0l0ZW1EZWZhdWx0Lmxlbmd0aCA+IDAgJiYganVtcFRvSXRlbURlZmF1bHQubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0c2VsZi50b2dnbGVPcGVuKGp1bXBUb0l0ZW1EZWZhdWx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdH0pO1xuXHR9O1xuXG5cdEFjY29yZGlvbi5wcm90b3R5cGUudG9nZ2xlT3BlbiA9IGZ1bmN0aW9uKGl0ZW0pIHtcblxuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRzZWxmLml0ZW1Ub09wZW4gPSBpdGVtO1xuXG5cdFx0Ly8gY2FzZSB0byBoYW5kbGUgaWYgY3VycmVudCBpdGVtIGlzIGFscmVhZHkgb3BlblxuXHRcdGlmICgkKHNlbGYub3BlbmVkSXRlbSkuaXMoaXRlbSkgJiYgaXRlbS5oYXNDbGFzcygnb3BlbicpKSB7XG5cblx0XHRcdHNlbGYuY2xvc2VJdGVtKHNlbGYub3BlbmVkSXRlbSk7XG5cdFx0XHRzZWxmLml0ZW1Ub09wZW4gPSBudWxsO1xuXHRcdFx0c2VsZi5vcGVuZWRJdGVtID0gbnVsbDtcblx0XHRcdHJldHVybiBzZWxmO1xuXHRcdH1cblxuXHRcdC8vIGNsb3NlIGV4aXN0aW5nIGl0ZW1cblx0XHRpZiAoJChzZWxmLm9wZW5lZEl0ZW0pLmxlbmd0aCkge1xuXHRcdFx0c2VsZi5jbG9zZUl0ZW0oc2VsZi5vcGVuZWRJdGVtKTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdHNlbGYub3Blbkl0ZW0oc2VsZi5pdGVtVG9PcGVuKTtcblx0XHR9XG5cblx0XHQvLyBvcGVuIG5ldyBpdGVtXG5cdFx0Ly9zZWxmLm9wZW5JdGVtKGl0ZW0pO1xuXG5cblx0XHRyZXR1cm4gc2VsZjtcblxuXHR9O1xuXG5cdEFjY29yZGlvbi5wcm90b3R5cGUub3Blbkl0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XG5cblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQkKGl0ZW0pLmFkZENsYXNzKCdvcGVuJyk7XG5cdFx0JChpdGVtKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLmZpbmlzaCgpLnNsaWRlRG93bihcIm5vcm1hbFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdCQoJ2h0bWwsIGJvZHknKS5maW5pc2goKTtcblx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcblx0XHRcdFx0c2Nyb2xsVG9wIDogJChpdGVtKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLm9mZnNldCgpLnRvcCAtIDIwMFxuXHRcdFx0IH0sIDEwMCk7XG5cdFx0fSk7XG5cblx0XHRzZWxmLm9wZW5lZEl0ZW0gPSBpdGVtO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0QWNjb3JkaW9uLnByb3RvdHlwZS5jbG9zZUl0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XG5cblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQkKGl0ZW0pLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cdFx0JChpdGVtKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLmZpbmlzaCgpLnNsaWRlVXAoXCJub3JtYWxcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRzZWxmLm9wZW5JdGVtKHNlbGYuaXRlbVRvT3Blbik7XG5cdFx0fSk7XG5cblx0XHQvLyAkKCdodG1sLCBib2R5JykuZmluaXNoKCk7XG5cdFx0Ly8gJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0Ly8gc2Nyb2xsVG9wIDogJChpdGVtKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLm9mZnNldCgpLnRvcCAtIDIwMFxuXHRcdC8vIH0sIDApO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblx0XHQkKCd1bC5hY2NvcmRpb24nKS5lYWNoKGZ1bmN0aW9uKGksIGFjY29yZGlvbkNvbnRhaW5lcikge1xuXHRcdFx0bmV3IEFjY29yZGlvbihhY2NvcmRpb25Db250YWluZXIpO1xuXHRcdH0pO1xuXG5cdH0pO1xuXG59KShqUXVlcnkpO1xuIl19
