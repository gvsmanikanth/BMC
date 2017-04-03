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
