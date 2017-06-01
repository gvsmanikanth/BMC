(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// taken from the jquer.navigation.js file specifically for the Pattern Library

$('.contact-bmc').click(function(e) {
	e.preventDefault();
	$('body').addClass('contact-modal-active');
});

$('.modal-close, .layout-modal-overlay').click(function(e) {
	e.preventDefault();
	$('body').removeClass('contact-modal-active');
});

$('.toggle-flexbox-support').click(function(e) {
	e.preventDefault();
	$('html').toggleClass('flexbox no-flexbox');
});


// auto-open pattern library nav on the About page one time only
function autoOpenNav() {
	if ( $(window).width() > 960 ) {
		setTimeout(function(){
			$('#nav-control').click();
		}, 1000);
		// set cookie to not open again for 7 days
		$.cookie('autoOpenNav', 'false', { expires: 7, path: '/' });
	}
}
// only run in the context of the pattern library, and if there is no cookie set
if ( $('body').hasClass('auto-open-nav') && $.cookie('autoOpenNav') !== 'false' ) {
	autoOpenNav();
} 
// end auto-open pattern library nav


},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3BhdHRlcm5MaWJyYXJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyB0YWtlbiBmcm9tIHRoZSBqcXVlci5uYXZpZ2F0aW9uLmpzIGZpbGUgc3BlY2lmaWNhbGx5IGZvciB0aGUgUGF0dGVybiBMaWJyYXJ5XG5cbiQoJy5jb250YWN0LWJtYycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQkKCdib2R5JykuYWRkQ2xhc3MoJ2NvbnRhY3QtbW9kYWwtYWN0aXZlJyk7XG59KTtcblxuJCgnLm1vZGFsLWNsb3NlLCAubGF5b3V0LW1vZGFsLW92ZXJsYXknKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdjb250YWN0LW1vZGFsLWFjdGl2ZScpO1xufSk7XG5cbiQoJy50b2dnbGUtZmxleGJveC1zdXBwb3J0JykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdCQoJ2h0bWwnKS50b2dnbGVDbGFzcygnZmxleGJveCBuby1mbGV4Ym94Jyk7XG59KTtcblxuXG4vLyBhdXRvLW9wZW4gcGF0dGVybiBsaWJyYXJ5IG5hdiBvbiB0aGUgQWJvdXQgcGFnZSBvbmUgdGltZSBvbmx5XG5mdW5jdGlvbiBhdXRvT3Blbk5hdigpIHtcblx0aWYgKCAkKHdpbmRvdykud2lkdGgoKSA+IDk2MCApIHtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQkKCcjbmF2LWNvbnRyb2wnKS5jbGljaygpO1xuXHRcdH0sIDEwMDApO1xuXHRcdC8vIHNldCBjb29raWUgdG8gbm90IG9wZW4gYWdhaW4gZm9yIDcgZGF5c1xuXHRcdCQuY29va2llKCdhdXRvT3Blbk5hdicsICdmYWxzZScsIHsgZXhwaXJlczogNywgcGF0aDogJy8nIH0pO1xuXHR9XG59XG4vLyBvbmx5IHJ1biBpbiB0aGUgY29udGV4dCBvZiB0aGUgcGF0dGVybiBsaWJyYXJ5LCBhbmQgaWYgdGhlcmUgaXMgbm8gY29va2llIHNldFxuaWYgKCAkKCdib2R5JykuaGFzQ2xhc3MoJ2F1dG8tb3Blbi1uYXYnKSAmJiAkLmNvb2tpZSgnYXV0b09wZW5OYXYnKSAhPT0gJ2ZhbHNlJyApIHtcblx0YXV0b09wZW5OYXYoKTtcbn0gXG4vLyBlbmQgYXV0by1vcGVuIHBhdHRlcm4gbGlicmFyeSBuYXZcblxuIl19
