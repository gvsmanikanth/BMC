(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
	
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2Nhcm91c2VsYXV0b3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvL3BsYXkgY2Fyb3VzZWxcbmZ1bmN0aW9uIGNhcm91c2VsUGxheShlbGVtKSB7XG5cdHZhciBjYXJvdXNlbCA9IGVsZW0uZmluZCgnLmNhcm91c2VsJyk7XG5cdHZhciBjb250cm9scyA9IGVsZW0uZmluZCgnLmNhcm91c2VsLWNvbnRyb2wnKTtcblx0dmFyIGNhcm91c2VsSXRlbXMgPSBjYXJvdXNlbC5maW5kKCdsaScpO1xuXHR2YXIgY2Fyb3VzZWxDb3VudCA9IGNhcm91c2VsSXRlbXMubGVuZ3RoO1xuXHR2YXIgY291bnQgPSAwO1xuXHRcblx0Ly9pY29ucyBwZXJjZW50YWdlIGZyb20gcmlnaHRcblx0aWYgKGNhcm91c2VsLmZpbmQoJy5jYXJvdXNlbC1pY29uJykubGVuZ3RoICE9IDApIHtcblx0XHRjYXJvdXNlbEl0ZW1zLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciBpY29uRWxlbSA9ICQodGhpcykuZmluZCgnLmNhcm91c2VsLWljb24nKTtcblx0XHRcdGlmKGljb25FbGVtLmxlbmd0aCAhPSAwKSB7XG5cdFx0XHRcdFx0aWNvbkVsZW0uY3NzKHsncmlnaHQnOihpY29uRWxlbS5hdHRyKCdkYXRhLXBlcmNlbnRhZ2UtcmlnaHQnKSkrJyUnLCdiYWNrZ3JvdW5kLXBvc2l0aW9uJzonNTAlICcraWNvbkVsZW0uYXR0cignZGF0YS1wZXJjZW50YWdlLXRvcCcpKyclJ30pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdFxuXHQvL2NvbnRyb2xzIGNsaWNrXG5cdGNvbnRyb2xzLm9uKFwiY2xpY2tcIiwgXCJhXCIsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0Y29udHJvbHMuZmluZCgnYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRjYXJvdXNlbC5maW5kKCdsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHR2YXIgc2xpZGVOdW1iZXIgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtc2xpZGUnKTtcblx0XHR2YXIgYWN0aXZlU2xpZGUgPSBjYXJvdXNlbC5maW5kKCdsaVtkYXRhLXNsaWRlPScrc2xpZGVOdW1iZXIrJ10nKTtcblx0XHRhY3RpdmVTbGlkZS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0Y2xlYXJJbnRlcnZhbCh0aW1lcklkKTtcblx0fSk7XHRcblx0XG5cdC8vaW1hZ2UgY2xpY2tcblx0Y2Fyb3VzZWwub24oXCJjbGlja1wiLCBcImxpXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRjbGVhckludGVydmFsKHRpbWVySWQpO1xuXHR9KTtcblx0XG5cdC8vYXV0b3BsYXkgdGltZXJcblx0dmFyIHRpbWVySWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0XHRcblx0XHRpZihjYXJvdXNlbENvdW50IT0xKXsgLy9XRUItNTE5OiBBZGRlZCBzdXBwb3J0IGZvciBkaXNwbGF5IG9uZSBpdGVtIGluIGNhcm91c2VsLlxuXHRcdFx0Y291bnQrKztcblx0XHRcdHZhciBjdXJyZW50U2xpZGUgPSBjYXJvdXNlbC5maW5kKCdsaVtkYXRhLXNsaWRlPScrY291bnQrJ10nKTtcblx0XHRcdHZhciBjdXJyZW50Q29udHJvbCA9IGNvbnRyb2xzLmZpbmQoJ2FbZGF0YS1zbGlkZT0nK2NvdW50KyddJyk7XG5cdFx0XHRcblx0XHRcdGNhcm91c2VsLmZpbmQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0Y3VycmVudFNsaWRlLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoJ2EnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRjdXJyZW50Q29udHJvbC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcblx0XHRcdGlmKGNvdW50ID09IGNhcm91c2VsQ291bnQtMSkge1xuXHRcdFx0XHRjb3VudCA9IC0xO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHRcblx0fSwgNDAwMCk7XG5cdFxufVxuXHRcbi8vaW5pdFxuaWYgKCAkKCcuY2Fyb3VzZWwtd3JhcCcpLmxlbmd0aCApIHtcblx0JCgnLmNhcm91c2VsLXdyYXAnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0Y2Fyb3VzZWxQbGF5KCQodGhpcykpO1xuXHR9KTtcbn1cblxuLy8gc2ltcGxlIHRhYnNcbiQoJy50YWJzLWNvbnRyb2wgYScpLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KSB7XG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCQoJy50YWJzLWNvbnRyb2wgbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdCQodGhpcykucGFyZW50KCdsaScpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0JCgnLnRhYnMgbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdHZhciB0YWJOdW1iZXIgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdGFiJyk7XG5cdHZhciBhY3RpdmVUYWIgPSAkKCcudGFicyBsaVtkYXRhLXRhYj0nK3RhYk51bWJlcisnXScpO1xuXHRhY3RpdmVUYWIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xufSk7XG5cdCJdfQ==
