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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3JlYWQtZWxvcXVhLWNvb2tpZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gTG9naWMgdG8gcmVhZCBDdXN0b21lciBHVUlEIGZyb20gRWxvcXVhIGNvb2tpZVxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXG5cdGZ1bmN0aW9uIHJlYWRFbG9xdWFDb29raWUoKSB7XG5cdFx0dmFyIHRpbWVySWQgPSBudWxsLCB0aW1lb3V0ID0gNTtcblx0XG5cdFx0ZnVuY3Rpb24gV2FpdFVudGlsQ3VzdG9tZXJHVUlESXNSZXRyaWV2ZWQoKSB7XG5cdFx0XHRpZiAoISEodGltZXJJZCkpIHtcblx0XHRcdFx0aWYgKHRpbWVvdXQgPT0gMCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoKHR5cGVvZiB0aGlzLkdldEVscUN1c3RvbWVyR1VJRCA9PT0gJ2Z1bmN0aW9uJykgJiYgKHR5cGVvZiBkb2N1bWVudC5mb3Jtcy5sZWFkZ2VuICE9PSAndW5kZWZpbmVkJykpIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQuZm9ybXMubGVhZGdlbi5lbGVtZW50cy5lbHFDdXN0b21lckdVSUQudmFsdWUgPSBHZXRFbHFDdXN0b21lckdVSUQoKTtcblx0XHRcdFx0XHR9IGNhdGNoIChleGNlcHRpb24pIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbnNvbGUubG9nICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhleGNlcHRpb24pOyAtLSB3ZSBkbyBub3QgYWxsb3cgY29uc29sZS5sb2cgaW4gcHJvZHVjdGlvbiBjb2RlXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aW1lb3V0IC09IDE7IFxuXHRcdFx0fVxuXHRcdFx0dGltZXJJZCA9IHNldFRpbWVvdXQoV2FpdFVudGlsQ3VzdG9tZXJHVUlESXNSZXRyaWV2ZWQsIDUwMCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcblx0XHR3aW5kb3cub25sb2FkID0gV2FpdFVudGlsQ3VzdG9tZXJHVUlESXNSZXRyaWV2ZWQ7XG5cdFx0aWYgKHR5cGVvZiBfZWxxUSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdF9lbHFRLnB1c2goWydlbHFHZXRDdXN0b21lckdVSUQnXSk7XG5cdFx0fVxuXHR9XG5cdFxuXHRyZWFkRWxvcXVhQ29va2llKCk7XG59KTtcdC8vIGRvY3VtZW50IHJlYWR5XG5cbi8vZXhwb3J0cy5yZWFkRWxvcXVhQ29va2llID0gcmVhZEVsb3F1YUNvb2tpZTtcbiJdfQ==
