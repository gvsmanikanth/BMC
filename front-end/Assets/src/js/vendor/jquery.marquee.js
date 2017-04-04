/**
 * _marquee.js
 * In tandem with _marquee.scss
 * Both are style and js wrappers for the owl carousel jquery library
 *
 */
(function($){

	var marqueeOwl = {

		$rootEl: null,

		init: function(carousel, options) {
			var self = this;

			this.$rootEl = $(carousel);
			if (!this.$rootEl.length) {
				return;
			}

			var owlOptions = this.getMergedOptions(options);

			this.attachHandlers();
			this.$rootEl.owlCarousel(owlOptions);
		},

		getMergedOptions: function() {
			var defaults = {
				animateIn:          'fadeIn',
				animateOut:         'fadeOut',
				autoplay:           true,
				autoplayHoverPause: true,
				autoplayTimeout:    4000,
				autoplaySpeed:      true,
				items:              1,
				loop:               true
			};

			var containerOptions = {
				autoplay:        $(this.$rootEl).data('autoplay'),
				autoplayTimeout: $(this.$rootEl).data('autoplay-timeout'),
				autoplaySpeed:   $(this.$rootEl).data('autoplay-speed'),
				loop:            $(this.$rootEl).data('loop')
			};

			var pageAnimationOptions = {};
			var pageAnimations = this.getPageAnimations();
			if (pageAnimations.length) {
				pageAnimationOptions.pageAnimationDuration = '1s';
				pageAnimationOptions.pageAnimations = pageAnimations;
			}

			var allOptions = [defaults];
			for (var i=0; i < arguments.length; i++) {
				if ($.isPlainObject(arguments[i])) {
					allOptions.push(arguments[i]);
				}
			}

			allOptions.push(containerOptions, pageAnimationOptions);
			return $.extend.apply($, allOptions);
		},

		getPageAnimations: function() {
			var pageAnimations = [];
			$(this.$rootEl).find('.item').each(function(i, item){
				if ($(item).data('animate-in') || $(item).data('animate-out')) {
					pageAnimations[i] = {
						page:       i,
						animateIn:  $(item).data('animate-in'),
						animateOut: $(item).data('animate-out'),
						animateDuration: $(item).data('animate-duration')
					}
				}
			});

			return pageAnimations;
		},

		loadVisibleImages: function() {
			var $visible = $('html').hasClass('oldie') ? this.$rootEl.find('img') : this.$rootEl.find('img:visible');
			$visible.each(function(i, $el) {
				this.actions.swapInDataSrc($el);
			}.bind(this));
		},

		attachHandlers: function() {
			var self = this;
			$(window).on('resize', this.loadVisibleImages.bind(this));
			this.$rootEl.on('initialized.owl.carousel', function(){
				self.loadVisibleImages();
				if (self.$rootEl.hasClass('hidden')) {
					self.$rootEl.addClass('owl-fade-in');
				};
			});
		},

		actions: {
			swapInDataSrc: function(element) {
				$element = $(element);

				if (typeof $element.data('src') !== 'undefined' && !$element.attr('src')) {
					$element.attr('src', $element.data('src'));
				}

				return element;
			}
		}
	};

	// Setup jQuery Plugin hook
	$.fn.marqueeOwl = function() {
		var options = [].slice.call(arguments).pop();
		return this.each( function(i, el){marqueeOwl.init.call(marqueeOwl, el, options)} );
	};

	// Call by default on elements with .marquee
	$(function($){$('.marquee').marqueeOwl()});

}(jQuery));
