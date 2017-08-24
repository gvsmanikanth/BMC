(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function($){

	var StoryLandingFilters = {
		init: function() {

			var activeSelect = null;
			var options = {
				filterElementSelector: '.js-customer-story-filter-element',
				getElementFilterValues: function(elements) {
					var elementFilterValues = [];
					$(elements).each(function(i, el){
						var values;
						if (values = $(el).data('filter-values')) {
							if (typeof values === 'string') {
								$.each(values.split(','), function(i, value){
									elementFilterValues.push($.trim(value));
								});
							}
						}
					});
					return elementFilterValues;
				},
				filterValueEventSetup: function(handler) {
					$('.js-customer-story-filter-select').change(function(e) {
						activeSelect = $(this);
						handler(e);
					});
				},
				filterValueDataSetup: function(filterDataArray) {

					if (activeSelect) {
						filterDataArray.push($(activeSelect).val());
						$('.js-customer-story-filter-select').not(activeSelect).each(function( i, toDisable ){
							$(toDisable).prop('selectedIndex', 0);
						});
					}
				}
			};

			siftGenerator(options);
		}
	}

	/**
	 * StoryCaseHeaderPoints
	 * On Customer Story Case - main points in header
	 * get shifted outside of header to maintain background proportion somewhat.
	 * The main points, ie: 'Faster, Smoother, 50% fewer calls' ends up making the
	 * container too 'tall'
	 */
	var StoryCaseHeaderPoints = {
		init: function() {
			$('.js-initial-customer-story-case-points-container').appendAround();
		}
	}

	var init = function() {
		StoryLandingFilters.init();
		StoryCaseHeaderPoints.init();
	};

	$(init);

}(jQuery));
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2N1c3RvbWVyLXN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyhmdW5jdGlvbigkKXtcblxuXHR2YXIgU3RvcnlMYW5kaW5nRmlsdGVycyA9IHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIGFjdGl2ZVNlbGVjdCA9IG51bGw7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0ZmlsdGVyRWxlbWVudFNlbGVjdG9yOiAnLmpzLWN1c3RvbWVyLXN0b3J5LWZpbHRlci1lbGVtZW50Jyxcblx0XHRcdFx0Z2V0RWxlbWVudEZpbHRlclZhbHVlczogZnVuY3Rpb24oZWxlbWVudHMpIHtcblx0XHRcdFx0XHR2YXIgZWxlbWVudEZpbHRlclZhbHVlcyA9IFtdO1xuXHRcdFx0XHRcdCQoZWxlbWVudHMpLmVhY2goZnVuY3Rpb24oaSwgZWwpe1xuXHRcdFx0XHRcdFx0dmFyIHZhbHVlcztcblx0XHRcdFx0XHRcdGlmICh2YWx1ZXMgPSAkKGVsKS5kYXRhKCdmaWx0ZXItdmFsdWVzJykpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZXMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRcdFx0JC5lYWNoKHZhbHVlcy5zcGxpdCgnLCcpLCBmdW5jdGlvbihpLCB2YWx1ZSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtZW50RmlsdGVyVmFsdWVzLnB1c2goJC50cmltKHZhbHVlKSk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudEZpbHRlclZhbHVlcztcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyVmFsdWVFdmVudFNldHVwOiBmdW5jdGlvbihoYW5kbGVyKSB7XG5cdFx0XHRcdFx0JCgnLmpzLWN1c3RvbWVyLXN0b3J5LWZpbHRlci1zZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdFx0YWN0aXZlU2VsZWN0ID0gJCh0aGlzKTtcblx0XHRcdFx0XHRcdGhhbmRsZXIoZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZpbHRlclZhbHVlRGF0YVNldHVwOiBmdW5jdGlvbihmaWx0ZXJEYXRhQXJyYXkpIHtcblxuXHRcdFx0XHRcdGlmIChhY3RpdmVTZWxlY3QpIHtcblx0XHRcdFx0XHRcdGZpbHRlckRhdGFBcnJheS5wdXNoKCQoYWN0aXZlU2VsZWN0KS52YWwoKSk7XG5cdFx0XHRcdFx0XHQkKCcuanMtY3VzdG9tZXItc3RvcnktZmlsdGVyLXNlbGVjdCcpLm5vdChhY3RpdmVTZWxlY3QpLmVhY2goZnVuY3Rpb24oIGksIHRvRGlzYWJsZSApe1xuXHRcdFx0XHRcdFx0XHQkKHRvRGlzYWJsZSkucHJvcCgnc2VsZWN0ZWRJbmRleCcsIDApO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRzaWZ0R2VuZXJhdG9yKG9wdGlvbnMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTdG9yeUNhc2VIZWFkZXJQb2ludHNcblx0ICogT24gQ3VzdG9tZXIgU3RvcnkgQ2FzZSAtIG1haW4gcG9pbnRzIGluIGhlYWRlclxuXHQgKiBnZXQgc2hpZnRlZCBvdXRzaWRlIG9mIGhlYWRlciB0byBtYWludGFpbiBiYWNrZ3JvdW5kIHByb3BvcnRpb24gc29tZXdoYXQuXG5cdCAqIFRoZSBtYWluIHBvaW50cywgaWU6ICdGYXN0ZXIsIFNtb290aGVyLCA1MCUgZmV3ZXIgY2FsbHMnIGVuZHMgdXAgbWFraW5nIHRoZVxuXHQgKiBjb250YWluZXIgdG9vICd0YWxsJ1xuXHQgKi9cblx0dmFyIFN0b3J5Q2FzZUhlYWRlclBvaW50cyA9IHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdCQoJy5qcy1pbml0aWFsLWN1c3RvbWVyLXN0b3J5LWNhc2UtcG9pbnRzLWNvbnRhaW5lcicpLmFwcGVuZEFyb3VuZCgpO1xuXHRcdH1cblx0fVxuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0U3RvcnlMYW5kaW5nRmlsdGVycy5pbml0KCk7XG5cdFx0U3RvcnlDYXNlSGVhZGVyUG9pbnRzLmluaXQoKTtcblx0fTtcblxuXHQkKGluaXQpO1xuXG59KGpRdWVyeSkpOyJdfQ==
