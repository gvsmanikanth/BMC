(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		this.name = this.name.replace(/\W+/g, '');	// strip non-alpha characters http://stackoverflow.com/a/20865026

		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnNlcmlhbGl6ZU9iamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJC5mbi5zZXJpYWxpemVPYmplY3QgPSBmdW5jdGlvbigpIHtcblx0dmFyIG8gPSB7fTtcblx0dmFyIGEgPSB0aGlzLnNlcmlhbGl6ZUFycmF5KCk7XG5cdCQuZWFjaChhLCBmdW5jdGlvbigpIHtcblx0XHR0aGlzLm5hbWUgPSB0aGlzLm5hbWUucmVwbGFjZSgvXFxXKy9nLCAnJyk7XHQvLyBzdHJpcCBub24tYWxwaGEgY2hhcmFjdGVycyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMDg2NTAyNlxuXG5cdFx0aWYgKG9bdGhpcy5uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRpZiAoIW9bdGhpcy5uYW1lXS5wdXNoKSB7XG5cdFx0XHRcdG9bdGhpcy5uYW1lXSA9IFtvW3RoaXMubmFtZV1dO1xuXHRcdFx0fVxuXHRcdFx0b1t0aGlzLm5hbWVdLnB1c2godGhpcy52YWx1ZSB8fCAnJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9bdGhpcy5uYW1lXSA9IHRoaXMudmFsdWUgfHwgJyc7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIG87XG59OyJdfQ==
