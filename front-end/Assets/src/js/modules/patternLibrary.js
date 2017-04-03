// taken from the jquer.navigation.js file specifically for the Pattern Library

$('.contact-bmc').click(function(e) {
	e.preventDefault();
	$('body').addClass('contact-modal-active');
});

$('.modal-close, .layout-modal-overlay').click(function(e) {
	e.preventDefault();
	$('body').removeClass('contact-modal-active');
});

$('.toggle-flexbox-support').click(function(e) {
	e.preventDefault();
	$('html').toggleClass('flexbox no-flexbox');
});


// auto-open pattern library nav on the About page one time only
function autoOpenNav() {
	if ( $(window).width() > 960 ) {
		setTimeout(function(){
			$('#nav-control').click();
		}, 1000);
		// set cookie to not open again for 7 days
		$.cookie('autoOpenNav', 'false', { expires: 7, path: '/' });
	}
}
// only run in the context of the pattern library, and if there is no cookie set
if ( $('body').hasClass('auto-open-nav') && $.cookie('autoOpenNav') !== 'false' ) {
	autoOpenNav();
} 
// end auto-open pattern library nav

