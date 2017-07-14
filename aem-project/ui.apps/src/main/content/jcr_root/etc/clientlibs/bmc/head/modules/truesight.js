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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3RydWVzaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cdC8vIHNpbXBsZSBtYW51YWwgY2Fyb3VzZWwgZm9yIFRydWVzaWdodFxuXHRmdW5jdGlvbiB0cnVlc2lnaHRDYXJvdXNlbEF1dG9wbGF5KCkge1xuXHQgICAgXG5cdCAgICAgJCgnLnRydWVzaWdodC1jYXJvdXNlbC1jb250cm9sIGEnKS5jbGljayhmdW5jdGlvbihldmVudCkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcblx0XHRcdCQoJy50cnVlc2lnaHQtY2Fyb3VzZWwtY29udHJvbCBhJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcblx0XHRcdCQoJy50cnVlc2lnaHQtY2Fyb3VzZWwgbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHR2YXIgc2xpZGVOdW1iZXIgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtc2xpZGUnKTtcblx0XHRcdHZhciBhY3RpdmVTbGlkZSA9ICQoJy50cnVlc2lnaHQtY2Fyb3VzZWwgbGlbZGF0YS1zbGlkZT0nK3NsaWRlTnVtYmVyKyddJyk7XG5cdFx0XHRhY3RpdmVTbGlkZS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcblx0XHRcdGNsZWFySW50ZXJ2YWwodGltZXJJZCk7XG5cdFx0fSk7XHRcblx0XHRcblx0XHQkKCcudHJ1ZXNpZ2h0LWNhcm91c2VsIGxpJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRjbGVhckludGVydmFsKHRpbWVySWQpO1xuXHRcdH0pO1xuXHQgICAgXG5cdCAgICB2YXIgY291bnQgPSAwO1xuXHQgICAgdmFyIHRpbWVySWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0ICAgICAgICBjb3VudCsrO1xuXHQgICAgICAgIFxuXHRcdFx0dmFyIGFjdGl2ZVNsaWRlID0gJCgnLnRydWVzaWdodC1jYXJvdXNlbCBsaVtkYXRhLXNsaWRlPScrY291bnQrJ10nKTtcblx0XHRcdHZhciBhY3RpdmVDb250cm9sID0gJCgnLnRydWVzaWdodC1jYXJvdXNlbC1jb250cm9sIGFbZGF0YS1zbGlkZT0nK2NvdW50KyddJyk7XG5cdCAgICAgICAgXG5cdCAgICAgICAgJCgnLnRydWVzaWdodC1jYXJvdXNlbCBsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0ICAgICAgICAkKGFjdGl2ZVNsaWRlKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdCAgICAgICAgJCgnLnRydWVzaWdodC1jYXJvdXNlbC1jb250cm9sIGEnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdCAgICAgICAgJChhY3RpdmVDb250cm9sKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdCAgICAgICAgXG5cdCAgICAgICAgaWYoY291bnQgPT0gMykge1xuXHQgICAgICAgICAgICBjb3VudCA9IC0xO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIDQwMDApO1xuXHR9XG5cdFxuXHRpZiAoICQoJy50cnVlc2lnaHQtY2Fyb3VzZWwnKS5sZW5ndGggKSB7XG5cdFx0dHJ1ZXNpZ2h0Q2Fyb3VzZWxBdXRvcGxheSgpO1xuXHR9XG5cblx0Ly8gc2ltcGxlIHRhYnMgZm9yIFRydWVzaWdodFxuXHQkKCcudHJ1ZXNpZ2h0LXRhYnMtY29udHJvbCBhJykuY2xpY2soZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFxuXHRcdCQoJy50cnVlc2lnaHQtdGFicy1jb250cm9sIGxpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQodGhpcykucGFyZW50KCdsaScpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcblx0XHRcblx0XHQkKCcudHJ1ZXNpZ2h0LXRhYnMgbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XG5cdFx0dmFyIHRhYk51bWJlciA9ICQodGhpcykuYXR0cignZGF0YS10YWInKTtcblx0XHR2YXIgYWN0aXZlVGFiID0gJCgnLnRydWVzaWdodC10YWJzIGxpW2RhdGEtdGFiPScrdGFiTnVtYmVyKyddJyk7XG5cdFx0XG5cdFx0YWN0aXZlVGFiLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0fSk7Il19
