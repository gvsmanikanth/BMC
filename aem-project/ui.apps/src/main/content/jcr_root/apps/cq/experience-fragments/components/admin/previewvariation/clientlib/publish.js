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
        var windowUI = $(window).adaptTo("foundation-ui");
        windowUI.wait();
        var resource = window.location.pathname.split("html")[1] + "/jcr:content";
        var url = resource + ".socialurls.json";
        var buttons = [
            {elem: $("#sm-publish-action"), action: 'publishUrl'},
            {elem: $("#sm-delete-action"), action: 'deleteUrl'},
            {elem: $("#sm-smlink-action"), action: 'smLink'}
        ];

        $('#shell-propertiespage-closeactivator').click(function () {
            window.close();
        });

        var checkConfiguration = function () {
            windowUI.prompt(Granite.I18n.get("Preview variation"),
                Granite.I18n.get("Variation cannot be published to social media network. Please check cloud services in your page properties configuration again."),
                "info",
                [
                    {text: Granite.I18n.get("Ok"), id: "ok"}
                ]
            );
        };

        var isSSLEnabled = function () {
          return window.location.protocol.indexOf("https:") == 0;
        };

        var isPinterest = function (data) {
            var pinterestApi = "https://api.pinterest.com/oauth";
            return typeof data == "object" && (data.publishUrl.indexOf(pinterestApi) == 0 || data.deleteUrl.indexOf(pinterestApi) == 0);
        }

        var attachButtonActions = function(data){
            var actionsAvailable = false;
            buttons.forEach(function (button) {
                if (data[button.action]) {
                    button.elem.click(function () {
                        button.action == 'smLink' ? window.open(data[button.action]) : window.location = data[button.action];
                    });
                } else {
                    button.elem.attr("disabled", true);
                }
                if (data[button.action] && data[button.action] !== "") actionsAvailable = true;
            });
            return actionsAvailable;
        }

        $.ajax({
            type: "GET",
            url: url,
            success: function (data) {
                if (isPinterest(data) && !isSSLEnabled()) {
                    windowUI.prompt(Granite.I18n.get("Preview variation"),
                        Granite.I18n.get("Pinterest actions are available only on HTTP over SSL enabled servers (HTTPS)."),
                        "info",
                        [
                            {text: Granite.I18n.get("Ok"), id: "ok"}
                        ]
                    );
                  data = {};
                  attachButtonActions(data);
                } else {
                    var actionsAvailable = attachButtonActions(data);
                    if (!actionsAvailable) {
                        checkConfiguration();
                    }
                }
                windowUI.clearWait();
            },
            error: function () {
                windowUI.clearWait();
                buttons.forEach(function (button) {
                    button.elem.attr("disabled", true);
                });
                checkConfiguration();
            }
        });


        var getParameter = function getParameter(key) {
            var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
            return result && decodeURIComponent(result[1]) || "";
        };

        if (getParameter("published") == "true") {
            windowUI.prompt(Granite.I18n.get("Publish"),
                Granite.I18n.get("Variation was published successfully."),
                "success",
                [
                    {text: Granite.I18n.get("Ok"), id: "ok"}
                ]
            );
        } else if (getParameter("published")) {
            windowUI.prompt(Granite.I18n.get("Publish"),
                Granite.I18n.get("Variation publishing failed. Error: " + getParameter("published")),
                "error",
                [
                    {text: Granite.I18n.get("Ok"), id: "ok"}
                ]
            );
        }

        if (getParameter("deleted") == "true") {
            windowUI.prompt(Granite.I18n.get("Publish"),
                Granite.I18n.get("Variation was deleted successfully."),
                "success",
                [
                    {text: Granite.I18n.get("Ok"), id: "ok"}
                ]
            );
        } else if (getParameter("deleted")) {
            var reason = getParameter("deleted");
            if (reason == "Not found.") {
                reason = Granite.I18n.get("The post was not found on social media. The post will be unlinked from the experience fragment variation.");
                windowUI.prompt(Granite.I18n.get("Publish"),
                    Granite.I18n.get(reason),
                    "warning",
                    [
                        {text: Granite.I18n.get("Ok"), id: "ok"}
                    ]
                );
            } else {
                reason = Granite.I18n.get("Error: ") + reason;
                windowUI.prompt(Granite.I18n.get("Publish"),
                    Granite.I18n.get("Variation deleting failed. " + reason),
                    "error",
                    [
                        {text: Granite.I18n.get("Ok"), id: "ok"}
                    ]
                );
            }
        }

        var currentURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({path: currentURL}, '', currentURL);

    });
})(jQuery);