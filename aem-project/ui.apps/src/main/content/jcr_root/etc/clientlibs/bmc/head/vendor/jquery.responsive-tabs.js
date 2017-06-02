(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* ----------------
ResponsiveTabs.js
Author: Pete Love | www.petelove.com
Version: 1.10
------------------- */

var RESPONSIVEUI = {};

(function($) {

	RESPONSIVEUI.responsiveTabs = function () {
		var $tabSets = $('.responsive-tabs');

		if (!$tabSets.hasClass('responsive-tabs--enabled')) {	// if we haven't already called this function and enabled tabs
			$tabSets.addClass('responsive-tabs--enabled');

			//loop through all sets of tabs on the page
			var tablistcount = 1;

			$tabSets.each(function() {

				var $tabs = $(this);

				// add tab heading and tab panel classes
				$tabs.children(':header').addClass('responsive-tabs__heading');
				$tabs.children('div').addClass('responsive-tabs__panel');

				// determine if markup already identifies the active tab panel for this set of tabs
				// if not then set first heading and tab to be the active one
				var $activePanel = $tabs.find('.responsive-tabs__panel--active');
				if(!$activePanel.length) {
					$activePanel = $tabs.find('.responsive-tabs__panel').first().addClass('responsive-tabs__panel--active');
				}

				$tabs.find('.responsive-tabs__panel').not('.responsive-tabs__panel--active').hide().attr('aria-hidden','true'); //hide all except active panel
				$activePanel.attr('aria-hidden', 'false');
				/* make active tab panel hidden for mobile */
				$activePanel.addClass('responsive-tabs__panel--closed-accordion-only');

				// wrap tabs in container - to be dynamically resized to help prevent page jump
				var $tabsWrapper = $('<div/>', {'class': 'responsive-tabs-wrapper' });
				$tabs.wrap($tabsWrapper);

				var highestHeight = 0;

				// determine height of tallest tab panel. Used later to prevent page jump when tabs are clicked
				$tabs.find('.responsive-tabs__panel').each(function() {
					var tabHeight = $(this).height();
					if (tabHeight > highestHeight) {
						highestHeight = tabHeight;
					}
				});

				//create the tab list
				var $tabList = $('<ul/>', { 'class': 'responsive-tabs__list', 'role': 'tablist' });

				//loop through each heading in set
				var tabcount = 1;
				$tabs.find('.responsive-tabs__heading').each(function() {

					var $tabHeading = $(this);
					var $tabPanel = $(this).next();

					$tabHeading.attr('tabindex', 0);

					// CREATE TAB ITEMS (VISIBLE ON DESKTOP)
					//create tab list item from heading
					//associate tab list item with tab panel
					var $tabListItem = $('<li/>', {
						'class': 'responsive-tabs__list__item',
						html: $tabHeading.html(),
						id: 'tablist' + tablistcount + '-tab' + tabcount,
						'aria-controls': 'tablist' + tablistcount +'-panel' + tabcount,
						'role': 'tab',
						tabindex: 0,
						keydown: function (objEvent) {
							if (objEvent.keyCode === 13) { // if user presses 'enter'
								$tabListItem.click();
							}
						},
						click: function() {
							//Show associated panel

							//set height of tab container to highest panel height to avoid page jump
							$tabsWrapper.css('height', highestHeight);

							// remove hidden mobile class from any other panel as we'll want that panel to be open at mobile size
							$tabs.find('.responsive-tabs__panel--closed-accordion-only').removeClass('responsive-tabs__panel--closed-accordion-only');
							
							// close current panel and remove active state from its (hidden on desktop) heading
							$tabs.find('.responsive-tabs__panel--active').toggle().removeClass('responsive-tabs__panel--active').attr('aria-hidden','true').prev().removeClass('responsive-tabs__heading--active');
							
							//make this tab panel active
							$tabPanel.toggle().addClass('responsive-tabs__panel--active').attr('aria-hidden','false');

							//make the hidden heading active
							$tabHeading.addClass('responsive-tabs__heading--active');

							//remove active state from currently active tab list item
							$tabList.find('.responsive-tabs__list__item--active').removeClass('responsive-tabs__list__item--active');

							//make this tab active
							$tabListItem.addClass('responsive-tabs__list__item--active');

							//reset height of tab panels to auto
							$tabsWrapper.css('height', 'auto');
						}
					});
					
					//associate tab panel with tab list item
					$tabPanel.attr({
						'role': 'tabpanel',
						'aria-labelledby': $tabListItem.attr('id'),
						id: 'tablist' + tablistcount + '-panel' + tabcount
					});

					// if this is the active panel then make it the active tab item
					if($tabPanel.hasClass('responsive-tabs__panel--active')) {
						$tabListItem.addClass('responsive-tabs__list__item--active');
					}

					// add tab item
					$tabList.append($tabListItem);

					
					// TAB HEADINGS (VISIBLE ON MOBILE)
					// if user presses 'enter' on tab heading trigger the click event
					$tabHeading.keydown(function(objEvent) {
						if (objEvent.keyCode === 13) {
							$tabHeading.click();
						}
					});

					//toggle tab panel if click heading (on mobile)
					$tabHeading.click(function() {

						// remove any hidden mobile class
						$tabs.find('.responsive-tabs__panel--closed-accordion-only').removeClass('responsive-tabs__panel--closed-accordion-only');

						// if this isn't currently active
						if (!$tabHeading.hasClass('responsive-tabs__heading--active')){

							var oldActivePos,
								$activeHeading = $tabs.find('.responsive-tabs__heading--active');
								
							// if there is an active heading, get its position
							if($activeHeading.length) {
								oldActivePos = $activeHeading.offset().top;
							}
							
							// close currently active panel and remove active state from any hidden heading
							$tabs.find('.responsive-tabs__panel--active').slideToggle().removeClass('responsive-tabs__panel--active').prev().removeClass('responsive-tabs__heading--active');
							
							//close all tabs
							$tabs.find('.responsive-tabs__panel').hide().attr('aria-hidden','true');

							//open this panel
							$tabPanel.slideToggle().addClass('responsive-tabs__panel--active').attr('aria-hidden','false');

							// make this heading active
							$tabHeading.addClass('responsive-tabs__heading--active');

							var $currentActive = $tabs.find('.responsive-tabs__list__item--active');

							//set the active tab list item (for desktop)
							$currentActive.removeClass('responsive-tabs__list__item--active');
							var panelId = $tabPanel.attr('id');
							var tabId = panelId.replace('panel','tab');
							$('#' + tabId).addClass('responsive-tabs__list__item--active');

							//scroll to active heading only if it is below previous one
							var tabsPos = $tabs.offset().top;
							var newActivePos = ($tabHeading.offset().top) - 15;
							if(oldActivePos < newActivePos) {
								$('html, body').animate({ scrollTop: tabsPos }, 0).animate({ scrollTop: newActivePos }, 400);
							}
							
						}

						// if this tab panel is already active
						else {

							// hide panel but give it special responsive-tabs__panel--closed-accordion-only class so that it can be visible at desktop size
							$tabPanel.removeClass('responsive-tabs__panel--active').slideToggle(function () { $(this).addClass('responsive-tabs__panel--closed-accordion-only'); });

							//remove active heading class
							$tabHeading.removeClass('responsive-tabs__heading--active');

							//don't alter classes on tabs as we want it active if put back to desktop size
						}
						
					});

					tabcount ++;

				});

				// add finished tab list to its container
				$tabs.prepend($tabList);

				// next set of tabs on page
				tablistcount ++;
			});
		}
	};
})(jQuery);

$(document).ready(function () {
	RESPONSIVEUI.responsiveTabs();
});
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnJlc3BvbnNpdmUtdGFicy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiAtLS0tLS0tLS0tLS0tLS0tXG5SZXNwb25zaXZlVGFicy5qc1xuQXV0aG9yOiBQZXRlIExvdmUgfCB3d3cucGV0ZWxvdmUuY29tXG5WZXJzaW9uOiAxLjEwXG4tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbnZhciBSRVNQT05TSVZFVUkgPSB7fTtcblxuKGZ1bmN0aW9uKCQpIHtcblxuXHRSRVNQT05TSVZFVUkucmVzcG9uc2l2ZVRhYnMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyICR0YWJTZXRzID0gJCgnLnJlc3BvbnNpdmUtdGFicycpO1xuXG5cdFx0aWYgKCEkdGFiU2V0cy5oYXNDbGFzcygncmVzcG9uc2l2ZS10YWJzLS1lbmFibGVkJykpIHtcdC8vIGlmIHdlIGhhdmVuJ3QgYWxyZWFkeSBjYWxsZWQgdGhpcyBmdW5jdGlvbiBhbmQgZW5hYmxlZCB0YWJzXG5cdFx0XHQkdGFiU2V0cy5hZGRDbGFzcygncmVzcG9uc2l2ZS10YWJzLS1lbmFibGVkJyk7XG5cblx0XHRcdC8vbG9vcCB0aHJvdWdoIGFsbCBzZXRzIG9mIHRhYnMgb24gdGhlIHBhZ2Vcblx0XHRcdHZhciB0YWJsaXN0Y291bnQgPSAxO1xuXG5cdFx0XHQkdGFiU2V0cy5lYWNoKGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdHZhciAkdGFicyA9ICQodGhpcyk7XG5cblx0XHRcdFx0Ly8gYWRkIHRhYiBoZWFkaW5nIGFuZCB0YWIgcGFuZWwgY2xhc3Nlc1xuXHRcdFx0XHQkdGFicy5jaGlsZHJlbignOmhlYWRlcicpLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2hlYWRpbmcnKTtcblx0XHRcdFx0JHRhYnMuY2hpbGRyZW4oJ2RpdicpLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsJyk7XG5cblx0XHRcdFx0Ly8gZGV0ZXJtaW5lIGlmIG1hcmt1cCBhbHJlYWR5IGlkZW50aWZpZXMgdGhlIGFjdGl2ZSB0YWIgcGFuZWwgZm9yIHRoaXMgc2V0IG9mIHRhYnNcblx0XHRcdFx0Ly8gaWYgbm90IHRoZW4gc2V0IGZpcnN0IGhlYWRpbmcgYW5kIHRhYiB0byBiZSB0aGUgYWN0aXZlIG9uZVxuXHRcdFx0XHR2YXIgJGFjdGl2ZVBhbmVsID0gJHRhYnMuZmluZCgnLnJlc3BvbnNpdmUtdGFic19fcGFuZWwtLWFjdGl2ZScpO1xuXHRcdFx0XHRpZighJGFjdGl2ZVBhbmVsLmxlbmd0aCkge1xuXHRcdFx0XHRcdCRhY3RpdmVQYW5lbCA9ICR0YWJzLmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX3BhbmVsJykuZmlyc3QoKS5hZGRDbGFzcygncmVzcG9uc2l2ZS10YWJzX19wYW5lbC0tYWN0aXZlJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdGFicy5maW5kKCcucmVzcG9uc2l2ZS10YWJzX19wYW5lbCcpLm5vdCgnLnJlc3BvbnNpdmUtdGFic19fcGFuZWwtLWFjdGl2ZScpLmhpZGUoKS5hdHRyKCdhcmlhLWhpZGRlbicsJ3RydWUnKTsgLy9oaWRlIGFsbCBleGNlcHQgYWN0aXZlIHBhbmVsXG5cdFx0XHRcdCRhY3RpdmVQYW5lbC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXHRcdFx0XHQvKiBtYWtlIGFjdGl2ZSB0YWIgcGFuZWwgaGlkZGVuIGZvciBtb2JpbGUgKi9cblx0XHRcdFx0JGFjdGl2ZVBhbmVsLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1jbG9zZWQtYWNjb3JkaW9uLW9ubHknKTtcblxuXHRcdFx0XHQvLyB3cmFwIHRhYnMgaW4gY29udGFpbmVyIC0gdG8gYmUgZHluYW1pY2FsbHkgcmVzaXplZCB0byBoZWxwIHByZXZlbnQgcGFnZSBqdW1wXG5cdFx0XHRcdHZhciAkdGFic1dyYXBwZXIgPSAkKCc8ZGl2Lz4nLCB7J2NsYXNzJzogJ3Jlc3BvbnNpdmUtdGFicy13cmFwcGVyJyB9KTtcblx0XHRcdFx0JHRhYnMud3JhcCgkdGFic1dyYXBwZXIpO1xuXG5cdFx0XHRcdHZhciBoaWdoZXN0SGVpZ2h0ID0gMDtcblxuXHRcdFx0XHQvLyBkZXRlcm1pbmUgaGVpZ2h0IG9mIHRhbGxlc3QgdGFiIHBhbmVsLiBVc2VkIGxhdGVyIHRvIHByZXZlbnQgcGFnZSBqdW1wIHdoZW4gdGFicyBhcmUgY2xpY2tlZFxuXHRcdFx0XHQkdGFicy5maW5kKCcucmVzcG9uc2l2ZS10YWJzX19wYW5lbCcpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHRhYkhlaWdodCA9ICQodGhpcykuaGVpZ2h0KCk7XG5cdFx0XHRcdFx0aWYgKHRhYkhlaWdodCA+IGhpZ2hlc3RIZWlnaHQpIHtcblx0XHRcdFx0XHRcdGhpZ2hlc3RIZWlnaHQgPSB0YWJIZWlnaHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvL2NyZWF0ZSB0aGUgdGFiIGxpc3Rcblx0XHRcdFx0dmFyICR0YWJMaXN0ID0gJCgnPHVsLz4nLCB7ICdjbGFzcyc6ICdyZXNwb25zaXZlLXRhYnNfX2xpc3QnLCAncm9sZSc6ICd0YWJsaXN0JyB9KTtcblxuXHRcdFx0XHQvL2xvb3AgdGhyb3VnaCBlYWNoIGhlYWRpbmcgaW4gc2V0XG5cdFx0XHRcdHZhciB0YWJjb3VudCA9IDE7XG5cdFx0XHRcdCR0YWJzLmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX2hlYWRpbmcnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdFx0dmFyICR0YWJIZWFkaW5nID0gJCh0aGlzKTtcblx0XHRcdFx0XHR2YXIgJHRhYlBhbmVsID0gJCh0aGlzKS5uZXh0KCk7XG5cblx0XHRcdFx0XHQkdGFiSGVhZGluZy5hdHRyKCd0YWJpbmRleCcsIDApO1xuXG5cdFx0XHRcdFx0Ly8gQ1JFQVRFIFRBQiBJVEVNUyAoVklTSUJMRSBPTiBERVNLVE9QKVxuXHRcdFx0XHRcdC8vY3JlYXRlIHRhYiBsaXN0IGl0ZW0gZnJvbSBoZWFkaW5nXG5cdFx0XHRcdFx0Ly9hc3NvY2lhdGUgdGFiIGxpc3QgaXRlbSB3aXRoIHRhYiBwYW5lbFxuXHRcdFx0XHRcdHZhciAkdGFiTGlzdEl0ZW0gPSAkKCc8bGkvPicsIHtcblx0XHRcdFx0XHRcdCdjbGFzcyc6ICdyZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0nLFxuXHRcdFx0XHRcdFx0aHRtbDogJHRhYkhlYWRpbmcuaHRtbCgpLFxuXHRcdFx0XHRcdFx0aWQ6ICd0YWJsaXN0JyArIHRhYmxpc3Rjb3VudCArICctdGFiJyArIHRhYmNvdW50LFxuXHRcdFx0XHRcdFx0J2FyaWEtY29udHJvbHMnOiAndGFibGlzdCcgKyB0YWJsaXN0Y291bnQgKyctcGFuZWwnICsgdGFiY291bnQsXG5cdFx0XHRcdFx0XHQncm9sZSc6ICd0YWInLFxuXHRcdFx0XHRcdFx0dGFiaW5kZXg6IDAsXG5cdFx0XHRcdFx0XHRrZXlkb3duOiBmdW5jdGlvbiAob2JqRXZlbnQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKG9iakV2ZW50LmtleUNvZGUgPT09IDEzKSB7IC8vIGlmIHVzZXIgcHJlc3NlcyAnZW50ZXInXG5cdFx0XHRcdFx0XHRcdFx0JHRhYkxpc3RJdGVtLmNsaWNrKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdC8vU2hvdyBhc3NvY2lhdGVkIHBhbmVsXG5cblx0XHRcdFx0XHRcdFx0Ly9zZXQgaGVpZ2h0IG9mIHRhYiBjb250YWluZXIgdG8gaGlnaGVzdCBwYW5lbCBoZWlnaHQgdG8gYXZvaWQgcGFnZSBqdW1wXG5cdFx0XHRcdFx0XHRcdCR0YWJzV3JhcHBlci5jc3MoJ2hlaWdodCcsIGhpZ2hlc3RIZWlnaHQpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIHJlbW92ZSBoaWRkZW4gbW9iaWxlIGNsYXNzIGZyb20gYW55IG90aGVyIHBhbmVsIGFzIHdlJ2xsIHdhbnQgdGhhdCBwYW5lbCB0byBiZSBvcGVuIGF0IG1vYmlsZSBzaXplXG5cdFx0XHRcdFx0XHRcdCR0YWJzLmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1jbG9zZWQtYWNjb3JkaW9uLW9ubHknKS5yZW1vdmVDbGFzcygncmVzcG9uc2l2ZS10YWJzX19wYW5lbC0tY2xvc2VkLWFjY29yZGlvbi1vbmx5Jyk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBjdXJyZW50IHBhbmVsIGFuZCByZW1vdmUgYWN0aXZlIHN0YXRlIGZyb20gaXRzIChoaWRkZW4gb24gZGVza3RvcCkgaGVhZGluZ1xuXHRcdFx0XHRcdFx0XHQkdGFicy5maW5kKCcucmVzcG9uc2l2ZS10YWJzX19wYW5lbC0tYWN0aXZlJykudG9nZ2xlKCkucmVtb3ZlQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19fcGFuZWwtLWFjdGl2ZScpLmF0dHIoJ2FyaWEtaGlkZGVuJywndHJ1ZScpLnByZXYoKS5yZW1vdmVDbGFzcygncmVzcG9uc2l2ZS10YWJzX19oZWFkaW5nLS1hY3RpdmUnKTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdC8vbWFrZSB0aGlzIHRhYiBwYW5lbCBhY3RpdmVcblx0XHRcdFx0XHRcdFx0JHRhYlBhbmVsLnRvZ2dsZSgpLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1hY3RpdmUnKS5hdHRyKCdhcmlhLWhpZGRlbicsJ2ZhbHNlJyk7XG5cblx0XHRcdFx0XHRcdFx0Ly9tYWtlIHRoZSBoaWRkZW4gaGVhZGluZyBhY3RpdmVcblx0XHRcdFx0XHRcdFx0JHRhYkhlYWRpbmcuYWRkQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19faGVhZGluZy0tYWN0aXZlJyk7XG5cblx0XHRcdFx0XHRcdFx0Ly9yZW1vdmUgYWN0aXZlIHN0YXRlIGZyb20gY3VycmVudGx5IGFjdGl2ZSB0YWIgbGlzdCBpdGVtXG5cdFx0XHRcdFx0XHRcdCR0YWJMaXN0LmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpO1xuXG5cdFx0XHRcdFx0XHRcdC8vbWFrZSB0aGlzIHRhYiBhY3RpdmVcblx0XHRcdFx0XHRcdFx0JHRhYkxpc3RJdGVtLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpO1xuXG5cdFx0XHRcdFx0XHRcdC8vcmVzZXQgaGVpZ2h0IG9mIHRhYiBwYW5lbHMgdG8gYXV0b1xuXHRcdFx0XHRcdFx0XHQkdGFic1dyYXBwZXIuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vYXNzb2NpYXRlIHRhYiBwYW5lbCB3aXRoIHRhYiBsaXN0IGl0ZW1cblx0XHRcdFx0XHQkdGFiUGFuZWwuYXR0cih7XG5cdFx0XHRcdFx0XHQncm9sZSc6ICd0YWJwYW5lbCcsXG5cdFx0XHRcdFx0XHQnYXJpYS1sYWJlbGxlZGJ5JzogJHRhYkxpc3RJdGVtLmF0dHIoJ2lkJyksXG5cdFx0XHRcdFx0XHRpZDogJ3RhYmxpc3QnICsgdGFibGlzdGNvdW50ICsgJy1wYW5lbCcgKyB0YWJjb3VudFxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Ly8gaWYgdGhpcyBpcyB0aGUgYWN0aXZlIHBhbmVsIHRoZW4gbWFrZSBpdCB0aGUgYWN0aXZlIHRhYiBpdGVtXG5cdFx0XHRcdFx0aWYoJHRhYlBhbmVsLmhhc0NsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1hY3RpdmUnKSkge1xuXHRcdFx0XHRcdFx0JHRhYkxpc3RJdGVtLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGFkZCB0YWIgaXRlbVxuXHRcdFx0XHRcdCR0YWJMaXN0LmFwcGVuZCgkdGFiTGlzdEl0ZW0pO1xuXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Ly8gVEFCIEhFQURJTkdTIChWSVNJQkxFIE9OIE1PQklMRSlcblx0XHRcdFx0XHQvLyBpZiB1c2VyIHByZXNzZXMgJ2VudGVyJyBvbiB0YWIgaGVhZGluZyB0cmlnZ2VyIHRoZSBjbGljayBldmVudFxuXHRcdFx0XHRcdCR0YWJIZWFkaW5nLmtleWRvd24oZnVuY3Rpb24ob2JqRXZlbnQpIHtcblx0XHRcdFx0XHRcdGlmIChvYmpFdmVudC5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0XHRcdFx0XHQkdGFiSGVhZGluZy5jbGljaygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Ly90b2dnbGUgdGFiIHBhbmVsIGlmIGNsaWNrIGhlYWRpbmcgKG9uIG1vYmlsZSlcblx0XHRcdFx0XHQkdGFiSGVhZGluZy5jbGljayhmdW5jdGlvbigpIHtcblxuXHRcdFx0XHRcdFx0Ly8gcmVtb3ZlIGFueSBoaWRkZW4gbW9iaWxlIGNsYXNzXG5cdFx0XHRcdFx0XHQkdGFicy5maW5kKCcucmVzcG9uc2l2ZS10YWJzX19wYW5lbC0tY2xvc2VkLWFjY29yZGlvbi1vbmx5JykucmVtb3ZlQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19fcGFuZWwtLWNsb3NlZC1hY2NvcmRpb24tb25seScpO1xuXG5cdFx0XHRcdFx0XHQvLyBpZiB0aGlzIGlzbid0IGN1cnJlbnRseSBhY3RpdmVcblx0XHRcdFx0XHRcdGlmICghJHRhYkhlYWRpbmcuaGFzQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19faGVhZGluZy0tYWN0aXZlJykpe1xuXG5cdFx0XHRcdFx0XHRcdHZhciBvbGRBY3RpdmVQb3MsXG5cdFx0XHRcdFx0XHRcdFx0JGFjdGl2ZUhlYWRpbmcgPSAkdGFicy5maW5kKCcucmVzcG9uc2l2ZS10YWJzX19oZWFkaW5nLS1hY3RpdmUnKTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0Ly8gaWYgdGhlcmUgaXMgYW4gYWN0aXZlIGhlYWRpbmcsIGdldCBpdHMgcG9zaXRpb25cblx0XHRcdFx0XHRcdFx0aWYoJGFjdGl2ZUhlYWRpbmcubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0b2xkQWN0aXZlUG9zID0gJGFjdGl2ZUhlYWRpbmcub2Zmc2V0KCkudG9wO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBjdXJyZW50bHkgYWN0aXZlIHBhbmVsIGFuZCByZW1vdmUgYWN0aXZlIHN0YXRlIGZyb20gYW55IGhpZGRlbiBoZWFkaW5nXG5cdFx0XHRcdFx0XHRcdCR0YWJzLmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1hY3RpdmUnKS5zbGlkZVRvZ2dsZSgpLnJlbW92ZUNsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1hY3RpdmUnKS5wcmV2KCkucmVtb3ZlQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19faGVhZGluZy0tYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQvL2Nsb3NlIGFsbCB0YWJzXG5cdFx0XHRcdFx0XHRcdCR0YWJzLmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX3BhbmVsJykuaGlkZSgpLmF0dHIoJ2FyaWEtaGlkZGVuJywndHJ1ZScpO1xuXG5cdFx0XHRcdFx0XHRcdC8vb3BlbiB0aGlzIHBhbmVsXG5cdFx0XHRcdFx0XHRcdCR0YWJQYW5lbC5zbGlkZVRvZ2dsZSgpLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1hY3RpdmUnKS5hdHRyKCdhcmlhLWhpZGRlbicsJ2ZhbHNlJyk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gbWFrZSB0aGlzIGhlYWRpbmcgYWN0aXZlXG5cdFx0XHRcdFx0XHRcdCR0YWJIZWFkaW5nLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2hlYWRpbmctLWFjdGl2ZScpO1xuXG5cdFx0XHRcdFx0XHRcdHZhciAkY3VycmVudEFjdGl2ZSA9ICR0YWJzLmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpO1xuXG5cdFx0XHRcdFx0XHRcdC8vc2V0IHRoZSBhY3RpdmUgdGFiIGxpc3QgaXRlbSAoZm9yIGRlc2t0b3ApXG5cdFx0XHRcdFx0XHRcdCRjdXJyZW50QWN0aXZlLnJlbW92ZUNsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpO1xuXHRcdFx0XHRcdFx0XHR2YXIgcGFuZWxJZCA9ICR0YWJQYW5lbC5hdHRyKCdpZCcpO1xuXHRcdFx0XHRcdFx0XHR2YXIgdGFiSWQgPSBwYW5lbElkLnJlcGxhY2UoJ3BhbmVsJywndGFiJyk7XG5cdFx0XHRcdFx0XHRcdCQoJyMnICsgdGFiSWQpLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpO1xuXG5cdFx0XHRcdFx0XHRcdC8vc2Nyb2xsIHRvIGFjdGl2ZSBoZWFkaW5nIG9ubHkgaWYgaXQgaXMgYmVsb3cgcHJldmlvdXMgb25lXG5cdFx0XHRcdFx0XHRcdHZhciB0YWJzUG9zID0gJHRhYnMub2Zmc2V0KCkudG9wO1xuXHRcdFx0XHRcdFx0XHR2YXIgbmV3QWN0aXZlUG9zID0gKCR0YWJIZWFkaW5nLm9mZnNldCgpLnRvcCkgLSAxNTtcblx0XHRcdFx0XHRcdFx0aWYob2xkQWN0aXZlUG9zIDwgbmV3QWN0aXZlUG9zKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IHRhYnNQb3MgfSwgMCkuYW5pbWF0ZSh7IHNjcm9sbFRvcDogbmV3QWN0aXZlUG9zIH0sIDQwMCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIGlmIHRoaXMgdGFiIHBhbmVsIGlzIGFscmVhZHkgYWN0aXZlXG5cdFx0XHRcdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBoaWRlIHBhbmVsIGJ1dCBnaXZlIGl0IHNwZWNpYWwgcmVzcG9uc2l2ZS10YWJzX19wYW5lbC0tY2xvc2VkLWFjY29yZGlvbi1vbmx5IGNsYXNzIHNvIHRoYXQgaXQgY2FuIGJlIHZpc2libGUgYXQgZGVza3RvcCBzaXplXG5cdFx0XHRcdFx0XHRcdCR0YWJQYW5lbC5yZW1vdmVDbGFzcygncmVzcG9uc2l2ZS10YWJzX19wYW5lbC0tYWN0aXZlJykuc2xpZGVUb2dnbGUoZnVuY3Rpb24gKCkgeyAkKHRoaXMpLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1jbG9zZWQtYWNjb3JkaW9uLW9ubHknKTsgfSk7XG5cblx0XHRcdFx0XHRcdFx0Ly9yZW1vdmUgYWN0aXZlIGhlYWRpbmcgY2xhc3Ncblx0XHRcdFx0XHRcdFx0JHRhYkhlYWRpbmcucmVtb3ZlQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19faGVhZGluZy0tYWN0aXZlJyk7XG5cblx0XHRcdFx0XHRcdFx0Ly9kb24ndCBhbHRlciBjbGFzc2VzIG9uIHRhYnMgYXMgd2Ugd2FudCBpdCBhY3RpdmUgaWYgcHV0IGJhY2sgdG8gZGVza3RvcCBzaXplXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHRhYmNvdW50ICsrO1xuXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIGFkZCBmaW5pc2hlZCB0YWIgbGlzdCB0byBpdHMgY29udGFpbmVyXG5cdFx0XHRcdCR0YWJzLnByZXBlbmQoJHRhYkxpc3QpO1xuXG5cdFx0XHRcdC8vIG5leHQgc2V0IG9mIHRhYnMgb24gcGFnZVxuXHRcdFx0XHR0YWJsaXN0Y291bnQgKys7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG59KShqUXVlcnkpO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdFJFU1BPTlNJVkVVSS5yZXNwb25zaXZlVGFicygpO1xufSk7Il19
