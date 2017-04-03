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
