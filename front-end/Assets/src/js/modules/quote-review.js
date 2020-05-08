;( function($) {
    if($('.owl-carousel-quote').length > 0 ){
        // Calculate number of Slides
        var totalItems = $('.item').length;
        // If there is only three slides
        if (totalItems <= 3) {
            var noOfItems = 3;
            // Set nav option variable to false
            var isNav = false;
        } 
        else{
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
            autoplay:false,
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
                    stagePadding: 80,
                    margin:20,
                    items:1,
                    nav:true
                },
                750:{
                    stagePadding: 50,
                    items:2,
                    margin:20,
                    nav:true
                },
                1000:{
                    stagePadding: 80,
                    items:2,
                    nav:true
                },
                1200:{
                    stagePadding: 80,
                    items:3
                }
            }
        })
    }     

}(jQuery));