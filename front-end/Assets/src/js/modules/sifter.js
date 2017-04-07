;(function( $, window, document, undefined ) {

	'use strict';

	function Sifter( options ) {
		var defaults = {
			filterableElementSelector: '',
			filters: [],
			filterData: {},
			resolver: function( values ) {
				var result = false;
				$.each( values, function( i, value ) {
					if ( value ) {
						result = true;
					}
				});
				return result;
			},
			display: {
				shown: function( el ) { $( el ).fadeIn() },
				hidden: function( el ) { $( el ).fadeOut() }
			}
		};

		this.options = $.extend( {}, defaults, options );

		this.filters = this.options.filters;
		this.filterData = this.options.filterData;
		this.shownCount = 0;
		this.hiddenCount = 0;
		this.totalCount = 0;
		this.isInitialized = false;
		this.events = {
			filtersChange: 'filtersChanged.sifter',
			filteringStarted: 'filterStarted.sifter',
			filteringFinished: 'filterFinished.sifter'
		};
	};

	Sifter.prototype.init = function() {
		this.initFilters( this.options.filters );
		this.addHandlers();

		// if no filters added, ensure everything is shown on load
		if ( !this.filters.length ) {
			this.filterElements([{
				id: 'show-all',
				fn: function( el ) { return true; }
			}]);
		} else {
			this.filterElements( this.filters );
		}

		this.totalCount = $( this.options.filterableElementSelector ).length;
		this.isInitialized = true;
	}

	Sifter.prototype.displayFiltered = function( shown, hidden ) {
		$.each( shown.elements, function( i, el ){
			shown.showFn( el );
		});
		$.each(hidden.elements, function( i, el ){
			hidden.hideFn( el );
		});
	};

	Sifter.prototype.initFilters = function( filters ) {
		var self = this;

		$.each( filters, function( i, filter ) {

			// init filter data store
			self.filterData[ filter.id ] = {};

			// set filter dataStore property, referencing the object store used internally
			filter.dataStore = self.filterData[ filter.id ];

			// init filter
			if ( filter.init && typeof filter.init === 'function' ) {
				filter.init( filter );
			}

			// init filter handlers
			$.each( filter.handlers, function( i, handler ) {
				if ( handler.init && typeof handler.init === 'function' ) {
					handler.init( filter, function( e ) {
						var result = handler.filterChange.call( this, filter );
						$( document ).trigger( self.events.filtersChange, self );
						return result;
					});
				}
			});
		});
	};

	Sifter.prototype.filterElements = function( filters, resolver ) {
		$( document ).trigger( this.events.filteringStarted, this );

		var self = this,
			elements = $( this.options.filterableElementSelector ),
			resolver = resolver || this.options.resolver,
			shown,
			hidden;

		shown = $( elements ).filter(function( i, el ) {
			var results = self.getElementFilteredResults( el, filters );
			return resolver( results );
		});

		hidden = $( elements ).not( shown );

		this.displayFiltered({
			elements: shown,
			showFn: this.options.display.shown
		}, {
			elements: hidden,
			hideFn: this.options.display.hidden
		});

		this.shownCount = shown.length;
		this.hiddenCount = hidden.length;
		this.totalCount = elements.length;

		$( document ).trigger( this.events.filteringFinished, this );
	};

	Sifter.prototype.getElementFilteredResults = function( el, filters ) {
		var results = {};

		$.each( filters, function( i, filter ) {
			results[ filter.id ] = filter.fn( el, filter );
		});

		return results;
	}

	Sifter.prototype.addHandlers = function() {
		var self = this;
		$( document ).on( this.events.filtersChange, function(e) {
			if ( arguments[1] === self ) {
				self.filterElements( self.filters );
			}
		});
	};

	window.Sifter = Sifter;

}( jQuery, window, document ) );