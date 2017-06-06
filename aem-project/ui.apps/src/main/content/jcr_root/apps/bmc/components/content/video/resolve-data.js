"use strict";
use(function() {
    var overlayUrl = this.video.overlayUrl;
    if (overlayUrl === '')
        overlayUrl = '#';

    var overlayText = this.video.overlayText;
    if (overlayText === '') {
        overlayText = 'Find out how BMC can help you. LINK-Contact a sales rep ›-LINK';
        overlayUrl = 'http://www.bmc.com/forms/ESM_ContactCenter_ContactRequest_BMCcom_EN_Jan2014.html';
    }

    overlayText = overlayText.replace('LINK-', "<a id='overlayLink' href='" + overlayUrl + "'>");
    overlayText = overlayText.replace('-LINK', '</a>');

    return {
        overlayText: overlayText
    };
});