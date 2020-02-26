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

;(function ($, ns, channel) {

    "use strict";
    var DO_NOT_CONVERT = ["dam/cfm/components","screens/core"];

    var convertAction = new ns.ui.ToolbarAction({
        name: "XFCONVERT",
        icon: "filingCabinet",
        text: Granite.I18n.get("Convert to experience fragment variation"),
        execute: function () {
            CQ.XF.convertToXf();
        },
        condition: function (editable) {
            var isRestricted = DO_NOT_CONVERT.filter(function(type){
                return editable.type.indexOf(type) != -1;
            });
            return isRestricted.length == 0
                && editable.isContainer()
                && !editable.isStructure();
        }
    });

    if (!ns.EditorFrame.editableToolbar) {
        channel.on("cq-layer-activated", function (event) {
            if (event.layer === "Edit") {
                ns.EditorFrame.editableToolbar.registerAction("XFCONVERT", convertAction);
            }
        });
    } else {
        ns.EditorFrame.editableToolbar.registerAction("XFCONVERT", convertAction);
    };
})(jQuery, Granite.author, jQuery(document));

