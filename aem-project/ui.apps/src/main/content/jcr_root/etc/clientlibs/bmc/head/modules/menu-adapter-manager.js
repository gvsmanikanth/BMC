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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21lbnUtYWRhcHRlci1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZ2VuZXJhdGVNZW51QWRhcHRlck1hbmFnZXIgPSBmdW5jdGlvbigpIHtcblxuICB2YXIgY29uZGl0aW9ucyA9IFtdO1xuICB2YXIgaW50ZXJmYWNlID0gJCgnaHRtbCcpLmhhc0NsYXNzKCd0b3VjaCcpID8gJ3RvdWNoJyA6ICduby10b3VjaCc7IC8vIGFzc3VtaW5nIG1vZGVybml6clxuICB2YXIgYWN0aXZlQWRhcHRlciA9IG51bGw7XG5cbiAgdmFyIG1ldGhvZHMgPSB7XG5cblx0YWRkQ29uZGl0aW9uOiBmdW5jdGlvbihjb25kaXRpb24sIGFkYXB0ZXIpIHtcblx0XHRjb25kaXRpb24uYWRhcHRlciA9IGFkYXB0ZXI7XG5cdFx0Y29uZGl0aW9ucy5wdXNoKGNvbmRpdGlvbik7XG5cdH0sXG5cblx0YXBwbHlDb25kaXRpb25zOiBmdW5jdGlvbigpIHtcblxuXHQgICQuZWFjaChjb25kaXRpb25zLCBmdW5jdGlvbihpLCBjb25kaXRpb24pe1xuXG5cdFx0aWYgKGNvbmRpdGlvbigpKSB7XG5cblx0XHRcdHZhciBhZGFwdGVyID0gY29uZGl0aW9uLmFkYXB0ZXI7XG5cblx0XHRcdC8vIGNoZWNrIGlmIG1hdGNoaW5nIGFkYXB0ZXIgaXMgYWxyZWFkeSBhY3RpdmVcblx0XHRcdGlmIChhZGFwdGVyICYmIGFkYXB0ZXIgPT09IGFjdGl2ZUFkYXB0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB0ZWFyZG93biBleGlzdGluZ1xuXHRcdFx0aWYgKGFjdGl2ZUFkYXB0ZXIpIHtcblx0XHRcdFx0bWV0aG9kcy50ZWFyZG93bkFjdGl2ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBzZXQgbmV3IGFjdGl2ZSBhZGFwdGVyXG5cdFx0XHRhY3RpdmVBZGFwdGVyID0gYWRhcHRlcjtcblxuXHRcdFx0Ly8gZ2V0IG1lbnUgZm9yIHNldHVwIG9uIGFkYXB0ZXJcblx0XHRcdHZhciBtZW51ID0gYWRhcHRlci5tZW51RWxlbWVudDtcblxuXHRcdFx0Ly8gYm9vdCB1cCBhZGFwdGVyIHdpdGggaW50ZXJmYWNlXG5cdFx0XHRhZGFwdGVyLmluaXQoaW50ZXJmYWNlKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0ICB9KTtcblx0fSxcblxuXHR0ZWFyZG93bkFjdGl2ZTogZnVuY3Rpb24oKSB7XG5cdFx0YWN0aXZlQWRhcHRlci50ZWFyZG93bigpO1xuXHR9LFxuXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuYXBwbHlDb25kaXRpb25zKCk7XG5cdH1cbiAgfVxuXG4gICQod2luZG93KS5vbigncmVzaXplJywgbWV0aG9kcy5hcHBseUNvbmRpdGlvbnMpO1xuXG4gIHJldHVybiBtZXRob2RzO1xufSJdfQ==
