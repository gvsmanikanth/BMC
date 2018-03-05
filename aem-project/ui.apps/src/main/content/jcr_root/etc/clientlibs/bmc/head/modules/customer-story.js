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
								$.each(values.split(';'), function(i, value){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2N1c3RvbWVyLXN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KGZ1bmN0aW9uKCQpe1xuXG5cdHZhciBTdG9yeUxhbmRpbmdGaWx0ZXJzID0ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHR2YXIgYWN0aXZlU2VsZWN0ID0gbnVsbDtcblx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRmaWx0ZXJFbGVtZW50U2VsZWN0b3I6ICcuanMtY3VzdG9tZXItc3RvcnktZmlsdGVyLWVsZW1lbnQnLFxuXHRcdFx0XHRnZXRFbGVtZW50RmlsdGVyVmFsdWVzOiBmdW5jdGlvbihlbGVtZW50cykge1xuXHRcdFx0XHRcdHZhciBlbGVtZW50RmlsdGVyVmFsdWVzID0gW107XG5cdFx0XHRcdFx0JChlbGVtZW50cykuZWFjaChmdW5jdGlvbihpLCBlbCl7XG5cdFx0XHRcdFx0XHR2YXIgdmFsdWVzO1xuXHRcdFx0XHRcdFx0aWYgKHZhbHVlcyA9ICQoZWwpLmRhdGEoJ2ZpbHRlci12YWx1ZXMnKSkge1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlcyA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdFx0XHQkLmVhY2godmFsdWVzLnNwbGl0KCc7JyksIGZ1bmN0aW9uKGksIHZhbHVlKXtcblx0XHRcdFx0XHRcdFx0XHRcdGVsZW1lbnRGaWx0ZXJWYWx1ZXMucHVzaCgkLnRyaW0odmFsdWUpKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50RmlsdGVyVmFsdWVzO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmaWx0ZXJWYWx1ZUV2ZW50U2V0dXA6IGZ1bmN0aW9uKGhhbmRsZXIpIHtcblx0XHRcdFx0XHQkKCcuanMtY3VzdG9tZXItc3RvcnktZmlsdGVyLXNlbGVjdCcpLmNoYW5nZShmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0XHRhY3RpdmVTZWxlY3QgPSAkKHRoaXMpO1xuXHRcdFx0XHRcdFx0aGFuZGxlcihlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsdGVyVmFsdWVEYXRhU2V0dXA6IGZ1bmN0aW9uKGZpbHRlckRhdGFBcnJheSkge1xuXG5cdFx0XHRcdFx0aWYgKGFjdGl2ZVNlbGVjdCkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyRGF0YUFycmF5LnB1c2goJChhY3RpdmVTZWxlY3QpLnZhbCgpKTtcblx0XHRcdFx0XHRcdCQoJy5qcy1jdXN0b21lci1zdG9yeS1maWx0ZXItc2VsZWN0Jykubm90KGFjdGl2ZVNlbGVjdCkuZWFjaChmdW5jdGlvbiggaSwgdG9EaXNhYmxlICl7XG5cdFx0XHRcdFx0XHRcdCQodG9EaXNhYmxlKS5wcm9wKCdzZWxlY3RlZEluZGV4JywgMCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdHNpZnRHZW5lcmF0b3Iob3B0aW9ucyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFN0b3J5Q2FzZUhlYWRlclBvaW50c1xuXHQgKiBPbiBDdXN0b21lciBTdG9yeSBDYXNlIC0gbWFpbiBwb2ludHMgaW4gaGVhZGVyXG5cdCAqIGdldCBzaGlmdGVkIG91dHNpZGUgb2YgaGVhZGVyIHRvIG1haW50YWluIGJhY2tncm91bmQgcHJvcG9ydGlvbiBzb21ld2hhdC5cblx0ICogVGhlIG1haW4gcG9pbnRzLCBpZTogJ0Zhc3RlciwgU21vb3RoZXIsIDUwJSBmZXdlciBjYWxscycgZW5kcyB1cCBtYWtpbmcgdGhlXG5cdCAqIGNvbnRhaW5lciB0b28gJ3RhbGwnXG5cdCAqL1xuXHR2YXIgU3RvcnlDYXNlSGVhZGVyUG9pbnRzID0ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLmpzLWluaXRpYWwtY3VzdG9tZXItc3RvcnktY2FzZS1wb2ludHMtY29udGFpbmVyJykuYXBwZW5kQXJvdW5kKCk7XG5cdFx0fVxuXHR9XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRTdG9yeUxhbmRpbmdGaWx0ZXJzLmluaXQoKTtcblx0XHRTdG9yeUNhc2VIZWFkZXJQb2ludHMuaW5pdCgpO1xuXHR9O1xuXG5cdCQoaW5pdCk7XG5cbn0oalF1ZXJ5KSk7XG4iXX0=
