(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function breakpoint(breakpointName) {
	var breakpoints = {
		"extraSmall": 320,
		"small": 480,
		"medium": 768,
		"large": 960,
		"extraLarge": 1220
	};

	// use the Modernizr function if available; it's more accurate
	if (mediaQuerySupport()) {
		return Modernizr.mq('(min-width: ' + breakpoints[breakpointName] + 'px)');
	}
	else {
		// According to http://quirksmode.org/mobile/tableViewport.html
		// documentElement.clientWidth/Height gets us the most reliable info
		return document.documentElement.clientWidth > breakpoints[breakpointName];
	}
}

function mediaQuerySupport() {
	return Modernizr.mq('only all');
}

exports.breakpoint = breakpoint;
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9saWIvdXRpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGJyZWFrcG9pbnQoYnJlYWtwb2ludE5hbWUpIHtcclxuXHR2YXIgYnJlYWtwb2ludHMgPSB7XHJcblx0XHRcImV4dHJhU21hbGxcIjogMzIwLFxyXG5cdFx0XCJzbWFsbFwiOiA0ODAsXHJcblx0XHRcIm1lZGl1bVwiOiA3NjgsXHJcblx0XHRcImxhcmdlXCI6IDk2MCxcclxuXHRcdFwiZXh0cmFMYXJnZVwiOiAxMjIwXHJcblx0fTtcclxuXHJcblx0Ly8gdXNlIHRoZSBNb2Rlcm5penIgZnVuY3Rpb24gaWYgYXZhaWxhYmxlOyBpdCdzIG1vcmUgYWNjdXJhdGVcclxuXHRpZiAobWVkaWFRdWVyeVN1cHBvcnQoKSkge1xyXG5cdFx0cmV0dXJuIE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogJyArIGJyZWFrcG9pbnRzW2JyZWFrcG9pbnROYW1lXSArICdweCknKTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHQvLyBBY2NvcmRpbmcgdG8gaHR0cDovL3F1aXJrc21vZGUub3JnL21vYmlsZS90YWJsZVZpZXdwb3J0Lmh0bWxcclxuXHRcdC8vIGRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aC9IZWlnaHQgZ2V0cyB1cyB0aGUgbW9zdCByZWxpYWJsZSBpbmZvXHJcblx0XHRyZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoID4gYnJlYWtwb2ludHNbYnJlYWtwb2ludE5hbWVdO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWVkaWFRdWVyeVN1cHBvcnQoKSB7XHJcblx0cmV0dXJuIE1vZGVybml6ci5tcSgnb25seSBhbGwnKTtcclxufVxyXG5cclxuZXhwb3J0cy5icmVha3BvaW50ID0gYnJlYWtwb2ludDsiXX0=
