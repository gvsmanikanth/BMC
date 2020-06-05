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
(function ($, ns, channel, window, undefined) {

    var isDebugEnabled = window.location.href.indexOf("debug-xf=1") != -1;

    function _debug(arguments) {
        if (isDebugEnabled) {
            console.log(arguments);
        }
    }

    // this name must match the /etc/designs/.../jcr:content/(page_resource_type)/par/cq:authoring/assetToComponentMapping/experiencefragment/type property
    var XF_CONTROLLER_NAME = "experiencefragment";

    // alias everything!
    var assetDnd = ns.ui.assetFinder.AssetDragAndDrop,
        dropController = ns.ui.dropController;


    var XfDragAndDrop = ns.util.extendClass(assetDnd, {
       constructor: function() {
           assetDnd.constructor.apply(this, arguments);
       }
    });

    XfDragAndDrop.prototype.getTypeName = function() {
        return XF_CONTROLLER_NAME;
    };


    // register the controller at the dispatcher
    dropController.register(XF_CONTROLLER_NAME, new XfDragAndDrop());

}(jQuery, Granite.author, jQuery(document), this));
