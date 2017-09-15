(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// jQuery document ready
jQuery(function ($) {
	var windowResize = new EventDebouncer('resize');

	// debounce the resize event of the window to prevent too many firings of the event
	// https://gist.github.com/stoff/5df2d64cbfd2889121e4
	windowResize.attach();
	
	// move elements in dom to avoid duplication of elements
	$('.search-site, .nav-login-header, .navigation-login-header').appendAround();
});// document ready
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2xlZ2FjeS1tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBqUXVlcnkgZG9jdW1lbnQgcmVhZHlcbmpRdWVyeShmdW5jdGlvbiAoJCkge1xuXHR2YXIgd2luZG93UmVzaXplID0gbmV3IEV2ZW50RGVib3VuY2VyKCdyZXNpemUnKTtcblxuXHQvLyBkZWJvdW5jZSB0aGUgcmVzaXplIGV2ZW50IG9mIHRoZSB3aW5kb3cgdG8gcHJldmVudCB0b28gbWFueSBmaXJpbmdzIG9mIHRoZSBldmVudFxuXHQvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9zdG9mZi81ZGYyZDY0Y2JmZDI4ODkxMjFlNFxuXHR3aW5kb3dSZXNpemUuYXR0YWNoKCk7XG5cdFxuXHQvLyBtb3ZlIGVsZW1lbnRzIGluIGRvbSB0byBhdm9pZCBkdXBsaWNhdGlvbiBvZiBlbGVtZW50c1xuXHQkKCcuc2VhcmNoLXNpdGUsIC5uYXYtbG9naW4taGVhZGVyLCAubmF2aWdhdGlvbi1sb2dpbi1oZWFkZXInKS5hcHBlbmRBcm91bmQoKTtcbn0pOy8vIGRvY3VtZW50IHJlYWR5Il19
