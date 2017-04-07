var $ = require('jquery'),
	utilities = require('../modules/utilities'),
	$layoutNav = ($('.layout-navigation').length ? $('.layout-navigation') : $('.layout-nav')),
	layoutNavHeight = $layoutNav.outerHeight(),
	$layoutHeader = $('.layout-header'),
	headerHeight = $layoutHeader.outerHeight(),
	$window = $(window),
	$body = $('body'),
	windowPosition = $window.scrollTop(),
	viewportWidthBreakpoint = 960,
	windowResize = new utilities.EventDebouncer('resize');

// fix the nav once you've scrolled past the header
$window.on('scroll', function() {
	var scrollAmount = $window.scrollTop(),
		highResolution = Modernizr.mq('only screen and (min-width: 60em)');

	// specific to the 'navigation' navigation key
	if (BMCNavLoader && BMCNavLoader.isLoaded('navigation')) {
		// clear the display scrolled menu state and close any open navigation-secondarys
		// should only apply to desktop menu
		if ($(window).width() > viewportWidthBreakpoint) {
			$body.removeClass('display-scrolled-menu');
			$layoutNav.find('.navigation-active').removeClass('navigation-active');
			$layoutNav.find('.hinted').removeClass('hinted');
		}
	}

	// still in header
	if (scrollAmount <= headerHeight) {
		$body
			.removeClass('scrolled-up scrolled-down')
			.css('padding-top', '');

		if (highResolution) {
			$body.css('padding-top', 0);
		}
	}
	// scrolling down
	else if (scrollAmount > windowPosition) {
		// don't apply scrolled- states to body on support central
		if (!$body.hasClass('support-central')) {
			$body
				.addClass('scrolled-down')
				.removeClass('scrolled-up')
				.css('padding-top', '');

			if (highResolution) {
				$body.css('padding-top', layoutNavHeight);
			}
		}
	}
	// scrolling up
	else {
		// don't apply scrolled- states to body on support central
		if (!$body.hasClass('support-central')) {
		$body
			.addClass('scrolled-up')
			.removeClass('scrolled-down')
			.css('padding-top', '');

			if (highResolution) {
				$body.css('padding-top', layoutNavHeight);
			}
		}
	}

	if (!highResolution) {
		// remove any inline padding set to the body
		$body.css('padding-top', '');
	}


	// IE8 fix
	// forces redraw of elements with pseudo elements with icomoon fonts
	// otherwise layout doesn't re-draw until cursor interfacts with element
	// http://stackoverflow.com/questions/8703799/forcing-ie8-to-rerender-repaint-before-after-pseudo-elements
	if ($('html').hasClass('ie8')) {
		$('.navigation-utility a, .search-site-b')
			.addClass('force-ie-pseudo-redraw')
			.removeClass('force-ie-pseudo-redraw');
	}

	windowPosition = scrollAmount;
})
.on('dresize', function() {
	layoutNavHeight = $layoutNav.outerHeight();
	headerHeight = $layoutHeader.outerHeight();
});
