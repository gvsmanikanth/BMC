(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3NpZnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoZnVuY3Rpb24oICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZnVuY3Rpb24gU2lmdGVyKCBvcHRpb25zICkge1xuXHRcdHZhciBkZWZhdWx0cyA9IHtcblx0XHRcdGZpbHRlcmFibGVFbGVtZW50U2VsZWN0b3I6ICcnLFxuXHRcdFx0ZmlsdGVyczogW10sXG5cdFx0XHRmaWx0ZXJEYXRhOiB7fSxcblx0XHRcdHJlc29sdmVyOiBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gZmFsc2U7XG5cdFx0XHRcdCQuZWFjaCggdmFsdWVzLCBmdW5jdGlvbiggaSwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH0sXG5cdFx0XHRkaXNwbGF5OiB7XG5cdFx0XHRcdHNob3duOiBmdW5jdGlvbiggZWwgKSB7ICQoIGVsICkuZmFkZUluKCkgfSxcblx0XHRcdFx0aGlkZGVuOiBmdW5jdGlvbiggZWwgKSB7ICQoIGVsICkuZmFkZU91dCgpIH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHt9LCBkZWZhdWx0cywgb3B0aW9ucyApO1xuXG5cdFx0dGhpcy5maWx0ZXJzID0gdGhpcy5vcHRpb25zLmZpbHRlcnM7XG5cdFx0dGhpcy5maWx0ZXJEYXRhID0gdGhpcy5vcHRpb25zLmZpbHRlckRhdGE7XG5cdFx0dGhpcy5zaG93bkNvdW50ID0gMDtcblx0XHR0aGlzLmhpZGRlbkNvdW50ID0gMDtcblx0XHR0aGlzLnRvdGFsQ291bnQgPSAwO1xuXHRcdHRoaXMuaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuXHRcdHRoaXMuZXZlbnRzID0ge1xuXHRcdFx0ZmlsdGVyc0NoYW5nZTogJ2ZpbHRlcnNDaGFuZ2VkLnNpZnRlcicsXG5cdFx0XHRmaWx0ZXJpbmdTdGFydGVkOiAnZmlsdGVyU3RhcnRlZC5zaWZ0ZXInLFxuXHRcdFx0ZmlsdGVyaW5nRmluaXNoZWQ6ICdmaWx0ZXJGaW5pc2hlZC5zaWZ0ZXInXG5cdFx0fTtcblx0fTtcblxuXHRTaWZ0ZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmluaXRGaWx0ZXJzKCB0aGlzLm9wdGlvbnMuZmlsdGVycyApO1xuXHRcdHRoaXMuYWRkSGFuZGxlcnMoKTtcblxuXHRcdC8vIGlmIG5vIGZpbHRlcnMgYWRkZWQsIGVuc3VyZSBldmVyeXRoaW5nIGlzIHNob3duIG9uIGxvYWRcblx0XHRpZiAoICF0aGlzLmZpbHRlcnMubGVuZ3RoICkge1xuXHRcdFx0dGhpcy5maWx0ZXJFbGVtZW50cyhbe1xuXHRcdFx0XHRpZDogJ3Nob3ctYWxsJyxcblx0XHRcdFx0Zm46IGZ1bmN0aW9uKCBlbCApIHsgcmV0dXJuIHRydWU7IH1cblx0XHRcdH1dKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5maWx0ZXJFbGVtZW50cyggdGhpcy5maWx0ZXJzICk7XG5cdFx0fVxuXG5cdFx0dGhpcy50b3RhbENvdW50ID0gJCggdGhpcy5vcHRpb25zLmZpbHRlcmFibGVFbGVtZW50U2VsZWN0b3IgKS5sZW5ndGg7XG5cdFx0dGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZTtcblx0fVxuXG5cdFNpZnRlci5wcm90b3R5cGUuZGlzcGxheUZpbHRlcmVkID0gZnVuY3Rpb24oIHNob3duLCBoaWRkZW4gKSB7XG5cdFx0JC5lYWNoKCBzaG93bi5lbGVtZW50cywgZnVuY3Rpb24oIGksIGVsICl7XG5cdFx0XHRzaG93bi5zaG93Rm4oIGVsICk7XG5cdFx0fSk7XG5cdFx0JC5lYWNoKGhpZGRlbi5lbGVtZW50cywgZnVuY3Rpb24oIGksIGVsICl7XG5cdFx0XHRoaWRkZW4uaGlkZUZuKCBlbCApO1xuXHRcdH0pO1xuXHR9O1xuXG5cdFNpZnRlci5wcm90b3R5cGUuaW5pdEZpbHRlcnMgPSBmdW5jdGlvbiggZmlsdGVycyApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQkLmVhY2goIGZpbHRlcnMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXIgKSB7XG5cblx0XHRcdC8vIGluaXQgZmlsdGVyIGRhdGEgc3RvcmVcblx0XHRcdHNlbGYuZmlsdGVyRGF0YVsgZmlsdGVyLmlkIF0gPSB7fTtcblxuXHRcdFx0Ly8gc2V0IGZpbHRlciBkYXRhU3RvcmUgcHJvcGVydHksIHJlZmVyZW5jaW5nIHRoZSBvYmplY3Qgc3RvcmUgdXNlZCBpbnRlcm5hbGx5XG5cdFx0XHRmaWx0ZXIuZGF0YVN0b3JlID0gc2VsZi5maWx0ZXJEYXRhWyBmaWx0ZXIuaWQgXTtcblxuXHRcdFx0Ly8gaW5pdCBmaWx0ZXJcblx0XHRcdGlmICggZmlsdGVyLmluaXQgJiYgdHlwZW9mIGZpbHRlci5pbml0ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRmaWx0ZXIuaW5pdCggZmlsdGVyICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGluaXQgZmlsdGVyIGhhbmRsZXJzXG5cdFx0XHQkLmVhY2goIGZpbHRlci5oYW5kbGVycywgZnVuY3Rpb24oIGksIGhhbmRsZXIgKSB7XG5cdFx0XHRcdGlmICggaGFuZGxlci5pbml0ICYmIHR5cGVvZiBoYW5kbGVyLmluaXQgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0aGFuZGxlci5pbml0KCBmaWx0ZXIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdFx0dmFyIHJlc3VsdCA9IGhhbmRsZXIuZmlsdGVyQ2hhbmdlLmNhbGwoIHRoaXMsIGZpbHRlciApO1xuXHRcdFx0XHRcdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCBzZWxmLmV2ZW50cy5maWx0ZXJzQ2hhbmdlLCBzZWxmICk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fTtcblxuXHRTaWZ0ZXIucHJvdG90eXBlLmZpbHRlckVsZW1lbnRzID0gZnVuY3Rpb24oIGZpbHRlcnMsIHJlc29sdmVyICkge1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggdGhpcy5ldmVudHMuZmlsdGVyaW5nU3RhcnRlZCwgdGhpcyApO1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0ZWxlbWVudHMgPSAkKCB0aGlzLm9wdGlvbnMuZmlsdGVyYWJsZUVsZW1lbnRTZWxlY3RvciApLFxuXHRcdFx0cmVzb2x2ZXIgPSByZXNvbHZlciB8fCB0aGlzLm9wdGlvbnMucmVzb2x2ZXIsXG5cdFx0XHRzaG93bixcblx0XHRcdGhpZGRlbjtcblxuXHRcdHNob3duID0gJCggZWxlbWVudHMgKS5maWx0ZXIoZnVuY3Rpb24oIGksIGVsICkge1xuXHRcdFx0dmFyIHJlc3VsdHMgPSBzZWxmLmdldEVsZW1lbnRGaWx0ZXJlZFJlc3VsdHMoIGVsLCBmaWx0ZXJzICk7XG5cdFx0XHRyZXR1cm4gcmVzb2x2ZXIoIHJlc3VsdHMgKTtcblx0XHR9KTtcblxuXHRcdGhpZGRlbiA9ICQoIGVsZW1lbnRzICkubm90KCBzaG93biApO1xuXG5cdFx0dGhpcy5kaXNwbGF5RmlsdGVyZWQoe1xuXHRcdFx0ZWxlbWVudHM6IHNob3duLFxuXHRcdFx0c2hvd0ZuOiB0aGlzLm9wdGlvbnMuZGlzcGxheS5zaG93blxuXHRcdH0sIHtcblx0XHRcdGVsZW1lbnRzOiBoaWRkZW4sXG5cdFx0XHRoaWRlRm46IHRoaXMub3B0aW9ucy5kaXNwbGF5LmhpZGRlblxuXHRcdH0pO1xuXG5cdFx0dGhpcy5zaG93bkNvdW50ID0gc2hvd24ubGVuZ3RoO1xuXHRcdHRoaXMuaGlkZGVuQ291bnQgPSBoaWRkZW4ubGVuZ3RoO1xuXHRcdHRoaXMudG90YWxDb3VudCA9IGVsZW1lbnRzLmxlbmd0aDtcblxuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggdGhpcy5ldmVudHMuZmlsdGVyaW5nRmluaXNoZWQsIHRoaXMgKTtcblx0fTtcblxuXHRTaWZ0ZXIucHJvdG90eXBlLmdldEVsZW1lbnRGaWx0ZXJlZFJlc3VsdHMgPSBmdW5jdGlvbiggZWwsIGZpbHRlcnMgKSB7XG5cdFx0dmFyIHJlc3VsdHMgPSB7fTtcblxuXHRcdCQuZWFjaCggZmlsdGVycywgZnVuY3Rpb24oIGksIGZpbHRlciApIHtcblx0XHRcdHJlc3VsdHNbIGZpbHRlci5pZCBdID0gZmlsdGVyLmZuKCBlbCwgZmlsdGVyICk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdFNpZnRlci5wcm90b3R5cGUuYWRkSGFuZGxlcnMgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0JCggZG9jdW1lbnQgKS5vbiggdGhpcy5ldmVudHMuZmlsdGVyc0NoYW5nZSwgZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKCBhcmd1bWVudHNbMV0gPT09IHNlbGYgKSB7XG5cdFx0XHRcdHNlbGYuZmlsdGVyRWxlbWVudHMoIHNlbGYuZmlsdGVycyApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXG5cdHdpbmRvdy5TaWZ0ZXIgPSBTaWZ0ZXI7XG5cbn0oIGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCApICk7Il19
