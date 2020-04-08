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
            autoHeight:true,         
                            
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
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
        windowHeight = $(window).innerHeight();
          var componentHeight = $(".js-content-center-item").innerHeight() + 30;
          if(componentHeight > windowHeight){
                 $('.section-wrap-header').css('min-height', componentHeight);
                 $('.js-content-center-item').css('margin-top', "1rem");
                 $('.js-content-center-item').css('margin-bottom', "1rem");
          }
          else{
                 $('.section-wrap-header').css('height', windowHeight-120);
                 if($(".js-content-center") && $(".js-content-center-item")){
                       var compHeight = $(".js-content-center").innerHeight() - $(".assetStrip.assetStripBottom").innerHeight(); 
                       var contentHeight = $(".js-content-center-item").innerHeight();
                       $('.js-content-center-item').css('margin-top', (compHeight-contentHeight)/2);
                       $('.js-content-center-item').css('margin-bottom', (compHeight-contentHeight)/2);
                 }                 
                 
                 $('.section-wrap-header').css('min-height', 500);
                 
                 $('.section-wrap-header.middle').css('min-height', 0);
           //$('.section-wrap').css('min-height', windowHeight-50);
			if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
				$('.section-wrap').css({'height': windowHeight-50,'display':'-ms-flexbox'});
				$('.section-wrap.partners').css({'min-height': windowHeight-50,'height':'auto','display':'block'});
			}else{
				$('.section-wrap').css('min-height', windowHeight-50);
			}
 
               if($(".ub-emb-bar-frame").length == 1){
               $('.arrow.bounce').css('bottom', '5.5rem');
           }else{
               $('.arrow.bounce').css('bottom', '1rem');
           }
          }
    
   };

   setHeight_1();
		  
	$(window).resize(function() {
        setHeight_1();        
	});

}(jQuery));