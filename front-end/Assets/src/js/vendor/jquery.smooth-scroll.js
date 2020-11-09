// http://css-tricks.com/snippets/jquery/smooth-scrolling/
$(function() {
	$('a[href*=#]').not('[href=#], .modal-inline, .no-scroll, .r-tabs-anchor, .accordion-item-anchor').click(function() {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			// Added condition for Orion header as fixed header height is different
			if($('.orion-seconday-nav').length > 0){
				var fixedHeaderHeight = $('.orion-seconday-nav').height();
			}else{
				var fixedHeaderHeight = $('.layout-header').height();
			}
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top - fixedHeaderHeight
				}, 1000);
				return false;
			}
		}
	});
});
