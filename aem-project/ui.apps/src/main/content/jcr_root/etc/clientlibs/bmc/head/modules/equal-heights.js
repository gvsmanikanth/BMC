(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;( function( $, window, document, undefined ) {
	'use strict';

	var $m = $( '.js-match' ),
		$mh = $( '.js-matchHeight' ),
		matchHeights = function() {
			var height = $m.height();
			$mh.height(height);
		};

	matchHeights();
	$( window ).on( 'resize', matchHeights );

	var s = document.body || document.documentElement, s = s.style;
	//if( s.webkitFlexWrap == '' || s.msFlexWrap == '' || s.flexWrap == '' ) return true;
	// $('html').removeClass('flexbox').addClass('no-flexbox');
	// $('html').removeClass('svg inlinesvg svgclippaths').addClass('no-svg');

	var setHeights = function(eh) {
		$(eh).each(function(i) {
			var ehItem = $(this).find('.js-ehItem'),
				maxHeight = 0;
			$(ehItem).css('height', 'auto');	
			
			$(ehItem).each( function() {
				var ehInstance = $(this),
					itemHeight = $(ehInstance).outerHeight();
				if ( itemHeight > maxHeight ) {
					maxHeight = itemHeight;
				}
			});
			if(maxHeight !=0)
				$(ehItem).height(maxHeight);
		});
	};

	setHeights('.js-eh');
	
	window.onResizeSetHeight = function(){
		setHeights('.js-eh');
	}; 
	
	var supportsOrientationChange = "onorientationchange" in window,
		orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
	window.addEventListener(orientationEvent, function() {
					onResizeSetHeight();
    }, false);
	
	//$( window ).load(onResizeSetHeight());
	
	$(document).ready(function() {
		setTimeout(onResizeSetHeight(), 2000);
	});
	
	$(window).resize(function() {
		setTimeout(onResizeSetHeight(), 2000);
	});

})( jQuery, window, document );

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2VxdWFsLWhlaWdodHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyggZnVuY3Rpb24oICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciAkbSA9ICQoICcuanMtbWF0Y2gnICksXG5cdFx0JG1oID0gJCggJy5qcy1tYXRjaEhlaWdodCcgKSxcblx0XHRtYXRjaEhlaWdodHMgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBoZWlnaHQgPSAkbS5oZWlnaHQoKTtcblx0XHRcdCRtaC5oZWlnaHQoaGVpZ2h0KTtcblx0XHR9O1xuXG5cdG1hdGNoSGVpZ2h0cygpO1xuXHQkKCB3aW5kb3cgKS5vbiggJ3Jlc2l6ZScsIG1hdGNoSGVpZ2h0cyApO1xuXG5cdHZhciBzID0gZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHMgPSBzLnN0eWxlO1xuXHQvL2lmKCBzLndlYmtpdEZsZXhXcmFwID09ICcnIHx8IHMubXNGbGV4V3JhcCA9PSAnJyB8fCBzLmZsZXhXcmFwID09ICcnICkgcmV0dXJuIHRydWU7XG5cdC8vICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnZmxleGJveCcpLmFkZENsYXNzKCduby1mbGV4Ym94Jyk7XG5cdC8vICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnc3ZnIGlubGluZXN2ZyBzdmdjbGlwcGF0aHMnKS5hZGRDbGFzcygnbm8tc3ZnJyk7XG5cblx0dmFyIHNldEhlaWdodHMgPSBmdW5jdGlvbihlaCkge1xuXHRcdCQoZWgpLmVhY2goZnVuY3Rpb24oaSkge1xuXHRcdFx0dmFyIGVoSXRlbSA9ICQodGhpcykuZmluZCgnLmpzLWVoSXRlbScpLFxuXHRcdFx0XHRtYXhIZWlnaHQgPSAwO1xuXHRcdFx0JChlaEl0ZW0pLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcdFxuXHRcdFx0XG5cdFx0XHQkKGVoSXRlbSkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBlaEluc3RhbmNlID0gJCh0aGlzKSxcblx0XHRcdFx0XHRpdGVtSGVpZ2h0ID0gJChlaEluc3RhbmNlKS5vdXRlckhlaWdodCgpO1xuXHRcdFx0XHRpZiAoIGl0ZW1IZWlnaHQgPiBtYXhIZWlnaHQgKSB7XG5cdFx0XHRcdFx0bWF4SGVpZ2h0ID0gaXRlbUhlaWdodDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZihtYXhIZWlnaHQgIT0wKVxuXHRcdFx0XHQkKGVoSXRlbSkuaGVpZ2h0KG1heEhlaWdodCk7XG5cdFx0fSk7XG5cdH07XG5cblx0c2V0SGVpZ2h0cygnLmpzLWVoJyk7XG5cdFxuXHR3aW5kb3cub25SZXNpemVTZXRIZWlnaHQgPSBmdW5jdGlvbigpe1xuXHRcdHNldEhlaWdodHMoJy5qcy1laCcpO1xuXHR9OyBcblx0XG5cdHZhciBzdXBwb3J0c09yaWVudGF0aW9uQ2hhbmdlID0gXCJvbm9yaWVudGF0aW9uY2hhbmdlXCIgaW4gd2luZG93LFxuXHRcdG9yaWVudGF0aW9uRXZlbnQgPSBzdXBwb3J0c09yaWVudGF0aW9uQ2hhbmdlID8gXCJvcmllbnRhdGlvbmNoYW5nZVwiIDogXCJyZXNpemVcIjtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIob3JpZW50YXRpb25FdmVudCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0b25SZXNpemVTZXRIZWlnaHQoKTtcbiAgICB9LCBmYWxzZSk7XG5cdFxuXHQvLyQoIHdpbmRvdyApLmxvYWQob25SZXNpemVTZXRIZWlnaHQoKSk7XG5cdFxuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblx0XHRzZXRUaW1lb3V0KG9uUmVzaXplU2V0SGVpZ2h0KCksIDIwMDApO1xuXHR9KTtcblx0XG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XG5cdFx0c2V0VGltZW91dChvblJlc2l6ZVNldEhlaWdodCgpLCAyMDAwKTtcblx0fSk7XG5cbn0pKCBqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQgKTtcbiJdfQ==
