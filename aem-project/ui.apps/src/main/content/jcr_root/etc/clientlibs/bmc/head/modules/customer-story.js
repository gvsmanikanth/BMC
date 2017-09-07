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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2N1c3RvbWVyLXN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyhmdW5jdGlvbigkKXtcclxuXHJcblx0dmFyIFN0b3J5TGFuZGluZ0ZpbHRlcnMgPSB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdHZhciBhY3RpdmVTZWxlY3QgPSBudWxsO1xyXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHtcclxuXHRcdFx0XHRmaWx0ZXJFbGVtZW50U2VsZWN0b3I6ICcuanMtY3VzdG9tZXItc3RvcnktZmlsdGVyLWVsZW1lbnQnLFxyXG5cdFx0XHRcdGdldEVsZW1lbnRGaWx0ZXJWYWx1ZXM6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XHJcblx0XHRcdFx0XHR2YXIgZWxlbWVudEZpbHRlclZhbHVlcyA9IFtdO1xyXG5cdFx0XHRcdFx0JChlbGVtZW50cykuZWFjaChmdW5jdGlvbihpLCBlbCl7XHJcblx0XHRcdFx0XHRcdHZhciB2YWx1ZXM7XHJcblx0XHRcdFx0XHRcdGlmICh2YWx1ZXMgPSAkKGVsKS5kYXRhKCdmaWx0ZXItdmFsdWVzJykpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlcyA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdFx0XHRcdCQuZWFjaCh2YWx1ZXMuc3BsaXQoJywnKSwgZnVuY3Rpb24oaSwgdmFsdWUpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtZW50RmlsdGVyVmFsdWVzLnB1c2goJC50cmltKHZhbHVlKSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnRGaWx0ZXJWYWx1ZXM7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRmaWx0ZXJWYWx1ZUV2ZW50U2V0dXA6IGZ1bmN0aW9uKGhhbmRsZXIpIHtcclxuXHRcdFx0XHRcdCQoJy5qcy1jdXN0b21lci1zdG9yeS1maWx0ZXItc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdFx0YWN0aXZlU2VsZWN0ID0gJCh0aGlzKTtcclxuXHRcdFx0XHRcdFx0aGFuZGxlcihlKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0ZmlsdGVyVmFsdWVEYXRhU2V0dXA6IGZ1bmN0aW9uKGZpbHRlckRhdGFBcnJheSkge1xyXG5cclxuXHRcdFx0XHRcdGlmIChhY3RpdmVTZWxlY3QpIHtcclxuXHRcdFx0XHRcdFx0ZmlsdGVyRGF0YUFycmF5LnB1c2goJChhY3RpdmVTZWxlY3QpLnZhbCgpKTtcclxuXHRcdFx0XHRcdFx0JCgnLmpzLWN1c3RvbWVyLXN0b3J5LWZpbHRlci1zZWxlY3QnKS5ub3QoYWN0aXZlU2VsZWN0KS5lYWNoKGZ1bmN0aW9uKCBpLCB0b0Rpc2FibGUgKXtcclxuXHRcdFx0XHRcdFx0XHQkKHRvRGlzYWJsZSkucHJvcCgnc2VsZWN0ZWRJbmRleCcsIDApO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzaWZ0R2VuZXJhdG9yKG9wdGlvbnMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogU3RvcnlDYXNlSGVhZGVyUG9pbnRzXHJcblx0ICogT24gQ3VzdG9tZXIgU3RvcnkgQ2FzZSAtIG1haW4gcG9pbnRzIGluIGhlYWRlclxyXG5cdCAqIGdldCBzaGlmdGVkIG91dHNpZGUgb2YgaGVhZGVyIHRvIG1haW50YWluIGJhY2tncm91bmQgcHJvcG9ydGlvbiBzb21ld2hhdC5cclxuXHQgKiBUaGUgbWFpbiBwb2ludHMsIGllOiAnRmFzdGVyLCBTbW9vdGhlciwgNTAlIGZld2VyIGNhbGxzJyBlbmRzIHVwIG1ha2luZyB0aGVcclxuXHQgKiBjb250YWluZXIgdG9vICd0YWxsJ1xyXG5cdCAqL1xyXG5cdHZhciBTdG9yeUNhc2VIZWFkZXJQb2ludHMgPSB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnLmpzLWluaXRpYWwtY3VzdG9tZXItc3RvcnktY2FzZS1wb2ludHMtY29udGFpbmVyJykuYXBwZW5kQXJvdW5kKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0U3RvcnlMYW5kaW5nRmlsdGVycy5pbml0KCk7XHJcblx0XHRTdG9yeUNhc2VIZWFkZXJQb2ludHMuaW5pdCgpO1xyXG5cdH07XHJcblxyXG5cdCQoaW5pdCk7XHJcblxyXG59KGpRdWVyeSkpOyJdfQ==
