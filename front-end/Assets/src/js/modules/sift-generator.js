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