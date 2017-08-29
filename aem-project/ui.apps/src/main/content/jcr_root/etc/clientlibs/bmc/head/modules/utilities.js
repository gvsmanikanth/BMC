(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function EventDebouncer(type, context) {
	var timer = null;
	var self = this;

	self.type = type;
	self.dEvent = 'd' + type;
	self.context = typeof(context) === 'undefined' ? jQuery(window) : jQuery(context);
	self.resolution = 50;
	self.ns = '.debouncer' + Math.random();

	function sendDebounced () {
		self.context.trigger(self.dEvent);
	}

	function debounce() {
		clearTimeout(timer);
		timer = setTimeout(sendDebounced, self.resolution);
	}

	self.attach = function () {
		self.context.on(self.type + self.ns, debounce);
	};

	self.release = function () {
		self.context.off(self.type + self.ns);
	};
}

function breakpointMedium() {
	if (!window.matchMedia) {
		return (document.body.clientWidth >= 768);
	}
	else {
		// ems are used here rather than px since the compiled CSS calculates breakpoints to ems
		return Modernizr.mq('(min-width: 48em)');
	}
}

function addNthChildClasses() {
	// classes for nth-child elements
	$('.two-up:nth-child(n+2), .three-up:nth-child(n+2), .four-up:nth-child(n+2)').addClass('nth-child-np2');
	$('.two-up:nth-child(2n), .four-up:nth-child(2n)').addClass('nth-child-2n');
	$('.nav-tertiary-col:nth-child(2n+1), .navigation-tertiary-col:nth-child(2n+1)').addClass('nth-child-2np1');
	$('.two-up:nth-child(n+3), .four-up:nth-child(n+3), .nav-tertiary-col:nth-child(n+3), .navigation-tertiary-col:nth-child(n+3)').addClass('nth-child-np3');
	$('.three-up:nth-child(3n)').addClass('nth-child-3n');
	$('.three-up:nth-child(n+4)').addClass('nth-child-np4');
	$('.four-up:nth-child(4n)').addClass('nth-child-4n');
	$('.four-up:nth-child(n+5)').addClass('nth-child-np5');
}

function removeNthChildClasses() {
	$('.two-up, .three-up, .four-up').removeClass('nth-child-np2 nth-child-2n nth-child-np3 nth-child-3n nth-child-np4 nth-child-4n nth-child-np5');
}

function resetNthChildClasses() {
	removeNthChildClasses();
	addNthChildClasses();
}

// Used to add the filter method to the array prototype, specifically for IE8.
function addFilterToArrayProtoype() {
	if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun /*, thisp */)
  {
	"use strict";

	if (this === void 0 || this === null)
		throw new TypeError();

	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof fun !== "function")
		throw new TypeError();

	var res = [];
	var thisp = arguments[1];
	for (var i = 0; i < len; i++) {
		if (i in t) {
			var val = t[i]; // in case fun mutates this
			if (fun.call(thisp, val, i, t))
				res.push(val);
		}
	}

	return res;
  };
	}
}

