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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnJlc3BvbnNpdmUtdGFicy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiAtLS0tLS0tLS0tLS0tLS0tXHJcblJlc3BvbnNpdmVUYWJzLmpzXHJcbkF1dGhvcjogUGV0ZSBMb3ZlIHwgd3d3LnBldGVsb3ZlLmNvbVxyXG5WZXJzaW9uOiAxLjEwXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbnZhciBSRVNQT05TSVZFVUkgPSB7fTtcclxuXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdFJFU1BPTlNJVkVVSS5yZXNwb25zaXZlVGFicyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciAkdGFiU2V0cyA9ICQoJy5yZXNwb25zaXZlLXRhYnMnKTtcclxuXHJcblx0XHRpZiAoISR0YWJTZXRzLmhhc0NsYXNzKCdyZXNwb25zaXZlLXRhYnMtLWVuYWJsZWQnKSkge1x0Ly8gaWYgd2UgaGF2ZW4ndCBhbHJlYWR5IGNhbGxlZCB0aGlzIGZ1bmN0aW9uIGFuZCBlbmFibGVkIHRhYnNcclxuXHRcdFx0JHRhYlNldHMuYWRkQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFicy0tZW5hYmxlZCcpO1xyXG5cclxuXHRcdFx0Ly9sb29wIHRocm91Z2ggYWxsIHNldHMgb2YgdGFicyBvbiB0aGUgcGFnZVxyXG5cdFx0XHR2YXIgdGFibGlzdGNvdW50ID0gMTtcclxuXHJcblx0XHRcdCR0YWJTZXRzLmVhY2goZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdHZhciAkdGFicyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdC8vIGFkZCB0YWIgaGVhZGluZyBhbmQgdGFiIHBhbmVsIGNsYXNzZXNcclxuXHRcdFx0XHQkdGFicy5jaGlsZHJlbignOmhlYWRlcicpLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2hlYWRpbmcnKTtcclxuXHRcdFx0XHQkdGFicy5jaGlsZHJlbignZGl2JykuYWRkQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19fcGFuZWwnKTtcclxuXHJcblx0XHRcdFx0Ly8gZGV0ZXJtaW5lIGlmIG1hcmt1cCBhbHJlYWR5IGlkZW50aWZpZXMgdGhlIGFjdGl2ZSB0YWIgcGFuZWwgZm9yIHRoaXMgc2V0IG9mIHRhYnNcclxuXHRcdFx0XHQvLyBpZiBub3QgdGhlbiBzZXQgZmlyc3QgaGVhZGluZyBhbmQgdGFiIHRvIGJlIHRoZSBhY3RpdmUgb25lXHJcblx0XHRcdFx0dmFyICRhY3RpdmVQYW5lbCA9ICR0YWJzLmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1hY3RpdmUnKTtcclxuXHRcdFx0XHRpZighJGFjdGl2ZVBhbmVsLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0JGFjdGl2ZVBhbmVsID0gJHRhYnMuZmluZCgnLnJlc3BvbnNpdmUtdGFic19fcGFuZWwnKS5maXJzdCgpLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1hY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCR0YWJzLmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX3BhbmVsJykubm90KCcucmVzcG9uc2l2ZS10YWJzX19wYW5lbC0tYWN0aXZlJykuaGlkZSgpLmF0dHIoJ2FyaWEtaGlkZGVuJywndHJ1ZScpOyAvL2hpZGUgYWxsIGV4Y2VwdCBhY3RpdmUgcGFuZWxcclxuXHRcdFx0XHQkYWN0aXZlUGFuZWwuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHRcdFx0XHQvKiBtYWtlIGFjdGl2ZSB0YWIgcGFuZWwgaGlkZGVuIGZvciBtb2JpbGUgKi9cclxuXHRcdFx0XHQkYWN0aXZlUGFuZWwuYWRkQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19fcGFuZWwtLWNsb3NlZC1hY2NvcmRpb24tb25seScpO1xyXG5cclxuXHRcdFx0XHQvLyB3cmFwIHRhYnMgaW4gY29udGFpbmVyIC0gdG8gYmUgZHluYW1pY2FsbHkgcmVzaXplZCB0byBoZWxwIHByZXZlbnQgcGFnZSBqdW1wXHJcblx0XHRcdFx0dmFyICR0YWJzV3JhcHBlciA9ICQoJzxkaXYvPicsIHsnY2xhc3MnOiAncmVzcG9uc2l2ZS10YWJzLXdyYXBwZXInIH0pO1xyXG5cdFx0XHRcdCR0YWJzLndyYXAoJHRhYnNXcmFwcGVyKTtcclxuXHJcblx0XHRcdFx0dmFyIGhpZ2hlc3RIZWlnaHQgPSAwO1xyXG5cclxuXHRcdFx0XHQvLyBkZXRlcm1pbmUgaGVpZ2h0IG9mIHRhbGxlc3QgdGFiIHBhbmVsLiBVc2VkIGxhdGVyIHRvIHByZXZlbnQgcGFnZSBqdW1wIHdoZW4gdGFicyBhcmUgY2xpY2tlZFxyXG5cdFx0XHRcdCR0YWJzLmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX3BhbmVsJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciB0YWJIZWlnaHQgPSAkKHRoaXMpLmhlaWdodCgpO1xyXG5cdFx0XHRcdFx0aWYgKHRhYkhlaWdodCA+IGhpZ2hlc3RIZWlnaHQpIHtcclxuXHRcdFx0XHRcdFx0aGlnaGVzdEhlaWdodCA9IHRhYkhlaWdodDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly9jcmVhdGUgdGhlIHRhYiBsaXN0XHJcblx0XHRcdFx0dmFyICR0YWJMaXN0ID0gJCgnPHVsLz4nLCB7ICdjbGFzcyc6ICdyZXNwb25zaXZlLXRhYnNfX2xpc3QnLCAncm9sZSc6ICd0YWJsaXN0JyB9KTtcclxuXHJcblx0XHRcdFx0Ly9sb29wIHRocm91Z2ggZWFjaCBoZWFkaW5nIGluIHNldFxyXG5cdFx0XHRcdHZhciB0YWJjb3VudCA9IDE7XHJcblx0XHRcdFx0JHRhYnMuZmluZCgnLnJlc3BvbnNpdmUtdGFic19faGVhZGluZycpLmVhY2goZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdFx0dmFyICR0YWJIZWFkaW5nID0gJCh0aGlzKTtcclxuXHRcdFx0XHRcdHZhciAkdGFiUGFuZWwgPSAkKHRoaXMpLm5leHQoKTtcclxuXHJcblx0XHRcdFx0XHQkdGFiSGVhZGluZy5hdHRyKCd0YWJpbmRleCcsIDApO1xyXG5cclxuXHRcdFx0XHRcdC8vIENSRUFURSBUQUIgSVRFTVMgKFZJU0lCTEUgT04gREVTS1RPUClcclxuXHRcdFx0XHRcdC8vY3JlYXRlIHRhYiBsaXN0IGl0ZW0gZnJvbSBoZWFkaW5nXHJcblx0XHRcdFx0XHQvL2Fzc29jaWF0ZSB0YWIgbGlzdCBpdGVtIHdpdGggdGFiIHBhbmVsXHJcblx0XHRcdFx0XHR2YXIgJHRhYkxpc3RJdGVtID0gJCgnPGxpLz4nLCB7XHJcblx0XHRcdFx0XHRcdCdjbGFzcyc6ICdyZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0nLFxyXG5cdFx0XHRcdFx0XHRodG1sOiAkdGFiSGVhZGluZy5odG1sKCksXHJcblx0XHRcdFx0XHRcdGlkOiAndGFibGlzdCcgKyB0YWJsaXN0Y291bnQgKyAnLXRhYicgKyB0YWJjb3VudCxcclxuXHRcdFx0XHRcdFx0J2FyaWEtY29udHJvbHMnOiAndGFibGlzdCcgKyB0YWJsaXN0Y291bnQgKyctcGFuZWwnICsgdGFiY291bnQsXHJcblx0XHRcdFx0XHRcdCdyb2xlJzogJ3RhYicsXHJcblx0XHRcdFx0XHRcdHRhYmluZGV4OiAwLFxyXG5cdFx0XHRcdFx0XHRrZXlkb3duOiBmdW5jdGlvbiAob2JqRXZlbnQpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAob2JqRXZlbnQua2V5Q29kZSA9PT0gMTMpIHsgLy8gaWYgdXNlciBwcmVzc2VzICdlbnRlcidcclxuXHRcdFx0XHRcdFx0XHRcdCR0YWJMaXN0SXRlbS5jbGljaygpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vU2hvdyBhc3NvY2lhdGVkIHBhbmVsXHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vc2V0IGhlaWdodCBvZiB0YWIgY29udGFpbmVyIHRvIGhpZ2hlc3QgcGFuZWwgaGVpZ2h0IHRvIGF2b2lkIHBhZ2UganVtcFxyXG5cdFx0XHRcdFx0XHRcdCR0YWJzV3JhcHBlci5jc3MoJ2hlaWdodCcsIGhpZ2hlc3RIZWlnaHQpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyByZW1vdmUgaGlkZGVuIG1vYmlsZSBjbGFzcyBmcm9tIGFueSBvdGhlciBwYW5lbCBhcyB3ZSdsbCB3YW50IHRoYXQgcGFuZWwgdG8gYmUgb3BlbiBhdCBtb2JpbGUgc2l6ZVxyXG5cdFx0XHRcdFx0XHRcdCR0YWJzLmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1jbG9zZWQtYWNjb3JkaW9uLW9ubHknKS5yZW1vdmVDbGFzcygncmVzcG9uc2l2ZS10YWJzX19wYW5lbC0tY2xvc2VkLWFjY29yZGlvbi1vbmx5Jyk7XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgY3VycmVudCBwYW5lbCBhbmQgcmVtb3ZlIGFjdGl2ZSBzdGF0ZSBmcm9tIGl0cyAoaGlkZGVuIG9uIGRlc2t0b3ApIGhlYWRpbmdcclxuXHRcdFx0XHRcdFx0XHQkdGFicy5maW5kKCcucmVzcG9uc2l2ZS10YWJzX19wYW5lbC0tYWN0aXZlJykudG9nZ2xlKCkucmVtb3ZlQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19fcGFuZWwtLWFjdGl2ZScpLmF0dHIoJ2FyaWEtaGlkZGVuJywndHJ1ZScpLnByZXYoKS5yZW1vdmVDbGFzcygncmVzcG9uc2l2ZS10YWJzX19oZWFkaW5nLS1hY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHQvL21ha2UgdGhpcyB0YWIgcGFuZWwgYWN0aXZlXHJcblx0XHRcdFx0XHRcdFx0JHRhYlBhbmVsLnRvZ2dsZSgpLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1hY3RpdmUnKS5hdHRyKCdhcmlhLWhpZGRlbicsJ2ZhbHNlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vbWFrZSB0aGUgaGlkZGVuIGhlYWRpbmcgYWN0aXZlXHJcblx0XHRcdFx0XHRcdFx0JHRhYkhlYWRpbmcuYWRkQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19faGVhZGluZy0tYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vcmVtb3ZlIGFjdGl2ZSBzdGF0ZSBmcm9tIGN1cnJlbnRseSBhY3RpdmUgdGFiIGxpc3QgaXRlbVxyXG5cdFx0XHRcdFx0XHRcdCR0YWJMaXN0LmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvL21ha2UgdGhpcyB0YWIgYWN0aXZlXHJcblx0XHRcdFx0XHRcdFx0JHRhYkxpc3RJdGVtLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvL3Jlc2V0IGhlaWdodCBvZiB0YWIgcGFuZWxzIHRvIGF1dG9cclxuXHRcdFx0XHRcdFx0XHQkdGFic1dyYXBwZXIuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Ly9hc3NvY2lhdGUgdGFiIHBhbmVsIHdpdGggdGFiIGxpc3QgaXRlbVxyXG5cdFx0XHRcdFx0JHRhYlBhbmVsLmF0dHIoe1xyXG5cdFx0XHRcdFx0XHQncm9sZSc6ICd0YWJwYW5lbCcsXHJcblx0XHRcdFx0XHRcdCdhcmlhLWxhYmVsbGVkYnknOiAkdGFiTGlzdEl0ZW0uYXR0cignaWQnKSxcclxuXHRcdFx0XHRcdFx0aWQ6ICd0YWJsaXN0JyArIHRhYmxpc3Rjb3VudCArICctcGFuZWwnICsgdGFiY291bnRcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdC8vIGlmIHRoaXMgaXMgdGhlIGFjdGl2ZSBwYW5lbCB0aGVuIG1ha2UgaXQgdGhlIGFjdGl2ZSB0YWIgaXRlbVxyXG5cdFx0XHRcdFx0aWYoJHRhYlBhbmVsLmhhc0NsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1hY3RpdmUnKSkge1xyXG5cdFx0XHRcdFx0XHQkdGFiTGlzdEl0ZW0uYWRkQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19fbGlzdF9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gYWRkIHRhYiBpdGVtXHJcblx0XHRcdFx0XHQkdGFiTGlzdC5hcHBlbmQoJHRhYkxpc3RJdGVtKTtcclxuXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIFRBQiBIRUFESU5HUyAoVklTSUJMRSBPTiBNT0JJTEUpXHJcblx0XHRcdFx0XHQvLyBpZiB1c2VyIHByZXNzZXMgJ2VudGVyJyBvbiB0YWIgaGVhZGluZyB0cmlnZ2VyIHRoZSBjbGljayBldmVudFxyXG5cdFx0XHRcdFx0JHRhYkhlYWRpbmcua2V5ZG93bihmdW5jdGlvbihvYmpFdmVudCkge1xyXG5cdFx0XHRcdFx0XHRpZiAob2JqRXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcclxuXHRcdFx0XHRcdFx0XHQkdGFiSGVhZGluZy5jbGljaygpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHQvL3RvZ2dsZSB0YWIgcGFuZWwgaWYgY2xpY2sgaGVhZGluZyAob24gbW9iaWxlKVxyXG5cdFx0XHRcdFx0JHRhYkhlYWRpbmcuY2xpY2soZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyByZW1vdmUgYW55IGhpZGRlbiBtb2JpbGUgY2xhc3NcclxuXHRcdFx0XHRcdFx0JHRhYnMuZmluZCgnLnJlc3BvbnNpdmUtdGFic19fcGFuZWwtLWNsb3NlZC1hY2NvcmRpb24tb25seScpLnJlbW92ZUNsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1jbG9zZWQtYWNjb3JkaW9uLW9ubHknKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIGlmIHRoaXMgaXNuJ3QgY3VycmVudGx5IGFjdGl2ZVxyXG5cdFx0XHRcdFx0XHRpZiAoISR0YWJIZWFkaW5nLmhhc0NsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2hlYWRpbmctLWFjdGl2ZScpKXtcclxuXHJcblx0XHRcdFx0XHRcdFx0dmFyIG9sZEFjdGl2ZVBvcyxcclxuXHRcdFx0XHRcdFx0XHRcdCRhY3RpdmVIZWFkaW5nID0gJHRhYnMuZmluZCgnLnJlc3BvbnNpdmUtdGFic19faGVhZGluZy0tYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHQvLyBpZiB0aGVyZSBpcyBhbiBhY3RpdmUgaGVhZGluZywgZ2V0IGl0cyBwb3NpdGlvblxyXG5cdFx0XHRcdFx0XHRcdGlmKCRhY3RpdmVIZWFkaW5nLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2xkQWN0aXZlUG9zID0gJGFjdGl2ZUhlYWRpbmcub2Zmc2V0KCkudG9wO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBjdXJyZW50bHkgYWN0aXZlIHBhbmVsIGFuZCByZW1vdmUgYWN0aXZlIHN0YXRlIGZyb20gYW55IGhpZGRlbiBoZWFkaW5nXHJcblx0XHRcdFx0XHRcdFx0JHRhYnMuZmluZCgnLnJlc3BvbnNpdmUtdGFic19fcGFuZWwtLWFjdGl2ZScpLnNsaWRlVG9nZ2xlKCkucmVtb3ZlQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19fcGFuZWwtLWFjdGl2ZScpLnByZXYoKS5yZW1vdmVDbGFzcygncmVzcG9uc2l2ZS10YWJzX19oZWFkaW5nLS1hY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHQvL2Nsb3NlIGFsbCB0YWJzXHJcblx0XHRcdFx0XHRcdFx0JHRhYnMuZmluZCgnLnJlc3BvbnNpdmUtdGFic19fcGFuZWwnKS5oaWRlKCkuYXR0cignYXJpYS1oaWRkZW4nLCd0cnVlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vb3BlbiB0aGlzIHBhbmVsXHJcblx0XHRcdFx0XHRcdFx0JHRhYlBhbmVsLnNsaWRlVG9nZ2xlKCkuYWRkQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19fcGFuZWwtLWFjdGl2ZScpLmF0dHIoJ2FyaWEtaGlkZGVuJywnZmFsc2UnKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gbWFrZSB0aGlzIGhlYWRpbmcgYWN0aXZlXHJcblx0XHRcdFx0XHRcdFx0JHRhYkhlYWRpbmcuYWRkQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19faGVhZGluZy0tYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciAkY3VycmVudEFjdGl2ZSA9ICR0YWJzLmZpbmQoJy5yZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvL3NldCB0aGUgYWN0aXZlIHRhYiBsaXN0IGl0ZW0gKGZvciBkZXNrdG9wKVxyXG5cdFx0XHRcdFx0XHRcdCRjdXJyZW50QWN0aXZlLnJlbW92ZUNsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBwYW5lbElkID0gJHRhYlBhbmVsLmF0dHIoJ2lkJyk7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHRhYklkID0gcGFuZWxJZC5yZXBsYWNlKCdwYW5lbCcsJ3RhYicpO1xyXG5cdFx0XHRcdFx0XHRcdCQoJyMnICsgdGFiSWQpLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX2xpc3RfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvL3Njcm9sbCB0byBhY3RpdmUgaGVhZGluZyBvbmx5IGlmIGl0IGlzIGJlbG93IHByZXZpb3VzIG9uZVxyXG5cdFx0XHRcdFx0XHRcdHZhciB0YWJzUG9zID0gJHRhYnMub2Zmc2V0KCkudG9wO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBuZXdBY3RpdmVQb3MgPSAoJHRhYkhlYWRpbmcub2Zmc2V0KCkudG9wKSAtIDE1O1xyXG5cdFx0XHRcdFx0XHRcdGlmKG9sZEFjdGl2ZVBvcyA8IG5ld0FjdGl2ZVBvcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IHRhYnNQb3MgfSwgMCkuYW5pbWF0ZSh7IHNjcm9sbFRvcDogbmV3QWN0aXZlUG9zIH0sIDQwMCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBpZiB0aGlzIHRhYiBwYW5lbCBpcyBhbHJlYWR5IGFjdGl2ZVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gaGlkZSBwYW5lbCBidXQgZ2l2ZSBpdCBzcGVjaWFsIHJlc3BvbnNpdmUtdGFic19fcGFuZWwtLWNsb3NlZC1hY2NvcmRpb24tb25seSBjbGFzcyBzbyB0aGF0IGl0IGNhbiBiZSB2aXNpYmxlIGF0IGRlc2t0b3Agc2l6ZVxyXG5cdFx0XHRcdFx0XHRcdCR0YWJQYW5lbC5yZW1vdmVDbGFzcygncmVzcG9uc2l2ZS10YWJzX19wYW5lbC0tYWN0aXZlJykuc2xpZGVUb2dnbGUoZnVuY3Rpb24gKCkgeyAkKHRoaXMpLmFkZENsYXNzKCdyZXNwb25zaXZlLXRhYnNfX3BhbmVsLS1jbG9zZWQtYWNjb3JkaW9uLW9ubHknKTsgfSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vcmVtb3ZlIGFjdGl2ZSBoZWFkaW5nIGNsYXNzXHJcblx0XHRcdFx0XHRcdFx0JHRhYkhlYWRpbmcucmVtb3ZlQ2xhc3MoJ3Jlc3BvbnNpdmUtdGFic19faGVhZGluZy0tYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vZG9uJ3QgYWx0ZXIgY2xhc3NlcyBvbiB0YWJzIGFzIHdlIHdhbnQgaXQgYWN0aXZlIGlmIHB1dCBiYWNrIHRvIGRlc2t0b3Agc2l6ZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0dGFiY291bnQgKys7XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQvLyBhZGQgZmluaXNoZWQgdGFiIGxpc3QgdG8gaXRzIGNvbnRhaW5lclxyXG5cdFx0XHRcdCR0YWJzLnByZXBlbmQoJHRhYkxpc3QpO1xyXG5cclxuXHRcdFx0XHQvLyBuZXh0IHNldCBvZiB0YWJzIG9uIHBhZ2VcclxuXHRcdFx0XHR0YWJsaXN0Y291bnQgKys7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH07XHJcbn0pKGpRdWVyeSk7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0UkVTUE9OU0lWRVVJLnJlc3BvbnNpdmVUYWJzKCk7XHJcbn0pOyJdfQ==
