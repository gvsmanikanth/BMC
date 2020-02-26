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

/*
 Handles the variations side-panel in the XF editor
 */

(function ($, ns, channel) {

    var debugEnabled = true;

    function _debug(msg) {
        if (debugEnabled) {
            console.log(msg);
        }
    }

    // constants for DOM elements
    var EL_INDEX_CONTAINER = "li.variation-list-item",
        CL_IS_ACTIVE = "is-active",
        EL_ACTIVE_INDEX = EL_INDEX_CONTAINER + "." + CL_IS_ACTIVE;

    var CREATE_PAGE_WIZARD_PATH = "/libs/cq/experience-fragments/content/experience-fragments/createpagewizard.html",
        CREATE_LC_WIZARD_PATH = "/mnt/overlay/cq/experience-fragments/content/experience-fragments/createlivecopywizard.html";

    var listItemTemplate = "<li class=\"variation-list-item\" data-variation-path=\"{{variationPath}}\" data-variation-title=\"{{variationTitle}}\">"
        + "<span class=\"variation\"> <span class=\"variation-title\" title=\"{{variationTitle}}\"><coral-icon icon=\"viewOn\" size=\"S\" aria-label=\"view on\"></coral-icon>{{variationTitle}}</span>"
        + "<span class=\"variation-actions\"><coral-buttongroup class=\"variations-quick-actions\" name=\"button-group\">" +
        "<button is=\"coral-button\" data-action-id=\"js-action-rename\" variant=\"quiet\" icon=\"edit\" iconSize=\"S\">" +
        "</button><button is=\"coral-button\" data-action-id=\"js-action-delete\" variant=\"quiet\" icon=\"delete\" iconSize=\"S\">" +
        "</button></coral-buttongroup></span></li>";

    /**
     * Retrieves the parent page of the variation at the specified path. This is done by some substring magic
     */
    function getParentPath(pagePath) {
        return pagePath.substring(0, pagePath.lastIndexOf("/"));
    }


    /**
     * The variant rename action handler
     * @param event
     */
    var variantRename = function (event) {
        event.stopPropagation();

        var $target = $(event.target);
        var $variation = $target.closest(EL_INDEX_CONTAINER);
        var variationTitle = _g.XSS.getXSSValue($variation.attr("data-variation-title")) || "";
        var ui = $(window).adaptTo("foundation-ui");

        promptRename(ui, variationTitle, true);
    };

    /**
     * Handles the variation delete action
     * @param event
     */
    var variantDelete = function (event) {
        _debug("Delete variant action called");
        event.stopPropagation();

        var $target = $(event.target);
        var $variation = $target.closest(EL_INDEX_CONTAINER);
        var variationPath = $variation.data('variation-path');
        var variationTitle = $variation.data("variation-title");
        var ui = $(window).adaptTo("foundation-ui");

        // check if the variant is referenced somewhere
        var isReferenced = false;

        var message = Granite.I18n.get("The following variation will be removed: ") + variationTitle;

        // prompt the user
        ui.prompt(Granite.I18n.get("Delete variation"),
            message,
            "error",
            [
                {
                    text: Granite.I18n.get("Cancel"),
                    id: "no"
                },
                {
                    text: Granite.I18n.get(isReferenced ? "Force Delete" : "Delete"),
                    id: "yes",
                    warning: true
                }
            ], function (btnId) {
                if (btnId === "yes") {
                    // call a custom servlet to delete variation
                    var parentXf = getParentPath(variationPath);
                    var deleteVariationUrl = parentXf + "/jcr:content.deletevariation.json";

                    _debug("Call " + deleteVariationUrl);
                    $.ajax(deleteVariationUrl, {
                        "method": "POST",
                        "data": {
                            "variationPath": variationPath
                        }
                    }).done(function (response) {
                        $variation.remove();
                        $("ul.variations-list li:first-child").click();
                        ui.notify(null, Granite.I18n.get("Variation <b>{0}</b> has been removed.", [variationTitle]), "success");
                    }).error(function (response) {

                    });
                }
            });

    };

    // TODO switch to coral dialog
    function promptRename(ui, variationTitle, isNotInvalid) {
        ui.prompt(Granite.I18n.get("Rename Variation"),
            '<form id="renameVariation" class="coral-Form coral-Form--vertical foundation-layout-util-maximized-container foundation-form">' +
            '<div class="coral-Form-fieldwrapper">' +
            '<label class="coral-Form-fieldlabel">' + Granite.I18n.get("Title") + ' *</label>' +
            '<input type="text" name="variationTitle" value="' + (isNotInvalid ? variationTitle : "") + '" class="coral-Form-field coral-Textfield" aria-required="true" >' +
            '</div>' +
            '</form>',
            "",
            [{
                text: Granite.I18n.get("Cancel"),
                id: "no"
            },
                {
                    text: Granite.I18n.get("Rename"),
                    id: "rename",
                    primary: true
                }],
            function (btnId) {
                var form = $("#renameVariation");
                var newTitle = $('#renameVariation [name="variationTitle"]').val();

                if (btnId === "rename") {
                    _debug("Renaming variation...");
                    if (newTitle == variationTitle) {
                        // same title, nothing's changed. Just return
                        return;
                    }
                    if (isValid(form)) {
                        _debug("Form is valid, let's POST data");
                        // find the actual item
                        var variationItem = $(EL_ACTIVE_INDEX);
                        var variationPath = variationItem.data("variation-path");

                        _debug("POSTing data to " + variationPath);
                        $.ajax(variationPath + "/jcr:content", {
                            method: "POST",
                            dataType: "json",
                            data: {
                                'jcr:title': newTitle,
                                _charset_: "utf-8"
                            },
                            success: function (data) {
                                _debug("Setting title in DOM...");
                                var setTitle = function (item, title) {
                                    item.attr("data-variation-title", title);
                                    var titleItem = item.find('.variation-title');
                                    var $icon = titleItem.find("coral-icon");
                                    titleItem.empty();
                                    titleItem.append($icon)
                                        .attr("title", title)
                                        .append(title);

                                    $("html title").text(title);
                                    $("#Content .editor-GlobalBar-pageTitle").text(title)
                                };
                                setTitle(variationItem, newTitle);

                                ui.notify(null, Granite.I18n.get("Variation <b>{0}</b> has been renamed to <b>{1}</b>.", [variationTitle, newTitle]));
                            },
                            error: function (xhr, status, error, a, b, c, d, e) {
                                // TODO: find a better parsing method
                                ui.alert(Granite.I18n.get("Error"), $(xhr.responseText)[3].innerHTML, "error");
                            }
                        });

                    } else {
                        _debug("Form is not valid for some reason");
                    }
                }
            });
    }

    function isValid(container) {
        _debug("Checking if form is valid " + container);
        return Array.prototype.every.call(container.find(":-foundation-submittable"), function (v) {
            _debug("Checking " + v);
            var api = $(v).adaptTo("foundation-validation");
            var state = api.getValidity();

            if (state.isValidated()) {
                return state.isValid();
            } else {
                return api.checkValidity();
            }
        });
    }

    /**
     * Marks the provided list item (variation) as active
     * @param $listItem
     */
    function markActive($listItem) {

        if (typeof $listItem.data("variation-ismaster") !== "undefined") {
            $listItem.find("coral-buttongroup [data-action-id='js-action-delete']").hide();
        } else {
            $listItem.find("coral-buttongroup [data-action-id='js-delete-action']").show();
        }

        $listItem.addClass(CL_IS_ACTIVE);
    }

    /**
     * Adds a variation to the list in the side-panel
     * @param variationPath the path to the variation. This will be the value of data-variation-path attribute.
     * @param variationTitle the variation title. This will be the value of data-variation-title attribute.
     */
    function addVariationToList(variationPath, variationTitle) {
        var $indexContainer = $("ul.variations-list");
        var template = Handlebars.compile(listItemTemplate);
        var data = {
            variationPath: variationPath,
            variationTitle: variationTitle
        };
        $indexContainer.append(template(data));
        reloadVariationsList(variationPath);
        $("li.variation-list-item.is-active").click();
    }

    /**
     * Reloads the variation list, setting the provided variation as active
     * @param activeVariationPath {String} the path of the active variation
     */
    function reloadVariationsList(activeVariationPath) {
        var list = $("li.variation-list-item");
        $.each(list, function (idx, element) {
            var $element = $(element);
            if ($element.data("variation-path") == activeVariationPath) {
                markActive($element);
            } else {
                $element.removeClass(CL_IS_ACTIVE);
            }
        })
    }

    var actionHandlers = {
        "js-action-rename": variantRename,
        "js-action-delete": variantDelete
    };

    function _getActiveVariationData() {
        var $activeVariation = $(EL_ACTIVE_INDEX);
        var parentPath = getParentPath($activeVariation.data("variation-path")),
            variationTitle = $activeVariation.data("variation-title"),
            variationPath = $activeVariation.data("variation-path");

        return {
            parentPath:parentPath,
            variationTitle:variationTitle,
            variationPath:variationPath
        }
    }

    var openVariationCreationDialog = function (dialogPath, data) {
        if (typeof data == "undefined") {
            return;
        }
        var dialogUrl = Granite.HTTP.externalize(dialogPath),
            dlg = new ns.ui.Dialog({
                getConfig: function () {
                    return {
                        src: dialogUrl,
                        loadingMode: "auto",
                        layout: "auto"
                    }
                },
                getRequestData: function () {
                    return {
                        currentPage: ns.ContentFrame.contentURL,
                        parentPath: data["parentPath"],
                        currentPageTitle: data["currentPageTitle"],
                        selectedVariation: data["selectedVariation"]
                    }
                },
                onSuccess: function () {

                },
                onReady: function () {
                    var overrideAction = data["formAction"];

                    if (typeof overrideAction !== "undefined") {
                        var $dialog = ns.DialogFrame.currentFloatingDialog;
                        var $form = $dialog.find("form");

                        $form.attr("action", overrideAction);
                        var sourcePathField = $form.find("input[name='srcPath']"),
                            sourceTitleField = $form.find("input[name='source']"),
                            currentPage = data["selectedVariation"];

                        sourceTitleField.val(data["currentPageTitle"]);
                        sourcePathField.val(currentPage)
                    }

                }
            });

        ns.DialogFrame.openDialog(dlg);

    };

    /* Handle switching to different variations */
    channel.on('click', "li.variation-list-item", function () {
        var $target = $(this),
            pagePath = $target.data("variation-path");

        ns.ContentFrame.load(Granite.HTTP.getContextPath() + pagePath + ".html");
        reloadVariationsList(pagePath);

    });

    /* When the document is ready "click" on the active
     variation to show the actions */
    channel.on("ready", function () {
        $("li.variation-list-item.is-active").click();
    });

    channel.on("click", "coral-buttongroup.variations-quick-actions button", function (event) {
        event.stopPropagation();
        var option = $(this).data("action-id"),
            handler = actionHandlers[option];

        if (handler) {
            handler.call(this, event)
        }
    });

    channel.on("click", "#AddVariation", function (event) {
        event.preventDefault();

        var variationData = _getActiveVariationData();
        var dialogPath = "/libs/cq/experience-fragments/content/dialogs/createvariation.html"
            + "/libs/cq/experience-fragments/content/dialogs/createvariation/creator";
        var data = {
            "parentPath": variationData["parentPath"],
            "currentPageTitle": variationData["variationTitle"],
            "selectedVariation":variationData["variationPath"]
        };

        openVariationCreationDialog(dialogPath, data);
    });


    channel.on("foundation-form-submitted", function (e) {
        var status = arguments[1];
        if (!status) {
            return;
        }

        var $form = $(e.target);
        var formId = $form.attr("id");
        var xhr = arguments[2];

        var responseData = {};

        var handleJsonResponse = function () {
            var responseJson = xhr.responseJSON;
            var createdVariationPath = responseJson["variationPath"],
                createdVariationTitle = responseJson["variationTitle"];

            return {
                variationPath: createdVariationPath,
                variationTitle: createdVariationTitle
            }
        };

        var handleHtmlResponse = function () {
            var responseHtml = $(xhr.responseText)
            var createdVariationPath = responseHtml.find("#Location").text();

            return {
                variationPath: createdVariationPath,
                variationTitle: undefined
            }
        }

        if (typeof xhr.responseJSON !== "undefined") {
            responseData = handleJsonResponse();
        } else {
            responseData = handleHtmlResponse();
        }

        var variationTitle = responseData["variationTitle"],
            variationPath = responseData["variationPath"];

        if (typeof variationTitle === "undefined") {
            $.get(variationPath + "/jcr:content.json")
                .done(function (response) {
                    var variationTitle = response["jcr:title"];
                    addVariationToList(variationPath, variationTitle);

                    var ui = $(window).adaptTo("foundation-ui");
                    ui.notify(null, Granite.I18n.get("A new variation has been created: {0}", [variationTitle]), "success");
                });
        } else {
            addVariationToList(variationPath, variationTitle);

            var ui = $(window).adaptTo("foundation-ui");
            ui.notify(null, Granite.I18n.get("A new variation has been created: {0}", [variationTitle]), "success");
        }
    });

    channel.on("click", "#AddLcVariation", function (event) {

        var variationData = _getActiveVariationData();

        var dialogPath = "/libs/cq/experience-fragments/content/dialogs/createlivecopy.html"
            + "/libs/cq/experience-fragments/content/dialogs/createlivecopy/creator";

        var data = {
            "parentPath": variationData["parentPath"],
            "currentPageTitle": variationData["variationTitle"],
            "selectedVariation":variationData["variationPath"],
            "formAction": "/bin/wcmcommand"
        };

        openVariationCreationDialog(dialogPath, data);
    })

})(Granite.$, Granite.author, Granite.$(document));