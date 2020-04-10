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
            dotsEach: false,    
                            
        };
        var carousel = $('.owl-carousel-homepage');
        carousel.on({        
            'initialized.owl.carousel': function () {
                carousel.find('.item').show();
                $('.left-col').find('.loading-placeholder').hide();
            }        
        }).owlCarousel(options);        
    } 
    

    // full height
    function setHeight_1() {
        windowHeight = $(window).innerHeight();        
          var componentHeight = $(".homepage-2020").innerHeight();
          newComponent =  windowHeight - 125;
          $('.dynHeight').css({'height': newComponent}); 
          $('.dynHeight').css({'min-height': componentHeight});
          console.log('window Height:' + windowHeight + 'coponent height:' + componentHeight);  
          console.log(' new coponent height:' + newComponent);             
   };
   setHeight_1();		  
	$(window).resize(function() {
        setHeight_1();        
	});

}(jQuery));