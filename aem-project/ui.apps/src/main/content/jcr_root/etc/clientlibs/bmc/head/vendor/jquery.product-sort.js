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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnByb2R1Y3Qtc29ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCQpe1xuXHQkKGZ1bmN0aW9uKCl7XG5cblxuXHRcdGlmICgkKCdodG1sLmllOCcpLmxlbmd0aCA+IDApIHtcblxuXHRcdFx0JCgnLmFjY29yZGlvbicpLmVhY2goZnVuY3Rpb24oaSwgc2VjdGlvbil7XG5cdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ2FjY29yZGlvbicpOyAvLyByZW1vdmVzIGFjY29yZGlvbiBzdHlsaW5nXG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmFjY29yZGlvbi1pdGVtJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLnNob3coKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tYW5jaG9yJykub2ZmKCdjbGljaycpO1xuXHRcdFx0fSlcblxuXHRcdFx0cmV0dXJuOyAvLyBwcmV2ZW50IHRoZSByZXN0IG9mIHBsdWdpbiBmcm9tIGJlaW5nIHNldHVwXG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogRGVmYXVsdCBjb25maWd1cmF0aW9uIGZvciBtaXhJdFVwXG5cdFx0ICpcblx0XHQgKiBEb24ndCB1c2UgYW5pbWF0aW9ucyBmb3IgSUU4IC8gSUU5XG5cdFx0ICovXG5cdFx0aWYgKCQoJ2h0bWwuaWU5JykubGVuZ3RoID4gMCkge1xuXG5cdFx0XHR2YXIgZGVmYXVsdE1peEl0VXBDb25maWd1cmF0aW9uID0ge1xuXHRcdFx0XHRhbmltYXRpb246IHtcblx0XHRcdFx0XHRlbmFibGU6IGZhbHNlXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR2YXIgZGVmYXVsdE1peEl0VXBDb25maWd1cmF0aW9uID0ge1xuXHRcdFx0XHRhbmltYXRpb246IHtcblx0XHRcdFx0XHRlbmFibGU6IHRydWUsXG5cdFx0XHRcdFx0cXVldWU6IGZhbHNlLFxuXHRcdFx0XHRcdGVmZmVjdHM6ICdmYWRlJyxcblx0XHRcdFx0XHRlYXNpbmc6ICdlYXNlJyxcblx0XHRcdFx0XHRkdXJhdGlvbjogNDAwLFxuXHRcdFx0XHRcdGFuaW1hdGVSZXNpemVDb250YWluZXI6IGZhbHNlLFxuXHRcdFx0XHRcdGFuaW1hdGVSZXNpemVUYXJnZXRzOiB0cnVlLFxuXHRcdFx0XHRcdGFuaW1hdGVDaGFuZ2VMYXlvdXQ6IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0XG5cdFx0ZnVuY3Rpb24gRXZlbnREZWJvdW5jZXIodHlwZSwgY29udGV4dCkge1xuXHRcdFx0dmFyIHRpbWVyID0gbnVsbDtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcblx0XHRcdHNlbGYudHlwZSA9IHR5cGU7XG5cdFx0XHRzZWxmLmRFdmVudCA9ICdkJyArIHR5cGU7XG5cdFx0XHRzZWxmLmNvbnRleHQgPSB0eXBlb2YoY29udGV4dCkgPT09ICd1bmRlZmluZWQnID8galF1ZXJ5KHdpbmRvdykgOiBqUXVlcnkoY29udGV4dCk7XG5cdFx0XHRzZWxmLnJlc29sdXRpb24gPSA1MDtcblx0XHRcdHNlbGYubnMgPSAnLmRlYm91bmNlcicgKyBNYXRoLnJhbmRvbSgpO1xuXHRcdFxuXHRcdFx0ZnVuY3Rpb24gc2VuZERlYm91bmNlZCAoKSB7XG5cdFx0XHRcdHNlbGYuY29udGV4dC50cmlnZ2VyKHNlbGYuZEV2ZW50KTtcblx0XHRcdH1cblx0XHRcblx0XHRcdGZ1bmN0aW9uIGRlYm91bmNlKCkge1xuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xuXHRcdFx0XHR0aW1lciA9IHNldFRpbWVvdXQoc2VuZERlYm91bmNlZCwgc2VsZi5yZXNvbHV0aW9uKTtcblx0XHRcdH1cblx0XHRcblx0XHRcdHNlbGYuYXR0YWNoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzZWxmLmNvbnRleHQub24oc2VsZi50eXBlICsgc2VsZi5ucywgZGVib3VuY2UpO1xuXHRcdFx0fTtcblx0XHRcblx0XHRcdHNlbGYucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c2VsZi5jb250ZXh0Lm9mZihzZWxmLnR5cGUgKyBzZWxmLm5zKTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gdGhlIGJyZWFrcG9pbnQgYXQgd2hpY2ggdGhlIGNhdGVnb3J5IHNlY3Rpb24gaW50ZXJmYWNlIHN3aXRjaGVzXG5cdFx0Ly8gZnJvbSBhbiBhY2NvcmRpb24gdG8gdGFiYmVkXG5cdFx0dmFyIHRhYmJlZEludGVyZmFjZUJyZWFrcG9pbnQgPSA3Njg7IC8vcHhcblxuXHRcdC8qKlxuXHRcdCAqIHNldHVwRmlsdGVycyAgTWFudWFsbHkgc2V0cyB1cCB0aGUgZmlsdGVycyB2aWEgYSBjbGljayBoYW5kbGVyLiBUaGlzIGNhbiBiZSBkb25lIHdpdGhpbiB0aGUgbGlicmFyeSBpdHNlbGYsXG5cdFx0ICogYnV0IHRoZSBkZWZhdWx0IGZpbHRlciBkb2Vzbid0IHNlZW0gdG8gc3VwcG9ydCBhIHNjZW5hcmlvIHdoZXJlOlxuXHRcdCAqXG5cdFx0ICogQ29udGFpbmVyIEE6IGZpbHRlcmFibGUgYnkgLnByb3AtYSwgLnByb3AtYiwgLnByb3AtY1xuXHRcdCAqIENvbnRhaW5lciBCOiBmaWx0ZXJhYmxlIGJ5IC5wcm9jLWQsIC5wcm9wLWUsIC5wcm9wLWZcblx0XHQgKlxuXHRcdCAqIEFuZCB0aGUgc2luZ2xlIGZpbHRlciB3aXRoIGRhdGEtZmlsdGVyPVwiLnByb3AtYSwgLnByb3AtZlwiIHNob3VsZCBmaWx0ZXIgYm90aCBDb250YWluZXIgQSB3aXRoIC5wcm9wLWEgYW5kXG5cdFx0ICogQ29udGFpbmVyIEIgd2l0aCBwcm9wLWYuIFRlc3Rpbmcgc2hvd3MgdGhhdCBvbmx5IHRoZSBmaXJzdCAucHJvcC1hIHdpbGwgYmUgZmlsdGVyZWQgb24gQ29udGFpbmVyIEEgd2l0aFxuXHRcdCAqIG5vdGhpbmcgb2NjdXJpbmcgZm9yIENvbnRhaW5lciBCLlxuXHRcdCAqXG5cdFx0ICogVGhpcyBmdW5jdGlvbiBtYW51YWxseSBzZXRzIHVwIHRoZSBmaWx0ZXJzIHRvIGJlIGFwcGxpZWQgYW5kIHdoZW4gYXBwbHlpbmcgdGhlIGRhdGEtYXR0ciBhcyBhIHBhcmFtZXRlciB0b1xuXHRcdCAqIHRoZSBmaWx0ZXIgZnVuY3Rpb24sIGl0IHNlZW1zIHRvIGFsbG93IGZvciBtdWx0aXBsZSBjb250YWluZXJzIHRvIHNoYXJlIGEgZmlsdGVyIGFuZCBzZWxlY3RpdmVseSBhcHBseSB0aGUgYXBwcm9wcmlhdGVcblx0XHQgKiBmaWx0ZXIgY2xhc3MuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gIHtzdHJpbmd9IGNvbnRhaW5lclNlbGVjdG9yIHNlbGVjdG9yIHRoYXQgc3BlY2lmaWVzIHRoZSBtaXhJdFVwIGNvbnRhaW5lciBpbnN0YW5jZVxuXHRcdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsdGVyU2VsZWN0b3IgICAgc2VsZWN0b3IgdGhhdCBzcGVjaWZpZXMgdGhlIGZpbHRlcnMgdXNlZCB0byBmaWx0ZXIgb2JqZWN0cyB3aXRoaW4gdGhhdCBjb250YWluZXJcblx0XHQgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gc2V0dXBGaWx0ZXJzKGNvbnRhaW5lclNlbGVjdG9yLCBmaWx0ZXJTZWxlY3Rvcikge1xuXG5cdFx0XHQkKGZpbHRlclNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKGksIGUpe1xuXG5cdFx0XHRcdCQoZSkub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuXHRcdFx0XHRcdC8vIHByZXZlbnQgdGhlIGRlZmF1bHQgZnVubnkgYnVzaW5lc3Ncblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0JChmaWx0ZXJTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0XHRcdFx0Ly8gY2hlY2tzIHRoZSBmaWx0ZXIgY2xpY2tlZCBmb3Igb3RoZXIgZmlsdGVycyB3aXRoIHRoZSBzYW1lXG5cdFx0XHRcdFx0Ly8gZmlsdGVyIGJlaW5nIGFwcGxpZWQgYW5kIGZpbHRlclNlbGVjdG9yIHR5cGUgdG8gc3luYyBmaWx0ZXJzXG5cdFx0XHRcdFx0Ly8gYmVpbmcgYXBwbGllZCB3aXRoIHRoZSAnYWN0aXZlJyBjbGFzc1xuXHRcdFx0XHRcdHZhciBlbGVtZW50RmlsdGVycyA9ICQoZSkuZGF0YSgnZmlsdGVyJykuc3BsaXQoJywnKTtcblx0XHRcdFx0XHQkLmVhY2goZWxlbWVudEZpbHRlcnMsIGZ1bmN0aW9uKGksIGUpIHtcbiAgXHRcdFx0XHRcdFx0JChmaWx0ZXJTZWxlY3RvcikuZmlsdGVyKGZ1bmN0aW9uKG1hdGNoZWRGaWx0ZXJJbmRleCwgbWF0Y2hlZEZpbHRlcil7XG5cbiAgXHRcdFx0XHRcdFx0XHR2YXIgbWF0Y2hlZEZpbHRlclZhbHVlcyA9ICQobWF0Y2hlZEZpbHRlcikuZGF0YSgnZmlsdGVyJykuc3BsaXQoJywnKTtcbiAgXHRcdFx0XHRcdFx0XHRtYXRjaGVkRmlsdGVyVmFsdWVzID0gJC5tYXAobWF0Y2hlZEZpbHRlclZhbHVlcywgJC50cmltKTtcblxuXG4gIFx0XHRcdFx0XHRcdFx0aWYgKCQuaW5BcnJheSgkLnRyaW0oZSksIG1hdGNoZWRGaWx0ZXJWYWx1ZXMpICE9PSAtMSkge1xuICBcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG4gIFx0XHRcdFx0XHRcdFx0fVxuXG4gIFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuICBcdFx0XHRcdFx0XHR9KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gIFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdC8vIGFwcGx5IHRoZSBmaWx0ZXJcblx0XHRcdFx0XHR2YXIgc3RhdGUgPSAkKGNvbnRhaW5lclNlbGVjdG9yKS5taXhJdFVwKCdnZXRTdGF0ZScpO1xuXHRcdFx0XHRcdCQoY29udGFpbmVyU2VsZWN0b3IpLm1peEl0VXAoJ2ZpbHRlcicsICQoZSkuZGF0YSgnZmlsdGVyJykpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cblx0XHR2YXIgaXNSZXNldHRpbmcgPSBmYWxzZTsgLy8gdG9nZ2xlIHRvIGNhcHR1cmUgcmVzZXR0aW5nIGJldHdlZW4gcmVzdWx0SXRlbUZpbHRlcnMgYW5kICBhbHBoYVNlY3Rpb25GaWx0ZXJzIGFuZCBhdm9pZGluZyBpbmZpbmF0ZSBsb29wc1xuXG5cdFx0LyoqXG5cdFx0ICogU2V0dXAgZnVuY3Rpb25zIGZvciB0aGUgc2VjdGlvbnMgYW5kIGZpbHRlcnMgd2l0aCBtaXhpdHVwIGpxdWVyeSBwbHVnaW5cblx0XHQgKi9cblxuXHRcdChmdW5jdGlvbiByZXN1bHRJdGVtRmlsdGVycygpe1xuXG5cdFx0XHR2YXIgaGlkZGVuQWxwaGFTZWN0aW9ucyA9IFtdOyAvLyBpZiB0aGUgcmVzdWx0cyBhcmUgZW1wdHksIGhpZGUgdGhlIGFscGhhIGNvbnRhaW5lclxuXG5cdFx0XHR2YXIgY29udGFpbmVyID0gJy5yZXN1bHQtaXRlbXMnO1xuXHRcdFx0dmFyIGNvbmZpZyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0TWl4SXRVcENvbmZpZ3VyYXRpb24sIHtcblx0XHRcdFx0c2VsZWN0b3JzOiB7XG5cdFx0XHRcdFx0dGFyZ2V0OiAnLnJlc3VsdC1pdGVtJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjYWxsYmFja3M6IHtcblx0XHRcdFx0XHRvbk1peFN0YXJ0OiBmdW5jdGlvbihzdGF0ZSkge1xuXG5cdFx0XHRcdFx0XHQvLyBSRVNFVCBBbHBoYSBIaWRkZW4gQWxwaGEgU2VjdGlvbnNcblx0XHRcdFx0XHRcdCQuZWFjaChoaWRkZW5BbHBoYVNlY3Rpb25zLCAoZnVuY3Rpb24oaSwgZSkge1xuXHRcdFx0XHRcdFx0XHQkKGUpLnNob3coKTtcblx0XHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0XHRcdGhpZGRlbkFscGhhU2VjdGlvbnMgPSBbXTtcblxuXHRcdFx0XHRcdFx0aWYgKCFpc1Jlc2V0dGluZykge1xuXHRcdFx0XHRcdFx0XHRpc1Jlc2V0dGluZyA9IHRydWU7XG5cblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHQkKCcuYWxwaGEtc2VjdGlvbnMnKS5taXhJdFVwKCdmaWx0ZXInLCAnYWxsJywgZmFsc2UpXG5cdFx0XHRcdFx0XHRcdFx0JCgnLmFscGhhLXNlY3Rpb24tZmlsdGVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2F0Y2hlcyB3aGVuIHRyeWluZyB0byBjYWxsIG1peEl0VXAgb24gLmFscGhhLXNlY3Rpb25zIHdoZW5cblx0XHRcdFx0XHRcdFx0XHQvLyAuYWxwaGEtc2VjdGlvbnMgaGFzbid0IGJlZW4gc2V0dXAgZHVlIHRvIGJlaW5nIGxvYWRlZCBiZWxvd1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlzUmVzZXR0aW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRvbk1peEVuZDogZnVuY3Rpb24oc3RhdGUpIHtcblxuXHRcdFx0XHRcdFx0dmFyIGhpZGRlbiA9IHN0YXRlLiRoaWRlO1xuXHRcdFx0XHRcdFx0JChoaWRkZW4pLmVhY2goZnVuY3Rpb24oaSwgZSl7XG5cblx0XHRcdFx0XHRcdFx0Ly8gaWYgdGhlIHBhcmVudCBhbHBoYSBzZWN0aW9uIGlzIGFscmVhZHkgaGlkZGVuLCBza2lwXG5cdFx0XHRcdFx0XHRcdHZhciBwYXJlbnQgPSAkKGUpLnBhcmVudHMoJy5hbHBoYS1zZWN0aW9uJyk7XG5cdFx0XHRcdFx0XHRcdGlmICgkLmluQXJyYXkocGFyZW50LmdldCgwKSwgaGlkZGVuQWxwaGFTZWN0aW9ucykgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgaWYgZmlsdGVyIGFuZCBpdHMgc2libGluZ3MgYXJlIGFsbCBoaWRkZW4gd2l0aGluIGFuIGFscGhhIHNlY3Rpb25cblx0XHRcdFx0XHRcdFx0aWYgKCQoZSkuc2libGluZ3MoKS5hZGRCYWNrKCkuZmlsdGVyKCc6aGlkZGVuJykubGVuZ3RoID09ICQoZSkuc2libGluZ3MoKS5hZGRCYWNrKCkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0JChwYXJlbnQpLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0XHRoaWRkZW5BbHBoYVNlY3Rpb25zLnB1c2gocGFyZW50LmdldCgwKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHQvLyBvbiBhICBhbGwgcHJvZHVjdHMgZmlsdGVyaW5nIHBhZ2Vcblx0XHRcdFx0XHRcdGlmICgkKCcuY2F0ZWdvcnktc2VjdGlvbnMnKS5sZW5ndGggPT09IDApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyByZXNldCBvbiBpbml0aWFsIG1peFxuXHRcdFx0XHRcdFx0XHQkKCcudG9waWNzLXJlc3VsdHMtaGVhZGluZycpLnNob3coKTtcblx0XHRcdFx0XHRcdFx0JCgnLnByb2R1Y3RzLXJlc3VsdHMtaGVhZGluZycpLnNob3coKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBoaWRlIHRvcGljcyByZXN1bHRzIGhlYWRpbmcgaWYgdGhlcmUgYXJlbid0IGFueW1vcmUgdG9waWNzIHJlc3VsdHNcblx0XHRcdFx0XHRcdFx0aWYgKCQoJy50b3BpYy5yZXN1bHQtaXRlbTpoaWRkZW4nKS5sZW5ndGggPT0gJCgnLnRvcGljLnJlc3VsdC1pdGVtJykubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCgnLnRvcGljcy1yZXN1bHRzLWhlYWRpbmcnKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyBoaWRlIHByb2R1Y3QgcmVzdWx0cyBoZWFkaW5nIGlmIHRoZXJlIGFyZW4ndCBhbnltb3JlIHByb2R1Y3QgcmVzdWx0c1xuXHRcdFx0XHRcdFx0XHRpZiAoJCgnLnByb2R1Y3QucmVzdWx0LWl0ZW06aGlkZGVuJykubGVuZ3RoID09ICQoJy5wcm9kdWN0LnJlc3VsdC1pdGVtJykubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCgnLnByb2R1Y3RzLXJlc3VsdHMtaGVhZGluZycpLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0XHRcdC8vIEhpZGUgcmVzdWx0cyBvbiBjYXRlZ29yeSBzZWN0aW9ucyBwYWdlIGJ5IGRlZmF1bHRcblx0XHRcdGlmICgkKCcuY2F0ZWdvcnktc2VjdGlvbnMnKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNvbmZpZyA9ICQuZXh0ZW5kKHt9LCBjb25maWcsIHtcblx0XHRcdFx0XHRsb2FkOiB7XG5cdFx0XHRcdFx0XHRmaWx0ZXI6ICdub25lJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdH1cblxuXHRcdFx0JChjb250YWluZXIpLm1peEl0VXAoY29uZmlnKTtcblx0XHRcdHNldHVwRmlsdGVycyhjb250YWluZXIsICcucmVzdWx0LWl0ZW0tZmlsdGVyJyk7XG5cblx0XHR9KCkpO1xuXG5cdFx0KGZ1bmN0aW9uIGFscGhhU2VjdGlvbkZpbHRlcnMoKSB7XG5cblx0XHRcdHZhciBjb250YWluZXIgPSAnLmFscGhhLXNlY3Rpb25zJztcblx0XHRcdHZhciBjb25maWcgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdE1peEl0VXBDb25maWd1cmF0aW9uLCB7XG5cdFx0XHRcdHNlbGVjdG9yczoge1xuXHRcdFx0XHRcdHRhcmdldDogJy5hbHBoYS1zZWN0aW9uJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjYWxsYmFja3M6IHtcblx0XHRcdFx0XHRvbk1peFN0YXJ0OiBmdW5jdGlvbihzdGF0ZSkge1xuXG5cdFx0XHRcdFx0XHR2YXIgcmVzdWx0SXRlbXNTdGF0ZSA9ICQoJy5yZXN1bHQtaXRlbXMnKS5taXhJdFVwKCdnZXRTdGF0ZScpO1xuXG5cdFx0XHRcdFx0XHRpZiAoIWlzUmVzZXR0aW5nKSB7XG5cdFx0XHRcdFx0XHRcdGlzUmVzZXR0aW5nID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0JCgnLnJlc3VsdC1pdGVtcycpLm1peEl0VXAoJ2ZpbHRlcicsICdhbGwnLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdCQoJy5yZXN1bHQtaXRlbS1maWx0ZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpc1Jlc2V0dGluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCQoY29udGFpbmVyKS5taXhJdFVwKGNvbmZpZyk7XG5cdFx0XHRzZXR1cEZpbHRlcnMoY29udGFpbmVyLCAnLmFscGhhLXNlY3Rpb24tZmlsdGVyJyk7XG5cblx0XHR9KCkpO1xuXG5cdFx0KGZ1bmN0aW9uIGNhdGVnb3J5U2VjdGlvbkZpbHRlcnMoKSB7XG5cblx0XHRcdHZhciBjb250YWluZXIgPSAnLmNhdGVnb3J5LXNlY3Rpb25zJztcblx0XHRcdHZhciBjb25maWcgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdE1peEl0VXBDb25maWd1cmF0aW9uLCB7XG5cdFx0XHRcdGxheW91dDoge1xuXHRcdFx0XHRcdGRpc3BsYXk6ICdibG9jaydcblx0XHRcdFx0fSxcblx0XHRcdFx0c2VsZWN0b3JzOiB7XG5cdFx0XHRcdFx0dGFyZ2V0OiAnLmNhdGVnb3J5LXNlY3Rpb24nXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFuaW1hdGlvbjoge1xuXHRcdFx0XHRcdGVuYWJsZTogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2FsbGJhY2tzOiB7XG5cdFx0XHRcdFx0b25NaXhFbmQ6IGZ1bmN0aW9uKHN0YXRlKSB7XG5cblx0XHRcdFx0XHRcdHN0YXRlLiRoaWRlLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuXHRcdFx0XHRcdFx0aWYgKHN0YXRlLnRvdGFsU2hvdyA9PT0gMSkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIHNob3cgdGhlIGNhdGVnb3J5IHNlY3Rpb24gaGVhZGluZ3Ncblx0XHRcdFx0XHRcdFx0JCgnLnRvcGljcy1yZXN1bHRzLWhlYWRpbmcsIC5wcm9kdWN0cy1yZXN1bHRzLWhlYWRpbmcnKS5zaG93KCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gYWRkIGFjdGl2ZSBjbGFzcyBmb3Igc3R5bGluZyBvbiB0aGUgZmlsdGVyIGxpbmtcblx0XHRcdFx0XHRcdFx0c3RhdGUuJHNob3cuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0XHRcdFx0XHRcdHZhciBjYXRlZ29yeVRleHQgPSBzdGF0ZS4kc2hvdy5maXJzdCgpLmZpbmQoJ2gyJykuaHRtbCgpO1xuXHRcdFx0XHRcdFx0XHQvLyBlbnN1cmVzIHRoYXQgY2F0ZWdvcnlUZXh0IGlzIGEgdmFsaWQgdmFsdWUgYW5kIGFkZHMgYSBzcGFjZSxcblx0XHRcdFx0XHRcdFx0Ly8gb3RoZXJ3aXNlIGRlZmF1bHRzIHRvIGFuIGVtcHR5IHN0cmluZyAoZGVmYXVsdClcblx0XHRcdFx0XHRcdFx0dmFyIGNhdGVnb3J5VGV4dCA9IChjYXRlZ29yeVRleHQpID8gY2F0ZWdvcnlUZXh0ICsgJyAnIDogJyc7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpIDwgdGFiYmVkSW50ZXJmYWNlQnJlYWtwb2ludCkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gQ2xvc2Ugb3BlbiBhY2NvcmRpb25zXG5cdFx0XHRcdFx0XHRcdFx0c3RhdGUuJGhpZGUuZmluZCgnLmFjY29yZGlvbi1pdGVtJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0ZS4kaGlkZS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLmhpZGUoKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIHNjcm9sbCB0YXJnZXQgb24gbW9iaWxlXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHRhcmdldCA9ICQoJy5yZXN1bHQtaXRlbXMnKTtcblx0XHRcdFx0XHRcdFx0XHR0YXJnZXRTY3JvbGxUb3AgPSB0YXJnZXQub2Zmc2V0KCkudG9wIC0gODA7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gc2Nyb2xsIHRhcmdldCBvbiBkZXNrdG9wXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHRhcmdldCA9IHN0YXRlLiRzaG93LmZpcnN0KCk7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHRhcmdldFNjcm9sbFRvcCA9IHRhcmdldC5vZmZzZXQoKS50b3AgLSAyMCAvLyAyMCwgZm9yIGEgYml0IG9mIHNwYWNpbmdcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8vIHNjcm9sbCB0byB0YXJnZXRcblx0XHRcdFx0XHRcdFx0JCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgICAgXHRcdFx0XHRcdFx0c2Nyb2xsVG9wOiB0YXJnZXRTY3JvbGxUb3BcbiAgICAgICAgXHRcdFx0XHRcdH0sIDEwMDApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgY2F0ZWdvcnkgcGxhY2Vob2xkZXIgc3BhbiB3aXRoaW4gdGhlIHJlc3VsdCBpdGVtcyBjYXRlZ29yeSBzZWN0aW9uIGhlYWRpbmdzXG5cdFx0XHRcdFx0XHRcdCQoJy5jYXRlZ29yeS1zZWN0aW9uLXByb2R1Y3RzLXNlcnZpY2VzJykuaHRtbChjYXRlZ29yeVRleHQpO1xuXHRcdFx0XHRcdFx0XHQkKCcuY2F0ZWdvcnktc2VjdGlvbi10b3BpYycpLmh0bWwoY2F0ZWdvcnlUZXh0KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdCQoJy50b3BpY3MtcmVzdWx0cy1oZWFkaW5nLCAucHJvZHVjdHMtcmVzdWx0cy1oZWFkaW5nJykuaGlkZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblxuXHRcdFx0JChjb250YWluZXIpLm1peEl0VXAoY29uZmlnKTsgLy8gc2V0dXAgZmlsdGVyaW5nIGNvbnRhaW5lciBvZiB0aGUgc2VjdGlvblxuXHRcdFx0c2V0dXBGaWx0ZXJzKGNvbnRhaW5lciwgJy5jYXRlZ29yeS1zZWN0aW9uLWZpbHRlcicpOyAvLyBzZXR1cCBmaWx0ZXJzIG9uIGNvbnRhaW5lclxuXG5cdFx0XHRmdW5jdGlvbiBjYXRlZ29yeVNlY3Rpb25zRGVza3RvcCgpIHtcblx0XHRcdFx0JChjb250YWluZXIpLmZpbmQoJy5jYXRlZ29yeS1zZWN0aW9uJykuZWFjaChmdW5jdGlvbihpLCBzZWN0aW9uKXtcblx0XHRcdFx0XHQvLyByZW1vdmUgYWNjb3JkaW9uIGFuZCBhc3NvY2lhdGVkIGNsaWNrIGhhbmRsZXJzXG5cblx0XHRcdFx0XHRpZiAoJChzZWN0aW9uKS5oYXNDbGFzcygnYWNjb3JkaW9uJykpIHtcblxuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIGFjY29yZGlvbiBmdW5jdGlvbmFsaXR5XG5cdFx0XHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdhY2NvcmRpb24nKTsgLy8gcmVtb3ZlcyBhY2NvcmRpb24gc3R5bGluZ1xuXHRcdFx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuXHRcdFx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLnNob3coKTtcblx0XHRcdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmFjY29yZGlvbi1pdGVtLWFuY2hvcicpLm9mZignY2xpY2snKTtcblxuXHRcdFx0XHRcdFx0Lypcblx0XHRcdFx0XHRcdFx0UkVTRVRTOlxuXHRcdFx0XHRcdFx0XHQtIGFjdGl2ZSBjbGFzcyBvbiBjYXRlZ29yeSBzZWN0aW9uIGZpbHRlcnMsIG5vICdhY3RpdmUnIGNsYXNzIGJ5IGRlZmF1bHRcblx0XHRcdFx0XHRcdFx0LSAnVmlldyBhbGwnIGxpbmtzLCBzaG93biBieSBkZWZhdWx0XG5cdFx0XHRcdFx0XHRcdC0gcmVzdWx0IGl0ZW1zLCBoaWRkZW4gYnkgZGVmYXVsdFxuXHRcdFx0XHRcdFx0XHQtLSBUb3BpY3MgYW5kIFByb2R1Y3QgUmVzdWx0cyBoZWFkaW5ncywgaGlkZGVuIGJ5IGRlZmF1bHRcblx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0JCgnLmNhdGVnb3J5LXNlY3Rpb24tZmlsdGVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdFx0JCgnLmZlYXR1cmVkLXByb2R1Y3RzIC52aWV3LWFsbCcpLnNob3coKTtcblx0XHRcdFx0XHRcdCQoJy5yZXN1bHQtaXRlbXMnKS5taXhJdFVwKCdmaWx0ZXInLCAnbm9uZScpO1xuXHRcdFx0XHRcdFx0JCgnLnRvcGljcy1yZXN1bHRzLWhlYWRpbmcsIC5wcm9kdWN0cy1yZXN1bHRzLWhlYWRpbmcnKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHQkKHNlY3Rpb24pLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBjYXRlZ29yeVNlY3Rpb25zTW9iaWxlKCkge1xuXG5cdFx0XHRcdCQoY29udGFpbmVyKS5maW5kKCcuY2F0ZWdvcnktc2VjdGlvbicpLmVhY2goZnVuY3Rpb24oaSwgc2VjdGlvbil7XG5cdFx0XHRcdFx0Ly8gc2V0dXAgYW4gYWNjb3JkaW9uIGlmIG9uZSBpc24ndCBhbHJlYWR5IHNldHVwLCBjb25zaWRlcmVkIHNldHVwIGlmIGhhcyAuYWNjb3JkaW9uXG5cdFx0XHRcdFx0aWYgKCEkKHNlY3Rpb24pLmhhc0NsYXNzKCdhY2NvcmRpb24nKSkge1xuXHRcdFx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcpLmhpZGUoKTtcblx0XHRcdFx0XHRcdCQoc2VjdGlvbikuYWRkQ2xhc3MoJ2FjY29yZGlvbicpO1xuXHRcdFx0XHRcdFx0bmV3IEFjY29yZGlvbigkKHNlY3Rpb24pKTtcblxuXHRcdFx0XHRcdFx0Lypcblx0XHRcdFx0XHRcdFx0UkVTRVRTOlxuXHRcdFx0XHRcdFx0XHQtIFZpZXcgYWxsIGxpbmtzLCBzaG93biBieSBkZWZhdWx0XG5cdFx0XHRcdFx0XHRcdC0gcmVzdWx0IGl0ZW1zLCBoaWRkZW4gYnkgZGVmYXVsdFxuXHRcdFx0XHRcdFx0XHQtIFRvcGljcyBhbmQgUHJvZHVjdCBSZXN1bHRzIGhlYWRpbmdzLCBoaWRkZW4gYnkgZGVmYXVsdFxuXHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHQkKCcuZmVhdHVyZWQtcHJvZHVjdHMgLnZpZXctYWxsJykuc2hvdygpO1xuXHRcdFx0XHRcdFx0JCgnLnJlc3VsdC1pdGVtcycpLm1peEl0VXAoJ2ZpbHRlcicsICdub25lJyk7XG5cdFx0XHRcdFx0XHQkKCcudG9waWNzLXJlc3VsdHMtaGVhZGluZywgLnByb2R1Y3RzLXJlc3VsdHMtaGVhZGluZycpLmhpZGUoKTtcblxuXHRcdFx0XHRcdFx0JCgnLmNhdGVnb3J5LXNlY3Rpb24nKS5jaGlsZHJlbigpLmFkZEJhY2soKS5zaG93KCk7IC8vIHNob3cgc2VjdGlvbnMgdGhhdCBtaWdodCBoYXZlIGJlZW4gZmlsdGVyZWRcblx0XHRcdFx0XHRcdCQoJy5jYXRlZ29yeS1zZWN0aW9uJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gY2F0ZWdvcnlTZWN0aW9uUmVzaXplQ2hlY2soKSB7XG5cblx0XHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID49IHRhYmJlZEludGVyZmFjZUJyZWFrcG9pbnQpIHtcblx0XHRcdFx0XHRjYXRlZ29yeVNlY3Rpb25zRGVza3RvcCgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNhdGVnb3J5U2VjdGlvbnNNb2JpbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gT25seSBzZXR1cCBpZiBjYXRlZ29yeSBzZWN0aW9uIHJlc3BvbnNpdmUgbG9naWMgaWYgb24gYSBjYXRlZ29yeSBzZWN0aW9uIHBhZ2Vcblx0XHRcdGlmICgkKCcuY2F0ZWdvcnktc2VjdGlvbnMnKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNhdGVnb3J5U2VjdGlvblJlc2l6ZUNoZWNrKCk7XG5cdFx0XHRcdG5ldyBFdmVudERlYm91bmNlcigncmVzaXplJykuYXR0YWNoKCk7XG5cdFx0XHRcdC8vbmV3IHV0aWxpdGllcy5FdmVudERlYm91bmNlcigncmVzaXplJykuYXR0YWNoKCk7IC8vQk1DLTUyNyAtIEpTIGVycm9yXG5cdFx0XHRcdCQod2luZG93KS5vbignZHJlc2l6ZScsIGNhdGVnb3J5U2VjdGlvblJlc2l6ZUNoZWNrKTtcblx0XHRcdH1cblxuXHRcdH0oKSk7XG5cblx0fSk7XG59KShqUXVlcnkpO1xuIl19
