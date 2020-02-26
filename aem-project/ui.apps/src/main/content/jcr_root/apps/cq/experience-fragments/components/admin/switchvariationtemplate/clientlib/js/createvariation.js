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

;(function ($) {
    $(function () {

        // Enter event
        var keyDown = new CustomEvent("keydown");
        keyDown.keyCode = 13;

        var windowUI = $(window).adaptTo("foundation-ui");

        $(document).on("coral-overlay:open", function () {
            var $template = $("#page-template");
            if ($template.length == 1) {
                $template.on("change", function () {
                    setTimeout(function () {
                        var template = $template.find("input").val();
                        var url = template + "/initial/jcr:content.json";
                        var $tags = $('#variant-tags');
                        var clearTags = function () {
                            $tags.find("coral-tag button").click();
                        }

                        windowUI.wait();

                        // Add template name and tags
                        $.ajax({
                            type: "GET",
                            url: url,
                            success: function (data) {
                                var tags = data['cq:tags']
                                var title = data['jcr:title'];
                                $("#variant-title").val(title).trigger("change");

                                if (tags) {
                                    clearTags();
                                    tags.forEach(function (tag) {
                                        $.ajax({
                                            type: "GET",
                                            url:  "/etc/tags/" + tag.replace(":", "/") + ".tag.json",
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

                    });

                });
            }
        });

    });
})(jQuery);