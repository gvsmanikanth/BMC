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
		 $('.section-wrap').css('min-height', windowHeight);
		 $('.section-wrap-header').css('min-height', windowHeight-125);
	};
	
	setHeight();
		  
	$(window).resize(function() {
		  setHeight();
	});
	
	
	
    function defer(method) {
	    if (window.jQuery) {
	        method();
	    } else {
	        setTimeout(function() { defer(method) }, 50);
	    }
	}

	  defer(function () {
		    $('.section-wrap').each(function() {
				var position = $(this).position(),
					// 170 is an arbitrary number found by trial and error
					offset = $(this).height()/2;
				$(this).scrollspy({
					min: position.top - offset,
					max: (position.top - offset) + $(this).height(),
					onEnter: function(element, position) {
						//alert($(element).offset().top - $('.layout-header').height());
						$('html,body').animate({
							scrollTop: $(element).offset().top - $('.layout-navigation').height()
						}, 500);
					}
				});
			});
		});


		
});	// document ready