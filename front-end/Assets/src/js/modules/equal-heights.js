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
	
	$(document).ready(function() {
		setTimeout(onResizeSetHeight(), 2000);
	});
	
	$(window).resize(function() {
		setTimeout(onResizeSetHeight(), 2000);
	});

})( jQuery, window, document );
