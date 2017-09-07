(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3JlYWQtZWxvcXVhLWNvb2tpZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gTG9naWMgdG8gcmVhZCBDdXN0b21lciBHVUlEIGZyb20gRWxvcXVhIGNvb2tpZVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGZ1bmN0aW9uIHJlYWRFbG9xdWFDb29raWUoKSB7XHJcblx0XHR2YXIgdGltZXJJZCA9IG51bGwsIHRpbWVvdXQgPSA1O1xyXG5cdFxyXG5cdFx0ZnVuY3Rpb24gV2FpdFVudGlsQ3VzdG9tZXJHVUlESXNSZXRyaWV2ZWQoKSB7XHJcblx0XHRcdGlmICghISh0aW1lcklkKSkge1xyXG5cdFx0XHRcdGlmICh0aW1lb3V0ID09IDApIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKCh0eXBlb2YgdGhpcy5HZXRFbHFDdXN0b21lckdVSUQgPT09ICdmdW5jdGlvbicpICYmICh0eXBlb2YgZG9jdW1lbnQuZm9ybXMubGVhZGdlbiAhPT0gJ3VuZGVmaW5lZCcpKSB7XHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5mb3Jtcy5sZWFkZ2VuLmVsZW1lbnRzLmVscUN1c3RvbWVyR1VJRC52YWx1ZSA9IEdldEVscUN1c3RvbWVyR1VJRCgpO1xyXG5cdFx0XHRcdFx0fSBjYXRjaCAoZXhjZXB0aW9uKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbnNvbGUubG9nICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKGV4Y2VwdGlvbik7IC0tIHdlIGRvIG5vdCBhbGxvdyBjb25zb2xlLmxvZyBpbiBwcm9kdWN0aW9uIGNvZGVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aW1lb3V0IC09IDE7IFxyXG5cdFx0XHR9XHJcblx0XHRcdHRpbWVySWQgPSBzZXRUaW1lb3V0KFdhaXRVbnRpbEN1c3RvbWVyR1VJRElzUmV0cmlldmVkLCA1MDApO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHJcblx0XHR3aW5kb3cub25sb2FkID0gV2FpdFVudGlsQ3VzdG9tZXJHVUlESXNSZXRyaWV2ZWQ7XHJcblx0XHRpZiAodHlwZW9mIF9lbHFRICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRfZWxxUS5wdXNoKFsnZWxxR2V0Q3VzdG9tZXJHVUlEJ10pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZWFkRWxvcXVhQ29va2llKCk7XHJcbn0pO1x0Ly8gZG9jdW1lbnQgcmVhZHlcclxuXHJcbi8vZXhwb3J0cy5yZWFkRWxvcXVhQ29va2llID0gcmVhZEVsb3F1YUNvb2tpZTtcclxuIl19
