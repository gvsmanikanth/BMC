(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3NpbXBsZXRhYnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2ltcGxlIHRhYnNcclxuJCgnLnRhYnMtY29udHJvbCBhJykuY2xpY2soZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFxyXG5cdCQoJy50YWJzLWNvbnRyb2wgbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0JCh0aGlzKS5wYXJlbnQoJ2xpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFxyXG5cdFxyXG5cdCQoJy50YWJzIGxpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFxyXG5cdHZhciB0YWJOdW1iZXIgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdGFiJyk7XHJcblx0dmFyIGFjdGl2ZVRhYiA9ICQoJy50YWJzIGxpW2RhdGEtdGFiPScrdGFiTnVtYmVyKyddJyk7XHJcblx0XHJcblx0YWN0aXZlVGFiLmFkZENsYXNzKCdhY3RpdmUnKTtcclxufSk7Il19
