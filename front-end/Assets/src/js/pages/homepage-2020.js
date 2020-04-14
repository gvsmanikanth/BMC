;( function($) {

    if($('.owl-carousel-homepage').length > 0 ){    
       // Calculate number of Slides
       var totalItems = $('.item').length;
       // If there is only three slides
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
        var carousel = $('.owl-carousel-homepage');
        carousel.on({        
            'initialized.owl.carousel': function () {
                carousel.find('.item').show();
                $('.left-col').find('.loading-placeholder').hide();
            }        
        }).owlCarousel(options);        
    } 
    

    // full height
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

	$(window).resize(function() {
        setHeight_1(".dynHeight");
        setHeight_mobile_carousel();
    });

    function setHeight_mobile_carousel() { 
        var carFlex = $('.car-flex').innerHeight();        
        var isspecificMobile = window.matchMedia("only screen and (max-width: 768px)").matches;        
        if(!isspecificMobile){
            $('.owl-carousel-homepage').css({'height': '100%'});
        }else{
            $('.owl-carousel-homepage').css({'height': carFlex});
        }         
                   
   }; 
   setHeight_mobile_carousel();

}(jQuery));