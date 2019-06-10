jQuery(function ($) {
	if ($('body').hasClass('form2')) {
		function addOptionalText(){
			$('form .experiencefragment').find('input, textarea, select').each(function(){					
				if($(this).get(0).getAttribute('required') == 'false'){									
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
		

		$('.form2 form .btn-secondary').click(function(){
			setTimeout(function(){
				$(".form-wrapp form").trigger('heightChange'); 				
			}, 100);
			 
		})		

		var setFormHeight = function(eh) {						
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
				
				var isMobile = window.matchMedia("only screen and (max-width: 900px)").matches;
				if (!isMobile && maxHeight !=0) {
						$(ehItem).height(maxHeight);
				}
				else{
					$(ehItem).css('height', 'auto');	
				}
			});
		};	

		$('.form-wrapp form').bind('heightChange', function(){			
			setFormHeight('.form2');
		});	
		
		function insertAfter(){	
			var isMobile = window.matchMedia("only screen and (max-width: 900px)").matches;
			var formContainer =  $(".maincontentcontainer .50-50contentcontainer:first .responsivegrid:first");
			var respGridContainers =  $(".maincontentcontainer .50-50contentcontainer:first>section>.aem-Grid").children();
			
			if (!isMobile) {
				respGridContainers.addClass('aem-GridColumn--default--6');
				respGridContainers.removeClass('aem-GridColumn--default--12');		
				$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-12').addClass('md-col-6');
				$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-12').removeClass('md-col-12');	                                           
			} else{
				respGridContainers.addClass('aem-GridColumn--default--12');
				respGridContainers.removeClass('aem-GridColumn--default--6');			
				$('.form2 .product-category-header2 .bannerContent .flex-item.md-col-6').addClass('md-col-12');
			}
			
			// event triggering for getting the height of the changed form
            $(".form-wrapp form").trigger('heightChange');  
		
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