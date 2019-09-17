// http://css-tricks.com/snippets/jquery/smooth-scrolling/
$(function() {
	$('a[href*=#]').not('[href=#], .modal-inline, .no-scroll, .r-tabs-anchor, .accordion-item-anchor, .tab_link').click(function() {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top - $('.layout-header').height()
				}, 1000);
				return false;
			}
		}
	});	
	$('.tab_link').click(function() {
		$('html,body').animate({
			scrollTop: $(".tab-wrapper").offset().top
		}, 1000);
	});
});
