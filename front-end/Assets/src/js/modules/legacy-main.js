// jQuery document ready
jQuery(function ($) {
	var windowResize = new EventDebouncer('resize');

	// debounce the resize event of the window to prevent too many firings of the event
	// https://gist.github.com/stoff/5df2d64cbfd2889121e4
	windowResize.attach();
	
	// move elements in dom to avoid duplication of elements
	$('.search-site, .nav-login-header, .navigation-login-header').appendAround();
});// document ready