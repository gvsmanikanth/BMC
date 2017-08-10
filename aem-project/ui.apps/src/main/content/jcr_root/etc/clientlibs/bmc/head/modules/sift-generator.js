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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3NpZnQtZ2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCAkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQgKSB7XHJcblxyXG5cdC8vIHVzZWQgdG8gY3JlYXRlIGEgYmFzaWMgc2lmdGVyIGZpbHRlciBiYXNlZCBvbiB0aGUgbWFqb3JpdHkgdXNlIGNhc2Ugb2YganVzdCBmaWx0ZXJpbmdcclxuXHQvLyBiYXNlZCBvbiBkYXRhIGF0dHJpYnV0ZXNcclxuXHRmdW5jdGlvbiBzaWZ0R2VuZXJhdG9yKCByZXF1aXJlZCwgb3B0aW9ucyApIHtcclxuXHJcblx0XHR2YXIgZmlsdGVyRWxlbWVudFNlbGVjdG9yID0gcmVxdWlyZWQuZmlsdGVyRWxlbWVudFNlbGVjdG9yLFxyXG5cdFx0XHRnZXRFbGVtZW50RmlsdGVyVmFsdWVzID0gcmVxdWlyZWQuZ2V0RWxlbWVudEZpbHRlclZhbHVlcyxcclxuXHRcdFx0ZmlsdGVyVmFsdWVFdmVudFNldHVwID0gcmVxdWlyZWQuZmlsdGVyVmFsdWVFdmVudFNldHVwLFxyXG5cdFx0XHRmaWx0ZXJWYWx1ZURhdGFTZXR1cCA9IHJlcXVpcmVkLmZpbHRlclZhbHVlRGF0YVNldHVwLFxyXG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fSxcclxuXHRcdFx0dW5pcXVlSWQgPSAnZmlsdGVyLScgKyBNYXRoLnJhbmRvbSgpLFxyXG5cdFx0XHRiYXNpY0ZpbHRlcixcclxuXHRcdFx0c2lmdGVySW5zdGFuY2U7XHJcblxyXG5cdFx0XHRiYXNpY0ZpbHRlciA9IHtcclxuXHRcdFx0XHRpZDogdW5pcXVlSWQsXHJcblx0XHRcdFx0Zm46IGZ1bmN0aW9uKCBlbCwgZmlsdGVyICkge1xyXG5cdFx0XHRcdFx0Ly8gcmV0cmlldmUgcmVsZXZhbnQgZGF0YSBmcm9tIGVsZW1lbnQgYmVpbmcgZmlsdGVyZWRcclxuXHRcdFx0XHRcdHZhciBlbGVtZW50RmlsdGVyVmFsdWVzID0gZ2V0RWxlbWVudEZpbHRlclZhbHVlcyggZWwgKSxcclxuXHRcdFx0XHRcdGFjdGl2ZUZpbHRlclZhbHVlcyxcclxuXHRcdFx0XHRcdHNob3duO1xyXG5cclxuXHRcdFx0XHRcdGlmIChlbGVtZW50RmlsdGVyVmFsdWVzID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCEkLmlzQXJyYXkoZWxlbWVudEZpbHRlclZhbHVlcykpIHtcclxuXHRcdFx0XHRcdFx0ZWxlbWVudEZpbHRlclZhbHVlcyA9IFtlbGVtZW50RmlsdGVyVmFsdWVzXTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRhY3RpdmVGaWx0ZXJWYWx1ZXMgPSBmaWx0ZXIuZGF0YVN0b3JlLmFjdGl2ZVZhbHVlcztcclxuXHRcdFx0XHRcdHNob3duID0gdHJ1ZTtcclxuXHRcdFx0XHRcdCQuZWFjaCggYWN0aXZlRmlsdGVyVmFsdWVzLCBmdW5jdGlvbiggaSwgYWN0aXZlVmFsdWUgKSB7XHJcblx0XHRcdFx0XHRcdGlmIChhY3RpdmVWYWx1ZSAhPT0gXCJcIiAmJiAkLmluQXJyYXkoYWN0aXZlVmFsdWUsIGVsZW1lbnRGaWx0ZXJWYWx1ZXMpID09PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdHNob3duID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiBzaG93bjtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKCBmaWx0ZXIgKSB7XHJcblx0XHRcdFx0XHQvLyBzZXR1cCBkYXRhIHN0b3JlXHJcblx0XHRcdFx0XHRmaWx0ZXIuZGF0YVN0b3JlLmFjdGl2ZVZhbHVlcyA9IFtdO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlcnM6IFt7XHJcblx0XHRcdFx0XHRpbml0OiBmdW5jdGlvbiggZmlsdGVyLCBoYW5kbGVyICkge1xyXG5cdFx0XHRcdFx0XHQvLyBzZXR1cCBoYW5kbGVyc1xyXG5cdFx0XHRcdFx0XHRmaWx0ZXJWYWx1ZUV2ZW50U2V0dXAoIGhhbmRsZXIgKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIHNldHVwIGluaXRpYWwgZGF0YVxyXG5cdFx0XHRcdFx0XHRoYW5kbGVyKCBmaWx0ZXIgKTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRmaWx0ZXJDaGFuZ2U6IGZ1bmN0aW9uKCBmaWx0ZXIgKSB7XHJcblx0XHRcdFx0XHRcdC8vIHJlc2V0XHJcblx0XHRcdFx0XHRcdGZpbHRlci5kYXRhU3RvcmUuYWN0aXZlVmFsdWVzID0gW107XHJcblx0XHRcdFx0XHRcdGZpbHRlclZhbHVlRGF0YVNldHVwKCBmaWx0ZXIuZGF0YVN0b3JlLmFjdGl2ZVZhbHVlcyApO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdG9wdGlvbnMgPSAkLmV4dGVuZCh7XHJcblx0XHRcdGZpbHRlcmFibGVFbGVtZW50U2VsZWN0b3I6IGZpbHRlckVsZW1lbnRTZWxlY3RvcixcclxuXHRcdFx0ZmlsdGVyczogWyBiYXNpY0ZpbHRlciBdXHJcblx0XHR9LCBvcHRpb25zKTtcclxuXHJcblx0XHRzaWZ0ZXJJbnN0YW5jZSA9IG5ldyBTaWZ0ZXIoIG9wdGlvbnMgKTtcclxuXHJcblx0XHRzaWZ0ZXJJbnN0YW5jZS5pbml0KCk7XHJcblx0XHRyZXR1cm4gc2lmdGVySW5zdGFuY2U7XHJcblx0fTtcclxuXHJcblx0d2luZG93LnNpZnRHZW5lcmF0b3IgPSBzaWZ0R2VuZXJhdG9yO1xyXG5cclxufSggalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50ICkpOyJdfQ==
