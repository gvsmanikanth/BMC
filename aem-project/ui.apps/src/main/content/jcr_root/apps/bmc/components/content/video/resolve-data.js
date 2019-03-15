"use strict";
use(function() {
    var overlayUrl = this.video.overlayUrl;
    if (overlayUrl.isEmpty())
        overlayUrl = '#';

    var overlayText = this.video.overlayText;
    if (overlayText.isEmpty()) {
        overlayText = 'Find out how BMC can help you. LINK-Contact a sales rep ›-LINK';
        overlayUrl = '/forms/contact-bmc.html';
    }

    overlayText = overlayText.replace('LINK-', "<a id='overlayLink' href='" + overlayUrl + "'>");
    overlayText = overlayText.replace('-LINK', '</a>');

    return {
        overlayText: overlayText
    };
});