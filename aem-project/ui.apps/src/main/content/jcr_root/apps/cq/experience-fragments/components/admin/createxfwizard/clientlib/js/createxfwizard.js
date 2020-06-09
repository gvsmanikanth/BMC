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

;(function($) {

    $(function(){
        var $wizardForm = $("#createxf");

        var focusInFirstStep = function () {
            setTimeout(function () {
                $wizardForm.find(("input[type='text']:first")).focus();
            }, 200);
        };
        focusInFirstStep();

        $("#createxfwizard-back").click(function () {
            focusInFirstStep();
        });

        var $pageNameField=$wizardForm.find("#page-title");
        $pageNameField.on("change", function(){
            var $variantNameField = $wizardForm.find("#variant-title");
            $variantNameField.val($pageNameField.val());
        });

        // Enter event
        var keyDown = new CustomEvent("keydown");
        keyDown.keyCode = 13;

        var windowUI = $(window).adaptTo("foundation-ui");
        var $tags = $('#variant-tags');
        var clearTags = function () {
            $tags.find("coral-tag button").click();
        }

        $("#page-template").on("foundation-selections-change", function (e) {
            var template = $(e.target).find("[selected]").attr("data-foundation-collection-item-id");
            if(template){
                var url = template + "/initial/jcr:content.json";
                windowUI.wait();

                // Add template name and tags
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function (data) {
                        var tags = data['cq:tags'];
                        if (tags) {
                            clearTags();
                            tags.forEach(function (tag) {
                                $.ajax({
                                    type: "GET",
                                    url: "/etc/tags/" + tag.replace(":", "/") + ".tag.json",
                                    success: function (data) {
                                        tagDisplayName = data.titlePath;
                                        $tags.find('input:first').val(tag)[0].dispatchEvent(keyDown);
                                        if (tagDisplayName) {
                                            $tags.find("coral-tag coral-tag-label").text(tagDisplayName);
                                        }
                                    }
                                });

                            });
                        } else {
                            clearTags();
                        }
                        windowUI.clearWait();
                    },
                    error: function () {
                        windowUI.clearWait();
                    }
                });
            }
        });
    });

})(jQuery);