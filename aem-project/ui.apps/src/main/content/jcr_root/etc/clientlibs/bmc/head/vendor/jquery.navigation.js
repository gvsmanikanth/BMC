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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5Lm5hdmlnYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIG5hdmlnYXRpb25TZXR1cCgpIHtcblxuXHR2YXIgJGxheW91dEhlYWRlciA9ICQoJy5sYXlvdXQtaGVhZGVyJyksXG5cdFx0aGVhZGVySGVpZ2h0ID0gJGxheW91dEhlYWRlci5vdXRlckhlaWdodCgpLFxuXHRcdG1pbk5hdkhlaWdodCA9IE1hdGgucm91bmQoJCgnLm5hdmlnYXRpb24tdGFiLWNvbnRyb2xzJykub3V0ZXJIZWlnaHQoKSksXG5cdFx0dmlld3BvcnRXaWR0aCA9ICQod2luZG93KS53aWR0aCgpLFxuXHRcdHZpZXdwb3J0V2lkdGhCcmVha3BvaW50ID0gOTYwLFxuXHRcdCRzdXBwbGVtZW50Q29udGFpbmVyID0gJCgnLm5hdmlnYXRpb24tdGFiLWNvbnRlbnQnKSxcblx0XHQvLyB0aW1lciB0byBwcmV2ZW50IG11bHRpcGxlIHJlc2l6ZSBldmVudHNcblx0XHRyZXNpemVUaW1lcjtcblxuXHQkKCcubGF5b3V0LW5hdmlnYXRpb24tb3BlbicpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHQkKCcubGF5b3V0LW5hdmlnYXRpb24nKS50b2dnbGVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTtcblx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25hdmlnYXRpb24tb3BlbicpO1xuXG5cdFx0JCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Lm5hdmlnYXRpb24tYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XG5cdFx0JCgnLm5hdmlnYXRpb24tc3VwcGxlbWVudGFyeS5uYXZpZ2F0aW9uLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xuXHRcdCQoJy50YWItY29udHJvbC5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdH0pO1xuXHRcblx0Ly8gJCgnLnNlbGVjdC1jb3VudHJ5JykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdC8vIGUucHJldmVudERlZmF1bHQoKTtcblx0XHQvLyAkKCdib2R5JykuYWRkQ2xhc3MoJ2NvdW50cnktbW9kYWwtYWN0aXZlJyk7XG5cdC8vIH0pO1xuXG5cdCQoJy5jb250YWN0LWJtYycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCgnYm9keScpLmFkZENsYXNzKCdjb250YWN0LW1vZGFsLWFjdGl2ZScpO1xuXHR9KTtcblxuXHQkKCcubW9kYWwtY2xvc2UsIC5sYXlvdXQtbW9kYWwtb3ZlcmxheScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdjb250YWN0LW1vZGFsLWFjdGl2ZScpO1xuXHR9KTtcblx0XG5cdC8vIC8vIGFkZGVkIGV2ZW50IHRvIGRldGVjdCBDb3VudHJ5IG1vZGFsIGNsb3NlXG5cdC8vICQoJy5jb3VudHJ5LW1vZGFsLWNsb3NlLCAubGF5b3V0LW1vZGFsLW92ZXJsYXknKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0Ly8gZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdC8vICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnY291bnRyeS1tb2RhbC1hY3RpdmUnKTtcblx0Ly8gfSk7XG5cblx0JCgnLmxheW91dC1uYXZpZ2F0aW9uLWNsb3NlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQoJy5sYXlvdXQtbmF2aWdhdGlvbicpLnRvZ2dsZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xuXHRcdCQoJ2JvZHknKS50b2dnbGVDbGFzcygnbmF2aWdhdGlvbi1vcGVuJyk7XG5cdH0pO1xuXG5cdC8vIHRvZ2dsZUNsYXNzIGFjdGl2ZSBvbiBwcmltYXJ5IG5hdmlnYXRpb24gbGlua3Ncblx0JCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5LXRvZ2dsZSA+IGEnKS5jbGljayhmdW5jdGlvbihlKXtcblxuXHRcdHZhciAkdGhpc05hdlNlY29uZGFyeSA9ICQodGhpcykubmV4dCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Jyk7XG5cdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHR2YXIgJHRoaXNQYXJlbnQgPSAkdGhpcy5wYXJlbnQoKTtcblx0XHR2YXIgbWF4TmF2SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gNTA7XG5cdFx0dmFyICR0aGlzUG9zaXRpb24gPSAkKHRoaXMpLnBvc2l0aW9uKCk7XG5cdFx0dmFyIHRoaXNMZWZ0ID0gJHRoaXNQb3NpdGlvbi5sZWZ0IHx8IDA7XG5cdFx0dmFyIHRoaXNOYXZTZWNvbmRhcnlMZWZ0O1xuXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0JCgnLm5hdmlnYXRpb24tcHJpbWFyeScpXG5cdFx0XHQuZmluZCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Jylcblx0XHRcdC5ub3QoJHRoaXNOYXZTZWNvbmRhcnkpXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJylcblx0XHRcdC5hdHRyKCdzdHlsZScsICcnKTtcblxuXHRcdCQoJy5uYXZpZ2F0aW9uLXByaW1hcnknKVxuXHRcdFx0LmZpbmQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeS10b2dnbGUuaGludGVkJylcblx0XHRcdC5ub3QoJHRoaXNQYXJlbnQpXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ2hpbnRlZCcpO1xuXG5cdFx0JHRoaXMucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ2hpbnRlZCcpO1xuXG5cdFx0JHRoaXNOYXZTZWNvbmRhcnkudG9nZ2xlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XG5cblx0XHRpZiAoICR0aGlzTmF2U2Vjb25kYXJ5Lmhhc0NsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpICkge1xuXHRcdFx0JHRoaXNOYXZTZWNvbmRhcnkuY3NzKCdtYXgtaGVpZ2h0JywgbWF4TmF2SGVpZ2h0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRoaXNOYXZTZWNvbmRhcnkuYXR0cignc3R5bGUnLCAnJyk7XG5cdFx0fVxuXG5cdFx0Ly8gTkFWIFBST0RVQ1RTICYgU09MVVRJT05TXG5cdFx0Ly8gc2V0IHRoZSBoZWlnaHQgb2YgdGhlIHRhYiBjb250YWluZXJzIHRvIGJlIGVxdWFsXG5cdFx0aWYgKCAkdGhpc05hdlNlY29uZGFyeS5oYXNDbGFzcygnbmF2aWdhdGlvbi10YWJiZWQtbWVudScpICkge1xuXHRcdFx0ZXF1YWxIZWlnaHROYXZDb2x1bW5zKG1pbk5hdkhlaWdodCk7XG5cdFx0fVxuXG5cdFx0Ly8gY29ycmVjdGx5IHNldCBwb3NpdGlvbiBmb3Igc2Vjb25kYXJ5IG5hdlxuXHRcdHNldFNlY29uZGFyeU5hdlBvc2l0aW9uKCAkdGhpcyApO1xuXHR9KTtcblxuXHQkKCB3aW5kb3cgKS5vbiggJ3Jlc2l6ZScsIGZ1bmN0aW9uKGUpIHtcblx0XHRjbGVhclRpbWVvdXQocmVzaXplVGltZXIpO1xuXHRcdC8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvanF1ZXJ5L2RvbmUtcmVzaXppbmctZXZlbnQvXG5cdFx0cmVzaXplVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gcmVzZXQgZG9jIHNpemUgYmFzZWQgdmFyaWFibGVzXG5cdFx0XHR2aWV3cG9ydFdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cdFx0XHRtaW5OYXZIZWlnaHQgPSBNYXRoLnJvdW5kKCQoJy5uYXZpZ2F0aW9uLXRhYi1jb250cm9scycpLm91dGVySGVpZ2h0KCkpO1xuXHRcdFx0Ly8gbGF1bmNoIGRvYyBzaXplIGJhc2VkIGZ1bmN0aW9uc1xuXHRcdFx0aWYgKCAkKCAnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Lm5hdmlnYXRpb24tYWN0aXZlJyApLnNpYmxpbmdzKCAnYScgKS5sZW5ndGggPiAwICl7XG5cdFx0XHRcdHNldFNlY29uZGFyeU5hdlBvc2l0aW9uKCAkKCAnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Lm5hdmlnYXRpb24tYWN0aXZlJyApLnNpYmxpbmdzKCAnYScgKSApO1xuXHRcdFx0fVxuXHRcdFx0ZXF1YWxIZWlnaHROYXZDb2x1bW5zKG1pbk5hdkhlaWdodCk7XG5cdFx0fSwgMjUwKTtcblx0fSk7XG5cblx0Ly8gZXhwb3NlcyB0aGUgcHJpbWFyeSBuYXYgaXRlbXMgd2hlbiBpbiBhIHNjcm9sbGVkLWRvd24gb3Igc2Nyb2xsZWQtdXAgc3RhdGVcblx0JCgnLm5hdmlnYXRpb24tbWVudS1saW5rJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ2Rpc3BsYXktc2Nyb2xsZWQtbWVudScpO1xuXHR9KTtcblxuXHQvLyBEaXNtaXNzZXMgbWVudSBpZiB0YXBzIGFyZSBtYWRlIG91dHNpZGUgb2YgdGhlIG1lbnVcblx0JCgnYm9keScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuXHRcdHZhciAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XG5cdFx0dmFyIGNsaWNrSW5OYXYgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcubmF2aWdhdGlvbi1zZWNvbmRhcnksIC5sYXlvdXQtbmF2aWdhdGlvbiwgLmxheW91dC1jb250YWN0LW1vZGFsJykuYWRkQmFjaygnLm5hdmlnYXRpb24tc2Vjb25kYXJ5Jyk7XG5cblx0XHRpZiAoISR0YXJnZXQuaGFzQ2xhc3MoJ2xheW91dC1tb2RhbC1vdmVybGF5JykpIHtcblx0XHRcdGlmICghY2xpY2tJbk5hdi5sZW5ndGgpIHtcblx0XHRcdFx0JCgnLm5hdmlnYXRpb24tc2Vjb25kYXJ5JykucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJykuYXR0cignc3R5bGUnLCAnJyk7XG5cdFx0XHRcdCQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeS10b2dnbGUnKS5yZW1vdmVDbGFzcygnaGludGVkJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH0pO1xuXG5cdCQoJy5uYXZpZ2F0aW9uLXNlY29uZGFyeS1jbG9zZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHQkcGFyZW50ID0gJCh0aGlzKS5wYXJlbnRzKCcubmF2aWdhdGlvbi1zZWNvbmRhcnknKTtcblx0XHQkcGFyZW50XG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJylcblx0XHRcdC5hdHRyKCdzdHlsZScsICcnKTtcblx0fSk7XG5cblx0Ly8gLm5hdmlnYXRpb24tdGFiYmVkLW1lbnUgdGFiIGZ1bmN0aW9uYWxpdHlcblx0JCgnLnRhYi1jb250cm9sJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHQkdGhpcyA9ICQodGhpcyk7XG5cdFx0JHN1cHBsZW1lbnROYXYgPSAkdGhpcy5uZXh0KCcubmF2aWdhdGlvbi1zdXBwbGVtZW50YXJ5Jyk7XG5cblx0XHQkKCcubmF2aWdhdGlvbi1zdXBwbGVtZW50YXJ5JykucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XG5cdFx0JCgnLnRhYi1jb250cm9sJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS10YWInKTtcblx0XHQkdGhpcy5hZGRDbGFzcygnYWN0aXZlLXRhYicpO1xuXG5cdFx0Ly8gY2xlYXIgb3V0IHRoZSBzdXBwbGVtZW50IGNvbnRhaW5lclxuXHRcdCRzdXBwbGVtZW50Q29udGFpbmVyLmh0bWwoJycpO1xuXHRcdC8vIGFuZCBwb3B1bGF0ZSBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBtZW51XG5cdFx0JHN1cHBsZW1lbnROYXZcblx0XHRcdC5jbG9uZSgpXG5cdFx0XHQuYXBwZW5kVG8oJHN1cHBsZW1lbnRDb250YWluZXIpO1xuXG5cdFx0Ly8gZXF1YWxpemUgdGhlIGNvbHVtbiBoZWlnaHRzXG5cdFx0ZXF1YWxIZWlnaHROYXZDb2x1bW5zKG1pbk5hdkhlaWdodCk7XG5cblx0XHQkc3VwcGxlbWVudENvbnRhaW5lclxuXHRcdFx0LmZpbmQoJy5uYXZpZ2F0aW9uLXN1cHBsZW1lbnRhcnknKVxuXHRcdFx0LmFkZENsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpOyAvLyBkb2Vzbid0IHRyaWdnZXIgY3NzIHRyYW5zaXRpb24gYW5pbWF0aW9uIDooXG5cdH0pO1xuXG5cdC8vIG5hdmlnYXRpb24tc3VwcGxlbWVudGFyeSBjbG9zZSByZXF1aXJlcyBhIHF1YXNpIHJlYmluZCBzaW5jZSBpdCBpcyBkeW5hbWljYWxseSBnZW5lcmF0ZWRcblx0JCgnLm5hdmlnYXRpb24tdGFiLWNvbnRlbnQnKS5vbignY2xpY2snLCAnLm5hdmlnYXRpb24tY2xvc2Utc3VwcGxlbWVudGFyeScsIGZ1bmN0aW9uKCkge1xuXHRcdCQoJy5uYXZpZ2F0aW9uLXN1cHBsZW1lbnRhcnknKS5yZW1vdmVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTtcblx0fSk7XG5cblx0Ly8gRGV0ZWN0IHdoZW4gc2VhcmNoIGJveCBpcyBmb2N1c2VkXG5cdHZhciBuYXZpZ2F0aW9uU2VhcmNoID0gJCgnLmpzLW5hdmlnYXRpb24tc2VhcmNoJyksXG5cdFx0bmF2aWdhdGlvblNlYXJjaEZvY3VzID0gbmF2aWdhdGlvblNlYXJjaC5maW5kKCcuc2VhcmNoLWZvY3VzJyk7XG5cdG5hdmlnYXRpb25TZWFyY2hGb2N1cy5mb2N1c291dChmdW5jdGlvbigpIHtcblx0XHRuYXZpZ2F0aW9uU2VhcmNoLnJlbW92ZUNsYXNzKCdvbicpO1xuXHR9KTtcblx0bmF2aWdhdGlvblNlYXJjaEZvY3VzLmZvY3VzaW4oZnVuY3Rpb24oKSB7XG5cdFx0bmF2aWdhdGlvblNlYXJjaC5hZGRDbGFzcygnb24nKTtcblx0fSk7XG5cblx0Ly8gdGhpcyBmdW5jdGlvbiBwcm92aWRlcyBlcXVhbCBoZWlnaHQgdG8gZWxlbWVudHMgaW4gdGhlICduYXZpZ2F0aW9uLXRhYmJlZC1tZW51JyBjb250YWluZXJcblx0ZnVuY3Rpb24gZXF1YWxIZWlnaHROYXZDb2x1bW5zKG1pbk5hdkhlaWdodCkge1xuXHRcdGlmICggdmlld3BvcnRXaWR0aCA+IHZpZXdwb3J0V2lkdGhCcmVha3BvaW50ICkge1xuXHRcdFx0JHN1cHBsZW1lbnRDb250YWluZXIuZmluZCgnLm5hdmlnYXRpb24tc3VwcGxlbWVudGFyeScpLmNzcygnbWluLWhlaWdodCcsIG1pbk5hdkhlaWdodCk7XG5cdFx0XHQkc3VwcGxlbWVudENvbnRhaW5lci5maW5kKCcubmF2aWdhdGlvbi1jb2x1bW4nKS5jc3MoJ21pbi1oZWlnaHQnLCBtaW5OYXZIZWlnaHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkc3VwcGxlbWVudENvbnRhaW5lci5maW5kKCcubmF2aWdhdGlvbi1zdXBwbGVtZW50YXJ5JykuY3NzKCdtaW4taGVpZ2h0JywgJ25vbmUnKTtcblx0XHRcdCRzdXBwbGVtZW50Q29udGFpbmVyLmZpbmQoJy5uYXZpZ2F0aW9uLWNvbHVtbicpLmNzcygnbWluLWhlaWdodCcsICdub25lJyk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gcG9zaXRpb24gaXMgZGVwZW5kZW50IG9uIHRoZSBuYXZBbmNob3IgYXJndW1lbnQgcGFzc2VkIGluLlxuXHRmdW5jdGlvbiBzZXRTZWNvbmRhcnlOYXZQb3NpdGlvbiggbmF2QW5jaG9yICkge1xuXG5cdFx0dmFyIG5hdkFuY2hvciA9ICQoIG5hdkFuY2hvciApLFxuXHRcdCR0aGlzTmF2U2Vjb25kYXJ5LFxuXHRcdHRoaXNSZWxhdGl2ZVBvc2l0aW9uLFxuXHRcdHRoaXNSZWxhdGl2ZUxlZnQsXG5cdFx0dGhpc1JlbGF0aXZlUG9zaXRpb24sXG5cdFx0dGhpc05hdlNlY29uZGFyeUxlZnQ7XG5cblx0XHRpZiAoIHZpZXdwb3J0V2lkdGggPiB2aWV3cG9ydFdpZHRoQnJlYWtwb2ludCApIHtcblxuXHRcdFx0JHRoaXNOYXZTZWNvbmRhcnkgPSAkKCBuYXZBbmNob3IgKS5uZXh0KCAnLm5hdmlnYXRpb24tc2Vjb25kYXJ5JyApO1xuXHRcdFx0dGhpc1JlbGF0aXZlUG9zaXRpb24gPSAkKCBuYXZBbmNob3IgKS5wb3NpdGlvbigpO1xuXHRcdFx0dGhpc1JlbGF0aXZlTGVmdCA9IHRoaXNSZWxhdGl2ZVBvc2l0aW9uLmxlZnQgfHwgMDtcblxuXHRcdFx0Ly8gZGV0ZXJtaW5lIHRoZSBhcHByb3ByaWF0ZSAnbGVmdCcgcG9zaXRpb25pbmcgcHJvcGVydHkuXG5cdFx0XHRpZiAoIHRoaXNSZWxhdGl2ZUxlZnQgKyAkdGhpc05hdlNlY29uZGFyeS53aWR0aCgpIDw9ICQoJy5uYXZpZ2F0aW9uLXByaW1hcnknKS53aWR0aCgpICkge1xuXHRcdFx0XHR0aGlzTmF2U2Vjb25kYXJ5TGVmdCA9IHRoaXNSZWxhdGl2ZUxlZnQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzTmF2U2Vjb25kYXJ5TGVmdCA9ICdhdXRvJztcblx0XHRcdH1cblxuXHRcdFx0JHRoaXNOYXZTZWNvbmRhcnkuY3NzKCAnbGVmdCcsIHRoaXNOYXZTZWNvbmRhcnlMZWZ0ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIG5vIGFkZGl0aW9uYWwgcG9zaXRpb25pbmcgYWN0aW9uIHJlcXVpcmVkIG9uIG1vYmlsZVxuXHRcdH1cblxuXHR9XG5cbn07Il19
