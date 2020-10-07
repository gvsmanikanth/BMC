"use strict";
use(function() {
    var overlayUrl = this.video.overlayUrl;
    if (overlayUrl.isEmpty())
        overlayUrl = '#';

    var overlayText = this.video.overlayText;
    if (overlayText.isEmpty()) {
        overlayText = 'Find out how BMC can help you. LINK-Contact a sales rep ›-LINK';
        overlayUrl = '/forms/contact-bmc.html';
    }else 
    {
    	//WEB-8912 Video Component - Overlay URL/Text Enhancements
        overlayText = 'LINK-'+overlayText+'-LINK'; 
   }

    overlayText = overlayText.replace('LINK-', "<a id='overlayLink' target='_top' href='" + overlayUrl + "'>");
    overlayText = overlayText.replace('-LINK', '</a>');

    return {
        overlayText: overlayText
    };
});