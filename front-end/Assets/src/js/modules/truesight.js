
	// simple manual carousel for Truesight
	function truesightCarouselAutoplay() {
	    
	     $('.truesight-carousel-control a').click(function(event) {
			event.preventDefault();
		
			$('.truesight-carousel-control a').removeClass('active');
			$(this).addClass('active');
			
			$('.truesight-carousel li').removeClass('active');
			var slideNumber = $(this).attr('data-slide');
			var activeSlide = $('.truesight-carousel li[data-slide='+slideNumber+']');
			activeSlide.addClass('active');
			
			clearInterval(timerId);
		});	
		
		$('.truesight-carousel li').click(function() {
			clearInterval(timerId);
		});
	    
	    var count = 0;
	    var timerId = setInterval(function() {
	        count++;
	        
			var activeSlide = $('.truesight-carousel li[data-slide='+count+']');
			var activeControl = $('.truesight-carousel-control a[data-slide='+count+']');
	        
	        $('.truesight-carousel li').removeClass('active');
	        $(activeSlide).addClass('active');
	        $('.truesight-carousel-control a').removeClass('active');
	        $(activeControl).addClass('active');
	        
	        if(count == 3) {
	            count = -1;
	        }
	    }, 4000);
	}
	
	if ( $('.truesight-carousel').length ) {
		truesightCarouselAutoplay();
	}

	// simple tabs for Truesight
	$('.truesight-tabs-control a').click(function(event) {
		event.preventDefault();
		
		$('.truesight-tabs-control li').removeClass('active');
		$(this).parent('li').addClass('active');
		
		
		$('.truesight-tabs li').removeClass('active');
		
		var tabNumber = $(this).attr('data-tab');
		var activeTab = $('.truesight-tabs li[data-tab='+tabNumber+']');
		
		activeTab.addClass('active');
	});