;( function($) {
    if($('.orion-quote-carousel').length > 0 ){
        
        $('.orion-quote-carousel').owlCarousel({
            margin:30,
            nav:true,
            dots:true,
            touchDrag: true,
            mouseDrag: false,
            loop:true,
            navRewind: false,
            slideTransition: 'linear',
            stagePadding: 300,
            autoplay:false,
            autoplayTimeout:3000,
            autoplayHoverPause:true,
            navText : "",
            items:1,
            responsive:{
                0:{
                    stagePadding: 10,
                    items:1,
                },
                600:{
                    stagePadding: 30,
                    items:1,
                },
                750:{
                    stagePadding: 30,
                    items:1,
                },
                1000:{
                    stagePadding: 300,
                }
            }
            
        })
    }     

}(jQuery));