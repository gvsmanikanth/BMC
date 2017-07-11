function navSetup() {
	var $layoutHeader = $('.layout-header'),
		headerHeight = $layoutHeader.outerHeight();

	$('.layout-nav-open').click(function(e) {
		e.preventDefault();

		$('.layout-nav').toggleClass('nav-active');
		$('body').toggleClass('nav-open');
	});

	$('.layout-nav-close').click(function(e) {
		e.preventDefault();

		$('.layout-nav').toggleClass('nav-active');
		$('body').toggleClass('nav-open');
	});

	// toggleClass active on primary navigation links
	// touch devices
	$('.touchevents .nav-secondary-toggle > a').click(function(e){
		var $thisNavSecondary = $(this).next('.nav-secondary');

		e.preventDefault();

		$('.nav-primary')
			.find('.nav-secondary')
			.not($thisNavSecondary)
			.removeClass('nav-active');

		$thisNavSecondary.toggleClass('nav-active');
	});

	// Dismisses menu if taps are made outside of the menu on touch devices
	$('.touchevents body').on('touchstart click', function(e){

		var clickInNav = $(e.target).parents('.nav-secondary, .layout-nav').addBack('.nav-secondary');
		if (!clickInNav.length) {
			$('.nav-secondary').removeClass('nav-active');
		}
	});

	// no-touch devices
	$('.no-touchevents .nav-secondary-toggle').hover(function(e){
		var $thisNavSecondary = $(this).find('.nav-secondary');

		$('.nav-primary')
			.find('.nav-secondary')
			.not($thisNavSecondary)
			.removeClass('nav-active');

		$thisNavSecondary.toggleClass('nav-active');
	});

	$('.nav-secondary-close').click(function(e) {
		$(this).parents('.nav-secondary').removeClass('nav-active');
	});

	$('.nav-search-toggle').click(function(e) {
		e.preventDefault();

		var $searchInput = $(this).next().find('input'),
			searchActive = $layoutHeader.is('.search-active');

		if (searchActive) {
			$layoutHeader.toggleClass('search-active');

			$searchInput.blur();
		}
		else {
			$layoutHeader.toggleClass('search-active');

			$searchInput.focus();
		}
	});

	$('.search-site input').on('blur', function() {
		$layoutHeader.removeClass('search-active');
	});

	$('.nav-telephone-us').click(function(e) {
		$('.nav-telephone-link').toggleClass('active');
		return false;
	});

};
