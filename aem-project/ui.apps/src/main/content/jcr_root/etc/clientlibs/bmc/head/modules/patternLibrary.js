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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3BhdHRlcm5MaWJyYXJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyB0YWtlbiBmcm9tIHRoZSBqcXVlci5uYXZpZ2F0aW9uLmpzIGZpbGUgc3BlY2lmaWNhbGx5IGZvciB0aGUgUGF0dGVybiBMaWJyYXJ5XHJcblxyXG4kKCcuY29udGFjdC1ibWMnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdCQoJ2JvZHknKS5hZGRDbGFzcygnY29udGFjdC1tb2RhbC1hY3RpdmUnKTtcclxufSk7XHJcblxyXG4kKCcubW9kYWwtY2xvc2UsIC5sYXlvdXQtbW9kYWwtb3ZlcmxheScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdjb250YWN0LW1vZGFsLWFjdGl2ZScpO1xyXG59KTtcclxuXHJcbiQoJy50b2dnbGUtZmxleGJveC1zdXBwb3J0JykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHQkKCdodG1sJykudG9nZ2xlQ2xhc3MoJ2ZsZXhib3ggbm8tZmxleGJveCcpO1xyXG59KTtcclxuXHJcblxyXG4vLyBhdXRvLW9wZW4gcGF0dGVybiBsaWJyYXJ5IG5hdiBvbiB0aGUgQWJvdXQgcGFnZSBvbmUgdGltZSBvbmx5XHJcbmZ1bmN0aW9uIGF1dG9PcGVuTmF2KCkge1xyXG5cdGlmICggJCh3aW5kb3cpLndpZHRoKCkgPiA5NjAgKSB7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJyNuYXYtY29udHJvbCcpLmNsaWNrKCk7XHJcblx0XHR9LCAxMDAwKTtcclxuXHRcdC8vIHNldCBjb29raWUgdG8gbm90IG9wZW4gYWdhaW4gZm9yIDcgZGF5c1xyXG5cdFx0JC5jb29raWUoJ2F1dG9PcGVuTmF2JywgJ2ZhbHNlJywgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSk7XHJcblx0fVxyXG59XHJcbi8vIG9ubHkgcnVuIGluIHRoZSBjb250ZXh0IG9mIHRoZSBwYXR0ZXJuIGxpYnJhcnksIGFuZCBpZiB0aGVyZSBpcyBubyBjb29raWUgc2V0XHJcbmlmICggJCgnYm9keScpLmhhc0NsYXNzKCdhdXRvLW9wZW4tbmF2JykgJiYgJC5jb29raWUoJ2F1dG9PcGVuTmF2JykgIT09ICdmYWxzZScgKSB7XHJcblx0YXV0b09wZW5OYXYoKTtcclxufSBcclxuLy8gZW5kIGF1dG8tb3BlbiBwYXR0ZXJuIGxpYnJhcnkgbmF2XHJcblxyXG4iXX0=
