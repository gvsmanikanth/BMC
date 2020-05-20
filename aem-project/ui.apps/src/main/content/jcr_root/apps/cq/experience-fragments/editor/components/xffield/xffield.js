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
    var xfds = Packages.com.adobe.cq.xf.ui.ExperienceFragmentDatasource;

    var rootPath = properties.get("rootPath");
    if(!rootPath) {
        rootPath = "/content/experience-fragments";
    }
    var filter = properties.get("filter");
    if (!filter) {
        filter = xfds.FILTER_FOLDER_OR_XF_OR_VARIANT;
    }
    var variant = properties.get("variant");
    variant = variant ? "&variant=" + variant : "";
    var multiple = properties.get("multiple");
    if (!multiple) {
        multiple = false;
    }
    var selectionCount = multiple ? "multiple" : "single";
    var pickerSrc = properties.get("pickerSrc");
    if (!pickerSrc) {
        pickerSrc = "/mnt/overlay/cq/experience-fragments/content/xffield/picker.html?root=" + rootPath
                    + "&filter=" + filter + variant + "&selectionCount=" + selectionCount;
    }
    var suggestionFilter = properties.get("suggestionFilter");
    if (!suggestionFilter) {
        if (filter == xfds.FILTER_XF || filter == xfds.FILTER_FOLDER_OR_XF) {
            suggestionFilter = xfds.FILTER_XF;
        } else if (filter == xfds.FILTER_VARIANT || filter == xfds.FILTER_FOLDER_OR_VARIANT) {
            suggestionFilter = xfds.FILTER_VARIANT;
        } else {
            suggestionFilter = xfds.FILTER_XF_OR_VARIANT;
        }
    }
    var suggestionSrc = properties.get("suggestionSrc");
    if (!suggestionSrc) {
        suggestionSrc = "/mnt/overlay/cq/experience-fragments/content/xffield/suggestion{.offset,limit}.html?root="
                        + rootPath + "&filter=" + suggestionFilter + variant + "{&query}";
    }
    var forceSelection = properties.get("forceSelection");
    if (!forceSelection) {
        forceSelection = true;
    }
    var emptyText = properties.get("emptyText");
    if (!emptyText) {
        emptyText = "Experience fragment variation path";
    }

    var xffieldSuperType = "granite/ui/components/coral/foundation/form/pathfield";
    var wrapper = new Packages.com.adobe.granite.ui.components.ValueMapResourceWrapper(resource, xffieldSuperType);
    var wrapperProperties = wrapper.adaptTo(Packages.org.apache.sling.api.resource.ValueMap);
    wrapperProperties.putAll(properties);
    wrapperProperties.put("rootPath", rootPath);
    wrapperProperties.put("filter", filter);
    wrapperProperties.put("multiple", multiple);
    wrapperProperties.put("pickerSrc", pickerSrc);
    wrapperProperties.put("suggestionSrc", suggestionSrc);
    wrapperProperties.put("forceselection", forceSelection);
    wrapperProperties.put("emptyText", emptyText);

    sling.include(wrapper);
});