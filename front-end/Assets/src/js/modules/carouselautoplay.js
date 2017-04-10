//play carousel
function carouselPlay(elem) {
	var carousel = elem.find('.carousel');
	var controls = elem.find('.carousel-control');
	var carouselItems = carousel.find('li');
	var carouselCount = carouselItems.length;
	var count = 0;
	
	//icons percentage from right
	if (carousel.find('.carousel-icon').length != 0) {
		carouselItems.each(function(){
			var iconElem = $(this).find('.carousel-icon');
			if(iconElem.length != 0) {
					iconElem.css({'right':(iconElem.attr('data-percentage-right'))+'%','background-position':'50% '+iconElem.attr('data-percentage-top')+'%'});
			}
		});
	}
	
	//controls click
	controls.on("click", "a", function (event) {
		event.preventDefault();
		controls.find('a').removeClass('active');
		$(this).addClass('active');
		carousel.find('li').removeClass('active');
		var slideNumber = $(this).attr('data-slide');
		var activeSlide = carousel.find('li[data-slide='+slideNumber+']');
		activeSlide.addClass('active');
		clearInterval(timerId);
	});	
	
	//image click
	carousel.on("click", "li", function () {
		clearInterval(timerId);
	});
	
	//autoplay timer
	var timerId = setInterval(function() {
		
		if(carouselCount!=1){ //WEB-519: Added support for display one item in carousel.
			count++;
			var currentSlide = carousel.find('li[data-slide='+count+']');
			var currentControl = controls.find('a[data-slide='+count+']');
			
			carousel.find('li').removeClass('active');
			currentSlide.addClass('active');
			controls.find('a').removeClass('active');
			currentControl.addClass('active');
			
			if(count == carouselCount-1) {
				count = -1;
			}
		}
		
		
	}, 4000);
	
}
	
//init
if ( $('.carousel-wrap').length ) {
	$('.carousel-wrap').each(function(){
		carouselPlay($(this));
	});
}

// simple tabs
$('.tabs-control a').click(function(event) {
	event.preventDefault();
	$('.tabs-control li').removeClass('active');
	$(this).parent('li').addClass('active');
	$('.tabs li').removeClass('active');
	var tabNumber = $(this).attr('data-tab');
	var activeTab = $('.tabs li[data-tab='+tabNumber+']');
	activeTab.addClass('active');
});
	