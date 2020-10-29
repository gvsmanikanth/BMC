;( function($) {
    if($('.orion-quote-carousel').length > 0 ){
        
        $('.orion-quote-carousel').owlCarousel({
            margin:30,
            nav:true,
            dots:true,
            touchDrag: true,
            mouseDrag: true,
            loop:true,
            navRewind: false,
            stagePadding: 300,
            autoplay:true,
            autoplayTimeout:3000,
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
            
        })
    }     

}(jQuery));