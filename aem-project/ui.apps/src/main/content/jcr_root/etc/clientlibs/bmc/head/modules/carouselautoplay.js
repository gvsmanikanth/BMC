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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2Nhcm91c2VsYXV0b3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvL3BsYXkgY2Fyb3VzZWxcclxuZnVuY3Rpb24gY2Fyb3VzZWxQbGF5KGVsZW0pIHtcclxuXHR2YXIgY2Fyb3VzZWwgPSBlbGVtLmZpbmQoJy5jYXJvdXNlbCcpO1xyXG5cdHZhciBjb250cm9scyA9IGVsZW0uZmluZCgnLmNhcm91c2VsLWNvbnRyb2wnKTtcclxuXHR2YXIgY2Fyb3VzZWxJdGVtcyA9IGNhcm91c2VsLmZpbmQoJ2xpJyk7XHJcblx0dmFyIGNhcm91c2VsQ291bnQgPSBjYXJvdXNlbEl0ZW1zLmxlbmd0aDtcclxuXHR2YXIgY291bnQgPSAwO1xyXG5cdFxyXG5cdC8vaWNvbnMgcGVyY2VudGFnZSBmcm9tIHJpZ2h0XHJcblx0aWYgKGNhcm91c2VsLmZpbmQoJy5jYXJvdXNlbC1pY29uJykubGVuZ3RoICE9IDApIHtcclxuXHRcdGNhcm91c2VsSXRlbXMuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgaWNvbkVsZW0gPSAkKHRoaXMpLmZpbmQoJy5jYXJvdXNlbC1pY29uJyk7XHJcblx0XHRcdGlmKGljb25FbGVtLmxlbmd0aCAhPSAwKSB7XHJcblx0XHRcdFx0XHRpY29uRWxlbS5jc3MoeydyaWdodCc6KGljb25FbGVtLmF0dHIoJ2RhdGEtcGVyY2VudGFnZS1yaWdodCcpKSsnJScsJ2JhY2tncm91bmQtcG9zaXRpb24nOic1MCUgJytpY29uRWxlbS5hdHRyKCdkYXRhLXBlcmNlbnRhZ2UtdG9wJykrJyUnfSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHQvL2NvbnRyb2xzIGNsaWNrXHJcblx0Y29udHJvbHMub24oXCJjbGlja1wiLCBcImFcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0Y29udHJvbHMuZmluZCgnYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0Y2Fyb3VzZWwuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHR2YXIgc2xpZGVOdW1iZXIgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtc2xpZGUnKTtcclxuXHRcdHZhciBhY3RpdmVTbGlkZSA9IGNhcm91c2VsLmZpbmQoJ2xpW2RhdGEtc2xpZGU9JytzbGlkZU51bWJlcisnXScpO1xyXG5cdFx0YWN0aXZlU2xpZGUuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0Y2xlYXJJbnRlcnZhbCh0aW1lcklkKTtcclxuXHR9KTtcdFxyXG5cdFxyXG5cdC8vaW1hZ2UgY2xpY2tcclxuXHRjYXJvdXNlbC5vbihcImNsaWNrXCIsIFwibGlcIiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2xlYXJJbnRlcnZhbCh0aW1lcklkKTtcclxuXHR9KTtcclxuXHRcclxuXHQvL2F1dG9wbGF5IHRpbWVyXHJcblx0dmFyIHRpbWVySWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFxyXG5cdFx0aWYoY2Fyb3VzZWxDb3VudCE9MSl7IC8vV0VCLTUxOTogQWRkZWQgc3VwcG9ydCBmb3IgZGlzcGxheSBvbmUgaXRlbSBpbiBjYXJvdXNlbC5cclxuXHRcdFx0Y291bnQrKztcclxuXHRcdFx0dmFyIGN1cnJlbnRTbGlkZSA9IGNhcm91c2VsLmZpbmQoJ2xpW2RhdGEtc2xpZGU9Jytjb3VudCsnXScpO1xyXG5cdFx0XHR2YXIgY3VycmVudENvbnRyb2wgPSBjb250cm9scy5maW5kKCdhW2RhdGEtc2xpZGU9Jytjb3VudCsnXScpO1xyXG5cdFx0XHRcclxuXHRcdFx0Y2Fyb3VzZWwuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdGN1cnJlbnRTbGlkZS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdGNvbnRyb2xzLmZpbmQoJ2EnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdGN1cnJlbnRDb250cm9sLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmKGNvdW50ID09IGNhcm91c2VsQ291bnQtMSkge1xyXG5cdFx0XHRcdGNvdW50ID0gLTE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0XHJcblx0fSwgNDAwMCk7XHJcblx0XHJcbn1cclxuXHRcclxuLy9pbml0XHJcbmlmICggJCgnLmNhcm91c2VsLXdyYXAnKS5sZW5ndGggKSB7XHJcblx0JCgnLmNhcm91c2VsLXdyYXAnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRjYXJvdXNlbFBsYXkoJCh0aGlzKSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbi8vIHNpbXBsZSB0YWJzXHJcbiQoJy50YWJzLWNvbnRyb2wgYScpLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHQkKCcudGFicy1jb250cm9sIGxpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdCQodGhpcykucGFyZW50KCdsaScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHQkKCcudGFicyBsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHR2YXIgdGFiTnVtYmVyID0gJCh0aGlzKS5hdHRyKCdkYXRhLXRhYicpO1xyXG5cdHZhciBhY3RpdmVUYWIgPSAkKCcudGFicyBsaVtkYXRhLXRhYj0nK3RhYk51bWJlcisnXScpO1xyXG5cdGFjdGl2ZVRhYi5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbn0pO1xyXG5cdCJdfQ==
