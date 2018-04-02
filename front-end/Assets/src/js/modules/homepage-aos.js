$(document).ready(function () {
	var AOS =  window.AOS;
		AOS.init({
	  offset: 100,
      duration: 600,
      easing: 'ease-in',
      delay: 300,
      startEvent: 'load',
  });	
		
	$('#fullpage').fullpage({
		//anchors: ['firstPage', 'secondPage', '3rdPage','4thPage','5thPage','6thPage','7thPage','8thPage','9thPage'],
		navigation: true,
		navigationPosition: 'right',
		navigationTooltips: ['First', 'Second', 'Third','4','5','6','7','8','9'],
		scrollBar: true,
		css3: true
	});
	
	
	//Set the height for all sections wraps equal.
	function setHeight() {
		 windowHeight = $(window).innerHeight();
		 $('.section-wrap').css('min-height', windowHeight-50);
		 $('.section-wrap-header').css('min-height', windowHeight-120);
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
		},0,"swing");
	});
	
	$(".page-homepage-e #scrollDown").click(function(){
		$('html,body').animate({
			scrollTop: $("#section1").offset().top -  50
		},2000);
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
								console.log("if - "+index); 
						}else{
							index = 0;
							$('#fp-nav').css("display","none");
						}
						$('#fp-nav ul li.click a').removeClass("active");
						$('#fp-nav ul li#click'+index+' a').addClass("active");
						$('html,body').clearQueue();
						$('html,body').stop();
						/*$('html,body').animate({
							scrollTop: $(element).offset().top -  50
						},0,"swing");*/
					},
					
					onLeave: function(element, position) {
					//alert($(element).offset().top - $('.layout-header').height());
						//$(element).css('visibility', 'hidden');
						
					}
				});
		    });
	};

	autoScrollSection();	
		
});	// document ready