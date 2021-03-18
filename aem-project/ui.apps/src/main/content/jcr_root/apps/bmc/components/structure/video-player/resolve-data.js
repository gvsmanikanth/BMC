"use strict";
use(function() {
    var overlayUrl = this.video.overlayUrl;
    var overlayText = this.video.overlayText;
    var learnMore = this.video.learnMore;

	  //WEB-8912 Video Component - Overlay URL/Text Enhancements
  	if (overlayUrl.isEmpty() || overlayText.isEmpty()) {
        overlayText = 'Find out how BMC can help you. LINK-Contact a sales rep ›-LINK';
        overlayUrl = '/forms/contact-bmc.html';
    } else {

         overlayText = 'LINK-'+overlayText+'-LINK';
    }
    //WEB-9202 Video Component Enhancements
    if(learnMore == true)
    {
       	learnMore = 'learn-more';
    }else {
    	learnMore = '';
    }

    overlayText = overlayText.replace('LINK-', "<a id='overlayLink' target='_top' href='" + overlayUrl + "' class = '"+ learnMore +"'>");
    overlayText = overlayText.replace('-LINK', '</a>');

    return {
        overlayText:  overlayText
    };
});