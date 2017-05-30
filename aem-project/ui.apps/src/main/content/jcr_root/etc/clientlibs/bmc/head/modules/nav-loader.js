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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL25hdi1sb2FkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwialF1ZXJ5KGZ1bmN0aW9uKCQpe1xuXG5cdC8vIHR3byBuYXZpZ2F0aW9uIGZ1bmN0aW9ucyBoYXZlIGJlZW4gc2V0dXAgYmFzZWQgb24gdGhlIG5hbWVzcGFjaW5nIG9mXG5cdC8vICduYXYnIHZzICduYXZpZ2F0aW9uJy5cblx0Ly9cblx0Ly8gTmF2aWdhdGlvbiBuYW1lc3BhY2luZzpcblx0Ly8gLSAnbmF2JyByZWZlcnMgdG8gdGhlIGVhcmxpZXIgdmVyc2lvbiBvZiB0aGUgbmF2aXZnYXRpb25cblx0Ly8gLSAnbmF2aWdhdGlvbicgcmVmZXJzIHRvIHRoZSBuZXdlciB2ZXJzaW9uIG9mIHRoZSBuYXZpZ2F0aW9uXG5cdC8vXG5cdC8vIFNpbmNlIGJvdGggZm9sbG93IHNpbWlsYXIgaW50ZXJuYWwgY29udmVudGlvbnMsIHRoZSBqYXZhc2NyaXB0IHRoYXQgbG9hZHNcblx0Ly8gdGhlc2UgaXMgYmVpbmcgaXNvbGF0ZWQgdG8gYmVpbmcgc2V0dXAgYmFzZWQgb24gdGhlIG5hdmlnYXRpb24gd3JhcHBlciBjbGFzcy5cblx0Ly8gQm90aCBzaG91bGQgbm90IGJlIGxvYWRlZCBvbiB0aGUgc2FtZSBwYWdlLCB0byBhdm9pZCBjb25mbGljdHMgYW5kIHVuZXhwZWN0ZWRcblx0Ly8gYmVoYXZvdXIuXG5cblx0ZnVuY3Rpb24gbmF2aWdhdGlvblNldHVwKCkge1xuXG5cdFx0dmFyICRsYXlvdXRIZWFkZXIgPSAkKCcubGF5b3V0LWhlYWRlcicpLFxuXHRcdFx0aGVhZGVySGVpZ2h0ID0gJGxheW91dEhlYWRlci5vdXRlckhlaWdodCgpLFxuXHRcdFx0bWluTmF2SGVpZ2h0ID0gTWF0aC5yb3VuZCgkKCcubmF2aWdhdGlvbi10YWItY29udHJvbHMnKS5vdXRlckhlaWdodCgpKSxcblx0XHRcdHZpZXdwb3J0V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcblx0XHRcdHZpZXdwb3J0V2lkdGhCcmVha3BvaW50ID0gOTYwLFxuXHRcdFx0JHN1cHBsZW1lbnRDb250YWluZXIgPSAkKCcubmF2aWdhdGlvbi10YWItY29udGVudCcpLFxuXHRcdFx0Ly8gdGltZXIgdG8gcHJldmVudCBtdWx0aXBsZSByZXNpemUgZXZlbnRzXG5cdFx0XHRyZXNpemVUaW1lcjtcblxuXHRcdCQoJy5sYXlvdXQtbmF2aWdhdGlvbi1vcGVuJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHQkKCcubGF5b3V0LW5hdmlnYXRpb24nKS50b2dnbGVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTtcblx0XHRcdCQoJ2JvZHknKS50b2dnbGVDbGFzcygnbmF2aWdhdGlvbi1vcGVuJyk7XG5cblx0XHRcdCQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeS5uYXZpZ2F0aW9uLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xuXHRcdFx0JCgnLm5hdmlnYXRpb24tc3VwcGxlbWVudGFyeS5uYXZpZ2F0aW9uLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xuXHRcdFx0JCgnLnRhYi1jb250cm9sLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHR9KTtcblx0XHRcblx0XHQkKCcuc2VsZWN0LWNvdW50cnknKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ2NvdW50cnktbW9kYWwtYWN0aXZlJyk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0Ly8gYWRkZWQgZXZlbnQgdG8gZGV0ZWN0IENvdW50cnkgbW9kYWwgY2xvc2Vcblx0XHQkKCcuY291bnRyeS1tb2RhbC1jbG9zZSwgLmxheW91dC1tb2RhbC1vdmVybGF5JykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdjb3VudHJ5LW1vZGFsLWFjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0JCgnLmNvbnRhY3QtYm1jJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0JCgnYm9keScpLmFkZENsYXNzKCdjb250YWN0LW1vZGFsLWFjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0JCgnLm1vZGFsLWNsb3NlLCAubGF5b3V0LW1vZGFsLW92ZXJsYXknKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2NvbnRhY3QtbW9kYWwtYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHQkKCcubGF5b3V0LW5hdmlnYXRpb24tY2xvc2UnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdCQoJy5sYXlvdXQtbmF2aWdhdGlvbicpLnRvZ2dsZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xuXHRcdFx0JCgnYm9keScpLnRvZ2dsZUNsYXNzKCduYXZpZ2F0aW9uLW9wZW4nKTtcblx0XHR9KTtcblxuXHRcdC8vIHRvZ2dsZUNsYXNzIGFjdGl2ZSBvbiBwcmltYXJ5IG5hdmlnYXRpb24gbGlua3Ncblx0XHQkKCcubmF2aWdhdGlvbi1zZWNvbmRhcnktdG9nZ2xlID4gYScpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXG5cdFx0XHR2YXIgJHRoaXNOYXZTZWNvbmRhcnkgPSAkKHRoaXMpLm5leHQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeScpO1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdHZhciAkdGhpc1BhcmVudCA9ICR0aGlzLnBhcmVudCgpO1xuXHRcdFx0dmFyIG1heE5hdkhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKSAtIDUwO1xuXHRcdFx0dmFyICR0aGlzUG9zaXRpb24gPSAkKHRoaXMpLnBvc2l0aW9uKCk7XG5cdFx0XHR2YXIgdGhpc0xlZnQgPSAkdGhpc1Bvc2l0aW9uLmxlZnQgfHwgMDtcblx0XHRcdHZhciB0aGlzTmF2U2Vjb25kYXJ5TGVmdDtcblxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHQkKCcubmF2aWdhdGlvbi1wcmltYXJ5Jylcblx0XHRcdFx0LmZpbmQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeScpXG5cdFx0XHRcdC5ub3QoJHRoaXNOYXZTZWNvbmRhcnkpXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKVxuXHRcdFx0XHQuYXR0cignc3R5bGUnLCAnJyk7XG5cblx0XHRcdCQoJy5uYXZpZ2F0aW9uLXByaW1hcnknKVxuXHRcdFx0XHQuZmluZCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5LXRvZ2dsZS5oaW50ZWQnKVxuXHRcdFx0XHQubm90KCR0aGlzUGFyZW50KVxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2hpbnRlZCcpO1xuXG5cdFx0XHQkdGhpcy5wYXJlbnQoKS50b2dnbGVDbGFzcygnaGludGVkJyk7XG5cblx0XHRcdCR0aGlzTmF2U2Vjb25kYXJ5LnRvZ2dsZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xuXG5cdFx0XHRpZiAoICR0aGlzTmF2U2Vjb25kYXJ5Lmhhc0NsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpICkge1xuXHRcdFx0XHQkdGhpc05hdlNlY29uZGFyeS5jc3MoJ21heC1oZWlnaHQnLCBtYXhOYXZIZWlnaHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHRoaXNOYXZTZWNvbmRhcnkuYXR0cignc3R5bGUnLCAnJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE5BViBQUk9EVUNUUyAmIFNPTFVUSU9OU1xuXHRcdFx0Ly8gc2V0IHRoZSBoZWlnaHQgb2YgdGhlIHRhYiBjb250YWluZXJzIHRvIGJlIGVxdWFsXG5cdFx0XHRpZiAoICR0aGlzTmF2U2Vjb25kYXJ5Lmhhc0NsYXNzKCduYXZpZ2F0aW9uLXRhYmJlZC1tZW51JykgKSB7XG5cdFx0XHRcdGVxdWFsSGVpZ2h0TmF2Q29sdW1ucyhtaW5OYXZIZWlnaHQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb3JyZWN0bHkgc2V0IHBvc2l0aW9uIGZvciBzZWNvbmRhcnkgbmF2XG5cdFx0XHRzZXRTZWNvbmRhcnlOYXZQb3NpdGlvbiggJHRoaXMgKTtcblx0XHR9KTtcblxuXHRcdCQoIHdpbmRvdyApLm9uKCAncmVzaXplJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVyKTtcblx0XHRcdC8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvanF1ZXJ5L2RvbmUtcmVzaXppbmctZXZlbnQvXG5cdFx0XHRyZXNpemVUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIHJlc2V0IGRvYyBzaXplIGJhc2VkIHZhcmlhYmxlc1xuXHRcdFx0XHR2aWV3cG9ydFdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cdFx0XHRcdG1pbk5hdkhlaWdodCA9IE1hdGgucm91bmQoJCgnLm5hdmlnYXRpb24tdGFiLWNvbnRyb2xzJykub3V0ZXJIZWlnaHQoKSk7XG5cdFx0XHRcdC8vIGxhdW5jaCBkb2Mgc2l6ZSBiYXNlZCBmdW5jdGlvbnNcblx0XHRcdFx0aWYgKCAkKCAnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Lm5hdmlnYXRpb24tYWN0aXZlJyApLnNpYmxpbmdzKCAnYScgKS5sZW5ndGggPiAwICl7XG5cdFx0XHRcdFx0c2V0U2Vjb25kYXJ5TmF2UG9zaXRpb24oICQoICcubmF2aWdhdGlvbi1zZWNvbmRhcnkubmF2aWdhdGlvbi1hY3RpdmUnICkuc2libGluZ3MoICdhJyApICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZXF1YWxIZWlnaHROYXZDb2x1bW5zKG1pbk5hdkhlaWdodCk7XG5cdFx0XHR9LCAyNTApO1xuXHRcdH0pO1xuXG5cdFx0Ly8gZXhwb3NlcyB0aGUgcHJpbWFyeSBuYXYgaXRlbXMgd2hlbiBpbiBhIHNjcm9sbGVkLWRvd24gb3Igc2Nyb2xsZWQtdXAgc3RhdGVcblx0XHQkKCcubmF2aWdhdGlvbi1tZW51LWxpbmsnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ2Rpc3BsYXktc2Nyb2xsZWQtbWVudScpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gRGlzbWlzc2VzIG1lbnUgaWYgdGFwcyBhcmUgbWFkZSBvdXRzaWRlIG9mIHRoZSBtZW51XG5cdFx0JCgnYm9keScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyICR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcblx0XHRcdHZhciBjbGlja0luTmF2ID0gJChlLnRhcmdldCkucGFyZW50cygnLm5hdmlnYXRpb24tc2Vjb25kYXJ5LCAubGF5b3V0LW5hdmlnYXRpb24sIC5sYXlvdXQtY29udGFjdC1tb2RhbCcpLmFkZEJhY2soJy5uYXZpZ2F0aW9uLXNlY29uZGFyeScpO1xuXG5cdFx0XHRpZiAoISR0YXJnZXQuaGFzQ2xhc3MoJ2xheW91dC1tb2RhbC1vdmVybGF5JykpIHtcblx0XHRcdFx0aWYgKCFjbGlja0luTmF2Lmxlbmd0aCkge1xuXHRcdFx0XHRcdCQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeScpLnJlbW92ZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpLmF0dHIoJ3N0eWxlJywgJycpO1xuXHRcdFx0XHRcdCQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeS10b2dnbGUnKS5yZW1vdmVDbGFzcygnaGludGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdFx0JCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5LWNsb3NlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0JHBhcmVudCA9ICQodGhpcykucGFyZW50cygnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Jyk7XG5cdFx0XHQkcGFyZW50XG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKVxuXHRcdFx0XHQuYXR0cignc3R5bGUnLCAnJyk7XG5cdFx0fSk7XG5cblx0XHQvLyAubmF2aWdhdGlvbi10YWJiZWQtbWVudSB0YWIgZnVuY3Rpb25hbGl0eVxuXHRcdCQoJy50YWItY29udHJvbCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdCR0aGlzID0gJCh0aGlzKTtcblx0XHRcdCRzdXBwbGVtZW50TmF2ID0gJHRoaXMubmV4dCgnLm5hdmlnYXRpb24tc3VwcGxlbWVudGFyeScpO1xuXG5cdFx0XHQkKCcubmF2aWdhdGlvbi1zdXBwbGVtZW50YXJ5JykucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XG5cdFx0XHQkKCcudGFiLWNvbnRyb2wnKS5yZW1vdmVDbGFzcygnYWN0aXZlLXRhYicpO1xuXHRcdFx0JHRoaXMuYWRkQ2xhc3MoJ2FjdGl2ZS10YWInKTtcblxuXHRcdFx0Ly8gY2xlYXIgb3V0IHRoZSBzdXBwbGVtZW50IGNvbnRhaW5lclxuXHRcdFx0JHN1cHBsZW1lbnRDb250YWluZXIuaHRtbCgnJyk7XG5cdFx0XHQvLyBhbmQgcG9wdWxhdGUgaXQgd2l0aCB0aGUgYXBwcm9wcmlhdGUgbWVudVxuXHRcdFx0JHN1cHBsZW1lbnROYXZcblx0XHRcdFx0LmNsb25lKClcblx0XHRcdFx0LmFwcGVuZFRvKCRzdXBwbGVtZW50Q29udGFpbmVyKTtcblxuXHRcdFx0Ly8gZXF1YWxpemUgdGhlIGNvbHVtbiBoZWlnaHRzXG5cdFx0XHRlcXVhbEhlaWdodE5hdkNvbHVtbnMobWluTmF2SGVpZ2h0KTtcblxuXHRcdFx0JHN1cHBsZW1lbnRDb250YWluZXJcblx0XHRcdFx0LmZpbmQoJy5uYXZpZ2F0aW9uLXN1cHBsZW1lbnRhcnknKVxuXHRcdFx0XHQuYWRkQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7IC8vIGRvZXNuJ3QgdHJpZ2dlciBjc3MgdHJhbnNpdGlvbiBhbmltYXRpb24gOihcblx0XHR9KTtcblxuXHRcdC8vIG5hdmlnYXRpb24tc3VwcGxlbWVudGFyeSBjbG9zZSByZXF1aXJlcyBhIHF1YXNpIHJlYmluZCBzaW5jZSBpdCBpcyBkeW5hbWljYWxseSBnZW5lcmF0ZWRcblx0XHQkKCcubmF2aWdhdGlvbi10YWItY29udGVudCcpLm9uKCdjbGljaycsICcubmF2aWdhdGlvbi1jbG9zZS1zdXBwbGVtZW50YXJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcubmF2aWdhdGlvbi1zdXBwbGVtZW50YXJ5JykucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHQvLyBEZXRlY3Qgd2hlbiBzZWFyY2ggYm94IGlzIGZvY3VzZWRcblx0XHR2YXIgbmF2aWdhdGlvblNlYXJjaCA9ICQoJy5qcy1uYXZpZ2F0aW9uLXNlYXJjaCcpLFxuXHRcdFx0bmF2aWdhdGlvblNlYXJjaEZvY3VzID0gbmF2aWdhdGlvblNlYXJjaC5maW5kKCcuc2VhcmNoLWZvY3VzJyk7XG5cdFx0bmF2aWdhdGlvblNlYXJjaEZvY3VzLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0bmF2aWdhdGlvblNlYXJjaC5yZW1vdmVDbGFzcygnb24nKTtcblx0XHR9KTtcblx0XHRuYXZpZ2F0aW9uU2VhcmNoRm9jdXMuZm9jdXNpbihmdW5jdGlvbigpIHtcblx0XHRcdG5hdmlnYXRpb25TZWFyY2guYWRkQ2xhc3MoJ29uJyk7XG5cdFx0fSk7XG5cblx0XHQvLyB0aGlzIGZ1bmN0aW9uIHByb3ZpZGVzIGVxdWFsIGhlaWdodCB0byBlbGVtZW50cyBpbiB0aGUgJ25hdmlnYXRpb24tdGFiYmVkLW1lbnUnIGNvbnRhaW5lclxuXHRcdGZ1bmN0aW9uIGVxdWFsSGVpZ2h0TmF2Q29sdW1ucyhtaW5OYXZIZWlnaHQpIHtcblx0XHRcdGlmICggdmlld3BvcnRXaWR0aCA+IHZpZXdwb3J0V2lkdGhCcmVha3BvaW50ICkge1xuXHRcdFx0XHQkc3VwcGxlbWVudENvbnRhaW5lci5maW5kKCcubmF2aWdhdGlvbi1zdXBwbGVtZW50YXJ5JykuY3NzKCdtaW4taGVpZ2h0JywgbWluTmF2SGVpZ2h0KTtcblx0XHRcdFx0JHN1cHBsZW1lbnRDb250YWluZXIuZmluZCgnLm5hdmlnYXRpb24tY29sdW1uJykuY3NzKCdtaW4taGVpZ2h0JywgbWluTmF2SGVpZ2h0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzdXBwbGVtZW50Q29udGFpbmVyLmZpbmQoJy5uYXZpZ2F0aW9uLXN1cHBsZW1lbnRhcnknKS5jc3MoJ21pbi1oZWlnaHQnLCAnbm9uZScpO1xuXHRcdFx0XHQkc3VwcGxlbWVudENvbnRhaW5lci5maW5kKCcubmF2aWdhdGlvbi1jb2x1bW4nKS5jc3MoJ21pbi1oZWlnaHQnLCAnbm9uZScpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHBvc2l0aW9uIGlzIGRlcGVuZGVudCBvbiB0aGUgbmF2QW5jaG9yIGFyZ3VtZW50IHBhc3NlZCBpbi5cblx0XHRmdW5jdGlvbiBzZXRTZWNvbmRhcnlOYXZQb3NpdGlvbiggbmF2QW5jaG9yICkge1xuXG5cdFx0XHR2YXIgbmF2QW5jaG9yID0gJCggbmF2QW5jaG9yICksXG5cdFx0XHQkdGhpc05hdlNlY29uZGFyeSxcblx0XHRcdHRoaXNSZWxhdGl2ZVBvc2l0aW9uLFxuXHRcdFx0dGhpc1JlbGF0aXZlTGVmdCxcblx0XHRcdHRoaXNSZWxhdGl2ZVBvc2l0aW9uLFxuXHRcdFx0dGhpc05hdlNlY29uZGFyeUxlZnQ7XG5cblx0XHRcdGlmICggdmlld3BvcnRXaWR0aCA+IHZpZXdwb3J0V2lkdGhCcmVha3BvaW50ICkge1xuXG5cdFx0XHRcdCR0aGlzTmF2U2Vjb25kYXJ5ID0gJCggbmF2QW5jaG9yICkubmV4dCggJy5uYXZpZ2F0aW9uLXNlY29uZGFyeScgKTtcblx0XHRcdFx0dGhpc1JlbGF0aXZlUG9zaXRpb24gPSAkKCBuYXZBbmNob3IgKS5wb3NpdGlvbigpO1xuXHRcdFx0XHR0aGlzUmVsYXRpdmVMZWZ0ID0gdGhpc1JlbGF0aXZlUG9zaXRpb24ubGVmdCB8fCAwO1xuXG5cdFx0XHRcdC8vIGRldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgJ2xlZnQnIHBvc2l0aW9uaW5nIHByb3BlcnR5LlxuXHRcdFx0XHRpZiAoIHRoaXNSZWxhdGl2ZUxlZnQgKyAkdGhpc05hdlNlY29uZGFyeS53aWR0aCgpIDw9ICQoJy5uYXZpZ2F0aW9uLXByaW1hcnknKS53aWR0aCgpICkge1xuXHRcdFx0XHRcdHRoaXNOYXZTZWNvbmRhcnlMZWZ0ID0gdGhpc1JlbGF0aXZlTGVmdDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzTmF2U2Vjb25kYXJ5TGVmdCA9ICdhdXRvJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR0aGlzTmF2U2Vjb25kYXJ5LmNzcyggJ2xlZnQnLCB0aGlzTmF2U2Vjb25kYXJ5TGVmdCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gbm8gYWRkaXRpb25hbCBwb3NpdGlvbmluZyBhY3Rpb24gcmVxdWlyZWQgb24gbW9iaWxlXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTsgLy8gZW5kIG5hdmlnYXRpb25TZXR1cFxuXG5cblxuXHR2YXIgbmF2TG9hZGVyID0ge1xuXHRcdHNob3VsZExvYWQ6IHtcblx0XHRcdG5hdjogJCgnLm5hdi1wcmltYXJ5JykubGVuZ3RoICE9PSAwID8gdHJ1ZSA6IGZhbHNlLFxuXHRcdFx0bmF2aWdhdGlvbjogJCgnLm5hdmlnYXRpb24tcHJpbWFyeScpLmxlbmd0aCAhPT0gMCA/IHRydWUgOiBmYWxzZVxuXHRcdH0sXG5cdFx0aXNMb2FkZWQ6IHtcblx0XHRcdG5hdjogZmFsc2UsXG5cdFx0XHRuYXZpZ2F0aW9uOiBmYWxzZVxuXHRcdH0sXG5cdFx0bG9hZEZ1bmN0aW9uczoge1xuXHRcdFx0bmF2OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmF2U2V0dXAoKTtcblx0XHRcdH0sXG5cdFx0XHRuYXZpZ2F0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmF2aWdhdGlvblNldHVwKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRsb2FkOiBmdW5jdGlvbihuYXZpZ2F0aW9uS2V5KSB7XG5cdFx0XHRpZiAodHlwZW9mIG5hdkxvYWRlci5sb2FkRnVuY3Rpb25zW25hdmlnYXRpb25LZXldICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRuYXZMb2FkZXIubG9hZEZ1bmN0aW9uc1tuYXZpZ2F0aW9uS2V5XSgpO1xuXG5cdFx0XHRcdC8vIGFzc3VtZSBpcyBsb2FkZWQgaWYgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZFxuXHRcdFx0XHRuYXZMb2FkZXIuaXNMb2FkZWRbbmF2aWdhdGlvbktleV0gPSB0cnVlO1xuXG5cdFx0XHRcdC8vIGFkZCBib2R5IGNsYXNzIGJhc2VkIG9uIG5hdmlnYXRpb24gbG9hZGVkXG5cdFx0XHRcdGlmICh0eXBlb2YgbmF2aWdhdGlvbktleSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHQvLyBnZXQgbG93ZXJjYXNlZCBkYXNoZWQgc3RyaW5nLCAnSGVsbG8gV29ybGQnID0+ICdoZWxsby13b3JsZCdcblx0XHRcdFx0XHR2YXIgbmF2Qm9keUNsYXNzID0gbmF2aWdhdGlvbktleS5yZXBsYWNlKC9cXHMrL2csICctJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ2JtYy1uYXYtbG9hZGVyLScgKyBuYXZCb2R5Q2xhc3MpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpc0xvYWRlZDogZnVuY3Rpb24obmF2aWdhdGlvbktleSkge1xuXHRcdFx0cmV0dXJuICh0eXBlb2YgbmF2TG9hZGVyLmlzTG9hZGVkW25hdmlnYXRpb25LZXldICE9PSAndW5kZWZpbmVkJykgPyBuYXZMb2FkZXIuaXNMb2FkZWRbbmF2aWdhdGlvbktleV0gOiBmYWxzZTtcblx0XHR9LFxuXHRcdGlzTmF2TG9hZGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBuYXZMb2FkZXIuaXNMb2FkZWQoJ25hdicpO1xuXHRcdH0sXG5cdFx0aXNOYXZpZ2F0aW9uTG9hZGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBuYXZMb2FkZXIuaXNMb2FkZWQoJ25hdmlnYXRpb24nKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gc2V0dXAgb25lIG9yIHRoZSBvdGhlciwgbm90IGJvdGhcblx0aWYgKG5hdkxvYWRlci5zaG91bGRMb2FkLm5hdikge1xuXHRcdG5hdkxvYWRlci5sb2FkKCduYXYnKTtcblx0fSBlbHNlIGlmIChuYXZMb2FkZXIuc2hvdWxkTG9hZC5uYXZpZ2F0aW9uKSB7XG5cdFx0bmF2TG9hZGVyLmxvYWQoJ25hdmlnYXRpb24nKTtcblx0fSBlbHNlIHtcblx0XHQvLyBubyBuYXZpZ2F0aW9ucyBzZXR1cFxuXHR9XG5cblx0Ly8gbWFrZSBhdmFpbGFibGUgZ2xvYmFsbHlcblx0d2luZG93LkJNQ05hdkxvYWRlciA9IG5hdkxvYWRlcjtcbn0pO1xuIl19
