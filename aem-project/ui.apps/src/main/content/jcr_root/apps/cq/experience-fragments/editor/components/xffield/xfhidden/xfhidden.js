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
"use strict";
use(function() {
    var xfType = properties.get("xfType", "variant");
    var filter = request.getParameter("filter");
    var show = false;
    if (filter) {
        filter = filter.toLocaleLowerCase();
        if (filter.indexOf(xfType) != -1) {
            show = true;
        }
        if (xfType == "variant") {
            var variant = request.getParameter("variant");
            var xfVariant = properties.get("variant", "none");
            if (xfVariant == "none") {
                xfVariant = null;
            }
            if (variant && xfVariant) {
                if (xfVariant == "web") {
                    show = variant == "web";
                } else if (xfVariant == "pos") {
                    show = variant == "pos";
                } else if (xfVariant == "facebook") {
                    show = variant == "sm" || variant == "facebook";
                } else if (xfVariant == "pinterest") {
                    show = variant == "sm" || variant == "pinterest";
                }
            }
        }
    }

    if (show) {
        var superType = "granite/ui/components/coral/foundation/form/hidden";
        var wrapper = new Packages.com.adobe.granite.ui.components.ValueMapResourceWrapper(resource, superType);
        var wrapperProperties = wrapper.adaptTo(Packages.org.apache.sling.api.resource.ValueMap);
        wrapperProperties.putAll(properties);
        sling.include(wrapper);
    }
});