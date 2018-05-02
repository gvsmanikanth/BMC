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
	
	var setHeadingHeight = function(eh) {
		$(eh).each(function(i) {
			var headingItem = $(this).find('.title .heading'),
				maxHeadingHeight = 0;
			$(headingItem).css('height', 'auto');	
			
			$(headingItem).each( function() {
				var ehInstance = $(this),
					itemHeight = $(ehInstance).outerHeight();
				if ( itemHeight > maxHeadingHeight ) {
					maxHeadingHeight = itemHeight;
				}
			});
			if(maxHeadingHeight !=0)
				$(headingItem).height(maxHeadingHeight);
		});
	};

	setHeights('.js-eh');
	setHeadingHeight('.js-eh');
	
	window.onResizeSetHeight = function(){ 
		setHeights('.js-eh');
		setHeadingHeight('.js-eh');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2VxdWFsLWhlaWdodHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoIGZ1bmN0aW9uKCAkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgJG0gPSAkKCAnLmpzLW1hdGNoJyApLFxuXHRcdCRtaCA9ICQoICcuanMtbWF0Y2hIZWlnaHQnICksXG5cdFx0bWF0Y2hIZWlnaHRzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaGVpZ2h0ID0gJG0uaGVpZ2h0KCk7XG5cdFx0XHQkbWguaGVpZ2h0KGhlaWdodCk7XG5cdFx0fTtcblxuXHRtYXRjaEhlaWdodHMoKTtcblx0JCggd2luZG93ICkub24oICdyZXNpemUnLCBtYXRjaEhlaWdodHMgKTtcblxuXHR2YXIgcyA9IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBzID0gcy5zdHlsZTtcblx0Ly9pZiggcy53ZWJraXRGbGV4V3JhcCA9PSAnJyB8fCBzLm1zRmxleFdyYXAgPT0gJycgfHwgcy5mbGV4V3JhcCA9PSAnJyApIHJldHVybiB0cnVlO1xuXHQvLyAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ2ZsZXhib3gnKS5hZGRDbGFzcygnbm8tZmxleGJveCcpO1xuXHQvLyAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ3N2ZyBpbmxpbmVzdmcgc3ZnY2xpcHBhdGhzJykuYWRkQ2xhc3MoJ25vLXN2ZycpO1xuXG5cdHZhciBzZXRIZWlnaHRzID0gZnVuY3Rpb24oZWgpIHtcblx0XHQkKGVoKS5lYWNoKGZ1bmN0aW9uKGkpIHtcblx0XHRcdHZhciBlaEl0ZW0gPSAkKHRoaXMpLmZpbmQoJy5qcy1laEl0ZW0nKSxcblx0XHRcdFx0bWF4SGVpZ2h0ID0gMDtcblx0XHRcdCQoZWhJdGVtKS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XHRcblx0XHRcdFxuXHRcdFx0JChlaEl0ZW0pLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgZWhJbnN0YW5jZSA9ICQodGhpcyksXG5cdFx0XHRcdFx0aXRlbUhlaWdodCA9ICQoZWhJbnN0YW5jZSkub3V0ZXJIZWlnaHQoKTtcblx0XHRcdFx0aWYgKCBpdGVtSGVpZ2h0ID4gbWF4SGVpZ2h0ICkge1xuXHRcdFx0XHRcdG1heEhlaWdodCA9IGl0ZW1IZWlnaHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYobWF4SGVpZ2h0ICE9MClcblx0XHRcdFx0JChlaEl0ZW0pLmhlaWdodChtYXhIZWlnaHQpO1xuXHRcdH0pO1xuXHR9O1x0XG5cdFxuXHR2YXIgc2V0SGVhZGluZ0hlaWdodCA9IGZ1bmN0aW9uKGVoKSB7XG5cdFx0JChlaCkuZWFjaChmdW5jdGlvbihpKSB7XG5cdFx0XHR2YXIgaGVhZGluZ0l0ZW0gPSAkKHRoaXMpLmZpbmQoJy50aXRsZSAuaGVhZGluZycpLFxuXHRcdFx0XHRtYXhIZWFkaW5nSGVpZ2h0ID0gMDtcblx0XHRcdCQoaGVhZGluZ0l0ZW0pLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcdFxuXHRcdFx0XG5cdFx0XHQkKGhlYWRpbmdJdGVtKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGVoSW5zdGFuY2UgPSAkKHRoaXMpLFxuXHRcdFx0XHRcdGl0ZW1IZWlnaHQgPSAkKGVoSW5zdGFuY2UpLm91dGVySGVpZ2h0KCk7XG5cdFx0XHRcdGlmICggaXRlbUhlaWdodCA+IG1heEhlYWRpbmdIZWlnaHQgKSB7XG5cdFx0XHRcdFx0bWF4SGVhZGluZ0hlaWdodCA9IGl0ZW1IZWlnaHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYobWF4SGVhZGluZ0hlaWdodCAhPTApXG5cdFx0XHRcdCQoaGVhZGluZ0l0ZW0pLmhlaWdodChtYXhIZWFkaW5nSGVpZ2h0KTtcblx0XHR9KTtcblx0fTtcblxuXHRzZXRIZWlnaHRzKCcuanMtZWgnKTtcblx0c2V0SGVhZGluZ0hlaWdodCgnLmpzLWVoJyk7XG5cdFxuXHR3aW5kb3cub25SZXNpemVTZXRIZWlnaHQgPSBmdW5jdGlvbigpeyBcblx0XHRzZXRIZWlnaHRzKCcuanMtZWgnKTtcblx0XHRzZXRIZWFkaW5nSGVpZ2h0KCcuanMtZWgnKTtcblx0fTsgXG5cdFxuXHR2YXIgc3VwcG9ydHNPcmllbnRhdGlvbkNoYW5nZSA9IFwib25vcmllbnRhdGlvbmNoYW5nZVwiIGluIHdpbmRvdyxcblx0XHRvcmllbnRhdGlvbkV2ZW50ID0gc3VwcG9ydHNPcmllbnRhdGlvbkNoYW5nZSA/IFwib3JpZW50YXRpb25jaGFuZ2VcIiA6IFwicmVzaXplXCI7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKG9yaWVudGF0aW9uRXZlbnQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdG9uUmVzaXplU2V0SGVpZ2h0KCk7XG4gICAgfSwgZmFsc2UpO1xuXHRcblx0Ly8kKCB3aW5kb3cgKS5sb2FkKG9uUmVzaXplU2V0SGVpZ2h0KCkpO1xuXHRcblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cdFx0c2V0VGltZW91dChvblJlc2l6ZVNldEhlaWdodCgpLCAyMDAwKTtcblx0fSk7XG5cdFxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuXHRcdHNldFRpbWVvdXQob25SZXNpemVTZXRIZWlnaHQoKSwgMjAwMCk7XG5cdH0pO1xuXG59KSggalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50ICk7XG4iXX0=
