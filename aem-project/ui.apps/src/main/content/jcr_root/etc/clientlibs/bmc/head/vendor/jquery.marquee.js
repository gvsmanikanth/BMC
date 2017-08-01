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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5Lm1hcnF1ZWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogX21hcnF1ZWUuanNcclxuICogSW4gdGFuZGVtIHdpdGggX21hcnF1ZWUuc2Nzc1xyXG4gKiBCb3RoIGFyZSBzdHlsZSBhbmQganMgd3JhcHBlcnMgZm9yIHRoZSBvd2wgY2Fyb3VzZWwganF1ZXJ5IGxpYnJhcnlcclxuICpcclxuICovXHJcbihmdW5jdGlvbigkKXtcclxuXHJcblx0dmFyIG1hcnF1ZWVPd2wgPSB7XHJcblxyXG5cdFx0JHJvb3RFbDogbnVsbCxcclxuXHJcblx0XHRpbml0OiBmdW5jdGlvbihjYXJvdXNlbCwgb3B0aW9ucykge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHR0aGlzLiRyb290RWwgPSAkKGNhcm91c2VsKTtcclxuXHRcdFx0aWYgKCF0aGlzLiRyb290RWwubGVuZ3RoKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgb3dsT3B0aW9ucyA9IHRoaXMuZ2V0TWVyZ2VkT3B0aW9ucyhvcHRpb25zKTtcclxuXHJcblx0XHRcdHRoaXMuYXR0YWNoSGFuZGxlcnMoKTtcclxuXHRcdFx0dGhpcy4kcm9vdEVsLm93bENhcm91c2VsKG93bE9wdGlvbnMpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRNZXJnZWRPcHRpb25zOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGRlZmF1bHRzID0ge1xyXG5cdFx0XHRcdGFuaW1hdGVJbjogICAgICAgICAgJ2ZhZGVJbicsXHJcblx0XHRcdFx0YW5pbWF0ZU91dDogICAgICAgICAnZmFkZU91dCcsXHJcblx0XHRcdFx0YXV0b3BsYXk6ICAgICAgICAgICB0cnVlLFxyXG5cdFx0XHRcdGF1dG9wbGF5SG92ZXJQYXVzZTogdHJ1ZSxcclxuXHRcdFx0XHRhdXRvcGxheVRpbWVvdXQ6ICAgIDQwMDAsXHJcblx0XHRcdFx0YXV0b3BsYXlTcGVlZDogICAgICB0cnVlLFxyXG5cdFx0XHRcdGl0ZW1zOiAgICAgICAgICAgICAgMSxcclxuXHRcdFx0XHRsb29wOiAgICAgICAgICAgICAgIHRydWVcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHZhciBjb250YWluZXJPcHRpb25zID0ge1xyXG5cdFx0XHRcdGF1dG9wbGF5OiAgICAgICAgJCh0aGlzLiRyb290RWwpLmRhdGEoJ2F1dG9wbGF5JyksXHJcblx0XHRcdFx0YXV0b3BsYXlUaW1lb3V0OiAkKHRoaXMuJHJvb3RFbCkuZGF0YSgnYXV0b3BsYXktdGltZW91dCcpLFxyXG5cdFx0XHRcdGF1dG9wbGF5U3BlZWQ6ICAgJCh0aGlzLiRyb290RWwpLmRhdGEoJ2F1dG9wbGF5LXNwZWVkJyksXHJcblx0XHRcdFx0bG9vcDogICAgICAgICAgICAkKHRoaXMuJHJvb3RFbCkuZGF0YSgnbG9vcCcpXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR2YXIgcGFnZUFuaW1hdGlvbk9wdGlvbnMgPSB7fTtcclxuXHRcdFx0dmFyIHBhZ2VBbmltYXRpb25zID0gdGhpcy5nZXRQYWdlQW5pbWF0aW9ucygpO1xyXG5cdFx0XHRpZiAocGFnZUFuaW1hdGlvbnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0cGFnZUFuaW1hdGlvbk9wdGlvbnMucGFnZUFuaW1hdGlvbkR1cmF0aW9uID0gJzFzJztcclxuXHRcdFx0XHRwYWdlQW5pbWF0aW9uT3B0aW9ucy5wYWdlQW5pbWF0aW9ucyA9IHBhZ2VBbmltYXRpb25zO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgYWxsT3B0aW9ucyA9IFtkZWZhdWx0c107XHJcblx0XHRcdGZvciAodmFyIGk9MDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmICgkLmlzUGxhaW5PYmplY3QoYXJndW1lbnRzW2ldKSkge1xyXG5cdFx0XHRcdFx0YWxsT3B0aW9ucy5wdXNoKGFyZ3VtZW50c1tpXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhbGxPcHRpb25zLnB1c2goY29udGFpbmVyT3B0aW9ucywgcGFnZUFuaW1hdGlvbk9wdGlvbnMpO1xyXG5cdFx0XHRyZXR1cm4gJC5leHRlbmQuYXBwbHkoJCwgYWxsT3B0aW9ucyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldFBhZ2VBbmltYXRpb25zOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHBhZ2VBbmltYXRpb25zID0gW107XHJcblx0XHRcdCQodGhpcy4kcm9vdEVsKS5maW5kKCcuaXRlbScpLmVhY2goZnVuY3Rpb24oaSwgaXRlbSl7XHJcblx0XHRcdFx0aWYgKCQoaXRlbSkuZGF0YSgnYW5pbWF0ZS1pbicpIHx8ICQoaXRlbSkuZGF0YSgnYW5pbWF0ZS1vdXQnKSkge1xyXG5cdFx0XHRcdFx0cGFnZUFuaW1hdGlvbnNbaV0gPSB7XHJcblx0XHRcdFx0XHRcdHBhZ2U6ICAgICAgIGksXHJcblx0XHRcdFx0XHRcdGFuaW1hdGVJbjogICQoaXRlbSkuZGF0YSgnYW5pbWF0ZS1pbicpLFxyXG5cdFx0XHRcdFx0XHRhbmltYXRlT3V0OiAkKGl0ZW0pLmRhdGEoJ2FuaW1hdGUtb3V0JyksXHJcblx0XHRcdFx0XHRcdGFuaW1hdGVEdXJhdGlvbjogJChpdGVtKS5kYXRhKCdhbmltYXRlLWR1cmF0aW9uJylcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHBhZ2VBbmltYXRpb25zO1xyXG5cdFx0fSxcclxuXHJcblx0XHRsb2FkVmlzaWJsZUltYWdlczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdmlzaWJsZSA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnb2xkaWUnKSA/IHRoaXMuJHJvb3RFbC5maW5kKCdpbWcnKSA6IHRoaXMuJHJvb3RFbC5maW5kKCdpbWc6dmlzaWJsZScpO1xyXG5cdFx0XHQkdmlzaWJsZS5lYWNoKGZ1bmN0aW9uKGksICRlbCkge1xyXG5cdFx0XHRcdHRoaXMuYWN0aW9ucy5zd2FwSW5EYXRhU3JjKCRlbCk7XHJcblx0XHRcdH0uYmluZCh0aGlzKSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGF0dGFjaEhhbmRsZXJzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHRoaXMubG9hZFZpc2libGVJbWFnZXMuYmluZCh0aGlzKSk7XHJcblx0XHRcdHRoaXMuJHJvb3RFbC5vbignaW5pdGlhbGl6ZWQub3dsLmNhcm91c2VsJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRzZWxmLmxvYWRWaXNpYmxlSW1hZ2VzKCk7XHJcblx0XHRcdFx0aWYgKHNlbGYuJHJvb3RFbC5oYXNDbGFzcygnaGlkZGVuJykpIHtcclxuXHRcdFx0XHRcdHNlbGYuJHJvb3RFbC5hZGRDbGFzcygnb3dsLWZhZGUtaW4nKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0YWN0aW9uczoge1xyXG5cdFx0XHRzd2FwSW5EYXRhU3JjOiBmdW5jdGlvbihlbGVtZW50KSB7XHJcblx0XHRcdFx0JGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mICRlbGVtZW50LmRhdGEoJ3NyYycpICE9PSAndW5kZWZpbmVkJyAmJiAhJGVsZW1lbnQuYXR0cignc3JjJykpIHtcclxuXHRcdFx0XHRcdCRlbGVtZW50LmF0dHIoJ3NyYycsICRlbGVtZW50LmRhdGEoJ3NyYycpKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBlbGVtZW50O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gU2V0dXAgalF1ZXJ5IFBsdWdpbiBob29rXHJcblx0JC5mbi5tYXJxdWVlT3dsID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgb3B0aW9ucyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5wb3AoKTtcclxuXHRcdHJldHVybiB0aGlzLmVhY2goIGZ1bmN0aW9uKGksIGVsKXttYXJxdWVlT3dsLmluaXQuY2FsbChtYXJxdWVlT3dsLCBlbCwgb3B0aW9ucyl9ICk7XHJcblx0fTtcclxuXHJcblx0Ly8gQ2FsbCBieSBkZWZhdWx0IG9uIGVsZW1lbnRzIHdpdGggLm1hcnF1ZWVcclxuXHQkKGZ1bmN0aW9uKCQpeyQoJy5tYXJxdWVlJykubWFycXVlZU93bCgpfSk7XHJcblxyXG59KGpRdWVyeSkpO1xyXG4iXX0=
