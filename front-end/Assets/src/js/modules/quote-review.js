;( function($) {
    $('.owl-carousel-quote').owlCarousel({
        loop:true,
        margin:30,
        nav:true,
        dots:false,
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

}(jQuery));