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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2FjY29yZGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBhY2NvcmRpb24uanNcclxuICogUGFpcnMgd2l0aCBzdHlsaW5nIGZvdW5kIGluIG1vZHVsZXMvX2FjY29yZGlvbi5zY3NzXHJcbiAqXHJcbiAqIEV4cGVjdHMgdGhlIGZvbGxvd2luZyBtYXJrdXA6XHJcbiAqIFx0dWwuYWNjb3JkaW9uXHJcbiAqIFx0XHRsaS5hY2NvcmRpb24taXRlbVxyXG4gKiBcdFx0XHRhLmFjY29yZGlvbi1pdGVtLWFuY2hvclxyXG4gKiBcdFx0IFx0ZGl2LmFjY29yZGlvbi1pdGVtLWNvbnRlbnRcclxuICovXHJcblxyXG52YXIgQWNjb3JkaW9uO1xyXG4vLyBhbGxvdyB1c2UgZ2xvYmFsbHlcclxuXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdEFjY29yZGlvbiA9IGZ1bmN0aW9uKGFjY29yZGlvbkNvbnRhaW5lcikge1xyXG5cclxuXHRcdHRoaXMuaXRlbVNlbGVjdG9yID0gJy5hY2NvcmRpb24taXRlbSc7XHJcblx0XHR0aGlzLiRjb250YWluZXIgPSAkKGFjY29yZGlvbkNvbnRhaW5lcik7XHJcblx0XHR0aGlzLiRpdGVtcyA9IHRoaXMuJGNvbnRhaW5lci5maW5kKHRoaXMuaXRlbVNlbGVjdG9yKTtcclxuXHRcdHRoaXMub3BlbmVkSXRlbSA9IG51bGw7XHJcblx0XHR0aGlzLml0ZW1Ub09wZW4gPSBudWxsO1xyXG5cclxuXHRcdHRoaXMuc2xpZGVPcHRpb25zID0ge1xyXG5cdFx0XHRkdXJhdGlvbiA6IDQwMCxcclxuXHRcdFx0ZWFzaW5nIDogJ2Vhc2VPdXQnXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuYWRkSGFuZGxlcnMoKTtcclxuXHR9O1xyXG5cclxuXHRBY2NvcmRpb24ucHJvdG90eXBlLmFkZEhhbmRsZXJzID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdC8vIGhhbmRsZXMgY2xpY2tpbmcgb2YgaXRlbS1hbmNob3JcclxuXHRcdHNlbGYuJGl0ZW1zLmZpbmQoJy5hY2NvcmRpb24taXRlbS1hbmNob3InKS5lYWNoKGZ1bmN0aW9uKGksIGFuY2hvcikge1xyXG5cclxuXHRcdFx0JChhbmNob3IpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0c2VsZi50b2dnbGVPcGVuKCQoYW5jaG9yKS5wYXJlbnRzKHNlbGYuaXRlbVNlbGVjdG9yKSk7XHJcblx0XHRcdFx0d2luZG93Lm9uUmVzaXplU2V0SGVpZ2h0KCk7XHJcblx0XHRcdFx0Ly9BZGRlZCB0byBhZGp1c3QgaGVpZ2h0IG9mIGNhcmQgY29tcG9uZW50cyBvbiBhY2NvcmRpb24gb3Blbi5cclxuXHRcdFx0XHQvL3dpbmRvdy5sb2NhdGlvbi5oYXNoID0gdGhpcy5ocmVmO1xyXG5cdFx0XHRcdHZhciBoYXNoVmFsdWUgPSB0aGlzLmhyZWYuc3BsaXQoXCIjXCIpO1xyXG5cdFx0XHRcdGlmIChoYXNoVmFsdWVbMV0pXHJcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2hWYWx1ZVsxXTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBoYW5kbGVzIG9uIGxvYWQgb3BlbmluZyBhbmNob3JcclxuXHRcdHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xyXG5cdFx0JCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRpZiAoaGFzaCAhPSAnJykge1xyXG5cdFx0XHRcdHZhciBqdW1wVG9FbGVtZW50ID0gc2VsZi4kY29udGFpbmVyLmZpbmQoJyMnICsgaGFzaCk7XHJcblx0XHRcdFx0dmFyIGp1bXBUb0l0ZW0gPSAkKGp1bXBUb0VsZW1lbnQpLnBhcmVudChzZWxmLml0ZW1TZWxlY3Rvcik7XHJcblxyXG5cclxuXHJcblx0XHRcdFx0Ly8gaWYgd2UgaGF2ZSBhbiBlbGVtZW50IHRvIGp1bXAgdG8sIGFuZCBpdCBoYXMgYSBtYXRjaGluZyBzZWxlY3RvciBmb3IgYW4gaXRlbVxyXG5cdFx0XHRcdGlmIChqdW1wVG9FbGVtZW50Lmxlbmd0aCA+IDAgJiYganVtcFRvSXRlbS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRzZWxmLnRvZ2dsZU9wZW4oanVtcFRvSXRlbSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2V7XHJcblx0XHRcdFx0XHR2YXIgZGVmYXVsdE9wZW4gPSBzZWxmLiRjb250YWluZXIuZmluZChcIi5kZWZhbHV0LW9wZW5cIik7XHJcblx0XHRcdFx0XHR2YXIganVtcFRvSXRlbURlZmF1bHQgPSAkKGRlZmF1bHRPcGVuKS5wYXJlbnQoc2VsZi5pdGVtU2VsZWN0b3IpO1xyXG5cdFx0XHRcdFx0aWYgKGp1bXBUb0l0ZW1EZWZhdWx0Lmxlbmd0aCA+IDAgJiYganVtcFRvSXRlbURlZmF1bHQubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRzZWxmLnRvZ2dsZU9wZW4oanVtcFRvSXRlbURlZmF1bHQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRBY2NvcmRpb24ucHJvdG90eXBlLnRvZ2dsZU9wZW4gPSBmdW5jdGlvbihpdGVtKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0c2VsZi5pdGVtVG9PcGVuID0gaXRlbTtcclxuXHJcblx0XHQvLyBjYXNlIHRvIGhhbmRsZSBpZiBjdXJyZW50IGl0ZW0gaXMgYWxyZWFkeSBvcGVuXHJcblx0XHRpZiAoJChzZWxmLm9wZW5lZEl0ZW0pLmlzKGl0ZW0pICYmIGl0ZW0uaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG5cclxuXHRcdFx0c2VsZi5jbG9zZUl0ZW0oc2VsZi5vcGVuZWRJdGVtKTtcclxuXHRcdFx0c2VsZi5pdGVtVG9PcGVuID0gbnVsbDtcclxuXHRcdFx0c2VsZi5vcGVuZWRJdGVtID0gbnVsbDtcclxuXHRcdFx0cmV0dXJuIHNlbGY7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2xvc2UgZXhpc3RpbmcgaXRlbVxyXG5cdFx0aWYgKCQoc2VsZi5vcGVuZWRJdGVtKS5sZW5ndGgpIHtcclxuXHRcdFx0c2VsZi5jbG9zZUl0ZW0oc2VsZi5vcGVuZWRJdGVtKTtcclxuXHRcdH1cclxuXHRcdGVsc2V7XHJcblx0XHRcdHNlbGYub3Blbkl0ZW0oc2VsZi5pdGVtVG9PcGVuKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBvcGVuIG5ldyBpdGVtXHJcblx0XHQvL3NlbGYub3Blbkl0ZW0oaXRlbSk7XHJcblxyXG5cclxuXHRcdHJldHVybiBzZWxmO1xyXG5cclxuXHR9O1xyXG5cclxuXHRBY2NvcmRpb24ucHJvdG90eXBlLm9wZW5JdGVtID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHQkKGl0ZW0pLmFkZENsYXNzKCdvcGVuJyk7XHJcblx0XHQkKGl0ZW0pLmZpbmQoJy5hY2NvcmRpb24taXRlbS1jb250ZW50JykuZmluaXNoKCkuc2xpZGVEb3duKFwibm9ybWFsXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCdodG1sLCBib2R5JykuZmluaXNoKCk7XHJcblx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuXHRcdFx0XHRzY3JvbGxUb3AgOiAkKGl0ZW0pLmZpbmQoJy5hY2NvcmRpb24taXRlbS1jb250ZW50Jykub2Zmc2V0KCkudG9wIC0gMjAwXHJcblx0XHRcdCB9LCAxMDApO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5vcGVuZWRJdGVtID0gaXRlbTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cclxuXHRBY2NvcmRpb24ucHJvdG90eXBlLmNsb3NlSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0JChpdGVtKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0JChpdGVtKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLmZpbmlzaCgpLnNsaWRlVXAoXCJub3JtYWxcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYub3Blbkl0ZW0oc2VsZi5pdGVtVG9PcGVuKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vICQoJ2h0bWwsIGJvZHknKS5maW5pc2goKTtcclxuXHRcdC8vICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuXHRcdFx0Ly8gc2Nyb2xsVG9wIDogJChpdGVtKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLm9mZnNldCgpLnRvcCAtIDIwMFxyXG5cdFx0Ly8gfSwgMCk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHJcblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0JCgndWwuYWNjb3JkaW9uJykuZWFjaChmdW5jdGlvbihpLCBhY2NvcmRpb25Db250YWluZXIpIHtcclxuXHRcdFx0bmV3IEFjY29yZGlvbihhY2NvcmRpb25Db250YWluZXIpO1xyXG5cdFx0fSk7XHJcblxyXG5cdH0pO1xyXG5cclxufSkoalF1ZXJ5KTtcclxuIl19
