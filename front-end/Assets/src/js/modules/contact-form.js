
function insertAfter(){
	if ($('body').hasClass('form2')) {
		var isMobile = window.matchMedia("only screen and (max-width: 900px)").matches;
		if (!isMobile) {
			// getting current header height and add ttop minus margin to the form
			var headerHeight = '-'+ $(".ornate-header").height()+'px';
			$('.form2 form').css('margin-top',headerHeight); 
			$('.product-category-header').insertBefore($('.form-wrap').parents().closest(".maincontentcontainer")); 
		} else{
			// for rmoving header from top and add to after form 
			$('.product-category-header').insertAfter('.form-wrap');
		}
	}
}
insertAfter();

$(window).resize(function() {
	  insertAfter();
});