exports.EventDebouncer = EventDebouncer;
exports.breakpointMedium = breakpointMedium;
exports.addNthChildClasses = addNthChildClasses;
exports.removeNthChildClasses = removeNthChildClasses;
exports.resetNthChildClasses = resetNthChildClasses;
exports.addFilterToArrayProtoype = addFilterToArrayProtoype;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBFdmVudERlYm91bmNlcih0eXBlLCBjb250ZXh0KSB7XHJcblx0dmFyIHRpbWVyID0gbnVsbDtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdHNlbGYudHlwZSA9IHR5cGU7XHJcblx0c2VsZi5kRXZlbnQgPSAnZCcgKyB0eXBlO1xyXG5cdHNlbGYuY29udGV4dCA9IHR5cGVvZihjb250ZXh0KSA9PT0gJ3VuZGVmaW5lZCcgPyBqUXVlcnkod2luZG93KSA6IGpRdWVyeShjb250ZXh0KTtcclxuXHRzZWxmLnJlc29sdXRpb24gPSA1MDtcclxuXHRzZWxmLm5zID0gJy5kZWJvdW5jZXInICsgTWF0aC5yYW5kb20oKTtcclxuXHJcblx0ZnVuY3Rpb24gc2VuZERlYm91bmNlZCAoKSB7XHJcblx0XHRzZWxmLmNvbnRleHQudHJpZ2dlcihzZWxmLmRFdmVudCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkZWJvdW5jZSgpIHtcclxuXHRcdGNsZWFyVGltZW91dCh0aW1lcik7XHJcblx0XHR0aW1lciA9IHNldFRpbWVvdXQoc2VuZERlYm91bmNlZCwgc2VsZi5yZXNvbHV0aW9uKTtcclxuXHR9XHJcblxyXG5cdHNlbGYuYXR0YWNoID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0c2VsZi5jb250ZXh0Lm9uKHNlbGYudHlwZSArIHNlbGYubnMsIGRlYm91bmNlKTtcclxuXHR9O1xyXG5cclxuXHRzZWxmLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRzZWxmLmNvbnRleHQub2ZmKHNlbGYudHlwZSArIHNlbGYubnMpO1xyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJyZWFrcG9pbnRNZWRpdW0oKSB7XHJcblx0aWYgKCF3aW5kb3cubWF0Y2hNZWRpYSkge1xyXG5cdFx0cmV0dXJuIChkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoID49IDc2OCk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0Ly8gZW1zIGFyZSB1c2VkIGhlcmUgcmF0aGVyIHRoYW4gcHggc2luY2UgdGhlIGNvbXBpbGVkIENTUyBjYWxjdWxhdGVzIGJyZWFrcG9pbnRzIHRvIGVtc1xyXG5cdFx0cmV0dXJuIE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogNDhlbSknKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZE50aENoaWxkQ2xhc3NlcygpIHtcclxuXHQvLyBjbGFzc2VzIGZvciBudGgtY2hpbGQgZWxlbWVudHNcclxuXHQkKCcudHdvLXVwOm50aC1jaGlsZChuKzIpLCAudGhyZWUtdXA6bnRoLWNoaWxkKG4rMiksIC5mb3VyLXVwOm50aC1jaGlsZChuKzIpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC1ucDInKTtcclxuXHQkKCcudHdvLXVwOm50aC1jaGlsZCgybiksIC5mb3VyLXVwOm50aC1jaGlsZCgybiknKS5hZGRDbGFzcygnbnRoLWNoaWxkLTJuJyk7XHJcblx0JCgnLm5hdi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKDJuKzEpLCAubmF2aWdhdGlvbi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKDJuKzEpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC0ybnAxJyk7XHJcblx0JCgnLnR3by11cDpudGgtY2hpbGQobiszKSwgLmZvdXItdXA6bnRoLWNoaWxkKG4rMyksIC5uYXYtdGVydGlhcnktY29sOm50aC1jaGlsZChuKzMpLCAubmF2aWdhdGlvbi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKG4rMyknKS5hZGRDbGFzcygnbnRoLWNoaWxkLW5wMycpO1xyXG5cdCQoJy50aHJlZS11cDpudGgtY2hpbGQoM24pJykuYWRkQ2xhc3MoJ250aC1jaGlsZC0zbicpO1xyXG5cdCQoJy50aHJlZS11cDpudGgtY2hpbGQobis0KScpLmFkZENsYXNzKCdudGgtY2hpbGQtbnA0Jyk7XHJcblx0JCgnLmZvdXItdXA6bnRoLWNoaWxkKDRuKScpLmFkZENsYXNzKCdudGgtY2hpbGQtNG4nKTtcclxuXHQkKCcuZm91ci11cDpudGgtY2hpbGQobis1KScpLmFkZENsYXNzKCdudGgtY2hpbGQtbnA1Jyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZU50aENoaWxkQ2xhc3NlcygpIHtcclxuXHQkKCcudHdvLXVwLCAudGhyZWUtdXAsIC5mb3VyLXVwJykucmVtb3ZlQ2xhc3MoJ250aC1jaGlsZC1ucDIgbnRoLWNoaWxkLTJuIG50aC1jaGlsZC1ucDMgbnRoLWNoaWxkLTNuIG50aC1jaGlsZC1ucDQgbnRoLWNoaWxkLTRuIG50aC1jaGlsZC1ucDUnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXROdGhDaGlsZENsYXNzZXMoKSB7XHJcblx0cmVtb3ZlTnRoQ2hpbGRDbGFzc2VzKCk7XHJcblx0YWRkTnRoQ2hpbGRDbGFzc2VzKCk7XHJcbn1cclxuXHJcbi8vIFVzZWQgdG8gYWRkIHRoZSBmaWx0ZXIgbWV0aG9kIHRvIHRoZSBhcnJheSBwcm90b3R5cGUsIHNwZWNpZmljYWxseSBmb3IgSUU4LlxyXG5mdW5jdGlvbiBhZGRGaWx0ZXJUb0FycmF5UHJvdG95cGUoKSB7XHJcblx0aWYgKCFBcnJheS5wcm90b3R5cGUuZmlsdGVyKSB7XHJcbiAgQXJyYXkucHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uKGZ1biAvKiwgdGhpc3AgKi8pXHJcbiAge1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHRpZiAodGhpcyA9PT0gdm9pZCAwIHx8IHRoaXMgPT09IG51bGwpXHJcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcblxyXG5cdHZhciB0ID0gT2JqZWN0KHRoaXMpO1xyXG5cdHZhciBsZW4gPSB0Lmxlbmd0aCA+Pj4gMDtcclxuXHRpZiAodHlwZW9mIGZ1biAhPT0gXCJmdW5jdGlvblwiKVxyXG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG5cclxuXHR2YXIgcmVzID0gW107XHJcblx0dmFyIHRoaXNwID0gYXJndW1lbnRzWzFdO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdGlmIChpIGluIHQpIHtcclxuXHRcdFx0dmFyIHZhbCA9IHRbaV07IC8vIGluIGNhc2UgZnVuIG11dGF0ZXMgdGhpc1xyXG5cdFx0XHRpZiAoZnVuLmNhbGwodGhpc3AsIHZhbCwgaSwgdCkpXHJcblx0XHRcdFx0cmVzLnB1c2godmFsKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiByZXM7XHJcbiAgfTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydHMuRXZlbnREZWJvdW5jZXIgPSBFdmVudERlYm91bmNlcjtcclxuZXhwb3J0cy5icmVha3BvaW50TWVkaXVtID0gYnJlYWtwb2ludE1lZGl1bTtcclxuZXhwb3J0cy5hZGROdGhDaGlsZENsYXNzZXMgPSBhZGROdGhDaGlsZENsYXNzZXM7XHJcbmV4cG9ydHMucmVtb3ZlTnRoQ2hpbGRDbGFzc2VzID0gcmVtb3ZlTnRoQ2hpbGRDbGFzc2VzO1xyXG5leHBvcnRzLnJlc2V0TnRoQ2hpbGRDbGFzc2VzID0gcmVzZXROdGhDaGlsZENsYXNzZXM7XHJcbmV4cG9ydHMuYWRkRmlsdGVyVG9BcnJheVByb3RveXBlID0gYWRkRmlsdGVyVG9BcnJheVByb3RveXBlO1xyXG4iXX0=
