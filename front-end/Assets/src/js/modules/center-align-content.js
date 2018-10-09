;( function( $, window, document, undefined ) {
	'use strict';

	var centerAlignContent = function() {
		
		if($(".js-content-center") && $(".js-content-center-item")){
			var compHeight = $(".js-content-center").innerHeight();
			var contentHeight = $(".js-content-center-item").innerHeight();
			$('.js-content-center-item').css('margin-top', (compHeight-contentHeight)/2);
			$('.js-content-center-item').css('margin-bottom', (compHeight-contentHeight)/2);
		} 
	};
	
	centerAlignContent();
	$( window ).on( 'resize', centerAlignContent );

})( jQuery, window, document );
