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


;(function ($, ns) {

    "use strict";

    var _author = Granite.author;

    ns.convertToXf = function () {
        var dialogUrl = Granite.HTTP.externalize("/libs/cq/experience-fragments/content/conversion.html/libs/cq/experience-fragments/content/conversion/converter"),
            dlg = new _author.ui.Dialog({
                getConfig: function () {
                    return {
                        src: dialogUrl,
                        loadingMode: "auto",
                        layout: "auto"
                    }
                },
                getRequestData: function() {
                    return {
                        currentPage: _author.ContentFrame.contentURL,
                        componentPaths:_author.selection.selected.map(function(e) { return e.path}).join("#"),
                        referrer:_author.ContentFrame.getContentPath()
                    }
                },
                onSuccess: function() {
                    _author.ContentFrame.reload();
                },
                onReady: function(){
                    var $dialog = _author.DialogFrame.currentFloatingDialog;
                    var componentPaths = _author.selection.selected.map(function(e) { return e.path});
                    var $form = $dialog.find("form");

                    $.each(componentPaths, function(idx, value) {
                       $form.append("<input type='hidden' value='"+value+"' name='componentPath'/>");
                    });

                    CQ.XF.adjustRequiredFields($form);
                }
            });

        _author.DialogFrame.openDialog(dlg);
    };

})(jQuery, CQ.XF);