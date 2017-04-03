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