(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
jQuery(function($){

	// two navigation functions have been setup based on the namespacing of
	// 'nav' vs 'navigation'.
	//
	// Navigation namespacing:
	// - 'nav' refers to the earlier version of the navivgation
	// - 'navigation' refers to the newer version of the navigation
	//
	// Since both follow similar internal conventions, the javascript that loads
	// these is being isolated to being setup based on the navigation wrapper class.
	// Both should not be loaded on the same page, to avoid conflicts and unexpected
	// behavour.

	function navigationSetup() {

		var $layoutHeader = $('.layout-header'),
			headerHeight = $layoutHeader.outerHeight(),
			minNavHeight = Math.round($('.navigation-tab-controls').outerHeight()),
			viewportWidth = $(window).width(),
			viewportWidthBreakpoint = 960,
			$supplementContainer = $('.navigation-tab-content'),
			// timer to prevent multiple resize events
			resizeTimer;

		$('.layout-navigation-open').click(function(e) {
			e.preventDefault();

			$('.layout-navigation').toggleClass('navigation-active');
			$('body').toggleClass('navigation-open');

			$('.navigation-secondary.navigation-active').removeClass('navigation-active');
			$('.navigation-supplementary.navigation-active').removeClass('navigation-active');
			$('.tab-control.active').removeClass('active');
		});
		
		$('.select-country').click(function(e) {
			e.preventDefault();
			$('body').addClass('country-modal-active');
		});
		
		// added event to detect Country modal close
		$('.country-modal-close, .layout-modal-overlay').click(function(e) {
			e.preventDefault();
			$('body').removeClass('country-modal-active');
		});

		$('.contact-bmc').click(function(e) {
			e.preventDefault();
			$('body').addClass('contact-modal-active');
		});

		$('.modal-close, .layout-modal-overlay').click(function(e) {
			e.preventDefault();
			$('body').removeClass('contact-modal-active');
		});

		$('.layout-navigation-close').click(function(e) {
			e.preventDefault();

			$('.layout-navigation').toggleClass('navigation-active');
			$('body').toggleClass('navigation-open');
		});

		// toggleClass active on primary navigation links
		$('.navigation-secondary-toggle > a').click(function(e){

			var $thisNavSecondary = $(this).next('.navigation-secondary');
			var $this = $(this);
			var $thisParent = $this.parent();
			var maxNavHeight = $(window).height() - 50;
			var $thisPosition = $(this).position();
			var thisLeft = $thisPosition.left || 0;
			var thisNavSecondaryLeft;

			e.preventDefault();

			$('.navigation-primary')
				.find('.navigation-secondary')
				.not($thisNavSecondary)
				.removeClass('navigation-active')
				.attr('style', '');

			$('.navigation-primary')
				.find('.navigation-secondary-toggle.hinted')
				.not($thisParent)
				.removeClass('hinted');

			$this.parent().toggleClass('hinted');

			$thisNavSecondary.toggleClass('navigation-active');

			if ( $thisNavSecondary.hasClass('navigation-active') ) {
				$thisNavSecondary.css('max-height', maxNavHeight);
			} else {
				$thisNavSecondary.attr('style', '');
			}

			// NAV PRODUCTS & SOLUTIONS
			// set the height of the tab containers to be equal
			if ( $thisNavSecondary.hasClass('navigation-tabbed-menu') ) {
				equalHeightNavColumns(minNavHeight);
			}

			// correctly set position for secondary nav
			setSecondaryNavPosition( $this );
		});

		$( window ).on( 'resize', function(e) {
			clearTimeout(resizeTimer);
			// https://css-tricks.com/snippets/jquery/done-resizing-event/
			resizeTimer = setTimeout(function() {
				// reset doc size based variables
				viewportWidth = $(window).width();
				minNavHeight = Math.round($('.navigation-tab-controls').outerHeight());
				// launch doc size based functions
				if ( $( '.navigation-secondary.navigation-active' ).siblings( 'a' ).length > 0 ){
					setSecondaryNavPosition( $( '.navigation-secondary.navigation-active' ).siblings( 'a' ) );
				}
				equalHeightNavColumns(minNavHeight);
			}, 250);
		});

		// exposes the primary nav items when in a scrolled-down or scrolled-up state
		$('.navigation-menu-link').click(function(e) {
			e.preventDefault();
			$('body').toggleClass('display-scrolled-menu');
		});

		// Dismisses menu if taps are made outside of the menu
		$('body').on('click', function(e){
			var $target = $(e.target);
			var clickInNav = $(e.target).parents('.navigation-secondary, .layout-navigation, .layout-contact-modal').addBack('.navigation-secondary');

			if (!$target.hasClass('layout-modal-overlay')) {
				if (!clickInNav.length) {
					$('.navigation-secondary').removeClass('navigation-active').attr('style', '');
					$('.navigation-secondary-toggle').removeClass('hinted');
				}
			}

		});

		$('.navigation-secondary-close').click(function(e) {
			$parent = $(this).parents('.navigation-secondary');
			$parent
				.removeClass('navigation-active')
				.attr('style', '');
		});

		// .navigation-tabbed-menu tab functionality
		$('.tab-control').click(function(e) {
			e.preventDefault();
			$this = $(this);
			$supplementNav = $this.next('.navigation-supplementary');

			$('.navigation-supplementary').removeClass('navigation-active');
			$('.tab-control').removeClass('active-tab');
			$this.addClass('active-tab');

			// clear out the supplement container
			$supplementContainer.html('');
			// and populate it with the appropriate menu
			$supplementNav
				.clone()
				.appendTo($supplementContainer);

			// equalize the column heights
			equalHeightNavColumns(minNavHeight);

			$supplementContainer
				.find('.navigation-supplementary')
				.addClass('navigation-active'); // doesn't trigger css transition animation :(
		});

		// navigation-supplementary close requires a quasi rebind since it is dynamically generated
		$('.navigation-tab-content').on('click', '.navigation-close-supplementary', function() {
			$('.navigation-supplementary').removeClass('navigation-active');
		});

		// Detect when search box is focused
		var navigationSearch = $('.js-navigation-search'),
			navigationSearchFocus = navigationSearch.find('.search-focus');
		navigationSearchFocus.focusout(function() {
			navigationSearch.removeClass('on');
		});
		navigationSearchFocus.focusin(function() {
			navigationSearch.addClass('on');
		});

		// this function provides equal height to elements in the 'navigation-tabbed-menu' container
		function equalHeightNavColumns(minNavHeight) {
			if ( viewportWidth > viewportWidthBreakpoint ) {
				$supplementContainer.find('.navigation-supplementary').css('min-height', minNavHeight);
				$supplementContainer.find('.navigation-column').css('min-height', minNavHeight);
			} else {
				$supplementContainer.find('.navigation-supplementary').css('min-height', 'none');
				$supplementContainer.find('.navigation-column').css('min-height', 'none');
			}
		}

		// position is dependent on the navAnchor argument passed in.
		function setSecondaryNavPosition( navAnchor ) {

			var navAnchor = $( navAnchor ),
			$thisNavSecondary,
			thisRelativePosition,
			thisRelativeLeft,
			thisRelativePosition,
			thisNavSecondaryLeft;

			if ( viewportWidth > viewportWidthBreakpoint ) {

				$thisNavSecondary = $( navAnchor ).next( '.navigation-secondary' );
				thisRelativePosition = $( navAnchor ).position();
				thisRelativeLeft = thisRelativePosition.left || 0;

				// determine the appropriate 'left' positioning property.
				if ( thisRelativeLeft + $thisNavSecondary.width() <= $('.navigation-primary').width() ) {
					thisNavSecondaryLeft = thisRelativeLeft;
				} else {
					thisNavSecondaryLeft = 'auto';
				}

				$thisNavSecondary.css( 'left', thisNavSecondaryLeft );
			} else {
				// no additional positioning action required on mobile
			}

		}

	}; // end navigationSetup



	var navLoader = {
		shouldLoad: {
			nav: $('.nav-primary').length !== 0 ? true : false,
			navigation: $('.navigation-primary').length !== 0 ? true : false
		},
		isLoaded: {
			nav: false,
			navigation: false
		},
		loadFunctions: {
			nav: function() {
				navSetup();
			},
			navigation: function() {
				navigationSetup();
			}
		},
		load: function(navigationKey) {
			if (typeof navLoader.loadFunctions[navigationKey] !== 'undefined') {
				navLoader.loadFunctions[navigationKey]();

				// assume is loaded if the function is called
				navLoader.isLoaded[navigationKey] = true;

				// add body class based on navigation loaded
				if (typeof navigationKey === 'string') {
					// get lowercased dashed string, 'Hello World' => 'hello-world'
					var navBodyClass = navigationKey.replace(/\s+/g, '-').toLowerCase();
					$('body').addClass('bmc-nav-loader-' + navBodyClass);
				}
			}
		},
		isLoaded: function(navigationKey) {
			return (typeof navLoader.isLoaded[navigationKey] !== 'undefined') ? navLoader.isLoaded[navigationKey] : false;
		},
		isNavLoaded: function() {
			return navLoader.isLoaded('nav');
		},
		isNavigationLoaded: function() {
			return navLoader.isLoaded('navigation');
		}
	};

	// setup one or the other, not both
	if (navLoader.shouldLoad.nav) {
		navLoader.load('nav');
	} else if (navLoader.shouldLoad.navigation) {
		navLoader.load('navigation');
	} else {
		// no navigations setup
	}

	// make available globally
	window.BMCNavLoader = navLoader;
});

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL25hdi1sb2FkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwialF1ZXJ5KGZ1bmN0aW9uKCQpe1xyXG5cclxuXHQvLyB0d28gbmF2aWdhdGlvbiBmdW5jdGlvbnMgaGF2ZSBiZWVuIHNldHVwIGJhc2VkIG9uIHRoZSBuYW1lc3BhY2luZyBvZlxyXG5cdC8vICduYXYnIHZzICduYXZpZ2F0aW9uJy5cclxuXHQvL1xyXG5cdC8vIE5hdmlnYXRpb24gbmFtZXNwYWNpbmc6XHJcblx0Ly8gLSAnbmF2JyByZWZlcnMgdG8gdGhlIGVhcmxpZXIgdmVyc2lvbiBvZiB0aGUgbmF2aXZnYXRpb25cclxuXHQvLyAtICduYXZpZ2F0aW9uJyByZWZlcnMgdG8gdGhlIG5ld2VyIHZlcnNpb24gb2YgdGhlIG5hdmlnYXRpb25cclxuXHQvL1xyXG5cdC8vIFNpbmNlIGJvdGggZm9sbG93IHNpbWlsYXIgaW50ZXJuYWwgY29udmVudGlvbnMsIHRoZSBqYXZhc2NyaXB0IHRoYXQgbG9hZHNcclxuXHQvLyB0aGVzZSBpcyBiZWluZyBpc29sYXRlZCB0byBiZWluZyBzZXR1cCBiYXNlZCBvbiB0aGUgbmF2aWdhdGlvbiB3cmFwcGVyIGNsYXNzLlxyXG5cdC8vIEJvdGggc2hvdWxkIG5vdCBiZSBsb2FkZWQgb24gdGhlIHNhbWUgcGFnZSwgdG8gYXZvaWQgY29uZmxpY3RzIGFuZCB1bmV4cGVjdGVkXHJcblx0Ly8gYmVoYXZvdXIuXHJcblxyXG5cdGZ1bmN0aW9uIG5hdmlnYXRpb25TZXR1cCgpIHtcclxuXHJcblx0XHR2YXIgJGxheW91dEhlYWRlciA9ICQoJy5sYXlvdXQtaGVhZGVyJyksXHJcblx0XHRcdGhlYWRlckhlaWdodCA9ICRsYXlvdXRIZWFkZXIub3V0ZXJIZWlnaHQoKSxcclxuXHRcdFx0bWluTmF2SGVpZ2h0ID0gTWF0aC5yb3VuZCgkKCcubmF2aWdhdGlvbi10YWItY29udHJvbHMnKS5vdXRlckhlaWdodCgpKSxcclxuXHRcdFx0dmlld3BvcnRXaWR0aCA9ICQod2luZG93KS53aWR0aCgpLFxyXG5cdFx0XHR2aWV3cG9ydFdpZHRoQnJlYWtwb2ludCA9IDk2MCxcclxuXHRcdFx0JHN1cHBsZW1lbnRDb250YWluZXIgPSAkKCcubmF2aWdhdGlvbi10YWItY29udGVudCcpLFxyXG5cdFx0XHQvLyB0aW1lciB0byBwcmV2ZW50IG11bHRpcGxlIHJlc2l6ZSBldmVudHNcclxuXHRcdFx0cmVzaXplVGltZXI7XHJcblxyXG5cdFx0JCgnLmxheW91dC1uYXZpZ2F0aW9uLW9wZW4nKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdCQoJy5sYXlvdXQtbmF2aWdhdGlvbicpLnRvZ2dsZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xyXG5cdFx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25hdmlnYXRpb24tb3BlbicpO1xyXG5cclxuXHRcdFx0JCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Lm5hdmlnYXRpb24tYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XHJcblx0XHRcdCQoJy5uYXZpZ2F0aW9uLXN1cHBsZW1lbnRhcnkubmF2aWdhdGlvbi1hY3RpdmUnKS5yZW1vdmVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTtcclxuXHRcdFx0JCgnLnRhYi1jb250cm9sLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHQkKCcuc2VsZWN0LWNvdW50cnknKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0JCgnYm9keScpLmFkZENsYXNzKCdjb3VudHJ5LW1vZGFsLWFjdGl2ZScpO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdC8vIGFkZGVkIGV2ZW50IHRvIGRldGVjdCBDb3VudHJ5IG1vZGFsIGNsb3NlXHJcblx0XHQkKCcuY291bnRyeS1tb2RhbC1jbG9zZSwgLmxheW91dC1tb2RhbC1vdmVybGF5JykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnY291bnRyeS1tb2RhbC1hY3RpdmUnKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJy5jb250YWN0LWJtYycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ2NvbnRhY3QtbW9kYWwtYWN0aXZlJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcubW9kYWwtY2xvc2UsIC5sYXlvdXQtbW9kYWwtb3ZlcmxheScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2NvbnRhY3QtbW9kYWwtYWN0aXZlJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcubGF5b3V0LW5hdmlnYXRpb24tY2xvc2UnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdCQoJy5sYXlvdXQtbmF2aWdhdGlvbicpLnRvZ2dsZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xyXG5cdFx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25hdmlnYXRpb24tb3BlbicpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gdG9nZ2xlQ2xhc3MgYWN0aXZlIG9uIHByaW1hcnkgbmF2aWdhdGlvbiBsaW5rc1xyXG5cdFx0JCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5LXRvZ2dsZSA+IGEnKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHJcblx0XHRcdHZhciAkdGhpc05hdlNlY29uZGFyeSA9ICQodGhpcykubmV4dCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Jyk7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblx0XHRcdHZhciAkdGhpc1BhcmVudCA9ICR0aGlzLnBhcmVudCgpO1xyXG5cdFx0XHR2YXIgbWF4TmF2SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gNTA7XHJcblx0XHRcdHZhciAkdGhpc1Bvc2l0aW9uID0gJCh0aGlzKS5wb3NpdGlvbigpO1xyXG5cdFx0XHR2YXIgdGhpc0xlZnQgPSAkdGhpc1Bvc2l0aW9uLmxlZnQgfHwgMDtcclxuXHRcdFx0dmFyIHRoaXNOYXZTZWNvbmRhcnlMZWZ0O1xyXG5cclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0JCgnLm5hdmlnYXRpb24tcHJpbWFyeScpXHJcblx0XHRcdFx0LmZpbmQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeScpXHJcblx0XHRcdFx0Lm5vdCgkdGhpc05hdlNlY29uZGFyeSlcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJylcclxuXHRcdFx0XHQuYXR0cignc3R5bGUnLCAnJyk7XHJcblxyXG5cdFx0XHQkKCcubmF2aWdhdGlvbi1wcmltYXJ5JylcclxuXHRcdFx0XHQuZmluZCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5LXRvZ2dsZS5oaW50ZWQnKVxyXG5cdFx0XHRcdC5ub3QoJHRoaXNQYXJlbnQpXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdoaW50ZWQnKTtcclxuXHJcblx0XHRcdCR0aGlzLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdoaW50ZWQnKTtcclxuXHJcblx0XHRcdCR0aGlzTmF2U2Vjb25kYXJ5LnRvZ2dsZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xyXG5cclxuXHRcdFx0aWYgKCAkdGhpc05hdlNlY29uZGFyeS5oYXNDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKSApIHtcclxuXHRcdFx0XHQkdGhpc05hdlNlY29uZGFyeS5jc3MoJ21heC1oZWlnaHQnLCBtYXhOYXZIZWlnaHQpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCR0aGlzTmF2U2Vjb25kYXJ5LmF0dHIoJ3N0eWxlJywgJycpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBOQVYgUFJPRFVDVFMgJiBTT0xVVElPTlNcclxuXHRcdFx0Ly8gc2V0IHRoZSBoZWlnaHQgb2YgdGhlIHRhYiBjb250YWluZXJzIHRvIGJlIGVxdWFsXHJcblx0XHRcdGlmICggJHRoaXNOYXZTZWNvbmRhcnkuaGFzQ2xhc3MoJ25hdmlnYXRpb24tdGFiYmVkLW1lbnUnKSApIHtcclxuXHRcdFx0XHRlcXVhbEhlaWdodE5hdkNvbHVtbnMobWluTmF2SGVpZ2h0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gY29ycmVjdGx5IHNldCBwb3NpdGlvbiBmb3Igc2Vjb25kYXJ5IG5hdlxyXG5cdFx0XHRzZXRTZWNvbmRhcnlOYXZQb3NpdGlvbiggJHRoaXMgKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoIHdpbmRvdyApLm9uKCAncmVzaXplJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRjbGVhclRpbWVvdXQocmVzaXplVGltZXIpO1xyXG5cdFx0XHQvLyBodHRwczovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2pxdWVyeS9kb25lLXJlc2l6aW5nLWV2ZW50L1xyXG5cdFx0XHRyZXNpemVUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Ly8gcmVzZXQgZG9jIHNpemUgYmFzZWQgdmFyaWFibGVzXHJcblx0XHRcdFx0dmlld3BvcnRXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG5cdFx0XHRcdG1pbk5hdkhlaWdodCA9IE1hdGgucm91bmQoJCgnLm5hdmlnYXRpb24tdGFiLWNvbnRyb2xzJykub3V0ZXJIZWlnaHQoKSk7XHJcblx0XHRcdFx0Ly8gbGF1bmNoIGRvYyBzaXplIGJhc2VkIGZ1bmN0aW9uc1xyXG5cdFx0XHRcdGlmICggJCggJy5uYXZpZ2F0aW9uLXNlY29uZGFyeS5uYXZpZ2F0aW9uLWFjdGl2ZScgKS5zaWJsaW5ncyggJ2EnICkubGVuZ3RoID4gMCApe1xyXG5cdFx0XHRcdFx0c2V0U2Vjb25kYXJ5TmF2UG9zaXRpb24oICQoICcubmF2aWdhdGlvbi1zZWNvbmRhcnkubmF2aWdhdGlvbi1hY3RpdmUnICkuc2libGluZ3MoICdhJyApICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVxdWFsSGVpZ2h0TmF2Q29sdW1ucyhtaW5OYXZIZWlnaHQpO1xyXG5cdFx0XHR9LCAyNTApO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gZXhwb3NlcyB0aGUgcHJpbWFyeSBuYXYgaXRlbXMgd2hlbiBpbiBhIHNjcm9sbGVkLWRvd24gb3Igc2Nyb2xsZWQtdXAgc3RhdGVcclxuXHRcdCQoJy5uYXZpZ2F0aW9uLW1lbnUtbGluaycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ2Rpc3BsYXktc2Nyb2xsZWQtbWVudScpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gRGlzbWlzc2VzIG1lbnUgaWYgdGFwcyBhcmUgbWFkZSBvdXRzaWRlIG9mIHRoZSBtZW51XHJcblx0XHQkKCdib2R5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdHZhciAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XHJcblx0XHRcdHZhciBjbGlja0luTmF2ID0gJChlLnRhcmdldCkucGFyZW50cygnLm5hdmlnYXRpb24tc2Vjb25kYXJ5LCAubGF5b3V0LW5hdmlnYXRpb24sIC5sYXlvdXQtY29udGFjdC1tb2RhbCcpLmFkZEJhY2soJy5uYXZpZ2F0aW9uLXNlY29uZGFyeScpO1xyXG5cclxuXHRcdFx0aWYgKCEkdGFyZ2V0Lmhhc0NsYXNzKCdsYXlvdXQtbW9kYWwtb3ZlcmxheScpKSB7XHJcblx0XHRcdFx0aWYgKCFjbGlja0luTmF2Lmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0JCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5JykucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJykuYXR0cignc3R5bGUnLCAnJyk7XHJcblx0XHRcdFx0XHQkKCcubmF2aWdhdGlvbi1zZWNvbmRhcnktdG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2hpbnRlZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeS1jbG9zZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0JHBhcmVudCA9ICQodGhpcykucGFyZW50cygnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Jyk7XHJcblx0XHRcdCRwYXJlbnRcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJylcclxuXHRcdFx0XHQuYXR0cignc3R5bGUnLCAnJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyAubmF2aWdhdGlvbi10YWJiZWQtbWVudSB0YWIgZnVuY3Rpb25hbGl0eVxyXG5cdFx0JCgnLnRhYi1jb250cm9sJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdCR0aGlzID0gJCh0aGlzKTtcclxuXHRcdFx0JHN1cHBsZW1lbnROYXYgPSAkdGhpcy5uZXh0KCcubmF2aWdhdGlvbi1zdXBwbGVtZW50YXJ5Jyk7XHJcblxyXG5cdFx0XHQkKCcubmF2aWdhdGlvbi1zdXBwbGVtZW50YXJ5JykucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XHJcblx0XHRcdCQoJy50YWItY29udHJvbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUtdGFiJyk7XHJcblx0XHRcdCR0aGlzLmFkZENsYXNzKCdhY3RpdmUtdGFiJyk7XHJcblxyXG5cdFx0XHQvLyBjbGVhciBvdXQgdGhlIHN1cHBsZW1lbnQgY29udGFpbmVyXHJcblx0XHRcdCRzdXBwbGVtZW50Q29udGFpbmVyLmh0bWwoJycpO1xyXG5cdFx0XHQvLyBhbmQgcG9wdWxhdGUgaXQgd2l0aCB0aGUgYXBwcm9wcmlhdGUgbWVudVxyXG5cdFx0XHQkc3VwcGxlbWVudE5hdlxyXG5cdFx0XHRcdC5jbG9uZSgpXHJcblx0XHRcdFx0LmFwcGVuZFRvKCRzdXBwbGVtZW50Q29udGFpbmVyKTtcclxuXHJcblx0XHRcdC8vIGVxdWFsaXplIHRoZSBjb2x1bW4gaGVpZ2h0c1xyXG5cdFx0XHRlcXVhbEhlaWdodE5hdkNvbHVtbnMobWluTmF2SGVpZ2h0KTtcclxuXHJcblx0XHRcdCRzdXBwbGVtZW50Q29udGFpbmVyXHJcblx0XHRcdFx0LmZpbmQoJy5uYXZpZ2F0aW9uLXN1cHBsZW1lbnRhcnknKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTsgLy8gZG9lc24ndCB0cmlnZ2VyIGNzcyB0cmFuc2l0aW9uIGFuaW1hdGlvbiA6KFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gbmF2aWdhdGlvbi1zdXBwbGVtZW50YXJ5IGNsb3NlIHJlcXVpcmVzIGEgcXVhc2kgcmViaW5kIHNpbmNlIGl0IGlzIGR5bmFtaWNhbGx5IGdlbmVyYXRlZFxyXG5cdFx0JCgnLm5hdmlnYXRpb24tdGFiLWNvbnRlbnQnKS5vbignY2xpY2snLCAnLm5hdmlnYXRpb24tY2xvc2Utc3VwcGxlbWVudGFyeScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcubmF2aWdhdGlvbi1zdXBwbGVtZW50YXJ5JykucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBEZXRlY3Qgd2hlbiBzZWFyY2ggYm94IGlzIGZvY3VzZWRcclxuXHRcdHZhciBuYXZpZ2F0aW9uU2VhcmNoID0gJCgnLmpzLW5hdmlnYXRpb24tc2VhcmNoJyksXHJcblx0XHRcdG5hdmlnYXRpb25TZWFyY2hGb2N1cyA9IG5hdmlnYXRpb25TZWFyY2guZmluZCgnLnNlYXJjaC1mb2N1cycpO1xyXG5cdFx0bmF2aWdhdGlvblNlYXJjaEZvY3VzLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRuYXZpZ2F0aW9uU2VhcmNoLnJlbW92ZUNsYXNzKCdvbicpO1xyXG5cdFx0fSk7XHJcblx0XHRuYXZpZ2F0aW9uU2VhcmNoRm9jdXMuZm9jdXNpbihmdW5jdGlvbigpIHtcclxuXHRcdFx0bmF2aWdhdGlvblNlYXJjaC5hZGRDbGFzcygnb24nKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIHRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgZXF1YWwgaGVpZ2h0IHRvIGVsZW1lbnRzIGluIHRoZSAnbmF2aWdhdGlvbi10YWJiZWQtbWVudScgY29udGFpbmVyXHJcblx0XHRmdW5jdGlvbiBlcXVhbEhlaWdodE5hdkNvbHVtbnMobWluTmF2SGVpZ2h0KSB7XHJcblx0XHRcdGlmICggdmlld3BvcnRXaWR0aCA+IHZpZXdwb3J0V2lkdGhCcmVha3BvaW50ICkge1xyXG5cdFx0XHRcdCRzdXBwbGVtZW50Q29udGFpbmVyLmZpbmQoJy5uYXZpZ2F0aW9uLXN1cHBsZW1lbnRhcnknKS5jc3MoJ21pbi1oZWlnaHQnLCBtaW5OYXZIZWlnaHQpO1xyXG5cdFx0XHRcdCRzdXBwbGVtZW50Q29udGFpbmVyLmZpbmQoJy5uYXZpZ2F0aW9uLWNvbHVtbicpLmNzcygnbWluLWhlaWdodCcsIG1pbk5hdkhlaWdodCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JHN1cHBsZW1lbnRDb250YWluZXIuZmluZCgnLm5hdmlnYXRpb24tc3VwcGxlbWVudGFyeScpLmNzcygnbWluLWhlaWdodCcsICdub25lJyk7XHJcblx0XHRcdFx0JHN1cHBsZW1lbnRDb250YWluZXIuZmluZCgnLm5hdmlnYXRpb24tY29sdW1uJykuY3NzKCdtaW4taGVpZ2h0JywgJ25vbmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHBvc2l0aW9uIGlzIGRlcGVuZGVudCBvbiB0aGUgbmF2QW5jaG9yIGFyZ3VtZW50IHBhc3NlZCBpbi5cclxuXHRcdGZ1bmN0aW9uIHNldFNlY29uZGFyeU5hdlBvc2l0aW9uKCBuYXZBbmNob3IgKSB7XHJcblxyXG5cdFx0XHR2YXIgbmF2QW5jaG9yID0gJCggbmF2QW5jaG9yICksXHJcblx0XHRcdCR0aGlzTmF2U2Vjb25kYXJ5LFxyXG5cdFx0XHR0aGlzUmVsYXRpdmVQb3NpdGlvbixcclxuXHRcdFx0dGhpc1JlbGF0aXZlTGVmdCxcclxuXHRcdFx0dGhpc1JlbGF0aXZlUG9zaXRpb24sXHJcblx0XHRcdHRoaXNOYXZTZWNvbmRhcnlMZWZ0O1xyXG5cclxuXHRcdFx0aWYgKCB2aWV3cG9ydFdpZHRoID4gdmlld3BvcnRXaWR0aEJyZWFrcG9pbnQgKSB7XHJcblxyXG5cdFx0XHRcdCR0aGlzTmF2U2Vjb25kYXJ5ID0gJCggbmF2QW5jaG9yICkubmV4dCggJy5uYXZpZ2F0aW9uLXNlY29uZGFyeScgKTtcclxuXHRcdFx0XHR0aGlzUmVsYXRpdmVQb3NpdGlvbiA9ICQoIG5hdkFuY2hvciApLnBvc2l0aW9uKCk7XHJcblx0XHRcdFx0dGhpc1JlbGF0aXZlTGVmdCA9IHRoaXNSZWxhdGl2ZVBvc2l0aW9uLmxlZnQgfHwgMDtcclxuXHJcblx0XHRcdFx0Ly8gZGV0ZXJtaW5lIHRoZSBhcHByb3ByaWF0ZSAnbGVmdCcgcG9zaXRpb25pbmcgcHJvcGVydHkuXHJcblx0XHRcdFx0aWYgKCB0aGlzUmVsYXRpdmVMZWZ0ICsgJHRoaXNOYXZTZWNvbmRhcnkud2lkdGgoKSA8PSAkKCcubmF2aWdhdGlvbi1wcmltYXJ5Jykud2lkdGgoKSApIHtcclxuXHRcdFx0XHRcdHRoaXNOYXZTZWNvbmRhcnlMZWZ0ID0gdGhpc1JlbGF0aXZlTGVmdDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpc05hdlNlY29uZGFyeUxlZnQgPSAnYXV0byc7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkdGhpc05hdlNlY29uZGFyeS5jc3MoICdsZWZ0JywgdGhpc05hdlNlY29uZGFyeUxlZnQgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBubyBhZGRpdGlvbmFsIHBvc2l0aW9uaW5nIGFjdGlvbiByZXF1aXJlZCBvbiBtb2JpbGVcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0fTsgLy8gZW5kIG5hdmlnYXRpb25TZXR1cFxyXG5cclxuXHJcblxyXG5cdHZhciBuYXZMb2FkZXIgPSB7XHJcblx0XHRzaG91bGRMb2FkOiB7XHJcblx0XHRcdG5hdjogJCgnLm5hdi1wcmltYXJ5JykubGVuZ3RoICE9PSAwID8gdHJ1ZSA6IGZhbHNlLFxyXG5cdFx0XHRuYXZpZ2F0aW9uOiAkKCcubmF2aWdhdGlvbi1wcmltYXJ5JykubGVuZ3RoICE9PSAwID8gdHJ1ZSA6IGZhbHNlXHJcblx0XHR9LFxyXG5cdFx0aXNMb2FkZWQ6IHtcclxuXHRcdFx0bmF2OiBmYWxzZSxcclxuXHRcdFx0bmF2aWdhdGlvbjogZmFsc2VcclxuXHRcdH0sXHJcblx0XHRsb2FkRnVuY3Rpb25zOiB7XHJcblx0XHRcdG5hdjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bmF2U2V0dXAoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0bmF2aWdhdGlvbjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bmF2aWdhdGlvblNldHVwKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRsb2FkOiBmdW5jdGlvbihuYXZpZ2F0aW9uS2V5KSB7XHJcblx0XHRcdGlmICh0eXBlb2YgbmF2TG9hZGVyLmxvYWRGdW5jdGlvbnNbbmF2aWdhdGlvbktleV0gIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0bmF2TG9hZGVyLmxvYWRGdW5jdGlvbnNbbmF2aWdhdGlvbktleV0oKTtcclxuXHJcblx0XHRcdFx0Ly8gYXNzdW1lIGlzIGxvYWRlZCBpZiB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkXHJcblx0XHRcdFx0bmF2TG9hZGVyLmlzTG9hZGVkW25hdmlnYXRpb25LZXldID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0Ly8gYWRkIGJvZHkgY2xhc3MgYmFzZWQgb24gbmF2aWdhdGlvbiBsb2FkZWRcclxuXHRcdFx0XHRpZiAodHlwZW9mIG5hdmlnYXRpb25LZXkgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHQvLyBnZXQgbG93ZXJjYXNlZCBkYXNoZWQgc3RyaW5nLCAnSGVsbG8gV29ybGQnID0+ICdoZWxsby13b3JsZCdcclxuXHRcdFx0XHRcdHZhciBuYXZCb2R5Q2xhc3MgPSBuYXZpZ2F0aW9uS2V5LnJlcGxhY2UoL1xccysvZywgJy0nKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdFx0JCgnYm9keScpLmFkZENsYXNzKCdibWMtbmF2LWxvYWRlci0nICsgbmF2Qm9keUNsYXNzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRpc0xvYWRlZDogZnVuY3Rpb24obmF2aWdhdGlvbktleSkge1xyXG5cdFx0XHRyZXR1cm4gKHR5cGVvZiBuYXZMb2FkZXIuaXNMb2FkZWRbbmF2aWdhdGlvbktleV0gIT09ICd1bmRlZmluZWQnKSA/IG5hdkxvYWRlci5pc0xvYWRlZFtuYXZpZ2F0aW9uS2V5XSA6IGZhbHNlO1xyXG5cdFx0fSxcclxuXHRcdGlzTmF2TG9hZGVkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIG5hdkxvYWRlci5pc0xvYWRlZCgnbmF2Jyk7XHJcblx0XHR9LFxyXG5cdFx0aXNOYXZpZ2F0aW9uTG9hZGVkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIG5hdkxvYWRlci5pc0xvYWRlZCgnbmF2aWdhdGlvbicpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIHNldHVwIG9uZSBvciB0aGUgb3RoZXIsIG5vdCBib3RoXHJcblx0aWYgKG5hdkxvYWRlci5zaG91bGRMb2FkLm5hdikge1xyXG5cdFx0bmF2TG9hZGVyLmxvYWQoJ25hdicpO1xyXG5cdH0gZWxzZSBpZiAobmF2TG9hZGVyLnNob3VsZExvYWQubmF2aWdhdGlvbikge1xyXG5cdFx0bmF2TG9hZGVyLmxvYWQoJ25hdmlnYXRpb24nKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0Ly8gbm8gbmF2aWdhdGlvbnMgc2V0dXBcclxuXHR9XHJcblxyXG5cdC8vIG1ha2UgYXZhaWxhYmxlIGdsb2JhbGx5XHJcblx0d2luZG93LkJNQ05hdkxvYWRlciA9IG5hdkxvYWRlcjtcclxufSk7XHJcbiJdfQ==
