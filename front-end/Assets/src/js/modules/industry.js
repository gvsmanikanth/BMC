;(function($) {

	$("#owl-wallpaper").owlCarousel({
		autoHeight: true,
		items: 1,
		nav: true,
		navText: [
			'<span class="sm-hide">Previous</span><svg class="fill-white sm-max-hide"><use xlink:href="#s-chevronLeft" /></svg>',
			'<span class="sm-hide">Next</span><svg class="fill-white sm-max-hide"><use xlink:href="#s-chevronRight" /></svg>'
		]
	});

	if ( $('html').hasClass('ie8') ) {
		// IE8
		$("#wp-florida-hospital").css( "background", "url(includes/industry/bg-florida-hospital-l.jpg) no-repeat" );
	} else {
		$("#wp-florida-hospital").wallpaper({
			source: {
				"fallback": "includes/industry/bg-florida-hospital-s.jpg",
				"(min-width: 800px)": "includes/industry/bg-florida-hospital-m.jpg",
				"(min-width: 1024px)": "includes/industry/bg-florida-hospital-l.jpg"
			}
		});
	}

	var $tabs = $('#industry-tabs');
	$tabs.responsiveTabs({
		rotate: false,
		startCollapsed: 'accordion',
		collapsible: 'accordion'
	});
	
	var $tabs = $('.tab-wrapper');
	$tabs.responsiveTabs({
		rotate: false,
		startCollapsed: 'accordion',
		collapsible: 'accordion',
		setHash:true
	});

}(jQuery));
