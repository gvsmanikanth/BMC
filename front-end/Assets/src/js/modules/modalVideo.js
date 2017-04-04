/**
 * modalVideo.js
 * 
 * On window load look for # tag with video id. if found launch in modal window.
 * Expects the following markup:
 * 
 * URL with #vid=
 * Located inside http://www.bmc.com/templates/Media_Video_Mobile folder. 
 */

(function($) {
	
	function getHashValue(key) {
		  var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
		  return matches ? matches[1] : null;
		}

	$(window).on('load', function(){
		var hash = window.location.hash.substring(1);
		if (hash != '') {
			
			var type = getHashValue("vType");
			var fallbackType = getHashValue("vID");
			
			if(type == "yt"){

				var urlRef = './youtube-video-modal.php?'+hash;
		    	
		    	if(this.bmcMeta && typeof(bmcMeta) !== "undefined" && typeof(bmcMeta.site)!== "undefined" && typeof(bmcMeta.site.environment) !== "undefined"){
		    		urlRef = '/templates/Media_Video_Mobile?'+hash;
				}
				 $.fancybox({
					width: window.getVideoHeightWidth_16X9().width,
					height: window.getVideoHeightWidth_16X9().height,
					href: urlRef,
					aspectRatio: true,
					type: 'iframe',
					loop: false,
					padding: 0,
					autoSize : true,
					overlayShow : true,
			        centerOnScroll : true,
					iframe: {
						preload: false
					}
			    });
					 
			} else if(type == "t-age" || fallbackType){
				$.fancybox({
				width: 690,
				height: 445,
				aspectRatio: true,
				type: 'iframe',
				loop: false,
				padding: 0,
				iframe: {
					preload: false
				},
				href: 'http://www.bmc.com/templates/Media_Video_Mobile?'+hash
			});
			}
		};
		
		$('.modal-video-player').on('click', function(e) {
				var hashValue = this.href.split("?");
				if (hashValue[1])
					window.location.hash = hashValue[1]+"&vType=t-age";
		});
		
		$('.modal-youtube-video-player').on('click', function(e) {
				var hashValue = this.href.split("?");
				if (hashValue[1])
					window.location.hash = hashValue[1]+"&vType=yt";
		});
	});

})(jQuery);


