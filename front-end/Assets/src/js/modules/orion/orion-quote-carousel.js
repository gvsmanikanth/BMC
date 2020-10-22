;( function($) {
    if($('.orion-quote-carousel').length > 0 ){
        // Calculate number of Slides
        var totalItems = $('.item').length;
        // If there is only three slides
       /* if (totalItems <= 2) {
            var noOfItems = 2;
            // Set nav option variable to false
            var isNav = false;
        } 
        else{
            var isNav = true;
        }*/
        var noOfItems = 3;
        var isNav = true;
        $('.orion-quote-carousel').owlCarousel({
            margin:30,
            nav:true,
            dots:true,
            touchDrag: true,
            mouseDrag: false,
            loop:false,
            navRewind: false,
            slideTransition: 'linear',
            stagePadding: 100,
            autoplay:false,
            autoplayTimeout:3000,
            autoplayHoverPause:true,
            navText : "",
            //navText:["<div class='nav-btn prev-slide'></div>","<div class='nav-btn next-slide'></div>"],
            items:1,
            responsive:{
                0:{
                    stagePadding: 30,
                },
                600:{
                    stagePadding: 80,
                },
                750:{
                    stagePadding: 50,
                },
                1000:{
                    stagePadding: 80,
                },
                1200:{
                    stagePadding: 80,
                }
            }
        })
    }     

}(jQuery));