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

(function ($, ns, channel, window, undefined) {

    var self = {};

    var NAME = "Experience Fragments",
        SEARCH_ROOT = "/content/experience-fragments",
        ASSET_VIEW_SERVLET = "/bin/wcm/contentfinder/experiencefragments/view.html",
        ITEM_RT = "cq/experience-fragments/components/xfpage/editor/card";

    var searchPath = "/content/experience-fragments";

    self.searchRoot = SEARCH_ROOT;

    self.loadAssets = function (query, lowerLimit, upperLimit) {

        var currentEditedPath, currentEditedPage = $("iframe#ContentFrame").attr("src");
        if (currentEditedPage) {
            currentEditedPath = currentEditedPage.replace(".html", "")
        }
        var param = {
            "_dc": new Date().getTime(),
            "query": query,
            "excludedPath": currentEditedPath,
            "itemResourceType": ITEM_RT,
            "limit": lowerLimit + ".." + upperLimit,
            "_charset_": "uft-8"
        };

        return $.ajax({
            type: "GET",
            dataType: "html",
            url: Granite.HTTP.externalize(ASSET_VIEW_SERVLET) + searchPath,
            data: param
        });
    };

    self.setSearchPath = function (path) {
        if (path) {
            searchPath = path.replace(/\/$/, ""); // Strip trailing slash
        }
    };

    self.setItemResourceType = function (resourceType) {
        ITEM_RT = resourceType;
    };

    self.resetSearchPath = function () {
        searchPath = this.searchRoot;
    };


    ns.ui.assetFinder.register(NAME, self);


})(jQuery, Granite.author, jQuery(document), this);