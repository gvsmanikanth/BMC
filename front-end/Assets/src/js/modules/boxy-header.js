;( function($) {
    if($('.boxy-header-container').length > 0 ){    
        // initialising carousel
        if($('.owl-carousel-boxy-header').length > 0 ){    
        // Calculate number of Slides
        var totalItems = $('.item').length;
        var carousel = $('.owl-carousel-boxy-header');
        if (totalItems > 1) {
                var isLoop = true;
                var isDots = true;
                var isTouchDrag = true;
                var isMouseDrag = true;
            
            } else {
                var isLoop = false;
                var isDots = false;
                var isTouchDrag = false;
                var isMouseDrag = false;
            }         
            var options = {
                touchDrag: isTouchDrag,
                mouseDrag: isMouseDrag,
                loop: isLoop,
                autoplay: true,
                animateOut: 'fadeOut',
                smartSpeed: 350,
                items: 1, 
                dots: isDots                         
                                
            };        
            carousel.on({        
                'initialized.owl.carousel': function () {
                    carousel.find('.item').show();
                    $('.left-col').find('.loading-placeholder').hide();
                }        
            });         
            carousel.owlCarousel(options)
        } 
        

        // Setting content as per window height
        function setHeight_1(elementName) {
            var isMobile = window.matchMedia("only screen and (max-width: 960px)").matches; 
            windowHeight = $(window).innerHeight();        
            // var componentHeight = $(elementName).innerHeight();
            newComponent =  windowHeight - 125;
            if(!isMobile){
                $(elementName).css({'height': newComponent}); 
            }else{
                $(elementName).css({'height': 'auto'}); 
            }          
            //$(elementName).css({'min-height': componentHeight});            
    };    
    setHeight_1(".dynHeight");

        function setHeight_mobile_carousel() { 
            var carFlex = $('.car-flex').innerHeight();        
            var isspecificMobile = window.matchMedia("only screen and (max-width: 831px)").matches;        
            if(!isspecificMobile){
                $('.owl-carousel-boxy-header').css({'height': '100%'});
            }else{
                $('.owl-carousel-boxy-header').css({'height': carFlex});
            }         
                    
    }; 
    setHeight_mobile_carousel();
    
    // Calling function son resize
    $(window).resize(function() {
            setHeight_1(".dynHeight");
            setHeight_mobile_carousel();
        });
    }
}(jQuery));