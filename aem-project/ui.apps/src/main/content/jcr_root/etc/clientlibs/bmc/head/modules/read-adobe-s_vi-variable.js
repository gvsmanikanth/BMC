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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3JlYWQtYWRvYmUtc192aS12YXJpYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRmdW5jdGlvbiByZWFkU1ZJVmFsdWUoKVx0e1xyXG5cdFx0dmFyIF9zX3ZpID0gXCJcIjtcclxuXHRcdGlmICh0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5oYXNPd25Qcm9wZXJ0eShcInVzZXJcIikpIHtcclxuXHRcdFx0X3NfdmkgPSBibWNNZXRhLnVzZXIuc1ZpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZihfc192aSAhPT0gXCJcIil7XHJcblx0XHRcdC8vY29uc29sZS5sb2coJ3ZhbHVlIGFkZGVkIHRvIGZvcm0gZmllbGQnKTtcclxuXHRcdCAgICAgIGlmICgkKFwiI0NfTGVhZF9SYXRpbmdfT3ZlcnJpZGUxXCIpLnZhbCgpICE9PSBfc192aSkge1xyXG5cdFx0ICAgICAgICAkKFwiI0NfTGVhZF9SYXRpbmdfT3ZlcnJpZGUxXCIpLnZhbChfc192aSk7XHJcblx0XHQgICAgICB9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZygndHJ5aW5nIGFnYWluIHRvIHJldHJpZXZlIHN2aScpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KHJlYWRTVklWYWx1ZSwgNTAwKTtcdC8vdHJ5IGFnYWluXHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHNldFRpbWVvdXQocmVhZFNWSVZhbHVlLCA1MDAwKTtcdC8vUnVuIHRoZSBmdW5jdGlvbiBhZnRlciA1IHNlY3NcclxuXHJcblx0Ly9GYWlsc2FmZVxyXG5cdCQoXCJmb3JtLmN1c3RvbWVyZm9ybVwiKS5zdWJtaXQoZnVuY3Rpb24oKVx0e1xyXG5cdFx0Ly9jb25zb2xlLmxvZygnc2V0dGluZyBibWNNZXRhIHN2aSB2YWx1ZSBhZ2FpbicpO1xyXG5cdFx0cmVhZFNWSVZhbHVlKCk7XHJcblx0fSk7XHJcblx0XHJcblxyXG59KTtcdC8vIGRvY3VtZW50IHJlYWR5Il19
