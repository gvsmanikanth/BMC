(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! appendAround markup pattern. [c]2012, @scottjehl, Filament Group, Inc. MIT/GPL 
how-to:
	1. Insert potential element containers throughout the DOM
	2. give each container a data-set attribute with a value that matches all other containers' values
	3. Place your appendAround content in one of the potential containers
	4. Call appendAround() on that element when the DOM is ready
*/
(function( $ ){
	$.fn.appendAround = function(){
	  return this.each(function(){
      
	    var $self = $( this ),
	        att = "data-set",
	        $parent = $self.parent(), 
	        parent = $parent[ 0 ],
	        attval = $parent.attr( att ),
	        $set = $( "["+ att +"='" + attval + "']" );

		function isHidden( elem ){
			return $(elem).css( "display" ) === "none";
		}

		function appendToVisibleContainer(){
			if( isHidden( parent ) ){
				var found = 0;
				$set.each(function(){
					if( !isHidden( this ) && !found ){
						$self.appendTo( this );
						found++;
						parent = this;
					}
				});
	      	}
	    }
      
	    appendToVisibleContainer();
      
	    $(window).bind( "resize", appendToVisibleContainer );
      
	  });
	};
}( jQuery ));

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LmFwcGVuZEFyb3VuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qISBhcHBlbmRBcm91bmQgbWFya3VwIHBhdHRlcm4uIFtjXTIwMTIsIEBzY290dGplaGwsIEZpbGFtZW50IEdyb3VwLCBJbmMuIE1JVC9HUEwgXG5ob3ctdG86XG5cdDEuIEluc2VydCBwb3RlbnRpYWwgZWxlbWVudCBjb250YWluZXJzIHRocm91Z2hvdXQgdGhlIERPTVxuXHQyLiBnaXZlIGVhY2ggY29udGFpbmVyIGEgZGF0YS1zZXQgYXR0cmlidXRlIHdpdGggYSB2YWx1ZSB0aGF0IG1hdGNoZXMgYWxsIG90aGVyIGNvbnRhaW5lcnMnIHZhbHVlc1xuXHQzLiBQbGFjZSB5b3VyIGFwcGVuZEFyb3VuZCBjb250ZW50IGluIG9uZSBvZiB0aGUgcG90ZW50aWFsIGNvbnRhaW5lcnNcblx0NC4gQ2FsbCBhcHBlbmRBcm91bmQoKSBvbiB0aGF0IGVsZW1lbnQgd2hlbiB0aGUgRE9NIGlzIHJlYWR5XG4qL1xuKGZ1bmN0aW9uKCAkICl7XG5cdCQuZm4uYXBwZW5kQXJvdW5kID0gZnVuY3Rpb24oKXtcblx0ICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICBcblx0ICAgIHZhciAkc2VsZiA9ICQoIHRoaXMgKSxcblx0ICAgICAgICBhdHQgPSBcImRhdGEtc2V0XCIsXG5cdCAgICAgICAgJHBhcmVudCA9ICRzZWxmLnBhcmVudCgpLCBcblx0ICAgICAgICBwYXJlbnQgPSAkcGFyZW50WyAwIF0sXG5cdCAgICAgICAgYXR0dmFsID0gJHBhcmVudC5hdHRyKCBhdHQgKSxcblx0ICAgICAgICAkc2V0ID0gJCggXCJbXCIrIGF0dCArXCI9J1wiICsgYXR0dmFsICsgXCInXVwiICk7XG5cblx0XHRmdW5jdGlvbiBpc0hpZGRlbiggZWxlbSApe1xuXHRcdFx0cmV0dXJuICQoZWxlbSkuY3NzKCBcImRpc3BsYXlcIiApID09PSBcIm5vbmVcIjtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBhcHBlbmRUb1Zpc2libGVDb250YWluZXIoKXtcblx0XHRcdGlmKCBpc0hpZGRlbiggcGFyZW50ICkgKXtcblx0XHRcdFx0dmFyIGZvdW5kID0gMDtcblx0XHRcdFx0JHNldC5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYoICFpc0hpZGRlbiggdGhpcyApICYmICFmb3VuZCApe1xuXHRcdFx0XHRcdFx0JHNlbGYuYXBwZW5kVG8oIHRoaXMgKTtcblx0XHRcdFx0XHRcdGZvdW5kKys7XG5cdFx0XHRcdFx0XHRwYXJlbnQgPSB0aGlzO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdCAgICAgIFx0fVxuXHQgICAgfVxuICAgICAgXG5cdCAgICBhcHBlbmRUb1Zpc2libGVDb250YWluZXIoKTtcbiAgICAgIFxuXHQgICAgJCh3aW5kb3cpLmJpbmQoIFwicmVzaXplXCIsIGFwcGVuZFRvVmlzaWJsZUNvbnRhaW5lciApO1xuICAgICAgXG5cdCAgfSk7XG5cdH07XG59KCBqUXVlcnkgKSk7XG4iXX0=
