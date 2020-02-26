/*******************************************************************************
 * ADOBE CONFIDENTIAL
 * __________________
 *
 * Copyright 2016 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 ******************************************************************************/

;
(function($, ns){

    var MSG_NO_FRAGMENT_PATH = Granite.I18n.get("The experience fragment doesn't have an associated variation");

    ns.experienceFragments.actions.editInNewTab = function() {
        var ui = $(window).adaptTo("foundation-ui");
        $.get(this.path + ".json")
            .then(function(response) {
                if (typeof response["fragmentPath"] !== "undefined") {
                    window.open(Granite.HTTP.externalize("/editor.html" + response["fragmentPath"] + ".html"));
                } else {
                    ui.notify("", MSG_NO_FRAGMENT_PATH , "notice");
                }
            });
    }

})(jQuery, Granite.author);