(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
	
	// $('.select-country').click(function(e) {
		// e.preventDefault();
		// $('body').addClass('country-modal-active');
	// });

	$('.contact-bmc').click(function(e) {
		e.preventDefault();
		$('body').addClass('contact-modal-active');
	});

	$('.modal-close, .layout-modal-overlay').click(function(e) {
		e.preventDefault();
		$('body').removeClass('contact-modal-active');
	});
	
	// // added event to detect Country modal close
	// $('.country-modal-close, .layout-modal-overlay').click(function(e) {
		// e.preventDefault();
		// $('body').removeClass('country-modal-active');
	// });

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

};
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5Lm5hdmlnYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIG5hdmlnYXRpb25TZXR1cCgpIHtcclxuXHJcblx0dmFyICRsYXlvdXRIZWFkZXIgPSAkKCcubGF5b3V0LWhlYWRlcicpLFxyXG5cdFx0aGVhZGVySGVpZ2h0ID0gJGxheW91dEhlYWRlci5vdXRlckhlaWdodCgpLFxyXG5cdFx0bWluTmF2SGVpZ2h0ID0gTWF0aC5yb3VuZCgkKCcubmF2aWdhdGlvbi10YWItY29udHJvbHMnKS5vdXRlckhlaWdodCgpKSxcclxuXHRcdHZpZXdwb3J0V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuXHRcdHZpZXdwb3J0V2lkdGhCcmVha3BvaW50ID0gOTYwLFxyXG5cdFx0JHN1cHBsZW1lbnRDb250YWluZXIgPSAkKCcubmF2aWdhdGlvbi10YWItY29udGVudCcpLFxyXG5cdFx0Ly8gdGltZXIgdG8gcHJldmVudCBtdWx0aXBsZSByZXNpemUgZXZlbnRzXHJcblx0XHRyZXNpemVUaW1lcjtcclxuXHJcblx0JCgnLmxheW91dC1uYXZpZ2F0aW9uLW9wZW4nKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0JCgnLmxheW91dC1uYXZpZ2F0aW9uJykudG9nZ2xlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XHJcblx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25hdmlnYXRpb24tb3BlbicpO1xyXG5cclxuXHRcdCQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeS5uYXZpZ2F0aW9uLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xyXG5cdFx0JCgnLm5hdmlnYXRpb24tc3VwcGxlbWVudGFyeS5uYXZpZ2F0aW9uLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xyXG5cdFx0JCgnLnRhYi1jb250cm9sLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHR9KTtcclxuXHRcclxuXHQvLyAkKCcuc2VsZWN0LWNvdW50cnknKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHQvLyBlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHQvLyAkKCdib2R5JykuYWRkQ2xhc3MoJ2NvdW50cnktbW9kYWwtYWN0aXZlJyk7XHJcblx0Ly8gfSk7XHJcblxyXG5cdCQoJy5jb250YWN0LWJtYycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnY29udGFjdC1tb2RhbC1hY3RpdmUnKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLm1vZGFsLWNsb3NlLCAubGF5b3V0LW1vZGFsLW92ZXJsYXknKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2NvbnRhY3QtbW9kYWwtYWN0aXZlJyk7XHJcblx0fSk7XHJcblx0XHJcblx0Ly8gLy8gYWRkZWQgZXZlbnQgdG8gZGV0ZWN0IENvdW50cnkgbW9kYWwgY2xvc2VcclxuXHQvLyAkKCcuY291bnRyeS1tb2RhbC1jbG9zZSwgLmxheW91dC1tb2RhbC1vdmVybGF5JykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdFx0Ly8gZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0Ly8gJCgnYm9keScpLnJlbW92ZUNsYXNzKCdjb3VudHJ5LW1vZGFsLWFjdGl2ZScpO1xyXG5cdC8vIH0pO1xyXG5cclxuXHQkKCcubGF5b3V0LW5hdmlnYXRpb24tY2xvc2UnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0JCgnLmxheW91dC1uYXZpZ2F0aW9uJykudG9nZ2xlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XHJcblx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25hdmlnYXRpb24tb3BlbicpO1xyXG5cdH0pO1xyXG5cclxuXHQvLyB0b2dnbGVDbGFzcyBhY3RpdmUgb24gcHJpbWFyeSBuYXZpZ2F0aW9uIGxpbmtzXHJcblx0JCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5LXRvZ2dsZSA+IGEnKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHJcblx0XHR2YXIgJHRoaXNOYXZTZWNvbmRhcnkgPSAkKHRoaXMpLm5leHQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeScpO1xyXG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdHZhciAkdGhpc1BhcmVudCA9ICR0aGlzLnBhcmVudCgpO1xyXG5cdFx0dmFyIG1heE5hdkhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKSAtIDUwO1xyXG5cdFx0dmFyICR0aGlzUG9zaXRpb24gPSAkKHRoaXMpLnBvc2l0aW9uKCk7XHJcblx0XHR2YXIgdGhpc0xlZnQgPSAkdGhpc1Bvc2l0aW9uLmxlZnQgfHwgMDtcclxuXHRcdHZhciB0aGlzTmF2U2Vjb25kYXJ5TGVmdDtcclxuXHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0JCgnLm5hdmlnYXRpb24tcHJpbWFyeScpXHJcblx0XHRcdC5maW5kKCcubmF2aWdhdGlvbi1zZWNvbmRhcnknKVxyXG5cdFx0XHQubm90KCR0aGlzTmF2U2Vjb25kYXJ5KVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJylcclxuXHRcdFx0LmF0dHIoJ3N0eWxlJywgJycpO1xyXG5cclxuXHRcdCQoJy5uYXZpZ2F0aW9uLXByaW1hcnknKVxyXG5cdFx0XHQuZmluZCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5LXRvZ2dsZS5oaW50ZWQnKVxyXG5cdFx0XHQubm90KCR0aGlzUGFyZW50KVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ2hpbnRlZCcpO1xyXG5cclxuXHRcdCR0aGlzLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdoaW50ZWQnKTtcclxuXHJcblx0XHQkdGhpc05hdlNlY29uZGFyeS50b2dnbGVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTtcclxuXHJcblx0XHRpZiAoICR0aGlzTmF2U2Vjb25kYXJ5Lmhhc0NsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpICkge1xyXG5cdFx0XHQkdGhpc05hdlNlY29uZGFyeS5jc3MoJ21heC1oZWlnaHQnLCBtYXhOYXZIZWlnaHQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JHRoaXNOYXZTZWNvbmRhcnkuYXR0cignc3R5bGUnLCAnJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTkFWIFBST0RVQ1RTICYgU09MVVRJT05TXHJcblx0XHQvLyBzZXQgdGhlIGhlaWdodCBvZiB0aGUgdGFiIGNvbnRhaW5lcnMgdG8gYmUgZXF1YWxcclxuXHRcdGlmICggJHRoaXNOYXZTZWNvbmRhcnkuaGFzQ2xhc3MoJ25hdmlnYXRpb24tdGFiYmVkLW1lbnUnKSApIHtcclxuXHRcdFx0ZXF1YWxIZWlnaHROYXZDb2x1bW5zKG1pbk5hdkhlaWdodCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY29ycmVjdGx5IHNldCBwb3NpdGlvbiBmb3Igc2Vjb25kYXJ5IG5hdlxyXG5cdFx0c2V0U2Vjb25kYXJ5TmF2UG9zaXRpb24oICR0aGlzICk7XHJcblx0fSk7XHJcblxyXG5cdCQoIHdpbmRvdyApLm9uKCAncmVzaXplJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVyKTtcclxuXHRcdC8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvanF1ZXJ5L2RvbmUtcmVzaXppbmctZXZlbnQvXHJcblx0XHRyZXNpemVUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIHJlc2V0IGRvYyBzaXplIGJhc2VkIHZhcmlhYmxlc1xyXG5cdFx0XHR2aWV3cG9ydFdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcblx0XHRcdG1pbk5hdkhlaWdodCA9IE1hdGgucm91bmQoJCgnLm5hdmlnYXRpb24tdGFiLWNvbnRyb2xzJykub3V0ZXJIZWlnaHQoKSk7XHJcblx0XHRcdC8vIGxhdW5jaCBkb2Mgc2l6ZSBiYXNlZCBmdW5jdGlvbnNcclxuXHRcdFx0aWYgKCAkKCAnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Lm5hdmlnYXRpb24tYWN0aXZlJyApLnNpYmxpbmdzKCAnYScgKS5sZW5ndGggPiAwICl7XHJcblx0XHRcdFx0c2V0U2Vjb25kYXJ5TmF2UG9zaXRpb24oICQoICcubmF2aWdhdGlvbi1zZWNvbmRhcnkubmF2aWdhdGlvbi1hY3RpdmUnICkuc2libGluZ3MoICdhJyApICk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZXF1YWxIZWlnaHROYXZDb2x1bW5zKG1pbk5hdkhlaWdodCk7XHJcblx0XHR9LCAyNTApO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBleHBvc2VzIHRoZSBwcmltYXJ5IG5hdiBpdGVtcyB3aGVuIGluIGEgc2Nyb2xsZWQtZG93biBvciBzY3JvbGxlZC11cCBzdGF0ZVxyXG5cdCQoJy5uYXZpZ2F0aW9uLW1lbnUtbGluaycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdCQoJ2JvZHknKS50b2dnbGVDbGFzcygnZGlzcGxheS1zY3JvbGxlZC1tZW51Jyk7XHJcblx0fSk7XHJcblxyXG5cdC8vIERpc21pc3NlcyBtZW51IGlmIHRhcHMgYXJlIG1hZGUgb3V0c2lkZSBvZiB0aGUgbWVudVxyXG5cdCQoJ2JvZHknKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHRcdHZhciAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XHJcblx0XHR2YXIgY2xpY2tJbk5hdiA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeSwgLmxheW91dC1uYXZpZ2F0aW9uLCAubGF5b3V0LWNvbnRhY3QtbW9kYWwnKS5hZGRCYWNrKCcubmF2aWdhdGlvbi1zZWNvbmRhcnknKTtcclxuXHJcblx0XHRpZiAoISR0YXJnZXQuaGFzQ2xhc3MoJ2xheW91dC1tb2RhbC1vdmVybGF5JykpIHtcclxuXHRcdFx0aWYgKCFjbGlja0luTmF2Lmxlbmd0aCkge1xyXG5cdFx0XHRcdCQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeScpLnJlbW92ZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpLmF0dHIoJ3N0eWxlJywgJycpO1xyXG5cdFx0XHRcdCQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeS10b2dnbGUnKS5yZW1vdmVDbGFzcygnaGludGVkJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fSk7XHJcblxyXG5cdCQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeS1jbG9zZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdCRwYXJlbnQgPSAkKHRoaXMpLnBhcmVudHMoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeScpO1xyXG5cdFx0JHBhcmVudFxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJylcclxuXHRcdFx0LmF0dHIoJ3N0eWxlJywgJycpO1xyXG5cdH0pO1xyXG5cclxuXHQvLyAubmF2aWdhdGlvbi10YWJiZWQtbWVudSB0YWIgZnVuY3Rpb25hbGl0eVxyXG5cdCQoJy50YWItY29udHJvbCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdCR0aGlzID0gJCh0aGlzKTtcclxuXHRcdCRzdXBwbGVtZW50TmF2ID0gJHRoaXMubmV4dCgnLm5hdmlnYXRpb24tc3VwcGxlbWVudGFyeScpO1xyXG5cclxuXHRcdCQoJy5uYXZpZ2F0aW9uLXN1cHBsZW1lbnRhcnknKS5yZW1vdmVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTtcclxuXHRcdCQoJy50YWItY29udHJvbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUtdGFiJyk7XHJcblx0XHQkdGhpcy5hZGRDbGFzcygnYWN0aXZlLXRhYicpO1xyXG5cclxuXHRcdC8vIGNsZWFyIG91dCB0aGUgc3VwcGxlbWVudCBjb250YWluZXJcclxuXHRcdCRzdXBwbGVtZW50Q29udGFpbmVyLmh0bWwoJycpO1xyXG5cdFx0Ly8gYW5kIHBvcHVsYXRlIGl0IHdpdGggdGhlIGFwcHJvcHJpYXRlIG1lbnVcclxuXHRcdCRzdXBwbGVtZW50TmF2XHJcblx0XHRcdC5jbG9uZSgpXHJcblx0XHRcdC5hcHBlbmRUbygkc3VwcGxlbWVudENvbnRhaW5lcik7XHJcblxyXG5cdFx0Ly8gZXF1YWxpemUgdGhlIGNvbHVtbiBoZWlnaHRzXHJcblx0XHRlcXVhbEhlaWdodE5hdkNvbHVtbnMobWluTmF2SGVpZ2h0KTtcclxuXHJcblx0XHQkc3VwcGxlbWVudENvbnRhaW5lclxyXG5cdFx0XHQuZmluZCgnLm5hdmlnYXRpb24tc3VwcGxlbWVudGFyeScpXHJcblx0XHRcdC5hZGRDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTsgLy8gZG9lc24ndCB0cmlnZ2VyIGNzcyB0cmFuc2l0aW9uIGFuaW1hdGlvbiA6KFxyXG5cdH0pO1xyXG5cclxuXHQvLyBuYXZpZ2F0aW9uLXN1cHBsZW1lbnRhcnkgY2xvc2UgcmVxdWlyZXMgYSBxdWFzaSByZWJpbmQgc2luY2UgaXQgaXMgZHluYW1pY2FsbHkgZ2VuZXJhdGVkXHJcblx0JCgnLm5hdmlnYXRpb24tdGFiLWNvbnRlbnQnKS5vbignY2xpY2snLCAnLm5hdmlnYXRpb24tY2xvc2Utc3VwcGxlbWVudGFyeScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0JCgnLm5hdmlnYXRpb24tc3VwcGxlbWVudGFyeScpLnJlbW92ZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBEZXRlY3Qgd2hlbiBzZWFyY2ggYm94IGlzIGZvY3VzZWRcclxuXHR2YXIgbmF2aWdhdGlvblNlYXJjaCA9ICQoJy5qcy1uYXZpZ2F0aW9uLXNlYXJjaCcpLFxyXG5cdFx0bmF2aWdhdGlvblNlYXJjaEZvY3VzID0gbmF2aWdhdGlvblNlYXJjaC5maW5kKCcuc2VhcmNoLWZvY3VzJyk7XHJcblx0bmF2aWdhdGlvblNlYXJjaEZvY3VzLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0bmF2aWdhdGlvblNlYXJjaC5yZW1vdmVDbGFzcygnb24nKTtcclxuXHR9KTtcclxuXHRuYXZpZ2F0aW9uU2VhcmNoRm9jdXMuZm9jdXNpbihmdW5jdGlvbigpIHtcclxuXHRcdG5hdmlnYXRpb25TZWFyY2guYWRkQ2xhc3MoJ29uJyk7XHJcblx0fSk7XHJcblxyXG5cdC8vIHRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgZXF1YWwgaGVpZ2h0IHRvIGVsZW1lbnRzIGluIHRoZSAnbmF2aWdhdGlvbi10YWJiZWQtbWVudScgY29udGFpbmVyXHJcblx0ZnVuY3Rpb24gZXF1YWxIZWlnaHROYXZDb2x1bW5zKG1pbk5hdkhlaWdodCkge1xyXG5cdFx0aWYgKCB2aWV3cG9ydFdpZHRoID4gdmlld3BvcnRXaWR0aEJyZWFrcG9pbnQgKSB7XHJcblx0XHRcdCRzdXBwbGVtZW50Q29udGFpbmVyLmZpbmQoJy5uYXZpZ2F0aW9uLXN1cHBsZW1lbnRhcnknKS5jc3MoJ21pbi1oZWlnaHQnLCBtaW5OYXZIZWlnaHQpO1xyXG5cdFx0XHQkc3VwcGxlbWVudENvbnRhaW5lci5maW5kKCcubmF2aWdhdGlvbi1jb2x1bW4nKS5jc3MoJ21pbi1oZWlnaHQnLCBtaW5OYXZIZWlnaHQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JHN1cHBsZW1lbnRDb250YWluZXIuZmluZCgnLm5hdmlnYXRpb24tc3VwcGxlbWVudGFyeScpLmNzcygnbWluLWhlaWdodCcsICdub25lJyk7XHJcblx0XHRcdCRzdXBwbGVtZW50Q29udGFpbmVyLmZpbmQoJy5uYXZpZ2F0aW9uLWNvbHVtbicpLmNzcygnbWluLWhlaWdodCcsICdub25lJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBwb3NpdGlvbiBpcyBkZXBlbmRlbnQgb24gdGhlIG5hdkFuY2hvciBhcmd1bWVudCBwYXNzZWQgaW4uXHJcblx0ZnVuY3Rpb24gc2V0U2Vjb25kYXJ5TmF2UG9zaXRpb24oIG5hdkFuY2hvciApIHtcclxuXHJcblx0XHR2YXIgbmF2QW5jaG9yID0gJCggbmF2QW5jaG9yICksXHJcblx0XHQkdGhpc05hdlNlY29uZGFyeSxcclxuXHRcdHRoaXNSZWxhdGl2ZVBvc2l0aW9uLFxyXG5cdFx0dGhpc1JlbGF0aXZlTGVmdCxcclxuXHRcdHRoaXNSZWxhdGl2ZVBvc2l0aW9uLFxyXG5cdFx0dGhpc05hdlNlY29uZGFyeUxlZnQ7XHJcblxyXG5cdFx0aWYgKCB2aWV3cG9ydFdpZHRoID4gdmlld3BvcnRXaWR0aEJyZWFrcG9pbnQgKSB7XHJcblxyXG5cdFx0XHQkdGhpc05hdlNlY29uZGFyeSA9ICQoIG5hdkFuY2hvciApLm5leHQoICcubmF2aWdhdGlvbi1zZWNvbmRhcnknICk7XHJcblx0XHRcdHRoaXNSZWxhdGl2ZVBvc2l0aW9uID0gJCggbmF2QW5jaG9yICkucG9zaXRpb24oKTtcclxuXHRcdFx0dGhpc1JlbGF0aXZlTGVmdCA9IHRoaXNSZWxhdGl2ZVBvc2l0aW9uLmxlZnQgfHwgMDtcclxuXHJcblx0XHRcdC8vIGRldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgJ2xlZnQnIHBvc2l0aW9uaW5nIHByb3BlcnR5LlxyXG5cdFx0XHRpZiAoIHRoaXNSZWxhdGl2ZUxlZnQgKyAkdGhpc05hdlNlY29uZGFyeS53aWR0aCgpIDw9ICQoJy5uYXZpZ2F0aW9uLXByaW1hcnknKS53aWR0aCgpICkge1xyXG5cdFx0XHRcdHRoaXNOYXZTZWNvbmRhcnlMZWZ0ID0gdGhpc1JlbGF0aXZlTGVmdDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzTmF2U2Vjb25kYXJ5TGVmdCA9ICdhdXRvJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JHRoaXNOYXZTZWNvbmRhcnkuY3NzKCAnbGVmdCcsIHRoaXNOYXZTZWNvbmRhcnlMZWZ0ICk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBubyBhZGRpdGlvbmFsIHBvc2l0aW9uaW5nIGFjdGlvbiByZXF1aXJlZCBvbiBtb2JpbGVcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxufTsiXX0=
