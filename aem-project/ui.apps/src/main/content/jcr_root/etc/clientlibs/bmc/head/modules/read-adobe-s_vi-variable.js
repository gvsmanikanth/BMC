(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(document).ready(function () {

	function readSVIValue()	{
		if (typeof bmcMeta !== 'undefined') {
			if (bmcMeta.hasOwnProperty("user")) {
				_s_vi = bmcMeta.user.sVi;
			}
		}
		if(typeof _s_vi !== "undefined")
			$("#C_Lead_Rating_Override1").val(_s_vi);
	}

	setTimeout(readSVIValue, 3000);	//Run the function after 3 secs

	//Failsafe
	$("button[type='submit']").on("click", function()	{
		readSVIValue();
	});

});	// document ready
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3JlYWQtYWRvYmUtc192aS12YXJpYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXG5cdGZ1bmN0aW9uIHJlYWRTVklWYWx1ZSgpXHR7XG5cdFx0aWYgKHR5cGVvZiBibWNNZXRhICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0aWYgKGJtY01ldGEuaGFzT3duUHJvcGVydHkoXCJ1c2VyXCIpKSB7XG5cdFx0XHRcdF9zX3ZpID0gYm1jTWV0YS51c2VyLnNWaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYodHlwZW9mIF9zX3ZpICE9PSBcInVuZGVmaW5lZFwiKVxuXHRcdFx0JChcIiNDX0xlYWRfUmF0aW5nX092ZXJyaWRlMVwiKS52YWwoX3NfdmkpO1xuXHR9XG5cblx0c2V0VGltZW91dChyZWFkU1ZJVmFsdWUsIDMwMDApO1x0Ly9SdW4gdGhlIGZ1bmN0aW9uIGFmdGVyIDMgc2Vjc1xuXG5cdC8vRmFpbHNhZmVcblx0JChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKClcdHtcblx0XHRyZWFkU1ZJVmFsdWUoKTtcblx0fSk7XG5cbn0pO1x0Ly8gZG9jdW1lbnQgcmVhZHkiXX0=
