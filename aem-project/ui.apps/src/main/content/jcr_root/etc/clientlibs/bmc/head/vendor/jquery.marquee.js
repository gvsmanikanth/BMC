(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5Lm1hcnF1ZWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIF9tYXJxdWVlLmpzXG4gKiBJbiB0YW5kZW0gd2l0aCBfbWFycXVlZS5zY3NzXG4gKiBCb3RoIGFyZSBzdHlsZSBhbmQganMgd3JhcHBlcnMgZm9yIHRoZSBvd2wgY2Fyb3VzZWwganF1ZXJ5IGxpYnJhcnlcbiAqXG4gKi9cbihmdW5jdGlvbigkKXtcblxuXHR2YXIgbWFycXVlZU93bCA9IHtcblxuXHRcdCRyb290RWw6IG51bGwsXG5cblx0XHRpbml0OiBmdW5jdGlvbihjYXJvdXNlbCwgb3B0aW9ucykge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHR0aGlzLiRyb290RWwgPSAkKGNhcm91c2VsKTtcblx0XHRcdGlmICghdGhpcy4kcm9vdEVsLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHZhciBvd2xPcHRpb25zID0gdGhpcy5nZXRNZXJnZWRPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFx0XHR0aGlzLmF0dGFjaEhhbmRsZXJzKCk7XG5cdFx0XHR0aGlzLiRyb290RWwub3dsQ2Fyb3VzZWwob3dsT3B0aW9ucyk7XG5cdFx0fSxcblxuXHRcdGdldE1lcmdlZE9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdFx0XHRhbmltYXRlSW46ICAgICAgICAgICdmYWRlSW4nLFxuXHRcdFx0XHRhbmltYXRlT3V0OiAgICAgICAgICdmYWRlT3V0Jyxcblx0XHRcdFx0YXV0b3BsYXk6ICAgICAgICAgICB0cnVlLFxuXHRcdFx0XHRhdXRvcGxheUhvdmVyUGF1c2U6IHRydWUsXG5cdFx0XHRcdGF1dG9wbGF5VGltZW91dDogICAgNDAwMCxcblx0XHRcdFx0YXV0b3BsYXlTcGVlZDogICAgICB0cnVlLFxuXHRcdFx0XHRpdGVtczogICAgICAgICAgICAgIDEsXG5cdFx0XHRcdGxvb3A6ICAgICAgICAgICAgICAgdHJ1ZVxuXHRcdFx0fTtcblxuXHRcdFx0dmFyIGNvbnRhaW5lck9wdGlvbnMgPSB7XG5cdFx0XHRcdGF1dG9wbGF5OiAgICAgICAgJCh0aGlzLiRyb290RWwpLmRhdGEoJ2F1dG9wbGF5JyksXG5cdFx0XHRcdGF1dG9wbGF5VGltZW91dDogJCh0aGlzLiRyb290RWwpLmRhdGEoJ2F1dG9wbGF5LXRpbWVvdXQnKSxcblx0XHRcdFx0YXV0b3BsYXlTcGVlZDogICAkKHRoaXMuJHJvb3RFbCkuZGF0YSgnYXV0b3BsYXktc3BlZWQnKSxcblx0XHRcdFx0bG9vcDogICAgICAgICAgICAkKHRoaXMuJHJvb3RFbCkuZGF0YSgnbG9vcCcpXG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgcGFnZUFuaW1hdGlvbk9wdGlvbnMgPSB7fTtcblx0XHRcdHZhciBwYWdlQW5pbWF0aW9ucyA9IHRoaXMuZ2V0UGFnZUFuaW1hdGlvbnMoKTtcblx0XHRcdGlmIChwYWdlQW5pbWF0aW9ucy5sZW5ndGgpIHtcblx0XHRcdFx0cGFnZUFuaW1hdGlvbk9wdGlvbnMucGFnZUFuaW1hdGlvbkR1cmF0aW9uID0gJzFzJztcblx0XHRcdFx0cGFnZUFuaW1hdGlvbk9wdGlvbnMucGFnZUFuaW1hdGlvbnMgPSBwYWdlQW5pbWF0aW9ucztcblx0XHRcdH1cblxuXHRcdFx0dmFyIGFsbE9wdGlvbnMgPSBbZGVmYXVsdHNdO1xuXHRcdFx0Zm9yICh2YXIgaT0wOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmICgkLmlzUGxhaW5PYmplY3QoYXJndW1lbnRzW2ldKSkge1xuXHRcdFx0XHRcdGFsbE9wdGlvbnMucHVzaChhcmd1bWVudHNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGFsbE9wdGlvbnMucHVzaChjb250YWluZXJPcHRpb25zLCBwYWdlQW5pbWF0aW9uT3B0aW9ucyk7XG5cdFx0XHRyZXR1cm4gJC5leHRlbmQuYXBwbHkoJCwgYWxsT3B0aW9ucyk7XG5cdFx0fSxcblxuXHRcdGdldFBhZ2VBbmltYXRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBwYWdlQW5pbWF0aW9ucyA9IFtdO1xuXHRcdFx0JCh0aGlzLiRyb290RWwpLmZpbmQoJy5pdGVtJykuZWFjaChmdW5jdGlvbihpLCBpdGVtKXtcblx0XHRcdFx0aWYgKCQoaXRlbSkuZGF0YSgnYW5pbWF0ZS1pbicpIHx8ICQoaXRlbSkuZGF0YSgnYW5pbWF0ZS1vdXQnKSkge1xuXHRcdFx0XHRcdHBhZ2VBbmltYXRpb25zW2ldID0ge1xuXHRcdFx0XHRcdFx0cGFnZTogICAgICAgaSxcblx0XHRcdFx0XHRcdGFuaW1hdGVJbjogICQoaXRlbSkuZGF0YSgnYW5pbWF0ZS1pbicpLFxuXHRcdFx0XHRcdFx0YW5pbWF0ZU91dDogJChpdGVtKS5kYXRhKCdhbmltYXRlLW91dCcpLFxuXHRcdFx0XHRcdFx0YW5pbWF0ZUR1cmF0aW9uOiAkKGl0ZW0pLmRhdGEoJ2FuaW1hdGUtZHVyYXRpb24nKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBwYWdlQW5pbWF0aW9ucztcblx0XHR9LFxuXG5cdFx0bG9hZFZpc2libGVJbWFnZXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR2aXNpYmxlID0gJCgnaHRtbCcpLmhhc0NsYXNzKCdvbGRpZScpID8gdGhpcy4kcm9vdEVsLmZpbmQoJ2ltZycpIDogdGhpcy4kcm9vdEVsLmZpbmQoJ2ltZzp2aXNpYmxlJyk7XG5cdFx0XHQkdmlzaWJsZS5lYWNoKGZ1bmN0aW9uKGksICRlbCkge1xuXHRcdFx0XHR0aGlzLmFjdGlvbnMuc3dhcEluRGF0YVNyYygkZWwpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR9LFxuXG5cdFx0YXR0YWNoSGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCB0aGlzLmxvYWRWaXNpYmxlSW1hZ2VzLmJpbmQodGhpcykpO1xuXHRcdFx0dGhpcy4kcm9vdEVsLm9uKCdpbml0aWFsaXplZC5vd2wuY2Fyb3VzZWwnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRzZWxmLmxvYWRWaXNpYmxlSW1hZ2VzKCk7XG5cdFx0XHRcdGlmIChzZWxmLiRyb290RWwuaGFzQ2xhc3MoJ2hpZGRlbicpKSB7XG5cdFx0XHRcdFx0c2VsZi4kcm9vdEVsLmFkZENsYXNzKCdvd2wtZmFkZS1pbicpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdGFjdGlvbnM6IHtcblx0XHRcdHN3YXBJbkRhdGFTcmM6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRcdFx0JGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgJGVsZW1lbnQuZGF0YSgnc3JjJykgIT09ICd1bmRlZmluZWQnICYmICEkZWxlbWVudC5hdHRyKCdzcmMnKSkge1xuXHRcdFx0XHRcdCRlbGVtZW50LmF0dHIoJ3NyYycsICRlbGVtZW50LmRhdGEoJ3NyYycpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBlbGVtZW50O1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBTZXR1cCBqUXVlcnkgUGx1Z2luIGhvb2tcblx0JC5mbi5tYXJxdWVlT3dsID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykucG9wKCk7XG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oaSwgZWwpe21hcnF1ZWVPd2wuaW5pdC5jYWxsKG1hcnF1ZWVPd2wsIGVsLCBvcHRpb25zKX0gKTtcblx0fTtcblxuXHQvLyBDYWxsIGJ5IGRlZmF1bHQgb24gZWxlbWVudHMgd2l0aCAubWFycXVlZVxuXHQkKGZ1bmN0aW9uKCQpeyQoJy5tYXJxdWVlJykubWFycXVlZU93bCgpfSk7XG5cbn0oalF1ZXJ5KSk7XG4iXX0=
