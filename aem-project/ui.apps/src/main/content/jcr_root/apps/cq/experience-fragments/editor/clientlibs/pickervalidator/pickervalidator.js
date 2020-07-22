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

(function ($, ns, channel, window, undefined) {

    var currentVariation = Granite.HTTP.getPath().replace(new RegExp(".+\\.html"), "");
    var xfVariantType = "cq:xfVariantType";

    channel.on("dialog-loaded", function () {

        var itselfError = Granite.I18n.get("The edited variation cannot include itself.");
        var containsItselfError = Granite.I18n.get("The edited variation cannot include a variation that contains the edited variation.");

        var $windowUI = $(window).adaptTo("foundation-ui");
        var $xfPicker = $("#xfPicker");
        $xfPicker.on("change", function (event) {
            $xfPicker.setCustomValidity()

            var variation = $(event.target).val();
            if (variation == currentVariation) {
                $xfPicker.setCustomValidity(itselfError);
            }

            $windowUI.wait();
            $.ajax(variation + "/jcr:content.2.json", {method: "GET"})
                .success(function (data) {
                    if (data.root) {
                        // Look for current variation on root level children
                        for (var key in data.root) {
                            if (data.root[key]["fragmentPath"] == currentVariation) {
                                $xfPicker.setCustomValidity(containsItselfError)
                                break;
                            }
                        }
                    }
                })
                .always(function () {
                    $windowUI.clearWait();
                    $xfPicker.updateErrorUI()
                });
        })

    });

})(jQuery, Granite.author, jQuery(document), this);