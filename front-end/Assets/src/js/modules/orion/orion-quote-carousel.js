;( function($) {
    if($('.orion-quote-carousel').length > 0 ){
        var owl = $('.orion-quote-carousel');
		owl.owlCarousel({
            margin:30,
            nav:true,
            dots:true,
            touchDrag: true,
            mouseDrag: true,
            loop:true,
            navRewind: false,
            stagePadding: 300,
            autoplay:true,
            autoplayTimeout:6000,
            autoplayHoverPause:true,
            navText : "",
            items:1,
            smartSpeed: 2000,
            responsive:{
                0:{
                    stagePadding: 10,
                    items:1,
                },
                600:{
                    stagePadding: 30,
                    items:1,
                },
                832:{
                    stagePadding: 130,
                    items:1,
                },
                1000:{
                    stagePadding: 150,
                },
                1200:{
                    stagePadding: 300,
                }
            }
            
        });

        $('.orion-quote-carousel li').on('mouseenter',function(e){
			var thisAttr = $('.orion-quote-carousel').attr('data-autoplay');
			if(thisAttr && thisAttr!=="false"){
				$(this).closest('.owl-carousel').trigger('play.owl.autoplay');
			}
        });
            
        $('.orion-quote-carousel li').on('mouseleave',function(e){
			 $(this).closest('.owl-carousel').trigger('stop.owl.autoplay');
        });
		
		$('.owl-dot').on('click', function(e) {
			var thisCarousel = $(this).closest('.owl-carousel');
			$('.orion-quote-carousel').attr('data-autoplay',"false");
			thisCarousel.trigger('stop.owl.autoplay');
			var carousel =  thisCarousel.data('owlCarousel');
			carousel.settings.autoplay = false; 
			carousel.options.autoplay = false;
			thisCarousel.trigger('refresh.owl.carousel');
		});
		
		
		
    }     

}(jQuery));