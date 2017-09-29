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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL21lbnUtYWRhcHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZ2VuZXJhdGVNZW51QWRhcHRlciA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgYWRhcHRlckFQSSA9IHtcblxuXHRcdGxhYmVsOiAnJyxcblx0XHRtZW51OiBudWxsLFxuXHRcdGludGVyZmFjZTogJ3RvdWNoJywgLy8gYXNzdW1lIGEgdG91Y2ggaW50ZXJmYWNlIGJ5IGRlZmF1bHQsIG1vYmlsZS1maXJzdFxuXHRcdGhhbmRsZXJzOiBbXSxcblxuXHRcdHNldHVwSGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFkYXB0ZXIgPSB0aGlzO1xuXHRcdFx0JC5lYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uKGksIGhhbmRsZXIpe1xuXHRcdFx0XHRoYW5kbGVyLnNldHVwKGFkYXB0ZXIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRkZXN0cm95SGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFkYXB0ZXIgPSB0aGlzO1xuXHRcdFx0JC5lYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uKGksIGhhbmRsZXIpe1xuXHRcdFx0XHRoYW5kbGVyLmRlc3Ryb3koYWRhcHRlcik7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0dGVhcmRvd246IGZ1bmN0aW9uKGFkYXB0ZXIpIHt9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKGFkYXB0ZXIpIHt9XG5cdH07XG5cblx0cmV0dXJuIGZ1bmN0aW9uKG1lbnUsIG9wdGlvbnMpIHtcblxuXHRcdHZhciBhZGFwdGVyID0gJC5leHRlbmQoe30sIGFkYXB0ZXJBUEksIG9wdGlvbnMsIHtcblxuXHRcdFx0bWVudTogbWVudSxcblxuXHRcdFx0aW5pdDogZnVuY3Rpb24oaW50ZXJmYWNlKSB7XG5cblx0XHRcdFx0bWVudS5pbml0KCk7XG5cblx0XHRcdFx0dGhpcy5pbnRlcmZhY2UgPSBpbnRlcmZhY2U7XG5cdFx0XHRcdHRoaXMuc2V0dXBIYW5kbGVycygpO1xuXG5cdFx0XHRcdC8vIGZpbmlzaCB3aXRoIGV4ZWN1dGluZyB0aGUgb3B0aW9ucyBwYXNzZWQgaW5cblx0XHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLmluaXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRvcHRpb25zLmluaXQodGhpcyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHR0aGlzLmRlc3Ryb3lIYW5kbGVycygpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucy50ZWFyZG93biA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdG9wdGlvbnMudGVhcmRvd24odGhpcyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBhZGFwdGVyO1xuXG5cdH07XG5cbn0pKCk7XG5cbmV4cG9ydHMuZ2VuZXJhdGVNZW51QWRhcHRlciA9IGdlbmVyYXRlTWVudUFkYXB0ZXI7XG4iXX0=
