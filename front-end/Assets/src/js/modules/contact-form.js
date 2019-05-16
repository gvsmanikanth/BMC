jQuery(function ($) {

	if ($('body').hasClass('form2')) {
	function insertAfter(){	
			var isMobile = window.matchMedia("only screen and (max-width: 900px)").matches;
			var formContainer =  $(".maincontentcontainer .50-50contentcontainer:first .responsivegrid:first");
			var respGridContainers =  $(".maincontentcontainer .50-50contentcontainer:first>section>.aem-Grid").children();
			
			if (!isMobile) {
				// getting current header height and add ttop minus margin to the form
				var headerHeight = '-'+ $(".ornate-header").height()+'px';
				$('.form2 .maincontentcontainer form').css({
					'margin-top':headerHeight,
					'transition-property': 'margin-top',
					'transition': '2s linear'
				}); 

				respGridContainers.addClass('aem-GridColumn--default--6');
				respGridContainers.removeClass('aem-GridColumn--default--12');
				$('.product-category-header').insertBefore(formContainer.parents().closest(".maincontentcontainer")); 
				$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-6:first-child').css('display','block');
				$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-12').addClass('md-col-6');
				$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-12').removeClass('md-col-12');
				$('.form2 .product-category-header2').removeClass('header-Mobile-View');
			} else{
				// for rmoving header from top and add to after form 
				$('.product-category-header').insertAfter(formContainer);
				respGridContainers.addClass('aem-GridColumn--default--12');
				respGridContainers.removeClass('aem-GridColumn--default--6');
				$('.form2 form').css('margin-top','0px'); 
				$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-6:first-child').css('display','none');
				$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-6').addClass('md-col-12');
				$('.form2 .product-category-header2').addClass('header-Mobile-View');
				
			}
		
	}
	insertAfter();
	$(window).resize(function() {
		insertAfter();
	});

	$(".form2 .ornate-header img").on("load", function() {
		insertAfter();
	});

	$('[name="C_BusPhone"]').prev().addClass('business_phone_label');
	}

});