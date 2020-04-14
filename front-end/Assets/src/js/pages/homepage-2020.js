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
    function setHeight_1(elementName, isSet) {
        console.log(elementName);
        windowHeight = $(window).innerHeight();        
         // var componentHeight = $(elementName).innerHeight();
          newComponent =  windowHeight - 125;
          if(isSet){
            $(elementName).css({'height': newComponent}); 
          }else{
            $(elementName).css({'height': 'auto'}); 
          }          
          //$(elementName).css({'min-height': componentHeight});            
   };
    
   var isMobile = window.matchMedia("only screen and (max-width: 1000px)").matches; 
    if(!isMobile){
        setHeight_1(".dynHeight",true);
    }else{
        setHeight_1(".dynHeight", false);
    }	  
	$(window).resize(function() {
        var isMobile = window.matchMedia("only screen and (max-width: 1000px)").matches;        
        if(!isMobile){
            setHeight_1(".dynHeight", true);
        }else{
            setHeight_1(".dynHeight", false);
        }  

        
	});

}(jQuery));