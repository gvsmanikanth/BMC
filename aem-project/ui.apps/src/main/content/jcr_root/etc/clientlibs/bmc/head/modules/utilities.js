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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBFdmVudERlYm91bmNlcih0eXBlLCBjb250ZXh0KSB7XG5cdHZhciB0aW1lciA9IG51bGw7XG5cdHZhciBzZWxmID0gdGhpcztcblxuXHRzZWxmLnR5cGUgPSB0eXBlO1xuXHRzZWxmLmRFdmVudCA9ICdkJyArIHR5cGU7XG5cdHNlbGYuY29udGV4dCA9IHR5cGVvZihjb250ZXh0KSA9PT0gJ3VuZGVmaW5lZCcgPyBqUXVlcnkod2luZG93KSA6IGpRdWVyeShjb250ZXh0KTtcblx0c2VsZi5yZXNvbHV0aW9uID0gNTA7XG5cdHNlbGYubnMgPSAnLmRlYm91bmNlcicgKyBNYXRoLnJhbmRvbSgpO1xuXG5cdGZ1bmN0aW9uIHNlbmREZWJvdW5jZWQgKCkge1xuXHRcdHNlbGYuY29udGV4dC50cmlnZ2VyKHNlbGYuZEV2ZW50KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRlYm91bmNlKCkge1xuXHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0dGltZXIgPSBzZXRUaW1lb3V0KHNlbmREZWJvdW5jZWQsIHNlbGYucmVzb2x1dGlvbik7XG5cdH1cblxuXHRzZWxmLmF0dGFjaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRzZWxmLmNvbnRleHQub24oc2VsZi50eXBlICsgc2VsZi5ucywgZGVib3VuY2UpO1xuXHR9O1xuXG5cdHNlbGYucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRzZWxmLmNvbnRleHQub2ZmKHNlbGYudHlwZSArIHNlbGYubnMpO1xuXHR9O1xufVxuXG5mdW5jdGlvbiBicmVha3BvaW50TWVkaXVtKCkge1xuXHRpZiAoIXdpbmRvdy5tYXRjaE1lZGlhKSB7XG5cdFx0cmV0dXJuIChkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoID49IDc2OCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gZW1zIGFyZSB1c2VkIGhlcmUgcmF0aGVyIHRoYW4gcHggc2luY2UgdGhlIGNvbXBpbGVkIENTUyBjYWxjdWxhdGVzIGJyZWFrcG9pbnRzIHRvIGVtc1xuXHRcdHJldHVybiBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6IDQ4ZW0pJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkTnRoQ2hpbGRDbGFzc2VzKCkge1xuXHQvLyBjbGFzc2VzIGZvciBudGgtY2hpbGQgZWxlbWVudHNcblx0JCgnLnR3by11cDpudGgtY2hpbGQobisyKSwgLnRocmVlLXVwOm50aC1jaGlsZChuKzIpLCAuZm91ci11cDpudGgtY2hpbGQobisyKScpLmFkZENsYXNzKCdudGgtY2hpbGQtbnAyJyk7XG5cdCQoJy50d28tdXA6bnRoLWNoaWxkKDJuKSwgLmZvdXItdXA6bnRoLWNoaWxkKDJuKScpLmFkZENsYXNzKCdudGgtY2hpbGQtMm4nKTtcblx0JCgnLm5hdi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKDJuKzEpLCAubmF2aWdhdGlvbi10ZXJ0aWFyeS1jb2w6bnRoLWNoaWxkKDJuKzEpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC0ybnAxJyk7XG5cdCQoJy50d28tdXA6bnRoLWNoaWxkKG4rMyksIC5mb3VyLXVwOm50aC1jaGlsZChuKzMpLCAubmF2LXRlcnRpYXJ5LWNvbDpudGgtY2hpbGQobiszKSwgLm5hdmlnYXRpb24tdGVydGlhcnktY29sOm50aC1jaGlsZChuKzMpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC1ucDMnKTtcblx0JCgnLnRocmVlLXVwOm50aC1jaGlsZCgzbiknKS5hZGRDbGFzcygnbnRoLWNoaWxkLTNuJyk7XG5cdCQoJy50aHJlZS11cDpudGgtY2hpbGQobis0KScpLmFkZENsYXNzKCdudGgtY2hpbGQtbnA0Jyk7XG5cdCQoJy5mb3VyLXVwOm50aC1jaGlsZCg0biknKS5hZGRDbGFzcygnbnRoLWNoaWxkLTRuJyk7XG5cdCQoJy5mb3VyLXVwOm50aC1jaGlsZChuKzUpJykuYWRkQ2xhc3MoJ250aC1jaGlsZC1ucDUnKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTnRoQ2hpbGRDbGFzc2VzKCkge1xuXHQkKCcudHdvLXVwLCAudGhyZWUtdXAsIC5mb3VyLXVwJykucmVtb3ZlQ2xhc3MoJ250aC1jaGlsZC1ucDIgbnRoLWNoaWxkLTJuIG50aC1jaGlsZC1ucDMgbnRoLWNoaWxkLTNuIG50aC1jaGlsZC1ucDQgbnRoLWNoaWxkLTRuIG50aC1jaGlsZC1ucDUnKTtcbn1cblxuZnVuY3Rpb24gcmVzZXROdGhDaGlsZENsYXNzZXMoKSB7XG5cdHJlbW92ZU50aENoaWxkQ2xhc3NlcygpO1xuXHRhZGROdGhDaGlsZENsYXNzZXMoKTtcbn1cblxuLy8gVXNlZCB0byBhZGQgdGhlIGZpbHRlciBtZXRob2QgdG8gdGhlIGFycmF5IHByb3RvdHlwZSwgc3BlY2lmaWNhbGx5IGZvciBJRTguXG5mdW5jdGlvbiBhZGRGaWx0ZXJUb0FycmF5UHJvdG95cGUoKSB7XG5cdGlmICghQXJyYXkucHJvdG90eXBlLmZpbHRlcikge1xuICBBcnJheS5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24oZnVuIC8qLCB0aGlzcCAqLylcbiAge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZiAodGhpcyA9PT0gdm9pZCAwIHx8IHRoaXMgPT09IG51bGwpXG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuXG5cdHZhciB0ID0gT2JqZWN0KHRoaXMpO1xuXHR2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XG5cdGlmICh0eXBlb2YgZnVuICE9PSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuXG5cdHZhciByZXMgPSBbXTtcblx0dmFyIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0aWYgKGkgaW4gdCkge1xuXHRcdFx0dmFyIHZhbCA9IHRbaV07IC8vIGluIGNhc2UgZnVuIG11dGF0ZXMgdGhpc1xuXHRcdFx0aWYgKGZ1bi5jYWxsKHRoaXNwLCB2YWwsIGksIHQpKVxuXHRcdFx0XHRyZXMucHVzaCh2YWwpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZXM7XG4gIH07XG5cdH1cbn1cblxuZXhwb3J0cy5FdmVudERlYm91bmNlciA9IEV2ZW50RGVib3VuY2VyO1xuZXhwb3J0cy5icmVha3BvaW50TWVkaXVtID0gYnJlYWtwb2ludE1lZGl1bTtcbmV4cG9ydHMuYWRkTnRoQ2hpbGRDbGFzc2VzID0gYWRkTnRoQ2hpbGRDbGFzc2VzO1xuZXhwb3J0cy5yZW1vdmVOdGhDaGlsZENsYXNzZXMgPSByZW1vdmVOdGhDaGlsZENsYXNzZXM7XG5leHBvcnRzLnJlc2V0TnRoQ2hpbGRDbGFzc2VzID0gcmVzZXROdGhDaGlsZENsYXNzZXM7XG5leHBvcnRzLmFkZEZpbHRlclRvQXJyYXlQcm90b3lwZSA9IGFkZEZpbHRlclRvQXJyYXlQcm90b3lwZTtcbiJdfQ==
