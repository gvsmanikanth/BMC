(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(document).ready(function () {

	function readSVIValue()	{
		var _s_vi = "";
		if (typeof bmcMeta !== 'undefined' && bmcMeta.hasOwnProperty("user")) {
			_s_vi = bmcMeta.user.sVi;
		}
		
		if(_s_vi !== ""){
			//console.log('value added to form field');
		      if ($("#C_Lead_Rating_Override1").val() !== _s_vi) {
		        $("#C_Lead_Rating_Override1").val(_s_vi);
		      }
		}else{
			//console.log('trying again to retrieve svi');
			setTimeout(readSVIValue, 500);	//try again
		}
	}
	
	setTimeout(readSVIValue, 5000);	//Run the function after 5 secs

	//Failsafe
	$("form.customerform").submit(function()	{
		//console.log('setting bmcMeta svi value again');
		readSVIValue();
	});
	

});	// document ready
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3JlYWQtYWRvYmUtc192aS12YXJpYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXG5cdGZ1bmN0aW9uIHJlYWRTVklWYWx1ZSgpXHR7XG5cdFx0dmFyIF9zX3ZpID0gXCJcIjtcblx0XHRpZiAodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIGJtY01ldGEuaGFzT3duUHJvcGVydHkoXCJ1c2VyXCIpKSB7XG5cdFx0XHRfc192aSA9IGJtY01ldGEudXNlci5zVmk7XG5cdFx0fVxuXHRcdFxuXHRcdGlmKF9zX3ZpICE9PSBcIlwiKXtcblx0XHRcdC8vY29uc29sZS5sb2coJ3ZhbHVlIGFkZGVkIHRvIGZvcm0gZmllbGQnKTtcblx0XHQgICAgICBpZiAoJChcIiNDX0xlYWRfUmF0aW5nX092ZXJyaWRlMVwiKS52YWwoKSAhPT0gX3NfdmkpIHtcblx0XHQgICAgICAgICQoXCIjQ19MZWFkX1JhdGluZ19PdmVycmlkZTFcIikudmFsKF9zX3ZpKTtcblx0XHQgICAgICB9XG5cdFx0fWVsc2V7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCd0cnlpbmcgYWdhaW4gdG8gcmV0cmlldmUgc3ZpJyk7XG5cdFx0XHRzZXRUaW1lb3V0KHJlYWRTVklWYWx1ZSwgNTAwKTtcdC8vdHJ5IGFnYWluXG5cdFx0fVxuXHR9XG5cdFxuXHRzZXRUaW1lb3V0KHJlYWRTVklWYWx1ZSwgNTAwMCk7XHQvL1J1biB0aGUgZnVuY3Rpb24gYWZ0ZXIgNSBzZWNzXG5cblx0Ly9GYWlsc2FmZVxuXHQkKFwiZm9ybS5jdXN0b21lcmZvcm1cIikuc3VibWl0KGZ1bmN0aW9uKClcdHtcblx0XHQvL2NvbnNvbGUubG9nKCdzZXR0aW5nIGJtY01ldGEgc3ZpIHZhbHVlIGFnYWluJyk7XG5cdFx0cmVhZFNWSVZhbHVlKCk7XG5cdH0pO1xuXHRcblxufSk7XHQvLyBkb2N1bWVudCByZWFkeSJdfQ==
