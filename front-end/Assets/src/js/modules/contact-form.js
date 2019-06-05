jQuery(function ($) {

	if ($('body').hasClass('form2')) {
		function addOptionalText(){
			$('form .experiencefragment').find('input, textarea, select').each(function(){	
				if((($(this).filter("[required = 'false']").length) == '1') || (!($(this).prop('required')))){
					if(!($(this).is(':hidden'))){	
						var ele_id = $(this).attr('id');
						if(($('label[for="'+ ele_id +'"] > span.optional-text').length) != '1'){
							$('label[for="'+ ele_id +'"]').append('<span class="optional-text"> (optional)</span>');
						}else{
							$('label[for="'+ ele_id +'"] > span.optional-text').replaceWith('<span class="optional-text">(optional)</span>');
						}					
											
					}			
				}
			});
		}
		addOptionalText();	
		
	function insertAfter(){	
			var isMobile = window.matchMedia("only screen and (max-width: 900px)").matches;
			var formContainer =  $(".maincontentcontainer .50-50contentcontainer:first .responsivegrid:first");
			var respGridContainers =  $(".maincontentcontainer .50-50contentcontainer:first>section>.aem-Grid").children();
			
			if (!isMobile) {
				// getting current header height and add ttop minus margin to the form
				var headerHeight = '-'+ $(".ornate-header").height()+'px';
				// $('.form2 .maincontentcontainer form').css({
				// 	'margin-top':headerHeight,
				// 	'transition-property': 'margin-top',
				// 	'transition': '0s linear'
				// }); 

				respGridContainers.addClass('aem-GridColumn--default--6');
				respGridContainers.removeClass('aem-GridColumn--default--12');
				$('.product-category-header').insertBefore(formContainer.parents().closest(".maincontentcontainer")); 
				$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-6:first-child').css('display','block');
				$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-12').addClass('md-col-6');
				$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-12').removeClass('md-col-12');
				$('.form2 .product-category-header2').removeClass('header-Mobile-View');

				// for setting div height  starts
				var setHeights = function(eh) {
					$(eh).each(function(i) {
						var ehItem = $(this).find('.js-elehtItem'),
							maxHeight = 0;
						$(ehItem).css('height', 'auto');	
						
						$(ehItem).each( function() {
							var ehInstance = $(this),
								itemHeight = $(ehInstance).outerHeight();
							if ( itemHeight > maxHeight ) {
								maxHeight = itemHeight + 50;
							}
						});
						if(maxHeight !=0)
							$(ehItem).height(maxHeight);
					});
				};	
				setHeights('.js-eleht');

				// for setting div height ends

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