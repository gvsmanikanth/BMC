(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var generateMenuAdapter = (function() {

	var adapterAPI = {

		label: '',
		menu: null,
		interface: 'touch', // assume a touch interface by default, mobile-first
		handlers: [],

		setupHandlers: function() {
			var adapter = this;
			$.each(this.handlers, function(i, handler){
				handler.setup(adapter);
			});
		},
		destroyHandlers: function() {
			var adapter = this;
			$.each(this.handlers, function(i, handler){
				handler.destroy(adapter);
			});
		},

		teardown: function(adapter) {},
		init: function(adapter) {}
	};

	return function(menu, options) {

		var adapter = $.extend({}, adapterAPI, options, {

			menu: menu,

			init: function(interface) {

				menu.init();

				this.interface = interface;
				this.setupHandlers();

				// finish with executing the options passed in
				if (typeof options.init === 'function') {
					options.init(this);
				}
			},

			teardown: function() {

				this.destroyHandlers();

				if (typeof options.teardown === 'function') {
					options.teardown(this);
				}
			}
		});

		return adapter;

	};

})();

exports.generateMenuAdapter = generateMenuAdapter;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21lbnUtYWRhcHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZ2VuZXJhdGVNZW51QWRhcHRlciA9IChmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIGFkYXB0ZXJBUEkgPSB7XHJcblxyXG5cdFx0bGFiZWw6ICcnLFxyXG5cdFx0bWVudTogbnVsbCxcclxuXHRcdGludGVyZmFjZTogJ3RvdWNoJywgLy8gYXNzdW1lIGEgdG91Y2ggaW50ZXJmYWNlIGJ5IGRlZmF1bHQsIG1vYmlsZS1maXJzdFxyXG5cdFx0aGFuZGxlcnM6IFtdLFxyXG5cclxuXHRcdHNldHVwSGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgYWRhcHRlciA9IHRoaXM7XHJcblx0XHRcdCQuZWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbihpLCBoYW5kbGVyKXtcclxuXHRcdFx0XHRoYW5kbGVyLnNldHVwKGFkYXB0ZXIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRkZXN0cm95SGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgYWRhcHRlciA9IHRoaXM7XHJcblx0XHRcdCQuZWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbihpLCBoYW5kbGVyKXtcclxuXHRcdFx0XHRoYW5kbGVyLmRlc3Ryb3koYWRhcHRlcik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHR0ZWFyZG93bjogZnVuY3Rpb24oYWRhcHRlcikge30sXHJcblx0XHRpbml0OiBmdW5jdGlvbihhZGFwdGVyKSB7fVxyXG5cdH07XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbihtZW51LCBvcHRpb25zKSB7XHJcblxyXG5cdFx0dmFyIGFkYXB0ZXIgPSAkLmV4dGVuZCh7fSwgYWRhcHRlckFQSSwgb3B0aW9ucywge1xyXG5cclxuXHRcdFx0bWVudTogbWVudSxcclxuXHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uKGludGVyZmFjZSkge1xyXG5cclxuXHRcdFx0XHRtZW51LmluaXQoKTtcclxuXHJcblx0XHRcdFx0dGhpcy5pbnRlcmZhY2UgPSBpbnRlcmZhY2U7XHJcblx0XHRcdFx0dGhpcy5zZXR1cEhhbmRsZXJzKCk7XHJcblxyXG5cdFx0XHRcdC8vIGZpbmlzaCB3aXRoIGV4ZWN1dGluZyB0aGUgb3B0aW9ucyBwYXNzZWQgaW5cclxuXHRcdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMuaW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0b3B0aW9ucy5pbml0KHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0dGhpcy5kZXN0cm95SGFuZGxlcnMoKTtcclxuXHJcblx0XHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLnRlYXJkb3duID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRvcHRpb25zLnRlYXJkb3duKHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGFkYXB0ZXI7XHJcblxyXG5cdH07XHJcblxyXG59KSgpO1xyXG5cclxuZXhwb3J0cy5nZW5lcmF0ZU1lbnVBZGFwdGVyID0gZ2VuZXJhdGVNZW51QWRhcHRlcjtcclxuIl19
