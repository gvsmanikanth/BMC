(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3RydWVzaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcblx0Ly8gc2ltcGxlIG1hbnVhbCBjYXJvdXNlbCBmb3IgVHJ1ZXNpZ2h0XHJcblx0ZnVuY3Rpb24gdHJ1ZXNpZ2h0Q2Fyb3VzZWxBdXRvcGxheSgpIHtcclxuXHQgICAgXHJcblx0ICAgICAkKCcudHJ1ZXNpZ2h0LWNhcm91c2VsLWNvbnRyb2wgYScpLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcclxuXHRcdFx0JCgnLnRydWVzaWdodC1jYXJvdXNlbC1jb250cm9sIGEnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcclxuXHRcdFx0JCgnLnRydWVzaWdodC1jYXJvdXNlbCBsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0dmFyIHNsaWRlTnVtYmVyID0gJCh0aGlzKS5hdHRyKCdkYXRhLXNsaWRlJyk7XHJcblx0XHRcdHZhciBhY3RpdmVTbGlkZSA9ICQoJy50cnVlc2lnaHQtY2Fyb3VzZWwgbGlbZGF0YS1zbGlkZT0nK3NsaWRlTnVtYmVyKyddJyk7XHJcblx0XHRcdGFjdGl2ZVNsaWRlLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHJcblx0XHRcdGNsZWFySW50ZXJ2YWwodGltZXJJZCk7XHJcblx0XHR9KTtcdFxyXG5cdFx0XHJcblx0XHQkKCcudHJ1ZXNpZ2h0LWNhcm91c2VsIGxpJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHRcdGNsZWFySW50ZXJ2YWwodGltZXJJZCk7XHJcblx0XHR9KTtcclxuXHQgICAgXHJcblx0ICAgIHZhciBjb3VudCA9IDA7XHJcblx0ICAgIHZhciB0aW1lcklkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0ICAgICAgICBjb3VudCsrO1xyXG5cdCAgICAgICAgXHJcblx0XHRcdHZhciBhY3RpdmVTbGlkZSA9ICQoJy50cnVlc2lnaHQtY2Fyb3VzZWwgbGlbZGF0YS1zbGlkZT0nK2NvdW50KyddJyk7XHJcblx0XHRcdHZhciBhY3RpdmVDb250cm9sID0gJCgnLnRydWVzaWdodC1jYXJvdXNlbC1jb250cm9sIGFbZGF0YS1zbGlkZT0nK2NvdW50KyddJyk7XHJcblx0ICAgICAgICBcclxuXHQgICAgICAgICQoJy50cnVlc2lnaHQtY2Fyb3VzZWwgbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0ICAgICAgICAkKGFjdGl2ZVNsaWRlKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0ICAgICAgICAkKCcudHJ1ZXNpZ2h0LWNhcm91c2VsLWNvbnRyb2wgYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHQgICAgICAgICQoYWN0aXZlQ29udHJvbCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdCAgICAgICAgXHJcblx0ICAgICAgICBpZihjb3VudCA9PSAzKSB7XHJcblx0ICAgICAgICAgICAgY291bnQgPSAtMTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfSwgNDAwMCk7XHJcblx0fVxyXG5cdFxyXG5cdGlmICggJCgnLnRydWVzaWdodC1jYXJvdXNlbCcpLmxlbmd0aCApIHtcclxuXHRcdHRydWVzaWdodENhcm91c2VsQXV0b3BsYXkoKTtcclxuXHR9XHJcblxyXG5cdC8vIHNpbXBsZSB0YWJzIGZvciBUcnVlc2lnaHRcclxuXHQkKCcudHJ1ZXNpZ2h0LXRhYnMtY29udHJvbCBhJykuY2xpY2soZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcclxuXHRcdCQoJy50cnVlc2lnaHQtdGFicy1jb250cm9sIGxpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0JCh0aGlzKS5wYXJlbnQoJ2xpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdCQoJy50cnVlc2lnaHQtdGFicyBsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFxyXG5cdFx0dmFyIHRhYk51bWJlciA9ICQodGhpcykuYXR0cignZGF0YS10YWInKTtcclxuXHRcdHZhciBhY3RpdmVUYWIgPSAkKCcudHJ1ZXNpZ2h0LXRhYnMgbGlbZGF0YS10YWI9Jyt0YWJOdW1iZXIrJ10nKTtcclxuXHRcdFxyXG5cdFx0YWN0aXZlVGFiLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHR9KTsiXX0=
