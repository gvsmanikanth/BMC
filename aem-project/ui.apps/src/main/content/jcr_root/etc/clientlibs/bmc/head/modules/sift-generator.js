(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function( $, window, document, undefined ) {

	// used to create a basic sifter filter based on the majority use case of just filtering
	// based on data attributes
	function siftGenerator( required, options ) {

		var filterElementSelector = required.filterElementSelector,
			getElementFilterValues = required.getElementFilterValues,
			filterValueEventSetup = required.filterValueEventSetup,
			filterValueDataSetup = required.filterValueDataSetup,
			options = options || {},
			uniqueId = 'filter-' + Math.random(),
			basicFilter,
			sifterInstance;

			basicFilter = {
				id: uniqueId,
				fn: function( el, filter ) {
					// retrieve relevant data from element being filtered
					var elementFilterValues = getElementFilterValues( el ),
					activeFilterValues,
					shown;

					if (elementFilterValues === undefined) {
						return null;
					}

					if (!$.isArray(elementFilterValues)) {
						elementFilterValues = [elementFilterValues];
					}

					activeFilterValues = filter.dataStore.activeValues;
					shown = true;
					$.each( activeFilterValues, function( i, activeValue ) {
						if (activeValue !== "" && $.inArray(activeValue, elementFilterValues) === -1) {
							shown = false;
						}
					});

					return shown;
				},
				init: function( filter ) {
					// setup data store
					filter.dataStore.activeValues = [];
				},
				handlers: [{
					init: function( filter, handler ) {
						// setup handlers
						filterValueEventSetup( handler );

						// setup initial data
						handler( filter );
					},
					filterChange: function( filter ) {
						// reset
						filter.dataStore.activeValues = [];
						filterValueDataSetup( filter.dataStore.activeValues );
					}

				}]
			};

		options = $.extend({
			filterableElementSelector: filterElementSelector,
			filters: [ basicFilter ]
		}, options);

		sifterInstance = new Sifter( options );

		sifterInstance.init();
		return sifterInstance;
	};

	window.siftGenerator = siftGenerator;

}( jQuery, window, document ));
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3NpZnQtZ2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCAkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQgKSB7XG5cblx0Ly8gdXNlZCB0byBjcmVhdGUgYSBiYXNpYyBzaWZ0ZXIgZmlsdGVyIGJhc2VkIG9uIHRoZSBtYWpvcml0eSB1c2UgY2FzZSBvZiBqdXN0IGZpbHRlcmluZ1xuXHQvLyBiYXNlZCBvbiBkYXRhIGF0dHJpYnV0ZXNcblx0ZnVuY3Rpb24gc2lmdEdlbmVyYXRvciggcmVxdWlyZWQsIG9wdGlvbnMgKSB7XG5cblx0XHR2YXIgZmlsdGVyRWxlbWVudFNlbGVjdG9yID0gcmVxdWlyZWQuZmlsdGVyRWxlbWVudFNlbGVjdG9yLFxuXHRcdFx0Z2V0RWxlbWVudEZpbHRlclZhbHVlcyA9IHJlcXVpcmVkLmdldEVsZW1lbnRGaWx0ZXJWYWx1ZXMsXG5cdFx0XHRmaWx0ZXJWYWx1ZUV2ZW50U2V0dXAgPSByZXF1aXJlZC5maWx0ZXJWYWx1ZUV2ZW50U2V0dXAsXG5cdFx0XHRmaWx0ZXJWYWx1ZURhdGFTZXR1cCA9IHJlcXVpcmVkLmZpbHRlclZhbHVlRGF0YVNldHVwLFxuXHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge30sXG5cdFx0XHR1bmlxdWVJZCA9ICdmaWx0ZXItJyArIE1hdGgucmFuZG9tKCksXG5cdFx0XHRiYXNpY0ZpbHRlcixcblx0XHRcdHNpZnRlckluc3RhbmNlO1xuXG5cdFx0XHRiYXNpY0ZpbHRlciA9IHtcblx0XHRcdFx0aWQ6IHVuaXF1ZUlkLFxuXHRcdFx0XHRmbjogZnVuY3Rpb24oIGVsLCBmaWx0ZXIgKSB7XG5cdFx0XHRcdFx0Ly8gcmV0cmlldmUgcmVsZXZhbnQgZGF0YSBmcm9tIGVsZW1lbnQgYmVpbmcgZmlsdGVyZWRcblx0XHRcdFx0XHR2YXIgZWxlbWVudEZpbHRlclZhbHVlcyA9IGdldEVsZW1lbnRGaWx0ZXJWYWx1ZXMoIGVsICksXG5cdFx0XHRcdFx0YWN0aXZlRmlsdGVyVmFsdWVzLFxuXHRcdFx0XHRcdHNob3duO1xuXG5cdFx0XHRcdFx0aWYgKGVsZW1lbnRGaWx0ZXJWYWx1ZXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCEkLmlzQXJyYXkoZWxlbWVudEZpbHRlclZhbHVlcykpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnRGaWx0ZXJWYWx1ZXMgPSBbZWxlbWVudEZpbHRlclZhbHVlc107XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YWN0aXZlRmlsdGVyVmFsdWVzID0gZmlsdGVyLmRhdGFTdG9yZS5hY3RpdmVWYWx1ZXM7XG5cdFx0XHRcdFx0c2hvd24gPSB0cnVlO1xuXHRcdFx0XHRcdCQuZWFjaCggYWN0aXZlRmlsdGVyVmFsdWVzLCBmdW5jdGlvbiggaSwgYWN0aXZlVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRpZiAoYWN0aXZlVmFsdWUgIT09IFwiXCIgJiYgJC5pbkFycmF5KGFjdGl2ZVZhbHVlLCBlbGVtZW50RmlsdGVyVmFsdWVzKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0c2hvd24gPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHJldHVybiBzaG93bjtcblx0XHRcdFx0fSxcblx0XHRcdFx0aW5pdDogZnVuY3Rpb24oIGZpbHRlciApIHtcblx0XHRcdFx0XHQvLyBzZXR1cCBkYXRhIHN0b3JlXG5cdFx0XHRcdFx0ZmlsdGVyLmRhdGFTdG9yZS5hY3RpdmVWYWx1ZXMgPSBbXTtcblx0XHRcdFx0fSxcblx0XHRcdFx0aGFuZGxlcnM6IFt7XG5cdFx0XHRcdFx0aW5pdDogZnVuY3Rpb24oIGZpbHRlciwgaGFuZGxlciApIHtcblx0XHRcdFx0XHRcdC8vIHNldHVwIGhhbmRsZXJzXG5cdFx0XHRcdFx0XHRmaWx0ZXJWYWx1ZUV2ZW50U2V0dXAoIGhhbmRsZXIgKTtcblxuXHRcdFx0XHRcdFx0Ly8gc2V0dXAgaW5pdGlhbCBkYXRhXG5cdFx0XHRcdFx0XHRoYW5kbGVyKCBmaWx0ZXIgKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZpbHRlckNoYW5nZTogZnVuY3Rpb24oIGZpbHRlciApIHtcblx0XHRcdFx0XHRcdC8vIHJlc2V0XG5cdFx0XHRcdFx0XHRmaWx0ZXIuZGF0YVN0b3JlLmFjdGl2ZVZhbHVlcyA9IFtdO1xuXHRcdFx0XHRcdFx0ZmlsdGVyVmFsdWVEYXRhU2V0dXAoIGZpbHRlci5kYXRhU3RvcmUuYWN0aXZlVmFsdWVzICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1dXG5cdFx0XHR9O1xuXG5cdFx0b3B0aW9ucyA9ICQuZXh0ZW5kKHtcblx0XHRcdGZpbHRlcmFibGVFbGVtZW50U2VsZWN0b3I6IGZpbHRlckVsZW1lbnRTZWxlY3Rvcixcblx0XHRcdGZpbHRlcnM6IFsgYmFzaWNGaWx0ZXIgXVxuXHRcdH0sIG9wdGlvbnMpO1xuXG5cdFx0c2lmdGVySW5zdGFuY2UgPSBuZXcgU2lmdGVyKCBvcHRpb25zICk7XG5cblx0XHRzaWZ0ZXJJbnN0YW5jZS5pbml0KCk7XG5cdFx0cmV0dXJuIHNpZnRlckluc3RhbmNlO1xuXHR9O1xuXG5cdHdpbmRvdy5zaWZ0R2VuZXJhdG9yID0gc2lmdEdlbmVyYXRvcjtcblxufSggalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50ICkpOyJdfQ==
