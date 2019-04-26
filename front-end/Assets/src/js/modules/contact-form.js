
function insertAfter(){
	if ($('body').hasClass('form2')) {
		var isMobile = window.matchMedia("only screen and (max-width: 900px)").matches;
		if (!isMobile) {
			// getting current header height and add ttop minus margin to the form
			var headerHeight = '-'+ $(".ornate-header").height()+'px';
			$('.form2 form').css('margin-top',headerHeight); 
			$(".form-wrap").css('width','50%');
			$('.product-category-header').insertBefore($('.form-wrap').parents().closest(".maincontentcontainer")); 
			$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-6:first-child').css('display','block');
			$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-6').removeClass('md-col-12');
		} else{
			// for rmoving header from top and add to after form 
			$('.product-category-header').insertAfter('.form-wrap');
			$(".form-wrap").css('width','100%');
			$('.form2 form').css('margin-top','0px'); 
			$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-6:first-child').css('display','none');
			$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-6').addClass('md-col-12');
		}
	}
}
insertAfter();

$(window).resize(function() {
	  insertAfter();
});