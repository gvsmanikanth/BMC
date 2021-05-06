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

				var urlRef = '/content/bmc/videos.html?'+hash;

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
					},
					// Added for WEB-9481
					afterClose : function(){						
						function removeURLParameter(url, parameter) {
							var urlparts = url.split('#'); 
							if(urlparts == url)
								return '';  
							else if (urlparts.length >= 2) {
						
								var prefix = encodeURIComponent(parameter) + '=';
								var pars = urlparts[1].split(/[&;]/g);
						
								//reverse iteration
								for (var i = pars.length; i-- > 0;) {    
									//idiom for string.startsWith
									if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
										pars.splice(i, 1);
									}
								}
						
								return (pars.length > 0 ? '#' + pars.join('&') : '');
							}					
	
							return url;
						}
						let finalHash = removeURLParameter(removeURLParameter(window.location.href, 'vID'), 'vType');
						
						//Changing the url in the addressbar
						history.pushState("", document.title, window.location.pathname + finalHash);
						
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
				href: '/content/bmc/videos.html?'+hash
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
