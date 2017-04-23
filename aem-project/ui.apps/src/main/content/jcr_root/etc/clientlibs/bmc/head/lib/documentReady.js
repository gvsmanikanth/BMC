(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var readEloquaCookie = require('../modules/read-eloqua-cookie');

readEloquaCookie();

$('select:not([multiple])').wrap('<div class="decorator-select" />');
$('select[multiple]').wrap('<div class="decorator-select-multiple" />');

$('.custom-file-upload').click(function(e) {
	e.preventDefault();

	$(this).next('input[type="file"]').click();
});

// toggle buttons for test pages
$('.toggle-position').on('click', function(e) {
	e.preventDefault();
	$('body').toggleClass('not-shifted shifted');
});
$('.toggle-gutters').on('click', function(e) {
	e.preventDefault();
	$('body').toggleClass('no-gutters gutters');
});

},{"../modules/read-eloqua-cookie":2}],2:[function(require,module,exports){
// Logic to read Customer GUID from Eloqua cookie
$(document).ready(function () {

	function readEloquaCookie() {
		var timerId = null, timeout = 5;
	
		function WaitUntilCustomerGUIDIsRetrieved() {
			if (!!(timerId)) {
				if (timeout == 0) {
					return;
				}
				if ((typeof this.GetElqCustomerGUID === 'function') && (typeof document.forms.leadgen !== 'undefined')) {
					try {
						document.forms.leadgen.elements.elqCustomerGUID.value = GetElqCustomerGUID();
					} catch (exception) {
						if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
							// console.log(exception); -- we do not allow console.log in production code
						}
					}
					return;
				}
				timeout -= 1; 
			}
			timerId = setTimeout(WaitUntilCustomerGUIDIsRetrieved, 500);
			return;
		}
	
		window.onload = WaitUntilCustomerGUIDIsRetrieved;
		if (typeof _elqQ !== 'undefined') {
			_elqQ.push(['elqGetCustomerGUID']);
		}
	}
	
	readEloquaCookie();
});	// document ready

//exports.readEloquaCookie = readEloquaCookie;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9saWIvZG9jdW1lbnRSZWFkeS5qcyIsImpzL21vZHVsZXMvcmVhZC1lbG9xdWEtY29va2llLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmVhZEVsb3F1YUNvb2tpZSA9IHJlcXVpcmUoJy4uL21vZHVsZXMvcmVhZC1lbG9xdWEtY29va2llJyk7XG5cbnJlYWRFbG9xdWFDb29raWUoKTtcblxuJCgnc2VsZWN0Om5vdChbbXVsdGlwbGVdKScpLndyYXAoJzxkaXYgY2xhc3M9XCJkZWNvcmF0b3Itc2VsZWN0XCIgLz4nKTtcbiQoJ3NlbGVjdFttdWx0aXBsZV0nKS53cmFwKCc8ZGl2IGNsYXNzPVwiZGVjb3JhdG9yLXNlbGVjdC1tdWx0aXBsZVwiIC8+Jyk7XG5cbiQoJy5jdXN0b20tZmlsZS11cGxvYWQnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblxuXHQkKHRoaXMpLm5leHQoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykuY2xpY2soKTtcbn0pO1xuXG4vLyB0b2dnbGUgYnV0dG9ucyBmb3IgdGVzdCBwYWdlc1xuJCgnLnRvZ2dsZS1wb3NpdGlvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25vdC1zaGlmdGVkIHNoaWZ0ZWQnKTtcbn0pO1xuJCgnLnRvZ2dsZS1ndXR0ZXJzJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdCQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm8tZ3V0dGVycyBndXR0ZXJzJyk7XG59KTtcbiIsIi8vIExvZ2ljIHRvIHJlYWQgQ3VzdG9tZXIgR1VJRCBmcm9tIEVsb3F1YSBjb29raWVcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuXHRmdW5jdGlvbiByZWFkRWxvcXVhQ29va2llKCkge1xuXHRcdHZhciB0aW1lcklkID0gbnVsbCwgdGltZW91dCA9IDU7XG5cdFxuXHRcdGZ1bmN0aW9uIFdhaXRVbnRpbEN1c3RvbWVyR1VJRElzUmV0cmlldmVkKCkge1xuXHRcdFx0aWYgKCEhKHRpbWVySWQpKSB7XG5cdFx0XHRcdGlmICh0aW1lb3V0ID09IDApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCh0eXBlb2YgdGhpcy5HZXRFbHFDdXN0b21lckdVSUQgPT09ICdmdW5jdGlvbicpICYmICh0eXBlb2YgZG9jdW1lbnQuZm9ybXMubGVhZGdlbiAhPT0gJ3VuZGVmaW5lZCcpKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGRvY3VtZW50LmZvcm1zLmxlYWRnZW4uZWxlbWVudHMuZWxxQ3VzdG9tZXJHVUlELnZhbHVlID0gR2V0RWxxQ3VzdG9tZXJHVUlEKCk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXhjZXB0aW9uKSB7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjb25zb2xlLmxvZyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coZXhjZXB0aW9uKTsgLS0gd2UgZG8gbm90IGFsbG93IGNvbnNvbGUubG9nIGluIHByb2R1Y3Rpb24gY29kZVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0dGltZW91dCAtPSAxOyBcblx0XHRcdH1cblx0XHRcdHRpbWVySWQgPSBzZXRUaW1lb3V0KFdhaXRVbnRpbEN1c3RvbWVyR1VJRElzUmV0cmlldmVkLCA1MDApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XG5cdFx0d2luZG93Lm9ubG9hZCA9IFdhaXRVbnRpbEN1c3RvbWVyR1VJRElzUmV0cmlldmVkO1xuXHRcdGlmICh0eXBlb2YgX2VscVEgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRfZWxxUS5wdXNoKFsnZWxxR2V0Q3VzdG9tZXJHVUlEJ10pO1xuXHRcdH1cblx0fVxuXHRcblx0cmVhZEVsb3F1YUNvb2tpZSgpO1xufSk7XHQvLyBkb2N1bWVudCByZWFkeVxuXG4vL2V4cG9ydHMucmVhZEVsb3F1YUNvb2tpZSA9IHJlYWRFbG9xdWFDb29raWU7XG4iXX0=
