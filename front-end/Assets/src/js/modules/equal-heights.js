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
