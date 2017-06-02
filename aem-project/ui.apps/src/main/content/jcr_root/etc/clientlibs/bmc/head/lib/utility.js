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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9saWIvdXRpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGJyZWFrcG9pbnQoYnJlYWtwb2ludE5hbWUpIHtcblx0dmFyIGJyZWFrcG9pbnRzID0ge1xuXHRcdFwiZXh0cmFTbWFsbFwiOiAzMjAsXG5cdFx0XCJzbWFsbFwiOiA0ODAsXG5cdFx0XCJtZWRpdW1cIjogNzY4LFxuXHRcdFwibGFyZ2VcIjogOTYwLFxuXHRcdFwiZXh0cmFMYXJnZVwiOiAxMjIwXG5cdH07XG5cblx0Ly8gdXNlIHRoZSBNb2Rlcm5penIgZnVuY3Rpb24gaWYgYXZhaWxhYmxlOyBpdCdzIG1vcmUgYWNjdXJhdGVcblx0aWYgKG1lZGlhUXVlcnlTdXBwb3J0KCkpIHtcblx0XHRyZXR1cm4gTW9kZXJuaXpyLm1xKCcobWluLXdpZHRoOiAnICsgYnJlYWtwb2ludHNbYnJlYWtwb2ludE5hbWVdICsgJ3B4KScpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8vIEFjY29yZGluZyB0byBodHRwOi8vcXVpcmtzbW9kZS5vcmcvbW9iaWxlL3RhYmxlVmlld3BvcnQuaHRtbFxuXHRcdC8vIGRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aC9IZWlnaHQgZ2V0cyB1cyB0aGUgbW9zdCByZWxpYWJsZSBpbmZvXG5cdFx0cmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA+IGJyZWFrcG9pbnRzW2JyZWFrcG9pbnROYW1lXTtcblx0fVxufVxuXG5mdW5jdGlvbiBtZWRpYVF1ZXJ5U3VwcG9ydCgpIHtcblx0cmV0dXJuIE1vZGVybml6ci5tcSgnb25seSBhbGwnKTtcbn1cblxuZXhwb3J0cy5icmVha3BvaW50ID0gYnJlYWtwb2ludDsiXX0=
