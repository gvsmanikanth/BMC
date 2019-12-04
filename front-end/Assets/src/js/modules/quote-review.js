;( function($) {
    if($('.owl-carousel-quote').length > 0 ){
        // Calculate number of Slides
        var totalItems = $('.item').length;


        // If there is only three slides
        if (totalItems == 3) {
            // Set loop option variable to false
            var isLooped = false;
            // Set nav option variable to false
            var isNav = false;
        } 
        else {
            // Set loop option variable to true
            var isLooped = true;


            // Set loop option variable to true
            var isNav = true;
        }
        $('.owl-carousel-quote').owlCarousel({
            margin:30,
            nav:isLooped,
            dots:false,
            touchDrag: true,
            mouseDrag: false,
            rewind: true,
            slideTransition: 'linear',
            stagePadding: 100,
            autoplay:true,
            autoplayTimeout:3000,
            autoplayHoverPause:true,
            navText: "<>",
            responsive:{
                0:{
                    stagePadding: 30,
                    items:1
                    
                },
                600:{
                    stagePadding: 50,
                    items:2
                },
                1000:{
                    stagePadding: 80,
                    items:3
                },
                1600:{
                    stagePadding: 100,
                    items:4
                },
                1800:{
                    items:5
                }
            }
        })
    }
    

}(jQuery));