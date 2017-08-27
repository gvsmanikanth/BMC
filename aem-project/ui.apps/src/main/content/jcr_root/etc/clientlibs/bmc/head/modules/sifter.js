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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3NpZnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoZnVuY3Rpb24oICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRmdW5jdGlvbiBTaWZ0ZXIoIG9wdGlvbnMgKSB7XHJcblx0XHR2YXIgZGVmYXVsdHMgPSB7XHJcblx0XHRcdGZpbHRlcmFibGVFbGVtZW50U2VsZWN0b3I6ICcnLFxyXG5cdFx0XHRmaWx0ZXJzOiBbXSxcclxuXHRcdFx0ZmlsdGVyRGF0YToge30sXHJcblx0XHRcdHJlc29sdmVyOiBmdW5jdGlvbiggdmFsdWVzICkge1xyXG5cdFx0XHRcdHZhciByZXN1bHQgPSBmYWxzZTtcclxuXHRcdFx0XHQkLmVhY2goIHZhbHVlcywgZnVuY3Rpb24oIGksIHZhbHVlICkge1xyXG5cdFx0XHRcdFx0aWYgKCB2YWx1ZSApIHtcclxuXHRcdFx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkaXNwbGF5OiB7XHJcblx0XHRcdFx0c2hvd246IGZ1bmN0aW9uKCBlbCApIHsgJCggZWwgKS5mYWRlSW4oKSB9LFxyXG5cdFx0XHRcdGhpZGRlbjogZnVuY3Rpb24oIGVsICkgeyAkKCBlbCApLmZhZGVPdXQoKSB9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHt9LCBkZWZhdWx0cywgb3B0aW9ucyApO1xyXG5cclxuXHRcdHRoaXMuZmlsdGVycyA9IHRoaXMub3B0aW9ucy5maWx0ZXJzO1xyXG5cdFx0dGhpcy5maWx0ZXJEYXRhID0gdGhpcy5vcHRpb25zLmZpbHRlckRhdGE7XHJcblx0XHR0aGlzLnNob3duQ291bnQgPSAwO1xyXG5cdFx0dGhpcy5oaWRkZW5Db3VudCA9IDA7XHJcblx0XHR0aGlzLnRvdGFsQ291bnQgPSAwO1xyXG5cdFx0dGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XHJcblx0XHR0aGlzLmV2ZW50cyA9IHtcclxuXHRcdFx0ZmlsdGVyc0NoYW5nZTogJ2ZpbHRlcnNDaGFuZ2VkLnNpZnRlcicsXHJcblx0XHRcdGZpbHRlcmluZ1N0YXJ0ZWQ6ICdmaWx0ZXJTdGFydGVkLnNpZnRlcicsXHJcblx0XHRcdGZpbHRlcmluZ0ZpbmlzaGVkOiAnZmlsdGVyRmluaXNoZWQuc2lmdGVyJ1xyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHRTaWZ0ZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuaW5pdEZpbHRlcnMoIHRoaXMub3B0aW9ucy5maWx0ZXJzICk7XHJcblx0XHR0aGlzLmFkZEhhbmRsZXJzKCk7XHJcblxyXG5cdFx0Ly8gaWYgbm8gZmlsdGVycyBhZGRlZCwgZW5zdXJlIGV2ZXJ5dGhpbmcgaXMgc2hvd24gb24gbG9hZFxyXG5cdFx0aWYgKCAhdGhpcy5maWx0ZXJzLmxlbmd0aCApIHtcclxuXHRcdFx0dGhpcy5maWx0ZXJFbGVtZW50cyhbe1xyXG5cdFx0XHRcdGlkOiAnc2hvdy1hbGwnLFxyXG5cdFx0XHRcdGZuOiBmdW5jdGlvbiggZWwgKSB7IHJldHVybiB0cnVlOyB9XHJcblx0XHRcdH1dKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZmlsdGVyRWxlbWVudHMoIHRoaXMuZmlsdGVycyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudG90YWxDb3VudCA9ICQoIHRoaXMub3B0aW9ucy5maWx0ZXJhYmxlRWxlbWVudFNlbGVjdG9yICkubGVuZ3RoO1xyXG5cdFx0dGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdFNpZnRlci5wcm90b3R5cGUuZGlzcGxheUZpbHRlcmVkID0gZnVuY3Rpb24oIHNob3duLCBoaWRkZW4gKSB7XHJcblx0XHQkLmVhY2goIHNob3duLmVsZW1lbnRzLCBmdW5jdGlvbiggaSwgZWwgKXtcclxuXHRcdFx0c2hvd24uc2hvd0ZuKCBlbCApO1xyXG5cdFx0fSk7XHJcblx0XHQkLmVhY2goaGlkZGVuLmVsZW1lbnRzLCBmdW5jdGlvbiggaSwgZWwgKXtcclxuXHRcdFx0aGlkZGVuLmhpZGVGbiggZWwgKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdFNpZnRlci5wcm90b3R5cGUuaW5pdEZpbHRlcnMgPSBmdW5jdGlvbiggZmlsdGVycyApIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHQkLmVhY2goIGZpbHRlcnMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXIgKSB7XHJcblxyXG5cdFx0XHQvLyBpbml0IGZpbHRlciBkYXRhIHN0b3JlXHJcblx0XHRcdHNlbGYuZmlsdGVyRGF0YVsgZmlsdGVyLmlkIF0gPSB7fTtcclxuXHJcblx0XHRcdC8vIHNldCBmaWx0ZXIgZGF0YVN0b3JlIHByb3BlcnR5LCByZWZlcmVuY2luZyB0aGUgb2JqZWN0IHN0b3JlIHVzZWQgaW50ZXJuYWxseVxyXG5cdFx0XHRmaWx0ZXIuZGF0YVN0b3JlID0gc2VsZi5maWx0ZXJEYXRhWyBmaWx0ZXIuaWQgXTtcclxuXHJcblx0XHRcdC8vIGluaXQgZmlsdGVyXHJcblx0XHRcdGlmICggZmlsdGVyLmluaXQgJiYgdHlwZW9mIGZpbHRlci5pbml0ID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRcdGZpbHRlci5pbml0KCBmaWx0ZXIgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaW5pdCBmaWx0ZXIgaGFuZGxlcnNcclxuXHRcdFx0JC5lYWNoKCBmaWx0ZXIuaGFuZGxlcnMsIGZ1bmN0aW9uKCBpLCBoYW5kbGVyICkge1xyXG5cdFx0XHRcdGlmICggaGFuZGxlci5pbml0ICYmIHR5cGVvZiBoYW5kbGVyLmluaXQgPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0XHRoYW5kbGVyLmluaXQoIGZpbHRlciwgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRcdFx0XHRcdHZhciByZXN1bHQgPSBoYW5kbGVyLmZpbHRlckNoYW5nZS5jYWxsKCB0aGlzLCBmaWx0ZXIgKTtcclxuXHRcdFx0XHRcdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCBzZWxmLmV2ZW50cy5maWx0ZXJzQ2hhbmdlLCBzZWxmICk7XHJcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0U2lmdGVyLnByb3RvdHlwZS5maWx0ZXJFbGVtZW50cyA9IGZ1bmN0aW9uKCBmaWx0ZXJzLCByZXNvbHZlciApIHtcclxuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggdGhpcy5ldmVudHMuZmlsdGVyaW5nU3RhcnRlZCwgdGhpcyApO1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0ZWxlbWVudHMgPSAkKCB0aGlzLm9wdGlvbnMuZmlsdGVyYWJsZUVsZW1lbnRTZWxlY3RvciApLFxyXG5cdFx0XHRyZXNvbHZlciA9IHJlc29sdmVyIHx8IHRoaXMub3B0aW9ucy5yZXNvbHZlcixcclxuXHRcdFx0c2hvd24sXHJcblx0XHRcdGhpZGRlbjtcclxuXHJcblx0XHRzaG93biA9ICQoIGVsZW1lbnRzICkuZmlsdGVyKGZ1bmN0aW9uKCBpLCBlbCApIHtcclxuXHRcdFx0dmFyIHJlc3VsdHMgPSBzZWxmLmdldEVsZW1lbnRGaWx0ZXJlZFJlc3VsdHMoIGVsLCBmaWx0ZXJzICk7XHJcblx0XHRcdHJldHVybiByZXNvbHZlciggcmVzdWx0cyApO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aGlkZGVuID0gJCggZWxlbWVudHMgKS5ub3QoIHNob3duICk7XHJcblxyXG5cdFx0dGhpcy5kaXNwbGF5RmlsdGVyZWQoe1xyXG5cdFx0XHRlbGVtZW50czogc2hvd24sXHJcblx0XHRcdHNob3dGbjogdGhpcy5vcHRpb25zLmRpc3BsYXkuc2hvd25cclxuXHRcdH0sIHtcclxuXHRcdFx0ZWxlbWVudHM6IGhpZGRlbixcclxuXHRcdFx0aGlkZUZuOiB0aGlzLm9wdGlvbnMuZGlzcGxheS5oaWRkZW5cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuc2hvd25Db3VudCA9IHNob3duLmxlbmd0aDtcclxuXHRcdHRoaXMuaGlkZGVuQ291bnQgPSBoaWRkZW4ubGVuZ3RoO1xyXG5cdFx0dGhpcy50b3RhbENvdW50ID0gZWxlbWVudHMubGVuZ3RoO1xyXG5cclxuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggdGhpcy5ldmVudHMuZmlsdGVyaW5nRmluaXNoZWQsIHRoaXMgKTtcclxuXHR9O1xyXG5cclxuXHRTaWZ0ZXIucHJvdG90eXBlLmdldEVsZW1lbnRGaWx0ZXJlZFJlc3VsdHMgPSBmdW5jdGlvbiggZWwsIGZpbHRlcnMgKSB7XHJcblx0XHR2YXIgcmVzdWx0cyA9IHt9O1xyXG5cclxuXHRcdCQuZWFjaCggZmlsdGVycywgZnVuY3Rpb24oIGksIGZpbHRlciApIHtcclxuXHRcdFx0cmVzdWx0c1sgZmlsdGVyLmlkIF0gPSBmaWx0ZXIuZm4oIGVsLCBmaWx0ZXIgKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiByZXN1bHRzO1xyXG5cdH1cclxuXHJcblx0U2lmdGVyLnByb3RvdHlwZS5hZGRIYW5kbGVycyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0JCggZG9jdW1lbnQgKS5vbiggdGhpcy5ldmVudHMuZmlsdGVyc0NoYW5nZSwgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRpZiAoIGFyZ3VtZW50c1sxXSA9PT0gc2VsZiApIHtcclxuXHRcdFx0XHRzZWxmLmZpbHRlckVsZW1lbnRzKCBzZWxmLmZpbHRlcnMgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0d2luZG93LlNpZnRlciA9IFNpZnRlcjtcclxuXHJcbn0oIGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCApICk7Il19
