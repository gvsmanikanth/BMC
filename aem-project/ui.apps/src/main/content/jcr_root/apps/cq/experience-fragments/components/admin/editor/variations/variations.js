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

use(function() {

    var variationsList = [];

    var currentPageUrl = request.requestPathInfo.suffix,
        currentPagePath = currentPageUrl.substring(0, currentPageUrl.indexOf(".html"));
    var pageManager = request.resourceResolver.adaptTo(Packages.com.day.cq.wcm.api.PageManager);

    var currentPage = pageManager.getPage(currentPagePath);

    if (currentPage) {
        var parentPage = currentPage.getParent();
        if (parentPage != null) {
            var variationsIterator = parentPage.listChildren();
            while (variationsIterator.hasNext()) {
                var variation = variationsIterator.next();
                var properties = variation.getProperties();
                var isMaster = properties.get("cq:xfMasterVariation", false);
                var element = {
                    "name": variation.getTitle(),
                    "path": variation.getPath(),
                    "isActive": variation.getPath().equals(currentPagePath),
                    "isMaster": isMaster
                };
                variationsList.push(element);
            }
        }
    } else {
        console.log("No page at " + currentPagePath);
    }

    return variationsList
});
