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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2VxdWFsLWhlaWdodHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyggZnVuY3Rpb24oICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdHZhciAkbSA9ICQoICcuanMtbWF0Y2gnICksXHJcblx0XHQkbWggPSAkKCAnLmpzLW1hdGNoSGVpZ2h0JyApLFxyXG5cdFx0bWF0Y2hIZWlnaHRzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBoZWlnaHQgPSAkbS5oZWlnaHQoKTtcclxuXHRcdFx0JG1oLmhlaWdodChoZWlnaHQpO1xyXG5cdFx0fTtcclxuXHJcblx0bWF0Y2hIZWlnaHRzKCk7XHJcblx0JCggd2luZG93ICkub24oICdyZXNpemUnLCBtYXRjaEhlaWdodHMgKTtcclxuXHJcblx0dmFyIHMgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgcyA9IHMuc3R5bGU7XHJcblx0Ly9pZiggcy53ZWJraXRGbGV4V3JhcCA9PSAnJyB8fCBzLm1zRmxleFdyYXAgPT0gJycgfHwgcy5mbGV4V3JhcCA9PSAnJyApIHJldHVybiB0cnVlO1xyXG5cdC8vICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnZmxleGJveCcpLmFkZENsYXNzKCduby1mbGV4Ym94Jyk7XHJcblx0Ly8gJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCdzdmcgaW5saW5lc3ZnIHN2Z2NsaXBwYXRocycpLmFkZENsYXNzKCduby1zdmcnKTtcclxuXHJcblx0dmFyIHNldEhlaWdodHMgPSBmdW5jdGlvbihlaCkge1xyXG5cdFx0JChlaCkuZWFjaChmdW5jdGlvbihpKSB7XHJcblx0XHRcdHZhciBlaEl0ZW0gPSAkKHRoaXMpLmZpbmQoJy5qcy1laEl0ZW0nKSxcclxuXHRcdFx0XHRtYXhIZWlnaHQgPSAwO1xyXG5cdFx0XHQkKGVoSXRlbSkuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1x0XHJcblx0XHRcdFxyXG5cdFx0XHQkKGVoSXRlbSkuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGVoSW5zdGFuY2UgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0aXRlbUhlaWdodCA9ICQoZWhJbnN0YW5jZSkub3V0ZXJIZWlnaHQoKTtcclxuXHRcdFx0XHRpZiAoIGl0ZW1IZWlnaHQgPiBtYXhIZWlnaHQgKSB7XHJcblx0XHRcdFx0XHRtYXhIZWlnaHQgPSBpdGVtSGVpZ2h0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdGlmKG1heEhlaWdodCAhPTApXHJcblx0XHRcdFx0JChlaEl0ZW0pLmhlaWdodChtYXhIZWlnaHQpO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0c2V0SGVpZ2h0cygnLmpzLWVoJyk7XHJcblx0XHJcblx0d2luZG93Lm9uUmVzaXplU2V0SGVpZ2h0ID0gZnVuY3Rpb24oKXtcclxuXHRcdHNldEhlaWdodHMoJy5qcy1laCcpO1xyXG5cdH07IFxyXG5cdFxyXG5cdHZhciBzdXBwb3J0c09yaWVudGF0aW9uQ2hhbmdlID0gXCJvbm9yaWVudGF0aW9uY2hhbmdlXCIgaW4gd2luZG93LFxyXG5cdFx0b3JpZW50YXRpb25FdmVudCA9IHN1cHBvcnRzT3JpZW50YXRpb25DaGFuZ2UgPyBcIm9yaWVudGF0aW9uY2hhbmdlXCIgOiBcInJlc2l6ZVwiO1xyXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKG9yaWVudGF0aW9uRXZlbnQsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0b25SZXNpemVTZXRIZWlnaHQoKTtcclxuICAgIH0sIGZhbHNlKTtcclxuXHRcclxuXHQvLyQoIHdpbmRvdyApLmxvYWQob25SZXNpemVTZXRIZWlnaHQoKSk7XHJcblx0XHJcblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblx0XHRzZXRUaW1lb3V0KG9uUmVzaXplU2V0SGVpZ2h0KCksIDIwMDApO1xyXG5cdH0pO1xyXG5cdFxyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHRzZXRUaW1lb3V0KG9uUmVzaXplU2V0SGVpZ2h0KCksIDIwMDApO1xyXG5cdH0pO1xyXG5cclxufSkoIGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCApO1xyXG4iXX0=
