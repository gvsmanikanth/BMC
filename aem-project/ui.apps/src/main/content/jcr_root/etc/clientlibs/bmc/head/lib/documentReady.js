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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9saWIvZG9jdW1lbnRSZWFkeS5qcyIsImpzL21vZHVsZXMvcmVhZC1lbG9xdWEtY29va2llLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmVhZEVsb3F1YUNvb2tpZSA9IHJlcXVpcmUoJy4uL21vZHVsZXMvcmVhZC1lbG9xdWEtY29va2llJyk7XHJcblxyXG5yZWFkRWxvcXVhQ29va2llKCk7XHJcblxyXG4kKCdzZWxlY3Q6bm90KFttdWx0aXBsZV0pJykud3JhcCgnPGRpdiBjbGFzcz1cImRlY29yYXRvci1zZWxlY3RcIiAvPicpO1xyXG4kKCdzZWxlY3RbbXVsdGlwbGVdJykud3JhcCgnPGRpdiBjbGFzcz1cImRlY29yYXRvci1zZWxlY3QtbXVsdGlwbGVcIiAvPicpO1xyXG5cclxuJCgnLmN1c3RvbS1maWxlLXVwbG9hZCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdCQodGhpcykubmV4dCgnaW5wdXRbdHlwZT1cImZpbGVcIl0nKS5jbGljaygpO1xyXG59KTtcclxuXHJcbi8vIHRvZ2dsZSBidXR0b25zIGZvciB0ZXN0IHBhZ2VzXHJcbiQoJy50b2dnbGUtcG9zaXRpb24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdCQoJ2JvZHknKS50b2dnbGVDbGFzcygnbm90LXNoaWZ0ZWQgc2hpZnRlZCcpO1xyXG59KTtcclxuJCgnLnRvZ2dsZS1ndXR0ZXJzJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ25vLWd1dHRlcnMgZ3V0dGVycycpO1xyXG59KTtcclxuIiwiLy8gTG9naWMgdG8gcmVhZCBDdXN0b21lciBHVUlEIGZyb20gRWxvcXVhIGNvb2tpZVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGZ1bmN0aW9uIHJlYWRFbG9xdWFDb29raWUoKSB7XHJcblx0XHR2YXIgdGltZXJJZCA9IG51bGwsIHRpbWVvdXQgPSA1O1xyXG5cdFxyXG5cdFx0ZnVuY3Rpb24gV2FpdFVudGlsQ3VzdG9tZXJHVUlESXNSZXRyaWV2ZWQoKSB7XHJcblx0XHRcdGlmICghISh0aW1lcklkKSkge1xyXG5cdFx0XHRcdGlmICh0aW1lb3V0ID09IDApIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKCh0eXBlb2YgdGhpcy5HZXRFbHFDdXN0b21lckdVSUQgPT09ICdmdW5jdGlvbicpICYmICh0eXBlb2YgZG9jdW1lbnQuZm9ybXMubGVhZGdlbiAhPT0gJ3VuZGVmaW5lZCcpKSB7XHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5mb3Jtcy5sZWFkZ2VuLmVsZW1lbnRzLmVscUN1c3RvbWVyR1VJRC52YWx1ZSA9IEdldEVscUN1c3RvbWVyR1VJRCgpO1xyXG5cdFx0XHRcdFx0fSBjYXRjaCAoZXhjZXB0aW9uKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbnNvbGUubG9nICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKGV4Y2VwdGlvbik7IC0tIHdlIGRvIG5vdCBhbGxvdyBjb25zb2xlLmxvZyBpbiBwcm9kdWN0aW9uIGNvZGVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aW1lb3V0IC09IDE7IFxyXG5cdFx0XHR9XHJcblx0XHRcdHRpbWVySWQgPSBzZXRUaW1lb3V0KFdhaXRVbnRpbEN1c3RvbWVyR1VJRElzUmV0cmlldmVkLCA1MDApO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHJcblx0XHR3aW5kb3cub25sb2FkID0gV2FpdFVudGlsQ3VzdG9tZXJHVUlESXNSZXRyaWV2ZWQ7XHJcblx0XHRpZiAodHlwZW9mIF9lbHFRICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRfZWxxUS5wdXNoKFsnZWxxR2V0Q3VzdG9tZXJHVUlEJ10pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZWFkRWxvcXVhQ29va2llKCk7XHJcbn0pO1x0Ly8gZG9jdW1lbnQgcmVhZHlcclxuXHJcbi8vZXhwb3J0cy5yZWFkRWxvcXVhQ29va2llID0gcmVhZEVsb3F1YUNvb2tpZTtcclxuIl19
