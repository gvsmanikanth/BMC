;( function($) {

    if($('.owl-carousel-homepage').length > 0 ){        
        var options = {
            touchDrag: true,
            mouseDrag: true,
            loop:true,
            autoplay:true,
            animateOut: 'fadeOut',
            smartSpeed:350,
            items:1,   
            dotsEach: true      
        };
        var carousel = $('.owl-carousel-homepage');
        carousel.on({        
            'initialized.owl.carousel': function () {
                carousel.find('.item').show();
                $('.left-col').find('.loading-placeholder').hide();
            }        
        }).owlCarousel(options);        
    } 
    

}(jQuery));