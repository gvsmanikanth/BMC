/*******************************************************************************
 * ADOBE CONFIDENTIAL
 * __________________
 *
 * Copyright 2017 Adobe Systems Incorporated
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

(function ($, channel) {
    "use strict";

    window.CQ = window.CQ || {};

    window.CQ.XF = CQ.XF || {};

    window.CQ.XF.adjustRequiredFields = function ($dialog) {

        var switcherElement = $dialog.find("#xf-switcher-form");
        if (switcherElement.length == 1) {
            // Remove required from invisible fields
            var removeRequired = function () {
                switcherElement.find(".list-option-action-showhide-target.hide .xf-required-toggle")
                    .removeAttr("aria-required")
                    .removeAttr("required");
            };

            removeRequired();

            switcherElement.on("change", function () {
                // Toggle required based on field visibility
                switcherElement.find(".list-option-action-showhide-target .xf-required-toggle")
                    .attr("aria-required", true)
                    .attr("required", "required");
                removeRequired();
            });
        }
    };

    $(window).adaptTo("foundation-registry").register("foundation.form.response.parser", {
        selector: "*",
        contentType:"application/json",
        name:"foundation.form.json",
        handler: function(form, xhr, data) {
            // quickly check the data, see if it fits our structure
            if (typeof data["message"] === "undefined") {
                return false;
            }
            return {
                statusCode:xhr.status,
                message:data["message"]
            }
        }
    });

    channel.on("dialog-loaded", function (event) {
        var $dialog = event.dialog;

        var componentPathsField = $dialog.find("input[name='componentPaths']");
        var componentPaths = componentPathsField.length > 0 ? componentPathsField.val() : "";
        $.each(componentPaths.split("#"), function (idx, value) {
            $dialog.append("<input type='hidden' value='" + value + "' name='componentPath'/>");
        });

        CQ.XF.adjustRequiredFields($dialog);

    })

})(jQuery, jQuery(document));