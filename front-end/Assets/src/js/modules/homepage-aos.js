$(document).ready(function () {
	if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)){
		$(".page-homepage-e .section-wrap").removeClass("flex flex-centerx"); 
		$(".page-homepage-e .section-wrap .full-bleed-two-column").removeClass("md-flex"); 
		
		$(".page-homepage-e .section-wrap .full-bleed-two-column").removeClass("md-flex");  
		
		/*Hover Effect*/
		$(".imgDesp").mouseover(function() {
			$(this).addClass("hover");
			$(this).css("background","fe5000a3");
		}).mouseout(function() {
			$(this).removeClass("hover"); 
		});
		
	}
	var AOS =  window.AOS;
		AOS.init({
	  offset: 100,
      duration: 600,
      easing: 'ease-in',
      delay: 300,
      startEvent: 'load',
  });	
		
	/*$('#fullpage').fullpage({
		//anchors: ['firstPage', 'secondPage', '3rdPage','4thPage','5thPage','6thPage','7thPage','8thPage','9thPage'],
		navigation: true,
		navigationPosition: 'right',
		navigationTooltips: ['First', 'Second', 'Third','4','5','6','7','8','9'],
		scrollBar: true,
		css3: true
	});*/
	
	
	//Set the height for all sections wraps equal.
	function setHeight() {
		 windowHeight = $(window).innerHeight();
		 $('.section-wrap-header').css('height', windowHeight-120);
		 $('.section-wrap-header').css('min-height', 500);
		 $('.section-wrap').css('min-height', windowHeight-50);
	};
	
	setHeight();
		  
	$(window).resize(function() {
		  setHeight();
	});
	
	$(".page-homepage-e #fp-nav .click").click(function(){
		var rep = $(this).attr('id');
		var index = rep.match(/\d+/);
		$('html,body').animate({
			scrollTop: $("#section"+index).offset().top -  50
		},500,"linear");
	});
	
	$(".page-homepage-e #scrollDown").click(function(){
		$('html,body').animate({
			scrollTop: $("#section1").offset().top -  50
		},500,"linear");
	});
	
	$(".page-homepage-e .carousel-wrap .carousel").each(function(){
		$(this).find("li").each(function(){
			var bubbleElem = $(this).find('.circle');
			bubbleElem.css({'right':(bubbleElem.attr('data-percentage-right'))+'%','top':(bubbleElem.attr('data-percentage-top'))+'%'});
		});
		
	});
	
	function autoScrollSection() {
		    $('.section-wrap').each(function() {
				
				var position = $(this).position(),
					// 170 is an arbitrary number found by trial and error
					offset = $(this).height()/2;
				$(this).scrollspy({
					min: position.top - offset,
					max: (position.top - offset) + $(this).height(),
					onEnter: function(element, position) {
						var rep = $(element).attr('id');
						var index = rep.match(/\d+/);
						if(index > 0 && index <= 8){
								$('#fp-nav').css("display","block"); 
								//console.log("if - "+index); 
						}else{
							index = 0;
							$('#fp-nav').css("display","none");
						}
						$('#fp-nav ul li.click a').removeClass("active");
						$('#fp-nav ul li#click'+index+' a').addClass("active");
						$('#section'+index+' .carousel-wrap .carousel li').removeClass("active");
						$('#section'+index+' .carousel-wrap .carousel li:first-child').addClass("active");
					},
					
					onLeave: function(element, position) {
							var rep = $(element).attr('id');
							var index = rep.match(/\d+/);
							if(index == 1){
								$('#fp-nav').css("display","none");
						}
					}
				});
		    });
	};

	$(window).load(function() {
		$(".page-homepage-e img").each(function(index) {
		   var this_image = this;
		   var src = $(this_image).attr('src') || '' ;
		   if(!src.length > 0){ 
			   var lsrc = $(this_image).attr('data-src') || '' ;
			   if(lsrc.length > 0){
				   var img = new Image();
				   img.src = lsrc;
				   $(img).load(function() {
					   this_image.src = this.src;
				   });
			   }
		   }
	   });
	  });
  
	autoScrollSection();	
		
});	// document ready