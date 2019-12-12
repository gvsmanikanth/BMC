;( function($) {
    if($('.owl-carousel-quote').length > 0 ){
        // Calculate number of Slides
        var totalItems = $('.item').length;


        // If there is only three slides
        if (totalItems == 3) {
            var noOfItems = 3;
            // Set nav option variable to false
            var isNav = false;
        } 
        else if(totalItems == 4) {            
            var noOfItems = 4;
            if ($(window).width() >= 1600){	
                var isNav = false;
            }else{
                var isNav = true;
            }	
            
        }else{
            var isNav = true;
        }
        $('.owl-carousel-quote').owlCarousel({
            margin:30,
            nav:isNav,
            dots:false,
            touchDrag: true,
            mouseDrag: false,
            loop:false,
            navRewind: false,
            slideTransition: 'linear',
            stagePadding: 100,
            autoplay:true,
            autoplayTimeout:3000,
            autoplayHoverPause:true,
            navText: "<>",
            responsive:{
                0:{
                    stagePadding: 30,
                    items:1,
                    margin:20,
                    nav:true
                    
                },
                600:{
                    stagePadding: 50,
                    items:2,
                    margin:20,
                    nav:true
                },
                1000:{
                    stagePadding: 80,
                    items:3
                },
                1600:{
                    stagePadding: 100,
                    items:noOfItems
                }
            }
        })
    }     

}(jQuery));