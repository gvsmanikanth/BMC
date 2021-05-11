/*! Sticky Header markup pattern. 
how-to:

*/
      
(function (jq) {
	
	function bmcStickyComp(){		
		//Local Variables 
		var stickyComp, stickyCompID, stickyHeight;
		//Configuration Variables
		var stickybar = jq('.stickyBar');
		var	stickyCompID = stickybar.attr('id');
		_stickyCompBackground =  stickybar.attr("data-background");
		_stickyCompPosition = stickybar.attr("data-position");
		//_stickyShowMode = stickybar.attr("data-showmode");			
		_stickyShowMode = 'repeat_mode';			
		_stickyDelay = typeCasting(parseInt(stickybar.attr("data-delay")));
		_stickyCookieExpiry = parseInt(stickybar.attr("data-cookieexpirydays"));
		//_stickyShowOnMobile = stickybar.attr("data-showonmobile");
		_stickyShowOnMobile = 'true';
		var viewportWidthBreakpoint = _stickyShowOnMobile == 'true' ? 0 : 767;	
		var isclosed = 'false';
		//Global Variables
		$window = jq(window);
		$htmlbody = jq("html body");	
		
		//Chaeck string value undefined or not.				
		function typeCasting(value) {
			if (typeof (value === "undefined" ? "" : value)) {
				return value;
			}
		}

		//initialize and wrap method
		function init() {
			init.called = true;
			stickyComp = stickybar;	
			stickCompShow();				
			// $.cookie(stickyCompID, true, {expires: _stickyCookieExpiry});
		}
	
		// Close icon behaviour
		jq(document).on("click",".close-stickyBar",function() {
			jq('#' + stickyCompID).fadeOut();
			$htmlbody.animate({
				marginTop: '0px'
			}, 1000);
			jq('.layout-header').animate({
				top: '0px'
			}, 1000);
			isclosed = 'true';
		});

		//
		function adjustCompBehaviour() {
			if (init.called) {
				stickyHeight = stickybar.height();
				$htmlbody.css('margin-top', +stickyHeight+'px');
				windowBreakpoint();					
			}
		}

		//Hide the Component with fading effect
		function stickCompHide() {
			if (stickyComp.length === 1) {
				jq('#' + stickyCompID).fadeOut();
				$htmlbody.css('margin-top', '0px');
				jq('.layout-header').css('top', '0px');
			}
		}
		
	
		//Show the Component
		function stickCompShow() {
			if (stickyComp.length === 1 && isclosed != 'true') {		
				if ($window.width() > viewportWidthBreakpoint) {
					stickyHeight = stickybar.height();
					jq('#' + stickyCompID).css('background', _stickyCompBackground);
					if(_stickyCompPosition === 'bottom'){
						$htmlbody.css('margin-top', '0px');
						jq('#' + stickyCompID).css({'top' : 'auto',	'bottom' : '0px' });
						jq('#' + stickyCompID).fadeIn();
					}else{
						jq('.layout-header').css('top', stickyHeight+'px');
						jq('#' + stickyCompID).fadeIn();
						$htmlbody.css('margin-top', +stickyHeight+'px');
						string = stickybar.attr('style');
						if(string.indexOf(';')){
							string = string.substr(0, string.indexOf(';')).trim();
							string = string.substr(0, string.indexOf(':')).trim();
						}
						if (string === 'bottom') {
							$htmlbody.css('margin-top', '0px');
						}
					}
					
				} 				
			}
		}
		
		function addRemoveScrollStatus() {
			var scrollPostion = jq($window).scrollTop();
			if(scrollPostion > 50 ) {
				jq('body').addClass('sticktBarScrollDown');
				stickCompHide();
			} else {
				jq('body').removeClass('sticktBarScrollDown');					
				stickCompShow();			
			}
		}
		//Check window resonsiveness
		function windowBreakpoint() {
			if (init.called) {
				if ($window.width() > viewportWidthBreakpoint  && isclosed != 'true') {
					stickCompShow();
				} else {
					stickCompHide();
				}
			}
		}
		//Trigger resize event
		jq($window).bind("resize", adjustCompBehaviour);

		//Trigger scroll event
		$window.scroll(function () {
			if (init.called) {	
				if ($window.width() > viewportWidthBreakpoint) {
					addRemoveScrollStatus();
				} else {
					stickCompHide();
				}			
										
			}
		});
		//Call main function after delay
		setTimeout(function(){
			init();
		}, _stickyDelay);
	}
	
	if (jq('.stickyBar').length > 0) {
		var	stickyShowMode = jq('.stickyBar').attr("data-showmode");
		var	specificPromoID = $.cookie(jq('.stickyBar').attr('id'));
				
		if (stickyShowMode === 'only_once') {
			if (specificPromoID != 'true') {
				bmcStickyComp();
			}else{
				jq('.stickyBar').hide();
			}
		} else {
			bmcStickyComp();
		}		
	}
}(jQuery));