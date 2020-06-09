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
    var item = request.adaptTo(Packages.com.adobe.cq.xf.ui.ExperienceFragmentConsoleItem);
    var filter = request.getParameter("filter");

    var variant = !(item.isFolder() || item.isExperienceFragmentRoot());
    var drilldown = item.isFolder() || item.isExperienceFragmentRoot() && (xfds.FILTER_FOLDER_OR_VARIANT == filter
        || xfds.FILTER_FOLDER_OR_XF_OR_VARIANT == filter || !filter);

    var selectable =
        variant && (xfds.FILTER_VARIANT == filter || xfds.FILTER_XF_OR_VARIANT == filter
        || xfds.FILTER_FOLDER_OR_VARIANT == filter || xfds.FILTER_FOLDER_OR_XF_OR_VARIANT == filter || !filter)
        ||
        item.isExperienceFragmentRoot && (xfds.FILTER_XF == filter || xfds.FILTER_XF_OR_VARIANT == filter
        || xfds.FILTER_FOLDER_OR_XF == filter || xfds.FILTER_FOLDER_OR_XF_OR_VARIANT == filter || !filter);


    var navigationHref = !selectable && (item.isFolder() || item.isExperienceFragmentRoot()) ? "#" : null;

    return {
        "drilldown" : drilldown,
        "navigationHref" : navigationHref,
        "selectable" : selectable
    };
});