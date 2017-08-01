(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function($){
	$(function(){


		if ($('html.ie8').length > 0) {

			$('.accordion').each(function(i, section){
				$(section).removeClass('accordion'); // removes accordion styling
				$(section).find('.accordion-item').removeClass('open');
				$(section).find('.accordion-item-content').show();
				$(section).find('.accordion-item-anchor').off('click');
			})

			return; // prevent the rest of plugin from being setup
		}

		/**
		 * Default configuration for mixItUp
		 *
		 * Don't use animations for IE8 / IE9
		 */
		if ($('html.ie9').length > 0) {

			var defaultMixItUpConfiguration = {
				animation: {
					enable: false
				}
			};

		} else {

			var defaultMixItUpConfiguration = {
				animation: {
					enable: true,
					queue: false,
					effects: 'fade',
					easing: 'ease',
					duration: 400,
					animateResizeContainer: false,
					animateResizeTargets: true,
					animateChangeLayout: true
				}
			};
		}
		
		function EventDebouncer(type, context) {
			var timer = null;
			var self = this;
		
			self.type = type;
			self.dEvent = 'd' + type;
			self.context = typeof(context) === 'undefined' ? jQuery(window) : jQuery(context);
			self.resolution = 50;
			self.ns = '.debouncer' + Math.random();
		
			function sendDebounced () {
				self.context.trigger(self.dEvent);
			}
		
			function debounce() {
				clearTimeout(timer);
				timer = setTimeout(sendDebounced, self.resolution);
			}
		
			self.attach = function () {
				self.context.on(self.type + self.ns, debounce);
			};
		
			self.release = function () {
				self.context.off(self.type + self.ns);
			};
		}

		// the breakpoint at which the category section interface switches
		// from an accordion to tabbed
		var tabbedInterfaceBreakpoint = 768; //px

		/**
		 * setupFilters  Manually sets up the filters via a click handler. This can be done within the library itself,
		 * but the default filter doesn't seem to support a scenario where:
		 *
		 * Container A: filterable by .prop-a, .prop-b, .prop-c
		 * Container B: filterable by .proc-d, .prop-e, .prop-f
		 *
		 * And the single filter with data-filter=".prop-a, .prop-f" should filter both Container A with .prop-a and
		 * Container B with prop-f. Testing shows that only the first .prop-a will be filtered on Container A with
		 * nothing occuring for Container B.
		 *
		 * This function manually sets up the filters to be applied and when applying the data-attr as a parameter to
		 * the filter function, it seems to allow for multiple containers to share a filter and selectively apply the appropriate
		 * filter class.
		 *
		 * @param  {string} containerSelector selector that specifies the mixItUp container instance
		 * @param  {string} filterSelector    selector that specifies the filters used to filter objects within that container
		 * @return {undefined}
		 */
		function setupFilters(containerSelector, filterSelector) {

			$(filterSelector).each(function(i, e){

				$(e).on('click', function(event) {

					// prevent the default funny business
					event.preventDefault();

					$(filterSelector).removeClass('active');

					// checks the filter clicked for other filters with the same
					// filter being applied and filterSelector type to sync filters
					// being applied with the 'active' class
					var elementFilters = $(e).data('filter').split(',');
					$.each(elementFilters, function(i, e) {
  						$(filterSelector).filter(function(matchedFilterIndex, matchedFilter){

  							var matchedFilterValues = $(matchedFilter).data('filter').split(',');
  							matchedFilterValues = $.map(matchedFilterValues, $.trim);


  							if ($.inArray($.trim(e), matchedFilterValues) !== -1) {
  								return true;
  							}

  							return false;
  						}).addClass('active');
  					});

					// apply the filter
					var state = $(containerSelector).mixItUp('getState');
					$(containerSelector).mixItUp('filter', $(e).data('filter'));
				})
			});
		}


		var isResetting = false; // toggle to capture resetting between resultItemFilters and  alphaSectionFilters and avoiding infinate loops

		/**
		 * Setup functions for the sections and filters with mixitup jquery plugin
		 */

		(function resultItemFilters(){

			var hiddenAlphaSections = []; // if the results are empty, hide the alpha container

			var container = '.result-items';
			var config = $.extend({}, defaultMixItUpConfiguration, {
				selectors: {
					target: '.result-item'
				},
				callbacks: {
					onMixStart: function(state) {

						// RESET Alpha Hidden Alpha Sections
						$.each(hiddenAlphaSections, (function(i, e) {
							$(e).show();
						}));
						hiddenAlphaSections = [];

						if (!isResetting) {
							isResetting = true;

							try {
								$('.alpha-sections').mixItUp('filter', 'all', false)
								$('.alpha-section-filter').removeClass('active');
							} catch (e) {
								// catches when trying to call mixItUp on .alpha-sections when
								// .alpha-sections hasn't been setup due to being loaded below
							}

						} else {
							isResetting = false;
						}
					},
					onMixEnd: function(state) {

						var hidden = state.$hide;
						$(hidden).each(function(i, e){

							// if the parent alpha section is already hidden, skip
							var parent = $(e).parents('.alpha-section');
							if ($.inArray(parent.get(0), hiddenAlphaSections) !== -1) {
								return;
							}

							// check if filter and its siblings are all hidden within an alpha section
							if ($(e).siblings().addBack().filter(':hidden').length == $(e).siblings().addBack().length) {
								$(parent).hide();
								hiddenAlphaSections.push(parent.get(0));
							}
						});

						// on a  all products filtering page
						if ($('.category-sections').length === 0) {

							// reset on initial mix
							$('.topics-results-heading').show();
							$('.products-results-heading').show();

							// hide topics results heading if there aren't anymore topics results
							if ($('.topic.result-item:hidden').length == $('.topic.result-item').length) {
								$('.topics-results-heading').hide();
							}

							// hide product results heading if there aren't anymore product results
							if ($('.product.result-item:hidden').length == $('.product.result-item').length) {
								$('.products-results-heading').hide();
							}

						}

					}
				}
			})

			// Hide results on category sections page by default
			if ($('.category-sections').length > 0) {
				config = $.extend({}, config, {
					load: {
						filter: 'none'
					}
				})
			}

			$(container).mixItUp(config);
			setupFilters(container, '.result-item-filter');

		}());

		(function alphaSectionFilters() {

			var container = '.alpha-sections';
			var config = $.extend({}, defaultMixItUpConfiguration, {
				selectors: {
					target: '.alpha-section'
				},
				callbacks: {
					onMixStart: function(state) {

						var resultItemsState = $('.result-items').mixItUp('getState');

						if (!isResetting) {
							isResetting = true;
							$('.result-items').mixItUp('filter', 'all', false);
							$('.result-item-filter').removeClass('active');
						} else {
							isResetting = false;
						}
					}
				}
			});

			$(container).mixItUp(config);
			setupFilters(container, '.alpha-section-filter');

		}());

		(function categorySectionFilters() {

			var container = '.category-sections';
			var config = $.extend({}, defaultMixItUpConfiguration, {
				layout: {
					display: 'block'
				},
				selectors: {
					target: '.category-section'
				},
				animation: {
					enable: false
				},
				callbacks: {
					onMixEnd: function(state) {

						state.$hide.removeClass('active');

						if (state.totalShow === 1) {

							// show the category section headings
							$('.topics-results-heading, .products-results-heading').show();

							// add active class for styling on the filter link
							state.$show.addClass('active');

							var categoryText = state.$show.first().find('h2').html();
							// ensures that categoryText is a valid value and adds a space,
							// otherwise defaults to an empty string (default)
							var categoryText = (categoryText) ? categoryText + ' ' : '';

							if ($(window).width() < tabbedInterfaceBreakpoint) {

								// Close open accordions
								state.$hide.find('.accordion-item').removeClass('open');
								state.$hide.find('.accordion-item-content').hide();

								// scroll target on mobile
								var target = $('.result-items');
								targetScrollTop = target.offset().top - 80;
							} else {
								// scroll target on desktop
								var target = state.$show.first();
								var targetScrollTop = target.offset().top - 20 // 20, for a bit of spacing
							}

							// scroll to target
							$('html,body').animate({
          						scrollTop: targetScrollTop
        					}, 1000);

							// Update the category placeholder span within the result items category section headings
							$('.category-section-products-services').html(categoryText);
							$('.category-section-topic').html(categoryText);
						} else {
							$('.topics-results-heading, .products-results-heading').hide();
						}
					}
				}
			});


			$(container).mixItUp(config); // setup filtering container of the section
			setupFilters(container, '.category-section-filter'); // setup filters on container

			function categorySectionsDesktop() {
				$(container).find('.category-section').each(function(i, section){
					// remove accordion and associated click handlers

					if ($(section).hasClass('accordion')) {

						// Remove accordion functionality
						$(section).removeClass('accordion'); // removes accordion styling
						$(section).find('.accordion-item').removeClass('open');
						$(section).find('.accordion-item-content').show();
						$(section).find('.accordion-item-anchor').off('click');

						/*
							RESETS:
							- active class on category section filters, no 'active' class by default
							- 'View all' links, shown by default
							- result items, hidden by default
							-- Topics and Product Results headings, hidden by default
						 */
						$('.category-section-filter').removeClass('active');
						$('.featured-products .view-all').show();
						$('.result-items').mixItUp('filter', 'none');
						$('.topics-results-heading, .products-results-heading').hide();
						$(section).css('display', 'block');
					}

				});

			}

			function categorySectionsMobile() {

				$(container).find('.category-section').each(function(i, section){
					// setup an accordion if one isn't already setup, considered setup if has .accordion
					if (!$(section).hasClass('accordion')) {
						$(section).find('.accordion-item-content').hide();
						$(section).addClass('accordion');
						new Accordion($(section));

						/*
							RESETS:
							- View all links, shown by default
							- result items, hidden by default
							- Topics and Product Results headings, hidden by default
						 */
						$('.featured-products .view-all').show();
						$('.result-items').mixItUp('filter', 'none');
						$('.topics-results-heading, .products-results-heading').hide();

						$('.category-section').children().addBack().show(); // show sections that might have been filtered
						$('.category-section').css('display', 'block');
					}
				});
			}

			function categorySectionResizeCheck() {

				if ($(window).width() >= tabbedInterfaceBreakpoint) {
					categorySectionsDesktop();
				} else {
					categorySectionsMobile();
				}
			};

			// Only setup if category section responsive logic if on a category section page
			if ($('.category-sections').length > 0) {
				categorySectionResizeCheck();
				new EventDebouncer('resize').attach();
				//new utilities.EventDebouncer('resize').attach(); //BMC-527 - JS error
				$(window).on('dresize', categorySectionResizeCheck);
			}

		}());

	});
})(jQuery);

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnByb2R1Y3Qtc29ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCQpe1xyXG5cdCQoZnVuY3Rpb24oKXtcclxuXHJcblxyXG5cdFx0aWYgKCQoJ2h0bWwuaWU4JykubGVuZ3RoID4gMCkge1xyXG5cclxuXHRcdFx0JCgnLmFjY29yZGlvbicpLmVhY2goZnVuY3Rpb24oaSwgc2VjdGlvbil7XHJcblx0XHRcdFx0JChzZWN0aW9uKS5yZW1vdmVDbGFzcygnYWNjb3JkaW9uJyk7IC8vIHJlbW92ZXMgYWNjb3JkaW9uIHN0eWxpbmdcclxuXHRcdFx0XHQkKHNlY3Rpb24pLmZpbmQoJy5hY2NvcmRpb24taXRlbScpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLnNob3coKTtcclxuXHRcdFx0XHQkKHNlY3Rpb24pLmZpbmQoJy5hY2NvcmRpb24taXRlbS1hbmNob3InKS5vZmYoJ2NsaWNrJyk7XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRyZXR1cm47IC8vIHByZXZlbnQgdGhlIHJlc3Qgb2YgcGx1Z2luIGZyb20gYmVpbmcgc2V0dXBcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERlZmF1bHQgY29uZmlndXJhdGlvbiBmb3IgbWl4SXRVcFxyXG5cdFx0ICpcclxuXHRcdCAqIERvbid0IHVzZSBhbmltYXRpb25zIGZvciBJRTggLyBJRTlcclxuXHRcdCAqL1xyXG5cdFx0aWYgKCQoJ2h0bWwuaWU5JykubGVuZ3RoID4gMCkge1xyXG5cclxuXHRcdFx0dmFyIGRlZmF1bHRNaXhJdFVwQ29uZmlndXJhdGlvbiA9IHtcclxuXHRcdFx0XHRhbmltYXRpb246IHtcclxuXHRcdFx0XHRcdGVuYWJsZTogZmFsc2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdHZhciBkZWZhdWx0TWl4SXRVcENvbmZpZ3VyYXRpb24gPSB7XHJcblx0XHRcdFx0YW5pbWF0aW9uOiB7XHJcblx0XHRcdFx0XHRlbmFibGU6IHRydWUsXHJcblx0XHRcdFx0XHRxdWV1ZTogZmFsc2UsXHJcblx0XHRcdFx0XHRlZmZlY3RzOiAnZmFkZScsXHJcblx0XHRcdFx0XHRlYXNpbmc6ICdlYXNlJyxcclxuXHRcdFx0XHRcdGR1cmF0aW9uOiA0MDAsXHJcblx0XHRcdFx0XHRhbmltYXRlUmVzaXplQ29udGFpbmVyOiBmYWxzZSxcclxuXHRcdFx0XHRcdGFuaW1hdGVSZXNpemVUYXJnZXRzOiB0cnVlLFxyXG5cdFx0XHRcdFx0YW5pbWF0ZUNoYW5nZUxheW91dDogdHJ1ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0ZnVuY3Rpb24gRXZlbnREZWJvdW5jZXIodHlwZSwgY29udGV4dCkge1xyXG5cdFx0XHR2YXIgdGltZXIgPSBudWxsO1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcclxuXHRcdFx0c2VsZi50eXBlID0gdHlwZTtcclxuXHRcdFx0c2VsZi5kRXZlbnQgPSAnZCcgKyB0eXBlO1xyXG5cdFx0XHRzZWxmLmNvbnRleHQgPSB0eXBlb2YoY29udGV4dCkgPT09ICd1bmRlZmluZWQnID8galF1ZXJ5KHdpbmRvdykgOiBqUXVlcnkoY29udGV4dCk7XHJcblx0XHRcdHNlbGYucmVzb2x1dGlvbiA9IDUwO1xyXG5cdFx0XHRzZWxmLm5zID0gJy5kZWJvdW5jZXInICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFxyXG5cdFx0XHRmdW5jdGlvbiBzZW5kRGVib3VuY2VkICgpIHtcclxuXHRcdFx0XHRzZWxmLmNvbnRleHQudHJpZ2dlcihzZWxmLmRFdmVudCk7XHJcblx0XHRcdH1cclxuXHRcdFxyXG5cdFx0XHRmdW5jdGlvbiBkZWJvdW5jZSgpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xyXG5cdFx0XHRcdHRpbWVyID0gc2V0VGltZW91dChzZW5kRGVib3VuY2VkLCBzZWxmLnJlc29sdXRpb24pO1xyXG5cdFx0XHR9XHJcblx0XHRcclxuXHRcdFx0c2VsZi5hdHRhY2ggPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0c2VsZi5jb250ZXh0Lm9uKHNlbGYudHlwZSArIHNlbGYubnMsIGRlYm91bmNlKTtcclxuXHRcdFx0fTtcclxuXHRcdFxyXG5cdFx0XHRzZWxmLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0c2VsZi5jb250ZXh0Lm9mZihzZWxmLnR5cGUgKyBzZWxmLm5zKTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyB0aGUgYnJlYWtwb2ludCBhdCB3aGljaCB0aGUgY2F0ZWdvcnkgc2VjdGlvbiBpbnRlcmZhY2Ugc3dpdGNoZXNcclxuXHRcdC8vIGZyb20gYW4gYWNjb3JkaW9uIHRvIHRhYmJlZFxyXG5cdFx0dmFyIHRhYmJlZEludGVyZmFjZUJyZWFrcG9pbnQgPSA3Njg7IC8vcHhcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIHNldHVwRmlsdGVycyAgTWFudWFsbHkgc2V0cyB1cCB0aGUgZmlsdGVycyB2aWEgYSBjbGljayBoYW5kbGVyLiBUaGlzIGNhbiBiZSBkb25lIHdpdGhpbiB0aGUgbGlicmFyeSBpdHNlbGYsXHJcblx0XHQgKiBidXQgdGhlIGRlZmF1bHQgZmlsdGVyIGRvZXNuJ3Qgc2VlbSB0byBzdXBwb3J0IGEgc2NlbmFyaW8gd2hlcmU6XHJcblx0XHQgKlxyXG5cdFx0ICogQ29udGFpbmVyIEE6IGZpbHRlcmFibGUgYnkgLnByb3AtYSwgLnByb3AtYiwgLnByb3AtY1xyXG5cdFx0ICogQ29udGFpbmVyIEI6IGZpbHRlcmFibGUgYnkgLnByb2MtZCwgLnByb3AtZSwgLnByb3AtZlxyXG5cdFx0ICpcclxuXHRcdCAqIEFuZCB0aGUgc2luZ2xlIGZpbHRlciB3aXRoIGRhdGEtZmlsdGVyPVwiLnByb3AtYSwgLnByb3AtZlwiIHNob3VsZCBmaWx0ZXIgYm90aCBDb250YWluZXIgQSB3aXRoIC5wcm9wLWEgYW5kXHJcblx0XHQgKiBDb250YWluZXIgQiB3aXRoIHByb3AtZi4gVGVzdGluZyBzaG93cyB0aGF0IG9ubHkgdGhlIGZpcnN0IC5wcm9wLWEgd2lsbCBiZSBmaWx0ZXJlZCBvbiBDb250YWluZXIgQSB3aXRoXHJcblx0XHQgKiBub3RoaW5nIG9jY3VyaW5nIGZvciBDb250YWluZXIgQi5cclxuXHRcdCAqXHJcblx0XHQgKiBUaGlzIGZ1bmN0aW9uIG1hbnVhbGx5IHNldHMgdXAgdGhlIGZpbHRlcnMgdG8gYmUgYXBwbGllZCBhbmQgd2hlbiBhcHBseWluZyB0aGUgZGF0YS1hdHRyIGFzIGEgcGFyYW1ldGVyIHRvXHJcblx0XHQgKiB0aGUgZmlsdGVyIGZ1bmN0aW9uLCBpdCBzZWVtcyB0byBhbGxvdyBmb3IgbXVsdGlwbGUgY29udGFpbmVycyB0byBzaGFyZSBhIGZpbHRlciBhbmQgc2VsZWN0aXZlbHkgYXBwbHkgdGhlIGFwcHJvcHJpYXRlXHJcblx0XHQgKiBmaWx0ZXIgY2xhc3MuXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtICB7c3RyaW5nfSBjb250YWluZXJTZWxlY3RvciBzZWxlY3RvciB0aGF0IHNwZWNpZmllcyB0aGUgbWl4SXRVcCBjb250YWluZXIgaW5zdGFuY2VcclxuXHRcdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsdGVyU2VsZWN0b3IgICAgc2VsZWN0b3IgdGhhdCBzcGVjaWZpZXMgdGhlIGZpbHRlcnMgdXNlZCB0byBmaWx0ZXIgb2JqZWN0cyB3aXRoaW4gdGhhdCBjb250YWluZXJcclxuXHRcdCAqIEByZXR1cm4ge3VuZGVmaW5lZH1cclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gc2V0dXBGaWx0ZXJzKGNvbnRhaW5lclNlbGVjdG9yLCBmaWx0ZXJTZWxlY3Rvcikge1xyXG5cclxuXHRcdFx0JChmaWx0ZXJTZWxlY3RvcikuZWFjaChmdW5jdGlvbihpLCBlKXtcclxuXHJcblx0XHRcdFx0JChlKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG5cclxuXHRcdFx0XHRcdC8vIHByZXZlbnQgdGhlIGRlZmF1bHQgZnVubnkgYnVzaW5lc3NcclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdFx0JChmaWx0ZXJTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHRcdC8vIGNoZWNrcyB0aGUgZmlsdGVyIGNsaWNrZWQgZm9yIG90aGVyIGZpbHRlcnMgd2l0aCB0aGUgc2FtZVxyXG5cdFx0XHRcdFx0Ly8gZmlsdGVyIGJlaW5nIGFwcGxpZWQgYW5kIGZpbHRlclNlbGVjdG9yIHR5cGUgdG8gc3luYyBmaWx0ZXJzXHJcblx0XHRcdFx0XHQvLyBiZWluZyBhcHBsaWVkIHdpdGggdGhlICdhY3RpdmUnIGNsYXNzXHJcblx0XHRcdFx0XHR2YXIgZWxlbWVudEZpbHRlcnMgPSAkKGUpLmRhdGEoJ2ZpbHRlcicpLnNwbGl0KCcsJyk7XHJcblx0XHRcdFx0XHQkLmVhY2goZWxlbWVudEZpbHRlcnMsIGZ1bmN0aW9uKGksIGUpIHtcclxuICBcdFx0XHRcdFx0XHQkKGZpbHRlclNlbGVjdG9yKS5maWx0ZXIoZnVuY3Rpb24obWF0Y2hlZEZpbHRlckluZGV4LCBtYXRjaGVkRmlsdGVyKXtcclxuXHJcbiAgXHRcdFx0XHRcdFx0XHR2YXIgbWF0Y2hlZEZpbHRlclZhbHVlcyA9ICQobWF0Y2hlZEZpbHRlcikuZGF0YSgnZmlsdGVyJykuc3BsaXQoJywnKTtcclxuICBcdFx0XHRcdFx0XHRcdG1hdGNoZWRGaWx0ZXJWYWx1ZXMgPSAkLm1hcChtYXRjaGVkRmlsdGVyVmFsdWVzLCAkLnRyaW0pO1xyXG5cclxuXHJcbiAgXHRcdFx0XHRcdFx0XHRpZiAoJC5pbkFycmF5KCQudHJpbShlKSwgbWF0Y2hlZEZpbHRlclZhbHVlcykgIT09IC0xKSB7XHJcbiAgXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG4gIFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuICBcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuICBcdFx0XHRcdFx0XHR9KS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdC8vIGFwcGx5IHRoZSBmaWx0ZXJcclxuXHRcdFx0XHRcdHZhciBzdGF0ZSA9ICQoY29udGFpbmVyU2VsZWN0b3IpLm1peEl0VXAoJ2dldFN0YXRlJyk7XHJcblx0XHRcdFx0XHQkKGNvbnRhaW5lclNlbGVjdG9yKS5taXhJdFVwKCdmaWx0ZXInLCAkKGUpLmRhdGEoJ2ZpbHRlcicpKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0dmFyIGlzUmVzZXR0aW5nID0gZmFsc2U7IC8vIHRvZ2dsZSB0byBjYXB0dXJlIHJlc2V0dGluZyBiZXR3ZWVuIHJlc3VsdEl0ZW1GaWx0ZXJzIGFuZCAgYWxwaGFTZWN0aW9uRmlsdGVycyBhbmQgYXZvaWRpbmcgaW5maW5hdGUgbG9vcHNcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNldHVwIGZ1bmN0aW9ucyBmb3IgdGhlIHNlY3Rpb25zIGFuZCBmaWx0ZXJzIHdpdGggbWl4aXR1cCBqcXVlcnkgcGx1Z2luXHJcblx0XHQgKi9cclxuXHJcblx0XHQoZnVuY3Rpb24gcmVzdWx0SXRlbUZpbHRlcnMoKXtcclxuXHJcblx0XHRcdHZhciBoaWRkZW5BbHBoYVNlY3Rpb25zID0gW107IC8vIGlmIHRoZSByZXN1bHRzIGFyZSBlbXB0eSwgaGlkZSB0aGUgYWxwaGEgY29udGFpbmVyXHJcblxyXG5cdFx0XHR2YXIgY29udGFpbmVyID0gJy5yZXN1bHQtaXRlbXMnO1xyXG5cdFx0XHR2YXIgY29uZmlnID0gJC5leHRlbmQoe30sIGRlZmF1bHRNaXhJdFVwQ29uZmlndXJhdGlvbiwge1xyXG5cdFx0XHRcdHNlbGVjdG9yczoge1xyXG5cdFx0XHRcdFx0dGFyZ2V0OiAnLnJlc3VsdC1pdGVtJ1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Y2FsbGJhY2tzOiB7XHJcblx0XHRcdFx0XHRvbk1peFN0YXJ0OiBmdW5jdGlvbihzdGF0ZSkge1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gUkVTRVQgQWxwaGEgSGlkZGVuIEFscGhhIFNlY3Rpb25zXHJcblx0XHRcdFx0XHRcdCQuZWFjaChoaWRkZW5BbHBoYVNlY3Rpb25zLCAoZnVuY3Rpb24oaSwgZSkge1xyXG5cdFx0XHRcdFx0XHRcdCQoZSkuc2hvdygpO1xyXG5cdFx0XHRcdFx0XHR9KSk7XHJcblx0XHRcdFx0XHRcdGhpZGRlbkFscGhhU2VjdGlvbnMgPSBbXTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICghaXNSZXNldHRpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHRpc1Jlc2V0dGluZyA9IHRydWU7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdFx0XHQkKCcuYWxwaGEtc2VjdGlvbnMnKS5taXhJdFVwKCdmaWx0ZXInLCAnYWxsJywgZmFsc2UpXHJcblx0XHRcdFx0XHRcdFx0XHQkKCcuYWxwaGEtc2VjdGlvbi1maWx0ZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2F0Y2hlcyB3aGVuIHRyeWluZyB0byBjYWxsIG1peEl0VXAgb24gLmFscGhhLXNlY3Rpb25zIHdoZW5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIC5hbHBoYS1zZWN0aW9ucyBoYXNuJ3QgYmVlbiBzZXR1cCBkdWUgdG8gYmVpbmcgbG9hZGVkIGJlbG93XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpc1Jlc2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0b25NaXhFbmQ6IGZ1bmN0aW9uKHN0YXRlKSB7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgaGlkZGVuID0gc3RhdGUuJGhpZGU7XHJcblx0XHRcdFx0XHRcdCQoaGlkZGVuKS5lYWNoKGZ1bmN0aW9uKGksIGUpe1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBpZiB0aGUgcGFyZW50IGFscGhhIHNlY3Rpb24gaXMgYWxyZWFkeSBoaWRkZW4sIHNraXBcclxuXHRcdFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gJChlKS5wYXJlbnRzKCcuYWxwaGEtc2VjdGlvbicpO1xyXG5cdFx0XHRcdFx0XHRcdGlmICgkLmluQXJyYXkocGFyZW50LmdldCgwKSwgaGlkZGVuQWxwaGFTZWN0aW9ucykgIT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBjaGVjayBpZiBmaWx0ZXIgYW5kIGl0cyBzaWJsaW5ncyBhcmUgYWxsIGhpZGRlbiB3aXRoaW4gYW4gYWxwaGEgc2VjdGlvblxyXG5cdFx0XHRcdFx0XHRcdGlmICgkKGUpLnNpYmxpbmdzKCkuYWRkQmFjaygpLmZpbHRlcignOmhpZGRlbicpLmxlbmd0aCA9PSAkKGUpLnNpYmxpbmdzKCkuYWRkQmFjaygpLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0JChwYXJlbnQpLmhpZGUoKTtcclxuXHRcdFx0XHRcdFx0XHRcdGhpZGRlbkFscGhhU2VjdGlvbnMucHVzaChwYXJlbnQuZ2V0KDApKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gb24gYSAgYWxsIHByb2R1Y3RzIGZpbHRlcmluZyBwYWdlXHJcblx0XHRcdFx0XHRcdGlmICgkKCcuY2F0ZWdvcnktc2VjdGlvbnMnKS5sZW5ndGggPT09IDApIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gcmVzZXQgb24gaW5pdGlhbCBtaXhcclxuXHRcdFx0XHRcdFx0XHQkKCcudG9waWNzLXJlc3VsdHMtaGVhZGluZycpLnNob3coKTtcclxuXHRcdFx0XHRcdFx0XHQkKCcucHJvZHVjdHMtcmVzdWx0cy1oZWFkaW5nJykuc2hvdygpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBoaWRlIHRvcGljcyByZXN1bHRzIGhlYWRpbmcgaWYgdGhlcmUgYXJlbid0IGFueW1vcmUgdG9waWNzIHJlc3VsdHNcclxuXHRcdFx0XHRcdFx0XHRpZiAoJCgnLnRvcGljLnJlc3VsdC1pdGVtOmhpZGRlbicpLmxlbmd0aCA9PSAkKCcudG9waWMucmVzdWx0LWl0ZW0nKS5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdCQoJy50b3BpY3MtcmVzdWx0cy1oZWFkaW5nJykuaGlkZSgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gaGlkZSBwcm9kdWN0IHJlc3VsdHMgaGVhZGluZyBpZiB0aGVyZSBhcmVuJ3QgYW55bW9yZSBwcm9kdWN0IHJlc3VsdHNcclxuXHRcdFx0XHRcdFx0XHRpZiAoJCgnLnByb2R1Y3QucmVzdWx0LWl0ZW06aGlkZGVuJykubGVuZ3RoID09ICQoJy5wcm9kdWN0LnJlc3VsdC1pdGVtJykubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQkKCcucHJvZHVjdHMtcmVzdWx0cy1oZWFkaW5nJykuaGlkZSgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0Ly8gSGlkZSByZXN1bHRzIG9uIGNhdGVnb3J5IHNlY3Rpb25zIHBhZ2UgYnkgZGVmYXVsdFxyXG5cdFx0XHRpZiAoJCgnLmNhdGVnb3J5LXNlY3Rpb25zJykubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNvbmZpZyA9ICQuZXh0ZW5kKHt9LCBjb25maWcsIHtcclxuXHRcdFx0XHRcdGxvYWQ6IHtcclxuXHRcdFx0XHRcdFx0ZmlsdGVyOiAnbm9uZSdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkKGNvbnRhaW5lcikubWl4SXRVcChjb25maWcpO1xyXG5cdFx0XHRzZXR1cEZpbHRlcnMoY29udGFpbmVyLCAnLnJlc3VsdC1pdGVtLWZpbHRlcicpO1xyXG5cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0KGZ1bmN0aW9uIGFscGhhU2VjdGlvbkZpbHRlcnMoKSB7XHJcblxyXG5cdFx0XHR2YXIgY29udGFpbmVyID0gJy5hbHBoYS1zZWN0aW9ucyc7XHJcblx0XHRcdHZhciBjb25maWcgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdE1peEl0VXBDb25maWd1cmF0aW9uLCB7XHJcblx0XHRcdFx0c2VsZWN0b3JzOiB7XHJcblx0XHRcdFx0XHR0YXJnZXQ6ICcuYWxwaGEtc2VjdGlvbidcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNhbGxiYWNrczoge1xyXG5cdFx0XHRcdFx0b25NaXhTdGFydDogZnVuY3Rpb24oc3RhdGUpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciByZXN1bHRJdGVtc1N0YXRlID0gJCgnLnJlc3VsdC1pdGVtcycpLm1peEl0VXAoJ2dldFN0YXRlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoIWlzUmVzZXR0aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0aXNSZXNldHRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdCQoJy5yZXN1bHQtaXRlbXMnKS5taXhJdFVwKCdmaWx0ZXInLCAnYWxsJywgZmFsc2UpO1xyXG5cdFx0XHRcdFx0XHRcdCQoJy5yZXN1bHQtaXRlbS1maWx0ZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aXNSZXNldHRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKGNvbnRhaW5lcikubWl4SXRVcChjb25maWcpO1xyXG5cdFx0XHRzZXR1cEZpbHRlcnMoY29udGFpbmVyLCAnLmFscGhhLXNlY3Rpb24tZmlsdGVyJyk7XHJcblxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHQoZnVuY3Rpb24gY2F0ZWdvcnlTZWN0aW9uRmlsdGVycygpIHtcclxuXHJcblx0XHRcdHZhciBjb250YWluZXIgPSAnLmNhdGVnb3J5LXNlY3Rpb25zJztcclxuXHRcdFx0dmFyIGNvbmZpZyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0TWl4SXRVcENvbmZpZ3VyYXRpb24sIHtcclxuXHRcdFx0XHRsYXlvdXQ6IHtcclxuXHRcdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHNlbGVjdG9yczoge1xyXG5cdFx0XHRcdFx0dGFyZ2V0OiAnLmNhdGVnb3J5LXNlY3Rpb24nXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRhbmltYXRpb246IHtcclxuXHRcdFx0XHRcdGVuYWJsZTogZmFsc2VcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNhbGxiYWNrczoge1xyXG5cdFx0XHRcdFx0b25NaXhFbmQ6IGZ1bmN0aW9uKHN0YXRlKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRzdGF0ZS4kaGlkZS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoc3RhdGUudG90YWxTaG93ID09PSAxKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIHNob3cgdGhlIGNhdGVnb3J5IHNlY3Rpb24gaGVhZGluZ3NcclxuXHRcdFx0XHRcdFx0XHQkKCcudG9waWNzLXJlc3VsdHMtaGVhZGluZywgLnByb2R1Y3RzLXJlc3VsdHMtaGVhZGluZycpLnNob3coKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gYWRkIGFjdGl2ZSBjbGFzcyBmb3Igc3R5bGluZyBvbiB0aGUgZmlsdGVyIGxpbmtcclxuXHRcdFx0XHRcdFx0XHRzdGF0ZS4kc2hvdy5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciBjYXRlZ29yeVRleHQgPSBzdGF0ZS4kc2hvdy5maXJzdCgpLmZpbmQoJ2gyJykuaHRtbCgpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGVuc3VyZXMgdGhhdCBjYXRlZ29yeVRleHQgaXMgYSB2YWxpZCB2YWx1ZSBhbmQgYWRkcyBhIHNwYWNlLFxyXG5cdFx0XHRcdFx0XHRcdC8vIG90aGVyd2lzZSBkZWZhdWx0cyB0byBhbiBlbXB0eSBzdHJpbmcgKGRlZmF1bHQpXHJcblx0XHRcdFx0XHRcdFx0dmFyIGNhdGVnb3J5VGV4dCA9IChjYXRlZ29yeVRleHQpID8gY2F0ZWdvcnlUZXh0ICsgJyAnIDogJyc7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA8IHRhYmJlZEludGVyZmFjZUJyZWFrcG9pbnQpIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBDbG9zZSBvcGVuIGFjY29yZGlvbnNcclxuXHRcdFx0XHRcdFx0XHRcdHN0YXRlLiRoaWRlLmZpbmQoJy5hY2NvcmRpb24taXRlbScpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRzdGF0ZS4kaGlkZS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLmhpZGUoKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBzY3JvbGwgdGFyZ2V0IG9uIG1vYmlsZVxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHRhcmdldCA9ICQoJy5yZXN1bHQtaXRlbXMnKTtcclxuXHRcdFx0XHRcdFx0XHRcdHRhcmdldFNjcm9sbFRvcCA9IHRhcmdldC5vZmZzZXQoKS50b3AgLSA4MDtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gc2Nyb2xsIHRhcmdldCBvbiBkZXNrdG9wXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgdGFyZ2V0ID0gc3RhdGUuJHNob3cuZmlyc3QoKTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciB0YXJnZXRTY3JvbGxUb3AgPSB0YXJnZXQub2Zmc2V0KCkudG9wIC0gMjAgLy8gMjAsIGZvciBhIGJpdCBvZiBzcGFjaW5nXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBzY3JvbGwgdG8gdGFyZ2V0XHJcblx0XHRcdFx0XHRcdFx0JCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICBcdFx0XHRcdFx0XHRzY3JvbGxUb3A6IHRhcmdldFNjcm9sbFRvcFxyXG4gICAgICAgIFx0XHRcdFx0XHR9LCAxMDAwKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBjYXRlZ29yeSBwbGFjZWhvbGRlciBzcGFuIHdpdGhpbiB0aGUgcmVzdWx0IGl0ZW1zIGNhdGVnb3J5IHNlY3Rpb24gaGVhZGluZ3NcclxuXHRcdFx0XHRcdFx0XHQkKCcuY2F0ZWdvcnktc2VjdGlvbi1wcm9kdWN0cy1zZXJ2aWNlcycpLmh0bWwoY2F0ZWdvcnlUZXh0KTtcclxuXHRcdFx0XHRcdFx0XHQkKCcuY2F0ZWdvcnktc2VjdGlvbi10b3BpYycpLmh0bWwoY2F0ZWdvcnlUZXh0KTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQkKCcudG9waWNzLXJlc3VsdHMtaGVhZGluZywgLnByb2R1Y3RzLXJlc3VsdHMtaGVhZGluZycpLmhpZGUoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cclxuXHRcdFx0JChjb250YWluZXIpLm1peEl0VXAoY29uZmlnKTsgLy8gc2V0dXAgZmlsdGVyaW5nIGNvbnRhaW5lciBvZiB0aGUgc2VjdGlvblxyXG5cdFx0XHRzZXR1cEZpbHRlcnMoY29udGFpbmVyLCAnLmNhdGVnb3J5LXNlY3Rpb24tZmlsdGVyJyk7IC8vIHNldHVwIGZpbHRlcnMgb24gY29udGFpbmVyXHJcblxyXG5cdFx0XHRmdW5jdGlvbiBjYXRlZ29yeVNlY3Rpb25zRGVza3RvcCgpIHtcclxuXHRcdFx0XHQkKGNvbnRhaW5lcikuZmluZCgnLmNhdGVnb3J5LXNlY3Rpb24nKS5lYWNoKGZ1bmN0aW9uKGksIHNlY3Rpb24pe1xyXG5cdFx0XHRcdFx0Ly8gcmVtb3ZlIGFjY29yZGlvbiBhbmQgYXNzb2NpYXRlZCBjbGljayBoYW5kbGVyc1xyXG5cclxuXHRcdFx0XHRcdGlmICgkKHNlY3Rpb24pLmhhc0NsYXNzKCdhY2NvcmRpb24nKSkge1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIGFjY29yZGlvbiBmdW5jdGlvbmFsaXR5XHJcblx0XHRcdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ2FjY29yZGlvbicpOyAvLyByZW1vdmVzIGFjY29yZGlvbiBzdHlsaW5nXHJcblx0XHRcdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmFjY29yZGlvbi1pdGVtJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLnNob3coKTtcclxuXHRcdFx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tYW5jaG9yJykub2ZmKCdjbGljaycpO1xyXG5cclxuXHRcdFx0XHRcdFx0LypcclxuXHRcdFx0XHRcdFx0XHRSRVNFVFM6XHJcblx0XHRcdFx0XHRcdFx0LSBhY3RpdmUgY2xhc3Mgb24gY2F0ZWdvcnkgc2VjdGlvbiBmaWx0ZXJzLCBubyAnYWN0aXZlJyBjbGFzcyBieSBkZWZhdWx0XHJcblx0XHRcdFx0XHRcdFx0LSAnVmlldyBhbGwnIGxpbmtzLCBzaG93biBieSBkZWZhdWx0XHJcblx0XHRcdFx0XHRcdFx0LSByZXN1bHQgaXRlbXMsIGhpZGRlbiBieSBkZWZhdWx0XHJcblx0XHRcdFx0XHRcdFx0LS0gVG9waWNzIGFuZCBQcm9kdWN0IFJlc3VsdHMgaGVhZGluZ3MsIGhpZGRlbiBieSBkZWZhdWx0XHJcblx0XHRcdFx0XHRcdCAqL1xyXG5cdFx0XHRcdFx0XHQkKCcuY2F0ZWdvcnktc2VjdGlvbi1maWx0ZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdCQoJy5mZWF0dXJlZC1wcm9kdWN0cyAudmlldy1hbGwnKS5zaG93KCk7XHJcblx0XHRcdFx0XHRcdCQoJy5yZXN1bHQtaXRlbXMnKS5taXhJdFVwKCdmaWx0ZXInLCAnbm9uZScpO1xyXG5cdFx0XHRcdFx0XHQkKCcudG9waWNzLXJlc3VsdHMtaGVhZGluZywgLnByb2R1Y3RzLXJlc3VsdHMtaGVhZGluZycpLmhpZGUoKTtcclxuXHRcdFx0XHRcdFx0JChzZWN0aW9uKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBjYXRlZ29yeVNlY3Rpb25zTW9iaWxlKCkge1xyXG5cclxuXHRcdFx0XHQkKGNvbnRhaW5lcikuZmluZCgnLmNhdGVnb3J5LXNlY3Rpb24nKS5lYWNoKGZ1bmN0aW9uKGksIHNlY3Rpb24pe1xyXG5cdFx0XHRcdFx0Ly8gc2V0dXAgYW4gYWNjb3JkaW9uIGlmIG9uZSBpc24ndCBhbHJlYWR5IHNldHVwLCBjb25zaWRlcmVkIHNldHVwIGlmIGhhcyAuYWNjb3JkaW9uXHJcblx0XHRcdFx0XHRpZiAoISQoc2VjdGlvbikuaGFzQ2xhc3MoJ2FjY29yZGlvbicpKSB7XHJcblx0XHRcdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnKS5oaWRlKCk7XHJcblx0XHRcdFx0XHRcdCQoc2VjdGlvbikuYWRkQ2xhc3MoJ2FjY29yZGlvbicpO1xyXG5cdFx0XHRcdFx0XHRuZXcgQWNjb3JkaW9uKCQoc2VjdGlvbikpO1xyXG5cclxuXHRcdFx0XHRcdFx0LypcclxuXHRcdFx0XHRcdFx0XHRSRVNFVFM6XHJcblx0XHRcdFx0XHRcdFx0LSBWaWV3IGFsbCBsaW5rcywgc2hvd24gYnkgZGVmYXVsdFxyXG5cdFx0XHRcdFx0XHRcdC0gcmVzdWx0IGl0ZW1zLCBoaWRkZW4gYnkgZGVmYXVsdFxyXG5cdFx0XHRcdFx0XHRcdC0gVG9waWNzIGFuZCBQcm9kdWN0IFJlc3VsdHMgaGVhZGluZ3MsIGhpZGRlbiBieSBkZWZhdWx0XHJcblx0XHRcdFx0XHRcdCAqL1xyXG5cdFx0XHRcdFx0XHQkKCcuZmVhdHVyZWQtcHJvZHVjdHMgLnZpZXctYWxsJykuc2hvdygpO1xyXG5cdFx0XHRcdFx0XHQkKCcucmVzdWx0LWl0ZW1zJykubWl4SXRVcCgnZmlsdGVyJywgJ25vbmUnKTtcclxuXHRcdFx0XHRcdFx0JCgnLnRvcGljcy1yZXN1bHRzLWhlYWRpbmcsIC5wcm9kdWN0cy1yZXN1bHRzLWhlYWRpbmcnKS5oaWRlKCk7XHJcblxyXG5cdFx0XHRcdFx0XHQkKCcuY2F0ZWdvcnktc2VjdGlvbicpLmNoaWxkcmVuKCkuYWRkQmFjaygpLnNob3coKTsgLy8gc2hvdyBzZWN0aW9ucyB0aGF0IG1pZ2h0IGhhdmUgYmVlbiBmaWx0ZXJlZFxyXG5cdFx0XHRcdFx0XHQkKCcuY2F0ZWdvcnktc2VjdGlvbicpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBjYXRlZ29yeVNlY3Rpb25SZXNpemVDaGVjaygpIHtcclxuXHJcblx0XHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID49IHRhYmJlZEludGVyZmFjZUJyZWFrcG9pbnQpIHtcclxuXHRcdFx0XHRcdGNhdGVnb3J5U2VjdGlvbnNEZXNrdG9wKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNhdGVnb3J5U2VjdGlvbnNNb2JpbGUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvLyBPbmx5IHNldHVwIGlmIGNhdGVnb3J5IHNlY3Rpb24gcmVzcG9uc2l2ZSBsb2dpYyBpZiBvbiBhIGNhdGVnb3J5IHNlY3Rpb24gcGFnZVxyXG5cdFx0XHRpZiAoJCgnLmNhdGVnb3J5LXNlY3Rpb25zJykubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNhdGVnb3J5U2VjdGlvblJlc2l6ZUNoZWNrKCk7XHJcblx0XHRcdFx0bmV3IEV2ZW50RGVib3VuY2VyKCdyZXNpemUnKS5hdHRhY2goKTtcclxuXHRcdFx0XHQvL25ldyB1dGlsaXRpZXMuRXZlbnREZWJvdW5jZXIoJ3Jlc2l6ZScpLmF0dGFjaCgpOyAvL0JNQy01MjcgLSBKUyBlcnJvclxyXG5cdFx0XHRcdCQod2luZG93KS5vbignZHJlc2l6ZScsIGNhdGVnb3J5U2VjdGlvblJlc2l6ZUNoZWNrKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0oKSk7XHJcblxyXG5cdH0pO1xyXG59KShqUXVlcnkpO1xyXG4iXX0=
