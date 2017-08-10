(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
generateMenuAdapterManager = function() {

  var conditions = [];
  var interface = $('html').hasClass('touch') ? 'touch' : 'no-touch'; // assuming modernizr
  var activeAdapter = null;

  var methods = {

	addCondition: function(condition, adapter) {
		condition.adapter = adapter;
		conditions.push(condition);
	},

	applyConditions: function() {

	  $.each(conditions, function(i, condition){

		if (condition()) {

			var adapter = condition.adapter;

			// check if matching adapter is already active
			if (adapter && adapter === activeAdapter) {
				return false;
			}

			// teardown existing
			if (activeAdapter) {
				methods.teardownActive();
			}

			// set new active adapter
			activeAdapter = adapter;

			// get menu for setup on adapter
			var menu = adapter.menuElement;

			// boot up adapter with interface
			adapter.init(interface);

			return false;
		}
	  });
	},

	teardownActive: function() {
		activeAdapter.teardown();
	},

	init: function() {
		this.applyConditions();
	}
  }

  $(window).on('resize', methods.applyConditions);

  return methods;
}
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21lbnUtYWRhcHRlci1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZ2VuZXJhdGVNZW51QWRhcHRlck1hbmFnZXIgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgdmFyIGNvbmRpdGlvbnMgPSBbXTtcclxuICB2YXIgaW50ZXJmYWNlID0gJCgnaHRtbCcpLmhhc0NsYXNzKCd0b3VjaCcpID8gJ3RvdWNoJyA6ICduby10b3VjaCc7IC8vIGFzc3VtaW5nIG1vZGVybml6clxyXG4gIHZhciBhY3RpdmVBZGFwdGVyID0gbnVsbDtcclxuXHJcbiAgdmFyIG1ldGhvZHMgPSB7XHJcblxyXG5cdGFkZENvbmRpdGlvbjogZnVuY3Rpb24oY29uZGl0aW9uLCBhZGFwdGVyKSB7XHJcblx0XHRjb25kaXRpb24uYWRhcHRlciA9IGFkYXB0ZXI7XHJcblx0XHRjb25kaXRpb25zLnB1c2goY29uZGl0aW9uKTtcclxuXHR9LFxyXG5cclxuXHRhcHBseUNvbmRpdGlvbnM6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHQgICQuZWFjaChjb25kaXRpb25zLCBmdW5jdGlvbihpLCBjb25kaXRpb24pe1xyXG5cclxuXHRcdGlmIChjb25kaXRpb24oKSkge1xyXG5cclxuXHRcdFx0dmFyIGFkYXB0ZXIgPSBjb25kaXRpb24uYWRhcHRlcjtcclxuXHJcblx0XHRcdC8vIGNoZWNrIGlmIG1hdGNoaW5nIGFkYXB0ZXIgaXMgYWxyZWFkeSBhY3RpdmVcclxuXHRcdFx0aWYgKGFkYXB0ZXIgJiYgYWRhcHRlciA9PT0gYWN0aXZlQWRhcHRlcikge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gdGVhcmRvd24gZXhpc3RpbmdcclxuXHRcdFx0aWYgKGFjdGl2ZUFkYXB0ZXIpIHtcclxuXHRcdFx0XHRtZXRob2RzLnRlYXJkb3duQWN0aXZlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHNldCBuZXcgYWN0aXZlIGFkYXB0ZXJcclxuXHRcdFx0YWN0aXZlQWRhcHRlciA9IGFkYXB0ZXI7XHJcblxyXG5cdFx0XHQvLyBnZXQgbWVudSBmb3Igc2V0dXAgb24gYWRhcHRlclxyXG5cdFx0XHR2YXIgbWVudSA9IGFkYXB0ZXIubWVudUVsZW1lbnQ7XHJcblxyXG5cdFx0XHQvLyBib290IHVwIGFkYXB0ZXIgd2l0aCBpbnRlcmZhY2VcclxuXHRcdFx0YWRhcHRlci5pbml0KGludGVyZmFjZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0ICB9KTtcclxuXHR9LFxyXG5cclxuXHR0ZWFyZG93bkFjdGl2ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRhY3RpdmVBZGFwdGVyLnRlYXJkb3duKCk7XHJcblx0fSxcclxuXHJcblx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmFwcGx5Q29uZGl0aW9ucygpO1xyXG5cdH1cclxuICB9XHJcblxyXG4gICQod2luZG93KS5vbigncmVzaXplJywgbWV0aG9kcy5hcHBseUNvbmRpdGlvbnMpO1xyXG5cclxuICByZXR1cm4gbWV0aG9kcztcclxufSJdfQ==
